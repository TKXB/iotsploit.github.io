---
title: BLE advertisement discovery
description: Use an Ubertooth One hardware device to scan for Bluetooth Low Energy advertisements on advertising channels 37, 38, and 39.
---

The **Ubertooth BLE Scan** tool uses an Ubertooth One hardware dongle connected to the IoTSploit server to capture Bluetooth Low Energy (BLE) advertisements. It sends HTTP commands to the API server, which drives the Ubertooth.

:::caution[Regulatory compliance]
Bluetooth operates in the 2.4 GHz ISM band. Capturing BLE traffic may be subject to radio regulations in your jurisdiction. Use this tool only in authorized testing environments.
:::

## Before you start

- **Platform**: All platforms, including web.
- **Build**: Available in production and development flavors. Marked `offlineCapable: false` — it requires a connection to the IoTSploit API server.
- **Server**: Required. The Ubertooth One must be physically connected to the server host, and the Ubertooth driver must be installed.
- **Hardware**: An Ubertooth One USB dongle. The tool discovers it automatically on screen load.

## Open Ubertooth BLE Scan

1. Open the IoTSploit application.
2. Select **Toolkit** in the side menu.
3. Find the **Ubertooth BLE/BT** card (description: "Bluetooth analysis with Ubertooth One") and tap it.

The screen title is **Ubertooth BLE Scan**. The top card shows the device status and scan controls. Below it, a list of discovered BLE devices appears.

## Device discovery

On screen load, the tool automatically scans for Ubertooth devices:

| Step | Method | Endpoint |
|---|---|---|
| 1 | GET | `/api/scan_device/<driver>/` |
| 2 | Parse | Take the first device from `body['devices']` |
| 3 | Display | `Device: <device_id>` or `Device: 未发现` (not found) |

If no device is found, the status text reads `Device: 未发现`. Press the **Scan Device** button to retry discovery after plugging in the dongle.

### Device not found

Common causes:

- The Ubertooth One is not plugged into the server host.
- The server host does not have USB permissions for the device.
- The Ubertooth driver is not installed on the server.
- The device is in use by another process.

The error from the server is displayed in the error state widget with a retry button.

## Scan controls

| Control | Label | Default | Options |
|---|---|---|---|
| Timeout | Timeout | `10` | Any positive integer (seconds) |
| Channel | Ch 37 | `37` | Ch 37, Ch 38, Ch 39 |
| Scan Device button | Scan Device | — | Re-runs device discovery |
| BLE Scan button | BLE Scan | — | Runs the BLE advertisement scan |
| Device Info button | Device Info | — | Shows raw device info as JSON |

### Channel

BLE devices advertise on three dedicated channels: 37, 38, and 39. The Ubertooth captures advertisements on one channel at a time. The default is channel 37. To cover all advertising channels, run the scan three times with each channel selected.

### Timeout

How long the scan runs. The default is 10 seconds. The scan is a synchronous HTTP call — the UI shows a loading indicator until the server responds with the collected results.

## Run a BLE scan

1. Verify the device status shows a valid device ID (not `未发现`).
2. Set the timeout (default 10 seconds is adequate for most environments).
3. Select an advertising channel (Ch 37, 38, or 39).
4. Press **BLE Scan**.

The tool sends:

```
POST /api/execute_device_command/<driver>/
{
  "command": "ble_scan",
  "device_id": "<device_id>",
  "args": {
    "timeout": 10,
    "channel": 37
  }
}
```

While scanning, the list area shows a loading indicator with the text `正在执行 BLE 扫描...`. After the scan completes, discovered devices appear as cards.

### Response format

The server returns:

```json
{
  "status": "success",
  "result": {
    "devices": [
      {
        "mac": "AA:BB:CC:DD:EE:FF",
        "company": "Apple, Inc.",
        "adv_type": "ADV_IND",
        "rssi": -67
      }
    ]
  }
}
```

Each device entry contains:

| Field | Type | Description |
|---|---|---|
| mac | String | BLE MAC address |
| company | String (optional) | OUI-based company identification |
| adv_type | String (optional) | Advertisement type (e.g. `ADV_IND`, `ADV_NONCONN_IND`) |
| rssi | Number | Received signal strength in dBm |

## Results

Each discovered device appears as a card with:

- A Bluetooth icon.
- The MAC address in bold.
- A subtitle line: `RSSI: <value> dBm   Company: <value>   Type: <value>`.

