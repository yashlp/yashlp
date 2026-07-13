import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function MarketingPage() {
  return (
    <AdminModulePlaceholder
      title="Marketing"
      description="Coupons, flash sales, homepage banners, and customer outreach."
      features={[
        "Coupon codes and discounts",
        "Flash sales",
        "Homepage banner management",
        "Email campaigns",
        "WhatsApp / push notifications",
      ]}
    />
  );
}
