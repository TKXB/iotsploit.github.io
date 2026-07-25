# Writing a complete IoTSploit feature introduction

Use this guide with the `write-iotsploit-blog` skill when the requested article
introduces IoTSploit as a whole rather than documenting one screen or workflow.
The goal is a useful product map: readers should understand what the application
helps them do, how its parts connect, which capabilities are available in their
build, and where to start.

Do not turn this guide into a feature checklist with a paragraph of praise for
each item. A complete introduction covers the reader's workflow and the
important capability boundaries. It does not need to name every class, button,
or experimental tool.

## Contents

- [Define "complete" before researching](#define-complete-before-researching)
- [Establish the evidence boundary](#establish-the-evidence-boundary)
- [Build the feature inventory](#build-the-feature-inventory)
- [Maintain a claim ledger](#maintain-a-claim-ledger)
- [Choose the article's story](#choose-the-articles-story)
- [Recommended article structure](#recommended-article-structure)
- [Plan screenshots as evidence](#plan-screenshots-as-evidence)
- [Write bilingual editions](#write-bilingual-editions)
- [Perform the editorial pass](#perform-the-editorial-pass)
- [Publish and verify](#publish-and-verify)
- [Reusable instruction for an AI writer](#reusable-instruction-for-an-ai-writer)

## Define "complete" before researching

Record the following brief:

| Field | Required decision |
|---|---|
| Primary reader | Evaluator, security engineer, hardware researcher, developer, or existing user |
| Reader's starting point | First encounter, installed application, or existing IoT test environment |
| One-sentence takeaway | What the reader should understand after finishing |
| Desired next action | Download, open a manual, run an authorized lab test, or inspect the repository |
| Edition | Chinese, English, or paired bilingual |
| Product build | Production, development, offline, web, desktop, mobile, or a named release |
| Evidence date | Date or commit against which the feature inventory was checked |

If the build or release is not specified, inspect the current production
configuration and describe that scope explicitly. Do not combine development,
offline, and production capabilities into one undifferentiated list.

## Establish the evidence boundary

Start with the repositories and files provided by the user. For the current
IoTSploit workspace, useful evidence commonly includes:

- application source:
  `/home/tkxb/HDD/Projects/zeekr_sat_main-master/ui/`;
- route inventory: `ui/lib/router/app_router.dart` and
  `ui/lib/router/route_names.dart`;
- visible navigation: `ui/lib/screens/main/components/side_menu.dart`;
- build availability: `ui/lib/flavors/`, `ui/lib/config_*.dart`, and
  `ui/lib/platform/platform_capabilities.dart`;
- toolkit inventory and availability:
  `ui/lib/screens/tasks/toolkit_catalog.dart`;
- screen behavior: the matching file under `ui/lib/screens/`;
- service and native behavior: `ui/lib/services/`, `ui/rust/src/api/`, and
  focused Rust crates;
- exact interface wording: `ui/lib/l10n/app_en.arb` and
  `ui/lib/l10n/app_zh.arb`;
- behavior checks: `ui/test/` and focused package tests;
- release and platform context: `ui/pubspec.yaml`, `ui/README.md`, release
  artifacts, tags, and build configuration;
- website context: root product pages such as `index.html`, `fuzzer.html`,
  `attackpath.html`, and `download.html`;
- current manuals:
  `blog-src/src/content/docs/{en,zh}/manual/`;
- screenshots supplied by the user or captured from the verified build.

Paths can change. Discover the current equivalent instead of assuming a missing
path proves a feature is absent.

Treat route names, filenames, old README sections, and website copy as discovery
clues. To verify user-visible behavior, trace a candidate through configuration,
screen code, its service or backend call, and—when practical—a test or running
application. A screen stub or unused implementation is not enough to claim a
released feature.

Use current primary sources for standards, third-party hardware, or platform
compatibility claims. Do not use an external article to prove what IoTSploit
itself implements.

## Build the feature inventory

Inventory the product in three passes.

### Pass 1: find user-visible entry points

Inspect routes, navigation, localized labels, and toolkit registration. Record
every visible top-level area and tool, including conditional entries.

Useful discovery commands include:

```bash
rg -n "GoRoute|AppRoutes|AppPageKeys" ui/lib/router ui/lib/flavors
rg -n "title:|localizations|isPageEnabled" \
  ui/lib/screens/main ui/lib/screens/tasks
rg --files ui/lib/screens ui/lib/services ui/rust/src/api
```

Adapt the paths to the actual application checkout. Search results identify
candidates; they are not the finished evidence ledger.

### Pass 2: trace each candidate

For every candidate feature, answer:

1. Where does the user open it?
2. What input, target, file, device, or configuration does it require?
3. What action does it perform?
4. What observable result does it produce?
5. Where is that result stored, displayed, exported, or passed next?
6. Which platform, flavor, service, account, peripheral, or permission does it
   require?
7. Is the behavior covered by a test, reproducible run, screenshot, or manual?

If these questions cannot be answered, classify the candidate as unresolved and
omit it from publication or leave an author-only HTML comment in the draft.

### Pass 3: group by workflow

Group verified capabilities around user jobs. Candidate groups may include:

- defining targets and understanding the test environment;
- discovering or interacting with devices and interfaces;
- organizing and running plugin-based tests;
- configuring and executing protocol fuzzing;
- using hardware and protocol utilities from the toolkit;
- inspecting JTAG or other hardware-debug interfaces;
- reviewing logs, test results, files, or exported data;
- using threat modeling or Attack Path Analysis;
- configuring application behavior, language, theme, services, or models.

These are research buckets, not guaranteed current features. Rename, split,
merge, or remove them according to evidence. Do not create a section merely to
make the article appear comprehensive.

## Maintain a claim ledger

Create the ledger before drafting. One row should represent one publishable
claim, not an entire feature area.

| ID | Reader-facing claim | Build/platform | Evidence | Confidence | Article action |
|---|---|---|---|---|---|
| F-01 | Exact, narrow statement of behavior | Verified scope | Source path, test, screenshot, or run | Verified / user-provided / unresolved | Include / qualify / omit |

For source evidence, record a stable commit and file path when possible. Add the
relevant symbol or line range to working notes, but do not clutter the public
article with internal implementation citations unless they help the reader.

Use this evidence order:

1. behavior reproduced in the named build;
2. focused automated test plus implementation;
3. current implementation traced from UI to service;
4. current official manual or release artifact;
5. explicit user-provided fact;
6. current website copy or README as a lead that still needs verification.

Conflicting evidence must be resolved. Prefer observed current behavior and
current configuration over old promotional copy. Note deliberate platform or
flavor differences instead of forcing one universal claim.

Never infer implementation from a name alone. In particular:

- a route does not prove the page is enabled;
- a screen does not prove its actions are connected;
- an API client does not prove the service is deployed;
- bundled firmware does not prove every supported board or workflow;
- responsive Flutter code does not prove identical capability on every target;
- a development-only tool is not a production feature;
- "supported" requires a defined version, platform, peripheral, or protocol
  boundary.

## Choose the article's story

A full introduction should answer this sequence:

1. What is IoTSploit, in operational terms?
2. Who is it for, and what authorized environment does it assume?
3. What end-to-end workflow connects its major areas?
4. What can the reader do in each stage of that workflow?
5. Which tools are local, service-backed, hardware-dependent, platform-specific,
   experimental, or unavailable in some builds?
6. What result or artifact does the workflow leave behind?
7. What should the reader open or try next?

Lead with the product's concrete role. Avoid openings about the growth of IoT,
the changing cybersecurity landscape, or the general importance of security.

Prefer a workflow narrative such as:

```text
Define scope → select targets → inspect devices/interfaces → configure tests
→ run tools or plugins → review results → document or model findings
```

This is a drafting model, not a factual claim. Change it to match the verified
application.

## Recommended article structure

Use only the sections supported by evidence.

### Front matter

```yaml
---
title: "A specific introduction to IoTSploit"
description: "One plain sentence describing the product map and workflow the reader will learn."
---
```

Write the title and description after the body. Do not add a duplicate `#`
heading because Starlight renders the front-matter title.

### Opening

In two or three short paragraphs:

- identify IoTSploit by what it lets the named reader do;
- describe the application boundary and relevant build;
- give a concrete map of the workflow covered by the article.

Do not open with a list of modules. Do not call the product comprehensive,
powerful, seamless, or intuitive unless the article supplies a precise,
checkable meaning.

### At-a-glance product map

Use a compact table only when it helps readers connect stages:

| Workflow stage | IoTSploit area | Input | Observable result |
|---|---|---|---|
| Verified stage | Exact UI area | What the user supplies | What the user receives |

The table is orientation, not a substitute for explaining the workflow.

### Feature groups

Give each verified group a subsection. Use the exact UI label in the heading or
first sentence. Each subsection should cover:

- the reader's job or question;
- the verified entry point;
- the minimum input or prerequisite;
- the central action;
- the expected result;
- how the result connects to the next stage;
- meaningful limits, build differences, and safety conditions.

A useful subsection pattern is:

```markdown
## Inspect [specific job] with [exact feature name]

[Problem and audience, stated concretely.]

[Starting state → action → observable result.]

[Platform, flavor, hardware, service, authorization, or data limitation.]
```

Vary the shape when the material calls for a walkthrough, table, screenshot, or
short list. Repeating the same three-paragraph template for every feature makes
the article mechanical.

### One end-to-end example

Include a realistic, authorized lab scenario that crosses several major areas.
State:

- the lab target and permission boundary;
- the reader's starting state;
- the actions taken in IoTSploit;
- the observable result after each major step;
- where the workflow stops and what remains a manual judgment.

Do not invent vulnerabilities, scan results, timings, customers, devices, or
benchmarks. If no reproducible example is available, use a clearly labeled
conceptual workflow and avoid fabricated outputs.

### Availability and limitations

Put important limitations near the affected feature and summarize cross-cutting
ones in a dedicated section. Check at least:

- production versus development or offline flavors;
- web, desktop, and mobile differences;
- required backend services or network access;
- required adapters, probes, drivers, firmware, or permissions;
- local versus uploaded data;
- supported formats, protocols, or target boundaries;
- experimental, incomplete, or unavailable functions.

Avoid a blanket "cross-platform" claim if capability varies by platform. A
small availability table is better when the matrix is verified.

### Safety and authorization

State that tests require ownership or explicit authorization before presenting
instructions that interact with devices, firmware, networks, credentials, or
debug interfaces. Place specific warnings before risky steps.

Use precise terms:

- encoding changes representation;
- encryption protects data with a key and defined algorithm;
- obfuscation makes interpretation less direct;
- steganography conceals the presence or placement of data;
- fuzzing supplies varied or malformed inputs to observe behavior.

Do not present stealth, evasion, bypassing monitoring, or hiding activity as a
product benefit. If a legitimate research workflow touches those subjects,
define the lab scope, evidence, limitations, and risks.

### Closing

End with a concrete next action supported by the site:

- download the verified build;
- open the matching locale manual;
- follow a focused feature guide;
- inspect the official repository;
- reproduce the authorized lab workflow.

Do not end with a generic claim about the future of IoT security.

## Plan screenshots as evidence

Use screenshots to prove layout, state, or results that prose cannot show as
quickly. A complete introduction usually needs fewer strong screenshots than
feature areas.

For each proposed screenshot, record:

| Screenshot | Question it answers | Required state | Redactions | Locale/build |
|---|---|---|---|---|
| Exact screen | Reader question | Data and selection needed | Secrets and identifiers | Verified edition |

Capture screenshots from the same build described by the article. Verify every
visible label against that build. Redact tokens, private endpoints, usernames,
device identifiers, customer data, file paths, and network details.

Store publishable images in `blog-src/public/images/` with lowercase descriptive
filenames. Reference them as `/blog/images/<filename>` and write alt text that
describes the information the screenshot contributes.

Do not use a screenshot only as decoration. Do not claim behavior that is
visible only in a mockup or static design.

## Write bilingual editions

Draft the edition best supported by the evidence, then adapt it. Preserve:

- feature scope and build availability;
- commands, filenames, UI labels, numbers, and URLs;
- prerequisites, warnings, and limitations;
- the meaning of the end-to-end example.

Use the same slug:

```text
blog-src/src/content/docs/en/blog/iotsploit-feature-overview.md
blog-src/src/content/docs/zh/blog/iotsploit-feature-overview.md
```

Use natural prose in each language. Do not translate sentence by sentence.
Link each edition to manuals in its own locale.

## Perform the editorial pass

Apply `editorial-quality.md` to the complete draft. In addition, search for
feature-introduction failure modes:

- unverified words such as "all," "any," "fully," and "automatic";
- promotional adjectives standing in for behavior;
- long inventories with no workflow or outcome;
- multiple names for the same UI area;
- dev-only functions described as released;
- compatibility claims without platform and version;
- screenshots from a different build than the prose;
- repeated subsection structure and identical paragraph rhythm;
- features described in isolation with no connection to inputs or results;
- security actions without authorization or lab boundaries.

Predict at least these reader questions and revise until the article answers
them from its own text:

1. What can IoTSploit help me accomplish?
2. Which part should I open first for my task?
3. What must I install, connect, or configure?
4. Which capabilities are available in my platform and build?
5. What output should I expect?
6. Where does IoTSploit stop and require expert interpretation?
7. What data leaves my machine, if any?
8. What should I read or run next?

## Publish and verify

Follow `site-publishing.md` and the parent skill:

1. create source Markdown under the matching locale `blog/` directory;
2. add valid title and description front matter;
3. add verified images under `blog-src/public/images/`;
4. add concise sidebar navigation when publication requires discovery;
5. run the bundled article validator;
6. run `npm run build` from `blog-src/`;
7. inspect source and configuration diffs;
8. leave generated `blog/` output uncommitted.

Before declaring the article complete, confirm:

- every major claim has ledger evidence;
- every named feature is user-visible in the stated build or clearly qualified;
- the article covers an end-to-end workflow, not only a catalog;
- platform, flavor, hardware, and service requirements are explicit;
- screenshots and exact UI labels match the evidence build;
- safety boundaries appear before potentially risky actions;
- Chinese and English editions make equivalent promises;
- no TODO, chat artifact, secret, private endpoint, or missing image remains;
- the next action and local links work.

## Reusable instruction for an AI writer

The following can be supplied with a concrete article request:

```text
Use the write-iotsploit-blog skill and its full-feature-introduction reference.
Create an evidence-backed introduction to IoTSploit for [reader]. Scope it to
[release/commit, flavor, and platform] as of [date]. Inspect the application
routes, enabled navigation, toolkit catalog, implementation, tests, current
manuals, and supplied screenshots. Build a claim ledger before drafting.

Organize the article around the verified user workflow, not a marketing feature
list. For each major area, explain the reader's job, entry point, prerequisite,
action, result, connection to the next stage, and meaningful limitation. Include
one authorized end-to-end lab example and an availability section. Do not invent
support, results, versions, benchmarks, or implementation details. Omit or mark
unresolved claims in author-only HTML comments.

Write [Chinese/English/both] source Markdown for the Astro/Starlight site, use
exact verified UI labels, place warnings before risky actions, validate the
article, build the site, and report unresolved facts without committing generated
blog output.
```
