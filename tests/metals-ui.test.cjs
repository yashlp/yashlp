#!/usr/bin/env node
"use strict";
/**
 * Headless UI checks for Jagetiya Metals.
 * Uses Playwright if a browser is installed; otherwise falls back to HTML/structure assertions.
 */
const fs = require("fs");
const path = require("path");
const http = require("http");
const root = path.join(__dirname, "..", "public", "metals");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function structureTests() {
  const must = [
    "Round Bar", "Square Bar", "Hex Bar", "Flat Bar", "Non-Ferrous", "All Shapes",
    "id=\"t4\"", "id=\"p4\"", "id=\"smAddThickness\"", "id=\"smAddWidth\"",
    "id=\"smSizeLabel\"", "PIN required", "Chemical Composition",
    "id=\"smGradeRename\"", "id=\"smRenameTo\"", "id=\"btnSmRename\"", "Rename a Grade",
    "js/catalog.js", "js/storage.js", "js/app.js", "css/styles.css",
    "24AGIPS3207M1Z7", "Kamlesh@jkmetal.in",
  ];
  for (const s of must) assert(html.includes(s), "HTML missing: " + s);
  assert(!html.includes("smAddSquareSide2"), "dead SIDE 2 field should be gone");
  assert(!html.includes("No password needed"), "PIN copy should not say no password");
  console.log("ok - html structure");
}

async function withServer(fn) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p === "/" || p === "/metals" || p === "/metals/") p = "/index.html";
    if (p.startsWith("/metals/")) p = p.slice("/metals".length);
    const file = path.normalize(path.join(root, p));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end("not found"); return; }
      res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
      res.end(buf);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  try {
    await fn("http://127.0.0.1:" + port);
  } finally {
    await new Promise((r) => server.close(r));
  }
}

