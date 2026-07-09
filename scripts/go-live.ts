/**
 * Apply customer-ready site settings on the production database.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run db:go-live
 */
import { PrismaClient } from "@prisma/client";
import { SITE_SETTING_KEYS } from "../src/lib/site-setting-keys";
import { CUSTOMER_LAUNCH_ANNOUNCEMENT } from "../src/lib/site-settings";

async function main() {
  const prisma = new PrismaClient();

  const updates: Record<string, string> = {
    [SITE_SETTING_KEYS.DEMO_MODE]: "false",
    [SITE_SETTING_KEYS.MAINTENANCE_MODE]: "false",
    [SITE_SETTING_KEYS.ANNOUNCEMENT]: CUSTOMER_LAUNCH_ANNOUNCEMENT,
  };

  for (const [key, value] of Object.entries(updates)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`✓ ${key} = ${value === CUSTOMER_LAUNCH_ANNOUNCEMENT ? "(launch message)" : value}`);
  }

  await prisma.$disconnect();
  console.log("\nCivicLens is configured for customer traffic.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
