/**
 * Seed Only Aesthetics commerce demo data.
 * Idempotent — safe to run on every deploy (upserts by slug / code / order number).
 *
 * Run: npm run db:seed-commerce
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/commerce/password";

const prisma = new PrismaClient();

const DEMO_ADMIN_PASSWORD_HASH =
  "$2b$12$LL3.6YlwuiDVU8l8ZnnRxeOkHAjaRgEjHYLtxTIxOsysNG5Dvm3K2";

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

type ProductSeed = {
  name: string;
  slug: string;
  sku: string;
  sellerSlug: string;
  brandName: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  tags: string[];
  mood: string;
  materials: string[];
  colors: string[];
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  recommended?: boolean;
  room?: string;
  style?: string;
  dimensions?: string;
  stock: number;
  minStock?: number;
  warehouseLocation?: string;
};

/** INR prices — tuned for GST, shipping threshold (₹999), and gift collection demos */
const PRODUCTS: ProductSeed[] = [
  {
    name: "Cloud Vessel",
    slug: "cloud-vessel",
    sku: "AES-001",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "home",
    price: 2899,
    description: "Hand-thrown ceramic with an impossible curve — like holding a slow exhale.",
    shortDescription: "soft brutalism",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    tags: ["sculptural", "minimal", "soft"],
    mood: "calm",
    materials: ["ceramic", "glaze"],
    colors: ["ivory", "dusty blue"],
    featured: true,
    newArrival: true,
    bestseller: true,
    recommended: true,
    room: "living-room",
    style: "Minimal",
    dimensions: "18 × 14 cm",
    stock: 24,
    minStock: 5,
    warehouseLocation: "WH-A1",
  },
  {
    name: "Midnight Taper Set",
    slug: "midnight-taper-set",
    sku: "AES-002",
    sellerSlug: "nocturne-studio",
    brandName: "Nocturne Studio",
    categorySlug: "lighting",
    price: 799,
    description: "Indigo-dipped beeswax tapers that burn like a memory you can't place.",
    shortDescription: "candlelit nostalgia",
    image: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=1200&q=80",
    tags: ["vintage", "dreamy", "cozy", "scent", "candle"],
    mood: "romantic",
    materials: ["beeswax"],
    colors: ["royal blue"],
    featured: true,
    bestseller: true,
    room: "coffee-corner",
    style: "Vintage",
    dimensions: "25 cm each",
    stock: 50,
    minStock: 8,
    warehouseLocation: "WH-B2",
  },
  {
    name: "Moss Journal",
    slug: "moss-journal",
    sku: "AES-003",
    sellerSlug: "field-notes-co",
    brandName: "Field Notes Co.",
    categorySlug: "stationery",
    price: 499,
    description: "Linen-bound pages with deckled edges. For thoughts that grow slowly.",
    shortDescription: "forest floor energy",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20842fd0?w=1200&q=80",
    tags: ["botanical", "minimal", "artisan"],
    mood: "earthy",
    materials: ["linen", "cotton paper"],
    colors: ["sage"],
    newArrival: true,
    recommended: true,
    room: "workspace",
    style: "Japandi",
    dimensions: "A5",
    stock: 100,
    minStock: 15,
    warehouseLocation: "WH-C1",
  },
  {
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    sku: "AES-004",
    sellerSlug: "lune-atelier",
    brandName: "Lune Atelier",
    categorySlug: "wearables",
    price: 3999,
    compareAtPrice: 4999,
    description: "Baroque pearls on brushed silver — irregular on purpose.",
    shortDescription: "moonlit minimal",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
    tags: ["dreamy", "soft", "artisan"],
    mood: "romantic",
    materials: ["pearl", "silver"],
    colors: ["pearl"],
    featured: true,
    trending: true,
    stock: 15,
    minStock: 3,
    warehouseLocation: "WH-D1",
  },
  {
    name: "Weighted Silk Eye Mask",
    slug: "weighted-silk-eye-mask",
    sku: "AES-005",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "wellness",
    price: 1299,
    description: "Cool-touch silk with lavender seed weight. Dreams optional.",
    shortDescription: "sleep as ritual",
    image: "https://images.unsplash.com/photo-1515377901643-4697fd6f54c9?w=1200&q=80",
    tags: ["soft", "cozy", "dreamy"],
    mood: "calm",
    materials: ["silk"],
    colors: ["dusty blue"],
    featured: true,
    bestseller: true,
    room: "bedroom",
    style: "Minimal",
    dimensions: "22 × 11 cm",
    stock: 40,
    minStock: 10,
    warehouseLocation: "WH-A2",
  },
  {
    name: "Arc Floor Lamp",
    slug: "arc-floor-lamp",
    sku: "AES-006",
    sellerSlug: "nocturne-studio",
    brandName: "Nocturne Studio",
    categorySlug: "lighting",
    price: 9999,
    description: "A single arc of brushed steel — light as sculpture, not utility.",
    shortDescription: "gallery at home",
    image: "https://images.unsplash.com/photo-1507473889451-b8932f4a0b2c?w=1200&q=80",
    tags: ["sculptural", "minimal"],
    mood: "modern",
    materials: ["steel"],
    colors: ["steel"],
    recommended: true,
    room: "living-room",
    style: "Modern",
    dimensions: "180 cm arc",
    stock: 8,
    minStock: 2,
    warehouseLocation: "WH-B1",
  },
  {
    name: "Lavender Room Mist",
    slug: "lavender-room-mist",
    sku: "AES-007",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "fragrance",
    price: 699,
    description: "Steam-distilled lavender with a hint of vetiver. One spritz, slower breath.",
    shortDescription: "evening unwind",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
    tags: ["botanical", "calm", "scent", "fragrance"],
    mood: "calm",
    materials: ["glass", "essential oils"],
    colors: ["lavender"],
    newArrival: true,
    room: "bedroom",
    style: "Botanical",
    dimensions: "100 ml",
    stock: 60,
    minStock: 12,
    warehouseLocation: "WH-A3",
  },
  {
    name: "Brass Desk Tray",
    slug: "brass-desk-tray",
    sku: "AES-008",
    sellerSlug: "field-notes-co",
    brandName: "Field Notes Co.",
    categorySlug: "stationery",
    price: 1499,
    description: "Hand-hammered brass tray for pens, clips, and small ambitions.",
    shortDescription: "desk goals",
    image: "https://images.unsplash.com/photo-1586075010923-2dd457f8e0f8?w=1200&q=80",
    tags: ["minimal", "artisan"],
    mood: "focused",
    materials: ["brass"],
    colors: ["gold"],
    trending: true,
    room: "workspace",
    style: "Minimal",
    dimensions: "28 × 18 cm",
    stock: 22,
    minStock: 5,
    warehouseLocation: "WH-C2",
  },
  {
    name: "Linen Throw Blanket",
    slug: "linen-throw-blanket",
    sku: "AES-009",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "home",
    price: 2499,
    description: "Washed linen in oatmeal — gets softer with every slow Sunday.",
    shortDescription: "cozy corners",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    tags: ["cozy", "soft"],
    mood: "calm",
    materials: ["linen"],
    colors: ["oatmeal"],
    featured: true,
    bestseller: true,
    room: "living-room",
    style: "Cozy",
    dimensions: "140 × 200 cm",
    stock: 18,
    minStock: 4,
    warehouseLocation: "WH-A4",
  },
  {
    name: "Silk Scrunchie Trio",
    slug: "silk-scrunchie-trio",
    sku: "AES-010",
    sellerSlug: "lune-atelier",
    brandName: "Lune Atelier",
    categorySlug: "wearables",
    price: 399,
    description: "Three silk scrunchies in blush, ivory, and midnight. Low stock demo item.",
    shortDescription: "everyday luxe",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200&q=80",
    tags: ["soft", "gift"],
    mood: "playful",
    materials: ["silk"],
    colors: ["blush", "ivory", "midnight"],
    stock: 3,
    minStock: 10,
    warehouseLocation: "WH-D2",
  },
  {
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    sku: "AES-011",
    sellerSlug: "atelier-lumen",
    brandName: "Atelier Lumen",
    categorySlug: "home",
    price: 899,
    description: "Matte ceramic dripper and carafe for unhurried mornings.",
    shortDescription: "slow mornings",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    tags: ["cozy", "minimal"],
    mood: "calm",
    materials: ["ceramic"],
    colors: ["sand"],
    recommended: true,
    room: "coffee-corner",
    style: "Japandi",
    dimensions: "dripper + 600 ml carafe",
    stock: 35,
    minStock: 8,
    warehouseLocation: "WH-A1",
  },
  {
    name: "Cobalt Table Vase",
    slug: "cobalt-table-vase",
    sku: "AES-012",
    sellerSlug: "nocturne-studio",
    brandName: "Nocturne Studio",
    categorySlug: "home",
    price: 1799,
    description: "Glazed cobalt vase — one stem, maximum impact.",
    shortDescription: "blue edit",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&q=80",
    tags: ["sculptural", "color"],
    mood: "bold",
    materials: ["ceramic"],
    colors: ["cobalt"],
    trending: true,
    stock: 14,
    minStock: 4,
    warehouseLocation: "WH-B3",
  },
];

