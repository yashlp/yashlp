/**
 * Create or update the commerce platform admin.
 * Runs on every Vercel deploy to keep credentials in sync.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "yash.shah.lp2@gmail.com";

async function main() {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .toLowerCase()
    .trim();

  if (isProd && !process.env.COMMERCE_ADMIN_PASSWORD?.trim()) {
    throw new Error(
      "COMMERCE_ADMIN_PASSWORD must be set in production. Refusing to deploy with a demo admin password."
    );
  }

  const passwordHash = process.env.COMMERCE_ADMIN_PASSWORD
    ? await hashPassword(process.env.COMMERCE_ADMIN_PASSWORD)
    : await hashPassword("ChangeMeBeforeLaunch!");

  const name = process.env.COMMERCE_ADMIN_NAME || "Yash Shah";

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

  await prisma.commerceLoginAttempt.deleteMany({
    where: { email: adminEmail, success: false },
  });

  console.log(`Commerce admin ready for ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
