---
title: Use the SSH terminal and SFTP
description: Connect to an authorized SSH host, run an interactive shell, and transfer files with SFTP in IoTSploit v0.0.16.
---

**SSH Client** provides an interactive terminal and SFTP transfers without requiring an external SSH program.

The tool is available in native production, development, and offline builds of **v0.0.16**. It does not appear in the Web build.

:::danger[Host identity is not verified]
The v0.0.16 SSH Client displays the server key fingerprint but does not reject an unknown or changed host key. A successful connection does not prove that you reached the intended server. Use a trusted network and compare the displayed fingerprint with a value obtained from the administrator through a separate trusted channel before entering credentials or sensitive commands.
:::

## Before you connect

Prepare:

- an authorized hostname or IP address;
- the SSH port, normally `22`;
- a username;
- a password or PEM private key when required;
- the expected server-key fingerprint;
- an approved plan for commands and file transfers.

The application saves up to five recent combinations of host, port, and username. It does not use those entries as proof of server identity. Passwords, private keys, and passphrases are not included in the recent-target entry.

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

### Protect credentials

- Avoid pasting a private key from a shared clipboard.
- Do not use the client on a shared or untrusted device.
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

## Disconnect

Select **Disconnect** when finished. Confirm that:

- no command is still running;
- no transfer is active;
- required output has been preserved;
- temporary or sensitive files have been removed according to the test plan.

## Limits

- Server host keys are displayed but not enforced.
- Port forwarding is not supported.
- CWD tracking is most reliable on Linux targets.
- Recent targets store connection coordinates, not a trust decision.
- File-transfer behavior depends on the remote SFTP server and local platform.
- Closing the page or losing the network ends the interactive session.

## Troubleshooting

### Connection times out

Check the host, port, routing, firewall, VPN, and server status.

### Authentication fails

Confirm the username and chosen authentication method. For public-key login, verify that the PEM private key matches a public key authorized by the server.

### The fingerprint changed

Stop. Ask the administrator to confirm whether the server key was intentionally replaced. Do not accept the change based only on the current connection.

### The terminal connects but shows no prompt

Press Enter once, then confirm that the account has an interactive shell. Some restricted accounts permit SFTP but not terminal access.

### Upload or download fails

Check SFTP availability, remote permissions, free space, the selected directory, and whether a file with the same name already exists.

## Next step

Return to the [IoTSploit feature map](/blog/en/manual/iotsploit-ui-overview/) to choose another authorized workflow.
