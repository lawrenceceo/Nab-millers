
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Receipt, Download } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { ReceiptDialog } from './ReceiptDialog';

interface RecordsSectionProps {
  transactions: Transaction[];
}

export const RecordsSection = ({ transactions }: RecordsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);

  // Helper function to format currency with commas
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.contact.includes(searchTerm);
      const matchesCrop = cropFilter === 'all' || transaction.cropType === cropFilter;
      const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
      const matchesDateTo = !dateTo || transaction.date <= dateTo;

      return matchesSearch && matchesCrop && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, searchTerm, cropFilter, dateFrom, dateTo]);

  // Calculate total amount from filtered transactions
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  }, [filteredTransactions]);

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Contact', 'Date', 'Crop Type', 'Quantity (kg)', 'Charge per Kg', 'Total Amount', 'Amount Paid', 'Balance'];
    const csvData = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.customerName,
        t.contact,
        t.date,
        t.cropType,
        t.quantity,
        t.chargePerKg,
        t.totalAmount,
        t.amountPaid,
        t.balance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milling-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Transaction Records
            </span>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Search and filter through all transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Search by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="Millet">Millet</SelectItem>
                <SelectItem value="Maize">Maize</SelectItem>
                <SelectItem value="Cassava">Cassava</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="text-lg font-semibold">
              Total Amount: UGX {formatCurrency(totalAmount)}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.customerName}</TableCell>
                      <TableCell>{transaction.contact}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.cropType}</Badge>
                      </TableCell>
                      <TableCell>{transaction.quantity} kg</TableCell>
                      <TableCell>UGX {formatCurrency(transaction.totalAmount)}</TableCell>
                      <TableCell>UGX {formatCurrency(transaction.amountPaid)}</TableCell>
                      <TableCell>
                        <span className={transaction.balance > 0 ? 'text-destructive' : 'text-green-600'}>
                          UGX {formatCurrency(transaction.balance)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReceiptTransaction(transaction)}
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      {receiptTransaction && (
        <ReceiptDialog
          transaction={receiptTransaction}
          open={!!receiptTransaction}
          onOpenChange={() => setReceiptTransaction(null)}
        />
      )}
    </div>
  );
};
