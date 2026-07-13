import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function ReturnsPage() {
  return (
    <AdminModulePlaceholder
      title="Returns & Refunds"
      description="Handle customer return requests, approve refunds, and manage replacement orders."
      features={[
        "Return requests queue",
        "Refund approval workflow",
        "Return reasons and product condition",
        "Replacement order creation",
        "Restock on return",
      ]}
    />
  );
}
