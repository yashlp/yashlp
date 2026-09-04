#!/usr/bin/env python3
"""Generate the Jagetiya Metals product price workbook from the built-in catalog.

Reads public/metals/js/catalog.js (via Node) so grades, shapes, subtypes, and
sizes stay in sync with the stock-search site.

Usage:
  python3 scripts/generate_metals_price_workbook.py
  python3 scripts/generate_metals_price_workbook.py --verify
  python3 scripts/generate_metals_price_workbook.py --verify-only

Daily adjustment: each grade sheet has a yellow cell at I3. Selling Price is
Base Price + $I$3, so typing 1 adds Rs 1 to every size without changing bases.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Protection, Side
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.page import PageMargins
from openpyxl.worksheet.worksheet import Worksheet

ROOT = Path(__file__).resolve().parents[1]
CATALOG_JS = ROOT / "public" / "metals" / "js" / "catalog.js"
DEFAULT_OUTPUT = ROOT / "public" / "metals" / "Jagetiya_Metals_Price_List.xlsx"

NAVY = "0F2540"
GOLD = "C8960C"
CREAM = "F7F4EE"
WHITE = "FFFFFF"
YELLOW = "FFE566"
YELLOW_DARK = "F5C842"
PALE = "FFFDF8"
ROW_ALT = "FFF8E7"
LINK_BLUE = "1B3A5C"
MUTED = "5A6A7A"
GREEN = "1A5C32"

ADJ_CELL = "I3"
ADJ_ABS = "$I$3"
HEADER_ROW = 5
FIRST_DATA_ROW = 6
PRODUCTS_SHEET = "Products"
EXAMPLE_BASES = {16: 72.00, 18: 71.50}  # first grade sheet only

SHAPE_ABBR = {
    "Round Bar": "RB",
    "Square Bar": "SQ",
    "Hex Bar": "HX",
    "Flat Bar": "FL",
    "Non-Ferrous": "NF",
}
SHAPE_TAB = {
    "Round Bar": "1B3A5C",
    "Square Bar": "1A5C32",
    "Hex Bar": "6C3483",
    "Flat Bar": "C8960C",
    "Non-Ferrous": "117A65",
}
SUBTYPE_SHORT = (
    ("Centerless Grinding", "CL Grind"),
    ("Stainless Steel Rod", "SS Rod"),
    ("Rolled Imported", "Imp Rolled"),
    ("Imported / Forging Rod", "Imp Forg Rod"),
    ("Forging / Imported Rod", "Forg Imp Rod"),
    ("Turn Rod Imported", "Turn Rod Imp"),
    ("Rolled - Super Forge", "Rolled SF"),
    ("Rod, Hex, Square, Flat, Sheet", "Rod Hex Sq Fl"),
    ("HE30 / 6802 Grade", "HE30 6802"),
    ("Rod (Rolled)", "Rod Rolled"),
)

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
NAVY_FILL = PatternFill("solid", fgColor=NAVY)
GOLD_FILL = PatternFill("solid", fgColor=GOLD)
CREAM_FILL = PatternFill("solid", fgColor=CREAM)
YELLOW_FILL = PatternFill("solid", fgColor=YELLOW)
PALE_FILL = PatternFill("solid", fgColor=PALE)
ALT_FILL = PatternFill("solid", fgColor=ROW_ALT)
WHITE_FILL = PatternFill("solid", fgColor=WHITE)
HEADER_FILL = PatternFill("solid", fgColor="1B3A5C")

TITLE_FONT = Font(name="Calibri", size=18, bold=True, color=WHITE)
COMPANY_FONT = Font(name="Calibri", size=11, bold=True, color=GOLD)
BODY_FONT = Font(name="Calibri", size=11, color=NAVY)
MUTED_FONT = Font(name="Calibri", size=10, color=MUTED)
GRADE_FONT = Font(name="Calibri", size=20, bold=True, color=NAVY)
COL_FONT = Font(name="Calibri", size=11, bold=True, color=WHITE)
LINK_FONT = Font(name="Calibri", size=11, color=LINK_BLUE, underline="single", bold=True)
ADJ_LABEL_FONT = Font(name="Calibri", size=11, bold=True, color=NAVY)
ADJ_INPUT_FONT = Font(name="Calibri", size=16, bold=True, color=NAVY)
SELL_FONT = Font(name="Calibri", size=11, bold=True, color=GREEN)
EXAMPLE_FONT = Font(name="Calibri", size=10, italic=True, color="7D5A00")

CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
RIGHT = Alignment(horizontal="right", vertical="center")


def fmt_num(n) -> str:
    n = float(n)
    if abs(n - int(n)) < 1e-9:
        return str(int(n))
    return ("%g" % n)


def quote_sheet(name: str) -> str:
    return "'" + name.replace("'", "''") + "'"


def load_catalog(catalog_js: Path) -> list[dict]:
    """Load builtin catalog entries via Node so JS stays the source of truth."""
    if not catalog_js.is_file():
        raise FileNotFoundError("Catalog not found: %s" % catalog_js)
    js = r"""
