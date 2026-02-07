"use server";

import {
  getSpendingInsights,
  type SpendingInsightsInput,
} from "@/ai/flows/spending-insights-from-comparison";
import { supabase } from "@/lib/supabase";

export async function generateSpendingInsights(input: SpendingInsightsInput) {
  try {
    const result = await getSpendingInsights(input);
    if (result && result.insights) {
      return { success: true, insights: result.insights };
    }
    return { success: false, error: "Received an empty response from AI." };
  } catch (error) {
    console.error("Error generating spending insights:", error);
    return { success: false, error: "Failed to generate insights due to a server error." };
  }
}


type AddTransactionInput = {
    userId: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
}

export async function addTransaction(input: AddTransactionInput) {
  try {
    if (!input.userId || !input.description || !input.amount || !input.type || !input.category) {
        throw new Error("All transaction fields are required.");
    }
     if (input.amount <= 0) {
      throw new Error("Transaction amount must be positive.");
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: input.userId,
        description: input.description,
        amount: input.amount,
        type: input.type,
        category: input.category,
        transaction_date: new Date().toISOString(),
      });
    
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    return { success: false, error: error.message };
  }
}
