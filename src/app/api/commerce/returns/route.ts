import { NextRequest, NextResponse } from "next/server";
import { returnService } from "@/lib/commerce/services/return.service";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  reason: z.string().min(1),
  type: z.enum(["REFUND", "REPLACEMENT"]).optional(),
  condition: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const ret = await returnService.createRequest(body);
    return NextResponse.json({ return: ret }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Return request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
