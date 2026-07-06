import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { incidentInclude } from "@/lib/incident-service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: incidentInclude,
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ incident });
}
