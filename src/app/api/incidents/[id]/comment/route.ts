import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addTimelineEvent } from "@/lib/incident-service";
import { PHOTO_APPROVAL_STATUS, sanitizePublicComment } from "@/lib/photo-approval";
import { validatePhotoDataUrls } from "@/lib/photo-validation";

const schema = z.object({
  body: z.string().min(1),
  photoUrl: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = schema.parse(await req.json());

  if (data.photoUrl) {
    const photoCheck = validatePhotoDataUrls([data.photoUrl]);
    if (!photoCheck.ok) {
      return NextResponse.json({ error: photoCheck.error }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      incidentId: id,
      userId: user.id,
      body: data.body,
      photoUrl: data.photoUrl ?? null,
      photoApprovalStatus: data.photoUrl ? PHOTO_APPROVAL_STATUS.PENDING : null,
    },
    include: { user: { select: { name: true } } },
  });

  await addTimelineEvent(id, "comment_added", user.id, {
    hasPhoto: Boolean(data.photoUrl),
    photoPending: Boolean(data.photoUrl),
  });

  return NextResponse.json({
    comment: sanitizePublicComment(comment),
    photoPendingReview: Boolean(data.photoUrl),
  });
}
