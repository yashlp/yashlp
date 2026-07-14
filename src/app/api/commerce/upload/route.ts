import { NextRequest, NextResponse } from "next/server";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { CustomerAuthError, requireCommerceCustomer } from "@/lib/commerce/customer-session";
import { mediaKind, saveCommerceUpload } from "@/lib/commerce/media-upload";

/** Customer-authenticated image upload (reviews / customer photos). */
export async function POST(req: NextRequest) {
  try {
    await requireCommerceCustomer();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (mediaKind(file.type) !== "IMAGE") {
      return NextResponse.json({ error: "Only images are allowed for reviews." }, { status: 400 });
    }
    const saved = await saveCommerceUpload(file);
    return NextResponse.json({ url: saved.url, type: saved.type });
  } catch (error) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return commerceApiError(error);
  }
}
