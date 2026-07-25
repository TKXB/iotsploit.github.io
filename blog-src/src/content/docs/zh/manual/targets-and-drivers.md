---
title: 管理测试目标与硬件驱动
description: 创建、编辑、选择和删除测试目标；发现驱动程序、启用或禁用它们，并运行设备命令。
---

**Targets** 页面用于定义你要测试什么。**Drivers** 页面用于管理后端与真实设备通信所用的硬件接口。两个页面都向控制面板使用的同一个 API 服务器发送请求，均不在本地运行任何操作。

本指南依据正式版源码（提交 `c3f20ff8`，版本 `0.0.17+17`）记录两个页面。涵盖目标增删改查、目标编辑对话框的四个选项卡、驱动程序发现与启用/禁用、设备命令的广播与执行，以及命令结果的呈现。

:::caution[Use only with authorization]
通过 Drivers 页面发送的设备命令可能与真实硬件交互——读取芯片 ID、扫描总线或发送控制帧。对不属于你或未获授权的硬件运行这些命令可能损坏设备或违反法律。仅在授权的实验室环境中启用驱动程序并执行命令。
:::

## 前置条件

- **构建版本**：正式版或开发版。离线版不包含 Targets 和 Drivers。
- **服务器**：可访问的 API 服务器。服务器不可达时两个页面均会显示加载错误。请先按照[连接 IoTSploit 服务](/blog/zh/manual/server-and-build-setup/)完成配置。
- **Targets 页面**：需要 `GET /api/list_targets/` 成功。创建目标需要 `POST /api/create_target/`。
- **Drivers 页面**：需要 `GET /api/list_device_drivers/` 和 `GET /api/get_driver_states/` 成功。命令执行需要后端已安装相应驱动程序且已连接兼容设备。

## 目标、驱动程序与设备

| 概念 | 含义 | 存储位置 |
|---|---|---|
| 目标 | 描述被测系统的记录——名称、类型、IP、组件、接口 | 后端数据库（通过 API） |
| 驱动程序 | 后端的硬件接口模块——如 CAN 适配器、Ubertooth 或 ADB 桥接 | 后端进程 |
| 设备 | 连接到驱动程序的物理单元——通过扫描驱动程序发现 | 物理硬件 |

目标告诉后端测*什么*。驱动程序告诉后端*怎么*连接。你在控制面板中选择目标来运行插件，在 Drivers 页面或控制面板的设备面板中启用驱动程序。

## 打开 Targets 页面

1. 打开 IoTSploit 应用。
2. 在侧边菜单中选择 **Targets**。

页面打开时从 `GET /api/list_targets/` 加载目标。桌面端显示表格，移动端显示卡片网格。

### 表格列

| 列 | 内容 |
|---|---|
| Name | 目标名称 |
| Type | 类型标签（Vehicle、ECU、Phone、IoT、Router、Camera、Generic） |
| Status | Active 或 Inactive 标签 |
| Components | 已注册组件数量 |
| Interfaces | 已注册接口数量 |
| IP | IP 地址（等宽字体） |
| Location | 自由文本位置 |
| Actions | 详情、编辑、删除 |

搜索框按名称、类型或 IP 地址筛选。两个下拉菜单分别按类型和状态筛选。**Add New Target** 按钮以创建模式打开编辑对话框。

## 创建目标

按 **Add New Target**。应用生成临时 ID（`target_<时间戳>`）并以空字段打开编辑对话框。填写必填字段后按 **Save Changes**。应用发送 `POST /api/create_target/`，包含完整目标对象。成功时提示 `Target created successfully` 并刷新列表。

**name** 字段为必填。如果以空名称保存，应用提示 `Target name is required`，不会发送请求。

## 编辑目标

在目标行上按编辑图标（铅笔）。编辑对话框以当前数据打开。修改字段后按 **Save Changes**。应用发送 `POST /api/edit_target/`，请求体为 `{"target_id": "<id>", "updates": {...}}`。成功时提示 `Target updated successfully` 并刷新列表。

## 目标编辑对话框

对话框有四个选项卡。

### Basic Info

| 字段 | 输入方式 | 说明 |
|---|---|---|
| Target Name | 文本 | 必填 |
| Target Type | 下拉菜单 | 值从 `GET /api/get_target_types/` 获取；默认为 `generic` 和 `vehicle` |
| Status | 下拉菜单 | `active` 或 `inactive` |
| IP Address | 文本 | 可选 |
| Location | 文本 | 可选 |

