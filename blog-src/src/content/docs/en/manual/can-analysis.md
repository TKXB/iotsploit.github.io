---
title: CAN bus frame send and receive
description: Monitor a SocketCAN interface, capture CAN frames in real time, and inject custom packets via the IoTSploit API server.
---

The **CAN Analysis** tool monitors a SocketCAN interface for CAN bus traffic, displays received frames in a table, and lets you inject custom CAN packets. Unlike the Rust-powered tools in the Toolkit, this tool runs entirely in Dart and communicates with the IoTSploit API server over HTTP and WebSocket — no Rust native code is involved. This guide documents the tool at commit `c3f20ff8` (version `0.0.17+17`).

:::caution[Authorization]
CAN bus traffic on vehicles and industrial equipment may be subject to safety regulations and manufacturer warranties. Sending arbitrary frames on a live CAN bus can affect vehicle behavior. Use this tool only on buses you own or are authorized to test, and prefer a bench setup over a live vehicle.
:::

## Before you start

- **Platform**: All platforms, including web. The tool does not depend on Rust native code (`requiresRust: false`).
- **Build**: Available in production and development flavors. Marked `offlineCapable: false` — it requires a connection to the IoTSploit API server.
- **Server**: Required. The API server must be running and accessible. The tool uses HTTP to discover and control devices, and WebSocket to stream CAN frames.
- **CAN hardware**: A SocketCAN-compatible interface must be registered on the server. The tool filters for devices with `device_type == 'CAN'`, `source == 'dynamic'`, and a name starting with `SocketCAN_`.

## Open CAN Analysis

1. Open the IoTSploit application.
2. Select **Toolkit** in the side menu.
3. Find the **CAN Analysis** card (description: "Vehicle network protocol analysis and testing") and tap it.

The screen title is **CAN Bus Monitor**. It has three sections: a control panel at the top, a data table on the left, and a send-packet panel on the right. A status bar sits at the bottom.

## Control panel

| Control | Label | Options / Default | Notes |
|---|---|---|---|
| Device dropdown | 设备选择 | Populated from server | Lists all SocketCAN devices discovered on the server |
| Baud rate dropdown | 波特率 | 125000, 250000, **500000** (default), 1000000 | Sent to the server as a `set_bitrate` command |
| Connect/Disconnect button | 打开端口 / 关闭端口 | Green when disconnected, red when connected | Opens or closes the CAN port |
| Clear button | 清空数据 | — | Clears all received frames from the table |

The UI labels are in Chinese. This is how the screen is implemented — the labels are hardcoded strings, not localization keys. The table columns (序号, ID, 帧计数, 数据长度, 数据) are also in Chinese.

### Device discovery

On screen load, the tool calls `GET /api/list_devices/` on the API server. The response is filtered to devices where:

- `device_type == 'CAN'`
- `source == 'dynamic'`
- `name` starts with `SocketCAN_`

Each device entry extracts `device_id`, `name`, `interface`, and `attributes`. If no devices match, the dropdown is empty — check that your CAN interface is connected to the server and recognized as a SocketCAN device.

### Baud rate

Changing the baud rate while a device is selected sends a `set_bitrate` command to the server immediately. The baud rate should match the bus speed of the target CAN network. Common automotive baud rates are 500 kbps (high-speed CAN) and 125 kbps (CAN-C).

## Connect to the bus

1. Select a device from the dropdown.
2. Choose the baud rate (500000 is the default and most common for high-speed CAN).
3. Press **打开端口** (Open Port).

This sends a `start` command to the server, then opens a WebSocket connection to stream incoming CAN frames. The button turns red and the label changes to **关闭端口** (Close Port).

### How the connection works

| Step | Protocol | Endpoint | Body / Params |
|---|---|---|---|
| 1. Start the CAN port | HTTP POST | `/api/execute_device_command/drv_socketcan/` | `{"command": "start", "device_id": "<id>"}` |
| 2. Open WebSocket stream | WebSocket | `/ws/device/stream/<device_id>/` | — |
| 3. Receive frames | WebSocket (inbound) | — | JSON messages with `action: "data"` |

