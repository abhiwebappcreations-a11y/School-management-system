import React, { useState } from 'react';
import { Coffee, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { LeaveRequest } from '../../../types/system';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const LeaveModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, canAccess } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned'>('Casual');
  const [reason, setReason] = useState('');
  const [daysCount, setDaysCount] = useState('1');

  const handleApplyLeave = () => {
    if (!reason.trim()) return;

    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      staffId: currentUser.id,
      staffName: currentUser.name,
      role: currentUser.roleTitle,
      leaveType: leaveType,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date().toISOString().substring(0, 10),
      daysCount: parseInt(daysCount) || 1,
      reason: reason,
      appliedDate: new Date().toISOString().substring(0, 10),
      status: 'pending',
    };

    mutateDb((draft) => {
      draft.leaveRequests.unshift(newReq);
    });

    setIsApplyModalOpen(false);
    setReason('');
    showToast('Leave Application Submitted', 'Forwarded to Principal for approval', 'success');
  };

  const handleApprove = (id: string, approve: boolean) => {
    mutateDb((draft) => {
      const l = draft.leaveRequests.find((x) => x.id === id);
      if (l) {
        l.status = approve ? 'approved' : 'rejected';
        l.approvedBy = currentUser.name;
      }
    });
    showToast('Decision Recorded', `Leave request ${approve ? 'Approved' : 'Rejected'}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Coffee className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Staff Leave Management & Approvals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leave applications, remaining balance ledgers, and principal authorization hierarchy
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Requests Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Applied On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{req.staffName}</span>
                    <span className="text-[10px] text-slate-400">{req.role}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{req.leaveType} Leave</td>
                  <td className="py-3 px-4 font-bold">{req.daysCount} Day(s)</td>
                  <td className="py-3 px-4 max-w-xs text-slate-600 dark:text-slate-300 truncate">
                    {req.reason}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{req.appliedDate}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        req.status === 'approved'
                          ? 'success'
                          : req.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {req.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {req.status === 'pending' && canAccess('leave_management', 'approve') && (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(req.id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleApprove(req.id, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Staff Leave"
        description="Submit leave application for manager/principal endorsement"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyLeave}>
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Leave Category
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="Casual">Casual Leave (CL)</option>
                <option value="Sick">Sick / Medical Leave</option>
                <option value="Earned">Earned Leave (EL)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={daysCount}
                onChange={(e) => setDaysCount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Absence
            </label>
            <textarea
              rows={3}
              placeholder="State reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
