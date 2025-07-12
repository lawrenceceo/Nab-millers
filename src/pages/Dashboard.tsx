
import React from 'react';
import Header from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { TransactionForm } from '@/components/TransactionForm';
import { RecordsSection } from '@/components/RecordsSection';
import { useTransactions } from '@/hooks/useTransactions';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { transactions, loading, addTransaction } = useTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DashboardStats transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add New Transaction</h2>
            <TransactionForm onSubmit={addTransaction} />
          </div>
          <RecordsSection 
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
