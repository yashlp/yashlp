import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BadgePercent,
  Boxes,
  FileSearch,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Megaphone,
  Package,
  Receipt,
  Rocket,
  RotateCcw,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Users,
  Warehouse,
  Wallet,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export type AdminNavSection = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

/** Sidebar sections — each group is a distinct area of the D2C business. */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: "sales",
    label: "Sales",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, description: "What needs action right now" },
      { href: "/admin/sales", label: "Sales", icon: Receipt, description: "Revenue, profit and order flow" },
      { href: "/admin/orders", label: "Orders", icon: Package, description: "Pack, ship, invoice" },
      { href: "/admin/customers", label: "Customers", icon: Users, description: "Customer value and support" },
      { href: "/admin/shipping", label: "Shipping", icon: Truck, description: "Couriers & labels" },
      { href: "/admin/payments", label: "Payments", icon: Wallet, description: "COD, Razorpay, GST" },
      { href: "/admin/returns", label: "Returns & Refunds", icon: RotateCcw, description: "RMA & refunds" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    items: [
      { href: "/admin/catalog", label: "Catalog", icon: Boxes, description: "Products, collections, inventory" },
      { href: "/admin/products", label: "Products", icon: Package, description: "Add & edit catalog" },
      { href: "/admin/collections", label: "Collections", icon: FolderOpen, description: "Curated product groups" },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse, description: "Stock, SKU, cost, reorder" },
      { href: "/admin/suppliers", label: "Suppliers", icon: Users, description: "Vendor contacts & rating" },
      { href: "/admin/purchases", label: "Purchases", icon: ShoppingCart, description: "Purchase orders & receiving" },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone, description: "Email, WhatsApp, Instagram" },
      { href: "/admin/discounts", label: "Discounts", icon: BadgePercent, description: "Coupons, gift cards, referrals" },
      { href: "/admin/campaigns", label: "Campaigns", icon: FileSearch, description: "Influencers and affiliates" },
      { href: "/admin/reviews", label: "Reviews", icon: Star, description: "Moderate customer reviews" },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, description: "Revenue, AOV, city, supplier" },
      { href: "/admin/content", label: "Content", icon: FileText, description: "CMS pages & banners" },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      { href: "/admin/staff", label: "Admin & Staff", icon: Shield, description: "Roles & team access" },
      { href: "/admin/settings", label: "Settings", icon: Settings, description: "GST, bank, WhatsApp" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText, description: "Activity history" },
      { href: "/admin/launch", label: "Go Live", icon: Rocket, description: "Launch checklist & missing env" },
    ],
  },
];

export const ADMIN_QUICK_ACTIONS = [
  { href: "/admin/products/new", label: "Add Product", hint: "Create a new SKU", icon: Package },
  { href: "/admin/purchases/new", label: "Create Purchase Order", hint: "Raise PO to supplier", icon: ShoppingCart },
  { href: "/admin/orders", label: "Ship Order", hint: "Generate label and mark shipped", icon: Truck },
  { href: "/admin/discounts", label: "Create Coupon", hint: "Set discount code rules", icon: BadgePercent },
  { href: "/admin/suppliers", label: "Add Supplier", hint: "Store contacts and margins", icon: Users },
] as const;

export const ADMIN_MOBILE_TABS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Boxes },
] as const;
