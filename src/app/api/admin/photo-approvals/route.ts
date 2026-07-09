import { NextResponse } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { PHOTO_APPROVAL_STATUS } from "@/lib/photo-approval";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? PHOTO_APPROVAL_STATUS.PENDING;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);

    const [incidentPhotos, commentPhotos] = await Promise.all([
      prisma.incidentPhoto.findMany({
        where: { approvalStatus: status },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          incident: {
            select: {
              id: true,
              title: true,
              category: { select: { emoji: true, name: true } },
            },
          },
        },
      }),
      prisma.comment.findMany({
        where: {
          photoUrl: { not: null },
          photoApprovalStatus: status,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          incident: {
            select: {
              id: true,
              title: true,
              category: { select: { emoji: true, name: true } },
            },
          },
        },
      }),
    ]);

    const items = [
      ...incidentPhotos.map((p) => ({
        id: p.id,
        type: "incident_photo" as const,
        url: p.url,
        caption: p.caption,
        approvalStatus: p.approvalStatus,
        createdAt: p.createdAt,
        uploadedBy: p.uploadedBy,
        commentBody: null as string | null,
        user: null as { id: string; name: string; phone: string } | null,
        incident: p.incident,
      })),
      ...commentPhotos.map((c) => ({
        id: c.id,
        type: "comment_photo" as const,
        url: c.photoUrl!,
        caption: null as string | null,
        approvalStatus: c.photoApprovalStatus!,
        createdAt: c.createdAt,
        uploadedBy: c.userId,
        commentBody: c.body,
        user: c.user,
        incident: c.incident,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pendingCounts = await Promise.all([
      prisma.incidentPhoto.count({ where: { approvalStatus: PHOTO_APPROVAL_STATUS.PENDING } }),
      prisma.comment.count({
        where: {
          photoUrl: { not: null },
          photoApprovalStatus: PHOTO_APPROVAL_STATUS.PENDING,
        },
      }),
    ]);

    return NextResponse.json({
      items: items.slice(0, limit),
      pendingCount: pendingCounts[0] + pendingCounts[1],
      reviewedBy: admin.id,
    });
  } catch (e) {
    return adminErrorResponse(e);
  }
}

const patchSchema = z.object({
  id: z.string(),
  type: z.enum(["incident_photo", "comment_photo"]),
  action: z.enum(["approve", "reject"]),
});

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = patchSchema.parse(await req.json());
    const now = new Date();

    if (data.type === "incident_photo") {
      const photo = await prisma.incidentPhoto.findUnique({ where: { id: data.id } });
      if (!photo) {
        return NextResponse.json({ error: "Photo not found" }, { status: 404 });
      }

      const updated = await prisma.incidentPhoto.update({
        where: { id: data.id },
        data: {
          approvalStatus:
            data.action === "approve"
              ? PHOTO_APPROVAL_STATUS.APPROVED
              : PHOTO_APPROVAL_STATUS.REJECTED,
          reviewedAt: now,
          reviewedBy: admin.id,
        },
      });

      return NextResponse.json({ item: updated, type: data.type });
    }

    const comment = await prisma.comment.findUnique({ where: { id: data.id } });
    if (!comment?.photoUrl) {
      return NextResponse.json({ error: "Comment photo not found" }, { status: 404 });
    }

    const updated = await prisma.comment.update({
      where: { id: data.id },
      data: {
        photoApprovalStatus:
          data.action === "approve"
            ? PHOTO_APPROVAL_STATUS.APPROVED
            : PHOTO_APPROVAL_STATUS.REJECTED,
        photoReviewedAt: now,
        photoReviewedBy: admin.id,
      },
    });

    return NextResponse.json({ item: updated, type: data.type });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return adminErrorResponse(e);
  }
}
