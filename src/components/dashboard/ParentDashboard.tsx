import React from 'react';
import {
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookMarked,
  Bus,
  Award,
  ArrowRight,
  Phone,
  Clock,
  Download,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ParentDashboard: React.FC = () => {
  const { db, setActiveModule, showToast } = useSchool();
  const { currentUser } = useAuth();

  const student = db.students.find((s) => s.id === 'std-1') || db.students[0];
  const reportCard = db.reportCards.find((r) => r.studentId === student.id);
  const feeInvoice = db.feeInvoices.find((f) => f.studentId === student.id);
  const transport = db.studentTransport.find((t) => t.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Student Profile Card for Parent */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="purple" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                  Linked Ward Profile
                </Badge>
                <span className="text-xs text-purple-200/80">{student.house}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">{student.name}</h1>
              <p className="text-xs text-purple-100/90 mt-0.5">
                {student.classSection} • Roll #{student.rollNumber} • Admission: {student.admissionNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              onClick={() => setActiveModule('report_cards')}
            >
              <Award className="w-3.5 h-3.5 mr-1 text-purple-300" />
              Report Card
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-xs shadow-lg shadow-purple-500/30"
              onClick={() => setActiveModule('homework')}
            >
              Homework Tasks
            </Button>
          </div>
        </div>
      </div>

      {/* Ward Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <Card hoverable onClick={() => setActiveModule('attendance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">96.4%</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Present today at 08:45 AM</div>
          </div>
        </Card>

        {/* Academic Result */}
        <Card hoverable onClick={() => setActiveModule('report_cards')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mid-Term Result</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {reportCard?.overallGrade || 'A'} ({reportCard?.percentage || '88.8'}%)
            </div>
            <div className="text-xs text-slate-500 mt-1">Class Rank: #{reportCard?.rankInClass || 3} of 36</div>
          </div>
        </Card>

        {/* Fees */}
        <Card hoverable onClick={() => setActiveModule('fees')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Term 1 Fee</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Paid In Full</div>
            <div className="text-xs text-slate-500 mt-1">Receipt: RCP-2026-9041 (₹41,300)</div>
          </div>
        </Card>

        {/* Transport */}
        <Card hoverable onClick={() => setActiveModule('transport')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">School Bus</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">Route 04</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Boarded at Vasant Vihar</div>
          </div>
        </Card>
      </div>

      {/* Detail Widgets: Homework & Academic Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Pending Homework for Ravi"
            subtitle="Assignments requiring completion this week"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('homework')}>
                View Tasks <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.homework.map((hw) => (
              <div
                key={hw.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">{hw.subject}</span>
                  <Badge variant="warning" size="sm">Due {hw.dueDate}</Badge>
                </div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{hw.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{hw.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Latest Mid-Term Examination Scores"
            subtitle="Term 1 Mid-Term Examination 2025–26"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('report_cards')}>
                Official Slip <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-2.5">
            {reportCard?.subjects.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {sub.subjectName}
                  </span>
                  <span className="text-[10px] text-slate-400">{sub.remarks}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {sub.obtainedMarks} / {sub.maxMarks}
                  </span>
                  <Badge variant="primary" size="sm" className="ml-2">
                    {sub.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
