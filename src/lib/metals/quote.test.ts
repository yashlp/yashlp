import assert from "node:assert/strict";
import { hexAreaMm2, pieceWeightKg, quoteLine, crossSectionMm2 } from "./quote";
import { GRADES, STOCK, getGrade, FEATURED_GRADE_SLUGS } from "./catalog";

function testRoundWeight() {
  // 25 mm dia × 1000 mm, steel 7.85 g/cm³
  // area = π*12.5² = 490.8739 mm²; vol = 490873.9 mm³; kg = 490873.9 * 7.85 / 1e6 = 3.853
  const kg = pieceWeightKg("round", { diameterMm: 25, lengthMm: 1000, qty: 1 }, 7.85);
  assert.ok(Math.abs(kg - 3.853) < 0.02, `round weight ${kg}`);
}

function testSquareWeight() {
  const kg = pieceWeightKg("square", { sideMm: 50, lengthMm: 1000, qty: 1 }, 7.85);
  // 50*50*1000*7.85/1e6 = 19.625
  assert.ok(Math.abs(kg - 19.625) < 0.01, `square weight ${kg}`);
}

function testFlatWeight() {
  const kg = pieceWeightKg("flat", { thicknessMm: 10, widthMm: 50, lengthMm: 1000, qty: 1 }, 7.85);
  assert.ok(Math.abs(kg - 3.925) < 0.01, `flat weight ${kg}`);
}

function testHexArea() {
  const area = hexAreaMm2(20);
  const expected = (Math.sqrt(3) / 2) * 400;
  assert.ok(Math.abs(area - expected) < 1e-9);
  const cs = crossSectionMm2("hex", { sideMm: 20, lengthMm: 1000, qty: 1 });
  assert.ok(Math.abs(cs - expected) < 1e-9);
}

function testExactEn8Round() {
  const result = quoteLine({
    gradeSlug: "en-8",
    shape: "round",
    dims: { diameterMm: 25, lengthMm: 1000, qty: 2 },
  });
  assert.ok(result);
  assert.equal(result.inStock, true);
  assert.ok(result.total > 0);
  assert.ok(result.matches.some((m) => m.exact));
}

function testMissingSizeSuggestsNearest() {
  const result = quoteLine({
    gradeSlug: "en-8",
    shape: "round",
    dims: { diameterMm: 27, lengthMm: 1000, qty: 1 },
  });
  assert.ok(result);
  const withNearest = result.matches.find((m) => m.nearest && (m.nearest.below.length || m.nearest.above.length));
  assert.ok(withNearest, "expected nearest sizes");
  assert.ok(withNearest!.nearest!.below.includes(25) || withNearest!.nearest!.above.includes(28));
}

function testFlatExact() {
  const result = quoteLine({
    gradeSlug: "en-8",
    shape: "flat",
    dims: { thicknessMm: 10, widthMm: 50, lengthMm: 2000, qty: 1 },
  });
  assert.ok(result);
  assert.equal(result.inStock, true);
}

function testCatalogIntegrity() {
  assert.ok(GRADES.length >= 12);
  assert.ok(STOCK.length >= 40);
  for (const slug of FEATURED_GRADE_SLUGS) {
    assert.ok(getGrade(slug), `missing featured grade ${slug}`);
  }
  const names = new Set(GRADES.map((g) => g.slug));
  assert.equal(names.size, GRADES.length);
}

function run() {
  testRoundWeight();
  testSquareWeight();
  testFlatWeight();
  testHexArea();
  testExactEn8Round();
  testMissingSizeSuggestsNearest();
  testFlatExact();
  testCatalogIntegrity();
  console.log("metals quote + catalog tests: ok");
}

run();
