---
title: ECC key generation and certificate verification
description: Generate P-256 key pairs locally, verify x509 certificate chains against a CA bundle, and check remote HTTPS endpoints.
---

The **Key Tool** generates NIST P-256 elliptic curve key pairs and verifies x509 certificate chains. It runs entirely on the device — key generation and certificate parsing happen in native Rust code, not on a server. This guide documents the tool at commit `c3f20ff8` (version `0.0.17+17`).

:::caution[Private key handling]
Generated private keys are PEM strings shown on screen and copyable to the clipboard. Clipboard contents on most operating systems are readable by other applications. If you copy a private key, clear the clipboard or overwrite it before doing anything else. Do not paste private keys into chat tools, issue trackers, or unencrypted channels.
:::

## Before you start

- **Platform**: Native only (Android, iOS, macOS, Windows, Linux). The Key Tool is hidden on web builds because it depends on Rust native code (`requiresRust: true`, `isRustSupported` returns `false` when `kIsWeb` is true).
- **Build**: Available in all flavors — production, development, and offline. The tool is marked `offlineCapable: true` and `prodCapable: true` in the toolkit catalog.
- **Server**: Not required. Key generation and certificate verification (Tab 2) work offline. HTTPS verification (Tab 3) requires network access to the target host.
- **Files**: For certificate verification, you need PEM files on the device. The file picker reads file contents into memory (`withData: true`) — no file paths are stored or sent anywhere.

## Open the Key Tool

1. Open the IoTSploit application.
2. Select **Toolkit** in the side menu.
3. Find the **Key Tool** card (description: "Generate ECC (P-256) key pairs and verify x509 certificate chains") and tap it.

The screen has three tabs: **Generate Key**, **Verify Certificate**, and **Verify HTTPS**.

## Generate a P-256 key pair

The **Generate Key** tab creates a new NIST P-256 (secp256r1) key pair each time you press the button.

1. Press **Generate Key Pair**.
2. While generating, the button shows `Generating...` with a spinner.
3. On success, two fields appear:
   - **Public Key (hex)** — the compressed point encoded as a hex string.
   - **Private Key (PEM)** — PKCS#8 PEM format.
4. Each field has a copy icon. Pressing it copies the text to the clipboard and shows a snackbar reading `<label> copied to clipboard`.

### How key generation works

The Rust function `generate_ecc_key_pair` in `rust/src/api/crypto.rs` uses the `p256` crate:

1. `SigningKey::random(&mut rand::thread_rng())` generates a new signing key.
2. The private key is encoded with `to_pkcs8_pem(Default::default())`, producing a PKCS#8 PEM string.
3. The verifying key is encoded as a compressed point (`to_encoded_point(true)`) and hex-encoded.

The key pair is returned as an `EccKeyPair` struct with `publicKey` and `privateKey` string fields. No network request is made. The key never leaves the device.

### Output formats

| Field | Format | Example |
|---|---|---|
| Public Key | Hex-encoded compressed point (33 bytes → 66 hex chars) | `027a3b...` |
| Private Key | PKCS#8 PEM | `-----BEGIN PRIVATE KEY-----\n...` |

If generation fails, an error card appears with the exception message. The key pair field stays empty.

## Verify a certificate against a local CA

The **Verify Certificate** tab performs offline x509 chain validation. No network connection is made.

1. Press **Choose** next to **Certificate (PEM)** and select a PEM file. The first certificate in the file is treated as the leaf; any additional certificates are treated as intermediates.
2. Press **Choose** next to **CA Chain (PEM)** and select a PEM file containing one or more CA certificates.
3. Optionally enter a **Hostname** (e.g. `example.com`) to check that the certificate is valid for that name.
4. Press **Verify Chain**.

### Result

The result card shows:

- **Trusted** (green) or **Not trusted** (red) header.
- A message explaining the outcome or failure reason.
- The parsed certificate chain (if any), with one tile per certificate:

