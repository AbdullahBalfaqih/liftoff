"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { assets } = useAppContext();
  const logoUrl = assets.app_logo || "https://placehold.co/200x50/1a1a1a/FFFFFF?text=Liftoff";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }
      
      if (result.user) {
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
      }

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
      });
      
      router.push("/dashboard");

    } catch (e: any) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: e.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl bg-card border-none shadow-lg">
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
            Welcome back! Please login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-lg bg-muted p-1 mb-8">
            <Link href="/signup" className="flex-1">
              <Button variant="ghost" className="w-full rounded-md">
                Sign Up
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button variant="default" className="w-full rounded-md">
                Login
              </Button>
            </Link>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-5">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="pl-12 h-12 rounded-lg bg-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-12 h-12 rounded-lg bg-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12 rounded-lg mt-4"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
