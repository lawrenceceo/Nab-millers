
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/transaction';

const transactionSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  contact: z.string().min(1, 'Contact is required'),
  date: z.string().min(1, 'Date is required'),
  cropType: z.enum(['Millet', 'Maize', 'Cassava'], {
    required_error: 'Please select a crop type',
  }),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  chargePerKg: z.number().min(0.01, 'Charge per kg must be greater than 0'),
  amountPaid: z.number().min(0, 'Amount paid cannot be negative'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

const defaultCharges = {
  Millet: 300,
  Maize: 400,
  Cassava: 150,
};

export const TransactionForm = ({ onSubmit, initialData, isEditing = false }: TransactionFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      contact: initialData?.contact || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      cropType: initialData?.cropType || undefined,
      quantity: initialData?.quantity || 0,
      chargePerKg: initialData?.chargePerKg || 0,
      amountPaid: initialData?.amountPaid || 0,
    },
  });

  const watchedValues = form.watch(['quantity', 'chargePerKg', 'cropType']);
  const [quantity, chargePerKg, cropType] = watchedValues;

  // Auto-fill charge per kg when crop type changes
  React.useEffect(() => {
    if (cropType) {
      form.setValue('chargePerKg', defaultCharges[cropType]);
    }
  }, [cropType, form]);

  const totalAmount = quantity * chargePerKg;
  const balance = totalAmount - form.watch('amountPaid');

  const handleAutoFillAmount = () => {
    form.setValue('amountPaid', totalAmount);
  };

  const handleSubmit = (data: TransactionFormData) => {
    // Ensure all required fields are present for Transaction type
    const transaction: Omit<Transaction, 'id'> = {
      customerName: data.customerName,
      contact: data.contact,
      date: data.date,
      cropType: data.cropType,
      quantity: data.quantity,
      chargePerKg: data.chargePerKg,
      amountPaid: data.amountPaid,
      totalAmount,
      balance: Math.max(0, balance),
    };

    onSubmit(transaction);
    
    if (!isEditing) {
      form.reset();
      toast({
        title: 'Transaction Added',
        description: 'New transaction has been successfully recorded.',
      });
    } else {
      toast({
        title: 'Transaction Updated',
        description: 'Transaction has been successfully updated.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact (Phone/ID)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number or ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Millet">Millet</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Cassava">Cassava</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="Enter quantity" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chargePerKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charge per Kg (UGX)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Automatically set based on crop type" 
                    {...field}
                    readOnly
                    className="bg-muted"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Calculated Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <label className="text-sm font-medium">Total Amount</label>
            <div className="text-lg font-bold">UGX {totalAmount.toFixed(2)}</div>
          </div>
          
          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid (UGX)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="Enter amount paid" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFillAmount}
                    className="whitespace-nowrap"
                  >
                    Auto Fill
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <label className="text-sm font-medium">Balance Due</label>
            <div className={`text-lg font-bold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
              UGX {Math.max(0, balance).toFixed(2)}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  );
};
