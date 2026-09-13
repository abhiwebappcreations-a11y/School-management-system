import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Bot,
  Menu,
  X,
  GraduationCap,
  CreditCard,
  Bus,
  Sliders,
  ShieldAlert,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { ModuleName } from '../../types/auth';

export const MobileNav: React.FC = () => {
  const { canAccess, currentUser, effectiveDevice } = useAuth();
  const { activeModule, setActiveModule, setIsAiDrawerOpen, setIsNotificationsOpen } = useSchool();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // All modules available to user
  const allModulesList: { id: ModuleName; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'executive_command', label: 'Executive Command Center', icon: LayoutDashboard },
    { id: 'digital_twin', label: 'Campus Digital Twin', icon: GraduationCap },
    { id: 'student_risk', label: 'Student Risk Engine', icon: ShieldAlert },
    { id: 'parent_engagement', label: 'Parent Engagement Scorecard', icon: GraduationCap },
    { id: 'growth_timeline', label: 'Student Growth Timeline', icon: CalendarCheck },
    { id: 'career_guidance', label: 'Career Guidance & Pathways', icon: GraduationCap },
    { id: 'face_attendance', label: 'Face Recognition Attendance', icon: CalendarCheck },
    { id: 'gamification', label: 'House Gamification', icon: GraduationCap },
    { id: 'ai_worksheet_generator', label: 'AI Worksheet Generator', icon: GraduationCap },
    { id: 'workflow_builder', label: 'Visual Workflow Builder', icon: Sliders },
    { id: 'automation_engine', label: 'Automation Rules Engine', icon: Sliders },
    { id: 'kpi_analytics', label: 'KPI Analytics Center', icon: GraduationCap },
    { id: 'saas_tenants', label: 'Institutional SaaS Tenants', icon: Sliders },
    { id: 'admissions', label: 'Admissions Pipeline', icon: GraduationCap },
    { id: 'students', label: 'Students Directory', icon: GraduationCap },
    { id: 'parents', label: 'Parents Directory', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'timetable', label: 'Timetable', icon: CalendarCheck },
    { id: 'homework', label: 'Homework & Tasks', icon: GraduationCap },
    { id: 'examinations', label: 'Examinations', icon: GraduationCap },
    { id: 'marks', label: 'Marks Entry', icon: GraduationCap },
    { id: 'report_cards', label: 'Report Cards', icon: GraduationCap },
    { id: 'academic_year', label: 'Academic Year & Promotion', icon: CalendarCheck },
    { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
    { id: 'payroll', label: 'Staff Payroll', icon: CreditCard },
    { id: 'library', label: 'Library', icon: GraduationCap },
    { id: 'inventory', label: 'Inventory', icon: GraduationCap },
    { id: 'transport', label: 'Transport & Fleet', icon: Bus },
    { id: 'communication', label: 'Communication', icon: Megaphone },
    { id: 'calendar', label: 'School Calendar', icon: CalendarCheck },
    { id: 'leave_management', label: 'Leave Requests', icon: CalendarCheck },
    { id: 'documents', label: 'Secure Documents', icon: GraduationCap },
    { id: 'reports', label: 'Reports & Analytics', icon: GraduationCap },
    { id: 'bulk_operations', label: 'Bulk Tools & Importer', icon: Sliders },
    { id: 'backup_recovery', label: 'Backup & Recovery', icon: Sliders },
    { id: 'permission_management', label: 'Permission Matrix', icon: Sliders },
    { id: 'device_management', label: 'Device Management', icon: Sliders },
    { id: 'audit_logs', label: 'Audit Trail', icon: ShieldAlert },
    { id: 'school_configuration', label: 'Settings', icon: Sliders },
  ];

  const authorizedModules = allModulesList.filter((m) => canAccess(m.id, 'view'));

  return (
    <>
      {/* Fixed Bottom Bar on Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 px-3 flex items-center justify-around">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeModule === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        {canAccess('attendance', 'view') && (
          <button
            onClick={() => setActiveModule('attendance')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              activeModule === 'attendance'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Attendance</span>
          </button>
        )}

        {canAccess('transport', 'view') && (
          <button
            onClick={() => setActiveModule('transport')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              activeModule === 'transport'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span>Transport</span>
          </button>
        )}

        {/* AI Quick Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium text-indigo-600 dark:text-indigo-400"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center -mt-4 shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <span>AI Assistant</span>
        </button>

        {/* All Modules Menu Drawer Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            isDrawerOpen
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>All Modules</span>
        </button>
      </nav>

      {/* Slide-Up / Slide-Over Mobile Full Capability Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-6 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  All Authorized Modules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.roleTitle} on Mobile
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {authorizedModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveModule(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
