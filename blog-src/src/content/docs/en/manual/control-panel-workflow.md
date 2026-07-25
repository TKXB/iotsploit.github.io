---
title: Run an authorized test from Control Panel
description: Select a target, manage drivers, execute a plugin, and read execution and system logs in the Control Panel.
---

The Control Panel is where you run an authorized plugin test against a selected target. It puts the target inventory, the plugin catalogue, a streaming execution terminal, and backend server logs on one screen. You pick a target, choose a plugin, press Execute, and read the result as it arrives — sync or streamed over WebSocket.

This guide documents every label and behavior in the production build. It covers the initial data load, target and device selection, driver management, plugin parameter prompts, sync and async execution, the two log tabs, and the boundary where the application stops and expert analysis begins.

:::caution[Use only with authorization]
Plugin execution sends commands to the configured backend, which may interact with real devices, networks, or firmware. Running a plugin against a system you do not own or are not authorized to test can be illegal. Define a lab scope and permission boundary before pressing Execute.
:::

## Open the Control Panel

1. Open the IoTSploit application (production build).
2. Select **Control Panel** in the side menu.

The Control Panel uses a three-column layout on wide screens (980 px or wider):

- **Left column** — Asset inventory: targets and connected hardware devices, searchable.
- **Center column** — Plugin table on top, log terminal below.
- **Right column** — Details panel for the selected asset.

On narrower screens the columns stack vertically.

## Before you start

- **Build**: Production or development build. The offline build does not include the Control Panel.
- **Server**: A reachable API server and WebSocket server. If the server is not configured, the Control Panel shows a connection error banner. Configure the server first following [server and build setup](/blog/en/manual/server-and-build-setup/).
- **Target**: At least one target must exist and be selectable before you can execute a plugin. Create targets in the **Targets** page first.
- **Driver** (optional): If the plugin needs a hardware driver, the driver must be enabled and a device must be connected.

## Initial data load

When the Control Panel opens, it loads three data sets in parallel:

1. **Plugins** — `GET /api/list_plugin_info/` returns the plugin catalogue. Each plugin has a name, version, author, description, an optional parameters map, and a load status.
2. **Targets** — `GET /api/list_targets/` returns the target inventory. Each target has an ID, name, type, IP address, status, location, protocols, and component/interface counts.
3. **Devices** — loaded in three steps:
   - `GET /api/get_driver_states/` returns which hardware drivers are enabled or disabled.
   - `GET /api/list_device_drivers/` returns the list of available driver names.
   - For each driver, `GET /api/scan_device/<driver>/` scans for connected devices. Only drivers with at least one connected device appear in the left panel.

If any of these requests fail, a banner appears at the top: `Unable to connect to backend at <host>`. The banner offers a **Retry** button (reloads all data) and an **API Settings** button (jumps to the Settings page).

The first target in the list is auto-selected on initial load. You can change the selection by tapping a different target.

## Select a target

Tapping a target in the left panel sends `POST /api/select_target/` with a JSON body `{"target_id": "<id>"}`. The selected target is marked with a `TARGET` badge in the asset list and a `SELECTED FOR RUN` chip in the details panel.

A target must be selected before you can execute a plugin. The **Execute** button on every plugin row is disabled until a target is selected. If you press Execute without a target, the application shows the toast `Select a target first`.

If the selection request fails, the application shows the toast `Failed to select target`. The plugin runner remains disabled until a target is successfully selected.

## Select a device and manage drivers

Tapping a hardware device in the left panel opens its details in the right column. The details show the driver ID, type, status (`ENABLED` or `DISABLED`), and connected device count.

The details panel has two action buttons:

- **Enable driver** — sends `POST /api/enable_driver/` with `{"driver_name": "<name>", "description": "Changed from Control Panel"}`.
- **Disable driver** — sends `POST /api/disable_driver/` with the same body.

On success, the driver state updates and the toast reads `Driver <name> enabled` or `Driver <name> disabled`. On failure, the toast reads `Failed to update driver` or `Error updating driver: <error>`.

Driver state matters when a plugin requires a specific hardware interface. A disabled driver may cause the plugin to fail at runtime even though it appeared to start successfully.

## Choose and execute a plugin

