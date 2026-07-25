# Delivery after checkout (Shiprocket)

Only Aesthetic already takes payment (Razorpay) and stores the India address.  
Delivery is handled **after** payment by creating a Shiprocket shipment from admin.

---

## End-to-end flow

```text
Customer checkout + Razorpay pay
        ↓
Order CONFIRMED (email sent)
        ↓
Admin: Pack → Ready to ship
        ↓
Admin: “Create Shiprocket shipment”
        ↓
Shiprocket AWB saved · order SHIPPED · customer emailed tracking
        ↓
Shiprocket webhook → OUT_FOR_DELIVERY → DELIVERED
```

Manual fallback: type courier + tracking on the order page and mark shipped.

---

## 1. Create Shiprocket account

1. Sign up at [shiprocket.in](https://www.shiprocket.in)
2. Add your **pickup / warehouse address** (must match the pickup location name you use in env)
3. Settings → **API** → Create an **API User** (email + password — different from login email)
4. Copy those API credentials

---

## 2. Vercel env (project **onlyaesthetic**)

```text
SHIPROCKET_EMAIL=your-api-user@email.com
SHIPROCKET_PASSWORD=your-api-user-password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_WEBHOOK_SECRET=long-random-string
```

Optional package defaults (cm / kg):

```text
SHIPROCKET_DEFAULT_LENGTH_CM=20
SHIPROCKET_DEFAULT_BREADTH_CM=15
SHIPROCKET_DEFAULT_HEIGHT_CM=10
SHIPROCKET_DEFAULT_WEIGHT_KG=0.5
```

Redeploy after saving.

`SHIPROCKET_PICKUP_LOCATION` must be the **exact** pickup nickname already saved in Shiprocket (often `Primary`).

---

## 3. Webhook (status sync)

In Shiprocket → Settings → API / Webhooks, add:

```text
https://onlyaesthetic.in/api/commerce/shipping/shiprocket-webhook?secret=YOUR_SHIPROCKET_WEBHOOK_SECRET
```

(or send the same secret as header `x-api-key`)

When couriers update tracking, orders move to **Out for delivery** / **Delivered** automatically.

---

## 4. Admin steps per order

1. `/admin/orders` → open the paid order  
2. **Mark packed** → **Ready to ship**  
3. Courier = **Shiprocket** → **Create Shiprocket shipment**  
4. AWB / tracking appears; customer gets a “shipped” email (Resend)  
5. Label / order details open in Shiprocket if a URL is returned  

Also available on `/admin/shipping`.

---

## 5. Customer view

Account → Order history shows **courier + tracking** once shipped.

---

## Without Shiprocket yet

You can still fulfill manually:

1. Book any courier (Delhivery / BlueDart / DTDC / local)  
2. Paste tracking on the order  
3. Mark shipped  

Shiprocket is recommended because one account covers many India couriers and gives AWB + tracking webhooks.

---

## Checklist

- [ ] Shiprocket API user created  
- [ ] Pickup location named and set in `SHIPROCKET_PICKUP_LOCATION`  
- [ ] Env vars on Vercel + redeploy  
- [ ] Webhook URL saved  
- [ ] Test one paid order → Create Shiprocket shipment  
- [ ] Confirm tracking email + account page tracking  
