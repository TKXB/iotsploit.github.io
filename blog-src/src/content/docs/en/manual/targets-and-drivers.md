---
title: Manage targets and hardware drivers
description: Define an authorized test target, read it in the Target Explorer, import or export one, and prepare the drivers and attached devices an IoTSploit v0.0.19 test needs.
---

A **target** describes the system you intend to assess. A **driver** connects IoTSploit services to a hardware interface. A detected **device** is the physical adapter or instrument available through that driver.

This guide covers the public **v0.0.19** release.

_Evidence: every label, column, and behavior below was re-derived from IoTSploit UI **v0.0.19** (tag `v0.0.19`, commit `6bb8b5b`, 2026-09-28), from the source under `lib/screens/targets/` and `lib/screens/devices/`._

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

## The Targets list

Open **Targets**. On a desktop window the targets are a table; on a narrow window they are cards. The table has these columns, left to right:

| Column | What it holds |
|---|---|
| **Current** | A filled marker on the current target; on every other row a hollow circle that makes that target current when selected |
| **Name** | The target's display name |
| **Type** | One of Vehicle, ECU, Phone, IoT, Router, Camera, or Generic |
| **Status** | Active or Inactive |
| **Components** | How many components the target declares |
| **IP** | The recorded network address, when known |
| **Location** | The recorded physical location, when known |
| **Actions** | Edit, Export, and Delete |

![The Targets page in v0.0.19, showing the Current, Name, Type, Status, Components, IP, Location, and Actions columns, with the current target marked in the Current column and the Import and Add New Target controls at the top right](/blog/images/targets-overview.png)

Use **Search targets** to match a name, type, or IP address, and the **Type** and **Status** filters to narrow the list. **Import** and **Add New Target** sit at the top right; on a phone both fold into one add menu.

Selecting a row or card opens the target in the **Target Explorer**. Opening a target only reads it; it does not change which target is current.

## Create a target

1. Open **Targets**.
2. Select **Add New Target**, or **Add Your First Target** when the list is empty.
3. In the editor, use the outline on the left to move between the parts of the target.
4. Fill in **Identity**, then add components and facets as needed.
5. Select **Save Changes**.

A target name is required; the footer refuses to save an empty name and shows why. The same footer lists unsaved changes as you work.

### Identity

The **Identity** pane holds the target's own fields: **Target Name** (required), **Target Type**, **Status** (active or inactive), **IP Address**, and **Location**.

### Components

Add a component with the **+** beside the **Components** heading. Each component has a **Component ID**, **Name**, **Type**, and **Status**. For an ADB or infotainment component the editor also shows **ADB Serial ID**, **USB Vendor ID**, and **USB Product ID**, all optional. **Delete** removes the component from this edit.

Components can also carry free-form **Properties** and one or more **Facets**, described below.

### Facets on a component

A **facet** is protocol configuration published by a backend plugin, such as `can`, `doip`, or `someip`. The application does not know the protocols itself: a plugin registers a facet, and the backend publishes its schema, which supplies the labels, field order, and declared types.

- **Add facet** lists every facet type the connected backend defines that this component does not already carry.
- Each facet card shows the fields its schema declares. Fields the facet marks required block **Save Changes** until filled.
- A `format: hex` field is shown and accepted as hexadecimal, and integers also accept decimal; a structured field (an array or object, such as a batch of CAN frames) is shown read-only rather than edited as text.
- **Remove** deletes the facet from the component.
- A facet that no loaded plugin defines is shown as stored, under a warning that its fields cannot be checked.

### Properties

**Properties** are free-form key/value pairs, on the target and on each component. Type a name and a value together and select **Add**; a property with no name is refused.

### Topology (read-only)

