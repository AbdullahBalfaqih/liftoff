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
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, PiggyBank, Settings, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  monthly_income: z.coerce.number().min(0, "Income must be a positive number.").optional(),
  monthly_savings_goal: z.coerce.number().min(0, "Savings goal must be a positive number.").optional(),
  autoDeposit: z.boolean().default(false),
  salaryAmount: z.coerce.number().min(0).optional(),
  payday: z.coerce.number().min(1, "Payday must be between 1 and 31.").max(31, "Payday must be between 1 and 31.").optional(),
}).refine(data => {
    if (data.autoDeposit) {
        return data.salaryAmount !== undefined && data.salaryAmount > 0 && data.payday !== undefined;
    }
    return true;
}, {
    message: "Salary amount and payday are required when auto deposit is enabled.",
    path: ["autoDeposit"],
});


export default function IncomeSettingsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      autoDeposit: false,
    },
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('loggedInUser');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        form.reset({
          monthly_income: userData.monthly_income || undefined,
          monthly_savings_goal: userData.monthly_savings_goal || undefined,
          autoDeposit: userData.auto_deposit_enabled || false,
          salaryAmount: userData.auto_deposit_amount || undefined,
          payday: userData.auto_deposit_day || undefined,
        });
        setIsFormReady(true);
      } catch (error) {
        console.error("Failed to parse user data", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your data.",
        });
      }
    } else {
        setIsFormReady(true); // Still set to true to prevent infinite loading state
    }
  }, [form, toast]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "User not found. Please log in again." });
      return;
    }
    setIsLoading(true);

    try {
        const response = await fetch('/api/user/update-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, ...values }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to save settings.');
        }
        
        // Update localStorage with the new data from the server
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
        setUser(result.user); // update state to reflect new data

        toast({
            title: "Settings Saved",
            description: "Your financial settings have been updated.",
        });

    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: e.message,
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (!isFormReady) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Settings className="h-5 w-5 text-primary" />
          Financial Settings
        </CardTitle>
        <CardDescription>
          Manage your income, savings goals, and automated deposits.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                control={form.control}
                name="monthly_income"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground"/>Monthly Income</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 3000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="monthly_savings_goal"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><PiggyBank className="h-4 w-4 text-muted-foreground"/>Monthly Savings Goal</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="space-y-4 rounded-lg border p-4">
                 <FormField
                    control={form.control}
                    name="autoDeposit"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Automatic Salary Deposit</FormLabel>
                                <FormDescription>
                                    Automatically add your salary to your balance each month.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                {form.watch("autoDeposit") && (
                     <div className="grid gap-4 md:grid-cols-2 pt-2">
                        <FormField
                        control={form.control}
                        name="salaryAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Salary Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="3000" {...field} value={field.value ?? ''}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="payday"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Payday (Day of Month)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 28" min={1} max={31} {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                )}
                 {form.formState.errors.autoDeposit && <p className="text-sm font-medium text-destructive">{form.formState.errors.autoDeposit.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
