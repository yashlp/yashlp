# Aesthetics Commerce Architecture

Production-ready commerce management system. **No hardcoded catalog data** — everything flows from PostgreSQL via admin APIs.

## Stack

| Layer | Technology |
|-------|------------|
| Admin UI | Next.js (`/platform-admin`) |
| Storefront | Next.js (`/aesthetics`) |
| API | Next.js Route Handlers (`/api/commerce`, `/api/platform-admin`) |
| Database | PostgreSQL (Prisma ORM) |
| Auth | Email + password, OTP, RBAC, audit logs |

NestJS can be introduced as a separate `apps/api` service later; services in `src/lib/commerce/services/` are structured for extraction.

## Setup

```bash
npm run db:setup-commerce
```

Default admin: `admin@aesthetics.app` / `ChangeMe123!` (override via `COMMERCE_ADMIN_EMAIL` / `COMMERCE_ADMIN_PASSWORD`).

## Admin routes

- `/platform-admin/login` — secure login
- `/platform-admin` — dashboard (sales, orders, charts)
- `/platform-admin/products` — CRUD, approve, duplicate
- `/platform-admin/categories` — category management
- `/platform-admin/orders` — order management
- `/platform-admin/audit-logs` — admin action history

## Public API

- `GET /api/commerce/homepage`
- `GET /api/commerce/products`
- `GET /api/commerce/products/[slug]`
- `GET /api/commerce/categories`
- `GET /api/commerce/collections`

## Security

- Role-based permissions (`src/lib/commerce/rbac.ts`)
- Session cookies (httpOnly, 8h timeout)
- Login attempt logging + rate limiting
- Audit log on all mutating admin actions
- Product approval workflow before storefront visibility

## Database models

See `prisma/schema.prisma` — `Commerce*` models for admins, sellers, products, categories, orders, payments, refunds, reviews, coupons, content, settings.
