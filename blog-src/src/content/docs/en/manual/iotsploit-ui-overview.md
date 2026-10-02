---
title: IoTSploit UI feature map and where to start
description: Find the right IoTSploit area for connecting services, preparing a target, running a test, using a standalone tool, or fuzzing, and see which builds and platforms carry it.
---

IoTSploit brings several IoT security workflows into one application. This map helps you choose a starting point without requiring you to understand how the application is implemented.

This guide covers the public **v0.0.19** release (tag `v0.0.19`, commit `6bb8b5b`, evidence date 2026-09-28). A page being visible does not guarantee that its hardware, server, or platform requirements are met.

:::caution[Use only with authorization]
Only test devices, networks, firmware, and services that you own or have explicit permission to assess. Isolate hardware tests from vehicles, production networks, and safety-critical equipment.
:::

## Choose an area by task

| Your task | Start here | What you should expect |
|---|---|---|
| Connect the application to IoTSploit services | **Settings** | Saved API and WebSocket addresses and a successful connectivity check |
| Check the backend at a glance | Backend status (navigation footer) | Whether the server answers, its address, and its version |
| Define the system you are assessing | **Targets** | A target you can mark current and select for plugin execution |
| Prepare connected hardware | **Drivers** | Enabled drivers and detected devices |
| Run one plugin against a target | **Control Panel** | Live execution messages and a saved result |
| Browse or organize plugins | **Plugins** | Individual plugins, plugin groups, and stored results |
| Use a focused utility | **Toolkit** | A tool-specific result produced on this device or through the configured server |
| Configure or run fuzzing | **Fuzzer** | Test definitions, execution status, and result artifacts |
| Check the workstation and live device feeds | **Utils** | Live CPU and memory telemetry, tool readiness, and device stream data |
| Model an attack path | **Threat Modeler** | The hosted Attack Path Analysis application |

The server keeps one **current target**. The **Control Panel** header shows it, the **Targets** table marks it, and **Plugins** and the **Control Panel** act on it, so a target you set on one page is the target the others use.

## Understand the application builds

IoTSploit is distributed in four build flavors:

- **Production** — the public application; starts on **Control Panel**.
- **Development** — adds **AI Assistant** and **JTAG Boundary Scan**.
- **Offline** — titled **Toolkit**; starts on the Toolkit and shows only **Toolkit** and **Settings**. It has no backend, so it omits every server-dependent page.
- **JTAG Boundary Scan** — a desktop-only build that starts on **JTAG Boundary Scan** and shows only that page and **Settings**.

Two features are not whole pages:

- **Multi-window (desktop experiment).** Turn it on under **Settings → Multiple windows**. A desktop build can then move a page into its own window by right-clicking it in the navigation rail, or with the open-in-new-window button in the page header.
- **Backend status.** Builds that talk to a backend show a status bar at the foot of the navigation rail with the server address, its version, and whether it answers. Select it for details, a re-check, or a shortcut to **Settings**. The Offline and JTAG builds have no backend and no status bar.

## Availability by build

| Area | Production | Development | Offline (Toolkit) | JTAG |
|---|---|---|---|---|
| Control Panel | ✓ | ✓ | — | — |
| Utils | ✓ | ✓ | — | — |
| Plugins (list, groups, results) | ✓ | ✓ | — | — |
| Toolkit | ✓ | ✓ | ✓ | — |
| Drivers | ✓ | ✓ | — | — |
| Targets | ✓ | ✓ | — | — |
| Fuzzer | ✓ | ✓ | — | — |
| Threat Modeler | ✓ | ✓ | — | — |
| Settings | ✓ | ✓ | ✓ | ✓ |
| AI Assistant | — | ✓ | — | — |
| JTAG Boundary Scan | — | ✓ | — | ✓ |

Notes:

- **Threat Modeler** is shown only on the Web, macOS, and Windows builds, where the embedded browser it uses is supported. It is a hosted application outside the local IoTSploit process.
- A page that appears in a menu can still require a server, hardware, or a platform feature that is not present.

## Toolkit inventory

The **Toolkit** grid is filtered by build flavor and by the platform's capabilities, so the same flavor can show fewer tools on the Web than on the desktop.

