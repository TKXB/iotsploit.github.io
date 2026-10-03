---
title: Use the SSH terminal and SFTP
description: Connect to an authorized SSH host, reach it through jump hosts, keep several sessions, save passwords, and transfer files with SFTP in IoTSploit v0.0.19.
---

**SSH Client** provides an interactive terminal and SFTP transfers without requiring an external SSH program. It can also reach a host through chained jump hosts and keep several sessions open at once.

This guide covers the public **v0.0.19** release. The tool is available in native production, development, and offline builds. It does not appear in the Web build.

_Evidence: every label and behavior below was re-derived from IoTSploit UI **v0.0.19** (tag `v0.0.19`, commit `6bb8b5b`, 2026-09-28)._

:::danger[Host identity is not verified]
The SSH Client displays the server key fingerprint but does not reject an unknown or changed host key. A successful connection does not prove that you reached the intended server. Use a trusted network and compare the displayed fingerprint with a value obtained from the administrator through a separate trusted channel before entering credentials or sensitive commands.
:::

## Before you connect

Prepare:

- an authorized hostname or IP address;
- the SSH port, normally `22`;
- a username;
- a password or PEM private key when required;
- the expected server-key fingerprint;
- an approved plan for commands and file transfers;
- for a routed connection, authorized access and credentials for every machine in the chain.

The field starts on `127.0.0.1:22` as `root`; replace it with the host you are authorized to use.

