---
title: 从控制面板运行一次授权测试
description: 在控制面板中选择目标、管理驱动程序、执行插件，并阅读执行日志和系统日志。
---

控制面板是你对选定目标执行授权插件测试的地方。它把目标清单、插件目录、流式执行终端和后端服务器日志放在同一个界面上。你选择一个目标，选定一个插件，按下 Execute，然后同步或通过 WebSocket 流式读取返回结果。

本指南记录正式版中所有可见标签和行为。涵盖初始数据加载、目标和设备选择、驱动程序管理、插件参数提示、同步与异步执行、两个日志选项卡，以及应用停止、需要人工分析的边界。

:::caution[Use only with authorization]
插件执行会向已配置的后端发送命令，后端可能与真实设备、网络或固件交互。对你不拥有或未获授权的系统运行插件可能违法。在按下 Execute 之前，请先明确实验室范围和授权边界。
:::

## 打开控制面板

1. 打开 IoTSploit 应用（正式版）。
2. 在侧边菜单中选择 **Control Panel**。

宽屏（980 px 或以上）下，控制面板采用三栏布局：

- **左栏** — 资产清单：目标和已连接的硬件设备，可搜索。
- **中栏** — 上方是插件表格，下方是日志终端。
- **右栏** — 所选资产的详情面板。

窄屏下三栏纵向堆叠。

## 前置条件

- **构建版本**：正式版或开发版。离线版不包含控制面板。
- **服务器**：可访问的 API 服务器和 WebSocket 服务器。如果服务器未配置，控制面板会显示连接错误横幅。请先按照[连接 IoTSploit 服务](/blog/zh/manual/server-and-build-setup/)完成配置。
- **目标**：至少需要一个可选目标才能执行插件。请先在 **Targets** 页面创建目标。
- **驱动程序**（可选）：如果插件需要硬件驱动程序，该驱动必须已启用且设备已连接。

## 初始数据加载

控制面板打开时并行加载三组数据：

1. **插件** — `GET /api/list_plugin_info/` 返回插件目录。每个插件包含名称、版本、作者、描述、可选参数映射和加载状态。
2. **目标** — `GET /api/list_targets/` 返回目标清单。每个目标包含 ID、名称、类型、IP 地址、状态、位置、协议以及组件/接口数量。
3. **设备** — 分三步加载：
   - `GET /api/get_driver_states/` 返回各硬件驱动程序的启用/禁用状态。
   - `GET /api/list_device_drivers/` 返回可用驱动程序名称列表。
   - 对每个驱动程序调用 `GET /api/scan_device/<driver>/` 扫描已连接设备。只有至少有一台设备连接的驱动程序才出现在左栏。

任一请求失败时，顶部会出现横幅：`Unable to connect to backend at <host>`。横幅提供 **Retry** 按钮（重新加载所有数据）和 **API Settings** 按钮（跳转到设置页面）。

首次加载时自动选中列表中的第一个目标。你可以点选其他目标来更改。

## 选择目标

在左栏点击一个目标，应用会发送 `POST /api/select_target/`，请求体为 `{"target_id": "<id>"}`。选中的目标在资产列表中标记 `TARGET` 徽章，在详情面板中显示 `SELECTED FOR RUN` 标签。

必须选中目标才能执行插件。所有插件行的 **Execute** 按钮在未选目标时处于禁用状态。如果你在未选目标时按 Execute，应用会提示 `Select a target first`。

如果选择请求失败，应用提示 `Failed to select target`。插件执行器保持禁用，直到成功选中一个目标。

## 选择设备并管理驱动程序

在左栏点击硬件设备，右栏会打开其详情。详情包括驱动程序 ID、类型、状态（`ENABLED` 或 `DISABLED`）和已连接设备数量。

详情面板有两个操作按钮：

- **Enable driver** — 发送 `POST /api/enable_driver/`，请求体为 `{"driver_name": "<name>", "description": "Changed from Control Panel"}`。
- **Disable driver** — 发送 `POST /api/disable_driver/`，请求体相同。

成功时驱动状态更新，提示 `Driver <name> enabled` 或 `Driver <name> disabled`。失败时提示 `Failed to update driver` 或 `Error updating driver: <error>`。

当插件需要特定硬件接口时，驱动程序状态很关键。驱动被禁用可能导致插件在运行时报错，即使它看起来已经成功启动。

## 选择并执行插件

中栏显示插件表格，列标题为：**PLUGIN NAME**、**VERSION**、**AUTHOR**、**DESCRIPTION**、**ACTIONS**。表格上方有搜索框，可按名称、描述或作者筛选插件。

