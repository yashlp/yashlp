# Deploy CivicLens (demo / live)

CivicLens runs on **Vercel** + **PostgreSQL** (Neon recommended). SQLite only works locally.

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
| `DATABASE_URL` | `postgresql://...` | **Required** — Neon pooled URL |
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

### Admin can:

- Toggle **demo mode banner**
- Set **announcement** text
- Enable **maintenance mode**
- Change **default map center**
- Review / hold / resolve / delete **incidents**
- Promote users to **admin**

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

Deploy branch: `cursor/live-admin-deploy-ec9d` (merge to `main` when ready).

---

**Demo live checklist**

- [ ] `DATABASE_URL` = PostgreSQL (not SQLite)
- [ ] `SESSION_SECRET` set
- [ ] `ADMIN_PHONES` = your phone
- [ ] `ALLOW_DEMO_OTP=true` for demo (disable when SMS is wired)
- [ ] Run `db:seed` once after first deploy
- [ ] Sign in → `/admin` → confirm settings save
