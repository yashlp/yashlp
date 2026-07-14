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
- To show signed-in experiences like My Space and review posting
- Never to sell your personal data

**Your choices**
- Update or delete account details from My account
- Contact hello@onlyaesthetics.app for data requests

Last updated: 2026`,
  },
  terms: {
    title: "Terms of Service",
    body: `By shopping at Only Aesthetics you agree to these terms.

**Orders**
- Orders are confirmed once payment succeeds
- Product colours may vary slightly by screen
- We may cancel or refund orders if stock is unavailable

**Accounts**
- You’re responsible for keeping login details secure
- Reviews must be genuine experiences with our products

**Intellectual property**
- Product photography and site content belong to Only Aesthetics and our makers

Contact: hello@onlyaesthetics.app`,
  },
  refund_policy: {
    title: "Refund Policy",
    body: `We want every piece to feel right at home.

**Eligibility**
- Unused items in original packaging within 7 days of delivery
- Defective or damaged items reported within 48 hours of delivery with photos

**Process**
1. Start a return from Track Order or email hello@onlyaesthetics.app
2. We’ll share a prepaid label when approved
3. Refunds are issued to the original payment method within 5–7 business days after inspection

**Non-returnable**
- Final-sale / clearance items marked as such
- Personalized or made-to-order pieces`,
  },
  shipping_policy: {
    title: "Shipping Policy",
    body: `**Delivery**
- Free standard shipping on orders over ₹999
- Standard delivery: 3–7 business days across India
- You’ll receive tracking once your order ships

**Packaging**
- Protective, mood-first packaging designed for fragile objects
- Gift notes available on request at checkout

**Delays**
- Weather and courier events can add 1–2 days — we’ll keep you updated by email/SMS`,
  },
  faqs: {
    title: "FAQs",
    body: `**Do I need an account to checkout?**
No — guest checkout is available. Sign in if you want My Space, faster reorders, and reviews.

**How do returns work?**
Unused items can be returned within 7 days. See our Return Policy for details.

**Are payments secure?**
Yes. We use trusted payment partners (including Razorpay) with encrypted checkout. Cards and UPI are never stored on our servers.

**Can I leave a product review?**
Yes — sign in, open the product page after you receive your order, and share a photo + description. Reviews appear after moderation.

**How do I track an order?**
Use Track Order with your order number and email, or check confirmation messages.`,
  },
  careers: {
    title: "Careers",
    body: `We’re a small team building a calmer way to shop design objects.

Open roles and internships are shared occasionally. Send a short note + portfolio to hello@onlyaesthetics.app with the subject “Careers”.`,
  },
  become_a_maker: {
    title: "Become a Maker",
    body: `We partner with makers who care about materials, mood, and finish.

**What we look for**
- Small-batch or studio production
- Clear materials + dimensions
- Photography that shows the object honestly

Apply: hello@onlyaesthetics.app with “Become a Maker” in the subject.`,
  },
};
