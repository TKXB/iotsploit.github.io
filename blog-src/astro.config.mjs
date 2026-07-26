// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  // 静态站点生成（GitHub Pages 必须）
  output: 'static',
  // 用于生成正确的 sitemap/canonical URLs
  site: 'https://www.iotsploit.org',
  // 设置基础路径为 /blog
  base: '/blog',
  // 输出到项目根目录的 blog/ 文件夹
  outDir: '../blog',
  // 静态站点生成
  build: {
    format: 'directory'
  },
  integrations: [
    starlight({
      title: 'IoTSploit',
      // 品牌 Logo（与主站导航栏一致）
      logo: {
        src: './src/assets/iotsploit.svg',
        alt: 'IoTSploit',
      },
      // 站点图标
      favicon: '/favicon.svg',
      // 代码块（Expressive Code）：暗色 + 终端等宽字体 + 品牌绿点
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          borderRadius: '10px',
          codeFontFamily:
            "'Source Code Pro', 'SF Mono', Menlo, Consolas, monospace",
          frames: {
            terminalTitlebarDotsForeground: '#3377ff',
            terminalTitlebarBackground: '#161b22',
            terminalTitlebarBorderBottom: '#30363d',
            terminalBackground: '#0b0f14',
            editorTabBarBackground: '#161b22',
            editorBackground: '#0b0f14',
          },
        },
      },
      // 多语言配置：zh 和 en 都带前缀
      locales: {
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      // 默认语言为中文
      defaultLocale: 'zh',
      // 社交链接（v0.33.0+ 使用数组格式）
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/TKXB/iotsploit' },
      ],
      // 侧边栏配置（slug 不需要语言前缀，Starlight 会自动处理）
      sidebar: [
        {
          label: '开始使用',
          translations: { en: 'Getting Started' },
          items: [
            { slug: 'index', label: '欢迎', translations: { en: 'Welcome' } },
          ],
        },
        {
          label: '产品基础',
          translations: { en: 'Product Foundation' },
          items: [
            { slug: 'manual/iotsploit-ui-overview', label: '功能地图与入门路径', translations: { en: 'Feature Map and Where to Start' } },
            { slug: 'manual/server-and-build-setup', label: '连接服务并检查配置', translations: { en: 'Connect to Services' } },
            { slug: 'manual/control-panel-workflow', label: '控制面板工作流', translations: { en: 'Control Panel Workflow' } },
            { slug: 'manual/targets-and-drivers', label: '目标与硬件驱动', translations: { en: 'Targets and Drivers' } },
            { slug: 'manual/plugins-and-test-results', label: '插件与测试结果', translations: { en: 'Plugins and Test Results' } },
          ],
        },
        {
          label: '工具箱',
          translations: { en: 'Toolkit' },
          items: [
            { slug: 'manual/key-tool', label: '密钥工具', translations: { en: 'Key Tool' } },
            { slug: 'manual/port-scanner', label: '端口扫描', translations: { en: 'Port Scanner' } },
            { slug: 'manual/ssh-client', label: 'SSH 客户端', translations: { en: 'SSH Client' } },
            { slug: 'manual/file-obfuscator', label: '文件混淆器', translations: { en: 'File Obfuscator' } },
          ],
        },
      ],
      // 自定义 CSS：Terminal Green 主题
      customCss: ['./src/styles/theme.css'],
      // 暗色为默认主题（未手动选择过则强制 dark；切换后仍保留用户选择）
      head: [
        {
          tag: 'script',
          content:
            "try{if(!localStorage.getItem('starlight-theme')){localStorage.setItem('starlight-theme','dark');document.documentElement.dataset.theme='dark';}}catch(e){document.documentElement.dataset.theme='dark';}",
        },
      ],
      // 禁用搜索（可选，如需要可启用）
      // pagefind: false,
    }),
  ],
});
