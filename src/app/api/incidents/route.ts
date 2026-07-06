import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { CACHE_PUBLIC_SHORT, jsonWithCache } from "@/lib/api-cache";
import { getSessionUser } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/api-security";
import { mockAIVerify } from "@/lib/ai";
import { isPhotoRequired } from "@/lib/categories";
import {
  getLegalProfile,
  resolveProfileForCountry,
} from "@/lib/legal-engine";
import { processCompliance } from "@/lib/compliance";
import { assessEvidence } from "@/lib/compliance/evidenceEngine";
import { penalizeBlockedReport } from "@/lib/compliance/trustService";
import {
  addTimelineEvent,
  findNearbyDuplicate,
  getExpiresAtForCategory,
  incidentInclude,
  recalculateIncident,
} from "@/lib/incident-service";
import { validatePhotoDataUrls } from "@/lib/photo-validation";
import {
  INCIDENT_STATUSES,
  MAX_PHOTOS_PER_REPORT,
  VISIBILITY,
  VISIBILITY_STAGE,
} from "@/lib/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includePrivate = searchParams.get("includePrivate") === "true";
  const now = new Date();

  const incidents = await prisma.incident.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      ...(includePrivate
        ? {}
        : {
            visibilityStage: {
              in: [VISIBILITY_STAGE.SEED, VISIBILITY_STAGE.VERIFIED],
            },
            underLegalReview: false,
          }),
    },
    select: {
      id: true,
      title: true,
      latitude: true,
      longitude: true,
      status: true,
      visibilityStage: true,
      displayLabel: true,
      underLegalReview: true,
      confidenceScore: true,
      confirmationCount: true,
      isPositive: true,
      category: { select: { emoji: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return jsonWithCache({ incidents }, CACHE_PUBLIC_SHORT);
}

const createSchema = z.object({
  categoryId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  photoUrls: z.array(z.string()).max(MAX_PHOTOS_PER_REPORT).optional(),
  attachToExisting: z.string().optional(),
  institutionType: z.string().optional(),
  servicePoint: z.string().optional(),
  corruptionIssueType: z.string().optional(),
});

async function savePhotos(incidentId: string, userId: string, urls: string[]) {
  for (const url of urls.slice(0, MAX_PHOTOS_PER_REPORT)) {
    await prisma.incidentPhoto.create({
      data: { incidentId, url, uploadedBy: userId },
    });
  }
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "incidents-create", 15, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to report" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);
    const photoUrls = data.photoUrls ?? [];

    if (photoUrls.length > 0) {
      const photoCheck = validatePhotoDataUrls(photoUrls);
      if (!photoCheck.ok) {
        return NextResponse.json({ error: photoCheck.error }, { status: 400 });
      }
    }

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

    const profileId = user.legalProfile
      ? (user.legalProfile as Parameters<typeof getLegalProfile>[0])
      : resolveProfileForCountry(user.countryCode ?? "INT");
    const legalProfile = getLegalProfile(profileId);

    const evidence = assessEvidence({
      hasPhoto: photoUrls.length > 0,
      photoCount: photoUrls.length,
      latitude: data.latitude,
      longitude: data.longitude,
      pinLatitude: data.latitude,
      pinLongitude: data.longitude,
      categorySlug: category.slug,
    });

    const compliance = processCompliance({
      categorySlug: category.slug,
      title: data.title,
      description: data.description,
      institutionType: data.institutionType,
      servicePoint: data.servicePoint,
      corruptionIssueType: data.corruptionIssueType,
      hasPhoto: photoUrls.length > 0,
      photoCount: photoUrls.length,
      userTrustScore: user.reliabilityScore,
      legalProfileId: legalProfile.id,
      countryCode: user.countryCode ?? undefined,
      evidenceScore: evidence.evidenceScore,
      evidenceFlags: evidence.flags,
    });

    if (compliance.action === "block" || compliance.originalBlocked) {
      await penalizeBlockedReport(user.id);
      return NextResponse.json(
        {
          error:
            compliance.blockReason ??
            "This report was blocked by our legal safety filter. Use location-based wording only — do not name individuals or make unverified accusations.",
          compliance,
        },
        { status: 422 }
      );
    }

    const expiresAt = getExpiresAtForCategory(category);
    const underReview =
      compliance.underReview || compliance.action === "under_review" || compliance.action === "limit_visibility";

    const incident = await prisma.incident.create({
      data: {
        categoryId: data.categoryId,
        reporterId: user.id,
        title: compliance.sanitizedTitle || `${category.emoji} ${category.name}`,
        description: compliance.sanitizedDescription || data.description,
        originalDescription: data.description ?? null,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        isPositive,
        status: underReview ? INCIDENT_STATUSES.UNDER_REVIEW : INCIDENT_STATUSES.PENDING,
        visibility: VISIBILITY.HIDDEN,
        visibilityStage: VISIBILITY_STAGE.PRIVATE,
        aiCategoryMatch: ai.aiCategoryMatch,
        aiImageVerified: ai.aiImageVerified,
        confirmationCount: 0,
        confidenceScore: 0.1,
        expiresAt,
        legalRiskScore: compliance.legalRiskScore,
        contentRiskScore: compliance.contentRiskScore,
        complianceAction: compliance.action,
        underLegalReview: underReview,
        legalFlags: compliance.flags.length ? JSON.stringify(compliance.flags) : null,
        displayLabel: compliance.displayLabel,
        institutionType: compliance.institutionType ?? null,
        servicePoint: compliance.servicePoint ?? null,
        corruptionIssueType: compliance.corruptionIssueType ?? null,
        aggregationText: compliance.aggregationText ?? null,
      },
    });

    if (underReview) {
      await addTimelineEvent(incident.id, "legal_review", user.id, {
        flags: compliance.flags,
        contentRiskScore: compliance.contentRiskScore,
        action: compliance.action,
      });
    }

    if (photoUrls.length > 0) await savePhotos(incident.id, user.id, photoUrls);

    await addTimelineEvent(incident.id, "created", user.id, { category: category.slug });

    const full = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: incidentInclude,
    });

    return NextResponse.json({ incident: full, ai, compliance, evidence });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 });
  }
}