Company and Type fields are shown only when present in the response data. If a field is empty or null, it is omitted from the subtitle.

### Empty results

If no BLE devices were captured, an empty state widget appears:

- Title: `暂无 BLE 设备` (No BLE devices)
- Subtitle: `点击上方按钮开始扫描` (Click the button above to start scanning)
- Action button: `开始扫描` (Start scan)

This state also appears when the screen is first loaded before any scan has been run.

## Device info

Press **Device Info** to query the Ubertooth for its hardware and firmware details. The tool sends:

```
POST /api/execute_device_command/<driver>/
{
  "command": "get_info",
  "device_id": "<device_id>",
  "args": {}
}
```

The raw JSON response is displayed in a dialog titled `Ubertooth 设备信息` (Ubertooth Device Info). The dialog contains a scrollable, selectable text area with indented JSON. Press **关闭** (Close) to dismiss.

## Limitations

- **Single device.** The tool takes only the first device from the discovery response. If multiple Ubertooth devices are connected, the others are ignored.
- **One channel at a time.** The Ubertooth captures on one advertising channel per scan. To cover all three, run three separate scans.
- **No real-time streaming.** Results are delivered as a batch after the timeout expires. There is no live feed of advertisements.
- **No PCAP export.** The tool displays device summaries only. Raw capture data (pcap) is not available from this screen.
- **No follow-up actions.** Discovered devices cannot be selected for further analysis, connection, or pairing from this screen.
- **Server dependency.** The Ubertooth must be connected to the server host, not the device running the UI. The tool cannot operate without the API server.
- **Chinese UI labels.** Several labels (正在扫描, 未发现, 暂无 BLE 设备) are hardcoded Chinese strings. The screen title and button labels are in English.
- **No MAC filter.** All discovered devices are shown. There is no filter by MAC, company, or RSSI threshold.
- **No retry on scan failure.** If the BLE scan fails, the error is shown in the error state widget. You must press BLE Scan again manually.
- **Hardware-specific.** This tool only works with Ubertooth One. Other BLE capture hardware is not supported.

## Troubleshooting

### Ubertooth BLE/BT card not visible on the Toolkit page

This tool does not require Rust and should be visible on all builds. If it is not visible, check the flavor configuration — it is not offline-capable, so it may be hidden in offline flavor.

### `Device: 未发现`

No Ubertooth device was found on the server. Verify:

- The Ubertooth One is plugged into the server host via USB.
- The server has USB permissions (on Linux, the user running the server may need udev rules for the Ubertooth vendor/product ID).
- The Ubertooth driver is installed and loaded on the server.
- No other process is using the device.

Press **Scan Device** to retry discovery.

### `扫描设备失败` (Device scan failed)

The device discovery request returned an error. The full error message is shown in the error state widget. Check the server logs for details.

### `BLE 扫描失败` (BLE scan failed)

The BLE scan request returned an error. The server may not have firmware loaded for the Ubertooth, the device may have been disconnected, or the channel/timeout arguments may be invalid. Check the server logs.

### No BLE devices found after scanning

The scan completed but captured no advertisements. This is normal in environments with no BLE traffic on the selected channel. Try:

- A longer timeout.
- A different channel (37, 38, or 39).
- Moving closer to active BLE devices.
- Verifying that BLE devices in the area are actively advertising.

### Device Info dialog shows empty or partial data

The `get_info` command returned limited information. This may indicate the Ubertooth firmware is not fully loaded or the device is in an unexpected state. Try unplugging and re-plugging the device, then press **Scan Device**.

## Recommended workflow

1. Plug the Ubertooth One into the IoTSploit server host.
2. Open **Toolkit** and select **Ubertooth BLE/BT**.
3. Wait for automatic device discovery. Verify the device ID appears.
4. If no device is found, press **Scan Device**.
5. Set the timeout (10 seconds is a good starting point).
6. Select an advertising channel (start with Ch 37).
7. Press **BLE Scan** and wait for results.
8. Review the discovered devices — MAC addresses, RSSI, company, and advertisement type.
9. Repeat with Ch 38 and Ch 39 to cover all advertising channels.
10. Press **Device Info** if you need hardware or firmware details.

For SCPI instrument control, continue to [USBTMC device control](/blog/en/manual/usbtmc-device-control/).
