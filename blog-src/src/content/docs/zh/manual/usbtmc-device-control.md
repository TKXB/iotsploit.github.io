---
title: 在桌面版 Toolkit 中控制 USBTMC 仪器
description: 在 IoTSploit 桌面版 Toolkit 中扫描 USBTMC 仪器，通过 USB 或 TCP 连接，并运行设备自描述的 SCPI 命令、工作流和日志流。
---

**USBTMC Console** 把已连接的仪器变成实时的 SCPI 会话。它会扫描 USBTMC 设备，通过 USB 或 TCP 建立会话，然后根据设备自身的描述生成命令列表，而不是使用固定的按钮集合。你可以发送单条命令、运行多步工作流、读取结构化结果，并同时查看设备固件日志。

![连接前的 USBTMC Console，显示 USB 与 TCP/IP 传输切换、Commands 与 Workflows 列表，以及 Command Console、Firmware Log 和 Data Plane 标签页](/blog/images/usbtmc-console.png)

:::caution[仅在获得授权时使用]
USBTMC 命令可能改变设备状态：复位会重启设备，GPIO 写入会驱动引脚，无线扫描会发射信号。请只连接你拥有或已获授权测试的仪器，并将其隔离在实验系统中。
:::

## 可用范围

USBTMC Console 是**仅限桌面版**的工具。它需要进行原始 USB 传输，Web、Android 和 iOS 版本无法完成，因此不会在这些版本中出现。

在桌面版导航中打开：

1. 打开 **Toolkit**。
2. 选择 **USBTMC Console**。

部分版本中，同一面板会作为 **Utils** 的 **Device Control** 标签页出现。面板本身完全一致，只是入口不同。

## 开始之前

你需要：

- 一台固件提供 USBTMC 接口（class `0xFE`、subclass `0x03`）的 USB 仪器，例如运行 `iotsploit-usb` 参考固件的开发板；
- IoTSploit 的桌面版 Linux、macOS 或 Windows 构建；
- 若使用 TCP，需要仪器的地址和原始 SCPI 端口，通常为 `5025`。

### Linux 上的 USB 权限

在 Linux 上，面板打开的是设备原始节点 `/dev/bus/usb/<bus>/<device>`，而不是内核的 `/dev/usbtmcN` 字符设备。该原始节点默认是 `root:root`、权限 `0660`，普通用户在连接时会收到 `permission denied`。

安装应用附带的规则文件：

```sh
sudo cp docs/udev/99-iotsploit-usbtmc.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger
```

然后拔下并重新插入仪器。该文件通过 `plugdev` 组和 `uaccess` 向当前桌面会话授予访问权限，匹配 `iotsploit-usb` 参考设备（`1209:0001`），并附带一条被注释的规则，可匹配任何提供 USBTMC 接口、使用其他 VID 和 PID 的固件。

内核 `usbtmc` 驱动占用接口不会影响面板：后端在连接时会自行分离并占用该接口。

## 连接仪器

1. 确认仪器已连接到实验系统。
2. 选择 **USB**。
3. 选择 **Scan USB Devices**。
4. 在设备列表中选择仪器。
5. 选择 **Connect USB**。

设备卡片会依次显示 idle、scanning、found、connecting、connected 等连接状态。如果选错仪器，或需要释放设备，请选择 **Disconnect**。断开连接会关闭会话，并停止正在运行的日志流或数据流。

### 改用 TCP 连接

对于通过 Wi-Fi 或以太网访问的仪器，请选择 **TCP/IP**，输入主机地址，然后选择 **Connect TCP**。端口默认为 `5025`。连接后的操作与 USB 会话相同，只有设备日志例外，它走的是仅 USB 提供的接口。

## 控制台如何了解设备

面板本身不保存设备命令清单。连接后，它会通过 `SYSTem:HELP:DESCription?` 请求仪器自描述，返回的是包含 `DEV`、`CMD` 和 `WF` 记录的 IEEE-488.2 定长数据块。`CMD` 记录成为 **Quick Commands**，`WF` 记录成为 **Quick Workflows**。

如果设备没有实现自描述，但能响应扁平的 `SYSTem:HELP:HEADers?` 目录，面板会退回到列出这些纯命令头，此时没有摘要和工作流。

## 运行 Quick Commands 与 Workflows

左侧列表有两个分组。

- **Commands** 显示每条已声明的命令及其摘要和参数。选择后即可发送。查询类命令会填充参数，并把响应读入输出日志。
- **Workflows** 显示设备声明的多步操作。工作流会执行触发命令、轮询状态查询，然后获取结果集或进入交互提示。

以 `iotsploit-usb` 的 ESP32-S3 参考固件为例，自描述声明的命令包括：

