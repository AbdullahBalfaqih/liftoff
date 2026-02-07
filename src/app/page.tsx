"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

export default function WelcomePage() {
  const { assets } = useAppContext();
  const logoUrl = assets.app_logo || "https://placehold.co/240x60/28292B/FFFFFF?text=Liftoff";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <Image
          src={logoUrl}
          alt="Liftoff Logo"
          width={240}
          height={60}
          priority
          className="object-contain"
        />
        <div className="space-y-2 pt-2">
          <p className="max-w-md text-muted-foreground md:text-xl">
            Your guide to mastering personal finance.
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-4 mt-8">
          <Button asChild size="lg" className="h-12 rounded-lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-lg">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
