---
title: 生成密钥并验证证书
description: 使用 IoTSploit v0.0.16 的 Key Tool 创建 P-256 密钥对、验证证书链或检查 HTTPS 证书。
---

**Key Tool** 提供三项独立功能：生成 P-256 密钥对、使用 CA 证书包验证证书链，以及检查 HTTPS 服务提供的证书。

该工具可用于 **v0.0.16** 的原生正式版、开发版和离线版，不会出现在 Web 版本中。

:::caution[保护私钥]
生成的私钥会显示在页面上，也可以复制到剪贴板。其他应用可能读取剪贴板内容。请把私钥直接转移到批准的安全存储中，然后覆盖剪贴板。不要把私钥粘贴到聊天、问题跟踪系统或未加密消息中。
:::

## 生成 P-256 密钥对

1. 打开 **Toolkit**。
2. 选择 **Key Tool**。
3. 打开 **Generate Key**。
4. 选择 **Generate Key Pair**。

结果包含：

- **Public Key (hex)：** 以 66 个十六进制字符表示的压缩 P-256 公钥点；
- **Private Key (PEM)：** PKCS#8 PEM 私钥。

每次操作都会创建新的密钥对。工具不会把密钥保存到密钥库或文件。关闭应用后，页面中的值可能丢失。

离开页面前：

1. 按照批准的密钥管理流程保存私钥；
2. 记录密钥所属的系统或证书请求；
3. 如果使用过 Copy，请覆盖剪贴板；
4. 不要保留包含私钥的无关截图或日志。

## 使用 CA 验证证书

已有证书文件时，使用 **Verify Certificate**：

1. 选择 **Certificate (PEM)**。
2. 选择一个 PEM 文件，其中第一个证书应为叶证书，后续证书可作为中间证书。
3. 选择 **CA Chain (PEM)**。
4. 选择一个或多个可信 CA 证书。
5. 按需输入叶证书应该匹配的主机名。
6. 选择 **Verify Chain**。

结果会显示 **Trusted** 或 **Not trusted**、一条说明消息，以及能够解析的证书详情。

**Trusted** 表示在该工具执行的检查范围内，证书可以验证到所提供的某个信任锚。它不能证明证书所有者、应用或端点在所有用途下均可信。

## 验证 HTTPS 端点

使用 **Verify HTTPS** 检查实时 TLS 连接提供的证书：

1. 输入主机名，不要包含 `https://` 或路径。
2. 输入 TLS 端口，通常为 `443`。
3. 私有 CA 环境可按需选择 CA 证书包。
4. 选择 **Verify HTTPS**。

未选择自定义 CA 时，v0.0.16 使用应用内置的根证书。工具完成 TLS 握手后关闭连接，不会发送 HTTP 请求。

:::caution[会产生网络连接]
该检查会连接你输入的主机和端口。请先确认连接已获允许，并确认 DNS 指向预期系统。TLS 检查成功不能证明端点背后的应用是安全的。
:::

## 理解常见结果

| 结果 | 检查内容 |
|---|---|
| No PEM certificate found | 确认文件包含 PEM 证书块 |
| Invalid leaf certificate | 确认第一个证书是服务器证书或终端实体证书 |
| Chain verification failed | 检查有效期、中间证书、信任锚和证书顺序 |
| Certificate is not valid for the hostname | 对比输入主机名和证书的 Subject Alternative Name |
| TLS handshake failed | 检查主机、端口、协议、服务器证书和所选 CA |
| Connection timed out | 检查路由、防火墙、服务状态和端口 |

## 使用限制

- 密钥生成仅支持 P-256。
- 工具不能导入、持久化、轮换或删除已有私钥。
- 本地验证接受 PEM 输入，其他证书容器格式需要先转换。
- HTTPS 验证检查服务器证书，不验证客户端证书。
- 证书链验证成功，不代表私钥、端点配置、应用或设备本身安全。

## 下一步

如需进行授权网络发现，请继续阅读 [Port Scanner](/blog/zh/manual/port-scanner/)。
