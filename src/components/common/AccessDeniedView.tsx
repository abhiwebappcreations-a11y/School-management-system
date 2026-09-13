import React from 'react';
import { ShieldAlert, Laptop, Smartphone, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { User, DeviceType, ModuleName, ActionType } from '../../types/auth';
import { Button } from './Button';
import { Badge } from './Badge';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';

export interface AccessDeniedViewProps {
  module: ModuleName;
  action: ActionType;
  user: User;
  device: DeviceType;
  reason?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  module,
  action,
  user,
  device,
  reason,
}) => {
  const { setActiveModule } = useSchool();
  const { loginDemo, setDeviceMode } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-8 shadow-xl shadow-rose-500/5 text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto mb-5 text-rose-600 dark:text-rose-400 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <Badge variant="danger" size="md" className="mb-3">
          SECURITY BOUNDARY ENFORCED
        </Badge>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Access Restricted
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {reason ||
            `Your current account does not have sufficient clearance to perform '${action.toUpperCase()}' on the '${module}' module from this device.`}
        </p>

        {/* Security Inspector Pill */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left mb-6 text-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> Security Evaluation Context
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Authenticated User:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Assigned Role:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.roleTitle}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Active Device:</span>
            <span className="font-semibold flex items-center gap-1 text-slate-800 dark:text-slate-200 capitalize">
              {device === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
              {device}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Requested Module:</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{module}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Action:</span>
            <span className="font-mono uppercase font-bold text-rose-600 dark:text-rose-400">{action}</span>
          </div>
        </div>

        {/* Quick Testing Actions */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              icon={ArrowLeft}
              onClick={() => setActiveModule('dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={RefreshCw}
              onClick={() => loginDemo('principal')}
            >
              Switch to Principal
            </Button>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <span>Or test device rule:</span>
            <button
              onClick={() => setDeviceMode(device === 'mobile' ? 'desktop' : 'mobile')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Simulate {device === 'mobile' ? 'Desktop' : 'Mobile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
