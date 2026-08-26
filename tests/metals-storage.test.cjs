#!/usr/bin/env node
"use strict";

const assert = require("assert");
const data = require("../public/metals/js/catalog.js");
const S = require("../public/metals/js/storage.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok - " + name);
}

test("builtin catalog includes all shapes", () => {
  for (const sh of ["Round Bar", "Square Bar", "Hex Bar", "Flat Bar", "Non-Ferrous"]) {
    assert.ok(data.BUILTIN_DB[sh] && data.BUILTIN_DB[sh].length, sh);
  }
  assert.ok(data.BUILTIN_DB["Flat Bar"][0].flat["6"].includes(25));
  assert.ok(data.BUILTIN_DB["Non-Ferrous"][0].note);
  assert.ok(!data.BUILTIN_DB["Square Bar"][0].flat);
});

test("grade list includes flats and non-ferrous", () => {
  const list = S.listGrades(data.BUILTIN_DB, data.SL);
  assert.ok(list.some((x) => x.sh === "Flat Bar" && x.g === "EN-8"));
  assert.ok(list.some((x) => x.sh === "Hex Bar"));
  assert.ok(list.some((x) => x.sh === "Non-Ferrous" && x.g === "Brass"));
  assert.ok(list.some((x) => x.sh === "Square Bar"));
});

test("round add/remove persists across reload and uses shape|grade|subtype keys", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  const r = S.addSize(db, custom, "Round Bar", "EN-8D", "Rolled", 47);
  assert.ok(r.ok);
  S.saveCustom(mem, custom);
  const key = S.catalogKey("Round Bar", "EN-8D", "Rolled");
  assert.deepStrictEqual(custom.added[key], [47]);
  assert.ok(!/\|0$/.test(Object.keys(custom.added)[0]));

  const loaded = S.loadCustom(mem, data.BUILTIN_DB);
  const db2 = S.applyCustom(data.BUILTIN_DB, loaded);
  const ent = S.findEntry(db2, "Round Bar", "EN-8D", "Rolled");
  assert.ok(S.hasExact(ent.sz, 47));

  S.removeSize(db2, loaded, "Round Bar", "EN-8D", "Rolled", 47);
  S.saveCustom(mem, loaded);
  const db3 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  const ent3 = S.findEntry(db3, "Round Bar", "EN-8D", "Rolled");
  assert.ok(!S.hasExact(ent3.sz, 47));
  assert.ok(S.hasExact(ent3.sz, 16), "builtin size remains");
});

test("hex and square add as 1D sz", () => {
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addSize(db, custom, "Hex Bar", "MS Bright", "Hex Bar", 21).ok);
  assert.ok(S.addSize(db, custom, "Square Bar", "EN-8", "Square Bar", 18).ok);
  const hex = S.findEntry(db, "Hex Bar", "MS Bright", "Hex Bar");
  const sq = S.findEntry(db, "Square Bar", "EN-8", "Square Bar");
  assert.ok(S.hasExact(hex.sz, 21));
  assert.ok(S.hasExact(sq.sz, 18));
});

test("flat add/remove persists separately from sz", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  const add = S.addFlatSize(db, custom, "Flat Bar", "EN-8", "Rolled", 6, 28);
  assert.ok(add.ok);
  assert.strictEqual(add.label, "6x28");
  S.saveCustom(mem, custom);
  const key = S.catalogKey("Flat Bar", "EN-8", "Rolled");
  assert.ok(custom.addedFlat[key]["6"].includes(28));
  assert.ok(!custom.added[key]);

  let db2 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  let ent = S.findEntry(db2, "Flat Bar", "EN-8", "Rolled");
  assert.ok(S.hasExact(ent.flat["6"], 28));
  assert.ok(S.hasExact(ent.flat["6"], 25), "builtin width kept");

  const chips = S.flatChips(ent).map((c) => c.label);
  assert.ok(chips.includes("6x28"));
  assert.ok(chips.includes("6x25"));

  const custom2 = S.loadCustom(mem, data.BUILTIN_DB);
  S.removeFlatSize(db2, custom2, "Flat Bar", "EN-8", "Rolled", 6, 25);
  S.saveCustom(mem, custom2);
  const db3 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  const ent3 = S.findEntry(db3, "Flat Bar", "EN-8", "Rolled");
  assert.ok(!S.hasExact(ent3.flat["6"], 25));
  assert.ok(S.hasExact(ent3.flat["6"], 28));
});

