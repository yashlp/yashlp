# Only Aesthetics — Production launch checklist

Launch domain: **https://onlyaesthetics.in**

> **No Vercel credits?** Host on Render or Railway instead:  
> [HOSTING_WITHOUT_VERCEL.md](./HOSTING_WITHOUT_VERCEL.md)

> Prefer a separate app from CivicLens. Use `PRODUCT_SURFACE=aesthetics` and a dedicated host project.  
> Vercel project guide (optional): [VERCEL_ONLY_AESTHETICS_PROJECT.md](./VERCEL_ONLY_AESTHETICS_PROJECT.md)

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

### 0. Pick a host (do **not** need Vercel)

**Recommended if no Vercel credits:** [Render](https://render.com) or [Railway](https://railway.app)  
Full steps: [HOSTING_WITHOUT_VERCEL.md](./HOSTING_WITHOUT_VERCEL.md)

1. Connect GitHub `yashlp/yashlp`
2. Deploy with the repo `Dockerfile`
3. Paste aesthetics env vars (template: `.env.only-aesthetics.example`)
4. Attach `onlyaesthetics.in` DNS to **that** host — leave CivicLens alone

### A. Accounts & keys → paste into Render/Railway (not CivicLens)

| # | You do | Env var |
|---|--------|---------|
| 1 | [Neon](https://neon.tech) Postgres (**new DB**) | `DATABASE_URL` |
| 2 | `openssl rand -base64 32` | `SESSION_SECRET` |
| 3 | Admin email + password | `COMMERCE_ADMIN_EMAIL`, `COMMERCE_ADMIN_PASSWORD` |
| 4 | [Razorpay](https://razorpay.com) Live keys | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| 5 | [Resend](https://resend.com) | `RESEND_API_KEY`, `COMMERCE_FROM_EMAIL` |
| 6 | [Cloudflare R2](https://dash.cloudflare.com) free bucket | `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `S3_PUBLIC_URL` |

Also set:

```text
PRODUCT_SURFACE=aesthetics
NEXT_PUBLIC_SITE_URL=https://onlyaesthetics.in
COMMERCE_ADMIN_REQUIRE_OTP=true
ALLOW_DEMO_OTP=false
INDIA_ONLY_STOREFRONT=true
```

### B. Domain

Point `onlyaesthetics.in` to Render/Railway/Fly (not WordPress, not CivicLens Vercel).

### C. Catalog + first sale

1. `/admin/login` → `/admin/launch`
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
