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
    print_report,
    verify_workbook,
)


def main() -> int:
    path = DEFAULT_OUTPUT
    if not path.is_file():
        print("Missing workbook:", path)
        print("Run: python3 scripts/generate_metals_price_workbook.py")
        return 1
    report = verify_workbook(path, CATALOG_JS)
    print_report(report)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
