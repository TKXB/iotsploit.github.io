# IoTSploit UI Feature Blog Series — Authoring Guide

This document is a handoff guide for the AI agent that will research and write
the full IoTSploit UI feature tutorial series.

It is a planning document, not a publishable article. Do not add it to the
Starlight sidebar.

## Objective

Create a paired Chinese and English tutorial series that introduces the
user-visible features in the IoTSploit Flutter UI.

Use the existing File Obfuscator manual as the structural baseline. Each new
guide should help a reader complete one concrete task and understand:

- where the feature is available;
- what must be installed, connected, or configured;
- what inputs the feature accepts;
- what action it performs;
- what result the reader should see;
- where data is processed or sent;
- what limitations and safety conditions apply;
- how to diagnose common failures.

Do not turn source filenames, routes, or unfinished screens into feature claims.
Verify the complete path from the visible UI to its service or native
implementation.

## Repository and path information

### Website repository

```text
/home/tkxb/Projects/iotsploit.github.io
```

Important website paths:

```text
blog-src/src/content/docs/en/manual/   English feature manuals
blog-src/src/content/docs/zh/manual/   Chinese feature manuals
blog-src/src/content/docs/en/blog/     English editorial articles
blog-src/src/content/docs/zh/blog/     Chinese editorial articles
blog-src/public/images/                Published screenshots and diagrams
blog-src/astro.config.mjs              Starlight sidebar configuration
skills/write-iotsploit-blog/scripts/validate_article.py
```

Generated output:

```text
blog/
```

Never edit `blog/` directly. Do not add generated output, `node_modules/`, or
`.astro/` files to a commit.

### Application source

```text
/home/tkxb/HDD/Projects/zeekr_sat_main-master/ui
```

Start feature discovery with:

```text
lib/router/app_router.dart
lib/router/route_names.dart
lib/screens/main/components/side_menu.dart
lib/config_dev.dart
lib/config_prod.dart
lib/config_offline.dart
lib/flavors/page_keys.dart
lib/platform/platform_capabilities.dart
lib/screens/tasks/toolkit_catalog.dart
lib/l10n/app_en.arb
lib/l10n/app_zh.arb
pubspec.yaml
test/
```

Evidence baseline used for this plan:

```text
Application commit: c3f20ff8d8e26aae495316a702c17fb9015d57d9
Evidence date: 2026-07-25
Source version: 0.0.17+17
Public download page observed version: 0.0.16
```

Before writing, confirm the intended release. Do not describe development
source as released behavior until it is reproduced in the corresponding
release build.

## Existing manuals

Use these as context:

```text
blog-src/src/content/docs/en/manual/file-obfuscator.md
blog-src/src/content/docs/zh/manual/file-obfuscator.md
blog-src/src/content/docs/en/manual/attack-path-app.md
blog-src/src/content/docs/zh/manual/attack-path-app.md
```

File Obfuscator is already part of the series. Do not create a duplicate.

The Attack Path Analysis guide should be audited and revised instead of
replaced with a second page.

## Required output convention

Every new manual must have matching locale files:

```text
blog-src/src/content/docs/en/manual/<slug>.md
blog-src/src/content/docs/zh/manual/<slug>.md
```

Use the same lowercase kebab-case slug in both locale trees.

Images belong in:

```text
blog-src/public/images/
```

Reference them in Markdown with:

```text
/blog/images/<lowercase-descriptive-filename>
```

Local manual links must include the site base and locale:

```text
/blog/en/manual/<slug>/
/blog/zh/manual/<slug>/
```

## Series plan

### Phase 1 — Product foundation

#### 00. IoTSploit UI feature map

Slug:

```text
iotsploit-ui-overview
```

Proposed titles:

```text
EN: IoTSploit UI: Feature Map and Where to Start
ZH: IoTSploit UI 功能地图与入门路径
```

Primary evidence:

```text
lib/router/app_router.dart
lib/screens/main/components/side_menu.dart
lib/config_dev.dart
lib/config_prod.dart
lib/config_offline.dart
lib/screens/tasks/toolkit_catalog.dart
lib/platform/platform_capabilities.dart
```

DONE.

