---
title: Connect IoTSploit to its services
description: Configure the API and WebSocket addresses in IoTSploit v0.0.16 and confirm that server-dependent pages can connect.
---

Control Panel, Targets, Drivers, Plugins, and Fuzzer need a reachable IoTSploit server. Configure that connection in **Settings** before using those areas.

This guide covers the public **v0.0.16** release. The offline build does not show server settings because its available tools are designed to run without the IoTSploit backend.

## Before you start

Prepare:

- the API base URL supplied by the server administrator;
- the WebSocket base URL supplied by the server administrator;
- network access from your device to both addresses;
- permission to use the server and the targets it manages.

Use `http://` or `https://` for the API address and `ws://` or `wss://` for the WebSocket address. Do not paste credentials, access tokens, or endpoint paths into either base URL.

## Open the server settings

1. Open IoTSploit.
2. Select **Settings**.
3. Find **Server Configuration**.

If **Server Configuration** is absent, you are probably using the offline build.

## Discover a server on the local network

Native builds provide **Discover Server**:

1. Connect the IoTSploit client and server to the same local network.
2. Select **Discover**.
3. Wait up to five seconds.
4. If a server is found, confirm that the displayed name and address belong to the server you intend to use.

The application fills in the API and WebSocket addresses from the discovery response. Discovery is not available in the Web build because browsers cannot send the required local-network UDP broadcast.

Discovery is a convenience, not an identity check. On an untrusted network, enter addresses supplied by your administrator instead of accepting an unknown response.

## Enter the addresses manually

### API Base URL

1. Select the edit action beside **API Base URL**.
2. Enter the full base address, such as `http://192.0.2.10:8888`.
3. Save the change.

The default `0.0.0.0:8888` value is not a usable remote address and must be replaced.

### WebSocket Base URL

1. Select the edit action beside **WebSocket Base URL**.
2. Enter the full base address, such as `ws://192.0.2.10:9999`.
3. Save the change.

The default `0.0.0.0:9999` value must also be replaced. Use secure `https://` and `wss://` addresses when the server is exposed beyond an isolated lab.

## Confirm the connection

Use two checks:

1. Open **API Endpoints** in Settings. A searchable endpoint list should appear.
2. Open **Control Panel**. Targets, plugins, and devices should load without a connection-error banner.

Loading the endpoint list confirms that the API server responded. It does not confirm that the WebSocket service works. An asynchronous plugin run or live log connection is needed to exercise WebSocket traffic.

## Other useful settings

- **Log Level** changes the amount of diagnostic output. Use `INFO` for normal operation and `DEBUG` only while investigating a problem.
- **Terminal Startup Command** applies to builds that include an embedded terminal.
- **Theme** changes between Light, Dark, and System appearance.
- **Language** changes the interface language.
- **About** shows the application version, build number, release date, and platform.

In v0.0.16, **Notifications**, **API Keys**, **Authentication**, and **Backup & Restore** may be visible without opening a complete management workflow. Do not rely on those entries for credential management or backup.

## What is saved locally

IoTSploit saves the configured server addresses and several interface preferences on the device so they remain after restart. Anyone who can use the same application profile may be able to see the saved server addresses.

The base-address fields are not intended for passwords or API keys. Treat any server URL containing sensitive query parameters as exposed and replace it with a clean base URL.

## Troubleshooting

### No server is found

- Confirm the client and server are on the same subnet.
- Check that local firewalls allow discovery traffic.
- If you are using the Web build, enter the addresses manually.
- Ask the administrator for the correct API and WebSocket addresses.

### API Endpoints does not load

- Check the scheme, host, and port.
- Confirm the server process is running.
- Confirm the device can reach the server through the firewall or VPN.
- If HTTPS is used, confirm the certificate is trusted on the client device.

### Control Panel loads data but live progress fails

The API address may be correct while the WebSocket address is wrong or blocked. Recheck the WebSocket scheme, host, port, proxy, and firewall rules.

### Settings cannot save an address

Restart the application and try again. If saving still fails, check available device storage and application storage restrictions.

## Next step

After both addresses are configured, continue with [Run an authorized test from Control Panel](/blog/en/manual/control-panel-workflow/).