### Properties

自由格式的键值映射。可以添加、编辑和删除属性。每个属性有名称（键）和值（字符串）。名称为必填。

### Components

附加到目标的硬件组件列表。每个组件包含：

- Component ID（必填）
- Component Name（必填）
- Component Type（下拉菜单，从 `GET /api/get_component_types/` 获取；默认：`generic`、`adb_device`、`camera`、`sensor`、`network`、`ecu`、`infotainment`）
- Status（自由文本，默认为 `active`）
- Properties（与 Properties 选项卡相同的键值子编辑器）

当组件类型为 `adb_device` 或 `infotainment` 时，显示三个额外字段：

- ADB Serial ID（可选）
- USB Vendor ID（可选）
- USB Product ID（可选）

### Interfaces

网络或调试接口列表。每个接口包含：

- Interface ID
- Interface Name
- Interface Type（自由文本——如 `diagnostic`、`usb`、`network`、`bluetooth`）
- Status

## 选择目标

点击目标行（移动端点击目标卡片）。应用发送 `POST /api/select_target/`，请求体为 `{"target_id": "<id>"}`。成功时提示 `Target selected successfully` 并高亮该行。

选中的目标是控制面板执行插件时使用的目标。在此选择目标与在控制面板中选择目标效果相同——都调用同一个端点。

## 删除目标

在目标行上按删除图标（垃圾桶）。出现确认对话框：

> Delete Target
>
> Are you sure you want to delete this target? This action cannot be undone.
>
> "<target name>"

按 **Delete** 确认。应用发送 `POST /api/delete_target/`，请求体为 `{"target_id": "<id>"}`。成功时提示 `Target deleted successfully` 并刷新列表。

## 打开 Drivers 页面

1. 在侧边菜单中选择 **Drivers**。

页面打开时加载两组数据：

- `GET /api/get_driver_states/` — 各驱动程序的启用/禁用状态。
- `GET /api/list_device_drivers/` — 可用驱动程序名称列表。

然后对每个驱动程序加载：

- `GET /api/list_device_commands/<driver_id>/` — 该驱动程序广播的命令。
- `GET /api/scan_device/<driver_id>/` — 已连接设备数量。

### 表格列

| 列 | 内容 |
|---|---|
| Driver ID | 驱动程序名称（标识符） |
| Name | 与 Driver ID 相同 |
| Driver Type | 类型标签（后端不提供时默认为 `Unknown`） |
| Connected Devices | 可点击的数字，打开详情对话框 |
| Status | 开关——`Enabled` 或 `Disabled` |
| Actions | 驱动程序广播的命令按钮 |

## 启用和禁用驱动程序

Status 列有一个开关。切换时发送：

- 启用：`POST /api/enable_driver/`，请求体为 `{"driver_name": "<name>", "description": "Changed from UI"}`
- 禁用：`POST /api/disable_driver/`，请求体相同

成功时开关更新，提示 `Driver <name> enabled successfully` 或 `Driver <name> disabled successfully`。每次切换后设备列表重新加载。

禁用的驱动程序无法执行命令——命令按钮变灰且不可交互。

## 运行设备命令

每个驱动程序广播一组命令，从 `GET /api/list_device_commands/<driver_id>/` 获取。命令以按钮形式显示在 Actions 列中。如果驱动程序有超过两个命令，前两个显示为按钮，其余在 **More** 下拉菜单中。

按下命令按钮会触发以下流程：

1. 应用调用 `GET /api/scan_device/<driver_id>/` 列出已连接设备。
2. 如果没有设备，提示 `No hardware devices available`。
3. 如果找到设备，**Select Hardware Device** 对话框列出设备及其属性（如序列号、厂商 ID、产品 ID）。
4. 选择设备并按 **Select**。
5. 应用发送 `POST /api/execute_device_command/<driver_id>/`，请求体为 `{"command": "<command>", "device_id": "<selected_device_id>"}`。
6. 结果显示在标题为 `Result from '<command>'` 的对话框中，展示后端返回的原始文本。

:::caution[Hardware commands can be destructive]
设备命令完全取决于后端驱动程序支持的功能。部分命令读取信息（芯片 ID、设备信息），其他命令可能发送控制帧、重置设备或修改状态。在按下按钮之前请阅读命令描述（以按钮提示形式显示）。先在可损耗的实验硬件上测试。
:::

