---
title: IoTSploit UI feature map and where to start
description: Understand which IoTSploit features are visible in each build, how the workflow connects target selection to test results, and where to begin.
---

IoTSploit is a Flutter application for IoT security testing. The production build combines a backend-driven control panel, plugin-based test execution, a protocol fuzzer, and a set of standalone toolkit tools. Some tools run locally, some require a configured backend, and some depend on hardware adapters or a hosted web application.

This guide maps the user-visible areas of the application, the differences between the production, development, and offline builds, and the workflow that connects them. Use it to find the right starting point for a task before reading a feature-specific manual.

:::caution[Use only with authorization]
Testing features that interact with devices, networks, firmware, or debug interfaces require ownership of the target or explicit authorization. Scan, fuzz, and command-execution tools can affect systems you do not own. Define a lab scope and permission boundary before using any testing feature.
:::

## Evidence and scope

The feature inventory in this guide is verified against the application source at commit `c3f20ff8` (version `0.0.17+17`) and the production flavor configuration. The public download page currently distributes version `0.0.16`. Where source behavior and a released build could differ, the relevant manual states the evidence scope explicitly. Do not treat a development-only route, an unconnected screen, or a bundled asset as proof of a released capability.

## The three application flavors

IoTSploit ships in three flavors. Each flavor enables a different set of pages and tools. The flavor is selected at build time and cannot be changed at runtime.

| Flavor | App title | Initial page | Purpose |
|---|---|---|---|
| Production | IoTSploit | Control Panel | Full feature set for released testing workflows |
| Development | IoTSploit Dev | Control Panel | All pages, including experimental and dev-only screens |
| Offline | Toolkit | Toolkit | Standalone local tools that do not need a backend |

## Production navigation

The side menu in the production build shows these top-level areas, in this order:

1. **Control Panel** — target and device inventory, plugin runner, and streaming execution log.
2. **Utils** — utility screens, including USBTMC instrument control.
3. **Plugins** (expandable group):
   - **Plugin List** — browse and run individual plugins.
   - **Plugin Groups** — organize plugins into ordered groups.
   - **Test Results** — review saved results from plugin runs.
4. **Toolkit** — standalone tools that run independently of the plugin system.
5. **Drivers** — enable, disable, and inspect hardware drivers and attached devices.
6. **Targets** — create, edit, select, and delete test targets.
7. **Fuzzer** — configure, manage, and run protocol fuzzing campaigns.
8. **Threat Modeler** — an embedded Attack Path Analysis application (available on macOS, Web, and Windows only).
9. **Settings** — server configuration, language, theme, logging, and version information.

The following areas exist in the source but are **not** part of the production build: **AI Assistant**, **JTAG Boundary Scan**, **Component Showcase**, and **Flavor Comparison**. These are development-only and are hidden in release builds.

## Offline navigation

The offline build is a reduced application titled "Toolkit". Its side menu shows only:

1. **Toolkit** — the same toolkit grid as the production build, filtered to tools that run without a backend.
2. **Settings** — application settings.

Only tools marked as offline-capable appear in the offline Toolkit grid: **File Obfuscation**, **Key Tool**, **Port Scanner**, and **SSH Client**. Backend-dependent tools such as CAN Analysis, GreatFET Scan, ESP32 Testing, Ubertooth BLE/Bt, and Public IP are hidden.

## Toolkit availability matrix

The Toolkit grid shows different tools depending on the flavor and platform. A tool appears only when the flavor enables the Toolkit page and the tool's availability flags allow it.

| Tool | Offline build | Production build | Requires native (no web) |
|---|---|---|---|
| File Obfuscation | Yes | Yes | No |
| Key Tool | Yes | Yes | Yes |
| Port Scanner | Yes | Yes | Yes |
| SSH Client | Yes | Yes | Yes |
| GreatFET Scan | No | Yes | No |
| CAN Analysis | No | Yes | No |
| ESP32 Testing | No | Yes | No |
| Ubertooth BLE/Bt | No | Yes | No |
| Public IP | No | Yes | No |
| Logic Analyzer | No | No (dev only) | No |
| FTDI UART | No | No (dev only) | Yes |