const DEMO_COLLECTIONS = [
  {
    title: "Slow Mornings",
    slug: "slow-mornings",
    description: "Objects that make waking up feel intentional",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&q=80",
    productSlugs: ["ceramic-pour-over-set", "weighted-silk-eye-mask", "moss-journal"],
  },
  {
    title: "Blue Edit",
    slug: "blue-edit",
    description: "Royal blues and calm tones for your space",
    productSlugs: ["cobalt-table-vase", "midnight-taper-set", "weighted-silk-eye-mask", "cloud-vessel"],
  },
  {
    title: "Desk Goals",
    slug: "desk-goals",
    description: "Stationery and objects for focused work",
    productSlugs: ["moss-journal", "brass-desk-tray"],
  },
  {
    title: "Cozy Corners",
    slug: "cozy-corners",
    description: "Warm textures for slow evenings",
    productSlugs: ["linen-throw-blanket", "cloud-vessel", "lavender-room-mist"],
  },
  {
    title: "Gifts Under ₹999",
    slug: "gifts-under-999",
    description: "Thoughtful picks that won't break the bank",
    productSlugs: ["moss-journal", "midnight-taper-set", "lavender-room-mist", "silk-scrunchie-trio", "ceramic-pour-over-set"],
  },
  {
    title: "New This Week",
    slug: "new-this-week",
    description: "Fresh arrivals at Only Aesthetics",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    productSlugs: ["cloud-vessel", "pearl-drop-earrings", "lavender-room-mist", "moss-journal"],
  },
  {
    title: "Minimal Living",
    slug: "minimal-living",
    description: "Clean lines and calm objects for uncluttered spaces",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    productSlugs: ["cloud-vessel", "arc-floor-lamp", "brass-desk-tray", "cobalt-table-vase"],
  },
  {
    title: "Trending Collections",
    slug: "trending-collections",
    description: "What shoppers are loving right now",
    imageUrl: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=1200&q=80",
    productSlugs: ["pearl-drop-earrings", "weighted-silk-eye-mask", "midnight-taper-set", "linen-throw-blanket"],
  },
  {
    title: "Editor's Picks",
    slug: "editors-picks",
    description: "Hand-selected favourites from our curation team",
    imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&q=80",
    productSlugs: ["cloud-vessel", "pearl-drop-earrings", "ceramic-pour-over-set", "lavender-room-mist"],
  },
];

