#!/usr/bin/env python3
"""Generate the Jagetiya Metals product price workbook from the built-in catalog.

One sheet per grade. All shapes for that grade share the sheet.
Columns are Shape | Sub-type | Size | Price only — no make/notes, no daily
adjustment, no selling-price formula.

Right side: pick a size from a dropdown and edit its price in one cell
(the matched Price cell is highlighted by row number). Adding a size is
typing into the green empty rows at the bottom of the list.

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
PALE = "FFFDF8"
ROW_ALT = "FFF8E7"
LINK_BLUE = "1B3A5C"
MUTED = "5A6A7A"
GREEN = "1A5C32"
MINT = "E8F6EF"
MINT_INPUT = "F4FCF8"
SKY = "D6EAF8"
CORAL = "FDEDEC"

PRODUCTS_SHEET = "Products"
HEADER_ROWS = 5
DATA_START = 6  # first data row of the price list
BLANK_ROWS = 20  # empty green rows for adding sizes
EXAMPLE_BASES = {16: 72.00, 18: 71.50}

# Side panel cells
SIDE_COL = 6  # column F
PICK_SIZE_CELL = "G2"
PICK_PRICE_CELL = "G3"
PICK_ROW_CELL = "G4"
PICK_SHAPE_CELL = "G5"
ADD_TH_CELL = "G8"
ADD_W_CELL = "I8"
ADD_KEY_CELL = "G9"

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
THICK_GREEN = Border(
    left=Side(style="medium", color=GREEN),
    right=Side(style="medium", color=GREEN),
    top=Side(style="medium", color=GREEN),
    bottom=Side(style="medium", color=GREEN),
)
THICK_GOLD = Border(
    left=Side(style="medium", color=GOLD),
    right=Side(style="medium", color=GOLD),
    top=Side(style="medium", color=GOLD),
    bottom=Side(style="medium", color=GOLD),
)

NAVY_FILL = PatternFill("solid", fgColor=NAVY)
GOLD_FILL = PatternFill("solid", fgColor=GOLD)
CREAM_FILL = PatternFill("solid", fgColor=CREAM)
PALE_FILL = PatternFill("solid", fgColor=PALE)
ALT_FILL = PatternFill("solid", fgColor=ROW_ALT)
WHITE_FILL = PatternFill("solid", fgColor=WHITE)
HEADER_FILL = PatternFill("solid", fgColor="1B3A5C")
MINT_FILL = PatternFill("solid", fgColor=MINT)
MINT_INPUT_FILL = PatternFill("solid", fgColor=MINT_INPUT)
GREEN_FILL = PatternFill("solid", fgColor=GREEN)
SKY_FILL = PatternFill("solid", fgColor=SKY)
CORAL_FILL = PatternFill("solid", fgColor=CORAL)

TITLE_FONT = Font(name="Calibri", size=18, bold=True, color=WHITE)
COMPANY_FONT = Font(name="Calibri", size=11, bold=True, color=GOLD)
BODY_FONT = Font(name="Calibri", size=11, color=NAVY)
MUTED_FONT = Font(name="Calibri", size=10, color=MUTED)
GRADE_FONT = Font(name="Calibri", size=20, bold=True, color=NAVY)
COL_FONT = Font(name="Calibri", size=11, bold=True, color=WHITE)
LINK_FONT = Font(name="Calibri", size=11, color=LINK_BLUE, underline="single", bold=True)
LABEL_FONT = Font(name="Calibri", size=11, bold=True, color=NAVY)
INPUT_FONT = Font(name="Calibri", size=14, bold=True, color=NAVY)
PRICE_FONT = Font(name="Calibri", size=11, bold=True, color=GREEN)

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
    """Canonical form: 25 == 25.0, '6x25' == '6 x 25'."""
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


def size_label(size) -> str | int | float:
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
      make: e.m || "",
      sizes: Array.isArray(e.sz) ? e.sz.slice() : [],
      flat: e.flat ? e.flat : null,
      noteOnly: !!e.note
    });
  }
}
process.stdout.write(JSON.stringify(entries));
""" % json.dumps(str(catalog_js))
    proc = subprocess.run(
        ["node", "-e", js],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        check=False,
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
    """Flat list of {shape, subtype, size, price} for the grade sheet."""
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
                            "shape": shape,
                            "subtype": subtype,
                            "size": flat_size_label(th, w),
                            "price": None,
                        })
            elif e.get("noteOnly"):
                rows.append({
                    "shape": shape,
                    "subtype": subtype,
                    "size": "",
                    "price": None,
                })
            else:
                for sz in e.get("sizes") or []:
                    label = size_label(sz)
                    price = None
                    if is_first and not example_used and float(sz) in EXAMPLE_BASES:
                        price = EXAMPLE_BASES[float(sz)]
                        if float(sz) == 18:
                            example_used = True
                    rows.append({
                        "shape": shape,
                        "subtype": subtype,
                        "size": label,
                        "price": price,
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


def add_products_sheet(wb: Workbook, families: list[dict]):
    ws = wb.active
    ws.title = PRODUCTS_SHEET
    ws.sheet_properties.tabColor = GOLD
    for col, w in {"A": 6, "B": 22, "C": 48, "D": 14, "E": 22, "F": 14}.items():
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
        "2. The list has Shape | Sub-type | Size | Price (Rs/kg). Type prices in the Price column.",
        "3. To edit one size quickly: on the RIGHT, pick the size from the dropdown, then type the new price. It updates that row.",
        "4. To add a size: scroll to the green empty rows at the bottom — pick Shape, type Size (25 or 6x25 for flat), type Price.",
        "5. Flat sizes use Thickness×Width as one size, e.g. 6x25. Helper on the right builds that for you.",
        "6. Duplicate sizes in the same shape turn red — do not add the same size twice.",
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
    ws.cell(row=note_r, column=1).value = (
        "Regenerate:  python3 scripts/generate_metals_price_workbook.py"
    )
    page_setup(ws, freeze="A14")
    unlock_sheet(ws, note_r + 2, 8)


def add_side_panels(ws: Worksheet, data_start: int, last_catalog: int, last_data_row: int, rows: list[dict]):
    """Right side: compact Size|Price table to edit, plus easy add-size help."""
    # --- Compact editable price table (source of truth for quick edits) ---
    merge_fill(ws, 1, 6, 1, 8, GREEN_FILL, Font(name="Calibri", size=11, bold=True, color=WHITE), CENTER)
    ws.cell(row=1, column=6).value = "SELECT SIZE → EDIT PRICE"

    merge_fill(ws, 2, 6, 2, 8, CREAM_FILL, Font(name="Calibri", size=9, color=NAVY), LEFT)
    ws.cell(row=2, column=6).value = (
        "Filter or scroll this table, then type the Price. Column D on the left stays in sync."
    )
    ws.row_dimensions[2].height = 28

    apply_cell(ws, 3, 6, "Shape", font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    apply_cell(ws, 3, 7, "Size", font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    apply_cell(ws, 3, 8, "Price (Rs/kg)", font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)

    # Side table rows mirror catalog sizes; Price is editable VALUE.
    # Left column D uses VLOOKUP/SUMIFS from this side table so editing here updates the list.
    side_start = 4
    for i, item in enumerate(rows):
        r = side_start + i
        fill = WHITE_FILL if i % 2 == 0 else ALT_FILL
        apply_cell(ws, r, 6, item["shape"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(
            ws, r, 7, item["size"] if item["size"] != "" else None,
            font=Font(name="Calibri", size=11, bold=True, color=NAVY),
            fill=fill, alignment=CENTER, border=THIN,
        )
        apply_cell(
            ws, r, 8, item["price"],
            font=PRICE_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00",
        )

    side_last = side_start + len(rows) - 1 if rows else side_start
    if not rows:
        side_last = side_start
        apply_cell(ws, side_start, 6, None, font=BODY_FONT, fill=MINT_INPUT_FILL, alignment=LEFT, border=THIN)
        apply_cell(ws, side_start, 7, None, font=BODY_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THIN)
        apply_cell(ws, side_start, 8, None, font=PRICE_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THIN, num_fmt="0.00")

    # Extra green rows on the side to add sizes (same as left blanks)
    side_blank_start = side_last + 1
    shape_dv_side = DataValidation(
        type="list",
        formula1='"%s"' % ",".join(SHAPE_CHOICES),
        allow_blank=True,
        showDropDown=False,
        showErrorMessage=True,
        errorTitle="Shape",
        error="Choose Round Bar, Square Bar, Hex Bar, Flat Bar, or Non-Ferrous.",
    )
    ws.add_data_validation(shape_dv_side)
    for i in range(BLANK_ROWS):
        r = side_blank_start + i
        fill = MINT_INPUT_FILL
        apply_cell(ws, r, 6, None, font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 7, None, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, r, 8, None, font=PRICE_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00")
        shape_dv_side.add(ws.cell(row=r, column=6).coordinate)
        if i == 0:
            # placeholder in a comment-like adjacent area via row above note
            pass
    side_blank_end = side_blank_start + BLANK_ROWS - 1

    ws.auto_filter.ref = "F3:H%d" % side_blank_end

    # --- Add-size helper (below a spacer relative to header area on far right) ---
    help_col = 10  # column J
    ws.column_dimensions["J"].width = 16
    ws.column_dimensions["K"].width = 12
    ws.column_dimensions["L"].width = 14

    merge_fill(ws, 1, 10, 1, 12, NAVY_FILL, Font(name="Calibri", size=11, bold=True, color=WHITE), CENTER)
    ws.cell(row=1, column=10).value = "ADD SIZE HELP"

    apply_cell(ws, 2, 10, "Thickness", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    apply_cell(ws, 2, 11, None, font=INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN)
    apply_cell(ws, 2, 12, None, font=INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN)
    apply_cell(ws, 1, 11, None, font=MUTED_FONT, fill=NAVY_FILL, alignment=CENTER)
    # Width label on row 3
    apply_cell(ws, 3, 10, "Width (flat)", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    # Move width input - fix layout: Thickness K2, Width K3
    ws.cell(row=2, column=12).value = None
    apply_cell(ws, 3, 11, None, font=INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN)
    merge_fill(ws, 3, 12, 3, 12, MINT_FILL, MUTED_FONT, CENTER)
    ws.cell(row=3, column=12).value = "for flat / square"

    apply_cell(ws, 4, 10, "Size key", font=LABEL_FONT, fill=MINT_FILL, alignment=RIGHT, border=THIN)
    apply_cell(
        ws, 4, 11,
        '=IF(OR($K$2="",$K$3=""),IF($K$2<>"",$K$2,""),$K$2&"x"&$K$3)',
        font=INPUT_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THICK_GREEN,
    )
    merge_fill(ws, 4, 12, 4, 12, MINT_FILL, MUTED_FONT, LEFT)
    ws.cell(row=4, column=12).value = "type this in Size"

    merge_fill(ws, 5, 10, 8, 12, MINT_FILL, Font(name="Calibri", size=10, color=NAVY), LEFT)
    ws.cell(row=5, column=10).value = (
        "How to add:\n"
        "1. In the green table (or left list), go to an empty green row.\n"
        "2. Pick Shape.\n"
        "3. Type Size (25) or for flat use Thickness+Width and type the Size key (6x25).\n"
        "4. Type Price.\n"
        "5. Red Size = already added for that shape — skip it."
    )
    for r in range(5, 9):
        ws.row_dimensions[r].height = 18
    ws.row_dimensions[8].height = 36

    for r in range(1, side_blank_end + 1):
        for c in range(6, 9):
            ws.cell(row=r, column=c).protection = UNLOCKED
    for r in range(1, 9):
        for c in range(10, 13):
            ws.cell(row=r, column=c).protection = UNLOCKED

    return side_start, side_last, side_blank_end


def add_grade_family_sheet(wb: Workbook, family: dict, is_first: bool):
    name = family["sheet"]
    ws = wb.create_sheet(title=name)
    shapes = family["shapes"]
    ws.sheet_properties.tabColor = SHAPE_TAB.get(shapes[0], NAVY) if len(shapes) == 1 else NAVY

    for col, w in enumerate([18, 28, 14, 16, 3, 16, 12, 14, 3, 14, 12, 14], 1):
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
        "Right side: filter Size and type Price. Left Price follows the right table. "
        "Add sizes in the green empty rows (pick Shape → Size → Price)."
    )

    headers = ["Shape", "Sub-type", "Size", "Price (Rs/kg)"]
    for c, h in enumerate(headers, 1):
        apply_cell(ws, 5, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[5].height = 22

    rows = build_rows(family, is_first)
    side_start, side_last, side_blank_end = add_side_panels(
        ws, DATA_START, DATA_START + max(len(rows) - 1, 0), DATA_START + len(rows) + BLANK_ROWS, rows,
    )

    row = DATA_START
    for i, item in enumerate(rows):
        fill = WHITE_FILL if i % 2 == 0 else ALT_FILL
        side_r = side_start + i
        apply_cell(ws, row, 1, item["shape"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 2, item["subtype"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        size_val = item["size"]
        apply_cell(
            ws, row, 3, size_val if size_val != "" else None,
            font=Font(name="Calibri", size=11, bold=True, color=NAVY),
            fill=fill, alignment=CENTER, border=THIN,
        )
        # Price on the left mirrors the side editable price cell
        apply_cell(
            ws, row, 4, "=H%d" % side_r,
            font=PRICE_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00",
        )
        row += 1

    first_blank = row
    last_catalog = row - 1 if rows else DATA_START - 1

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
        prompt="Pick Shape, type Size (25 or 6x25), type Price.",
    )
    ws.add_data_validation(shape_dv)

    for i in range(BLANK_ROWS):
        fill = MINT_INPUT_FILL
        apply_cell(ws, row, 1, None, font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 2, None, font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, row, 3, None, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, row, 4, None, font=PRICE_FONT, fill=fill, alignment=CENTER, border=THIN, num_fmt="0.00")
        shape_dv.add(ws.cell(row=row, column=1).coordinate)
        if i == 0:
            apply_cell(
                ws, row, 2, "← New size: Shape + Size + Price",
                font=MUTED_FONT, fill=fill, alignment=LEFT, border=THIN,
            )
        row += 1

    last_data_row = row - 1

    # Duplicate highlight on left Size column
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
    # Same on side size column
    side_dup = "G%d:G%d" % (side_start, side_blank_end)
    ws.conditional_formatting.add(
        side_dup,
        FormulaRule(
            formula=[
                'AND(G%d<>"",COUNTIFS($F$%d:$F$%d,F%d,$G$%d:$G$%d,G%d)>1)'
                % (side_start, side_start, side_blank_end, side_start, side_start, side_blank_end, side_start)
            ],
            fill=CORAL_FILL,
            font=Font(name="Calibri", size=11, bold=True, color="922B21"),
        ),
    )

    # AutoFilter stays on the side price table (one filter per sheet)
    page_setup(ws, freeze="A6")
    ws.print_title_rows = "1:5"
    unlock_sheet(ws, max(last_data_row, side_blank_end) + 2, 12)
    family["data_start"] = DATA_START
    family["last_catalog"] = last_catalog
    family["last_data_row"] = last_data_row
    family["first_blank"] = first_blank
    family["side_start"] = side_start
    family["side_last"] = side_last
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
        "One sheet per grade. Shape | Sub-type | Size | Price. "
        "Select a size on the right to edit its price. Add sizes in green rows. No password."
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
        errors.append("Products must be the first sheet")
    if len(wb.sheetnames) - 1 != len(families):
        errors.append("Grade sheets %d != families %d" % (len(wb.sheetnames) - 1, len(families)))

    if getattr(wb.security, "workbookPassword", None):
        errors.append("Workbook password is set")

    banned = ("make / notes", "daily adj", "selling price", "daily adjustment")
    side_ok = 0

    for fam in families:
        name = fam["sheet"]
        if name not in wb.sheetnames:
            errors.append("Missing sheet %s" % name)
            continue
        ws = wb[name]
        if ws.protection.sheet:
            errors.append("Sheet protection on %s" % name)
        if ws.cell(2, 1).value != fam["grade"]:
            errors.append("%s grade header mismatch" % name)

        headers = [str(ws.cell(5, c).value or "").strip().lower() for c in range(1, 5)]
        if headers != ["shape", "sub-type", "size", "price (rs/kg)"]:
            errors.append("%s headers %r" % (name, headers))
        blob = " ".join(str(ws.cell(5, c).value or "").lower() for c in range(1, 12))
        for b in banned:
            if b in blob:
                errors.append("%s still has %r" % (name, b))

        if ws.cell(1, 6).value != "SELECT SIZE → EDIT PRICE":
            errors.append("%s missing side price table title" % name)
        else:
            side_ok += 1
        if ws.cell(3, 6).value != "Shape" or ws.cell(3, 8).value != "Price (Rs/kg)":
            errors.append("%s side table headers wrong" % name)
        if ws.cell(1, 10).value != "ADD SIZE HELP":
            errors.append("%s missing add-size help" % name)

        # First data price should mirror side H
        d6 = ws.cell(DATA_START, 4).value
        if isinstance(d6, str) and d6.startswith("=H"):
            pass
        elif fam["size_count"] > 0:
            errors.append("%s D%d should be =H… mirror, got %r" % (name, DATA_START, d6))

        shapes_found = set()
        for r in range(DATA_START, DATA_START + 5000):
            shape = ws.cell(r, 1).value
            size = ws.cell(r, 3).value
            price = ws.cell(r, 4).value
            if shape is None and size is None and (price is None or price == ""):
                if r > DATA_START + fam["size_count"] + BLANK_ROWS + 5:
                    break
                continue
            if shape in SHAPE_CHOICES:
                shapes_found.add(shape)
            if isinstance(price, str) and "$I$3" in price:
                errors.append("%s still has daily-adj selling formula" % name)
                break
        for s in fam["shapes"]:
            if s not in shapes_found:
                errors.append("%s missing shape %s" % (name, s))

        if fam["grade"] == families[0]["grade"]:
            side_price = ws.cell(4, 8).value  # first side price row
            report["sample"] = {
                "sheet": name,
                "left_price_formula": ws.cell(DATA_START, 4).value,
                "side_price_H4": side_price,
            }

    if side_ok != len(families):
        errors.append("Side panels on %d / %d sheets" % (side_ok, len(families)))

    by_name = {f["grade"]: f for f in families}
    bright = by_name.get("MS Bright")
    if not bright or set(bright["shapes"]) != {"Square Bar", "Hex Bar", "Flat Bar"}:
        errors.append("MS Bright shapes wrong: %s" % (bright or {}).get("shapes"))
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
        for expect in (8, 25.4):
            if expect not in sq:
                errors.append("MS Bright Square missing %s" % expect)
        for expect in (12, 75):
            if expect not in hx:
                errors.append("MS Bright Hex missing %s" % expect)
        if "5x16" not in fl or "6x25" not in fl:
            errors.append("MS Bright Flat missing TxW, have %s" % list(fl)[:8])

    if "EN-8" in by_name and (
        "Round Bar" not in by_name["EN-8"]["shapes"] or "Flat Bar" not in by_name["EN-8"]["shapes"]
    ):
        errors.append("EN-8 should include Round and Flat")
    if "WPS (D3)" in by_name and set(by_name["WPS (D3)"]["shapes"]) < {
        "Round Bar", "Square Bar", "Flat Bar",
    }:
        errors.append("WPS (D3) should include Round, Square, Flat")

    p = wb[PRODUCTS_SHEET]
    if p.protection.sheet:
        errors.append("Products protected")
    hdr = [p.cell(13, c).value for c in range(1, 6)]
    if hdr != ["#", "Grade", "Shapes on this sheet", "Size count", "Sheet name"]:
        errors.append("Products headers %r" % hdr)

    report["errors"] = errors
    report["ok"] = not errors
    report["side_panels"] = side_ok
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
        print("VERIFY OK — Shape|Sub-type|Size|Price, side price table, green add rows, no daily adj/make/notes")


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
            print("Log:", args.log)
        return 0 if report["ok"] else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
