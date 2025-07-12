
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
