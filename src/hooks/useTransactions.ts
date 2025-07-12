
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseTransaction {
  id: string;
  user_id: string;
  customer_name: string;
  contact: string;
  date: string;
  crop_type: 'Millet' | 'Maize' | 'Cassava';
  quantity: number;
  charge_per_kg: number;
  total_amount: number;
  amount_paid: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  customerName: string;
  contact: string;
  date: string;
  cropType: 'Millet' | 'Maize' | 'Cassava';
  quantity: number;
  chargePerKg: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
}

// Convert database format to frontend format
const convertFromDatabase = (dbTransaction: any): Transaction => ({
  id: dbTransaction.id,
  customerName: dbTransaction.customer_name,
  contact: dbTransaction.contact,
  date: dbTransaction.date,
  cropType: dbTransaction.crop_type as 'Millet' | 'Maize' | 'Cassava',
  quantity: Number(dbTransaction.quantity),
  chargePerKg: Number(dbTransaction.charge_per_kg),
  totalAmount: Number(dbTransaction.total_amount),
  amountPaid: Number(dbTransaction.amount_paid),
  balance: Number(dbTransaction.balance),
});

// Convert frontend format to database format
const convertToDatabase = (transaction: Omit<Transaction, 'id'>, userId: string): Omit<DatabaseTransaction, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: userId,
  customer_name: transaction.customerName,
  contact: transaction.contact,
  date: transaction.date,
  crop_type: transaction.cropType,
  quantity: transaction.quantity,
  charge_per_kg: transaction.chargePerKg,
  total_amount: transaction.totalAmount,
  amount_paid: transaction.amountPaid,
  balance: transaction.balance,
});

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convertedTransactions = data.map(convertFromDatabase);
      setTransactions(convertedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new transaction
  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const dbTransaction = convertToDatabase(newTransaction, user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([dbTransaction])
        .select()
        .single();

      if (error) throw error;

      const convertedTransaction = convertFromDatabase(data);
      setTransactions(prev => [convertedTransaction, ...prev]);

      toast({
        title: 'Success',
        description: 'Transaction added successfully',
      });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
    }
  };

  // Update a transaction
  const updateTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const dbTransaction = convertToDatabase(updatedTransaction, user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .update(dbTransaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const convertedTransaction = convertFromDatabase(data);
      setTransactions(prev => 
        prev.map(t => t.id === id ? convertedTransaction : t)
      );

      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));

      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};