The application saves up to five recent **routes**. A route is the destination host plus every jump host used to reach it, and the Recents strip shows the destination first (`user@host via user@jump → user@jump`). A recent entry stores connection addresses, not a trust decision. Credentials are not part of a recent entry, but you can opt in to store a password separately; see [Saved passwords](#saved-passwords).

## Connect to the host

1. Open **Toolkit**.
2. Select **SSH Client**.
3. Enter the host, port, and username.
4. Choose an authentication method:
   - **Password**
   - **Public Key**
   - **None**, only when the server explicitly allows it
5. Enter the required credential.
6. Select **Connect**.
7. Compare the displayed server-key fingerprint with the administrator's trusted value before continuing.

If the fingerprint does not match, disconnect immediately. Do not enter commands or transfer files.

### Reach a host through jump hosts

Turn on **Connect through a jump host** to put one or more hops in front of the target. Each hop and the target take the same host, port, username, and authentication fields. Add a hop with **Add another hop**; the form allows three and then reads **Three hops is the maximum.** Remove a hop with its close button, or turn the switch off to clear the whole route and connect directly.

The route strip above the form reads `this device → Jump host 1 → … → Target`, outermost first, so the two hostnames can never be confused for each other. Hop cards are labelled **JUMP 1**, **JUMP 2**, and **JUMP 3**; the destination card is labelled **TARGET**.

A chain performs one login per host, so **Connect** becomes a short list that fills in as each machine answers. Every row names its role and address, shows whether it is pending, authenticating, connected, or refused, and reports how long the hop took. While an attempt is running the rows read `waiting to start`, `waiting for the hop before it`, `authenticating`, `authenticating through <hop>`, or `connected`; a hop that was never tried is marked `never contacted`.

The client reaches each later hop by asking the previous one to open a TCP forward, so the jump host must permit it. If a host accepts your login but refuses the forward, the error names both ends and the likely cause:

```text
root@10.0.0.1 will not forward to 10.42.0.7:22. Its SSH config may have
AllowTcpForwarding no, or 10.42.0.7 is not reachable from it.
```

Adjust the jump host's SSH configuration to allow forwarding, or confirm that the next host is reachable from it. Each host in the chain authenticates as itself, so the target's credentials are sent to the target and not to the jump host.

### Protect credentials

- Avoid pasting a private key from a shared clipboard.
- Do not use the client on a shared or untrusted device.
- Leave **Save password** off on a device others can use; a saved password lowers the protection around that host.
- Keep terminal logs and screenshots free of passwords, tokens, and private-key material.
- Disconnect when the task is complete.

## Use the terminal

After connecting, the page shows the terminal and connection status.

Type commands exactly as you would in an interactive shell. Commands run with the permissions of the authenticated account and can modify or delete remote data.

Before a state-changing command:

1. confirm the prompt belongs to the intended host;
2. confirm the current directory;
3. use an absolute path when ambiguity could cause damage;
4. preserve required files or configuration;
5. verify that the command is inside the approved test procedure.

The terminal follows window-size changes and supports normal interactive input. Session behavior still depends on the remote shell, operating system, and account configuration.

## Work with several sessions

With a session open, the connection form gives way to a session stack. On desktop, a rail lists the open sessions under **OPEN · N**; on a phone the app bar gains a **New session** button and shows one terminal at a time. The status chip in the app bar reads **● N connected**, or **Disconnected** when nothing is live.

- **New session** opens the connection form again without closing anything.
- **Back to sessions** returns to the terminals from the form.
- **Expand all** and **Collapse all** fold or unfold every pane at once.
- Selecting a pane header collapses or expands that pane, and **Show only this session** folds the rest.
- A collapsed pane still shows its last line of output and a count of lines printed while it was folded.
- **Disconnect** (the logout icon) ends a session and removes its pane; **Close** removes a pane whose session has already ended.
- **Disconnect all** ends every open session after a confirmation.

Sessions are application-scoped. Leaving the SSH Client page does not end them, and output that arrives while you are on another page or while a pane is folded is kept. A session ends only when you disconnect it, close its pane, or exit the application.

## Understand the working-directory display

The CWD indicator attempts to follow the remote shell's current directory. Automatic tracking works best on Linux targets where the required process information is available.

If the displayed directory is missing or stale:

- select the CWD indicator and enter the path manually;
- disable and re-enable follow mode;
- confirm the directory in the shell with `pwd` before transferring files.

Do not use the CWD display as the only check before an upload or download.

## Transfer files with SFTP

:::caution[Check source and destination paths]
An upload can replace an existing remote file, and a download can create or replace a local file depending on platform behavior. Confirm both paths and preserve important data before starting a transfer.
:::

### Upload

1. Confirm the remote working directory.
2. Select **Push**.
3. Choose one or more local files.
4. Review the selected filenames.
5. Start the transfer and wait for completion.
6. Verify the remote file size or hash.

### Download

1. Confirm the remote working directory.
2. Select **Pull**.
3. Choose the remote file.
4. Select a local destination when prompted.
5. Wait for completion.
6. Verify the local file size or hash before using it.

Cancel stops the transfer being tracked by the application. After a canceled or interrupted transfer, check both systems for temporary or partial files.

## Saved passwords

No password is retained by default. To keep one, turn on **Save password** for that host before connecting; every host in a chain, jump hosts included, has its own switch. The password is written only after the whole chain has authenticated, so a mistyped password is never kept, and it applies only to hosts using the **Password** method.

Where a saved password goes depends on the machine:

- **Operating-system keychain.** Normally the password is stored in the OS keychain (Keychain, Keystore, DPAPI, or libsecret).
- **Encrypted file.** If no working keyring is available — a kiosk Pi with no Secret Service, for example — the switch remains, but the password is stored with AES-256-GCM in a file under the application's data folder. The form says so: **No system keyring found. The password will be saved encrypted in the app's data folder.** The key sits beside the encrypted file, so this keeps passwords out of plaintext files and casual searches, and no more: anyone who can read your files can read them.

Saved passwords are keyed to a host (`user@host:port`), not to a route, so a jump host's saved password serves every route through it. Selecting a recent route restores the saved password for each host on it; the password field shows a key mark while it still holds the stored value, and typing over it uses the new value. Switching a host to public-key or no-auth for one session does not delete its saved password.

**Forget saved passwords** in the Recents strip opens a **Forget saved passwords?** dialog. Confirming removes every saved SSH password on the device; recent connections stay.

## Disconnect

Select **Disconnect** when finished. Confirm that:

- no command is still running;
- no transfer is active;
- required output has been preserved;
- temporary or sensitive files have been removed according to the test plan.

## Limits

- Server host keys are displayed but not enforced.
- There is no user-facing port-forwarding control. The client uses TCP forwarding internally to reach a target through jump hosts, and a jump host can refuse it.
- Up to three jump hosts can be chained, and up to five routes are remembered.
- CWD tracking is most reliable on Linux targets.
- A recent entry stores connection coordinates, not a trust decision, and is separate from any saved password.
- File-transfer behavior depends on the remote SFTP server and local platform.
- Sessions survive leaving the page, but they end when the application exits.

## Troubleshooting

### Connection times out

Check the host, port, routing, firewall, VPN, and server status. For a routed connection, check the hop named in the progress list: an earlier hop that never reached `connected` stops the chain.

### The jump host will not forward

The error names the hop that refused and the host it could not reach, and points at `AllowTcpForwarding no`. Ask the administrator to allow TCP forwarding on that host, or confirm that the next host is reachable from it. A client cannot work around a server that forbids forwarding.

### A saved password is rejected

The message may end with **saved password may be out of date**. Turn **Save password** off and connect with the current password, or use **Forget saved passwords** and enter it again. A rejected saved password is never overwritten until a connection succeeds.

### Authentication fails

Confirm the username and chosen authentication method. For public-key login, verify that the PEM private key matches a public key authorized by the server. In a chain, the failing host is named in the error.

### The fingerprint changed

Stop. Ask the administrator to confirm whether the server key was intentionally replaced. Do not accept the change based only on the current connection.

### The terminal connects but shows no prompt

Press Enter once, then confirm that the account has an interactive shell. Some restricted accounts permit SFTP but not terminal access.

### Upload or download fails

Check SFTP availability, remote permissions, free space, the selected directory, and whether a file with the same name already exists.

## Next step

Return to the [IoTSploit feature map](/blog/en/manual/iotsploit-ui-overview/) to choose another authorized workflow.
