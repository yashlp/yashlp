"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CHEM_COMP } from "./builtin-catalog";
import { getAllGrades } from "./catalog-queries";
import {
  buildBuiltinChemComp,
  resolveChemForGrade,
  type ChemRow,
} from "./chem-catalog";

const CATALOG_KEY = "jk_catalog_v1";

type CustomOverlay = {
  newGrades?: { g: string; chem?: Record<string, string> }[];
  chemComp?: Record<string, Record<string, string>>;
};

function readOverlay(): CustomOverlay | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomOverlay;
  } catch {
    return null;
  }
}

function mergeCustomChem(overlay: CustomOverlay | null): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  if (!overlay) return out;
  if (overlay.chemComp) {
    for (const [g, row] of Object.entries(overlay.chemComp)) {
      out[g] = { ...row };
    }
  }
  for (const ng of overlay.newGrades ?? []) {
    if (ng.g && ng.chem) out[ng.g] = { ...ng.chem };
  }
  return out;
}

function mergeOverlayGrades(base: string[], overlay: CustomOverlay | null): string[] {
  const set = new Set(base);
  for (const ng of overlay?.newGrades ?? []) {
    if (ng.g) set.add(ng.g);
  }
  return Array.from(set).sort();
}

const BUILTIN_MERGED = buildBuiltinChemComp(CHEM_COMP, getAllGrades());

export function useLiveChemCatalog() {
  const [overlay, setOverlay] = useState<CustomOverlay | null>(null);

  const reload = useCallback(() => {
    setOverlay(readOverlay());
  }, []);

  useEffect(() => {
    reload();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CATALOG_KEY || e.key === null) reload();
    };
    const onCatalog = () => reload();
    window.addEventListener("storage", onStorage);
    window.addEventListener("jk-catalog-updated", onCatalog);
    window.addEventListener("focus", reload);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("jk-catalog-updated", onCatalog);
      window.removeEventListener("focus", reload);
    };
  }, [reload]);

  const chemMap = useMemo(() => {
    const custom = mergeCustomChem(overlay);
    return { ...BUILTIN_MERGED, ...custom };
  }, [overlay]);

  const grades = useMemo(
    () => mergeOverlayGrades(getAllGrades(), overlay),
    [overlay]
  );

  const chemFor = useCallback(
    (grade: string): ChemRow => resolveChemForGrade(grade, chemMap) as ChemRow,
    [chemMap]
  );

  return { grades, chemFor };
}
