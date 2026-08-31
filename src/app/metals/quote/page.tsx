import { QuoteTool } from "@/components/metals/quote-tool";
import { GRADES, type ShapeId } from "@/lib/metals/catalog";

export const metadata = { title: "Instant Quote" };

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; shape?: string }>;
}) {
  const sp = await searchParams;
  const grade = GRADES.some((g) => g.slug === sp.grade) ? sp.grade : undefined;
  const shape = (["round", "square", "flat", "hex"] as ShapeId[]).includes(sp.shape as ShapeId)
    ? (sp.shape as ShapeId)
    : undefined;

  return (
    <div className="jk-page">
      <p className="jk-kicker">Instant Quote</p>
      <h1>Steel specs</h1>
      <p className="jk-lead" style={{ maxWidth: "54ch" }}>
        Tell us the grade, shape, and cut length. We match ready stock on the Vadodara floor and send a landed
        estimate — then confirm live mill rate on WhatsApp.
      </p>
      <QuoteTool presetGrade={grade} presetShape={shape} />
      <p className="jk-lead" style={{ marginTop: 28, fontSize: 14 }}>
        Good to know: no per-line minimum. Standard bandsaw tolerance is −0 / +2 mm. Material is first come, first
        served against the lot. Every dispatch can ship with mill certs and GST invoice.
      </p>
    </div>
  );
}
