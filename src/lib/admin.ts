import { NextResponse } from "next/server";
import { getSessionUser, normalizePhone, requireUser, type SessionUser } from "./auth";

export const ADMIN_ROLE = "admin";

export function getAdminPhones(): string[] {
  const raw = process.env.ADMIN_PHONES ?? "";
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      try {
        return normalizePhone(p);
      } catch {
        return null;
      }
    })
    .filter((p): p is string => Boolean(p));
}

export function isAdmin(user: { role: string } | null | undefined): boolean {
  return user?.role === ADMIN_ROLE;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!isAdmin(user)) {
    throw new AdminForbiddenError();
  }
  return user;
}

export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return isAdmin(user) ? user : null;
}

export class AdminForbiddenError extends Error {
  constructor() {
    super("Admin access required");
    this.name = "AdminForbiddenError";
  }
}

export function adminErrorResponse(error: unknown) {
  if (error instanceof AdminForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  console.error(error);
  return NextResponse.json({ error: "Admin request failed" }, { status: 500 });
}
