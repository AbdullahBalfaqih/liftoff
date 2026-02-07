"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateSpendingInsights } from "@/app/actions";
import { BrainCircuit, Loader2, Lightbulb } from "lucide-react";
import { budgets } from "@/lib/data";

const formSchema = z.object({
  city: z.string().min(2, "City is required."),
  age: z.coerce.number().min(16, "Must be at least 16").max(100, "Age seems too high"),
});

// Mock data based on the structure expected by the AI flow
const mockSpendingData = {
  monthlyIncome: 3000,
  fixedExpenses: 1200,
  spendingByCategory: budgets.reduce((acc, budget) => {
    acc[budget.category.toLowerCase()] = budget.spent;
    return acc;
  }, {} as Record<string, number>),
  budgetLimits: budgets.reduce((acc, budget) => {
    acc[budget.category.toLowerCase()] = budget.limit;
    return acc;
  }, {} as Record<string, number>),
};

function calculateAge(dateOfBirth: string | null): number | null {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default function SmartComparisonPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Riyadh",
    },
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('loggedInUser');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const age = calculateAge(userData.date_of_birth);
        if (age) {
            form.setValue('age', age);
        }
      } catch (error) {
        console.error("Failed to parse user data for age calculation", error);
      }
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setInsights([]);

    const input = { ...mockSpendingData, ...values };

    const result = await generateSpendingInsights(input);

    if (result.success && result.insights) {
      setInsights(result.insights);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "An unknown error occurred.",
      });
    }

    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI Smart Comparison
        </CardTitle>
        <CardDescription>
          Compare your spending against other students.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Riyadh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age (Calculated)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 21" {...field} value={field.value ?? ''} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Insights"
              )}
            </Button>
            {insights.length > 0 && (
              <div className="w-full space-y-2 rounded-lg border border-dashed border-primary/50 bg-muted/20 p-4">
                <h4 className="font-semibold text-primary">AI Insights:</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
