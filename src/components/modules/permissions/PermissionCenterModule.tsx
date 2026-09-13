import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Laptop,
  Smartphone,
  Check,
  X,
  UserCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { UserRole, DeviceType, ModuleName, ActionType, DataScope } from '../../../types/auth';
import { globalPermissionEngine } from '../../../services/permissionEngine';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const PermissionCenterModule: React.FC = () => {
  const { showToast, refreshDb } = useSchool();
  const { currentUser, effectiveDevice } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<'all' | DeviceType>('mobile');

  const [rules, setRules] = useState(globalPermissionEngine.getRules());

  const moduleList: { id: ModuleName; name: string }[] = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'students', name: 'Students Management' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'fees', name: 'Fees & Invoicing' },
    { id: 'examinations', name: 'Examinations' },
    { id: 'marks', name: 'Marks Entry & Approval' },
    { id: 'payroll', name: 'Staff Payroll' },
    { id: 'library', name: 'Library' },
    { id: 'transport', name: 'Transport & Fleet' },
    { id: 'reports', name: 'Reports & Analytics' },
    { id: 'ai_assistant', name: 'AI Assistant' },
    { id: 'permission_management', name: 'Permission Center' },
  ];

  const actionList: ActionType[] = [
    'view',
    'create',
    'edit',
    'delete',
    'approve',
    'export',
    'print',
  ];

  // Toggle action permission for a specific module
  const toggleAction = (module: ModuleName, action: ActionType) => {
    const updated = [...rules];
    const existingIdx = updated.findIndex(
      (r) =>
        r.role === selectedRole &&
        r.module === module &&
        (selectedDeviceFilter === 'all' || r.device === selectedDeviceFilter || r.device === 'all')
    );

    if (existingIdx >= 0) {
      const rule = { ...updated[existingIdx] };
      if (rule.allowedActions.includes(action) || rule.allowedActions.includes('full_access')) {
        rule.allowedActions = rule.allowedActions.filter((a) => a !== action && a !== 'full_access');
        if (rule.allowedActions.length === 0) {
          rule.isAllowed = false;
        }
      } else {
        rule.allowedActions = [...rule.allowedActions, action];
        rule.isAllowed = true;
      }
      updated[existingIdx] = rule;
    } else {
      updated.push({
        id: `rule-${Date.now()}-${module}`,
        role: selectedRole,
        device: selectedDeviceFilter,
        module: module,
        allowedActions: [action],
        dataScope: 'class_assigned',
        isAllowed: true,
      });
    }

    setRules(updated);
    globalPermissionEngine.setRules(updated);
    refreshDb();
    showToast('Permission Rule Saved', `Updated ${action.toUpperCase()} on ${module} for ${selectedRole} (${selectedDeviceFilter})`, 'success');
  };

  const isActionAllowed = (module: ModuleName, action: ActionType): boolean => {
    const rule = rules.find(
      (r) =>
        r.role === selectedRole &&
        r.module === module &&
        (r.device === 'all' || r.device === selectedDeviceFilter) &&
        r.isAllowed &&
        (r.allowedActions.includes(action) || r.allowedActions.includes('full_access'))
    );
    return !!rule;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Zero-Trust Permission Management Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            USER → DEVICE → MODULE → ACTION → DATA SCOPE → ALLOW / DENY
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            Zero-Trust Policy Active
          </Badge>
        </div>
      </div>

      {/* Example Walkthrough Card from Prompt */}
      <Card className="bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">
              Live Policy Simulation Example:
            </h3>
            <p className="text-indigo-800/90 dark:text-indigo-300">
              • <strong>Teacher Rahul</strong> on <strong>Mobile</strong> → Attendance → Mark Attendance → Class 8A = <span className="text-emerald-700 dark:text-emerald-400 font-bold">ALLOWED</span>
            </p>
            <p className="text-indigo-800/90 dark:text-indigo-300">
              • <strong>Teacher Rahul</strong> on <strong>Mobile</strong> → Fees → Edit → All Students = <span className="text-rose-700 dark:text-rose-400 font-bold">DENIED</span>
            </p>
            <p className="text-indigo-800/90 dark:text-indigo-300">
              • <strong>Accountant Priya</strong> on <strong>Desktop</strong> → Fees → Edit → All Students = <span className="text-emerald-700 dark:text-emerald-400 font-bold">ALLOWED</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Role & Device Filter Selectors */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Role selector */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Select Role:</span>
            {[
              { id: 'principal' as UserRole, label: 'Principal' },
              { id: 'teacher' as UserRole, label: 'Teacher' },
              { id: 'accountant' as UserRole, label: 'Accountant' },
              { id: 'librarian' as UserRole, label: 'Librarian' },
              { id: 'driver' as UserRole, label: 'Driver' },
              { id: 'parent' as UserRole, label: 'Parent' },
              { id: 'student' as UserRole, label: 'Student' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedRole === r.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Device Hardware Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500">Target Device:</span>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setSelectedDeviceFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedDeviceFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All Devices
              </button>
              <button
                onClick={() => setSelectedDeviceFilter('desktop')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  selectedDeviceFilter === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setSelectedDeviceFilter('mobile')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  selectedDeviceFilter === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Permission Matrix Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {selectedRole} Permissions Matrix on {selectedDeviceFilter.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500">
              Click individual checkmarks to toggle ALLOW or DENY. Changes apply in real time.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">System Module</th>
                {actionList.map((act) => (
                  <th key={act} className="py-3 px-3 text-center uppercase">
                    {act}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {moduleList.map((mod) => (
                <tr key={mod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {mod.name}
                  </td>
                  {actionList.map((act) => {
                    const allowed = isActionAllowed(mod.id, act);
                    return (
                      <td key={act} className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleAction(mod.id, act)}
                          className={`w-7 h-7 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                            allowed
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-200'
                              : 'bg-rose-50 text-rose-300 dark:bg-rose-950/40 dark:text-rose-600 hover:bg-rose-100'
                          }`}
                          title={`Click to ${allowed ? 'DENY' : 'ALLOW'} ${act} on ${mod.name}`}
                        >
                          {allowed ? <Check className="w-4 h-4 font-black" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
