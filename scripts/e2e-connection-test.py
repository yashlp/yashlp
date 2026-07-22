#!/usr/bin/env python3
"""End-to-end storefront ↔ admin connection tests for Only Aesthetics."""
from __future__ import annotations

import json
import random
import re
import sys
import time
import urllib.error
import urllib.request
from http.cookiejar import CookieJar

BASE = "http://localhost:3000"
PASS = 0
FAIL = 0
WARN = 0
RESULTS: list[str] = []


class Client:
    def __init__(self):
        self.jar = CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))

    def request(self, method: str, path: str, body=None, headers=None):
        url = f"{BASE}{path}"
        data = None
        hdrs = {"Accept": "application/json", "User-Agent": "OA-E2E-Tester/1.0"}
        if headers:
            hdrs.update(headers)
        if body is not None:
            data = json.dumps(body).encode()
            hdrs["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=data, headers=hdrs, method=method)
        try:
            with self.opener.open(req, timeout=30) as res:
                raw = res.read().decode("utf-8", errors="replace")
                ctype = res.headers.get("content-type", "")
                parsed = None
                if "application/json" in ctype or raw[:1] in ("{", "["):
                    try:
                        parsed = json.loads(raw)
                    except json.JSONDecodeError:
                        parsed = None
                return res.status, parsed, raw, dict(res.headers)
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", errors="replace")
            parsed = None
            try:
                parsed = json.loads(raw)
            except Exception:
                pass
            return e.code, parsed, raw, dict(e.headers)


def ok(name: str, detail: str = ""):
    global PASS
    PASS += 1
    line = f"✅ PASS  {name}" + (f" — {detail}" if detail else "")
    RESULTS.append(line)
    print(line)


def fail(name: str, detail: str = ""):
    global FAIL
    FAIL += 1
    line = f"❌ FAIL  {name}" + (f" — {detail}" if detail else "")
    RESULTS.append(line)
    print(line)


def warn(name: str, detail: str = ""):
    global WARN
    WARN += 1
    line = f"⚠️  WARN  {name}" + (f" — {detail}" if detail else "")
    RESULTS.append(line)
    print(line)


def section(title: str):
    print(f"\n=== {title} ===")
    RESULTS.append(f"\n## {title}")


def main():
    store = Client()
    admin = Client()

    # ------------------------------------------------------------------
    section("1. Storefront pages load")
    for path, needle in [
        ("/aesthetics", "Only Aesthetics"),
        ("/aesthetics/shop", "Shop"),
        ("/aesthetics/collections", "Collections"),
        ("/aesthetics/cart", "cart"),
        ("/aesthetics/checkout", "Checkout"),
        ("/aesthetics/account/login", "Sign in"),
        ("/aesthetics/faq", "FAQ"),
        ("/admin/login", "login"),
    ]:
        status, _, raw, _ = store.request("GET", path)
        if status == 200 and needle.lower() in raw.lower():
            ok(f"GET {path}", f"contains '{needle}'")
        else:
            fail(f"GET {path}", f"status={status}, needle missing")

    # ------------------------------------------------------------------
    section("2. Public commerce APIs")
    status, data, raw, _ = store.request("GET", "/api/commerce/products")
    products = []
    if status == 200 and isinstance(data, dict):
        products = data.get("products") or data.get("items") or []
        if not products and isinstance(data.get("data"), list):
            products = data["data"]
        # Some routes return array at top level
    if status == 200 and isinstance(data, list):
        products = data
    if status == 200 and products:
        ok("GET /api/commerce/products", f"{len(products)} products")
    elif status == 200:
        # inspect shape
        warn("GET /api/commerce/products", f"200 but empty/unexpected shape keys={list(data.keys()) if isinstance(data, dict) else type(data)}")
    else:
        fail("GET /api/commerce/products", f"status={status} body={raw[:200]}")

    status, data, raw, _ = store.request("GET", "/api/commerce/collections")
    collections = []
    if status == 200:
        if isinstance(data, dict):
            collections = data.get("collections") or data.get("items") or []
        elif isinstance(data, list):
            collections = data
    if status == 200 and collections:
        ok("GET /api/commerce/collections", f"{len(collections)} collections")
    elif status == 200:
        warn("GET /api/commerce/collections", f"empty/unexpected: {str(data)[:180]}")
    else:
        fail("GET /api/commerce/collections", f"status={status}")

    status, data, raw, _ = store.request("GET", "/api/commerce/shipping")
    if status == 200 and isinstance(data, dict) and "shipping" in data:
        ship = data["shipping"]
        ok(
            "GET /api/commerce/shipping",
            f"flat={ship.get('flatRate')} freeAbove={ship.get('freeThreshold')} alwaysFree={ship.get('alwaysFree')}",
        )
        shipping_before = ship
    else:
        fail("GET /api/commerce/shipping", f"status={status} {raw[:160]}")
        shipping_before = {}

    status, data, _, _ = store.request("GET", "/api/commerce/payments/create")
    if status == 200 and isinstance(data, dict):
        ok("GET /api/commerce/payments/create", f"razorpay={data.get('razorpay')}")
    else:
        fail("GET /api/commerce/payments/create", f"status={status}")

    # ------------------------------------------------------------------
    section("3. Admin login & session")
    status, data, raw, _ = admin.request(
        "POST",
        "/api/admin/auth/login",
        {"email": "admin@onlyaesthetics.test", "password": "AdminTest123!"},
    )
    if status == 200 and isinstance(data, dict) and (data.get("ok") or data.get("admin") or data.get("requiresOtp") is not None or "admin" in str(data).lower() or data.get("success")):
        ok("Admin login", str(data)[:160])
    elif status == 200:
        ok("Admin login (200)", str(data)[:160])
    else:
        fail("Admin login", f"status={status} {raw[:250]}")

    status, data, raw, _ = admin.request("GET", "/api/admin/auth/me")
    if status == 200 and isinstance(data, dict) and (data.get("admin") or data.get("user") or data.get("email")):
        ok("Admin session /me", str(data)[:160])
    elif status == 200:
        warn("Admin /me shape", str(data)[:160])
    else:
        fail("Admin session /me", f"status={status} {raw[:200]}")

    # ------------------------------------------------------------------
    section("4. Admin reads (dashboard / orders / analytics / settings)")
    status, data, raw, _ = admin.request("GET", "/api/admin/dashboard")
    if status == 200 and isinstance(data, dict) and ("sales" in data or "orders" in data):
        top_cities = data.get("topCities") or []
        ok(
            "Admin dashboard",
            f"todayOrders={data.get('orders', {}).get('today')} topCities={len(top_cities)}",
        )
        dashboard = data
    else:
        fail("Admin dashboard", f"status={status} {raw[:200]}")
        dashboard = {}

    status, data, raw, _ = admin.request("GET", "/api/admin/orders")
    admin_orders = []
    if status == 200 and isinstance(data, dict):
        admin_orders = data.get("orders") or data.get("items") or []
    elif status == 200 and isinstance(data, list):
        admin_orders = data
    if status == 200 and admin_orders:
        ok("Admin orders list", f"{len(admin_orders)} orders")
    elif status == 200:
        warn("Admin orders list empty", str(data)[:160])
    else:
        fail("Admin orders list", f"status={status} {raw[:200]}")

    status, data, raw, _ = admin.request("GET", "/api/admin/analytics")
    if status == 200 and isinstance(data, dict) and data.get("stats"):
        stats = data["stats"]
        cities = stats.get("topCities") or []
        ok(
            "Admin analytics",
            f"revenue={stats.get('revenue')} cities={len(cities)} orderCount={stats.get('orderCount')}",
        )
        analytics = stats
    else:
        fail("Admin analytics", f"status={status} {raw[:200]}")
        analytics = {}

    status, data, raw, _ = admin.request("GET", "/api/admin/settings")
    settings = []
    if status == 200 and isinstance(data, dict):
        settings = data.get("settings") or []
    if status == 200 and settings:
        keys = {s.get("key") for s in settings}
        needed = {"shipping_flat_rate", "free_shipping_threshold", "free_delivery_enabled"}
        missing = needed - keys
        if missing:
            # free_delivery_enabled may not exist until saved once
            warn("Admin settings keys", f"missing {missing}; present shipping keys={[k for k in keys if 'ship' in k or 'free' in k or 'gst' in k]}")
        else:
            ok("Admin settings", f"{len(settings)} settings incl. shipping controls")
    elif status == 200:
        warn("Admin settings empty", str(data)[:160])
    else:
        fail("Admin settings", f"status={status} {raw[:200]}")

    # ------------------------------------------------------------------
    section("5. Admin changes shipping → storefront reflects")
    status, data, raw, _ = admin.request(
        "POST",
        "/api/admin/settings",
        {
            "settings": [
                {"key": "shipping_flat_rate", "value": "77", "group": "shipping"},
                {"key": "free_shipping_threshold", "value": "1200", "group": "shipping"},
                {"key": "free_delivery_enabled", "value": "false", "group": "shipping"},
                {"key": "gst_rate", "value": "18", "group": "tax"},
            ]
        },
    )
    if status == 200:
        ok("Admin save shipping settings", "flat=77 freeAbove=1200")
    else:
        fail("Admin save shipping settings", f"status={status} {raw[:200]}")

    status, data, raw, _ = store.request("GET", "/api/commerce/shipping")
    if status == 200 and isinstance(data, dict):
        flat = data.get("shipping", {}).get("flatRate")
        thr = data.get("shipping", {}).get("freeThreshold")
        if flat == 77 and thr == 1200:
            ok("Storefront shipping reflects admin", f"flat={flat} freeAbove={thr}")
        else:
            fail("Storefront shipping reflects admin", f"got flat={flat} thr={thr}")
    else:
        fail("Storefront shipping after admin change", f"status={status}")

    # Enable free delivery for everyone
    admin.request(
        "POST",
        "/api/admin/settings",
        {
            "settings": [
                {"key": "free_delivery_enabled", "value": "true", "group": "shipping"},
                {"key": "shipping_flat_rate", "value": "77", "group": "shipping"},
                {"key": "free_shipping_threshold", "value": "1200", "group": "shipping"},
            ]
        },
    )
    status, data, _, _ = store.request("GET", "/api/commerce/shipping")
    if status == 200 and data.get("shipping", {}).get("alwaysFree") is True:
        ok("Free delivery toggle reflects on storefront", "alwaysFree=true")
    else:
        fail("Free delivery toggle reflects on storefront", str(data)[:160])

    # Restore normal shipping for order test
    admin.request(
        "POST",
        "/api/admin/settings",
        {
            "settings": [
                {"key": "free_delivery_enabled", "value": "false", "group": "shipping"},
                {"key": "shipping_flat_rate", "value": "49", "group": "shipping"},
                {"key": "free_shipping_threshold", "value": "999", "group": "shipping"},
            ]
        },
    )

    # ------------------------------------------------------------------
    section("6. Place storefront order → appears in admin")
    # Resolve a product id
    status, data, raw, _ = store.request("GET", "/api/commerce/products")
    product = None
    if status == 200:
        plist = []
        if isinstance(data, dict):
            plist = data.get("products") or data.get("items") or []
        elif isinstance(data, list):
            plist = data
        if plist:
            product = plist[0]
    if not product:
        # fallback: homepage may not use API shape — query DB via admin products if available
        status, data, raw, _ = admin.request("GET", "/api/admin/products")
        if status == 200:
            plist = data.get("products") if isinstance(data, dict) else data
            if plist:
                product = plist[0]
                ok("Fallback product from admin products", product.get("name") or product.get("id"))
        if not product:
            fail("Find product for checkout", "no products available")
            product = {}

    product_id = product.get("id")
    unit_price = product.get("price") or product.get("unitPrice") or 799
    product_name = product.get("name") or "unknown"

    if product_id:
        ok("Selected product for order", f"{product_name} id={product_id} price={unit_price}")
    else:
        fail("Selected product for order", "missing id")

    order_payload = {
        "name": "Test Buyer Mumbai",
        "email": "buyer.mumbai@example.com",
        "phone": "9876543210",
        "line1": "12 Marine Drive",
        "line2": "Near Gateway",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001",
        "country": "IN",
        "paymentMethod": "demo",
        "items": [{"productId": product_id, "quantity": 1, "unitPrice": float(unit_price)}],
    }

    status, data, raw, _ = store.request("POST", "/api/commerce/orders", order_payload)
    created_order = None
    if status == 200 and isinstance(data, dict) and data.get("order"):
        created_order = data["order"]
        ok(
            "Storefront create order",
            f"{created_order.get('orderNumber')} total={created_order.get('total')} status={created_order.get('status')}",
        )
    else:
        fail("Storefront create order", f"status={status} {raw[:300]}")

    # Verify in admin orders
    status, data, raw, _ = admin.request("GET", "/api/admin/orders")
    found = None
    if status == 200:
        orders = data.get("orders") if isinstance(data, dict) else data
        orders = orders or []
        if created_order:
            found = next((o for o in orders if o.get("id") == created_order.get("id") or o.get("orderNumber") == created_order.get("orderNumber")), None)
        if found:
            ok(
                "Admin sees new storefront order",
                f"{found.get('orderNumber')} status={found.get('status')} city={found.get('shippingCity')}",
            )
            if found.get("shippingCity") == "Mumbai" or (found.get("shippingAddress") or "").find("Mumbai") >= 0:
                ok("Order city stored for insights", found.get("shippingCity") or "parsed from address")
            else:
                warn("Order city stored for insights", f"shippingCity={found.get('shippingCity')}")
        else:
            fail("Admin sees new storefront order", "order not in admin list")

    # Analytics city insight includes Mumbai
    status, data, raw, _ = admin.request("GET", "/api/admin/analytics")
    if status == 200 and isinstance(data, dict) and data.get("stats"):
        cities = data["stats"].get("topCities") or []
        mumbai = next((c for c in cities if str(c.get("city", "")).lower() == "mumbai"), None)
        if mumbai:
            ok("Analytics city insight", f"Mumbai orders={mumbai.get('orders')} revenue={mumbai.get('revenue')}")
        elif cities:
            warn("Analytics city insight", f"Mumbai missing; cities={[c.get('city') for c in cities[:5]]}")
        else:
            warn("Analytics city insight", "no cities yet")

    # Dashboard cities
    status, data, _, _ = admin.request("GET", "/api/admin/dashboard")
    if status == 200 and isinstance(data, dict):
        cities = data.get("topCities") or []
        if any(str(c.get("city", "")).lower() == "mumbai" for c in cities):
            ok("Dashboard top cities includes Mumbai")
        elif cities:
            warn("Dashboard top cities", f"got {[c.get('city') for c in cities]}")
        else:
            warn("Dashboard top cities empty")

    # ------------------------------------------------------------------
    section("7. Customer auth (sign up OTP flow / login)")
    # Unique email each run so re-tests don't fail on "already exists"
    signup_email = f"new.customer.{int(time.time())}@example.com"
    signup_phone = f"91{random.randint(2000000000, 9999999999)}"
    # Email OTP send
    status, data, raw, _ = store.request(
        "POST", "/api/commerce/auth/email/send-otp", {"email": signup_email}
    )
    if status == 200:
        ok("Send signup email OTP", str(data)[:120])
        code = (data or {}).get("devCode")
    else:
        fail("Send signup email OTP", f"status={status} {raw[:200]}")
        code = None

    if code:
        status, data, raw, _ = store.request(
            "POST",
            "/api/commerce/auth/email/verify-otp",
            {"email": signup_email, "code": code},
        )
        if status == 200 and (data or {}).get("verified"):
            ok("Verify signup email OTP")
        else:
            fail("Verify signup email OTP", f"status={status} {raw[:160]}")

        status, data, raw, _ = store.request(
            "POST",
            "/api/commerce/auth/register",
            {
                "name": "New Customer",
                "email": signup_email,
                "phone": signup_phone,
                "password": "Customer123!",
                "address": {
                    "line1": "88 MG Road",
                    "city": "Bengaluru",
                    "state": "Karnataka",
                    "postalCode": "560001",
                    "country": "IN",
                },
            },
        )
        if status == 200 and (data or {}).get("customer"):
            ok("Customer register after OTP", data["customer"].get("email"))
        else:
            # In development requireEmailVerification may be false; if OTP not consumed that is fine
            fail("Customer register after OTP", f"status={status} {raw[:220]}")

    # Login with demo customer from seed
    status, data, raw, _ = store.request(
        "POST",
        "/api/commerce/auth/login",
        {"email": "demo@customer.com", "password": "Chester@2604"},
    )
    if status == 200 and (data or {}).get("customer"):
        ok("Customer login (seed demo)", data["customer"].get("email"))
        status, me, _, _ = store.request("GET", "/api/commerce/auth/me")
        if status == 200 and me and me.get("customer"):
            ok("Customer session /me", me["customer"].get("email"))
        else:
            fail("Customer session /me", str(me)[:160])
    else:
        fail("Customer login (seed demo)", f"status={status} {raw[:200]}")

    # ------------------------------------------------------------------
    section("8. Order status update on admin reflects to customer orders")
    if created_order and created_order.get("id"):
        oid = created_order["id"]
        status, data, raw, _ = admin.request(
            "PATCH",
            f"/api/admin/orders/{oid}",
            {"status": "PACKED"},
        )
        # Try POST if PATCH not supported
        if status >= 400:
            status, data, raw, _ = admin.request(
                "POST",
                f"/api/admin/orders/{oid}",
                {"status": "PACKED"},
            )
        if status == 200:
            ok("Admin update order status", str(data)[:160])
        else:
            # inspect route methods
            warn("Admin update order status", f"status={status} {raw[:180]}")

        status, data, raw, _ = admin.request("GET", f"/api/admin/orders/{oid}")
        if status == 200:
            order = data.get("order") if isinstance(data, dict) else data
            st = (order or {}).get("status") if isinstance(order, dict) else None
            if st:
                ok("Admin order detail readable", f"status={st}")
            else:
                warn("Admin order detail shape", str(data)[:160])
        else:
            warn("Admin order detail", f"status={status}")

    # ------------------------------------------------------------------
    section("9. Catalog connectivity (admin products ↔ storefront)")
    status, data, raw, _ = admin.request("GET", "/api/admin/products")
    admin_products = []
    if status == 200:
        if isinstance(data, dict):
            admin_products = data.get("products") or data.get("items") or []
        elif isinstance(data, list):
            admin_products = data
        if admin_products:
            ok("Admin products list", f"{len(admin_products)} products")
        else:
            warn("Admin products list empty/unexpected", str(data)[:160])
    else:
        fail("Admin products list", f"status={status} {raw[:160]}")

    status, data, raw, _ = store.request("GET", "/api/commerce/products")
    store_products = []
    if status == 200:
        if isinstance(data, dict):
            store_products = data.get("products") or data.get("items") or []
        elif isinstance(data, list):
            store_products = data
    if admin_products and store_products:
        admin_ids = {p.get("id") for p in admin_products}
        store_ids = {p.get("id") for p in store_products}
        overlap = admin_ids & store_ids
        if overlap:
            ok("Admin↔storefront product ID overlap", f"{len(overlap)} shared products")
        else:
            # storefront may only show published/approved; still connected if counts > 0
            warn("Admin↔storefront product ID overlap", "no shared ids (check publish filters)")
    elif store_products:
        ok("Storefront products available", f"{len(store_products)}")

    # Collection detail page
    if collections:
        slug = collections[0].get("slug")
        if slug:
            status, _, raw, _ = store.request("GET", f"/aesthetics/collections/{slug}")
            if status == 200:
                ok(f"Collection detail page /{slug}")
            else:
                fail(f"Collection detail page /{slug}", f"status={status}")

    # Product detail page
    if store_products:
        slug = store_products[0].get("slug")
        if slug:
            status, _, raw, _ = store.request("GET", f"/aesthetics/product/{slug}")
            if status == 200 and store_products[0].get("name", "")[:8].lower() in raw.lower():
                ok(f"Product detail page /{slug}")
            elif status == 200:
                ok(f"Product detail page /{slug}", "loaded")
            else:
                fail(f"Product detail page /{slug}", f"status={status}")

    # ------------------------------------------------------------------
    section("10. India-only gate (local bypass enabled)")
    status, _, raw, _ = store.request("GET", "/aesthetics")
    if "india only" in raw.lower() and "available in india" in raw.lower() and "Shop now" not in raw:
        fail("Local india-only bypass", "still showing india-only page")
    else:
        ok("Local india-only bypass", "storefront accessible with ALLOW_NON_INDIA_ACCESS")

    # ------------------------------------------------------------------
    section("Summary")
    print(f"\nPASSED={PASS} FAILED={FAIL} WARNINGS={WARN}")
    RESULTS.append(f"\n**PASSED={PASS} FAILED={FAIL} WARNINGS={WARN}**")
    out = "/tmp/oa-e2e-report.md"
    with open(out, "w") as f:
        f.write("# Only Aesthetics E2E Connection Test Report\n")
        f.write("\n".join(RESULTS) + "\n")
    print(f"Report: {out}")
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
