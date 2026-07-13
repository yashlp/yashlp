# Only Aesthetics — Live Demo Guide

## Preview URL (D2C branch)

**Storefront:** https://yashlp-git-cursor-d2c-admin-foundation-306c-yashlp1.vercel.app/aesthetics

**Admin:** https://yashlp-git-cursor-d2c-admin-foundation-306c-yashlp1.vercel.app/admin/login

> If you see a Vercel login screen, go to **Vercel → Project → Settings → Deployment Protection** and disable it for Preview deployments, then redeploy.

---

## Admin login

| Field | Value |
|-------|-------|
| Email | `yash.shah.lp2@gmail.com` |
| Password | `Chester@2604` |

Credentials are provisioned automatically on every Vercel deploy.

Required Vercel env var:
- `DATABASE_URL` — Neon PostgreSQL

Optional for online payments:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

---

## Demo walkthrough

### 1. Storefront (customer)
1. Open `/aesthetics` — browse homepage, collections, shop
2. Add products to cart → **Checkout**
3. Choose **COD** (always works) or **Razorpay** (if keys configured)
4. Order creates with GST + ₹49 shipping (free over ₹999)

### 2. Admin dashboard
- `/admin` — today's revenue, orders to pack, low stock, top products

### 3. Inventory & suppliers
- `/admin/inventory` — stock, cost, margin, reorder levels
- `/admin/suppliers` — brands you buy from
- `/admin/purchases/new` — create purchase order
- `/admin/purchases` — receive goods (updates stock)

### 4. Order fulfillment
- `/admin/orders` — filter by status
- Click order → **Mark packed** → **Ready to ship** → **Generate label** → **Mark shipped** → **Delivered**

### 5. Shipping
- `/admin/shipping` — batch ship with Shiprocket/Delhivery (demo labels when API keys not set)

### 6. Payments
- `/admin/payments` — COD, Razorpay, daily revenue

### 7. Returns
- `/admin/returns` — approve/reject return requests (demo return seeded)

### 8. Collections CMS
- `/admin/collections` — Blue Edit, Desk Goals, Gifts Under ₹999, etc.

### 9. Content & settings
- `/admin/content` — edit About, policies, FAQs
- `/admin/settings` — GST, shipping rates, company details

---

## Local setup

```bash
npm install
# Set DATABASE_URL in .env
npm run db:setup-commerce
COMMERCE_ADMIN_EMAIL="yash.shah.lp2@gmail.com" \
COMMERCE_ADMIN_PASSWORD="your-password" \
npm run db:ensure-commerce-admin
npm run dev
```

Open http://localhost:3000/aesthetics and http://localhost:3000/admin/login

---

## What's removed

- `/seller/*` — legacy marketplace portal redirects to `/aesthetics`
