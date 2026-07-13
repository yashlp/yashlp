import { prisma } from "@/lib/db";
import type { z } from "zod";
import type { purchaseOrderSchema } from "../validators/supplier";

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;

function nextPoNumber() {
  return `PO-${Date.now().toString(36).toUpperCase()}`;
}

export const purchaseService = {
  async list() {
    return prisma.commercePurchaseOrder.findMany({
      orderBy: { orderDate: "desc" },
      include: {
        supplier: { select: { id: true, brandName: true } },
        lines: true,
      },
      take: 100,
    });
  },

  async create(data: PurchaseOrderInput) {
    const subtotal = data.lines.reduce((sum, l) => sum + l.quantityOrdered * l.unitCost, 0);
    const tax = 0;
    const total = subtotal + tax;

    return prisma.commercePurchaseOrder.create({
      data: {
        poNumber: nextPoNumber(),
        supplierId: data.supplierId,
        status: data.status || "DRAFT",
        paymentStatus: data.paymentStatus || "PENDING",
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : undefined,
        invoiceNumber: data.invoiceNumber,
        invoiceUrl: data.invoiceUrl || undefined,
        notes: data.notes,
        subtotal,
        tax,
        total,
        lines: {
          create: data.lines.map((line) => ({
            productId: line.productId,
            sku: line.sku,
            name: line.name,
            quantityOrdered: line.quantityOrdered,
            unitCost: line.unitCost,
            total: line.quantityOrdered * line.unitCost,
          })),
        },
      },
      include: { supplier: true, lines: true },
    });
  },

  async receiveLine(lineId: string, received: number, damaged = 0) {
    const line = await prisma.commercePurchaseOrderLine.findUniqueOrThrow({
      where: { id: lineId },
      include: { purchaseOrder: true },
    });

    await prisma.commercePurchaseOrderLine.update({
      where: { id: lineId },
      data: {
        quantityReceived: received,
        quantityDamaged: damaged,
      },
    });

    if (line.productId && received > 0) {
      await prisma.commerceProduct.update({
        where: { id: line.productId },
        data: { stock: { increment: received - damaged } },
      });
    }

    const allLines = await prisma.commercePurchaseOrderLine.findMany({
      where: { purchaseOrderId: line.purchaseOrderId },
    });
    const fullyReceived = allLines.every((l) => l.id === lineId ? received >= l.quantityOrdered : l.quantityReceived >= l.quantityOrdered);
    const partial = allLines.some((l) => (l.id === lineId ? received : l.quantityReceived) > 0);

    await prisma.commercePurchaseOrder.update({
      where: { id: line.purchaseOrderId },
      data: {
        status: fullyReceived ? "RECEIVED" : partial ? "PARTIAL" : undefined,
      },
    });
  },
};
