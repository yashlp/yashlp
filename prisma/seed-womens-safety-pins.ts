/**
 * Append women's safety categories + Mumbai demo pins without wiping existing data.
 * Run: DATABASE_URL="..." npm run db:seed-safety
 */
import { PrismaClient } from "@prisma/client";
import { ALL_CATEGORIES, getCategoryTtlDays, isPhotoRequired } from "../src/lib/categories";
import {
  GLOBAL_SAMPLE_PLACES,
  INCIDENT_STATUSES,
  VISIBILITY,
  VISIBILITY_STAGE,
} from "../src/lib/constants";

const prisma = new PrismaClient();

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];

const SAFETY_SAMPLES = [
  {
    cat: "harassment-points",
    isPositive: false,
    status: INCIDENT_STATUSES.ACTIVE,
    confirmations: 7,
    offset: { lat: 0.038, lng: -0.009 },
    title: "Andheri metro exit – evening safety reports",
    description:
      "Multiple community reports describe discomfort near this stretch after dark. Reports are location-based patterns only.",
  },
  {
    cat: "unsafe-unlit-areas",
    isPositive: false,
    status: INCIDENT_STATUSES.ACTIVE,
    confirmations: 5,
    offset: { lat: -0.002, lng: 0.03 },
    title: "Unlit stretch near Ghatkopar station",
    description: "Poor street lighting reported on this walking path after sunset.",
  },
  {
    cat: "police-booth",
    isPositive: true,
    status: INCIDENT_STATUSES.POSITIVE_ACTIVE,
    confirmations: 9,
    offset: { lat: -0.136, lng: -0.043 },
    title: "Police help post – Colaba / CST area",
    description: "Visible police booth with regular patrol presence.",
  },
  {
    cat: "women-help-desk",
    isPositive: true,
    status: INCIDENT_STATUSES.POSITIVE_ACTIVE,
    confirmations: 8,
    offset: { lat: 0.01, lng: 0.031 },
    title: "Women's help desk – Ghatkopar metro",
    description: "Dedicated women's safety help counter reported at this station area.",
  },
  {
    cat: "safe-walking-zone",
    isPositive: true,
    status: INCIDENT_STATUSES.POSITIVE_ACTIVE,
    confirmations: 10,
    offset: { lat: -0.133, lng: -0.055 },
    title: "Marine Drive promenade – safe evening walk",
    description: "Well-lit promenade with steady footfall until late evening.",
  },
];

async function main() {
  console.log("Upserting women's safety categories…");
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

  let reporter = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!reporter) {
    reporter = await prisma.user.findFirst();
  }
  if (!reporter) {
    throw new Error("No users in database — run db:seed first.");
  }

  const confirmers = await prisma.user.findMany({
    where: { id: { not: reporter.id } },
    take: 3,
  });

  for (const sample of SAFETY_SAMPLES) {
    const existing = await prisma.incident.count({
      where: { category: { slug: sample.cat }, address: { contains: "Mumbai" } },
    });
    if (existing > 0) {
      console.log(`Skip ${sample.cat} — Mumbai pin already exists`);
      continue;
    }

    const category = await prisma.category.findUnique({ where: { slug: sample.cat } });
    if (!category) continue;

    const incident = await prisma.incident.create({
      data: {
        categoryId: category.id,
        reporterId: reporter.id,
        title: sample.title,
        description: sample.description,
        latitude: MUMBAI.lat + sample.offset.lat,
        longitude: MUMBAI.lng + sample.offset.lng,
        address: `${sample.title}, Mumbai, India`,
        countryCode: MUMBAI.countryCode,
        status: sample.status,
        visibility: VISIBILITY.PUBLIC,
        visibilityStage: VISIBILITY_STAGE.VERIFIED,
        confirmationCount: sample.confirmations,
        confidenceScore: 0.88,
        isPositive: sample.isPositive,
        displayLabel: sample.title,
        aggregationText: sample.description,
        contentRiskScore: sample.cat === "harassment-points" ? 25 : null,
        complianceAction: sample.cat === "harassment-points" ? "publish" : null,
      },
    });

    for (const confirmer of confirmers.slice(0, Math.min(sample.confirmations, confirmers.length))) {
      await prisma.confirmation.create({
        data: { incidentId: incident.id, userId: confirmer.id, comment: "Confirmed." },
      });
    }

    console.log(`Added pin: ${sample.cat}`);
  }

  console.log("Women's safety seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
