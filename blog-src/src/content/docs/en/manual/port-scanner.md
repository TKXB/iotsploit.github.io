---
title: Scan an authorized host for open ports
description: Configure a TCP or UDP port scan, control its network load, and interpret the results in IoTSploit v0.0.16.
---

**Port Scanner** checks a range of ports on one IP address and reports the ports that responded as open. The scan runs from the device running IoTSploit and does not require the IoTSploit server.

The tool is available in native production, development, and offline builds of **v0.0.16**. It does not appear in the Web build.

:::caution[Obtain permission before scanning]
A port scan creates traffic and can trigger monitoring, rate limits, or failures in fragile services. Scan only an address included in your written test scope. Start with a small range and conservative settings.
:::

## Before you start

Confirm:

- the target is a single IPv4 or IPv6 address you are authorized to scan;
- the device running IoTSploit can route to that address;
- firewalls and test windows permit the scan;
- the port range is appropriate for the agreed scope.

The target field does not resolve hostnames. Resolve the intended host separately and verify the address before scanning.

## Configure the scan

1. Open **Toolkit**.
2. Select **Port Scanner**.
3. Enter **Target IP**.
4. Set **Port Start** and **Port End** between 1 and 65535.
5. Choose **Batch Size**.
6. Choose **Timeout**.
7. Leave **UDP Scan** off for TCP, or enable it for UDP.

### Batch Size

Batch Size controls how many ports are checked concurrently. A larger value can finish sooner but creates more simultaneous traffic and consumes more resources on both systems.

Use a smaller batch for embedded devices, remote links, rate-limited networks, or an initial test.

### Timeout

Timeout controls how long the scanner waits for each port. A short timeout can miss slow or filtered services. A long timeout improves tolerance for delay but increases total scan time.

Choose the value based on measured network latency rather than assuming the default is suitable for every environment.

### TCP and UDP

- **TCP** can usually distinguish a successful connection from a rejected or timed-out one.
- **UDP** is less conclusive. Many open UDP services do not respond to an empty probe, while firewalls may silently drop packets.

An empty UDP result does not prove that every scanned UDP port is closed.

## Run the scan

1. Recheck the target address and range.
2. Select **Start Scan**.
3. Wait for the results card.

The page shows the number of ports scanned, the elapsed time, and the ports reported open. You can copy the open-port list to the clipboard.

If you copy results, place them in the authorized test record and clear the clipboard when the addresses or ports are sensitive.

## Interpret the result

An open port indicates that the scanner received the response expected by its check. It does not identify the service, version, authentication requirements, or vulnerability state.

Before interacting with a discovered service:

1. confirm it belongs to the authorized target;
2. identify it using an approved, protocol-appropriate method;
3. record the time and scan settings;
4. avoid sending application data until the service is understood.

## Limits

- One IP address can be scanned at a time.
- Hostnames and subnets are not accepted as targets.
- Results are not saved when you leave the page.
- Ports are reported without service or version detection.
- There is no partial-result display while a scan is running.
- UDP results can contain false negatives.

## Troubleshooting

### The tool is missing

Port Scanner requires a native build. Confirm you are not using the Web build.

### The target is rejected

Enter only a valid IP address. Remove URL schemes, ports, paths, subnet notation, and surrounding spaces.

### The scan takes too long

Reduce the port range first. Then consider a shorter timeout only if the network latency supports it. Avoid increasing concurrency on a fragile target.

### No open ports are found

Confirm the address, routing, range, and firewall rules. Test a known lab service if you need to verify scanner setup. Do not assume an empty result proves the host has no reachable services.

### UDP finds nothing

The service may ignore an empty UDP probe. Use protocol-specific verification when the scope permits it.

## Next step

If an authorized target exposes SSH, continue with [SSH terminal and SFTP](/blog/en/manual/ssh-client/).
