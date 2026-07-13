import { Suspense } from "react";
import SearchPageClient from "./search-client";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh aes-site-bg" />}>
      <SearchPageClient />
    </Suspense>
  );
}
