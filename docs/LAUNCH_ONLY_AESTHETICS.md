# Only Aesthetics — Production launch checklist

Launch domain: **https://onlyaesthetics.in**

## 1. Vercel environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Neon PostgreSQL with pooling (`?sslmode=require`) |
| `SESSION_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://onlyaesthetics.in` |
| `COMMERCE_ADMIN_EMAIL` | Yes | Your admin login email |
| `COMMERCE_ADMIN_PASSWORD` | Yes | Strong password — required in production builds |
| `COMMERCE_ADMIN_REQUIRE_OTP` | Yes | `true` |
| `ALLOW_DEMO_OTP` | Yes | `false` |
| `RAZORPAY_KEY_ID` | Yes | Live keys (`rzp_live_…`) |
| `RAZORPAY_KEY_SECRET` | Yes | Live secret |
| `RESEND_API_KEY` | Yes | Signup OTP + order emails |
| `COMMERCE_FROM_EMAIL` | Yes | Verified sender on Resend |
| `BLOB_READ_WRITE_TOKEN` | Yes | Product image uploads in admin |
| `INDIA_ONLY_STOREFRONT` | Yes | `true` |
| `PURGE_DEMO_CATALOG` | Once | Set `true` for **one** deploy to wipe demo products, then remove |
| `SEED_DEMO_CATALOG` | No | Leave unset / `false` in production |

## 2. Domain (onlyaesthetics.in)

1. Add `onlyaesthetics.in` and `www.onlyaesthetics.in` in Vercel → Project → Domains.
2. Point DNS A/CNAME records per Vercel instructions.
3. Set primary domain to `onlyaesthetics.in`.

## 3. Database

- Use **Neon** (or Vercel Postgres) on the **Mumbai / ap-south** region if available for lower latency in India.
- Deploy runs `prisma db push` + bootstrap settings (no demo catalog).
- After first deploy with `PURGE_DEMO_CATALOG=true`, demo Unsplash products and `AES-DEMO-*` orders are removed.

## 4. Add real catalog (admin ↔ storefront)

1. Sign in at `/admin/login`.
2. Upload products at `/admin/products` (images → Vercel Blob).
3. Publish products (`PUBLISHED` + `APPROVED`).
4. Create collections at `/admin/collections`.
5. Storefront reads the same database — changes appear immediately.

## 5. Integrations status

| Integration | Status |
|-------------|--------|
| Razorpay (INR) | Required for checkout |
| Resend (email OTP + order confirmation) | Required for signup |
| Vercel Blob (media) | Required for admin uploads |
| MSG91 (SMS) | Optional — phone OTP logs in dev only |
| Shiprocket / Delhivery | Not wired — fulfil manually in admin |

## 6. Security

- Demo payment blocked in production.
- Demo catalog seed disabled unless `SEED_DEMO_CATALOG=true`.
- India-only geo block on `/aesthetics`, `/admin`, commerce APIs.
- Rate limits on login, register, and email OTP.
- Admin password required at deploy time.

## 7. Checkout flow

1. **Account** — Sign in, Sign up (email OTP), or Guest.
2. **Delivery** — Address (India PIN codes).
3. **Payment** — Razorpay only.

## 8. Post-launch verification

- [ ] `/aesthetics` loads with real products only
- [ ] Checkout completes with Razorpay test/live payment
- [ ] Order appears in `/admin/orders`
- [ ] Confirmation email received
- [ ] Non-India IP sees india-only page
- [ ] Mobile + desktop responsive pass
