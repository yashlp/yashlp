/**
 * @deprecated Server-side `/api/payments/access` is the source of truth for paid reports.
 * Local storage helpers remain for legacy demo sessions only.
 */
import type { ReportProductId } from "@/lib/report-demo-data";

const PREFIX = "civiclens_report_paid";

export function reportAccessKey(
  productId: ReportProductId | string,
  lat: number,
  lng: number
): string {
  return `${PREFIX}:${productId}:${lat.toFixed(4)}:${lng.toFixed(4)}`;
}

export async function checkReportAccessFromServer(
  productId: string,
  lat: number,
  lng: number
): Promise<{ paid: boolean; authenticated: boolean }> {
  const res = await fetch(
    `/api/payments/access?productId=${encodeURIComponent(productId)}&lat=${lat}&lng=${lng}`,
    { credentials: "include" }
  );
  const data = await res.json();
  return { paid: Boolean(data.paid), authenticated: Boolean(data.authenticated) };
}
