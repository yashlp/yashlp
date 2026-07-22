import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Megaphone,
  Package,
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
    id: "operations",
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, description: "Today's orders, revenue, alerts" },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse, description: "Stock, SKU, cost, reorder" },
      { href: "/admin/purchases", label: "Purchases", icon: ShoppingCart, description: "Purchase orders & receiving" },
      { href: "/admin/suppliers", label: "Suppliers", icon: Users, description: "Vendor contacts & GST" },
      { href: "/admin/orders", label: "Orders", icon: Package, description: "Pack, ship, invoice" },
      { href: "/admin/shipping", label: "Shipping", icon: Truck, description: "Couriers & labels" },
      { href: "/admin/payments", label: "Payments", icon: Wallet, description: "COD, Razorpay, GST" },
      { href: "/admin/returns", label: "Returns & Refunds", icon: RotateCcw, description: "RMA & refunds" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog & Brand",
    items: [
      { href: "/admin/products", label: "Products", icon: Package, description: "Add & edit catalog" },
      { href: "/admin/collections", label: "Collections", icon: FolderOpen, description: "Curated product groups" },
      { href: "/admin/reviews", label: "Reviews", icon: Star, description: "Moderate customer reviews" },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone, description: "Coupons & campaigns" },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, description: "Revenue, cities & profit" },
      { href: "/admin/content", label: "Content", icon: FileText, description: "CMS pages & banners" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { href: "/admin/staff", label: "Admin & Staff", icon: Shield, description: "Roles & team access" },
      { href: "/admin/settings", label: "Settings", icon: Settings, description: "GST, bank, WhatsApp" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText, description: "Activity history" },
    ],
  },
];

export const ADMIN_QUICK_START = [
  { href: "/admin", label: "Dashboard", hint: "See today's numbers at a glance" },
  { href: "/admin/inventory", label: "Inventory", hint: "Click Edit on any product" },
  { href: "/admin/purchases/new", label: "Purchases", hint: "New PO → receive stock" },
  { href: "/admin/orders", label: "Orders", hint: "Invoice, packing slip, mark shipped" },
  { href: "/admin/staff", label: "Staff", hint: "Add team members with limited roles" },
] as const;

export const ADMIN_MOBILE_TABS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Stock", icon: Warehouse },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/purchases", label: "POs", icon: ShoppingCart },
] as const;
