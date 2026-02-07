import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const overviewItems = [
  {
    title: "Net Worth",
    value: "SAR 12,450.00",
    icon: DollarSign,
    change: "+2.5%",
    changeType: "increase",
  },
  {
    title: "Monthly Income",
    value: "SAR 3,000.00",
    icon: TrendingUp,
    change: "from Salary",
    changeType: "neutral",
  },
  {
    title: "Daily Spend Limit",
    value: "SAR 85.00",
    icon: TrendingDown,
    change: "Calculated",
    changeType: "neutral",
  },
];

export default function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {overviewItems.map((item) => (
        <Card
          key={item.title}
          className="bg-card border border-border"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {item.changeType === "increase" && (
                <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              )}
               {item.changeType === "decrease" && (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              )}
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
