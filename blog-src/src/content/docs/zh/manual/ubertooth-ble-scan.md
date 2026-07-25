---
title: BLE 广播发现
description: 使用 Ubertooth One 硬件设备扫描广播信道 37、38、39 上的蓝牙低功耗广播。
---

**Ubertooth BLE Scan** 工具使用连接到 IoTSploit 服务器的 Ubertooth One 硬件适配器捕获蓝牙低功耗（BLE）广播。它通过 HTTP 向 API 服务器发送命令，服务器通过 `drv_ubertooth` 驱动控制 Ubertooth。本文档对应代码提交 `c3f20ff8`（版本 `0.0.17+17`）。

:::caution[合规提醒]
蓝牙工作在 2.4 GHz ISM 频段。捕获 BLE 流量可能受当地无线电法规约束。仅在授权测试环境中使用此工具。
:::

## 前置条件

- **平台**：所有平台，包括 Web。不依赖 Rust 原生代码（`requiresRust: false`）。
- **构建**：生产和开发 flavor 可用。标记为 `offlineCapable: false`——需要连接 IoTSploit API 服务器。
- **服务器**：必须运行且可访问。Ubertooth One 必须物理连接到服务器主机，且已安装 `drv_ubertooth` 驱动。
- **硬件**：Ubertooth One USB 适配器。屏幕加载时自动发现。

## 打开 Ubertooth BLE Scan

1. 打开 IoTSploit 应用。
2. 在侧边栏选择 **Toolkit**。
3. 找到 **Ubertooth BLE/BT** 卡片（描述为 "Bluetooth analysis with Ubertooth One"），点击进入。

屏幕标题为 **Ubertooth BLE Scan**。顶部卡片显示设备状态和扫描控件，下方为已发现的 BLE 设备列表。

## 设备发现

屏幕加载时自动扫描 Ubertooth 设备：

| 步骤 | 方法 | 端点 |
|---|---|---|
| 1 | GET | `/api/scan_device/drv_ubertooth/` |
| 2 | 解析 | 取 `body['devices']` 中的第一个设备 |
| 3 | 显示 | `Device: <device_id>` 或 `Device: 未发现` |

若未发现设备，状态文本显示 `Device: 未发现`。插入适配器后点击 **Scan Device** 按钮重新发现。

### 未发现设备

常见原因：

- Ubertooth One 未插入服务器主机。
- 服务器主机无 USB 访问权限。
- 服务器未安装 `drv_ubertooth` 驱动。
- 设备被其他进程占用。

服务器返回的错误会显示在错误状态组件中，附带重试按钮。

## 扫描控件

| 控件 | 标签 | 默认值 | 选项 |
|---|---|---|---|
| 超时时间 | Timeout | `10` | 任意正整数（秒） |
| 信道 | Ch 37 | `37` | Ch 37、Ch 38、Ch 39 |
| 扫描设备按钮 | Scan Device | — | 重新执行设备发现 |
| BLE 扫描按钮 | BLE Scan | — | 执行 BLE 广播扫描 |
| 设备信息按钮 | Device Info | — | 以 JSON 格式显示设备原始信息 |

### 信道

BLE 设备在三个专用广播信道上发送广播：37、38、39。Ubertooth 每次扫描一个信道。默认为信道 37。要覆盖所有广播信道，需分别选择三个信道运行三次扫描。

### 超时时间

扫描持续时间。默认 10 秒。扫描为同步 HTTP 调用——UI 显示加载指示器，直到服务器返回收集到的结果。

## 执行 BLE 扫描

1. 确认设备状态显示有效的设备 ID（不是 `未发现`）。
2. 设置超时时间（默认 10 秒适用于大多数环境）。
3. 选择广播信道（Ch 37、38 或 39）。
4. 点击 **BLE Scan**。

工具发送：

```
POST /api/execute_device_command/drv_ubertooth/
{
  "command": "ble_scan",
  "device_id": "<device_id>",
  "args": {
    "timeout": 10,
    "channel": 37
  }
}
```

扫描期间，列表区域显示加载指示器和文字 `正在执行 BLE 扫描...`。扫描完成后，发现的设备以卡片形式显示。

### 响应格式

服务器返回：

```json
{
  "status": "success",
  "result": {
    "devices": [
      {
        "mac": "AA:BB:CC:DD:EE:FF",
        "company": "Apple, Inc.",
        "adv_type": "ADV_IND",
        "rssi": -67
      }
    ]
  }
}
```

每个设备条目包含：

| 字段 | 类型 | 说明 |
|---|---|---|
| mac | String | BLE MAC 地址 |
| company | String（可选） | 基于 OUI 的公司识别 |
| adv_type | String（可选） | 广播类型（如 `ADV_IND`、`ADV_NONCONN_IND`） |
| rssi | Number | 接收信号强度，单位 dBm |

## 结果

每个发现的设备显示为卡片，包含：

- 蓝牙图标。
- MAC 地址（加粗）。
- 副标题行：`RSSI: <值> dBm   Company: <值>   Type: <值>`。

Company 和 Type 字段仅在响应数据中存在时显示。若字段为空或 null，则从副标题中省略。

### 空结果

若未捕获到 BLE 设备，显示空状态组件：

- 标题：`暂无 BLE 设备`
- 副标题：`点击上方按钮开始扫描`
- 操作按钮：`开始扫描`

屏幕首次加载、尚未运行扫描时也会显示此状态。

## 设备信息

