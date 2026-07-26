---
title: Manage targets and hardware drivers
description: Create and select an authorized test target, then prepare the drivers and attached devices needed by IoTSploit v0.0.16.
---

A **target** describes the system you intend to assess. A **driver** connects IoTSploit services to a hardware interface. A detected **device** is the physical adapter or instrument available through that driver.

This guide covers the public **v0.0.16** release.

:::caution[Protect real systems]
Only add and operate targets you are authorized to test. A device command can reset hardware, transmit data, erase state, or affect a connected physical system. Start with read-only commands on isolated, expendable lab equipment.
:::

## Before you start

You need:

- a working connection to the IoTSploit API server;
- an agreed name and scope for the target;
- the target type and network address, when applicable;
- any required adapter, operating-system driver, and device permission;
- a record of which commands are safe in the lab.

## Create a target

1. Open **Targets**.
2. Select **Add New Target** or **Add Your First Target**.
3. Enter a clear **Target Name**.
4. Choose the target type supplied by the connected server.
5. Set the status and optional IP address or location.
6. Add components and interfaces only when they describe the actual target.
7. Select **Save Changes**.

The target should appear in the list after saving. A target name is required.

### Components and interfaces

Use **Components** to describe meaningful parts of the target, such as an ECU, sensor, network service, or other server-defined component type.

Use **Interfaces** for the ways the target can be reached or observed, such as a network, serial, CAN, JTAG, or other server-defined interface.

These fields document the test context. Adding an interface does not connect hardware or prove that the interface is accessible.

## Select the active target

Select the target row or card. The selected target becomes the active target used by Control Panel and plugin execution.

Before starting a plugin, confirm the active target again. Similar names or stale records can lead to testing the wrong system.

## Edit or delete a target

Use the edit action to update a target's name, type, status, properties, components, or interfaces.

Deleting a target removes it from the server-backed list. Before deletion:

1. confirm no active test depends on it;
2. preserve any results or notes that use its name or identifier;
3. check that you selected the correct record;
4. confirm the deletion dialog.

Deleting the target record does not undo actions already performed against the physical system.

## Prepare a hardware driver

1. Open **Drivers**.
2. Find the driver required by your plugin or tool.
3. Review its description and advertised commands.
4. Enable the driver.
5. Confirm that its status changes to enabled.
6. Open the connected-device list.

A driver can be present without its hardware being connected. Likewise, a connected USB device may still be unusable if permissions, firmware, or server-side support are missing.

## Inspect connected devices

Select the connected-device count for a driver. The dialog should list the devices found by that driver and may include details such as a name, serial number, vendor ID, or product ID.

If the list is empty:

- check power and cables;
- confirm the correct adapter is attached to the server host;
- check operating-system permissions;
- confirm the driver supports that hardware and firmware;
- rescan after reconnecting the device.

## Run a device command safely

Only use a command after you understand what it does:

1. read the command description;
2. select a detected device;
3. prefer an identification or status command first;
4. confirm that the target is isolated;
5. run the command;
6. record the displayed result and any physical effect.

Raw command output still requires interpretation. A successful response confirms that the driver returned a result; it does not prove the device is healthy or secure.

## Troubleshooting

### Targets shows no records

Create the first target. If saving fails, confirm the API connection and use a target type accepted by the connected server.

### A target cannot be selected

Reload the page and try again. If the selection still fails, check server connectivity and confirm the target has not been removed by another session.

### Drivers shows no entries

Confirm the server is reachable and has hardware drivers configured. The application does not install server-side drivers automatically.

### A driver cannot be enabled

Check the server message, driver installation, hardware connection, and operating-system permissions. Avoid repeatedly toggling the driver while a device operation is active.

### A command action is unavailable

Enable the driver and confirm that a compatible device was detected. Some commands remain unavailable until the driver reports the required state.

### A command fails

Do not immediately repeat a state-changing command. Check the device, server logs, power, permissions, and command prerequisites first.

## Next step

After selecting a target and preparing its hardware, continue with [Run an authorized test from Control Panel](/blog/en/manual/control-panel-workflow/).
