---
title: ECC 密钥生成与证书验证
description: 本地生成 P-256 密钥对、验证 x509 证书链、检查远程 HTTPS 端点。
---

**密钥工具**生成 NIST P-256 椭圆曲线密钥对并验证 x509 证书链。全部操作在设备本地完成，不经过服务器。

:::caution[私钥处理]
生成的私钥以 PEM 字符串形式显示在界面上，可复制到剪贴板。多数操作系统的剪贴板内容可被其他应用读取。复制私钥后，请尽快清空或覆盖剪贴板内容。不要将私钥粘贴到聊天工具、问题追踪系统或未加密渠道中。
:::

## 前提条件

- **平台**：仅限原生构建（Android、iOS、macOS、Windows、Linux）。密钥工具依赖 Rust 原生代码，在 Web 构建中被隐藏。
- **构建类型**：生产、开发、离线构建均可用。该工具在工具目录中标记为 `offlineCapable: true` 且 `prodCapable: true`。
- **服务器**：不需要。密钥生成和证书验证（第二个标签页）完全离线。HTTPS 验证（第三个标签页）需要网络访问目标主机。
- **文件**：证书验证需要设备上的 PEM 文件。文件选择器将文件内容读入内存，不存储或发送文件路径。

## 打开密钥工具

1. 打开 IoTSploit 应用。
2. 在侧边菜单选择 **Toolkit**。
3. 找到 **Key Tool** 卡片（描述为 "Generate ECC (P-256) key pairs and verify x509 certificate chains"），点击进入。

界面包含三个标签页：**Generate Key**、**Verify Certificate**、**Verify HTTPS**。

## 生成 P-256 密钥对

**Generate Key** 标签页每次按下按钮都会创建一个新的 NIST P-256（secp256r1）密钥对。

1. 按 **Generate Key Pair**。
2. 生成期间按钮显示 `Generating...` 并带旋转加载圈。
3. 成功后出现两个字段：
   - **Public Key (hex)** — 压缩点编码为十六进制字符串。
   - **Private Key (PEM)** — PKCS#8 PEM 格式。
4. 每个字段有复制图标。按下后将文本复制到剪贴板，提示 `<label> copied to clipboard`。

### 输出格式

| 字段 | 格式 | 示例 |
|---|---|---|
| 公钥 | 十六进制压缩点（33 字节 → 66 个十六进制字符） | `027a3b...` |
| 私钥 | PKCS#8 PEM | `-----BEGIN PRIVATE KEY-----\n...` |

如果生成失败，会显示错误卡片并附带异常消息。密钥对字段保持为空。

## 验证本地证书

**Verify Certificate** 标签页执行离线 x509 证书链验证，不建立网络连接。

1. 在 **Certificate (PEM)** 旁按 **Choose** 选择 PEM 文件。文件中第一个证书作为叶子证书，其余作为中间证书。
2. 在 **CA Chain (PEM)** 旁按 **Choose** 选择包含一个或多个 CA 证书的 PEM 文件。
3. 可选：在 **Hostname** 字段输入主机名（如 `example.com`），检查证书对该名称是否有效。
4. 按 **Verify Chain**。

### 结果

结果卡片显示：

- **Trusted**（绿色）或 **Not trusted**（红色）标题。
- 解释结果或失败原因的消息。
- 解析后的证书链（如有），每个证书一张卡片：

| 字段 | 内容 |
|---|---|
| 角色 | `Leaf`（索引 0）、`CA` 或 `Intermediate` |
| Subject | 证书主体 |
| Issuer | 证书签发者 |
| Valid from | 生效日期 |
| Valid to | 过期日期 |
| Serial | 原始序列号 |
| Sig alg | 签名算法 |

### 失败消息

| 消息 | 原因 |
|---|---|
| `Invalid CA certificate in bundle: <error>` | CA PEM 中的某个证书无法解析为信任锚点 |
| `Invalid leaf certificate: <error>` | 证书 PEM 中第一个证书不是有效的终端实体证书 |
| `Chain verification failed: <error>` | 签名链断裂、已过期或无法到达受信任 CA |
| `Invalid hostname '<host>': <error>` | 主机名字符串无法解析为 `ServerName` |
| `Certificate is not valid for '<host>': <error>` | SAN 检查失败——主机名不在证书中 |
| `No PEM certificate found in input` | 所选文件不包含 PEM 格式的证书 |
| `Select both a certificate file and a CA chain file` | 按下验证前未选择两个文件 |

## 验证 HTTPS 端点

**Verify HTTPS** 标签页连接远程 TLS 端点并验证服务器证书链。

1. 输入 **Host**（如 `example.com`）。
2. 输入 **Port**（默认 `443`，有效范围 1–65535）。
3. 可选：在 **CA Chain (PEM, optional)** 旁按 **Choose** 选择 CA 包以固定信任根。留空则使用内置的 Mozilla 根证书库。
4. 按 **Verify HTTPS**。

