import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  IndianRupee,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  QrCode,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { FeePayment, PaymentMethod } from '../../../types/finance';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const FeesModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, effectiveDevice, canAccess } = useAuth();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'structures'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Online UPI / Razorpay Gateway State
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [activeUpiInvoice, setActiveUpiInvoice] = useState<any>(null);
  const [upiCountdown, setUpiCountdown] = useState(285); // 4 mins 45 secs
  const [userUpiId, setUserUpiId] = useState('parent.kumar@okhdfcbank');
  const [isUpiVerified, setIsUpiVerified] = useState(true);
  const [upiTab, setUpiTab] = useState<'qr' | 'upi_id' | 'netbanking'>('qr');

  // Form states for fee collection
  const [selectedStudentId, setSelectedStudentId] = useState(db.students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState('41300');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Online / UPI');
  const [paymentNotes, setPaymentNotes] = useState('');

  const totalCollected = db.feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalOutstanding = db.feeInvoices.reduce((acc, i) => acc + i.balanceAmount, 0);

  const filteredInvoices = db.feeInvoices.filter(
    (inv) =>
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordPayment = () => {
    if (!canAccess('fees', 'create')) {
      showToast('Access Blocked', 'Unauthorized to collect fee payments', 'error');
      return;
    }

    const student = db.students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const amount = parseFloat(paymentAmount) || 0;
    const newReceiptNumber = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNumber: newReceiptNumber,
      invoiceId: `inv-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      classSection: student.classSection,
      amountPaid: amount,
      paymentMethod: paymentMethod,
      transactionReference: paymentMethod === 'Cash' ? 'Cash Counter Slip' : `TXN/${Date.now()}`,
      paidDate: new Date().toISOString().substring(0, 10),
      collectedByUserId: currentUser.id,
      collectedByUserName: currentUser.name,
      device: effectiveDevice,
      notes: paymentNotes || 'Fee collected at accounts terminal',
    };

    mutateDb((draft) => {
      draft.feePayments.unshift(newPayment);
      // adjust student invoice balance
      const inv = draft.feeInvoices.find((i) => i.studentId === student.id);
      if (inv) {
        inv.paidAmount += amount;
        inv.balanceAmount = Math.max(0, inv.balanceAmount - amount);
        if (inv.balanceAmount === 0) inv.status = 'paid';
        else inv.status = 'partial';
      }
    });

    setIsCollectModalOpen(false);
    showToast('Payment Processed', `Receipt ${newReceiptNumber} generated for ₹${amount.toLocaleString('en-IN')}`, 'success');
  };

  const handleOpenUpiCheckout = (inv: any) => {
    setActiveUpiInvoice(inv);
    setUpiCountdown(285);
    setIsUpiModalOpen(true);
  };

  const handleExecuteUpiPayment = () => {
    if (!activeUpiInvoice) return;
    const inv = activeUpiInvoice;
    const amount = inv.balanceAmount;
    const newReceiptNumber = `RCP-UPI-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNumber: newReceiptNumber,
      invoiceId: inv.id,
      studentId: inv.studentId,
      studentName: inv.studentName,
      classSection: inv.classSection,
      amountPaid: amount,
      paymentMethod: 'Online / UPI',
      transactionReference: `UPI/NPCI/${Date.now().toString().slice(-8)}`,
      paidDate: new Date().toISOString().substring(0, 10),
      collectedByUserId: currentUser.id,
      collectedByUserName: currentUser.name,
      device: effectiveDevice,
      notes: `Instant UPI settlement via BharatQR / ${userUpiId}`,
    };

    mutateDb((draft) => {
      draft.feePayments.unshift(newPayment);
      const targetInv = draft.feeInvoices.find((i) => i.id === inv.id);
      if (targetInv) {
        targetInv.paidAmount += amount;
        targetInv.balanceAmount = 0;
        targetInv.status = 'paid';
      }
    });

    setIsUpiModalOpen(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showToast(
      'UPI Payment Confirmed!',
      `Received ₹${amount.toLocaleString('en-IN')} via NPCI Instant Settlement.`,
      'success'
    );
    setSelectedReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Fees, Invoicing & Receipts (₹ INR)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student fee structures, invoice generation, cashier reconciliation, and official receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canAccess('fees', 'create') && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsCollectModalOpen(true)}
            >
              Collect Fee Payment
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Total Collections</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">{db.feePayments.length} verified receipts</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Outstanding Arrears</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">Term 1 due invoices</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Active Term Structures</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            {db.feeStructures.length} Fee Heads
          </span>
          <span className="text-xs text-slate-400 mt-1 block">Tuition, Transport, Exam, Activity</span>
        </Card>
      </div>

      {/* Tab Selectors & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'invoices', label: 'Student Invoices', icon: Receipt },
              { id: 'payments', label: 'Receipts Ledger', icon: CreditCard },
              { id: 'structures', label: 'Fee Structures', icon: IndianRupee },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student or invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {inv.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{inv.classSection}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">
                      ₹{inv.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                      ₹{inv.balanceAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          inv.status === 'paid'
                            ? 'success'
                            : inv.status === 'partial'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inv.balanceAmount > 0 && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="primary"
                            icon={QrCode}
                            onClick={() => handleOpenUpiCheckout(inv)}
                          >
                            UPI Pay
                          </Button>
                          {canAccess('fees', 'create') && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedStudentId(inv.studentId);
                                setPaymentAmount(inv.balanceAmount.toString());
                                setIsCollectModalOpen(true);
                              }}
                            >
                              Collect
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Receipts Ledger Tab */}
      {activeTab === 'payments' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Cashier</th>
                  <th className="py-3.5 px-4">Device</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {db.feePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {p.studentName} ({p.classSection})
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                      ₹{p.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary">{p.paymentMethod}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{p.paidDate}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.collectedByUserName}</td>
                    <td className="py-3 px-4 capitalize font-mono text-[10px]">{p.device}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Printer}
                        onClick={() => setSelectedReceipt(p)}
                      >
                        Print Slip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Fee Structures Tab */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {db.feeStructures.map((struct) => (
            <Card key={struct.id} className="p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-500">{struct.className}</span>
                <Badge variant="primary">{struct.term}</Badge>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {struct.category}
              </h3>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  ₹{struct.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">Due: {struct.dueDate}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* COLLECT FEE MODAL */}
      <Modal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        title="Collect Student Fee Payment"
        description="Record verified transaction with automatic receipt generation"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCollectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRecordPayment}>
              Record & Generate Receipt
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const inv = db.feeInvoices.find((i) => i.studentId === e.target.value);
                if (inv) setPaymentAmount(inv.balanceAmount.toString());
              }}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            >
              {db.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classSection} • Roll #{s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount to Collect (₹)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-black text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="Online / UPI">Online / UPI (Instant)</option>
                <option value="Cash">Cash at School Counter</option>
                <option value="Net Banking">Net Banking / RTGS</option>
                <option value="Debit/Credit Card">POS Debit / Credit Card</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Notes / Ref
            </label>
            <input
              type="text"
              placeholder="e.g. UPI Ref 928374829103 or Cash Box 2"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>

      {/* OFFICIAL PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Fee Payment Receipt"
          description="Authorized digital tax invoice and fee acknowledgement"
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedReceipt(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  window.print();
                }}
              >
                Print Official Copy
              </Button>
            </>
          }
        >
          {/* Printable Receipt Card */}
          <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-slate-700 rounded-2xl space-y-4 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  {db.schoolConfig.schoolName}
                </h2>
                <p className="text-[11px] text-slate-500">{db.schoolConfig.address}, {db.schoolConfig.city}</p>
                <p className="text-[10px] text-slate-400 font-mono">Affiliation: {db.schoolConfig.affiliationNumber}</p>
              </div>
              <div className="text-right">
                <Badge variant="success" size="md">PAID & VERIFIED</Badge>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {selectedReceipt.receiptNumber}
                </div>
                <div className="text-[10px] text-slate-400">Date: {selectedReceipt.paidDate}</div>
              </div>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-2 gap-3 py-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">STUDENT NAME</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CLASS & SECTION</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedReceipt.classSection}</span>
              </div>
            </div>

            {/* Breakdown table */}
            <table className="w-full text-left">
              <thead className="border-b text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-2">Fee Head / Description</th>
                  <th className="py-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2">Term 1 Tuition & Academic Fee</td>
                  <td className="py-2 text-right font-medium">₹35,000</td>
                </tr>
                <tr>
                  <td className="py-2">Transport & Bus Facility Fee</td>
                  <td className="py-2 text-right font-medium">₹3,800</td>
                </tr>
                <tr>
                  <td className="py-2">Examination & Lab Assessment</td>
                  <td className="py-2 text-right font-medium">₹2,500</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-slate-900 dark:border-slate-700">
                <tr>
                  <th className="py-3 font-bold text-slate-900 dark:text-white">Total Amount Paid</th>
                  <th className="py-3 text-right font-black text-slate-900 dark:text-white text-base">
                    ₹{selectedReceipt.amountPaid.toLocaleString('en-IN')}
                  </th>
                </tr>
              </tfoot>
            </table>

            {/* Footer / Cashier Signature */}
            <div className="pt-4 border-t border-dashed flex justify-between items-end text-[11px] text-slate-400">
              <div>
                <span className="block text-slate-500 font-semibold">Payment Mode: {selectedReceipt.paymentMethod}</span>
                <span className="block font-mono text-[10px]">Ref: {selectedReceipt.transactionReference}</span>
                <span className="block text-[10px]">Processed via {selectedReceipt.device} terminal</span>
              </div>
              <div className="text-right">
                <div className="font-script text-indigo-600 font-bold text-sm">Priya Sharma</div>
                <span className="text-[10px] text-slate-500 block border-t pt-0.5">Authorized Accounts Officer</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* RAZORPAY / BHARATQR INSTANT CHECKOUT MODAL */}
      {isUpiModalOpen && activeUpiInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setIsUpiModalOpen(false)}
          title="Razorpay / BharatQR Instant Fee Checkout"
          description="National Payments Corporation of India (NPCI) Certified Payment Gateway"
          size="md"
        >
          <div className="space-y-5 text-xs">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                  Total Payable Amount
                </span>
                <span className="text-2xl font-black text-white">
                  ₹{activeUpiInvoice.balanceAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  Student: <strong className="text-white">{activeUpiInvoice.studentName}</strong> ({activeUpiInvoice.classSection})
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-amber-300 font-mono block">SESSION EXPIRES IN</span>
                <span className="font-mono font-bold text-base text-amber-400">04:45</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Secure 256-bit SSL</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setUpiTab('qr')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  upiTab === 'qr'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Scan QR Code
              </button>
              <button
                type="button"
                onClick={() => setUpiTab('upi_id')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  upiTab === 'upi_id'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                UPI ID / VPA
              </button>
            </div>

            {/* TAB 1: BHARATQR CODE */}
            {upiTab === 'qr' && (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                {/* SVG Simulated QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-slate-900/10 relative">
                  <svg className="w-44 h-44" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner 1 */}
                    <rect x="5" y="5" width="26" height="26" fill="black" rx="4" />
                    <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                    <rect x="13" y="13" width="10" height="10" fill="black" rx="2" />
                    {/* Corner 2 */}
                    <rect x="69" y="5" width="26" height="26" fill="black" rx="4" />
                    <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                    <rect x="77" y="13" width="10" height="10" fill="black" rx="2" />
                    {/* Corner 3 */}
                    <rect x="5" y="69" width="26" height="26" fill="black" rx="4" />
                    <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                    <rect x="13" y="77" width="10" height="10" fill="black" rx="2" />
                    {/* Center Pattern Dots */}
                    <rect x="36" y="8" width="6" height="6" fill="black" />
                    <rect x="46" y="14" width="6" height="6" fill="black" />
                    <rect x="56" y="8" width="6" height="6" fill="black" />
                    <rect x="36" y="24" width="6" height="6" fill="black" />
                    <rect x="46" y="30" width="8" height="8" fill="#4f46e5" rx="2" />
                    <rect x="58" y="26" width="6" height="6" fill="black" />
                    <rect x="12" y="38" width="6" height="6" fill="black" />
                    <rect x="24" y="44" width="6" height="6" fill="black" />
                    <rect x="36" y="40" width="8" height="8" fill="black" />
                    <rect x="56" y="44" width="6" height="6" fill="black" />
                    <rect x="72" y="38" width="8" height="8" fill="black" />
                    <rect x="84" y="44" width="6" height="6" fill="black" />
                    <rect x="38" y="56" width="6" height="6" fill="black" />
                    <rect x="48" y="62" width="6" height="6" fill="black" />
                    <rect x="60" y="56" width="6" height="6" fill="black" />
                    <rect x="36" y="74" width="8" height="8" fill="black" />
                    <rect x="48" y="82" width="6" height="6" fill="black" />
                    <rect x="62" y="76" width="6" height="6" fill="black" />
                    <rect x="76" y="82" width="8" height="8" fill="black" />
                  </svg>
                  {/* Center Overlay Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-indigo-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                      UPI
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Scan using any UPI App
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Google Pay • PhonePe • Paytm • BHIM • Cred
                  </p>
                  <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                    VPA: smartschool.fees@sbi
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: UPI ID INPUT */}
            {upiTab === 'upi_id' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter UPI ID / Virtual Payment Address (VPA)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userUpiId}
                      onChange={(e) => setUserUpiId(e.target.value)}
                      placeholder="mobile_or_name@okhdfcbank"
                      className="w-full pl-3 pr-24 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpiVerified(true);
                        showToast('UPI ID Verified', 'Account holder: Suresh Kumar (Father)', 'success');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] rounded-lg"
                    >
                      Verify VPA
                    </button>
                  </div>
                </div>

                {isUpiVerified && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Verified: Suresh Kumar (Registered Guardian Account)</span>
                  </div>
                )}
              </div>
            )}

            {/* Gateway Security Badge & Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>NPCI UPI 2.0 Settlement</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpiModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Sparkles}
                  onClick={handleExecuteUpiPayment}
                >
                  Simulate Successful UPI Payment
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
