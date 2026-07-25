---
title: Port scanning configuration and results
description: Configure and run TCP or UDP port scans from the device using the Rust-powered port scanner.
---

The **Port Scanner** scans a target IP address for open TCP or UDP ports. It runs entirely on the device — the scan engine is Rust native code using the `rustscan` crate, and no scan data is sent to or through the API server. This guide documents the tool at commit `c3f20ff8` (version `0.0.17+17`).

:::caution[Authorization]
Port scanning generates network traffic against the target. Scanning a host you do not own or are not authorized to test can violate network policies or law. Use this tool only on hosts you have permission to scan.
:::

## Before you start

- **Platform**: Native only (Android, iOS, macOS, Windows, Linux). The Port Scanner is hidden on web builds because it depends on Rust native code (`requiresRust: true`).
- **Build**: Available in all flavors — production, development, and offline. Marked `offlineCapable: true` and `prodCapable: true` in the toolkit catalog.
- **Server**: Not required. The scanner runs locally. No connection to the IoTSploit API server is needed.
- **Network**: The device running the scan must be able to reach the target IP. Firewalls, NAT, or network isolation between the device and the target will affect results.

## Open the Port Scanner

1. Open the IoTSploit application.
2. Select **Toolkit** in the side menu.
3. Find the **Port Scanner** card (description: "Fast TCP/UDP port scanner powered by Rust async runtime") and tap it.

The screen has a single configuration card and, after a scan, a results card below it.

## Scan configuration

| Field | Default | Range | Notes |
|---|---|---|---|
| Target IP | `127.0.0.1` | Any valid IP address | Numeric keyboard input |
| Port Start | `1` | 1–65535 | Must be ≤ Port End |
| Port End | `1000` | 1–65535 | Must be ≥ Port Start |
| Batch Size | `500` | 100–5000 (slider, step 100) | Concurrent connections per batch |
| Timeout | `1500ms` | 200–5000ms (slider, step 100) | Per-port connection timeout |
| UDP Scan | Off | On/Off | Switch between TCP and UDP |

### Batch size

Controls how many ports are probed concurrently. Higher values scan faster but generate more simultaneous connections, which some hosts or firewalls may rate-limit or block. The default of 500 balances speed and stealth.

### Timeout

How long the scanner waits for a response on each port before marking it as closed or filtered. Lower timeouts speed up scans but may miss ports on slow networks. The default of 1500ms works for most local network scans.

### UDP scan

When enabled, the scanner sends UDP probes instead of TCP SYN. UDP scanning is slower and less reliable than TCP — an open UDP port may not respond to an empty probe, making it appear closed. The `rustscan` scanner uses a single try per port.

## Run a scan

1. Enter the **Target IP** address.
2. Set the **Port Start** and **Port End** values.
3. Adjust **Batch Size** and **Timeout** if needed.
4. Toggle **UDP Scan** if you want UDP instead of TCP.
5. Press **Start Scan**.

While scanning, the button shows `Scanning...` with a spinner and is disabled. The scan runs synchronously on the Rust side using `async_std`'s runtime (kept separate from `flutter_rust_bridge`'s Tokio runtime).

### Input validation

| Check | Error message |
|---|---|
| Target field is empty | `Please enter a target IP address.` |
| Port Start or Port End is not a number | `Invalid port range. Use 1–65535, start ≤ end.` |
| Port Start < 1 or Port End > 65535 | Same |
| Port Start > Port End | Same |

If the target IP cannot be parsed as a valid `IpAddr` by the Rust `std::net::IpAddr::parse` function, the scan fails with `Invalid IP address '<input>': <error>`.

## Results

After a scan completes, the results card appears with:

### Summary chips

| Chip | Content | Color |
|---|---|---|
| Open | Count of open ports | Green |
| Scanned | Total ports probed | Neutral |
| Duration | Scan time (`Xms` or `X.Xs`) | Primary |

### Open ports

Each open port is rendered as a green chip with a monospace font. Ports are sorted in ascending order.

If no ports are open in the scanned range, the card reads `No open ports found in the specified range.`

### Copy results

Press the copy icon in the results card header to copy the open ports as a comma-separated string to the clipboard. A snackbar reads `Open ports copied to clipboard`.

## How it works

The Rust function `run_port_scan` in `rust/src/api/port_scanner.rs`:

