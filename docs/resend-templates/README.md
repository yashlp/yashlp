# Upload these HTML files to Resend Templates

## How to upload (one by one)

1. Open [Resend](https://resend.com) → **Templates** → **Create template**
2. Name it (see table below)
3. Set **From:** `Only Aesthetic <customercare@onlyaesthetic.in>`
4. Paste the **Subject** from the table
5. Import / paste the matching `.html` file
6. Add variables listed for that template (type: string, add fallbacks)
7. **Publish** the template

Resend variables use **triple braces**: `{{{CUSTOMER_NAME}}}`

---

## 1) Purchase confirmation

| Field | Value |
|-------|--------|
| File | `01-purchase-confirmation.html` |
| Template name | `OA Purchase Confirmation` |
| Subject | `✓ Order confirmed — {{{ORDER_NUMBER}}} · Only Aesthetic` |
| Variables | `CUSTOMER_NAME`, `ORDER_NUMBER`, `AMOUNT_INR` |

---

## 2) Order shipped

| Field | Value |
|-------|--------|
| File | `02-order-shipped.html` |
| Template name | `OA Order Shipped` |
| Subject | `✈ Order {{{ORDER_NUMBER}}} has shipped · Only Aesthetic` |
| Variables | `CUSTOMER_NAME`, `ORDER_NUMBER`, `COURIER`, `TRACKING_NUMBER` |

---

## 3) Out for delivery

| Field | Value |
|-------|--------|
| File | `03-out-for-delivery.html` |
| Template name | `OA Out For Delivery` |
| Subject | `🚚 Order {{{ORDER_NUMBER}}} is out for delivery · Only Aesthetic` |
| Variables | `CUSTOMER_NAME`, `ORDER_NUMBER`, `COURIER`, `TRACKING_NUMBER` |

---

## 4) Delivered

| Field | Value |
|-------|--------|
| File | `04-order-delivered.html` |
| Template name | `OA Order Delivered` |
| Subject | `✦ Order {{{ORDER_NUMBER}}} was delivered · Only Aesthetic` |
| Variables | `CUSTOMER_NAME`, `ORDER_NUMBER`, `COURIER`, `TRACKING_NUMBER` |

---

## Suggested fallbacks

- `CUSTOMER_NAME` → `there`
- `COURIER` → `Courier`
- `TRACKING_NUMBER` → `—`
- `AMOUNT_INR` → `₹0` (or leave required)
- `ORDER_NUMBER` → required (no fallback)