test("new flat thickness creates key; removing last width deletes it", () => {
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addFlatSize(db, custom, "Flat Bar", "EN-8", "Rolled", 7, 33).ok);
  const ent = S.findEntry(db, "Flat Bar", "EN-8", "Rolled");
  assert.deepStrictEqual(ent.flat["7"], [33]);
  S.removeFlatSize(db, custom, "Flat Bar", "EN-8", "Rolled", 7, 33);
  assert.ok(!ent.flat["7"]);
});

test("new grade: round sz, flat pairs, non-ferrous note-only", () => {
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  const r = S.addNewGrade(db, custom, { g: "EN-36", sh: "Round Bar", s: "Rod", sizesRaw: "16,20,25" });
  assert.ok(r.ok);
  const f = S.addNewGrade(db, custom, { g: "EN-36", sh: "Flat Bar", s: "Rolled", sizesRaw: "6x25,6x32,10x50" });
  assert.ok(f.ok);
  assert.deepStrictEqual(f.rec.flat["6"].sort((a, b) => a - b), [25, 32]);
  const nf = S.addNewGrade(db, custom, { g: "Bronze", sh: "Non-Ferrous", s: "Rod", sizesRaw: "" });
  assert.ok(nf.ok);
  assert.strictEqual(nf.rec.note, 1);

  const mem = S.memoryStore();
  S.saveCustom(mem, custom);
  const db2 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  assert.ok(S.findEntry(db2, "Round Bar", "EN-36", "Rod").sz.includes(20));
  assert.ok(S.hasExact(S.findEntry(db2, "Flat Bar", "EN-36", "Rolled").flat["10"], 50));
  assert.strictEqual(S.findEntry(db2, "Non-Ferrous", "Bronze", "Rod").note, 1);
});

test("non-ferrous missing sz does not crash add/list", () => {
  const list = S.listGrades(data.BUILTIN_DB, data.SL).filter((x) => x.sh === "Non-Ferrous");
  assert.ok(list.length);
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  const brass = S.findEntry(db, "Non-Ferrous", "Brass", "Rod, Hex, Square, Flat, Sheet");
  assert.ok(brass.note);
  const r = S.addSize(db, custom, "Non-Ferrous", "Brass", "Rod, Hex, Square, Flat, Sheet", 12);
  assert.ok(r.ok);
  assert.ok(S.hasExact(brass.sz, 12));
});

test("migrates legacy index keys so inserting grades does not mis-apply sizes", () => {
  const mem = S.memoryStore();
  const legacy = {
    added: { "Round Bar|0": [47] },
    removed: { "Round Bar|0": [16] },
    newGrades: [{ g: "ZZ-NEW", sh: "Round Bar", s: "Rod", sz: [11, 12] }],
  };
  mem.setItem("jkcust", JSON.stringify(legacy));
  const loaded = S.loadCustom(mem, data.BUILTIN_DB);
  const k = S.catalogKey("Round Bar", "EN-8D", "Rolled");
  assert.ok(loaded.added[k].includes(47));
  assert.ok(!loaded.added["Round Bar|0"]);
  const db = S.applyCustom(data.BUILTIN_DB, loaded);
  const first = db["Round Bar"][0];
  assert.strictEqual(first.g, "EN-8D");
  assert.ok(S.hasExact(first.sz, 47));
  assert.ok(!S.hasExact(first.sz, 16));
  const inserted = S.findEntry(db, "Round Bar", "ZZ-NEW", "Rod");
  assert.ok(inserted);
  assert.ok(S.hasExact(inserted.sz, 11));
  assert.ok(!S.hasExact(inserted.sz, 47), "new grade did not steal EN-8D custom size");
});

