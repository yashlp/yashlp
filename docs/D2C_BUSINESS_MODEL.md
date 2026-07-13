# Only Aesthetics — D2C Business Model

Only Aesthetics is a **direct-to-consumer (D2C) multi-brand store**, not a marketplace.

## Flow

```
Small Brand / Manufacturer
        ↓
     You purchase inventory
        ↓
  Inventory arrives at your warehouse
        ↓
 You photograph / video products
        ↓
 Upload to Only Aesthetics admin
        ↓
 Customer places order on your storefront
        ↓
 You pack and ship the order
```

**Customers buy from Only Aesthetics.** You own the customer relationship, inventory, and fulfillment.

## Admin modules

| Module | Route | Status |
|--------|-------|--------|
| Dashboard | `/admin` | Live — revenue, orders, inventory alerts |
| Inventory | `/admin/inventory` | Live — SKU, cost, margin, stock, reorder |
| Purchases | `/admin/purchases` | Live — PO list (create via API) |
| Suppliers | `/admin/suppliers` | Live — add/list suppliers |
| Orders | `/admin/orders` | List view |
| Shipping | `/admin/shipping` | Planned |
| Payments | `/admin/payments` | Planned |
| Returns | `/admin/returns` | Planned |
| Collections | `/admin/collections` | Planned |
| Marketing | `/admin/marketing` | Planned |
| Reviews | `/admin/reviews` | Planned |
| Analytics | `/admin/analytics` | Planned |
| Content | `/admin/content` | Planned |
| Settings | `/admin/settings` | Planned |

## Data model

- **CommerceSupplier** — brands/manufacturers you buy from (GST, contact, bank)
- **CommercePurchaseOrder** — purchase orders with receiving and damaged qty
- **CommerceProduct** — extended with `purchaseCost`, `warehouseLocation`, `supplierId`, `purchaseDate`
- **CommerceReturn** — return/refund workflow
- **CommerceSeller / CommerceBrand** — retained for storefront brand display names (curated multi-brand D2C)

## Setup

```bash
npm run db:setup-commerce
```

Admin login: `/admin/login` — set `COMMERCE_ADMIN_EMAIL` and `COMMERCE_ADMIN_PASSWORD` on Vercel.
