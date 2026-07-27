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
    const flat = error.flatten();
    const firstField = Object.entries(flat.fieldErrors).find(([, msgs]) => msgs?.length)?.[1]?.[0];
    const firstForm = flat.formErrors[0];
    return NextResponse.json(
      {
        error: firstField || firstForm || "Validation failed",
        details: flat,
      },
      { status: 400 }
    );
  }
  if (error instanceof Error) {
    const msg = error.message;
    if (
      msg.includes("Invalid") ||
      msg.includes("Cannot") ||
      msg.includes("Missing file") ||
      msg.includes("Unsupported") ||
      msg.includes("must be") ||
      msg.includes("Upload")
    ) {
      return NextResponse.json({ error: msg }, { status: 400 });
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
