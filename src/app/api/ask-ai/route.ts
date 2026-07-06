import { NextResponse } from "next/server";
import { z } from "zod";
import { askAI } from "@/lib/ai";
import { getSessionUser } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/api-security";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const schema = z.object({
  question: z.string().min(3).max(500),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "ask-ai", 20, 60 * 60 * 1000);
  if (limited) return limited;

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to use Ask AI" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const lat = data.latitude ?? DEFAULT_MAP_CENTER.lat;
    const lng = data.longitude ?? DEFAULT_MAP_CENTER.lng;
    const result = await askAI(data.question, lat, lng);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
