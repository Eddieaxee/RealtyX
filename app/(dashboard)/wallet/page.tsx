import { WalletBalance } from "@/components/wallet/wallet-balance";
import { WalletTransactions } from "@/components/wallet/wallet-transactions";
import { WalletConnect } from "@/components/wallet/wallet-connect";

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your connected wallets and balances.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WalletBalance />
          <WalletTransactions />
        </div>
        <WalletConnect />
      </div>
    </div>
  );
}