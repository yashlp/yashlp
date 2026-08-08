import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/** Shah Family Guest List — served as a real HTML page (not raw source). */
export async function GET() {
  const filePath = path.join(process.cwd(), "wedding-guest-list", "index.html");
  const html = await readFile(filePath, "utf8");
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
