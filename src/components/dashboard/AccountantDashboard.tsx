import React from 'react';
import {
  IndianRupee,
  Receipt,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  CreditCard,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const AccountantDashboard: React.FC = () => {
  const { db, setActiveModule, showToast } = useSchool();

  const totalCollected = db.feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalOutstanding = db.feeInvoices.reduce((acc, i) => acc + i.balanceAmount, 0);
  const pendingInvoices = db.feeInvoices.filter((i) => i.status === 'pending' || i.status === 'partial' || i.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                Accounts & Treasury Department
              </Badge>
              <span className="text-xs text-blue-200/80">FY 2025–26 Collection Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Finance Dashboard — Priya Sharma
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-xl leading-relaxed">
              Real-time fee reconciliation, daily receipts register, payroll disbursement records and overdue payment follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-indigo-500 hover:bg-indigo-600 text-xs shadow-lg shadow-indigo-500/30"
              icon={CreditCard}
              onClick={() => setActiveModule('fees')}
            >
              Collect New Payment
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              icon={FileSpreadsheet}
              onClick={() => showToast('Report Generated', 'Term 1 reconciliation exported to CSV', 'success')}
            >
              Export Accounts
            </Button>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => setActiveModule('fees')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 84% collection target achieved
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('fees')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-1">{pendingInvoices.length} invoices pending payment</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('fees')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Receipts</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {db.feePayments.length} Receipts
            </div>
            <div className="text-xs text-slate-500 mt-1">Cash, UPI & Bank transfers</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('payroll')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll Status</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">Disbursed</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              August 2026 payroll cleared
            </div>
          </div>
        </Card>
      </div>

      {/* Tables: Recent Receipts & Outstanding Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payment Receipts */}
        <Card>
          <CardHeader
            title="Recent Fee Receipts"
            subtitle="Verified payment transactions"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('fees')}>
                All Receipts <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.feePayments.map((pay) => (
              <div
                key={pay.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {pay.receiptNumber}
                    </span>
                    <Badge variant="success" size="sm">
                      {pay.paymentMethod}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {pay.studentName} ({pay.classSection})
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">{pay.paidDate}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{pay.amountPaid.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => showToast('Printing Receipt', `Opening print preview for ${pay.receiptNumber}`, 'info')}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 justify-end"
                  >
                    <Printer className="w-3 h-3" /> Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending & Overdue Invoices */}
        <Card>
          <CardHeader
            title="Overdue & Pending Fee Invoices"
            subtitle="Students requiring fee reminder notices"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('fees')}>
                Send Notices <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {pendingInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {inv.studentName}
                    </span>
                    <Badge variant={inv.status === 'overdue' ? 'danger' : 'warning'} size="sm">
                      {inv.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {inv.classSection} • {inv.term}
                  </p>
                  <span className="text-[10px] text-slate-400">Due: {inv.dueDate}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                    ₹{inv.balanceAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Total: ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
