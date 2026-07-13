import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function CollectionsPage() {
  return (
    <AdminModulePlaceholder
      title="Collections"
      description="Curated edits that reinforce the Only Aesthetics brand — Blue Edit, Desk Goals, Gifts Under ₹999."
      features={[
        "Create and publish collections",
        "Drag-and-drop product ordering",
        "Homepage featured collections",
        "Seasonal and campaign edits",
      ]}
    />
  );
}
