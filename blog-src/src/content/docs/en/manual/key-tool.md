---
title: Generate keys and verify certificates
description: Use Key Tool in IoTSploit v0.0.16 to create a P-256 key pair, verify a certificate chain, or check an HTTPS certificate.
---

**Key Tool** handles three focused tasks: generate a P-256 key pair, verify a certificate against a CA bundle, and check the certificate presented by an HTTPS service.

The tool is available in native production, development, and offline builds of **v0.0.16**. It does not appear in the Web build.

:::caution[Protect private keys]
Generated private keys are displayed on screen and can be copied to the clipboard. Other applications may be able to read clipboard contents. Move a private key directly to approved secure storage, then overwrite the clipboard. Never paste a private key into chat, an issue tracker, or an unencrypted message.
:::

## Generate a P-256 key pair

1. Open **Toolkit**.
2. Select **Key Tool**.
3. Open **Generate Key**.
4. Select **Generate Key Pair**.

The result contains:

- **Public Key (hex):** a compressed P-256 public point encoded as 66 hexadecimal characters;
- **Private Key (PEM):** a PKCS#8 PEM private key.

Each generation creates a new pair. The tool does not save generated keys to a key store or file. Closing the application can discard the on-screen value.

Before leaving the page:

1. store the private key using your approved key-management process;
2. record which system or certificate request it belongs to;
3. overwrite the clipboard if you used Copy;
4. avoid retaining unnecessary screenshots or logs containing the key.

## Verify a certificate against a CA

Use **Verify Certificate** when you already have certificate files:

1. Choose **Certificate (PEM)**.
2. Select a PEM file whose first certificate is the leaf certificate. Additional certificates may supply intermediates.
3. Choose **CA Chain (PEM)**.
4. Select one or more trusted CA certificates.
5. Optionally enter the hostname the leaf certificate should represent.
6. Select **Verify Chain**.

The result shows **Trusted** or **Not trusted**, a message, and parsed details for the certificates that could be read.

**Trusted** means the supplied certificate could be validated to one of the supplied trust anchors under the checks performed by this tool. It does not establish that the certificate owner, application, or endpoint is trustworthy for every purpose.

## Verify an HTTPS endpoint

Use **Verify HTTPS** to inspect a certificate presented over a live TLS connection:

1. Enter the host without `https://` or a path.
2. Enter the TLS port, normally `443`.
3. Optionally select a CA bundle when the service uses a private CA.
4. Select **Verify HTTPS**.

Without a custom CA bundle, v0.0.16 uses its bundled root certificates. The tool performs a TLS handshake and closes the connection; it does not send an HTTP request.

:::caution[Network connection]
This check connects to the host and port you enter. Confirm that the connection is permitted and that DNS resolves to the intended system. Do not use a successful TLS result as proof that the application behind the endpoint is secure.
:::

## Understand common results

| Result | What to check |
|---|---|
| No PEM certificate found | Confirm the selected file contains PEM certificate blocks |
| Invalid leaf certificate | Confirm the first certificate is the server or end-entity certificate |
| Chain verification failed | Check expiry, intermediate certificates, trust anchors, and certificate order |
| Certificate is not valid for the hostname | Compare the requested host with the certificate's subject alternative names |
| TLS handshake failed | Check the host, port, protocol, server certificate, and selected CA |
| Connection timed out | Check routing, firewall rules, service status, and the port |

## Limits

- Key generation supports P-256 only.
- The tool does not import, persist, rotate, or delete existing private keys.
- Local verification accepts PEM input; other container formats must be converted first.
- HTTPS verification checks a server certificate, not a client certificate.
- A successful chain check does not evaluate the security of the private key, endpoint configuration, application, or device.

## Next step

For authorized network discovery, continue with [Port Scanner](/blog/en/manual/port-scanner/).
