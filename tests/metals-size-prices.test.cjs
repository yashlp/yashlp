#!/usr/bin/env node
"use strict";
const assert = require("assert");
const {
  parsePriceKey,
  readPriceEntries,
  pricesMatching,
  formatPriceList,
  listedPriceLine,
  matchSizes,
  priceSizeKey,
} = require("../src/lib/metals/size-prices.ts");

const key = "jk3_EN-8D|Round Bar|Rolled|47";
const parsed = parsePriceKey(key);
assert.strictEqual(parsed.grade, "EN-8D");
assert.strictEqual(parsed.shape, "Round Bar");
assert.strictEqual(parsed.subtype, "Rolled");
assert.strictEqual(parsed.size, "47");

const store = {
  _keys: [key, "jk3_EN-8D|Round Bar|Rod|47", "other"],
  _vals: {
    [key]: "61.5",
    "jk3_EN-8D|Round Bar|Rod|47": "70",
    other: "1",
  },
  get length() { return this._keys.length; },
  key(i) { return this._keys[i] || null; },
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._vals, k) ? this._vals[k] : null; },
};

const entries = readPriceEntries(store);
assert.strictEqual(entries.length, 2);
const matches = pricesMatching(entries, "EN-8D", "Round Bar", "47");
assert.strictEqual(matches.length, 2);
assert.ok(formatPriceList(matches).includes("Rs 61.50/kg"));
assert.ok(formatPriceList(matches).includes("Rolled"));

const flat = pricesMatching(
  [{ grade: "EN-8", shape: "Flat Bar", subtype: "Rolled", size: "6x25", price: 55 }],
  "EN-8",
  "Flat Bar",
  "6×25"
);
assert.strictEqual(priceSizeKey("6×25"), "6x25");
assert.strictEqual(flat.length, 1);
assert.strictEqual(listedPriceLine(flat, "EN-8", "Flat Bar", "6×25").includes("55.00"), true);

const found = matchSizes(["16", "45", "47", "50"], "47");
assert.strictEqual(found.exact, "47");
assert.ok(found.nearest.includes("45"));
assert.ok(found.nearest.includes("50"));

console.log("ok - size price helpers");
