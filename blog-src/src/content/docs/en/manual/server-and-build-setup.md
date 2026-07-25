---
title: Connect IoTSploit to its services
description: Configure the API and WebSocket server addresses, use automatic discovery, and verify connectivity in the production and offline builds.
---

IoTSploit's backend-dependent features — Control Panel, Targets, Drivers, Plugins, and the Fuzzer — require a reachable API server and WebSocket server. The Settings page is where you configure these addresses, set the log level, choose a language and theme, and check the application version. The offline build skips server configuration because its tools run locally.

This guide documents the Settings page using the exact labels visible in the production build. It covers server discovery, manual configuration, connectivity verification, and the differences between the production, development, and offline builds.

## Open Settings

1. Open the IoTSploit application.
2. Select **Settings** in the side menu.

The Settings page is organized into sections: Server Configuration, System Configuration, Application Settings, Security, System, Legal, and About. In the offline build, the Server Configuration, System Configuration, and Security sections are hidden because they are not needed for local-only tools.

## Server Configuration

This section appears only in non-offline builds. It contains server discovery, the two base URLs, and an endpoint viewer.

### Discover Server

On native platforms (Android, iOS, Windows, Linux, macOS), Settings shows a **Discover Server** tile with a **Discover** button. Pressing it sends a UDP broadcast on port `37020` with the message `SAT_DISCOVERY_REQUEST`. A reachable IoTSploit server on the local network replies with its HTTP port, WebSocket port, name, and version. The application fills in the API and WebSocket base URLs automatically and shows a confirmation: `Server found: <name> at <ip>`.

If no server responds within five seconds, the application shows: `No server found. Please configure manually.`

On the web build, the tile is replaced by an information notice: **Auto-discovery Not Available**. Web platforms cannot send UDP broadcasts, so you must configure the addresses manually.

### API Base URL

The **API Base URL** tile shows the current base URL for HTTP API endpoints. Press the edit icon to open a dialog, enter the full URL (for example `http://192.168.1.10:8888`), and save.

This value is stored locally on the device using SharedPreferences. It is not sent to a third party. The default value is a placeholder (`0.0.0.0:8888`) that does not point to a real server; replace it before using any backend-dependent feature.

### WebSocket Base URL

The **WebSocket Base URL** tile shows the current base URL for WebSocket connections. Edit it the same way as the API Base URL. WebSocket URLs use the `ws://` or `wss://` scheme. The default value is a placeholder (`0.0.0.0:9999`) that must be replaced.

The WebSocket server carries async plugin execution progress, live system usage, device streams, console logs, and the AI assistant session. It must use the same host as the API server in a typical deployment, but the ports can differ.

### API Endpoints

The **API Endpoints** tile fetches `GET /api/list_urls/` from the configured API Base URL and opens a searchable dialog of available endpoints. Each entry shows its name, URL pattern, HTTP method, and description, grouped by category.

This dialog is a practical connectivity check: if the endpoint list loads, the API server is reachable and responding. If the request fails, the application shows an error toast.

## System Configuration

This section appears only in non-offline builds.

### Log Level

The **Log Level** tile shows the current level. Press **Change** to choose from `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL`. The selected level is stored locally and also sent to the server through `POST /api/set_log_level/` with a JSON body `{"level": "<level>"}`. If the server request fails, the application shows an error.

### Terminal Startup Command

The **Terminal Startup Command** tile configures the command that runs when an embedded terminal starts. Edit it to match your local environment. This value is stored locally and is only relevant for builds that include an embedded terminal.

## Application Settings

### Theme

The **Theme** tile offers a segmented button with three options: **Light**, **Dark**, and **System**. The choice is applied immediately and persists across restarts.

### Notifications

In non-offline builds, a **Notifications** tile appears. In the current source it does not open a connected screen; treat it as a reserved entry until a notifications management screen is connected.

## Security

In non-offline builds, a **Security** section contains **API Keys** and **Authentication** tiles. In the current source these tiles do not open connected screens; they are reserved entries. Do not assume that API key or authentication management is available until a connected screen ships in a release.

## System

### Language

