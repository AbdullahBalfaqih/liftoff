'use server';

/**
 * @fileOverview Provides personalized spending insights by comparing user spending to their budget and similar students.
 *
 * - getSpendingInsights - A function that returns spending insights.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  monthlyIncome: z.number().describe('The user\'s monthly income.'),
  fixedExpenses: z.number().describe('The user\'s total fixed monthly expenses.'),
  spendingByCategory: z
    .record(z.number())
    .describe(
      'A map of spending categories to amounts, e.g. {food: 500, entertainment: 200}.'
    ),
  budgetLimits: z
    .record(z.number())
    .describe(
      'A map of spending categories to budget limits, e.g. {food: 600, entertainment: 300}.'
    ),
  city: z.string().describe('The user\'s city.'),
  age: z.number().describe('The user\'s age.'),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('An array of insights about the user\'s spending.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(
  input: SpendingInsightsInput
): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

const spendingInsightsPrompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor for students.

  Provide personalized insights to the user based on their spending habits, comparing their spending against their budget and that of other students in their city, of similar age and income bracket.

  Monthly Income: {{monthlyIncome}}
  Fixed Expenses: {{fixedExpenses}}
  Spending by Category: {{#each spendingByCategory}}{{@key}}: {{this}} {{/each}}
  Budget Limits: {{#each budgetLimits}}{{@key}}: {{this}} {{/each}}
  City: {{city}}
  Age: {{age}}

  {% Provide specific, actionable insights and recommendations. %}
  {% Be concise. %}
`,
});

const spendingInsightsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await spendingInsightsPrompt(input);
    return output!;
  }
);
