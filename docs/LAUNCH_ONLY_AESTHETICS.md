# Only Aesthetics — Production launch checklist

Launch domain: **https://onlyaesthetics.in**  
Fallback until DNS: **https://yashlp.vercel.app/aesthetics**

---

## What Cursor already did (you do not need to redo)

- Storefront + admin commerce app built and on `main`
- Checkout security fixes merged (server-side prices, no password hash leaks, stock/shipping fixes)
- Production deploy from `main` is wired (`vercel-build` → DB push + admin bootstrap)
- India-only geo gate enabled for storefront/APIs
- Demo catalog seed off by default in production
- Admin OTP emails via Resend (when keys are set)
- Admin **Go-live** page at `/admin/launch` showing missing env

---

## What ONLY YOU can do (Cursor cannot)

These need your logins / bank / DNS registrar:

### A. Accounts & keys (30–60 min)

| # | You do | Paste into Vercel Production |
|---|--------|------------------------------|
| 1 | Create [Neon](https://neon.tech) Postgres (prefer Mumbai) | `DATABASE_URL` |
| 2 | Run `openssl rand -base64 32` | `SESSION_SECRET` |
| 3 | Choose admin email + strong password | `COMMERCE_ADMIN_EMAIL`, `COMMERCE_ADMIN_PASSWORD` |
| 4 | [Razorpay](https://razorpay.com) KYC + Live API keys | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| 5 | [Resend](https://resend.com) + verify `onlyaesthetics.in` | `RESEND_API_KEY`, `COMMERCE_FROM_EMAIL` |
| 6 | Vercel → Storage → Blob | `BLOB_READ_WRITE_TOKEN` |

Also set:

```text
NEXT_PUBLIC_SITE_URL=https://onlyaesthetics.in
COMMERCE_ADMIN_REQUIRE_OTP=true
ALLOW_DEMO_OTP=false
INDIA_ONLY_STOREFRONT=true
```

Do **not** set `ALLOW_DEMO_PAYMENT` or `SEED_DEMO_CATALOG` in production.

### B. Domain (critical — currently still WordPress)

`onlyaesthetics.in` still serves **WordPress/PHP**, not this app.

1. Vercel → Project → **Domains** → add `onlyaesthetics.in` + `www`
2. At your registrar, replace WordPress DNS with Vercel’s A/CNAME records
3. Wait until Vercel shows domain **Valid**

### C. Deploy

1. Vercel → **Deployments** → Redeploy **Production** (`main`)
2. If demo products remain: set `PURGE_DEMO_CATALOG=true` → Redeploy once → **delete** that var → Redeploy again

### D. Your catalog + first sale

1. Sign in at `/admin/login`
2. Open `/admin/launch` — all required rows should be green
3. Add products at `/admin/products` → publish
4. Set shipping under Settings
5. Place one Razorpay order from an **India** network

---

## Full env table

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Neon pooled `postgresql://…?sslmode=require` |
| `SESSION_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://onlyaesthetics.in` |
| `COMMERCE_ADMIN_EMAIL` | Yes | Admin login email |
| `COMMERCE_ADMIN_PASSWORD` | Yes | Strong password |
| `COMMERCE_ADMIN_REQUIRE_OTP` | Yes | `true` |
| `ALLOW_DEMO_OTP` | Yes | `false` |
| `RAZORPAY_KEY_ID` | Yes | Live `rzp_live_…` |
| `RAZORPAY_KEY_SECRET` | Yes | Live secret |
| `RESEND_API_KEY` | Yes | Signup OTP + order emails + admin OTP |
| `COMMERCE_FROM_EMAIL` | Yes | Verified sender on Resend |
| `BLOB_READ_WRITE_TOKEN` | Yes | Product image uploads |
| `INDIA_ONLY_STOREFRONT` | Yes | `true` |
| `PURGE_DEMO_CATALOG` | Once | `true` for one deploy only, then remove |
| `SEED_DEMO_CATALOG` | No | Leave unset / `false` |

---

## Post-launch checks

- [ ] `https://onlyaesthetics.in/aesthetics` shows **your** products (not WordPress)
- [ ] Email OTP signup works
- [ ] Razorpay payment completes
- [ ] Order in `/admin/orders`
- [ ] Confirmation email received
- [ ] Outside India → india-only page