## 查看已连接设备

点击 **Connected Devices** 列中的数字。应用调用 `GET /api/scan_device/<driver_id>/` 并打开标题为 `Connected Devices - <driver_id>` 的对话框，列出每个设备及其名称和属性。

如果没有设备连接，提示 `No devices connected to this driver`。

## 实现原理

Targets 和 Drivers 页面不在本地存储数据。每个操作都是向已配置的 API 服务器发送的 HTTP 请求。

**目标操作：**

| 操作 | 方法 | 端点 | 请求体 |
|---|---|---|---|
| 列出 | GET | `/api/list_targets/` | — |
| 选择 | POST | `/api/select_target/` | `{"target_id": "<id>"}` |
| 创建 | POST | `/api/create_target/` | 完整目标对象 |
| 编辑 | POST | `/api/edit_target/` | `{"target_id": "<id>", "updates": {...}}` |
| 删除 | POST | `/api/delete_target/` | `{"target_id": "<id>"}` |
| 获取类型 | GET | `/api/get_target_types/` | — |
| 获取组件类型 | GET | `/api/get_component_types/` | — |

**驱动程序操作：**

| 操作 | 方法 | 端点 | 请求体 |
|---|---|---|---|
| 列出驱动程序 | GET | `/api/list_device_drivers/` | — |
| 驱动状态 | GET | `/api/get_driver_states/` | — |
| 启用 | POST | `/api/enable_driver/` | `{"driver_name": "<name>", "description": "..."}` |
| 禁用 | POST | `/api/disable_driver/` | 相同 |
| 列出命令 | GET | `/api/list_device_commands/<driver>/` | — |
| 扫描设备 | GET | `/api/scan_device/<driver>/` | — |
| 执行命令 | POST | `/api/execute_device_command/<driver>/` | `{"command": "<cmd>", "device_id": "<id>"}` |

目标编辑对话框在打开时从后端获取目标类型和组件类型。如果这些请求失败，下拉菜单回退到硬编码默认值。

## 故障排除

### Targets 页面显示 "No Targets Yet"

后端尚未创建任何目标。按 **Add Your First Target** 创建一个。

### `Target name is required`

在编辑对话框中以空名称按了 Save Changes。填写 Target Name 字段后重新保存。

### `Error creating target: <error>` / `Error updating target: <error>`

创建或编辑请求失败。后端可能拒绝了数据（如 IP 格式无效、ID 重复）。查看控制面板的 System 选项卡获取服务器端错误消息。

### `Error deleting target: <error>`

删除请求失败。目标可能已被其他会话删除，或后端返回了错误。刷新列表后重试。

### Drivers 页面显示 "No drivers found"

后端返回了空的驱动程序列表，或请求失败。如果页面显示错误状态，按 **Retry** 重新加载。如果加载后列表为空，说明后端未配置任何硬件驱动程序。

### `Failed to update driver state: <message>`

启用/禁用请求被拒绝。后端消息说明了原因。驱动程序名称可能无效，或后端不支持该驱动程序的运行时切换。

### `No hardware devices available`

你按了命令按钮，但设备扫描未找到已连接硬件。检查物理连接、确认驱动程序已启用、确认硬件已通电。

### `Failed to execute command <command>`

`POST /api/execute_device_command/` 请求返回了非 200 状态码。后端在执行硬件命令时可能出错。查看 System 选项卡获取详情。

### 命令按钮变灰

驱动程序已禁用。切换 Status 开关以启用。如果切换失败，查看后端错误消息。

## 推荐流程

1. 打开 **Targets**，按 **Add New Target**。
2. 填写名称、类型、状态、IP 地址和位置。根据需要添加组件和接口。
3. 保存目标，确认它出现在列表中。
4. 点击目标行进行选择，确认提示 `Target selected successfully`。
5. 打开 **Drivers**，确认所需硬件驱动程序已列出并启用。
6. 如果驱动程序被禁用，将其切换为启用。
7. 点击 Connected Devices 数字，确认硬件已检测到。
8. 如果驱动程序广播了命令，先阅读提示并运行只读命令，确认硬件正常响应。
9. 打开 **Control Panel**，对选定的目标运行插件。按照[控制面板工作流](/blog/zh/manual/control-panel-workflow/)操作。

如需了解插件目录和测试结果页面，请继续阅读[插件与测试结果](/blog/zh/manual/plugins-and-test-results/)。
