# CivicLens — Launch guide

**Live site:** https://yashlp.vercel.app  
**CivicLens admin:** https://yashlp.vercel.app/civic-admin/login  
**Only Aesthetics admin:** https://yashlp.vercel.app/admin/login *(different product — do not mix)*

---

## Current status (as of latest deploy)

| Item | Status |
|------|--------|
| Website live on Vercel | Done |
| Map / report / compare / insights / ask | Done in code |
| QA bugfixes (camera, New pin, payments harden, privacy) | On branch — merge to `main` to deploy |
| `authMode` | **demo** (OTP still `123456` until MSG91) |
| Payments | **not configured** (`paymentsConfigured: false`) |
| Custom domain | Optional — using `*.vercel.app` |

---

## Who does what

### Agent already did / will do (code)

- [x] Build CivicLens product flows (map, report, reports, payments code, admin)
- [x] Security headers, rate limits, photo approval, data readiness gates
- [x] Final QA fixes (report loop, camera CSP, open redirect, payment verify trust, private pin leak)
- [x] Admin launch checklist UI at `/civic-admin/launch`
- [x] “Publish for customers” API at CivicLens admin settings
- [x] Keep `/civic-admin` separate from Only Aesthetics `/admin`
- [ ] Merge QA branch to `main` so Vercel redeploys (see below)

### You must do (accounts + secrets — agent cannot)

These need **your** identity, bank KYC, and Vercel dashboard access. No one else can complete them.

| # | Task | Blocks |
|---|------|--------|
| 1 | Paste env vars in Vercel Production | Real OTP + payments |
| 2 | MSG91 KYC + Auth Key + DLT template | Real SMS login |
| 3 | Razorpay KYC + live API keys | Collecting money in India |
| 4 | Click **Publish for customers** in `/civic-admin` | Customer-facing banner / go-live settings |
| 5 | (Optional) Stripe, OpenAI, Resend, custom domain | Nice-to-have |

---

## Step-by-step — YOU

### Step 1 — Merge QA + redeploy (2 min)

1. Open the PR for branch `cursor/final-qa-fixes-ec9d` (or merge it in GitHub)
2. After merge, Vercel auto-deploys `main`
3. Confirm camera works: open `/report` on phone → add photo (Permissions-Policy should allow camera)

### Step 2 — Vercel environment variables (15 min)

**Vercel → Project → Settings → Environment Variables → Production**

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Neon pooled `postgresql://…` | Yes (likely already set) |
| `SESSION_SECRET` | 32+ random chars (generate: `openssl rand -base64 32`) | Yes |
| `ADMIN_PHONES` | Your phone E.164 e.g. `+919558812335` | Yes |
| `SMS_PROVIDER` | `msg91` | Yes for real OTP |
| `SMS_API_KEY` | MSG91 Auth Key | Yes for real OTP |
| `SMS_SENDER_ID` | Approved sender e.g. `CIVCLN` | Yes for real OTP |
| `ALLOW_DEMO_OTP` | `false` **only after** MSG91 works | Yes for official launch |
| `RAZORPAY_KEY_ID` | Live `rzp_live_…` | Yes for payments |
| `RAZORPAY_KEY_SECRET` | Live secret | Yes for payments |
| `NEXT_PUBLIC_SITE_URL` | `https://yashlp.vercel.app` or your domain | Recommended |
| `OPENAI_API_KEY` | From platform.openai.com | Optional |
| `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Live keys | Optional (intl) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `SUPPORT_EMAIL_TO` | Resend + your inbox | Optional |

Then **Redeploy** Production.

### Step 3 — MSG91 SMS (20–40 min + KYC wait)

1. https://msg91.com → sign up → business KYC + India DLT
2. Create OTP template → get Auth Key + sender ID
3. Put keys in Vercel (Step 2)
4. Set `ALLOW_DEMO_OTP=false` → Redeploy
5. Test `/login` — you should get a real SMS (not `123456`)

### Step 4 — Razorpay (30 min + KYC wait)

1. https://razorpay.com → KYC + bank account
2. Live mode → API Keys → generate
3. Add keys to Vercel → Redeploy
4. Test: `/reports` → pick Mumbai (data-rich) → pay with UPI

Money → Razorpay Settlements → your bank (usually T+2).

### Step 5 — Publish for customers (1 min)

1. https://yashlp.vercel.app/civic-admin/login
2. Sign in with admin phone OTP
3. **Site settings → Publish for customers**  
   **or** open **Launch** and confirm required rows are green

### Step 6 — Optional polish

- Custom domain in Vercel → Domains (avoid `civiclens.com` — taken)
- OpenAI for Ask AI
- Stripe for international USD
- Resend for support email

---

## Soft launch vs official launch

| Mode | When | Sign-in | Payments |
|------|------|---------|----------|
| **Soft launch** (site already live) | Now | Demo OTP `123456` | Off until Razorpay keys |
| **Official launch** | After Steps 2–5 | Real MSG91 SMS | Razorpay live |

You can soft-launch today for friends/testers. Official launch needs MSG91 + Razorpay.

---

## Verify after you finish Steps 2–5

1. `/civic-admin/launch` — all **required** items green
2. `/login` — real SMS code
3. `/report` — photo + pin → submit → approve in Picture Approvals
4. `/reports` — pay in a data-ready area → success
5. Homepage — no demo/maintenance banners

---

## What the agent cannot do

- Create MSG91 / Razorpay / Stripe / OpenAI / Resend accounts (KYC + your ID)
- Paste secrets into your Vercel project
- Buy or point a custom domain at your registrar
- Click “Publish for customers” while signed in as you (needs your admin session)

Everything else is in the repo and deploys from `main`.
