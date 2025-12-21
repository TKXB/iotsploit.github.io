---
title: Attack Path Analysis 使用教程
description: 配置 LLM（Base URL / API Key / Model），选择入口点与资产节点，并通过 AI 生成 TARA 表格结果。
---

## 目标

本教程带你使用 **Attack Path Analysis** 画布完成一次最小闭环：

- **配置 LLM**：在顶部 `Options` 菜单里设置 **API Base URL / API Key / Model**
- **建模**：至少添加 1 个攻击入口点（例如 `JTAG` / `UART`），并添加/选择目标 **资产（Asset）节点**
- **生成结果**：点击画布右上角浮动按钮栏里的 **AI** 按钮，生成 **TARA** 结果表格

## 前置条件

- 你已能打开 ThreatFlow 的 **Attack Path Analysis** 页面
- 你的网络环境可以正常访问 OpenAI 或 DeepSeek 的接口（如在公司/校园网环境下，可能需要网络代理或放行策略）
- 你有可用的 LLM 接口信息：
  - **Base URL**（二选一）：
    - OpenAI：`https://api.openai.com/v1`
    - DeepSeek：`https://api.deepseek.com`（如果你的环境需要填写带 `/v1` 的地址，则使用 `https://api.deepseek.com/v1`）
  - **API Key**：你在对应平台控制台创建的**真实 API Key**（例如 `sk-...`）
  - **Model**（示例）：
    - OpenAI：`gpt-4o-mini`
    - DeepSeek：`deepseek-chat` / `deepseek-reasoner`

## 第一步：在 Options 菜单配置 LLM

1. 打开页面顶部栏右侧的 **Options** 下拉菜单。
2. 点击 **LLM Settings**。
3. 填写并保存：
   - **Base URL**：
     - OpenAI：`https://api.openai.com/v1`
     - DeepSeek：`https://api.deepseek.com`（或 `https://api.deepseek.com/v1`，如果你的环境需要填写带 `/v1` 的地址）
   - **API Key**：你的**真实** Key（例如 `sk-...`）
   - **Model**：
     - OpenAI：`gpt-4o-mini`
     - DeepSeek：`deepseek-chat` / `deepseek-reasoner`
4. 点击 **Save** 关闭设置面板。

> 说明：Base URL / API Key / Model 会保存在**当前浏览器**的本地存储中，刷新页面后仍会保留。请不要在公共电脑或不受信设备上输入真实 API Key。

## 第二步：添加至少一个攻击入口点（Entry Point）

左侧的 **Attack Path Analysis Palette** 中，找到入口点（Entry Point）类别，拖拽至少一个到画布上，例如：

- `JTAG`
- `UART`

> 要求：**至少一个入口点**。否则你生成的路径/风险结果通常缺少“从哪里开始攻击”的语义，TARA 的可解释性会很差。

## 第三步：添加并选择资产（Asset）节点

1. 在左侧 Palette 的 **Assets** 分组中，拖拽一个资产到画布上（例如 Web Server / Database 等）。
2. **点击该资产节点**，确保它变为选中状态。

> 小贴士：右侧 `Properties` 面板会显示当前选中节点的属性，便于你确认选中的是资产节点而不是其他类型节点。

## 第四步：用 AI 生成 TARA 结果

1. 在画布右上角的浮动按钮栏中，点击 **AI**（渐变色按钮）。
2. 等待生成完成后，下方会出现 **LLM TARA Table**。
3. 你可以在表格中：
   - **Export Excel**：导出为 `tara.xlsx`
   - **Full Screen**：全屏查看
   - **Minimize / Close**：最小化或关闭
   - **右键某一行** → **Reanalyze (LLM)**：针对某一行重新生成（如果启用）

## 常见问题

### 1) 点击 AI 没有结果或报错

- 检查 **Base URL** 是否可访问（浏览器网络面板是否返回 200/正确的 JSON）
- 检查 **API Key / Model** 是否正确
- 确认已添加至少一个 **Entry Point**，并选中了一个 **Asset** 节点

### 2) 为什么要“先选资产节点”？

资产节点通常代表你关心的目标或受影响对象。先选中资产有助于：

- 让生成的 TARA 更聚焦（围绕资产的影响、路径、可行性）
- 让表格中的 `Impact / Attack path / Entry Point` 字段更一致、可读性更强


