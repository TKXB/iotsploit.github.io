---
title: IoTSploit UI 功能地图与入门路径
description: 根据连接服务、准备目标、运行测试、使用独立工具或进行模糊测试等任务，找到合适的 IoTSploit 功能入口，并了解其适用的构建类型与平台。
---

IoTSploit 将多种 IoT 安全测试工作流集中在一个应用中。这份功能地图帮助你按任务选择入口，不要求你先了解应用的内部实现。

本文以公开发布的 **v0.0.19** 为准（标签 `v0.0.19`，提交 `6bb8b5b`，取证日期 2026-09-28）。页面出现在菜单中，并不代表当前设备已经满足它的硬件、服务或平台要求。

:::caution[仅在获得授权时使用]
只测试自己拥有或已获得明确授权的设备、网络、固件和服务。硬件测试应与车辆、生产网络和安全关键设备隔离。
:::

## 按任务选择功能

| 你的任务 | 从这里开始 | 应该得到什么 |
|---|---|---|
| 连接 IoTSploit 服务 | **Settings** | 已保存的 API、WebSocket 地址和成功的连接检查 |
| 快速查看后端状态 | 后端状态（导航栏底部） | 服务是否响应、服务地址和版本 |
| 定义待评估系统 | **Targets** | 可标记为当前目标并供插件执行选择的目标 |
| 准备已连接硬件 | **Drivers** | 已启用的驱动和检测到的设备 |
| 对目标运行一个插件 | **Control Panel** | 实时执行消息和保存的结果 |
| 浏览或组织插件 | **Plugins** | 单个插件、插件组和历史结果 |
| 使用独立工具 | **Toolkit** | 在本机或通过已配置服务产生的工具结果 |
| 配置或运行模糊测试 | **Fuzzer** | 测试定义、执行状态和结果文件 |
| 检查工作站和实时设备数据流 | **Utils** | 实时 CPU、内存遥测、工具就绪状态和设备数据流 |
| 建立攻击路径模型 | **Threat Modeler** | 托管的 Attack Path Analysis 应用 |

服务端只保留一个**当前目标**。**Control Panel** 标题栏会显示它，**Targets** 列表会标记它，**Plugins** 和 **Control Panel** 会针对它执行，因此在任一页面设置的目标就是其他页面使用的目标。

## 了解不同构建

IoTSploit 提供四种构建类型：

- **Production** —— 公开发布的应用，启动后进入 **Control Panel**。
- **Development** —— 额外包含 **AI Assistant** 和 **JTAG Boundary Scan**。
- **Offline** —— 应用名称为 **Toolkit**，启动后进入工具箱，只显示 **Toolkit** 和 **Settings**。它不连接后端，因此隐藏所有依赖服务的页面。
- **JTAG Boundary Scan** —— 仅桌面端的构建，启动后进入 **JTAG Boundary Scan**，只显示该页面和 **Settings**。

有两项功能并非独立页面：

- **多窗口（桌面端实验功能）。** 在 **Settings → Multiple windows** 中开启。桌面端构建随后可在导航栏右键点击页面，或使用页面标题栏的“在新窗口打开”按钮，将该页面移入独立窗口。
- **后端状态。** 会连接后端的构建会在导航栏底部显示状态栏，包含服务地址、版本以及是否响应。点击可查看详情、重新检查或跳转到 **Settings**。Offline 和 JTAG 构建没有后端，也没有状态栏。

## 各构建的功能可用性

| 功能区 | Production | Development | Offline（Toolkit） | JTAG |
|---|---|---|---|---|
| Control Panel | ✓ | ✓ | — | — |
| Utils | ✓ | ✓ | — | — |
| Plugins（列表、插件组、结果） | ✓ | ✓ | — | — |
| Toolkit | ✓ | ✓ | ✓ | — |
| Drivers | ✓ | ✓ | — | — |
| Targets | ✓ | ✓ | — | — |
| Fuzzer | ✓ | ✓ | — | — |
| Threat Modeler | ✓ | ✓ | — | — |
| Settings | ✓ | ✓ | ✓ | ✓ |
| AI Assistant | — | ✓ | — | — |
| JTAG Boundary Scan | — | ✓ | — | ✓ |

说明：

- **Threat Modeler** 仅在 Web、macOS 和 Windows 构建中显示，因为这些平台支持它使用的内嵌浏览器。它是本地 IoTSploit 进程之外的托管应用。
- 页面出现在菜单中，仍可能依赖当前环境不具备的服务、硬件或平台能力。

