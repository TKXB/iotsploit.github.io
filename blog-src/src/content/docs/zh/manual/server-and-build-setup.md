---
title: 连接 IoTSploit 服务并检查运行配置
description: 配置 API 和 WebSocket 服务器地址、使用自动发现，并在正式版和离线版中验证连接。
---

IoTSploit 中依赖后端的功能——控制面板、目标、驱动程序、插件和模糊测试——需要可访问的 API 服务器和 WebSocket 服务器。设置页面用于配置这些地址、设置日志级别、选择语言和主题，以及查看应用版本。离线版跳过服务器配置，因为其工具在本地运行。

本指南依据正式版本中可见的精确标签记录设置页面，涵盖服务器发现、手动配置、连接验证，以及正式版、开发版和离线版之间的差异。

## 打开设置

1. 打开 IoTSploit 应用。
2. 在侧边菜单中选择**设置**。

设置页面按以下分区组织：服务器配置、系统配置、应用程序设置、安全、系统、法律信息和关于。离线版会隐藏服务器配置、系统配置和安全分区，因为本地工具不需要它们。

## 服务器配置

此分区仅出现在非离线版本中，包含服务器发现、两个基础 URL 和一个端点查看器。

### 发现服务器

在原生平台（Android、iOS、Windows、Linux、macOS）上，设置页面会显示一个**发现服务器**条目，带有一个**发现**按钮。按下后会通过 UDP 在端口 `37020` 上广播消息 `SAT_DISCOVERY_REQUEST`。本地网络中可达的 IoTSploit 服务器会回复其 HTTP 端口、WebSocket 端口、名称和版本。应用会自动填入 API 和 WebSocket 基础 URL，并显示确认信息：`Server found: <名称> at <IP>`。

如果五秒内没有服务器响应，应用会显示：`No server found. Please configure manually.`

在 Web 版本上，该条目会替换为信息提示：**Auto-discovery Not Available**。Web 平台无法发送 UDP 广播，因此必须手动配置地址。

### API Base URL

**API Base URL** 条目显示当前的 HTTP API 端点基础 URL。点击编辑图标打开对话框，输入完整 URL（例如 `http://192.168.1.10:8888`）并保存。

此值通过 SharedPreferences 存储在本地设备上，不会发送给第三方。默认值是占位符（`0.0.0.0:8888`），不指向真实服务器；在使用任何依赖后端的功能前请先替换。

### WebSocket Base URL

**WebSocket Base URL** 条目显示当前的 WebSocket 连接基础 URL。编辑方式与 API Base URL 相同。WebSocket URL 使用 `ws://` 或 `wss://` 协议。默认值是占位符（`0.0.0.0:9999`），必须替换。

WebSocket 服务器承载异步插件执行进度、实时系统使用情况、设备数据流、控制台日志和 AI 助手会话。典型部署中它通常与 API 服务器使用相同的主机，但端口可以不同。

### API 端点

**API Endpoints** 条目从已配置的 API Base URL 获取 `GET /api/list_urls/`，并打开一个可搜索的端点对话框。每个条目显示其名称、URL 模式、HTTP 方法和描述，按类别分组。

这个对话框是一个实用的连接检查：如果端点列表加载成功，说明 API 服务器可达并正在响应。如果请求失败，应用会显示错误提示。

## 系统配置

此分区仅出现在非离线版本中。

### 日志级别

**Log Level** 条目显示当前级别。点击**Change**从 `DEBUG`、`INFO`、`WARNING`、`ERROR` 和 `CRITICAL` 中选择。所选级别会保存在本地，并通过 `POST /api/set_log_level/` 以 JSON `{"level": "<级别>"}` 发送到服务器。如果服务器请求失败，应用会显示错误。

### 终端启动命令

**Terminal Startup Command** 条目配置内嵌终端启动时运行的命令。请根据本地环境编辑。此值存储在本地，仅对包含内嵌终端的版本有意义。

## 应用程序设置

### 主题

**Theme** 条目提供一个分段按钮，包含三个选项：**Light**、**Dark** 和 **System**。选择立即生效并跨重启保留。

### 通知

在非离线版本中，会显示**Notifications**条目。在当前源码中它不会打开已连接的界面；在通知管理界面接入前，请将其视为保留条目。

## 安全

在非离线版本中，**Security** 分区包含**API Keys**和**Authentication**条目。在当前源码中这些条目不会打开已连接的界面，属于保留条目。在已连接的界面发布到正式版本前，不要假设 API 密钥或身份验证管理功能可用。