The **Topology** group lists **Buses** and **Edges** that the target carries. In the editor they are read-only: saving a target sends its components, and buses and edges are stored but not yet accepted by the backend, so anything typed here would be discarded. To create a target with full topology, [import an ARXML](#import-a-target) instead.

## Set the current target

The application keeps one **current target** on the server. Plugin runs, the CAN composer, and the observation feed act on it.

- On the Targets table, select the hollow circle in the **Current** column.
- In the Target Explorer header, select **Set as current**.

Reading a target never changes the current target. The current target is shown where it is chosen: the Targets list **Current** column, the Target Explorer header, the Control Panel details, and the Plugins target list.

## Read a target in the Target Explorer

Opening a target from the list shows the **Target Explorer**, laid out as an inspector so that reading a target and editing one share the same model:

- the **outline** on the left lists Identity, Properties, Components, Buses, Edges, and the Views **By facet** and **Observations**;
- the centre pane has **Graph**, **Table**, and **Raw** tabs, plus **Details** when the window is too narrow to dock the inspector;
- the **inspector** on the right shows the fields of whatever is selected;
- a breadcrumb under the tabs shows where the selection sits.

The header shows the target name, its type and component and bus counts, the current-target control, **Export target**, and **Refresh**.

### Graph, Table, and Raw

- **Graph** draws the target, its buses, and its components, and carries an **Observation overlay** that can colour the graph by captured fact. Selecting a node opens it in the inspector.
- **Table** renders the selected node as a table. Each column header has a drag handle on its right edge; drag it to set that column's width. Some views open here directly, such as a facet's frames or an observation's rows.
- **Raw** shows the stored object as JSON.

### Facets, buses, and coverage in the inspector

Select a component to see its facets, each rendered from the published schema. A CAN facet offers **Open N frames in the table** rather than collapsing its frames to a count. Selecting a bus shows its members and any bus-owned frames; selecting **Edges** groups them by relation.

Under **Views**, **By facet** places every component carrying a facet key side by side and flags a **conflict** when a field the facet marks unique repeats. On a component, the inspector also draws a **capture vs configuration** bar comparing the frames the target documents with the frames a scan has seen, and lists any frame seen on the wire but absent from the configuration.

### Observations and the observed-relationship graph

An observation is a fact captured by a scan. Each fact carries the component and subject it is about, so it attaches to them rather than sitting in a list.

- A component's **observations** section lists the facts that name it (the first twelve, with the rest in the Observations table).
- **Views** → **Observations** opens the **Relations graph**: scan scopes, components, and observed subjects, coloured by protocol, with counts of each, a search over subject, component, or source, a protocol filter, and **Fit**. A wide box is a scan scope, a plain box a component, and a chip an observed subject. Selecting a node in the graph opens its table.

## Edit or delete a target

**Edit** opens the same editor on the complete target. **Delete** asks for confirmation and then removes the target from the server-backed list.

Before deleting a target:

1. confirm no active test depends on it;
2. preserve any results or notes that use its name or identifier;
3. check that you selected the correct record;
4. confirm the deletion dialog.

Deleting the target record does not undo actions already performed against the physical system.

## Export a target

Use the **download** action in a row's **Actions** column, or **Export target** in the explorer header. The application fetches the complete target and writes a file named `<target_id>.iotsploit.json` in the IoTSploit interchange format. The file is indented, so two exports of the same target can be compared line by line.

Export never changes the target. Import an exported file to recreate a target on another server or pick up where another operator left off.

## Import a target

**Import** opens a format menu with two entries:

- **AUTOSAR ARXML (.arxml)** — build a new target from an OEM vehicle or ECU extract;
- **IoTSploit target (.json)** — recreate targets from a file this application or the CLI exported.

Both importers create **new** targets only. Importing never reads, changes, or selects a target that already exists.

### Import an ARXML

1. Select **Import** → **AUTOSAR ARXML (.arxml)**.
2. Choose the ARXML file, then enter a unique **New target ID**, a **Display name**, and an optional **Source label** naming its provenance.
3. Select **Parse**. The rig parses the file without writing anything and shows a preview: source, AUTOSAR schema, system, scope, SHA-256, counts (components, buses, edges, CAN frames, CAN signals, CAN FD frames, container frames), the buses, and any parser warnings.
4. Select **Create Target** to create exactly the previewed target.
5. When the target is created, select **Open in Explorer**.

An ECU extract rather than a complete vehicle description is created as a draft and carries a warning. The upload limit is 256 MiB; on a platform that has to upload the file from memory rather than from disk, it is 32 MiB.

### Import an IoTSploit JSON

1. Select **Import** → **IoTSploit target (.json)**.
2. Choose the file. The application reads it and previews each target it holds with its component, bus, frame, and signal counts.
3. Tick **Import this target** for each one to create. If a target ID is already used, either in the inventory or twice in the same file, choose **Skip** or **Import under a new id** and type a free id. Nothing is overwritten.
4. Select **Import**. Each target is created on its own; a failure is reported per target and does not lose the others.

## Prepare a hardware driver

Open **Drivers**. The page lists every driver the server advertises.

![The Drivers page in v0.0.19, showing Driver ID, Name, Driver Type, Connected Devices, Status switches, and a Commands menu per driver](/blog/images/drivers-overview.png)

1. Find the driver your plugin or tool needs.
2. Review its **Name** and **Driver Type**.
3. Read the **Connected Devices** count for the devices it can see.
4. Set the **Status** switch to Enabled. A driver that cannot run on the host serving this page is marked with a block icon; hover the icon to read the reason.
5. Open **Commands (n)** to see the driver's commands.

A driver can be present without its hardware being connected. Likewise, a connected USB device may still be unusable if permissions, firmware, or server-side support are missing. A command that declares parameters asks for them in a form before it runs.

## Inspect connected devices

Select the **Connected Devices** number for a driver. The dialog lists the devices that driver found and shows each one's attributes, such as a name, serial number, vendor ID, or product ID.

If the list is empty:

- check power and cables;
- confirm the correct adapter is attached to the server host;
- check operating-system permissions;
- confirm the driver supports that hardware and firmware;
- rescan after reconnecting the device.

## Run a device command safely

Only use a command after you understand what it does:

1. read the command description in the **Commands** menu;
2. select a detected device when the command asks for one;
3. prefer an identification or status command first;
4. confirm that the target is isolated;
5. run the command;
6. read the **Result** dialog and record any physical effect.

Raw command output still requires interpretation. A successful response confirms that the driver returned a result; it does not prove the device is healthy or secure.

## Troubleshooting

### Targets shows no records

Create the first target. If saving fails, confirm the API connection and use a target type accepted by the connected server.

### A target cannot be opened or selected

Reload the page and try again. If the explorer still fails to load, check server connectivity and confirm the target has not been removed by another session.

### An imported target is a draft

The ARXML held an ECU extract, not a complete vehicle description. The target is created so you can work with what the file contains; add the missing context or import a complete description.

### A JSON target is skipped

Its ID was already used, so nothing was overwritten. Select **Import under a new id** and choose a free ID.

### Topology cannot be edited

That is expected in v0.0.19. Buses and edges are read-only in the editor and arrive through ARXML import; saving sends the target's components only.

### Drivers shows no entries

Confirm the server is reachable and has hardware drivers configured. The application does not install server-side drivers automatically.

### A driver is marked with a block icon

The driver cannot run on the host serving the page. Hover the icon for the server's reason, then address it on that host.

### A driver cannot be enabled

Check the server message, driver installation, hardware connection, and operating-system permissions. Avoid repeatedly toggling the driver while a device operation is active.

### A command action is unavailable

Enable the driver and confirm that a compatible device was detected. Some commands remain unavailable until the driver reports the required state.

### A command fails

Do not immediately repeat a state-changing command. Check the device, server logs, power, permissions, and command prerequisites first.

## Next step

After selecting a target and preparing its hardware, continue with [Run an authorized test from Control Panel](/blog/en/manual/control-panel-workflow/). For the broader map of where each IoTSploit tool runs, see [IoTSploit UI feature map and where to start](/blog/en/manual/iotsploit-ui-overview/).
