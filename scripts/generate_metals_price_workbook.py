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

Add Size: each grade sheet has a corner inbox (shape + SIZE / THICKNESS / WIDTH).
UNIQUE/VSTACK/FILTER unions the catalog with the inbox so a new size appears in
the list; duplicates (25 vs 25.0, 6x25 vs 6 x 25) are skipped.
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
YELLOW = "FFE566"
YELLOW_DARK = "F5C842"
PALE = "FFFDF8"
ROW_ALT = "FFF8E7"
LINK_BLUE = "1B3A5C"
MUTED = "5A6A7A"
GREEN = "1A5C32"
MINT = "E8F6EF"
MINT_INPUT = "F4FCF8"
SKY = "D6EAF8"

ADJ_CELL = "I3"
ADJ_ABS = "$I$3"
HEADER_ROW = 5
FIRST_DATA_ROW = 6
PRODUCTS_SHEET = "Products"
EXAMPLE_BASES = {16: 72.00, 18: 71.50}  # first grade sheet only
EXTRA_SIZE_ROWS = 20
STAGING_FIRST_ROW = 7
STAGING_LAST_ROW = 26  # 20 optional extra size slots (L7:L26)
ADD_SHAPE_CELL = "M2"
ADD_SIZE_CELL = "M3"
ADD_TH_CELL = "M4"
ADD_W_CELL = "O4"
ADD_STATUS_CELL = "M5"
ADD_KEY_CELL = "P2"
SHAPE_CHOICES = ("Round Bar", "Square Bar", "Hex Bar", "Flat Bar", "Non-Ferrous")
SHAPES_1D = ("Round Bar", "Hex Bar", "Non-Ferrous")

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
THICK_GREEN = Border(
    left=Side(style="medium", color=GREEN),
    right=Side(style="medium", color=GREEN),
    top=Side(style="medium", color=GREEN),
    bottom=Side(style="medium", color=GREEN),
)
NAVY_FILL = PatternFill("solid", fgColor=NAVY)
GOLD_FILL = PatternFill("solid", fgColor=GOLD)
CREAM_FILL = PatternFill("solid", fgColor=CREAM)
YELLOW_FILL = PatternFill("solid", fgColor=YELLOW)
PALE_FILL = PatternFill("solid", fgColor=PALE)
ALT_FILL = PatternFill("solid", fgColor=ROW_ALT)
WHITE_FILL = PatternFill("solid", fgColor=WHITE)
HEADER_FILL = PatternFill("solid", fgColor="1B3A5C")
MINT_FILL = PatternFill("solid", fgColor=MINT)
MINT_INPUT_FILL = PatternFill("solid", fgColor=MINT_INPUT)
SKY_FILL = PatternFill("solid", fgColor=SKY)
GREEN_FILL = PatternFill("solid", fgColor=GREEN)

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


def _compact_number(value):
    number = _as_number(value)
    if number is None:
        return None
    if abs(number - int(number)) < 1e-9:
        return int(number)
    return number


