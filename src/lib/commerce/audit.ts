import { prisma } from "@/lib/db";
import { getRequestMeta } from "./admin-session";

export async function writeAuditLog(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const meta = await getRequestMeta();
  await prisma.commerceAuditLog.create({
    data: {
      adminId,
      action,
      entityType,
      entityId,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      ipAddress: meta.ipAddress,
    },
  });
}
