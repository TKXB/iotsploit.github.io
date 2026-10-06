---
title: 用测试组、测试用例和协议帧组织 IoT Fuzzer 测试
description: 在桌面版 Management 标签页中创建和维护 IoT Fuzzer 测试组与测试用例，构建并校验协议帧，以及导入或导出测试数据。
---

**Fuzzer** 的 **Management** 标签页用于定义一次测试活动要运行什么：测试组、组内的测试用例，以及每个用例发送的协议帧。Management 负责在后端编写和保存这些定义，**Testing** 标签页负责执行。本指南介绍如何编写和组织测试、构建并校验协议帧，以及导入和导出数据。运行测试活动和查看结果另见其他指南。

![Fuzzer 的 Management 标签页，左侧为 Groups 列表，中间为 Cases 列表，右侧为空的变异工作区](/blog/images/iot-fuzzer-management.png)

:::caution[仅在获得授权时使用]
测试用例会向真实设备发送协议请求。请在隔离的实验系统中编写和检查用例，只对你拥有或已获授权测试的硬件运行。即使只读请求，如果未与生产流量隔离，也可能影响设备。
:::

## 开始之前

Management 会连接 **Configuration** 标签页中配置的后端，默认地址为 `http://localhost:8888`。如果后端无法访问，面板会退回离线示例数据并显示错误提示，因此请先确认连接。服务地址与协议配置请参见 [IoT Fuzzer：配置](/blog/zh/manual/iot-fuzzer-configuration/)。

用例必须属于某个测试组。未选中测试组时 **Add** 菜单不可用，因此请先创建测试组，再添加用例。

## Management 的界面结构

该标签页分为三个区域。

- 左侧 **Groups** 列表。每一项显示测试组名称、协议标签和用例数量。协议标签是该组协议的大写形式；当组内用例使用多种协议时显示 `MIX`。
- 中间 **Cases** 列表，只显示当前选中测试组的用例。每一项显示用例名称和协议帧负载大小（字节），禁用时附加 `· disabled`。上方搜索框可按名称过滤。
- 右侧 **workspace** 显示所选用例的输入字节和本地变异预览。

测试组和用例的操作位于各自选中项旁的操作菜单中。编辑会打开 **Properties** 侧边面板。窗口较窄时，测试组列表会收进下拉菜单，打开用例后它会替代列表显示。

## 创建和编辑测试组

创建测试组：

1. 打开 **Fuzzer**，选择 **Management**。
2. 在 **Groups** 列表中点击 **+**（**New group**）。
3. 输入 **Name**，选择 **Protocol**：`UART`、`CAN`、`SPI`、`I2C`、`ETHERNET`、`DOIP` 或 `USBTMC`。
4. 点击 **Create group**。

测试组会在后端创建，列表重新加载并自动选中新组。所选协议会成为组内新建用例的默认协议。

编辑所选测试组时，点击铅笔图标（**Edit group**），或在 **Group actions** 中选择 **Edit group**。**Properties** 面板显示 **Group Name**、**Service ID** 和 **Test Count**。修改字段后 **Save Changes** 才会启用，**Cancel** 会放弃修改。

当前更新会把测试组 **name**（及其 description）发送到后端。**Service ID** 和 **Test Count** 仅供查看，不包含在该更新中，因此这两处的修改不会被保存。

- **Group actions** 中的 **Duplicate group** 会创建名为 `<组名> (Copy)` 的副本，协议与原来一致。
- **Delete group** 会先询问 `Delete "<名称>" and its cases?`，确认后删除该组、组内所有用例及其本地变异预览。确认后立即删除。

如需把用例移到其他测试组，请把 **Cases** 列表中的用例方块拖到左侧的测试组方块上，松开即完成移动。

## 创建和编辑测试用例

选中测试组后，**Add** 菜单包含三项。

- **Create case** 在组内添加名为 `New Test Case` 的用例并打开其属性。
- **Paste text** 要求输入 **Case name** 和 **Payload text**。文本会按 UTF-8 编码，保存为十六进制的 `payload_hex` 字段。
- **Import files** 会把所选的每个文件变成以文件名命名的用例，文件字节成为该用例的 `payload_hex`。

选中用例后即可编辑，点击铅笔图标（**Edit case**）或使用 **Case actions**。**Properties** 面板包含以下部分：

- **Test Case Information** —— **Case Name**、**Description**、**Priority**（`LOW`、`NORMAL`、`HIGH` 或 `CRITICAL`）和 **Enabled**。
- **Frame Information** —— **Frame Name** 和 **Frame Description**，附加在协议帧上的标签。
- **Protocol Frame Builder** —— 协议帧字段，以及 **Frame Preview** 和 **Validate**（见下文）。
- **Test Configuration** —— **Expected Response**、**Timeout (seconds)** 和 **Iterations**。

**Case actions** 还包含 **Duplicate case**（复制为 `<名称> (Copy)`）和 **Delete case**（先询问 `Delete "<名称>"?`，然后删除用例及其已保存的预览）。移动用例的方式与上文相同，把用例拖到其他测试组即可。

