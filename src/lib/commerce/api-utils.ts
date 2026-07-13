import { NextResponse } from "next/server";
import { CommerceAuthError } from "./admin-session";
import { CommerceForbiddenError } from "./rbac";
import { ZodError } from "zod";

export function commerceApiError(error: unknown) {
  if (error instanceof CommerceAuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof CommerceForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof Error) {
    if (error.message.includes("Invalid") || error.message.includes("Cannot")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  console.error("[Commerce API]", error);
  return NextResponse.json({ error: "Request failed" }, { status: 500 });
}

export async function withAdminAuth<T>(
  permission: import("./constants").Permission,
  handler: (admin: import("./admin-session").CommerceAdminUser) => Promise<T>
) {
  const { requireCommerceAdmin } = await import("./admin-session");
  const { requirePermission } = await import("./rbac");
  const admin = await requireCommerceAdmin();
  requirePermission(admin.role, permission);
  return handler(admin);
}