- [x] Confirm the release, flavor, and platforms covered by the article.
- [x] Inventory production-visible top-level navigation.
- [x] Inventory offline-visible navigation and Toolkit entries.
- [x] Record web versus native restrictions.
- [x] Create a compact workflow map from target selection to results.
- [x] Explain local, backend-dependent, hardware-dependent, and hosted features.
- [x] Link to every completed manual in the series.
- [x] Add an authorization statement before security-testing workflows.

#### 01. Server and build setup

Slug:

```text
server-and-build-setup
```

Proposed titles:

```text
EN: Connect IoTSploit to Its Services
ZH: 连接 IoTSploit 服务并检查运行配置
```

Primary evidence:

```text
lib/screens/settings/settings_page.dart
lib/providers/config_provider.dart
lib/services/server_discovery_service.dart
lib/config.dart
lib/config_dev.dart
lib/config_prod.dart
lib/config_offline.dart
```

DONE.

- [x] Document API and WebSocket configuration using exact UI labels.
- [x] Explain automatic server discovery and its platform restrictions.
- [x] Explain production, development, and offline flavor differences.
- [x] Cover language, theme, logging, and application version information.
- [x] Show how to verify connectivity without using a private endpoint.
- [x] State which configuration values are stored locally.
- [x] Add troubleshooting for unreachable services and invalid URLs.

#### 02. Control Panel workflow

Slug:

```text
control-panel-workflow
```

Proposed titles:

```text
EN: Run an Authorized Test from Control Panel
ZH: 从控制面板运行一次授权测试
```

Primary evidence:

```text
lib/screens/control_center/control_center_screen.dart
lib/screens/control_center/components/system_log_panel.dart
lib/services/plugin_service.dart
lib/services/targets_service.dart
lib/services/test_result_service.dart
```

DONE.

- [x] Verify the initial data loaded by Control Panel.
- [x] Document target and connected-device selection.
- [x] Document driver enable/disable behavior.
- [x] Document plugin parameter prompts.
- [x] Reproduce plugin execution and WebSocket progress.
- [x] Capture completed and failed execution states.
- [x] Explain the difference between execution and system logs.
- [x] State where the workflow ends and expert interpretation begins.

#### 03. Targets and Drivers

Slug:

```text
targets-and-drivers
```

Proposed titles:

```text
EN: Manage Targets and Hardware Drivers
ZH: 管理测试目标与硬件驱动
```

Primary evidence:

```text
lib/screens/targets/targets_page.dart
lib/screens/targets/target_edit_dialog.dart
lib/services/targets_service.dart
lib/screens/devices/devices_page.dart
lib/screens/devices/command_result_widget.dart
```

DONE.

- [x] Define the difference between a target, driver, and attached device.
- [x] Document create, edit, select, and delete target operations.
- [x] Record target-type requirements from the running backend.
- [x] Document driver discovery and enable/disable operations.
- [x] Document attached-device scans and advertised commands.
- [x] Capture the command-result presentation.
- [x] Put hardware safety warnings before command execution.

#### 04. Plugins and test results

Slug:

```text
plugins-and-test-results
```

Proposed titles:

```text
EN: From Plugin Selection to Test Result
ZH: 从插件选择到测试结果
```

Primary evidence:

```text
lib/screens/plugins/plugins_page.dart
lib/screens/plugins/plugins_group_page.dart
lib/screens/plugins/plugin_editor.dart
lib/screens/test_results/test_results_page.dart
lib/services/plugin_service.dart
lib/services/test_result_service.dart
```

DONE.

- [x] Verify how plugins are listed and categorized.
- [x] Document parameter types using real plugin metadata.
- [x] Document plugin groups and their intended workflow.
- [x] Run a harmless authorized example in a lab.
- [x] Record progress, completion, failure, and cancellation behavior.
- [x] Document result retrieval and displayed fields.
- [x] Do not claim automatic vulnerability detection without reproduced proof.
- [x] Separate plugin usage from plugin development if both are documented.

### Phase 2 — Standalone Toolkit guides

#### 05. Key Tool

Slug:

```text
key-tool
```

Primary evidence:

```text
lib/screens/tasks/components/ecc_key_gen_screen.dart
lib/rust/api/crypto.dart
rust/src/api/crypto.rs
lib/screens/tasks/toolkit_catalog.dart
```

