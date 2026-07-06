import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ALL_CATEGORIES } from "../src/lib/categories";
import { DEFAULT_MAP_CENTER } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PlacePulse database...");

  for (const [index, cat] of ALL_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        emoji: cat.emoji,
        type: cat.type,
        photoRequired: cat.photoRequired,
        description: cat.description,
        sortOrder: index,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        emoji: cat.emoji,
        type: cat.type,
        photoRequired: cat.photoRequired,
        description: cat.description,
        sortOrder: index,
      },
    });
  }

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const demoUsers = [
    { email: "alex@placepulse.demo", name: "Alex Rivera", reputation: 120, reliabilityScore: 0.85 },
    { email: "sam@placepulse.demo", name: "Sam Chen", reputation: 95, reliabilityScore: 0.78 },
    { email: "jordan@placepulse.demo", name: "Jordan Lee", reputation: 210, reliabilityScore: 0.92 },
    { email: "demo@placepulse.app", name: "Demo User", reputation: 50, reliabilityScore: 0.7 },
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

  const offsets = [
    { lat: 0.002, lng: 0.003 },
    { lat: -0.004, lng: 0.001 },
    { lat: 0.003, lng: -0.005 },
    { lat: -0.002, lng: -0.003 },
    { lat: 0.006, lng: 0.002 },
    { lat: -0.005, lng: 0.004 },
    { lat: 0.001, lng: 0.006 },
    { lat: 0.004, lng: -0.002 },
  ];

  await prisma.incident.deleteMany();

  const sampleIncidents = [
    { cat: "pothole", status: "active", visibility: "public", confirmations: 4, isPositive: false },
    { cat: "streetlight-out", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { cat: "graffiti", status: "pending", visibility: "hidden", confirmations: 1, isPositive: false },
    { cat: "clean-street", status: "active", visibility: "public", confirmations: 3, isPositive: true },
    { cat: "broken-sidewalk", status: "resolved", visibility: "public", confirmations: 5, isPositive: false },
    { cat: "park-beautified", status: "active", visibility: "public", confirmations: 4, isPositive: true },
    { cat: "overflowing-trash", status: "active", visibility: "public", confirmations: 3, isPositive: false },
    { cat: "pothole-repaired", status: "active", visibility: "public", confirmations: 3, isPositive: true },
  ];

  for (const [i, sample] of sampleIncidents.entries()) {
    const cat = sample.isPositive
      ? positiveCats.find((c) => c.slug === sample.cat)!
      : categories.find((c) => c.slug === sample.cat)!;
    const reporter = users[i % users.length];
    const offset = offsets[i % offsets.length];

    const incident = await prisma.incident.create({
      data: {
        categoryId: cat.id,
        reporterId: reporter.id,
        title: `${cat.emoji} ${cat.name}`,
        description: `Community-reported ${cat.name.toLowerCase()} near downtown.`,
        latitude: DEFAULT_MAP_CENTER.lat + offset.lat,
        longitude: DEFAULT_MAP_CENTER.lng + offset.lng,
        address: `Block ${i + 1}, Community District`,
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
        metadata: JSON.stringify({ category: cat.slug }),
      },
    });

    if (sample.status === "resolved") {
      await prisma.resolutionUpdate.create({
        data: {
          incidentId: incident.id,
          userId: users[1].id,
          description: "Sidewalk panels replaced and area is safe now.",
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

  console.log("Seed complete!");
  console.log("Demo login: demo@placepulse.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
