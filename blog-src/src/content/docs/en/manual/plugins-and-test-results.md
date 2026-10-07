---
title: Work with plugins and test results
description: Choose and run plugins, organize plugin groups, and review locally saved results in IoTSploit v0.0.19.
---

The **Plugins** area lets you browse individual tests, arrange plugins into groups, and review previous results. Use it when you need more detail or organization than the compact runner in Control Panel provides.

This guide covers the public **v0.0.19** release.

_Evidence: every label and behavior below was re-derived from IoTSploit UI **v0.0.19** (tag `v0.0.19`, commit `6bb8b5b`, 2026-09-28), from the source under `lib/screens/plugins/`._

:::caution[Review before execution]
Plugins can interact with networks, devices, firmware, and files through the configured server. Run only plugins you trust, against an active target you are authorized to test. Review parameters and plugin source changes before execution.
:::

## Before you start

Confirm that:

- the IoTSploit API and WebSocket services are reachable;
- the correct target is current;
- the plugin description matches the intended test;
- required drivers and hardware are ready on the host that serves the page;
- you have a plan for preserving and interpreting results.

The server keeps one **current target**, and this page reads and writes the same one as the rest of the application. Choose it in the **Target** dropdown at the top of the page.

## Find a plugin

1. Open **Plugins** → **Plugin List**.
2. Check the **Target** dropdown and select the system you are authorized to test.
3. Search by plugin name, description, author, or version. While a search is active a match count appears above the list with a **Clear search** action.
4. Read the plugin details.

On a wide window the plugins are a table with **Plugin Name**, **Version**, **Author**, **Description**, and **Actions** columns; on a narrow window they become cards. The view toggle switches between the grid and the list.

### A plugin that cannot run here

A plugin that cannot run on the host serving the page carries a red **Unavailable** badge beside its name — a block icon alone in the narrow card — and its execution action is disabled. Hover the badge for the server's reason and, when it supplies one, a hint for fixing it.

Availability is a fact about the backend that answered this request, not a global property of the plugin: a plugin blocked here may still run on another host. It is re-read whenever the list loads and re-checked by the executor before a run, and it is never cached.

### Empty backend versus loading

The list shows a loader while it loads for the first time. If the backend answers with zero plugins, it shows **No plugins available** with a **Refresh** action, which is different from a search that matches nothing and offers **Clear search** instead. Treat the empty state as a real answer about the host, not as a page that is still busy.

## Run one plugin

1. Confirm the current target in the **Target** dropdown.
2. Select **Execute** for the plugin.
3. If the **Enter Parameters** dialog appears, review every value.
4. Replace defaults that do not belong to your lab.
5. Select **Execute** in the dialog to start the run, or **Cancel** to stop before it starts.
6. Wait for a final state.

The parameter dialog is the same one Control Panel uses. It renders what each parameter declares: declared choices appear as selectable options, an integer keeps its declared range, a true/false flag is a menu, and a list is typed as comma-separated values. A field the plugin marks required must be filled before the run starts, and an out-of-range value is caught while the dialog is still open.

A plugin whose input composes a CAN frame from the target's own definitions opens the CAN composer instead of a plain form. That flow needs a current target, so set one before starting it.

### Plugins that ask questions

Some plugins stop mid-run and ask the operator something. The Plugin List has no surface for answering them, so such a plugin's action reads **Interactive**, and selecting it opens a **Run this in the Control Panel** notice instead of starting a run. Open [Control Panel](/blog/en/manual/control-panel-workflow/) and start the plugin there, where its questions appear inline in the Execution log.

Some plugins return immediately. Others continue asynchronously and report progress through the WebSocket connection; while one is running, its action becomes **Stop**.

If you select **Stop** during an asynchronous run, v0.0.19 stops tracking the operation in the UI but does not cancel the server task. Use the server-side lab procedure when work must actually be terminated.

## Interpret the result

A plugin result can include:

- a success or failure status;
- a human-readable message;
- additional values produced by the plugin;
- the selected target and execution time.