DONE.

- [x] Document P-256 key generation and output formats.
- [x] Document local PEM certificate and CA-chain verification.
- [x] Document optional hostname checking.
- [x] Document HTTPS verification using a selected CA.
- [x] Confirm that private keys are not sent to a server.
- [x] Explain clipboard and private-key handling risks.
- [x] Record native-platform and web availability.

#### 06. Port Scanner

Slug:

```text
port-scanner
```

Primary evidence:

```text
lib/screens/tasks/components/rust_scan_screen.dart
lib/rust/api/port_scanner.dart
rust/src/api/port_scanner.rs
lib/screens/tasks/toolkit_catalog.dart
```

DONE.

- [x] Verify target validation and accepted address formats.
- [x] Document port range, batch size, timeout, and UDP option.
- [x] Reproduce a scan against an explicitly authorized lab service.
- [x] Explain TCP and UDP result limitations.
- [x] Document duration and open-port output.
- [x] Add network load and authorization cautions before scanning.
- [x] Record native-platform and offline availability.

#### 07. SSH Client

Slug:

```text
ssh-client
```

Primary evidence:

```text
lib/screens/tasks/components/ssh_client_screen.dart
lib/rust/api/ssh_client.dart
rust/src/api/ssh_client.rs
lib/screens/tasks/toolkit_catalog.dart
```

DONE.

- [x] Document host, port, username, and authentication inputs.
- [x] Cover password, public-key, and no-auth modes accurately.
- [x] Document recent targets and whether credentials are retained.
- [x] Reproduce terminal connection, input, resize, and disconnect.
- [x] Document remote working-directory following.
- [x] Document SFTP upload, download, progress, and cancellation.
- [x] Explain host-key verification behavior.
- [x] Add warnings for credentials, private keys, and remote file overwrite.
- [x] Record native-platform and offline availability.

#### 08. CAN Analysis

Slug:

```text
can-analysis
```

Primary evidence:

```text
lib/screens/tasks/components/can_screen.dart
lib/config.dart
lib/services/log.dart
```

DONE.

- [x] Verify required SocketCAN driver and backend endpoints.
- [x] Document interface/device selection and connection state.
- [x] Document incoming frame fields and clear-data behavior.
- [x] Document CAN ID, DLC, and data validation.
- [x] Reproduce sending a harmless frame on an isolated lab bus.
- [x] Put vehicle and physical-system safety warnings before transmission.
- [x] Explain that receiving frames does not identify their meaning.
- [x] Record service and platform requirements.

#### 09. Ubertooth BLE Scan

Slug:

```text
ubertooth-ble-scan
```

Primary evidence:

```text
lib/screens/tasks/components/ubertooth_screen.dart
lib/config.dart
```

DONE.

- [x] Confirm supported Ubertooth hardware and required drivers.
- [x] Document device detection.
- [x] Document scan timeout and advertising-channel selection.
- [x] Reproduce BLE advertisement discovery in an authorized lab.
- [x] Document displayed device and advertisement fields.
- [x] Document the Device Info operation.
- [x] Explain that advertisement discovery is not a connection or vulnerability.

#### 10. USBTMC Device Control

Slug:

```text
usbtmc-device-control
```

Primary evidence:

```text
lib/screens/utils/utils_page.dart
lib/screens/utils/usbtmc/usbtmc_control_panel.dart
lib/screens/utils/usbtmc/usbtmc_descriptor.dart
lib/screens/utils/usbtmc/usbtmc_result.dart
lib/services/usbtmc_service.dart
lib/rust/api/usbtmc.dart
rust/src/api/usbtmc.rs
test/unit/usbtmc_descriptor_test.dart
```

DONE.

- [x] Confirm desktop operating-system and USB permission requirements.
- [x] Document scan, selection, connection, and disconnect states.
- [x] Explain SCPI self-description and fallback header discovery.
- [x] Document generated Quick Commands and Quick Workflows.
- [x] Document interactive prompts and structured result tables.
- [x] Document command output and firmware-log consoles.
- [x] Explain device-specific behavior and avoid claiming universal commands.
- [ ] Reproduce the guide with a named test firmware/device combination.

#### 11. Firmware and Recovery Tools

