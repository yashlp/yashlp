import { Suspense } from "react";
import AccountLoginClient from "./login-client";

export default function AccountLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh aes-site-bg" />}>
      <AccountLoginClient />
    </Suspense>
  );
}
