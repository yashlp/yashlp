import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ALL_CATEGORIES, isPhotoRequired } from "../src/lib/categories";
import { GLOBAL_SAMPLE_PLACES } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CivicLens database with 39 issues + 17 positive signals...");

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

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const demoUsers = [
    { email: "amara@civiclens.demo", name: "Amara Okafor", reputation: 120, reliabilityScore: 0.85 },
    { email: "yuki@civiclens.demo", name: "Yuki Tanaka", reputation: 95, reliabilityScore: 0.78 },
    { email: "sofia@civiclens.demo", name: "Sofia Mendes", reputation: 210, reliabilityScore: 0.92 },
    { email: "demo@civiclens.app", name: "Demo User", reputation: 50, reliabilityScore: 0.7 },
  ];

  const users = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, reputation: u.reputation, reliabilityScore: u.reliabilityScore },
      create: { ...u, passwordHash },
    });
    users.push(user);
  }

  const categories = await prisma.category.findMany({ where: { type: "issue" } });
  const positiveCats = await prisma.category.findMany({ where: { type: "positive" } });

  await prisma.incident.deleteMany();

  const citySamples = [
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "potholes-bad-roads", status: "active", visibility: "public", confirmations: 4, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[1], cat: "no-street-lights", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "open-sewage", status: "pending", visibility: "hidden", confirmations: 1, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[3], cat: "clean-street-market", status: "positive_active", visibility: "public", confirmations: 3, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[4], cat: "unsafe-buildings", status: "resolved", visibility: "public", confirmations: 5, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[5], cat: "clean-park", status: "positive_active", visibility: "public", confirmations: 4, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[0], cat: "garbage-pile-up", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[2], cat: "road-repaired", status: "positive_active", visibility: "public", confirmations: 3, isPositive: true },
    { city: GLOBAL_SAMPLE_PLACES[1], cat: "water-logging-flooding", status: "disputed", visibility: "public", confirmations: 2, isPositive: false },
    { city: GLOBAL_SAMPLE_PLACES[3], cat: "volunteer-activity", status: "positive_active", visibility: "public", confirmations: 3, isPositive: true },
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
        description: `Community-reported ${cat.name.toLowerCase()} in ${sample.city.name}.`,
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
        data: {
          incidentId: incident.id,
          userId: confirmer.id,
          comment: "I can confirm this — I saw it too.",
        },
      });
    }

    await prisma.timelineEvent.create({
      data: {
        incidentId: incident.id,
        userId: reporter.id,
        action: "created",
        metadata: JSON.stringify({ category: cat.slug, city: sample.city.name }),
      },
    });

    if (sample.status === "resolved") {
      await prisma.resolutionUpdate.create({
        data: {
          incidentId: incident.id,
          userId: users[1].id,
          description: "Issue has been fixed and verified by the community.",
          status: "confirmed",
          confirmationCount: 2,
        },
      });
      await prisma.timelineEvent.create({
        data: {
          incidentId: incident.id,
          userId: users[1].id,
          action: "resolved",
        },
      });
    }
  }

  console.log(`Seeded ${ALL_CATEGORIES.length} categories and ${citySamples.length} global demo incidents.`);
  console.log("Demo login: demo@civiclens.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
