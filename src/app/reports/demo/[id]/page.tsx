import { Suspense } from "react";
import { ReportDemoClient } from "./report-demo-client";

function ReportDemoFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
    </div>
  );
}

export default function ReportDemoPage() {
  return (
    <Suspense fallback={<ReportDemoFallback />}>
      <ReportDemoClient />
    </Suspense>
  );
}
