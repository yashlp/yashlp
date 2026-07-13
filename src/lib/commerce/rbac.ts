import type { AdminRole, Permission } from "./constants";
import { ROLE_PERMISSIONS } from "./constants";

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as AdminRole];
  if (!perms) return false;
  if ((perms as readonly string[]).includes("*")) return true;
  return (perms as readonly Permission[]).includes(permission);
}

export function requirePermission(role: string, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new CommerceForbiddenError(`Missing permission: ${permission}`);
  }
}

export class CommerceForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "CommerceForbiddenError";
  }
}
