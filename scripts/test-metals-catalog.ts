import assert from "node:assert/strict";
import {
  featuredGrades,
  getGrade,
  GRADES,
  kgLabel,
  searchStock,
  uniqueSizes,
  weightKg,
} from "../src/lib/metals/catalog";

const round50x1000 = weightKg({
  shape: "round",
  density: 7.85,
  diameterMm: 50,
  lengthMm: 1000,
  qty: 1,
});
assert.ok(Math.abs(round50x1000 - 15.41) < 0.05, `round weight ${round50x1000}`);

const square40x1000 = weightKg({
  shape: "square",
  density: 7.85,
  sideMm: 40,
  lengthMm: 1000,
  qty: 1,
});
assert.ok(Math.abs(square40x1000 - 12.56) < 0.05, `square weight ${square40x1000}`);

const hex24x1000 = weightKg({
  shape: "hex",
  density: 7.85,
  sideMm: 24,
  lengthMm: 1000,
  qty: 1,
});
assert.ok(hex24x1000 > 3.5 && hex24x1000 < 4.0, `hex weight ${hex24x1000}`);

const flat = weightKg({
  shape: "flat",
  density: 7.85,
  thicknessMm: 20,
  widthMm: 75,
  lengthMm: 1000,
  qty: 2,
});
assert.ok(Math.abs(flat - 23.55) < 0.1, `flat weight ${flat}`);

const en8 = getGrade("en-8");
assert.ok(en8, "en-8 exists");
assert.ok(uniqueSizes(en8!, "round").includes(50));

const exact = searchStock({ shape: "round", gradeQuery: "EN-8", sizeMm: 50 });
assert.ok(exact.some((h) => h.exact && h.grade.slug === "en-8"));

const near = searchStock({ shape: "round", gradeQuery: "EN-19", sizeMm: 47 });
assert.ok(near.some((h) => !h.exact && h.below.includes(45) && h.above.includes(50)));

assert.equal(featuredGrades().length, 4);
assert.ok(GRADES.some((g) => g.slug === "stainless"));
assert.ok(GRADES.some((g) => g.name.includes("6082") || g.chips.includes("6082")));
assert.equal(kgLabel(0), "—");
assert.ok(kgLabel(15.41).includes("15.4"));

console.log("metals catalog tests passed");