对于 USBTMC 用例，面板会多出 **Edit USBTMC case sequence**，用 JSON 编辑器编辑该用例的 `protocol_settings`，用于设置该用例的模式和序列；留空对象表示沿用测试活动设置。该字段只对 USBTMC 用例保存。

## 构建并校验协议帧

**Protocol Frame Builder** 把具名字段组合成用例发送的字节。每个字段行包含 **Field Name**、**Value**、类型标记（`HEX`、`DEC`、`AUTO`、`BINARY` 或 `STRING`）和删除按钮。字段为必填时类型标记会高亮。**Add Field** 会追加一个名为 `New Field <n>`、值为 `0x00` 的十六进制字段。

**Frame Preview** 按以下规则把字段组合成字节：

1. 跳过空字段和值为 `auto` 的字段；
2. 去掉前缀 `0x`；
3. 移除非十六进制字符；
4. 长度为奇数时在开头补一个 0；
5. 输出为大写、以空格分隔的字节。

因此 `Service ID = 0x22` 与 `Data Identifier = 0xF190` 会预览为 `22 F1 90`。

**Validate** 在本地校验协议帧，不会访问后端：所有必填字段必须非空且不能为 `auto`，所有十六进制字段必须包含偶数个十六进制字符。校验通过时对话框显示 **Frame is valid and ready for testing** 和预览值；否则会列出每个不合格的字段。

打开用例时，构建器会根据已保存的 `protocol_frame` 生成字段。如果该负载为空，则退回 `Service ID = 0x10` 和 `Sub-Function = 0x01`。面板不会校验协议语义，只做上述结构检查。

## 字段来自哪个协议

测试组的协议是默认值，不是固定模板。字段来源有三处。

- **所选协议。** 新用例继承测试组的协议（复制用例时继承源用例的协议）。该协议保存为用例的 `protocol_type`。
- **后端协议帧模板。** 当后端返回协议帧模板时，面板根据模板中每个字段的名称、类型、默认值和必填标记生成字段。如果模板加载失败，面板退回两个 UDS 风格字段：`Service ID` 和 `Sub-Function`。
- **各协议的默认负载。** 创建用例且未显式指定协议帧时，面板按协议套用默认负载：

| 协议 | 默认字段 |
|---|---|
| `UART` | `command` = `0x01`，`data` = `0x00` |
| `CAN` | `service_id` = `0x10`，`sub_function` = `0x01` |
| `SPI` | `register` = `0x00`，`value` = `0x01` |
| `I2C` | `address` = `0x50`，`data` = `0x00` |
| `ETHERNET` | `packet_type` = `0x0800`，`payload` = `0x00` |
| `DOIP` | `protocol_version` = `0x02`，`message_type` = `0x01` |
| `USBTMC` | `payload_hex` = `2a49444e3f0a`（即 `*IDN?\n` 的 ASCII 字节） |

字段名可以自由填写，构建器也接受你添加的任何字段，因此请把这些默认值当作起点。请以设备文档中的真实标识符、服务和负载为准，不要假设默认值适用于你的设备。

## 预览用例的本地变异

工作区是所选用例的沙盒。它先显示用例的协议、负载大小、预期响应、超时和迭次数，然后显示 **Case input**：每个协议帧字段的字节偏移、十六进制值和长度，下方是字节视图。

控件包括 **Strategy**、**Count**、**Seed** 和 **Generate**：

- 策略包括 **Mixed**、**Bit flip**、**Byte flip**、**Byte arithmetic**、**Interesting values**、**Insert bytes**、**Delete chunk**、**Duplicate chunk**、**Swap bytes** 和 **Radamsa**；
- **Count** 接受 1 到 50,000，且整批负载上限为 64 MiB；
- **Seed** 固定随机序列，相同种子可复现同一批结果。

生成的预览保存在**本地**，不会上传到后端。选中某个预览后，可以看到哪些字节被修改、插入或删除，以及对应的操作。标题栏可 **Download bytes**，**Mutation batch actions** 中可 **Export batch JSON** 或 **Clear batch**。**Copy to new case** 会创建一个默认禁用的用例，命名为 `<用例名> · mutation <n>`，其描述记录种子和操作，便于保留某个变体而不覆盖原用例。

预览不会向目标发送任何流量，只是在本地模拟变异。**Radamsa** 策略还需要桌面版应用，并且 `PATH` 中存在 `radamsa`，在 Web、Android 和 iOS 上不可用。

## 导入与导出

目前提供两种导出和两种导入。它们都在客户端完成：使用桌面版的保存/打开对话框；在 Web 上则通过浏览器下载或读取文件。

### 导出测试组

选中测试组，打开 **Group actions**，选择 **Export group**。面板会写出 `test-group.json`，包含该测试组及其全部用例：

```json
{
  "test_groups": [
    {
      "id": "42",
      "name": "New Test Group",
      "protocol_type": "uart"
    }
  ],
  "test_cases": [
    {
      "id": "107",
      "group_id": "42",
      "name": "New Test Case",
      "description": "Protocol test case",
      "protocol_type": "uart",
      "protocol_frame": { "command": "0x01", "data": "0x00" },
      "protocol_settings": {},
      "enabled": true,
      "priority": "normal",
      "expected_response": "0x50",
      "timeout": 5000,
      "iterations": 100
    }
  ]
}
```

