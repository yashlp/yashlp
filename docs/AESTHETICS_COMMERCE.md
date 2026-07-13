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

Platform admin login: `/admin/login`

Set credentials via environment variables (never commit passwords):

```bash
COMMERCE_ADMIN_EMAIL="yash.shah.lp2@gmail.com"
COMMERCE_ADMIN_PASSWORD="your-secure-password"
npm run db:ensure-commerce-admin
```

On Vercel, add `COMMERCE_ADMIN_EMAIL` and `COMMERCE_ADMIN_PASSWORD` to Environment Variables — the build runs `ensure-commerce-admin` automatically when the password is set.

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
