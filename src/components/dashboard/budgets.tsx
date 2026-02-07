"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import Currency from "@/components/currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetPanel() {
  const { budgets, loading } = useAppContext();

  const getIndicatorClass = (value: number) => {
    if (value > 100) return "bg-destructive";
    if (value > 75) return "bg-chart-3"; // Yellow
    return "bg-primary"; // Green (or default)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Budget Control System
        </CardTitle>
        <CardDescription>Your monthly spending vs. budget limits.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
            <div className="space-y-6">
            {budgets.length > 0 ? budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit_amount) * 100;
                return (
                <div key={budget.id}>
                    <div className="mb-1 flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                            <budget.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{budget.category}</span>
                        </div>
                    <div className="flex items-baseline gap-1 text-sm text-muted-foreground">
                        <Currency amount={budget.spent} amountClassName={cn("font-semibold", percentage > 100 ? "text-destructive" : "text-foreground")} />
                        <span>/</span>
                        <Currency amount={budget.limit_amount} amountClassName="text-sm" />
                    </div>
                    </div>
                    <Progress
                    value={percentage}
                    indicatorClassName={getIndicatorClass(percentage)}
                    />
                </div>
                );
            }) : <p className="text-muted-foreground text-center">No budgets created yet.</p>}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
