---
title: 端口扫描配置与结果
description: 使用 Rust 驱动的端口扫描器从设备本地执行 TCP 或 UDP 端口扫描。
---

**端口扫描器**对目标 IP 地址的开放 TCP 或 UDP 端口进行探测。扫描完全在设备本地运行——扫描引擎为 Rust 原生代码，使用 `rustscan` crate，不向 API 服务器发送或经其转发扫描数据。本文基于 commit `c3f20ff8`（版本 `0.0.17+17`）记录该工具的使用方式。

:::caution[授权]
端口扫描会对目标产生网络流量。扫描不属于你或未经授权的主机可能违反网络策略或法律。请仅对你有权限扫描的主机使用此工具。
:::

## 前提条件

- **平台**：仅限原生构建（Android、iOS、macOS、Windows、Linux）。端口扫描器依赖 Rust 原生代码（`requiresRust: true`），在 Web 构建中被隐藏。
- **构建类型**：生产、开发、离线构建均可用。工具目录中标记为 `offlineCapable: true` 且 `prodCapable: true`。
- **服务器**：不需要。扫描器在本地运行，不需要连接 IoTSploit API 服务器。
- **网络**：运行扫描的设备必须能访问目标 IP。设备与目标之间的防火墙、NAT 或网络隔离会影响扫描结果。

## 打开端口扫描器

1. 打开 IoTSploit 应用。
2. 在侧边菜单选择 **Toolkit**。
3. 找到 **Port Scanner** 卡片（描述为 "Fast TCP/UDP port scanner powered by Rust async runtime"），点击进入。

界面包含一个配置卡片，扫描完成后在下方显示结果卡片。

## 扫描配置

| 字段 | 默认值 | 范围 | 说明 |
|---|---|---|---|
| Target IP | `127.0.0.1` | 任意有效 IP 地址 | 数字键盘输入 |
| Port Start | `1` | 1–65535 | 必须 ≤ Port End |
| Port End | `1000` | 1–65535 | 必须 ≥ Port Start |
| Batch Size | `500` | 100–5000（滑块，步长 100） | 每批并发连接数 |
| Timeout | `1500ms` | 200–5000ms（滑块，步长 100） | 每端口连接超时 |
| UDP Scan | 关 | 开/关 | TCP 与 UDP 切换 |

### 批量大小

控制同时探测的端口数量。值越大扫描越快，但会同时产生更多连接，部分主机或防火墙可能对此限速或阻断。默认值 500 在速度与隐蔽性之间做了折中。

### 超时

扫描器在每个端口上等待响应的时间，超时后标记为关闭或被过滤。较低的超时加快扫描速度，但在慢速网络上可能遗漏开放端口。默认 1500ms 适用于多数局域网扫描。

### UDP 扫描

启用后扫描器发送 UDP 探测而非 TCP SYN。UDP 扫描比 TCP 更慢且可靠性更低——开放的 UDP 端口可能不响应空探测，从而被判定为关闭。`rustscan` 对每个端口仅尝试一次。

## 执行扫描

1. 输入 **Target IP** 地址。
2. 设置 **Port Start** 和 **Port End**。
3. 按需调整 **Batch Size** 和 **Timeout**。
4. 如需 UDP 扫描则切换 **UDP Scan** 开关。
5. 按 **Start Scan**。

扫描期间按钮显示 `Scanning...` 并带旋转加载圈，按钮禁用。扫描在 Rust 侧同步执行，使用 `async_std` 运行时（与 `flutter_rust_bridge` 的 Tokio 运行时隔离）。

### 输入校验

| 检查项 | 错误消息 |
|---|---|
| 目标字段为空 | `Please enter a target IP address.` |
| 端口起始或结束非数字 | `Invalid port range. Use 1–65535, start ≤ end.` |
| 端口起始 < 1 或结束 > 65535 | 同上 |
| 端口起始 > 端口结束 | 同上 |

如果目标 IP 无法被 Rust 的 `std::net::IpAddr::parse` 解析为有效 `IpAddr`，扫描失败并显示 `Invalid IP address '<input>': <error>`。

## 结果

扫描完成后出现结果卡片：

### 汇总标签

| 标签 | 内容 | 颜色 |
|---|---|---|
| Open | 开放端口数 | 绿色 |
| Scanned | 探测端口总数 | 中性 |
| Duration | 扫描耗时（`Xms` 或 `X.Xs`） | 主色 |

### 开放端口

每个开放端口以绿色标签显示，使用等宽字体。端口按升序排列。

如果扫描范围内没有开放端口，卡片显示 `No open ports found in the specified range.`

### 复制结果

按结果卡片标题栏的复制图标，将开放端口号以逗号分隔的字符串复制到剪贴板，提示 `Open ports copied to clipboard`。

## 工作原理

`rust/src/api/port_scanner.rs` 中的 `run_port_scan` 函数：