async function upsertProduct(
  p: ProductSeed,
  sellerId: string,
  brandId: string,
  categoryId: string,
  supplierId: string
) {
  const data = {
    sellerId,
    brandId,
    categoryId,
    supplierId,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    stock: p.stock,
    minStock: p.minStock ?? 5,
    warehouseLocation: p.warehouseLocation ?? "WH-A1",
    purchaseCost: Math.round(p.price * 0.45),
    purchaseDate: new Date(),
    gstRate: 18,
    tags: JSON.stringify(p.tags),
    mood: p.mood,
    materials: JSON.stringify(p.materials),
    colors: JSON.stringify(p.colors),
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    isFeatured: Boolean(p.featured),
    isNewArrival: Boolean(p.newArrival),
    isTrending: Boolean(p.trending),
    isBestseller: Boolean(p.bestseller),
    isRecommended: Boolean(p.recommended),
    room: p.room ?? null,
    style: p.style ?? null,
    dimensions: p.dimensions ?? null,
    publishedAt: new Date(),
    rating: 4.6 + Math.random() * 0.3,
    reviewCount: 12 + Math.floor(Math.random() * 40),
  };

  const product = await prisma.commerceProduct.upsert({
    where: { slug: p.slug },
    update: data,
    create: data,
  });

  const mediaCount = await prisma.commerceProductMedia.count({ where: { productId: product.id } });
  if (mediaCount === 0) {
    await prisma.commerceProductMedia.create({
      data: { productId: product.id, type: "IMAGE", url: p.image, sortOrder: 0, altText: p.name },
    });
  }

  return product;
}

