
import React from 'react';
import Header from '@/components/Header';
import { TransactionForm } from '@/components/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NewTransaction = () => {
  const { addTransaction } = useTransactions();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>
              Record a new milling transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm onSubmit={addTransaction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTransaction;