The meaning of success depends on the plugin. It may mean that a request completed, a device responded, or a check matched its expected condition. IoTSploit does not automatically turn every successful result into a vulnerability finding.

Validate important findings with the target's documentation, repeatable evidence, and expert review.

## Review Test Results

Open **Plugins** → **Test Results**, or select the history action on the Plugin List.

The list has **Date/Time**, **Plugin**, **Status** (Success or Failure), **Message**, and **Actions** columns. You can:

- search by plugin, message, or target;
- sort by date, plugin, or status;
- open the full message and returned data;
- delete one result, after a confirmation;
- clear all stored results, after a confirmation.

In v0.0.19, this history is saved in the local application profile rather than as a server-side audit log. Results do not automatically follow you to another device. Clearing application data or uninstalling can remove them.

Before deleting results, preserve any evidence required by the engagement. Remove secrets, credentials, customer data, and identifying device information before sharing a result.

## Create a plugin group

A plugin group runs multiple plugins in an order you define:

1. Open **Plugins** → **Plugin Groups**.
2. Select the add action to open **Create Plugin Group**.
3. Enter a **Group Name** and a useful **Description**.
4. Under **Select Plugins**, tick only plugins that belong to the same authorized workflow.
5. Use the settings action on a selected plugin to set its **Execution Sequence** and whether it should **Ignore Failures**.
6. Select **Create**. A required name or a missing parent is reported under the field rather than in a message hidden behind the dialog.
7. To place this group inside another, select **Nest under another group**, pick a **Parent Group**, and set its **Parent Relationship Settings** — **Sequence**, **Ignore Failures**, and **Force Execution**.

The group list shows each plugin's **Seq: N** and, when set, an **Ignore Fail** tag; nested groups appear under their parent. Keep the structure small enough that another tester can understand the order and failure behavior before running it.

### Run a group safely

Before execution:

- confirm the current target;
- review every enabled plugin;
- check each plugin's parameters and hardware assumptions;
- confirm whether later plugins should continue after a failure;
- estimate the combined effect on the target.

Use **Execute group** on the group card. Group execution in v0.0.19 does not provide the same live progress stream as an asynchronous individual plugin. Do not assume an unchanging page means no work is occurring.

## Edit plugin source

The **Edit Plugin** action opens the server-provided plugin source in an editor. Saving changes can alter what the server executes for future tests. The editor marks unsaved changes, keeps **Save** disabled until there is something to save, and asks **Discard unsaved changes?** before you leave with edits outstanding.

Only edit a plugin when:

- you are authorized to change server-side test code;
- the original source is under version control or backed up;
- another reviewer can inspect the change;
- you can test it first against an isolated target.

The upload action is a placeholder in v0.0.19: it reports **Plugin upload coming soon** and is not a plugin-installation workflow.

## Troubleshooting

### The plugin list does not load

Check the API address and server status. A first load shows a spinner; if it stays, the backend is unreachable. If other server-dependent pages also fail, return to Settings.

### No plugins are listed

**No plugins available** means the backend answered with an empty list, not that it is still loading. Confirm the plugin directory on that host is populated, then select **Refresh**.

### Execute is unavailable

Read the **Unavailable** badge beside the plugin name and hover it for the server's reason and any hint. The plugin either failed to load or its requirements are unmet on this host — check the server logs and, for hardware plugins, that host's drivers. Confirm a current target is set as well.

### A plugin needs answers before it runs

A plugin marked **Interactive** cannot be started from the Plugin List. Open **Control Panel** and run it there, where its questions appear inline.

### Live progress cannot connect

Confirm the WebSocket address and firewall rules. The server task may already have started, so check server status before retrying.

### No result appears in Test Results

Wait for a final state, refresh the page, and confirm you are using the same application profile in which the plugin ran.

### A group stops earlier than expected

Review its ordering and failure settings. A plugin that is not configured to ignore failures can stop the remaining sequence.

## Next step

Return to [Control Panel](/blog/en/manual/control-panel-workflow/) for a focused single-target workflow, or use [Key Tool](/blog/en/manual/key-tool/) for local key and certificate tasks.
