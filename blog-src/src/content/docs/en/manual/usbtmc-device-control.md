---
title: USBTMC Device Control
description: Connect to USBTMC-class SCPI instruments, run descriptor-driven commands and workflows, and stream firmware logs — desktop only.
hero:
  tag: Desktop only
---

The **Device Control** tab on the Utils page drives any USBTMC-class SCPI
instrument over USB. Nothing about the target device is hardcoded — on connect,
the panel queries the device's own self-description and builds its command
buttons, workflow tiles, and result tables from what the firmware advertises.
An ESP32-S3 exposing a SCPI-over-USBTMC interface, an nRF52840, or a Pico will
each produce a different panel.

## Platform and permission requirements

USBTMC control requires direct USB enumeration, which is only available on Linux,
macOS, and Windows. On Android, iOS, and web, the panel renders a "Desktop only"
state and the Rust bridge returns a desktop-only error for every call.

On Linux, the user running the UI must have read/write permission on the USB
device file. Most distributions restrict `/dev/bus/usb/*` to the `plugdev` or
`usb` group. If a scan finds the device but `open` fails with a permission
error, add your user to the right group or install a udev rule for the device's
VID:PID.

The tool uses cross-platform USB access — no platform-specific driver installation is needed beyond the OS's own USB stack.

## Connection lifecycle

The device card at the top of the panel drives a five-phase state machine:

| Phase | What happens | UI |
|---|---|---|
| **Idle** | No scan has run, or the last scan found nothing | "Scan for Devices" button |
| **Scanning** | USB bus enumeration, filtering for interface class 0xFE / subclass 0x03 (USBTMC) | Spinner + "Scanning…" |
| **Found** | One or more USBTMC devices are present; user selects one | Device picker + "Connect" button |
| **Connecting** | Claims the bulk endpoints and opens a session | Spinner + "Connecting…" |
| **Connected** | Session is live; IDN, capabilities, descriptor, and header catalog have been read | Status dot green + "Disconnect" button |

Each device is identified by its USB topology address
(`bus_number` / `device_address`), not by serial number — this is unambiguous
even for identical, serial-less devices. A UUID v4 session ID is generated at
`open` and used by every subsequent call.

**Scan** is always manual — the panel starts idle and waits for the user to
click. This avoids continuously polling the USB bus. **Rescan** is available in
the Found phase, and the previously selected device is retained if it is still
present after a rescan.

**Disconnect** closes the session (removing it from the registry), stops the
firmware-log reader thread, cancels any pending interactive prompt, and resets
the panel to Idle.

## How the command set is discovered

On connect, the panel issues four queries in sequence. Each is optional — older
or minimal firmware may not implement all of them, and failures are silently
ignored:

1. `*IDN?` — Vendor, Product, Serial, Firmware (split on 4 commas).
2. `SYSTem:CAPabilities?` — Protocol version, MTU, feature list.
3. `SYSTem:HELP:DESCription?` — Structured self-description (the descriptor).
4. `SYSTem:HELP:HEADers?` — Flat command-pattern catalog (the fallback).

### The descriptor

When `SYST:HELP:DESC?` is implemented, the response is an IEEE-488.2
definite-length block (`#<n><len><data>`) containing line-records:

```
DEV idn="IoTSploit,ESP32S3,0001,0.1.0" proto=1 mtu=256 max_block=4096
CMD GPIO:SET kind=command summary="Set GPIO output level" param=pin:u32:req param=value:bool:req returns=none
WF wifi-scan type=trigger_poll_fetch summary="Scan for Wi-Fi access points" trigger=WLAN:SCAN done=WLAN:SCAN:DONE?:1 count=WLAN:SCAN:COUNt? fetch=WLAN:SCAN?#index timeout_ms=15000 poll_ms=250
```

Three tags are recognised:

| Tag | Content |
|---|---|
| `DEV` | Device identity, protocol version, MTU, max block size |
| `CMD` | One SCPI command: pattern, kind (command/query/block), summary, parameters, return type |
| `WF` | One workflow: type, trigger, poll/done, count, fetch, fields, prompts, timing |

The parser is forward-compatible — unknown tags and unknown keys are silently
skipped, so a firmware that adds new metadata does not break older hosts.

### Fallback header catalog

When the device does not implement `SYST:HELP:DESC?`, the panel falls back to
`SYST:HELP:HEAD?` — a newline-delimited list of command patterns. These
populate the Quick Commands list as plain patterns (no summaries, no
parameters, no workflows). The panel is still usable; you just lose the
workflow tiles and the parameter placeholders.

## Quick Commands

The Quick Commands panel renders one chip per discovered command. Each chip
shows the SCPI pattern and (when available) a one-line summary. Clicking a chip
fills the console input with the pattern plus `<param>` placeholders:

