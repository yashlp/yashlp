import { NextRequest, NextResponse } from "next/server";
import { staffService } from "@/lib/commerce/services/staff.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { ADMIN_ROLES } from "@/lib/commerce/constants";
import { z } from "zod";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(ADMIN_ROLES),
  password: z.string().min(8),
});

const updateSchema = z.object({
  id: z.string(),
  role: z.enum(ADMIN_ROLES).optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
});

export async function GET() {
  try {
    const staff = await withAdminAuth("admins:read", () => staffService.list());
    return NextResponse.json({ staff, roles: ADMIN_ROLES });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    const member = await withAdminAuth("admins:write", () => staffService.create(body));
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...data } = body;
    const member = await withAdminAuth("admins:write", () => staffService.update(id, data));
    return NextResponse.json({ member });
  } catch (error) {
    return commerceApiError(error);
  }
}
