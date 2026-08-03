// 全局翻译配置
const translations = {
  en: {
    // Navbar
    documentation: "Documentation",
    community: "Community",
    features: "Features",
    iotFuzzer: "IoT Protocol Fuzzer",
    jtagScan: "JTAG Boundary Scan",
    vulnerabilityScanner: "Vulnerability Scanner",
    protocolAnalyzer: "Protocol Analyzer",
    guide: "The Guide",
    wiki: "Wiki",
    licenseNav: "License",
    download: "Download",
    
    // Hero section
    heroTitle: "IoTSploit",
    heroSubtitle: "The Swiss Army Knife in the field of IoT security testing",
    getStarted: "Get Started",
    
    // Why section
    whyTitle: "Why IoTSploit?",
    whyDescription: "IoTSploit is a cybersecurity testing framework that modularizes testing scripts and hardware, enabling security assessments of various IoT devices. It provides a comprehensive suite of tools and features to identify vulnerabilities and ensure the robustness of IoT systems against potential threats.",
    
    // Features
    vulnerabilityTitle: "Vulnerability Detection",
    vulnerabilityDesc: "Built-in tools to identify common IoT device vulnerabilities.",
    smartTitle: "Smart",
    smartDesc: "Intuitive and user-friendly interface for effortless security testing.",
    modularTitle: "Modular Design",
    modularDesc: "Flexibly integrate and swap out testing scripts and hardware.",
    transportTitle: "Multi-Transport",
    transportDesc: "Supports a variety of IoT protocols like UART, JTAG, and BLE",
    communityTitle: "Community",
    communityDesc: "Offers detailed documentation and strong community support.",
    automationTitle: "Automation Features",
    automationDesc: "Enables automated and repeatable testing processes.",
    
    // Hardware
    hardwareTitle: "Hardware Modularity",
    hardwareDesc: "Leveraging the versatile M2 KEYE slot, IoTSploit enables seamless integration of diverse hardware modules. This adaptability ensures the toolkit evolves alongside emerging IoT technologies and security challenges.",
    
    // Dual Interface
    dualTitle: "Dual Interface",
    dualDesc: "Power users get a Cmd2-powered REPL shell (scan devices, initialize devices, execute plugin, etc.) while makers and managers enjoy a Flutter-based dashboard on desktop or mobile.",
    commandLine: "Command Line",
    flutterUI: "Flutter UI",
    
    // Plugin Management
    pluginTitle: "Plugin Management",
    pluginDesc: "IoTSploit features a powerful plugin system built on Python that lets you extend the platform with custom security testing modules. The intuitive management interface makes it easy to discover, execute, and develop plugins for testing IoT devices.",
    moduleDesign: "Modular design with pluggable interfaces",
    securityLib: "Extensive library of security testing plugins",
    customDev: "Custom plugin development with Python API",
    realTimeResults: "Real-time results with execution status tracking",
    
    // Python Plugin
    pythonTitle: "Focus on Python, Forget the UI",
    pythonDesc: "Write pure Python security testing plugins and let IoTSploit automatically generate beautiful user interfaces. No frontend code needed!",
    autoUI: "Automatic UI Generation",
    autoUIDesc: "Define parameters in your Python plugin and watch IoTSploit automatically create input fields, toggles, and controls in the Flutter UI.",
    realTimeVis: "Real-time Result Visualization",
    realTimeVisDesc: "Return structured data from your Python plugins and see it automatically rendered as tables, charts, and status indicators.",
    seamlessInt: "Seamless Integration",
    seamlessIntDesc: "New plugins are instantly available in both command-line and Flutter interfaces without any additional configuration.",
    
    // Mobile App
    mobileTitle: "IoTSploit Mobile App",
    mobileDesc: "Control & Monitor on the Go",
    mobileDetailDesc: "The IoTSploit Mobile App provides a convenient and powerful interface to control your IoT security testing from anywhere. Connect to your IoTSploit devices remotely and monitor testing results in real-time.",
    iosAndroid: "iOS & Android Compatible",
    realTimeAnalytics: "Real-time Analytics",
    remoteControl: "Remote Device Control",
    pushNotifications: "Push Notifications",
    
    // Technical Specs
    techSpecsTitle: "Hardware Technical Specifications",
    motherboard: "Motherboard",
    motherboardDesc: "The IoTSploit motherboard is engineered for maximum flexibility and connectivity, providing the perfect foundation for your IoT security testing arsenal.",
    ethernet: "100M Ethernet Switch",
    ethernetDesc: "High-speed network connectivity for testing and monitoring IoT devices",
    usbHub: "USB 2.0 HUB",
    usbHubDesc: "Multiple USB ports for connecting peripherals and test modules",
    m2Slots: "3 M.2 Key E Slots",
    m2SlotsDesc: "Expandable architecture for adding specialized daughter boards",
    daughterBoards: "Daughter Boards",
    
    // NXP Board
    nxpBoardTitle: "IoTSploit NXP Board",
    nxpBoardSubtitle: "Powerful Hardware for IoT Security Testing",
    nxpBoardDesc: "The IoTSploit NXP Board is a comprehensive hardware platform designed for advanced IoT security testing featuring USB simulation capabilities, Bad USB attacks, and integrated logic analyzer functionality.",
    nxpFeature1: "USB Simulation & Bad USB",
    nxpFeature2: "Integrated Logic Analyzer",
    nxpFeature3: "Support GUI Control, Easy to Use",
    nxpFeature4: "M.2 KEYE Expansion Slot",
    
    // Footer
    copyright: "© 2024 The IoTSploit authors",
    codeOfConduct: "Code of Conduct",
    privacyPolicy: "Privacy Policy",
    
    // JTAG Boundary Scan Page
    jtagTitle: "JTAG Boundary Scan",
    jtagDescription: "Read every pin on a running board straight off the chain, and see it painted back onto the package \u2014 live, at 30 Hz, without a single probe tip.",
    jtagTrialCta: "Get a 7-day trial",
    jtagWorkspaceCta: "See the workspace",
    jtagHeroNote: "No target firmware. No instrumentation. No pause in execution.",

    jtagStatRate: "Default sample rate",
    jtagStatPackages: "Package families drawn",
    jtagStatModes: "Operations",
    jtagStatTrial: "Free trial",

    jtagOpsTagline: "Operations",
    jtagOpsTitle: "Three instructions, one TAP",
    jtagOpsDesc: "In the order of how much trouble they can cause. Only the last one drives silicon.",
    jtagObserveTag: "Observe \u00b7 SAMPLE",
    jtagObserveTitle: "Watch the board run",
    jtagObserveDesc: "Captures the boundary register while the target keeps executing. Nothing is driven, nothing is halted.",
    jtagStageTag: "Stage \u00b7 PRELOAD",
    jtagStageTitle: "Stage values first",
    jtagStageDesc: "Set a drive value per pin. Every cell you did not touch takes the safe value the BSDL declares.",
    jtagDriveTag: "Drive \u00b7 EXTEST",
    jtagDriveTitle: "Take the pins",
    jtagDriveDesc: "Drive a net, read it back at the far end, and prove the trace. Behind a separate arming step.",

    jtagWorkspaceTagline: "Workspace",
    jtagWorkspaceTitle: "Chain, package and signals in one window",
    jtagWorkspaceDesc: "The map tells you where on the part a problem is. The table tells you what the value is.",
    jtagCalloutChainTitle: "Chain first",
    jtagCalloutChainDesc: "A TAP needs a BSDL before anything else unlocks.",
    jtagCalloutColourTitle: "Colour is the value",
    jtagCalloutColourDesc: "One palette across the map, the table and the waveform.",
    jtagCalloutSearchTitle: "Search, don't scroll",
    jtagCalloutSearchDesc: "Filter by port, pin or direction; pin any signal to the waveform.",
    jtagCalloutArmTitle: "Arming is loud",
    jtagCalloutArmDesc: "EXTEST is a separate red control with a confirmation dialog.",

    jtagSafetyTagline: "Safety",
    jtagSafetyTitle: "EXTEST can damage hardware",
    jtagSafetyDesc: "Driving a pin something else already drives is bus contention. Three defences, all on by default.",
    jtagSafeValuesTitle: "Safe values everywhere",
    jtagSafeValuesDesc: "Cells you did not stage take the safe value from the device's own BSDL.",
    jtagPreloadTitle: "Preload, then arm",
    jtagPreloadDesc: "Values reach the update latch before EXTEST is ever selected.",
    jtagExitTitle: "One way back",
    jtagExitDesc: "Leaving EXTEST returns the pins to the target and drops back to SAMPLE.",

    jtagSpecTagline: "Specifications",
    jtagSpecTitle: "What it runs on",
    jtagSpecAdaptersLabel: "Adapters",
    jtagSpecAdaptersValue: "Any debug probe with raw JTAG access \u2014 J-Link, CMSIS-DAP, FTDI. Clock set per session, 1 MHz by default.",
    jtagSpecDevicesLabel: "Devices",
    jtagSpecDevicesValue: "Any part with a published BSDL. Chain discovery decodes IDCODE and manufacturer for every TAP.",
    jtagSpecPackagesLabel: "Packages drawn",
    jtagSpecPackagesValue: ", from the BSDL pin map. Anything else falls back to the signal table.",
    jtagSpecOperationsLabel: "Operations",
    jtagSpecOperationsValue: "SAMPLE streaming, PRELOAD staging and EXTEST driving, with a waveform for any traced pin.",
    jtagSpecPlatformsLabel: "Platforms",
    jtagSpecPlatformsValue: "Linux, Windows and macOS desktop, shipped as a standalone application.",
    jtagSpecLicensingLabel: "Licensing",
    jtagSpecLicensingValue: "A signed licence bound to the machine's device fingerprint. Take a 7-day trial, then work fully offline.",

    jtagCtaTitle: "Point it at a board you have no schematics for",
    jtagCtaDesc: "Chain, pin map and live values in about ninety seconds, provided the vendor published a BSDL.",

    jtagFooterProduct: "Product",
    jtagFooterDocs: "Docs",
    jtagFooterCommunity: "Community",
    jtagFooterProject: "Project",
    jtagFooterDownloads: "Downloads",
    jtagFooterQuickStart: "Quick start",
    jtagFooterGuides: "Guides",
    jtagFooterBlog: "Blog",
    jtagFooterContact: "Contact",

    // Fuzzer Page
    fuzzerTitle: "IoT Protocol Fuzzer",
    fuzzerSubtitle: "Advanced Security Testing for IoT Protocols",
    fuzzerDescription: "Comprehensive protocol fuzzing tool designed specifically for IoT devices and communication protocols. Test security vulnerabilities with real-time monitoring and advanced analysis capabilities.",
    
    // Features
    realTimeTestingTitle: "Real-time Testing",
    realTimeTestingDesc: "Execute fuzzing campaigns with live monitoring and instant feedback on test progress and results.",
    
    protocolConfigTitle: "Protocol Configuration",
    protocolConfigDesc: "Configure and customize fuzzing parameters for various IoT protocols including UART, JTAG, BLE, and more.",
    
    testManagementTitle: "Test Management",
    testManagementDesc: "Organize test cases and groups for systematic security assessment campaigns.",
    
    resultAnalysisTitle: "Result Analysis",
    resultAnalysisDesc: "Comprehensive result analysis with live logging, filtering, and export capabilities for detailed reporting.",
    
    // Technical Features
    techFeaturesTitle: "Technical Features",
    liveLoggingTitle: "Live Logging",
    liveLoggingDesc: "Real-time log streaming with advanced filtering by status, search terms, and log levels.",
    
    performanceMonitoringTitle: "Performance Monitoring",
    performanceMonitoringDesc: "System metrics tracking including CPU, memory usage, and test execution statistics.",
    
    fileManagementTitle: "File Management",
    fileManagementDesc: "Comprehensive file management for test results, configurations, and analysis reports.",
    
    exportCapabilityTitle: "Export Capability",
    exportCapabilityDesc: "Generate detailed reports and export test data for further analysis and documentation.",
    
    // Integration
    integrationTitle: "Integration & API",
    integrationDesc: "The IoT Protocol Fuzzer integrates with Django backend API and provides WebSocket connections for real-time updates. Features include:",
    
    djangoIntegration: "Django Backend Integration",
    websocketSupport: "WebSocket Real-time Updates",
    restApi: "RESTful API Endpoints",
    errorHandling: "Advanced Error Handling",
    
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Download page
    downloadTitle: "Download IoTSploit",
    downloadSubtitle: "Get the latest version of IoTSploit for your platform",
    latestVersion: "Latest Version",
    releaseNotes: "Release Notes",
    downloadNow: "Download Now",
    comingSoon: "Coming Soon",
    
    // Platforms
    windowsTitle: "Windows",
    windowsDesc: "Compatible with Windows 10/11 (64-bit)",
    macosTitle: "macOS",
    macosDesc: "Compatible with macOS 10.15+ (Intel & Apple Silicon)",
    linuxTitle: "Linux",
    linuxDesc: "Compatible with Ubuntu 20.04+, Debian 11+, CentOS 8+",
    
    // Mobile
    mobileTitle: "Mobile Apps",
    mobileDesc: "Standalone toolkit for offline security testing on the go. Includes file obfuscation, ECC key generation, port scanning, and SSH client — all running locally on your Android device without requiring a server connection.",
    iosApp: "iOS App",
    iosAppDesc: "Requires iOS 13.0 or later",
    androidApp: "Android App",
    androidAppDesc: "Now available on Google Play",
    getItOn: "Get it on",
    
    // Web Source
    webSourceTitle: "Web Source Downloads",
    webSourceDesc: "Flutter web build output and source files",
    webAppDownload: "Download Web App",
    
    // Source Code
    sourceTitle: "Source Code",
    sourceDesc: "Build IoTSploit from source or contribute to the project",
    githubRepo: "GitHub Repository",
    dockerImage: "Docker Image",
    
    // System Requirements
    requirementsTitle: "System Requirements",
    minRequirements: "Minimum Requirements",
    recRequirements: "Recommended Requirements",
    
    // Installation
    installationTitle: "Installation Guide",
    quickStart: "Quick Start Guide",
    documentation: "Full Documentation",
    
    // Linux Download Modal
    linuxDownloadTitle: "Choose Linux Version",
    linuxDownloadDesc: "Select the Linux package format that works best for your system:",
    appImageDesc: "Universal binary for most Linux distributions",
    tarGzDesc: "Traditional archive for manual installation",
    cancel: "Cancel",

    // Trial license page
    licenseTitle: "Get a 7-Day JTAG Trial",
    licenseSubtitle: "Generate a trial license for this workstation. No account or payment method is required.",
    licenseEmailLabel: "Email address",
    licenseEmailHelp: "Used to issue or re-download this trial license.",
    licensePrivacyIntro: "See how this information is handled in our",
    licensePrivacyLink: "Privacy Policy",
    licenseFingerprintLabel: "Installation fingerprint",
    licenseFingerprintHelp: "In the IoTSploit app, open the JTAG activation screen and copy the 64-character fingerprint shown there.",
    licenseSubmit: "Get trial license",
    licenseSubmitting: "Creating license…",
    licenseSuccessTitle: "Your license is ready",
    licenseSuccessNew: "A new trial license was created for this workstation.",
    licenseSuccessReissue: "Your existing trial license was downloaded again. Its expiry date has not changed.",
    licenseExpiryLabel: "Expires",
    licenseDaysLabel: "Days remaining",
    licenseDownloadStarted: "The license file download has started. Import it from the JTAG activation screen.",
    licenseErrorFingerprint: "Enter the 64-character lowercase hexadecimal fingerprint from the IoTSploit JTAG activation screen.",
    licenseErrorEmail: "Enter a valid email address.",
    licenseErrorExpired: "This workstation's trial has expired and cannot be renewed automatically.",
    licenseErrorRateLimited: "Too many requests. Wait a moment, then try again.",
    licenseErrorServer: "The license service could not complete this request. Try again. Reference: {reference}",
    licenseErrorNetwork: "The license service could not be reached. Check your connection and try again.",
    licenseContactSupport: "Contact sales"
  },
  zh: {
    // 导航栏
    documentation: "文档",
    community: "社区",
    features: "功能特性",
    iotFuzzer: "物联网协议模糊测试",
    jtagScan: "JTAG 边界扫描",
    vulnerabilityScanner: "漏洞扫描器",
    protocolAnalyzer: "协议分析器",
    guide: "指南",
    wiki: "百科",
    licenseNav: "许可证",
    download: "下载",
    
    // 英雄部分
    heroTitle: "IoTSploit",
    heroSubtitle: "物联网安全测试领域的瑞士军刀",
    getStarted: "开始使用",
    
    // 为什么使用
    whyTitle: "为什么选择 IoTSploit？",
    whyDescription: "IoTSploit 是一个网络安全测试框架，它模块化测试脚本和硬件，能够对各种物联网设备进行安全评估。它提供了一套全面的工具和功能，以识别漏洞并确保物联网系统对潜在威胁的强健性。",
    
    // 特点
    vulnerabilityTitle: "漏洞检测",
    vulnerabilityDesc: "内置工具，用于识别常见的物联网设备漏洞。",
    smartTitle: "智能",
    smartDesc: "直观且用户友好的界面，轻松进行安全测试。",
    modularTitle: "模块化设计",
    modularDesc: "灵活集成和替换测试脚本和硬件。",
    transportTitle: "多传输协议",
    transportDesc: "支持各种物联网协议，如 UART、JTAG 和 BLE",
    communityTitle: "社区",
    communityDesc: "提供详细的文档和强大的社区支持。",
    automationTitle: "自动化功能",
    automationDesc: "实现自动化和可重复的测试过程。",
    
    // 硬件
    hardwareTitle: "硬件模块化",
    hardwareDesc: "利用通用的 M2 KEYE 插槽，IoTSploit 能够无缝集成各种硬件模块。这种适应性确保工具包随着新兴物联网技术和安全挑战的发展而不断演进。",
    
    // 双接口
    dualTitle: "双重接口",
    dualDesc: "高级用户可以使用基于 Cmd2 的 REPL shell（扫描设备、初始化设备、执行插件等），而制造商和管理者则可以在桌面或移动设备上享受基于 Flutter 的仪表板。",
    commandLine: "命令行",
    flutterUI: "Flutter 界面",
    
    // 插件管理
    pluginTitle: "插件管理",
    pluginDesc: "IoTSploit 拥有一个基于 Python 的强大插件系统，让您可以使用自定义安全测试模块扩展平台。直观的管理界面使发现、执行和开发用于测试物联网设备的插件变得轻松。",
    moduleDesign: "具有可插入接口的模块化设计",
    securityLib: "广泛的安全测试插件库",
    customDev: "使用 Python API 进行自定义插件开发",
    realTimeResults: "具有执行状态跟踪的实时结果",
    
    // Python 插件
    pythonTitle: "专注于 Python，忘记 UI",
    pythonDesc: "编写纯 Python 安全测试插件，让 IoTSploit 自动生成美观的用户界面。无需前端代码！",
    autoUI: "自动 UI 生成",
    autoUIDesc: "在 Python 插件中定义参数，观看 IoTSploit 自动创建输入字段、开关和 Flutter UI 中的控件。",
    realTimeVis: "实时结果可视化",
    realTimeVisDesc: "从 Python 插件返回结构化数据，并查看其自动呈现为表格、图表和状态指示器。",
    seamlessInt: "无缝集成",
    seamlessIntDesc: "新插件无需额外配置即可在命令行和 Flutter 界面中立即可用。",
    
    // 移动应用
    mobileTitle: "IoTSploit 移动应用",
    mobileDesc: "随时随地控制和监控",
    mobileDetailDesc: "IoTSploit 移动应用提供了一个便捷且强大的界面，可以从任何地方控制您的物联网安全测试。远程连接到您的 IoTSploit 设备并实时监控测试结果。",
    iosAndroid: "iOS 和 Android 兼容",
    realTimeAnalytics: "实时分析",
    remoteControl: "远程设备控制",
    pushNotifications: "推送通知",
    
    // 技术规格
    techSpecsTitle: "硬件技术规格",
    motherboard: "主板",
    motherboardDesc: "IoTSploit 主板专为最大灵活性和连接性而设计，为您的物联网安全测试武器库提供完美基础。",
    ethernet: "100M 以太网交换机",
    ethernetDesc: "用于测试和监控物联网设备的高速网络连接",
    usbHub: "USB 2.0 集线器",
    usbHubDesc: "多个 USB 端口，用于连接外设和测试模块",
    m2Slots: "3 个 M.2 Key E 插槽",
    m2SlotsDesc: "可扩展架构，用于添加专用子板",
    daughterBoards: "子板",
    
    // NXP 板
    nxpBoardTitle: "IoTSploit NXP 板",
    nxpBoardSubtitle: "强大的物联网安全测试硬件",
    nxpBoardDesc: "IoTSploit NXP 板是一个全面的硬件平台，专为高级物联网安全测试而设计，具有 USB 模拟功能、Bad USB 攻击和集成的逻辑分析仪功能。",
    nxpFeature1: "USB 模拟与 Bad USB",
    nxpFeature2: "集成逻辑分析仪",
    nxpFeature3: "支持图形界面控制，易于使用",
    nxpFeature4: "M.2 KEYE 扩展插槽",
    
    // 页脚
    copyright: "© 2024 IoTSploit 作者",
    codeOfConduct: "行为准则",
    privacyPolicy: "隐私政策",
    
    // JTAG 边界扫描页面
    jtagTitle: "JTAG 边界扫描",
    jtagDescription: "直接从扫描链读取运行中电路板的每一个引脚，并将结果绘制回封装图上——30 Hz 实时刷新，无需一根探针。",
    jtagTrialCta: "获取 7 天试用",
    jtagWorkspaceCta: "查看工作界面",
    jtagHeroNote: "无需目标固件。无需插桩。无需暂停运行。",

    jtagStatRate: "默认采样速率",
    jtagStatPackages: "支持绘制的封装",
    jtagStatModes: "操作类型",
    jtagStatTrial: "免费试用",

    jtagOpsTagline: "操作",
    jtagOpsTitle: "三条指令，同一个 TAP",
    jtagOpsDesc: "按风险从低到高排列，只有最后一条会真正驱动引脚。",
    jtagObserveTag: "观察 · SAMPLE",
    jtagObserveTitle: "观察运行中的电路板",
    jtagObserveDesc: "在目标继续运行的同时捕获边界寄存器。不驱动任何引脚，也不中断运行。",
    jtagStageTag: "暂存 · PRELOAD",
    jtagStageTitle: "先装载数值",
    jtagStageDesc: "为每个引脚设定驱动值。未改动的单元一律使用 BSDL 声明的安全值。",
    jtagDriveTag: "驱动 · EXTEST",
    jtagDriveTitle: "接管引脚",
    jtagDriveDesc: "驱动一条网络，在另一端读回以验证走线。位于独立的使能步骤之后。",

    jtagWorkspaceTagline: "工作界面",
    jtagWorkspaceTitle: "扫描链、封装与信号同屏呈现",
    jtagWorkspaceDesc: "封装图告诉你问题出在芯片的哪个位置，表格告诉你准确的数值。",
    jtagCalloutChainTitle: "先扫描链",
    jtagCalloutChainDesc: "TAP 必须先指定 BSDL，其他功能才会解锁。",
    jtagCalloutColourTitle: "颜色即数值",
    jtagCalloutColourDesc: "封装图、表格与波形共用同一套配色。",
    jtagCalloutSearchTitle: "用搜索，别用滚动",
    jtagCalloutSearchDesc: "可按端口、引脚或方向筛选，并将任意信号固定到波形区。",
    jtagCalloutArmTitle: "使能有明确提示",
    jtagCalloutArmDesc: "EXTEST 是独立的红色控件，并带有确认对话框。",

    jtagSafetyTagline: "安全",
    jtagSafetyTitle: "EXTEST 可能损坏硬件",
    jtagSafetyDesc: "驱动一个已被其他器件驱动的引脚就是总线冲突。三重防护，默认全部开启。",
    jtagSafeValuesTitle: "处处使用安全值",
    jtagSafeValuesDesc: "未被暂存的单元会采用器件自身 BSDL 中的安全值。",
    jtagPreloadTitle: "先预装载，再使能",
    jtagPreloadDesc: "在 EXTEST 被选中之前，数值已经进入更新锁存器。",
    jtagExitTitle: "只有一条退出路径",
    jtagExitDesc: "退出 EXTEST 会把引脚交还目标，并回到 SAMPLE。",

    jtagSpecTagline: "规格",
    jtagSpecTitle: "运行环境",
    jtagSpecAdaptersLabel: "适配器",
    jtagSpecAdaptersValue: "任何提供原始 JTAG 访问的调试探针——J-Link、CMSIS-DAP、FTDI。时钟按会话设置，默认 1 MHz。",
    jtagSpecDevicesLabel: "器件",
    jtagSpecDevicesValue: "任何有公开 BSDL 的芯片。扫描链发现会为每个 TAP 解析 IDCODE 与厂商信息。",
    jtagSpecPackagesLabel: "支持的封装",
    jtagSpecPackagesValue: "，由 BSDL 引脚映射生成。其他封装会回退到信号表格。",
    jtagSpecOperationsLabel: "操作",
    jtagSpecOperationsValue: "SAMPLE 实时流、PRELOAD 暂存与 EXTEST 驱动，并为任意信号提供波形。",
    jtagSpecPlatformsLabel: "平台",
    jtagSpecPlatformsValue: "Linux、Windows 与 macOS 桌面端，以独立应用形式发布。",
    jtagSpecLicensingLabel: "授权",
    jtagSpecLicensingValue: "与设备指纹绑定的签名授权文件。领取 7 天试用，之后完全离线可用。",

    jtagCtaTitle: "把它接到一块你没有原理图的板子上",
    jtagCtaDesc: "只要厂商公开了 BSDL，大约九十秒就能得到扫描链、引脚图与实时数值。",

    jtagFooterProduct: "产品",
    jtagFooterDocs: "文档",
    jtagFooterCommunity: "社区",
    jtagFooterProject: "项目",
    jtagFooterDownloads: "下载",
    jtagFooterQuickStart: "快速开始",
    jtagFooterGuides: "使用指南",
    jtagFooterBlog: "博客",
    jtagFooterContact: "联系我们",

    // 模糊器页面
    fuzzerTitle: "物联网协议模糊器",
    fuzzerSubtitle: "物联网协议高级安全测试工具",
    fuzzerDescription: "专为物联网设备和通信协议设计的综合协议模糊测试工具。通过实时监控和高级分析功能测试安全漏洞。",
    
    // 功能特性
    realTimeTestingTitle: "实时测试",
    realTimeTestingDesc: "执行模糊测试活动，实时监控测试进度和结果，提供即时反馈。",
    
    protocolConfigTitle: "协议配置",
    protocolConfigDesc: "为各种物联网协议（包括 UART、JTAG、BLE 等）配置和自定义模糊测试参数。",
    
    testManagementTitle: "测试管理",
    testManagementDesc: "为系统性安全评估活动组织测试用例和组。",
    
    resultAnalysisTitle: "结果分析",
    resultAnalysisDesc: "全面的结果分析，包括实时日志记录、过滤和导出功能，便于详细报告。",
    
    // 技术特性
    techFeaturesTitle: "技术特性",
    liveLoggingTitle: "实时日志",
    liveLoggingDesc: "实时日志流，支持按状态、搜索词和日志级别进行高级过滤。",
    
    performanceMonitoringTitle: "性能监控",
    performanceMonitoringDesc: "系统指标跟踪，包括 CPU、内存使用情况和测试执行统计。",
    
    fileManagementTitle: "文件管理",
    fileManagementDesc: "测试结果、配置和分析报告的综合文件管理。",
    
    exportCapabilityTitle: "导出功能",
    exportCapabilityDesc: "生成详细报告并导出测试数据，以便进一步分析和文档记录。",
    
    // 集成
    integrationTitle: "集成与API",
    integrationDesc: "物联网协议模糊器与 Django 后端 API 集成，并提供 WebSocket 连接以进行实时更新。功能包括：",
    
    djangoIntegration: "Django 后端集成",
    websocketSupport: "WebSocket 实时更新",
    restApi: "RESTful API 端点",
    errorHandling: "高级错误处理",
    
    getStarted: "开始使用",
    learnMore: "了解更多",
    
    // 下载页面
    downloadTitle: "下载 IoTSploit",
    downloadSubtitle: "获取适用于您平台的最新版本 IoTSploit",
    latestVersion: "最新版本",
    releaseNotes: "发布说明",
    downloadNow: "立即下载",
    comingSoon: "敬请期待",
    
    // 平台
    windowsTitle: "Windows",
    windowsDesc: "兼容 Windows 10/11 (64位)",
    macosTitle: "macOS",
    macosDesc: "兼容 macOS 10.15+ (Intel 和 Apple Silicon)",
    linuxTitle: "Linux",
    linuxDesc: "兼容 Ubuntu 20.04+, Debian 11+, CentOS 8+",
    
    // 移动端
    mobileTitle: "移动应用",
    mobileDesc: "独立离线安全测试工具包。包含文件隐写加密、ECC 密钥生成、端口扫描和 SSH 客户端 — 全部在 Android 设备上本地运行，无需服务器连接。",
    iosApp: "iOS 应用",
    iosAppDesc: "需要 iOS 13.0 或更高版本",
    androidApp: "Android 应用",
    androidAppDesc: "现已上架 Google Play",
    getItOn: "下载渠道",
    
    // Web 源码
    webSourceTitle: "Web 源码下载",
    webSourceDesc: "Flutter Web 构建输出和源文件",
    webAppDownload: "下载 Web 应用",
    
    // 源代码
    sourceTitle: "源代码",
    sourceDesc: "从源代码构建 IoTSploit 或为项目做贡献",
    githubRepo: "GitHub 仓库",
    dockerImage: "Docker 镜像",
    
    // 系统要求
    requirementsTitle: "系统要求",
    minRequirements: "最低要求",
    recRequirements: "推荐配置",
    
    // 安装
    installationTitle: "安装指南",
    quickStart: "快速开始指南",
    documentation: "完整文档",
    
    // Linux Download Modal
    linuxDownloadTitle: "选择 Linux 版本",
    linuxDownloadDesc: "选择最适合您系统的 Linux 包格式：",
    appImageDesc: "适用于大多数 Linux 发行版的通用格式",
    tarGzDesc: "传统压缩包格式适用于手动安装",
    cancel: "取消",

    // 试用许可证页面
    licenseTitle: "获取 7 天 JTAG 试用许可证",
    licenseSubtitle: "为此工作站生成试用许可证，无需账户或付款方式。",
    licenseEmailLabel: "电子邮箱",
    licenseEmailHelp: "用于签发或重新下载此试用许可证。",
    licensePrivacyIntro: "有关信息处理方式，请参阅我们的",
    licensePrivacyLink: "隐私政策",
    licenseFingerprintLabel: "安装指纹",
    licenseFingerprintHelp: "在 IoTSploit 应用中打开 JTAG 激活页面，并复制其中显示的 64 位指纹。",
    licenseSubmit: "获取试用许可证",
    licenseSubmitting: "正在创建许可证…",
    licenseSuccessTitle: "许可证已就绪",
    licenseSuccessNew: "已为此工作站创建新的试用许可证。",
    licenseSuccessReissue: "已重新下载现有试用许可证，其到期日期没有改变。",
    licenseExpiryLabel: "到期时间",
    licenseDaysLabel: "剩余天数",
    licenseDownloadStarted: "许可证文件已开始下载。请从 JTAG 激活页面导入该文件。",
    licenseErrorFingerprint: "请输入 IoTSploit JTAG 激活页面中的 64 位小写十六进制指纹。",
    licenseErrorEmail: "请输入有效的电子邮箱地址。",
    licenseErrorExpired: "此工作站的试用期已结束，无法自动续期。",
    licenseErrorRateLimited: "请求过于频繁，请稍候再试。",
    licenseErrorServer: "许可证服务无法完成此请求，请重试。参考编号：{reference}",
    licenseErrorNetwork: "无法连接许可证服务，请检查网络连接后重试。",
    licenseContactSupport: "联系销售"
  }
};

// 默认语言
let currentLang = 'en';

// 检测浏览器语言
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}

// 语言切换函数
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // 更新所有带有 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // 更新语言选择器显示
  const currentLangElement = document.getElementById('current-lang');
  if (currentLangElement) {
    currentLangElement.textContent = lang.toUpperCase();
  }

  document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
}

// 初始化语言设置
function initializeLanguage() {
  // 尝试从localStorage获取语言
  const savedLang = localStorage.getItem('language');
  currentLang = savedLang || detectLanguage();
  changeLanguage(currentLang);
}

// 添加页面功能对象
window.page = {
  toggleNavbarMenu: function() {
    const navMenu = document.getElementById('navMenu');
    const burger = document.querySelector('.navbar-burger');
    
    if (navMenu && burger) {
      navMenu.classList.toggle('is-active');
      burger.classList.toggle('is-active');
    }
  }
};

// 导出函数供全局使用
window.translations = translations;
window.changeLanguage = changeLanguage;
window.initializeLanguage = initializeLanguage;
window.detectLanguage = detectLanguage;
