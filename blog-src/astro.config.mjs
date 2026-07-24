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
          label: '手册',
          translations: { en: 'Manual' },
          items: [
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
