---
title: From plugin selection to test result
description: Browse the plugin catalogue, execute individual plugins or groups, read execution progress, and review stored test results.
---

The **Plugins** page lists what the backend can run. The **Plugin Groups** page bundles plugins into ordered sequences. The **Test Results** page shows what happened after each execution. This guide walks through all three using the production build at commit `c3f20ff8` (version `0.0.17+17`).

:::caution[Authorization]
Plugins execute against the selected target. If that target is real hardware or a production service, plugin output depends on what the plugin does — it may read data, send frames, or modify state. Run plugins only against targets you are authorized to test.
:::

## Before you start

- **Build**: Production or development. The offline build does not include Plugins.
- **Server**: A reachable API server. Configure it first following [server and build setup](/blog/en/manual/server-and-build-setup/).
- **Target**: A target must be selected before executing a plugin. Select one on the [Targets page](/blog/en/manual/targets-and-drivers/) or from the Target dropdown on the Plugins page.
- **Plugins page**: Requires `GET /api/list_plugin_info/` to succeed.
- **Plugin Groups page**: Requires `GET /api/list_groups/` and `GET /api/list_plugins/` to succeed.
- **Test Results page**: Reads from local device storage. No server connection required to view stored results.

## Open the Plugins page

1. Select **Plugins** in the side menu.

The page calls `GET /api/list_plugin_info/` on open. The response payload has a `status` field of `success` or `partial`; both are accepted. Each plugin is a map containing `name`, `status`, `path`, and an `info` object with `Description`, `Version`, `Author`, and optionally `Parameters`.

### Table columns

| Column | Content |
|---|---|
| Plugin Name | Plugin identifier |
| Version | `info.Version` (defaults to `1.0.0` if absent) |
| Author | `info.Author` (joined with commas if it is a list; `Unknown` if absent) |
| Description | `info.Description` (`No description available` if absent) |
| Actions | Execute / Stop / Details button, Edit button |

A search box filters by name, description, author, or version. On mobile the page switches to a card grid automatically; on desktop you can toggle between table and grid with the view-toggle icon in the control bar.

### The Execute button

The Execute button is enabled only when `plugin['status']` equals `'success'`. If the status is anything else, the button is greyed out and non-interactive. This field comes from the backend's response to `list_plugin_info` — it reflects whether the backend loaded the plugin without errors.

## Execute a plugin

Press **Execute** on a plugin row or card. If the plugin declares `Parameters` in its `info` map, a parameter dialog appears first.

### Parameter dialog

The dialog title is **Enter Parameters**. Each parameter is rendered as a text field:

- The field label is the parameter key name.
- The hint text is the parameter's `description` value.
- The initial value is the parameter's `default` value (as a string).
- If the parameter `type` is `int`, the keyboard is set to numeric input. The submitted value is parsed with `int.tryParse`, falling back to the default if parsing fails.
- For all other types, the value is submitted as a string.

Press **Execute** to confirm, or **Cancel** to abort without executing.

### Synchronous execution

The application sends `POST /api/execute_plugin/` with:

```json
{
  "plugin_name": "<name>",
  "parameters": { "<key>": "<value>" }
}
```

The `parameters` key is omitted when the plugin has no parameters.

If the response `execution_type` is not `"async"`, the plugin ran synchronously. The response `result` map is read inline:

| Field | Source | Fallback |
|---|---|---|
| Success | `result.success` (bool) | `false` |
| Message | `result.message` (string) | `No message provided` |
| Data | `result.data` (map) | `{}` |

On success the application shows a dialog titled **Plugin Executed Successfully**. On failure it shows **Plugin Execution Failed**. Both include the message and, if `data` is non-empty, a `Details:` block listing each key-value pair.

### Asynchronous execution

If the response `execution_type` is `"async"`, the backend started a background task. The response includes a `task_id`. The application connects a WebSocket to `<wsBaseUrl>/ws/exploit/<task_id>/` (scheme normalised to `ws` or `wss`).

Each WebSocket frame is a JSON object. The application reads:

- `message` — updates the execution status text shown on the plugin row.
- `status` — when equal to `"complete"`, the frame's `result` object contains the final outcome.

The `result` object has the same shape as the synchronous result: `status` (`"success"` or not), `message`, and `data`.

On completion:

1. The application saves the result to local storage via `TestResultService.saveTestResult`.
2. A toast appears with a **View Details** action.
3. The execution state is removed from the UI after 10 seconds.

If the WebSocket connection itself fails (not the plugin), the execution state is marked as failed with the message `Failed to connect: <error>`.

### Stop button

While a plugin is running, the Execute button changes to **Stop**. Pressing it calls `_stopAsyncExecution`, which updates the UI state to failed with the message `Stopped by user`. The source code marks this as not yet implemented — there is no backend cancel endpoint, so the backend task continues running. Stopping only changes what the UI shows.

## Execution state indicators

Each plugin row or card shows a colored border and status dot while executing:

