# CivicLens

**CivicLens** is a global community intelligence platform that helps people understand, monitor, and improve the places around them.

> Every place has a story. CivicLens helps the community tell it.

## Features

- **Worldwide map** — free OpenStreetMap tiles + global place search (Nominatim)
- **Terms gate** — users must accept Terms & Conditions before using the app
- **Live incident map** with issues, positive signals, and resolved pins
- **Report flow** — 39 issue categories + 39 positive signals, duplicate detection
- **Community verification** — confirmations, comments, confidence scoring
- **Resolution workflow** — submit, verify, or dispute fixes
- **Community Health Score** — area scoring with confidence indicators
- **Ask AI** — natural-language questions about any place
- **Insights** — trends and area rankings
- **Compare Places** — side-by-side health score comparison

## Quick Start

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — accept Terms & Conditions on first visit.

### Demo sign-in (phone OTP)

- **Phone:** `919988776655` (or any number in dev)
- **OTP:** `123456` (demo mode; set `ALLOW_DEMO_OTP=true` on live demo)
- **Admin panel:** [/admin](http://localhost:3000/admin) — phone must be in `ADMIN_PHONES`

See **[DEPLOY.md](./DEPLOY.md)** for going live on Vercel + Neon.

## Design

- **Theme:** Orange & white — modern, friendly, accessible
- **Map:** [OpenStreetMap](https://www.openstreetmap.org/) (free, worldwide, no API key)
- **Geocoding:** [Nominatim](https://nominatim.org/) (free, worldwide search)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Map | Leaflet + OpenStreetMap |
| Geocoding | Nominatim (via `/api/geocode`) |
| Backend | Next.js API Routes |
| Database | SQLite + Prisma ORM |

## Jagetiya Metals

Stock search and price manager lives at [`/metals`](./public/metals/index.html) when the Next.js app is running (`npm run dev:fast` → [http://localhost:3000/metals](http://localhost:3000/metals)). Shared editable price workbook: [`public/metals/Jagetiya_Metals_Price_List.xlsx`](./public/metals/Jagetiya_Metals_Price_List.xlsx) (`python3 scripts/generate_metals_price_workbook.py`). See [`docs/JAGETIYA_METALS.md`](./docs/JAGETIYA_METALS.md).

## Documentation

Master product spec: [`CivicLens_Master_PRD.md`](./CivicLens_Master_PRD.md)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (fast, keeps cache) |
| `npm run dev:reset` | Clear `.next` and restart (fixes blank page) |
| `npm run build` | Production build |
| `npm run db:setup` | Push schema + seed global demo data |
