# Connect domain: onlyaesthetic.in

Brand: **Only Aesthetic**  
Domain you bought: **onlyaesthetic.in**

---

## Important first

Your Vercel project **onlyaesthetics** may show `DEPLOYMENT_DISABLED` until billing/credits work.  
Domain will only go live after that project can serve traffic.

---

## Step 1 — Add domain in Vercel

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open project **`onlyaesthetics`** (store project — not `yashlp`)
3. **Settings → Domains**
4. Add:
   - `onlyaesthetic.in`
   - `www.onlyaesthetic.in`
5. Set **onlyaesthetic.in** as primary (Redirect www → apex, or the reverse — either is fine)

Vercel will show DNS records. Keep that page open.

---

## Step 2 — Point DNS at your registrar

At whoever you bought the domain from (GoDaddy, Namecheap, Cloudflare, Hostinger, etc.):

### Option A — Recommended (Apex + www)

| Type | Name / Host | Value |
|------|-------------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Use the **exact** values Vercel shows if they differ.

### Option B — If registrar only allows CNAME for apex
Follow Vercel’s “CNAME flattening” / ALIAS instructions for your registrar.

Save DNS. Wait 5–60 minutes (sometimes up to 24h).

---

## Step 3 — Env var on Vercel

Project **onlyaesthetics** → **Settings → Environment Variables** → Production:

```text
NEXT_PUBLIC_SITE_URL=https://onlyaesthetic.in
PRODUCT_SURFACE=aesthetics
```

Then **Deployments → Redeploy**.

---

## Step 4 — Admin settings (after site loads)

1. Open `https://onlyaesthetic.in/admin/login`
2. Go to **Settings**
3. Set:
   - **Website URL** = `https://onlyaesthetic.in`
   - **Support email** = `yash.shah.lp2@gmail.com`
   - **Store display name** = `Only Aesthetic`
4. Save

---

## Step 5 — Check

- [ ] `https://onlyaesthetic.in` opens the store (not WordPress / not CivicLens)
- [ ] `https://onlyaesthetic.in/admin/login` works
- [ ] Vercel Domains shows **Valid** + SSL

---

## Razorpay website field

In Razorpay business website, enter:

```text
https://onlyaesthetic.in
```

---

## If deployment is still disabled

Vercel → **onlyaesthetics** → fix payment / enable deployment first.  
Until then the domain cannot serve the app.
