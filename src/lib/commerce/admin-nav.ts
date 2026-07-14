import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  FolderOpen,
  HeartPulse,
  LayoutDashboard,
  Lock,
  Megaphone,
  Package,
  RotateCcw,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
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
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, description: "Action Center & KPIs" },
      {
        href: "/admin/business-health",
        label: "Business Health",
        icon: HeartPulse,
        description: "Revenue, risk, customers",
      },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse, description: "Stock, SKU, cost, reorder" },
      { href: "/admin/purchases", label: "Purchases", icon: ShoppingCart, description: "Purchase orders & receiving" },
      { href: "/admin/suppliers", label: "Suppliers", icon: Users, description: "Vendor contacts & GST" },
      { href: "/admin/orders", label: "Orders", icon: Package, description: "Pack, ship, invoice" },
      { href: "/admin/shipping", label: "Shipping", icon: Truck, description: "Couriers & labels" },
      { href: "/admin/payments", label: "Payments", icon: Wallet, description: "COD, Razorpay, GST" },
      { href: "/admin/returns", label: "Returns & Refunds", icon: RotateCcw, description: "RMA & refunds" },
      { href: "/admin/customers", label: "Customers", icon: UserRound, description: "CRM & LTV" },
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
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone, description: "Campaigns, coupons, loyalty" },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, description: "Funnel & merchandising" },
      { href: "/admin/content", label: "Content", icon: FileText, description: "CMS pages & banners" },
      { href: "/admin/notifications", label: "Notifications", icon: Bell, description: "Slack, WhatsApp, email" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { href: "/admin/security", label: "Security", icon: Lock, description: "2FA, sessions, devices" },
      { href: "/admin/staff", label: "Admin & Staff", icon: Shield, description: "Roles & team access" },
      { href: "/admin/settings", label: "Settings", icon: Settings, description: "GST, bank, WhatsApp" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: Activity, description: "Activity history" },
    ],
  },
];

export const ADMIN_QUICK_START = [
  { href: "/admin", label: "Action Center", hint: "See what needs attention today" },
  { href: "/admin/inventory", label: "Inventory", hint: "Click Edit on any product" },
  { href: "/admin/customers", label: "Customers", hint: "LTV, orders, reviews" },
  { href: "/admin/orders", label: "Orders", hint: "Invoice, packing slip, mark shipped" },
  { href: "/admin/security", label: "Security", hint: "2FA, sessions, backup codes" },
] as const;

export const ADMIN_MOBILE_TABS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Stock", icon: Warehouse },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "CRM", icon: UserRound },
] as const;
