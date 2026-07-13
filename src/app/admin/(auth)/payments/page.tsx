import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function PaymentsPage() {
  return (
    <AdminModulePlaceholder
      title="Payments"
      description="Track money in — UPI, cards, net banking, and COD for Only Aesthetics orders."
      features={[
        "Successful and failed payments",
        "Refund processing",
        "Daily revenue",
        "GST collected",
        "Razorpay / Stripe reconciliation",
      ]}
    />
  );
}
