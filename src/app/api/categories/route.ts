import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ categories });
}
