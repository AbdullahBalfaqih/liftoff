import TransactionsList from "@/components/dashboard/transactions-list";

export default function TransactionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <TransactionsList />
    </div>
  );
}
