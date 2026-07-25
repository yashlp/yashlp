# MSG91 SMS — OTP + order / delivery alerts

Only Aesthetic uses **MSG91** for:

| Message | When |
|---------|------|
| Customer phone OTP | Account login / signup by phone |
| Admin login OTP | Admin MFA (also emailed via Resend) |
| Purchase confirmation | After payment clears |
| Shipped / out for delivery / delivered | Order status updates |

---

## 1. MSG91 account

1. Sign up at [msg91.com](https://msg91.com) and complete **KYC**
2. Get **DLT** templates approved for India (mandatory for transactional SMS)
3. Create / approve a **Sender ID** (6 letters), e.g. `ONLYAE`
4. Copy **Auth Key**: MSG91 → Settings → **Authkey**

---

## 2. Create SMS Flows (templates)

In MSG91 → **SMS** / **One API** → **Add Flow** (or Templates), create these (wording must match DLT):

### A. OTP (customer + admin)

Example text:

```text
Your Only Aesthetic verification code is ##otp##. Valid for 10 minutes.
```

- Copy **Template / Flow ID** → optional env `SMS_FLOW_OTP`
- If you skip this, the app uses MSG91 **SendOTP** API with `SMS_API_KEY` + `SMS_SENDER_ID`

### B. Order confirmation

Example:

```text
Hi ##name##, payment confirmed for order ##order## (##amount##). Thank you for shopping at Only Aesthetic.
```

→ Flow ID → `SMS_FLOW_ORDER_CONFIRM`

### C. Shipped

Example:

```text
Hi ##name##, order ##order## has shipped via ##courier##. Tracking: ##tracking##
```

→ `SMS_FLOW_SHIPPED`

### D. Out for delivery

Example:

```text
Hi ##name##, order ##order## is out for delivery. Tracking: ##tracking##
```

→ `SMS_FLOW_OUT_FOR_DELIVERY`

### E. Delivered

Example:

```text
Hi ##name##, order ##order## was delivered. Thank you for shopping with Only Aesthetic.
```

→ `SMS_FLOW_DELIVERED`

**Optional single fallback** for any delivery status if C/D/E are missing:

```text
Hi ##name##, order ##order## update: ##status##. Tracking: ##tracking##
```

→ `SMS_FLOW_DELIVERY_UPDATE`

> Variable names (`name`, `order`, `otp`, …) must match what you put in the Flow **exactly** (case-sensitive). The app also sends `VAR1`/`VAR2`/`VAR3` aliases — rename your Flow vars to match, or adjust the Flow to use `name` / `order` / etc.

---

## 3. Vercel env (project **onlyaesthetic**)

```text
SMS_PROVIDER=msg91
SMS_API_KEY=<MSG91 Auth Key>
SMS_SENDER_ID=ONLYAE
ALLOW_DEMO_OTP=false

# Optional — preferred OTP Flow id (else SendOTP API)
SMS_FLOW_OTP=

# Transactional Flow ids (required for purchase + delivery SMS)
SMS_FLOW_ORDER_CONFIRM=
SMS_FLOW_SHIPPED=
SMS_FLOW_OUT_FOR_DELIVERY=
SMS_FLOW_DELIVERED=
# Optional fallback if the three above are empty:
SMS_FLOW_DELIVERY_UPDATE=

# Admin OTP also via SMS (in addition to Resend email)
COMMERCE_ADMIN_PHONE=91XXXXXXXXXX
```

Then **Redeploy**.

---

## 4. What customers receive

1. **Phone login** → OTP SMS  
2. **Paid order** → confirmation SMS (+ email if Resend is set)  
3. **Shipped / OFD / Delivered** → status SMS (+ shipped email)

Admin:

1. Login with email/password → OTP by **email** and **SMS** (if `COMMERCE_ADMIN_PHONE` + MSG91 set)

---

## 5. Test checklist

- [ ] Phone login receives OTP  
- [ ] Admin login receives SMS OTP on `COMMERCE_ADMIN_PHONE`  
- [ ] Test Razorpay order → purchase SMS  
- [ ] Mark order shipped → shipped SMS  
- [ ] Turn `ALLOW_DEMO_OTP=false` after OTP works  

---

## Temporary without MSG91

```text
ALLOW_DEMO_OTP=true
```

Phone login accepts code **`123456`**. Admin still needs Resend email OTP (or set admin phone after MSG91 is live).