Slug:

```text
firmware-and-recovery-tools
```

Primary evidence:

```text
lib/screens/utils/utils_page.dart
lib/services/firmware_catalog.dart
lib/services/firmware_flasher_service.dart
lib/rust/api/firmware_flasher.dart
rust/src/api/firmware_flasher.rs
assets/firmware/
assets/firmware/firmware_manifest.json
```

TODO:

- [ ] Confirm supported operating systems.
- [ ] Confirm supported chips, boards, ports, and firmware formats.
- [ ] Confirm whether each operation is local or server-backed.
- [ ] Reproduce device detection and chip-information reading.
- [ ] Reproduce firmware selection and flashing on expendable lab hardware.
- [ ] Reproduce erase behavior and recovery from a failed operation.
- [ ] Document baud rate, flash address, and boot-mode requirements.
- [ ] Put power-loss, data-loss, and device-bricking warnings before actions.
- [ ] Publish only after a complete hardware round-trip test.

### Phase 3 — IoT Fuzzer subseries

The Fuzzer should be split into multiple guides. Do not compress all four UI
areas into one feature list.

Shared evidence:

```text
lib/screens/iot_fuzzer/iot_fuzzer_screen.dart
lib/screens/iot_fuzzer/controllers/
lib/screens/iot_fuzzer/models/
lib/screens/iot_fuzzer/pages/
lib/screens/iot_fuzzer/widgets/
lib/services/iot_fuzzer/
```

#### 12. Fuzzer configuration

Slug:

```text
iot-fuzzer-configuration
```

TODO:

- [ ] Document API and WebSocket service configuration.
- [ ] Verify the protocol types returned by the current backend.
- [ ] Verify generator types returned by the current backend.
- [ ] Document connection testing and validation.
- [ ] Document save, reset, template creation, loading, and deletion.
- [ ] Avoid using website marketing copy as protocol-support evidence.

#### 13. Test-group and test-case management

Slug:

```text
iot-fuzzer-test-management
```

TODO:

- [ ] Document test-group create, update, and delete operations.
- [ ] Document test-case create, update, move, and delete operations.
- [ ] Document protocol-frame building and validation.
- [ ] Document import and export formats using real generated examples.
- [ ] Explain which fields come from the selected protocol.
- [ ] Add a non-destructive lab test design example.

#### 14. Campaign execution

Slug:

```text
iot-fuzzer-campaign
```

TODO:

- [ ] Define the authorization and isolation requirements before execution.
- [ ] Document group selection and campaign start.
- [ ] Document pause, stop, and reset behavior.
- [ ] Verify live WebSocket statistics and test-case updates.
- [ ] Verify crash-alert and log presentation.
- [ ] Explain that a crash or timeout requires manual investigation.
- [ ] Do not invent throughput, coverage, or vulnerability results.

#### 15. Fuzzer results

Slug:

```text
iot-fuzzer-results
```

TODO:

- [ ] Document the result-file tree.
- [ ] Document content preview and file download.
- [ ] Document log listing and filtering.
- [ ] Verify analysis summary and chart fields.
- [ ] Verify artifacts and export formats.
- [ ] Explain evidence preservation and sensitive-data redaction.
- [ ] Connect each result type back to the campaign that produced it.

### Phase 4 — Existing Attack Path Analysis guide

#### 16. Audit and revise the existing guide

Existing slug:

```text
attack-path-app
```

Application integration evidence:

```text
lib/screens/webview/webview_page.dart
lib/utils/platform_utils.dart
lib/router/app_router.dart
```

Existing manual paths:

```text
blog-src/src/content/docs/en/manual/attack-path-app.md
blog-src/src/content/docs/zh/manual/attack-path-app.md
```

TODO:

- [ ] Verify the hosted application independently from the Flutter WebView.
- [ ] Confirm current UI labels, providers, models, and export behavior.
- [ ] State that the Flutter entry embeds `https://ap.iotsploit.org/`.
- [ ] State embedded WebView availability: macOS, Windows, and Web.
- [ ] Explain the external-browser fallback for other platforms.
- [ ] Verify where diagrams, API keys, prompts, and generated data are stored.
- [ ] Replace stale model examples with verified, non-prescriptive guidance.
- [ ] Add a realistic authorized modeling example without invented findings.
- [ ] Preserve equivalent security and data warnings in both locales.