| Tool | Production | Offline | Available on Web |
|---|---|---|---|
| GreatFET Scan | ✓ | — | ✓ |
| CAN Analysis | ✓ | — | ✓ |
| Logic Analyzer | — | — | ✓ |
| ESP32 Testing | ✓ | — | ✓ |
| File Obfuscation | ✓ | ✓ | ✓ |
| Ubertooth BLE/BT | ✓ | — | ✓ |
| Key Tool | ✓ | ✓ | — |
| Port Scanner | ✓ | ✓ | — |
| SSH Client | ✓ | ✓ | — |
| FTDI UART | — | — | — |
| Public IP | ✓ | — | ✓ |
| Firmware Manager | ✓ | — | — |
| Device Recovery | ✓ | — | ✓ |
| USBTMC Console | ✓ | ✓ | — |

A dash in the **Production** or **Offline** column means the tool is hidden in that flavor; some of those tools are still reachable in **Development**. Tools marked off under **Available on Web** depend on native code or direct USB access that a browser cannot provide.

## Follow the main plugin workflow

For a typical authorized plugin test:

1. Open **Settings** and configure the API and WebSocket addresses, or confirm the backend status bar reports a connection.
2. Open **Targets**, create or select the target you are permitted to test, and set it as the current target.
3. Open **Drivers** if the plugin needs attached hardware.
4. Open **Control Panel** or **Plugins** and choose a plugin.
5. Review its description and parameters before starting it.
6. Watch the execution messages.
7. Open **Test Results** and interpret the saved result in the context of the target.

A successful plugin run means the plugin completed and reported success. It does not, by itself, prove that a device is secure or vulnerable.

## Know where work happens

- **Local tools:** File Obfuscation, Key Tool, Port Scanner, SSH Client, Firmware Manager, and USBTMC Console perform their main operation on the device running IoTSploit. Firmware Manager writes to a target over a local USB connection; the others work without a server.
- **Server-dependent areas:** Control Panel, Targets, Drivers, plugin execution, plugin groups, CAN Analysis, Ubertooth, Fuzzer, Device Recovery, and Utils depend on configured IoTSploit services. Previously saved plugin results can be viewed locally.
- **Hardware-dependent areas:** Drivers, CAN Analysis, Ubertooth, JTAG, FTDI UART, GreatFET, and USBTMC utilities require compatible hardware and operating-system access.
- **Hosted area:** Threat Modeler opens a separate hosted application. Its model settings and data handling are not controlled by the local IoTSploit application.

## Platform notes

- The Web build hides tools that depend on native code: Key Tool, Port Scanner, SSH Client, FTDI UART, Firmware Manager, and USBTMC Console.
- USBTMC Console and the multi-window experiment need desktop access. USBTMC claims a USB interface directly, and multi-window opens a second operating-system window.
- Threat Modeler is shown on the Web, macOS, and Windows builds in v0.0.19.
- Hardware access varies by operating system, driver, permissions, adapter, and firmware.
- A tool that appears in the menu may still require an IoTSploit server or hardware that is not included with the application.

## Where to start

- First installation: [connect IoTSploit to its services](/blog/en/manual/server-and-build-setup/).
- First plugin test: [run an authorized test from Control Panel](/blog/en/manual/control-panel-workflow/).
- Target or driver setup: [manage targets and hardware drivers](/blog/en/manual/targets-and-drivers/).
- Plugin history and groups: [work with plugins and test results](/blog/en/manual/plugins-and-test-results/).
- Local cryptographic checks: [use Key Tool](/blog/en/manual/key-tool/).
- Authorized network discovery: [run a port scan](/blog/en/manual/port-scanner/).
- Remote terminal or file transfer: [use the SSH client](/blog/en/manual/ssh-client/).
- Package a file inside an image: [use File Obfuscator](/blog/en/manual/file-obfuscator/).
- Instrument control over USB: [control a USBTMC instrument](/blog/en/manual/usbtmc-device-control/).
- Flash or recover hardware: [use the firmware and recovery tools](/blog/en/manual/firmware-and-recovery-tools/).
- Fuzzer setup: [configure the IoT Fuzzer](/blog/en/manual/iot-fuzzer-configuration/).
- Fuzzer test authoring: [manage test groups and cases](/blog/en/manual/iot-fuzzer-test-management/).
- Attack path modeling: [use the Attack Path Analysis app](/blog/en/manual/attack-path-app/).

Start with **Settings** if any server-dependent page fails to load, and check the backend status bar. Confirm the release shown under **About** is v0.0.19 before relying on the navigation and labels in this series.
