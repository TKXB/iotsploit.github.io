---
title: 管理目标与硬件驱动
description: 定义授权测试目标，在目标浏览器中阅读它，导入或导出目标，并准备 IoTSploit v0.0.19 测试所需的驱动和外接设备。
---

**目标（Target）**描述准备评估的系统，**驱动（Driver）**把 IoTSploit 服务连接到硬件接口，检测到的**设备（Device）**则是该驱动可以使用的物理适配器或仪器。

本文以公开发布的 **v0.0.19** 为准。

_依据：以下标签、列和行为均依据 IoTSploit UI **v0.0.19**（标签 `v0.0.19`，提交 `6bb8b5b`，2026-09-28）重新核对，来源为 `lib/screens/targets/` 和 `lib/screens/devices/` 下的源码。_

:::caution[保护真实系统]
只添加和操作已获授权的目标。设备命令可能重置硬件、发送数据、擦除状态或影响连接的物理系统。首次操作应使用隔离、可替换的实验设备，并优先选择只读命令。
:::

## 开始前的准备

你需要：

- 可用的 IoTSploit API 服务连接；
- 已确认的目标名称和测试范围；
- 目标类型，以及适用时的网络地址；
- 所需适配器、操作系统驱动和设备权限；
- 一份实验室中允许执行的命令清单。

## Targets 列表

打开 **Targets**。桌面窗口以表格展示目标，窄窗口则以卡片展示。表格各列的含义如下：

| 列 | 内容 |
|---|---|
| **Current** | 当前目标显示实心标记；其他行显示空心圆，选中即可把该目标设为当前目标 |
| **Name** | 目标显示名称 |
| **Type** | Vehicle、ECU、Phone、IoT、Router、Camera 或 Generic 之一 |
| **Status** | Active 或 Inactive |
| **Components** | 目标声明的组件数量 |
| **IP** | 已知时记录的网络地址 |
| **Location** | 已知时记录的物理位置 |
| **Actions** | Edit、Export 和 Delete |

![v0.0.19 的 Targets 页面，展示 Current、Name、Type、Status、Components、IP、Location 和 Actions 各列，当前目标在 Current 列以实心标记显示，右上角为 Import 和 Add New Target 控件](/blog/images/targets-overview.png)

使用 **Search targets** 按名称、类型或 IP 地址搜索，用 **Type** 和 **Status** 筛选缩小范围。**Import** 和 **Add New Target** 位于右上角；在手机上两者都会收进同一个新增菜单。

选择某一行或卡片会在**目标浏览器（Target Explorer）**中打开该目标。打开目标只是阅读它，不会改变当前目标。

## 创建目标

1. 打开 **Targets**。
2. 选择 **Add New Target**；列表为空时选择 **Add Your First Target**。
3. 在编辑器中用左侧大纲在各部分之间切换。
4. 填写 **Identity**，再按需添加组件和 facet。
5. 选择 **Save Changes**。

Target Name 不能为空；底栏会拒绝保存空名称并说明原因，同时列出尚未保存的修改。

### 身份（Identity）

**Identity** 面板保存目标自身的字段：**Target Name**（必填）、**Target Type**、**Status**（active 或 inactive）、**IP Address** 和 **Location**。

### 组件（Components）

用 **Components** 标题旁的 **+** 添加组件。每个组件有 **Component ID**、**Name**、**Type** 和 **Status**。当组件类型为 ADB 或车机（infotainment）时，编辑器还会显示 **ADB Serial ID**、**USB Vendor ID** 和 **USB Product ID**，均可选。**Delete** 会在本次编辑中移除该组件。

组件还可以带有自由格式的 **Properties** 和一个或多个 **Facets**，见下文。

### 组件上的 facet

**facet** 是由后端插件发布的协议配置，例如 `can`、`doip` 或 `someip`。应用本身不认识这些协议：插件注册 facet，后端发布其 schema，schema 提供标签、字段顺序和声明类型。

- **Add facet** 会列出当前后端定义、且该组件尚未携带的所有 facet 类型。
- 每个 facet 卡片显示其 schema 声明的字段。facet 标记为必填的字段未填写时，**Save Changes** 不可用。
- 声明 `format: hex` 的字段按十六进制显示和接收，整数也接受十进制；结构化的字段（数组或对象，例如一批 CAN 帧）只读显示，不会当作文本编辑。
- **Remove** 会从组件中删除该 facet。
- 没有已加载插件定义的 facet 会按原样显示，并提示其字段无法校验。

### 属性（Properties）

**Properties** 是自由格式的键值对，可加在目标和每个组件上。同时输入名称和值后选择 **Add**；没有名称的属性不会被接受。

### 拓扑（只读）

