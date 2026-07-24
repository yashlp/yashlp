/**
 * Production bootstrap for Only Aesthetic — categories, settings, CMS defaults.
 * No demo products, orders, or customer accounts.
 *
 * Run: npm run db:seed-commerce-bootstrap
 *
 * Important: never overwrites values an admin already saved in /admin/settings.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Home", slug: "home", sortOrder: 0 },
  { name: "Wellness", slug: "wellness", sortOrder: 1 },
  { name: "Stationery", slug: "stationery", sortOrder: 2 },
  { name: "Wearables", slug: "wearables", sortOrder: 3 },
  { name: "Lighting", slug: "lighting", sortOrder: 4 },
  { name: "Fragrance", slug: "fragrance", sortOrder: 5 },
];

const SETTINGS = [
  { key: "company_name", value: "Only Aesthetic", group: "company" },
  { key: "company_gst", value: "", group: "tax" },
  { key: "shipping_flat_rate", value: "49", group: "shipping" },
  { key: "free_shipping_threshold", value: "999", group: "shipping" },
  { key: "free_delivery_enabled", value: "false", group: "shipping" },
  { key: "gst_rate", value: "18", group: "tax" },
  { key: "cod_enabled", value: "false", group: "payments" },
  { key: "support_email", value: "yash.shah.lp2@gmail.com", group: "contact" },
  { key: "support_phone", value: "", group: "contact" },
  { key: "site_name", value: "Only Aesthetic", group: "general" },
  { key: "site_url", value: "https://onlyaesthetic.in", group: "general" },
];

/** Migrate old defaults → new defaults without clobbering custom admin values. */
const DEFAULT_MIGRATIONS: { key: string; from: string[]; to: string; group: string }[] = [
  {
    key: "company_name",
    from: ["Only Aesthetics"],
    to: "Only Aesthetic",
    group: "company",
  },
  {
    key: "site_name",
    from: ["Only Aesthetics"],
    to: "Only Aesthetic",
    group: "general",
  },
  {
    key: "support_email",
    from: ["hello@onlyaesthetics.in", "hello@onlyaesthetics.app", "hello@onlyaesthetic.in"],
    to: "yash.shah.lp2@gmail.com",
    group: "contact",
  },
];

async function main() {
  console.log("Bootstrapping Only Aesthetic commerce (no demo catalog)...");

  for (const cat of CATEGORIES) {
    await prisma.commerceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  for (const s of SETTINGS) {
    const existing = await prisma.commerceSetting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await prisma.commerceSetting.create({ data: s });
    }
  }

  for (const m of DEFAULT_MIGRATIONS) {
    const row = await prisma.commerceSetting.findUnique({ where: { key: m.key } });
    if (row && m.from.includes(row.value.trim())) {
      await prisma.commerceSetting.update({
        where: { key: m.key },
        data: { value: m.to, group: m.group },
      });
      console.log(`Migrated ${m.key}: ${row.value} → ${m.to}`);
    }
  }

  const productCount = await prisma.commerceProduct.count({ where: { status: "PUBLISHED" } });
  console.log(`Bootstrap complete. Published products in DB: ${productCount}`);
  console.log("Add real products via /admin/products");
  console.log("Edit brand/contact anytime in /admin/settings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
