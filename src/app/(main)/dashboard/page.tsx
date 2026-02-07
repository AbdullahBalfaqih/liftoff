"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import RecentActivityPanel from "@/components/dashboard/recent-activity";
import {
  Plus,
  ArrowRightLeft,
  Landmark,
  MoreHorizontal,
  WalletCards,
  Copy,
  QrCode,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import Currency from "@/components/currency";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";


const actionButtons = [
  { href: "/add", icon: Plus, label: "Add" },
  { href: "/transfer", icon: ArrowRightLeft, label: "Transfer" },
  { href: "/withdraw", icon: Landmark, label: "Withdraw" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const { user, balance, loading } = useAppContext();

  const walletAddress = user?.web3_wallet_address || "0x... not available";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied!",
      description: "Wallet address has been copied to your clipboard.",
    });
  };
  
  if (loading) {
    return (
       <>
        <div className="bg-gradient-to-b from-blue-700 to-blue-500 pb-8 text-white">
            <div className="px-4 pt-20">
                <div className="text-center">
                    <p className="text-sm text-gray-200/80">Current Balance</p>
                    <Skeleton className="h-12 w-48 mx-auto mt-2" />
                </div>
            </div>
        </div>
        <div className="-mt-4 space-y-6 rounded-t-2xl bg-background p-4 sm:p-6 md:p-8">
            <Skeleton className="h-40 w-full max-w-md mx-auto" />
            <Skeleton className="h-64 w-full max-w-md mx-auto" />
        </div>
       </>
    );
  }

  return (
    <>
      {/* Top section with gradient */}
      <div className="bg-gradient-to-b from-blue-700 to-blue-500 pb-8 text-white">
        {/* The header is now part of the layout and will be rendered above this */}
        {/* We add padding top to make space for the transparent header */}
        <div className="px-4 pt-20">
          <div className="text-center">
            <p className="text-sm text-gray-200/80">Current Balance</p>
            <Currency amount={balance} className="justify-center text-white" amountClassName="text-5xl font-bold tracking-tight" symbolClassName="h-10" />
          </div>
          <div className="mt-6">
            <Button
              asChild
              className="mx-auto flex items-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
            >
              <Link href="/wallet">
                <WalletCards className="mr-2 h-4 w-4" /> Accounts
              </Link>
            </Button>
          </div>
          <div className="mx-auto mt-8 grid w-full max-w-sm grid-cols-4 gap-4">
            {actionButtons.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-2"
              >
                <Button
                  asChild
                  size="icon"
                  className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <Link href={action.href}>
                    <action.icon className="h-6 w-6" />
                  </Link>
                </Button>
                <span className="text-xs font-medium text-gray-200/90">
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content below gradient */}
      <div className="-mt-4 space-y-6 rounded-t-2xl bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Receive assets
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Copy your Unique address to receive money.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
              onClick={() => setIsQrCodeOpen(true)}
            >
              <QrCode className="h-6 w-6" />
            </Button>
          </div>
          <Button
            className="mt-4 h-12 w-full rounded-full text-base font-bold"
            onClick={handleCopyAddress}
            disabled={!user?.web3_wallet_address}
          >
            <Copy className="mr-2 h-5 w-5" /> Copy Address
          </Button>
        </div>

        <div className="mx-auto w-full max-w-md">
          <RecentActivityPanel />
        </div>
      </div>

      <AlertDialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Wallet QR Code</AlertDialogTitle>
            <AlertDialogDescription>
              Scan this code to receive assets directly to your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center p-4">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
              alt="Wallet QR Code"
              width={200}
              height={200}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
