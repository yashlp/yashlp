import { DEFAULT_BRAND_NAME, DEFAULT_SUPPORT_EMAIL } from "@/lib/commerce/brand-defaults";

export type PolicyPage = {
  title: string;
  body: string;
};

export function buildPolicyContent(input?: {
  siteName?: string;
  supportEmail?: string;
}): Record<string, PolicyPage> {
  const brand = input?.siteName?.trim() || DEFAULT_BRAND_NAME;
  const email = input?.supportEmail?.trim() || DEFAULT_SUPPORT_EMAIL;

  return {
    privacy: {
      title: "Privacy Policy",
      body: `We collect only what we need to fulfill orders, support your account, and improve ${brand}.

**What we collect**
- Contact and shipping details you provide at checkout
- Account email / phone if you sign in
- Order history and product reviews you submit
- Basic analytics (pages viewed, device type) to keep the store fast and useful

**How we use it**
- To process payments, ship orders, and handle returns
- To show signed-in experiences like favourites, orders, and reviews
- Never to sell your personal data

**Payments**
- Card, UPI, and wallet payments are processed by Razorpay
- We do not store full card numbers on our servers

**Your choices**
- Update account details from My account
- Email ${email} for access, correction, or deletion requests

**Contact**
${email}

Last updated: July 2026`,
    },
    shipping_returns: {
      title: "Shipping & Returns",
      body: `**Shipping**
- Free standard shipping on orders over ₹999
- Flat rate of ₹49 on orders below ₹999
- Standard delivery: 3–7 business days across India (metro areas often faster)
- You’ll receive tracking once your order ships

**Pre-orders**
- Many pieces are available by pre-order while we make or source the next batch
- Estimated ship windows are confirmed at checkout and in your order email

**Packaging**
- Protective packaging designed for fragile objects
- Gift wrap is available at checkout where offered

**Returns**
- Most unused items can be returned within 7 days of delivery
- Email ${email} with your order number (or start a return from My account when signed in)
- Refunds are issued to the original payment method after inspection

Contact: ${email}`,
    },
    faq: {
      title: "FAQ",
      body: `**Where do you ship?**
India only for now.

**How long does delivery take?**
Usually 3–7 business days after dispatch.

**Can I return an item?**
Yes — see Shipping & Returns. Email ${email} if you need help.

**How do I contact you?**
Email ${email} — we usually reply within one business day.`,
    },
    terms: {
      title: "Terms of Service",
      body: `By shopping at ${brand} you agree to these terms.

**Orders**
- Placing an order is an offer to buy; we confirm by email when payment succeeds
- Prices are in INR and include applicable taxes shown at checkout

**Accounts**
- You’re responsible for keeping login details secure
- We may refuse or cancel orders that look fraudulent

**Content**
- Product photography and site content belong to ${brand} and our makers

Contact: ${email}`,
    },
  };
}

/** Static fallback for metadata / offline pages */
export const DEFAULT_POLICY_CONTENT = buildPolicyContent();