async function playwrightTests(base) {
  let playwright;
  try { playwright = require("playwright"); }
  catch { console.log("skip - playwright package not resolvable"); return false; }
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
  } catch (e) {
    console.log("skip - chromium not installed (" + e.message.split("\n")[0] + ")");
    return false;
  }
  const page = await browser.newPage();
  await page.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
  const title = await page.title();
  assert(title.includes("Jagetiya Metals"), "title");

  await page.click('[data-shape="Round Bar"]');
  await page.fill("#inSize", "25");
  await page.fill("#inGrade", "EN-8D");
  await page.click("#btnSearch");
  await page.waitForTimeout(200);
  const roundHtml = await page.locator("#grid").innerHTML();
  assert(roundHtml.includes("EN-8D"), "round search shows EN-8D");
  assert(roundHtml.includes("Exact size available") || roundHtml.includes("25"), "round size 25");

  await page.click('[data-shape="Flat Bar"]');
  await page.fill("#inThk", "6");
  await page.fill("#inWid", "25");
  await page.fill("#inGrade", "EN-8");
  await page.click("#btnSearch");
  await page.waitForTimeout(200);
  const flatHtml = await page.locator("#grid").innerHTML();
  assert(flatHtml.includes("Flat Bar") || flatHtml.includes("EN-8"), "flat search");

  await page.click("#t4");
  await page.waitForTimeout(150);
  const p4 = await page.locator("#p4").getAttribute("class");
  assert(p4.includes("on"), "chemical tab stays visible, class=" + p4);
  const chem = await page.locator("#chemIndividual").innerText();
  assert(chem.includes("C") && chem.includes("%"), "chem table rendered");
  const t4 = await page.locator("#t4").getAttribute("class");
  assert(t4.includes("on"), "t4 active");
  await page.click("#t1");
  const p4after = await page.locator("#p4").getAttribute("class");
  assert(!/\bon\b/.test(p4after), "leaving search hides p4");

  await page.click("#t3");
  await page.waitForTimeout(50);
  for (const d of ["2", "6", "0", "4"]) {
    await page.click('#pin2Overlay [data-k2="' + d + '"]');
  }
  await page.waitForTimeout(300);
  const p3 = await page.locator("#p3").getAttribute("class");
  assert(p3.includes("on"), "stock manager unlocks");

  const labels = await page.locator("#smGrade1 option").allTextContents();
  assert(labels.some((l) => l.includes("Flat Bar")), "flat grades in add-size dropdown");
  assert(labels.some((l) => l.includes("Hex Bar")), "hex grades present");

  const roundOpt = labels.findIndex((l) => l.includes("EN-8D") && l.includes("Round Bar") && l.includes("Rolled"));
  await page.selectOption("#smGrade1", String(roundOpt));
  await page.fill("#smAddSize", "47");
  await page.click("#btnSmAdd");
  await page.waitForTimeout(150);
  const addMsg = await page.locator("#smAddMsg").innerText();
  assert(addMsg.toLowerCase().includes("added"), "add size message: " + addMsg);

  const flatOpt = labels.findIndex((l) => l.includes("EN-8") && l.includes("Flat Bar") && l.includes("Rolled"));
  await page.selectOption("#smGrade1", String(flatOpt));
  await page.waitForTimeout(50);
  const roundDisp = await page.locator("#smRoundSizeDiv").evaluate((el) => getComputedStyle(el).display);
  const thkDisp = await page.locator("#smFlatThicknessDiv").evaluate((el) => getComputedStyle(el).display);
  assert(roundDisp === "none", "round size hidden for flat");
  assert(thkDisp === "flex", "thickness shown for flat");
  await page.fill("#smAddThickness", "6");
  await page.fill("#smAddWidth", "28");
  await page.click("#btnSmAdd");
  await page.waitForTimeout(150);
  const addFlatMsg = await page.locator("#smAddMsg").innerText();
  assert(addFlatMsg.includes("6x28"), "flat add message: " + addFlatMsg);

  await page.reload({ waitUntil: "domcontentloaded" });
  const overlay = JSON.parse(await page.evaluate(() => localStorage.getItem("jk_catalog_v1")));
  const roundKey = Object.keys(overlay.added || {}).find((k) => k.includes("EN-8D") && k.includes("Rolled"));
  assert(roundKey && overlay.added[roundKey].includes(47), "47 mm persisted");
  const flatKey = Object.keys(overlay.addedFlat || {}).find((k) => k.includes("Flat Bar") && k.includes("EN-8"));
  assert(flatKey && overlay.addedFlat[flatKey]["6"].includes(28), "6x28 persisted");

  await page.click('[data-shape="Round Bar"]');
  await page.fill("#inSize", "47");
  await page.fill("#inGrade", "EN-8D");
  await page.click("#btnSearch");
  await page.waitForTimeout(200);
  const after = await page.locator("#grid").innerHTML();
  assert(after.includes("47") || after.includes("Exact size"), "search finds persisted 47");

  await page.click("#t2");
  for (const d of ["1", "2", "3", "4"]) await page.click('#pinOverlay [data-k="' + d + '"]');
  await page.waitForTimeout(350);
  await page.fill("#af", "EN-8D");
  await page.click("#btnAF");
  await page.waitForTimeout(100);
  const admin = await page.locator("#ptbody").innerText();
  assert(admin.includes("47"), "admin table includes added size 47");

  const shotDir = "/opt/cursor/artifacts";
  try {
    fs.mkdirSync(shotDir, { recursive: true });
    await page.screenshot({ path: path.join(shotDir, "metals-admin-persisted-size.png"), fullPage: true });
  } catch (_) {}

  await browser.close();
  console.log("ok - playwright ui persistence + tabs");
  return true;
}

(async () => {
  structureTests();
  await withServer(async (base) => {
    const ran = await playwrightTests(base);
    if (!ran) console.log("playwright ui tests skipped");
  });
  console.log("metals ui checks complete");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
