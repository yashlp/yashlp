"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, LayoutDashboard, MapPin, MessageSquare, Rocket, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/launch", label: "Launch", icon: Rocket },
  { href: "/admin/incidents", label: "Pins", icon: MapPin },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/picture-approvals", label: "Picture Approval", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-orange-100 pb-4">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white text-stone-600 ring-1 ring-orange-100 hover:bg-orange-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="ml-auto flex items-center rounded-xl px-3 py-2 text-sm font-medium text-stone-500 hover:text-orange-600"
      >
        ← Back to site
      </Link>
    </nav>
  );
}