```
GPIO:SET <pin>,<value>
```

The user completes the parameters and presses Enter to send. Whether a line is
a query or a write is detected by checking for `?` on the header token — so
`GPIO:GET? 3` is a query, `GPIO:SET 3,1` is a write.

## Quick Workflows

The Quick Workflows panel renders one tile per descriptor-defined workflow.
A workflow is a device-described SCPI recipe that the host executes as one
action — the user clicks, and the panel runs the full sequence automatically.

Two workflow types are supported:

### trigger_poll_fetch

A scan-and-collect sequence:

1. **Trigger** — Send the trigger command (e.g. `WLAN:SCAN`).
2. **Poll** — Repeatedly query a done-query (e.g. `WLAN:SCAN:DONE?`) until it
   returns the done-value (`1`), or the timeout expires.
3. **Count** — Query a count-query (e.g. `WLAN:SCAN:COUNt?`) for the number of
   results.
4. **Fetch** — Query a fetch-query per index (e.g. `WLAN:SCAN? 0`,
   `WLAN:SCAN? 1`, …). These are fetched quietly (not logged to the console)
   to avoid flooding the output.
5. **Table** — Parse each row against the descriptor's `fields=` schema into a
   typed `ResultTable` and render it inline under the workflow tile.

The poll interval and timeout come from the descriptor (`poll_ms`,
`timeout_ms`), defaulting to 250 ms and 15 000 ms.

### trigger_poll_interactive

A state-machine sequence with mid-workflow user prompts (e.g. BLE pairing):

1. **Trigger** — Send the trigger command (e.g. `BLE:PAIR`).
2. **Poll state** — Repeatedly query a state-query (e.g. `BLE:PAIR:STATe?`).
3. **Prompts** — When the state enters a value that has a `prompt=` entry,
   fire the prompt once. The prompt kind determines the UI:
   - **passkey** — text input (digits only), sends `<send_cmd> <value>`.
   - **number** — numeric text input, sends `<send_cmd> <value>`.
   - **text** — free-text input, sends `<send_cmd> <value>`.
   - **confirm** — shows a numeric-compare value, Accept/Reject buttons,
     sends `<send_cmd> 1` or `<send_cmd> 0`.
   - **display** — shows a value (e.g. a passkey to enter on the peer device),
     "Continue" button, sends nothing back.
4. **Success / failure** — When the state reaches the `success=` value, the
   workflow completes. When it reaches a `failed=` value, it fails. When the
   timeout expires, it fails with the last known state.

Prompts are edge-triggered: each fires once on entry into its state and re-arms
if the state is left and re-entered. Only one prompt is ever pending at a time.

### Required parameters

If a workflow's trigger command has required parameters (declared with
`param=<name>:<type>:req`), the panel collects them before running:

- Parameters with an options source (`param=…|<count_query>|<fetch_query>`)
  are collected via a selection dialog populated by querying the device.
- All other required parameters are collected via a text form.

### Result rendering

Fetch workflows produce a typed `ResultTable`. The column schema comes from
the descriptor's `fields=` key:

```
fields=ssid:string,rssi:i32:dbm,channel:u32,authmode:string,bssid:mac
```

| Type | Dart cell | Rendering |
|---|---|---|
| `string` | `StrCell` | Left-aligned text |
| `i32` / `i64` | `IntCell` | Right-aligned integer |
| `u32` / `u64` | `IntCell` | Right-aligned unsigned integer |
| `f64` / `f32` | `FloatCell` | Right-aligned, drops trailing `.0` |
| `bool` | `BoolCell` | Check / dash glyph |
| `mac` | `StrCell` | Left-aligned, treated as string |
| `hex` | `StrCell` | Left-aligned, treated as string |

The table header shows a row-count chip and a copy-as-TSV button. Numeric
columns are right-aligned; unit hints (e.g. `dBm`, `MHz`) are appended to the
header label and the cell value. When the descriptor does not advertise
columns, a single `value:string` fallback column is used and rows render as
monospace text lines.

Interactive workflows can optionally carry a `result=` query (e.g. `BLE:SEC?`)
that is issued once the success state is reached. Its response is parsed
against the `result_fields=` schema and rendered as a two-column key-value
table under the workflow tile.

## SCPI console

The Command Console tab is the raw SCPI terminal. An input field at the bottom
accepts any SCPI line:

- Lines with `?` on the header token are queries — the response is read and
  displayed.
- All other lines are writes — `OK` is logged, no response is read.
- Responses matching the SCPI error-queue pattern (`-<code>,<message>`) are
  coloured red.

The console log is timestamped and colour-coded by kind: transmit (blue),
receive (white), OK (green), error (red), workflow (cyan), system (muted).
Copy and clear buttons are in the header.

