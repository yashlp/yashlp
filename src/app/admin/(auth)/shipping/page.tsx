import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function ShippingPage() {
  return (
    <AdminModulePlaceholder
      title="Shipping"
      description="Courier integration, labels, and tracking — ship orders you pack from your warehouse."
      features={[
        "Auto-generate shipping labels",
        "Courier selection (Delhivery, Shiprocket, etc.)",
        "Tracking updates to customers",
        "Pickup scheduling",
        "Shipping reports",
      ]}
    />
  );
}
