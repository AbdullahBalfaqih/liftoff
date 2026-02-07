"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  CreditCard,
  Banknote,
  University,
  Pencil,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addTransaction } from "@/app/actions";
import { useAppContext } from "@/context/AppContext";

export default function AddMoneyPanel() {
  const { toast } = useToast();
  const { user, refetchData } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to add money." });
      return;
    }

    const form = e.target as HTMLFormElement;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const purpose = (form.elements.namedItem("purpose") as HTMLInputElement).value;
    const numericAmount = parseFloat(amount);

    if (!numericAmount || numericAmount <= 0 || !purpose) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a valid amount and purpose.",
      });
      return;
    }

    setIsLoading(true);

    const result = await addTransaction({
      userId: user.id,
      description: purpose,
      amount: numericAmount,
      type: "income",
      category: "Deposit", // Hardcoding category for now
    });

    if (result.success) {
      toast({
        title: "Deposit Successful",
        description: `A deposit of ${numericAmount.toFixed(2)} for "${purpose}" has been added.`,
      });
      await refetchData();
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: result.error || "An unknown error occurred.",
      });
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Plus className="h-5 w-5 text-primary" />
          Add Money
        </CardTitle>
        <CardDescription>
          Choose a method to add funds to your wallet. This will be recorded as income.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-around">
            <Button variant="outline" className="flex flex-col h-20 w-24">
                <CreditCard className="h-6 w-6 mb-1"/>
                <span>Card</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 w-24">
                <University className="h-6 w-6 mb-1"/>
                <span>Bank</span>
            </Button>
             <Button variant="outline" className="flex flex-col h-20 w-24">
                <Banknote className="h-6 w-6 mb-1"/>
                <span>Cash</span>
            </Button>
        </div>
        <form className="space-y-4" onSubmit={handleAddMoney}>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" placeholder="0.00" required className="h-12 text-lg"/>
          </div>
          <div className="relative">
            <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="purpose" name="purpose" placeholder="Purpose (e.g., Pocket Money)" required className="pl-12 h-12 rounded-lg bg-input" />
          </div>
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Add Funds"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
