# Only Aesthetics — Go-live security checklist

Customer storefront (`/aesthetics`) and admin (`/admin`) share one Postgres database and the same commerce Prisma models (customers, orders, payments, inventory, reviews). This document is what must be true before taking real payments.

## Required Vercel environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL pooled URL |
| `COMMERCE_ADMIN_EMAIL` | Platform admin email |
| `COMMERCE_ADMIN_PASSWORD` | Strong admin password (required in production) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Live Razorpay keys |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret |
| `SESSION_SECRET` | CivicLens signing (≥32 chars); rotate if ever committed |
| `BLOB_READ_WRITE_TOKEN` | Durable product media on Vercel |
| `ALLOW_DEMO_PAYMENTS` | Must be unset/`false` in production |
| `ALLOW_DEMO_OTP` | Must be unset/`false` in production |
| `SEED_DEMO_USERS` | Must be unset/`false` in production |
| `COMMERCE_ADMIN_REQUIRE_OTP` | Set `true` after OTP email/webhook delivery is ready |
| `COMMERCE_ADMIN_OTP_WEBHOOK` | Optional HTTPS endpoint to deliver admin OTP codes |

## Hardening shipped in this branch

- Server-side catalog pricing (client `unitPrice` ignored)
- Demo payment path disabled unless `ALLOW_DEMO_PAYMENTS=true`
- COD disabled; online payments only
- Razorpay verify binds `razorpayOrderId` to the commerce order payment metadata
- Razorpay webhook at `/api/commerce/payments/webhook`
- Timing-safe HMAC compares
- Admin lockout checked before password verify; OTPs stored hashed
- Rate limits on checkout, payments, and auth logins
- Middleware soft-gate for `/admin` and `/api/admin` (cookie presence)
- Demo credentials removed from storefront UI
- Deploy seed no longer resets admin/staff/customer demo passwords in production
- Admin Customers CRM over the same `CommerceCustomer` / order rows as the storefront

## Razorpay dashboard setup

1. Use **live** keys on Vercel Production.
2. Add webhook URL: `https://yashlp.vercel.app/api/commerce/payments/webhook`
3. Subscribe to `payment.captured`
4. Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`

## Smoke tests before announcing launch

1. Create a product in admin → appears on `/aesthetics/shop`
2. Place a real Razorpay test/live order → admin Orders + Payments update
3. Register a customer on storefront → appears under Admin → Customers
4. Change stock in admin → storefront cart/checkout reflects availability
5. Attempt checkout with a tampered low `unitPrice` → server total still uses catalog price
6. Without admin cookie → `/admin` redirects to login; `/api/admin/orders` returns 401

## Still recommended soon after launch

- Redis/Upstash rate limiting (in-memory limits reset per serverless instance)
- Wire Resend/MSG91 for admin MFA and customer phone OTP
- Origin checks on cookie-authenticated mutations
- Rotate any previously published demo passwords immediately
