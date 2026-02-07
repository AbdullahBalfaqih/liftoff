import type { Budget, Challenge, Transaction, AnalyticsChart, ExpenseTrend, CategoryDistribution } from '@/lib/types';

// This file is now used to provide empty arrays as a fallback.
// All data is fetched dynamically from the database via the AppContext.

export const budgets: Budget[] = [];

export const dailyChallenges: Challenge[] = [];

export const weeklyChallenges: Challenge[] = [];

export const transactions: Transaction[] = [];

export const analyticsData: AnalyticsChart[] = [];

export const expenseTrendData: ExpenseTrend[] = [];

export const categoryDistributionData: CategoryDistribution[] = [];