## 系统

### 语言

**Language** 条目打开选择对话框。支持的语言为英语、简体中文和西班牙语。当前选择显示在条目上并立即生效。

### 备份与恢复

在非离线版本中，会显示**Backup & Restore**条目。在当前源码中它不会打开已连接的界面；请将其视为保留条目。

## 法律信息

**Privacy Policy** 条目在外部浏览器中打开 `https://www.iotsploit.org/privacy.html`。如果无法打开该 URL，应用会显示回退提示，引导你访问网站。

## 关于

关于分区显示：

- **Version** — 来自构建的应用版本。
- **Build** — 构建号。
- **Released** — 编译进构建的发布日期。
- **Platform** — 检测到的平台标签（例如 Linux、Windows、macOS 或 Desktop (Web)）。

## 版本差异

| 设置区域 | 正式版 | 开发版 | 离线版 |
|---|---|---|---|
| 服务器配置 | 是 | 是 | 隐藏 |
| 系统配置 | 是 | 是 | 隐藏 |
| 应用程序设置（主题） | 是 | 是 | 是 |
| 通知 | 显示（保留） | 显示（保留） | 隐藏 |
| 安全 | 显示（保留） | 显示（保留） | 隐藏 |
| 语言 | 是 | 是 | 是 |
| 备份与恢复 | 显示（保留） | 显示（保留） | 隐藏 |
| 法律信息 | 是 | 是 | 是 |
| 关于 | 是 | 是 | 是 |

离线版标题为 "Toolkit"，起始页为工具包页面。它仅暴露主题、语言、法律信息和关于设置，因为其工具不连接后端。

## 不使用私有端点验证连接

要确认已配置的服务器可达：

1. 打开**设置** → **服务器配置** → **API Endpoints**。如果端点列表加载成功，说明 API 服务器可达。
2. 打开**控制面板**。页面在打开时加载目标、插件和设备。如果显示连接错误横幅，说明服务器不可达。
3. 使用横幅上的**Retry**按钮重新加载，或按**API Settings**跳转到 API Base URL 条目。

端点列表请求使用公开的 `/api/list_urls/` 路由，不需要身份验证或访问私有目标。

## 本地存储的内容

以下值通过 SharedPreferences 存储在设备上，跨重启保留：

- API Base URL
- WebSocket Base URL
- 终端启动命令
- 日志级别
- 主题模式
- 语言

服务器发现在你按下**发现**并将发现的地址写入 API 和 WebSocket Base URL 字段之前不会存储任何内容。

## 故障排除

### 控制面板上出现连接错误横幅

横幅显示 `Unable to connect to backend at <主机>`，并提供**Retry**和**API Settings**。请检查 API Base URL 是否正确、服务器进程是否运行、防火墙是否阻止了端口。按**API Settings**更正地址。

### "No server found. Please configure manually."

服务器发现发送了 UDP 广播但五秒内未收到回复。服务器可能位于不同子网、网络阻止了 UDP 广播，或你在不支持发现的 Web 版本上。请手动配置 API Base URL 和 WebSocket Base URL。

### "Auto-discovery Not Available"

此提示出现在 Web 版本上。Web 平台无法发送 UDP 广播。请手动输入 API Base URL 和 WebSocket Base URL。

### "Failed to save API Base URL configuration"

SharedPreferences 无法持久化该值。可能是设备存储已满或受限。重启应用后重试。如果持续出现，请检查平台对该应用的存储权限。

### 端点列表加载失败

`GET /api/list_urls/` 请求失败。请确认 API Base URL 使用了正确的协议、主机和端口。如果服务器使用带自签名证书的 HTTPS，应用的 HTTP 客户端可能会拒绝连接。在受控实验室中使用有效证书或可信的 `http://` 地址。

### 日志级别更改显示错误

级别已在本地保存，但 `POST /api/set_log_level/` 请求失败。设备上的本地级别仍会生效。如果需要服务器遵循新级别，请验证服务器连接后重试。

## 推荐流程

1. 如果需要服务器发现，在原生平台上安装正式版。
2. 打开**设置** → **服务器配置**。
3. 按**发现**，或手动输入 API Base URL 和 WebSocket Base URL。
4. 打开**API Endpoints**确认服务器响应。
5. 打开**控制面板**确认目标和插件能正常加载。
6. 根据偏好设置日志级别、语言和主题。

服务器可达后，继续阅读[控制面板工作流](/blog/zh/manual/control-panel-workflow/)以运行授权测试。
