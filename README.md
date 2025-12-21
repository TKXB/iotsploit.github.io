## IoTSploit 网站与文档

本仓库用于维护 `iotsploit.org` 的静态站点与文档内容，并通过 GitHub Pages 自动构建与部署。

### 目录结构

- **主站静态页面**：仓库根目录（例如 `index.html`、`download.html`、`contact.html` 等）
- **文档站源码（Astro + Starlight）**：`blog-src/`
- **文档站构建产物**：`blog/`（由构建生成，不建议手动提交）

### 文档内容在哪里写

- **中文**：`blog-src/src/content/docs/zh/`
- **英文**：`blog-src/src/content/docs/en/`

你只需要提交上述目录下的 Markdown（以及必要配置变更），`blog/` 会在 CI 中自动生成并部署。

### 本地预览文档站

```bash
cd blog-src
npm ci
npm run dev
```

### 本地构建文档站

```bash
cd blog-src
npm ci
npm run build
```

构建输出到仓库根目录 `blog/`。

### 部署（GitHub Pages）

推送到 `main` / `master` 分支会触发 GitHub Actions：

- 工作流：`.github/workflows/blog-build.yml`
- 在 `blog-src/` 执行 `npm run build`
- 上传并部署仓库根目录（包含主站页面与构建后的 `blog/`）

### 提交建议

- 不要提交 `blog/`（构建产物）
- 不要提交 `blog-src/node_modules/`、`blog-src/.astro/` 等本地生成目录
- 这些已在根目录 `.gitignore` 中忽略

### 许可证

见 `LICENSE`。