| Status | Color | Icon | Text |
|---|---|---|---|
| Running | Orange | `play_circle` or spinner | `Running...` / `Running asynchronously...` |
| Completed | Green | `check_circle` | `Completed` |
| Failed | Red | `error` | `Failed` |

The duration (seconds between `startTime` and `endTime`) is shown in grid view while executing.

## Edit plugin source

Press the edit icon (pencil) on a plugin row. The application opens a full-screen code editor.

The editor uses `flutter_code_editor` with Python syntax highlighting. It loads the plugin source from `POST /api/get_plugin_code/` with `{"plugin_path": "<relative_path>"}`. The path is resolved by stripping the `file://` prefix and extracting the portion starting from `plugins/`.

Press the save icon (or the floating action button) to send `POST /api/save_plugin_code/` with `{"plugin_path": "<relative_path>", "code": "<source>"}`. On success a toast reads `Plugin saved successfully` and the parent page refreshes its plugin list.

The app bar shows `Editing: <plugin_name>` with the filename as subtitle. A reload icon discards local changes and re-fetches from the backend.

## Plugin Groups

Select **Plugin Groups** in the side menu.

The page loads two things on open:

- `GET /api/list_groups/` — existing groups (returned as a tree with `child_groups`).
- `GET /api/list_plugins/` — plugin names available for selection when creating a group.

### Group structure

A group has:

| Field | Type | Notes |
|---|---|---|
| name | string | Group identifier |
| description | string | Free text |
| enabled | bool | Whether the group can be executed |
| plugins | list | Plugins in this group |
| childGroups | list | Nested groups |

Each plugin in a group has:

| Field | Default | Notes |
|---|---|---|
| name | — | Plugin identifier |
| description | — | From backend |
| enabled | `true` | Whether included in group execution |
| sequence | `100` | Execution order (1–200, lower runs first) |
| ignore_fail | `false` | If true, group continues to next plugin even if this one fails |

### Create a group

Press the **+** icon. The **Create Plugin Group** dialog opens:

1. Enter a **Group Name** (required).
2. Enter a **Description** (optional).
3. Select plugins by tapping them. Selected plugins get a checkmark and a settings (gear) icon.
4. Press the gear icon on a selected plugin to set its **Execution Sequence** (slider, 1–200) and **Ignore Failures** toggle.
5. To nest this group under another, check **Nest under another group**, select a **Parent Group**, and optionally configure the parent relationship:
   - **Sequence** — this group's order within the parent (slider, 1–200).
   - **Ignore Failures** — continue parent execution if this group fails.
   - **Force Execution** — execute this group even if the parent is disabled.

Press **Create**. The application sends `POST /api/create_group/` with the group definition. On success it shows `Group created successfully` and refreshes the list.

### Execute a group

Press the play arrow on a group card. The application sends `POST /api/execute_group/` with `{"group_name": "<name>"}`. The backend runs the group's plugins in sequence order. The result is returned synchronously — there is no WebSocket progress stream for group execution.

### Delete a group

Press the delete icon (trash). A confirmation dialog reads `Are you sure you want to delete "<name>"?`. Press **Delete** to send `POST /api/delete_group/` with `{"group_name": "<name>"}`. On success the list refreshes.

## Test Results

Press the history icon on the Plugins page, or select **Test Results** in the side menu.

### Where results are stored

Test results are stored locally on the device using `SharedPreferences` under the key `plugin_test_results`. They are not sent to or fetched from the backend. This means:

- Results are per-device. Running a plugin on one machine does not make the result visible on another.
- Clearing app data or uninstalling removes all stored results.
- There is no server-side audit trail of plugin executions in this layer.

Each result record contains:

| Field | Type | Notes |
|---|---|---|
| id | string | UUID v4 |
| plugin_name | string | Plugin that produced the result |
| timestamp | ISO 8601 | When the result was saved |
| success | bool | Whether the plugin reported success |
| message | string | Plugin's message |
| data | map | Plugin's data entries |
| target_id | string? | Selected target at execution time |
| target_name | string? | Target display name |

### Table columns

| Column | Content | Sortable |
|---|---|---|
| Date/Time | `yyyy-MM-dd HH:mm:ss` | Yes (default, descending) |
| Plugin | Plugin name | Yes |
| Status | `Success` or `Failure` pill | Yes |
| Message | First line, truncated | No |
| Actions | View Details, Delete | No |

A search box filters by plugin name, message, or target name. The refresh icon reloads from local storage.

### View result details

Press the visibility icon on a row, or tap the message cell. A dialog opens showing:

- Plugin name
- Date (`yyyy-MM-dd HH:mm:ss`)
- Target (if set)
- Message
- Details (each key-value pair from `data`, if non-empty)

The dialog title is **Test Success** or **Test Failure** depending on the `success` field.

### Delete results

Press the delete icon on a single row to remove that result. A toast reads `Test result deleted successfully`.

