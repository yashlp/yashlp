/** Chemical composition helpers — shared by catalog sync and /metals UI */

export const CHEM_ELEMENTS = ["C", "Mn", "Si", "Cr", "Ni", "Mo"] as const;

export type ChemRow = Record<(typeof CHEM_ELEMENTS)[number], string>;

export function emptyChemRow(): ChemRow {
  return { C: "—", Mn: "—", Si: "—", Cr: "—", Ni: "—", Mo: "—" };
}

export function resolveChemForGrade(
  grade: string,
  chemMap: Record<string, Record<string, string>>
): Record<string, string> {
  if (chemMap[grade]) return chemMap[grade];
  const base = grade.split(" / ")[0];
  if (chemMap[base]) return chemMap[base];
  if (/^MS\b/i.test(grade) && chemMap.MS) return chemMap.MS;
  if (grade.startsWith("SS")) return chemMap[grade] ?? emptyChemRow();
  return emptyChemRow();
}

/** Ensure every catalog grade has an explicit chemistry row (inherit or placeholder). */
export function buildBuiltinChemComp(
  builtinChem: Record<string, Record<string, string>>,
  grades: string[]
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = { ...builtinChem };
  for (const g of grades) {
    if (!out[g]) {
      out[g] = { ...resolveChemForGrade(g, out) };
    }
  }
  return out;
}

export function listUniqueGradesFromDb(
  db: Record<string, { g: string }[]>
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const shape of Object.keys(db)) {
    for (const e of db[shape] ?? []) {
      if (e.g && !seen.has(e.g)) {
        seen.add(e.g);
        out.push(e.g);
      }
    }
  }
  return out.sort();
}
