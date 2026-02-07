'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

// Data URI for a simple "ر.س" SVG that inherits the current text color.
const fallbackRiyalSymbolUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' fill='currentColor'%3E%3Ctext x='60' y='35' font-size='35' font-family='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' font-weight='600' text-anchor='middle'%3Eر.س%3C/text%3E%3C/svg%3E";

interface CurrencyProps {
  amount: number | string;
  className?: string;
  symbolClassName?: string;
  amountClassName?: string;
}

export default function Currency({ amount, className, symbolClassName, amountClassName }: CurrencyProps) {
  const { assets } = useAppContext();
  const riyalSymbolUrl = assets.currency_symbol_sar || fallbackRiyalSymbolUrl;

  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn(amountClassName)}>{formattedAmount}</span>
      <Image
        src={riyalSymbolUrl}
        alt="SAR Symbol"
        width={28}
        height={12}
        className={cn("h-4 w-auto", symbolClassName)}
        unoptimized // Necessary for data URIs and for SVGs to inherit color
      />
    </div>
  );
}
