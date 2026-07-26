---
title: IoTSploit UI feature map and where to start
description: Find the right IoTSploit area for configuring services, preparing a target, running a test, or using a standalone tool.
---

IoTSploit brings several IoT security workflows into one application. This map helps you choose a starting point without requiring you to understand how the application is implemented.

This guide covers the public **v0.0.16** release. A page being visible does not guarantee that its hardware, server, or platform requirements are met.

:::caution[Use only with authorization]
Only test devices, networks, firmware, and services that you own or have explicit permission to assess. Isolate hardware tests from vehicles, production networks, and safety-critical equipment.
:::

## Choose an area by task

| Your task | Start here | What you should expect |
|---|---|---|
| Connect the application to IoTSploit services | **Settings** | Saved API and WebSocket addresses and a successful connectivity check |
| Define the system you are assessing | **Targets** | A target that can be selected for plugin execution |
| Prepare connected hardware | **Drivers** | Enabled drivers and detected devices |
| Run one plugin against a target | **Control Panel** | Live execution messages and a saved result |
| Browse or organize plugins | **Plugins** | Individual plugins, plugin groups, and stored results |
| Use a focused utility | **Toolkit** | A tool-specific result produced locally or through the configured server |
| Configure a fuzzing campaign | **Fuzzer** | Test definitions, execution status, and result artifacts |
| Work with firmware or USBTMC devices | **Utils** | Device- or service-dependent utility panels |
| Model an attack path | **Threat Modeler** | The hosted Attack Path Analysis application |

**JTAG Boundary Scan** also appears in the v0.0.16 production menu. Use it only with compatible probes, a verified BSDL file, and expendable lab hardware. This documentation series does not yet include a tested JTAG procedure.

## Understand the application builds

IoTSploit is distributed in different build flavors:

- **Production** is the public application and starts on **Control Panel**.
- **Development** includes experimental screens intended for development and testing.
- **Offline** is titled **Toolkit** and starts on the Toolkit page. It omits server-dependent pages.

In v0.0.16, the offline Toolkit includes **File Obfuscation**, **Key Tool**, **Port Scanner**, and **SSH Client**. Key Tool, Port Scanner, and SSH Client require a native build and do not appear in the Web build.

## Follow the main plugin workflow

For a typical authorized plugin test:

1. Open **Settings** and configure the API and WebSocket addresses.
2. Open **Targets**, create or select the target you are permitted to test.
3. Open **Drivers** if the plugin needs attached hardware.
4. Open **Control Panel** or **Plugins** and choose a plugin.
5. Review its description and parameters before starting it.
6. Watch the execution messages.
7. Open **Test Results** and interpret the saved result in the context of the target.

A successful plugin run means the plugin completed and reported success. It does not, by itself, prove that a device is secure or vulnerable.

## Know where work happens

- **Local tools:** File Obfuscation, Key Tool, Port Scanner, and SSH Client perform their main operation on the device running IoTSploit.
- **Server-dependent areas:** Control Panel, Targets, Drivers, plugin execution, plugin groups, CAN Analysis, Ubertooth, and Fuzzer workflows depend on configured IoTSploit services. Previously saved plugin results can be viewed locally.
- **Hardware-dependent areas:** Drivers, CAN Analysis, Ubertooth, JTAG, FTDI UART, GreatFET, and USBTMC utilities require compatible hardware and operating-system access.
- **Hosted area:** Threat Modeler opens a separate hosted application. Its model settings and data handling are not controlled by the local IoTSploit application.

## Platform notes

- The Web build hides native tools such as Key Tool, Port Scanner, SSH Client, and FTDI UART.
- Threat Modeler is shown on Web, macOS, and Windows in v0.0.16.
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

Start with **Settings** if any server-dependent page fails to load. Confirm the release shown under **About** is v0.0.16 before relying on the navigation and labels in this series.
