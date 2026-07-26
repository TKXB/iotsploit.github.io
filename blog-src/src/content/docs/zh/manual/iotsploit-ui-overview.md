---
title: IoTSploit UI 功能地图与入门路径
description: 根据连接服务、准备目标、运行测试或使用独立工具等任务，找到合适的 IoTSploit 功能入口。
---

IoTSploit 将多种 IoT 安全测试工作流集中在一个应用中。这份功能地图帮助你按任务选择入口，不要求你先了解应用的内部实现。

本文以公开发布的 **v0.0.16** 为准。页面出现在菜单中，并不代表当前设备已经满足它的硬件、服务或平台要求。

:::caution[仅在获得授权时使用]
只测试自己拥有或已获得明确授权的设备、网络、固件和服务。硬件测试应与车辆、生产网络和安全关键设备隔离。
:::

## 按任务选择功能

| 你的任务 | 从这里开始 | 应该得到什么 |
|---|---|---|
| 连接 IoTSploit 服务 | **Settings** | 已保存的 API、WebSocket 地址和成功的连接检查 |
| 定义待评估系统 | **Targets** | 可供插件执行选择的目标 |
| 准备已连接硬件 | **Drivers** | 已启用的驱动和检测到的设备 |
| 对目标运行一个插件 | **Control Panel** | 实时执行消息和保存的结果 |
| 浏览或组织插件 | **Plugins** | 单个插件、插件组和历史结果 |
| 使用独立工具 | **Toolkit** | 在本机或通过已配置服务产生的工具结果 |
| 配置模糊测试 | **Fuzzer** | 测试定义、执行状态和结果文件 |
| 使用固件或 USBTMC 工具 | **Utils** | 依赖设备或服务的工具面板 |
| 建立攻击路径模型 | **Threat Modeler** | 托管的 Attack Path Analysis 应用 |

v0.0.16 的正式版菜单还包含 **JTAG Boundary Scan**。只有在探针、BSDL 文件和实验硬件均已确认兼容时才可使用。本系列目前不提供经过硬件验证的 JTAG 操作步骤。

## 了解不同构建

IoTSploit 提供不同的构建类型：

- **Production** 是公开发布的应用，启动后进入 **Control Panel**。
- **Development** 包含用于开发和测试的实验界面。
- **Offline** 的应用名称为 **Toolkit**，启动后进入工具箱，并隐藏依赖服务器的页面。

v0.0.16 的离线工具箱包含 **File Obfuscation**、**Key Tool**、**Port Scanner** 和 **SSH Client**。其中 Key Tool、Port Scanner 和 SSH Client 需要原生构建，不会出现在 Web 版本中。

## 完成一次插件测试

典型的授权插件测试流程如下：

1. 在 **Settings** 中配置 API 和 WebSocket 地址。
2. 在 **Targets** 中创建或选择已获授权的测试目标。
3. 如果插件需要外接硬件，在 **Drivers** 中准备驱动和设备。
4. 在 **Control Panel** 或 **Plugins** 中选择插件。
5. 启动前阅读插件说明并检查参数。
6. 观察执行消息。
7. 在 **Test Results** 中查看保存的结果，并结合目标环境进行判断。

插件报告成功，只表示插件完成并返回了成功状态，不能单独证明设备安全或存在漏洞。

## 了解数据和操作发生在哪里

- **本地工具：** File Obfuscation、Key Tool、Port Scanner 和 SSH Client 的主要操作在运行 IoTSploit 的设备上完成。
- **依赖服务的功能：** Control Panel、Targets、Drivers、插件执行、插件组、CAN Analysis、Ubertooth 和 Fuzzer 工作流需要已配置的 IoTSploit 服务。以前保存的插件结果可以在本机查看。
- **依赖硬件的功能：** Drivers、CAN Analysis、Ubertooth、JTAG、FTDI UART、GreatFET 和 USBTMC 工具需要兼容硬件及操作系统访问权限。
- **托管功能：** Threat Modeler 打开独立的托管应用。它的模型配置和数据处理不由本地 IoTSploit 应用控制。

## 平台说明

- Web 版本会隐藏 Key Tool、Port Scanner、SSH Client 和 FTDI UART 等原生工具。
- v0.0.16 仅在 Web、macOS 和 Windows 上显示 Threat Modeler。
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

如果依赖服务的页面无法加载，请先打开 **Settings**。依照本系列操作前，还应在 **About** 中确认版本为 v0.0.16。