To disconnect, press **关闭端口**. This closes the WebSocket and sends a `stop` command to the server.

## Received frames table

Incoming CAN frames are displayed in a DataTable with the following columns:

| Column | Label | Content |
|---|---|---|
| Index | 序号 | Row number, starting at 1 |
| ID | ID | CAN identifier (hex string) |
| Frame count | 帧计数 | Number of times this frame has been seen |
| Data length | 数据长度 | DLC value (0–8) |
| Data | 数据 | Payload bytes as a hex string |

New frames are inserted at the top of the table. The list holds a maximum of 100 entries — when the limit is reached, the oldest entry is removed. Press **清空数据** (Clear Data) to empty the table.

### Frame format

Each incoming WebSocket message is a JSON object. The tool checks for `action == "data"` with a non-null `data` field, then parses the `data` sub-object:

```json
{
  "action": "data",
  "data": {
    "id": "7E0",
    "data": "22019F0100000000",
    "dlc": 8
  }
}
```

The `id` and `data` fields are hex strings. The `dlc` is an integer 0–8.

## Send a CAN packet

The right panel (发送数据包) lets you inject a custom CAN frame onto the bus.

### Fields

| Field | Label | Input | Example |
|---|---|---|---|
| CAN ID | CAN ID (hex) | Hex string | `7DF` |
| Data length | 数据长度 (DLC) | Integer 1–8 | `8` |
| Data | 数据 (hex) | Hex string | `0102030405060708` |

### Send

1. Select a device and connect (press **打开端口**).
2. Enter the CAN ID in hex (without `0x` prefix).
3. Enter the DLC (1–8).
4. Enter the data bytes in hex.
5. Press **发送数据包** (Send Packet).

### Validation

| Check | Error |
|---|---|
| No device selected or not connected | `请先连接设备` (Connect device first) |
| ID is empty, data is empty, or DLC < 1 or > 8 | `无效的输入数据` (Invalid input data) |
| DLC is not a valid integer | Unhandled parse exception |

### Message format

The sent message is a JSON object sent over the WebSocket:

```json
{
  "stream_type": "can",
  "channel": "<device_id>",
  "timestamp": 1234567890.123,
  "source": "client",
  "action": "send",
  "data": {
    "id": "7DF",
    "data": "0102030405060708",
    "dlc": 8
  },
  "metadata": {
    "is_extended_id": false,
    "interface": "socketcan"
  }
}
```

The `is_extended_id` field is hardcoded to `false` — only standard 11-bit CAN IDs are supported. The `interface` is always `socketcan`.

After sending, the data field is cleared. The CAN ID and DLC fields are not cleared, so you can send the same frame type repeatedly with different payloads.

## Status bar

The status bar at the bottom shows:

- A link/link-off icon (green when connected, grey when disconnected).
- The text `Connected` or `Disconnected`.
- An error message in red if one occurred.

Errors appear when device loading fails, the connection fails, or a send operation fails. The error text is displayed inline.

## How it works

### API server dependency

The CAN Analysis tool is a pure-Dart screen — it does not call any Rust bridge functions. All CAN operations go through the IoTSploit API server:

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| List devices | GET | `/api/list_devices/` | Discover SocketCAN interfaces |
| Start port | POST | `/api/execute_device_command/drv_socketcan/` | Open the CAN port for streaming |
| Stop port | POST | `/api/execute_device_command/drv_socketcan/` | Close the CAN port |
| Set bitrate | POST | `/api/execute_device_command/drv_socketcan/` | Configure the CAN baud rate |
| Receive frames | WebSocket | `/ws/device/stream/<device_id>/` | Real-time CAN frame stream |
| Send frame | WebSocket | `/ws/device/stream/<device_id>/` | Inject a CAN frame onto the bus |

The `drv_socketcan` driver on the server side handles the actual SocketCAN ioctl calls and socket management.

### Device command API

All device commands use the same endpoint with a JSON body:

```json
{
  "command": "start | stop | set_bitrate",
  "device_id": "<device_id>",
  "args": "<optional, e.g. baud rate>"
}
```

