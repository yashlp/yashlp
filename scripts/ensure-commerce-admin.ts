/**
 * Create or update the commerce platform admin from env vars.
 * Run: COMMERCE_ADMIN_PASSWORD=... npm run db:ensure-commerce-admin
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || "yash.shah.lp2@gmail.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.COMMERCE_ADMIN_PASSWORD;

  if (!adminPassword) {
    console.log("COMMERCE_ADMIN_PASSWORD not set — skipping commerce admin setup.");
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  const name = process.env.COMMERCE_ADMIN_NAME || "Super Admin";

  await prisma.commerceAdmin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name,
      role: "SUPER_ADMIN",
      isActive: true,
      mfaEnabled: false,
    },
    create: {
      email: adminEmail,
      name,
      role: "SUPER_ADMIN",
      passwordHash,
      mfaEnabled: false,
    },
  });

  console.log(`Commerce admin ready for ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