test("prices persist independently of catalog overlay", () => {
  const mem = S.memoryStore();
  S.setPrice(mem, "EN-8D", "Round Bar", "Rolled", "25", 62.5);
  assert.strictEqual(S.getPrice(mem, "EN-8D", "Round Bar", "Rolled", "25"), 62.5);
  S.setPrice(mem, "EN-8", "Flat Bar", "Rolled", "6x25", 71);
  assert.strictEqual(S.getPrice(mem, "EN-8", "Flat Bar", "Rolled", "6x25"), 71);
});

test("PIN defaults and save", () => {
  const mem = S.memoryStore();
  assert.strictEqual(S.getPin(mem), "1234");
  S.savePin(mem, "9999");
  assert.strictEqual(S.getPin(mem), "9999");
  assert.strictEqual(S.SM_PIN, "2604");
});

test("builtin catalog is not mutated by applyCustom", () => {
  const before = JSON.stringify(data.BUILTIN_DB["Round Bar"][0].sz);
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  S.addSize(db, custom, "Round Bar", "EN-8D", "Rolled", 48);
  assert.strictEqual(JSON.stringify(data.BUILTIN_DB["Round Bar"][0].sz), before);
});

test("custom grade rename persists sizes and re-keys overlay", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addNewGrade(db, custom, { g: "EN-36", sh: "Round Bar", s: "Rod", sizesRaw: "16,20,25" }).ok);
  assert.ok(S.addSize(db, custom, "Round Bar", "EN-36", "Rod", 47).ok);
  S.setPrice(mem, "EN-36", "Round Bar", "Rod", "25", 55);
  S.setPrice(mem, "EN-36", "Round Bar", "Rod", "47", 58);
  const renamed = S.renameGrade(db, custom, mem, "Round Bar", "EN-36", "Rod", "EN-36C");
  assert.ok(renamed.ok, renamed.error);
  assert.strictEqual(renamed.to, "EN-36C");
  assert.strictEqual(renamed.pricesMoved, 2);
  assert.ok(!S.findEntry(db, "Round Bar", "EN-36", "Rod"));
  const live = S.findEntry(db, "Round Bar", "EN-36C", "Rod");
  assert.ok(S.hasExact(live.sz, 16) && S.hasExact(live.sz, 47));
  const oldK = S.catalogKey("Round Bar", "EN-36", "Rod");
  const newK = S.catalogKey("Round Bar", "EN-36C", "Rod");
  assert.ok(!custom.added[oldK]);
  assert.ok(custom.added[newK].includes(47));
  assert.strictEqual(custom.newGrades[0].g, "EN-36C");
  assert.strictEqual(custom.renamedGrades[0].from, "EN-36");
  assert.strictEqual(S.getPrice(mem, "EN-36C", "Round Bar", "Rod", "25"), 55);
  assert.strictEqual(S.getPrice(mem, "EN-36", "Round Bar", "Rod", "25"), null);

  S.saveCustom(mem, custom);
  const loaded = S.loadCustom(mem, data.BUILTIN_DB);
  const db2 = S.applyCustom(data.BUILTIN_DB, loaded);
  assert.ok(S.findEntry(db2, "Round Bar", "EN-36C", "Rod"));
  assert.ok(!S.findEntry(db2, "Round Bar", "EN-36", "Rod"));
  assert.ok(S.hasExact(S.findEntry(db2, "Round Bar", "EN-36C", "Rod").sz, 47));
  const db3 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  assert.strictEqual(db3["Round Bar"].filter((e) => e.g === "EN-36C" && e.s === "Rod").length, 1);
});

