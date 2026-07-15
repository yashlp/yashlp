# Only Aesthetics — Live Demo Guide

## Production URLs

| Area | URL |
|------|-----|
| **Storefront** | https://yashlp.vercel.app/aesthetics |
| **Shop** | https://yashlp.vercel.app/aesthetics/shop |
| **Collections** | https://yashlp.vercel.app/aesthetics/collections |
| **Admin login** | https://yashlp.vercel.app/admin/login |
| **Customers CRM** | https://yashlp.vercel.app/admin/customers |

Catalog seeding runs on deploy. **Demo user passwords are not re-applied in production.**

---

## Admin login

Set `COMMERCE_ADMIN_EMAIL` and `COMMERCE_ADMIN_PASSWORD` in Vercel Environment Variables.

Do **not** commit or publish passwords in docs, chat, or the storefront UI.

For local development only, you may set `SEED_DEMO_USERS=true` and `ALLOW_DEMO_PAYMENTS=true`.

---

## Customer ↔ admin connection

| Storefront action | Admin view |
|-------------------|------------|
| Register / login | **Customers** list + detail |
| Place order | **Orders** + **Payments** |
| Leave review (when enabled) | **Reviews** |
| Product stock / price | **Inventory** / **Products** — prices authority for checkout |

See [GO_LIVE_SECURITY.md](./GO_LIVE_SECURITY.md) before accepting real payments.
