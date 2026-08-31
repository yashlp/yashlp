/**
 * Regenerates public/metals/js/catalog.js from src/lib/metals/builtin-catalog.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BUILTIN_DB, CHEM_COMP, SHAPES_LIST } from "../src/lib/metals/builtin-catalog";
import { buildBuiltinChemComp, listUniqueGradesFromDb } from "../src/lib/metals/chem-catalog";

const SYNCED_CHEM_COMP = buildBuiltinChemComp(
  CHEM_COMP,
  listUniqueGradesFromDb(BUILTIN_DB)
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const body = `/* AUTO-GENERATED — do not edit by hand.
 * Source: src/lib/metals/builtin-catalog.ts
 * Regenerate: npm run sync:metals-catalog
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.JKData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
var SL = ${JSON.stringify([...SHAPES_LIST])};

var DB = ${JSON.stringify(BUILTIN_DB)};

function gc(g) {
  var u = g.toUpperCase();
  if (u.indexOf("EN-8") !== -1)  return "#1A5276";
  if (u.indexOf("EN-9") !== -1)  return "#1E8449";
  if (u.indexOf("EN-19") !== -1) return "#A04000";
  if (u.indexOf("EN-24") !== -1) return "#922B21";
  if (u.indexOf("EN-31") !== -1) return "#117A65";
  if (u.indexOf("EN-35") !== -1) return "#9A7D0A";
  if (u.indexOf("20MN") !== -1)  return "#6C3483";
  if (u.indexOf("WPS") !== -1)   return "#C0392B";
  if (u.indexOf("MS") !== -1)    return "#2C3E50";
  if (u.indexOf("BRASS") !== -1) return "#7D6608";
  if (u.indexOf("COPPER") !== -1)return "#935116";
  if (u.indexOf("ALUM") !== -1)  return "#1A5276";
  if (u.indexOf("SS") !== -1)    return "#1E8449";
  return "#2C3E50";
}

function uniqSort(a) {
  var o = [];
  for (var i = 0; i < a.length; i++) { if (o.indexOf(Number(a[i])) === -1) o.push(Number(a[i])); }
  return o.sort(function(x,y){return x-y;});
}

function nearest(a, t, n) {
  var s = uniqSort(a), bl = [], ab = [];
  for (var i = 0; i < s.length; i++) {
    var diff = s[i] - t;
    if (diff < -0.0001) bl.push(s[i]);
    else if (diff > 0.0001) ab.push(s[i]);
  }
  return {b: bl.slice(-n), a: ab.slice(0,n)};
}
function hasExact(arr, t) {
  for (var i = 0; i < arr.length; i++) { if (Math.abs(arr[i]-t) < 0.0001) return true; }
  return false;
}

var CHEM_COMP = ${JSON.stringify(SYNCED_CHEM_COMP, null, 4)};

  var BUILTIN_DB = (typeof structuredClone === "function")
    ? structuredClone(DB)
    : JSON.parse(JSON.stringify(DB));

  function cloneBuiltin() {
    return JSON.parse(JSON.stringify(BUILTIN_DB));
  }

  return {
    SL: SL,
    BUILTIN_DB: BUILTIN_DB,
    CHEM_COMP: CHEM_COMP,
    cloneBuiltin: cloneBuiltin,
    gc: gc,
    uniqSort: uniqSort,
    nearest: nearest,
    hasExact: hasExact
  };
});
`;

const targets = [
  path.join(root, "public/metals/js/catalog.js"),
  path.join(root, "public/metals/search/js/catalog.js"),
];

for (const file of targets) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
  console.log("wrote", path.relative(root, file));
}
