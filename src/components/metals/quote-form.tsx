"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ShapeId } from "@/lib/metals/catalog";
import { trimNum } from "@/lib/metals/catalog";
import { company } from "@/lib/metals/company";
import { QUOTE_GRADES, QUOTE_SHAPES, formatInr, formatKg, quoteLine, type QuoteResult } from "@/lib/metals/quote";

type Row = {
  id: string;
  gradeSlug: string;
  shape: ShapeId;
  diameter: string;
  side: string;
  thickness: string;
  width: string;
  length: string;
  qty: string;
};

function newRow(partial?: Partial<Row>): Row {
  return {
    id: Math.random().toString(36).slice(2, 9),
    gradeSlug: "en-8",
    shape: "round",
    diameter: "25",
    side: "",
    thickness: "",
    width: "",
    length: "1000",
    qty: "1",
    ...partial,
  };
}

function evalRow(row: Row): QuoteResult | null {
  return quoteLine({
    gradeSlug: row.gradeSlug,
    shape: row.shape,
    dims: {
      diameterMm: Number(row.diameter) || undefined,
      sideMm: Number(row.side) || Number(row.diameter) || undefined,
      thicknessMm: Number(row.thickness) || undefined,
      widthMm: Number(row.width) || undefined,
      lengthMm: Number(row.length) || 1000,
      qty: Number(row.qty) || 1,
    },
  });
}

export function QuoteForm() {
  const params = useSearchParams();
  const [rows, setRows] = useState<Row[]>(() => [
    newRow({
      gradeSlug: params.get("grade") || "en-8",
      shape: (params.get("shape") as ShapeId) || "round",
    }),
  ]);
  const [companyName, setCompanyName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const results = useMemo(() => rows.map(evalRow), [rows]);
  const grand = results.reduce((sum, r) => sum + (r?.total ?? 0), 0);
  const kg = results.reduce((sum, r) => sum + (r?.weightTotalKg ?? 0), 0);

  function update(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const payload = {
      companyName,
      contact,
      phone,
      email,
      note,
      lines: rows.map((row, i) => {
        const q = results[i];
        return {
          grade: q?.grade.name ?? row.gradeSlug,
          shape: row.shape,
          dims: row,
          weightKg: q?.weightTotalKg ?? 0,
          total: q?.total ?? 0,
          inStock: q?.inStock ?? false,
        };
      }),
      grandTotal: grand,
    };
    try {
      const res = await fetch("/api/metals/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send enquiry");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send enquiry");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="jk-btn jk-btn-ghost text-xs">Describe parts</span>
          <a className="jk-btn jk-btn-ghost text-xs" href={`mailto:${company.email}`}>
            Email
          </a>
          <a
            className="jk-btn jk-btn-ghost text-xs"
            href={`https://wa.me/${company.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="jk-table min-w-[720px]">
            <thead>
              <tr>
                <th>Shape</th>
                <th>Grade</th>
                <th>Dimensions (mm)</th>
                <th>Qty</th>
                <th>Each</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const q = results[i];
                const isFlat = row.shape === "flat";
                const isRound = row.shape === "round" || row.shape === "non-ferrous";
                return (
                  <tr key={row.id}>
                    <td>
                      <select
                        className="jk-select"
                        value={row.shape}
                        onChange={(e) => update(row.id, { shape: e.target.value as ShapeId })}
                      >
                        {QUOTE_SHAPES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="jk-select"
                        value={row.gradeSlug}
                        onChange={(e) => update(row.id, { gradeSlug: e.target.value })}
                      >
                        {QUOTE_GRADES.map((g) => (
                          <option key={g.slug} value={g.slug}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {isFlat ? (
                          <>
                            <input
                              className="jk-input w-16"
                              inputMode="decimal"
                              placeholder="Thk"
                              aria-label="Thickness mm"
                              value={row.thickness}
                              onChange={(e) => update(row.id, { thickness: e.target.value })}
                            />
                            <span className="self-center text-neutral-500">×</span>
                            <input
                              className="jk-input w-16"
                              inputMode="decimal"
                              placeholder="W"
                              aria-label="Width mm"
                              value={row.width}
                              onChange={(e) => update(row.id, { width: e.target.value })}
                            />
                          </>
                        ) : (
                          <input
                            className="jk-input w-20"
                            inputMode="decimal"
                            placeholder={isRound ? "Ø" : "AF / side"}
                            aria-label="Size mm"
                            value={isRound ? row.diameter : row.side || row.diameter}
                            onChange={(e) =>
                              update(row.id, isRound ? { diameter: e.target.value } : { side: e.target.value })
                            }
                          />
                        )}
                        <span className="self-center text-neutral-500">×</span>
                        <input
                          className="jk-input w-20"
                          inputMode="decimal"
                          placeholder="L"
                          aria-label="Length mm"
                          value={row.length}
                          onChange={(e) => update(row.id, { length: e.target.value })}
                        />
                      </div>
                      {q && (
                        <p className="mt-1 text-[11px] text-neutral-500">
                          {q.inStock ? "In stock" : "Confirm size"} · {formatKg(q.weightEachKg)}
                          {!q.inStock &&
                            q.matches
                              .filter((m) => m.nearest && (m.nearest.below.length || m.nearest.above.length))
                              .slice(0, 1)
                              .map((m) => {
                                const n = [...(m.nearest?.below ?? []), ...(m.nearest?.above ?? [])]
                                  .slice(0, 4)
                                  .map(trimNum)
                                  .join(", ");
                                return n ? ` · nearest ${n}` : "";
                              })}
                        </p>
                      )}
                    </td>
                    <td>
                      <input
                        className="jk-input w-16"
                        inputMode="numeric"
                        value={row.qty}
                        onChange={(e) => update(row.id, { qty: e.target.value })}
                      />
                    </td>
                    <td className="jk-mono whitespace-nowrap">{q ? formatInr(q.unitPrice) : "—"}</td>
                    <td className="jk-mono whitespace-nowrap">{q ? formatInr(q.total) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="jk-btn jk-btn-ghost" onClick={() => setRows((r) => [...r, newRow()])}>
            Add row
          </button>
          <p className="jk-mono text-sm text-neutral-300">
            {formatKg(kg)} · {formatInr(grand)}
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 grid gap-3 sm:grid-cols-2">
          <input
            className="jk-input"
            placeholder="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <input
            className="jk-input"
            placeholder="Contact name"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <input
            className="jk-input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            className="jk-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="jk-textarea sm:col-span-2"
            rows={3}
            placeholder="PO number, heat-treat condition, delivery city…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="jk-btn jk-btn-primary sm:col-span-2" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send enquiry"}
          </button>
          {status === "sent" && (
            <p className="sm:col-span-2 text-sm text-emerald-400">
              Enquiry received. We typically confirm stock and a landed rate the same working day.
            </p>
          )}
          {status === "error" && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
        </form>
      </div>

      <aside className="border border-white/10 p-5">
        <h2 className="text-lg font-semibold">Good to know</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
          <li>Indicative rates in ₹/kg against typical warehouse prices. Final rate follows today&apos;s mill and cut.</li>
          <li>No per-line minimum. Commercial order minimum ~50 kg or equivalent cut job.</li>
          <li>Length tolerance commercially square; faced ends on request.</li>
          <li>Material is first come, first served on a PO.</li>
          <li>Lead time follows live inventory. In-stock diameters cut the same day.</li>
          <li>Every lot ships with mill certs and heat numbers.</li>
          <li>
            Talk to the floor:{" "}
            <a className="text-white underline" href={`tel:${company.phonePrimaryTel}`}>
              {company.phonePrimary}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
