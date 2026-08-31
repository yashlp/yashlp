#!/usr/bin/env node
"use strict";
const assert = require("assert");
const {
  emptyChemRow,
  resolveChemForGrade,
  buildBuiltinChemComp,
  listUniqueGradesFromDb,
} = require("../src/lib/metals/chem-catalog.ts");
const { BUILTIN_DB, CHEM_COMP } = require("../src/lib/metals/builtin-catalog.ts");

const merged = buildBuiltinChemComp(CHEM_COMP, listUniqueGradesFromDb(BUILTIN_DB));
assert.ok(merged["EN-8D / C-45"], "inherits chem for composite grade name");
assert.strictEqual(merged["EN-8D / C-45"].C, CHEM_COMP["EN-8D"].C);

const msBright = resolveChemForGrade("MS Bright", merged);
assert.strictEqual(msBright.C, CHEM_COMP.MS.C, "MS Bright inherits MS chemistry");

const custom = { "EN-99": { C: "0.99", Mn: "1.00", Si: "0.10", Cr: "0.00", Ni: "0.00", Mo: "0.00" } };
const mergedCustom = { ...merged, ...custom };
assert.strictEqual(resolveChemForGrade("EN-99", mergedCustom).C, "0.99");

const empty = emptyChemRow();
assert.strictEqual(empty.Mo, "—");

console.log("ok - chem catalog helpers");
