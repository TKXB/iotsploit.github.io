// 全局翻译配置
const translations = {
  en: {
    // Navbar
    documentation: "Documentation",
    community: "Community",
    features: "Features",
    iotFuzzer: "IoT Protocol Fuzzer",
    vulnerabilityScanner: "Vulnerability Scanner",
    protocolAnalyzer: "Protocol Analyzer",
    guide: "The Guide",
    wiki: "Wiki",
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
    poweredBy: "This site is powered by github pages.",
    
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
    mobileDesc: "Control IoTSploit from your mobile device",
    iosApp: "iOS App",
    androidApp: "Android App",
    
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
    cancel: "Cancel"
  },
  zh: {
    // 导航栏
    documentation: "文档",
    community: "社区",
    features: "功能特性",
    iotFuzzer: "物联网协议模糊测试",
    vulnerabilityScanner: "漏洞扫描器",
    protocolAnalyzer: "协议分析器",
    guide: "指南",
    wiki: "百科",
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
    poweredBy: "本站由 github pages 提供支持。",
    
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
    mobileDesc: "从移动设备控制 IoTSploit",
    iosApp: "iOS 应用",
    androidApp: "Android 应用",
    
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
    cancel: "取消"
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