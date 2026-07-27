# Only Aesthetic — Resend email templates

Customer emails are sent **from code** via Resend (professional HTML).  
You do **not** need to paste templates into the Resend dashboard for production — after deploy, the app sends them automatically.

Use the samples below if you want to **preview** in Resend → **Emails** → compose a test, or store as Resend Templates.

**From address (after domain verified):**  
`Only Aesthetic <customercare@onlyaesthetic.in>`

---

## 1. Purchase confirmation

**Subject:** `✓ Order confirmed — {{ORDER_NUMBER}} · Only Aesthetic`

**When:** Payment clears / order confirmed

**Symbols used:** ✓ ✦ ✉

### Plain text

```text
Hi {{NAME}},

✓ Thank you — your payment is confirmed.
Order: {{ORDER_NUMBER}}
Total: {{AMOUNT}}

We'll email you when your order ships.
Questions? customercare@onlyaesthetic.in

— Only Aesthetic
```

### What customers see (design)

- Dark brand header with **✓** and “Purchase confirmed”
- Order number + amount paid + status **✓ Confirmed**
- Soft blush/cream Only Aesthetic styling
- Customer care link: ✉ customercare@onlyaesthetic.in
- Footer: ✦ Details matter · Ships with care ✦

---

## 2. Delivery update — Shipped

**Subject:** `✈ Order {{ORDER_NUMBER}} has shipped · Only Aesthetic`

**When:** Admin / Shiprocket marks order shipped

**Symbols:** ✈ ✉ ✦

Includes courier + tracking number.

---

## 3. Delivery update — Out for delivery

**Subject:** `🚚 Order {{ORDER_NUMBER}} is out for delivery · Only Aesthetic`

**When:** Courier status = out for delivery

**Symbols:** 🚚 ✉ ✦

---

## 4. Delivery update — Delivered

**Subject:** `✦ Order {{ORDER_NUMBER}} was delivered · Only Aesthetic`

**When:** Order delivered

**Symbols:** ✦ ✉

---

## Resend dashboard (optional preview)

1. Resend → **Emails** → **Broadcast** / test send, **or** **Templates** → New
2. Set **From:** `Only Aesthetic <customercare@onlyaesthetic.in>` (domain must be verified)
3. Paste subject + HTML from a test order (or ask the app to send a real test after redeploy)
4. Send to yourself (`yash.shah.lp2@gmail.com`) to preview

Production path (recommended): keep using the app — templates live in:

- `src/lib/commerce/email-templates.ts`
- `src/lib/commerce/commerce-email.ts`

---

## Vercel env required

```text
RESEND_API_KEY=re_...
COMMERCE_FROM_EMAIL=Only Aesthetic <customercare@onlyaesthetic.in>
RESEND_FROM_EMAIL=Only Aesthetic <customercare@onlyaesthetic.in>
COMMERCE_SUPPORT_EMAIL=customercare@onlyaesthetic.in
SUPPORT_EMAIL_TO=customercare@onlyaesthetic.in
```

Redeploy after setting.
