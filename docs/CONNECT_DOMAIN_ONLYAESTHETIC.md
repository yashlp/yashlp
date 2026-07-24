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
