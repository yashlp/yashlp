# Deploy CivicLens (demo / live)

CivicLens runs on **Vercel** + **PostgreSQL** (Neon recommended). SQLite only works locally.

**Deploy branch:** `main` (includes map, city insights, country rankings, admin security).

---

## Already prepared in the repo

- Next.js production build (`npm run build` passes)
- `vercel.json` — Prisma migrate on deploy, Mumbai region (`bom1`)
- Admin password gate, demo OTP mode, security headers
- Seed script with Mumbai sample data and demo categories

---

## Your steps to go live (~20 minutes)

### A. Neon database (5 min)

1. Sign up at [neon.tech](https://neon.tech) → **New project** → name it `civiclens`.
2. Dashboard → **Connection details** → enable **Pooled connection**.
3. Copy the connection string (must start with `postgresql://`).

### B. Vercel project (5 min)

1. Sign up at [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import GitHub repo **`yashlp/yashlp`**.
3. **Production branch:** `main`.
4. Do **not** deploy yet — add env vars first (step C).

### C. Environment variables (5 min)

Vercel → your project → **Settings** → **Environment Variables** → add for **Production**:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon pooled URL from step A |
| `SESSION_SECRET` | Run locally: `openssl rand -base64 32` |
| `ADMIN_PHONES` | Your phone, E.164 format e.g. `+447700900123` or `+919876543210` |
| `ALLOW_DEMO_OTP` | `true` |

Click **Deploy** (or redeploy if you already deployed).

### D. Seed demo data once (2 min)

On your laptop (replace with your Neon URL):

```bash
git clone https://github.com/yashlp/yashlp.git
cd yashlp
npm install
DATABASE_URL="postgresql://..." npm run db:seed
```

### E. Verify (5 min)

1. Open `https://<your-project>.vercel.app`
2. `/login` → enter your `ADMIN_PHONES` number → OTP **`123456`**
3. `/admin` → set admin password (12+ characters)
4. Home map, `/insights` (City Insights), country rankings

Share the Vercel URL — it stays live (unlike localhost tunnels).

---

## 1. Database (Neon — free tier)

1. Create a project at [https://neon.tech](https://neon.tech)
2. Copy the **pooled** PostgreSQL connection string
3. Set as `DATABASE_URL` in Vercel (see below)

## 2. Vercel

1. Import repo `yashlp/yashlp` at [https://vercel.com](https://vercel.com)
2. **Root directory:** `/` (default)
3. Framework: **Next.js** (auto-detected; `vercel.json` included)

### Required environment variables

| Variable | Example | Notes |
|----------|---------|--------|
| `DATABASE_URL` | `postgresql://...` | **Required** — Neon **pooled** URL (omit `channel_binding=require` if deploy fails) |
| `SESSION_SECRET` | `openssl rand -base64 32` | **Required** — min 32 chars |
| `ADMIN_PHONES` | `+919988776655` | Comma-separated admin login phones |
| `ALLOW_DEMO_OTP` | `true` | Demo live site: OTP always `123456` |
| `NODE_ENV` | `production` | Set by Vercel automatically |

### Optional (real SMS later)

| Variable | Notes |
|----------|--------|
| `SMS_PROVIDER` | e.g. `twilio`, `msg91` |
| `SMS_API_KEY` | Provider API key |

## 3. First deploy

Vercel runs `prisma db push` during build (see `vercel.json`), which creates tables.

After first deploy, seed demo data **once** from your machine:

```bash
DATABASE_URL="your-neon-url" npm run db:seed
```

This loads categories, Mumbai sample pins, demo admin user, and default site settings.

## 4. Admin backend (change site without redeploy)

1. Sign in with a phone listed in `ADMIN_PHONES` (demo: `919988776655`, OTP `123456` if `ALLOW_DEMO_OTP=true`)
2. Open **https://your-domain.vercel.app/admin**
3. On first admin visit, set an **admin password** (minimum 12 chars). This is now required to unlock admin APIs.

### Admin can:

- Toggle **demo mode banner**
- Set **announcement** text
- Enable **maintenance mode**
- Change **default map center**
- Review / hold / resolve / delete **incidents**
- Promote users to **admin**
- Rotate **admin password** from **Admin → Settings**

## 4.1 Admin password workflow (new)

- First admin login: `/admin` prompts to create password.
- Later admin sessions: `/admin` asks for password verification before backend access.
- Passwords are stored as salted scrypt hashes (`passwordHash`) and never stored in plain text.

## 4.2 Security checklist for production

1. `ALLOW_DEMO_OTP=false`
2. Configure real SMS (`SMS_PROVIDER` + `SMS_API_KEY`)
3. Use strong `SESSION_SECRET` (32+ random chars)
4. Keep `ADMIN_PHONES` minimal (only trusted numbers)
5. Rotate admin password periodically in Admin Settings
6. Use HTTPS-only deployment (Vercel default)

## 5. Local development

```bash
cp .env.example .env
npm install
npm run db:setup    # SQLite + seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin  
- Demo hub: http://localhost:3000/try  

If the page is blank: `npm run dev:reset` then hard-refresh (Ctrl+Shift+R).

## 6. Custom domain

In Vercel → Project → Settings → Domains, add your domain and follow DNS instructions.

## 7. Branch to deploy

**Production branch:** `main`

---

**Demo live checklist**

- [ ] `DATABASE_URL` = PostgreSQL (not SQLite)
- [ ] `SESSION_SECRET` set
- [ ] `ADMIN_PHONES` = your phone
- [ ] `ALLOW_DEMO_OTP=true` for demo (disable when SMS is wired)
- [ ] Run `db:seed` once after first deploy
- [ ] Sign in → `/admin` → confirm settings save