## Hold list

Do not publish the following as released user manuals until the blocking TODO is
resolved.

### GreatFET USB Simulation

Evidence:

```text
lib/screens/tasks/components/greatfet.dart
```

Blocker:

- [ ] Implement and verify Start/Stop behavior. The visible action currently
      contains an implementation TODO.
- [ ] Reconcile the screen behavior with its production-capable catalog entry.

### ESP32 Monitor

Evidence:

```text
lib/screens/tasks/components/esp32.dart
```

Blocker:

- [ ] Remove or configure the hard-coded private WebSocket address.
- [ ] Remove or configure the fixed `esp32_001` device identifier.
- [ ] Reproduce CAN, UART, and Wi-Fi data using the selected device.

### Logic Analyzer

Evidence:

```text
lib/screens/tasks/components/logic_analyzer_screen.dart
lib/screens/tasks/toolkit_catalog.dart
```

Blocker:

- [ ] Promote the tool to the intended release flavor.
- [ ] Verify capture, streaming, waveform, and device requirements.

### FTDI UART

Evidence:

```text
lib/screens/tasks/components/ft2232_uart_screen.dart
lib/services/ft2232_uart_service.dart
lib/rust/api/ft2232_uart.dart
rust/src/api/ft2232_uart.rs
lib/screens/tasks/toolkit_catalog.dart
```

Blocker:

- [ ] Promote the tool to the intended release flavor.
- [ ] Verify the supported FTDI chips on each native platform.
- [ ] Reproduce RX, TX, line ending, framing, and flow-control behavior.

### JTAG Boundary Scan

Evidence:

```text
lib/screens/jtag_scan/
lib/providers/jtag_provider.dart
lib/rust/api/jtag.dart
rust/src/api/jtag.rs
jtag/
test/widget/jtag_scan_screen_test.dart
```

Blocker:

- [ ] Promote the route from the development flavor to the intended release.
- [ ] Test probe discovery and chain scanning with physical hardware.
- [ ] Validate BSDL assignment against supported packages.
- [ ] Test SAMPLE safely.
- [ ] Test the guarded, single-use EXTEST workflow on expendable hardware.

### AI Assistant

Evidence:

```text
lib/screens/ai_assistant_screen.dart
lib/screens/ai_model_config_screen.dart
lib/config_dev.dart
lib/config_prod.dart
```

Blocker:

- [ ] Define its production availability.
- [ ] Verify model/provider configuration, data flow, storage, and deletion.
- [ ] Document privacy and secret-handling boundaries.

### Public IP

Evidence:

```text
lib/screens/tasks/components/public_ip_screen.dart
```

Decision:

- [ ] Include it in a shorter Toolkit Utilities roundup unless enough
      troubleshooting and privacy material exists for a standalone guide.
- [ ] Verify the third-party service dependency and disclosed data.

## Claim ledger

Create a ledger before drafting each article:

| ID | Reader-facing claim | Build/platform | Evidence | Status | Action |
|---|---|---|---|---|---|
| F-01 | Exact, narrow behavior statement | Named scope | Path, test, screenshot, or run | Verified / unresolved | Include / qualify / omit |

Rules:

- A route does not prove that a page is enabled.
- A visible page does not prove that its actions are connected.
- A service client does not prove that its server is deployed.
- A test with a fake implementation does not prove hardware compatibility.
- A bundled firmware image does not prove general board support.
- A development feature is not a released feature.
- A successful operation on one platform does not prove all-platform support.
- Unresolved claims must be omitted or kept as author-only HTML comments.

## Screenshot checklist

For each proposed image, prepare a small manifest:

| Screenshot | Reader question | Required state | Redactions | Build/platform |
|---|---|---|---|---|
| Exact screen | What the image proves | Inputs and operation state | Secrets and identifiers | Verified scope |

TODO:

- [ ] Capture screenshots from the same build described in the article.
- [ ] Use a consistent window size and theme within an article.
- [ ] Prefer configuration, operation, and result states over decorative views.
- [ ] Redact API keys, credentials, hostnames, IP addresses, device serials,
      usernames, local paths, and customer data.
