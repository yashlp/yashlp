# Jagetiya Metals — Marketing site + Stock Search

Public marketing site (Nox Metals–style) plus the internal steel stock catalog for Jagetiya Metals (Vadodara). Search round, square, hex, and flat bars, set prices, and add/remove sizes. All custom catalog and price data is stored in the browser (`localStorage`) and survives refresh.

## Open / run

From the repo root:

```bash
npm run dev:fast
```

Then open:

- Marketing homepage: [http://localhost:3000/metals](http://localhost:3000/metals) (or `/metals/index.html`)
- Stock Search & Price Manager: [http://localhost:3000/metals/stock.html](http://localhost:3000/metals/stock.html)

You can also serve just this folder:

```bash
npx --yes serve public/metals
```

## Marketing homepage

`index.html` mirrors the Nox Metals site idea: hero, shop by grade / by shape with chemistry cards, stock-engine story, guides, and instant stock-check CTA. Product cards and shapes come from the same catalog as the stock tool (`js/catalog.js`). “Shop now” and the quote form deep-link into `stock.html` with `?shape=&grade=&size=` query params.

## Stock tool tabs

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

## Tests

```bash
npm run test:metals
npm run test:metals:e2e   # Chrome headless UI (system Chrome)
```
