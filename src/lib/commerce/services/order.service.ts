import { prisma } from "@/lib/db";

function orderNumber() {
  return `AES-${Date.now().toString(36).toUpperCase()}`;
}

export const orderService = {
  async createGuestOrder(input: {
    items: { productId: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    shipping: number;
    total: number;
    guest: {
      name: string;
      email: string;
      phone: string;
      shippingAddress: string;
    };
    customerId?: string;
  }) {
    const order = await prisma.commerceOrder.create({
      data: {
        orderNumber: orderNumber(),
        customerId: input.customerId,
        status: "CONFIRMED",
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
        shippingAddress: input.guest.shippingAddress,
        customerNotes: `Guest: ${input.guest.name} | ${input.guest.email} | ${input.guest.phone}`,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    return order;
  },

  async getById(id: string) {
    return prisma.commerceOrder.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, customer: true },
    });
  },
};
