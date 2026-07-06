import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  canChangeName,
  generateRandomDisplayName,
  MAX_NAME_CHANGES,
  nameChangesRemaining,
} from "@/lib/random-name";

const schema = z.object({
  name: z.string().min(2).max(32).optional(),
  useRandom: z.boolean().optional(),
});

export async function GET() {
  return NextResponse.json({ name: generateRandomDisplayName() });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const data = schema.parse(await req.json());

  if (!canChangeName(user.nameChangeCount)) {
    return NextResponse.json(
      {
        error: `You have used all ${MAX_NAME_CHANGES} name changes. Your display name is locked for privacy consistency.`,
        nameChangeCount: user.nameChangeCount,
        remaining: 0,
      },
      { status: 403 }
    );
  }

  const nextName = data.useRandom
    ? generateRandomDisplayName()
    : data.name?.trim();

  if (!nextName) {
    return NextResponse.json({ error: "Provide a name or request a random one" }, { status: 400 });
  }

  if (nextName === user.name) {
    return NextResponse.json({ error: "That is already your display name" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: nextName,
      nameChangeCount: { increment: 1 },
    },
    select: {
      id: true,
      phone: true,
      name: true,
      nameChangeCount: true,
      reputation: true,
      reliabilityScore: true,
    },
  });

  return NextResponse.json({
    user: updated,
    remaining: nameChangesRemaining(updated.nameChangeCount),
  });
}
