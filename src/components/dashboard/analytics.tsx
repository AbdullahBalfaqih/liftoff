"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { BarChart as LucideBarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const incomeVsSpendingConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const categoryDistributionConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
  category: {
    label: "Category"
  }
} satisfies ChartConfig

export default function AnalyticsPanel() {
  const { analytics, loading } = useAppContext();

  if(loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <LucideBarChart className="h-5 w-5 text-primary" />
          Advanced Analytics
        </CardTitle>
        <CardDescription>
          Visualize your financial data with hologram-style charts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <ChartContainer
              config={incomeVsSpendingConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={analytics.incomeVsSpending}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar
                  dataKey="income"
                  fill="var(--color-income)"
                  radius={4}
                />
                <Bar
                  dataKey="spending"
                  fill="var(--color-spending)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="trends" className="mt-4">
             <ChartContainer
              config={{spending: {label: "Spending", color: "hsl(var(--chart-1))"}}}
              className="min-h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={analytics.expenseTrends}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="spending"
                  type="monotone"
                  stroke="var(--color-spending)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-spending)",
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </TabsContent>
           <TabsContent value="categories" className="mt-4">
            <ChartContainer config={categoryDistributionConfig} className="mx-auto aspect-square max-h-[250px]">
              <RadarChart data={analytics.categoryDistribution}>
                <ChartTooltipContent />
                <PolarAngleAxis dataKey="category" />
                <PolarGrid stroke="hsl(var(--border) / 0.5)" />
                <Radar
                  name="Spending"
                  dataKey="spent"
                  stroke="var(--color-spent)"
                  fill="var(--color-spent)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
