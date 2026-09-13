import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Laptop, Smartphone, Download, RotateCcw } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const AuditLogsModule: React.FC = () => {
  const { db, showToast } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'allowed' | 'denied'>('all');

  const filteredLogs = db.auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Security Audit Trail & Compliance Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of all authorization decisions, policy blocks, and administrative changes
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => showToast('Export Complete', 'Audit log export downloaded to CSV', 'info')}
        >
          Export Ledger
        </Button>
      </div>

      {/* Filter Strip */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user, action, target entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500">Filter Status:</span>
            {(['all', 'allowed', 'denied'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Initiator / Role</th>
                <th className="py-3 px-4">Terminal Device</th>
                <th className="py-3 px-4">Module & Action</th>
                <th className="py-3 px-4">Target Entity & Details</th>
                <th className="py-3 px-4 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      {log.device === 'mobile' ? (
                        <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                      {log.device}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">{log.ipAddress}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white uppercase">
                      {log.module}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono block uppercase font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      {log.targetEntity}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                      {log.details}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={log.status === 'allowed' ? 'success' : 'danger'}>
                      {log.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
