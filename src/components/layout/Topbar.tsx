import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Smartphone,
  Sparkles,
  ChevronDown,
  Building2,
  Calendar,
  ShieldCheck,
  LogOut,
  UserCheck,
  Languages,
} from 'lucide-react';
import { useAuth, DeviceMode } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { Badge } from '../common/Badge';
import { SUPPORTED_LANGUAGES } from '../../services/localization';

export const Topbar: React.FC<{ onToggleSidebar?: () => void }> = () => {
  const {
    currentUser,
    deviceMode,
    effectiveDevice,
    setDeviceMode,
    loginDemo,
  } = useAuth();

  const {
    db,
    selectedYear,
    setSelectedYear,
    selectedBranch,
    setSelectedBranch,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsAiDrawerOpen,
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    showToast,
  } = useSchool();

  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const unreadCount = db.notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-3 select-none">
      {/* Left: Global Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-xs font-medium border border-transparent dark:border-slate-700/60 transition-colors w-44 sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 text-left truncate">Search anything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 rounded shadow-xs text-slate-400 border border-slate-200 dark:border-slate-600">
            Ctrl K
          </kbd>
        </button>

        {/* Branch Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsBranchMenuOpen(!isBranchMenuOpen);
              setIsYearMenuOpen(false);
              setIsDeviceMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-800"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate max-w-[120px]">{selectedBranch.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isBranchMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Campus
              </div>
              {db.branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b);
                    setIsBranchMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    selectedBranch.id === b.id
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div>{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.city}</div>
                  </div>
                  {selectedBranch.id === b.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Year Selector */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => {
              setIsYearMenuOpen(!isYearMenuOpen);
              setIsBranchMenuOpen(false);
              setIsDeviceMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-800"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>AY {selectedYear.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isYearMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Academic Year
              </div>
              {db.academicYears.map((y) => (
                <button
                  key={y.id}
                  onClick={() => {
                    setSelectedYear(y);
                    setIsYearMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    selectedYear.id === y.id
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>AY {y.name}</span>
                  {y.isCurrent && (
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* DEVICE SIMULATOR SELECTOR (Crucial for Core Principle) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsDeviceMenuOpen(!isDeviceMenuOpen);
              setIsUserMenuOpen(false);
              setIsBranchMenuOpen(false);
              setIsYearMenuOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              deviceMode === 'auto'
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
            }`}
            title="Switch or simulate Desktop / Mobile hardware to evaluate USER → DEVICE → MODULE → ACTION → ALLOW/DENY rules in real-time"
          >
            {effectiveDevice === 'mobile' ? (
              <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse-subtle" />
            ) : (
              <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )}
            <span className="hidden sm:inline">
              Device:{' '}
              <strong className="capitalize font-bold">{effectiveDevice}</strong>
              {deviceMode !== 'auto' && ' (Simulated)'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isDeviceMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Device Policy Enforcement
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Change active device mode to verify mobile vs desktop permission rules instantly.
                </p>
              </div>

              <div className="space-y-1">
                {[
                  { mode: 'auto' as DeviceMode, label: 'Auto Detect (Responsive)', desc: 'Follows actual viewport size' },
                  { mode: 'desktop' as DeviceMode, label: 'Force Desktop Evaluation', desc: 'Applies desktop-specific permissions' },
                  { mode: 'mobile' as DeviceMode, label: 'Force Mobile Evaluation', desc: 'Applies mobile-specific permissions' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      setDeviceMode(item.mode);
                      setIsDeviceMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex flex-col transition-colors ${
                      deviceMode === item.mode
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      {deviceMode === item.mode && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="relative p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
          title="Open AI Administrative Assistant (Permission-Bounded)"
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light / Dark theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Multi-Language Selector Dropdown (8 Languages Supported) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLangMenuOpen(!isLangMenuOpen);
              setIsUserMenuOpen(false);
              setIsDeviceMenuOpen(false);
              setIsBranchMenuOpen(false);
              setIsYearMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            title="Switch Interface & AI Language"
          >
            <span className="text-sm">
              {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag || '🌐'}
            </span>
            <span className="hidden md:inline uppercase font-bold text-[11px]">
              {language}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Language / भाषा
              </div>
              <div className="space-y-0.5">
                {SUPPORTED_LANGUAGES.map((langOpt) => (
                  <button
                    key={langOpt.code}
                    onClick={() => {
                      setLanguage(langOpt.code);
                      setIsLangMenuOpen(false);
                      showToast(
                        'Language Updated',
                        `Interface & AI translated to ${langOpt.name} (${langOpt.nativeName}).`,
                        'success'
                      );
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      language === langOpt.code
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{langOpt.flag}</span>
                      <div>
                        <div className="font-semibold">{langOpt.name}</div>
                        <div className="text-[10px] text-slate-400">{langOpt.nativeName}</div>
                      </div>
                    </div>
                    {language === langOpt.code && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsDeviceMenuOpen(false);
              setIsBranchMenuOpen(false);
              setIsYearMenuOpen(false);
              setIsLangMenuOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUser.roleTitle.split('(')[0]}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-40 animate-in fade-in zoom-in-95">
              {/* Current Active Account Header */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                    {currentUser.roleTitle}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                </div>
              </div>

              {/* 1-Click Demo Persona Switcher */}
              <div className="mb-2">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Demo Persona</span>
                  <UserCheck className="w-3 h-3 text-indigo-500" />
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {[
                    { role: 'principal' as const, name: 'Dr. Rajesh Sharma', title: 'Principal (Full Access)' },
                    { role: 'teacher' as const, name: 'Rahul Kumar', title: 'Teacher (8A Math - No Fees)' },
                    { role: 'accountant' as const, name: 'Priya Sharma', title: 'Accountant (Fees & Payroll)' },
                    { role: 'librarian' as const, name: 'Sunita Patel', title: 'Librarian (Books & Catalog)' },
                    { role: 'driver' as const, name: 'Manoj Singh', title: 'Driver (Route 04 & Bus)' },
                    { role: 'parent' as const, name: 'Vikram Mehta', title: 'Parent (Ravi Kumar - 8A)' },
                    { role: 'student' as const, name: 'Ravi Kumar', title: 'Student (Class 8A)' },
                  ].map((demo) => (
                    <button
                      key={demo.role}
                      onClick={() => {
                        loginDemo(demo.role);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentUser.role === demo.role
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold">{demo.name}</span>
                        <span className="text-[10px] text-slate-400 block">{demo.title}</span>
                      </div>
                      {currentUser.role === demo.role && (
                        <Badge variant="primary" size="sm">
                          Active
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to Demo Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    db.schoolConfig.schoolName = 'Delhi Smart International Academy';
                    window.location.reload();
                  }}
                  className="w-full text-center py-1.5 text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <LogOut className="w-3 h-3" /> Reload Fresh State
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