| Field | Content |
|---|---|
| Role | `Leaf` (index 0), `CA`, or `Intermediate` |
| Subject | Certificate subject |
| Issuer | Certificate issuer |
| Valid from | Not-before date |
| Valid to | Not-after date |
| Serial | Raw serial number |
| Sig alg | Signature algorithm |

### How verification works

The Rust function `verify_cert_with_local_ca` in `rust/src/api/crypto.rs`:

1. Installs the `ring` crypto provider as the process default (once).
2. Parses the certificate PEM into DER certificates using `rustls_pemfile::certs`. The first cert is the leaf; the rest are intermediates.
3. Parses the CA bundle PEM and builds trust anchors using `webpki::anchor_from_trusted_cert`.
4. Calls `end_entity.verify_for_usage` with:
   - The ring provider's signature verification algorithms.
   - The CA anchors as trust roots.
   - The intermediates from the certificate file.
   - `UnixTime::now()` for validity window checking.
   - `KeyUsage::server_auth()`.
5. If a hostname was provided, calls `end_entity.verify_is_valid_for_subject_name` to check SANs.

The function returns a `CertVerifyResult` with `valid`, `message`, and `chain`. The chain is always returned (even on failure) so you can inspect what was presented.

### Failure messages

| Message | Cause |
|---|---|
| `Invalid CA certificate in bundle: <error>` | A certificate in the CA PEM could not be parsed as a trust anchor |
| `Invalid leaf certificate: <error>` | The first certificate in the cert PEM is not a valid end-entity cert |
| `Chain verification failed: <error>` | Signature chain broken, expired, or no path to a trusted CA |
| `Invalid hostname '<host>': <error>` | The hostname string could not be parsed as a `ServerName` |
| `Certificate is not valid for '<host>': <error>` | SAN check failed — the hostname is not listed in the certificate |
| `No PEM certificate found in input` | The selected file contains no PEM certificates |
| `Select both a certificate file and a CA chain file` | One or both files were not selected before pressing Verify |

## Verify an HTTPS endpoint

The **Verify HTTPS** tab connects to a remote TLS endpoint and validates the server certificate chain.

1. Enter a **Host** (e.g. `example.com`).
2. Enter a **Port** (defaults to `443`; valid range 1–65535).
3. Optionally press **Choose** next to **CA Chain (PEM, optional)** to pin trust to a specific CA bundle. If left empty, the tool falls back to the bundled Mozilla root store.
4. Press **Verify HTTPS**.

:::caution[Network exposure]
This tab opens a TCP connection to the host and port you specify. The connection is TLS-only — no HTTP request is sent. The tool connects, performs the handshake, extracts the certificate chain, and closes the connection. If the target is not yours or you are in a restricted network, verify that making this connection is permitted.
:::

### Result

Same result format as the Verify Certificate tab: **Trusted** / **Not trusted**, message, and certificate chain tiles.

### How HTTPS verification works

The Rust function `verify_https_with_local_ca` in `rust/src/api/crypto.rs`:

1. Builds a `RootCertStore`:
   - If a CA bundle PEM is provided and non-empty, parses it and adds those certificates as roots.
   - If no CA bundle is provided, uses `webpki_roots::TLS_SERVER_ROOTS` (Mozilla root store).
2. Creates a `rustls::ClientConfig` with the root store and no client auth.
3. Opens a TCP connection to `(host, port)` and performs a TLS handshake.
4. If the handshake succeeds, the chain is trusted. The peer certificate chain is extracted with `conn.peer_certificates()` for display.
5. If the handshake fails (certificate error, expired, wrong host, untrusted), the result is `valid: false` with the TLS error message.
6. If the connection times out (default 10 seconds), the result is `valid: false` with `Connection to <host>:<port> timed out`.
7. The TLS connection is cleanly shut down after extraction.

The function runs on a dedicated Tokio runtime (`TLS_RUNTIME`), separate from `flutter_rust_bridge`'s own runtime.

### Result messages

