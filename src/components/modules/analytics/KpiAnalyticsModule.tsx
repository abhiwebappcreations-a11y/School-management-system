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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Institutional KPI Analytics Center
              <span className="text-xs px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
                Executive Intelligence
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Admission conversion funnels, longitudinal student retention cohorts, and multi-campus comparative benchmarking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              showToast(
                'Comprehensive KPI Deck Generated',
                'Exported multi-dimensional institutional analytical brief with charts.',
                'success'
              )
            }
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Executive KPI Deck
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Funnel Yield (Offer to Join)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">92.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4.2% YoY growth</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Annual Retention Rate</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">98.5%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Top quartile in region</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Faculty Approval Index</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4.8 / 5.0</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">94% Parent Satisfaction</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Fee Collection Realization</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">98.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">₹2.4M overdue recovering</div>
        </div>
      </div>

      {/* Admission Conversion Funnel Visualization */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Admissions Conversion Funnel (Academic Session 2026-27)
            </h3>
            <p className="text-xs text-slate-500">
              Progression metrics from prospective student inquiry to final tuition matriculation.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
            Overall Conversion: 31.4%
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {FUNNEL_DATA.map((step, idx) => {
            const widthPct = Math.max(25, Math.round((step.count / FUNNEL_DATA[0].count) * 100));
            return (
              <div key={step.stage} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {step.stage}
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    <strong>{step.count.toLocaleString()}</strong> candidates
                    {step.dropPct !== '0%' && (
                      <span className="text-rose-500 font-normal ml-2">({step.dropPct})</span>
                    )}
                  </span>
                </div>

                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Retention & Multi-Campus Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Trend Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Longitudinal Student Retention Rate (5-Year Cohort)
            </h3>
            <p className="text-xs text-slate-500">Percentage of enrolled students continuing to subsequent grade.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COHORT_RETENTION}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[94, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="retentionRate"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#4f46e5' }}
                  name="Retention Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Campus Benchmark (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Multi-Campus Comparison
            </h3>
            <p className="text-xs text-slate-500">Comparative metrics across institutional branches.</p>
          </div>

          <div className="space-y-3">
            {CAMPUS_COMPARISON.map((c) => (
              <div
                key={c.campus}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">{c.campus}</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400">Total Enrolled:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.students}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Mean GPA:</span>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{c.gpa}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Fee Realization:</span>
                    <div className="font-semibold text-emerald-600">{c.feeCollection}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Teacher:Student:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.teacherRatio}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default KpiAnalyticsModule;
