# Jagetiya Metals

Marketing site + stock tools for Jagetiya Metals (Vadodara), inspired by modern metals storefronts (shop-by-grade / shop-by-shape) and wired to the live Jagetiya catalog.

## Open / run

From the repo root:

```bash
npm run dev:fast
```

Then open:

- [http://localhost:3000/metals](http://localhost:3000/metals) — marketing site (`index.html`)
- [http://localhost:3000/metals/stock.html](http://localhost:3000/metals/stock.html) — stock search & price manager

Or serve just this folder:

```bash
npx --yes serve public/metals
```

## Marketing site

`public/metals/index.html` presents Jagetiya products in a Nox Metals–style layout:

- Full-bleed hero with brand-first typography
- **By grade** cards (EN-8, EN-19, EN-24, EN-31, 20MnCr5, WPS/D3, MS, SS 304) with chemistry from `catalog.js`
- **By shape** cards (Round, Square, Flat, Hex, Non-Ferrous, Forged/Bright)
- Cutting capacity / certified supply story
- Enquiry form → `mailto:Kamlesh@jkmetal.in`
- Deep links into stock search (`?grade=` / `?shape=`)

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
