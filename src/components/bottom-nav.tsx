"use client";

import Link from "next/link";
import {
  Home,
  BarChartBig,
  CreditCard,
  User,
  PiggyBank,
  Bot,
  Beaker,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/analytics", icon: BarChartBig, label: "Analytics" },
  { href: "/budgets", icon: PiggyBank, label: "Budgets" },
  { href: "/wallet", icon: CreditCard, label: "Wallet" },
  { href: "/missions", icon: Bot, label: "Companion" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/test", icon: Beaker, label: "Test" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border/40 bg-background">
      <div className="mx-auto grid h-full max-w-lg grid-cols-7 font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-2 text-center hover:bg-muted/50 group"
            >
              <item.icon
                className={cn(
                  "h-6 w-6 mb-1 text-muted-foreground group-hover:text-primary",
                  isActive && "text-primary"
                )}
              />
              <span
                className={cn(
                  "text-xs text-muted-foreground group-hover:text-primary",
                  isActive && "text-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