1. Parses the target string as `std::net::IpAddr`.
2. Creates a `PortRange` with the start and end values.
3. Selects a `PortStrategy` using `PortStrategy::pick` with `ScanOrder::Serial` — ports are probed in ascending order, not randomized.
4. Creates a `rustscan::scanner::Scanner` with:
   - The target address.
   - Batch size as the concurrency limit.
   - Timeout as `Duration::from_millis`.
   - 1 try per port.
   - `greppable = true` (suppresses RustScan's stdout prints).
   - `accessible = false`.
   - No excluded ports.
   - The UDP flag.
5. Runs the scan with `async_std::task::block_on(scanner.run())`, returning a list of open sockets.
6. Extracts port numbers from open sockets, sorts them, and computes `total_scanned` as `port_end - port_start + 1`.

The scan is a synchronous call that blocks the Dart Future until completion. The `async_std` runtime is used instead of Tokio to avoid conflicts with `flutter_rust_bridge`'s own runtime.

### Data structures

**PortScanConfig** (sent from Dart to Rust):

| Field | Dart type | Rust type |
|---|---|---|
| target | String | String (parsed to IpAddr) |
| portStart | int | u16 |
| portEnd | int | u16 |
| batchSize | int | u32 (cast to u16 for Scanner) |
| timeoutMs | int | u32 (cast to Duration) |
| udp | bool | bool |

**PortScanResult** (returned from Rust to Dart):

| Field | Rust type | Dart type |
|---|---|---|
| open_ports | Vec<u16> | Uint16List |
| scan_duration_ms | u64 | BigInt |
| total_scanned | u32 | int |

## Limitations

- **No service identification.** The scanner reports port numbers only. It does not banner-grab, identify protocols, or guess services. Use the [SSH client](/blog/en/manual/ssh-client/) or other tools to interact with discovered services.
- **No host name resolution.** The Target field accepts IP addresses only. The Rust side parses with `IpAddr::parse`, which does not perform DNS lookups. Enter a resolved IP.
- **No scan persistence.** Results exist in the UI state. Navigating away from the screen discards them. Copy open ports before leaving.
- **UDP reliability.** UDP probes may not elicit a response from an open port, causing it to appear closed. UDP scanning with a single try is inherently less accurate than TCP scanning.
- **Serial scan order.** Ports are scanned in ascending order, not randomized. This is the only order available.
- **No progress stream.** The scan runs as a single blocking call. There is no intermediate progress or partial results — the UI shows the spinner until the full scan completes.
- **Single target.** The scanner accepts one IP address per scan. Range or subnet scanning is not supported.

## Troubleshooting

### Port Scanner card not visible on the Toolkit page

You are on a web build. The Port Scanner requires Rust native code, which is not compiled for web. Use a native build.

### `Please enter a target IP address.`

The Target field is empty. Enter an IP address.

### `Invalid port range. Use 1–65535, start ≤ end.`

Port Start or Port End is not a valid number, is outside 1–65535, or Port Start is greater than Port End. Correct the values and try again.

### `Invalid IP address '<input>': <error>`

The target string could not be parsed as an IP address by Rust's `IpAddr::parse`. This function accepts IPv4 (e.g. `192.168.1.1`) and IPv6 (e.g. `::1`) but not hostnames. If you entered a hostname, resolve it to an IP first.

### Scan takes a long time

Large port ranges (e.g. 1–65535) with a low batch size and high timeout will take minutes. Increase batch size or decrease timeout, or narrow the port range. The duration chip shows how long the scan took.

### No open ports found

All probed ports in the range were closed or filtered. Verify the target IP is correct and reachable, the target host has services listening on the scanned ports, and no firewall is dropping or rejecting the probes.

### UDP scan shows no open ports

UDP scanning is less reliable than TCP. A port may be open but not respond to an empty UDP probe. Try a TCP scan of the same range, or scan specific UDP ports known to respond (e.g. 53 DNS, 123 NTP).

## Recommended workflow

1. Open **Toolkit** and select **Port Scanner**.
2. Enter the target IP address.
3. Set the port range. For a quick check, use common ranges like 1–1000 or specific ports.
4. Leave batch size and timeout at defaults for most scans. Adjust only if the scan is too slow or the network is unreliable.
5. Press **Start Scan**.
6. Review the results. Note the open ports and duration.
7. Copy open ports if you need them for further work.
8. For TCP services found on open ports, use the [SSH client](/blog/en/manual/ssh-client/) for interactive access.

For SSH terminal and SFTP, continue to [SSH client](/blog/en/manual/ssh-client/).
