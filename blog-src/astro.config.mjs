// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 输出到项目根目录的 blog/ 文件夹
  outDir: '../blog',
  // 设置基础路径为 /blog
  base: '/blog',
  // 静态站点生成
  build: {
    format: 'directory'
  }
});
