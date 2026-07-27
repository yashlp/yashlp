import { prisma } from "@/lib/db";

const PLATFORM_SELLER_SLUG = "only-aesthetic";
const PLATFORM_BRAND_SLUG = "only-aesthetic";

/**
 * D2C storefront needs at least one seller + brand for product FKs.
 * After demo purge, these rows may be missing — recreate on demand.
 */
export async function ensurePlatformSellerBrand(): Promise<{
  sellerId: string;
  brandId: string;
}> {
  const email =
    process.env.COMMERCE_ADMIN_EMAIL?.trim().toLowerCase() || "hello@onlyaesthetic.in";

  let seller = await prisma.commerceSeller.findFirst({
    where: {
      OR: [{ slug: PLATFORM_SELLER_SLUG }, { email }],
    },
    include: { brands: { orderBy: { createdAt: "asc" }, take: 1 } },
  });

  if (!seller) {
    seller = await prisma.commerceSeller.create({
      data: {
        businessName: "Only Aesthetic",
        slug: PLATFORM_SELLER_SLUG,
        email,
        status: "APPROVED",
        verified: true,
        kycStatus: "APPROVED",
        tagline: "Direct-to-consumer house brand",
      },
      include: { brands: { orderBy: { createdAt: "asc" }, take: 1 } },
    });
  }

  let brand = seller.brands[0];
  if (!brand) {
    brand = await prisma.commerceBrand.create({
      data: {
        sellerId: seller.id,
        name: "Only Aesthetic",
        slug: PLATFORM_BRAND_SLUG,
        verified: true,
        tagline: "Because Details Matter",
      },
    });
  }

  return { sellerId: seller.id, brandId: brand.id };
}
