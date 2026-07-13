import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function ContentPage() {
  return (
    <AdminModulePlaceholder
      title="Content"
      description="Edit storefront pages without code — About, FAQs, policies, and homepage copy."
      features={[
        "Homepage sections",
        "About Us and Contact",
        "FAQs",
        "Privacy, Terms, Refund, and Shipping policies",
      ]}
    />
  );
}
