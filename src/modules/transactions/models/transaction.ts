export interface Transaction {
  id: string;
  number: string;
  transactionType: string;
  paymentNumber: string;
  paymentMethod: string;
  paymentMethodId: string;
  customerName: string;
  discount: number;
  serviceCharge: number;
  rounding: number;
  total: number;
  additionalNote: string;
  voucher: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTransaction {
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface CreateTransactionDTO {
  transactionType: string;
  tableNumber: number;
  paymentMethod: string;
  customerName: string;
  discount: number;
  additionalNote: string;
  voucher: string;
  status: string;
  cart: SubTransaction[];
}
