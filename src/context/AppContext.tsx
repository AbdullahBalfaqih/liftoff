'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile, Companion, Transaction, Budget, Challenge, BudgetWithDetails, TransactionWithIcon, AnalyticsChart, ExpenseTrend, CategoryDistribution } from '@/lib/types';
import { Utensils, ShoppingCart, Film, Bus, Shirt, HeartPulse, BookOpen, Coffee, Lightbulb, Landmark, Briefcase, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';

// --- Helper Functions ---
const categoryIconMap: Record<string, React.ElementType> = {
  'Food': Utensils, 'Groceries': ShoppingCart, 'Entertainment': Film, 'Transport': Bus, 'Shopping': Shirt, 'Health': HeartPulse, 'Education': BookOpen, 'Coffee': Coffee,
  'Withdrawal': Landmark,
  'Deposit': Landmark,
  'Salary': Briefcase,
  'Transfer': ArrowRightLeft,
  'Default': Lightbulb
};
const getCategoryIcon = (category: string) => categoryIconMap[category] || categoryIconMap['Default'];


// --- App State and Context Definition ---
interface AppState {
  user: UserProfile | null;
  companion: Companion | null;
  transactions: TransactionWithIcon[];
  budgets: BudgetWithDetails[];
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  balance: number;
  assets: Record<string, string>;
  loading: boolean;
  analytics: {
    incomeVsSpending: AnalyticsChart[];
    expenseTrends: ExpenseTrend[];
    categoryDistribution: CategoryDistribution[];
  }
}

interface AppContextType extends AppState {
  refetchData: () => void;
  // Placeholder for future actions
  completeChallenge: (challengeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Initial State ---
const initialState: AppState = {
  user: null,
  companion: null,
  transactions: [],
  budgets: [],
  dailyChallenges: [],
  weeklyChallenges: [],
  balance: 0,
  assets: {},
  loading: true,
  analytics: {
    incomeVsSpending: [],
    expenseTrends: [],
    categoryDistribution: [],
  }
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  const processData = (data: { user: UserProfile, companion: Companion, transactions: Transaction[], budgets: Budget[], challenges: Challenge[], userChallenges: { challenge_id: string }[] }) => {
    const { transactions = [], budgets = [], challenges = [], userChallenges = [] } = data;

    // 1. Calculate Balance
    const balance = transactions.reduce((acc, t) => {
      if (t.type === 'income') return acc + Number(t.amount);
      if (t.type === 'expense') return acc - Number(t.amount);
      return acc;
    }, 0);

    // 2. Augment Transactions with Icons
    const transactionsWithIcons: TransactionWithIcon[] = transactions.map(t => ({
      ...t,
      icon: getCategoryIcon(t.category),
    }));

    // 3. Augment Budgets with Spent amount and Icons
    const budgetsWithDetails: BudgetWithDetails[] = budgets.map(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { ...b, spent, icon: getCategoryIcon(b.category) };
    });

    // 4. Process Analytics Data
    const monthlyData: { [key: string]: AnalyticsChart } = {};
    transactions.forEach(t => {
        const month = format(new Date(t.transaction_date), 'yyyy-MM');
        if (!monthlyData[month]) {
            monthlyData[month] = { month: format(new Date(t.transaction_date), 'MMM'), income: 0, spending: 0 };
        }
        if (t.type === 'income') monthlyData[month].income += Number(t.amount);
        else if (t.type === 'expense') monthlyData[month].spending += Number(t.amount);
    });
    const incomeVsSpending = Object.values(monthlyData).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    const dailySpending: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const day = format(new Date(t.transaction_date), 'yyyy-MM-dd');
        if(!dailySpending[day]) dailySpending[day] = 0;
        dailySpending[day] += Number(t.amount);
    });
    const expenseTrends = Object.keys(dailySpending).map(date => ({ date, spending: dailySpending[date] })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    const categorySpending: { [key: string]: number } = {};
     transactions.filter(t => t.type === 'expense').forEach(t => {
        if(!categorySpending[t.category]) categorySpending[t.category] = 0;
        categorySpending[t.category] += Number(t.amount);
    });
    const categoryDistribution = Object.keys(categorySpending).map(category => ({ category, spent: categorySpending[category] }));

    // 5. Process Challenges
    const completedChallengeIds = new Set(userChallenges.map(uc => uc.challenge_id));

    // --- START DUMMY CHALLENGES ---
    // If no challenges exist in the DB, use these dummy ones.
    let challengesToProcess = challenges;
    if (!challengesToProcess || challengesToProcess.length === 0) {
      challengesToProcess = [
        { id: 'dummy-daily-1', title: 'Log in for the day', description: 'Open the app to claim your daily reward.', reward_xp: 10, type: 'daily', is_active: true },
        { id: 'dummy-daily-2', title: 'Track one expense', description: 'Add any expense transaction.', reward_xp: 20, type: 'daily', is_active: true },
        { id: 'dummy-weekly-1', title: 'On a budget', description: 'Keep 3 spending categories within budget for the week.', reward_xp: 100, type: 'weekly', is_active: true },
        { id: 'dummy-weekly-2', title: 'Saver of the week', description: 'Save more than 100 SAR this week.', reward_xp: 150, type: 'weekly', is_active: true },
      ];
    }
    // --- END DUMMY CHALLENGES ---
    
    const allChallengesWithStatus = challengesToProcess.map(challenge => ({
      ...challenge,
      completed: completedChallengeIds.has(challenge.id)
    }));

    const dailyChallenges = allChallengesWithStatus.filter(c => c.type === 'daily');
    const weeklyChallenges = allChallengesWithStatus.filter(c => c.type === 'weekly');

    return {
      balance,
      transactionsWithIcons,
      budgetsWithDetails,
      analytics: {
        incomeVsSpending,
        expenseTrends,
        categoryDistribution
      },
      dailyChallenges,
      weeklyChallenges,
    };
  };

  const fetchData = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    const userDataString = localStorage.getItem('loggedInUser');
    if (!userDataString) {
      setState(s => ({ ...s, loading: false, user: null }));
      return;
    }
    
    try {
      const loggedInUser = JSON.parse(userDataString);
      const response = await fetch(`/api/data/${loggedInUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch app data');
      }
      const data = await response.json();
      const processed = processData(data);
      
      setState(s => ({
        ...s,
        user: data.user,
        companion: data.companion,
        transactions: processed.transactionsWithIcons,
        budgets: processed.budgetsWithDetails,
        balance: processed.balance,
        analytics: processed.analytics,
        dailyChallenges: processed.dailyChallenges,
        weeklyChallenges: processed.weeklyChallenges,
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/assets');
        if (!response.ok) throw new Error('Failed to fetch app assets');
        const data = await response.json();
        setState(s => ({ ...s, assets: data }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssets();
    fetchData();
  }, [fetchData]);

  // Placeholder function
  const completeChallenge = (challengeId: string) => {
    console.log("Completing challenge:", challengeId);
  };
  
  const value = { ...state, refetchData: fetchData, completeChallenge };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