async function linkCollectionProducts(collectionSlug: string, productSlugs: string[]) {
  const collection = await prisma.commerceCollection.findUnique({ where: { slug: collectionSlug } });
  if (!collection) return;

  for (let i = 0; i < productSlugs.length; i++) {
    const product = await prisma.commerceProduct.findUnique({ where: { slug: productSlugs[i] } });
    if (!product) continue;
    await prisma.commerceCollectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collection.id, productId: product.id } },
      update: { sortOrder: i },
      create: { collectionId: collection.id, productId: product.id, sortOrder: i },
    });
  }
}

async function main() {
  console.log("Seeding Only Aesthetics demo catalog...");

  const adminEmail = (process.env.COMMERCE_ADMIN_EMAIL || "yash.shah.lp2@gmail.com").toLowerCase().trim();
  const passwordHash = process.env.COMMERCE_ADMIN_PASSWORD
    ? await hashPassword(process.env.COMMERCE_ADMIN_PASSWORD)
    : DEMO_ADMIN_PASSWORD_HASH;

  await prisma.commerceAdmin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Yash Shah", role: "SUPER_ADMIN", isActive: true, mfaEnabled: false },
    create: { email: adminEmail, name: "Yash Shah", role: "SUPER_ADMIN", passwordHash, mfaEnabled: false },
  });

  const demoStaff = [
    { email: "inventory@onlyaesthetics.in", name: "Priya Inventory", role: "INVENTORY_MANAGER" },
    { email: "orders@onlyaesthetics.in", name: "Rahul Fulfillment", role: "ORDER_FULFILLMENT" },
    { email: "support@onlyaesthetics.in", name: "Ananya Support", role: "CUSTOMER_SUPPORT" },
    { email: "marketing@onlyaesthetics.in", name: "Dev Marketing", role: "MARKETING" },
  ];

  for (const s of demoStaff) {
    await prisma.commerceAdmin.upsert({
      where: { email: s.email },
      update: { name: s.name, role: s.role, isActive: true, passwordHash: DEMO_ADMIN_PASSWORD_HASH },
      create: { email: s.email, name: s.name, role: s.role, passwordHash: DEMO_ADMIN_PASSWORD_HASH, isActive: true },
    });
  }

  for (const cat of CATEGORIES) {
    await prisma.commerceCategory.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
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
      create: { ...s, status: "APPROVED", verified: true, kycStatus: "APPROVED" },
    });
    sellerMap[s.slug] = seller.id;

    const brand = await prisma.commerceBrand.upsert({
      where: { slug: s.slug },
      update: { verified: true },
      create: { sellerId: seller.id, name: s.businessName, slug: s.slug, tagline: s.tagline, verified: true },
    });
    brandMap[s.businessName] = brand.id;

    const supplier = await prisma.commerceSupplier.upsert({
      where: { slug: s.slug },
      update: {
        brandName: s.businessName,
        status: "ACTIVE",
        contactPerson: "Procurement Lead",
        mobile: "+91 98765 43210",
        gstNumber: "27AAAAA0000A1Z5",
        panNumber: "AAAAA0000A",
        address: "Mumbai, Maharashtra",
      },
      create: {
        brandName: s.businessName,
        slug: s.slug,
        email: s.email,
        contactPerson: "Procurement Lead",
        mobile: "+91 98765 43210",
        gstNumber: "27AAAAA0000A1Z5",
        panNumber: "AAAAA0000A",
        address: "Mumbai, Maharashtra",
        status: "ACTIVE",
        productCategories: JSON.stringify(["home", "wellness", "stationery"]),
      },
    });
    supplierMap[s.slug] = supplier.id;
  }

  for (const p of PRODUCTS) {
    await upsertProduct(
      p,
      sellerMap[p.sellerSlug],
      brandMap[p.brandName],
      categoryMap[p.categorySlug],
      supplierMap[p.sellerSlug]
    );
  }

  for (const col of DEMO_COLLECTIONS) {
    await prisma.commerceCollection.upsert({
      where: { slug: col.slug },
      update: {
        title: col.title,
        description: col.description,
        imageUrl: col.imageUrl,
        isFeatured: true,
        isPublished: true,
      },
      create: {
        title: col.title,
        slug: col.slug,
        description: col.description,
        imageUrl: col.imageUrl,
        isFeatured: true,
        isPublished: true,
        sortOrder: DEMO_COLLECTIONS.indexOf(col),
      },
    });
    await linkCollectionProducts(col.slug, col.productSlugs);
  }

  const customerPasswordHash = DEMO_ADMIN_PASSWORD_HASH;

  const customer = await prisma.commerceCustomer.upsert({
    where: { email: "demo@customer.com" },
    update: { name: "Demo Customer", status: "ACTIVE", passwordHash: customerPasswordHash, phone: "+919000012345" },
    create: {
      email: "demo@customer.com",
      name: "Demo Customer",
      status: "ACTIVE",
      phone: "+919000012345",
      passwordHash: customerPasswordHash,
    },
  });

  const demoOrders = [
    { orderNumber: "AES-DEMO-DELIVERED", status: "DELIVERED", productSlug: "cloud-vessel", payment: "razorpay" },
    { orderNumber: "AES-DEMO-CONFIRMED", status: "CONFIRMED", productSlug: "moss-journal", payment: "razorpay" },
    { orderNumber: "AES-DEMO-PACKED", status: "PACKED", productSlug: "pearl-drop-earrings", payment: "razorpay" },
    { orderNumber: "AES-DEMO-SHIPPED", status: "SHIPPED", productSlug: "weighted-silk-eye-mask", payment: "demo" },
    { orderNumber: "AES-DEMO-PENDING", status: "CONFIRMED", productSlug: "lavender-room-mist", payment: "demo" },
  ] as const;

  for (const o of demoOrders) {
    const product = await prisma.commerceProduct.findUnique({ where: { slug: o.productSlug } });
    if (!product) continue;

    const subtotal = product.price;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst + (subtotal >= 999 ? 0 : 49);

    await prisma.commerceOrder.upsert({
      where: { orderNumber: o.orderNumber },
      update: { status: o.status, subtotal, total, tax: gst, shipping: subtotal >= 999 ? 0 : 49, customerId: customer.id },
      create: {
        orderNumber: o.orderNumber,
        customerId: customer.id,
        sellerId: product.sellerId,
        status: o.status,
        subtotal,
        tax: gst,
        shipping: subtotal >= 999 ? 0 : 49,
        total,
        currency: "INR",
        shippingAddress: "Demo Customer\n42 Bandra West\nMumbai, MH 400050\nIndia",
        items: {
          create: [{ productId: product.id, quantity: 1, unitPrice: product.price, total: product.price }],
        },
        payments: {
          create: { amount: total, status: "SUCCESS", provider: o.payment, currency: "INR" },
        },
      },
    });
  }

  const firstSupplier = await prisma.commerceSupplier.findFirst();
  const cloudVessel = await prisma.commerceProduct.findUnique({ where: { slug: "cloud-vessel" } });
  if (firstSupplier && cloudVessel) {
    await prisma.commercePurchaseOrder.upsert({
      where: { poNumber: "PO-DEMO-001" },
      update: { status: "ORDERED", paymentStatus: "PENDING" },
      create: {
        poNumber: "PO-DEMO-001",
        supplierId: firstSupplier.id,
        status: "ORDERED",
        paymentStatus: "PENDING",
        subtotal: 10000,
        total: 10000,
        lines: {
          create: [{
            productId: cloudVessel.id,
            name: cloudVessel.name,
            sku: cloudVessel.sku,
            quantityOrdered: 20,
            unitCost: 500,
            total: 10000,
          }],
        },
      },
    });

    await prisma.commercePurchaseOrder.upsert({
      where: { poNumber: "PO-DEMO-002" },
      update: { status: "RECEIVED", paymentStatus: "PAID" },
      create: {
        poNumber: "PO-DEMO-002",
        supplierId: firstSupplier.id,
        status: "RECEIVED",
        paymentStatus: "PAID",
        subtotal: 4500,
        total: 4500,
        lines: {
          create: [{
            productId: cloudVessel.id,
            name: cloudVessel.name,
            sku: cloudVessel.sku,
            quantityOrdered: 10,
            quantityReceived: 10,
            unitCost: 450,
            total: 4500,
          }],
        },
      },
    });
  }

  const deliveredOrder = await prisma.commerceOrder.findUnique({ where: { orderNumber: "AES-DEMO-DELIVERED" } });
  if (deliveredOrder) {
    const existingReturn = await prisma.commerceReturn.findFirst({
      where: { orderId: deliveredOrder.id, reason: "Product not as described — demo return" },
    });
    if (existingReturn) {
      await prisma.commerceReturn.update({
        where: { id: existingReturn.id },
        data: { status: "REQUESTED" },
      });
    } else {
      await prisma.commerceReturn.create({
        data: {
          orderId: deliveredOrder.id,
          reason: "Product not as described — demo return",
          status: "REQUESTED",
          type: "REFUND",
        },
      });
    }
  }

  const reviewSeeds = [
    { productSlug: "cloud-vessel", rating: 5, title: "Stunning piece", body: "Looks even better in person.", status: "APPROVED", featured: true },
    { productSlug: "moss-journal", rating: 4, title: "Beautiful paper", body: "Pages feel luxurious.", status: "APPROVED", featured: false },
    { productSlug: "pearl-drop-earrings", rating: 5, title: "Perfect gift", body: "Wife loved them!", status: "PENDING", featured: false },
    { productSlug: "midnight-taper-set", rating: 3, title: "Nice but small", body: "Expected slightly taller tapers.", status: "PENDING", featured: false },
    { productSlug: "lavender-room-mist", rating: 2, title: "Scent too strong", body: "Not for sensitive noses.", status: "HIDDEN", featured: false },
  ];

  for (const r of reviewSeeds) {
    const product = await prisma.commerceProduct.findUnique({ where: { slug: r.productSlug } });
    if (!product) continue;
    const existing = await prisma.commerceReview.findFirst({
      where: { productId: product.id, title: r.title },
    });
    if (existing) {
      await prisma.commerceReview.update({
        where: { id: existing.id },
        data: { status: r.status, isFeatured: r.featured, adminReply: r.status === "APPROVED" ? "Thank you for shopping with Only Aesthetics!" : null },
      });
    } else {
      await prisma.commerceReview.create({
        data: {
          productId: product.id,
          customerId: customer.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          status: r.status,
          verifiedPurchase: true,
          isFeatured: r.featured,
          adminReply: r.status === "APPROVED" ? "Thank you for shopping with Only Aesthetics!" : null,
        },
      });
    }
  }

  const coupons = [
    { code: "WELCOME10", description: "10% off your first order", discountType: "PERCENT", discountValue: 10, minOrderValue: 499 },
    { code: "FLAT100", description: "₹100 off orders above ₹999", discountType: "FIXED", discountValue: 100, minOrderValue: 999 },
    { code: "FREESHIP", description: "Free shipping on any order", discountType: "FIXED", discountValue: 49, minOrderValue: 0 },
  ];

  for (const c of coupons) {
    await prisma.commerceCoupon.upsert({
      where: { code: c.code },
      update: { ...c, isActive: true },
      create: { ...c, isActive: true, maxUses: 1000 },
    });
  }

  const CONTENT_PAGES = [
    { key: "homepage_tagline", type: "TEXT", title: "Tagline", body: "Curated objects for intentional living" },
    { key: "about", type: "PAGE", title: "About Only Aesthetics", body: "We source beautiful objects from small makers and bring them to you — one curated store, shipped with care." },
    { key: "shipping_policy", type: "PAGE", title: "Shipping Policy", body: "Free shipping on orders above ₹999. Standard delivery 3–7 business days across India." },
    { key: "refund_policy", type: "PAGE", title: "Refund Policy", body: "Returns accepted within 7 days for unused items in original packaging." },
    { key: "faq_shipping", type: "TEXT", title: "FAQ — Shipping", body: "We ship pan-India via trusted couriers. Tracking shared by SMS and email." },
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
    { key: "support_whatsapp", value: "+919876543210", group: "contact" },
    { key: "site_name", value: "Only Aesthetics", group: "general" },
  ];

  for (const s of SETTINGS) {
    await prisma.commerceSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  const productCount = await prisma.commerceProduct.count({ where: { status: "PUBLISHED" } });
  const orderCount = await prisma.commerceOrder.count();
  console.log(`Demo seed complete: ${productCount} products, ${orderCount} orders, ${DEMO_COLLECTIONS.length} collections.`);
  console.log(`Admin: ${adminEmail} | Customer demo: demo@customer.com / Chester@2604`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
