# Only Aesthetics — Production launch checklist

Launch domain: **https://onlyaesthetics.in**

> **Important:** Use a **separate Vercel project** named `only-aesthetics`.  
> Do **not** add these variables to the CivicLens / `yashlp` project.  
> Step-by-step: [VERCEL_ONLY_AESTHETICS_PROJECT.md](./VERCEL_ONLY_AESTHETICS_PROJECT.md)

---

## What Cursor already did (you do not need to redo)

- Storefront + admin commerce app built and on `main`
- Checkout security fixes merged
- Production deploy from `main` is wired (`vercel-build` → DB push + admin bootstrap)
- India-only geo gate for storefront/APIs
- Demo catalog seed off by default in production
- Admin OTP emails via Resend (when keys are set)
- Admin **Go-live** page at `/admin/launch`
- `PRODUCT_SURFACE=aesthetics` mode redirects `/` → store and blocks CivicLens routes

---

## What ONLY YOU can do (Cursor cannot)

### 0. Create Vercel project `only-aesthetics` (required)

1. Open [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo `yashlp/yashlp`
3. **Project Name:** `only-aesthetics`
4. Leave CivicLens (`yashlp`) untouched — do not paste store env there
5. Full clicks: [VERCEL_ONLY_AESTHETICS_PROJECT.md](./VERCEL_ONLY_AESTHETICS_PROJECT.md)

### A. Accounts & keys → paste into **only-aesthetics** only

| # | You do | Paste into Vercel Production on `only-aesthetics` |
|---|--------|-----------------------------------------------------|
| 1 | Create [Neon](https://neon.tech) Postgres (**new DB**, not CivicLens) | `DATABASE_URL` |
| 2 | Run `openssl rand -base64 32` | `SESSION_SECRET` |
| 3 | Choose admin email + strong password | `COMMERCE_ADMIN_EMAIL`, `COMMERCE_ADMIN_PASSWORD` |
| 4 | [Razorpay](https://razorpay.com) KYC + Live API keys | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| 5 | [Resend](https://resend.com) + verify `onlyaesthetics.in` | `RESEND_API_KEY`, `COMMERCE_FROM_EMAIL` |
| 6 | Vercel Blob on **this** project | `BLOB_READ_WRITE_TOKEN` |

Also set on **only-aesthetics**:

```text
PRODUCT_SURFACE=aesthetics
NEXT_PUBLIC_SITE_URL=https://onlyaesthetics.in
COMMERCE_ADMIN_REQUIRE_OTP=true
ALLOW_DEMO_OTP=false
INDIA_ONLY_STOREFRONT=true
```

Template: [`.env.only-aesthetics.example`](../.env.only-aesthetics.example)

Do **not** set `ALLOW_DEMO_PAYMENT` or `SEED_DEMO_CATALOG` in production.

### B. Domain (critical — currently still WordPress)

1. On project **only-aesthetics** → **Domains** → add `onlyaesthetics.in` + `www`
2. At your registrar, replace WordPress DNS with Vercel’s records
3. Wait until Vercel shows domain **Valid**

### C. Deploy

1. Project **only-aesthetics** → Redeploy Production (`main`)
2. Optional once: `PURGE_DEMO_CATALOG=true` → redeploy → remove → redeploy

### D. Catalog + first sale

1. `/admin/login` → `/admin/launch` (all required green)
2. Add products → publish
3. One Razorpay order from India

---

## Full env table (only-aesthetics project)

| Variable | Required | Notes |
|----------|----------|-------|
| `PRODUCT_SURFACE` | Yes | `aesthetics` |
| `DATABASE_URL` | Yes | Separate Neon DB from CivicLens |
| `SESSION_SECRET` | Yes | New secret — do not reuse CivicLens |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://onlyaesthetics.in` |
| `COMMERCE_ADMIN_EMAIL` | Yes | Admin login |
| `COMMERCE_ADMIN_PASSWORD` | Yes | Strong password |
| `COMMERCE_ADMIN_REQUIRE_OTP` | Yes | `true` |
| `ALLOW_DEMO_OTP` | Yes | `false` |
| `RAZORPAY_KEY_ID` | Yes | Live `rzp_live_…` |
| `RAZORPAY_KEY_SECRET` | Yes | Live secret |
| `RESEND_API_KEY` | Yes | OTP + order emails |
| `COMMERCE_FROM_EMAIL` | Yes | Verified Resend sender |
| `BLOB_READ_WRITE_TOKEN` | Yes | Blob on this project |
| `INDIA_ONLY_STOREFRONT` | Yes | `true` |
| `PURGE_DEMO_CATALOG` | Once | Then remove |
| `SEED_DEMO_CATALOG` | No | Leave unset |

---

## Post-launch checks

- [ ] `https://onlyaesthetics.in` opens the store (not WordPress / not CivicLens)
- [ ] Email OTP signup works
- [ ] Razorpay payment completes
- [ ] Order in `/admin/orders`
- [ ] CivicLens still works on old `yashlp` project
