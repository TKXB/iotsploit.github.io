---
title: Work with plugins and test results
description: Choose and run plugins, organize plugin groups, and review locally saved results in IoTSploit v0.0.16.
---

The **Plugins** area lets you browse individual tests, arrange plugins into groups, and review previous results. Use it when you need more detail or organization than the compact runner in Control Panel provides.

This guide covers the public **v0.0.16** release.

:::caution[Review before execution]
Plugins can interact with networks, devices, firmware, and files through the configured server. Run only plugins you trust, against an active target you are authorized to test. Review parameters and plugin source changes before execution.
:::

## Before you start

Confirm that:

- the IoTSploit API and WebSocket services are reachable;
- the correct target is selected;
- the plugin description matches the intended test;
- required drivers and hardware are ready;
- you have a plan for preserving and interpreting results.

## Find a plugin

1. Open **Plugins** → **Plugin List**.
2. Search by plugin name, description, author, or version.
3. Open the plugin details.
4. Confirm that the plugin loaded successfully.
5. Read its parameters and expected behavior.

An unavailable execution action usually means the server could not load the plugin. Check the server logs instead of treating it as a target failure.

## Run one plugin

1. Confirm the active target shown on the page.
2. Select **Execute** for the plugin.
3. If **Enter Parameters** appears, review every value.
4. Replace defaults that do not belong to your lab.
5. Start the execution.
6. Wait for **Completed** or **Failed**.

Some plugins return immediately. Others continue asynchronously and report progress through the WebSocket connection.

If you select **Stop** during an asynchronous run, v0.0.16 stops tracking the operation in the UI but does not cancel the server task. Use the server-side lab procedure when work must actually be terminated.

## Interpret the result

A plugin result can include:

- a success or failure status;
- a human-readable message;
- additional values produced by the plugin;
- the selected target and execution time.

The meaning of success depends on the plugin. It may mean that a request completed, a device responded, or a check matched its expected condition. IoTSploit does not automatically turn every successful result into a vulnerability finding.

Validate important findings with the target's documentation, repeatable evidence, and expert review.

## Review Test Results

Open **Test Results** from the Plugins menu or the history action.

You can:

- search by plugin, message, or target;
- sort by date, plugin, or status;
- open the full message and returned data;
- delete one result;
- clear all locally stored results.

In v0.0.16, this history is saved in the local application profile rather than as a server-side audit log. Results do not automatically follow you to another device. Clearing application data or uninstalling can remove them.

Before deleting results, preserve any evidence required by the engagement. Remove secrets, credentials, customer data, and identifying device information before sharing a result.

## Create a plugin group

A plugin group runs multiple plugins in an order you define:

1. Open **Plugin Groups**.
2. Select the add action.
3. Enter a group name and useful description.
4. Add only plugins that belong to the same authorized workflow.
5. Set their execution order.
6. Decide whether a failure should stop later plugins.
7. Save the group.

Groups can be nested. Keep the structure small enough that another tester can understand the order and failure behavior before running it.

### Run a group safely

Before execution:

- confirm the active target;
- review every enabled plugin;
- check each plugin's parameters and hardware assumptions;
- confirm whether later plugins should continue after a failure;
- estimate the combined effect on the target.

Group execution in v0.0.16 does not provide the same live progress stream as an asynchronous individual plugin. Do not assume an unchanging page means no work is occurring.

## Edit plugin source

The edit action opens the server-provided plugin source. Saving changes can alter what the server executes for future tests.

Only edit a plugin when:

- you are authorized to change server-side test code;
- the original source is under version control or backed up;
- another reviewer can inspect the change;
- you can test it first against an isolated target.

The upload action in v0.0.16 is not a complete plugin-installation workflow.

## Troubleshooting

### The plugin list does not load

Check the API address and server status. If other server-dependent pages also fail, return to Settings.

### Execute is unavailable

The plugin did not load successfully, or no target is selected. Read the plugin status, select a target, and check server logs.

### Live progress cannot connect

Confirm the WebSocket address and firewall rules. The server task may already have started, so check server status before retrying.

### No result appears in Test Results

Wait for a final state, refresh the page, and confirm you are using the same application profile in which the plugin ran.

### A group stops earlier than expected

Review its ordering and failure settings. A plugin that is not configured to ignore failure can stop the remaining sequence.

## Next step

Return to [Control Panel](/blog/en/manual/control-panel-workflow/) for a focused single-target workflow, or use [Key Tool](/blog/en/manual/key-tool/) for local key and certificate tasks.
