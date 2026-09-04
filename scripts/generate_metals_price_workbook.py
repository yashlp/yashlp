#!/usr/bin/env python3
"""Generate the Jagetiya Metals product price workbook from the built-in catalog.

One sheet per grade (all shapes together). Columns:
  Shape | Sub-type | Size | Base Price (Rs/kg)
No Selling Price column — Base Price is the only price. Edit Base Price
directly. Daily Adjustment (Master + per-sheet I3) is a notepad reminder
so you can add today's market move into Base Price cells.

No make/notes. No side "select size edit price" table.
Add sizes in green empty rows at the bottom.

Usage:
  python3 scripts/generate_metals_price_workbook.py
  python3 scripts/generate_metals_price_workbook.py --verify
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Protection, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.page import PageMargins
from openpyxl.worksheet.worksheet import Worksheet

ROOT = Path(__file__).resolve().parents[1]
CATALOG_JS = ROOT / "public" / "metals" / "js" / "catalog.js"
DEFAULT_OUTPUT = ROOT / "public" / "metals" / "Jagetiya_Metals_Price_List.xlsx"

NAVY = "0F2540"
GOLD = "C8960C"
CREAM = "F7F4EE"
WHITE = "FFFFFF"
ROW_ALT = "FFF8E7"
LINK_BLUE = "1B3A5C"
MUTED = "5A6A7A"
GREEN = "1A5C32"
MINT = "E8F6EF"
MINT_INPUT = "F4FCF8"
YELLOW = "FFE566"
CORAL = "FDEDEC"

PRODUCTS_SHEET = "Products"
DATA_START = 6
BLANK_ROWS = 20
EXAMPLE_BASES = {16: 72.00, 18: 71.50}
ADJ_CELL = "I3"
ADJ_ABS = "$I$3"

SHAPE_CHOICES = ("Round Bar", "Square Bar", "Hex Bar", "Flat Bar", "Non-Ferrous")
SHAPE_ORDER = SHAPE_CHOICES
SHAPE_TAB = {
    "Round Bar": "1B3A5C",
    "Square Bar": "1A5C32",
    "Hex Bar": "6C3483",
    "Flat Bar": "C8960C",
    "Non-Ferrous": "117A65",
}

INVALID_SHEET_CHARS = re.compile(r'[:\\/*?\[\]]')
UNLOCKED = Protection(locked=False, hidden=False)

THIN = Border(
    left=Side(style="thin", color="D8D3CB"),
    right=Side(style="thin", color="D8D3CB"),
    top=Side(style="thin", color="D8D3CB"),
    bottom=Side(style="thin", color="D8D3CB"),
)
THICK_GOLD = Border(
    left=Side(style="medium", color=GOLD),
    right=Side(style="medium", color=GOLD),
    top=Side(style="medium", color=GOLD),
    bottom=Side(style="medium", color=GOLD),
)
THICK_GREEN = Border(
    left=Side(style="medium", color=GREEN),
    right=Side(style="medium", color=GREEN),
    top=Side(style="medium", color=GREEN),
    bottom=Side(style="medium", color=GREEN),
)

NAVY_FILL = PatternFill("solid", fgColor=NAVY)
GOLD_FILL = PatternFill("solid", fgColor=GOLD)
CREAM_FILL = PatternFill("solid", fgColor=CREAM)
ALT_FILL = PatternFill("solid", fgColor=ROW_ALT)
WHITE_FILL = PatternFill("solid", fgColor=WHITE)
HEADER_FILL = PatternFill("solid", fgColor="1B3A5C")
MINT_FILL = PatternFill("solid", fgColor=MINT)
MINT_INPUT_FILL = PatternFill("solid", fgColor=MINT_INPUT)
YELLOW_FILL = PatternFill("solid", fgColor=YELLOW)
GREEN_FILL = PatternFill("solid", fgColor=GREEN)
CORAL_FILL = PatternFill("solid", fgColor=CORAL)

TITLE_FONT = Font(name="Calibri", size=18, bold=True, color=WHITE)
COMPANY_FONT = Font(name="Calibri", size=11, bold=True, color=GOLD)
BODY_FONT = Font(name="Calibri", size=11, color=NAVY)
MUTED_FONT = Font(name="Calibri", size=10, color=MUTED)
GRADE_FONT = Font(name="Calibri", size=20, bold=True, color=NAVY)
COL_FONT = Font(name="Calibri", size=11, bold=True, color=WHITE)
LINK_FONT = Font(name="Calibri", size=11, color=LINK_BLUE, underline="single", bold=True)
LABEL_FONT = Font(name="Calibri", size=11, bold=True, color=NAVY)
INPUT_FONT = Font(name="Calibri", size=16, bold=True, color=NAVY)
SELL_FONT = Font(name="Calibri", size=11, bold=True, color=GREEN)

CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
RIGHT = Alignment(horizontal="right", vertical="center")


def fmt_num(n) -> str:
    n = float(n)
    if abs(n - int(n)) < 1e-9:
        return str(int(n))
    return "%g" % n


def _as_number(value):
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip().replace(" ", "").replace("×", "x")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def normalize_existing_key(value):
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        n = float(value)
        return int(n) if abs(n - int(n)) < 1e-9 else n
    text = str(value).strip().replace(" ", "").replace("×", "x").lower()
    if not text:
        return None
    if "x" in text:
        parts = text.split("x", 1)
        a, b = _as_number(parts[0]), _as_number(parts[1])
        if a is None or b is None:
            return text
        return "%sx%s" % (fmt_num(a), fmt_num(b))
    n = _as_number(text)
    if n is None:
        return text
    return int(n) if abs(n - int(n)) < 1e-9 else n


def size_label(size):
    n = _as_number(size)
    if n is None:
        return str(size).strip()
    return int(n) if abs(n - int(n)) < 1e-9 else n


def flat_size_label(th, w) -> str:
    return "%sx%s" % (fmt_num(th), fmt_num(w))


def quote_sheet(name: str) -> str:
    if any(c in name for c in (" ", "'", "-", "/")):
        return "'%s'" % name.replace("'", "''")
    return name


def load_catalog(catalog_js: Path) -> list[dict]:
    if not catalog_js.is_file():
        raise FileNotFoundError("Catalog not found: %s" % catalog_js)
    js = r"""
