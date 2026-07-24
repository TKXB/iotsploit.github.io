#!/usr/bin/env python3
"""Validate IoTSploit Starlight article conventions with no external packages."""

from __future__ import annotations

import re
import sys
from pathlib import Path


FRONT_MATTER = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
FIELD = re.compile(r"^([A-Za-z_][\w-]*):\s*(.*?)\s*$")
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
PLACEHOLDER = re.compile(
    r"\b(?:TODO|TBD|FIXME)\b|\[(?:INSERT|Your)\b|202X-XX-XX",
    re.IGNORECASE,
)
CHAT_CITATION = re.compile(
    r"(?:turn\d+(?:search|view|fetch)\d+|oaicite|contentReference)",
    re.IGNORECASE,
)
SECRET = re.compile(
    r"(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|"
    r"AKIA[0-9A-Z]{16})"
)
AI_UTM = re.compile(r"utm_source=(?:chatgpt\.com|copilot\.com)", re.IGNORECASE)
MARKETING = re.compile(
    r"\b(?:game[- ]chang\w*|cutting[- ]edge|seamless(?:ly)?|"
    r"revolutionary|pivotal moment|robust|comprehensive)\b",
    re.IGNORECASE,
)


def parse_front_matter(text: str) -> tuple[dict[str, str], int]:
    match = FRONT_MATTER.match(text)
    if not match:
        return {}, 0
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        field = FIELD.match(line)
        if field:
            value = field.group(2).strip().strip("\"'")
            fields[field.group(1)] = value
    return fields, match.end()


def locale_and_slug(path: Path) -> tuple[str | None, str | None]:
    normalized = path.as_posix()
    match = re.search(r"/docs/(en|zh)/blog/([^/]+\.md)$", normalized)
    if not match:
        return None, None
    return match.group(1), match.group(2)


def validate(path: Path) -> tuple[list[str], list[str], dict[str, str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not path.is_file():
        return [f"file does not exist: {path}"], warnings, {}

    text = path.read_text(encoding="utf-8")
    fields, body_start = parse_front_matter(text)
    body = text[body_start:]

    for required in ("title", "description"):
        if not fields.get(required):
            errors.append(f"missing non-empty front matter field: {required}")

    if fields.get("title") == fields.get("description"):
        errors.append("title and description must not be identical")

    locale, slug = locale_and_slug(path.resolve())
    if locale is None:
        warnings.append(
            "path is outside blog-src/src/content/docs/{en,zh}/blog/"
        )
    elif slug and not SLUG.fullmatch(slug):
        errors.append("article filename must be lowercase kebab-case")

    if re.search(r"^#\s+", body, re.MULTILINE):
        warnings.append("body has an H1; Starlight already renders the front matter title")

    if PLACEHOLDER.search(text):
        errors.append("unresolved placeholder or author note marker found")
    if CHAT_CITATION.search(text):
        errors.append("chat citation residue found")
    if SECRET.search(text):
        errors.append("possible secret or API token found")
    if AI_UTM.search(text):
        errors.append("AI-tool tracking parameter found in a URL")

    marketing_hits = sorted({hit.lower() for hit in MARKETING.findall(body)})
    if marketing_hits:
        warnings.append(
            "review vague/promotional terms: " + ", ".join(marketing_hits)
        )

    image_paths = re.findall(r"!\[[^\]]*\]\((/images/[^)\s]+)", body)
    repo_root = Path(__file__).resolve().parents[3]
    for image_path in image_paths:
        target = repo_root / "blog-src" / "public" / image_path.lstrip("/")
        if not target.is_file():
            errors.append(f"missing image: {image_path}")

    expected_prefix = f"/blog/{locale}/" if locale else None
    if expected_prefix:
        for link in re.findall(r"\[[^\]]+\]\((/blog/[^)\s]+)", body):
            if not link.startswith(expected_prefix):
                warnings.append(f"cross-locale or mismatched local link: {link}")

    return errors, warnings, {"locale": locale or "", "slug": slug or ""}


def main(argv: list[str]) -> int:
    if len(argv) not in (2, 3):
        print(
            "usage: validate_article.py <article.md> [<paired-article.md>]",
            file=sys.stderr,
        )
        return 2

    paths = [Path(value) for value in argv[1:]]
    failed = False
    metadata: list[dict[str, str]] = []

    for path in paths:
        errors, warnings, info = validate(path)
        metadata.append(info)
        print(f"{path}:")
        for error in errors:
            print(f"  ERROR: {error}")
        for warning in warnings:
            print(f"  WARN: {warning}")
        if not errors and not warnings:
            print("  OK")
        failed = failed or bool(errors)

    if len(paths) == 2:
        locales = {item["locale"] for item in metadata}
        slugs = {item["slug"] for item in metadata}
        if locales != {"en", "zh"}:
            print("PAIR ERROR: expected one English and one Chinese article")
            failed = True
        if len(slugs) != 1 or "" in slugs:
            print("PAIR ERROR: bilingual articles must use the same slug")
            failed = True

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
