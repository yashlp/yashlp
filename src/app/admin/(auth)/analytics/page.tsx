import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function AnalyticsPage() {
  return (
    <AdminModulePlaceholder
      title="Analytics"
      description="Revenue, gross profit, inventory velocity, and customer behavior for your D2C store."
      features={[
        "Revenue and gross profit",
        "Best-selling and slow-moving products",
        "Customer repeat rate",
        "Cart abandonment",
        "Average order value",
        "Monthly growth charts",
      ]}
    />
  );
}
