import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';
import { EnterpriseProvider } from './context/EnterpriseContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearch } from './components/layout/GlobalSearch';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AiAssistantDrawer } from './components/layout/AiAssistantDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { ModuleRouter } from './components/modules/ModuleRouter';

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* Collapsible Professional Sidebar (Desktop & Tablet) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Topbar Navigation */}
        <Topbar onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <ModuleRouter />
        </main>

        {/* Mobile Fixed Bottom Navigation & Capabilities Drawer */}
        <MobileNav />

        {/* Global Overlays */}
        <GlobalSearch />
        <NotificationDrawer />
        <AiAssistantDrawer />
        <ToastContainer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <EnterpriseProvider>
          <AppLayout />
        </EnterpriseProvider>
      </SchoolProvider>
    </AuthProvider>
  );
}

export default App;