const c = require(%s);
const entries = [];
for (const shape of c.SL) {
  const list = c.BUILTIN_DB[shape] || [];
  for (const e of list) {
    entries.push({
      shape: shape,
      grade: e.g,
      subtype: e.s || "",
      sizes: Array.isArray(e.sz) ? e.sz.slice() : [],
      flat: e.flat ? e.flat : null,
      noteOnly: !!e.note
    });
  }
}
process.stdout.write(JSON.stringify(entries));
""" % json.dumps(str(catalog_js))
    proc = subprocess.run(
        ["node", "-e", js], cwd=str(ROOT), capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError("Failed to read catalog.js:\n%s" % proc.stderr)
    entries = json.loads(proc.stdout)
    if not entries:
        raise RuntimeError("Catalog parsed empty")
    return entries


def sanitize_sheet_name(raw: str) -> str:
    name = INVALID_SHEET_CHARS.sub("-", raw)
    name = re.sub(r"\s+", " ", name).strip().strip("'")
    return (name or "Grade")[:31]


def unique_grade_sheet_name(grade: str, used: set[str]) -> str:
    base = sanitize_sheet_name(grade)
    if base not in used:
        used.add(base)
        return base
    for i in range(2, 50):
        suffix = "-%d" % i
        cand = sanitize_sheet_name(base[: 31 - len(suffix)] + suffix)
        if cand not in used:
            used.add(cand)
            return cand
    raise RuntimeError("Could not uniquify sheet name for %s" % grade)


def size_count(entry: dict) -> int:
    if entry.get("flat"):
        return sum(len(v) for v in entry["flat"].values())
    if entry.get("noteOnly"):
        return 0
    return len(entry.get("sizes") or [])


def group_entries_by_grade(entries: list[dict]) -> list[dict]:
    order: list[str] = []
    by_grade: dict[str, list[dict]] = {}
    for e in entries:
        g = (e.get("grade") or "").strip() or "Grade"
        if g not in by_grade:
            by_grade[g] = []
            order.append(g)
        by_grade[g].append(e)
    families = []
    for g in order:
        items = by_grade[g]
        present = []
        for e in items:
            if e["shape"] not in present:
                present.append(e["shape"])
        shapes = [s for s in SHAPE_ORDER if s in present]
        families.append({
            "grade": g,
            "entries": items,
            "shapes": shapes,
            "shapes_label": " · ".join(shapes),
            "size_count": sum(size_count(e) for e in items),
        })
    return families


def assign_family_sheets(families: list[dict]) -> list[dict]:
    used: set[str] = set()
    for fam in families:
        fam["sheet"] = unique_grade_sheet_name(fam["grade"], used)
    return families


def build_rows(family: dict, is_first: bool) -> list[dict]:
    rows = []
    example_used = False
    by_shape = {s: [e for e in family["entries"] if e["shape"] == s] for s in family["shapes"]}
    for shape in family["shapes"]:
        for e in by_shape[shape]:
            subtype = e.get("subtype") or ""
            if e.get("flat"):
                for th_key, widths in sorted(e["flat"].items(), key=lambda kv: float(kv[0])):
                    th = float(th_key)
                    for w in widths:
                        rows.append({
                            "shape": shape, "subtype": subtype,
                            "size": flat_size_label(th, w), "price": None,
                        })
            elif e.get("noteOnly"):
                rows.append({"shape": shape, "subtype": subtype, "size": "", "price": None})
            else:
                for sz in e.get("sizes") or []:
                    price = None
                    if is_first and not example_used and float(sz) in EXAMPLE_BASES:
                        price = EXAMPLE_BASES[float(sz)]
                        if float(sz) == 18:
                            example_used = True
                    rows.append({
                        "shape": shape, "subtype": subtype,
                        "size": size_label(sz), "price": price,
                    })
    return rows


def apply_cell(ws, row, col, value, *, font=None, fill=None, alignment=None,
               border=None, num_fmt=None):
    cell = ws.cell(row=row, column=col, value=value)
    if font:
        cell.font = font
    if fill:
        cell.fill = fill
    if alignment:
        cell.alignment = alignment
    if border:
        cell.border = border
    if num_fmt:
        cell.number_format = num_fmt
    cell.protection = UNLOCKED
    return cell


def merge_fill(ws, r1, c1, r2, c2, fill, font=None, alignment=None):
    ws.merge_cells(start_row=r1, start_column=c1, end_row=r2, end_column=c2)
    cell = ws.cell(row=r1, column=c1)
    cell.fill = fill
    if font:
        cell.font = font
    if alignment:
        cell.alignment = alignment
    cell.protection = UNLOCKED
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            ws.cell(row=r, column=c).fill = fill
            ws.cell(row=r, column=c).protection = UNLOCKED


def unlock_sheet(ws: Worksheet, max_row: int, max_col: int):
    for r in range(1, max_row + 1):
        for c in range(1, max_col + 1):
            ws.cell(row=r, column=c).protection = UNLOCKED
    ws.protection.sheet = False


def page_setup(ws: Worksheet, freeze: str = "A6"):
    ws.freeze_panes = freeze
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins = PageMargins(left=0.4, right=0.4, top=0.55, bottom=0.5)
    ws.oddHeader.left.text = "Jagetiya Metals — Product Price List"
    ws.oddFooter.left.text = "GST 24AGIPS3207M1Z7  |  Fully editable — no password"
    ws.oddFooter.right.text = "Page &P of &N"


def add_adjustment_box(ws: Worksheet):
    """Yellow daily-adjustment notepad on the right of every grade sheet (I3)."""
    merge_fill(ws, 1, 7, 1, 10, GOLD_FILL, Font(name="Calibri", size=11, bold=True, color=NAVY), CENTER)
    ws.cell(row=1, column=7).value = "DAILY ADJUSTMENT (Rs/kg)"

    merge_fill(ws, 2, 7, 2, 10, YELLOW_FILL, Font(name="Calibri", size=9, color=NAVY), CENTER)
    ws.cell(row=2, column=7).value = (
        "Today's market move (e.g. 1 or -2). Reminder only — add this into each Base Price cell."
    )
    ws.row_dimensions[2].height = 32

    apply_cell(ws, 3, 7, "Today's change", font=LABEL_FONT, fill=YELLOW_FILL, alignment=RIGHT)
    apply_cell(ws, 3, 8, None, font=LABEL_FONT, fill=YELLOW_FILL, alignment=CENTER)
    apply_cell(
        ws, 3, 9, 0,
        font=INPUT_FONT, fill=YELLOW_FILL, alignment=CENTER, border=THICK_GOLD, num_fmt="0.00",
    )
    apply_cell(ws, 3, 10, "Rs/kg", font=LABEL_FONT, fill=YELLOW_FILL, alignment=LEFT)

    merge_fill(ws, 4, 7, 4, 10, YELLOW_FILL, Font(name="Calibri", size=9, italic=True, color=NAVY), CENTER)
    ws.cell(row=4, column=7).value = (
        "No Selling Price column. Edit Base Price only — add today's change into those cells, then set this back to 0."
    )
    ws.row_dimensions[3].height = 28
    ws.row_dimensions[4].height = 28

    for r in range(1, 5):
        for c in range(7, 11):
            ws.cell(row=r, column=c).border = THICK_GOLD
            ws.cell(row=r, column=c).protection = UNLOCKED
    ws["I3"].border = THICK_GOLD
    ws["I3"].fill = YELLOW_FILL
    ws["I3"].font = INPUT_FONT
    ws["I3"].number_format = "0.00"
    ws["I3"].value = 0


def add_size_help(ws: Worksheet):
    """Simple add-size helper (no select-size price table)."""
    merge_fill(ws, 1, 11, 1, 13, GREEN_FILL, Font(name="Calibri", size=11, bold=True, color=WHITE), CENTER)
    ws.cell(row=1, column=11).value = "ADD A SIZE"

    apply_cell(ws, 2, 11, "Thickness", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    apply_cell(ws, 2, 12, None, font=INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN)
    apply_cell(ws, 2, 13, "(flat/square)", font=MUTED_FONT, fill=MINT_FILL, alignment=LEFT, border=THIN)

    apply_cell(ws, 3, 11, "Width", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    apply_cell(ws, 3, 12, None, font=INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN)
    apply_cell(ws, 3, 13, "(flat/square)", font=MUTED_FONT, fill=MINT_FILL, alignment=LEFT, border=THIN)

    apply_cell(ws, 4, 11, "Size to type", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    apply_cell(
        ws, 4, 12,
        '=IF(OR($L$2="",$L$3=""),IF($L$2<>"",$L$2,""),$L$2&"x"&$L$3)',
        font=Font(name="Calibri", size=14, bold=True, color=NAVY),
        fill=MINT_INPUT_FILL, alignment=CENTER, border=THICK_GREEN,
    )
    apply_cell(ws, 4, 13, "→ put in Size col", font=MUTED_FONT, fill=MINT_FILL, alignment=LEFT, border=THIN)

    merge_fill(ws, 5, 11, 5, 13, MINT_FILL, Font(name="Calibri", size=9, color=NAVY), LEFT)
    ws.cell(row=5, column=11).value = (
        "1) Scroll to a green empty row  2) Pick Shape  3) Type Size (25 or 6x25)  "
        "4) Type Base Price  5) Red Size = already added — skip"
    )
    ws.row_dimensions[5].height = 36

    for r in range(1, 6):
        for c in range(11, 14):
            ws.cell(row=r, column=c).protection = UNLOCKED


def add_products_sheet(wb: Workbook, families: list[dict]):
    ws = wb.active
    ws.title = PRODUCTS_SHEET
    ws.sheet_properties.tabColor = GOLD
    for col, w in {"A": 6, "B": 22, "C": 48, "D": 14, "E": 22, "F": 4, "G": 4, "H": 18, "I": 12, "J": 10}.items():
        ws.column_dimensions[col].width = w

    merge_fill(ws, 1, 1, 1, 5, NAVY_FILL, TITLE_FONT, Alignment(horizontal="left", vertical="center", indent=1))
    ws.cell(row=1, column=1).value = "Jagetiya Metals — Product Price List"
    ws.row_dimensions[1].height = 32

    merge_fill(ws, 2, 1, 2, 5, NAVY_FILL, COMPANY_FONT, Alignment(horizontal="left", vertical="center", indent=1))
    ws.cell(row=2, column=1).value = (
        "Jagetiya Metals  ·  +91-9824012344  ·  Kamlesh@jkmetal.in  ·  "
        "502/1-A G.I.D.C., Makarpura, Vadodara  ·  GST 24AGIPS3207M1Z7"
    )

    merge_fill(ws, 3, 1, 3, 5, GOLD_FILL, Font(name="Calibri", size=10, bold=True, color=NAVY), LEFT)
    ws.cell(row=3, column=1).value = (
        "Fully editable — no password. One sheet per grade (Round, Square, Hex, Flat together)."
    )

    instructions = [
        "How to use",
        "1. Open a grade sheet (click a name below). Example: MS Bright has Square, Hex, and Flat on one tab.",
        "2. There is only Base Price — no Selling Price column. Type or change prices in the Base Price column only.",
        "3. Yellow Daily Adjustment (and Master Daily Adjustment on the right) is a notepad for today's market move (e.g. +1 or -2).",
        "4. Add that amount into each Base Price cell when rates move, then set the yellow box back to 0.",
        "5. To add a size: green empty rows — pick Shape, type Size (25 or 6x25), type Base Price.",
        "6. Duplicate sizes for the same shape turn red — do not add twice.",
    ]
    for i, line in enumerate(instructions):
        r = 5 + i
        merge_fill(
            ws, r, 1, r, 5,
            CREAM_FILL if i else GOLD_FILL,
            Font(name="Calibri", size=11, bold=(i == 0), color=NAVY),
            LEFT,
        )
        ws.cell(row=r, column=1).value = line

    # Master Daily Adjustment (optional notepad)
    merge_fill(ws, 5, 8, 5, 10, GOLD_FILL, Font(name="Calibri", size=11, bold=True, color=NAVY), CENTER)
    ws.cell(row=5, column=8).value = "MASTER DAILY ADJUSTMENT (optional)"
    merge_fill(ws, 6, 8, 7, 10, YELLOW_FILL, Font(name="Calibri", size=9, color=NAVY), CENTER)
    ws.cell(row=6, column=8).value = (
        "Write today's market move here (e.g. 1 or -2). Copy into each grade sheet's yellow I3 box if useful. "
        "Then add that amount into Base Price cells on those sheets. Grades do not share this cell."
    )
    apply_cell(ws, 8, 8, "Copy-from value", font=LABEL_FONT, fill=YELLOW_FILL, alignment=RIGHT, border=THICK_GOLD)
    apply_cell(ws, 8, 9, 0, font=INPUT_FONT, fill=YELLOW_FILL, alignment=CENTER, border=THICK_GOLD, num_fmt="0.00")
    apply_cell(ws, 8, 10, "Rs/kg", font=LABEL_FONT, fill=YELLOW_FILL, alignment=LEFT, border=THICK_GOLD)
    merge_fill(ws, 9, 8, 11, 10, CREAM_FILL, MUTED_FONT, CENTER)
    ws.cell(row=9, column=8).value = (
        "Notepad only. It does not change Base Price by itself — edit Base Price cells for the real rate."
    )
    for r in range(5, 9):
        for c in range(8, 11):
            ws.cell(row=r, column=c).border = THICK_GOLD
            ws.cell(row=r, column=c).protection = UNLOCKED

    header_row = 13
    headers = ["#", "Grade", "Shapes on this sheet", "Size count", "Sheet name"]
    for c, h in enumerate(headers, 1):
        apply_cell(ws, header_row, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.freeze_panes = "A14"

    for i, fam in enumerate(families, 1):
        r = header_row + i
        fill = WHITE_FILL if i % 2 else ALT_FILL
        apply_cell(ws, r, 1, i, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, r, 2, fam["grade"], font=Font(name="Calibri", size=11, bold=True, color=NAVY),
                   fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 3, fam["shapes_label"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 4, fam["size_count"], font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        link = apply_cell(ws, r, 5, fam["sheet"], font=LINK_FONT, fill=fill, alignment=LEFT, border=THIN)
        link.hyperlink = "#%s!A1" % quote_sheet(fam["sheet"])

    last = header_row + len(families)
    ws.auto_filter.ref = "A%d:E%d" % (header_row, last)
    note_r = last + 2
    merge_fill(ws, note_r, 1, note_r, 5, CREAM_FILL, MUTED_FONT, LEFT)
    ws.cell(row=note_r, column=1).value = "Regenerate:  python3 scripts/generate_metals_price_workbook.py"
    page_setup(ws, freeze="A14")
    unlock_sheet(ws, note_r + 2, 12)


def add_grade_family_sheet(wb: Workbook, family: dict, is_first: bool):
    name = family["sheet"]
    ws = wb.create_sheet(title=name)
    shapes = family["shapes"]
    ws.sheet_properties.tabColor = SHAPE_TAB.get(shapes[0], NAVY) if len(shapes) == 1 else NAVY

    widths = {1: 16, 2: 26, 3: 12, 4: 18, 5: 3, 6: 3, 7: 14, 8: 4, 9: 12, 10: 10, 11: 14, 12: 12, 13: 16}
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w

    merge_fill(ws, 1, 1, 1, 4, NAVY_FILL, Font(name="Calibri", size=11, bold=True, color=GOLD), LEFT)
    ws.cell(row=1, column=1).value = (
        "JAGETIYA METALS  ·  +91-9824012344  ·  Kamlesh@jkmetal.in  ·  GST 24AGIPS3207M1Z7"
    )
    ws.row_dimensions[1].height = 20

    merge_fill(ws, 2, 1, 2, 4, CREAM_FILL, GRADE_FONT, LEFT)
    ws.cell(row=2, column=1).value = family["grade"]
    ws.row_dimensions[2].height = 28

    merge_fill(ws, 3, 1, 3, 4, CREAM_FILL, BODY_FONT, LEFT)
    ws.cell(row=3, column=1).value = "Shapes: %s" % family["shapes_label"]

    back = apply_cell(ws, 4, 1, "← Back to Products", font=LINK_FONT, fill=CREAM_FILL, alignment=LEFT)
    back.hyperlink = "#%s!A1" % quote_sheet(PRODUCTS_SHEET)
    merge_fill(ws, 4, 2, 4, 4, CREAM_FILL, MUTED_FONT, LEFT)
    ws.cell(row=4, column=2).value = (
        "Only Base Price — edit that column for rates. Yellow Daily Adjustment is a notepad for today's move. "
        "Add sizes in the green rows at the bottom."
    )

    add_adjustment_box(ws)
    add_size_help(ws)

    headers = ["Shape", "Sub-type", "Size", "Base Price (Rs/kg)"]
    for c, h in enumerate(headers, 1):
        apply_cell(ws, 5, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[5].height = 22

    rows = build_rows(family, is_first)
    row = DATA_START
    for i, item in enumerate(rows):
        fill = WHITE_FILL if i % 2 == 0 else ALT_FILL
        apply_cell(ws, row, 1, item["shape"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 2, item["subtype"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(
            ws, row, 3, item["size"] if item["size"] != "" else None,
            font=Font(name="Calibri", size=11, bold=True, color=NAVY),
            fill=fill, alignment=CENTER, border=THIN,
        )
        apply_cell(
            ws, row, 4, item["price"],
            font=SELL_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00",
        )
        row += 1

    shape_dv = DataValidation(
        type="list",
        formula1='"%s"' % ",".join(SHAPE_CHOICES),
        allow_blank=True,
        showDropDown=False,
        showErrorMessage=True,
        errorTitle="Shape",
        error="Choose Round Bar, Square Bar, Hex Bar, Flat Bar, or Non-Ferrous.",
        showInputMessage=True,
        promptTitle="Add size",
        prompt="Pick Shape, type Size (25 or 6x25), type Base Price.",
    )
    ws.add_data_validation(shape_dv)

    for i in range(BLANK_ROWS):
        fill = MINT_INPUT_FILL
        apply_cell(ws, row, 1, None, font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 2, None, font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 3, None, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, row, 4, None, font=SELL_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00")
        shape_dv.add(ws.cell(row=row, column=1).coordinate)
        if i == 0:
            apply_cell(
                ws, row, 2, "← New size: Shape + Size + Base Price",
                font=MUTED_FONT, fill=fill, alignment=LEFT, border=THIN,
            )
        row += 1

    last_data_row = row - 1

    dup_range = "C%d:C%d" % (DATA_START, last_data_row)
    ws.conditional_formatting.add(
        dup_range,
        FormulaRule(
            formula=[
                'AND(C%d<>"",COUNTIFS($A$%d:$A$%d,A%d,$C$%d:$C$%d,C%d)>1)'
                % (DATA_START, DATA_START, last_data_row, DATA_START, DATA_START, last_data_row, DATA_START)
            ],
            fill=CORAL_FILL,
            font=Font(name="Calibri", size=11, bold=True, color="922B21"),
        ),
    )

    ws.auto_filter.ref = "A5:D%d" % last_data_row
    page_setup(ws, freeze="A6")
    ws.print_title_rows = "1:5"
    unlock_sheet(ws, last_data_row + 2, 13)
    family["last_data_row"] = last_data_row
    family["row_count"] = len(rows)
    return ws


def build_workbook(entries: list[dict]) -> Workbook:
    families = assign_family_sheets(group_entries_by_grade(entries))
    wb = Workbook()
    wb.security.lockStructure = False
    wb.security.lockWindows = False
    wb.security.lockRevision = False
    wb.properties.title = "Jagetiya Metals — Product Price List"
    wb.properties.creator = "Jagetiya Metals"
    wb.properties.subject = "Editable steel price list by grade (all shapes on one sheet)"
    wb.properties.description = (
        "One sheet per grade. Base Price only (no Selling column). "
        "Master Daily Adjustment notepad on Products. Add sizes in green rows. No password."
    )
    wb.properties.company = "Jagetiya Metals"

    add_products_sheet(wb, families)
    for i, fam in enumerate(families):
        add_grade_family_sheet(wb, fam, is_first=(i == 0))

    for ws in wb.worksheets:
        ws.protection.sheet = False
        ws.protection.enable = False
    return wb


def verify_workbook(path: Path, catalog_js: Path) -> dict:
    catalog = load_catalog(catalog_js)
    families = assign_family_sheets(group_entries_by_grade(catalog))
    wb = load_workbook(path)
    errors = []
    report = {
        "path": str(path),
        "sheets": wb.sheetnames[:],
        "grade_sheets": len(wb.sheetnames) - 1,
        "catalog_entries": len(catalog),
        "unique_grades": len(families),
        "sample": {},
        "ok": True,
    }

    if PRODUCTS_SHEET not in wb.sheetnames or wb.sheetnames[0] != PRODUCTS_SHEET:
        errors.append("Products must be first sheet")
    if len(wb.sheetnames) - 1 != len(families):
        errors.append("Grade sheets %d != %d" % (len(wb.sheetnames) - 1, len(families)))

    p = wb[PRODUCTS_SHEET]
    if p.cell(5, 8).value != "MASTER DAILY ADJUSTMENT (optional)":
        errors.append("Products missing Master Daily Adjustment box")
    if p.cell(8, 9).value not in (0, 0.0):
        errors.append("Master Daily Adjustment default should be 0")

    for fam in families:
        name = fam["sheet"]
        if name not in wb.sheetnames:
            errors.append("Missing %s" % name)
            continue
        ws = wb[name]
        if ws.protection.sheet:
            errors.append("Protected: %s" % name)
        if ws.cell(2, 1).value != fam["grade"]:
            errors.append("%s grade header wrong" % name)

        headers = [str(ws.cell(5, c).value or "") for c in range(1, 6)]
        if headers[:4] != ["Shape", "Sub-type", "Size", "Base Price (Rs/kg)"]:
            errors.append("%s headers %r" % (name, headers[:4]))
        if headers[4] and "selling" in headers[4].lower():
            errors.append("%s still has Selling Price column" % name)
        # column E header should be empty / not selling
        if ws.cell(5, 5).value and "selling" in str(ws.cell(5, 5).value).lower():
            errors.append("%s Selling Price header still present" % name)

        for c in range(1, 14):
            for r in range(1, 4):
                v = str(ws.cell(r, c).value or "")
                if "SELECT SIZE" in v.upper():
                    errors.append("%s still has Select Size Edit Price panel" % name)
                if "SELLING PRICE" in v.upper() and r == 5:
                    errors.append("%s selling in header area" % name)

        if ws.cell(1, 7).value != "DAILY ADJUSTMENT (Rs/kg)":
            errors.append("%s missing Daily Adjustment box" % name)
        if ws[ADJ_CELL].value not in (0, 0.0):
            errors.append("%s I3 should be 0" % name)

        # Base price must be a value (or empty), not a selling formula with $I$3
        base = ws.cell(DATA_START, 4).value
        if isinstance(base, str) and base.startswith("=") and "$I$3" in base:
            errors.append("%s Base Price should be editable value, not adj formula: %r" % (name, base))
        sell = ws.cell(DATA_START, 5).value
        if isinstance(sell, str) and "$I$3" in sell:
            errors.append("%s still has Selling formula in column E: %r" % (name, sell))

        shapes_found = set()
        for r in range(DATA_START, DATA_START + 4000):
            sh = ws.cell(r, 1).value
            if sh in SHAPE_CHOICES:
                shapes_found.add(sh)
            elif sh is None and ws.cell(r, 3).value is None and r > DATA_START + fam["size_count"] + BLANK_ROWS + 3:
                break
        for s in fam["shapes"]:
            if s not in shapes_found:
                errors.append("%s missing shape %s" % (name, s))

        if fam["grade"] == families[0]["grade"]:
            report["sample"] = {
                "sheet": name,
                "I3": ws[ADJ_CELL].value,
                "base_D6": ws.cell(DATA_START, 4).value,
                "col_E6": ws.cell(DATA_START, 5).value,
            }

    by_name = {f["grade"]: f for f in families}
    bright = by_name.get("MS Bright")
    if not bright or set(bright["shapes"]) != {"Square Bar", "Hex Bar", "Flat Bar"}:
        errors.append("MS Bright shapes wrong")
    else:
        ws = wb[bright["sheet"]]
        sq, hx, fl = set(), set(), set()
        for r in range(DATA_START, DATA_START + 3000):
            sh, sz = ws.cell(r, 1).value, normalize_existing_key(ws.cell(r, 3).value)
            if sh == "Square Bar" and sz is not None:
                sq.add(sz)
            elif sh == "Hex Bar" and sz is not None:
                hx.add(sz)
            elif sh == "Flat Bar" and sz is not None:
                fl.add(sz)
            if sh is None and ws.cell(r, 3).value is None and r > DATA_START + 80:
                break
        if 8 not in sq or 25.4 not in sq:
            errors.append("MS Bright Square sizes incomplete")
        if 12 not in hx or 75 not in hx:
            errors.append("MS Bright Hex sizes incomplete")
        if "5x16" not in fl or "6x25" not in fl:
            errors.append("MS Bright Flat TxW incomplete")

    report["errors"] = errors
    report["ok"] = not errors
    return report


def print_report(report: dict) -> None:
    print("Workbook:", report["path"])
    print("Catalog entries:", report["catalog_entries"])
    print("Grade sheets:", report["grade_sheets"])
    for n in report.get("sheets") or []:
        print("  -", n)
    if report.get("sample"):
        print("Sample:", report["sample"])
    if report["errors"]:
        print("VERIFY FAILED:")
        for e in report["errors"]:
            print("  -", e)
    else:
        print("VERIFY OK — Base Price only (no Selling), Master Daily Adj notepad, no select-size panel")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate Jagetiya Metals price workbook")
    parser.add_argument("--catalog", type=Path, default=CATALOG_JS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("--log", type=Path, default=None)
    args = parser.parse_args(argv)

    if not args.verify_only:
        entries = load_catalog(args.catalog)
        wb = build_workbook(entries)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        wb.save(args.output)
        print("Wrote %s (%d grade sheets from %d catalog entries)" % (
            args.output, len(wb.sheetnames) - 1, len(entries),
        ))

    if args.verify or args.verify_only:
        report = verify_workbook(args.output, args.catalog)
        print_report(report)
        if args.log:
            args.log.parent.mkdir(parents=True, exist_ok=True)
            args.log.write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
        return 0 if report["ok"] else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
