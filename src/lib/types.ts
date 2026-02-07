import { LucideIcon } from "lucide-react";

// Matches the 'users' table in the database
export type UserProfile = {
  id: string;
  full_name: string;
  date_of_birth: string;
  email: string;
  monthly_income?: number | null;
  monthly_savings_goal?: number | null;
  web3_wallet_address?: string | null;
  auto_deposit_enabled?: boolean;
  auto_deposit_amount?: number | null;
  auto_deposit_day?: number | null;
  created_at: string;
  updated_at: string;
};

// Matches the 'companions' table in the database
export type Companion = {
  id: string;
  user_id: string;
  name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  energy: number;
  happiness: number;
  wealth_power: number;
  created_at: string;
  updated_at: string;
};

// Matches the 'budgets' table in the database
export type Budget = {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
  created_at: string;
};

// Matches the 'transactions' table in the database
export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
  created_at: string;
};

// Matches the 'challenges' table
export type Challenge = {
  id: string;
  title: string;
  description: string;
  reward_xp: number;
  type: 'daily' | 'weekly';
  is_active: boolean;
  // Client-side state for tracking completion
  completed?: boolean;
};

// --- Types for UI components, derived from DB data ---

// A budget object augmented with the total amount spent and a corresponding icon
export type BudgetWithDetails = Budget & {
  spent: number;
  icon: LucideIcon;
};

// A transaction object augmented with a corresponding icon
export type TransactionWithIcon = Transaction & {
  icon: LucideIcon;
};

// --- Types for chart data, processed from transactions ---

export type AnalyticsChart = {
  month: string;
  income: number;
  spending: number;
};

export type ExpenseTrend = {
  date: string;
  spending: number;
};

export type CategoryDistribution = {
  category: string;
  spent: number;
};
