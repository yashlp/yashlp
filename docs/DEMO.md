# Only Aesthetics — Live Demo Guide

## Production URLs

| Area | URL |
|------|-----|
| **Storefront** | https://yashlp.vercel.app/aesthetics |
| **Shop** | https://yashlp.vercel.app/aesthetics/shop |
| **Collections** | https://yashlp.vercel.app/aesthetics/collections |
| **Admin login** | https://yashlp.vercel.app/admin/login |

Demo catalog is seeded automatically on every Vercel deploy (`prisma/seed-commerce.ts`).

---

## Admin login

| Field | Value |
|-------|-------|
| Email | `yash.shah.lp2@gmail.com` |
| Password | `Chester@2604` |

### Demo staff accounts (same password)

| Email | Role |
|-------|------|
| `inventory@onlyaesthetics.in` | Inventory Manager |
| `orders@onlyaesthetics.in` | Order Fulfillment |
| `support@onlyaesthetics.in` | Customer Support |
| `marketing@onlyaesthetics.in` | Marketing |

---

## Demo products (12 items)

| Product | Price | Test |
|---------|-------|------|
| Cloud Vessel | ₹2,899 | Featured, home |
| Midnight Taper Set | ₹799 | Gifts under ₹999 |
| Moss Journal | ₹499 | Desk Goals collection |
| Pearl Drop Earrings | ₹3,999 | Sale price, trending |
| Weighted Silk Eye Mask | ₹1,299 | Wellness |
| Arc Floor Lamp | ₹9,999 | High-ticket |
| Lavender Room Mist | ₹699 | Fragrance, new arrival |
| Brass Desk Tray | ₹1,499 | Stationery |
| Linen Throw Blanket | ₹2,499 | Cozy Corners |
| Silk Scrunchie Trio | ₹399 | **Low stock alert** (3 units) |
| Ceramic Pour-Over Set | ₹899 | Slow Mornings |
| Cobalt Table Vase | ₹1,799 | Blue Edit |

## Demo coupons

- `WELCOME10` — 10% off (min ₹499)
- `FLAT100` — ₹100 off (min ₹999)
- `FREESHIP` — free shipping

## Demo orders

- `AES-DEMO-DELIVERED` — returns workflow
- `AES-DEMO-CONFIRMED` — pack queue
- `AES-DEMO-PACKED` — ready to ship
- `AES-DEMO-SHIPPED` — in transit

---

## Walkthrough

### Storefront
1. Browse `/aesthetics` → shop → add to cart
2. Checkout with **COD** (always works)
3. Orders over ₹999 get free shipping

### Admin
1. Dashboard → quick start cards
2. Inventory → edit products, low stock on Scrunchie Trio
3. Purchases → PO-DEMO-001 (open), PO-DEMO-002 (received)
4. Orders → demo orders in each status
5. Returns → pending return on delivered order
6. Reviews → approve/hide pending reviews
7. Marketing → demo coupons
8. Staff → role-based team list

---

## Local setup

```bash
npm install
# Set DATABASE_URL in .env
npm run db:setup-commerce
npm run dev
```

Open http://localhost:3000/aesthetics and http://localhost:3000/admin/login
