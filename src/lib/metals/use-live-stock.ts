"use client";

import { useCallback, useEffect, useState } from "react";
import { type CatalogEntry } from "./builtin-catalog";
import { getGradesForShape, getSizesForGradeAndShape } from "./catalog-queries";
import {
  formatPriceList,
  pricesMatching,
  readPriceEntries,
  sizeSearchValue,
  type PriceEntry,
} from "./size-prices";

type LiveDb = Record<string, CatalogEntry[]>;

type JkApi = {
  BUILTIN_DB: LiveDb;
  loadCustom: (store: Storage, builtin: LiveDb) => unknown;
  applyCustom: (builtin: LiveDb, custom: unknown) => LiveDb;
};

declare global {
  interface Window {
    JKData?: { BUILTIN_DB: LiveDb };
    JKStorage?: JkApi;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-jk-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.jkSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(src));
    document.body.appendChild(script);
  });
}

async function loadLiveDb(): Promise<LiveDb | null> {
  try {
    await loadScript("/metals/js/catalog.js");
    await loadScript("/metals/js/storage.js");
  } catch {
    return null;
  }
  const data = window.JKData;
  const storage = window.JKStorage;
  if (!data || !storage) return null;
  const custom = storage.loadCustom(window.localStorage, data.BUILTIN_DB);
  return storage.applyCustom(data.BUILTIN_DB, custom);
}

function sizesFromDb(db: LiveDb, shape: string, grade: string): string[] {
  if (!grade || !shape) return [];
  const entries = db[shape] ?? [];
  const labels: string[] = [];
  const seen = new Set<string>();
  const push = (label: string) => {
    if (seen.has(label)) return;
    seen.add(label);
    labels.push(label);
  };
  for (const entry of entries) {
    if (entry.g !== grade) continue;
    if (entry.note && !entry.sz && !entry.flat) push("Contact for size");
    if (entry.sz) {
      for (const n of [...entry.sz].sort((a, b) => a - b)) push(String(n));
    }
    if (entry.flat) {
      const thicknesses = Object.keys(entry.flat)
        .map(Number)
        .sort((a, b) => a - b);
      for (const t of thicknesses) {
        const widths = [...(entry.flat[String(t)] ?? [])].sort((a, b) => a - b);
        for (const w of widths) push(`${t}×${w}`);
      }
    }
  }
  return labels.sort((a, b) => {
    const av = sizeSearchValue(a);
    const bv = sizeSearchValue(b);
    if (isNaN(av) && isNaN(bv)) return a.localeCompare(b);
    if (isNaN(av)) return 1;
    if (isNaN(bv)) return -1;
    return av - bv || a.localeCompare(b);
  });
}

function gradesFromDb(db: LiveDb, shape: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of db[shape] ?? []) {
    if (!seen.has(entry.g)) {
      seen.add(entry.g);
      out.push(entry.g);
    }
  }
  return out;
}

export function useLiveStock() {
  const [db, setDb] = useState<LiveDb | null>(null);
  const [entries, setEntries] = useState<PriceEntry[]>([]);

  const reload = useCallback(() => {
    setEntries(readPriceEntries(window.localStorage));
    void loadLiveDb().then((next) => {
      if (next) setDb(next);
    });
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("storage", reload);
    window.addEventListener("focus", reload);
    window.addEventListener("jk-catalog-updated", reload);
    window.addEventListener("jk-prices-updated", reload);
    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("focus", reload);
      window.removeEventListener("jk-catalog-updated", reload);
      window.removeEventListener("jk-prices-updated", reload);
    };
  }, [reload]);

  const sizesFor = useCallback(
    (shape: string, grade: string) => {
      if (db) return sizesFromDb(db, shape, grade);
      return getSizesForGradeAndShape(grade, shape);
    },
    [db]
  );

  const gradesFor = useCallback(
    (shape: string) => {
      if (db) return gradesFromDb(db, shape);
      return getGradesForShape(shape);
    },
    [db]
  );

  const priceText = useCallback(
    (shape: string, grade: string, size: string) =>
      formatPriceList(pricesMatching(entries, grade, shape, size)),
    [entries]
  );

  return { sizesFor, gradesFor, priceText, entries };
}
