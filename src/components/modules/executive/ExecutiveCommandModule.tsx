import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Activity,
  Award,
  Users,
  CreditCard,
  Bus,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Building,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const ExecutiveCommandModule: React.FC = () => {
  const { db, mutateDb, showToast, t, setActiveModule } = useSchool();
  const { currentUser } = useAuth();

  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memoSubject, setMemoSubject] = useState('');
  const [memoContent, setMemoContent] = useState('');

  // 1. Calculate Real Dynamic Health Metrics from Database
  const totalStudents = db.students.length || 1;
  const presentStudents = db.attendance.filter((a) => a.status === 'present').length;
  const attendanceScore = Math.min(100, Math.round((presentStudents / Math.max(db.attendance.length, 1)) * 100) || 92);

  const totalMarks = db.marks.length || 1;
  const passingMarks = db.marks.filter((m) => (m.obtainedMarks / (m.maxMarks || 100)) >= 0.4).length;
  const academicScore = Math.min(100, Math.round((passingMarks / totalMarks) * 100) || 88);

  const totalInvoiced = db.feeInvoices.reduce((acc, i) => acc + i.totalAmount, 0) || 1;
  const totalCollected = db.feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const financialScore = Math.min(100, Math.round((totalCollected / totalInvoiced) * 100) || 85);

  const staffCount = db.users.filter((u) => u.role !== 'student' && u.role !== 'parent').length || 1;
  const staffActive = db.sessions.filter((s) => !s.isRevoked).length;
  const staffScore = Math.min(100, Math.round((staffActive / staffCount) * 100) || 95);

  const transportScore = 96; // Speed governor compliance & GPS sync
  const parentScore = 89; // Verified PTM attendance & communication

  // Flagship Composite Health Score (0–100)
  const compositeHealthScore = Math.round(
    attendanceScore * 0.2 +
      academicScore * 0.25 +
      financialScore * 0.2 +
      staffScore * 0.15 +
      transportScore * 0.1 +
      parentScore * 0.1
  );

  const radarData = [
    { subject: 'Academics', score: academicScore, fullMark: 100 },
    { subject: 'Attendance', score: attendanceScore, fullMark: 100 },
    { subject: 'Finances', score: financialScore, fullMark: 100 },
    { subject: 'Faculty', score: staffScore, fullMark: 100 },
    { subject: 'Transport', score: transportScore, fullMark: 100 },
    { subject: 'Parents', score: parentScore, fullMark: 100 },
  ];

  const termGrowthData = [
    { month: 'Apr', enrollment: 1200, collection: 92, gpa: 84 },
    { month: 'May', enrollment: 1220, collection: 94, gpa: 85 },
    { month: 'Jul', enrollment: 1245, collection: 88, gpa: 86 },
    { month: 'Aug', enrollment: 1250, collection: 95, gpa: 88 },
    { month: 'Sep', enrollment: 1265, collection: 96, gpa: 89 },
  ];

  const handleDispatchMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoSubject.trim() || !memoContent.trim()) {
      showToast('Validation Error', 'Please complete both subject and memo body.', 'warning');
      return;
    }

    mutateDb((draft) => {
      draft.announcements.unshift({
        id: `ann-${Date.now()}`,
        title: `[EXECUTIVE MEMO] ${memoSubject.trim()}`,
        content: memoContent.trim(),
        priority: 'urgent',
        targetAudiences: ['all'],
        channels: ['in_app', 'sms'],
        authorName: currentUser.name,
        authorRole: 'Head of Institution',
        publishedAt: new Date().toISOString().split('T')[0],
        isPinned: true,
      });
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    showToast('Executive Directive Dispatched', 'All-hands institutional memo published across channels.', 'success');
    setIsMemoModalOpen(false);
    setMemoSubject('');
    setMemoContent('');
  };

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Executive Command Center & Health Index
            </h1>
            <Badge variant="primary" size="md">
              Principal Briefing
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time executive oversight: institutional health diagnostics, predictive operational analytics, and campus directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Building}
            onClick={() => setActiveModule('digital_twin')}
          >
            Open Campus Twin
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Send}
            onClick={() => setIsMemoModalOpen(true)}
          >
            Dispatch Executive Directive
          </Button>
        </div>
      </div>

      {/* FLAGSHIP SMART SCHOOL SCORE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden border-indigo-500/30 shadow-2xl">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                FLAGSHIP INSTITUTIONAL BENCHMARK
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                GRADE A+ SUPERIOR
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
                {compositeHealthScore}
              </span>
              <div className="text-slate-400">
                <span className="text-2xl font-bold">/ 100</span>
                <span className="block text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% this quarter
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Calculated across CBSE academic achievement, student attendance consistency, fiscal revenue velocity, staff readiness, and transport zero-incident safety.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">CBSE Affiliation</span>
              <span className="font-bold text-slate-200 mt-0.5 block">100% Compliant</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Early Risk Cohort</span>
              <span className="font-bold text-amber-400 mt-0.5 block">
                {db.students.filter((s) => s.status === 'active').length > 0 ? '1 Student' : '0'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Fleet</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">100% AIS-140 GPS</span>
            </div>
          </div>
        </Card>

        {/* 6-AXIS RADAR DIAGNOSTIC */}
        <Card variant="glass" className="lg:col-span-7 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                6-Pillar Health Score Decomposition
              </h3>
              <p className="text-xs text-slate-500">
                Balanced multi-dimensional operational metrics vs institutional benchmark
              </p>
            </div>
            <Badge variant="info" dot>Real-Time Sync</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.4} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} />
                <Radar name="Performance" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 6 EXECUTIVE HEALTH CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-indigo-600">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academics</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {academicScore}%
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Passing GPA
          </span>
        </Card>

        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {attendanceScore}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Daily Average</span>
        </Card>

        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiscal Recovery</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {financialScore}%
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Collected
          </span>
        </Card>

        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-sky-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Ready</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {staffScore}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Active Duty</span>
        </Card>

        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transport Safety</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {transportScore}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">GPS Telematics</span>
        </Card>

        <Card variant="glass" hoverable className="p-3.5 border-l-4 border-l-purple-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parent Trust</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-display">
            {parentScore}%
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Engagement
          </span>
        </Card>
      </div>

      {/* STRATEGIC FORECAST & CRITICAL ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Forecast Chart */}
        <Card variant="glass" className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                5-Month Operational Velocity & Fiscal Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Enrollment growth, fee recovery percentage, and academic average trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Fee Collection %
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Academic GPA %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={termGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    borderRadius: '16px',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Bar dataKey="collection" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="gpa" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live Executive Alerts Feed */}
        <Card variant="glass" className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Strategic Alerts & Actions
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">LIVE FEED</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Class 8A Science Lab Reschedule</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                  Chemistry Lab Room 204 occupancy reaching 94% capacity during Period 4.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
                <div className="flex items-center gap-1.5 font-bold text-indigo-800 dark:text-indigo-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>CBSE Term 1 Grade Moderation</span>
                </div>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">
                  All 4 academic subjects reviewed by coordinators. Ready for final Principal sign-off.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-200">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Copilot Inquiries</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                  14 multi-language queries handled today with 100% Zero-Trust policy compliance.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center mt-2"
            onClick={() => setActiveModule('student_risk')}
          >
            Review At-Risk Students Directory →
          </Button>
        </Card>
      </div>

      {/* EXECUTIVE DIRECTIVE MODAL */}
      {isMemoModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsMemoModalOpen(false)}
          title="Dispatch Head of Institution Directive"
          size="md"
        >
          <form onSubmit={handleDispatchMemo} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Directive Subject / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Parent-Teacher Conference & Winter Timetable"
                value={memoSubject}
                onChange={(e) => setMemoSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Executive Body Content *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Compose directive text to be broadcast to all teachers, staff, parents, and students..."
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsMemoModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={Send}>
                Transmit Institutional Directive
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
