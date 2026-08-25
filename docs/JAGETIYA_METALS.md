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
| Stock Manager | `2604` | Add/remove sizes and new grades |
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

## Tests

```bash
npm run test:metals
```
