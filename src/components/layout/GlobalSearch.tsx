import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, Users, CreditCard, Library, Bus, Megaphone, ArrowRight, X } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { ModuleName } from '../../types/auth';

export const GlobalSearch: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, db, setActiveModule } = useSchool();
  const { canAccess } = useAuth();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      module: ModuleName;
      icon: React.ElementType;
    }[] = [];

    // Students
    if (canAccess('students', 'view')) {
      db.students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.admissionNumber.toLowerCase().includes(q) ||
            s.classSection.toLowerCase().includes(q)
        )
        .slice(0, 4)
        .forEach((s) => {
          items.push({
            id: s.id,
            title: s.name,
            subtitle: `${s.classSection} • Roll ${s.rollNumber} • ${s.admissionNumber}`,
            category: 'Students',
            module: 'students',
            icon: GraduationCap,
          });
        });
    }

    // Staff
    if (canAccess('teachers', 'view')) {
      db.users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.roleTitle.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .forEach((u) => {
          items.push({
            id: u.id,
            title: u.name,
            subtitle: `${u.roleTitle} • ${u.email}`,
            category: 'Staff & Teachers',
            module: 'teachers',
            icon: Users,
          });
        });
    }

    // Fees / Invoices
    if (canAccess('fees', 'view')) {
      db.feeInvoices
        .filter(
          (inv) =>
            inv.studentName.toLowerCase().includes(q) ||
            inv.invoiceNumber.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .forEach((inv) => {
          items.push({
            id: inv.id,
            title: `${inv.invoiceNumber} - ${inv.studentName}`,
            subtitle: `₹${inv.totalAmount.toLocaleString('en-IN')} • ${inv.status.toUpperCase()}`,
            category: 'Fees & Invoices',
            module: 'fees',
            icon: CreditCard,
          });
        });
    }

    // Library
    if (canAccess('library', 'view')) {
      db.books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .forEach((b) => {
          items.push({
            id: b.id,
            title: b.title,
            subtitle: `by ${b.author} • ${b.category} (${b.availableCopies} available)`,
            category: 'Library Books',
            module: 'library',
            icon: Library,
          });
        });
    }

    // Transport Routes
    if (canAccess('transport', 'view')) {
      db.routes
        .filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.routeNumber.toLowerCase().includes(q) ||
            r.busNumber.toLowerCase().includes(q)
        )
        .slice(0, 2)
        .forEach((r) => {
          items.push({
            id: r.id,
            title: `${r.routeNumber} - ${r.name}`,
            subtitle: `Bus: ${r.busNumber} • Driver: ${r.driverName} • ${r.status}`,
            category: 'Transport',
            module: 'transport',
            icon: Bus,
          });
        });
    }

    // Enterprise Flagship Modules Quick Match
    const ENTERPRISE_SEARCH_MODULES: { id: ModuleName; title: string; subtitle: string; keywords: string[] }[] = [
      { id: 'executive_command', title: 'Executive Command Center', subtitle: 'Institutional Health Score (94/100) & Principal Directives', keywords: ['executive', 'command', 'health', 'directive', 'score', 'audit'] },
      { id: 'digital_twin', title: 'Campus Digital Twin', subtitle: 'Real-time 3D spatial occupancy & IoT telemetry mesh', keywords: ['twin', 'digital', 'iot', 'campus', 'room', 'lab', 'temperature', 'lockdown'] },
      { id: 'student_risk', title: 'Student Risk Prediction Engine', subtitle: 'Early warning dropout, academic GPA & fee arrears intervention', keywords: ['risk', 'dropout', 'warning', 'counselor', 'intervention', 'failing'] },
      { id: 'parent_engagement', title: 'Parent Engagement Scorecard', subtitle: '360° PTM attendance, mobile app login & fee promptness index', keywords: ['parent', 'engagement', 'ptm', 'whatsapp', 'champion'] },
      { id: 'growth_timeline', title: 'Student Growth Timeline', subtitle: 'Multi-year verified portfolio, CBSE olympiads & certifications', keywords: ['timeline', 'growth', 'milestone', 'portfolio', 'dossier'] },
      { id: 'career_guidance', title: 'Career Guidance & Pathways', subtitle: 'Stream roadmaps, Holland Code RIASEC assessment & exams', keywords: ['career', 'guidance', 'stream', 'pcm', 'pcb', 'jee', 'neet', 'clat'] },
      { id: 'face_attendance', title: 'Face Recognition Attendance Terminal', subtitle: 'Edge biometric gate scanner with anti-spoof liveness check', keywords: ['face', 'biometric', 'camera', 'kiosk', 'recognition', 'gate'] },
      { id: 'gamification', title: 'Student Gamification & House System', subtitle: 'Red Phoenix, Blue Dragons, Green Falcons, Gold Eagles & Reward Shop', keywords: ['gamification', 'house', 'points', 'badge', 'streak', 'phoenix', 'reward'] },
      { id: 'ai_worksheet_generator', title: 'AI Homework & Worksheet Generator', subtitle: 'CBSE, ICSE & Cambridge aligned question paper synthesis', keywords: ['worksheet', 'ai', 'generator', 'homework', 'question', 'exam', 'paper'] },
      { id: 'workflow_builder', title: 'Visual Workflow Builder', subtitle: 'Multi-tier zero-code leave, admission and fee approval chains', keywords: ['workflow', 'approval', 'builder', 'stage', 'chain'] },
      { id: 'automation_engine', title: 'Automation Rules Engine', subtitle: 'IF-THEN autonomous event triggers for SMS, WhatsApp & Alerts', keywords: ['automation', 'rule', 'trigger', 'event', 'alert'] },
      { id: 'kpi_analytics', title: 'Institutional KPI Analytics Center', subtitle: 'Admissions funnel conversion & 5-year cohort retention rates', keywords: ['kpi', 'analytics', 'funnel', 'cohort', 'retention'] },
      { id: 'saas_tenants', title: 'Multi-Tenant Institutional SaaS', subtitle: 'Subdomains, multi-school management & data isolation partitions', keywords: ['tenant', 'saas', 'subdomain', 'trust', 'institution', 'partition'] },
    ];

    ENTERPRISE_SEARCH_MODULES.forEach((mod) => {
      if (
        canAccess(mod.id, 'view') &&
        (mod.title.toLowerCase().includes(q) ||
          mod.subtitle.toLowerCase().includes(q) ||
          mod.keywords.some((kw) => kw.includes(q)))
      ) {
        items.push({
          id: `ent-${mod.id}`,
          title: mod.title,
          subtitle: mod.subtitle,
          category: 'Enterprise Capabilities',
          module: mod.id,
          icon: GraduationCap,
        });
      }
    });

    return items;
  }, [query, db, canAccess]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Search students, teachers, fee receipts, books, bus routes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords like <span className="font-semibold text-slate-600 dark:text-slate-300">"Ravi"</span>,{' '}
              <span className="font-semibold text-slate-600 dark:text-slate-300">"Math"</span>,{' '}
              <span className="font-semibold text-slate-600 dark:text-slate-300">"Route 04"</span> or{' '}
              <span className="font-semibold text-slate-600 dark:text-slate-300">"Invoice"</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found within your authorized scope.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={res.id}
                    onClick={() => {
                      setActiveModule(res.module);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {res.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {res.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
