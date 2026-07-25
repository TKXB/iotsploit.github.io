---
title: 从插件选择到测试结果
description: 浏览插件目录、执行单个插件或插件组、查看执行进度、回顾已保存的测试结果。
---

**插件**页面列出后端可以运行的模块。**插件组**页面将多个插件编排为有序序列。**测试结果**页面保存每次执行后的输出。本文记录这三个页面的完整使用流程。

:::caution[授权提示]
插件对当前选中的目标执行操作。如果目标为真实硬件或线上服务，插件的行为取决于其自身逻辑——可能读取数据、发送帧或修改状态。请仅对已获授权的目标运行插件。
:::

## 前提条件

- **构建类型**：生产或开发构建。离线构建不包含插件页面。
- **服务器**：需要可连接的 API 服务器。请先参照[服务器与构建配置](/blog/zh/manual/server-and-build-setup/)完成设置。
- **目标**：执行插件前必须选中一个目标。可以在[目标与驱动页面](/blog/zh/manual/targets-and-drivers/)选择，也可以在插件页面的目标下拉框中选择。
- **插件页面**：依赖 `GET /api/list_plugin_info/` 正常返回。
- **插件组页面**：依赖 `GET /api/list_groups/` 和 `GET /api/list_plugins/` 正常返回。
- **测试结果页面**：从本地存储读取数据，查看已保存结果不需要服务器连接。

## 打开插件页面

1. 在侧边菜单选择 **Plugins**。

页面打开时调用 `GET /api/list_plugin_info/`。响应中的 `status` 字段为 `success` 或 `partial` 均可接受。每个插件是一个映射，包含 `name`、`status`、`path`，以及一个 `info` 对象（含 `Description`、`Version`、`Author`，可选 `Parameters`）。

### 表格列

| 列 | 内容 |
|---|---|
| Plugin Name | 插件标识符 |
| Version | `info.Version`（缺省时显示 `1.0.0`） |
| Author | `info.Author`（列表类型以逗号连接；缺省时显示 `Unknown`） |
| Description | `info.Description`（缺省时显示 `No description available`） |
| Actions | 执行/停止/详情按钮，编辑按钮 |

搜索框可按名称、描述、作者或版本过滤。移动端自动切换为卡片视图，桌面端可通过控制栏的视图切换图标在表格与卡片之间切换。

### 执行按钮的启用条件

只有当 `plugin['status']` 等于 `'success'` 时执行按钮才可用。该字段来自后端对 `list_plugin_info` 的响应，反映后端是否成功加载了该插件。状态为其他值时按钮置灰，不可点击。

## 执行插件

在插件行或卡片上按 **Execute**。如果插件的 `info` 中声明了 `Parameters`，会先弹出参数对话框。

### 参数对话框

对话框标题为 **Enter Parameters**。每个参数渲染为一个文本输入框：

- 字段标签为参数键名。
- 提示文本为参数的 `description` 值。
- 初始值为参数的 `default` 值（转为字符串）。
- 如果参数 `type` 为 `int`，键盘切换为数字输入。提交时用 `int.tryParse` 解析，失败则回退到默认值。
- 其他类型的值以字符串提交。

按 **Execute** 确认，或按 **Cancel** 取消不执行。

### 同步执行

应用发送 `POST /api/execute_plugin/`，请求体为：

```json
{
  "plugin_name": "<name>",
  "parameters": { "<key>": "<value>" }
}
```

当插件没有参数时，`parameters` 键省略。

如果响应的 `execution_type` 不是 `"async"`，则插件以同步方式运行。响应中的 `result` 映射被直接读取：

| 字段 | 来源 | 缺省值 |
|---|---|---|
| 是否成功 | `result.success`（布尔） | `false` |
| 消息 | `result.message`（字符串） | `No message provided` |
| 数据 | `result.data`（映射） | `{}` |

成功时弹出 **Plugin Executed Successfully** 对话框，失败时弹出 **Plugin Execution Failed**。两者都包含消息内容，如果 `data` 非空则附带 `Details:` 区块列出每个键值对。

### 异步执行

如果响应的 `execution_type` 为 `"async"`，说明后端启动了一个后台任务，响应中包含 `task_id`。应用通过 WebSocket 连接 `<wsBaseUrl>/ws/exploit/<task_id>/`（协议自动转换为 `ws` 或 `wss`）。

每个 WebSocket 帧是一个 JSON 对象。应用读取：

- `message` — 更新插件行上显示的执行状态文本。
- `status` — 当值为 `"complete"` 时，帧中的 `result` 对象包含最终结果。

`result` 对象的结构与同步结果一致：`status`（是否为 `"success"`）、`message`、`data`。

