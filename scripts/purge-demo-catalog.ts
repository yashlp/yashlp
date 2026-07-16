/**
 * Remove demo catalog, orders, and accounts from production.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run db:purge-demo
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_STAFF_EMAILS = [
  "ops@onlyaesthetics.app",
  "catalog@onlyaesthetics.app",
  "fulfillment@onlyaesthetics.app",
  "support@onlyaesthetics.app",
];

async function main() {
  console.log("Purging Only Aesthetics demo data...");

  const demoOrders = await prisma.commerceOrder.findMany({
    where: { orderNumber: { startsWith: "AES-DEMO" } },
    select: { id: true },
  });
  const demoOrderIds = demoOrders.map((o) => o.id);

  if (demoOrderIds.length) {
    await prisma.commerceRefund.deleteMany({ where: { orderId: { in: demoOrderIds } } });
    await prisma.commerceReturn.deleteMany({ where: { orderId: { in: demoOrderIds } } });
    await prisma.commercePayment.deleteMany({ where: { orderId: { in: demoOrderIds } } });
    await prisma.commerceOrderItem.deleteMany({ where: { orderId: { in: demoOrderIds } } });
    await prisma.commerceOrder.deleteMany({ where: { id: { in: demoOrderIds } } });
    console.log(`Removed ${demoOrderIds.length} demo orders`);
  }

  await prisma.commercePurchaseOrder.deleteMany({ where: { poNumber: { startsWith: "PO-DEMO" } } });

  const demoCustomer = await prisma.commerceCustomer.findUnique({ where: { email: "demo@customer.com" } });
  if (demoCustomer) {
    await prisma.commerceCustomerSession.deleteMany({ where: { customerId: demoCustomer.id } });
    await prisma.commerceCustomerAddress.deleteMany({ where: { customerId: demoCustomer.id } });
    await prisma.commerceReview.deleteMany({ where: { customerId: demoCustomer.id } });
    await prisma.commerceOrder.updateMany({ where: { customerId: demoCustomer.id }, data: { customerId: null } });
    await prisma.commerceCustomer.delete({ where: { id: demoCustomer.id } });
    console.log("Removed demo customer");
  }

  const demoProducts = await prisma.commerceProduct.findMany({
    where: {
      OR: [
        { sku: { startsWith: "AES-" } },
        { media: { some: { url: { contains: "unsplash.com" } } } },
      ],
    },
    select: { id: true },
  });
  const demoProductIds = demoProducts.map((p) => p.id);

  if (demoProductIds.length) {
    await prisma.commerceCollectionProduct.deleteMany({ where: { productId: { in: demoProductIds } } });
    await prisma.commerceOrderItem.deleteMany({ where: { productId: { in: demoProductIds } } });
    await prisma.commerceReview.deleteMany({ where: { productId: { in: demoProductIds } } });
    await prisma.commerceProductMedia.deleteMany({ where: { productId: { in: demoProductIds } } });
    await prisma.commerceProduct.deleteMany({ where: { id: { in: demoProductIds } } });
    console.log(`Removed ${demoProductIds.length} demo products`);
  }

  await prisma.commerceCollection.deleteMany({
    where: {
      OR: [
        { slug: { in: ["slow-mornings", "blue-edit", "gifts-under-999", "desk-rituals", "evening-wind-down"] } },
        { products: { none: {} } },
      ],
    },
  });

  for (const email of DEMO_STAFF_EMAILS) {
    await prisma.commerceAdmin.deleteMany({ where: { email } });
  }

  await prisma.commerceCoupon.deleteMany({ where: { code: { startsWith: "DEMO" } } });

  const remaining = await prisma.commerceProduct.count({ where: { status: "PUBLISHED" } });
  console.log(`Purge complete. Published products remaining: ${remaining}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
