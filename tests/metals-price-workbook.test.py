#!/usr/bin/env python3
"""Verify the Jagetiya Metals price workbook against the built-in catalog."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from generate_metals_price_workbook import (  # noqa: E402
    CATALOG_JS,
    DEFAULT_OUTPUT,
    group_entries_by_grade,
    load_catalog,
    normalize_existing_key,
    print_report,
    verify_workbook,
)


def _grouping_checks() -> list[str]:
    errors = []
    catalog = load_catalog(CATALOG_JS)
    families = group_entries_by_grade(catalog)
    if len(families) >= len(catalog):
        errors.append("family count %d should be < catalog entries %d" % (len(families), len(catalog)))
    by_name = {f["grade"]: f for f in families}
    bright = by_name.get("MS Bright")
    if not bright or set(bright["shapes"]) != {"Square Bar", "Hex Bar", "Flat Bar"}:
        errors.append("MS Bright shapes %s" % (bright or {}).get("shapes"))
    en8 = by_name.get("EN-8")
    if not en8 or "Round Bar" not in en8["shapes"] or "Flat Bar" not in en8["shapes"]:
        errors.append("EN-8 should include Round and Flat")
    wps = by_name.get("WPS (D3)")
    if not wps or set(wps["shapes"]) < {"Round Bar", "Square Bar", "Flat Bar"}:
        errors.append("WPS (D3) should include Round, Square, Flat")
    for a, b in (("MS", "MS Bright"), ("MS Bright", "MS Black"), ("EN-8", "EN-8D"), ("EN-8D", "EN-8D / C-45")):
        if a not in by_name or b not in by_name:
            errors.append("expected separate grades %r and %r" % (a, b))
    if normalize_existing_key("6 x 25") != "6x25":
        errors.append("normalize flat key failed")
    if normalize_existing_key(25.0) != 25:
        errors.append("normalize 25.0 failed")
    return errors


def main() -> int:
    path = DEFAULT_OUTPUT
    if not path.is_file():
        print("Missing workbook:", path)
        print("Run: python3 scripts/generate_metals_price_workbook.py")
        return 1
    grouping = _grouping_checks()
    if grouping:
        print("LOGIC FAILED:")
        for err in grouping:
            print("  -", err)
        return 1
    report = verify_workbook(path, CATALOG_JS)
    print_report(report)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