**Topology** 分组列出目标携带的 **Buses** 和 **Edges**。在编辑器中它们是只读的：保存目标只发送其组件，总线和边会被存储但后端尚未接收，因此在这里输入的内容会被丢弃。要创建带有完整拓扑的目标，请改用[导入目标](#导入目标)。

## 设置当前目标

应用在服务器上维护唯一的**当前目标（current target）**。插件执行、CAN 编辑器和观测数据流都作用于它。

- 在 Targets 表格中，选中 **Current** 列的空心圆。
- 在目标浏览器标题栏中，选择 **Set as current**。

阅读目标不会改变当前目标。当前目标显示在其被选择的位置：Targets 列表的 **Current** 列、目标浏览器标题栏、控制面板详情，以及 Plugins 的目标列表。

## 在目标浏览器中阅读目标

从列表打开目标会进入**目标浏览器（Target Explorer）**，它以检查器布局呈现，让阅读和编辑目标共享同一套模型：

- 左侧**大纲**列出 Identity、Properties、Components、Buses、Edges，以及 Views 下的 **By facet** 和 **Observations**；
- 中间面板有 **Graph**、**Table**、**Raw** 三个标签，窗口过窄无法停靠检查器时还会出现 **Details**；
- 右侧**检查器**显示所选内容的字段；
- 标签下方的面包屑显示当前所处位置。

标题栏显示目标名称、类型与组件和总线数量、当前目标控件、**Export target** 和 **Refresh**。

### 图、表和原始数据

- **Graph** 绘制目标、其总线和组件，并提供 **Observation overlay**，可按采集到的事实为图上色。选择节点会在检查器中打开它。
- **Table** 把所选节点渲染为表格。每个列表头右缘有拖拽手柄，拖动即可设置该列宽度。部分视图会直接在此打开，例如某个 facet 的帧或某次观测的行。
- **Raw** 以 JSON 显示存储的对象。

### 检查器中的 facet、总线和覆盖率

选择组件可看到它的各个 facet，每个都根据已发布的 schema 渲染。CAN facet 提供 **Open N frames in the table**，而不是把帧折叠成一个计数。选择总线会显示其成员和属于总线自身的帧；选择 **Edges** 会按关系分组。

在 **Views** 下，**By facet** 把携带某个 facet 键的所有组件并排展示；当 facet 标记为唯一的字段出现重复时，会标出 **conflict**。在组件上，检查器还会绘制 **capture vs configuration** 进度条，对比目标记录的帧与扫描已看到的帧，并列出在总线上出现过但配置中缺失的帧。

### 观测与观测关系图

观测（observation）是扫描采集到的事实。每个事实都带有它所属的组件和主体，因此会附着到它们，而不是集中在一个列表里。

- 组件的 **observations** 分区列出指向它的事实（前十二条，其余在 Observations 表中）。
- **Views** → **Observations** 打开 **Relations graph**：扫描范围、组件和观测主体按协议着色，并给出各自数量，支持按主体、组件或来源搜索、按协议筛选，以及 **Fit**。宽框是扫描范围，普通框是组件，小标签是观测主体。选中图中节点会打开其表格。

## 编辑或删除目标

**Edit** 会在完整目标上打开同一个编辑器。**Delete** 会先请求确认，然后把目标从服务器管理的列表中删除。

删除目标前：

1. 确认没有正在进行的测试依赖该目标；
2. 保存仍需保留的结果和记录；
3. 再次核对选中的目标；
4. 在确认对话框中完成删除。

删除目标记录不会撤销已经对物理系统执行的操作。

## 导出目标

使用某一行 **Actions** 列中的 **download** 操作，或目标浏览器标题栏中的 **Export target**。应用会获取完整目标，并按 IoTSploit 交换格式写出名为 `<target_id>.iotsploit.json` 的文件。文件带缩进，因此同一目标的两次导出可以逐行对比。

导出不会改变目标。导入导出的文件即可在另一台服务器上重建目标，或接续其他操作员的工作。

## 导入目标

**Import** 会打开格式菜单，包含两项：

- **AUTOSAR ARXML (.arxml)** —— 从 OEM 的整车或 ECU 提取文件构建新目标；
- **IoTSploit target (.json)** —— 从本应用或 CLI 导出的文件重建目标。

两种导入都只会创建**新**目标。导入不会读取、修改或选择已存在的目标。

### 导入 ARXML

1. 选择 **Import** → **AUTOSAR ARXML (.arxml)**。
2. 选择 ARXML 文件，然后填写唯一的 **New target ID**、**Display name**，以及可选的 **Source label**（说明来源）。
3. 选择 **Parse**。设备端解析文件但不写入任何内容，并显示预览：来源、AUTOSAR schema、系统、范围、SHA-256、数量（组件、总线、边、CAN 帧、CAN 信号、CAN FD 帧、容器帧）、总线，以及解析器警告。
4. 选择 **Create Target**，创建的正是预览中的目标。
5. 创建完成后，选择 **Open in Explorer**。

如果文件是 ECU 提取而非完整整车描述，目标会以草稿形式创建并给出警告。上传上限为 256 MiB；在需要把文件整体读入内存而非从磁盘上传的平台上，上限为 32 MiB。

### 导入 IoTSploit JSON

1. 选择 **Import** → **IoTSploit target (.json)**。
2. 选择文件。应用会读取文件，并预览其中每个目标及其组件、总线、帧和信号数量。
3. 勾选 **Import this target** 以创建对应目标。如果某个目标 ID 已被占用（列表中已存在，或同一文件内重复），请选择 **Skip** 或 **Import under a new id** 并填写一个空闲 ID。不会覆盖任何内容。
4. 选择 **Import**。每个目标各自创建；失败会按目标单独报告，不会影响其他目标。

## 准备硬件驱动

打开 **Drivers**。页面列出服务器声明的所有驱动。

![v0.0.19 的 Drivers 页面，展示 Driver ID、Name、Driver Type、Connected Devices、Status 开关，以及每个驱动的 Commands 菜单](/blog/images/drivers-overview.png)

1. 找到插件或工具需要的驱动。
2. 查看其 **Name** 和 **Driver Type**。
3. 阅读 **Connected Devices** 数量，了解它能看到的设备。
4. 把 **Status** 开关设为 Enabled。无法在提供此页面的主机上运行的驱动会带一个禁止图标；将鼠标移到图标上可查看原因。
5. 打开 **Commands (n)** 查看该驱动的命令。

驱动出现在列表中，不代表硬件已经连接。USB 设备已连接，也不代表权限、固件和服务器端支持均已满足。声明了参数的命令会先弹出表单要求填写。

## 检查已连接设备

选择驱动的 **Connected Devices** 数量。对话框会列出该驱动发现的设备，并显示各自的属性，如名称、序列号、Vendor ID 或 Product ID。

如果列表为空：

- 检查供电和线缆；
- 确认适配器连接到运行服务的主机；
- 检查操作系统权限；
- 确认驱动支持该硬件和固件；
- 重新连接设备后再次扫描。

## 安全地运行设备命令

只有理解命令作用后才可执行：

1. 阅读 **Commands** 菜单中的命令说明；
2. 命令要求时选择一个检测到的设备；
3. 首次操作优先使用识别或状态命令；
4. 确认目标已经隔离；
5. 执行命令；
6. 阅读 **Result** 对话框，并记录设备上的实际变化。

原始命令输出仍需人工解释。成功响应只表示驱动返回了结果，不能证明设备正常或安全。

## 故障排查

### Targets 没有任何记录

创建第一个目标。如果保存失败，请检查 API 连接，并使用服务器接受的目标类型。

### 目标无法打开或选择

刷新页面后重试。如果目标浏览器仍然加载失败，请检查服务器连接，并确认目标没有被其他会话删除。

### 导入的目标是草稿

ARXML 中是 ECU 提取，而不是完整整车描述。目标会按文件包含的内容创建，供你继续处理；请补充缺失的上下文，或导入完整描述。

### JSON 目标被跳过

它的 ID 已被占用，因此没有覆盖任何内容。请选择 **Import under a new id**，并填写一个空闲 ID。

### 无法编辑拓扑

v0.0.19 中这是预期行为。编辑器中总线和边为只读，通过导入 ARXML 获得；保存时只发送目标的组件。

### Drivers 没有任何条目

确认服务器可达，并且已经配置硬件驱动。应用不会自动安装服务器端驱动。

### 驱动带有禁止图标

该驱动无法在提供此页面的主机上运行。将鼠标移到图标上查看服务器给出的原因，然后在该主机上处理。

### 无法启用驱动

检查服务器消息、驱动安装、硬件连接和操作系统权限。设备操作进行时，不要反复切换驱动状态。

### 设备命令不可用

启用驱动并确认检测到兼容设备。部分命令只有在驱动报告所需状态后才会启用。

### 命令执行失败

不要立即重复可能改变状态的命令。先检查设备、服务器日志、供电、权限和命令前提。

## 下一步

选择目标并准备硬件后，继续阅读[从 Control Panel 运行授权测试](/blog/zh/manual/control-panel-workflow/)。关于各 IoTSploit 工具在何处运行的总体地图，请参阅 [IoTSploit UI 功能地图与入门路径](/blog/zh/manual/iotsploit-ui-overview/)。
