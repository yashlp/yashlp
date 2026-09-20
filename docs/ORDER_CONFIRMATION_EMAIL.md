# Order confirmation email

After Razorpay payment clears, the customer receives a purchase confirmation email.

## When it sends

1. **Browser verify** — checkout calls `POST /api/commerce/payments/verify` → `confirmPayment` → email
2. **Webhook backup** — `POST /api/commerce/payments/razorpay-webhook` on `payment.captured` (if the tab closes before verify)
3. **COD / free path** — guest orders that land as `CONFIRMED` without Razorpay also send immediately

Email is sent **once** when the order first becomes `CONFIRMED` (no duplicate on webhook retries).

## Vercel env (project **onlyaesthetic**)

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | `re_…` |
| `COMMERCE_FROM_EMAIL` | `Only Aesthetic <customercare@onlyaesthetic.in>` |
| `RESEND_FROM_EMAIL` | same (fallback) |
| `RAZORPAY_WEBHOOK_SECRET` | from Razorpay webhook settings |

In [Resend](https://resend.com): verify domain **onlyaesthetic.in**, then use a from-address on that domain.

## Razorpay webhook

1. Razorpay Dashboard → **Webhooks** → Add
2. URL: `https://onlyaesthetic.in/api/commerce/payments/razorpay-webhook`
3. Event: `payment.captured`
4. Copy the secret into `RAZORPAY_WEBHOOK_SECRET`

## Guest checkout notes

Guest contact is stored as structured notes so email resolution is reliable:

```text
Guest: Name
Email: customer@example.com
Phone: +91…
```
