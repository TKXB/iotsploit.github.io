---
title: Manage targets and hardware drivers
description: Create, edit, select, and delete test targets; discover drivers, enable or disable them, and run advertised device commands.
---

The **Targets** page is where you define what you are testing. The **Drivers** page is where you manage the hardware interfaces the backend uses to talk to real devices. Both pages send requests to the same API server that the Control Panel uses — neither page runs anything locally.

This guide documents both pages in the production build. It covers target CRUD operations, the target edit dialog with its four tabs, driver discovery and enable/disable, advertised device commands, and command result presentation.

:::caution[Use only with authorization]
Device commands sent through the Drivers page can interact with real hardware — reading chip IDs, scanning buses, or sending control frames. Running these commands against hardware you do not own or are not authorized to test can damage equipment or violate law. Enable drivers and execute commands only in an authorized lab environment.
:::

## Before you start

- **Build**: Production or development. The offline build does not include Targets or Drivers.
- **Server**: A reachable API server. If the server is down, both pages show loading errors. Configure the server first following [server and build setup](/blog/en/manual/server-and-build-setup/).
- **Targets page**: Requires `GET /api/list_targets/` to succeed. Target creation requires `POST /api/create_target/`.
- **Drivers page**: Requires `GET /api/list_device_drivers/` and `GET /api/get_driver_states/` to succeed. Command execution requires the backend to have the named driver installed and a compatible device connected.

## Target, driver, and device

| Concept | What it is | Where it lives |
|---|---|---|
| Target | A record describing the system under test — name, type, IP, components, interfaces | Backend database (via API) |
| Driver | A hardware interface module on the backend — e.g. a CAN adapter, Ubertooth, or ADB bridge | Backend process |
| Device | A physical unit connected to a driver — detected by scanning the driver | Physical hardware |

A target tells the backend *what* you are testing. A driver tells the backend *how* to reach it. You select a target in the Control Panel before running plugins; you enable a driver on the Drivers page or from the Control Panel's device panel.

## Open the Targets page

1. Open the IoTSploit application.
2. Select **Targets** in the side menu.

The page loads targets from `GET /api/list_targets/` on open. On desktop it renders a table; on mobile it renders a card grid.

### Table columns

| Column | Content |
|---|---|
| Name | Target name |
| Type | Type chip (Vehicle, ECU, Phone, IoT, Router, Camera, Generic) |
| Status | Active or Inactive pill |
| Components | Count of registered components |
| Interfaces | Count of registered interfaces |
| IP | IP address (monospace) |
| Location | Free-text location |
| Actions | Details, Edit, Delete |

A search box filters by name, type, or IP address. Two dropdowns filter by type and status. The **Add New Target** button opens the edit dialog in create mode.

## Create a target

Press **Add New Target**. The application generates a temporary ID (`target_<timestamp>`) and opens the edit dialog with empty fields. Fill in the required fields and press **Save Changes**. The application sends `POST /api/create_target/` with the full target object. On success it shows `Target created successfully` and refreshes the list.

The **name** field is required. If you save with an empty name, the application shows `Target name is required` and does not send the request.

## Edit a target

Press the edit icon (pencil) on a target row. The edit dialog opens with the target's current data. After modifying fields, press **Save Changes**. The application sends `POST /api/edit_target/` with `{"target_id": "<id>", "updates": {...}}`. On success it shows `Target updated successfully` and refreshes the list.

## The target edit dialog

The dialog has four tabs.

### Basic Info

| Field | Input | Notes |
|---|---|---|
| Target Name | Text | Required |
| Target Type | Dropdown | Values fetched from `GET /api/get_target_types/`; defaults are `generic` and `vehicle` |
| Status | Dropdown | `active` or `inactive` |
| IP Address | Text | Optional |
| Location | Text | Optional |

### Properties

A free-form key-value map. You can add, edit, and delete properties. Each property has a name (key) and a value (string). The name is required.

### Components

A list of hardware components attached to the target. Each component has:

- Component ID (required)
- Component Name (required)
- Component Type (dropdown, fetched from `GET /api/get_component_types/`; defaults: `generic`, `adb_device`, `camera`, `sensor`, `network`, `ecu`, `infotainment`)
- Status (free text, defaults to `active`)
- Properties (sub-editor with the same key-value pattern as the Properties tab)

When the component type is `adb_device` or `infotainment`, three additional fields appear:

- ADB Serial ID (optional)
- USB Vendor ID (optional)
- USB Product ID (optional)

### Interfaces

A list of network or debug interfaces. Each interface has:

- Interface ID
- Interface Name
- Interface Type (free text — e.g. `diagnostic`, `usb`, `network`, `bluetooth`)
- Status

## Select a target

Tap a target row (or a target card on mobile). The application sends `POST /api/select_target/` with `{"target_id": "<id>"}`. On success it shows `Target selected successfully` and highlights the row.

The selected target is the one the Control Panel uses for plugin execution. Selecting a target here and selecting one in the Control Panel do the same thing — both call the same endpoint.

## Delete a target

Press the delete icon (trash) on a target row. A confirmation dialog appears:

> Delete Target
>
> Are you sure you want to delete this target? This action cannot be undone.
>
> "<target name>"

Press **Delete** to confirm. The application sends `POST /api/delete_target/` with `{"target_id": "<id>"}`. On success it shows `Target deleted successfully` and refreshes the list.

## Open the Drivers page

1. Select **Drivers** in the side menu.

The page loads two things on open:

- `GET /api/get_driver_states/` — which drivers are enabled or disabled.
- `GET /api/list_device_drivers/` — the list of available driver names.

Then for each driver it loads:

- `GET /api/list_device_commands/<driver_id>/` — the commands that driver advertises.
- `GET /api/scan_device/<driver_id>/` — the count of connected devices.

### Table columns

| Column | Content |
|---|---|
| Driver ID | Driver name (identifier) |
| Name | Same as Driver ID |
| Driver Type | Type label (defaults to `Unknown` if the backend does not provide one) |
| Connected Devices | Clickable count; opens a details dialog |
| Status | Toggle switch — `Enabled` or `Disabled` |
| Actions | Command buttons advertised by the driver |

## Enable and disable drivers

The Status column has a toggle switch. Flipping it sends:

- Enable: `POST /api/enable_driver/` with `{"driver_name": "<name>", "description": "Changed from UI"}`
- Disable: `POST /api/disable_driver/` with the same body

On success the switch updates and a toast reads `Driver <name> enabled successfully` or `Driver <name> disabled successfully`. The device list reloads after each toggle.

Disabled drivers cannot execute commands — command buttons are greyed out and non-interactive.

## Run a device command

Each driver advertises a set of commands fetched from `GET /api/list_device_commands/<driver_id>/`. Commands appear as buttons in the Actions column. If a driver has more than two commands, the first two show as buttons and the rest are in a **More** dropdown.

Pressing a command button triggers this flow:

1. The application calls `GET /api/scan_device/<driver_id>/` to list connected devices.
2. If no devices are found, it shows `No hardware devices available`.
3. If devices are found, a **Select Hardware Device** dialog lists them with their attributes (e.g. serial number, vendor ID, product ID).
4. Select a device and press **Select**.
5. The application sends `POST /api/execute_device_command/<driver_id>/` with `{"command": "<command>", "device_id": "<selected_device_id>"}`.
6. The result appears in a dialog titled `Result from '<command>'` showing the raw text returned by the backend.

:::caution[Hardware commands can be destructive]
Device commands depend entirely on what the backend driver supports. Some commands read information (chip ID, device info); others may send control frames, reset devices, or modify state. Read the command description (shown as a tooltip on the button) before pressing it. Test on expendable lab hardware first.
:::

## View connected devices

Click the number in the **Connected Devices** column. The application calls `GET /api/scan_device/<driver_id>/` and opens a dialog titled `Connected Devices - <driver_id>` listing each device with its name and attributes.

If no devices are connected, the toast reads `No devices connected to this driver`.

## Troubleshooting

### Targets page shows "No Targets Yet"

No targets have been created on the backend. Press **Add Your First Target** to create one.

### `Target name is required`

You pressed Save Changes in the edit dialog with an empty name field. Fill in the Target Name field and save again.

### `Error creating target: <error>` / `Error updating target: <error>`

The create or edit request failed. The backend may have rejected the data (e.g. invalid IP format, duplicate ID). Check the System log tab in the Control Panel for the server-side error message.

### `Error deleting target: <error>`

The delete request failed. The target may have been removed by another session, or the backend returned an error. Refresh the list and try again.

### Drivers page shows "No drivers found"

The backend returned an empty driver list, or the request failed. If the page shows an error state, press **Retry** to reload. If the list is empty after loading, the backend has no hardware drivers configured.

### `Failed to update driver state: <message>`

The enable/disable request was rejected. The backend message explains why. The driver name may be invalid, or the backend may not support runtime toggling of that driver.

### `No hardware devices available`

You pressed a command button, but the device scan found no connected hardware. Check the physical connection, verify the driver is enabled, and confirm the hardware is powered.

### `Failed to execute command <command>`

The `POST /api/execute_device_command/` request returned a non-200 status. The backend may have encountered an error executing the command against the hardware. Check the System log tab for details.

### Command buttons are greyed out

The driver is disabled. Toggle the Status switch to enable it. If the toggle fails, check the backend error message.

## Recommended workflow

1. Open **Targets** and press **Add New Target**.
2. Fill in the name, type, status, IP address, and location. Add components and interfaces as needed.
3. Save the target. Confirm it appears in the list.
4. Tap the target row to select it. Confirm `Target selected successfully`.
5. Open **Drivers** and verify the hardware drivers you need are listed and enabled.
6. If a driver is disabled, toggle it on.
7. Click the Connected Devices count to verify the hardware is detected.
8. If the driver advertises commands, read the tooltips and run a read-only command first to confirm the hardware responds.
9. Open **Control Panel** and run a plugin against the selected target. Follow the [Control Panel workflow](/blog/en/manual/control-panel-workflow/).

For the plugin catalogue and test results pages, continue to [plugins and test results](/blog/en/manual/plugins-and-test-results/).