| Message | Cause |
|---|---|
| `<host>:<port> presented a certificate trusted by the supplied CA chain` | Handshake succeeded with a custom CA bundle |
| `<host>:<port> presented a certificate trusted by the bundled system root store` | Handshake succeeded with the Mozilla root store |
| `TLS handshake / verification failed: <error>` | Certificate rejected during handshake |
| `Connection to <host>:<port> timed out` | TCP connect or TLS handshake exceeded 10 seconds |
| `Invalid hostname '<host>': <error>` | The host string could not be parsed as a `ServerName` |
| `Failed to add CA certificate: <error>` | A certificate in the CA bundle could not be added to the root store |

## Platform and flavor availability

| Build | Available | Notes |
|---|---|---|
| Production | Yes | Native platforms only |
| Development | Yes | Native platforms only |
| Offline | Yes | Certificate verification works fully offline; HTTPS needs network |
| Web | No | Hidden — `requiresRust: true` and `isRustSupported` is `false` on web |

## Limitations

- **No key persistence.** Generated keys exist only in the UI state. Navigating away from the tab and back preserves state (via `AutomaticKeepAliveClientMixin`), but closing the screen or the app discards them. Copy keys before leaving.
- **No key import.** The Generate tab only creates new pairs. There is no field to load an existing private key.
- **Server auth only.** Certificate verification uses `KeyUsage::server_auth()`. Client certificate verification is not supported.
- **No OCSP or CRL.** Revocation status is not checked. A certificate that has been revoked will still pass if its chain and validity window are intact.
- **P-256 only.** Key generation uses the `p256` crate exclusively. No other curves (P-384, P-521, Ed25519) are available.
- **Hex public key, not PEM.** The public key is a hex-encoded compressed point, not a PEM-encoded SubjectPublicKeyInfo. If you need SPKI format, convert it externally.

## Troubleshooting

### Key Tool card not visible on the Toolkit page

You are on a web build. The Key Tool requires Rust native code, which is not compiled for web. Use a native build (desktop or mobile).

### `Generating...` never finishes

Key generation uses `rand::thread_rng()`, which depends on the OS entropy source. On a freshly booted device with low entropy, this may block. It should complete within seconds on any normally running system.

### `Select both a certificate file and a CA chain file`

You pressed Verify Chain without selecting both files. Use the **Choose** buttons to select a certificate PEM and a CA chain PEM.

### `No PEM certificate found in input`

The selected file does not contain any PEM-formatted certificates. Check that the file has `-----BEGIN CERTIFICATE-----` blocks.

### HTTPS verification returns `TLS handshake / verification failed`

The remote server's certificate was rejected. Common causes: self-signed certificate without a matching CA bundle, expired certificate, hostname mismatch between the `Host` field and the certificate's SANs, or incomplete chain. Provide a CA bundle that includes the signing root, or leave it empty to use the Mozilla root store.

### HTTPS verification returns `Connection timed out`

The TCP connect or TLS handshake to the target did not complete within 10 seconds. Check that the host and port are correct, the host is reachable from your network, and no firewall is blocking the connection.

### Certificate chain shows `<unparseable: ...>` for a tile

The `x509-parser` crate could not decode that certificate's DER. The certificate may use an unsupported extension or encoding. The chain verification itself uses `webpki`, which may still succeed even if `x509-parser` cannot display the details.

## Recommended workflow

1. Open **Toolkit** and select **Key Tool**.
2. On the **Generate Key** tab, press **Generate Key Pair**.
3. Copy the public and private keys to a secure location. Clear the clipboard afterward.
4. To verify a local certificate, switch to the **Verify Certificate** tab.
5. Select a certificate PEM and a CA chain PEM. Enter a hostname if you want SAN checking.
6. Press **Verify Chain** and review the result and certificate chain.
7. To verify a remote HTTPS endpoint, switch to the **Verify HTTPS** tab.
8. Enter the host and port. Optionally provide a CA bundle to pin trust.
9. Press **Verify HTTPS** and review the result.

For port scanning, continue to [port scanner](/blog/en/manual/port-scanner/).
