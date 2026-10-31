#!/usr/bin/env python3
"""Point the README preview at the dark or light render by IST time.

Dark from 18:00 to 06:00 IST, light otherwise: the same clock as the
SandeepKomal profile, so the profile, Git3D Universe and Neon Arena flip
together. Prints the theme and changes nothing unless --apply is given.

Exit codes: 0 success (changed or already current), 2 bad usage or no
preview found in the README.
"""

import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

UTC_OFFSET_MINUTES = 330  # IST
DAY_START, NIGHT_START = 6, 18
README = Path(__file__).resolve().parents[2] / "README.md"


def clock_theme(now: datetime) -> str:
    local = now + timedelta(minutes=UTC_OFFSET_MINUTES)
    return "light" if DAY_START <= local.hour < NIGHT_START else "dark"


def apply_theme(text: str, theme: str) -> str:
    """Every preview inside a <picture> shows the same variant, whatever the viewer's setting."""
    return re.sub(
        r"<picture>.*?</picture>",
        lambda block: re.sub(
            r"preview-(?:dark|light)\.svg", f"preview-{theme}.svg", block.group(0)
        ),
        text,
        flags=re.DOTALL,
    )


def main(argv: list[str]) -> int:
    if argv[1:] not in ([], ["--apply"]):
        print("usage: theme-clock.py [--apply]", file=sys.stderr)
        return 2
    text = README.read_text(encoding="utf-8")
    if not re.search(
        r"<picture>.*?preview-(?:dark|light)\.svg.*?</picture>", text, flags=re.DOTALL
    ):
        print("No preview <picture> found in README.md.", file=sys.stderr)
        return 2
    theme = clock_theme(datetime.now(timezone.utc))
    updated = apply_theme(text, theme)
    if updated == text:
        print(f"README already shows the {theme} preview.")
    elif "--apply" in argv:
        README.write_text(updated, encoding="utf-8")
        print(f"README switched to the {theme} preview.")
    else:
        print(
            f"Dry run: would switch README to the {theme} preview. Pass --apply to write it."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
