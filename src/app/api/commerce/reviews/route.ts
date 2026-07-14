import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { CustomerAuthError, requireCommerceCustomer } from "@/lib/commerce/customer-session";
import { isAllowedMediaUrl } from "@/lib/commerce/media-upload";
import { reviewService } from "@/lib/commerce/services/review.service";

const createSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10).max(2000),
  imageUrl: z
    .string()
    .optional()
    .refine((v) => !v || isAllowedMediaUrl(v), { message: "Invalid image URL" }),
});

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }
    const featured = req.nextUrl.searchParams.get("featured") === "true";
    const reviews = await reviewService.listForProduct(productId, {
      featuredOnly: featured || undefined,
      limit: 50,
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await requireCommerceCustomer();
    const body = createSchema.parse(await req.json());
    const review = await reviewService.create({
      productId: body.productId,
      customerId: customer.id,
      rating: body.rating,
      title: body.title,
      body: body.body,
      imageUrl: body.imageUrl,
    });
    return NextResponse.json(
      {
        review,
        message: "Thanks — your review will appear after we approve it.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return commerceApiError(error);
  }
}