:::caution[网络暴露]
此标签页向指定的主机和端口发起 TCP 连接。连接仅用于 TLS——不发送 HTTP 请求。工具建立连接、完成握手、提取证书链后关闭连接。如果目标非你所有或处于受限网络中，请确认发起此连接是否被允许。
:::

### 结果

格式与证书验证标签页相同：**Trusted** / **Not trusted**、消息、证书链卡片。

### 结果消息

| 消息 | 原因 |
|---|---|
| `<host>:<port> presented a certificate trusted by the supplied CA chain` | 使用自定义 CA 包握手成功 |
| `<host>:<port> presented a certificate trusted by the bundled system root store` | 使用 Mozilla 根证书库握手成功 |
| `TLS handshake / verification failed: <error>` | 握手期间证书被拒绝 |
| `Connection to <host>:<port> timed out` | TCP 连接或 TLS 握手超过 10 秒 |
| `Invalid hostname '<host>': <error>` | 主机字符串无法解析为 `ServerName` |
| `Failed to add CA certificate: <error>` | CA 包中某证书无法加入根存储 |

## 平台与构建可用性

| 构建 | 可用 | 说明 |
|---|---|---|
| 生产 | 是 | 仅限原生平台 |
| 开发 | 是 | 仅限原生平台 |
| 离线 | 是 | 证书验证完全离线；HTTPS 需要网络 |
| Web | 否 | 被隐藏——依赖 Rust 原生代码，Web 构建不可用 |

## 已知限制

- **密钥不持久化。** 生成的密钥仅存在于界面状态中。标签页切换时通过 `AutomaticKeepAliveClientMixin` 保持状态，但关闭页面或退出应用后丢失。离开前请先复制密钥。
- **不支持导入密钥。** 生成标签页只创建新密钥对，没有加载已有私钥的入口。
- **仅限服务器认证。** 证书验证仅支持服务器认证用途，不支持客户端证书验证。
- **无 OCSP 或 CRL。** 不检查吊销状态。已被吊销的证书在签名链和有效期完整时仍会通过。
- **仅支持 P-256。** 密钥生成仅支持 NIST P-256 曲线，不提供 P-384、P-521、Ed25519 等其他曲线。
- **公钥为十六进制而非 PEM。** 公钥是十六进制压缩点，不是 PEM 格式的 SubjectPublicKeyInfo。如需 SPKI 格式请自行转换。

## 故障排查

### Toolkit 页面看不到 Key Tool 卡片

你在使用 Web 构建。密钥工具需要 Rust 原生代码，Web 构建不包含。请使用原生构建（桌面或移动端）。

### `Generating...` 一直不结束

密钥生成使用 `rand::thread_rng()`，依赖操作系统熵源。刚启动且熵不足的设备可能阻塞。正常运行的系统应在数秒内完成。

### `Select both a certificate file and a CA chain file`

按下验证前未选择两个文件。使用 **Choose** 按钮分别选择证书 PEM 和 CA 链 PEM。

### `No PEM certificate found in input`

所选文件不包含 PEM 格式的证书。确认文件中有 `-----BEGIN CERTIFICATE-----` 块。

### HTTPS 验证返回 `TLS handshake / verification failed`

远程服务器证书被拒绝。常见原因：自签名证书未提供匹配的 CA 包、证书已过期、Host 字段与证书 SAN 不匹配、证书链不完整。提供包含签发根的 CA 包，或留空使用 Mozilla 根证书库。

### HTTPS 验证返回 `Connection timed out`

到目标的 TCP 连接或 TLS 握手未在 10 秒内完成。检查主机和端口是否正确、主机是否从当前网络可达、是否有防火墙拦截。

### 证书链卡片显示 `<unparseable: ...>`

证书详情无法解码。可能是证书使用了不支持的扩展或编码。证书链验证本身可能仍然通过，即使详情无法显示。

## 推荐流程

1. 打开 **Toolkit**，选择 **Key Tool**。
2. 在 **Generate Key** 标签页按 **Generate Key Pair**。
3. 将公钥和私钥复制到安全位置，之后清空剪贴板。
4. 验证本地证书时切换到 **Verify Certificate** 标签页。
5. 选择证书 PEM 和 CA 链 PEM。如需 SAN 检查则输入主机名。
6. 按 **Verify Chain**，查看结果和证书链。
7. 验证远程 HTTPS 端点时切换到 **Verify HTTPS** 标签页。
8. 输入主机和端口。可选提供 CA 包以固定信任根。
9. 按 **Verify HTTPS**，查看结果。

端口扫描请参阅 [端口扫描器](/blog/zh/manual/port-scanner/)。