完成后：

1. 应用将结果保存到本地存储。
2. 弹出带有 **View Details** 按钮的提示条。
3. 执行状态在 10 秒后从界面移除。

如果 WebSocket 连接本身失败（非插件失败），执行状态标记为失败，消息为 `Failed to connect: <error>`。

### 停止按钮

插件运行期间，执行按钮变为 **Stop**。按下后界面状态更新为失败并显示 `Stopped by user`。停止操作只改变界面显示，不向后端发送取消请求，后端任务会继续运行。

## 执行状态指示

执行中的插件行或卡片会显示彩色边框和状态圆点：

| 状态 | 颜色 | 图标 | 文本 |
|---|---|---|---|
| 运行中 | 橙色 | `play_circle` 或加载圈 | `Running...` / `Running asynchronously...` |
| 已完成 | 绿色 | `check_circle` | `Completed` |
| 已失败 | 红色 | `error` | `Failed` |

卡片视图在执行期间会显示已运行时长（`startTime` 到 `endTime` 的秒数）。

## 编辑插件源码

按插件行的编辑图标（铅笔），应用打开全屏代码编辑器。

编辑器使用 `flutter_code_editor` 包，提供 Python 语法高亮。加载源码时发送 `POST /api/get_plugin_code/`，请求体为 `{"plugin_path": "<relative_path>"}`。路径处理逻辑：先去掉 `file://` 前缀，再从 `plugins/` 开始截取相对路径。

按保存图标（或浮动按钮）发送 `POST /api/save_plugin_code/`，请求体为 `{"plugin_path": "<relative_path>", "code": "<source>"}`。成功时提示 `Plugin saved successfully`，并刷新父页面的插件列表。

应用栏显示 `Editing: <plugin_name>`，副标题为文件名。刷新图标会丢弃本地修改并重新从后端加载。

## 插件组

在侧边菜单选择 **Plugin Groups**。

页面打开时加载两项内容：

- `GET /api/list_groups/` — 已有插件组（以树形结构返回，含 `child_groups`）。
- `GET /api/list_plugins/` — 可选入组的插件名称列表。

### 组结构

一个组包含：

| 字段 | 类型 | 说明 |
|---|---|---|
| name | 字符串 | 组标识符 |
| description | 字符串 | 自由描述 |
| enabled | 布尔 | 是否可执行 |
| plugins | 列表 | 组内插件 |
| childGroups | 列表 | 嵌套子组 |

组内每个插件包含：

| 字段 | 默认值 | 说明 |
|---|---|---|
| name | — | 插件标识符 |
| description | — | 来自后端 |
| enabled | `true` | 是否参与组执行 |
| sequence | `100` | 执行顺序（1–200，值小先执行） |
| ignore_fail | `false` | 为 true 时该插件失败后组继续执行下一个 |

### 创建组

按 **+** 图标打开 **Create Plugin Group** 对话框：

1. 填入 **Group Name**（必填）。
2. 填入 **Description**（可选）。
3. 点击插件名称将其选入组。选中的插件显示勾选标记和设置（齿轮）图标。
4. 按选中插件的齿轮图标可设置 **Execution Sequence**（滑块，1–200）和 **Ignore Failures** 开关。
5. 如需嵌套到其他组下，勾选 **Nest under another group**，选择 **Parent Group**，可选配置父级关系：
   - **Sequence** — 本组在父组中的执行顺序（滑块，1–200）。
   - **Ignore Failures** — 本组失败时父组是否继续执行。
   - **Force Execution** — 即使父组被禁用也执行本组。

按 **Create** 发送 `POST /api/create_group/`。成功时提示 `Group created successfully` 并刷新列表。

### 执行组

按组卡片上的播放箭头，应用发送 `POST /api/execute_group/`，请求体为 `{"group_name": "<name>"}`。后端按 sequence 顺序运行组内插件。结果同步返回——组执行没有 WebSocket 进度流。

### 删除组

按删除图标（垃圾桶），确认对话框显示 `Are you sure you want to delete "<name>"?`。按 **Delete** 发送 `POST /api/delete_group/`，请求体为 `{"group_name": "<name>"}`。成功后刷新列表。

## 测试结果

在插件页面按历史记录图标，或在侧边菜单选择 **Test Results**。

### 结果存储位置

测试结果使用 `SharedPreferences` 存储在本地设备上，键名为 `plugin_test_results`。结果不会发送到后端，也不会从后端获取。这意味着：

- 结果按设备隔离。在一台机器上执行插件产生的结果不会出现在另一台机器上。
- 清除应用数据或卸载应用会删除全部结果。
- 这一层没有服务端的插件执行审计记录。