Press the **Clear All Results** icon (trash with red color) to remove all results. A confirmation dialog reads:

> Clear All Results
>
> Are you sure you want to delete all test results? This action cannot be undone.

Press **Clear All** to confirm.

## How it works

The Plugins page and Plugin Groups page communicate with the backend via HTTP. The Test Results page reads from local storage only.

**Plugin operations:**

| Action | Method | Endpoint | Body |
|---|---|---|---|
| List plugins | GET | `/api/list_plugin_info/` | — |
| Execute plugin | POST | `/api/execute_plugin/` | `{"plugin_name": "<name>", "parameters": {...}}` |
| Load source | POST | `/api/get_plugin_code/` | `{"plugin_path": "<relative>"}` |
| Save source | POST | `/api/save_plugin_code/` | `{"plugin_path": "<relative>", "code": "<source>"}` |

**Plugin group operations:**

| Action | Method | Endpoint | Body |
|---|---|---|---|
| List groups | GET | `/api/list_groups/` | — |
| List plugin names | GET | `/api/list_plugins/` | — |
| Create group | POST | `/api/create_group/` | Group definition with `selected_plugins`, `nest_group`, `parent_group_name`, `parent_options` |
| Execute group | POST | `/api/execute_group/` | `{"group_name": "<name>"}` |
| Delete group | POST | `/api/delete_group/` | `{"group_name": "<name>"}` |

**Async progress:**

| Connection | URL | Purpose |
|---|---|---|
| WebSocket | `<wsBaseUrl>/ws/exploit/<task_id>/` | Stream progress frames for async plugin execution |

**Test result storage:**

| Layer | Mechanism | Key |
|---|---|---|
| Local | `SharedPreferences` | `plugin_test_results` |

The `PluginService` class owns the HTTP calls and WebSocket connection logic. It distinguishes sync results (returned inline in the `result` field) from async tasks (identified by a `task_id`). Screens own their own execution-state presentation — the service only performs requests and returns parsed data.

## Limitations

- **Stop does not cancel backend work.** The Stop button changes the UI state but does not send a cancel request. The backend task continues to completion.
- **Group execution is synchronous.** `POST /api/execute_group/` blocks until all plugins in the group finish. There is no progress stream for group execution.
- **Test results are local-only.** No server-side persistence. Reinstalling the app or clearing data erases the history.
- **Plugin upload is not implemented.** The upload floating action button shows a toast reading `Plugin upload coming soon!`.
- **No automatic vulnerability detection.** Plugins return a `success` flag, a `message`, and a `data` map. What constitutes a finding depends on the specific plugin's logic. The UI does not classify or score results.

## Troubleshooting

### Plugins page shows a loading spinner indefinitely

`GET /api/list_plugin_info/` has not returned. Check that the API server is reachable and that the server URL is configured correctly. See [server and build setup](/blog/en/manual/server-and-build-setup/).

### Execute button is greyed out

The plugin's `status` field is not `'success'`. The backend returned the plugin in the list but reported an error loading it. Check the backend logs for the specific plugin.

### `Plugin "<name>" is already executing`

The plugin is already in the `_executingPlugins` map. Wait for it to finish (state is removed after 3 seconds for sync, 10 seconds for async), then execute again.

### `Error executing plugin: <error>`

The `POST /api/execute_plugin/` request failed, or the response `status` was not `'success'`. The error message includes the backend's response. Check that a target is selected — the selected target ID is included in the saved test result but is not sent in the execute request body.

### Async execution shows `Failed to connect: <error>`

The WebSocket connection to `/ws/exploit/<task_id>/` could not be established. Check that the WebSocket base URL is configured and reachable, and that the backend accepted the task.

### `Plugin path not available`

You pressed Edit on a plugin whose `path` field is empty. The backend did not provide a filesystem path for this plugin. This may happen for built-in or virtual plugins.

### Test Results page shows "No test results found"

No results are stored in local `SharedPreferences`. This is expected on a fresh install. Execute a plugin first, then return to this page.

### `Error loading test results: <error>`

The stored JSON in `SharedPreferences` could not be parsed. The data may have been corrupted. Use **Clear All Results** to reset the storage.

## Recommended workflow

1. Open **Plugins** and verify the plugin list loads.
2. Select a target from the Target dropdown at the top of the page.
3. Find the plugin you want to run. Read its description and check its status — the Execute button must be active.
4. If the plugin has parameters, press Execute and fill in the parameter dialog.
5. For sync plugins, the result dialog appears immediately. For async plugins, watch the status indicator on the plugin row.
6. Open **Test Results** to review what was saved. The result includes the plugin name, timestamp, success flag, message, and any data entries.
7. For batch testing, open **Plugin Groups**, create a group, add plugins with sequences, and execute the group.
8. To inspect or modify plugin source, press the edit icon on a plugin row to open the code editor.

For key generation and certificate verification, continue to [key tool](/blog/en/manual/key-tool/).
