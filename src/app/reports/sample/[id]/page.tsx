import { Suspense } from "react";
import { ReportExperience } from "@/components/report-experience";

function SampleFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
    </div>
  );
}

export default function ReportSamplePage() {
  return (
    <Suspense fallback={<SampleFallback />}>
      <ReportExperience mode="sample" />
    </Suspense>
  );
}
