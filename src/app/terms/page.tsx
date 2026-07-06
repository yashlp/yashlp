import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — CivicLens",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 pb-24">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to CivicLens
      </Link>

      <h1 className="text-3xl font-bold text-stone-900">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: July 6, 2026</p>

      <div className="prose prose-stone mt-8 max-w-none space-y-6 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-lg font-semibold text-stone-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CivicLens (&quot;the Service&quot;), you agree to be bound by these
            Terms & Conditions. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">2. Description of Service</h2>
          <p>
            CivicLens is a global community intelligence platform that allows users to report civic
            issues, share positive community signals, verify incidents, and access place-based
            insights. The Service is available worldwide and uses open map data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">3. User Responsibilities</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Provide accurate, honest, and good-faith contributions.</li>
            <li>Do not submit false reports, spam, or abusive content.</li>
            <li>Do not impersonate others or manipulate verification systems.</li>
            <li>Respect the privacy of individuals in photos you upload.</li>
            <li>Comply with all applicable local laws in your jurisdiction.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">4. Location Data</h2>
          <p>
            CivicLens uses your device location to place reports on the map and calculate Community
            Health Scores. You may deny location access, but some features will be limited. Location
            data is stored with your reports and used to provide area intelligence.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">5. Community Verification</h2>
          <p>
            Reports require community confirmation before becoming highly trusted. CivicLens does not
            guarantee the accuracy of user-submitted content. AI-assisted checks supplement but do
            not replace community judgment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">6. Intellectual Property</h2>
          <p>
            You retain ownership of content you submit but grant CivicLens a worldwide, non-exclusive
            license to display, store, and analyze your contributions for the purpose of operating
            the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">7. Privacy</h2>
          <p>
            We collect account information, location data, and user-generated content. We do not sell
            personal data. Aggregated, anonymized data may be used for analytics and enterprise
            products. Contact us to request data deletion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">8. Limitation of Liability</h2>
          <p>
            CivicLens is provided &quot;as is.&quot; We are not liable for decisions made based on
            community data, map inaccuracies, or third-party map tile providers. The Service is not
            an official government reporting channel.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">9. Termination</h2>
          <p>
            We may suspend or terminate accounts that violate these terms. You may delete your
            account at any time by contacting support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">10. Changes</h2>
          <p>
            We may update these terms. Continued use after changes constitutes acceptance. Material
            changes will be communicated through the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">11. Contact</h2>
          <p>
            Questions about these terms: <strong>legal@civiclens.app</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
