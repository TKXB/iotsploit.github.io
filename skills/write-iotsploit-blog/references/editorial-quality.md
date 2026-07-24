# IoTSploit editorial quality

Use this reference for the second editorial pass. These are judgment rules, not a mechanical accusation that text was AI-generated.

## Voice

Write like an engineer explaining tested work to another capable person:

- direct, calm, specific, and honest about uncertainty;
- confident only where evidence supports confidence;
- interested in the reader's task, not in praising the product;
- technically accurate without using jargon as decoration.

Keep useful personality from the author. Do not invent first-person experience, emotions, customer stories, quotes, or opinions.

## Prefer evidence over adjectives

Replace promotional wrappers with the fact that earns them.

| Weak | Better direction |
|---|---|
| powerful, robust, comprehensive | name the supported operation or measured boundary |
| seamless, intuitive | state the number of steps or show the workflow |
| cutting-edge, revolutionary, game-changing | describe what changed compared with the prior behavior |
| secure, safe | name the control, threat model, algorithm, audit, or limitation |
| fast, scalable | give the environment and measurement |
| experts say, studies show | name and link the primary source |

Do not substitute one vague adjective for another. If evidence is unavailable, narrow or remove the claim.

## Remove common machine-shaped prose

Revise these patterns when they appear:

- broad openings such as "In today's rapidly evolving landscape";
- meta narration such as "In this article, we will explore" or "Let's dive in";
- inflated importance such as "a pivotal moment" or "a testament to";
- generic transitions such as "Moreover," "Furthermore," and repeated "Additionally";
- copula avoidance such as "serves as," "boasts," or promotional use of "features";
- empty reader steering such as "It is worth noting" or "Here's what is interesting";
- false contrasts such as "This isn't just X; it's Y";
- stacked hedges such as "could potentially" or "may eventually";
- vague conclusions such as "The future looks bright" or "Only time will tell";
- chatbot residue such as "I hope this helps" or "Feel free to reach out";
- synonym cycling that replaces the clearest repeated technical term;
- three-part lists added for rhythm rather than meaning;
- identical paragraph lengths, identical sentence openings, or overly polished rhythm;
- excessive headings, bold text, emoji headings, or bullet lists.

Do not enforce a blanket ban when a form is correct. Lists suit procedures, options, parameters, and changelogs. Technical terms may need repetition. A single contrast or fragment may be effective.

## Structural checks

- Lead with the article's concrete point.
- Give each paragraph one job and connect it to the previous paragraph.
- Vary paragraph and sentence length naturally.
- Use headings that answer reader questions or identify real stages.
- Turn bare-noun feature lists into checkable claims unless the content is genuinely an inventory.
- Keep examples concrete enough for a reader to recognize the starting state, action, and result.
- State prerequisites before steps that depend on them.
- Put warnings before the risky action, not after it.
- End with a specific result, limitation, next task, download, manual, or repository link.

## Technical and security checks

- Verify exact UI labels against current source or screenshots.
- Test commands when practical and label untested examples.
- Never use a placeholder as if it were a real value.
- Redact secrets with an unmistakable dummy value such as `YOUR_API_KEY`.
- Do not publish real tokens, private hostnames, user data, or identifying device data.
- Name the environment for benchmarks and compatibility claims.
- Distinguish encryption, encoding, obfuscation, and steganography accurately.
- Avoid claims that a defensive tool "bypasses monitoring" or "evades detection" unless the legitimate research context, authorization boundary, evidence, and risks are explicit.
- State that testing requires permission when instructions could affect systems or devices the reader may not own.

## Final residue scan

Search for:

- `TODO`, `TBD`, `FIXME`, `[INSERT`, `[Your`, `202X-XX-XX`;
- chat citation tokens such as `turn0search0`, `oaicite`, or `contentReference`;
- links containing AI-tool tracking parameters;
- duplicated headings or descriptions;
- broken locale links;
- image references with missing files;
- claims that depend on conversation context but are absent from the article.

Keep unresolved author notes only as explicit HTML comments in a draft. Remove or resolve them before declaring the article publish-ready.
