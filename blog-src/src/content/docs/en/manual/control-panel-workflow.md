---
title: Run an authorized test from Control Panel
description: Set the current target, prepare required hardware, run a plugin, answer its questions, and review the saved result in IoTSploit v0.0.19.
---

**Control Panel** is the shortest path from a prepared target to a plugin result. It brings asset selection, driver status, plugin execution, and logs into one workspace.

This guide covers the public **v0.0.19** release.

_Evidence: every label, control, and status below was re-derived from IoTSploit UI **v0.0.19** (tag `v0.0.19`, commit `6bb8b5b`, 2026-09-28), from the source under `lib/screens/control_center/` and `lib/l10n/`._

:::caution[Use only with authorization]
A plugin may read data, send network traffic, transmit hardware frames, reset a device, or change its state. Read the plugin description and parameters before running it, and use only a target you are authorized to test.
:::

## Before you start

Confirm that:

- the API and WebSocket addresses are configured;
- the **Backend** status at the foot of the side menu reports **Online**;
- the target already exists or you have the information needed to create it;
- any required adapter or device is connected to an isolated lab system;
- you understand what the selected plugin is expected to do.

The **Backend** status bar sits at the bottom of the side menu. Its pill reads **Checking**, **Online**, **Degraded**, **Version mismatch**, or **Unreachable**, and the line below it shows the server address and its version. Select the bar for details, **Check now**, or **Server settings**. A build with no backend, such as the Offline Toolkit, has no status bar.

If the page cannot connect, follow [Connect IoTSploit to its services](/blog/en/manual/server-and-build-setup/).

## Set the current target

The server keeps one **current target**. Plugin runs and the CAN composer act on it, so setting it is a separate step from reading it.

1. Open **Control Panel**.
2. Under **Assets** on the left, find the **Targets** group and select the system you are permitted to test. This only fills the **Details** panel on the right; it does not retarget anything.
3. In **Details**, select **Set as current**. When the target is already current, that place shows a **CURRENT TARGET** chip instead.
4. Confirm the plugin table header now shows the target's name. With none set, it reads **No current target**.

The choice is shared across the application: the **Targets** table's **Current** column, the Target Explorer header, and the **Plugins** page all read and write the same current target. In the **Assets** list, the current target carries a **TARGET** tag.

The **Execute** action is disabled until a current target is set, and while another plugin is running. If the target you need is missing, create it in **Targets** and return to Control Panel.

## Prepare drivers and devices

Some plugins need a hardware driver. Only drivers with at least one connected device appear under **Devices** in the **Assets** list.

1. Select the driver entry you need.
2. In **Details**, review its **Status** (**ENABLED** or **DISABLED**) and **Connected** count.
3. Select **Enable driver**. Select **Disable driver** when the test is done.
4. If the driver exposes commands, prefer a read-only identification command for the first check.

Do not enable unrelated drivers merely to clear an error. A plugin can start and still fail later if its required hardware is absent or the driver lacks permission.

## Choose a plugin

The plugin table lists **PLUGIN NAME**, **VERSION**, **AUTHOR**, **DESCRIPTION**, and **ACTIONS**, with a search box that matches the name, description, or author.

Read the description and note:

- whether the plugin loaded successfully;
- the required parameters;
- the target or hardware assumptions described by the plugin.

A plugin that failed to load has its reason in the **DESCRIPTION** column and its **Execute** action disabled. Check the server logs rather than repeatedly pressing the action.

## Run the plugin

1. Select **Execute** on the plugin row.
2. If the **Enter Parameters** dialog appears, review every field. Declared choices, ranges, and units are shown, and an unset required field is caught before the run starts.
3. Replace example or default values when they do not match your authorized lab.
4. Select **Execute** in the dialog to start the run, or **Cancel** to stop before it starts.
5. Watch the **Execution** log and the status strip.

Some plugins return a result immediately. Others continue in the background and stream progress to the page. Keep the application connected until a final state appears.

