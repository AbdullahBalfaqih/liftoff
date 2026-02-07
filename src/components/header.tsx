"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
    const pathname = usePathname();
    const isDashboard = pathname === '/dashboard';
    const { toast } = useToast();

    const handleFilterClick = () => {
        toast({
            title: 'Filters Clicked',
            description: 'This feature is for demonstration purposes.',
        });
    };

    if (!isDashboard) {
        const pageTitles: { [key: string]: string } = {
            "/analytics": "Analytics",
            "/budgets": "Budgets",
            "/wallet": "Wallet",
            "/missions": "Companion Hub",
            "/profile": "Profile",
            "/transactions": "Transactions",
            "/add": "Add Money",
            "/transfer": "Transfer Money",
            "/withdraw": "Withdraw Funds",
            "/more": "More Options",
            "/test": "Test Page",
        };
        const title = pageTitles[pathname];
        return (
            <header className="flex h-16 items-center justify-center border-b border-primary/80 bg-primary px-4">
                <h1 className="text-xl font-bold text-primary-foreground">{title || 'Liftoff'}</h1>
            </header>
        );
    }
  
  // Dashboard Header
  return (
    <header className={cn(
        "absolute top-0 left-0 right-0 z-40 p-4 bg-transparent"
    )}>
      <div className="flex items-center justify-between gap-4">
        <Link href="/profile">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-white/10">
              <Logo className="h-6 w-6 text-white"/>
          </div>
        </Link>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full rounded-full border-none bg-white/10 pl-11 text-white placeholder:text-gray-300 ring-offset-background focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" onClick={handleFilterClick}>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