`protocol_frame` 保存原始字段值，`timeout` 单位为毫秒，`priority` 为小写名称，USBTMC 序列用例会包含 `protocol_settings`。面板没有与该文件对应的导入功能，因此请把它用于检查、备份或你自己的工具，而不是用来还原测试组。

### 导出变异批次

选中用例后，打开 **Mutation batch actions**，选择 **Export batch JSON**。面板会写出 `mutation-preview.json`，描述每个已生成的预览：

```json
{
  "source_case_id": "107",
  "source_case_name": "New Test Case",
  "engine": "local-radamsa-style-simulation",
  "mutations": [
    {
      "engine": "local-radamsa-style-simulation",
      "index": 0,
      "seed": 1337,
      "original": [1, 0],
      "bytes": [1, 1],
      "protocol_frame": { "command": "01", "data": "01" },
      "operations": ["Bit flip · data"]
    }
  ]
}
```

`original` 和 `bytes` 是十进制字节数组，`operations` 说明每次改动所用的策略和字段。使用 **Radamsa** 策略时，`engine` 为 `radamsa`。

### 导入用例

两种导入都会在所选测试组中创建用例，且都不会读取 `test-group.json`。

- **Paste text** 把文本按 UTF-8 字节保存到 `payload_hex` 字段。
- **Import files** 把所选文件的字节保存到 `payload_hex` 字段，并以文件名命名用例。

## 一个非破坏性的实验示例

下面的示例定义一个只读请求并预览变异，不会发送任何数据。这里用一个诊断读取服务作为占位，请替换为设备文档中的标识符。

1. 创建名为 `Lab · Read DID` 的测试组，协议选择 `CAN`。
2. 选中该组，点击 **Add**，选择 **Create case**。
3. 在 **Properties** 中把 **Case Name** 设为 `Read Data By Identifier`，**Priority** 设为 `NORMAL`，打开 **Enabled**，**Timeout** 设为 `2`，**Iterations** 设为 `1`，**Expected Response** 设为 `0x62`。
4. 在协议帧构建器中把第一个字段设为 `service_id = 0x22`（Read Data By Identifier），把第二个字段重命名为 `data_identifier`，值为 `0xF190`。请使用你的 ECU 文档中记录的标识符。
5. 点击 **Validate**。预览显示 `22 F1 90`。
6. 在工作区中把 **Count** 设为 `5`、**Seed** 设为 `1337`，点击 **Generate**，然后查看被修改、插入和删除的字节。
7. 点击 **Export batch JSON**，保存这份预览以便检查。

到此为止，不要执行。`0x22` 是只读服务，且一次迭代只发送一个请求，因此这个定义是非破坏性的；但该用例只能在获得授权后、于隔离的实验台上从 **Testing** 标签页运行。开始前请参阅 [IoT Fuzzer：运行测试活动](/blog/zh/manual/iot-fuzzer-campaign/)。

## 故障排查

| 现象 | 检查内容 |
|---|---|
| `Select a group to view its cases.` | 先选择或创建一个测试组 |
| **Add** 菜单不可用 | 必须先选中测试组才能添加用例 |
| `No group selected or available` | 创建用例前先选择测试组 |
| `Frame validation failed` | 填写所有必填字段，并使用偶数个十六进制字符 |
| `Failed to load protocol frame templates` | 后端未返回模板；请重新连接，或直接编辑退回字段 |
| `Import failed` | 文件无法打开或读取；请换一个文件 |
| Radamsa 预览不可用 | 使用桌面版应用并确保 `PATH` 中有 `radamsa`，或改用其他策略 |
| `Count must be between 1 and 50,000` | 调低 **Count** |
| 导入后的用例是空的 | 确认文件有可读字节，且用例显示非零负载大小 |

## 使用限制

- Management 负责编写、保存和预览定义，不负责执行。
- 本地协议帧校验只检查必填字段和十六进制长度是否为偶数，不能确认协议帧对该设备或协议是否真正有效。
- 变异预览是本地模拟，不能作为目标实际响应的依据。
- 测试组协议只是默认值，单个用例可以携带不同的 `protocol_type`。
- 确认后测试组或用例会立即删除；删除测试组也会删除其用例及本地预览。
- 导出的测试组文件在面板中没有对应的导入功能。
- 后端不可访问时，面板会退回离线示例数据并显示错误提示，此时所做的修改不会被保存。

## 下一步

请先用 [IoT Fuzzer：配置](/blog/zh/manual/iot-fuzzer-configuration/) 准备服务与协议。测试组准备好后，用 [IoT Fuzzer：运行测试活动](/blog/zh/manual/iot-fuzzer-campaign/) 运行，并参阅 [IoT Fuzzer：结果与证据](/blog/zh/manual/iot-fuzzer-results/) 查看输出。想了解该标签页在应用中的位置，请参阅 [IoTSploit UI 功能地图](/blog/zh/manual/iotsploit-ui-overview/)。
