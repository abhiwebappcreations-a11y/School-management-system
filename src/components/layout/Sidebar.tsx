import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  BookOpen,
  CalendarCheck,
  Clock,
  BookMarked,
  FileCheck2,
  Award,
  CreditCard,
  Library,
  Package,
  Bus,
  Megaphone,
  Calendar,
  Coffee,
  Wallet,
  FileText,
  BarChart3,
  Bot,
  ShieldAlert,
  Smartphone,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HardDrive,
  Building2,
  Scan,
  GitMerge,
  Compass,
  Trophy,
  Zap,
  Globe,
} from 'lucide-react';
import { ModuleName } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';

interface NavItem {
  id: ModuleName;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    groupName: 'Executive & Intelligence',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'executive_command', label: 'Executive Command', icon: Sparkles, badge: 'Flagship' },
      { id: 'digital_twin', label: 'Campus Digital Twin', icon: Building2, badge: 'IoT Live' },
      { id: 'kpi_analytics', label: 'KPI Analytics Center', icon: BarChart3 },
      { id: 'ai_assistant', label: 'AI Assistant Copilot', icon: Bot, badge: '8-Lang' },
    ],
  },
  {
    groupName: 'Student Success & Guidance',
    items: [
      { id: 'student_risk', label: 'Student Risk Engine', icon: ShieldAlert, badge: 'AI Risk' },
      { id: 'growth_timeline', label: 'Growth Timeline', icon: Clock },
      { id: 'career_guidance', label: 'Career Guidance', icon: Compass },
      { id: 'gamification', label: 'House Gamification', icon: Trophy, badge: 'XP' },
      { id: 'parent_engagement', label: 'Parent Engagement', icon: Users, badge: '360°' },
    ],
  },
  {
    groupName: 'Academics & Classroom AI',
    items: [
      { id: 'ai_worksheet_generator', label: 'AI Worksheet Generator', icon: BookOpen, badge: 'AI Gen' },
      { id: 'face_attendance', label: 'Face Recognition Attendance', icon: Scan, badge: 'Bio' },
      { id: 'admissions', label: 'Admissions Pipeline', icon: UserPlus, badge: 'Workflow' },
      { id: 'students', label: 'Students Directory', icon: GraduationCap },
      { id: 'parents', label: 'Parents & Guardians', icon: Users },
      { id: 'teachers', label: 'Teachers & Faculty', icon: Briefcase },
      { id: 'classes_sections', label: 'Classes & Sections', icon: Layers },
      { id: 'subjects', label: 'Curriculum & Subjects', icon: BookOpen },
      { id: 'attendance', label: 'Attendance Center', icon: CalendarCheck, badge: 'Live' },
      { id: 'timetable', label: 'Timetable & Subs', icon: Clock },
      { id: 'homework', label: 'Homework & Tasks', icon: BookMarked },
      { id: 'examinations', label: 'Exams & Schedules', icon: FileCheck2 },
      { id: 'marks', label: 'Marks & Approval', icon: Award },
      { id: 'report_cards', label: 'Digital Report Cards', icon: Award },
      { id: 'academic_year', label: 'Academic Year & Promotion', icon: Calendar, badge: 'Roll' },
    ],
  },
  {
    groupName: 'Finance, Fleet & Operations',
    items: [
      { id: 'fees', label: 'Fees & Invoicing', icon: CreditCard },
      { id: 'payroll', label: 'Staff Payroll', icon: Wallet },
      { id: 'library', label: 'Library Management', icon: Library },
      { id: 'inventory', label: 'Stock & Inventory', icon: Package },
      { id: 'transport', label: 'Transport & Fleet', icon: Bus, badge: 'GPS' },
      { id: 'communication', label: 'Communication Center', icon: Megaphone },
      { id: 'calendar', label: 'School Calendar', icon: Calendar },
      { id: 'leave_management', label: 'Staff Leave', icon: Coffee },
      { id: 'documents', label: 'Secure Documents', icon: FileText },
      { id: 'reports', label: 'Standard Reports', icon: BarChart3 },
    ],
  },
  {
    groupName: 'Autonomous Workflows & Multi-Tenant',
    items: [
      { id: 'workflow_builder', label: 'Visual Workflow Builder', icon: GitMerge, badge: 'NoCode' },
      { id: 'automation_engine', label: 'Automation Engine', icon: Zap, badge: 'IF-THEN' },
      { id: 'saas_tenants', label: 'Institutional SaaS Tenants', icon: Globe, badge: 'SaaS' },
      { id: 'bulk_operations', label: 'Bulk Tools & Importer', icon: Layers, badge: 'Batch' },
      { id: 'backup_recovery', label: 'Backup & Disaster Recovery', icon: HardDrive },
      { id: 'permission_management', label: 'Permission Matrix', icon: Sliders, badge: 'Core' },
      { id: 'device_management', label: 'Device Management', icon: Smartphone },
      { id: 'audit_logs', label: 'Security Audit Trail', icon: ShieldAlert },
      { id: 'school_configuration', label: 'School Settings', icon: Sliders },
    ],
  },
];

export const Sidebar: React.FC<{ isCollapsed: boolean; onToggle: () => void }> = ({
  isCollapsed,
  onToggle,
}) => {
  const { canAccess, currentUser, effectiveDevice } = useAuth();
  const { activeModule, setActiveModule, t } = useSchool();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative select-none ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 shrink-0">
            S
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 text-sm">
                SmartSchool <span className="text-indigo-600 dark:text-indigo-400 font-mono">OS</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                OPERATING SYSTEM
              </div>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links (Strictly Filtered by USER -> DEVICE -> MODULE Permissions) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAVIGATION_GROUPS.map((group) => {
          // Filter items by permission check
          const authorizedItems = group.items.filter((item) => canAccess(item.id, 'view'));

          // If no items are authorized in this group for this user/device, hide entire group
          if (authorizedItems.length === 0) return null;

          const isGroupCollapsed = !!collapsedGroups[group.groupName];

          return (
            <div key={group.groupName} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.groupName)}
                  className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <span>{group.groupName}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isGroupCollapsed ? '-rotate-90' : ''}`}
                  />
                </button>
              )}

              {(!isGroupCollapsed || isCollapsed) && (
                <div className="space-y-0.5">
                  {authorizedItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />

                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{t(item.id) !== item.id ? t(item.id) : item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                  isActive
                                    ? 'bg-indigo-700 text-indigo-100'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Status Card in Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="flex-1 truncate">
              <span className="text-slate-400 block text-[10px]">DEVICE ENFORCEMENT</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                {effectiveDevice} Mode Active
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
