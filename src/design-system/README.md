# Aesthetics Design System

Premium curated marketplace · Royal Blue + Warm Ivory

## Brand

- **Name:** Aesthetics
- **Personality:** Premium, minimal, luxury, calm, warm
- **Inspiration:** Apple, COS, Pinterest, Nothing Phone, Arc Browser

## Color Tokens

| Token | Value | Usage |
|-------|-------|--------|
| `--aes-royal` | `#1B4F9C` | Primary actions, links |
| `--aes-dusty` | `#5A7FA3` | Secondary, labels |
| `--aes-ivory` | `#FDF9F3` | Page background |
| `--aes-white` | `#FFFFFF` | Cards, surfaces |
| `--aes-charcoal` | `#1F1F1F` | Body text |

See `tokens.ts` for full scales (typography, spacing, shadows, motion).

## Typography

- **Display:** Cormorant Garamond — headings, brand wordmark
- **Body:** Inter — UI, paragraphs
- **Mono:** DM Mono — labels, metadata, uppercase tracking

## Components

```
src/components/aesthetics/
  ui/          Button, Card, Badge, Input
  layout/      ConsumerNav, ConsumerFooter
  home/        Hero, CollectionRow, ProductRow, BrandStrip
  shop/        ProductCard
  discover/    DiscoverCard, DiscoverFeed
  seller/      SellerShell
  admin/       PlatformAdminShell
  providers/   CartProvider (cart, wishlist, AI prefs)
```

## Shopping Modes

1. **Classic** — `/aesthetics/shop` grid browse, categories, search
2. **Discover** — `/aesthetics/discover` immersive full-screen with gestures

## Routes

| Route | Purpose |
|-------|---------|
| `/aesthetics` | Consumer homepage |
| `/aesthetics/discover` | Discover mode |
| `/aesthetics/shop` | Classic shopping |
| `/aesthetics/product/[slug]` | Product detail |
| `/seller` | Seller dashboard |
| `/platform-admin` | Platform admin |

## Usage

Import theme in layout:

```tsx
import "@/design-system/theme.css";
```

Wrap consumer routes with `CartProvider` for shared cart and personalization state.
