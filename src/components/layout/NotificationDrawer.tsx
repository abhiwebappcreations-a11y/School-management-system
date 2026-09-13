import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, CheckCheck } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Button } from '../common/Button';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, db, mutateDb, showToast } = useSchool();

  if (!isNotificationsOpen) return null;

  const markAllAsRead = () => {
    mutateDb((draft) => {
      draft.notifications.forEach((n) => (n.isRead = true));
    });
    showToast('Notifications Updated', 'All notifications marked as read', 'info');
  };

  const icons = {
    info: <Info className="w-4 h-4 text-sky-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    danger: <AlertCircle className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsNotificationsOpen(false)}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Notification Center
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">{db.notifications.length} alerts received</span>
          <button
            onClick={markAllAsRead}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {db.notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                notif.isRead
                  ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{icons[notif.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
