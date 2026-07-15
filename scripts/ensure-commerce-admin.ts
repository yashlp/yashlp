/**
 * Create or update the commerce platform admin.
 * Runs on every Vercel deploy to keep credentials in sync.
 *
 * Production: COMMERCE_ADMIN_PASSWORD is REQUIRED to create or rotate the password.
 * Without it, an existing admin is left unchanged (never reset to a demo hash).
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "yash.shah.lp2@gmail.com";

const isProdLike =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL === "1" ||
  process.env.VERCEL_ENV === "production";

async function main() {
  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .toLowerCase()
    .trim();
  const name = process.env.COMMERCE_ADMIN_NAME || "Yash Shah";
  const password = process.env.COMMERCE_ADMIN_PASSWORD;
  const existing = await prisma.commerceAdmin.findUnique({ where: { email: adminEmail } });

  if (!password) {
    if (isProdLike) {
      if (!existing) {
        throw new Error(
          "COMMERCE_ADMIN_PASSWORD is required on first production deploy. Set it in Vercel env vars."
        );
      }
      await prisma.commerceAdmin.update({
        where: { email: adminEmail },
        data: { name, role: "SUPER_ADMIN", isActive: true },
      });
      console.log(`Commerce admin kept (password unchanged) for ${adminEmail}`);
      return;
    }

    // Local/dev only: create with a random unusable hash if missing — operator must set password.
    if (!existing) {
      const randomHash = await hashPassword(`dev-bootstrap-${Date.now()}-${Math.random()}`);
      await prisma.commerceAdmin.create({
        data: {
          email: adminEmail,
          name,
          role: "SUPER_ADMIN",
          passwordHash: randomHash,
          mfaEnabled: false,
        },
      });
      console.warn(
        `Created ${adminEmail} with a one-time random password. Set COMMERCE_ADMIN_PASSWORD and re-run to take ownership.`
      );
      return;
    }

    console.log(`Commerce admin exists for ${adminEmail} (no password env — left unchanged)`);
    return;
  }

  const passwordHash = await hashPassword(password);

  await prisma.commerceAdmin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name,
      role: "SUPER_ADMIN",
      isActive: true,
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