### 插件行状态

| 视觉元素 | 含义 |
|---|---|
| 琥珀色圆点 + `Running` 标签 | 插件正在执行 |
| 绿色圆点 + `Completed` 标签 | 插件成功完成 |
| 红色圆点 + `Failed` 标签 | 插件执行失败 |
| `Plugin failed to load — cannot execute` | 插件报告加载错误，Execute 被禁用 |
| `Execute` 按钮（灰色） | 未选目标、其他插件正在运行或插件加载失败 |
| `Stop` 按钮（红色） | 插件正在运行，点击可中止 |

同一时间只能运行一个插件。一个插件运行期间，其他所有 **Execute** 按钮被禁用。

### 参数提示

如果插件声明了参数（info 中有非空的 `Parameters` 映射），按 **Execute** 后会先弹出对话框：

- 标题为 `Enter Parameters`。
- 提示文字为 `Provide the required parameters for this plugin.`。
- 每个参数变成一个文本框，标签为参数键名，提示为参数描述，默认值预填。
- 声明为 `int` 类型的参数使用数字键盘。
- **Execute** 确认并继续。**Cancel** 中止，不启动插件。

无参数的插件直接开始执行。

### 执行启动

执行开始时，终端清空并打印首行：

```text
$ execute_plugin <plugin_name> --target <target_id>
```

应用发送 `POST /api/execute_plugin/`，请求体包含插件名称和（如有）参数值。响应信封包含 `status` 字段和 `execution_type`：

- **`sync`** — 结果内联返回。
- **`async`** — 返回 `task_id`，进度通过 WebSocket 流式传输。

## 同步执行

后端返回同步结果时，终端打印：

```text
[ OK ] <message>
```

或

```text
[FAIL] <message>
```

结果 `data` 映射中的每个键值对以缩进行打印：

```text
  <key>: <value>
```

插件行更新为 `Completed`（绿色）或 `Failed`（红色），附带结果消息。

## 异步执行与 WebSocket 进度

后端启动异步任务时，终端打印：

```text
[INFO] task <task_id> started — streaming…
```

应用连接到 `ws://<ws_base_url>/ws/exploit/<task_id>/`（如 API 使用 HTTPS，协议归一化为 `wss`）。每个 WebSocket 帧是一个 JSON 对象，包含以下一种或两种字段：

- `message` — 进度更新。终端打印 `[INFO] <message>`，状态消息随之更新。
- `status` 设为 `"complete"` 且附带 `result` 对象 — 最终结果。终端打印 `[ OK ] <message>` 或 `[FAIL] <message>`，随后打印 `data` 中的每个键值对。之后 WebSocket 关闭。

如果 WebSocket 连接出错，终端打印 `[FAIL] connection error: <error>`，插件标记为失败。如果连接在未收到完成帧前关闭，插件标记为失败，消息为 `Connection closed`。

## 中止正在运行的插件

按 **Stop** 可中止正在运行的插件。应用关闭 WebSocket 通道，将插件标记为 `Failed`，消息为 `Stopped by operator`，终端打印 `[WARN] run stopped by operator`。

中止不会向后端发送取消请求。后端任务可能在 UI 报告停止后继续运行。

## 执行状态

| 状态 | 颜色 | 标签 | 进度条 | 说明 |
|---|---|---|---|---|
| Running | 琥珀色 | `Running` | 不定式动画 | 计时器每 300 ms 更新（mm:ss） |
| Completed | 绿色 | `Completed: <message>` | 满条 | 结果保存到测试结果 |
| Failed | 红色 | `Failed: <message>` | 满条 | 结果保存到测试结果 |

完成和失败的结果都会持久化到共享测试结果存储（SharedPreferences，键 `plugin_test_results`）。每条保存的结果包含 UUID、插件名称、时间戳、成功标志、消息、数据映射、目标 ID 和目标名称。结果可在 **Test Results** 页面查看。

## 执行日志与系统日志

终端区域有两个选项卡：**Execution** 和 **System**。

### Execution 选项卡

Execution 选项卡显示当前插件运行的输出。深色终端视口，等宽字体。为空时显示：

```text
$ waiting — select a target and press Execute on a plugin…
```

日志行类型及其颜色：

| 级别 | 颜色 | 含义 |
|---|---|---|
| `info` | 蓝色 | WebSocket 进度消息 |
| `ok` | 绿色 | 成功完成 |
| `warn` | 琥珀色 | 操作员中止或警告 |
| `err` | 红色 | 错误或失败 |
| `data` | 暗色 | 键值结果数据 |
| `muted` | 微弱 | 命令回显 |

