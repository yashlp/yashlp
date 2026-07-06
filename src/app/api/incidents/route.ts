import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { mockAIVerify } from "@/lib/ai";
import { isPhotoRequired } from "@/lib/categories";
import {
  addTimelineEvent,
  findNearbyDuplicate,
  incidentInclude,
  recalculateIncident,
} from "@/lib/incident-service";
import { INCIDENT_STATUSES, MAX_PHOTOS_PER_REPORT, VISIBILITY } from "@/lib/constants";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    where: {
      OR: [
        { visibility: "public" },
        { status: INCIDENT_STATUSES.PENDING },
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ incidents });
}

const createSchema = z.object({
  categoryId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  photoUrls: z.array(z.string()).max(MAX_PHOTOS_PER_REPORT).optional(),
  attachToExisting: z.string().optional(),
});

async function savePhotos(incidentId: string, userId: string, urls: string[]) {
  for (const url of urls.slice(0, MAX_PHOTOS_PER_REPORT)) {
    await prisma.incidentPhoto.create({
      data: { incidentId, url, uploadedBy: userId },
    });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to report" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);
    const photoUrls = data.photoUrls ?? [];

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const photoRule = category.photoRule as "required" | "optional" | "allowed";
    if (isPhotoRequired(photoRule) && photoUrls.length === 0) {
      return NextResponse.json(
        { error: "Photo evidence is required for this category" },
        { status: 400 }
      );
    }

    const isPositive = category.type === "positive";

    const duplicate = data.attachToExisting
      ? await prisma.incident.findUnique({ where: { id: data.attachToExisting } })
      : await findNearbyDuplicate(data.latitude, data.longitude, data.categoryId, isPositive);

    if (duplicate && !data.attachToExisting) {
      return NextResponse.json({
        duplicate: true,
        incident: duplicate,
        message: "Similar incident found nearby. Confirm existing or create new.",
      });
    }

    if (duplicate && data.attachToExisting) {
      await prisma.confirmation.upsert({
        where: { incidentId_userId: { incidentId: duplicate.id, userId: user.id } },
        update: { comment: data.description },
        create: {
          incidentId: duplicate.id,
          userId: user.id,
          comment: data.description,
        },
      });
      if (photoUrls.length > 0) await savePhotos(duplicate.id, user.id, photoUrls);
      await addTimelineEvent(duplicate.id, "confirmation_added", user.id);
      const updated = await recalculateIncident(duplicate.id);
      return NextResponse.json({ incident: updated, merged: true });
    }

    const ai = mockAIVerify(category.slug, photoUrls.length > 0);

    const incident = await prisma.incident.create({
      data: {
        categoryId: data.categoryId,
        reporterId: user.id,
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        isPositive,
        status: INCIDENT_STATUSES.PENDING,
        visibility: VISIBILITY.HIDDEN,
        aiCategoryMatch: ai.aiCategoryMatch,
        aiImageVerified: ai.aiImageVerified,
        confirmationCount: 0,
        confidenceScore: 0.1,
      },
    });

    if (photoUrls.length > 0) await savePhotos(incident.id, user.id, photoUrls);

    await addTimelineEvent(incident.id, "created", user.id, { category: category.slug });

    const full = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: incidentInclude,
    });

    return NextResponse.json({ incident: full, ai });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 });
  }
}
