import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function DiscountsPage() {
  return (
    <AdminModulePlaceholder
      title="Discounts"
      description="Manage coupon codes, automatic discounts, gift cards, and referral rewards."
      features={[
        "Coupon codes with limits and validity windows",
        "Automatic cart-level and collection-level discounts",
        "Gift card issue + redemption tracking",
        "Referral reward rules and payout tracking",
      ]}
    />
  );
}
