# Create a separate Vercel project for Only Aesthetic

CivicLens stays on the existing project (**yashlp**).  
Only Aesthetic gets a **new** project so env vars never mix.

Domain: **onlyaesthetic.in** — see [CONNECT_DOMAIN_ONLYAESTHETIC.md](./CONNECT_DOMAIN_ONLYAESTHETIC.md).

Cursor cannot create the Vercel project (needs your Vercel login). Follow these clicks:

---

## 1. Create the project (2 minutes)

1. Open [vercel.com/new](https://vercel.com/new)
2. **Import** GitHub repo `yashlp/yashlp`
3. **Project Name:** `only-aesthetics` (exactly — aesthetics only)
4. Framework: **Next.js** (auto)
5. Root Directory: leave blank (repo root)
6. Build Command: `npm run vercel-build` (already in `vercel.json`)
7. Region: **Bombay (bom1)** if offered
8. Click **Deploy** once (it may fail until env vars are set — that is OK)

Do **not** add Only Aesthetics keys to the old CivicLens / `yashlp` project.

---

## 2. Add env vars (Only Aesthetics project only)

Project **only-aesthetics** → **Settings → Environment Variables → Production**

Copy from [`.env.only-aesthetics.example`](../.env.only-aesthetics.example).

Minimum required:

| Variable | Notes |
|----------|--------|
| `PRODUCT_SURFACE` | `aesthetics` — hides CivicLens routes on this deploy |
| `DATABASE_URL` | Prefer a **separate Neon database** from CivicLens |
| `SESSION_SECRET` | New secret — do not reuse CivicLens |
| `NEXT_PUBLIC_SITE_URL` | `https://onlyaesthetic.in` |
| `COMMERCE_ADMIN_EMAIL` / `COMMERCE_ADMIN_PASSWORD` | Store admin |
| `COMMERCE_ADMIN_REQUIRE_OTP` | `true` |
| `ALLOW_DEMO_OTP` | `false` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Live keys |
| `RESEND_API_KEY` / `COMMERCE_FROM_EMAIL` | Verified sender |
| `BLOB_READ_WRITE_TOKEN` | New Blob store for this project (recommended) |
| `INDIA_ONLY_STOREFRONT` | `true` |

Then **Redeploy** Production.

---

## 3. Domain

On project **onlyaesthetics** / **only-aesthetics** (not yashlp):

1. **Settings → Domains** → add `onlyaesthetic.in` + `www.onlyaesthetic.in`
2. At your registrar, point DNS to the records Vercel shows (full guide: [CONNECT_DOMAIN_ONLYAESTHETIC.md](./CONNECT_DOMAIN_ONLYAESTHETIC.md))
3. Remove any old WordPress / parking DNS

---

## 4. Keep CivicLens separate

| | CivicLens project (`yashlp`) | Only Aesthetic (`onlyaesthetics`) |
|--|--|--|
| Domain | `yashlp.vercel.app` / CivicLens domain | `onlyaesthetic.in` |
| Env | CivicLens SMS, reports, Stripe, etc. | Commerce + Razorpay + Resend + Blob only |
| `PRODUCT_SURFACE` | unset / anything else | `aesthetics` |
| Admin | `/civic-admin` | `/admin` |

---

## 5. After deploy

- Storefront: `https://onlyaesthetic.in/aesthetics` (or `/` which redirects there)
- Admin: `https://onlyaesthetic.in/admin/login`
- Checklist: `https://onlyaesthetic.in/admin/launch`
