---
title: SSH terminal and SFTP
description: Connect to an SSH server, run an interactive terminal, and transfer files with SFTP — all powered by native Rust.
---

The **SSH Client** opens an interactive terminal session to a remote host and transfers files over SFTP. No external SSH binary is spawned — the SSH protocol and SFTP subsystem are built in.

:::caution[Authorization]
Only connect to hosts you own or are authorized to access. The SSH Client does not verify server host keys (see [Host key handling](#host-key-handling)), which means it cannot detect a man-in-the-middle attack. Use this tool on networks you trust, and verify the server fingerprint out-of-band if the target is sensitive.
:::

## Before you start

- **Platform**: Native only (Android, iOS, macOS, Windows, Linux). The SSH Client is hidden on web builds because it depends on native code not available in the browser.
- **Build**: Available in all flavors — production, development, and offline. Marked `offlineCapable: true` and `prodCapable: true` in the toolkit catalog.
- **Server**: Not required. The SSH Client connects directly from the device to the SSH server. No connection to the IoTSploit API server is needed.
- **Network**: The device must be able to reach the target host on the SSH port (default 22). Firewalls, NAT, or network isolation will prevent or interrupt the connection.

## Open the SSH Client

1. Open the IoTSploit application.
2. Select **Toolkit** in the side menu.
3. Find the **SSH Client** card (description: "Secure shell client powered by rust") and tap it.

The screen shows a connection form. Once connected, the form is replaced by a terminal view with a status bar and transfer controls.

## Connect

### Connection form

| Field | Default | Notes |
|---|---|---|
| Host | `127.0.0.1` | Hostname or IP address |
| Port | `22` | 1–65535 |
| Username | `root` | Any valid SSH username |
| Authentication | Password | Dropdown: Password, Public Key, None |

### Authentication methods

| Method | Fields | Details |
|---|---|---|
| Password | Password | Obscured text field |
| Public Key | Private Key (PEM), Passphrase (optional) | Paste the PEM-encoded private key into a monospace textarea. Passphrase is sent only if non-empty. |
| None | — | Calls `authenticate_none` on the server. Useful for servers with no auth or for testing. |

### Recent targets

After a successful connection, the target (host, port, username) is saved to SharedPreferences under the key `ssh_client.recent_targets.v1`. Up to 5 recent targets appear as chips below the form. Tapping a chip fills the host, port, and username fields.

### Connect button

Press **Connect**. The button shows `Connecting...` with a spinner and is disabled while the connection attempt is in progress. The connection timeout is 10 seconds — if the server does not respond within that window, the error message reads `Connection timed out`.

### Input validation

| Check | Error message |
|---|---|
| Host field is empty | `Please enter a host address.` |
| Port is not a number or outside 1–65535 | `Invalid port (1-65535).` |
| Username field is empty | `Please enter a username.` |

### Connection result

On success, the screen switches to the terminal view. The status bar shows:

- A green status dot.
- The connection string (`user@host:port`, or `user@host` on mobile where port 22 is implied).
- The server banner — the host key type and SHA-256 fingerprint, formatted as `<algorithm> (<sha256-fingerprint>)`.
- The remote working directory (CWD) chip.

On failure, an error card appears below the form with the message from the Rust side:

| Failure | Message |
|---|---|
| TCP connect error | `Connection failed: <error>` |
| Timeout | `Connection timed out` |
| Auth rejected | `Authentication failed` |

## Terminal

The terminal is a full PTY shell. It supports 10,000 scrollback lines and uses the JetBrains Mono font.

### Terminal type

The PTY is requested with the terminal type `xterm-256color`. The column and row count passed to the server comes from the terminal viewport size at connect time.

### Keyboard input

**Desktop** (macOS, Windows, Linux, web): Input is handled by a global keyboard listener that routes keystrokes to the terminal. Clipboard shortcuts are intercepted and sent to the terminal's shortcut handler instead of the remote shell:

| Action | Shortcut |
|---|---|
| Copy | Ctrl+Shift+C (Linux/Windows/Web) or Cmd+C (macOS) |
| Paste | Ctrl+V or Ctrl+Shift+V (Linux/Windows/Web) or Cmd+V (macOS) |

All other keystrokes — including Ctrl+C (SIGINT), Ctrl+D (EOF), Ctrl+Z (suspend), arrow keys, and function keys — are sent directly to the remote shell.

**Mobile** (Android, iOS): A soft keyboard toolbar sits above the on-screen keyboard with the following keys:

| Key | Sends | Purpose |
|---|---|---|
| Esc | `0x1B` | Escape / cancel |
| Tab | `0x09` | Autocomplete |
| Ctrl | Opens a menu | Ctrl+C (SIGINT), Ctrl+D (EOF), Ctrl+Z (suspend), Ctrl+L (clear), Ctrl+R (history search), Ctrl+A (line start), Ctrl+E (line end), Ctrl+U (kill line), Ctrl+W (kill word) |
| Alt | Opens a menu | Alt+B (word back), Alt+F (word forward), Alt+. (last arg), Alt+D (kill word forward) |
| / | `/` | Forward slash |
| `\|` | `\|` | Pipe |
| ← ↑ ↓ → | ANSI escape sequences | Arrow keys |

### Terminal resize

When the terminal viewport changes size (window resize, orientation change), the new column and row counts are sent to the server via `windowchange` PTY message. This keeps the remote shell's line wrapping in sync with the visible terminal.

### Session lifecycle

- **Disconnect button**: Cancels all in-flight transfers, disconnects from the server, and returns to the connection form.
- **Server-side close**: If the server closes the connection or the stream ends, the terminal marks the session as ended and returns to the form with an error message (`Session ended: <error>`).
- **Screen disposal**: When the screen is disposed (navigated away), the session is disconnected and all transfer subscriptions are cancelled.

## SFTP file transfer

The SSH Client includes bidirectional SFTP for uploading (Push) and downloading (Pull) files. SFTP runs over a separate channel on the same SSH session — the terminal and SFTP channels do not share directory state.

### Push (upload)

1. Press **Push** (upload icon) in the status bar.
2. A file picker opens. On desktop, you can select multiple files. On mobile, picked files are copied to the app's temporary directory first so the Rust uploader has a stable filesystem path.
3. Each file is uploaded to `<remote_cwd>/<filename>`.
4. The transfer appears in the transfers panel with a progress bar and speed indicator.
5. On completion, a line is echoed in the terminal: `[scp] ↑ uploaded <filename> → <remote_path>`.

### Pull (download)

1. Press **Pull** (download icon) in the status bar.
2. A remote file picker sheet opens, showing the contents of the current remote directory.
3. Navigate directories by tapping folders. Tap `.. (parent)` to go up.
4. Tap a file to select it. On desktop, a native save dialog asks for the destination path. On mobile, the file is saved to the app's documents directory.
5. The transfer appears in the transfers panel.
6. On completion, a line is echoed in the terminal: `[scp] ↓ downloaded <filename> → <local_path>`. On mobile, a snackbar also reads `Saved to <local_path>`.

### Transfer states

| State | Indicator | Notes |
|---|---|---|
| Active | Upload/download arrow, progress bar, percentage | Cancel button available |
| Done | Green checkmark, full progress bar | Shows `Done` |
| Cancelled | Error-tone icon | Shows `Cancelled` |
| Error | Error-tone icon | Shows `Error`, snackbar with error message |

### Transfer panel

- **Desktop**: An inline panel appears above the terminal when transfers exist. It shows active and done counts, a "Clear completed" button, and a list of transfer rows (filename, remote path, speed, progress bar, percentage).
- **Mobile**: A floating sheet at the bottom of the terminal. It can be collapsed and expanded. Transfer rows are more compact.
- The transfer list holds a maximum of 20 entries. New transfers push older ones out.

### Cancellation

Each active transfer can be cancelled individually via the close button. The transfer loop checks the cancellation flag between chunks and aborts. The partial `.part` file is deleted on both upload and download. Disconnecting the SSH session cancels all active transfers.

## Remote working directory

The CWD chip in the status bar shows the current remote directory that Push and Pull operate from. It has two modes:

### Follow terminal CWD

When enabled (default), a timer refreshes the CWD every 2 seconds by discovering the terminal's shell process and resolving its working directory. The toggle button shows a sync icon when following, or a sync-disabled icon when manual.

This feature works by:

1. Running `ps -eo pid=,ppid=,tpgid=,tty=,etimes=` on the remote host.
2. Finding the newest PTY (the one allocated for this SSH session).
3. Identifying the foreground process group leader on that PTY — this is the active shell at the prompt.
4. Resolving `/proc/<pid>/cwd` through SFTP `canonicalize`.

This requires a Linux target with `/proc` filesystem and the `ps` command. On non-Linux targets or when `/proc` is unavailable, the CWD stays at the last known value or falls back to `.` (server default).

### Manual CWD

Tap the CWD chip to open a dialog where you can type a path. The path is resolved with `sshSftpRealpath` (SFTP `canonicalize`), and follow mode is disabled. This is useful on targets where process discovery does not work.

### Initial CWD resolution

After connecting, the client attempts to resolve the home directory via `sshSftpRealpath(path: '.')`. If SFTP is disabled on the server, this fails silently and the CWD stays at `.` — the chip displays `~ (server default)`. Push and Pull will surface a clearer error when actually used.

## Host key handling

The SSH Client **accepts every server host key without verification**. The key type and SHA-256 fingerprint are captured and displayed in the status bar, but they are never compared against a known-hosts database.

This is a deliberate trade-off for usability on embedded and IoT testing workflows where known-hosts files are rarely available and host keys change frequently. It also means the client cannot detect a man-in-the-middle attack. If you need host key verification, use a standard SSH client with `StrictHostKeyChecking` instead.

## Limitations

- **No host key verification.** All server keys are accepted. See [Host key handling](#host-key-handling).
- **No known-hosts management.** There is no `known_hosts` file, no TOFU (trust on first use), and no fingerprint comparison across sessions.
- **No agent forwarding.** The client does not support SSH agent forwarding.
- **No port forwarding.** Local, remote, and dynamic port forwarding are not implemented.
- **No SCP protocol.** File transfer uses SFTP only. The `[scp]` prefixes in terminal echo lines are cosmetic labels, not SCP protocol messages.
- **CWD tracking requires Linux.** Process discovery via `ps` and `/proc` works on Linux targets only. On macOS, BSD, or other targets, use manual CWD entry.
- **Single session.** Only one SSH session at a time. Opening a new connection disconnects the previous one.
- **No session persistence.** Disconnecting or navigating away ends the session. There is no reconnection or session resumption.
- **Connection timeout is fixed at 10 seconds.** This cannot be changed from the UI.
- **Mobile file staging.** On mobile platforms, picked files are copied to the app's temporary directory before upload. Large files will consume temporary storage until the upload completes or fails.
- **SFTP server support required.** If the SSH server does not have the SFTP subsystem enabled, Push and Pull will fail. CWD resolution also fails silently — the chip shows `~ (server default)`.

## Troubleshooting

### SSH Client card not visible on the Toolkit page

You are on a web build. The SSH Client requires Rust native code, which is not compiled for web. Use a native build.

### `Connection timed out`

The server did not respond within 10 seconds. Check the host and port, verify network reachability, and confirm the SSH service is running. Firewalls between the device and the target may drop the connection.

### `Connection failed: <error>`

The TCP connection was established but the SSH handshake or authentication failed. Common causes: wrong port, non-SSH service on the port, or a protocol mismatch.

### `Authentication failed`

The server rejected the credentials. For password auth, verify the password. For public key auth, verify the PEM is valid and the corresponding public key is in the server's `authorized_keys`. For `none` auth, the server must explicitly allow it (most do not).

### Terminal shows no output after connecting

The shell may not have started, or the server may be sending data the terminal cannot decode. The terminal replaces invalid UTF-8 bytes rather than crashing. If the server sends binary data or the shell is not interactive, you may see no output. Try pressing Enter or running a command like `ls`.

### CWD chip shows `~ (server default)`

SFTP realpath failed — either SFTP is not enabled on the server, or the initial resolution failed. Push and Pull will still attempt to operate from the server's default start directory. If SFTP is not supported, transfers will fail with an error.

### CWD does not update when I `cd` in the terminal

The target may not be Linux, or `/proc` may not be available. CWD tracking relies on `ps` output and `/proc/<pid>/cwd` resolution. Tap the CWD chip to enter a path manually, or toggle follow mode off and back on.

### Upload fails with a rename error

OpenSSH's SFTP server rejects rename if the destination already exists. The uploader attempts a best-effort remove of the destination before renaming, but if the server does not allow it (permissions, locked file), the rename fails. Delete the existing remote file first, or upload to a different path.

### Download saves to an unexpected location on mobile

On mobile, downloads go to the app's documents directory (`getApplicationDocumentsDirectory()`). The path is shown in the snackbar and echoed in the terminal. Use a file manager or the platform's share sheet to access the file.

### Transfers disappear from the list

The transfer list holds a maximum of 20 entries. New transfers push older ones out. Completed transfers can also be cleared with the "Clear completed" button (desktop) or by disconnecting.

### `Session ended: <error>`

The server closed the connection, the network dropped, or the SSH keepalive failed after 3 missed intervals (45 seconds). Reconnect to resume.

## Recommended workflow

1. Open **Toolkit** and select **SSH Client**.
2. Enter the host, port, and username. Pick an authentication method.
3. Press **Connect**. Verify the server banner fingerprint matches what you expect.
4. Use the terminal as needed. On mobile, use the keyboard toolbar for control keys.
5. To upload a file, press **Push** and select files from the local picker.
6. To download a file, press **Pull** and navigate the remote file picker.
7. Monitor transfers in the panel or floating sheet. Cancel if needed.
8. Press **Disconnect** when done. This also cancels any in-flight transfers.

For CAN bus frame analysis, continue to [CAN analysis](/blog/en/manual/can-analysis/).
