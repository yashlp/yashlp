# Connect domain: onlyaesthetic.in

Brand: **Only Aesthetic**  
Domain you bought: **onlyaesthetic.in**  
Vercel project: **onlyaesthetic** (URL like `onlyaesthetics-omega.vercel.app`)

---

## Why `/` shows CivicLens (not the store)

This repo has **two apps** in one codebase. By default the home page is CivicLens.

**Code now auto-detects** `onlyaesthetic*` / `onlyaesthetic.in` hostnames and redirects `/` → store (CivicLens stays on `yashlp`).

Your store URL today:

```text
https://onlyaesthetics-omega.vercel.app/aesthetics
```

Admin:

```text
https://onlyaesthetics-omega.vercel.app/admin/login
```

Still recommended on project **onlyaesthetic**:

| Name | Value |
|------|--------|
| `PRODUCT_SURFACE` | `aesthetics` |
| `NEXT_PUBLIC_SITE_URL` | `https://onlyaesthetic.in` (or `https://onlyaesthetics-omega.vercel.app` until domain is live) |

Then **Deployments → Redeploy**.

> Do **not** set `PRODUCT_SURFACE=aesthetics` on the CivicLens project (`yashlp`).

> If you see “India only”, open the site from an India network (or temporarily set `ALLOW_NON_INDIA_ACCESS=true` for testing).

---

## Important first

If a Vercel project shows `DEPLOYMENT_DISABLED`, fix billing/credits first.  
Domain will only go live after that project can serve traffic.  
Your **onlyaesthetic** / `onlyaesthetics-omega` project is the one to use for the store + domain.

---

## Step 1 — Add domain in Vercel

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open project **`onlyaesthetic`** (store — URL like `onlyaesthetics-omega.vercel.app` — **not** `yashlp`)
3. **Settings → Domains**
4. Add:
   - `onlyaesthetic.in`
   - `www.onlyaesthetic.in`
5. Set **onlyaesthetic.in** as primary (Redirect www → apex, or the reverse — either is fine)

Vercel will show DNS records. Keep that page open.

---

## Step 2 — Point DNS in GoDaddy

You bought the domain on **GoDaddy**. Do this:

1. Open [dcc.godaddy.com](https://dcc.godaddy.com) → sign in
2. Click **Domains** → find **onlyaesthetic.in** → **DNS** / **Manage DNS**
3. Turn **off** domain forwarding / parking / “Website Builder” if GoDaddy offers it (Forwarding would override DNS)
4. Keep **GoDaddy nameservers** (default). Do **not** change nameservers unless Vercel tells you to.

### Delete conflicting records first

In the DNS table, remove any existing records that conflict:

- Any **A** record for `@` / blank / `onlyaesthetic.in`
- Any **CNAME** or **A** for `www`
- Parking / “Parked” / “Coming Soon” records GoDaddy may have added

Leave **NS** and **SOA** alone. Keep MX only if you use GoDaddy email.

### Add these two records

| Type | Name / Host | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| **A** | `@` | `76.76.21.21` | 1 Hour (or default) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 Hour (or default) |

Use the **exact** values from Vercel Domains if they differ.

Click **Save**. Wait **5–60 minutes** (sometimes up to 24h).

### If GoDaddy blocks apex CNAME

You only need the **A** record for `@` (above). Do **not** put a CNAME on `@`.

---

## Step 3 — Env var on Vercel

Project **onlyaesthetic** → **Settings → Environment Variables** → Production:

```text
PRODUCT_SURFACE=aesthetics
NEXT_PUBLIC_SITE_URL=https://onlyaesthetic.in
```

Then **Deployments → Redeploy** (required).

Without `PRODUCT_SURFACE=aesthetics`, the homepage stays CivicLens.

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

Vercel → fix payment / enable deployment on the project that is disabled.  
Use the working project (**onlyaesthetic** / `onlyaesthetics-omega`) for the domain if that one deploys.
