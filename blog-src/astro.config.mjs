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
      // 自定义 CSS（可选）
      customCss: [],
      // 禁用搜索（可选，如需要可启用）
      // pagefind: false,
    }),
  ],
});
