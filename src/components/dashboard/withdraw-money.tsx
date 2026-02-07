"use client";

import React, { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Landmark, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Currency from "@/components/currency";
import { useAppContext } from "@/context/AppContext";
import { addTransaction } from "@/app/actions";

export default function WithdrawMoneyPanel() {
  const { toast } = useToast();
  const { user, balance, refetchData, loading: isAppLoading } = useAppContext();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const WITHDRAWAL_FEE = 5.00;

  const numericAmount = parseFloat(amount) || 0;
  const receiveAmount = numericAmount > 0 ? numericAmount - WITHDRAWAL_FEE : 0;
  
  const isWithdrawalDisabled = numericAmount <= 0 || numericAmount > balance || isLoading || isAppLoading;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to make a withdrawal." });
      return;
    }

    if (numericAmount > balance) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "You do not have enough balance for this withdrawal." });
      return;
    }
     if (receiveAmount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "The withdrawal amount must be greater than the fee." });
      return;
    }

    setIsLoading(true);

    const result = await addTransaction({
        userId: user.id,
        description: "Withdrawal to Bank Account",
        amount: numericAmount,
        type: "expense",
        category: "Withdrawal",
    });

    if (result.success) {
        toast({
            title: "Withdrawal Successful",
            description: `You have successfully withdrawn ${numericAmount.toFixed(2)}.`,
        });
        await refetchData();
        setAmount("");
    } else {
        toast({
            variant: "destructive",
            title: "Withdrawal Failed",
            description: result.error || "An unknown error occurred.",
        });
    }
    
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Landmark className="h-5 w-5 text-primary" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>
          Transfer funds from your wallet to your bank account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <Currency amount={balance.toFixed(2)} className="justify-center" amountClassName="text-2xl font-bold" />
        </div>

        <form className="space-y-4" onSubmit={handleWithdraw}>
          <div className="space-y-2">
            <Label htmlFor="bank-account">To Bank Account</Label>
            <Select defaultValue="bank1">
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank1">Al Rajhi Bank - SA...1234</SelectItem>
                <SelectItem value="bank2">SNB - SA...5678</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
                className="h-12 text-lg"
            />
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center justify-between gap-2">Fee: <Currency amount={WITHDRAWAL_FEE.toFixed(2)} /></p>
            <p className="flex items-center justify-between gap-2 font-medium text-foreground">You'll receive: <Currency amount={receiveAmount.toFixed(2)} /></p>
          </div>
          <Button type="submit" className="w-full h-12" disabled={isWithdrawalDisabled}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Confirm Withdrawal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
