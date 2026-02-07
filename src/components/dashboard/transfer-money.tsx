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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightLeft, User, ScanLine, Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addTransaction } from "@/app/actions";
import { useAppContext } from "@/context/AppContext";

const recentContacts = [
    { name: "John Doe", avatar: "/avatars/01.png" },
    { name: "Jane Smith", avatar: "/avatars/02.png" },
    { name: "Sam Wilson", avatar: "/avatars/03.png" },
    { name: "Alice Brown", avatar: "/avatars/04.png" },
]

export default function TransferMoneyPanel() {
  const { toast } = useToast();
  const { user, balance, refetchData } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to transfer money." });
      return;
    }

    const form = e.target as HTMLFormElement;
    const recipient = (form.elements.namedItem("recipient") as HTMLInputElement).value;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const purpose = (form.elements.namedItem("purpose") as HTMLInputElement).value;
    const numericAmount = parseFloat(amount);

    if (!recipient || !numericAmount || numericAmount <= 0 || !purpose) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields with valid values.",
        });
        return;
    }

     if (numericAmount > balance) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "You do not have enough balance for this transfer." });
      return;
    }

    setIsLoading(true);

    const result = await addTransaction({
      userId: user.id,
      description: `Transfer to ${recipient}`,
      amount: numericAmount,
      type: "expense",
      category: "Transfer",
    });

    if (result.success) {
        toast({
            title: "Transfer Sent",
            description: `A transfer of ${numericAmount.toFixed(2)} for "${purpose}" has been sent to ${recipient}.`,
        });
        await refetchData();
        form.reset();
    } else {
        toast({
            variant: "destructive",
            title: "Transfer Failed",
            description: result.error || "An unknown error occurred.",
        });
    }
    
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Transfer Money
        </CardTitle>
        <CardDescription>
          Send money to another Liftoff user. This will be recorded as an expense.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <Label>Recent Contacts</Label>
            <div className="mt-2 flex space-x-4 overflow-x-auto pb-2">
                {recentContacts.map(contact => (
                    <div key={contact.name} className="flex flex-col items-center space-y-1">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{contact.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
        </div>

        <form className="space-y-4" onSubmit={handleTransfer}>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="recipient" name="recipient" placeholder="Recipient's email or username" required className="pl-12 h-12 rounded-lg bg-input" />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                <ScanLine className="h-5 w-5 text-muted-foreground"/>
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" placeholder="0.00" required className="h-12 text-lg"/>
          </div>
          <div className="relative">
            <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="purpose" name="purpose" placeholder="Purpose (e.g., Dinner, Rent)" required className="pl-12 h-12 rounded-lg bg-input" />
          </div>
          <div className="pt-2 text-xs text-muted-foreground">
              <p>Note: Transfers are treated as expenses and will be tracked against your budget.</p>
          </div>
          <Button type="submit" className="w-full h-12 mt-2" disabled={isLoading}>
             {isLoading ? <Loader2 className="animate-spin" /> : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
