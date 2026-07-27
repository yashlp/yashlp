import { AdminModulePlaceholder } from "@/components/aesthetics/admin/admin-module-placeholder";

export default function CampaignsPage() {
  return (
    <AdminModulePlaceholder
      title="Campaigns"
      description="Run and track email, WhatsApp, Instagram, influencer, and affiliate campaigns."
      features={[
        "Email campaign drafts and send history",
        "WhatsApp campaign templates and click metrics",
        "Instagram campaign links and attribution",
        "Influencer management with deal and payout notes",
        "Affiliate tracking links and commission reports",
      ]}
    />
  );
}