const c = require(%s);
const entries = [];
for (const shape of c.SL) {
  const list = c.BUILTIN_DB[shape] || [];
  for (const e of list) {
    const rec = {
      shape: shape,
      grade: e.g,
      subtype: e.s || "",
      make: e.m || "",
      sizes: Array.isArray(e.sz) ? e.sz.slice() : [],
      flat: e.flat ? e.flat : null,
      noteOnly: !!e.note
    };
    entries.push(rec);
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


def shorten_subtype(subtype: str) -> str:
    out = subtype
    for src, dst in SUBTYPE_SHORT:
        out = out.replace(src, dst)
    return out


def sanitize_sheet_name(raw: str) -> str:
    name = INVALID_SHEET_CHARS.sub("-", raw)
    name = re.sub(r"\s+", " ", name).strip()
    name = name.strip("'")
    if not name:
        name = "Grade"
    return name[:31]


def unique_sheet_name(grade: str, shape: str, subtype: str, used: set[str]) -> str:
    abbr = SHAPE_ABBR.get(shape, shape[:2].upper())
    base = sanitize_sheet_name("%s %s %s" % (grade, abbr, shorten_subtype(subtype)))
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


def classify(entry: dict) -> str:
    if entry.get("flat"):
        return "flat"
    if entry.get("noteOnly") and not entry.get("sizes"):
        return "note"
    return "round"


def size_count(entry: dict) -> int:
    kind = classify(entry)
    if kind == "flat":
        n = 0
        for widths in entry["flat"].values():
            n += len(widths)
        return n
    if kind == "note":
        return 0
    return len(entry.get("sizes") or [])


def flat_rows(entry: dict) -> list[tuple]:
    rows = []
    thicknesses = sorted((float(t) for t in entry["flat"].keys()), key=lambda x: x)
    for th in thicknesses:
        key = str(int(th)) if th == int(th) else str(th)
        if key not in entry["flat"]:
            key = str(th)
            if key not in entry["flat"]:
                # JS object keys are strings of the original number
                for k in entry["flat"]:
                    if abs(float(k) - th) < 1e-9:
                        key = k
                        break
        widths = sorted(entry["flat"][key], key=lambda w: float(w))
        for w in widths:
            label = "%sx%s" % (fmt_num(th), fmt_num(w))
            rows.append((th, w, label))
    return rows


def apply_cell(ws: Worksheet, row: int, col: int, value, *, font=None, fill=None,
               alignment=None, border=None, num_fmt=None, comment=None):
    cell = ws.cell(row=row, column=col, value=value)
    cell.protection = UNLOCKED
    if font is not None:
        cell.font = font
    if fill is not None:
        cell.fill = fill
    if alignment is not None:
        cell.alignment = alignment
    if border is not None:
        cell.border = border
    if num_fmt is not None:
        cell.number_format = num_fmt
    if comment is not None:
        cell.comment = comment
    return cell


def merge_fill(ws: Worksheet, r1: int, c1: int, r2: int, c2: int, fill, font=None, alignment=None):
    ws.merge_cells(start_row=r1, start_column=c1, end_row=r2, end_column=c2)
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(row=r, column=c)
            cell.fill = fill
            cell.protection = UNLOCKED
            if font is not None:
                cell.font = font
            if alignment is not None:
                cell.alignment = alignment
    return ws.cell(row=r1, column=c1)


def unlock_sheet(ws: Worksheet, max_row: int, max_col: int):
    for row in ws.iter_rows(min_row=1, max_row=max_row, min_col=1, max_col=max_col):
        for cell in row:
            cell.protection = UNLOCKED
    ws.protection.sheet = False
    ws.protection.enable = False
    ws.protection.autoFilter = True


def page_setup(ws: Worksheet, freeze: str = "A6"):
    ws.freeze_panes = freeze
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_setup.horizontalCentered = True
    ws.page_margins = PageMargins(left=0.4, right=0.4, top=0.55, bottom=0.5, header=0.25, footer=0.25)
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.print_options.horizontalCentered = True
    ws.oddHeader.left.text = "Jagetiya Metals — Product Price List"
    ws.oddFooter.left.text = "GST 24AGIPS3207M1Z7  |  Fully editable — no password"
    ws.oddFooter.right.text = "Page &P of &N"


def add_adjustment_box(ws: Worksheet):
    """Yellow daily-adjustment box on the RIGHT of every grade sheet (I3)."""
    merge_fill(ws, 1, 8, 1, 10, GOLD_FILL, Font(name="Calibri", size=11, bold=True, color=NAVY), CENTER)
    ws.cell(row=1, column=8).value = "DAILY ADJUSTMENT (Rs/kg)"

    merge_fill(ws, 2, 8, 2, 10, YELLOW_FILL, Font(name="Calibri", size=9, color=NAVY), CENTER)
    ws.cell(row=2, column=8).value = (
        "Enter 1 to add Rs 1 to every size. Enter -2 to reduce Rs 2. Leave 0 for no change."
    )
    ws.row_dimensions[2].height = 32

    apply_cell(ws, 3, 8, "Today's change", font=ADJ_LABEL_FONT, fill=YELLOW_FILL, alignment=RIGHT)
    apply_cell(
        ws, 3, 9, 0,
        font=ADJ_INPUT_FONT,
        fill=YELLOW_FILL,
        alignment=CENTER,
        border=THICK_GOLD,
        num_fmt="0.00",
        comment=Comment(
            "Type today's market move here (example: 1 or -2).\n"
            "Every Selling Price on this sheet = Base Price + this cell.\n"
            "Base prices do not change. The delta does not compound.",
            "Jagetiya Metals",
        ),
    )
    apply_cell(ws, 3, 10, "Rs/kg", font=ADJ_LABEL_FONT, fill=YELLOW_FILL, alignment=LEFT)

    merge_fill(ws, 4, 8, 4, 10, YELLOW_FILL, Font(name="Calibri", size=9, italic=True, color=NAVY), CENTER)
    ws.cell(row=4, column=8).value = (
        "Selling Price = Base Price + this box. Change 1 to 3 and all sizes use +3 (not compounding)."
    )
    ws.row_dimensions[3].height = 28
    ws.row_dimensions[4].height = 28

    for r in range(1, 5):
        for c in range(8, 11):
            ws.cell(row=r, column=c).border = THICK_GOLD
            ws.cell(row=r, column=c).protection = UNLOCKED
    # re-apply inner I3 thick gold so it stays the obvious input
    ws["I3"].border = THICK_GOLD
    ws["I3"].fill = YELLOW_FILL
    ws["I3"].font = ADJ_INPUT_FONT
    ws["I3"].number_format = "0.00"


def add_products_sheet(wb: Workbook, entries: list[dict]):
    ws = wb.active
    ws.title = PRODUCTS_SHEET
    ws.sheet_properties.tabColor = GOLD

    widths = {"A": 6, "B": 18, "C": 14, "D": 28, "E": 28, "F": 22, "G": 12, "H": 22, "I": 16, "J": 16}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    merge_fill(ws, 1, 1, 1, 7, NAVY_FILL, TITLE_FONT, Alignment(horizontal="left", vertical="center", indent=1))
    ws.cell(row=1, column=1).value = "Jagetiya Metals — Product Price List"
    ws.row_dimensions[1].height = 32

    merge_fill(ws, 2, 1, 2, 7, NAVY_FILL, COMPANY_FONT, Alignment(horizontal="left", vertical="center", indent=1))
    ws.cell(row=2, column=1).value = (
        "Jagetiya Metals  ·  +91-9824012344  ·  Kamlesh@jkmetal.in  ·  "
        "502/1-A G.I.D.C., Makarpura, Vadodara  ·  GST 24AGIPS3207M1Z7"
    )
    ws.row_dimensions[2].height = 20

    merge_fill(ws, 3, 1, 3, 7, GOLD_FILL, Font(name="Calibri", size=10, bold=True, color=NAVY), LEFT)
    ws.cell(row=3, column=1).value = (
        "Fully editable workbook — no sheet protection, no locked cells, no password. "
        "Share this file with anyone who needs to update rates."
    )
    ws.row_dimensions[3].height = 20

    instructions = [
        "How to use today's rates",
        "1. Open the grade sheet (click a sheet name in the table below, or the tabs at the bottom).",
        "2. Put today's daily change in the yellow Daily Adjustment box on the RIGHT of that sheet (cell I3).",
        "3. Every size's Selling Price updates automatically: Selling Price = Base Price + Daily Adjustment.",
        "4. Type 1 to add Rs 1/kg to every size. Type -2 to reduce Rs 2/kg. Leave 0 for no change.",
        "5. Edit Base Price anytime — that is the stored rate. Daily Adjustment never overwrites it, and does not compound.",
        "6. Each grade has its own box so different grades can move independently. The yellow box on this sheet is only a copy-from hint.",
    ]
    for i, line in enumerate(instructions):
        r = 5 + i
        merge_fill(
            ws, r, 1, r, 6,
            CREAM_FILL if i else GOLD_FILL,
            Font(name="Calibri", size=11, bold=(i == 0), color=NAVY),
            LEFT,
        )
        ws.cell(row=r, column=1).value = line
        ws.row_dimensions[r].height = 18 if i else 22

    # Optional master daily adjustment — NOT linked to grade sheets
    merge_fill(ws, 5, 8, 5, 10, GOLD_FILL, Font(name="Calibri", size=11, bold=True, color=NAVY), CENTER)
    ws.cell(row=5, column=8).value = "MASTER DAILY ADJUSTMENT (optional)"
    merge_fill(ws, 6, 8, 7, 10, YELLOW_FILL, Font(name="Calibri", size=9, color=NAVY), CENTER)
    ws.cell(row=6, column=8).value = (
        "Copy this number into each grade sheet's yellow I3 box only if the same change applies. "
        "Grade sheets do NOT share this cell — each grade can move on its own."
    )
    apply_cell(ws, 8, 8, "Copy-from value", font=ADJ_LABEL_FONT, fill=YELLOW_FILL, alignment=RIGHT, border=THICK_GOLD)
    apply_cell(ws, 8, 9, 0, font=ADJ_INPUT_FONT, fill=YELLOW_FILL, alignment=CENTER, border=THICK_GOLD, num_fmt="0.00")
    apply_cell(ws, 8, 10, "Rs/kg", font=ADJ_LABEL_FONT, fill=YELLOW_FILL, alignment=LEFT, border=THICK_GOLD)
    merge_fill(ws, 9, 8, 11, 10, CREAM_FILL, MUTED_FONT, CENTER)
    ws.cell(row=9, column=8).value = "This cell is a notepad only. It does not drive grade selling prices."
    for r in range(5, 9):
        for c in range(8, 11):
            ws.cell(row=r, column=c).border = THICK_GOLD
            ws.cell(row=r, column=c).protection = UNLOCKED

    header_row = 13
    headers = ["#", "Grade", "Shape", "Sub-type", "Make / notes", "Sheet name", "Size count", "Kind"]
    for c, h in enumerate(headers, 1):
        apply_cell(ws, header_row, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[header_row].height = 22
    ws.auto_filter.ref = "A%d:H%d" % (header_row, header_row + len(entries))
    ws.freeze_panes = "A14"

    for i, e in enumerate(entries, 1):
        r = header_row + i
        fill = WHITE_FILL if i % 2 else ALT_FILL
        kind = classify(e)
        kind_label = {"round": "Size list", "flat": "Flat (T×W)", "note": "Add sizes"}[kind]
        apply_cell(ws, r, 1, i, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, r, 2, e["grade"], font=Font(name="Calibri", size=11, bold=True, color=NAVY), fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 3, e["shape"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 4, e["subtype"], font=BODY_FONT, fill=fill, alignment=LEFT, border=THIN)
        apply_cell(ws, r, 5, e["make"] or ("Note-only — add sizes below" if kind == "note" else ""), font=MUTED_FONT, fill=fill, alignment=LEFT, border=THIN)
        link = apply_cell(ws, r, 6, e["sheet"], font=LINK_FONT, fill=fill, alignment=LEFT, border=THIN)
        link.hyperlink = "#%s!A1" % quote_sheet(e["sheet"])
        apply_cell(ws, r, 7, size_count(e), font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
        apply_cell(ws, r, 8, kind_label, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)

    last = header_row + len(entries)
    ws.auto_filter.ref = "A%d:H%d" % (header_row, last)
    note_r = last + 2
    merge_fill(ws, note_r, 1, note_r, 7, CREAM_FILL, MUTED_FONT, LEFT)
    ws.cell(row=note_r, column=1).value = (
        "Regenerate this file from the catalog:  python3 scripts/generate_metals_price_workbook.py"
    )
    page_setup(ws, freeze="A14")
    ws.print_title_rows = "1:13"
    unlock_sheet(ws, note_r + 2, 12)
    ws.protection.sheet = False


def add_grade_sheet(wb: Workbook, entry: dict, index: int, is_first: bool):
    name = entry["sheet"]
    ws = wb.create_sheet(title=name)
    ws.sheet_properties.tabColor = SHAPE_TAB.get(entry["shape"], NAVY)
    kind = classify(entry)

    # column widths
    if kind == "flat":
        widths = [16, 14, 14, 20, 14, 22, 36, 18, 14, 14]
        headers = [
            "Thickness (mm)", "Width (mm)", "Size",
            "Base Price (Rs/kg)", "Daily Adj", "Selling Price (Rs/kg)", "Notes",
        ]
        base_col = 4
        adj_col = 5
        sell_col = 6
        notes_col = 7
        last_table_col = 7
    else:
        widths = [16, 20, 14, 22, 40, 12, 12, 18, 14, 14]
        headers = [
            "Size (mm)", "Base Price (Rs/kg)", "Daily Adj", "Selling Price (Rs/kg)", "Notes",
        ]
        base_col = 2
        adj_col = 3
        sell_col = 4
        notes_col = 5
        last_table_col = 5
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

    # Header band
    merge_fill(ws, 1, 1, 1, last_table_col, NAVY_FILL, Font(name="Calibri", size=11, bold=True, color=GOLD), LEFT)
    ws.cell(row=1, column=1).value = "JAGETIYA METALS  ·  +91-9824012344  ·  Kamlesh@jkmetal.in  ·  GST 24AGIPS3207M1Z7"
    ws.row_dimensions[1].height = 20

    merge_fill(ws, 2, 1, 2, last_table_col, CREAM_FILL, GRADE_FONT, LEFT)
    ws.cell(row=2, column=1).value = entry["grade"]
    ws.row_dimensions[2].height = 28

    make = entry["make"] or ("Note-only grade — add sizes in the rows below" if kind == "note" else "—")
    merge_fill(ws, 3, 1, 3, last_table_col, CREAM_FILL, BODY_FONT, LEFT)
    ws.cell(row=3, column=1).value = "Shape: %s    ·    Sub-type: %s    ·    Make / notes: %s" % (
        entry["shape"], entry["subtype"], make,
    )

    back = apply_cell(
        ws, 4, 1,
        "← Back to Products index",
        font=LINK_FONT, fill=CREAM_FILL, alignment=LEFT,
    )
    back.hyperlink = "#%s!A1" % quote_sheet(PRODUCTS_SHEET)
    if kind == "note":
        merge_fill(ws, 4, 2, 4, last_table_col, PatternFill("solid", fgColor="FEF3CD"), EXAMPLE_FONT, LEFT)
        ws.cell(row=4, column=2).value = "Add sizes in the rows below. Type a size and a base price; Selling Price fills in from the yellow box."
    elif is_first:
        merge_fill(ws, 4, 2, 4, last_table_col, PatternFill("solid", fgColor="FEF3CD"), EXAMPLE_FONT, LEFT)
        ws.cell(row=4, column=2).value = (
            "Example: sizes 16 and 18 have sample base prices so you can test the yellow box. "
            "Put 1 in I3 — both selling prices rise by 1. Other grades start with blank bases."
        )
    else:
        merge_fill(ws, 4, 2, 4, last_table_col, CREAM_FILL, MUTED_FONT, LEFT)
        ws.cell(row=4, column=2).value = "Enter base prices in the yellow-header table. Selling Price follows cell I3."

    add_adjustment_box(ws)

    for c, h in enumerate(headers, 1):
        apply_cell(ws, HEADER_ROW, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[HEADER_ROW].height = 22

    adj_abs = ADJ_ABS
    rows_written = 0

    def write_price_row(r: int, size_vals: dict, example_base=None, note=""):
        fill = WHITE_FILL if (r - FIRST_DATA_ROW) % 2 == 0 else ALT_FILL
        if kind == "flat":
            apply_cell(ws, r, 1, size_vals["th"], font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
            apply_cell(ws, r, 2, size_vals["w"], font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
            apply_cell(ws, r, 3, size_vals["label"], font=Font(name="Calibri", size=11, bold=True, color=NAVY), fill=fill, alignment=CENTER, border=THIN)
        else:
            apply_cell(ws, r, 1, size_vals["size"], font=Font(name="Calibri", size=11, bold=True, color=NAVY), fill=fill, alignment=CENTER, border=THIN)

        base_ref = "%s%d" % (get_column_letter(base_col), r)
        apply_cell(
            ws, r, base_col, example_base,
            font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN,
            num_fmt="0.00",
        )
        apply_cell(
            ws, r, adj_col, "=%s" % adj_abs,
            font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN,
            num_fmt="0.00",
        )
        apply_cell(
            ws, r, sell_col, '=IF(%s="","",%s+%s)' % (base_ref, base_ref, adj_abs),
            font=SELL_FONT, fill=fill, alignment=CENTER, border=THIN,
            num_fmt="0.00",
        )
        apply_cell(ws, r, notes_col, note, font=EXAMPLE_FONT if note else MUTED_FONT, fill=fill, alignment=LEFT, border=THIN)

    if kind == "flat":
        for th, w, label in flat_rows(entry):
            r = FIRST_DATA_ROW + rows_written
            write_price_row(r, {"th": th if th != int(th) else int(th), "w": w if float(w) != int(float(w)) else int(float(w)), "label": label})
            rows_written += 1
    elif kind == "note":
        # Placeholder + extra blank template rows with formulas already in place
        r = FIRST_DATA_ROW
        write_price_row(r, {"size": ""}, note="Add sizes in the rows below")
        rows_written = 1
        for extra in range(7):
            r = FIRST_DATA_ROW + rows_written
            write_price_row(r, {"size": ""})
            rows_written += 1
    else:
        for sz in entry["sizes"]:
            r = FIRST_DATA_ROW + rows_written
            num = float(sz)
            display = int(num) if num == int(num) else num
            example = None
            note = ""
            if is_first and num in EXAMPLE_BASES:
                example = EXAMPLE_BASES[num]
                note = "Example — replace with live rate"
            write_price_row(r, {"size": display}, example_base=example, note=note)
            rows_written += 1

    last_row = FIRST_DATA_ROW + rows_written - 1
    ws.auto_filter.ref = "A%d:%s%d" % (HEADER_ROW, get_column_letter(last_table_col), last_row)
    page_setup(ws, freeze="A6")
    ws.print_title_rows = "1:5"
    last_col_letter = get_column_letter(last_table_col)
    ws.auto_filter.ref = "A%d:%s%d" % (HEADER_ROW, last_col_letter, last_row)

    # Sheet-local named range for the daily adjustment input
    defn = DefinedName(
        name="DailyAdj",
        attr_text="%s!$I$3" % quote_sheet(name),
        localSheetId=None,
    )
    # localSheetId assigned after sheet is in workbook
    defn.localSheetId = wb.sheetnames.index(name)
    wb.defined_names.add(defn)

    unlock_sheet(ws, max(last_row + 2, 8), 12)
    ws.protection.sheet = False
    entry["first_data_row"] = FIRST_DATA_ROW
    entry["last_data_row"] = last_row
    entry["base_col"] = base_col
    entry["kind"] = kind
    return ws


def build_workbook(entries: list[dict]) -> Workbook:
    used = {PRODUCTS_SHEET}
    for e in entries:
        e["sheet"] = unique_sheet_name(e["grade"], e["shape"], e["subtype"], used)

    wb = Workbook()
    wb.security.lockStructure = False
    wb.security.lockWindows = False
    wb.security.lockRevision = False
    wb.properties.title = "Jagetiya Metals — Product Price List"
    wb.properties.creator = "Jagetiya Metals"
    wb.properties.subject = "Editable steel price list by grade and size"
    wb.properties.description = (
        "Each grade sheet has a yellow Daily Adjustment (I3). "
        "Selling Price = Base Price + I3. No protection, no password."
    )
    wb.properties.company = "Jagetiya Metals"

    add_products_sheet(wb, entries)
    for i, e in enumerate(entries):
        add_grade_sheet(wb, e, i, is_first=(i == 0))

    # Ensure protection flags stay off after all sheets exist
    wb.security.lockStructure = False
    for ws in wb.worksheets:
        ws.protection.sheet = False
        ws.protection.enable = False
    return wb


def verify_workbook(path: Path, catalog_js: Path) -> dict:
    """Assert index, one sheet per catalog entry, formulas, unlocked, flats."""
    catalog = load_catalog(catalog_js)
    used = {PRODUCTS_SHEET}
    for e in catalog:
        e["sheet"] = unique_sheet_name(e["grade"], e["shape"], e["subtype"], used)

    wb = load_workbook(path)
    errors = []
    report = {
        "path": str(path),
        "sheets": wb.sheetnames[:],
        "grade_sheets": len(wb.sheetnames) - 1,
        "catalog_entries": len(catalog),
        "sample_formulas": {},
        "protected_sheets": [],
        "ok": True,
    }

    if PRODUCTS_SHEET not in wb.sheetnames:
        errors.append("Missing Products index sheet")
    if wb.sheetnames[0] != PRODUCTS_SHEET:
        errors.append("Products should be the first sheet, found %s" % wb.sheetnames[0])
    if len(wb.sheetnames) - 1 != len(catalog):
        errors.append(
            "Grade sheet count %d != catalog entries %d"
            % (len(wb.sheetnames) - 1, len(catalog))
        )

    sec = wb.security
    if getattr(sec, "lockStructure", False):
        errors.append("Workbook structure is locked")
    if getattr(sec, "workbookPassword", None):
        errors.append("Workbook password is set")
    if getattr(sec, "revisionsPassword", None):
        errors.append("Revisions password is set")

    expected_names = {e["sheet"] for e in catalog}
    actual_grades = set(wb.sheetnames) - {PRODUCTS_SHEET}
    missing = expected_names - actual_grades
    extra = actual_grades - expected_names
    if missing:
        errors.append("Missing sheets: %s" % sorted(missing)[:8])
    if extra:
        errors.append("Unexpected sheets: %s" % sorted(extra)[:8])

    adj_re = re.compile(r"=\$I\$3$", re.I)
    sell_re = re.compile(r'=IF\(([A-Z]+)(\d+)="","",\1\2\+\$I\$3\)$')

    first_grade = catalog[0]["sheet"]
    for e in catalog:
        name = e["sheet"]
        if name not in wb.sheetnames:
            continue
        ws = wb[name]
        if ws.protection.sheet:
            report["protected_sheets"].append(name)
            errors.append("Sheet protection enabled on %s" % name)

        adj = ws[ADJ_CELL]
        if adj.value not in (0, 0.0):
            errors.append("%s %s default is %r, expected 0" % (name, ADJ_CELL, adj.value))
        fmt = (adj.number_format or "").replace("\\", "")
        if "0.00" not in fmt and fmt not in ("0.00",):
            # still accept standard 0.00
            if adj.number_format != "0.00":
                errors.append("%s %s number format is %r" % (name, ADJ_CELL, adj.number_format))

        kind = classify(e)
        header = [ws.cell(HEADER_ROW, c).value for c in range(1, 8)]
        if kind == "flat":
            if header[0] != "Thickness (mm)" or header[1] != "Width (mm)":
                errors.append("%s missing thickness/width columns: %s" % (name, header[:3]))
            base_col, adj_col, sell_col = 4, 5, 6
            n_expect = size_count(e)
        else:
            if header[0] != "Size (mm)":
                errors.append("%s missing Size (mm) column: %s" % (name, header[0]))
            base_col, adj_col, sell_col = 2, 3, 4
            n_expect = size_count(e) if kind != "note" else 1  # at least placeholder

        data_rows = 0
        first_sell = None
        first_adj = None
        first_base = None
        r = FIRST_DATA_ROW
        while r <= (ws.max_row or FIRST_DATA_ROW):
            size_val = ws.cell(r, 1).value
            sell = ws.cell(r, sell_col).value
            adjf = ws.cell(r, adj_col).value
            if sell is None and adjf is None and size_val is None:
                break
            if sell is None:
                break
            data_rows += 1
            if first_sell is None:
                first_sell = sell
                first_adj = adjf
                first_base = ws.cell(r, base_col).value
            if not isinstance(adjf, str) or not adj_re.match(adjf.strip()):
                errors.append("%s row %d Daily Adj formula %r (want =$I$3)" % (name, r, adjf))
                break
            if not isinstance(sell, str) or not sell_re.match(sell.strip()):
                errors.append("%s row %d Selling formula %r" % (name, r, sell))
                break
            # locked flag should be false
            if ws.cell(r, sell_col).protection.locked:
                errors.append("%s row %d selling cell is locked" % (name, r))
                break
            r += 1

        if kind == "flat" and data_rows != n_expect:
            errors.append("%s flat size count %d != %d" % (name, data_rows, n_expect))
        elif kind == "round" and data_rows != n_expect:
            errors.append("%s size count %d != %d" % (name, data_rows, n_expect))
        elif kind == "note" and data_rows < 1:
            errors.append("%s note sheet has no placeholder row" % name)

        if name == first_grade:
            report["sample_formulas"] = {
                "sheet": name,
                "I3": adj.value,
                "daily_adj": first_adj,
                "selling_price": first_sell,
                "example_base_16mm": first_base,
                "conceptual_if_adj_1": (
                    None if first_base in (None, "") else float(first_base) + 1
                ),
            }
            if first_base not in EXAMPLE_BASES.values():
                errors.append("First grade sheet should include example base prices, got %r" % first_base)

    # Products hyperlinks
    p = wb[PRODUCTS_SHEET]
    if p.protection.sheet:
        errors.append("Products sheet is protected")
        report["protected_sheets"].append(PRODUCTS_SHEET)
    found_links = 0
    for row in p.iter_rows(min_row=14, max_row=14 + len(catalog), min_col=6, max_col=6):
        cell = row[0]
        if cell.hyperlink:
            found_links += 1
    if found_links != len(catalog):
        errors.append("Products hyperlinks %d != %d grades" % (found_links, len(catalog)))

    # Conceptual selling = base + adj (does not compound)
    sample = report["sample_formulas"]
    if sample.get("example_base_16mm") not in (None, ""):
        base = float(sample["example_base_16mm"])
        for adj_val in (1, 3, -2, 0):
            selling = base + adj_val
            # formula is B + $I$3, so changing I3 replaces previous delta
            if abs(selling - (base + adj_val)) > 1e-9:
                errors.append("conceptual selling mismatch")
        report["sample_formulas"]["conceptual_checks"] = {
            "base": base,
            "adj_1_selling": base + 1,
            "adj_3_selling": base + 3,
            "adj_minus2_selling": base - 2,
            "note": "Changing I3 from 1 to 3 yields base+3, not (base+1)+3",
        }

    report["errors"] = errors
    report["ok"] = not errors
    report["sheet_names"] = wb.sheetnames
    return report


def print_report(report: dict) -> None:
    print("Workbook:", report["path"])
    print("Catalog entries:", report["catalog_entries"])
    print("Grade sheets:", report["grade_sheets"])
    print("Total sheets (including Products):", len(report.get("sheet_names") or report["sheets"]))
    print("Sheet names:")
    for n in report.get("sheet_names") or report["sheets"]:
        print("  -", n)
    sf = report.get("sample_formulas") or {}
    if sf:
        print("Sample formulas (%s):" % sf.get("sheet"))
        for k, v in sf.items():
            if k != "sheet":
                print("  %s: %s" % (k, v))
    if report["errors"]:
        print("VERIFY FAILED:")
        for e in report["errors"]:
            print("  -", e)
    else:
        print("VERIFY OK — unprotected, one sheet per grade, I3 daily adj, Selling=Base+$I$3")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate Jagetiya Metals price workbook")
    parser.add_argument("--catalog", type=Path, default=CATALOG_JS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--verify", action="store_true", help="Generate then verify")
    parser.add_argument("--verify-only", action="store_true", help="Verify existing file only")
    parser.add_argument("--log", type=Path, default=None, help="Write JSON report to this path")
    args = parser.parse_args(argv)

    if not args.verify_only:
        entries = load_catalog(args.catalog)
        wb = build_workbook(entries)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        wb.save(args.output)
        print("Wrote %s (%d grade sheets)" % (args.output, len(entries)))

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