The center column shows the plugin table with columns: **PLUGIN NAME**, **VERSION**, **AUTHOR**, **DESCRIPTION**, and **ACTIONS**. A search box above the table filters plugins by name, description, or author.

### Plugin row states

| Visual element | Meaning |
|---|---|
| Amber dot + `Running` label | Plugin is currently executing |
| Green dot + `Completed` label | Plugin finished successfully |
| Red dot + `Failed` label | Plugin finished with an error |
| `Plugin failed to load — cannot execute` | The plugin reported a load error; Execute is disabled |
| `Execute` button (dimmed) | No target selected, another plugin is running, or plugin failed to load |
| `Stop` button (red) | Plugin is running; press to abort |

Only one plugin can run at a time. While a plugin is running, all other **Execute** buttons are disabled.

### Parameter prompt

If a plugin declares parameters (a non-empty `Parameters` map in its info), pressing **Execute** opens a dialog before starting:

- **Title**: `Enter Parameters`
- **Message**: `Provide the required parameters for this plugin.`
- Each parameter becomes a text field with the parameter key as the label, the parameter description as the hint, and the default value pre-filled.
- Parameters declared as `int` type use a numeric keyboard.
- **Execute** confirms and proceeds. **Cancel** aborts without starting the plugin.

If the plugin has no parameters, execution starts immediately.

### Execution start

When execution starts, the terminal clears and prints the first line:

```text
$ execute_plugin <plugin_name> --target <target_id>
```

The application sends `POST /api/execute_plugin/` with a JSON body containing the plugin name and, if applicable, the parameter values. The response envelope includes a `status` field and an `execution_type`:

- **`sync`** — the result is returned inline.
- **`async`** — a `task_id` is returned and progress streams over a WebSocket.

## Sync execution

When the backend returns a synchronous result, the terminal prints one of:

```text
[ OK ] <message>
[FAIL] <message>
```

Each key-value pair in the result `data` map is printed as an indented line:

```text
  <key>: <value>
```

The plugin row updates to `Completed` (green) or `Failed` (red) with the result message.

## Async execution and WebSocket progress

When the backend starts an async task, the terminal prints:

```text
[INFO] task <task_id> started — streaming…
```

The application connects to `ws://<ws_base_url>/ws/exploit/<task_id>/` (scheme normalized to `wss` if the API uses HTTPS). Each WebSocket frame is a JSON object with one or both of:

- `message` — a progress update. The terminal prints `[INFO] <message>` and the status message updates.
- `status` set to `"complete"` with a `result` object — the final result. The terminal prints `[ OK ] <message>` or `[FAIL] <message>`, followed by each `data` key-value pair. The WebSocket is then closed.

If the WebSocket connection errors, the terminal prints `[FAIL] connection error: <error>` and the plugin is marked failed. If the socket closes without a completion frame, the plugin is marked failed with the message `Connection closed`.

## Stop a running plugin

Press **Stop** to abort a running plugin. The application closes the WebSocket channel, marks the plugin as `Failed` with the message `Stopped by operator`, and prints `[WARN] run stopped by operator` in the terminal.

Stopping does not send a cancel request to the backend. The backend task may continue running after the UI reports it as stopped.

## Execution states

| State | Color | Label | Progress bar | Notes |
|---|---|---|---|---|
| Running | Amber | `Running` | Indeterminate animation | Elapsed time counter (mm:ss) updates every 300 ms |
| Completed | Green | `Completed: <message>` | Full bar | Result saved to test results |
| Failed | Red | `Failed: <message>` | Full bar | Result saved to test results |

Both completed and failed results are persisted to the shared test-results store (SharedPreferences, key `plugin_test_results`). Each saved result includes a UUID, the plugin name, timestamp, success flag, message, data map, target ID, and target name. Results are viewable in the **Test Results** page.

## Execution log vs. System log

The terminal area has two tabs: **Execution** and **System**.

### Execution tab

The Execution tab shows the output of the current plugin run. It is a dark terminal viewport with monospace text. When empty, it shows:

```text
$ waiting — select a target and press Execute on a plugin…
```

Log line types and their colors:

| Level | Color | Meaning |
|---|---|---|
| `info` | Blue | Progress messages from the WebSocket |
| `ok` | Green | Successful completion |
| `warn` | Amber | Operator stop or warning |
| `err` | Red | Error or failure |
| `data` | Dim | Key-value result data |
| `muted` | Faint | Command echo |

