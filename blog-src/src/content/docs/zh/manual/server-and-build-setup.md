---
title: 连接 IoTSploit 服务
description: 在 IoTSploit v0.0.16 中配置 API 和 WebSocket 地址，并确认依赖服务的页面可以正常连接。
---

Control Panel、Targets、Drivers、Plugins 和 Fuzzer 都需要连接 IoTSploit 服务。使用这些功能前，请先在 **Settings** 中完成配置。

本文以公开发布的 **v0.0.16** 为准。离线构建不会显示服务器设置，因为其中可用的工具不依赖 IoTSploit 后端。

## 开始前的准备

你需要：

- 服务器管理员提供的 API 基础地址；
- 服务器管理员提供的 WebSocket 基础地址；
- 当前设备到这两个地址的网络连接；
- 使用该服务器及其所管理目标的权限。

API 地址使用 `http://` 或 `https://`，WebSocket 地址使用 `ws://` 或 `wss://`。不要把密码、访问令牌或具体接口路径填入基础地址。

## 打开服务器设置

1. 打开 IoTSploit。
2. 选择 **Settings**。
3. 找到 **Server Configuration**。

如果没有 **Server Configuration**，当前很可能是离线构建。

## 在局域网发现服务器

原生构建提供 **Discover Server**：

1. 将 IoTSploit 客户端和服务器连接到同一局域网。
2. 选择 **Discover**。
3. 等待最多五秒。
4. 找到服务器后，确认显示的名称和地址属于你准备使用的服务器。

应用会根据发现响应填写 API 和 WebSocket 地址。Web 版本无法发送所需的局域网 UDP 广播，因此不提供自动发现。

自动发现只提供便利，不能验证服务器身份。在不可信网络中，应手动输入管理员提供的地址，不要接受来源未知的发现结果。

## 手动填写地址

### API Base URL

1. 选择 **API Base URL** 旁的编辑操作。
2. 输入完整基础地址，例如 `http://192.0.2.10:8888`。
3. 保存。

默认值 `0.0.0.0:8888` 不是可用的远程地址，必须替换。

### WebSocket Base URL

1. 选择 **WebSocket Base URL** 旁的编辑操作。
2. 输入完整基础地址，例如 `ws://192.0.2.10:9999`。
3. 保存。

默认值 `0.0.0.0:9999` 也必须替换。如果服务器不只用于隔离实验室，应使用安全的 `https://` 和 `wss://` 地址。

## 检查连接

依次完成两项检查：

1. 在 Settings 中打开 **API Endpoints**，确认出现可搜索的接口列表。
2. 打开 **Control Panel**，确认目标、插件和设备能够加载，且页面顶部没有连接错误。

接口列表加载成功，只能证明 API 服务已响应，不能证明 WebSocket 可用。异步插件进度或实时日志连接才会使用 WebSocket。

## 其他常用设置

- **Log Level** 控制诊断信息数量。正常使用建议选择 `INFO`，仅在排查问题时使用 `DEBUG`。
- **Terminal Startup Command** 仅影响包含嵌入式终端的构建。
- **Theme** 可选择 Light、Dark 或 System。
- **Language** 用于切换界面语言。
- **About** 显示应用版本、构建号、发布日期和平台。

在 v0.0.16 中，**Notifications**、**API Keys**、**Authentication** 和 **Backup & Restore** 可能显示在页面上，但没有完整的管理流程。不要依赖这些入口管理凭据或备份。

## 哪些内容保存在本机

IoTSploit 会把服务器地址和部分界面偏好保存在当前设备上，以便重启后继续使用。能够访问同一应用配置的其他人，也可能看到已保存的服务器地址。

基础地址字段不适合保存密码或 API Key。如果地址中包含敏感查询参数，应将其视为已经暴露，并改用不含凭据的基础地址。

## 故障排查

### 找不到服务器

- 确认客户端和服务器位于同一子网。
- 检查本机和服务器防火墙是否允许发现流量。
- 如果使用 Web 版本，请手动填写地址。
- 向管理员确认正确的 API 和 WebSocket 地址。

### API Endpoints 无法加载

- 检查协议、主机和端口。
- 确认服务器进程正在运行。
- 确认当前设备可以通过防火墙或 VPN 访问服务器。
- 如果使用 HTTPS，确认客户端信任服务器证书。

### Control Panel 可以加载数据，但没有实时进度

API 地址可能正确，而 WebSocket 地址错误或被阻止。重新检查 WebSocket 的协议、主机、端口、代理和防火墙设置。

### 无法保存地址

重启应用后重试。如果仍然失败，请检查设备可用空间和应用存储限制。

## 下一步

两个地址均配置完成后，继续阅读[从 Control Panel 运行授权测试](/blog/zh/manual/control-panel-workflow/)。
