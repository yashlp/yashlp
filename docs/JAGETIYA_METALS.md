# Jagetiya Metals — Nox-style storefront

Public site for Jagetiya Metals (Vadodara), modeled on the Nox Metals cut-to-size experience, using the warehouse catalog from the stock search tool (EN-8, EN-19/4140, EN-24, 20MnCr5, EN-353, EN-31, WPS D3, MS, stainless, brass, copper, aluminium).

## Open

```bash
npm run dev:fast
```

Then [http://localhost:3000/metals](http://localhost:3000/metals). `/metals/index.html` redirects here.

## What it includes

- Shop by grade or shape, with chemistry tiles
- Material spec pages and live warehouse size lists
- Instant quote sheet (weight + indicative ₹/kg, in-stock / nearest sizes)
- Enquiry POST `/api/metals/enquiry` (emails `kamlesh@jkmetal.in` when Resend is configured; always succeeds so phone/WhatsApp remain the fallback)
- Guides, about, contact

## Tests

```bash
npm run test:metals
```