Execution 日志有 **Copy** 和 **Clear** 按钮。运行期间 Clear 被禁用。

### System 选项卡

System 选项卡（标题为 **Console Logs**）实时显示后端服务器日志。它通过 `ws://<ws_base_url>/ws/console_logs/` 进行实时流式连接。如果 WebSocket 不可用，回退到 `GET /api/console_logs/` 获取历史日志，每 5 秒刷新一次。

底部的连接状态指示器显示 `Live updates`（已连接）或 `Periodic refresh`（已断开）。头部显示 Wi-Fi 图标，连接时为绿色，断开时为琥珀色。WebSocket 断开后，面板在 5 秒后尝试重连。

日志条目格式为：

```text
2025-05-02 09:47:26 | INFO | sat_toolkit.tools.env_mgr | Initializing Env_Mgr singleton
```

System 面板提供日志级别、来源和文本搜索筛选，以及 **Auto-scroll**、**Clear** 和 **Copy** 按钮。清除操作发送 `POST /api/console_logs/clear/`。

### 各自的用途

- **Execution** 选项卡用于跟踪单次插件运行的完整过程。
- **System** 选项卡用于诊断后端问题——驱动程序错误、插件加载失败或服务器异常，这些可能不会出现在执行终端中。

## 工作流在哪里结束

控制面板工作流在插件结果保存到测试结果存储时结束。此时：

1. 插件行显示 `Completed` 或 `Failed` 及结果消息。
2. 终端保留完整执行日志，直到你清除或开始新一轮运行。
3. 结果已持久化，可在 **Test Results** 页面查看。

接下来的工作是人工分析。应用不对发现进行分类、不分配严重性、不建议修复措施。保存的结果包含原始 `data` 映射和成功标志。分析师需要阅读数据、对照系统日志，并判断其对本次测试的意义。

## 故障排除

### 连接错误横幅：`Unable to connect to backend at <host>`

初始数据加载失败。检查设置中的 API Base URL，确认服务器进程正在运行，确认没有防火墙阻止端口。按 **Retry** 重新加载，或按 **API Settings** 更正地址。

### `Select a target first`

你在未选目标时按了 Execute。先在左栏点击一个目标。如果列表中没有目标，请在 **Targets** 页面创建。

### `Failed to select target`

`POST /api/select_target/` 请求失败。目标可能已在后端被删除，或服务器返回了错误。刷新页面后重试。如果持续出现，请查看 System 选项卡获取后端详情。

### `Failed to update driver`

`POST /api/enable_driver/` 或 `POST /api/disable_driver/` 请求失败。驱动程序名称可能无效，或后端拒绝了操作。查看 System 选项卡获取服务器端错误消息。

### 插件显示 `Failed`，消息为 `Connection closed`

异步 WebSocket 在发送完成帧前关闭。可能是后端任务崩溃、网络中断或服务器在运行中重启。查看 System 选项卡获取后端错误。如需重试，请再次执行插件。

### 插件显示 `Failed`，消息为 `Connection error: <error>`

WebSocket 连接本身无法建立或在流式传输中出错。确认设置中的 WebSocket Base URL 正确且可达。

### 插件卡在 `Running`

WebSocket 未发送完成帧。后端任务可能长时间运行或已挂起。按 **Stop** 从 UI 中止，然后查看 System 选项卡了解后端状态。中止仅关闭 UI 侧的 WebSocket，后端任务可能继续。

## 推荐流程

1. 在 **Settings** → **API Endpoints** 确认服务器可达。
2. 打开 **Control Panel**，确认目标、插件和设备正常加载，无连接错误横幅。
3. 点击一个目标进行选择。确认详情面板中出现 `SELECTED FOR RUN` 标签。
4. 如果插件需要硬件驱动程序，在左栏点击设备并在详情面板中启用驱动程序。
5. 在表格中找到插件，查看描述，按 **Execute**。
6. 如果弹出参数对话框，填写所需值并按 **Execute**。
7. 在 **Execution** 选项卡查看进度。如需后端上下文，切换到 **System** 选项卡。
8. 插件完成后，在终端中阅读结果消息和数据。
9. 在 **Test Results** 查看已保存的结果作为永久记录。

如需在控制面板之外管理目标和驱动程序，请继续阅读[目标与驱动程序](/blog/zh/manual/targets-and-drivers/)。如需了解插件目录和测试结果页面，请继续阅读[插件与测试结果](/blog/zh/manual/plugins-and-test-results/)。
