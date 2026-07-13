import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function SettingsPage() {
  return (
    <AdminModulePlaceholder
      title="Settings"
      description="Business configuration — GST, payment gateways, shipping rates, and notifications."
      features={[
        "GST and tax settings",
        "Company details",
        "Payment gateway (Razorpay, Stripe)",
        "Shipping rates and zones",
        "Bank account and invoices",
        "Email and WhatsApp templates",
      ]}
    />
  );
}
