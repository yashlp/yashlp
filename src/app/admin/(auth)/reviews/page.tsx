import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function ReviewsPage() {
  return (
    <AdminModulePlaceholder
      title="Reviews"
      description="Moderate product reviews — approve, hide, reply, and feature the best ones."
      features={[
        "Pending review queue",
        "Approve or hide reviews",
        "Reply to customers",
        "Feature top reviews on product pages",
      ]}
    />
  );
}
