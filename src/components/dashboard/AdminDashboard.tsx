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
    <div className="space-y-6">
      {/* Top Welcome & KPI Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                Principal Executive Command Center
              </Badge>
              <span className="text-xs text-indigo-200/80">Academic Year 2025–26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Dr. Rajesh Sharma
            </h1>
            <p className="text-sm text-indigo-200/90 mt-1 max-w-2xl leading-relaxed">
              All 2 campuses operating normally. Term 1 Mid-Term Examination papers approved and ready for publication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              onClick={() => setActiveModule('permission_management')}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Permission Matrix
            </Button>
            <Button
              variant="primary"
              className="bg-indigo-500 hover:bg-indigo-600 text-xs shadow-lg shadow-indigo-500/30"
              onClick={() => setActiveModule('admissions')}
            >
              Admissions Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card hoverable onClick={() => setActiveModule('students')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {db.students.length * 32 + 4}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +18 admissions this month
            </div>
          </div>
        </Card>

        {/* Attendance */}
        <Card hoverable onClick={() => setActiveModule('attendance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{attendanceRate}%</div>
            <div className="text-xs text-slate-500 mt-1">
              {presentCount} of {todayAttendance.length} students logged
            </div>
          </div>
        </Card>

        {/* Fee Collection */}
        <Card hoverable onClick={() => setActiveModule('fees')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(totalFeesCollected / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> ₹{(totalFeesPending / 1000).toFixed(1)}k pending
            </div>
          </div>
        </Card>

        {/* Transport */}
        <Card hoverable onClick={() => setActiveModule('transport')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fleet</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">2 Routes Active</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Route 04 on time
            </div>
          </div>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fee Collection Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Fee Collection vs Monthly Target (in ₹ Lakhs)"
            subtitle="Comparing planned budget against verified collections"
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
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="collected" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right 1 Col: Class Attendance Comparison */}
        <Card>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[70, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="class" type="category" stroke="#94a3b8" fontSize={11} width={65} />
                <Tooltip />
                <Bar dataKey="rate" fill="#10b981" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Security Log Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Logs */}
        <Card>
          <CardHeader
            title="Real-Time Security Audit Trail"
            subtitle="Device and user authorization events"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('audit_logs')}>
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      log.status === 'allowed' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {log.userName} ({log.userRole})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {log.device.toUpperCase()} • {log.module} • {log.timestamp}
                    </div>
                  </div>
                </div>
                <Badge variant={log.status === 'allowed' ? 'success' : 'danger'}>
                  {log.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements Widget */}
        <Card>
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
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {ann.title}
                  </span>
                  <Badge variant={ann.priority === 'high' ? 'danger' : 'primary'}>
                    {ann.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
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