The `*RST` button on the descriptor card resets the device — it sends `*RST`
and drains the response queue.

## Firmware log console

The Firmware Log tab streams device log output from the vendor log interface
(USB bulk-IN endpoint 0x82). This is independent of the SCPI command path —
logging and commands run concurrently on separate USB interfaces.

The Rust side spawns a dedicated reader thread that:

1. Claims the device's second (vendor-specific) USB interface.
2. Reads bulk-IN transfers with a 500 ms timeout.
3. Buffers partial lines in a carry vector, splitting on newlines.
4. Flushes the carry buffer at 8 192 bytes if no newline arrives (bound on
   memory).
5. Strips ANSI colour escapes from each line.
6. Classifies severity from the leading ESP-IDF log letter: `E` → error,
   `W` → warn, `I` → info, `D`/`V` → debug.
7. Forwards each decoded line to the UI with timestamp, level, and text.

The Dart side maintains a ring-capped buffer of 5 000 lines. When the Firmware
Log tab is not focused, an unread badge accumulates. Pause/resume and
copy/clear controls are in the console header.

If the device does not implement the vendor log interface, the stream emits a
single error line and the SCPI path is unaffected.

## Limitations

- **Desktop only.** No USB access on Android, iOS, or web. Android USB host
  support is a follow-up, not yet implemented.
- **Device-specific.** Every command and workflow shown depends on what the
  firmware advertises. A device that does not implement `SYST:HELP:DESC?` or
  `SYST:HELP:HEAD?` will show an empty command list — use the raw SCPI console
  to drive it manually.
- **SCPI error queue is not drained after each command.** Only `*RST` and the
  explicit error-queue read drain the queue. Raw writes are left undrained by
  design — this is the explicit raw-write escape hatch.
- **Log stream requires a vendor-specific interface.** Firmware without the
  bulk-IN 0x82 log interface will show a single "stream unavailable" line and
  no further output.
- **No reconnection on USB disconnect.** If the device is physically removed,
  the log reader thread ends and subsequent SCPI calls will error. The user
  must disconnect and reconnect.

## SCPI command reference

| Operation | SCPI | Description |
|---|---|---|
| List devices | — | Enumerate USBTMC-class devices |
| Open session | — | Open a session by bus/address |
| Close session | — | Close and release a session |
| Identify | `*IDN?` | Vendor, Product, Serial, Firmware |
| Capabilities | `SYST:CAP?` | Protocol, MTU, features |
| Reset | `*RST` | Reset the device |
| Read errors | `SYST:ERR?` | Drain the SCPI error queue |
| SCPI query | any `?` line | Raw SCPI query |
| SCPI write | any non-`?` line | Raw SCPI write (undrained) |
| GPIO set | `GPIO:SET <pin>,<level>` | Set a GPIO pin |
| GPIO get | `GPIO:GET? <pin>` | Read a GPIO pin |
| ADC read | `ADC:READ? <channel>` | Read an ADC channel |
| Wi-Fi scan | `WLAN:SCAN` + poll + fetch | Wi-Fi AP scan |
| BLE scan | `BLE:SCAN <secs>` + poll + fetch | BLE device scan |
| BLE connect | `BLE:CONNect <idx>` | Connect to a BLE device |
| BLE disconnect | `BLE:DISConnect` | Disconnect BLE |
| BLE pair | `BLE:PAIR` | Initiate BLE pairing |
| BLE passkey | `BLE:PAIR:PASSKey <key>` | Submit pairing passkey |
| BLE confirm | `BLE:PAIR:CONFirm` | Confirm numeric comparison |
| BLE numcmp | `BLE:PAIR:NUMCmp?` | Read numeric-compare value |
| Log stream | — | Stream vendor log lines (bulk-IN 0x82) |

## Troubleshooting

**Scan finds no devices.** Check that the device is plugged in, powered, and
exposes a USBTMC interface (class 0xFE, subclass 0x03). Non-USBTMC USB devices
are filtered out.

**Open fails with a permission error (Linux).** The user account lacks
permission on `/dev/bus/usb/<bus>/<addr>`. Add your user to the `plugdev` or
`usb` group, or install a udev rule for the device's VID:PID.

**Connect succeeds but no commands appear.** The device does not implement
`SYST:HELP:DESC?` or `SYST:HELP:HEAD?`. Use the raw SCPI console to send
commands manually (try `*IDN?` or `*CLS`).

**A workflow times out.** The device did not report the done-value (or success
state) within the descriptor's `timeout_ms`. Check that the device is in the
expected state before triggering, and that any prerequisites (e.g. a prior
scan) have been run.

**Firmware log tab shows "stream unavailable".** The device does not implement
the vendor log interface (bulk-IN 0x82). This does not affect SCPI commands.
