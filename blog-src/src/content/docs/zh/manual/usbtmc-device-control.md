---
title: USBTMC 设备控制
description: 连接 USBTMC 类 SCPI 仪器，运行由描述符驱动的命令与工作流，并实时接收固件日志 — 仅限桌面端。
hero:
  tag: 仅限桌面端
---

Utils 页面的 **Device Control** 标签页用于驱动任何 USBTMC 类 SCPI 仪器。目标
设备的命令集没有任何硬编码 — 连接时，面板会查询设备自身的自描述信息，根据固件
声明的内容动态生成命令按钮、工作流卡片和结果表格。一块暴露 SCPI-over-USBTMC
接口的 ESP32-S3、一块 nRF52840、一块 Pico，各自会呈现不同的面板。

## 平台与权限要求

USBTMC 控制需要直接枚举 USB 总线，仅在 Linux、macOS 和 Windows 上可用。在
Android、iOS 和 Web 端，面板显示 "Desktop only" 状态，Rust 桥接层对所有调用
返回 desktop-only 错误。

Linux 上，运行 UI 的用户必须对 USB 设备文件有读写权限。多数发行版将
`/dev/bus/usb/*` 限制为 `plugdev` 或 `usb` 组。如果扫描能发现设备但 `open`
报权限错误，请将用户加入对应组，或为设备的 VID:PID 安装一条 udev 规则。

## 连接生命周期

面板顶部的设备卡片驱动一个五阶段状态机：

| 阶段 | 发生了什么 | 界面 |
|---|---|---|
| **Idle** | 尚未扫描，或上次扫描未发现设备 | "Scan for Devices" 按钮 |
| **Scanning** | 枚举 USB 总线，筛选接口类 0xFE / 子类 0x03（USBTMC） | 转圈 + "Scanning…" |
| **Found** | 发现一个或多个 USBTMC 设备，用户选择其中一个 | 设备下拉 + "Connect" 按钮 |
| **Connecting** | 占用 bulk 端点并建立会话 | 转圈 + "Connecting…" |
| **Connected** | 会话已建立；IDN、能力、描述符和命令头目录均已读取 | 状态点变绿 + "Disconnect" 按钮 |

每个设备由 USB 拓扑地址（`bus_number` / `device_address`）标识，而非序列号
— 即使是多块相同型号且无序列号的设备，也能无歧义区分。`open` 时生成一个
UUID v4 会话 ID，后续所有调用都使用它。

**扫描**始终是手动触发 — 面板初始为 Idle 状态，等待用户点击。这避免了持续
轮询 USB 总线。Found 阶段提供 "Rescan" 按钮，重新扫描后如果之前选中的设备
仍然存在，则保持选中。

**断开**会关闭会话（从注册表中移除）、停止固件日志读取线程、取消任何待处理的
交互式提示，并将面板重置为 Idle。

## 命令集的发现方式

连接时，面板依次发出四个查询。每个查询都是可选的 — 较旧或最小化固件可能不
实现全部查询，失败会被静默忽略：

1. `*IDN?` — 厂商、产品、序列号、固件版本（按四个逗号分割）。
2. `SYSTem:CAPabilities?` — 协议版本、MTU、功能列表。
3. `SYSTem:HELP:DESCription?` — 结构化自描述（描述符）。
4. `SYSTem:HELP:HEADers?` — 扁平命令模式目录（回退方案）。

### 描述符

当设备实现了 `SYST:HELP:DESC?` 时，响应是一个 IEEE-488.2 定长块
（`#<n><len><data>`），其中包含行记录：

```
DEV idn="IoTSploit,ESP32S3,0001,0.1.0" proto=1 mtu=256 max_block=4096
CMD GPIO:SET kind=command summary="Set GPIO output level" param=pin:u32:req param=value:bool:req returns=none
WF wifi-scan type=trigger_poll_fetch summary="Scan for Wi-Fi access points" trigger=WLAN:SCAN done=WLAN:SCAN:DONE?:1 count=WLAN:SCAN:COUNt? fetch=WLAN:SCAN?#index timeout_ms=15000 poll_ms=250
```

识别三种标签：

| 标签 | 内容 |
|---|---|
| `DEV` | 设备身份、协议版本、MTU、最大块大小 |
| `CMD` | 一条 SCPI 命令：模式、类型（command/query/block）、摘要、参数、返回类型 |
| `WF` | 一个工作流：类型、触发命令、轮询/完成、计数、取值、字段、提示、超时 |

解析器前向兼容 — 未知的标签和键会被静默跳过，固件新增元数据不会破坏旧版主机。

### 回退命令头目录

当设备不实现 `SYST:HELP:DESC?` 时，面板回退到 `SYST:HELP:HEAD?` — 一个换行
分隔的命令模式列表。它们以纯模式填充 Quick Commands（没有摘要、没有参数、
没有工作流）。面板仍然可用，只是少了工作流卡片和参数占位符。

