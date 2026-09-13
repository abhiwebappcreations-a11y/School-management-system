import React, { useState } from 'react';
import { Wallet, IndianRupee, Printer, Download, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { PayrollRecord } from '../../../types/finance';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const PayrollModule: React.FC = () => {
  const { db, showToast } = useSchool();
  const { canAccess } = useAuth();
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Staff Payroll & Salary Slips (₹ INR)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Base pay, HRA, Provident Fund (PF), professional tax deductions, and net monthly compensation
          </p>
        </div>

        <Badge variant="primary">Restricted HR Module</Badge>
      </div>

      {/* Payroll Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Pay Period</th>
                <th className="py-3.5 px-4">Base Salary</th>
                <th className="py-3.5 px-4">Allowances</th>
                <th className="py-3.5 px-4">Deductions (PF/Tax)</th>
                <th className="py-3.5 px-4">Net Disbursed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Pay Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.payroll.map((p) => {
                const totalAllowances = p.hra + p.transportAllowance + p.specialAllowance;
                const totalDeductions = p.providentFundDeduction + p.taxDeduction;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{p.staffName}</span>
                      <span className="text-[10px] text-slate-400">{p.role}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{p.month}</td>
                    <td className="py-3 px-4 font-mono">₹{p.baseSalary.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">
                      +₹{totalAllowances.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-600 font-semibold">
                      -₹{totalDeductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white text-sm">
                      ₹{p.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">DISBURSED</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Printer}
                        onClick={() => setSelectedSlip(p)}
                      >
                        View Slip
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Salary Slip Modal */}
      {selectedSlip && (
        <Modal
          isOpen={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
          title="Confidential Salary Payslip"
          description={`${selectedSlip.month} • ${selectedSlip.staffName}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedSlip(null)}>
                Close
              </Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print Slip
              </Button>
            </>
          }
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border rounded-2xl text-xs space-y-3">
            <div className="flex justify-between border-b pb-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{selectedSlip.staffName}</span>
                <span className="text-[10px] text-slate-500">{selectedSlip.role}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlip.month}</span>
                <span className="text-[10px] text-emerald-600 block font-bold">Bank Transfer Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Earnings</span>
                <div className="flex justify-between">
                  <span>Basic Pay:</span>
                  <span className="font-mono font-semibold">₹{selectedSlip.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent (HRA):</span>
                  <span className="font-mono font-semibold">₹{selectedSlip.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-mono font-semibold">₹{selectedSlip.transportAllowance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-1 border-l pl-4">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Deductions</span>
                <div className="flex justify-between">
                  <span>Provident Fund (PF):</span>
                  <span className="font-mono text-rose-600 font-semibold">₹{selectedSlip.providentFundDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax:</span>
                  <span className="font-mono text-rose-600 font-semibold">₹{selectedSlip.taxDeduction.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-between items-center text-sm font-black">
              <span>Net Monthly Pay:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">
                ₹{selectedSlip.netSalary.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
