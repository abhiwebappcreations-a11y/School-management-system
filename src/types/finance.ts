import { DeviceType } from './auth';

export type FeeCategory =
  | 'Tuition Fee'
  | 'Admission Fee'
  | 'Transport Fee'
  | 'Examination Fee'
  | 'Laboratory & Library Fee'
  | 'Sports & Activity Fee'
  | 'Uniform & Books';

export type PaymentMethod = 'Cash' | 'Online / UPI' | 'Net Banking' | 'Debit/Credit Card' | 'Cheque';

export interface FeeStructure {
  id: string;
  className: string; // e.g. "Class 8"
  academicYear: string;
  category: FeeCategory;
  term: 'Term 1' | 'Term 2' | 'Annual' | 'Monthly';
  amount: number; // in ₹ INR
  dueDate: string;
}

export interface StudentFeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classSection: string;
  academicYear: string;
  term: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  items: {
    category: FeeCategory;
    amount: number;
  }[];
}

export interface FeePayment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  classSection: string;
  amountPaid: number; // in ₹ INR
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  paidDate: string;
  collectedByUserId: string;
  collectedByUserName: string;
  device: DeviceType;
  notes?: string;
  receiptUrl?: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  month: string; // "August 2026"
  baseSalary: number;
  hra: number; // House Rent Allowance
  transportAllowance: number;
  specialAllowance: number;
  providentFundDeduction: number;
  taxDeduction: number;
  netSalary: number;
  status: 'generated' | 'approved' | 'disbursed';
  disbursementDate?: string;
  paymentMode: 'Direct Bank Transfer' | 'Cheque';
}
