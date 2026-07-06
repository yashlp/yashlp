import { prisma } from "@/lib/db";
import { CACHE_PUBLIC_LONG, jsonWithCache } from "@/lib/api-cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      emoji: true,
      type: true,
      group: true,
      photoRequired: true,
      photoRule: true,
      description: true,
      sortOrder: true,
    },
  });

  return jsonWithCache({ categories }, CACHE_PUBLIC_LONG);
}
