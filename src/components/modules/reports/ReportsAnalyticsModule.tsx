import React from 'react';
import { BarChart3, TrendingUp, Users, IndianRupee, Award, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const ReportsAnalyticsModule: React.FC = () => {
  const { showToast } = useSchool();

  const enrollmentData = [
    { year: '2022', count: 680 },
    { year: '2023', count: 750 },
    { year: '2024', count: 830 },
    { year: '2025', count: 910 },
    { year: '2026', count: 1040 },
  ];

  const genderDistribution = [
    { name: 'Boys', value: 580, color: '#4f46e5' },
    { name: 'Girls', value: 460, color: '#ec4899' },
  ];

  const gradeDistribution = [
    { grade: 'A+ (90-100)', count: 32 },
    { grade: 'A (80-89)', count: 48 },
    { grade: 'B+ (70-79)', count: 26 },
    { grade: 'B (60-69)', count: 18 },
    { grade: 'C & Below', count: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Executive Reports & Institutional Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student demographics, enrollment growth curves, grade dispersions, and financial health
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => showToast('Report Pack', 'Full institutional audit pack exported to PDF', 'success')}
        >
          Export Intelligence Pack
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Growth */}
        <Card>
          <CardHeader
            title="5-Year Enrollment Trajectory"
            subtitle="Steady admissions acceleration across both campuses"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader
            title="Mid-Term Grade Distribution (Cohort 8 to 10)"
            subtitle="Percentage of students achieving academic benchmark tiers"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