点击 **Device Info** 查询 Ubertooth 的硬件和固件信息。工具发送：

```
POST /api/execute_device_command/drv_ubertooth/
{
  "command": "get_info",
  "device_id": "<device_id>",
  "args": {}
}
```

原始 JSON 响应显示在标题为 `Ubertooth 设备信息` 的对话框中。对话框包含可滚动、可选择的缩进 JSON 文本。点击 **关闭** 退出。

## 实现原理

### 依赖 API 服务器

Ubertooth BLE Scan 是纯 Dart 屏幕。仅使用 HTTP——无 WebSocket 流式传输，无 Rust 桥接。所有操作通过 API 服务器完成：

| 操作 | 方法 | 端点 | 命令 |
|---|---|---|---|
| 设备发现 | GET | `/api/scan_device/drv_ubertooth/` | — |
| BLE 扫描 | POST | `/api/execute_device_command/drv_ubertooth/` | `ble_scan` |
| 设备信息 | POST | `/api/execute_device_command/drv_ubertooth/` | `get_info` |

服务器侧的 `drv_ubertooth` 驱动负责与 Ubertooth One 的 USB 通信、固件加载和 BLE 帧捕获。

### 扫描生命周期

1. 屏幕加载 → 通过 `GET /api/scan_device/drv_ubertooth/` 自动发现设备。
2. 用户设置超时和信道。
3. 用户点击 BLE Scan → 发送 `ble_scan` 命令的 POST 请求。
4. 服务器在指定时长内捕获 BLE 广播。
5. 服务器返回收集到的设备列表。
6. UI 将结果渲染为卡片。

扫描非实时——为请求-响应周期。UI 在完整扫描时长结束、服务器一次性返回所有结果前显示加载指示器。

## 局限性

- **单设备。** 工具仅取发现响应中的第一个设备。若连接了多个 Ubertooth，其余被忽略。
- **单信道。** Ubertooth 每次扫描一个广播信道。要覆盖三个信道，需运行三次扫描。
- **无实时流。** 超时结束后结果一次性返回。无广播的实时馈送。
- **无 PCAP 导出。** 仅显示设备摘要。此屏幕不提供原始捕获数据（pcap）。
- **无后续操作。** 发现的设备无法从此屏幕选择进行进一步分析、连接或配对。
- **依赖服务器。** Ubertooth 必须连接到服务器主机，而非运行 UI 的设备。无 API 服务器无法运行。
- **中文界面标签。** 部分标签（正在扫描、未发现、暂无 BLE 设备）为硬编码中文字符串。屏幕标题和按钮标签为英文。
- **无 MAC 过滤。** 所有发现的设备都会显示。无法按 MAC、公司或 RSSI 阈值过滤。
- **扫描失败无自动重试。** BLE 扫描失败时在错误状态组件中显示错误。需手动再次点击 BLE Scan。
- **专用硬件。** 仅支持 Ubertooth One。不支持其他 BLE 捕获硬件。

## 故障排除

### Toolkit 页面看不到 Ubertooth BLE/BT 卡片

此工具不依赖 Rust，所有构建均应可见。若不可见，检查 flavor 配置——它不是离线可用工具，在离线 flavor 中可能被隐藏。

### `Device: 未发现`

服务器上未发现 Ubertooth 设备。请确认：

- Ubertooth One 已通过 USB 插入服务器主机。
- 服务器有 USB 访问权限（Linux 上运行服务器的用户可能需要 Ubertooth 厂商/产品 ID 的 udev 规则）。
- 服务器已安装并加载 `drv_ubertooth` 驱动。
- 无其他进程正在使用该设备。

点击 **Scan Device** 重新发现。

### `扫描设备失败`

对 `/api/scan_device/drv_ubertooth/` 的 GET 请求返回错误。完整错误信息显示在错误状态组件中。查看服务器日志获取详情。

### `BLE 扫描失败`

带有 `ble_scan` 命令的 POST 请求返回错误。服务器可能未加载 Ubertooth 固件、设备已断开、或信道/超时参数无效。查看服务器日志。

### 扫描后未发现 BLE 设备

扫描完成但未捕获到广播。这在选定信道上无 BLE 流量的环境中属正常。尝试：

- 增加超时时间。
- 更换信道（37、38 或 39）。
- 靠近活跃的 BLE 设备。
- 确认区域内的 BLE 设备正在积极广播。

### 设备信息对话框显示空或部分数据

`get_info` 命令返回的信息有限。可能表示 Ubertooth 固件未完全加载或设备处于异常状态。尝试拔出再插入设备，然后点击 **Scan Device**。

## 推荐工作流

1. 将 Ubertooth One 插入 IoTSploit 服务器主机。
2. 打开 **Toolkit**，选择 **Ubertooth BLE/BT**。
3. 等待自动设备发现。确认设备 ID 显示。
4. 若未发现，点击 **Scan Device**。
5. 设置超时时间（10 秒为推荐起点）。
6. 选择广播信道（从 Ch 37 开始）。
7. 点击 **BLE Scan**，等待结果。
8. 查看发现的设备——MAC 地址、RSSI、公司和广播类型。
9. 分别用 Ch 38 和 Ch 39 重复扫描，覆盖所有广播信道。
10. 如需硬件或固件信息，点击 **Device Info**。

如需 SCPI 仪器控制，请继续阅读 [USBTMC device control](/blog/zh/manual/usbtmc-device-control/)。
