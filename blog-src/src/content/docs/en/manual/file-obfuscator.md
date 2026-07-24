---
title: File Obfuscator user manual
description: Hide a file inside an image, recover it with a password, and understand the format's security and transfer limits.
---

The File Obfuscator packages one file with an image so that the image remains viewable while IoTSploit can recover the attached file. The tool runs its primary hide and extract operations on the device and is available in the offline application flavor.

This is a convenience format for controlled use, not a replacement for a vetted encrypted archive or secure file-sharing service. The current implementation appends data to the image rather than hiding data inside image pixels. File inspection tools can find the appended ZIP data.

:::caution[Use only with authorization]
Use File Obfuscator only with files you own or are authorized to handle. Do not use it to evade security controls, conceal malicious content, or bypass an organization's data-handling rules.
:::

## Open the tool

In the IoTSploit application:

1. Open **Toolkit**.
2. Select **File Obfuscation**.
3. Choose the **Hide Files** or **Extract Files** tab.

![File Obfuscation screen showing the file, carrier image, and password steps](/blog/images/file_obfucation.png)

## Before you start

To hide a file, prepare:

- one file to package;
- one carrier image accepted by your platform's image picker;
- a password you can store safely;
- enough free memory for the input file, carrier image, and generated output.

IoTSploit reads both inputs into memory. Large files or images may fail on devices with limited memory. The generated image is also larger than the original carrier because it contains the original image bytes plus an appended ZIP payload.

The password is required for extraction. IoTSploit does not provide password recovery.

## Hide a file in an image

1. Open the **Hide Files** tab.
2. Under **Select File to Hide**, click **Select File** and choose the file to package.
3. Under **Select Carrier Image**, click **Select Image** and choose the carrier.
4. Under **Set Password**, enter the password that will be required during extraction.
5. Click **Process Obfuscation**.

On the web, the browser downloads a file named `obfuscated_<carrier-name>`. On other supported platforms, IoTSploit opens a save dialog with the same suggested name.

Keep the result as a file. Services that resize, optimize, or re-encode the image can remove the appended payload even when the visible image still looks unchanged.

### Optional server upload

After a successful operation, non-offline builds may show **Upload to Server**. This sends the generated file to the server configured in the application and returns a download URL.

Uploading is separate from local obfuscation. Before using it, confirm that the configured server is trusted and that uploading the selected content complies with your organization's rules. The offline build does not show this option.

## Extract the original file

1. Open the **Extract Files** tab.
2. Under **Select Obfuscated Image**, click **Select Image** and choose a file created by File Obfuscator.
3. Under **Enter Decryption Password**, enter the original password.
4. Click **Extract File**.
5. Save the recovered file when prompted.

IoTSploit reads the original filename from the embedded metadata and uses it as the suggested output name.

The web application first attempts extraction in the browser. If that attempt fails, a configured build may try its server extraction endpoint. Non-web builds do not use that server fallback.

## How the file format works

The implementation performs these steps:

1. Derive a 32-byte key from the password and a 16-byte salt using HMAC-SHA-256.
2. Encrypt the selected file with AES in CBC mode.
3. Store the encrypted bytes and `metadata.json` in a ZIP archive. The metadata contains the original filename, salt, and creation time.
4. Append the ZIP bytes to the unmodified carrier-image bytes.

During extraction, IoTSploit searches for the ZIP header, reads the metadata and encrypted file, derives the same key from the password, and decrypts the content.

The carrier is usually still viewable because many image decoders ignore trailing bytes. This behavior depends on the decoder and file format; it is not a guarantee that every image tool will preserve or accept the output.

## Security limits

Understand these limits before relying on the output:

- **The payload is discoverable.** A ZIP signature and appended data can be identified by file-analysis tools.
- **The container is not authenticated.** AES-CBC in this implementation does not include a message authentication code, so the format does not provide a reliable tamper check.
- **Password hardening is limited.** The current key derivation is a single HMAC-SHA-256 operation, not PBKDF2, scrypt, or Argon2. A weak password is easier to guess offline.
- **Randomness is not cryptographically strong throughout the current implementation.** Do not treat the format as a reviewed cryptographic storage system.
- **Metadata is not encrypted.** The ZIP entry `metadata.json` contains the original filename and creation time in readable form.
- **The visible image is not proof of recovery.** An image can still open after its appended data has been removed or corrupted.

For sensitive material, use an authenticated encryption format maintained for secure storage or transfer. File Obfuscator is better suited to demonstrations, format experiments, and controlled workflows where its limitations are understood.

## Transfer the generated image without breaking it

The output must arrive byte for byte. Use a transfer method that preserves the file as an attachment or archive.

Before deleting the original output:

1. transfer the file;
2. compare its byte size or cryptographic hash at both ends;
3. run an extraction test with the intended recipient;
4. keep a separate backup of the original file.

Do not paste the image into a chat composer or photo editor. Many applications decode and save a new image, which discards the appended ZIP payload. Sending as a document may preserve the bytes, but verify the received file rather than assuming it did.

## Troubleshooting

### "Please select both a file to hide and a carrier image"

Both inputs must be selected before **Process Obfuscation** is available. Re-select either input if its name no longer appears in the form.

### "Please enter a password for encryption"

Enter a non-empty password under **Set Password**. Store it before creating the output because the application cannot recover it.

### "No hidden file found in the image"

The selected file does not contain the expected ZIP header, or another application removed or changed the appended data.

- select the original `obfuscated_...` file;
- compare its size with the file created by IoTSploit;
- repeat the hide operation if the output was re-encoded.

### "Metadata file not found" or "Encrypted file not found"

The appended ZIP is incomplete or is not an IoTSploit File Obfuscator container. Use the original output and avoid tools that modify the file.

### Extraction fails with the correct image

Check the password exactly, including capitalization and spaces. If the password is correct, the encrypted data may be truncated or modified. Create a fresh output and test extraction before transferring it.

### The operation fails with a large file

The tool holds the selected file, image, archive, and output in memory. Try a smaller input file or carrier image, close other applications, and repeat the operation.

### Saving was canceled

The operation may have completed even if the save dialog was canceled. Run it again and choose a destination when prompted.

## Recommended workflow

For each output:

1. use a unique password from a password manager;
2. create the obfuscated image;
3. extract it immediately as a round-trip test;
4. transfer it using a byte-preserving method;
5. verify extraction again at the destination;
6. retain the original file in an appropriate secure backup.

The round-trip test matters more than whether the carrier still looks like an ordinary image.