The Execution log has **Copy** and **Clear** buttons. Clear is disabled while a plugin is running.

### System tab

The System tab (labeled **Console Logs**) shows backend server logs in real time. It connects to `ws://<ws_base_url>/ws/console_logs/` for live streaming. If the WebSocket is unavailable, it falls back to `GET /api/console_logs/` for historical logs and refreshes every 5 seconds.

The connection status indicator at the bottom shows `Live updates` (connected) or `Periodic refresh` (disconnected). The header shows a Wi-Fi icon that is green when connected and amber when disconnected. If the WebSocket drops, the panel attempts to reconnect after 5 seconds.

Log entries follow the format:

```text
2025-05-02 09:47:26 | INFO | sat_toolkit.tools.env_mgr | Initializing Env_Mgr singleton
```

The System panel provides filters for log level, source, and free-text search, plus **Auto-scroll**, **Clear**, and **Copy** buttons. Clearing sends `POST /api/console_logs/clear/`.

### When to use each

- Use the **Execution** tab to follow a single plugin run from start to finish.
- Use the **System** tab to diagnose backend-side issues — driver errors, plugin load failures, or server exceptions that may not appear in the execution terminal.

## Where the workflow ends

The Control Panel workflow ends when the plugin result is saved to the test-results store. At that point:

1. The plugin row shows `Completed` or `Failed` with the result message.
2. The terminal holds the full execution log until you clear it or start a new run.
3. The result is persisted and viewable in **Test Results**.

What happens next is expert interpretation. The application does not classify findings, assign severity, or recommend remediation. The saved result contains the raw `data` map and a success flag. A human analyst must read the data, correlate it with the System log, and decide what it means for the engagement.

## Troubleshooting

### Connection error banner: `Unable to connect to backend at <host>`

The initial data load failed. Check the API Base URL in Settings, verify the server process is running, and confirm no firewall blocks the port. Press **Retry** to reload, or **API Settings** to correct the address.

### `Select a target first`

You pressed Execute without a target selected. Tap a target in the left panel first. If no targets are listed, create one in the **Targets** page.

### `Failed to select target`

The `POST /api/select_target/` request failed. The target may have been deleted on the backend, or the server returned an error. Refresh the page and try again. If the error persists, check the System log tab for backend-side details.

### `Failed to update driver`

The `POST /api/enable_driver/` or `POST /api/disable_driver/` request failed. The driver name may be invalid, or the backend rejected the operation. Check the System log tab for the server-side error message.

### Plugin shows `Failed` with `Connection closed`

The async WebSocket closed before sending a completion frame. This can happen if the backend task crashed, the network dropped, or the server restarted mid-run. Check the System log tab for backend errors. Retry the plugin if appropriate.

### Plugin shows `Failed` with `Connection error: <error>`

The WebSocket connection itself could not be established or errored during streaming. Verify the WebSocket Base URL in Settings is correct and reachable.

### Plugin is stuck on `Running`

The WebSocket has not sent a completion frame. The backend task may be long-running or hung. Press **Stop** to abort from the UI, then check the System log tab for backend status. Stopping only closes the UI-side WebSocket; the backend task may continue.

## Recommended workflow

1. Confirm the server is reachable in **Settings** → **API Endpoints**.
2. Open **Control Panel** and verify that targets, plugins, and devices load without a connection error banner.
3. Tap a target to select it. Confirm the `SELECTED FOR RUN` chip appears in the details panel.
4. If the plugin needs a hardware driver, tap the device in the left panel and enable the driver in the details panel.
5. Find the plugin in the table, review its description, and press **Execute**.
6. If a parameter dialog appears, fill in the required values and press **Execute**.
7. Watch the **Execution** tab for progress. Switch to the **System** tab if you need backend-side context.
8. When the plugin finishes, read the result message and data in the terminal.
9. Review the saved result in **Test Results** for the permanent record.

For managing targets and drivers outside the Control Panel, continue to [targets and drivers](/blog/en/manual/targets-and-drivers/). For the plugin catalogue and test results pages, continue to [plugins and test results](/blog/en/manual/plugins-and-test-results/).
