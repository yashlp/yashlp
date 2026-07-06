# PlacePulse

**PlacePulse** is a community intelligence platform that helps people understand, monitor, and improve the places around them.

> Every place has a pulse. PlacePulse helps the community measure it.

## Features (MVP)

- **Live map** with incident pins (issues, positive signals, resolved)
- **Report flow** with GPS, 39 issue categories + 39 positive signals, duplicate detection
- **Community verification** — confirmations, comments, confidence scoring
- **Resolution workflow** — submit, verify, or dispute fixes
- **Community Health Score** — zoom-aware area scoring
- **Ask AI** — natural-language questions about any place
- **Insights** — 30-day trends and area rankings
- **Compare Places** — side-by-side health score comparison
- **User auth & reputation** — sign up, profile, reliability scoring

## Quick Start

```bash
# Install dependencies
npm install

# Set up database and seed demo data
npm run db:setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo account

- **Email:** demo@placepulse.app
- **Password:** demo1234

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Map | Leaflet + OpenStreetMap |
| Backend | Next.js API Routes |
| Database | SQLite + Prisma ORM |
| Auth | Cookie sessions + bcrypt |

## Project Structure

```
src/
├── app/                  # Pages and API routes
│   ├── api/              # REST endpoints
│   ├── report/           # Report flow
│   ├── insights/         # Trends & rankings
│   ├── compare/          # Place comparison
│   └── ask/              # Ask AI
├── components/           # UI components
└── lib/                  # Business logic
    ├── incident-service.ts
    ├── health-score.ts
    ├── ai.ts
    └── categories.ts
```

## Documentation

The master product specification lives in [`PlacePulse_Master_PRD.md`](./PlacePulse_Master_PRD.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:setup` | Push schema + seed data |
| `npm run db:seed` | Re-seed demo data |
