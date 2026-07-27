import { prisma } from "@/lib/db";
import { mapCategory } from "../mappers";
import type { z } from "zod";
import type { categorySchema } from "../validators";

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryService = {
  async listPublic() {
    const categories = await prisma.commerceCategory.findMany({
      where: { isHidden: false },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            products: {
              where: { status: "PUBLISHED", approvalStatus: "APPROVED" },
            },
          },
        },
      },
    });
    return categories.map((c) => ({
      ...mapCategory(c),
      productCount: c._count.products,
      imageUrl: c.imageUrl,
    }));
  },

  async listAdmin() {
    const categories = await prisma.commerceCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return categories;
  },

  async create(data: CategoryInput) {
    const category = await prisma.commerceCategory.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
      },
    });
    return mapCategory(category);
  },

  async update(id: string, data: Partial<CategoryInput>) {
    const category = await prisma.commerceCategory.update({
      where: { id },
      data: {
        ...data,
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
      },
    });
    return mapCategory(category);
  },

  async delete(id: string) {
    const count = await prisma.commerceProduct.count({ where: { categoryId: id } });
    if (count > 0) throw new Error("Cannot delete category with products");
    await prisma.commerceCategory.delete({ where: { id } });
  },

  async reorder(orderedIds: string[]) {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.commerceCategory.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );
  },
};
