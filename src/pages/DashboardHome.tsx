
import React from 'react';
import Header from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { useTransactions } from '@/hooks/useTransactions';
import { Loader2, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/new-transaction" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Transaction
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Records
              </Link>
            </Button>
          </div>
        </div>
        
        <DashboardStats transactions={transactions} />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access common tasks quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="h-20">
              <Link to="/new-transaction" className="flex flex-col items-center gap-2">
                <Plus className="h-6 w-6" />
                Add New Transaction
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20">
              <Link to="/records" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                View All Records
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