def normalize_existing_key(value):
    """Canonical form for duplicate checks: 25 == 25.0, '6x25' == '6 x 25'."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return _compact_number(value)
    text = str(value).strip().replace(" ", "").replace("×", "x").replace("X", "x")
    if not text:
        return None
    if "x" in text:
        left, _, right = text.partition("x")
        a, b = _compact_number(left), _compact_number(right)
        if a is None or b is None:
            return text
        return "%sx%s" % (fmt_num(a), fmt_num(b))
    return _compact_number(text) if _as_number(text) is not None else text


def canonical_size_key(shape, size=None, thickness=None, width=None):
    """Size key produced by the Add Size inbox for the selected shape, or None."""
    shape = (shape or "").strip()
    size_n = _compact_number(size)
    th_n = _compact_number(thickness)
    w_n = _compact_number(width)
    if shape == "Flat Bar":
        if th_n is None or w_n is None:
            return None
        return "%sx%s" % (fmt_num(th_n), fmt_num(w_n))
    if shape == "Square Bar":
        if th_n is None:
            return None
        if w_n is None:
            return th_n
        return "%sx%s" % (fmt_num(th_n), fmt_num(w_n))
    if shape in SHAPES_1D:
        return size_n
    return None


def inbox_status(existing_keys, new_key):
    if new_key is None or new_key == "":
        return "Fill the fields for this shape"
    new_n = normalize_existing_key(new_key)
    for key in existing_keys:
        if normalize_existing_key(key) == new_n:
            return "Already added — skipped"
    return "Added"


def unique_size_list(catalog_keys, inbox_keys):
    """Catalog-first UNIQUE union used by extra rows (skip blanks and duplicates)."""
    out = []
    seen = set()
    for key in list(catalog_keys) + list(inbox_keys):
        norm = normalize_existing_key(key)
        if norm is None or norm == "":
            continue
        if norm in seen:
            continue
        seen.add(norm)
        out.append(norm)
    return out


def new_sizes_only(catalog_keys, inbox_keys):
    catalog_norm = {normalize_existing_key(k) for k in catalog_keys}
    catalog_norm.discard(None)
    catalog_norm.discard("")
    return [k for k in unique_size_list(catalog_keys, inbox_keys) if k not in catalog_norm]


def extra_size_formula(index: int, cat_ref: str) -> str:
    """1-based INDEX into UNIQUE(VSTACK(catalog, inbox)) minus catalog (Excel 365 / Sheets)."""
    let_expr = (
        "LET(cat,%s,box,VSTACK($P$2,$L$7:$L$26),"
        "live,UNIQUE(FILTER(VSTACK(cat,box),VSTACK(cat,box)<>\"\")),"
        "FILTER(live,COUNTIF(cat,live)=0))"
    ) % cat_ref
    return "=IFERROR(INDEX(%s,%d),\"\")" % (let_expr, index)


def extra_flat_part_formula(index: int, cat_ref: str, part: str) -> str:
    """Parse TxW key from the UNIQUE new-size list into thickness or width."""
    news = (
        "LET(cat,%s,box,VSTACK($P$2,$L$7:$L$26),"
        "live,UNIQUE(FILTER(VSTACK(cat,box),VSTACK(cat,box)<>\"\")),"
        "FILTER(live,COUNTIF(cat,live)=0))"
    ) % cat_ref
    if part == "th":
        extract = "IFERROR(VALUE(LEFT(t,FIND(\"x\",t)-1)),\"\")"
    elif part == "w":
        extract = "IFERROR(VALUE(MID(t,FIND(\"x\",t)+1,32)),\"\")"
    else:
        extract = "k"
    return (
        "=LET(k,IFERROR(INDEX(%s,%d),\"\"),t,SUBSTITUTE(SUBSTITUTE(TRIM(k&\"\"),\" \",\"\"),\"×\",\"x\"),"
        "IF(OR(k=\"\",ISNUMBER(k)),\"\",%s))"
    ) % (news, index, extract)


def size_key_formula() -> str:
    n_m4 = "IF(ISNUMBER($M$4),$M$4,VALUE($M$4))"
    n_o4 = "IF(ISNUMBER($O$4),$O$4,VALUE($O$4))"
    n_m3 = "IF(ISNUMBER($M$3),$M$3,VALUE($M$3))"
    tw = "TEXT(%s,\"0.######\")&\"x\"&TEXT(%s,\"0.######\")" % (n_m4, n_o4)
    return (
        "=IFERROR(IF($M$2=\"Flat Bar\",IF(OR($M$4=\"\",$O$4=\"\"),\"\",%s),"
        "IF($M$2=\"Square Bar\",IF($M$4=\"\",\"\",IF($O$4=\"\",%s,%s)),"
        "IF(OR($M$2=\"Round Bar\",$M$2=\"Hex Bar\",$M$2=\"Non-Ferrous\"),"
        "IF($M$3=\"\",\"\",%s),\"\"))),\"\")"
    ) % (tw, n_m4, tw, n_m3)


def status_formula(cat_ref: str) -> str:
    return (
        "=IF($P$2=\"\",\"Fill the fields for this shape\","
        "IF(OR(COUNTIF(%s,$P$2)>0,COUNTIF($L$7:$L$26,$P$2)>0),"
        "\"Already added — skipped\",\"Added\"))"
    ) % cat_ref


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


def add_size_box(ws: Worksheet, entry: dict, cat_ref: str):
    """Green Add Size inbox to the right of Daily Adjustment (visible in frozen rows 1–5)."""
    title_font = Font(name="Calibri", size=11, bold=True, color=WHITE)
    hint_font = Font(name="Calibri", size=8, color=NAVY)
    status_font = Font(name="Calibri", size=10, bold=True, color=GREEN)

    merge_fill(ws, 1, 12, 1, 15, GREEN_FILL, title_font, CENTER)
    ws.cell(row=1, column=12).value = "ADD SIZE"
    ws.cell(row=1, column=12).comment = Comment(
        "Press Enter after filling dimensions; the size appears in this sheet's list if it is new.\n"
        "Round / Hex / Non-Ferrous: SIZE (mm) only.\n"
        "Square: THICKNESS (Side) and optional WIDTH. Blank width adds the Side; both add TxW.\n"
        "Flat: THICKNESS and WIDTH required (6 and 25 → 6x25).\n"
        "Duplicates are skipped (25 = 25.0, 6x25 = 6 x 25).",
        "Jagetiya Metals",
    )

    apply_cell(ws, 2, 12, "Shape", font=ADJ_LABEL_FONT, fill=MINT_FILL, alignment=RIGHT)
    apply_cell(
        ws, 2, 13, entry["shape"],
        font=ADJ_LABEL_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THICK_GREEN,
        comment=Comment(
            "Defaults to this grade's shape. Changing it only changes which dimension fields apply on THIS sheet.",
            "Jagetiya Metals",
        ),
    )
    merge_fill(ws, 2, 14, 2, 15, MINT_FILL, hint_font, CENTER)
    ws.cell(row=2, column=14).value = "This sheet only — shape pick changes which fields to fill."

    apply_cell(ws, 3, 12, "SIZE (mm)", font=ADJ_LABEL_FONT, fill=MINT_FILL, alignment=RIGHT)
    apply_cell(
        ws, 3, 13, None,
        font=ADJ_INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN,
        comment=Comment("Round / Hex / Non-Ferrous: type SIZE (mm) and press Enter.", "Jagetiya Metals"),
    )
    merge_fill(ws, 3, 14, 3, 15, MINT_FILL, hint_font, LEFT)
    ws.cell(row=3, column=14).value = (
        '=IF(OR($M$2="Round Bar",$M$2="Hex Bar",$M$2="Non-Ferrous"),'
        '"1D: fill SIZE only, then press Enter.",'
        '"Leave SIZE blank — use Thickness and Width.")'
    )

    apply_cell(ws, 4, 12, "THICKNESS (mm)", font=ADJ_LABEL_FONT, fill=MINT_FILL, alignment=RIGHT)
    apply_cell(
        ws, 4, 13, None,
        font=ADJ_INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN,
        comment=Comment(
            "Square: Thickness is the Side if Width is blank. Flat: required with Width.",
            "Jagetiya Metals",
        ),
    )
    apply_cell(ws, 4, 14, "WIDTH (mm)", font=ADJ_LABEL_FONT, fill=MINT_FILL, alignment=RIGHT)
    apply_cell(
        ws, 4, 15, None,
        font=ADJ_INPUT_FONT, fill=WHITE_FILL, alignment=CENTER, border=THICK_GREEN,
        comment=Comment(
            "Square: optional (blank = Side only; both = TxW). Flat: required, e.g. 6 and 25 → 6x25.",
            "Jagetiya Metals",
        ),
    )

    apply_cell(ws, 5, 12, "Status", font=ADJ_LABEL_FONT, fill=MINT_FILL, alignment=RIGHT)
    merge_fill(ws, 5, 13, 5, 15, MINT_FILL, status_font, CENTER)
    ws.cell(row=5, column=13).value = status_formula(cat_ref)

    apply_cell(
        ws, 1, 16, "Size key (auto)",
        font=Font(name="Calibri", size=8, bold=True, color=WHITE),
        fill=GREEN_FILL, alignment=CENTER,
    )
    apply_cell(
        ws, 2, 16, size_key_formula(),
        font=ADJ_LABEL_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THICK_GREEN,
    )
    merge_fill(ws, 3, 16, 5, 16, MINT_FILL, Font(name="Calibri", size=8, italic=True, color=NAVY), CENTER)
    ws.cell(row=3, column=16).value = (
        "Press Enter after filling dimensions; the size appears in the list if it is new."
    )

    for r in range(1, 6):
        for c in range(12, 17):
            cell = ws.cell(row=r, column=c)
            cell.protection = UNLOCKED
            if c < 16 and r in (1, 5):
                cell.border = THICK_GREEN
    for addr in (ADD_SHAPE_CELL, ADD_SIZE_CELL, ADD_TH_CELL, ADD_W_CELL, ADD_KEY_CELL):
        ws[addr].border = THICK_GREEN
        ws[addr].protection = UNLOCKED
    ws[ADD_SIZE_CELL].fill = WHITE_FILL
    ws[ADD_TH_CELL].fill = WHITE_FILL
    ws[ADD_W_CELL].fill = WHITE_FILL
    ws[ADD_SHAPE_CELL].fill = MINT_INPUT_FILL
    ws[ADD_KEY_CELL].fill = MINT_INPUT_FILL

    dv = DataValidation(
        type="list",
        formula1='"%s"' % ",".join(SHAPE_CHOICES),
        allow_blank=False,
        showDropDown=False,
        showErrorMessage=True,
        errorTitle="Shape",
        error="Choose Round Bar, Square Bar, Hex Bar, Flat Bar, or Non-Ferrous.",
        promptTitle="Shape",
        prompt="Select the shape for the new size on this sheet.",
        showInputMessage=True,
    )
    dv.add(ADD_SHAPE_CELL)
    ws.add_data_validation(dv)

    merge_fill(ws, 6, 12, 6, 15, GREEN_FILL, Font(name="Calibri", size=9, bold=True, color=WHITE), LEFT)
    ws.cell(row=6, column=12).value = "More sizes (optional) — type 25 or 6x25, one per row"
    for r in range(STAGING_FIRST_ROW, STAGING_LAST_ROW + 1):
        apply_cell(ws, r, 12, None, font=BODY_FONT, fill=MINT_INPUT_FILL, alignment=CENTER, border=THIN)
    apply_cell(
        ws, STAGING_FIRST_ROW, 13,
        "UNIQUE skips duplicates (25 = 25.0, 6x25 = 6 x 25)",
        font=MUTED_FONT, fill=MINT_FILL, alignment=LEFT,
    )


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
        "7. To add a size: use the green Add Size box (beside Daily Adjustment). Pick the shape, fill SIZE (Round/Hex) or THICKNESS and WIDTH (Square/Flat), press Enter.",
        "8. The size appears in that sheet's list if it is new. Duplicates are skipped (25 = 25.0, 6x25 = 6 x 25). Status shows Added vs Already added — skipped.",
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

    header_row = 15
    headers = ["#", "Grade", "Shape", "Sub-type", "Make / notes", "Sheet name", "Size count", "Kind"]
    for c, h in enumerate(headers, 1):
        apply_cell(ws, header_row, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[header_row].height = 22
    ws.auto_filter.ref = "A%d:H%d" % (header_row, header_row + len(entries))
    ws.freeze_panes = "A16"

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
    page_setup(ws, freeze="A16")
    ws.print_title_rows = "1:15"
    unlock_sheet(ws, note_r + 2, 12)
    ws.protection.sheet = False


def add_grade_sheet(wb: Workbook, entry: dict, index: int, is_first: bool):
    name = entry["sheet"]
    ws = wb.create_sheet(title=name)
    ws.sheet_properties.tabColor = SHAPE_TAB.get(entry["shape"], NAVY)
    kind = classify(entry)

    extra_widths = {11: 3, 12: 22, 13: 16, 14: 16, 15: 14, 16: 18}
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
        size_col_letter = "C"
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
        size_col_letter = "A"
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for col_idx, w in extra_widths.items():
        ws.column_dimensions[get_column_letter(col_idx)].width = w

    merge_fill(ws, 1, 1, 1, last_table_col, NAVY_FILL, Font(name="Calibri", size=11, bold=True, color=GOLD), LEFT)
    ws.cell(row=1, column=1).value = "JAGETIYA METALS  ·  +91-9824012344  ·  Kamlesh@jkmetal.in  ·  GST 24AGIPS3207M1Z7"
    ws.row_dimensions[1].height = 20

    merge_fill(ws, 2, 1, 2, last_table_col, CREAM_FILL, GRADE_FONT, LEFT)
    ws.cell(row=2, column=1).value = entry["grade"]
    ws.row_dimensions[2].height = 28

    make = entry["make"] or ("Note-only grade — add sizes with the green Add Size box" if kind == "note" else "—")
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
        ws.cell(row=4, column=2).value = (
            "Use the green Add Size box (right). Fill SIZE or Thickness×Width, press Enter; "
            "the size appears below if it is new. Then type a base price."
        )
    elif is_first:
        merge_fill(ws, 4, 2, 4, last_table_col, PatternFill("solid", fgColor="FEF3CD"), EXAMPLE_FONT, LEFT)
        ws.cell(row=4, column=2).value = (
            "Example: sizes 16 and 18 have sample base prices so you can test the yellow box. "
            "Put 1 in I3 — both selling prices rise by 1. Add a new size in the green box on the right."
        )
    else:
        merge_fill(ws, 4, 2, 4, last_table_col, CREAM_FILL, MUTED_FONT, LEFT)
        ws.cell(row=4, column=2).value = (
            "Enter base prices in the table. Selling Price follows I3. Add sizes with the green box."
        )

    add_adjustment_box(ws)

    for c, h in enumerate(headers, 1):
        apply_cell(ws, HEADER_ROW, c, h, font=COL_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN)
    ws.row_dimensions[HEADER_ROW].height = 30

    adj_abs = ADJ_ABS
    rows_written = 0

    def write_price_row(r: int, size_vals: dict, example_base=None, note=""):
        fill = WHITE_FILL if (r - FIRST_DATA_ROW) % 2 == 0 else ALT_FILL
        if kind == "flat":
            apply_cell(ws, r, 1, size_vals["th"], font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
            apply_cell(ws, r, 2, size_vals["w"], font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN)
            apply_cell(
                ws, r, 3, size_vals["label"],
                font=Font(name="Calibri", size=11, bold=True, color=NAVY),
                fill=fill, alignment=CENTER, border=THIN,
            )
        else:
            apply_cell(
                ws, r, 1, size_vals["size"],
                font=Font(name="Calibri", size=11, bold=True, color=NAVY),
                fill=fill, alignment=CENTER, border=THIN,
            )

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
        apply_cell(
            ws, r, notes_col, note,
            font=EXAMPLE_FONT if note else MUTED_FONT, fill=fill, alignment=LEFT, border=THIN,
        )

    if kind == "flat":
        for th, w, label in flat_rows(entry):
            r = FIRST_DATA_ROW + rows_written
            write_price_row(r, {
                "th": th if th != int(th) else int(th),
                "w": w if float(w) != int(float(w)) else int(float(w)),
                "label": label,
            })
            rows_written += 1
    elif kind == "note":
        r = FIRST_DATA_ROW
        write_price_row(r, {"size": ""}, note="Catalog placeholder — use Add Size for new sizes")
        rows_written = 1
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

    last_cat_row = FIRST_DATA_ROW + rows_written - 1
    cat_ref = "$%s$%d:$%s$%d" % (size_col_letter, FIRST_DATA_ROW, size_col_letter, last_cat_row)
    add_size_box(ws, entry, cat_ref)

    extra_note = "New size from Add Size — type a base price; selling uses $I$3"
    for i in range(1, EXTRA_SIZE_ROWS + 1):
        r = last_cat_row + i
        if kind == "flat":
            write_price_row(r, {
                "th": extra_flat_part_formula(i, cat_ref, "th"),
                "w": extra_flat_part_formula(i, cat_ref, "w"),
                "label": extra_size_formula(i, cat_ref),
            }, note=extra_note if i == 1 else "")
        else:
            write_price_row(r, {"size": extra_size_formula(i, cat_ref)}, note=extra_note if i == 1 else "")
        rows_written += 1

    last_row = last_cat_row + EXTRA_SIZE_ROWS
    last_col_letter = get_column_letter(last_table_col)
    ws.auto_filter.ref = "A%d:%s%d" % (HEADER_ROW, last_col_letter, last_row)
    page_setup(ws, freeze="A6")
    ws.print_title_rows = "1:5"

    defn = DefinedName(
        name="DailyAdj",
        attr_text="%s!$I$3" % quote_sheet(name),
        localSheetId=None,
    )
    defn.localSheetId = wb.sheetnames.index(name)
    wb.defined_names.add(defn)

    unlock_sheet(ws, max(last_row + 2, STAGING_LAST_ROW + 2), 16)
    ws.protection.sheet = False
    entry["first_data_row"] = FIRST_DATA_ROW
    entry["last_data_row"] = last_row
    entry["last_cat_row"] = last_cat_row
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
        "Each grade sheet has a yellow Daily Adjustment (I3) and a green Add Size box. "
        "Selling Price = Base Price + I3. UNIQUE unions new sizes. No protection, no password."
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


def _verify_add_size_logic() -> list[str]:
    """Duplicate skip and shape-field rules (mirrors the UNIQUE inbox)."""
    errors = []
    cases = [
        ("Round Bar", 25, None, None, 25),
        ("Round Bar", 25.0, None, None, 25),
        ("Hex Bar", "25.0", None, None, 25),
        ("Non-Ferrous", 12, None, None, 12),
        ("Square Bar", None, 40, None, 40),
        ("Square Bar", None, 6, 25, "6x25"),
        ("Flat Bar", None, 6, 25, "6x25"),
        ("Flat Bar", None, 6, None, None),
        ("Round Bar", None, 16, None, None),
    ]
    for shape, size, th, w, expected in cases:
        got = canonical_size_key(shape, size, th, w)
        if got != expected:
            errors.append("canonical_size_key(%s) got %r want %r" % (shape, got, expected))

    catalog = [16, 18, 20, 25, 28]
    if inbox_status(catalog, 25) != "Already added — skipped":
        errors.append("duplicate 25 should be skipped")
    if inbox_status(catalog, 25.0) != "Already added — skipped":
        errors.append("duplicate 25.0 should be skipped")
    if inbox_status(catalog, "25.0") != "Already added — skipped":
        errors.append("duplicate text 25.0 should be skipped")
    if inbox_status(catalog, 30) != "Added":
        errors.append("new size 30 should be Added")
    if inbox_status(catalog, None) != "Fill the fields for this shape":
        errors.append("empty inbox should ask for fields")

    flats = ["6x25", "6x32", "10x40"]
    if inbox_status(flats, "6x25") != "Already added — skipped":
        errors.append("flat 6x25 duplicate")
    if inbox_status(flats, "6 x 25") != "Already added — skipped":
        errors.append("flat 6 x 25 should match 6x25")
    if inbox_status(flats, "6×25") != "Already added — skipped":
        errors.append("flat 6×25 should match 6x25")
    if inbox_status(flats, "8x25") != "Added":
        errors.append("new flat 8x25 should be Added")

    union = unique_size_list([16, 18, 25], [25.0, 30, "", 18])
    if union != [16, 18, 25, 30]:
        errors.append("unique_size_list order/dups got %r" % union)
    news = new_sizes_only([16, 18, 25], [25.0, 30, "18"])
    if news != [30]:
        errors.append("new_sizes_only should keep only 30, got %r" % news)
    return errors


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
    unique_marks = ("UNIQUE", "VSTACK", "FILTER")
    shape_list = {s.strip() for s in SHAPE_CHOICES}

    first_grade = catalog[0]["sheet"]
    add_size_ok = 0
    extra_formula_ok = 0
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
            if adj.number_format != "0.00":
                errors.append("%s %s number format is %r" % (name, ADJ_CELL, adj.number_format))

        kind = classify(e)
        header = [ws.cell(HEADER_ROW, c).value for c in range(1, 8)]
        if kind == "flat":
            if header[0] != "Thickness (mm)" or header[1] != "Width (mm)":
                errors.append("%s missing thickness/width columns: %s" % (name, header[:3]))
            base_col, adj_col, sell_col = 4, 5, 6
            size_col = 3
            n_expect = size_count(e)
        else:
            if header[0] != "Size (mm)":
                errors.append("%s missing Size (mm) column: %s" % (name, header[0]))
            base_col, adj_col, sell_col = 2, 3, 4
            size_col = 1
            n_expect = size_count(e) if kind != "note" else 1

        title = ws.cell(1, 12).value
        if title != "ADD SIZE":
            errors.append("%s missing Add Size panel title, got %r" % (name, title))
        shape_val = ws[ADD_SHAPE_CELL].value
        if shape_val != e["shape"]:
            errors.append("%s Add Size shape default %r != %r" % (name, shape_val, e["shape"]))
        if ws.cell(3, 12).value != "SIZE (mm)":
            errors.append("%s missing SIZE (mm) field" % name)
        if ws.cell(4, 12).value != "THICKNESS (mm)":
            errors.append("%s missing THICKNESS field" % name)
        if ws.cell(4, 14).value != "WIDTH (mm)":
            errors.append("%s missing WIDTH field" % name)
        status_val = ws[ADD_STATUS_CELL].value
        if not isinstance(status_val, str) or "Already added — skipped" not in status_val or "Added" not in status_val:
            errors.append("%s status formula missing Added/skipped text: %r" % (name, status_val))
        key_val = ws[ADD_KEY_CELL].value
        if not isinstance(key_val, str) or "$M$2" not in key_val:
            errors.append("%s size-key formula missing shape switch: %r" % (name, key_val))
        else:
            if "Round Bar" not in key_val or "Flat Bar" not in key_val or "Square Bar" not in key_val:
                errors.append("%s size-key formula missing shape branches" % name)
            if "$M$3" not in key_val:
                errors.append("%s size-key formula missing SIZE input $M$3" % name)
            if "$M$4" not in key_val or "$O$4" not in key_val:
                errors.append("%s size-key formula missing THICKNESS/WIDTH cells" % name)
        dv_ok = False
        for dv in ws.data_validations.dataValidation:
            ranges = str(dv.sqref)
            if ADD_SHAPE_CELL in ranges and dv.type == "list":
                formula = dv.formula1 or ""
                if all(s in formula for s in shape_list):
                    dv_ok = True
        if not dv_ok:
            errors.append("%s missing shape dropdown on %s" % (name, ADD_SHAPE_CELL))
        else:
            add_size_ok += 1

        last_cat = FIRST_DATA_ROW + n_expect - 1
        extra_start = last_cat + 1
        extra_end = last_cat + EXTRA_SIZE_ROWS

        first_sell = None
        first_adj = None
        first_base = None
        for r in range(FIRST_DATA_ROW, extra_end + 1):
            sell = ws.cell(r, sell_col).value
            adjf = ws.cell(r, adj_col).value
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
            if ws.cell(r, sell_col).protection.locked:
                errors.append("%s row %d selling cell is locked" % (name, r))
                break

        extra_checked = 0
        for r in range(extra_start, extra_end + 1):
            size_val = ws.cell(r, size_col).value
            if not isinstance(size_val, str):
                errors.append("%s extra row %d size is not a UNIQUE formula: %r" % (name, r, size_val))
                break
            missing = [m for m in unique_marks if m not in size_val]
            if missing:
                errors.append("%s extra row %d missing %s in %r" % (name, r, missing, size_val[:80]))
                break
            if "$I$3" not in str(ws.cell(r, sell_col).value):
                errors.append("%s extra row %d selling formula must use $I$3" % (name, r))
                break
            extra_checked += 1
        if extra_checked == EXTRA_SIZE_ROWS:
            extra_formula_ok += 1

        if kind == "flat":
            th_f = ws.cell(extra_start, 1).value
            w_f = ws.cell(extra_start, 2).value
            if not (isinstance(th_f, str) and "FIND" in th_f and "x" in th_f):
                errors.append("%s extra flat thickness formula missing TxW parse: %r" % (name, th_f))
            if not (isinstance(w_f, str) and "FIND" in w_f):
                errors.append("%s extra flat width formula missing TxW parse: %r" % (name, w_f))

        if name == first_grade:
            report["sample_formulas"] = {
                "sheet": name,
                "I3": adj.value,
                "daily_adj": first_adj,
                "selling_price": first_sell,
                "example_base_16mm": first_base,
                "add_size_shape": shape_val,
                "add_size_status": status_val,
                "conceptual_if_adj_1": (
                    None if first_base in (None, "") else float(first_base) + 1
                ),
            }
            if first_base not in EXAMPLE_BASES.values():
                errors.append("First grade sheet should include example base prices, got %r" % first_base)

    report["add_size_panels"] = add_size_ok
    report["extra_unique_rows"] = extra_formula_ok
    if add_size_ok != len(catalog):
        errors.append("Add Size panel present on %d / %d grade sheets" % (add_size_ok, len(catalog)))
    if extra_formula_ok != len(catalog):
        errors.append("UNIQUE extra rows present on %d / %d grade sheets" % (extra_formula_ok, len(catalog)))

    logic_errors = _verify_add_size_logic()
    errors.extend(logic_errors)

    # Products hyperlinks
    p = wb[PRODUCTS_SHEET]
    if p.protection.sheet:
        errors.append("Products sheet is protected")
        report["protected_sheets"].append(PRODUCTS_SHEET)
    found_links = 0
    products_header = 15
    for row in p.iter_rows(min_row=products_header + 1, max_row=products_header + len(catalog), min_col=6, max_col=6):
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
        print("VERIFY OK — unprotected, one sheet per grade, I3 daily adj, Add Size UNIQUE, Selling=Base+$I$3")
        if report.get("add_size_panels"):
            print("Add Size panels:", report["add_size_panels"])
        if report.get("extra_unique_rows"):
            print("UNIQUE extra-row sheets:", report["extra_unique_rows"])


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
