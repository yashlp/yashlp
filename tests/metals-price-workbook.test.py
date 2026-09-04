#!/usr/bin/env python3
"""Verify the Jagetiya Metals price workbook against the built-in catalog."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from generate_metals_price_workbook import (  # noqa: E402
    ADD_KEY_CELL,
    ADD_SHAPE_CELL,
    ADD_SIZE_CELL,
    ADD_STATUS_CELL,
    ADD_TH_CELL,
    ADD_W_CELL,
    CATALOG_JS,
    DEFAULT_OUTPUT,
    EXTRA_SIZE_ROWS,
    canonical_size_key,
    group_entries_by_grade,
    inbox_status,
    load_catalog,
    new_sizes_only,
    print_report,
    unique_size_list,
    verify_workbook,
)


def _logic_checks() -> list[str]:
    errors = []
    if canonical_size_key("Round Bar", size=25) != 25:
        errors.append("1D SIZE field should produce 25")
    if canonical_size_key("Hex Bar", size=25.0) != 25:
        errors.append("1D 25.0 should canonicalize to 25")
    if canonical_size_key("Square Bar", thickness=40) != 40:
        errors.append("Square with blank width should add Side/Thickness")
    if canonical_size_key("Square Bar", thickness=6, width=25) != "6x25":
        errors.append("Square with both fields should add TxW")
    if canonical_size_key("Flat Bar", thickness=6, width=25) != "6x25":
        errors.append("Flat should require TxW")
    if canonical_size_key("Flat Bar", thickness=6) is not None:
        errors.append("Flat without width must not add")
    if inbox_status([25, 28], 25.0) != "Already added — skipped":
        errors.append("25 and 25.0 must skip")
    if inbox_status(["6x25"], "6 x 25") != "Already added — skipped":
        errors.append("6x25 and 6 x 25 must skip")
    if inbox_status([16, 18], 22) != "Added":
        errors.append("new 1D size should be Added")
    if unique_size_list([16, 25], [25.0, 30]) != [16, 25, 30]:
        errors.append("UNIQUE union should append 30 once")
    if new_sizes_only([16, 25], [25.0, 30]) != [30]:
        errors.append("new_sizes_only should drop catalog dups")
    return errors


def _grouping_checks() -> list[str]:
    errors = []
    catalog = load_catalog(CATALOG_JS)
    families = group_entries_by_grade(catalog)
    if len(families) >= len(catalog):
        errors.append("family count %d should be < catalog entries %d" % (len(families), len(catalog)))
    grades = [f["grade"] for f in families]
    if len(grades) != len(set(grades)):
        errors.append("duplicate grade families: %s" % grades)
    by_name = {f["grade"]: f for f in families}

    bright = by_name.get("MS Bright")
    if not bright:
        errors.append("missing MS Bright family")
    else:
        want = {"Square Bar", "Hex Bar", "Flat Bar"}
        have = set(bright["shapes"])
        if have != want:
            errors.append("MS Bright shapes %s != %s" % (have, want))

    en8 = by_name.get("EN-8")
    if not en8 or "Round Bar" not in en8["shapes"] or "Flat Bar" not in en8["shapes"]:
        errors.append("EN-8 should include Round and Flat, got %s" % (en8 or {}).get("shapes"))

    wps = by_name.get("WPS (D3)")
    if not wps or set(wps["shapes"]) < {"Round Bar", "Square Bar", "Flat Bar"}:
        errors.append("WPS (D3) should include Round, Square, Flat, got %s" % (wps or {}).get("shapes"))

    for a, b in (("MS", "MS Bright"), ("MS Bright", "MS Black"), ("EN-8", "EN-8D"), ("EN-8D", "EN-8D / C-45")):
        if a not in by_name or b not in by_name:
            errors.append("expected separate grades %r and %r" % (a, b))
    return errors


def main() -> int:
    path = DEFAULT_OUTPUT
    if not path.is_file():
        print("Missing workbook:", path)
        print("Run: python3 scripts/generate_metals_price_workbook.py")
        return 1
    logic = _logic_checks()
    grouping = _grouping_checks()
    if logic or grouping:
        print("LOGIC FAILED:")
        for err in logic + grouping:
            print("  -", err)
        return 1
    report = verify_workbook(path, CATALOG_JS)
    print_report(report)
    print("Add Size cells:", ADD_SHAPE_CELL, ADD_SIZE_CELL, ADD_TH_CELL, ADD_W_CELL, ADD_STATUS_CELL, ADD_KEY_CELL)
    print("Extra UNIQUE rows per shape section:", EXTRA_SIZE_ROWS)
    print("Catalog entries:", report.get("catalog_entries"), "unique grades:", report.get("unique_grades"))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
