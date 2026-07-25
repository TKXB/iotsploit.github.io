---
name: write-iotsploit-blog
description: Co-author, draft, revise, translate, and publish clear IoTSploit application articles for the Astro/Starlight website. Use when writing an IoTSploit blog post, release article, feature explanation, tutorial, case study, announcement, or bilingual Chinese/English article; when turning product notes, screenshots, code, commits, or issue context into website content; or when editing an existing IoTSploit article for factual accuracy, natural voice, SEO metadata, links, and repository conventions.
---

# Write IoTSploit Blog

Write useful product journalism, not generic product marketing. Ground every technical claim in repository evidence, user-provided facts, a reproducible test, or a cited primary source.

## Start with repository context

1. Read `references/site-publishing.md` completely before creating or moving an article.
2. Read `references/editorial-quality.md` completely before drafting or revising prose.
3. For a product-wide feature introduction, read
   `references/full-feature-introduction.md` completely before collecting evidence.
4. Inspect `README.md`, `blog-src/astro.config.mjs`, the relevant product page, and nearby content in `blog-src/src/content/docs/`.
5. Inspect application source, commits, screenshots, issues, or documentation supplied by the user. Treat existing website copy as context, not automatically as proof.
6. Browse primary sources when a current external fact, API, standard, product version, or security claim needs verification. Add a direct link near the supported claim.

Do not use `docs/_posts/`; that directory is legacy theme sample content. Do not edit generated `blog/` output.

## Choose the working mode

- **Co-author** when the user has a topic or rough notes. Gather context, agree on an angle, draft, refine, and reader-test.
- **Draft** when the user supplies enough facts and wants a complete first version. Make reasonable low-risk assumptions and mark unresolved facts.
- **Edit** when the user names an existing file. Make targeted changes and preserve passages that already work.
- **Audit** when the user asks for review only. Report issues without changing files.
- **Publish** when the user asks to add the article to the site. Create or edit source files, update navigation when needed, validate, and build.

Infer the mode from the request. Do not force a long interview when the available repository evidence answers the questions.

## Co-author the article

### 1. Establish the brief

Determine:

- the reader and the problem they need to solve;
- the article type: tutorial, release note, feature explanation, engineering story, comparison, case study, or announcement;
- the one-sentence takeaway;
- the desired action after reading;
- the required language: Chinese, English, or a paired bilingual edition;
- the evidence available and the claims that still need verification.

Let the user provide shorthand or an unstructured information dump. Ask only questions that materially change the article. If a missing fact can be inspected safely, inspect it.

### 2. Find the evidence

Build a compact claim ledger before drafting:

| Claim | Evidence | Status |
|---|---|---|
| What the feature does | code, screenshot, manual, test, or user statement | verified / user-provided / unresolved |
| Who it helps | observed workflow or named audience | verified / assumption |
| Version or availability | release artifact, tag, or current page | verified / unresolved |
| Performance or security result | reproducible measurement or primary source | verified / omit |

Never invent a benchmark, vulnerability, customer, quote, version, compatibility statement, UI label, or implementation detail. Omit unresolved claims or leave an explicit author note such as `<!-- TODO: confirm supported platforms -->`; never publish the note as prose.

For security content, state the authorization and lab assumptions when they matter. Do not frame evasion, stealth, exploitation, or credential handling as a benefit without legitimate defensive context and precise safeguards.

### 3. Shape the story

Lead with the concrete change, problem, result, or observation. Select only sections that help this article. A useful product article often follows:

1. what changed or what problem exists;
2. why the reader should care;
3. how the feature or workflow works;
4. a concrete example or walkthrough;
5. limitations, prerequisites, and safety notes;
6. a specific next step.

Draft the title and description after the body. Prefer a specific promise over an inflated claim. Leave summary sections until the main argument is stable.

### 4. Draft section by section

Start with the section carrying the most uncertainty. For a tutorial, start with the actual workflow. For a release article, start with the change and evidence. For an engineering story, start with the decision or tradeoff.

Use:

- short paragraphs with varied length;
- exact UI labels, commands, filenames, versions, and outputs when verified;
- lists only for real steps, options, parameters, or comparisons;
- screenshots that prove or clarify something, with descriptive alt text;
- code blocks that are complete enough to run or clearly labeled as excerpts;
- direct links with descriptive anchor text.

Preserve the user's vocabulary and informed opinions. Do not add fake personal experience, synthetic enthusiasm, or manufactured quotes.

### 5. Revise surgically

Ask for feedback on the draft or make requested file edits in place. Apply targeted changes rather than regenerating good sections. Track the user's preferences and use them in later sections.

Run a second editorial pass using `references/editorial-quality.md`. Check the entire article for:

- unsupported or stale claims;
- missing prerequisites, risks, limitations, or expected results;
- generic filler and promotional language;
- repetitive sentence rhythm and uniform paragraphs;
- headings or lists that exist only to make the article look structured;
- contradictions between Chinese and English editions;
- placeholder text, chat artifacts, citation tokens, and AI-generated URL parameters.

Treat AI-writing patterns as editing signals, never proof of authorship.

### 6. Reader-test

Predict five realistic questions a reader would ask after finding the article. Answer each using only the draft.

If an answer is absent, ambiguous, or relies on conversation context, fix the relevant section. Also test:

- Can the intended reader complete the promised task?
- Can a skeptical reader verify the main claim?
- Does the article disclose meaningful constraints?
- Does each screenshot, list, and section earn its space?
- Does the closing give a concrete next step?

Use a fresh sub-agent for reader testing only when sub-agents are permitted by the active instructions. Otherwise perform a clean-context pass yourself.

## Produce bilingual editions

Draft the stronger or source-language edition first, then adapt it. Keep facts, commands, code, URLs, filenames, and safety warnings equivalent. Write natural Chinese and natural English rather than translating sentence by sentence.

Use the same slug in both locale trees:

```text
blog-src/src/content/docs/en/blog/<slug>.md
blog-src/src/content/docs/zh/blog/<slug>.md
```

Verify that each locale links to its matching locale path. Flag any factual difference that is not deliberate.

## Publish and verify

For a new article:

1. Use lowercase kebab-case for `<slug>`.
2. Add valid `title` and `description` front matter.
3. Add the source file under the correct locale path.
4. Add or update the `Articles`/`文章` sidebar group in `blog-src/astro.config.mjs` when the user wants the page discoverable in site navigation.
5. Put new images in `blog-src/public/images/` with descriptive lowercase filenames. Because this site uses Astro base path `/blog`, reference them as `/blog/images/<filename>`.
6. Run the bundled validator:

```bash
python3 skills/write-iotsploit-blog/scripts/validate_article.py <article.md> [<paired-article.md>]
```

7. Run `npm run build` from `blog-src/`.
8. Inspect the diff. Do not commit `blog/`, `blog-src/node_modules/`, `.astro/`, or other generated output.

Report the created source files, important assumptions or unresolved author notes, navigation changes, and validation/build results.
