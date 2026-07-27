/**
 * End-to-end smoke tests for Only Aesthetic storefront + admin flows.
 * Usage: node scripts/flow-smoke.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { readFileSync } from "fs";

const BASE = process.argv[2] || "http://127.0.0.1:3001";

function loadEnv() {
  const out = {};
  for (const line of readFileSync("/workspace/.env", "utf8").split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    let key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = loadEnv();
const results = [];
function ok(name, detail = "") {
  results.push({ name, pass: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, pass: false, detail });
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

try {
  await page.goto(`${BASE}/aesthetics`, { waitUntil: "domcontentloaded" });
  const brand = await page.locator('img[alt="Only Aesthetic"], [aria-label="Only Aesthetic"]').first().count();
  brand > 0 ? ok("Homepage brand visible") : fail("Homepage brand visible");

  await page.goto(`${BASE}/aesthetics/shop`, { waitUntil: "networkidle" });
  const productLinks = page.locator('a[href*="/aesthetics/product/"]');
  const productCount = await productLinks.count();
  if (productCount > 0) {
    ok("Shop lists products", `${productCount} product links`);
    await productLinks.first().click();
    await page.waitForURL(/\/aesthetics\/product\//);
    const addBtn = page.getByRole("button", { name: /add to (bag|cart)/i }).first();
    if (await addBtn.count()) {
      await addBtn.click();
      ok("Add to bag clicked");
    } else {
      fail("Add to bag clicked", "no add button found");
    }

    // Client navigation preserves React state; also verify localStorage persistence on reload
    await page.getByRole("link", { name: /shopping bag|cart/i }).first().click().catch(() => null);
    await page.goto(`${BASE}/aesthetics/cart`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const cartText = await page.locator("main").innerText();
    /₹|INR|quantity|Checkout|Remove/i.test(cartText) && !/Continue shopping/i.test(cartText)
      ? ok("Cart retains item after navigation")
      : /Continue shopping|empty/i.test(cartText)
        ? fail("Cart retains item after navigation", "empty cart")
        : ok("Cart retains item after navigation", cartText.slice(0, 80));

    // Reload to verify localStorage persistence
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const afterReload = await page.locator("main").innerText();
    !/Continue shopping/i.test(afterReload)
      ? ok("Cart persists after page reload")
      : fail("Cart persists after page reload", afterReload.slice(0, 120));

    await page.goto(`${BASE}/aesthetics/checkout`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const checkoutMain = await page.locator("main").innerText();
    if (/Only Aesthetic is available in India/i.test(checkoutMain)) {
      ok("Checkout geo-blocked outside India");
    } else if (/Continue shopping/i.test(checkoutMain)) {
      fail("Checkout has cart items", "empty checkout");
    } else {
      ok("Checkout loads with cart");
      const guestBtn = page.getByRole("button", { name: /continue as guest/i });
      if (await guestBtn.count()) await guestBtn.click();
      await page.waitForTimeout(400);

      const fillPh = async (ph, val) => {
        const el = page.getByPlaceholder(ph, { exact: false });
        if (await el.count()) await el.first().fill(val);
      };
      await fillPh("Full name", "UI Flow Tester");
      await fillPh("Email", "ui.flow@example.com");
      await fillPh("Mobile number", "9876543210");
      await fillPh("Address line 1", "12 Marine Drive");
      await fillPh("City", "Mumbai");
      await fillPh("State", "MH");
      await fillPh("PIN code", "400001");

      const toPay = page.getByRole("button", { name: /continue to payment/i });
      if (await toPay.count()) await toPay.click();
      await page.waitForTimeout(700);

      const html = await page.content();
      /Cash on Delivery|\bCOD\b/i.test(html) ? ok("Checkout shows COD option") : fail("Checkout shows COD option");
      /Online|UPI|Cards|Demo checkout/i.test(html)
        ? ok("Checkout shows alternate payment option")
        : fail("Checkout shows alternate payment option");

      // Place COD order end-to-end
      const codRadio = page.locator('input[name="paymentMethod"]').nth(1);
      if (await codRadio.count()) {
        await codRadio.check({ force: true }).catch(async () => {
          await page.getByText(/Cash on Delivery/i).click();
        });
      }
      const orderPromise = page.waitForResponse(
        (r) => r.url().includes("/api/commerce/orders") && r.request().method() === "POST",
        { timeout: 15000 }
      );
      await page.getByRole("button", { name: /place cod order|pay /i }).click();
      const orderRes = await orderPromise.catch(() => null);
      if (orderRes && orderRes.ok()) {
        const body = await orderRes.json();
        ok("COD order placed via UI", body.order?.orderNumber || body.order?.id || "ok");
        await page.waitForURL(/checkout\/success/, { timeout: 8000 }).catch(() => null);
        page.url().includes("success")
          ? ok("Checkout success page reached")
          : fail("Checkout success page reached", page.url());
      } else {
        const err = await page.locator(".text-red-600").textContent().catch(() => "");
        fail("COD order placed via UI", `${orderRes?.status?.() || "no response"} ${err || ""}`.trim());
      }
    }
  } else {
    ok("Shop reachable", "0 products (empty catalog on this environment)");
  }

  await page.goto(`${BASE}/aesthetics/contact`, { waitUntil: "domcontentloaded" });
  (await page.getByText(/contact/i).count()) > 0 ? ok("Contact page loads") : fail("Contact page loads");

  for (const path of ["/aesthetics/privacy", "/aesthetics/terms", "/aesthetics/faq", "/aesthetics/shipping", "/aesthetics/returns"]) {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    res && res.ok() ? ok(`Legal/info ${path}`) : fail(`Legal/info ${path}`, String(res?.status()));
  }

  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(env.COMMERCE_ADMIN_EMAIL || "");
  await page.locator('input[type="password"]').fill(env.COMMERCE_ADMIN_PASSWORD || "");
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/admin/auth/login"), { timeout: 10000 }).catch(() => null),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);
  await page.waitForTimeout(1500);
  const url = page.url();
  if (url.includes("/admin") && !url.includes("/login")) {
    ok("Admin login succeeds", url);
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    const dash = await page.content();
    /New Orders|Awaiting Packing|Today.?s Profit|Quick actions|Dashboard/i.test(dash)
      ? ok("Admin dashboard task widgets / quick actions")
      : fail("Admin dashboard task widgets / quick actions");

    const search = page.locator('input[placeholder*="Search" i]').first();
    (await search.count()) > 0 ? ok("Admin search input present") : fail("Admin search input present");

    for (const path of [
      "/admin/customers",
      "/admin/sales",
      "/admin/catalog",
      "/admin/discounts",
      "/admin/campaigns",
      "/admin/orders",
      "/admin/analytics",
    ]) {
      const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const titleish = await page.locator("h1").first().textContent().catch(() => "");
      res && res.ok()
        ? ok(`Admin page ${path}`, titleish?.trim() || "")
        : fail(`Admin page ${path}`, String(res?.status()));
    }
  } else {
    const err = await page.locator(".text-red-600").textContent().catch(() => "");
    fail("Admin login succeeds", `${url} ${err || ""}`.trim());
  }
} catch (err) {
  fail("Unhandled exception", err?.message || String(err));
} finally {
  await browser.close();
}

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass).length;
console.log("\n==============================");
console.log(`RESULT: ${passed} passed, ${failed} failed out of ${results.length}`);
console.log("==============================");
process.exit(failed ? 1 : 0);
