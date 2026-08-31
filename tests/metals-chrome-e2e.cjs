#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..", "public", "metals");
const ART = "/opt/cursor/artifacts";
const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome-stable";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function startStaticServer() {
  return new Promise((resolve) => {
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent((req.url || "/").split("?")[0]);
      if (p === "/" ) p = "/stock.html";
      const file = path.normalize(path.join(ROOT, p));
      if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); res.end("not found"); return; }
        res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
        res.end(buf);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitPort(url, tries = 50) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (_) {}
    await sleep(100);
  }
  throw new Error("timeout waiting for " + url);
}

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
    this.ws = null;
  }
  connect() {
    const self = this;
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(self.wsUrl);
      self.ws = ws;
      ws.onopen = () => resolve();
      ws.onerror = (e) => reject(e);
      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id && self.pending.has(msg.id)) {
          const { resolve: res, reject: rej } = self.pending.get(msg.id);
          self.pending.delete(msg.id);
          if (msg.error) rej(new Error(JSON.stringify(msg.error)));
          else res(msg.result);
        }
      };
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) {
      throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || "eval error");
    }
    return r.result.value;
  }
  close() { try { this.ws.close(); } catch (_) {} }
}

async function screenshot(cdp, name) {
  fs.mkdirSync(ART, { recursive: true });
  const r = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  const file = path.join(ART, name);
  fs.writeFileSync(file, Buffer.from(r.data, "base64"));
  return file;
}