Tools marked "Requires native" use a Rust bridge that is not available in the web build. On the web build, these tools are hidden automatically.

## Platform restrictions

Two platform checks affect which features a user can open:

- **Threat Modeler** uses an embedded WebView (`flutter_inappwebview`). It is available on macOS, Web, and Windows. On other platforms the menu entry is hidden.
- **Rust-dependent tools** (Key Tool, Port Scanner, SSH Client, FTDI UART) require a native build. The web build hides them because the Rust bridge is unavailable.

## How the workflow connects

The major production areas form one workflow from scope definition to result review:

1. **Define the target** in **Targets** — create a target that records the system under test.
2. **Inspect drivers and devices** in **Drivers** — enable the hardware drivers and verify attached devices.
3. **Select the target** in **Control Panel** — the selected target receives plugin execution.
4. **Choose a plugin** in **Control Panel** or **Plugins** — review its parameters and description.
5. **Execute** — the plugin runs on the backend; async runs stream progress over a WebSocket.
6. **Review results** in **Test Results** — completed and failed runs are saved to a shared results store.

The **Toolkit** and **Fuzzer** are independent of this plugin workflow. Toolkit tools run locally or against a directly specified target. The Fuzzer has its own configuration, test management, campaign, and results areas.

## Local, backend-dependent, and hardware-dependent features

Understanding where each feature runs helps you choose the right build and prepare prerequisites.

**Local tools** run on the device and do not require a backend server. In the offline build: File Obfuscation, Key Tool, Port Scanner, and SSH Client. File Obfuscation and Public IP use HTTP only for optional upload or lookup, not for the core operation.

**Backend-dependent features** require a reachable API and WebSocket server. This includes Control Panel, Targets, Drivers, Plugins, Plugin Groups, Test Results, and the Fuzzer. These pages load data from the backend on open and show a connection error banner when the server is unreachable.

**Hardware-dependent features** require a physical adapter, driver, or device. CAN Analysis needs a SocketCAN interface. Ubertooth BLE/Bt needs Ubertooth One hardware. GreatFET Scan needs a GreatFET board. ESP32 Testing connects to a configured ESP32 device. USBTMC instrument control needs a USB-connected instrument. FTDI UART needs a compatible FTDI chip.

**Hosted features** run in an external web application embedded through a WebView. Threat Modeler embeds the Attack Path Analysis application. Its data storage, model configuration, and export behavior are defined by that hosted application, not by the local IoTSploit build.

## Where to start

- To run authorized plugin tests against a target, start with the [Control Panel workflow](/blog/en/manual/control-panel-workflow/).
- To configure the API and WebSocket server, start with [server and build setup](/blog/en/manual/server-and-build-setup/).
- To use a standalone local tool, open the [Toolkit](/blog/en/manual/key-tool/) and choose a tool.
- To run protocol fuzzing, start with [IoT Fuzzer configuration](/blog/en/manual/iot-fuzzer-configuration/).
- To model attack paths, open **Threat Modeler** on a supported platform.

## Availability and limitations

- The production build is the released feature set. Development and offline builds expose different pages and tools; do not assume a development-only feature is available in a released build.
- The web build does not support Rust-dependent tools. Use a native desktop build for Key Tool, Port Scanner, and SSH Client.
- Threat Modeler is unavailable on platforms without WebView support.
- Hardware-dependent tools require the named hardware and platform drivers; a tool appearing in the grid does not prove the hardware is connected.

## Recommended next step

Install the production build, open **Settings**, and verify that the API and WebSocket server addresses are reachable. Then open **Control Panel** and confirm that targets and plugins load. If the connection fails, follow [server and build setup](/blog/en/manual/server-and-build-setup/) before running any test.
