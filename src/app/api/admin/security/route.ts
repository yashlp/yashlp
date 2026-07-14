import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { getCommerceAdmin } from "@/lib/commerce/admin-session";

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function GET() {
  try {
    const data = await withAdminAuth("settings:read", async () => {
      const admin = await getCommerceAdmin();
      if (!admin) throw new Error("Unauthorized");
      const full = await prisma.commerceAdmin.findUnique({
        where: { id: admin.id },
        select: {
          id: true,
          email: true,
          mfaEnabled: true,
          ipWhitelist: true,
          sessionTimeoutMins: true,
          lastLoginAt: true,
          lastLoginIp: true,
          backupCodesHash: true,
        },
      });
      const sessions = await prisma.commerceAdminSession.findMany({
        where: { adminId: admin.id, revokedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          userAgent: true,
          ipAddress: true,
          deviceLabel: true,
          createdAt: true,
          expiresAt: true,
        },
      });
      const loginHistory = await prisma.commerceLoginAttempt.findMany({
        where: { email: admin.email },
        orderBy: { createdAt: "desc" },
        take: 30,
      });
      return {
        admin: {
          ...full,
          hasBackupCodes: Boolean(full?.backupCodesHash),
          backupCodesHash: undefined,
        },
        sessions,
        loginHistory,
      };
    });
    return NextResponse.json(data);
  } catch (error) {
    return commerceApiError(error);
  }
}

const patchSchema = z.object({
  action: z.enum([
    "enable_mfa",
    "disable_mfa",
    "set_ip_whitelist",
    "set_session_timeout",
    "generate_backup_codes",
    "revoke_session",
    "force_logout_all",
  ]),
  ipWhitelist: z.array(z.string()).optional(),
  sessionTimeoutMins: z.number().int().min(15).max(10080).optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = patchSchema.parse(await req.json());
    const result = await withAdminAuth("settings:write", async () => {
      const admin = await getCommerceAdmin();
      if (!admin) throw new Error("Unauthorized");

      if (body.action === "enable_mfa") {
        await prisma.commerceAdmin.update({
          where: { id: admin.id },
          data: { mfaEnabled: true },
        });
        return { ok: true, message: "Email OTP MFA enabled for login." };
      }

      if (body.action === "disable_mfa") {
        await prisma.commerceAdmin.update({
          where: { id: admin.id },
          data: { mfaEnabled: false },
        });
        return { ok: true, message: "MFA disabled." };
      }

      if (body.action === "set_ip_whitelist") {
        await prisma.commerceAdmin.update({
          where: { id: admin.id },
          data: {
            ipWhitelist: body.ipWhitelist?.length ? JSON.stringify(body.ipWhitelist) : null,
          },
        });
        return { ok: true, message: "IP whitelist updated." };
      }

      if (body.action === "set_session_timeout") {
        await prisma.commerceAdmin.update({
          where: { id: admin.id },
          data: { sessionTimeoutMins: body.sessionTimeoutMins ?? 720 },
        });
        return { ok: true, message: "Session timeout updated." };
      }

      if (body.action === "generate_backup_codes") {
        const codes = Array.from({ length: 8 }, () =>
          randomBytes(4).toString("hex").toUpperCase()
        );
        const hashed = codes.map(hashCode);
        await prisma.commerceAdmin.update({
          where: { id: admin.id },
          data: { backupCodesHash: JSON.stringify(hashed) },
        });
        return {
          ok: true,
          message: "Save these backup codes now — they won’t be shown again.",
          backupCodes: codes,
        };
      }

      if (body.action === "revoke_session" && body.sessionId) {
        await prisma.commerceAdminSession.updateMany({
          where: { id: body.sessionId, adminId: admin.id },
          data: { revokedAt: new Date() },
        });
        return { ok: true, message: "Session revoked." };
      }

      if (body.action === "force_logout_all") {
        await prisma.commerceAdminSession.updateMany({
          where: { adminId: admin.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        return { ok: true, message: "All sessions revoked. Sign in again on each device." };
      }

      return { ok: false, message: "Unknown action" };
    });
    return NextResponse.json(result);
  } catch (error) {
    return commerceApiError(error);
  }
}