async function main() {
  const { server, port } = await startStaticServer();
  const base = "http://127.0.0.1:" + port;
  const dbgPort = 9229;
  const userDir = fs.mkdtempSync("/tmp/metals-chrome-");
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--window-size=1280,900",
    "--remote-debugging-port=" + dbgPort,
    "--user-data-dir=" + userDir,
    "about:blank",
  ], { stdio: ["ignore", "pipe", "pipe"] });
  let chromeErr = "";
  chrome.stderr.on("data", (d) => { chromeErr += d.toString(); });

  try {
    await waitPort("http://127.0.0.1:" + dbgPort + "/json/version");
    const listRes = await fetch("http://127.0.0.1:" + dbgPort + "/json/list");
    const pages = await listRes.json();
    const pageTarget = pages.find((p) => p.type === "page") || pages[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error("no page target: " + JSON.stringify(pages).slice(0, 400));
    }
    const cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.navigate", { url: base + "/stock.html" });
    await sleep(600);

    const title = await cdp.eval("document.title");
    assert(title.includes("Jagetiya Metals"), "title: " + title);

    await cdp.eval(`document.querySelector('[data-shape="Round Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inSize').value='25'; document.querySelector('#inGrade').value='EN-8D'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    let grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("EN-8D"), "round search EN-8D");
    assert(grid.includes("25") || grid.toLowerCase().includes("exact"), "round 25");
    const searchShot = await screenshot(cdp, "metals-search-round-en8d.png");
    console.log("ok - round search", searchShot);

    await cdp.eval(`document.querySelector('[data-shape="Square Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inSize').value='25'; document.querySelector('#inGrade').value='EN-8'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("Square") || grid.includes("EN-8"), "square search");
    console.log("ok - square search");

    await cdp.eval(`document.querySelector('[data-shape="Hex Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inSize').value='16'; document.querySelector('#inGrade').value='MS'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.toLowerCase().includes("hex") || grid.includes("MS Bright"), "hex search: " + grid.slice(0, 120));
    console.log("ok - hex search");

    await cdp.eval(`document.querySelector('[data-shape="Flat Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inThk').value='6'; document.querySelector('#inWid').value='25'; document.querySelector('#inGrade').value='EN-8'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("EN-8") && (grid.includes("Thickness") || grid.includes("6")), "flat search");
    const flatShot = await screenshot(cdp, "metals-search-flat.png");
    console.log("ok - flat search", flatShot);

    await cdp.eval(`document.querySelector('[data-shape="All"]').click()`);
    await cdp.eval(`document.querySelector('#inGrade').value='WPS'; document.querySelector('#btnSearch').click();`);
    await sleep(300);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("WPS"), "all shapes WPS");
    console.log("ok - all shapes search");

    await cdp.eval(`document.getElementById('t4').click()`);
    await sleep(200);
    const p4 = await cdp.eval("document.getElementById('p4').className");
    assert(p4.includes("on"), "p4 visible after t4 click: " + p4);
    const chem = await cdp.eval("document.getElementById('chemIndividual').innerText");
    assert(chem.includes("C") && chem.includes("%"), "chem table");
    const chemShot = await screenshot(cdp, "metals-chemical-tab.png");
    console.log("ok - chemical tab", chemShot);

    await cdp.eval(`document.getElementById('t1').click()`);
    await sleep(100);
    const p4off = await cdp.eval("document.getElementById('p4').className");
    assert(!/\bon\b/.test(p4off), "p4 hidden on t1");
    const t4off = await cdp.eval("document.getElementById('t4').className");
    assert(!/\bon\b/.test(t4off), "t4 not active on t1");
    console.log("ok - t4 class cleared when switching to search");

    await cdp.eval(`document.getElementById('t3').click()`);
    await sleep(150);
    await cdp.eval(`['2','6','0','4'].forEach(d => document.querySelector('#pin2Overlay [data-k2="'+d+'"]').click())`);
    await sleep(400);
    const p3 = await cdp.eval("document.getElementById('p3').className");
    assert(p3.includes("on"), "stock manager unlocked");
    const opts = await cdp.eval(`[...document.querySelectorAll('#smGrade1 option')].map(o => o.text)`);
    assert(opts.some((l) => l.includes("Flat Bar")), "flat grades in dropdown");
    assert(opts.some((l) => l.includes("Hex Bar")), "hex grades");
    assert(opts.some((l) => l.includes("Square Bar")), "square grades");
    console.log("ok - stock manager dropdown includes flats");

    const roundIdx = opts.findIndex((l) => l.includes("EN-8D") && l.includes("Round Bar") && l.includes("Rolled"));
    await cdp.eval(`document.getElementById('smGrade1').value='${roundIdx}'; document.getElementById('smGrade1').dispatchEvent(new Event('change'));`);
    await sleep(80);
    const sizeLabel = await cdp.eval("document.getElementById('smSizeLabel').textContent");
    assert(sizeLabel.includes("SIZE"), "round size label: " + sizeLabel);
    await cdp.eval(`document.getElementById('smAddSize').value='47'; document.getElementById('btnSmAdd').click();`);
    await sleep(200);
    let msg = await cdp.eval("document.getElementById('smAddMsg').innerText");
    assert(msg.toLowerCase().includes("added"), "add round 47: " + msg);

    const hexIdx = opts.findIndex((l) => l.includes("Hex Bar"));
    await cdp.eval(`document.getElementById('smGrade1').value='${hexIdx}'; document.getElementById('smGrade1').dispatchEvent(new Event('change'));`);
    await sleep(80);
    await cdp.eval(`document.getElementById('smAddSize').value='18'; document.getElementById('btnSmAdd').click();`);
    await sleep(200);
    msg = await cdp.eval("document.getElementById('smAddMsg').innerText");
    assert(msg.toLowerCase().includes("added"), "add hex: " + msg);

    const sqIdx = opts.findIndex((l) => l.includes("Square Bar") && l.includes("EN-8"));
    await cdp.eval(`document.getElementById('smGrade1').value='${sqIdx}'; document.getElementById('smGrade1').dispatchEvent(new Event('change'));`);
    await sleep(80);
    const sideLabel = await cdp.eval("document.getElementById('smSizeLabel').textContent");
    assert(sideLabel.includes("SIDE"), "square labeled SIDE: " + sideLabel);
    const roundDisp = await cdp.eval("getComputedStyle(document.getElementById('smRoundSizeDiv')).display");
    const thkDisp = await cdp.eval("getComputedStyle(document.getElementById('smFlatThicknessDiv')).display");
    assert(roundDisp === "flex", "square uses single size field");
    assert(thkDisp === "none", "flat fields hidden for square");
    await cdp.eval(`document.getElementById('smAddSize').value='18'; document.getElementById('btnSmAdd').click();`);
    await sleep(200);
    msg = await cdp.eval("document.getElementById('smAddMsg').innerText");
    assert(msg.toLowerCase().includes("added"), "add square: " + msg);

    const flatIdx = opts.findIndex((l) => l.includes("EN-8") && l.includes("Flat Bar") && l.includes("Rolled"));
    await cdp.eval(`document.getElementById('smGrade1').value='${flatIdx}'; document.getElementById('smGrade1').dispatchEvent(new Event('change'));`);
    await sleep(80);
    const roundDisp2 = await cdp.eval("getComputedStyle(document.getElementById('smRoundSizeDiv')).display");
    const thkDisp2 = await cdp.eval("getComputedStyle(document.getElementById('smFlatThicknessDiv')).display");
    assert(roundDisp2 === "none", "size hidden for flat");
    assert(thkDisp2 === "flex", "thickness visible for flat");
    await cdp.eval(`document.getElementById('smAddThickness').value='6'; document.getElementById('smAddWidth').value='28'; document.getElementById('btnSmAdd').click();`);
    await sleep(200);
    msg = await cdp.eval("document.getElementById('smAddMsg').innerText");
    assert(msg.includes("6x28"), "add flat 6x28: " + msg);
    const smShot = await screenshot(cdp, "metals-stock-manager-add.png");
    console.log("ok - added round/hex/square/flat", smShot);

    await cdp.send("Page.navigate", { url: base + "/stock.html" });
    await sleep(700);
    const overlay = await cdp.eval("JSON.parse(localStorage.getItem('jk_catalog_v1')||'{}')");
    const rKey = Object.keys(overlay.added || {}).find((k) => k.includes("EN-8D") && k.includes("Rolled"));
    assert(rKey && overlay.added[rKey].includes(47), "47 persisted: " + JSON.stringify(overlay.added));
    const fKey = Object.keys(overlay.addedFlat || {}).find((k) => k.includes("Flat Bar") && k.includes("EN-8"));
    assert(fKey && overlay.addedFlat[fKey]["6"] && overlay.addedFlat[fKey]["6"].includes(28), "6x28 persisted");
    console.log("ok - persist after reload");

    await cdp.eval(`document.querySelector('[data-shape="Round Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inSize').value='47'; document.querySelector('#inGrade').value='EN-8D'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("47") || grid.toLowerCase().includes("exact"), "search finds persisted 47");
    await screenshot(cdp, "metals-search-persisted-47.png");
    console.log("ok - search shows persisted round size");

    await cdp.eval(`document.querySelector('[data-shape="Flat Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inThk').value='6'; document.querySelector('#inWid').value='28'; document.querySelector('#inGrade').value='EN-8'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("28") || grid.includes("EN-8"), "search finds persisted flat");
    console.log("ok - search shows persisted flat size");

    await cdp.eval(`document.getElementById('t3').click()`);
    await sleep(200);
    await cdp.eval(`['2','6','0','4'].forEach(d => document.querySelector('#pin2Overlay [data-k2="'+d+'"]').click())`);
    await sleep(450);
    const remOpts = await cdp.eval(`[...document.querySelectorAll('#smGrade2 option')].map(o => o.text)`);
    const remFlat = remOpts.findIndex((l) => l.includes("EN-8") && l.includes("Flat Bar") && l.includes("Rolled"));
    await cdp.eval(`document.getElementById('smGrade2').value='${remFlat}'; document.getElementById('smGrade2').dispatchEvent(new Event('change'));`);
    await sleep(120);
    const chips = await cdp.eval("document.getElementById('smSizeChips').innerText");
    assert(chips.includes("6x28"), "remove chips show 6x28: " + chips);
    await cdp.eval(`[...document.querySelectorAll('#smSizeChips .rem-chip')].find(c => c.textContent.trim()==='6x28').click()`);
    await sleep(200);
    await cdp.send("Page.navigate", { url: base + "/stock.html" });
    await sleep(700);
    const overlay2 = await cdp.eval("JSON.parse(localStorage.getItem('jk_catalog_v1')||'{}')");
    const fKey2 = Object.keys(overlay2.addedFlat || {}).find((k) => k.includes("Flat Bar") && k.includes("EN-8"));
    const still = fKey2 && overlay2.addedFlat[fKey2]["6"] && overlay2.addedFlat[fKey2]["6"].includes(28);
    const removed = overlay2.removedFlat && Object.values(overlay2.removedFlat).some((m) => m["6"] && m["6"].includes(28));
    assert(!still || removed, "6x28 removed from overlay");
    console.log("ok - remove flat size persists");

    await cdp.eval(`document.getElementById('t2').click()`);
    await sleep(150);
    await cdp.eval(`['1','2','3','4'].forEach(d => document.querySelector('#pinOverlay [data-k="'+d+'"]').click())`);
    await sleep(450);
    const p2 = await cdp.eval("document.getElementById('p2').className");
    assert(p2.includes("on"), "admin unlocked");
    await cdp.eval(`document.getElementById('af').value='EN-8D'; document.getElementById('btnAF').click();`);
    await sleep(150);
    const admin = await cdp.eval("document.getElementById('ptbody').innerText");
    assert(admin.includes("47"), "admin includes added 47");
    await cdp.eval(`
      const row = [...document.querySelectorAll('#ptbody tr')].find(tr => tr.innerText.includes('47') && tr.innerText.includes('Round'));
      const inp = row.querySelector('input.pi');
      const btn = row.querySelector('button.svbtn');
      inp.value = '61.5';
      btn.click();
    `);
    await sleep(200);
    const adminShot = await screenshot(cdp, "metals-admin-price.png");
    console.log("ok - admin price saved", adminShot);
    await cdp.send("Page.navigate", { url: base + "/stock.html" });
    await sleep(700);
    const price = await cdp.eval("localStorage.getItem('jk3_EN-8D|Round Bar|Rolled|47')");
    assert(price === "61.5", "price persisted: " + price);
    console.log("ok - admin price persist");

    await cdp.eval(`document.getElementById('t3').click()`);
    await sleep(200);
    await cdp.eval(`['2','6','0','4'].forEach(d => document.querySelector('#pin2Overlay [data-k2="'+d+'"]').click())`);
    await sleep(450);
    await cdp.eval(`
      document.getElementById('ngName').value='EN-99TEST';
      document.getElementById('ngShape').value='Round Bar';
      document.getElementById('ngShape').dispatchEvent(new Event('change'));
      document.getElementById('ngSub').value='Rod';
      document.getElementById('ngSizes').value='16,20,25';
      document.getElementById('btnNgAdd').click();
    `);
    await sleep(250);
    const ngMsg = await cdp.eval("document.getElementById('ngMsg').innerText");
    assert(ngMsg.toLowerCase().includes("added"), "add grade: " + ngMsg);
    const blank = await cdp.eval(`(function(){
      const opts = [...document.querySelectorAll('#smGradeRename option')];
      const idx = opts.findIndex(o => o.text.includes('EN-99TEST'));
      document.getElementById('smGradeRename').value=String(idx);
      document.getElementById('smGradeRename').dispatchEvent(new Event('change'));
      document.getElementById('smRenameTo').value='';
      document.getElementById('btnSmRename').click();
      return document.getElementById('smRenameMsg').innerText;
    })()`);
    assert(/enter a grade name/i.test(blank), "blank rename: " + blank);
    const renamedMsg = await cdp.eval(`(function(){
      document.getElementById('smRenameTo').value='EN-99RENAMED';
      document.getElementById('btnSmRename').click();
      return document.getElementById('smRenameMsg').innerText;
    })()`);
    assert(/renamed/i.test(renamedMsg) && renamedMsg.includes("EN-99RENAMED"), "rename msg: " + renamedMsg);
    const renameShot = await screenshot(cdp, "metals-rename-grade.png");
    console.log("ok - renamed custom grade", renameShot);

    await cdp.send("Page.navigate", { url: base + "/stock.html" });
    await sleep(700);
    const overlay3 = await cdp.eval("JSON.parse(localStorage.getItem('jk_catalog_v1')||'{}')");
    assert((overlay3.newGrades || []).some((g) => g.g === "EN-99RENAMED"), "newGrades persisted rename");
    assert(!(overlay3.newGrades || []).some((g) => g.g === "EN-99TEST"), "old custom name gone");

    await cdp.eval(`document.getElementById('t3').click()`);
    await sleep(200);
    await cdp.eval(`['2','6','0','4'].forEach(d => document.querySelector('#pin2Overlay [data-k2="'+d+'"]').click())`);
    await sleep(450);
    const renameOpts = await cdp.eval(`[...document.querySelectorAll('#smGradeRename option')].map(o => o.text)`);
    assert(renameOpts.some((t) => t.includes("EN-99RENAMED")), "dropdown shows new name");
    assert(!renameOpts.some((t) => t.includes("EN-99TEST")), "dropdown dropped old name");

    await cdp.eval(`document.getElementById('t1').click()`);
    await sleep(100);
    await cdp.eval(`document.querySelector('[data-shape="Round Bar"]').click()`);
    await cdp.eval(`document.querySelector('#inSize').value='20'; document.querySelector('#inGrade').value='EN-99RENAMED'; document.querySelector('#btnSearch').click();`);
    await sleep(250);
    grid = await cdp.eval("document.querySelector('#grid').innerText");
    assert(grid.includes("EN-99RENAMED"), "search shows renamed grade: " + grid.slice(0, 200));
    assert(grid.includes("20") || grid.toLowerCase().includes("exact"), "renamed grade kept sizes");
    await screenshot(cdp, "metals-search-renamed-grade.png");
    console.log("ok - renamed grade persists in search");

    cdp.close();
    console.log("\nAll Chrome UI checks passed");
  } finally {
    try { chrome.kill("SIGTERM"); } catch (_) {}
    await new Promise((r) => server.close(r));
    if (chromeErr && process.env.DEBUG_CHROME) console.error(chromeErr.slice(0, 500));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
