# Jagetiya Metals — Stock Search & Price Manager

Internal steel stock catalog for Jagetiya Metals (Vadodara). Search round, square, hex, and flat bars, set prices, and add/remove sizes. All custom catalog and price data is stored in the browser (`localStorage`) and survives refresh.

## Open / run

From the repo root:

```bash
npm run dev:fast
```

Then open [http://localhost:3000/metals](http://localhost:3000/metals) (or `/metals/index.html`).

You can also serve just this folder:

```bash
npx --yes serve public/metals
```

## Tabs

| Tab | PIN | What it does |
| --- | --- | --- |
| Search Stock | none | Shape + size/grade search, nearest sizes, live prices |
| Admin — Manage Prices | `1234` (changeable) | Per-size Rs/kg, CSV import/export |
| Stock Manager | `2604` | Add/remove sizes, add grades, and rename grade names |
| Chemical Composition | none | Grade chemistry; compare up to 3 grades |

Default PINs are product defaults from the original tool, not deployment secrets.

## Shape-specific sizes

- **Round / Hex:** one SIZE (mm) stored in `sz`
- **Square:** one SIDE (mm) stored in `sz` (same as round)
- **Flat:** THICKNESS + WIDTH stored in `flat` as `{ thickness: [widths...] }`
- **Non-Ferrous:** note-only by default; sizes optional when adding a grade

## Persistence keys

- Prices: `jk3_<grade>|<shape>|<subtype>|<size>`
- Custom catalog: `jk_catalog_v1` (also mirrored to `jkcust` / `jkcust_v2`)
- Admin PIN: `jkpin`

Custom catalog keys use `shape|grade|subtype` (not array indexes) so inserting a new grade cannot mis-apply sizes.

Grade names can be edited in Stock Manager → **Rename a Grade**. Blank names and duplicate identity (same shape + sub-type) are rejected.

On save, overlay maps (`added` / `removed` / `addedFlat` / `removedFlat` / `newGrades`) and `jk3_` price keys are re-keyed to the new name, including 1D sizes, flat `thicknessxwidth` keys, and note-only `N/A` prices. If a price already exists under the new name, that value is kept and the old key is dropped.

Built-in grades are not mutated in the catalog. Each rename is appended to a versioned `renamedGrades` array in `jk_catalog_v1` (`{sh,s,from,to,at}`). On load, custom grades are applied first, then renames in array order. If the destination name already exists, that rename is skipped so a refresh cannot duplicate a grade or apply the same rename twice.

## Shared price Excel

An editable workbook of every built-in grade and size lives at [`public/metals/Jagetiya_Metals_Price_List.xlsx`](../public/metals/Jagetiya_Metals_Price_List.xlsx). On the metals page, **Download Price Excel** uses the root-absolute path `/metals/Jagetiya_Metals_Price_List.xlsx` (so it still works when the URL is `/metals` without a trailing slash). If a Vercel preview asks you to log in, use **If that fails, download from GitHub**:

- Site: `/metals/Jagetiya_Metals_Price_List.xlsx`
- GitHub: [Jagetiya_Metals_Price_List.xlsx](https://github.com/yashlp/yashlp/raw/cursor/jagetiya-metals-price-excel-ecab/public/metals/Jagetiya_Metals_Price_List.xlsx)

Each grade has its own sheet. Type today's market move in the yellow **Daily Adjustment (Rs/kg)** box on the right (cell `I3`). Every **Selling Price** on that sheet is `Base Price + I3` — enter `1` to add Rs 1/kg to all sizes. Base prices are not overwritten and the delta does not compound. The file has no password and no sheet protection.

### How to add a size

Every grade sheet has a green **Add Size** box to the right of Daily Adjustment (frozen with the header).

1. Leave **Shape** on this sheet's shape, or pick another shape if the new size uses different dimensions. Changing shape only changes which fields apply on **this** sheet.
2. Fill the fields for that shape, then press **Enter**:
   - **Round / Hex / Non-Ferrous (1D):** `SIZE (mm)` only
   - **Square:** `THICKNESS` (treated as Side) and optional `WIDTH`. Blank width adds the single Side value. Both filled adds `TxW` (example `6x25`)
   - **Flat:** `THICKNESS` and `WIDTH` are required; the size key is `TxW` (example `6x25`)
3. The size appears in **this sheet's** list if it is new. Status shows **Added** or **Already added — skipped**.
4. Type a **Base Price** on the new row. Selling Price is still `Base + $I$3`.
5. Optional: type more keys in the **More sizes** slots (`25` or `6x25`, one per row).

Duplicates are skipped: `25` and `25.0` are the same; `6x25` and `6 x 25` are the same. Excel 365 and Google Sheets update the list with `UNIQUE` / `VSTACK` / `FILTER` (no VBA, no password).

Regenerate from the catalog (keeps sizes in sync with `public/metals/js/catalog.js`):

```bash
python3 scripts/generate_metals_price_workbook.py
python3 scripts/generate_metals_price_workbook.py --verify
```

Requires Python 3 and `openpyxl` (`pip install openpyxl`).

## Tests

```bash
npm run test:metals
npm run test:metals:e2e   # Chrome headless UI (system Chrome)
python3 tests/metals-price-workbook.test.py
```