## Quick Commands

Quick Commands 面板为每个发现的命令渲染一个芯片。每个芯片显示 SCPI 模式
和（如果有）一行摘要。点击芯片会将模式连同 `<param>` 占位符填入控制台输入框：

```
GPIO:SET <pin>,<value>
```

用户补全参数后按回车发送。一行是查询还是写入，通过检查头部 token 上是否有
`?` 来判断 — 所以 `GPIO:GET? 3` 是查询，`GPIO:SET 3,1` 是写入。

## Quick Workflows

Quick Workflows 面板为每个描述符定义的工作流渲染一个卡片。工作流是设备声明的
SCPI 配方，主机作为一个动作执行 — 用户点击，面板自动运行整个序列。

支持两种工作流类型：

### trigger_poll_fetch

扫描并收集序列：

1. **触发** — 发送触发命令（如 `WLAN:SCAN`）。
2. **轮询** — 反复查询完成查询（如 `WLAN:SCAN:DONE?`），直到返回完成值
   （`1`）或超时。
3. **计数** — 查询计数查询（如 `WLAN:SCAN:COUNt?`）获取结果数量。
4. **取值** — 按索引查询取值查询（如 `WLAN:SCAN? 0`、`WLAN:SCAN? 1`、…）。
   这些查询静默执行（不记录到控制台），避免刷屏。
5. **表格** — 按描述符的 `fields=` 模式将每行解析为有类型的 `ResultTable`，
   内联渲染到工作流卡片下方。

轮询间隔和超时来自描述符（`poll_ms`、`timeout_ms`），默认 250 ms 和 15 000 ms。

### trigger_poll_interactive

带工作流中途用户提示的状态机序列（如 BLE 配对）：

1. **触发** — 发送触发命令（如 `BLE:PAIR`）。
2. **轮询状态** — 反复查询状态查询（如 `BLE:PAIR:STATe?`）。
3. **提示** — 当状态进入有 `prompt=` 条目的值时，触发一次提示。提示类型决定
   界面：
   - **passkey** — 文本输入（仅数字），发送 `<send_cmd> <value>`。
   - **number** — 数字文本输入，发送 `<send_cmd> <value>`。
   - **text** — 自由文本输入，发送 `<send_cmd> <value>`。
   - **confirm** — 显示一个数值比较值，Accept/Reject 按钮，发送
     `<send_cmd> 1` 或 `<send_cmd> 0`。
   - **display** — 显示一个值（如需要在对端输入的 passkey），"Continue" 按钮，
     不发送任何内容。
4. **成功 / 失败** — 状态到达 `success=` 值时工作流完成；到达 `failed=` 值时
   失败；超时则以最后已知状态失败。

提示为边沿触发：每个提示在进入其状态时触发一次，离开再进入时重新触发。同时
最多只有一个提示待处理。

### 必需参数

如果工作流的触发命令有必需参数（用 `param=<name>:<type>:req` 声明），面板在
运行前收集它们：

- 带选项源的参数（`param=…|<count_query>|<fetch_query>`）通过选择对话框收集，
  选项列表由查询设备填充。
- 其他必需参数通过文本表单收集。

### 结果渲染

Fetch 工作流产生有类型的 `ResultTable`。列模式来自描述符的 `fields=` 键：

```
fields=ssid:string,rssi:i32:dbm,channel:u32,authmode:string,bssid:mac
```

| 类型 | Dart 单元 | 渲染 |
|---|---|---|
| `string` | `StrCell` | 左对齐文本 |
| `i32` / `i64` | `IntCell` | 右对齐整数 |
| `u32` / `u64` | `IntCell` | 右对齐无符号整数 |
| `f64` / `f32` | `FloatCell` | 右对齐，去掉末尾 `.0` |
| `bool` | `BoolCell` | 勾选 / 横线图标 |
| `mac` | `StrCell` | 左对齐，按字符串处理 |
| `hex` | `StrCell` | 左对齐，按字符串处理 |

表头显示行数标签和 "Copy as TSV" 按钮。数字列右对齐；单位提示（如 `dBm`、
`MHz`）追加到列头和单元格值后。当描述符未声明列时，使用单个 `value:string`
回退列，行渲染为等宽文本行。

交互式工作流可选地携带一个 `result=` 查询（如 `BLE:SEC?`），在到达成功状态
后执行。其响应按 `result_fields=` 模式解析，以两列键值表格渲染到工作流卡片
下方。

## SCPI 控制台

Command Console 标签页是原始 SCPI 终端。底部的输入框接受任何 SCPI 行：

- 头部 token 上有 `?` 的行是查询 — 读取响应并显示。
- 其他行是写入 — 记录 `OK`，不读响应。
- 匹配 SCPI 错误队列模式（`-<code>,<message>`）的响应以红色标记。

控制台日志带时间戳，按类型着色：发送（蓝色）、接收（白色）、OK（绿色）、错误
（红色）、工作流（青色）、系统（灰色）。表头有复制和清空按钮。

