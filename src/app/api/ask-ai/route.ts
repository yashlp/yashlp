import { NextResponse } from "next/server";
import { z } from "zod";
import { askAI } from "@/lib/ai";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const schema = z.object({
  question: z.string().min(3),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function POST(req: Request) {
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