每条结果记录包含：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | 字符串 | UUID v4 |
| plugin_name | 字符串 | 产生结果的插件 |
| timestamp | ISO 8601 | 结果保存时间 |
| success | 布尔 | 插件是否报告成功 |
| message | 字符串 | 插件返回的消息 |
| data | 映射 | 插件返回的数据条目 |
| target_id | 字符串? | 执行时选中的目标 ID |
| target_name | 字符串? | 目标显示名称 |

### 表格列

| 列 | 内容 | 可排序 |
|---|---|---|
| Date/Time | `yyyy-MM-dd HH:mm:ss` | 是（默认降序） |
| Plugin | 插件名称 | 是 |
| Status | `Success` 或 `Failure` 标签 | 是 |
| Message | 首行截断显示 | 否 |
| Actions | 查看详情、删除 | 否 |

搜索框可按插件名称、消息或目标名称过滤。刷新图标从本地存储重新加载。

### 查看结果详情

按行上的眼睛图标，或点击消息单元格。弹出对话框显示：

- 插件名称
- 日期（`yyyy-MM-dd HH:mm:ss`）
- 目标（如有）
- 消息
- 详情（`data` 中的每个键值对，非空时显示）

对话框标题根据 `success` 字段显示为 **Test Success** 或 **Test Failure**。

### 删除结果

按行上的删除图标可删除单条结果，提示 `Test result deleted successfully`。

按 **Clear All Results** 图标（红色垃圾桶）删除全部结果。确认对话框显示：

> Clear All Results
>
> Are you sure you want to delete all test results? This action cannot be undone.

按 **Clear All** 确认。

## 已知限制

- **停止不会取消后端任务。** 停止按钮只改变界面状态，不发送取消请求。后端任务会继续运行至完成。
- **组执行是同步的。** `POST /api/execute_group/` 会阻塞到组内全部插件执行完毕，没有进度流。
- **测试结果仅存本地。** 没有服务端持久化。重装应用或清除数据会删除历史记录。
- **插件上传未实现。** 上传浮动按钮提示 `Plugin upload coming soon!`。
- **无自动漏洞检测。** 插件返回 `success` 标志、`message` 和 `data` 映射。什么算作发现取决于具体插件的逻辑。界面不做分类或评分。

## 故障排查

### 插件页面一直显示加载动画

`GET /api/list_plugin_info/` 未返回。检查 API 服务器是否可达、服务器地址是否正确。参见[服务器与构建配置](/blog/zh/manual/server-and-build-setup/)。

### 执行按钮置灰

插件的 `status` 字段不是 `'success'`。后端在列表中返回了该插件但报告了加载错误。查看后端日志中该插件的具体信息。

### `Plugin "<name>" is already executing`

该插件已在执行中。等待执行结束后再运行（同步结果 3 秒后移除状态，异步结果 10 秒后移除）。

### `Error executing plugin: <error>`

`POST /api/execute_plugin/` 请求失败，或响应 `status` 不为 `success`。错误消息包含后端返回内容。注意：选中的目标 ID 会写入保存的测试结果，但不会包含在执行请求体中。

### 异步执行显示 `Failed to connect: <error>`

WebSocket 连接 `/ws/exploit/<task_id>/` 建立失败。检查 WebSocket 基础地址是否配置且可达，后端是否接受了该任务。

### `Plugin path not available`

按了编辑按钮但插件的 `path` 字段为空。后端未提供该插件的文件系统路径。内置或虚拟插件可能出现此情况。

### 测试结果页面显示 "No test results found"

本地 `SharedPreferences` 中没有存储结果。全新安装时这是正常的。先执行一个插件，再返回此页面。

### `Error loading test results: <error>`

`SharedPreferences` 中存储的 JSON 无法解析。数据可能已损坏。使用 **Clear All Results** 重置存储。

## 推荐流程

1. 打开 **Plugins**，确认插件列表加载成功。
2. 在页面上方的目标下拉框中选择一个目标。
3. 找到要运行的插件，阅读描述并确认状态——执行按钮必须可用。
4. 如果插件有参数，按执行后在参数对话框中填入参数。
5. 同步插件会立即弹出结果对话框，异步插件请观察行上的状态指示器。
6. 打开 **Test Results** 查看已保存的结果。结果包含插件名称、时间戳、成功标志、消息和数据条目。
7. 批量测试时，打开 **Plugin Groups**，创建组、添加插件并设置 sequence，然后执行整个组。
8. 如需查看或修改插件源码，按插件行的编辑图标打开代码编辑器。

密钥生成与证书验证请参阅 [密钥工具](/blog/zh/manual/key-tool/)。
