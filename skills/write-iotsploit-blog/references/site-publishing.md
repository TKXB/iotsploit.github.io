# IoTSploit site publishing reference

Read this file before creating, moving, or publishing an article.

## Source of truth

The deployed `/blog/` site is built from Astro 5 and Starlight source in `blog-src/`.

- English content: `blog-src/src/content/docs/en/`
- Simplified Chinese content: `blog-src/src/content/docs/zh/`
- Static article images: `blog-src/public/images/`
- Starlight and sidebar configuration: `blog-src/astro.config.mjs`
- Content schema: `blog-src/src/content/config.ts`
- Build command: `npm run build` from `blog-src/`
- Generated output: repository-root `blog/`

Never write articles to the legacy `docs/_posts/` samples. Never edit or commit generated `blog/` files.

## Article paths

Use this convention for editorial articles:

```text
blog-src/src/content/docs/en/blog/<slug>.md
blog-src/src/content/docs/zh/blog/<slug>.md
```

Use lowercase kebab-case slugs. Paired translations must use the same slug. The corresponding routes are:

```text
/blog/en/blog/<slug>/
/blog/zh/blog/<slug>/
```

Use the existing `manual/` directory only when the requested page is product reference or a task-oriented user manual rather than an editorial article.

## Front matter

The required minimum is:

```yaml
---
title: A specific, reader-centered title
description: One plain sentence that says what the reader will learn or do.
---
```

Quote YAML values when punctuation could be parsed as YAML syntax. Keep the description concrete and useful in search results. Do not repeat the title as the description.

Starlight supplies the page title from front matter. Do not add a duplicate `#` heading unless a nearby page establishes a deliberate exception.

## Navigation

`blog-src/astro.config.mjs` currently uses an explicit sidebar. A page can build without a sidebar entry but will be hard to discover.

When publishing articles, create or reuse a sidebar group similar to:

```js
{
  label: '文章',
  translations: { en: 'Articles' },
  items: [
    {
      slug: 'blog/example-slug',
      label: '具体的中文标题',
      translations: { en: 'Specific English title' },
    },
  ],
},
```

Keep labels concise. Do not add a locale prefix to the sidebar slug; Starlight handles locales.

## Links and images

- Use absolute site paths for local links, including the `/blog/<locale>/` prefix.
- Link English articles to English manuals and Chinese articles to Chinese manuals.
- Use descriptive link text; avoid "click here."
- Store new images under `blog-src/public/images/`.
- Reference those images as `/images/<filename>`.
- Use lowercase descriptive filenames and preserve the correct extension.
- Write alt text that describes the information the image contributes. Do not start alt text with "image of."
- Never expose API keys, access tokens, private endpoints, customer data, or secrets in screenshots, code, commands, or alt text.

## Product terminology

Use the repository spelling `IoTSploit`. Preserve exact UI labels when verified from the application or screenshot.

Current site concepts include:

- IoT security testing toolkit
- protocol analysis and fuzzing
- plugin-based Python security testing modules
- Flutter desktop and mobile interfaces
- Attack Path Analysis and TARA generation
- UART, JTAG, BLE, USB, and other device interfaces

This list is vocabulary, not proof that every claim is current or supported. Verify availability, versions, behavior, and compatibility from application source or current release evidence.

## Bilingual quality

- Preserve commands, filenames, URL targets, numbers, version strings, and warnings.
- Translate meaning and register, not syntax.
- Use Chinese punctuation in Chinese prose and standard English punctuation in English prose.
- Keep official product names and UI labels unchanged when the interface is not localized.
- Check that both versions make the same promises and disclose the same limitations.

## Build behavior

GitHub Actions runs `npm ci` and `npm run build` inside `blog-src/`, then deploys the repository through GitHub Pages. Local validation should match that build command.

Before handoff:

1. validate article front matter and paths;
2. build from `blog-src/`;
3. inspect the source and configuration diff;
4. leave generated output uncommitted.
