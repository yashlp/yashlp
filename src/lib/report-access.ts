import type { ReportProductId } from "@/lib/report-demo-data";

const PREFIX = "civiclens_report_paid";

export function reportAccessKey(
  productId: ReportProductId | string,
  lat: number,
  lng: number
): string {
  return `${PREFIX}:${productId}:${lat.toFixed(4)}:${lng.toFixed(4)}`;
}

export function markReportPaid(
  productId: ReportProductId | string,
  lat: number,
  lng: number
): void {
  try {
    localStorage.setItem(reportAccessKey(productId, lat, lng), String(Date.now()));
  } catch {
    // ignore storage errors
  }
}

export function hasPaidForReport(
  productId: ReportProductId | string,
  lat: number,
  lng: number
): boolean {
  try {
    return Boolean(localStorage.getItem(reportAccessKey(productId, lat, lng)));
  } catch {
    return false;
  }
}