描述符卡片上的 `*RST` 按钮重置设备 — 发送 `*RST` 并排空响应队列。

## 固件日志控制台

Firmware Log 标签页从厂商日志接口（USB bulk-IN 端点 0x82）实时流式接收设备
日志输出。该路径独立于 SCPI 命令路径 — 日志和命令在各自的 USB 接口上并发运行。

Rust 侧启动一个专用读取线程：

1. 占用设备的第二个（厂商特定）USB 接口。
2. 以 500 ms 超时读取 bulk-IN 传输。
3. 在 carry 缓冲区中拼接不完整行，按换行分割。
4. 如果换行迟迟不来，carry 缓冲区在 8 192 字节时强制刷新（限制内存）。
5. 去除每行的 ANSI 颜色转义序列。
6. 根据开头的 ESP-IDF 日志字母分类严重级别：`E` → error、`W` → warn、
   `I` → info、`D`/`V` → debug。
7. 将每行解码后的内容（时间戳、级别、文本）转发给 Dart。

Dart 侧维护一个 5 000 行上限的环形缓冲区。当 Firmware Log 标签页未聚焦时，
未读计数器累加。控制台表头提供暂停/恢复和复制/清空控件。

如果设备不实现厂商日志接口，流会发出一行错误信息，SCPI 路径不受影响。

## 局限

- **仅限桌面端。** Android、iOS 和 Web 上无 USB 访问。Android USB host 支持
  是后续计划，尚未实现。
- **设备特定。** 显示的每条命令和每个工作流取决于固件声明的內容。不实现
  `SYST:HELP:DESC?` 或 `SYST:HELP:HEAD?` 的设备将显示空命令列表 — 使用原始
  SCPI 控制台手动驱动。
- **每次命令后不排空 SCPI 错误队列。** 只有 `*RST` 和显式的错误读取命令
  排空队列。原始写入刻意不排空 — 这是有意保留的
  原始写入逃生舱。
- **日志流需要厂商特定接口。** 不带 bulk-IN 0x82 日志接口的固件将显示一行
  "stream unavailable" 且无后续输出。
- **USB 断开后不自动重连。** 如果设备被物理移除，日志读取线程结束，后续 SCPI
  调用将报错。用户需要断开再重新连接。

## SCPI 命令参考

| SCPI | 说明 |
|---|---|
| — | 枚举 USBTMC 类设备 |
| — | 按总线/地址打开会话 |
| — | 关闭并释放会话 |
| `*IDN?` | 厂商、产品、序列号、固件版本 |
| `SYST:CAP?` | 协议、MTU、功能 |
| `*RST` | 重置设备 |
| `SYST:ERR?` | 排空 SCPI 错误队列 |
| 任意 `?` 行 | 原始 SCPI 查询 |
| 任意非 `?` 行 | 原始 SCPI 写入（不排空） |
| `GPIO:SET <pin>,<level>` | 设置 GPIO 引脚 |
| `GPIO:GET? <pin>` | 读取 GPIO 引脚 |
| `ADC:READ? <channel>` | 读取 ADC 通道 |
| `WLAN:SCAN` + poll + fetch | Wi-Fi AP 扫描 |
| `BLE:SCAN <secs>` + poll + fetch | BLE 设备扫描 |
| `BLE:CONNect <idx>` | 连接 BLE 设备 |
| `BLE:DISConnect` | 断开 BLE |
| `BLE:PAIR` | 发起 BLE 配对 |
| `BLE:PAIR:PASSKey <key>` | 提交配对 passkey |
| `BLE:PAIR:CONFirm` | 确认数值比较 |
| `BLE:PAIR:NUMCmp?` | 读取数值比较值 |
| — | 流式接收厂商日志行（bulk-IN 0x82） |

## 故障排查

**扫描不到设备。** 检查设备已插入、已通电，并暴露 USBTMC 接口（类 0xFE，子类
0x03）。非 USBTMC 的 USB 设备会被过滤掉。

**Open 报权限错误（Linux）。** 用户账号对 `/dev/bus/usb/<bus>/<addr>` 缺少
权限。将用户加入 `plugdev` 或 `usb` 组，或为设备 VID:PID 安装一条 udev 规则。

**连接成功但没有命令出现。** 设备不实现 `SYST:HELP:DESC?` 或
`SYST:HELP:HEAD?`。使用原始 SCPI 控制台手动发送命令（试试 `*IDN?` 或
`*CLS`）。

**工作流超时。** 设备在描述符的 `timeout_ms` 内未报告完成值（或成功状态）。
检查触发前设备是否处于预期状态，以及任何前置条件（如先执行一次扫描）是否
已满足。

**Firmware Log 标签页显示 "stream unavailable"。** 设备不实现厂商日志接口
（bulk-IN 0x82）。这不影响 SCPI 命令。
