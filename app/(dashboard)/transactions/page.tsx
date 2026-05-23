import { TransactionList } from "@/components/dashboard/transaction-list";
import { TransactionStats } from "@/components/dashboard/transaction-stats";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground mt-1">View your complete transaction history.</p>
      </div>
      <TransactionStats />
      <TransactionList />
    </div>
  );
}