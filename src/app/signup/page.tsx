"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, CalendarDays, DollarSign, PiggyBank, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";


export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const { assets } = useAppContext();
  const logoUrl = assets.app_logo || "https://placehold.co/200x50/1a1a1a/FFFFFF?text=Liftoff";

  async function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!termsChecked) {
      setError("You must agree to the terms and conditions.");
      return;
    }
    
    setIsLoading(true);

    const form = event.currentTarget;
    const elements = form.elements as any;
    const data = {
      fullName: elements['full-name'].value,
      date_of_birth: elements['dob'].value,
      email: elements['email'].value,
      password_hash: elements['password'].value,
      monthly_income: elements['income'].value,
      monthly_savings_goal: elements['savings-goal'].value,
    };

    try {
      const response = await fetch('/api/auth/create-user-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user.');
      }

      toast({
        title: "Success (Test)",
        description: "User data sent to the server. Redirecting to dashboard.",
      });
      router.push('/dashboard');

    } catch (e: any) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl border-none bg-card shadow-lg">
        <CardHeader className="text-center items-center">
          <Image
            src={logoUrl}
            alt="Liftoff Logo"
            width={200}
            height={50}
            priority
            className="object-contain mb-4"
          />
          <CardDescription className="pt-2">
            Create your account to start your financial journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSignupSubmit}>
              <div className="flex rounded-lg bg-muted p-1 mb-8">
                <Link href="/signup" className="flex-1">
                  <Button type="button" variant="default" className="w-full rounded-md">Sign Up</Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button type="button" variant="ghost" className="w-full rounded-md">Login</Button>
                </Link>
              </div>
              <div className="grid gap-5">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="full-name" name="full-name" placeholder="Full Name" required className="pl-12 h-12 rounded-lg bg-input" />
                </div>
                <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="dob"
                      name="dob"
                      type="text"
                      placeholder="Date of Birth"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => (e.target.type = 'text')}
                      required
                      className="pl-12 h-12 rounded-lg bg-input"
                    />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="Email Address" required className="pl-12 h-12 rounded-lg bg-input" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" name="password" type="password" placeholder="Create Password" required className="pl-12 h-12 rounded-lg bg-input" />
                </div>
                 <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="income" name="income" type="number" placeholder="Monthly Income (Optional)" className="pl-12 h-12 rounded-lg bg-input" />
                </div>
                <div className="relative">
                  <PiggyBank className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="savings-goal" name="savings-goal" type="number" placeholder="Amount to be saved (Optional)" className="pl-12 h-12 rounded-lg bg-input" />
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    name="terms"
                    className="mt-0.5 rounded-[4px]"
                    checked={termsChecked}
                    onCheckedChange={(checked) => setTermsChecked(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground">
                    I certify that I am 18 years or older, and I Agree to all user agreement and privacy policy
                  </label>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full h-12 rounded-lg mt-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
    </main>
  );
}
