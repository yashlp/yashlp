# Host Only Aesthetic WITHOUT Vercel

You do **not** need Vercel credits. Use any of these (pick one).

Domain: **onlyaesthetic.in** — also see [CONNECT_DOMAIN_ONLYAESTHETIC.md](./CONNECT_DOMAIN_ONLYAESTHETIC.md) if using Vercel.

| Rank | Platform | Cost to start | Best for |
|------|----------|---------------|----------|
| 1 | **[Render](https://render.com)** | Free tier (sleeps when idle) or $7/mo | Easiest GitHub deploy |
| 2 | **[Railway](https://railway.app)** | Trial credit, then ~$5+/mo | Simple Docker + envs |
| 3 | **[Fly.io](https://fly.io)** | Free allowance | Mumbai region (`bom`) |
| 4 | **Hetzner / DigitalOcean VPS + Coolify** | ~$4–6/mo | Cheapest always-on |
| 5 | Netlify | Free tier | OK, but Docker/Render is simpler for this app |

Keep **Neon** (free Postgres) and **Cloudflare R2** (free object storage) — both work with any host.

---

## Recommended path: Render (free / cheap)

1. Create account at [render.com](https://render.com) → **New → Blueprint**
2. Connect GitHub repo `yashlp/yashlp`
3. Render reads `render.yaml` → service name **only-aesthetics**
4. In the dashboard, fill the env vars marked sync:false (see list below)
5. Deploy

Or: **New → Web Service** → repo → **Docker** → root Dockerfile.

---

## Alternative: Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `yashlp/yashlp`
3. Railway uses `railway.toml` + `Dockerfile`
4. Variables → paste aesthetics env (below)
5. Settings → generate domain, then attach `onlyaesthetic.in`

---

## Env vars (same on Render / Railway / Fly)

Copy from [`.env.only-aesthetics.example`](../.env.only-aesthetics.example), plus R2 instead of Vercel Blob:

```text
PRODUCT_SURFACE=aesthetics
DATABASE_URL=postgresql://...neon...
SESSION_SECRET=...
NEXT_PUBLIC_SITE_URL=https://onlyaesthetic.in
COMMERCE_ADMIN_EMAIL=...
COMMERCE_ADMIN_PASSWORD=...
COMMERCE_ADMIN_REQUIRE_OTP=true
ALLOW_DEMO_OTP=false
INDIA_ONLY_STOREFRONT=true
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RESEND_API_KEY=re_...
COMMERCE_FROM_EMAIL=Only Aesthetic <onboarding@resend.dev>

# Cloudflare R2 (free) — replace Vercel Blob
S3_BUCKET=only-aesthetics
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_PUBLIC_URL=https://pub-xxxxx.r2.dev
S3_REGION=auto
```

### Cloudflare R2 setup (5 min)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → R2 → Create bucket `only-aesthetics`
2. Manage R2 API Tokens → Create API token (Object Read & Write)
3. Enable public access / custom domain for the bucket → use that as `S3_PUBLIC_URL`

---

## Domain

Point `onlyaesthetic.in` DNS to Render/Railway/Fly (CNAME they show).  
Leave the old CivicLens Vercel project alone.

---

## What Cursor prepared in the repo

- `Dockerfile` — production Next.js standalone image
- `railway.toml` / `render.yaml`
- `scripts/container-start.sh` — DB migrate + admin bootstrap on boot
- Uploads via **Cloudflare R2 / S3** (no Vercel Blob required)

---

## You still must

1. Pick Render or Railway and connect GitHub  
2. Create Neon DB + R2 bucket  
3. Paste env vars  
4. Attach domain DNS  
5. Add products + first Razorpay order  

Cursor cannot open Render/Railway accounts for you.
