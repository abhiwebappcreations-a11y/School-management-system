import React from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Bus,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { useSchool } from '../../context/SchoolContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const AdminDashboard: React.FC = () => {
  const { db, setActiveModule } = useSchool();

  // Financial calculations
  const totalFeesExpected = db.feeInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalFeesCollected = db.feeInvoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalFeesPending = db.feeInvoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);

  // Attendance calculations
  const todayAttendance = db.attendance.filter((a) => a.date === '2026-09-13');
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = Math.round((presentCount / (todayAttendance.length || 1)) * 100);

  // Monthly trends data for Recharts
  const collectionTrendData = [
    { month: 'Apr', target: 85, collected: 82 },
    { month: 'May', target: 90, collected: 89 },
    { month: 'Jun', target: 95, collected: 91 },
    { month: 'Jul', target: 110, collected: 108 },
    { month: 'Aug', target: 120, collected: 118 },
    { month: 'Sep', target: 130, collected: 124 },
  ];

  const attendanceByClassData = [
    { class: 'Class 8A', rate: 94 },
    { class: 'Class 8B', rate: 91 },
    { class: 'Class 9A', rate: 88 },
    { class: 'Class 9B', rate: 95 },
    { class: 'Class 10A', rate: 96 },
    { class: 'Class 10B', rate: 92 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & KPI Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-indigo-500/15 via-violet-500/10 to-transparent pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" dot className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                Principal Executive Command Center
              </Badge>
              <span className="text-xs text-indigo-200/80 font-medium">AY 2025–26 • All Systems Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-display text-white">
              Welcome back, <span className="text-gradient-indigo text-white">Dr. Rajesh Sharma</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1.5 max-w-2xl leading-relaxed font-normal">
              All 2 campuses operating normally. Term 1 Mid-Term Examination papers approved and ready for publication with zero security alerts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs shadow-xs"
              onClick={() => setActiveModule('permission_management')}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
              Permission Matrix
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-lg shadow-indigo-500/30 font-semibold"
              onClick={() => setActiveModule('admissions')}
            >
              Admissions Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <Card hoverable variant="glass" onClick={() => setActiveModule('students')} className="group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20 transition-transform group-hover:scale-110 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {db.students.length * 32 + 4}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1.5 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +18 admissions this month
            </div>
          </div>
        </Card>

        {/* Attendance */}
        <Card hoverable variant="glass" onClick={() => setActiveModule('attendance')} className="group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 transition-transform group-hover:scale-110 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">{attendanceRate}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              {presentCount} of {todayAttendance.length} students logged
            </div>
          </div>
        </Card>

        {/* Fee Collection */}
        <Card hoverable variant="glass" onClick={() => setActiveModule('fees')} className="group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee Collection</span>
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center ring-1 ring-teal-500/20 transition-transform group-hover:scale-110 shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              ₹{(totalFeesCollected / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1.5 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> ₹{(totalFeesPending / 1000).toFixed(1)}k pending
            </div>
          </div>
        </Card>

        {/* Transport */}
        <Card hoverable variant="glass" onClick={() => setActiveModule('transport')} className="group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Fleet</span>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 transition-transform group-hover:scale-110 shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">2 Routes Active</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Route 04 on time (GPS Live)
            </div>
          </div>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fee Collection Trend Chart */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Fee Collection vs Monthly Target (in ₹ Lakhs)"
            subtitle="Comparing planned institutional budget against verified settlements"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('fees')}>
                Details <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={collectionTrendData}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right 1 Col: Class Attendance Comparison */}
        <Card variant="glass">
          <CardHeader
            title="Class Attendance Today"
            subtitle="Live percentage across sections"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('attendance')}>
                Mark <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceByClassData} layout="vertical">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" horizontal={false} />
                <XAxis type="number" domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="class" type="category" stroke="#94a3b8" fontSize={11} width={65} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    borderRadius: '16px',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Bar dataKey="rate" fill="url(#barGradient)" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Security Log Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Logs */}
        <Card variant="glass">
          <CardHeader
            title="Real-Time Security Audit Trail"
            subtitle="Device and user authorization events"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('audit_logs')}>
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-2.5">
            {db.auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.status === 'allowed' ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-rose-500 ring-2 ring-rose-500/20'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {log.userName} <span className="font-normal text-slate-500 dark:text-slate-400">({log.userRole})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {log.device.toUpperCase()} • {log.module} • {log.timestamp}
                    </div>
                  </div>
                </div>
                <Badge variant={log.status === 'allowed' ? 'success' : 'danger'} size="sm">
                  {log.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements Widget */}
        <Card variant="glass">
          <CardHeader
            title="School Announcements & Circulars"
            subtitle="Broadcast to parents, faculty, and students"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('communication')}>
                Post New <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate font-display">
                    {ann.title}
                  </span>
                  <Badge variant={ann.priority === 'high' ? 'danger' : 'primary'} size="sm">
                    {ann.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                  <span>Posted by {ann.authorName}</span>
                  <span>{ann.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