The `args` field is only included when non-empty. For `set_bitrate`, the args value is the baud rate as a string (e.g. `"500000"`).

### WebSocket protocol

The WebSocket connection is bidirectional:

- **Inbound** (server → client): JSON messages with `action: "data"` contain CAN frames. Other action types are ignored.
- **Outbound** (client → server): JSON messages with `action: "send"` inject CAN frames.

The client does not send heartbeats or keepalive messages. If the server closes the WebSocket or an error occurs, the status bar updates to Disconnected.

## Limitations

- **Standard CAN only.** The `is_extended_id` field is hardcoded to `false`. Extended 29-bit CAN IDs are not supported.
- **SocketCAN only.** The tool filters for devices with names starting with `SocketCAN_` and uses the `drv_socketcan` driver. Other CAN interface types are not supported.
- **No frame filtering.** All received frames are displayed. There is no ID filter, mask, or capture buffer. The table holds the last 100 unique frame entries.
- **No logging or export.** Received frames are not saved to a file. Clearing the table or navigating away discards all data.
- **No DBC or decoding.** Raw hex data is displayed. There is no signal decoding, DBC file import, or human-readable interpretation.
- **Server dependency.** The tool cannot operate without the API server. The CAN hardware must be connected to the server, not directly to the device running the UI.
- **Chinese UI labels.** The screen labels (设备选择, 波特率, 打开端口, etc.) are hardcoded Chinese strings. There is no English localization for this screen.
- **No bitrate auto-detection.** You must know the bus baud rate and set it manually. Setting the wrong baud rate will produce garbled data or no data at all.
- **DLC not validated against data length.** The tool checks that DLC is 1–8, but does not verify that the hex data string length matches `DLC * 2` characters. Mismatched values are sent as-is.
- **Single device.** Only one device can be selected at a time. Monitoring multiple CAN buses simultaneously is not supported.

## Troubleshooting

### CAN Analysis card not visible on the Toolkit page

This tool does not require Rust and should be visible on all builds, including web. If it is not visible, check the flavor configuration — it is not offline-capable, so it may be hidden in offline flavor.

### Device dropdown is empty

No SocketCAN devices were found on the server. Verify:

- The CAN interface is physically connected to the server host.
- The kernel recognizes it as a `can` interface (check `ip link` on the server).
- The device is registered with the IoTSploit server and appears in `/api/list_devices/` with `device_type == 'CAN'`, `source == 'dynamic'`, and a name starting with `SocketCAN_`.

### `Connection failed: <error>`

The `start` command returned an error. The server may not have permission to access the CAN interface, the interface may already be in use, or the bitrate may not be supported by the hardware. Check the server logs.

### No frames appear after connecting

The bus may be silent, or the baud rate may be wrong. Try:

- Verifying the baud rate matches the target network.
- Generating traffic on the bus (turn on the ignition, press a button).
- Checking that the CAN interface is on the correct bus segment.

### `请先连接设备`

You tried to send a packet without selecting a device or pressing 打开端口. Select a device and connect first.

### `无效的输入数据`

The CAN ID or data field is empty, or the DLC is outside 1–8. Fill in all fields with valid values.

### WebSocket disconnects immediately

The server may have rejected the WebSocket upgrade, or the device may have been removed between the start command and the WebSocket connection. Retry the connection. If the problem persists, check that the server's WebSocket endpoint is reachable.

## Recommended workflow

1. Connect a SocketCAN-compatible interface to the IoTSploit server host.
2. Verify the device appears in the device dropdown.
3. Select the device and set the correct baud rate.
4. Press **打开端口** to start monitoring.
5. Observe incoming frames in the table. Note the IDs and data patterns.
6. To inject a frame, enter the CAN ID, DLC, and hex data in the send panel, then press **发送数据包**.
7. Press **清空数据** to reset the table when it fills up.
8. Press **关闭端口** when done.

For BLE advertisement discovery, continue to [Ubertooth BLE scan](/blog/en/manual/ubertooth-ble-scan/).