- 数据平面控制命令 `SYSTem:STReam:STARt`、`STOP`、`STATe?`、`COUNt?`、`PORT?` 和 `FORMat?`；
- `GPIO:SET` 和 `GPIO:GET?`，用于引脚输出与输入；
- `ADC:READ?`，用于读取模拟通道；
- `WLAN:SCAN` 和 `BLE:SCAN` 系列命令，以及各自的 done、count、按索引取结果的查询，和 BLE 连接与配对命令。

组件自带的 `*IDN?`、`*RST`、`SYSTem:ERRor?` 由设备处理，但不属于自描述内容，请在 `scpi>` 输入框中发送。

例如 Wi-Fi 工作流会发送 `WLAN:SCAN`，轮询 `WLAN:SCAN:DONE?` 直到返回 `1`，读取 `WLAN:SCAN:COUNt?`，再用 `WLAN:SCAN? <index>` 逐行取回结果。

## 响应交互提示并读取结果表

有些工作流需要只有操作者才知道的信息。此时工作流不会直接失败，而是弹出内联提示并等待：

- **passkey** 要求输入对端显示的值，例如 BLE 配对码；
- **number** 和 **text** 要求输入数字或文本；
- **confirm** 显示一个值，供你接受或拒绝；
- **display** 显示一个值，让你在别处输入，不会回传任何内容。

获取类工作流完成后，面板会按照设备声明的列名和类型渲染结果行。Wi-Fi 行包含 `ssid`、`rssi`（dBm）、`channel`、`authmode` 和 `bssid`；BLE 行包含 `addr`、`rssi`（dBm）、`name` 和 `adv_type`。最近一次结果会保留在 **Results** 标签页，直到被下一次工作流替换。

## 查看命令输出与固件日志

控制台区域有三个标签页，彼此独立运行：

- **Command Console** 记录每一条收发的 SCPI 命令，包含时间戳和方向。底部的 `scpi>` 输入框可发送原始命令；查询会读取响应，普通命令不会。
- **Firmware Log** 通过第二个 USB 接口（bulk-IN `0x82`）流式读取仪器自身的日志输出。每行按严重级别着色，且在你使用 Command Console 时仍持续运行。TCP 会话下该标签页会提示日志接口不可用。
- **Data Plane** 显示设备连续数据流的原始记录。端口、记录长度和字段结构由设备声明；面板显示原始字节，或在能解析该结构时显示解码后的字段。该功能只读取设备已在发送的数据：请用设备自身的 `SYSTem:STReam` 命令启动和停止采集。

## 行为取决于设备

由于面板由自描述驱动，固件不同的两台仪器会显示不同的命令、工作流、参数类型和结果列。请把命令集以及任何引脚、通道或时序取值视为所连固件的属性，而不是应用的属性。

开始会话前，有两点差异值得注意：

- 通过 TCP 时，部分固件会拒绝 `WLAN:SCAN`，因为信道扫描会中断承载该命令的连接。面板会从错误队列报告这次拒绝，而不是等待一个会掩盖原因的超时。
- 没有数据平面的固件会返回端口 `0`，Data Plane 标签页会提示没有可流式传输的数据。

## 故障排查

| 现象 | 检查内容 |
|---|---|
| Linux 上 Connect 报 `permission denied` | 安装 udev 规则、重载规则并重新插拔设备 |
| Scan 后没有设备 | 确认接口为 USBTMC（`0xFE`/`0x03`），检查线缆和端口 |
| 提示所选设备已断开 | 重新扫描；重新插拔后 USB 地址会变化 |
| 其他工具用过设备后无法连接 | 断开其他工具；同一接口同时只能有一个会话 |
| 工作流以超时结束 | 查看固件日志；设备可能拒绝了触发命令 |
| Firmware Log 显示 `unavailable` | 当前会话使用 TCP，或固件没有厂商日志接口 |
| 命令返回 `-113,"Undefined header"` | 设备未实现该命令头；对照其自身命令列表 |

## 使用限制

- 仅支持桌面版，不支持 Web、Android 或 iOS。
- 同一设备的同一接口同时只能有一个会话。
- 应用会占用原始 USB 访问，并在会话期间分离内核 `usbtmc` 驱动。
- 命令、工作流、参数和结果列都来自固件；面板无法提供设备未声明的命令。
- 命令执行成功不是安全结论。请根据测试的预期结果核对设备行为。

## 下一步

如需准备其他仪器或查看已连接的设备，请继续阅读 [目标与硬件驱动](/blog/zh/manual/targets-and-drivers/)。如需了解各 IoTSploit 工具的运行位置，请参阅 [IoTSploit UI 功能地图](/blog/zh/manual/iotsploit-ui-overview/)。
