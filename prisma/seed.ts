import { PrismaClient } from "@prisma/client";
import { ALL_CATEGORIES, isPhotoRequired } from "../src/lib/categories";
import { GLOBAL_SAMPLE_PLACES } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CivicLens database...");

  for (const [index, cat] of ALL_CATEGORIES.entries()) {
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
      },
    });
  }

  const demoUsers = [
    { phone: "+919876543210", name: "Amara Okafor", reputation: 120, reliabilityScore: 0.85 },
    { phone: "+819012345678", name: "Yuki Tanaka", reputation: 95, reliabilityScore: 0.78 },
    { phone: "+5511987654321", name: "Sofia Mendes", reputation: 210, reliabilityScore: 0.92 },
    { phone: "+919988776655", name: "Demo User", reputation: 50, reliabilityScore: 0.7 },
  ];

  await prisma.incident.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  for (const u of demoUsers) {
    const user = await prisma.user.create({ data: u });
    users.push(user);
  }

  const categories = await prisma.category.findMany({ where: { type: "issue" } });
  const positiveCats = await prisma.category.findMany({ where: { type: "positive" } });

  const citySamples = [
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "potholes-bad-roads", status: "active", visibility: "public", confirmations: 4, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[1], cat: "no-street-lights", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "open-sewage", status: "pending", visibility: "hidden", confirmations: 1, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[3], cat: "clean-street-market", status: "positive_active", visibility: "public", confirmations: 3, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[4], cat: "unsafe-buildings", status: "resolved", visibility: "public", confirmations: 5, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[5], cat: "clean-park", status: "positive_active", visibility: "public", confirmations: 4, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "garbage-pile-up", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "road-repaired", status: "positive_active", visibility: "public", confirmations: 3, isPositive: true },
  ];

  for (const [i, sample] of citySamples.entries()) {
    const cat = sample.isPositive
      ? positiveCats.find((c) => c.slug === sample.cat)!
      : categories.find((c) => c.slug === sample.cat)!;
    const reporter = users[i % users.length];
    const offset = { lat: (Math.random() - 0.5) * 0.008, lng: (Math.random() - 0.5) * 0.008 };

    const incident = await prisma.incident.create({
      data: {
        categoryId: cat.id,
        reporterId: reporter.id,
        title: `${cat.emoji} ${cat.name}`,
        description: `Community-reported in ${sample.city.name}.`,
        latitude: sample.city.lat + offset.lat,
        longitude: sample.city.lng + offset.lng,
        address: sample.city.name,
        status: sample.status,
        visibility: sample.visibility,
        confirmationCount: sample.confirmations,
        confidenceScore: Math.min(sample.confirmations / 3, 1) * 0.7 + 0.2,
        isPositive: sample.isPositive,
        aiCategoryMatch: 0.85,
        aiImageVerified: true,
        resolvedAt: sample.status === "resolved" ? new Date() : null,
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

  console.log("Seed complete!");
  console.log("Demo phone: 919988776655 → OTP: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
