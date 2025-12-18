---
title: File Obfuscator User Manual
description: Complete guide to hiding files in images using steganography and encryption in the iotsploit client.
---

## Table of Contents
1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Features](#features)
4. [Usage Guide](#usage-guide)
5. [Security Features](#security-features)
6. [Troubleshooting](#troubleshooting)
7. [Examples](#examples)
8. [Best Practices](#best-practices)

## Overview

File Obfuscation is a feature in **iotsploit client** that combines steganography and encryption to hide files within images. It provides a secure way to conceal sensitive documents, messages, or any digital content within seemingly innocent image files, effectively bypassing regulatory monitoring and content filtering systems.

**Location**: In **iotsploit client**, the File Obfuscation tool is available in the **Toolkit** section under the "File Obfuscation" card.

![Tool Screenshot](/images/file_obfucation.png)

### What is Steganography?
Steganography is the practice of concealing information within other non-secret data or a physical object. In our case, we hide files within images in a way that is invisible to the human eye and difficult to detect without the proper tools.

### What is File Obfuscation?
File obfuscation involves making files unreadable or unrecognizable to unauthorized users while maintaining their original functionality for authorized users.

### Regulatory Bypass Benefits
By embedding files within images, this tool provides an effective method to bypass regulatory monitoring systems:
- **Content Filtering Evasion**: Image files are typically not subject to the same content scanning as document files
- **Network Monitoring Avoidance**: Image transfers often pass through monitoring systems without triggering alerts
- **Platform Restrictions Bypass**: Many platforms allow image sharing while restricting document uploads
- **Stealth Communication**: Enables secure file transmission that appears as normal image sharing

## How It Works

The File Obfuscator uses a multi-layered approach to securely hide files:

### 1. Encryption Layer
- **AES-256 Encryption**: Industry-standard encryption algorithm
- **Salt Generation**: Random 16-byte salt for each operation
- **IV (Initialization Vector)**: Random 16-byte IV for each encryption
- **Key Derivation**: PBKDF2-like key derivation using HMAC-SHA256

### 2. Compression Layer
- **ZIP Archive**: Compresses encrypted data for efficient storage
- **Metadata Storage**: Stores file information and encryption parameters
- **File Organization**: Structured archive with encrypted file and metadata

### 3. Steganography Layer
- **Image Carrier**: Uses your selected image as the carrier
- **Data Appending**: Appends the encrypted archive to the image data
- **Seamless Integration**: The image remains visually identical

## Features

### 🔒 **Advanced Security**
- AES-256 encryption with CBC mode
- Unique salt and IV for each operation
- Strong password-based key derivation
- Tamper-resistant metadata storage

### 🖼️ **Image Compatibility**
- Supports all common image formats
- Maintains original image quality
- No visible changes to the carrier image
- Efficient data embedding

### 📦 **Smart Compression**
- ZIP compression for optimal storage
- Metadata preservation
- Fast compression and decompression
- Cross-platform compatibility

### 🔑 **Password Protection**
- User-defined passwords
- Salt-based key derivation
- No password storage in the system
- Secure key generation

### 🚫 **Regulatory Bypass**
- Bypasses content filtering systems
- Evades network monitoring
- Overcomes platform restrictions
- Enables stealth file transmission

## Usage Guide

### How to Find the File Obfuscator Tool

The File Obfuscator tool is located in the **Toolkit** section of your Flutter application:

1. **Launch the Application**
   - Open your Flutter application
   - Look for the main navigation menu

2. **Navigate to Toolkit**
   - Find and click on the "Toolkit" menu item
   - This will take you to the tools overview page

3. **Locate File Obfuscation**
   - Look for the "File Obfuscation" card
   - It displays the description: "Hide files in images using steganography and encryption"
   - The card has a distinctive icon representing file obfuscation

4. **Access the Tool**
   - Click on the "File Obfuscation" card
   - This will open the File Obfuscator interface

### Prerequisites
- Flutter GUI application with the File Obfuscator tool
- Image file to use as carrier
- File to hide
- Strong password for encryption

### Step 1: Hiding Files

1. **Open the File Obfuscator Tool**
   - Launch your Flutter application
   - Navigate to the **Toolkit** section
   - Click on the "File Obfuscation" card
   - Select "Hide File" option from the tool interface

2. **Select Your Files**
   - Choose the file you want to hide
   - Select the image to use as carrier
   - Enter a strong password for encryption

3. **Configure Settings**
   - Verify file and image selections
   - Check encryption settings
   - Confirm output location

4. **Execute the Process**
   - Click the "Hide File" button
   - Wait for the process to complete
   - Save the resulting obfuscated image

### Step 2: Extracting Files

1. **Open the Extraction Tool**
   - Navigate to the **Toolkit** section
   - Click on the "File Obfuscation" card
   - Select "Extract File" option from the tool interface

2. **Load the Obfuscated Image**
   - Select the image containing hidden data
   - Enter the password used for encryption

3. **Extract the File**
   - Click the "Extract File" button
   - Wait for the decryption process
   - Choose where to save the extracted file

4. **Verify Results**
   - Check that the file was extracted correctly
   - Verify original filename is preserved
   - Ensure file integrity is maintained

:::caution[Important Warning]
If the obfuscated image is compressed or modified by chat applications (WeChat, WhatsApp, Telegram, etc.), file extraction may fail. Always use the original obfuscated image file for extraction.
:::

## Security Features

### Encryption Details

- **Algorithm**: AES-256 with CBC mode
- **Key Size**: 256 bits (32 bytes)
- **Salt**: 16 bytes random salt per operation
- **IV**: 16 bytes random IV per encryption
- **Key Derivation**: HMAC-SHA256 with salt

### Security Benefits
- **Confidentiality**: Files are encrypted and unreadable without the password
- **Integrity**: Tampering with the image will corrupt the hidden data
- **Authentication**: Only users with the correct password can access files
- **Non-repudiation**: Each operation uses unique encryption parameters

### Threat Protection
- **Brute Force**: Strong encryption makes password guessing extremely difficult
- **Known Plaintext**: Salt and IV prevent pattern analysis
- **Side Channel**: No timing or memory leaks in implementation
- **Data Recovery**: Corrupted images cannot be used to recover hidden files
- **Regulatory Detection**: Steganography techniques make detection extremely difficult
- **Content Analysis**: Bypasses automatic content scanning and filtering systems

## Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to create ZIP archive"
**Cause**: Memory issues or corrupted input data
**Solution**:
- Ensure sufficient memory is available
- Verify input file integrity
- Check file size limits

#### 2. "No hidden file found in image"
**Cause**: Image doesn't contain hidden data or is corrupted
**Solution**:
- Verify the image contains hidden data
- Check if image was modified after hiding
- Ensure you're using the correct image file

#### 3. "Metadata file not found in hidden data"
**Cause**: Corrupted or incomplete hidden data
**Solution**:
- Verify image wasn't truncated
- Check for file corruption
- Ensure complete image loading

#### 4. "Error extracting file"
**Cause**: Incorrect password or data corruption
**Solution**:
- Verify password is correct
- Check for typos in password
- Ensure image wasn't modified

#### 5. "File extraction failed after chat transmission"
**Cause**: Chat application compressed or modified the image
**Solution**:
- Always use original obfuscated image file
- Avoid sharing through chat apps that compress images
- Use direct file transfer methods (email, cloud storage, USB)
- Verify image file size hasn't changed after transmission

### Performance Tips
- Use appropriate image sizes for hiding files
- Consider file compression before hiding
- Use strong but memorable passwords
- Keep backups of original files

## Use Cases

### Scenario 1: Hiding Personal Documents

**Use Case**: You want to hide important personal documents like contracts, certificates, or financial statements within seemingly innocent photos.

**Process**:
1. Select your sensitive document file
2. Choose a family photo or vacation picture as carrier
3. Set a strong, memorable password
4. Hide the file and save the result
5. Store the obfuscated image securely

**Benefit**: Your documents are now hidden in plain sight, appearing as just another photo in your collection.

### Scenario 2: Secure File Sharing

**Use Case**: You need to share confidential files with colleagues or clients via email or cloud storage.

**Process**:
1. Hide the confidential file within a professional-looking image
2. Share the image file through your preferred channel
3. Provide the password separately through secure communication
4. Recipient uses the tool to extract the hidden file

**Benefit**: Files can be shared through any channel without revealing their sensitive nature.

### Scenario 3: Backup and Archival

**Use Case**: You want to create secure backups of important files that won't attract attention.

**Process**:
1. Hide multiple important files in individual images
2. Use memorable images as carriers
3. Store obfuscated images in multiple locations
4. Access your files anytime with the password

**Benefit**: Secure backups that blend in with your regular photo collection.

## Best Practices

### Security Best Practices
1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns
   - Use unique passwords for different purposes

2. **Choose Appropriate Carrier Images**
   - Use high-quality images
   - Avoid heavily compressed formats
   - Consider image size vs hidden file size
   - Use images that won't raise suspicion

3. **File Management**
   - Keep backups of original files
   - Store passwords securely
   - Don't share obfuscated images publicly
   - Regularly update passwords

4. **Image Transmission Security**
   - **Never share through chat apps that compress images** (WeChat, WhatsApp, Telegram, etc.)
   - Use direct file transfer methods (email, cloud storage, USB drives)
   - Verify file integrity after transmission
   - Keep original obfuscated images for extraction

### Performance Best Practices
1. **File Size Optimization**
   - Consider file size before hiding (larger files take longer to process)
   - Use appropriate image formats (JPEG for photos, PNG for graphics)
   - Balance image quality with processing speed
   - Be patient with large files

2. **Tool Usage**
   - Don't interrupt processes while running
   - Close other applications to free system resources
   - Ensure stable network connection if using cloud features
   - Keep application updated for best performance

---

## Support and Contact

For technical support or questions about the File Obfuscator:

- **Documentation**: Refer to this manual
- **Troubleshooting**: Use the troubleshooting guide
- **Security**: Review security best practices

