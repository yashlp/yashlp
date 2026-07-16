/**
 * Production bootstrap for Only Aesthetics — categories, settings, CMS defaults.
 * No demo products, orders, or customer accounts.
 *
 * Run: npm run db:seed-commerce-bootstrap
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
  { key: "company_name", value: "Only Aesthetics", group: "company" },
  { key: "company_gst", value: "", group: "tax" },
  { key: "shipping_flat_rate", value: "49", group: "shipping" },
  { key: "free_shipping_threshold", value: "999", group: "shipping" },
  { key: "free_delivery_enabled", value: "false", group: "shipping" },
  { key: "gst_rate", value: "18", group: "tax" },
  { key: "cod_enabled", value: "false", group: "payments" },
  { key: "support_email", value: "hello@onlyaesthetics.in", group: "contact" },
  { key: "site_name", value: "Only Aesthetics", group: "general" },
  { key: "site_url", value: "https://onlyaesthetics.in", group: "general" },
];

async function main() {
  console.log("Bootstrapping Only Aesthetics commerce (no demo catalog)...");

  for (const cat of CATEGORIES) {
    await prisma.commerceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  for (const s of SETTINGS) {
    await prisma.commerceSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  const productCount = await prisma.commerceProduct.count({ where: { status: "PUBLISHED" } });
  console.log(`Bootstrap complete. Published products in DB: ${productCount}`);
  console.log("Add real products via /admin/products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
