import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitResponse } from "@/lib/api-security";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { reviewService } from "@/lib/commerce/services/review.service";

export const runtime = "nodejs";

const createSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(10).max(2000),
});

/** Public: approved reviews for homepage / product */
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  try {
    if (productId) {
      const reviews = await reviewService.listForProduct(productId);
      return NextResponse.json({
        reviews: reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          customerName: r.customer?.name || "Customer",
          createdAt: r.createdAt,
        })),
      });
    }
    const reviews = await reviewService.listStorefront(24);
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

/** Signed-in customers submit a review (pending until admin approves) */
export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "commerce-review", 8, 60 * 60 * 1000);
  if (limited) return limited;

  const customer = await getCommerceCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  try {
    const body = createSchema.parse(await req.json());
    const review = await reviewService.create({
      ...body,
      customerId: customer.id,
    });
    return NextResponse.json({
      ok: true,
      review: { id: review.id, status: review.status },
      message: "Thanks — your review will appear after approval.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Could not submit review";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
