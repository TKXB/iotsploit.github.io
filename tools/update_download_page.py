#!/usr/bin/env python3
"""Update download.html from a complete set of release artifacts."""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Asset:
    prefix: str
    suffix: str

    def filename(self, version: str) -> str:
        return f"{self.prefix}-v{version}-{self.suffix}"


ASSETS = {
    "ui-windows": Asset("iotsploit-ui", "windows.zip"),
    "ui-macos": Asset("iotsploit-ui", "macos.zip"),
    "ui-linux-appimage": Asset("iotsploit-ui", "linux.AppImage"),
    "ui-linux-tar": Asset("iotsploit-ui", "linux.tar.gz"),
    "ui-web": Asset("iotsploit-ui", "web.zip"),
    "jtag-windows": Asset("iotsploit-jtag", "windows.zip"),
    "jtag-macos": Asset("iotsploit-jtag", "macos.zip"),
    "jtag-linux-appimage": Asset("iotsploit-jtag", "linux.AppImage"),
    "jtag-linux-tar": Asset("iotsploit-jtag", "linux.tar.gz"),
}


def human_size(path: Path) -> str:
    mebibytes = path.stat().st_size / (1024 * 1024)
    return f"{max(1, int(mebibytes + 0.5))} MB"


def replace_exact_count(
    text: str,
    pattern: str,
    replacement: str,
    *,
    expected: int,
    description: str,
) -> str:
    updated, count = re.subn(pattern, replacement, text)
    if count != expected:
        raise RuntimeError(f"Expected {expected} {description}, found {count}")
    return updated


def update_page(page: Path, downloads: Path, version: str, release_date: str) -> None:
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError(f"Unsupported release version: {version!r}")

    filenames: dict[str, str] = {}
    sizes: dict[str, str] = {}
    for asset_id, asset in ASSETS.items():
        filename = asset.filename(version)
        artifact = downloads / filename
        if not artifact.is_file():
            raise FileNotFoundError(f"Required release artifact is missing: {artifact}")
        filenames[asset_id] = filename
        sizes[asset_id] = human_size(artifact)

    text = page.read_text(encoding="utf-8")

    for asset_id, asset in ASSETS.items():
        pattern = (
            rf"{re.escape(asset.prefix)}-v\d+\.\d+\.\d+-"
            rf"{re.escape(asset.suffix)}"
        )
        text, count = re.subn(pattern, filenames[asset_id], text)
        if count == 0:
            raise RuntimeError(f"No download-page reference found for {asset_id}")

    text = replace_exact_count(
        text,
        r'("softwareVersion"\s*:\s*")[^"]+("\s*,)',
        rf"\g<1>{version}\g<2>",
        expected=2,
        description="structured software versions",
    )
    text = replace_exact_count(
        text,
        r'(<span[^>]*data-release-version[^>]*>)v[^<]+(</span>)',
        rf"\g<1>v{version}\g<2>",
        expected=1,
        description="release-version marker",
    )
    text = replace_exact_count(
        text,
        r'(<span[^>]*data-release-date[^>]*>)[^<]+(</span>)',
        rf"\g<1>Released {release_date}\g<2>",
        expected=1,
        description="release-date marker",
    )

    for asset_id, size in sizes.items():
        pattern = (
            rf'(<span[^>]*data-download-size="{re.escape(asset_id)}"[^>]*>)'
            r"(.*?)"
            r"(</span>)"
        )

        def update_size(match: re.Match[str]) -> str:
            content = match.group(2)
            prefix = ""
            if "&middot;" in content:
                prefix = f"{content.rsplit('&middot;', 1)[0]}&middot; "
            return f"{match.group(1)}{prefix}{size}{match.group(3)}"

        text, count = re.subn(pattern, update_size, text, flags=re.DOTALL)
        expected = 2 if asset_id.endswith("linux-appimage") else 1
        if count != expected:
            raise RuntimeError(
                f"Expected {expected} size markers for {asset_id}, found {count}"
            )

    download_ids = set(
        re.findall(r'<a[^>]+data-download-id="([^"]+)"', text)
    )
    expected_ids = set(ASSETS)
    if download_ids != expected_ids:
        missing = sorted(expected_ids - download_ids)
        unexpected = sorted(download_ids - expected_ids)
        raise RuntimeError(
            f"Download IDs do not match release assets; "
            f"missing={missing}, unexpected={unexpected}"
        )

    referenced = set(re.findall(r'href="downloads/([^"]+)"', text))
    expected_files = set(filenames.values())
    if referenced != expected_files:
        missing = sorted(expected_files - referenced)
        unexpected = sorted(referenced - expected_files)
        raise RuntimeError(
            f"Download links do not match release artifacts; "
            f"missing={missing}, unexpected={unexpected}"
        )

    page.write_text(text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", type=Path, required=True)
    parser.add_argument("--downloads", type=Path, required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--release-date", required=True)
    args = parser.parse_args()
    update_page(args.page, args.downloads, args.version, args.release_date)


if __name__ == "__main__":
    main()
