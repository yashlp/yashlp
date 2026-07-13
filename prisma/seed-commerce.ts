/**
 * Seed Aesthetics commerce catalog — run: npm run db:seed-commerce
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Home", slug: "home", sortOrder: 0 },
  { name: "Wellness", slug: "wellness", sortOrder: 1 },
  { name: "Stationery", slug: "stationery", sortOrder: 2 },
  { name: "Wearables", slug: "wearables", sortOrder: 3 },
  { name: "Lighting", slug: "lighting", sortOrder: 4 },
  { name: "Fragrance", slug: "fragrance", sortOrder: 5 },
];

const SELLERS = [
  { businessName: "Atelier Lumen", slug: "atelier-lumen", email: "hello@atelierlumen.com", tagline: "Sculptural ceramics" },
  { businessName: "Nocturne Studio", slug: "nocturne-studio", email: "hi@nocturnestudio.com", tagline: "Light as atmosphere" },
  { businessName: "Field Notes Co.", slug: "field-notes-co", email: "shop@fieldnotesco.com", tagline: "Paper for wandering minds" },
  { businessName: "Lune Atelier", slug: "lune-atelier", email: "studio@luneatelier.com", tagline: "Irregular beauty" },
];

const PRODUCTS = [
  {
    name: "Cloud Vessel",
    slug: "cloud-vessel",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "home",
    price: 68,
    description: "Hand-thrown ceramic with an impossible curve — like holding a slow exhale.",
    shortDescription: "soft brutalism",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    tags: ["sculptural", "minimal", "soft"],
    mood: "calm",
    materials: ["ceramic", "glaze"],
    colors: ["ivory", "dusty blue"],
    featured: true,
    newArrival: true,
    stock: 24,
  },
  {
    name: "Midnight Taper Set",
    slug: "midnight-taper-set",
    sellerSlug: "nocturne-studio",
    brandName: "Nocturne Studio",
    categorySlug: "lighting",
    price: 34,
    description: "Indigo-dipped beeswax tapers that burn like a memory you can't place.",
    shortDescription: "candlelit nostalgia",
    image: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=1200&q=80",
    tags: ["vintage", "dreamy", "cozy"],
    mood: "romantic",
    materials: ["beeswax"],
    colors: ["royal blue"],
    featured: true,
    stock: 50,
  },
  {
    name: "Moss Journal",
    slug: "moss-journal",
    sellerSlug: "field-notes-co",
    brandName: "Field Notes Co.",
    categorySlug: "stationery",
    price: 28,
    description: "Linen-bound pages with deckled edges. For thoughts that grow slowly.",
    shortDescription: "forest floor energy",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20842fd0?w=1200&q=80",
    tags: ["botanical", "minimal", "artisan"],
    mood: "earthy",
    materials: ["linen", "cotton paper"],
    colors: ["sage"],
    newArrival: true,
    stock: 100,
  },
  {
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    sellerSlug: "lune-atelier",
    brandName: "Lune Atelier",
    categorySlug: "wearables",
    price: 92,
    compareAtPrice: 118,
    description: "Baroque pearls on brushed silver — irregular on purpose.",
    shortDescription: "moonlit minimal",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
    tags: ["dreamy", "soft", "artisan"],
    mood: "romantic",
    materials: ["pearl", "silver"],
    colors: ["pearl"],
    featured: true,
    stock: 15,
  },
  {
    name: "Weighted Silk Eye Mask",
    slug: "weighted-silk-eye-mask",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "wellness",
    price: 44,
    description: "Cool-touch silk with lavender seed weight. Dreams optional.",
    shortDescription: "sleep as ritual",
    image: "https://images.unsplash.com/photo-1515377901643-4697fd6f54c9?w=1200&q=80",
    tags: ["soft", "cozy", "dreamy"],
    mood: "calm",
    materials: ["silk"],
    colors: ["dusty blue"],
    featured: true,
    stock: 40,
  },
  {
    name: "Arc Floor Lamp",
    slug: "arc-floor-lamp",
    sellerSlug: "nocturne-studio",
    brandName: "Nocturne Studio",
    categorySlug: "lighting",
    price: 240,
    description: "A single arc of brushed steel — light as sculpture, not utility.",
    shortDescription: "gallery at home",
    image: "https://images.unsplash.com/photo-1507473889451-b8932f4a0b2c?w=1200&q=80",
    tags: ["sculptural", "minimal"],
    mood: "modern",
    materials: ["steel"],
    colors: ["steel"],
    stock: 8,
  },
];

async function main() {
  console.log("Seeding Aesthetics commerce...");

  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || "yash.shah.lp2@gmail.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.COMMERCE_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await hashPassword(adminPassword);

  await prisma.commerceAdmin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      passwordHash,
      mfaEnabled: false,
    },
  });

  for (const cat of CATEGORIES) {
    await prisma.commerceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.commerceCategory.findMany()).map((c) => [c.slug, c.id])
  );

  const sellerMap: Record<string, string> = {};
  const brandMap: Record<string, string> = {};
  const supplierMap: Record<string, string> = {};

  for (const s of SELLERS) {
    const seller = await prisma.commerceSeller.upsert({
      where: { slug: s.slug },
      update: { status: "APPROVED", verified: true, kycStatus: "APPROVED" },
      create: {
        ...s,
        status: "APPROVED",
        verified: true,
        kycStatus: "APPROVED",
      },
    });
    sellerMap[s.slug] = seller.id;

    const brandSlug = s.slug;
    const brand = await prisma.commerceBrand.upsert({
      where: { slug: brandSlug },
      update: { verified: true },
      create: {
        sellerId: seller.id,
        name: s.businessName,
        slug: brandSlug,
        tagline: s.tagline,
        verified: true,
      },
    });
    brandMap[s.businessName] = brand.id;

    const supplier = await prisma.commerceSupplier.upsert({
      where: { slug: s.slug },
      update: { brandName: s.businessName, status: "ACTIVE" },
      create: {
        brandName: s.businessName,
        slug: s.slug,
        email: s.email,
        contactPerson: "Procurement",
        status: "ACTIVE",
        productCategories: JSON.stringify(["home", "wellness"]),
      },
    });
    supplierMap[s.slug] = supplier.id;
  }

  for (const p of PRODUCTS) {
    await prisma.commerceProduct.upsert({
      where: { slug: p.slug },
      update: {
        purchaseCost: p.price * 0.45,
        supplierId: supplierMap[p.sellerSlug],
        minStock: 5,
        warehouseLocation: "WH-A1",
      },
      create: {
        sellerId: sellerMap[p.sellerSlug],
        brandId: brandMap[p.brandName],
        categoryId: categoryMap[p.categorySlug],
        supplierId: supplierMap[p.sellerSlug],
        purchaseCost: p.price * 0.45,
        minStock: 5,
        warehouseLocation: "WH-A1",
        purchaseDate: new Date(),
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        tags: JSON.stringify(p.tags),
        mood: p.mood,
        materials: JSON.stringify(p.materials),
        colors: JSON.stringify(p.colors),
        status: "PUBLISHED",
        approvalStatus: "APPROVED",
        isFeatured: p.featured || false,
        isNewArrival: p.newArrival || false,
        publishedAt: new Date(),
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 100) + 10,
        media: {
          create: [{ type: "IMAGE", url: p.image, sortOrder: 0 }],
        },
      },
    });
  }

  await prisma.commerceCollection.upsert({
    where: { slug: "slow-mornings" },
    update: {},
    create: {
      title: "Slow Mornings",
      slug: "slow-mornings",
      description: "Objects that make waking up feel intentional",
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&q=80",
      isFeatured: true,
      isPublished: true,
    },
  });

  const DEMO_COLLECTIONS = [
    { title: "Blue Edit", slug: "blue-edit", description: "Royal blues and calm tones for your space", sortOrder: 1 },
    { title: "Desk Goals", slug: "desk-goals", description: "Stationery and objects for focused work", sortOrder: 2 },
    { title: "Cozy Corners", slug: "cozy-corners", description: "Warm textures for slow evenings", sortOrder: 3 },
    { title: "Gifts Under ₹999", slug: "gifts-under-999", description: "Thoughtful picks that won't break the bank", sortOrder: 4 },
    { title: "New This Week", slug: "new-this-week", description: "Fresh arrivals at Only Aesthetics", sortOrder: 5 },
  ];

  for (const col of DEMO_COLLECTIONS) {
    await prisma.commerceCollection.upsert({
      where: { slug: col.slug },
      update: col,
      create: { ...col, isFeatured: true, isPublished: true },
    });
  }

  const collection = await prisma.commerceCollection.findUnique({ where: { slug: "slow-mornings" } });
  const wellnessProduct = await prisma.commerceProduct.findUnique({ where: { slug: "weighted-silk-eye-mask" } });
  if (collection && wellnessProduct) {
    await prisma.commerceCollectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collection.id, productId: wellnessProduct.id } },
      update: {},
      create: { collectionId: collection.id, productId: wellnessProduct.id, sortOrder: 0 },
    });
  }

  // Sample orders for dashboard
  const customer = await prisma.commerceCustomer.upsert({
    where: { email: "demo@customer.com" },
    update: {},
    create: { email: "demo@customer.com", name: "Demo Customer", status: "ACTIVE" },
  });

  const existingOrders = await prisma.commerceOrder.count();
  if (existingOrders === 0) {
    const product = await prisma.commerceProduct.findFirst();
    if (product) {
      await prisma.commerceOrder.create({
        data: {
          orderNumber: `AES-${Date.now()}`,
          customerId: customer.id,
          sellerId: product.sellerId,
          status: "DELIVERED",
          subtotal: product.price,
          total: product.price,
          currency: "INR",
          items: {
            create: [{
              productId: product.id,
              quantity: 1,
              unitPrice: product.price,
              total: product.price,
            }],
          },
          payments: {
            create: {
              amount: product.price,
              status: "SUCCESS",
              provider: "cod",
              currency: "INR",
            },
          },
        },
      });

      // Demo orders in various workflow states
      const products = await prisma.commerceProduct.findMany({ take: 3 });
      const statuses = ["CONFIRMED", "PACKED", "SHIPPED"] as const;
      for (let i = 0; i < statuses.length && products[i]; i++) {
        const p = products[i];
        await prisma.commerceOrder.create({
          data: {
            orderNumber: `AES-DEMO-${statuses[i]}`,
            customerId: customer.id,
            status: statuses[i],
            subtotal: p.price,
            total: p.price,
            currency: "INR",
            shippingAddress: "Demo Customer\nMumbai, MH 400001",
            items: {
              create: [{ productId: p.id, quantity: 1, unitPrice: p.price, total: p.price }],
            },
            payments: {
              create: { amount: p.price, status: "SUCCESS", provider: "cod", currency: "INR" },
            },
          },
        });
      }
    }
  }

  // Demo purchase order
  const firstSupplier = await prisma.commerceSupplier.findFirst();
  const firstProduct = await prisma.commerceProduct.findFirst();
  if (firstSupplier && firstProduct) {
    const existingPo = await prisma.commercePurchaseOrder.findFirst();
    if (!existingPo) {
      await prisma.commercePurchaseOrder.create({
        data: {
          poNumber: "PO-DEMO-001",
          supplierId: firstSupplier.id,
          status: "ORDERED",
          paymentStatus: "PENDING",
          subtotal: 5000,
          total: 5000,
          lines: {
            create: [{
              productId: firstProduct.id,
              name: firstProduct.name,
              sku: firstProduct.sku,
              quantityOrdered: 20,
              unitCost: 250,
              total: 5000,
            }],
          },
        },
      });
    }
  }

  // Demo return request
  const returnOrder = await prisma.commerceOrder.findFirst({ where: { status: "DELIVERED" } });
  if (returnOrder) {
    const existingReturn = await prisma.commerceReturn.findFirst();
    if (!existingReturn) {
      await prisma.commerceReturn.create({
        data: {
          orderId: returnOrder.id,
          reason: "Product not as described",
          status: "REQUESTED",
          type: "REFUND",
        },
      });
    }
  }

  const CONTENT_PAGES = [
    { key: "homepage_tagline", type: "TEXT", title: "Tagline", body: "Curated objects for intentional living" },
    { key: "about", type: "PAGE", title: "About Only Aesthetics", body: "We source beautiful objects from small makers and bring them to you — one curated store, shipped with care." },
    { key: "shipping_policy", type: "PAGE", title: "Shipping Policy", body: "Free shipping on orders above ₹999. Standard delivery 3–7 business days across India." },
    { key: "refund_policy", type: "PAGE", title: "Refund Policy", body: "Returns accepted within 7 days for unused items in original packaging." },
  ];

  for (const page of CONTENT_PAGES) {
    await prisma.commerceContent.upsert({
      where: { key: page.key },
      update: page,
      create: { ...page, isPublished: true },
    });
  }

  const SETTINGS = [
    { key: "company_name", value: "Only Aesthetics", group: "company" },
    { key: "company_gst", value: "27AAAAA0000A1Z5", group: "tax" },
    { key: "shipping_flat_rate", value: "49", group: "shipping" },
    { key: "free_shipping_threshold", value: "999", group: "shipping" },
    { key: "gst_rate", value: "18", group: "tax" },
    { key: "cod_enabled", value: "true", group: "payments" },
    { key: "support_email", value: "hello@onlyaesthetics.in", group: "contact" },
  ];

  for (const s of SETTINGS) {
    await prisma.commerceSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  await prisma.commerceSetting.upsert({
    where: { key: "site_name" },
    update: { value: "Only Aesthetics" },
    create: { key: "site_name", value: "Only Aesthetics", group: "general" },
  });

  console.log("Commerce seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
