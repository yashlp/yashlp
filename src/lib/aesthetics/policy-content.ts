export type PolicyPage = {
  title: string;
  body: string;
};

export const DEFAULT_POLICY_CONTENT: Record<string, PolicyPage> = {
  privacy: {
    title: "Privacy Policy",
    body: `We collect only what we need to fulfill orders, support your account, and improve Only Aesthetics.

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
- Email hello@onlyaesthetics.app for access, correction, or deletion requests

**Contact**
hello@onlyaesthetics.app

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

**Returns — eligibility**
- Unused items in original packaging within 7 days of delivery
- Defective or damaged items reported within 48 hours of delivery with clear photos

**Returns — process**
1. Email hello@onlyaesthetics.app with your order number (or start a return from My account when signed in)
2. We’ll share a prepaid label when the return is approved
3. Refunds go to the original payment method within 5–7 business days after inspection

**Non-returnable**
- Final-sale / clearance items marked as such
- Personalized or made-to-order pieces
- Items showing use, wear, or missing packaging

**Delays**
- Weather and courier events can add 1–2 days — we’ll keep you updated by email

Contact: hello@onlyaesthetics.app`,
  },
  faqs: {
    title: "FAQ",
    body: `**Do I need an account to checkout?**
No — guest checkout is available. Create an account if you want favourites, faster reorders, and reviews.

**How do payments work?**
We accept online payments only (UPI, cards, net banking, wallets) via Razorpay. Cash on delivery is not available.

**Are products ready to ship?**
Many pieces are currently available by pre-order. Timelines are shown at checkout so you know when to expect your order.

**How long does shipping take?**
Standard delivery is typically 3–7 business days across India. Free shipping applies on orders above ₹999.

**How do returns work?**
Unused items can be returned within 7 days of delivery. See Shipping & Returns for full details.

**Can I leave a product review?**
Yes — sign in, open the product page, and share your experience (photo optional). Reviews appear after a quick moderation check.

**How do I track an order?**
Use the confirmation email, or check My account when you’re signed in.

**How do I contact you?**
Email hello@onlyaesthetics.app — we usually reply within one business day.`,
  },
  terms: {
    title: "Terms of Service",
    body: `By shopping at Only Aesthetics you agree to these terms.

**Orders**
- Orders are confirmed once online payment succeeds
- Product colours may vary slightly by screen
- We may cancel or refund orders if stock is unavailable

**Accounts**
- You’re responsible for keeping login details secure
- Reviews must reflect genuine experiences with our products

**Intellectual property**
- Product photography and site content belong to Only Aesthetics and our makers

Contact: hello@onlyaesthetics.app`,
  },
};
