import { prisma } from "@/lib/db";

const MIN_RELIABILITY = 0.1;
const MAX_RELIABILITY = 0.99;

export async function adjustUserTrust(userId: string, delta: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const next = Math.min(MAX_RELIABILITY, Math.max(MIN_RELIABILITY, user.reliabilityScore + delta));
  await prisma.user.update({
    where: { id: userId },
    data: { reliabilityScore: Math.round(next * 100) / 100 },
  });
}

export async function rewardConfirmation(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { reputation: { increment: 5 } },
  });
  await adjustUserTrust(userId, 0.02);
}

export async function penalizeBlockedReport(userId: string) {
  await adjustUserTrust(userId, -0.05);
}

export async function rewardValidDispute(userId: string) {
  await adjustUserTrust(userId, 0.03);
}