test("flat grade rename keeps thickness x width and migrates prices", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addNewGrade(db, custom, { g: "EN-36", sh: "Flat Bar", s: "Rolled", sizesRaw: "6x25,6x32,10x50" }).ok);
  assert.ok(S.addFlatSize(db, custom, "Flat Bar", "EN-36", "Rolled", 6, 28).ok);
  S.setPrice(mem, "EN-36", "Flat Bar", "Rolled", "6x25", 71);
  S.setPrice(mem, "EN-36", "Flat Bar", "Rolled", "6x28", 73);
  assert.ok(S.renameGrade(db, custom, mem, "Flat Bar", "EN-36", "Rolled", "EN-36F").ok);
  const ent = S.findEntry(db, "Flat Bar", "EN-36F", "Rolled");
  assert.ok(S.hasExact(ent.flat["6"], 25));
  assert.ok(S.hasExact(ent.flat["6"], 28));
  assert.ok(S.hasExact(ent.flat["10"], 50));
  const newK = S.catalogKey("Flat Bar", "EN-36F", "Rolled");
  assert.ok(custom.addedFlat[newK]["6"].includes(28));
  assert.ok(!custom.addedFlat[S.catalogKey("Flat Bar", "EN-36", "Rolled")]);
  assert.strictEqual(S.getPrice(mem, "EN-36F", "Flat Bar", "Rolled", "6x25"), 71);
  assert.strictEqual(S.getPrice(mem, "EN-36F", "Flat Bar", "Rolled", "6x28"), 73);

  S.saveCustom(mem, custom);
  const db2 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  const ent2 = S.findEntry(db2, "Flat Bar", "EN-36F", "Rolled");
  assert.ok(S.hasExact(ent2.flat["6"], 28));
});

test("note-only non-ferrous rename migrates N/A price key", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addNewGrade(db, custom, { g: "Bronze", sh: "Non-Ferrous", s: "Rod", sizesRaw: "" }).ok);
  S.setPrice(mem, "Bronze", "Non-Ferrous", "Rod", "N/A", 410);
  assert.ok(S.renameGrade(db, custom, mem, "Non-Ferrous", "Bronze", "Rod", "Phosphor Bronze").ok);
  assert.strictEqual(S.getPrice(mem, "Phosphor Bronze", "Non-Ferrous", "Rod", "N/A"), 410);
  assert.strictEqual(S.findEntry(db, "Non-Ferrous", "Phosphor Bronze", "Rod").note, 1);
});

test("rename does not overwrite an existing destination price", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addNewGrade(db, custom, { g: "OLDG", sh: "Round Bar", s: "Rod", sizesRaw: "16" }).ok);
  S.setPrice(mem, "OLDG", "Round Bar", "Rod", "16", 10);
  S.setPrice(mem, "NEWG", "Round Bar", "Rod", "16", 99);
  const r = S.renameGrade(db, custom, mem, "Round Bar", "OLDG", "Rod", "NEWG");
  assert.ok(r.ok);
  assert.strictEqual(r.pricesSkipped, 1);
  assert.strictEqual(S.getPrice(mem, "NEWG", "Round Bar", "Rod", "16"), 99);
  assert.strictEqual(S.getPrice(mem, "OLDG", "Round Bar", "Rod", "16"), null);
});

test("rename rejects blank and duplicate identity", () => {
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  S.addNewGrade(db, custom, { g: "AA", sh: "Round Bar", s: "Rod", sizesRaw: "16" });
  S.addNewGrade(db, custom, { g: "BB", sh: "Round Bar", s: "Rod", sizesRaw: "20" });
  assert.ok(!S.renameGrade(db, custom, S.memoryStore(), "Round Bar", "AA", "Rod", "   ").ok);
  assert.ok(!S.renameGrade(db, custom, S.memoryStore(), "Round Bar", "AA", "Rod", "AA").ok);
  const dup = S.renameGrade(db, custom, S.memoryStore(), "Round Bar", "AA", "Rod", "BB");
  assert.ok(!dup.ok);
  assert.match(dup.error, /already exists/i);
});