1. 将目标字符串解析为 `std::net::IpAddr`。
2. 用起始和结束值创建 `PortRange`。
3. 通过 `PortStrategy::pick` 选择扫描策略，使用 `ScanOrder::Serial`——端口按升序探测，不随机化。
4. 创建 `rustscan::scanner::Scanner`：
   - 目标地址。
   - 批量大小作为并发上限。
   - 超时作为 `Duration::from_millis`。
   - 每端口 1 次尝试。
   - `greppable = true`（抑制 RustScan 的标准输出打印）。
   - `accessible = false`。
   - 不排除任何端口。
   - UDP 标志。
5. 通过 `async_std::task::block_on(scanner.run())` 执行扫描，返回开放套接字列表。
6. 从开放套接字提取端口号、排序，并计算 `total_scanned` = `port_end - port_start + 1`。

扫描为同步调用，阻塞 Dart Future 直到完成。使用 `async_std` 运行时而非 Tokio，以避免与 `flutter_rust_bridge` 自身运行时冲突。

### 数据结构

**PortScanConfig**（从 Dart 传入 Rust）：

| 字段 | Dart 类型 | Rust 类型 |
|---|---|---|
| target | String | String（解析为 IpAddr） |
| portStart | int | u16 |
| portEnd | int | u16 |
| batchSize | int | u32（传入 Scanner 时转为 u16） |
| timeoutMs | int | u32（转为 Duration） |
| udp | bool | bool |

**PortScanResult**（从 Rust 返回 Dart）：

| 字段 | Rust 类型 | Dart 类型 |
|---|---|---|
| open_ports | Vec<u16> | Uint16List |
| scan_duration_ms | u64 | BigInt |
| total_scanned | u32 | int |

## 已知限制

- **无服务识别。** 扫描器仅报告端口号，不进行 banner 抓取、协议识别或服务猜测。可使用 [SSH 客户端](/blog/zh/manual/ssh-client/)或其他工具与发现的服务交互。
- **不支持域名解析。** 目标字段只接受 IP 地址。Rust 侧使用 `IpAddr::parse` 解析，不执行 DNS 查询。请输入已解析的 IP。
- **扫描结果不持久化。** 结果仅存在于界面状态中。离开页面后丢失。离开前请先复制开放端口。
- **UDP 可靠性。** UDP 探测可能无法从开放端口获得响应，导致被判定为关闭。单次尝试的 UDP 扫描精度本质上低于 TCP。
- **串行扫描顺序。** 端口按升序扫描，不随机化。这是唯一可用的扫描顺序。
- **无进度流。** 扫描为单次阻塞调用，没有中间进度或部分结果——界面显示加载圈直到整个扫描完成。
- **单目标。** 每次扫描只接受一个 IP 地址，不支持网段或子网扫描。

## 故障排查

### Toolkit 页面看不到 Port Scanner 卡片

你在使用 Web 构建。端口扫描器需要 Rust 原生代码，Web 构建不包含。请使用原生构建。

### `Please enter a target IP address.`

目标字段为空。请输入 IP 地址。

### `Invalid port range. Use 1–65535, start ≤ end.`

端口起始或结束不是有效数字、超出 1–65535 范围、或起始大于结束。更正值后重试。

### `Invalid IP address '<input>': <error>`

目标字符串无法被 Rust 的 `IpAddr::parse` 解析。该函数接受 IPv4（如 `192.168.1.1`）和 IPv6（如 `::1`），但不接受主机名。如输入了主机名，请先解析为 IP。

### 扫描耗时很长

大范围端口（如 1–65535）配合低批量大小和高超时会耗时数分钟。增大批量大小、减小超时或缩小端口范围。耗时标签显示扫描所用时间。

### 未发现开放端口

扫描范围内所有端口均关闭或被过滤。确认目标 IP 正确且可达、目标主机在扫描端口上有服务监听、且无防火墙丢弃或拒绝探测。

### UDP 扫描未发现开放端口

UDP 扫描可靠性低于 TCP。端口可能开放但不响应空 UDP 探测。尝试对相同范围执行 TCP 扫描，或扫描已知会响应的 UDP 端口（如 53 DNS、123 NTP）。

## 推荐流程

1. 打开 **Toolkit**，选择 **Port Scanner**。
2. 输入目标 IP 地址。
3. 设置端口范围。快速检查可使用 1–1000 等常见范围或指定端口。
4. 多数扫描使用默认批量大小和超时。仅在扫描过慢或网络不稳定时调整。
5. 按 **Start Scan**。
6. 查看结果，记下开放端口和耗时。
7. 如需后续使用则复制开放端口。
8. 对开放端口上的 TCP 服务，可使用 [SSH 客户端](/blog/zh/manual/ssh-client/)进行交互。

SSH 终端与 SFTP 请参阅 [SSH 客户端](/blog/zh/manual/ssh-client/)。
