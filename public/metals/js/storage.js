/* Jagetiya Metals — catalog overlay + price persistence (browser + Node) */
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.JKStorage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  var CATALOG_KEY = "jk_catalog_v1";
  var SNAPSHOT_KEY = "jkcust_v2";
  var LEGACY_KEY = "jkcust";
  var PIN_KEY = "jkpin";
  var PRICE_PREFIX = "jk3_";
  var DEFAULT_PIN = "1234";
  var SM_PIN = "2604";

  function deepClone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function emptyCustom() {
    return { added: {}, removed: {}, addedFlat: {}, removedFlat: {}, newGrades: [] };
  }

  function catalogKey(sh, g, s) {
    return String(sh) + "|" + String(g) + "|" + String(s || "");
  }

  function parseCatalogKey(key) {
    var pts = String(key || "").split("|");
    if (pts.length < 2) return null;
    if (pts.length === 2) return { sh: pts[0], g: pts[1], s: "" };
    return { sh: pts[0], g: pts[1], s: pts.slice(2).join("|") };
  }

  function numEq(a, b) {
    return Math.abs(Number(a) - Number(b)) < 0.0001;
  }

  function hasExact(arr, t) {
    if (!arr || !arr.length) return false;
    var n = Number(t);
    for (var i = 0; i < arr.length; i++) {
      if (numEq(arr[i], n)) return true;
    }
    return false;
  }

  function uniqNums(a) {
    var o = [];
    if (!a) return o;
    for (var i = 0; i < a.length; i++) {
      var n = Number(a[i]);
      if (isNaN(n)) continue;
      if (!hasExact(o, n)) o.push(n);
    }
    return o.sort(function (x, y) { return x - y; });
  }

  function findEntry(db, sh, g, s) {
    var ents = db && db[sh];
    if (!ents) return null;
    for (var i = 0; i < ents.length; i++) {
      var e = ents[i];
      if (e && e.g === g && String(e.s || "") === String(s || "")) return e;
    }
    return null;
  }

  function ensureSz(ent) {
    if (!ent.sz) ent.sz = [];
    return ent.sz;
  }

  function ensureFlat(ent) {
    if (!ent.flat) ent.flat = {};
    return ent.flat;
  }

  function flatKey(thk) {
    var n = Number(thk);
    if (isNaN(n)) return String(thk);
    if (Math.abs(n - Math.round(n)) < 0.0001) return String(Math.round(n));
    return String(n);
  }

  function parseSzList(raw) {
    var out = [];
    String(raw || "").split(",").forEach(function (p) {
      var v = parseFloat(String(p).trim());
      if (!isNaN(v) && v > 0 && !hasExact(out, v)) out.push(v);
    });
    return out;
  }

  function parseFlatPairs(raw) {
    var flat = {};
    var parts = String(raw || "").split(",");
    for (var i = 0; i < parts.length; i++) {
      var token = parts[i].trim();
      if (!token) continue;
      var m = token.match(/^(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)$/);
      if (!m) return { error: "Use thicknessxwidth pairs such as 6x25,6x32,10x50." };
      var thk = parseFloat(m[1]);
      var wid = parseFloat(m[2]);
      var k = flatKey(thk);
      if (!flat[k]) flat[k] = [];
      if (!hasExact(flat[k], wid)) flat[k].push(wid);
    }
    if (!Object.keys(flat).length) return { error: "Enter at least one thicknessxwidth pair (e.g. 6x25)." };
    return { flat: flat };
  }

  function pushUnique(arr, n) {
    if (!hasExact(arr, n)) arr.push(Number(n));
    return arr;
  }

  function filterNum(arr, n) {
    return (arr || []).filter(function (x) { return !numEq(x, n); });
  }

  function migrateIndexKey(key, builtin) {
    var pts = String(key || "").split("|");
    if (pts.length >= 3) return key;
    if (pts.length === 2 && /^\d+$/.test(pts[1])) {
      var sh = pts[0];
      var idx = parseInt(pts[1], 10);
      var e = builtin[sh] && builtin[sh][idx];
      if (e) return catalogKey(sh, e.g, e.s);
    }
    return null;
  }

  function mergeNumMap(dest, src) {
    if (!src) return dest;
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      if (!dest[k]) dest[k] = [];
      var list = src[k] || [];
      for (var i = 0; i < list.length; i++) pushUnique(dest[k], list[i]);
    }
    return dest;
  }

  function mergeFlatMap(dest, src) {
    if (!src) return dest;
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      if (!dest[k]) dest[k] = {};
      var thks = src[k] || {};
      for (var t in thks) {
        if (!Object.prototype.hasOwnProperty.call(thks, t)) continue;
        if (!dest[k][t]) dest[k][t] = [];
        var ws = thks[t] || [];
        for (var i = 0; i < ws.length; i++) pushUnique(dest[k][t], ws[i]);
      }
    }
    return dest;
  }

  function migrateLegacy(legacy, builtin) {
    var out = emptyCustom();
    if (!legacy || typeof legacy !== "object") return out;
    if (legacy.added && !Array.isArray(legacy.added)) {
      for (var k in legacy.added) {
        var nk = migrateIndexKey(k, builtin);
        if (!nk) continue;
        if (!out.added[nk]) out.added[nk] = [];
        (legacy.added[k] || []).forEach(function (n) { pushUnique(out.added[nk], n); });
      }
    }
    if (legacy.removed && !Array.isArray(legacy.removed)) {
      for (var k2 in legacy.removed) {
        var nk2 = migrateIndexKey(k2, builtin);
        if (!nk2) continue;
        if (!out.removed[nk2]) out.removed[nk2] = [];
        (legacy.removed[k2] || []).forEach(function (n) { pushUnique(out.removed[nk2], n); });
      }
    }
    mergeFlatMap(out.addedFlat, legacy.addedFlat);
    mergeFlatMap(out.removedFlat, legacy.removedFlat);
    if (legacy.newGrades && legacy.newGrades.length) {
      out.newGrades = deepClone(legacy.newGrades);
    }
    return out;
  }

  function normalizeCustom(raw, builtin) {
    if (!raw || typeof raw !== "object") return emptyCustom();
    var looksNew = raw.added || raw.removed || raw.addedFlat || raw.removedFlat || raw.newGrades;
    var migrated = migrateLegacy(raw, builtin);
    if (!looksNew) return migrated;
    var out = emptyCustom();
    for (var k in (raw.added || {})) {
      var nk = migrateIndexKey(k, builtin) || (parseCatalogKey(k) ? k : null);
      if (!nk) continue;
      if (!out.added[nk]) out.added[nk] = [];
      (raw.added[k] || []).forEach(function (n) { pushUnique(out.added[nk], n); });
    }
    for (var k2 in (raw.removed || {})) {
      var nk2 = migrateIndexKey(k2, builtin) || (parseCatalogKey(k2) ? k2 : null);
      if (!nk2) continue;
      if (!out.removed[nk2]) out.removed[nk2] = [];
      (raw.removed[k2] || []).forEach(function (n) { pushUnique(out.removed[nk2], n); });
    }
    var af = {};
    for (var fk in (raw.addedFlat || {})) {
      var nfk = migrateIndexKey(fk, builtin) || fk;
      af[nfk] = raw.addedFlat[fk];
    }
    mergeFlatMap(out.addedFlat, af);
    var rf = {};
    for (var rk in (raw.removedFlat || {})) {
      var nrk = migrateIndexKey(rk, builtin) || rk;
      rf[nrk] = raw.removedFlat[rk];
    }
    mergeFlatMap(out.removedFlat, rf);
    if (raw.newGrades && raw.newGrades.length) out.newGrades = deepClone(raw.newGrades);
    return out;
  }

  function applyNewGrade(db, ng) {
    if (!ng || !ng.g || !ng.sh) return;
    if (!db[ng.sh]) db[ng.sh] = [];
    if (findEntry(db, ng.sh, ng.g, ng.s)) return;
    var row = { g: ng.g, s: ng.s || "", m: ng.m || "" };
    if (ng.note && !ng.sz && !ng.flat) {
      row.note = 1;
    } else if (ng.flat) {
      row.flat = deepClone(ng.flat);
    } else {
      row.sz = uniqNums(ng.sz || []);
    }
    db[ng.sh].push(row);
  }

  function applyFlatDelta(ent, added, removed) {
    if (!ent) return;
    if (added) {
      var flat = ensureFlat(ent);
      for (var t in added) {
        if (!Object.prototype.hasOwnProperty.call(added, t)) continue;
        var tk = flatKey(t);
        if (!flat[tk]) flat[tk] = [];
        (added[t] || []).forEach(function (w) { pushUnique(flat[tk], w); });
      }
    }
    if (removed && ent.flat) {
      for (var t2 in removed) {
        if (!Object.prototype.hasOwnProperty.call(removed, t2)) continue;
        var tk2 = flatKey(t2);
        if (!ent.flat[tk2]) continue;
        (removed[t2] || []).forEach(function (w) {
          ent.flat[tk2] = filterNum(ent.flat[tk2], w);
        });
        if (!ent.flat[tk2].length) delete ent.flat[tk2];
      }
    }
  }

  function applyCustom(builtin, custom) {
    var db = deepClone(builtin);
    var c = custom || emptyCustom();
    (c.newGrades || []).forEach(function (ng) { applyNewGrade(db, ng); });
    for (var ak in (c.added || {})) {
      var a = parseCatalogKey(ak);
      if (!a) continue;
      var entA = findEntry(db, a.sh, a.g, a.s);
      if (!entA) continue;
      var sz = ensureSz(entA);
      (c.added[ak] || []).forEach(function (n) { pushUnique(sz, n); });
    }
    for (var rk in (c.removed || {})) {
      var r = parseCatalogKey(rk);
      if (!r) continue;
      var entR = findEntry(db, r.sh, r.g, r.s);
      if (!entR || !entR.sz) continue;
      (c.removed[rk] || []).forEach(function (n) {
        entR.sz = filterNum(entR.sz, n);
      });
    }
    for (var afk in (c.addedFlat || {})) {
      var af = parseCatalogKey(afk);
      if (!af) continue;
      applyFlatDelta(findEntry(db, af.sh, af.g, af.s), c.addedFlat[afk], null);
    }
    for (var rfk in (c.removedFlat || {})) {
      var rf = parseCatalogKey(rfk);
      if (!rf) continue;
      applyFlatDelta(findEntry(db, rf.sh, rf.g, rf.s), null, c.removedFlat[rfk]);
    }
    return db;
  }

  function readJson(store, key) {
    try {
      var v = store.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  }

  function writeJson(store, key, val) {
    try {
      store.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadCustom(store, builtin) {
    var v1 = readJson(store, CATALOG_KEY);
    if (v1) return normalizeCustom(v1, builtin);
    var snap = readJson(store, SNAPSHOT_KEY);
    if (snap && snap.overlay) return normalizeCustom(snap.overlay, builtin);
    if (snap && (snap.added || snap.newGrades || snap.addedFlat)) return normalizeCustom(snap, builtin);
    var legacy = readJson(store, LEGACY_KEY);
    if (legacy) return normalizeCustom(legacy, builtin);
    return emptyCustom();
  }

  function saveCustom(store, custom) {
    var c = custom || emptyCustom();
    writeJson(store, CATALOG_KEY, c);
    writeJson(store, SNAPSHOT_KEY, { overlay: c, savedAt: new Date().toISOString() });
    writeJson(store, LEGACY_KEY, c);
    return c;
  }

  function addSize(db, custom, sh, g, s, size) {
    var n = Number(size);
    if (isNaN(n) || n <= 0) return { ok: false, error: "Enter a valid size in mm." };
    var ent = findEntry(db, sh, g, s);
    if (!ent) return { ok: false, error: "Grade not found." };
    var sz = ensureSz(ent);
    if (hasExact(sz, n)) return { ok: false, error: n + " mm already exists in " + ent.g + "." };
    sz.push(n);
    var k = catalogKey(sh, g, s);
    if (!custom.added) custom.added = {};
    if (!custom.added[k]) custom.added[k] = [];
    pushUnique(custom.added[k], n);
    if (custom.removed && custom.removed[k]) custom.removed[k] = filterNum(custom.removed[k], n);
    return { ok: true, size: n, ent: ent };
  }

  function addFlatSize(db, custom, sh, g, s, thk, width) {
    var t = Number(thk);
    var w = Number(width);
    if (isNaN(t) || t <= 0 || isNaN(w) || w <= 0) {
      return { ok: false, error: "Enter thickness and width in mm." };
    }
    var ent = findEntry(db, sh, g, s);
    if (!ent) return { ok: false, error: "Grade not found." };
    var flat = ensureFlat(ent);
    var tk = flatKey(t);
    if (!flat[tk]) flat[tk] = [];
    if (hasExact(flat[tk], w)) return { ok: false, error: tk + "x" + w + " already exists in " + ent.g + "." };
    flat[tk].push(w);
    var k = catalogKey(sh, g, s);
    if (!custom.addedFlat) custom.addedFlat = {};
    if (!custom.addedFlat[k]) custom.addedFlat[k] = {};
    if (!custom.addedFlat[k][tk]) custom.addedFlat[k][tk] = [];
    pushUnique(custom.addedFlat[k][tk], w);
    if (custom.removedFlat && custom.removedFlat[k] && custom.removedFlat[k][tk]) {
      custom.removedFlat[k][tk] = filterNum(custom.removedFlat[k][tk], w);
      if (!custom.removedFlat[k][tk].length) delete custom.removedFlat[k][tk];
    }
    return { ok: true, label: tk + "x" + w, ent: ent };
  }

  function removeSize(db, custom, sh, g, s, size) {
    var n = Number(size);
    var ent = findEntry(db, sh, g, s);
    if (!ent) return { ok: false, error: "Grade not found." };
    if (ent.sz) ent.sz = filterNum(ent.sz, n);
    var k = catalogKey(sh, g, s);
    if (!custom.removed) custom.removed = {};
    if (!custom.removed[k]) custom.removed[k] = [];
    pushUnique(custom.removed[k], n);
    if (custom.added && custom.added[k]) custom.added[k] = filterNum(custom.added[k], n);
    return { ok: true, size: n, ent: ent };
  }

  function removeFlatSize(db, custom, sh, g, s, thk, width) {
    var t = Number(thk);
    var w = Number(width);
    var ent = findEntry(db, sh, g, s);
    if (!ent) return { ok: false, error: "Grade not found." };
    var tk = flatKey(t);
    if (ent.flat && ent.flat[tk]) {
      ent.flat[tk] = filterNum(ent.flat[tk], w);
      if (!ent.flat[tk].length) delete ent.flat[tk];
    }
    var k = catalogKey(sh, g, s);
    if (!custom.removedFlat) custom.removedFlat = {};
    if (!custom.removedFlat[k]) custom.removedFlat[k] = {};
    if (!custom.removedFlat[k][tk]) custom.removedFlat[k][tk] = [];
    pushUnique(custom.removedFlat[k][tk], w);
    if (custom.addedFlat && custom.addedFlat[k] && custom.addedFlat[k][tk]) {
      custom.addedFlat[k][tk] = filterNum(custom.addedFlat[k][tk], w);
      if (!custom.addedFlat[k][tk].length) delete custom.addedFlat[k][tk];
    }
    return { ok: true, label: tk + "x" + w, ent: ent };
  }

  function addNewGrade(db, custom, payload) {
    var gname = (payload.g || "").trim();
    var shape = payload.sh;
    var sub = (payload.s || "").trim();
    if (!gname) return { ok: false, error: "Enter a grade name." };
    if (!sub) return { ok: false, error: "Enter a sub-type (e.g. Rod)." };
    if (!shape) return { ok: false, error: "Select a shape." };
    if (!db[shape]) db[shape] = [];
    if (findEntry(db, shape, gname, sub)) {
      return { ok: false, error: "This grade already exists. Use Add Size above instead." };
    }
    var rec = { g: gname, sh: shape, s: sub, m: payload.m || "" };
    var row = { g: gname, s: sub, m: rec.m };
    if (shape === "Flat Bar") {
      var parsed = parseFlatPairs(payload.sizesRaw || "");
      if (parsed.error) return { ok: false, error: parsed.error };
      rec.flat = parsed.flat;
      row.flat = deepClone(parsed.flat);
    } else if (shape === "Non-Ferrous") {
      var sz = parseSzList(payload.sizesRaw || "");
      if (sz.length) {
        rec.sz = sz;
        row.sz = sz.slice();
      } else {
        rec.note = 1;
        row.note = 1;
      }
    } else {
      var sz2 = parseSzList(payload.sizesRaw || "");
      if (!sz2.length) return { ok: false, error: "Enter at least one size. Use comma-separated numbers like 16,20,25." };
      rec.sz = sz2;
      row.sz = sz2.slice();
    }
    db[shape].push(row);
    if (!custom.newGrades) custom.newGrades = [];
    custom.newGrades.push(rec);
    return { ok: true, rec: rec, row: row };
  }

  function listGrades(db, sl) {
    var list = [];
    var shapes = sl || Object.keys(db);
    for (var si = 0; si < shapes.length; si++) {
      var sh = shapes[si];
      var ents = db[sh];
      if (!ents) continue;
      for (var ei = 0; ei < ents.length; ei++) {
        var e = ents[ei];
        list.push({
          label: e.g + " (" + sh + " - " + e.s + ")",
          sh: sh,
          g: e.g,
          s: e.s,
          hasFlat: !!e.flat,
          hasSz: !!(e.sz && e.sz.length),
          note: !!e.note
        });
      }
    }
    return list;
  }

  function flatChips(ent) {
    var out = [];
    if (!ent || !ent.flat) return out;
    var thks = Object.keys(ent.flat).map(Number).sort(function (a, b) { return a - b; });
    for (var i = 0; i < thks.length; i++) {
      var t = thks[i];
      var ws = uniqNums(ent.flat[flatKey(t)] || ent.flat[t] || []);
      for (var j = 0; j < ws.length; j++) out.push({ label: flatKey(t) + "x" + ws[j], thk: t, width: ws[j] });
    }
    return out;
  }

  function pkey(g, sh, st, sz) {
    return g + "|" + sh + "|" + st + "|" + sz;
  }

  function getPrice(store, g, sh, st, sz) {
    try {
      var v = store.getItem(PRICE_PREFIX + pkey(g, sh, st, sz));
      return v !== null ? parseFloat(v) : null;
    } catch (e) {
      return null;
    }
  }

  function setPrice(store, g, sh, st, sz, p) {
    try {
      store.setItem(PRICE_PREFIX + pkey(g, sh, st, sz), String(p));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getPin(store) {
    try {
      var v = store.getItem(PIN_KEY);
      return v ? v : DEFAULT_PIN;
    } catch (e) {
      return DEFAULT_PIN;
    }
  }

  function savePin(store, p) {
    try { store.setItem(PIN_KEY, p); } catch (e) {}
  }

  function memoryStore(seed) {
    var mem = seed ? Object.assign({}, seed) : {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
      _mem: mem
    };
  }

  return {
    CATALOG_KEY: CATALOG_KEY,
    SNAPSHOT_KEY: SNAPSHOT_KEY,
    LEGACY_KEY: LEGACY_KEY,
    PIN_KEY: PIN_KEY,
    PRICE_PREFIX: PRICE_PREFIX,
    DEFAULT_PIN: DEFAULT_PIN,
    SM_PIN: SM_PIN,
    emptyCustom: emptyCustom,
    catalogKey: catalogKey,
    parseCatalogKey: parseCatalogKey,
    findEntry: findEntry,
    hasExact: hasExact,
    uniqNums: uniqNums,
    parseSzList: parseSzList,
    parseFlatPairs: parseFlatPairs,
    migrateLegacy: migrateLegacy,
    normalizeCustom: normalizeCustom,
    applyCustom: applyCustom,
    loadCustom: loadCustom,
    saveCustom: saveCustom,
    addSize: addSize,
    addFlatSize: addFlatSize,
    removeSize: removeSize,
    removeFlatSize: removeFlatSize,
    addNewGrade: addNewGrade,
    listGrades: listGrades,
    flatChips: flatChips,
    pkey: pkey,
    getPrice: getPrice,
    setPrice: setPrice,
    getPin: getPin,
    savePin: savePin,
    memoryStore: memoryStore,
    deepClone: deepClone,
    flatKey: flatKey
  };
});
