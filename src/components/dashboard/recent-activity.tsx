"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { ArrowUpRight, History } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Currency from "@/components/currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivityPanel() {
  const { transactions, loading } = useAppContext();

  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <History className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your last 5 transactions.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1" variant="ghost">
          <Link href="/transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="ml-4 flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                ))}
            </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <transaction.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-4 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center text-right text-sm font-medium",
                    transaction.type === "income"
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  <span>{transaction.type === "income" ? "+" : "-"}</span>
                  <Currency amount={transaction.amount} className="inline-flex" amountClassName="text-sm font-medium" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No recent activity to display.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
