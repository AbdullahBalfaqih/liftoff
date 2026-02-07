"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Currency from "@/components/currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsList() {
  const { transactions, loading } = useAppContext();

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <History className="h-5 w-5 text-primary" />
          All Transactions
        </CardTitle>
        <CardDescription>
          Here is a complete history of your account activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
             <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-b-0">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-1">
                             <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <div className="text-right">
                           <Skeleton className="h-5 w-20" />
                           <Skeleton className="h-3 w-12 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        ) : sortedTransactions.length > 0 ? (
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <transaction.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(transaction.transaction_date), "MMMM d, yyyy")}</p>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "flex items-center justify-end text-base font-bold",
                    transaction.type === "income" ? "text-primary" : "text-foreground"
                  )}>
                    <span>{transaction.type === 'income' ? '+' : '-'}</span>
                    <Currency amount={transaction.amount} amountClassName="text-base font-bold" />
                  </div>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">No transactions to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
