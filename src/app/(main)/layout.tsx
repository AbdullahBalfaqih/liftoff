"use client";
import BottomNav from "@/components/bottom-nav";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main
        key={pathname}
        className={cn(
          "flex-1 animate-fade-in overflow-y-auto pb-20",
          // The dashboard page handles its own padding and margins
          !isDashboard && "p-4 sm:p-6 md:p-8"
        )}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
