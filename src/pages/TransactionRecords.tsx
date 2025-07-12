
import React from 'react';
import Header from '@/components/Header';
import { RecordsSection } from '@/components/RecordsSection';
import { useTransactions } from '@/hooks/useTransactions';
import { Loader2 } from 'lucide-react';

const TransactionRecords = () => {
  const { transactions, loading } = useTransactions();

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
      <div className="container mx-auto px-4 py-8">
        <RecordsSection 
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export default TransactionRecords;
