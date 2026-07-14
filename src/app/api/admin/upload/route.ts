import { NextRequest, NextResponse } from "next/server";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { saveCommerceUpload } from "@/lib/commerce/media-upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const result = await withAdminAuth("products:write", async () => {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        throw new Error("Missing file");
      }
      return saveCommerceUpload(file);
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
