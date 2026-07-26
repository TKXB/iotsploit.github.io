---
title: Run an authorized test from Control Panel
description: Select a target, prepare required hardware, run a plugin, and review its messages and saved result in IoTSploit v0.0.16.
---

**Control Panel** is the shortest path from a prepared target to a plugin result. It brings target selection, driver status, plugin execution, and logs into one workspace.

This guide covers the public **v0.0.16** release.

:::caution[Use only with authorization]
A plugin may read data, send network traffic, transmit hardware frames, reset a device, or change its state. Read the plugin description and parameters before running it, and use only a target you are authorized to test.
:::

## Before you start

Confirm that:

- the API and WebSocket addresses are configured;
- **Control Panel** loads without a connection-error banner;
- the target already exists or you have the information needed to create it;
- any required adapter or device is connected to an isolated lab system;
- you understand what the selected plugin is expected to do.

If the page cannot connect, follow [Connect IoTSploit to its services](/blog/en/manual/server-and-build-setup/).

## Select the target

1. Open **Control Panel**.
2. Find the target selector.
3. Choose the system you are permitted to test.
4. Confirm that the selected target remains visible in the selector.

The plugin runner stays unavailable until a target is selected. If the required target is missing, create it in **Targets** and return to Control Panel.

## Prepare drivers and devices

Some plugins need a hardware driver:

1. Review the driver list shown in Control Panel.
2. Enable only the driver required for the test.
3. Confirm that the expected device is detected.
4. If the driver exposes commands, prefer a read-only identification command for the first check.

Do not enable unrelated drivers merely to clear an error. A plugin can start and still fail later if its required hardware is absent or the driver lacks permission.

## Choose a plugin

Find the plugin in the plugin list and read:

- its name and description;
- whether it loaded successfully;
- the required parameters;
- the target or hardware assumptions described by the plugin.

The execution action is disabled for a plugin that did not load successfully. Check the server logs rather than repeatedly pressing the action.

## Run the plugin

1. Select **Execute**.
2. If **Enter Parameters** appears, review every field.
3. Replace example or default values when they do not match your authorized lab.
4. Select **Execute** in the dialog.
5. Watch the execution status and messages.

Some plugins return a result immediately. Others continue in the background and stream progress to the page. Keep the application connected until the final state appears.

## Understand the execution state

| State | Meaning |
|---|---|
| Running | The operation has started or progress is being received |
| Completed | The plugin finished and reported success |
| Failed | The plugin, connection, or result handling reported an error |

**Completed** is the plugin's status, not a security verdict. Review the message and result data, then compare them with the target's expected behavior.

### Stopping an asynchronous run

In v0.0.16, selecting **Stop** changes the state shown by the application but does not cancel work already running on the server. The server task may continue to interact with the target.

If a test must stop immediately, use the server-side control procedure for your lab or safely isolate the target. Do not rely on the UI Stop action as an emergency stop.

## Read the logs

Control Panel has two different log views:

- **Execution** shows messages for the plugin run you started.
- **System** / **Console Logs** shows broader server activity.

Start with the Execution view when a plugin fails. Use Console Logs when the problem involves the server, a driver, a device connection, or multiple operations.

Logs may contain target addresses, device identifiers, filenames, or plugin output. Redact sensitive details before copying them into an issue or sharing them outside the authorized team.

## Review the saved result

Completed and failed plugin results are saved in the application profile and can be opened from **Test Results**. A result normally includes the plugin, time, target, status, message, and any additional data returned by the plugin.

Results are local to the application profile. Clearing application data or uninstalling the application can remove them. Export or record evidence according to your lab procedure before cleanup.

## Troubleshooting

### The page shows a backend connection error

Open **Settings**, confirm both server addresses, then retry. If normal data loads but live progress does not, check the WebSocket address and firewall rules.

### The plugin runner says to select a target

Choose a target in Control Panel. If the selection does not persist, confirm the API connection and select the target again from **Targets**.

### A required driver cannot be enabled

Check the physical connection, operating-system permissions, and server-side driver installation. Do not continue with a hardware plugin until the correct device is detected.

### The plugin remains Running

Check Console Logs and server status. A lost WebSocket connection can leave the UI without a final update even if server-side work has changed state.

### The plugin reports Failed

Read the complete message first. Confirm the target, parameters, driver state, and service connection. Treat the failure as diagnostic information rather than proof of a vulnerability.

## Next step

Use [Targets and hardware drivers](/blog/en/manual/targets-and-drivers/) to prepare another system, or [Plugins and test results](/blog/en/manual/plugins-and-test-results/) to review history and organize plugin groups.
