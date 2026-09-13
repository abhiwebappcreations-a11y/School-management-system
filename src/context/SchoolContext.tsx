import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModuleName } from '../types/auth';
import { AcademicYear, Branch } from '../types/academic';
import { SmartSchoolDatabase, dbService } from '../services/database';

import { SupportedLanguage } from '../types/enterprise';
import { translateText } from '../services/localization';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface SchoolContextType {
  db: SmartSchoolDatabase;
  activeModule: ModuleName;
  setActiveModule: (module: ModuleName) => void;
  selectedYear: AcademicYear;
  setSelectedYear: (year: AcademicYear) => void;
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  currentTenantId: string;
  setCurrentTenantId: (id: string) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshDb: () => void;
  mutateDb: (updater: (db: SmartSchoolDatabase) => void) => void;
  resetDatabase: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SmartSchoolDatabase>(dbService.getState());
  const [activeModule, setActiveModule] = useState<ModuleName>('dashboard');
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(
    db.academicYears.find((y) => y.isCurrent) || db.academicYears[0]
  );
  const [selectedBranch, setSelectedBranch] = useState<Branch>(db.branches[0]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('smartschool_lang') as SupportedLanguage) || 'en';
  });
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-main');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('smartschool_lang', lang);
  };

  const t = (key: string): string => {
    return translateText(key, language);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartschool_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartschool_theme', 'light');
    }
  }, [isDarkMode]);

  // Keyboard shortcut Ctrl+K / Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const refreshDb = () => {
    setDb({ ...dbService.getState() });
  };

  const mutateDb = (updater: (draftDb: SmartSchoolDatabase) => void) => {
    dbService.updateState(updater);
    refreshDb();
  };

  const resetDatabase = () => {
    const freshDb = dbService.resetToDemo();
    setDb({ ...freshDb });
  };

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <SchoolContext.Provider
      value={{
        db,
        activeModule,
        setActiveModule,
        selectedYear,
        setSelectedYear,
        selectedBranch,
        setSelectedBranch,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isDarkMode,
        toggleDarkMode,
        language,
        setLanguage: handleSetLanguage,
        t,
        currentTenantId,
        setCurrentTenantId,
        toasts,
        showToast,
        removeToast,
        refreshDb,
        mutateDb,
        resetDatabase,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
