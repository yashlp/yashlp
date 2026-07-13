import { prisma } from "@/lib/db";
import { hashPassword } from "../password";
import type { AdminRole } from "../constants";

export const staffService = {
  async list() {
    return prisma.commerceAdmin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(input: { email: string; name: string; role: AdminRole; password: string }) {
    return prisma.commerceAdmin.create({
      data: {
        email: input.email.toLowerCase().trim(),
        name: input.name,
        role: input.role,
        passwordHash: await hashPassword(input.password),
        isActive: true,
        mfaEnabled: false,
      },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  },

  async update(id: string, data: { role?: AdminRole; isActive?: boolean; name?: string }) {
    return prisma.commerceAdmin.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  },
};
