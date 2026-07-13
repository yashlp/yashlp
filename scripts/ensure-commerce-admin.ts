/**
 * Create or update the commerce platform admin.
 * Runs on every Vercel deploy to keep credentials in sync.
 *
 * Priority: COMMERCE_ADMIN_PASSWORD env → built-in demo hash for preview.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "yash.shah.lp2@gmail.com";

/** bcrypt hash for the preview admin password — override via COMMERCE_ADMIN_PASSWORD in production */
const DEMO_PASSWORD_HASH =
  "$2b$12$LL3.6YlwuiDVU8l8ZnnRxeOkHAjaRgEjHYLtxTIxOsysNG5Dvm3K2";

async function main() {
  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .toLowerCase()
    .trim();

  const passwordHash = process.env.COMMERCE_ADMIN_PASSWORD
    ? await hashPassword(process.env.COMMERCE_ADMIN_PASSWORD)
    : DEMO_PASSWORD_HASH;

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

  // Clear lockout from previous failed attempts
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