The **Language** tile opens a selection dialog. Supported languages are English, Simplified Chinese, and Spanish. The current choice is shown on the tile and applied immediately.

### Backup & Restore

In non-offline builds, a **Backup & Restore** tile appears. In the current source it does not open a connected screen; treat it as a reserved entry.

## Legal

The **Privacy Policy** tile opens `https://www.iotsploit.org/privacy.html` in an external browser. If the URL cannot be opened, the application shows a fallback message directing you to the website.

## About

The About section shows:

- **Version** — the application version from the build.
- **Build** — the build number.
- **Released** — the release date compiled into the build.
- **Platform** — the detected platform label (for example, Linux, Windows, macOS, or Desktop (Web)).

## Flavor differences

| Setting area | Production | Development | Offline |
|---|---|---|---|
| Server Configuration | Yes | Yes | Hidden |
| System Configuration | Yes | Yes | Hidden |
| Application Settings (Theme) | Yes | Yes | Yes |
| Notifications | Shown (reserved) | Shown (reserved) | Hidden |
| Security | Shown (reserved) | Shown (reserved) | Hidden |
| Language | Yes | Yes | Yes |
| Backup & Restore | Shown (reserved) | Shown (reserved) | Hidden |
| Legal | Yes | Yes | Yes |
| About | Yes | Yes | Yes |

The offline build is titled "Toolkit" and starts on the Toolkit page. It exposes only theme, language, legal, and about settings because its tools do not contact a backend.

## Verify connectivity without a private endpoint

To confirm that the configured server is reachable:

1. Open **Settings** → **Server Configuration** → **API Endpoints**. If the endpoint list loads, the API server is reachable.
2. Open **Control Panel**. The page loads targets, plugins, and devices on open. If it shows a connection error banner, the server is not reachable.
3. Use the **Retry** button on the banner to reload, or press **API Settings** to jump back to the API Base URL tile.

The endpoint-list request uses the public `/api/list_urls/` route. It does not require authentication or access to a private target.

## What is stored locally

These values are stored on the device using SharedPreferences and persist across restarts:

- API Base URL
- WebSocket Base URL
- Terminal Startup Command
- Log Level
- Theme mode
- Language

Server discovery does not store anything until you press **Discover** and the application writes the discovered addresses into the API and WebSocket Base URL fields.

## Troubleshooting

### Connection error banner on Control Panel

The banner reads `Unable to connect to backend at <host>` and offers **Retry** and **API Settings**. Check that the API Base URL is correct, that the server process is running, and that no firewall blocks the port. Press **API Settings** to correct the address.

### "No server found. Please configure manually."

Server discovery sent the UDP broadcast and received no reply within five seconds. The server may be on a different subnet, the network may block UDP broadcasts, or you may be on the web build where discovery is unavailable. Configure the API Base URL and WebSocket Base URL manually.

### "Auto-discovery Not Available"

This notice appears on the web build. Web platforms cannot send UDP broadcasts. Enter the API Base URL and WebSocket Base URL manually.

### "Failed to save API Base URL configuration"

SharedPreferences could not persist the value. This can happen if device storage is full or restricted. Restart the application and retry. If it persists, check the platform's storage permissions for the application.

### Endpoint list fails to load

The `GET /api/list_urls/` request failed. Confirm the API Base URL uses the correct scheme, host, and port. If the server uses HTTPS with a self-signed certificate, the application's HTTP client may reject the connection. Use a valid certificate or a trusted `http://` address in a controlled lab.

### Log level change shows an error

The level was saved locally but the `POST /api/set_log_level/` request failed. The local level is still applied on the device. If you need the server to honor the new level, verify server connectivity and retry.

## Recommended workflow

1. Install the production build on a native platform if you want server discovery.
2. Open **Settings** → **Server Configuration**.
3. Press **Discover** or enter the API Base URL and WebSocket Base URL manually.
4. Open **API Endpoints** to confirm the server responds.
5. Open **Control Panel** to confirm that targets and plugins load.
6. Set the log level, language, and theme to your preference.

Once the server is reachable, continue to the [Control Panel workflow](/blog/en/manual/control-panel-workflow/) to run an authorized test.
