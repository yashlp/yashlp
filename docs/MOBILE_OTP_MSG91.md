# Only Aesthetic — mobile OTP (MSG91)

Phone login uses `/api/commerce/auth/phone/send-otp` and needs SMS in production.

## Vercel env (project **onlyaesthetic**)

```text
SMS_PROVIDER=msg91
SMS_API_KEY=<MSG91 Auth Key>
SMS_SENDER_ID=<approved 6-char sender, e.g. ONLYAE>
ALLOW_DEMO_OTP=false
```

Then **Redeploy**.

## MSG91 setup (India)

1. Create / open [MSG91](https://msg91.com) account and complete KYC
2. Create an **OTP** flow / template (DLT approved if required)
3. Copy **Auth Key**
4. Use an approved **Sender ID** (6 characters)
5. Paste into Vercel → onlyaesthetic → Environment Variables → Production
6. Redeploy

## Temporary demo (no SMS yet)

```text
ALLOW_DEMO_OTP=true
```

Redeploy, then use OTP **`123456`** on phone login.  
Turn this **off** (`false`) once MSG91 works.

## Test

1. Open https://onlyaesthetic.in/aesthetics/account/login
2. Choose **Phone**
3. Enter a 10-digit Indian mobile
4. You should receive SMS (or use `123456` if demo OTP is on)
