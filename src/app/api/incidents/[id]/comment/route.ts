import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addTimelineEvent } from "@/lib/incident-service";

const schema = z.object({ body: z.string().min(1) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = schema.parse(await req.json());

  const comment = await prisma.comment.create({
    data: { incidentId: id, userId: user.id, body: data.body },
    include: { user: { select: { name: true } } },
  });

  await addTimelineEvent(id, "comment_added", user.id);
  return NextResponse.json({ comment });
}
