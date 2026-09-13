import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  FileSpreadsheet,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useSchool } from '../../../context/SchoolContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';

const FUNNEL_DATA = [
  { stage: 'Inquiries Received', count: 1240, dropPct: '0%' },
  { stage: 'Formal Applications', count: 850, dropPct: '-31%' },
  { stage: 'Entrance Assessments', count: 640, dropPct: '-24%' },
  { stage: 'Admission Offers Issued', count: 420, dropPct: '-34%' },
  { stage: 'Tuition Paid & Enrolled', count: 390, dropPct: '-7%' },
];

const COHORT_RETENTION = [
  { year: '2021-22', enrolled: 1800, retained: 1740, retentionRate: 96.6 },
  { year: '2022-23', enrolled: 2050, retained: 1990, retentionRate: 97.0 },
  { year: '2023-24', enrolled: 2200, retained: 2150, retentionRate: 97.7 },
  { year: '2024-25', enrolled: 2350, retained: 2305, retentionRate: 98.1 },
  { year: '2025-26', enrolled: 2450, retained: 2415, retentionRate: 98.5 },
];

const CAMPUS_COMPARISON = [
  { campus: 'Main Campus (New Delhi)', students: 1450, gpa: '88.4%', feeCollection: '98.2%', teacherRatio: '1:18' },
  { campus: 'South Extension Wing', students: 680, gpa: '86.1%', feeCollection: '96.5%', teacherRatio: '1:16' },
  { campus: 'Gurugram Tech Satellite', students: 320, gpa: '91.2%', feeCollection: '99.4%', teacherRatio: '1:14' },
];

export const KpiAnalyticsModule: React.FC = () => {
  const { showToast } = useSchool();
  const [selectedFunnelView, setSelectedFunnelView] = useState<'count' | 'conversion'>('count');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <Card variant="glass" className="p-5 md:p-6 border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/25">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Institutional KPI Analytics Center
                </h1>
                <Badge variant="indigo" dot>
                  Executive Intelligence
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Admission conversion funnels, longitudinal student retention cohorts, and multi-campus comparative benchmarking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={() =>
                showToast(
                  'Comprehensive KPI Deck Generated',
                  'Exported multi-dimensional institutional analytical brief with charts.',
                  'success'
                )
              }
            >
              Export Executive KPI Deck
            </Button>
          </div>
        </div>
      </Card>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card variant="glass" hover className="p-4.5 border-slate-200/70 dark:border-slate-800/70">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Funnel Yield (Offer to Join)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">92.8%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% YoY growth
          </div>
        </Card>

        <Card variant="glass" hover className="p-4.5 border-slate-200/70 dark:border-slate-800/70">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Annual Retention Rate</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">98.5%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <Award className="w-3 h-3" /> Top quartile in region
          </div>
        </Card>

        <Card variant="glass" hover className="p-4.5 border-slate-200/70 dark:border-slate-800/70">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Faculty Approval Index</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">4.8 / 5.0</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 94% Parent Satisfaction
          </div>
        </Card>

        <Card variant="glass" hover className="p-4.5 border-slate-200/70 dark:border-slate-800/70">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fee Collection Realization</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">98.2%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ₹2.4M overdue recovering
          </div>
        </Card>
      </div>

      {/* Admission Conversion Funnel Visualization */}
      <Card variant="glass" className="p-6 border-slate-200/80 dark:border-slate-800/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Admissions Conversion Funnel (Academic Session 2026-27)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Progression metrics from prospective student inquiry to final tuition matriculation.
            </p>
          </div>
          <Badge variant="emerald" dot>
            Overall Conversion: 31.4%
          </Badge>
        </div>

        <div className="space-y-3.5 pt-1">
          {FUNNEL_DATA.map((step, idx) => {
            const widthPct = Math.max(25, Math.round((step.count / FUNNEL_DATA[0].count) * 100));
            return (
              <div key={step.stage} className="space-y-1.5 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black border border-indigo-200/50 dark:border-indigo-800/50 shadow-2xs">
                      {idx + 1}
                    </span>
                    {step.stage}
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    <strong>{step.count.toLocaleString()}</strong> candidates
                    {step.dropPct !== '0%' && (
                      <span className="text-rose-500 dark:text-rose-400 font-semibold ml-2 text-[11px]">({step.dropPct})</span>
                    )}
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-sm shadow-indigo-500/30"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Cohort Retention & Multi-Campus Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Trend Chart (7 cols) */}
        <Card variant="glass" className="lg:col-span-7 p-6 border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Longitudinal Student Retention Rate (5-Year Cohort)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Percentage of enrolled students continuing to subsequent grade.</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COHORT_RETENTION}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[94, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="retentionRate"
                  stroke="#6366f1"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                  name="Retention Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Multi-Campus Benchmark (5 cols) */}
        <Card variant="glass" className="lg:col-span-5 p-6 border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Multi-Campus Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comparative metrics across institutional branches.</p>
          </div>

          <div className="space-y-3">
            {CAMPUS_COMPARISON.map((c) => (
              <div
                key={c.campus}
                className="p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-2xs"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">{c.campus}</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">Total Enrolled:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.students}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Mean GPA:</span>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{c.gpa}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Fee Realization:</span>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">{c.feeCollection}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Teacher:Student:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.teacherRatio}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default KpiAnalyticsModule;
