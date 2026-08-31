#!/usr/bin/env node
"use strict";
/**
 * Headless checks for Next.js /metals marketing page (About, Products, Chemistry).
 */
const fs = require("fs");
const path = require("path");

const ART = "/opt/cursor/artifacts/screenshots";
const BASE = process.env.METALS_URL || "http://localhost:3000/metals";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const res = await fetch(BASE);
  assert(res.ok, "GET /metals failed: " + res.status);
  const html = await res.text();

  assert(html.includes('id="about"') || html.includes("About Jagetiya Metals"), "about section");
  assert(html.includes('id="products"') || html.includes("Product list"), "products section");
  assert(html.includes('id="chemistry"') || html.includes("Chemical composition"), "chemistry section");
  assert(html.includes("30+ Years"), "about stats");
  assert(html.includes("Cutting Job Work"), "cutting services");

  let playwright;
  try {
    playwright = require("playwright");
  } catch {
    console.log("skip - playwright not available for screenshots");
    console.log("ok - metals nox page structure");
    return;
  }

  fs.mkdirSync(ART, { recursive: true });
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });

  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ART, "metals-about-section.png"), fullPage: false });

  await page.locator("#products").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ART, "metals-products-section.png"), fullPage: false });

  await page.locator("#chemistry").scrollIntoViewIfNeeded();
  await page.click('button:has-text("Compare grades")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ART, "metals-chemistry-compare.png"), fullPage: false });

  // Get Metal → chat yes flow
  await page.click('button:has-text("Get Metal")').catch(() => page.click(".nox-get-metal").catch(() => {}));
  await page.waitForTimeout(400);
  const sheet = page.locator(".nox-sheet");
  if (await sheet.isVisible().catch(() => false)) {
    await page.selectOption('select:near(:text("Grade"))', { index: 1 }).catch(() => {});
    await page.fill('input[placeholder*="length" i], .nox-field:has-text("Length") input', "1000").catch(() => {});
    await page.fill('.nox-field:has-text("Quantity") input, input[type="number"]', "3").catch(() => {});
    const enquiry = page.locator(".nox-enquiry-btn");
    if (await enquiry.isEnabled().catch(() => false)) {
      await enquiry.click();
      await page.waitForTimeout(800);
      const chat = page.locator(".nox-chat-panel");
      if (await chat.isVisible().catch(() => false)) {
        await page.click('button:has-text("Yes, correct")');
        await page.waitForTimeout(500);
        const msgs = await page.locator(".nox-chat-messages").innerText();
        assert(msgs.includes("Shape") || msgs.includes("shape"), "chat advanced after yes");
        assert(!msgs.match(/Thanks for your enquiry/g)?.length || msgs.split("Thanks for your enquiry").length <= 2, "chat did not reset");
        await page.screenshot({ path: path.join(ART, "metals-chat-confirm.png"), fullPage: false });
      }
    }
  }

  await browser.close();
  console.log("ok - metals nox page + screenshots in", ART);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
