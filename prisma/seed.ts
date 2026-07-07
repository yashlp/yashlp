import { PrismaClient } from "@prisma/client";
import { ALL_CATEGORIES, getCategoryTtlDays, isPhotoRequired } from "../src/lib/categories";
import { ADMIN_ROLE } from "../src/lib/admin";
import {
  GLOBAL_SAMPLE_PLACES,
  INCIDENT_STATUSES,
  VISIBILITY,
  VISIBILITY_STAGE,
} from "../src/lib/constants";
import { seedDefaultSiteSettings } from "../src/lib/site-settings";

const prisma = new PrismaClient();

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function stageForConfirmations(count: number): string {
  if (count >= 10) return VISIBILITY_STAGE.VERIFIED;
  if (count >= 3) return VISIBILITY_STAGE.SEED;
  return VISIBILITY_STAGE.PRIVATE;
}

function visibilityForStage(stage: string): string {
  if (stage === VISIBILITY_STAGE.VERIFIED) return VISIBILITY.PUBLIC;
  if (stage === VISIBILITY_STAGE.SEED) return VISIBILITY.SEED;
  return VISIBILITY.HIDDEN;
}

async function main() {
  console.log("Seeding CivicLens database...");

  for (const [index, cat] of ALL_CATEGORIES.entries()) {
    const ttlDays = getCategoryTtlDays(cat);
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        emoji: cat.emoji,
        type: cat.type,
        group: cat.group,
        photoRequired: isPhotoRequired(cat.photoRule),
        photoRule: cat.photoRule,
        description: cat.description,
        sortOrder: index,
        ttlDays,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        emoji: cat.emoji,
        type: cat.type,
        group: cat.group,
        photoRequired: isPhotoRequired(cat.photoRule),
        photoRule: cat.photoRule,
        description: cat.description,
        sortOrder: index,
        ttlDays,
      },
    });
  }

  const demoUsers = [
    { phone: "+919876543210", name: "Amara Okafor", reputation: 120, reliabilityScore: 0.85 },
    { phone: "+819012345678", name: "Yuki Tanaka", reputation: 95, reliabilityScore: 0.78 },
    { phone: "+5511987654321", name: "Sofia Mendes", reputation: 210, reliabilityScore: 0.92 },
    { phone: "+919988776655", name: "Demo Admin", reputation: 50, reliabilityScore: 0.7, role: ADMIN_ROLE },
  ];

  await prisma.contentDispute.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  for (const u of demoUsers) {
    const { role, ...rest } = u as typeof u & { role?: string };
    const user = await prisma.user.create({
      data: { ...rest, role: role ?? "user" },
    });
    users.push(user);
  }

  const categories = await prisma.category.findMany({ where: { type: "issue" } });
  const positiveCats = await prisma.category.findMany({ where: { type: "positive" } });

  const citySamples = [
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "potholes-bad-roads", status: INCIDENT_STATUSES.ACTIVE, confirmations: 12, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[1], cat: "no-street-lights", status: INCIDENT_STATUSES.ACTIVE, confirmations: 5, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "open-sewage", status: INCIDENT_STATUSES.PENDING, confirmations: 1, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[3], cat: "clean-street-market", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 4, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[4], cat: "unsafe-buildings", status: INCIDENT_STATUSES.RESOLVED, confirmations: 11, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[5], cat: "clean-park", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 10, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "garbage-pile-up", status: INCIDENT_STATUSES.ACTIVE, confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "road-repaired", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 8, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "broken-footpath-sidewalk", status: INCIDENT_STATUSES.ACTIVE, confirmations: 4, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "broken-public-toilet", status: INCIDENT_STATUSES.ACTIVE, confirmations: 6, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "long-queue-government-office", status: INCIDENT_STATUSES.ACTIVE, confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "no-shade-heat-hazard", status: INCIDENT_STATUSES.ACTIVE, confirmations: 5, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "trusted-street-food-spot", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 12, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "great-community-area", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 11, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "clean-public-toilet", status: INCIDENT_STATUSES.POSITIVE_ACTIVE, confirmations: 7, isPositive: true },
    {
      city: GLOBAL_SAMPLE_PLACES[2],
      cat: "corruption-bribery",
      status: INCIDENT_STATUSES.ACTIVE,
      confirmations: 5,
      isPositive: false,
      compliance: {
        displayLabel: "RTO Office – Service Integrity Reports",
        institutionType: "rto_office",
        servicePoint: "Licensing counter",
        corruptionIssueType: "irregular_practices",
        description:
          "Community members have submitted allegations of irregular service practices at Licensing counter, RTO Office.",
        aggregationText:
          "Multiple users reported irregular practice reports related to Licensing counter at RTO Office.",
      },
    },
  ];

  for (const [i, sample] of citySamples.entries()) {
    const cat = sample.isPositive
      ? positiveCats.find((c) => c.slug === sample.cat)!
      : categories.find((c) => c.slug === sample.cat)!;
    const reporter = users[i % users.length];
    const offset = { lat: (Math.random() - 0.5) * 0.008, lng: (Math.random() - 0.5) * 0.008 };
    const visibilityStage = stageForConfirmations(sample.confirmations);
    const visibility = visibilityForStage(visibilityStage);
    const expiresAt = cat.ttlDays ? addDays(new Date(), cat.ttlDays) : null;

    const compliance = (sample as { compliance?: Record<string, string> }).compliance;

    const incident = await prisma.incident.create({
      data: {
        categoryId: cat.id,
        reporterId: reporter.id,
        title: compliance?.displayLabel ?? `${cat.emoji} ${cat.name}`,
        description: compliance?.description ?? `Community-reported in ${sample.city.name}.`,
        latitude: sample.city.lat + offset.lat,
        longitude: sample.city.lng + offset.lng,
        address: sample.city.name,
        status: sample.status,
        visibility,
        visibilityStage,
        confirmationCount: sample.confirmations,
        confidenceScore:
          visibilityStage === VISIBILITY_STAGE.VERIFIED
            ? 0.88
            : visibilityStage === VISIBILITY_STAGE.SEED
              ? 0.52
              : 0.15,
        isPositive: sample.isPositive,
        aiCategoryMatch: 0.85,
        aiImageVerified: true,
        resolvedAt: sample.status === INCIDENT_STATUSES.RESOLVED ? new Date() : null,
        expiresAt,
        displayLabel: compliance?.displayLabel ?? null,
        institutionType: compliance?.institutionType ?? null,
        servicePoint: compliance?.servicePoint ?? null,
        corruptionIssueType: compliance?.corruptionIssueType ?? null,
        aggregationText: compliance?.aggregationText ?? null,
        contentRiskScore: compliance ? 25 : null,
        complianceAction: compliance ? "publish" : null,
      },
    });

    const confirmers = users.filter((u) => u.id !== reporter.id).slice(0, sample.confirmations);
    for (const confirmer of confirmers) {
      await prisma.confirmation.create({
        data: { incidentId: incident.id, userId: confirmer.id, comment: "Confirmed." },
      });
    }

    await prisma.timelineEvent.create({
      data: {
        incidentId: incident.id,
        userId: reporter.id,
        action: "created",
        metadata: JSON.stringify({ category: cat.slug }),
      },
    });
  }

  await seedDefaultSiteSettings();

  console.log("Seed complete!");
  console.log("Demo admin phone: 919988776655 → OTP: 123456");
  console.log("Admin panel: /admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