### Answer a question from a running plugin

Some plugins stop mid-run and ask the operator something. The question is not a dialog; it appears inline in the **Execution** log on an amber card headed **WAITING FOR YOUR INPUT**, with a countdown when the server sets a deadline.

- Fill in the field or select the offered choices.
- Select **Submit** (a yes/no question shows its own confirm and deny labels instead).
- Select **Cancel run** to ask the server to cancel the run rather than answer.
- The status strip also carries the remaining time and a **Jump to question** control, because the prompt scrolls out of view as the log grows.

Once answered, the question collapses to a single log line where it was asked, and the run continues. If the connection drops, the card reads **RECONNECTING** and sending is disabled until it returns; the run itself keeps going on the server, and the open question is restored when the page reconnects or reloads.

## Understand the execution state

| State | Meaning |
|---|---|
| Running | The operation has started or progress is being received |
| Waiting for your input | The plugin asked a question and is blocked until it is answered |
| Completed | The plugin finished and reported success |
| Failed | The plugin, connection, or result handling reported an error |
| Cancelled | The run was cancelled before it finished |
| Lost | The worker handling the run went away |

**Completed** is the plugin's status, not a security verdict. Review the message and result data, then compare them with the target's expected behavior.

### Stopping a run

For an asynchronous run, selecting **Stop** closes the stream this page is watching and marks the row **Stopped by operator**; it does not necessarily cancel work already running on the server. The server task may continue to interact with the target.

For a run that is waiting on a question, use **Cancel run** on the question card, which asks the server to cancel the execution.

If a test must stop immediately, use the server-side control procedure for your lab or safely isolate the target. Do not rely on the UI actions as an emergency stop.

## Read the logs

The **Logs** card has two tabs:

- **Execution** shows the transcript for the plugin run you started, including its questions.
- **System** shows broader server activity under the heading **Console Logs**.

Start with **Execution** when a plugin fails. Use **System** when the problem involves the server, a driver, a device connection, or multiple operations. The copy and clear icons act on the Execution transcript.

The **Logs** card can be resized against the plugin table: drag the handle in the gap between the two cards, and double-tap it to return to an even split. Each pane keeps a minimum height. On the narrow layout the two cards stack and the split handle is not shown.

Logs may contain target addresses, device identifiers, filenames, or plugin output. Redact sensitive details before copying them into an issue or sharing them outside the authorized team.

## Review the saved result

Completed and failed plugin results are saved in the application profile and can be opened from **Test Results**. A result normally includes the plugin, time, target, status, message, and any additional data returned by the plugin.

Results are local to the application profile. Clearing application data or uninstalling the application can remove them. Export or record evidence according to your lab procedure before cleanup.

## Troubleshooting

### The page shows a backend connection error

Check the **Backend** status at the foot of the side menu first, then open **Settings** and confirm both server addresses. The banner names the failure — **Connection refused**, **Request timed out**, **Host not found**, **Network unreachable**, or an HTTP status — and offers **Retry** and **API settings**. If normal data loads but live progress does not, check the WebSocket address and firewall rules.

### The plugin runner says to set a current target

Select a target under **Assets** and use **Set as current** in **Details**. The plugin table header reads **No current target** until one is set. If the selection does not persist, confirm the API connection and set it again from **Targets**.

### A required driver cannot be enabled

Check the physical connection, operating-system permissions, and server-side driver installation. Do not continue with a hardware plugin until the correct device is detected.

### The plugin remains Running

Check the **System** logs and the backend status bar. A lost WebSocket connection can leave the page without a final update even if server-side work has changed state.

### The plugin reports Failed

Read the complete message first. Confirm the target, parameters, driver state, and service connection. Treat the failure as diagnostic information rather than proof of a vulnerability.

## Next step

Use [Targets and hardware drivers](/blog/en/manual/targets-and-drivers/) to prepare another system, or [Plugins and test results](/blog/en/manual/plugins-and-test-results/) to review history and organize plugin groups.
