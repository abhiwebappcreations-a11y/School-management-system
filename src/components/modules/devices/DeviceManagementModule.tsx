import React from 'react';
import {
  Smartphone,
  Laptop,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  MapPin,
  Lock,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const DeviceManagementModule: React.FC = () => {
  const { db, showToast, mutateDb } = useSchool();
  const { sessions, revokeSession } = useAuth();

  const toggleUserDeviceEligibility = (userId: string, type: 'desktop' | 'mobile') => {
    mutateDb((draft) => {
      const u = draft.users.find((user) => user.id === userId);
      if (u) {
        if (type === 'desktop') u.isAllowedDesktop = !u.isAllowedDesktop;
        if (type === 'mobile') u.isAllowedMobile = !u.isAllowedMobile;
      }
    });
    showToast('Device Policy Updated', `Updated hardware eligibility for user`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Device & Session Security Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authorize Desktop/Mobile terminals, track active hardware sessions, and remotely revoke compromised devices
          </p>
        </div>

        <Badge variant="primary" size="md">
          Hardware Clearance Engine
        </Badge>
      </div>

      {/* Active Sessions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Active Hardware Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((sess) => {
            const user = db.users.find((u) => u.id === sess.userId);
            return (
              <Card
                key={sess.id}
                className={`p-4 transition-all ${
                  sess.isRevoked ? 'opacity-60 bg-slate-100 dark:bg-slate-850' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        sess.deviceType === 'mobile'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {sess.deviceType === 'mobile' ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {sess.deviceName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {sess.ipAddress}
                      </span>
                    </div>
                  </div>

                  <Badge variant={sess.isRevoked ? 'danger' : 'success'} size="sm">
                    {sess.isRevoked ? 'REVOKED' : 'ONLINE'}
                  </Badge>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authenticated:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {user?.name || 'Authorized Staff'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Telemetry:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {sess.lastActive}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {!sess.isRevoked ? (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Lock}
                      onClick={() => revokeSession(sess.id)}
                    >
                      Revoke Device Access
                    </Button>
                  ) : (
                    <span className="text-[11px] text-rose-500 font-bold">Access Terminated</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* User Hardware Eligibility Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Hardware Access Policy Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Control which employees and students can sign in via desktop workstations versus mobile handsets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role Title</th>
                <th className="py-3.5 px-4 text-center">Desktop Access</th>
                <th className="py-3.5 px-4 text-center">Mobile Access</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{u.roleTitle}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleUserDeviceEligibility(u.id, 'desktop')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        u.isAllowedDesktop
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {u.isAllowedDesktop ? 'Desktop ALLOWED' : 'Desktop BLOCKED'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleUserDeviceEligibility(u.id, 'mobile')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        u.isAllowedMobile
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {u.isAllowedMobile ? 'Mobile ALLOWED' : 'Mobile BLOCKED'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="primary">ACTIVE</Badge>
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