- [ ] Use lowercase descriptive filenames.
- [ ] Write alt text that states what the screenshot demonstrates.
- [ ] Verify that every referenced image exists.

## Manual template

Use this as a starting point. Adapt the structure instead of mechanically
keeping every heading.

```markdown
---
title: "Specific, task-focused title"
description: "One sentence explaining what the reader will accomplish and understand."
---

[Two or three paragraphs defining the feature, its scope, and its main limit.]

:::caution[Use only with authorization]
[Specific authorization and safety boundary.]
:::

## Open the feature

1. Open **Exact UI label**.
2. Select **Exact feature label**.

## Before you start

- Required build and platform
- Required server or network
- Required hardware, drivers, or permissions
- Required input or test target

## Complete the workflow

1. [Starting state]
2. [Verified action]
3. [Expected visible response]

## Understand the result

[Explain each important result field and what it does not prove.]

## How it works

[Short, verified implementation explanation.]

## Availability and limitations

[Platform, build, service, hardware, data, and format limits.]

## Troubleshooting

### Exact error or symptom

[Cause and evidence-based recovery steps.]

## Recommended workflow

1. [Prepare]
2. [Run]
3. [Verify]
4. [Preserve or clean up]
```

Do not add a duplicate `#` heading; Starlight renders the front-matter title.

## Per-article completion checklist

Research:

- [ ] Name the reader and their starting point.
- [ ] Name the exact release, flavor, platform, and evidence date.
- [ ] Trace the route, enabled configuration, screen, service, and backend or
      native implementation.
- [ ] Inspect focused tests.
- [ ] Reproduce the main workflow when practical.
- [ ] Create the claim ledger.

Draft:

- [ ] Lead with the task and scope.
- [ ] Use exact verified UI labels.
- [ ] State prerequisites before dependent actions.
- [ ] Put warnings before risky actions.
- [ ] Describe observable results.
- [ ] State meaningful limitations.
- [ ] Include troubleshooting grounded in actual errors.
- [ ] End with a concrete next action.

Bilingual:

- [ ] Draft the stronger source-language edition first.
- [ ] Adapt the other edition naturally.
- [ ] Keep facts, commands, filenames, numbers, URLs, warnings, and limitations
      equivalent.
- [ ] Link each locale to pages in the same locale.

Quality:

- [ ] Remove unsupported words such as “all,” “fully,” and “automatic.”
- [ ] Remove promotional claims that do not have evidence.
- [ ] Remove TODO, TBD, FIXME, chat artifacts, and placeholder values.
- [ ] Check that no secret or private endpoint appears.
- [ ] Check all local links and images.
- [ ] Predict the reader's likely questions and answer them from the article.

## Validation and build

Validate a locale pair from the website repository:

```bash
python3 skills/write-iotsploit-blog/scripts/validate_article.py \
  blog-src/src/content/docs/en/manual/<slug>.md \
  blog-src/src/content/docs/zh/manual/<slug>.md
```

Build the documentation site:

```bash
cd /home/tkxb/Projects/iotsploit.github.io/blog-src
npm run build
```

Inspect changes:

```bash
cd /home/tkxb/Projects/iotsploit.github.io
git status --short
git diff -- blog-src/src/content/docs blog-src/astro.config.mjs
git diff --check
```

Final TODO:

- [ ] Add completed manuals to the Manual sidebar in
      `blog-src/astro.config.mjs`.
- [ ] Keep sidebar labels concise and translated.
- [ ] Confirm both locale routes build.
- [ ] Do not commit generated `blog/` output.
- [ ] Report unresolved claims and missing hardware tests during handoff.

## Suggested execution order

The next AI agent should work in small batches:

1. Resolve the target release and create the availability matrix.
2. Complete articles 00–04.
3. Complete articles 05–10 one at a time, validating each locale pair.
4. Complete article 11 only after physical firmware tests.
5. Complete the four-part Fuzzer subseries.
6. Audit and revise the existing Attack Path Analysis guide.
7. Revisit the hold list after release configuration changes.

Do not draft the entire series from filenames alone. Finish the evidence ledger,
workflow reproduction, screenshots, bilingual review, validator, and site build
for each batch before moving to the next.
