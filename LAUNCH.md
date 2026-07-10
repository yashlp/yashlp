# CivicLens — Official launch guide

Your live site: **https://yashlp.vercel.app** (replace with your `.com` when ready)

> **Honest security note:** No website is "unhackable." CivicLens uses HTTPS, secure sessions, rate limits, CSP headers, admin password gate, and server-side payment verification. Follow this checklist to minimize risk.

---

## What is already built (no action needed)

| Feature | Status |
|---------|--------|
| Map (OpenStreetMap) | Free, no API key |
| Place search (Nominatim) | Free, no API key |
| Report data minimums | Blocks purchase if insufficient pins |
| Picture approval (admin) | `/admin/picture-approvals` |
| Razorpay + Stripe code | Ready — needs your API keys |
| MSG91 SMS code | Ready — needs your API key |
| OpenAI Ask AI | Uses GPT when `OPENAI_API_KEY` set |
| Resend support email | When `RESEND_API_KEY` set |
| Admin launch checklist | `/admin/launch` |
| Security headers | CSP, HSTS, X-Frame-Options, etc. |

---

## YOU must do these (Vercel + provider accounts)

### Step 1 — Vercel environment variables (15 min)

Go to **Vercel → your project → Settings → Environment Variables → Production**

Add every row below, then click **Redeploy**.

| Variable | Where to get it | Required |
|----------|-----------------|----------|
| `DATABASE_URL` | [Neon](https://neon.tech) → pooled PostgreSQL URL | Yes |
| `SESSION_SECRET` | Run: `openssl rand -base64 32` | Yes |
| `ADMIN_PHONES` | Your phone E.164 e.g. `+919558812335` | Yes |
| `SMS_PROVIDER` | `msg91` | Yes |
| `SMS_API_KEY` | MSG91 dashboard → Auth Key | Yes |
| `SMS_SENDER_ID` | MSG91 approved sender e.g. `CIVCLN` | Yes |
| `ALLOW_DEMO_OTP` | `false` (after MSG91 works) | Yes |
| `RAZORPAY_KEY_ID` | Razorpay → Live → Key ID `rzp_live_...` | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay → Live → Key Secret | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe → Live `pk_live_...` | Optional |
| `STRIPE_SECRET_KEY` | Stripe → Live `sk_live_...` | Optional |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Optional |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) | Optional |
| `OPENAI_MODEL` | `gpt-4o-mini` (default) | Optional |
| `RESEND_API_KEY` | [resend.com](https://resend.com) | Optional |
| `RESEND_FROM_EMAIL` | `CivicLens <onboarding@resend.dev>` or verified domain | Optional |
| `SUPPORT_EMAIL_TO` | Your inbox e.g. `yash.shah.uk@gmail.com` | Optional |

---

### Step 2 — MSG91 SMS OTP (20 min)

1. Sign up at **https://msg91.com**
2. Complete business KYC and **DLT** registration (required for India SMS)
3. Create an OTP / SMS template approved for login codes
4. Copy **Auth Key** from dashboard
5. Add to Vercel: `SMS_PROVIDER=msg91`, `SMS_API_KEY=...`, `SMS_SENDER_ID=...`
6. Set `ALLOW_DEMO_OTP=false`
7. Redeploy and test: `/login` → your phone → receive real SMS

---

### Step 3 — Razorpay payments India (30 min)

1. Sign up at **https://razorpay.com**
2. Complete **KYC** and link your **bank account** (settlements go here)
3. Switch to **Live mode** → Settings → API Keys → Generate
4. Add to Vercel: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
5. Redeploy
6. Test: `/reports` → buy a report in a data-rich area (Mumbai) → pay ₹29 with UPI test or real

**How you receive money:** Razorpay dashboard → Settlements → your bank (typically T+2 days).

---

### Step 4 — Stripe international (optional, 20 min)

1. Sign up at **https://stripe.com**
2. Complete business verification + bank account
3. Developers → API keys → **Live** mode
4. Add `STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` to Vercel
5. Redeploy — international report areas use Stripe USD checkout

---

### Step 5 — Publish for customers (1 min)

1. Go to **https://yashlp.vercel.app/admin/login**
2. Admin OTP → set admin password if first time
3. **Admin → Site settings → Publish for customers**
4. Or **Admin → Launch** to see green checklist

---

### Step 6 — Custom `.com` domain (optional, 15 min)

1. Buy a domain (e.g. `getciviclens.com` — `civiclens.com` is taken by another company)
2. Vercel → Project → **Settings → Domains** → Add domain
3. At your registrar, add DNS records Vercel shows (usually CNAME or A)
4. Wait for SSL (automatic, ~5–30 min)
5. Set `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com` in Vercel
6. Redeploy

---

### Step 7 — OpenAI Ask AI (optional, 5 min)

1. Create API key at **https://platform.openai.com**
2. Add `OPENAI_API_KEY` to Vercel
3. Redeploy — `/ask` uses GPT grounded on your community data

---

### Step 8 — Resend support email (optional, 10 min)

1. Sign up at **https://resend.com**
2. Verify your sending domain (or use Resend test domain initially)
3. Add to Vercel:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL=CivicLens <noreply@yourdomain.com>`
   - `SUPPORT_EMAIL_TO=your@email.com`
4. Users can POST `/api/support` when signed in (wire UI in Profile if desired)

---

### Step 9 — Cloud photo storage (optional, later)

Photos are stored in PostgreSQL today (fine for early scale). For S3/R2 at scale, add:

```
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=        # Cloudflare R2 or AWS
S3_PUBLIC_URL=
```

(Full S3 migration can be done in a follow-up — not blocking launch.)

---

## Security checklist

| Item | Action |
|------|--------|
| Strong `SESSION_SECRET` | 32+ random chars, never commit to git |
| `ALLOW_DEMO_OTP=false` | After MSG91 live |
| Admin password | 12+ chars, rotate in Admin → Settings |
| Neon password | Rotate if ever shared in chat |
| HTTPS only | Vercel default |
| Rate limits | On OTP, API, Ask AI (built-in) |
| Payment verification | Server-side signature check (built-in) |
| Photo approval | Admin reviews uploads before public display |

---

## Verify launch

1. Open **Admin → Launch** — all required items green
2. Customer sign-in with real SMS (not `123456`)
3. Submit a report with photo → approve in **Picture Approval**
4. Buy report where data exists → Razorpay payment succeeds
5. Hard refresh homepage — no demo banners

---

## What the agent cannot do for you

- Create MSG91 / Razorpay / Stripe / OpenAI / Resend accounts (needs your identity + KYC)
- Paste secrets into Vercel (only you have dashboard access)
- Buy or configure your `.com` DNS at registrar

Everything else is in the codebase and deploys from `main` automatically.
