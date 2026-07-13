import { prisma } from "@/lib/db";

export const contentService = {
  async list() {
    return prisma.commerceContent.findMany({ orderBy: { key: "asc" } });
  },

  async getByKey(key: string) {
    return prisma.commerceContent.findUnique({ where: { key } });
  },

  async upsert(data: {
    key: string;
    type?: string;
    title?: string;
    body?: string;
    imageUrl?: string;
    isPublished?: boolean;
    updatedBy?: string;
  }) {
    return prisma.commerceContent.upsert({
      where: { key: data.key },
      update: {
        type: data.type,
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished,
        updatedBy: data.updatedBy,
      },
      create: {
        key: data.key,
        type: data.type || "PAGE",
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished ?? true,
        updatedBy: data.updatedBy,
      },
    });
  },
};

export const settingsService = {
  async list(group?: string) {
    return prisma.commerceSetting.findMany({
      where: group ? { group } : undefined,
      orderBy: { key: "asc" },
    });
  },

  async upsertMany(
    entries: { key: string; value: string; group?: string }[],
    updatedBy?: string
  ) {
    for (const entry of entries) {
      await prisma.commerceSetting.upsert({
        where: { key: entry.key },
        update: { value: entry.value, group: entry.group || "general", updatedBy },
        create: { key: entry.key, value: entry.value, group: entry.group || "general", updatedBy },
      });
    }
    return this.list();
  },
};
