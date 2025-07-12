import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface ReceiptDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReceiptDialog = ({
  transaction,
  open,
  onOpenChange,
}: ReceiptDialogProps) => {
  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Receipt
            <Button onClick={handlePrint} size="sm" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </DialogTitle>
          <DialogDescription>
            Transaction receipt for {transaction.customerName}
          </DialogDescription>
        </DialogHeader>

        <div id="receipt-content" className="space-y-4 p-4">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <img
                src="/img/logo.png"
                alt="Nab Millers Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold">Nab Millers Factory</h2>
            <p className="text-sm text-muted-foreground">Transaction Receipt</p>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Receipt #:</span>
              <span>{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Customer:</span>
              <span>{transaction.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Contact:</span>
              <span>{transaction.contact}</span>
            </div>
          </div>

          <Separator />

          {/* Item Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Crop Type:</span>
              <span>{transaction.cropType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantity:</span>
              <span>{transaction.quantity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rate per Kg:</span>
              <span>UGX {transaction.chargePerKg.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>UGX {transaction.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid:</span>
              <span>UGX {transaction.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Balance:</span>
              <span
                className={
                  transaction.balance > 0
                    ? "text-destructive"
                    : "text-green-600"
                }
              >
                UGX {transaction.balance.toFixed(2)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-2">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