test("builtin grade rename is an overlay and does not mutate the catalog", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addSize(db, custom, "Round Bar", "EN-8D", "Rolled", 47).ok);
  S.setPrice(mem, "EN-8D", "Round Bar", "Rolled", "25", 62.5);
  S.setPrice(mem, "EN-8D", "Round Bar", "Rolled", "47", 64);
  const builtinName = data.BUILTIN_DB["Round Bar"][0].g;
  assert.strictEqual(builtinName, "EN-8D");
  const r = S.renameGrade(db, custom, mem, "Round Bar", "EN-8D", "Rolled", "EN-8D-SHOP");
  assert.ok(r.ok);
  assert.strictEqual(data.BUILTIN_DB["Round Bar"][0].g, "EN-8D", "builtin catalog stays EN-8D");
  assert.ok(S.findEntry(db, "Round Bar", "EN-8D-SHOP", "Rolled"));
  assert.ok(!S.findEntry(db, "Round Bar", "EN-8D", "Rolled"));
  const newK = S.catalogKey("Round Bar", "EN-8D-SHOP", "Rolled");
  assert.ok(custom.added[newK].includes(47));
  assert.strictEqual(S.getPrice(mem, "EN-8D-SHOP", "Round Bar", "Rolled", "25"), 62.5);

  S.saveCustom(mem, custom);
  const db2 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  const ent = S.findEntry(db2, "Round Bar", "EN-8D-SHOP", "Rolled");
  assert.ok(S.hasExact(ent.sz, 16), "builtin sizes travel with the rename");
  assert.ok(S.hasExact(ent.sz, 47));
  assert.ok(!S.findEntry(db2, "Round Bar", "EN-8D", "Rolled"));
  assert.strictEqual(data.BUILTIN_DB["Round Bar"].filter((e) => e.g === "EN-8D" && e.s === "Rolled").length, 1);
  const again = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  assert.strictEqual(again["Round Bar"].filter((e) => e.g === "EN-8D-SHOP" && e.s === "Rolled").length, 1);
  assert.strictEqual(again["Round Bar"].filter((e) => e.g === "EN-8D" && e.s === "Rolled").length, 0);
});

test("rename re-keys removed sizes and sequential names do not duplicate", () => {
  const mem = S.memoryStore();
  let custom = S.emptyCustom();
  let db = S.applyCustom(data.BUILTIN_DB, custom);
  assert.ok(S.addNewGrade(db, custom, { g: "SEQ-A", sh: "Round Bar", s: "Rod", sizesRaw: "16,20,25" }).ok);
  assert.ok(S.removeSize(db, custom, "Round Bar", "SEQ-A", "Rod", 20).ok);
  assert.ok(S.renameGrade(db, custom, mem, "Round Bar", "SEQ-A", "Rod", "SEQ-B").ok);
  const oldK = S.catalogKey("Round Bar", "SEQ-A", "Rod");
  const midK = S.catalogKey("Round Bar", "SEQ-B", "Rod");
  assert.ok(!custom.removed[oldK]);
  assert.ok(custom.removed[midK].includes(20));
  assert.ok(S.renameGrade(db, custom, mem, "Round Bar", "SEQ-B", "Rod", "SEQ-C").ok);
  assert.strictEqual(custom.renamedGrades.length, 2);
  S.saveCustom(mem, custom);
  const db2 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  assert.strictEqual(db2["Round Bar"].filter((e) => /^SEQ-/.test(e.g) && e.s === "Rod").length, 1);
  const ent = S.findEntry(db2, "Round Bar", "SEQ-C", "Rod");
  assert.ok(S.hasExact(ent.sz, 16) && S.hasExact(ent.sz, 25));
  assert.ok(!S.hasExact(ent.sz, 20));
  const db3 = S.applyCustom(data.BUILTIN_DB, S.loadCustom(mem, data.BUILTIN_DB));
  assert.strictEqual(db3["Round Bar"].filter((e) => e.g === "SEQ-C" && e.s === "Rod").length, 1);
});

console.log("\n" + passed + " tests passed");
