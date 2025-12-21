---
title: Attack Path Analysis Tutorial
description: Configure LLM (Base URL / API Key / Model), select entry points and an asset node, then generate a TARA table with the AI button.
---

## Goal

This tutorial walks you through a minimal end-to-end flow in **Attack Path Analysis**:

- **Configure LLM**: set **API Base URL / API Key / Model** from the top **Options** menu
- **Model**: add at least one attack entry point (e.g. `JTAG` / `UART`) and add/select a target **Asset** node
- **Generate**: click the floating **AI** button to generate a **TARA** results table

## Prerequisites

- You can open the **Attack Path Analysis** page in ThreatFlow
- Your network can reach the OpenAI or DeepSeek API endpoints (in corporate/school networks you may need a proxy or allowlist rules)
- You have LLM connection details:
  - **Base URL** (choose one):
    - OpenAI: `https://api.openai.com/v1`
    - DeepSeek: `https://api.deepseek.com` (if you need a `/v1` URL in your environment, use `https://api.deepseek.com/v1`)
  - **API Key**: your **real API key** from the provider (e.g. `sk-...`)
  - **Model** (examples):
    - OpenAI: `gpt-4o-mini`
    - DeepSeek: `deepseek-chat` / `deepseek-reasoner`

## Step 1: Configure LLM in the Options menu

1. Open the **Options** dropdown on the right side of the top header.
2. Click **LLM Settings**.
3. Fill in and save:
   - **Base URL**:
     - OpenAI: `https://api.openai.com/v1`
     - DeepSeek: `https://api.deepseek.com` (or `https://api.deepseek.com/v1` if your environment expects a `/v1` URL)
   - **API Key**: your **real** key (e.g. `sk-...`)
   - **Model**:
     - OpenAI: `gpt-4o-mini`
     - DeepSeek: `deepseek-chat` / `deepseek-reasoner`
4. Click **Save** to close the settings panel.

> Note: Base URL / API Key / Model are stored in **this browser** (local storage), and will persist after refresh. Do not enter real API keys on shared/public computers.

## Step 2: Add at least one Entry Point

From the left **Attack Path Analysis Palette**, drag at least one entry point onto the canvas, for example:

- `JTAG`
- `UART`

> Requirement: **at least one entry point**. Without it, the analysis typically lacks a clear starting point, and generated TARA output becomes less meaningful.

## Step 3: Add and select an Asset node

1. From the **Assets** section in the left palette, drag an asset node onto the canvas (e.g. Web Server / Database).
2. **Click the asset node** so it becomes selected.

> Tip: the right-side `Properties` panel shows the currently selected node. Use it to confirm you selected an Asset node.

## Step 4: Generate TARA results with AI

1. In the floating toolbar at the top-right of the canvas, click **AI** (the gradient button).
2. Wait until generation completes. You’ll see **LLM TARA Table** appear at the bottom.
3. In the table, you can:
   - **Export Excel**: export to `tara.xlsx`
   - **Full Screen**: open full screen view
   - **Minimize / Close**: minimize or close the table
   - **Right-click a row** → **Reanalyze (LLM)**: regenerate a single row (if enabled)

## Troubleshooting

### 1) AI generates nothing / errors out

- Verify the **Base URL** is reachable (check browser Network tab responses)
- Verify **API Key / Model** are correct
- Ensure you added at least one **Entry Point** and selected an **Asset** node

### 2) Why do I need to select an Asset first?

Assets usually represent the target/impact scope. Selecting an asset helps:

- Keep generated TARA focused on what matters (impact + attack path around the asset)
- Improve consistency/readability of fields like `Impact / Attack path / Entry Point`


