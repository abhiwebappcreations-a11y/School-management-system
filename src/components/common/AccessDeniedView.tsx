import React from 'react';
import { ShieldAlert, Laptop, Smartphone, ArrowLeft, RefreshCw, KeyRound, Lock } from 'lucide-react';
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
      <div className="max-w-lg w-full glass-card border border-rose-200/80 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-500/10 text-center relative overflow-hidden">
        {/* Decorative Top Ambient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 dark:bg-rose-950/60 border border-rose-300/60 dark:border-rose-800/80 flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10 relative">
          <ShieldAlert className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
        </div>

        <Badge variant="danger" size="md" dot className="mb-3">
          SECURITY BOUNDARY ENFORCED
        </Badge>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          Access Restricted
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {reason ||
            `Your current security clearance does not authorize '${action.toUpperCase()}' operations on module '${module}' from this device.`}
        </p>

        {/* Security Inspector Context Card */}
        <div className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 text-left mb-6 text-xs space-y-2.5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> Zero-Trust Security Context
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              POLICY_DENY
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Authenticated User:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Assigned Role:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.roleTitle}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Active Device:</span>
            <span className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 capitalize">
              {device === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-indigo-500" /> : <Laptop className="w-3.5 h-3.5 text-indigo-500" />}
              {device} Mode
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-500">Requested Module:</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{module}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Required Action:</span>
            <span className="font-mono uppercase font-black text-rose-600 dark:text-rose-400">{action}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:flex-1"
              icon={ArrowLeft}
              onClick={() => setActiveModule('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:flex-1"
              icon={RefreshCw}
              onClick={() => loginDemo('principal')}
            >
              Principal Demo
            </Button>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <span>Or test policy:</span>
            <button
              onClick={() => setDeviceMode(device === 'mobile' ? 'desktop' : 'mobile')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Simulate {device === 'mobile' ? 'Desktop' : 'Mobile'} Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
