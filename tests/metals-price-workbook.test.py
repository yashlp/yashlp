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
    inbox_status,
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


def main() -> int:
    path = DEFAULT_OUTPUT
    if not path.is_file():
        print("Missing workbook:", path)
        print("Run: python3 scripts/generate_metals_price_workbook.py")
        return 1
    logic = _logic_checks()
    if logic:
        print("LOGIC FAILED:")
        for err in logic:
            print("  -", err)
        return 1
    report = verify_workbook(path, CATALOG_JS)
    print_report(report)
    print("Add Size cells:", ADD_SHAPE_CELL, ADD_SIZE_CELL, ADD_TH_CELL, ADD_W_CELL, ADD_STATUS_CELL, ADD_KEY_CELL)
    print("Extra UNIQUE rows per sheet:", EXTRA_SIZE_ROWS)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