## 工具箱清单

**Toolkit** 网格会按构建类型和平台能力过滤，因此同一种构建在 Web 上可能比桌面端显示更少的工具。

| 工具 | Production | Offline | Web 可用 |
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

**Production** 或 **Offline** 列中的短横线表示该工具在这种构建中被隐藏；其中一些工具仍可在 **Development** 中使用。在 **Web 可用** 列中标记为不可用的工具，依赖浏览器无法提供的原生代码或直接 USB 访问。

## 完成一次插件测试

典型的授权插件测试流程如下：

1. 在 **Settings** 中配置 API 和 WebSocket 地址，或确认后端状态栏显示已连接。
2. 在 **Targets** 中创建或选择已获授权的测试目标，并将其设为当前目标。
3. 如果插件需要外接硬件，在 **Drivers** 中准备驱动和设备。
4. 在 **Control Panel** 或 **Plugins** 中选择插件。
5. 启动前阅读插件说明并检查参数。
6. 观察执行消息。
7. 在 **Test Results** 中查看保存的结果，并结合目标环境进行判断。

插件报告成功，只表示插件完成并返回了成功状态，不能单独证明设备安全或存在漏洞。

## 了解数据和操作发生在哪里

- **本地工具：** File Obfuscation、Key Tool、Port Scanner、SSH Client、Firmware Manager 和 USBTMC Console 的主要操作在运行 IoTSploit 的设备上完成。Firmware Manager 通过本地 USB 连接写入目标设备；其余工具无需服务器即可工作。
- **依赖服务的功能：** Control Panel、Targets、Drivers、插件执行、插件组、CAN Analysis、Ubertooth、Fuzzer、Device Recovery 和 Utils 需要已配置的 IoTSploit 服务。以前保存的插件结果可以在本机查看。
- **依赖硬件的功能：** Drivers、CAN Analysis、Ubertooth、JTAG、FTDI UART、GreatFET 和 USBTMC 工具需要兼容硬件及操作系统访问权限。
- **托管功能：** Threat Modeler 打开独立的托管应用。它的模型配置和数据处理不由本地 IoTSploit 应用控制。

## 平台说明

- Web 构建会隐藏依赖原生代码的工具：Key Tool、Port Scanner、SSH Client、FTDI UART、Firmware Manager 和 USBTMC Console。
- USBTMC Console 和多窗口实验需要桌面端访问权限。USBTMC 直接占用 USB 接口，多窗口会打开第二个操作系统窗口。
- v0.0.19 仅在 Web、macOS 和 Windows 构建上显示 Threat Modeler。
- 硬件访问能力取决于操作系统、驱动、权限、适配器和固件。
- 工具出现在菜单中，不代表所需服务器或硬件已包含在应用中。

## 从哪里开始

- 首次安装：[连接 IoTSploit 服务](/blog/zh/manual/server-and-build-setup/)。
- 首次插件测试：[从 Control Panel 运行授权测试](/blog/zh/manual/control-panel-workflow/)。
- 配置目标或驱动：[管理目标与硬件驱动](/blog/zh/manual/targets-and-drivers/)。
- 查看插件组和历史结果：[使用插件与测试结果](/blog/zh/manual/plugins-and-test-results/)。
- 本地密钥和证书检查：[使用 Key Tool](/blog/zh/manual/key-tool/)。
- 授权网络发现：[运行端口扫描](/blog/zh/manual/port-scanner/)。
- 远程终端或文件传输：[使用 SSH Client](/blog/zh/manual/ssh-client/)。
- 将文件封装进图片：[使用 File Obfuscator](/blog/zh/manual/file-obfuscator/)。
- 通过 USB 控制仪器：[控制 USBTMC 仪器](/blog/zh/manual/usbtmc-device-control/)。
- 写入或恢复硬件：[使用固件与恢复工具](/blog/zh/manual/firmware-and-recovery-tools/)。
- 配置模糊测试：[配置 IoT Fuzzer](/blog/zh/manual/iot-fuzzer-configuration/)。
- 编写模糊测试用例：[管理测试组与测试用例](/blog/zh/manual/iot-fuzzer-test-management/)。
- 攻击路径建模：[使用 Attack Path Analysis 应用](/blog/zh/manual/attack-path-app/)。

如果依赖服务的页面无法加载，请先打开 **Settings**，并查看后端状态栏。依照本系列操作前，还应在 **About** 中确认版本为 v0.0.19。
