import React from 'react';
import {
  CalendarCheck,
  BookMarked,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const TeacherDashboard: React.FC = () => {
  const { db, setActiveModule, showToast } = useSchool();
  const { currentUser, effectiveDevice } = useAuth();

  const todayClasses = db.timetables.filter((t) => t.dayOfWeek === 'Monday');
  const homeworkList = db.homework;

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                Class Teacher Portal (Class 8A)
              </Badge>
              <span className="text-xs text-emerald-200/80">Active Device: {effectiveDevice.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, Rahul Kumar!
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              You have 3 periods scheduled today. Today's attendance for Class 8A was logged successfully at 08:45 AM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-emerald-500 hover:bg-emerald-600 text-xs shadow-lg shadow-emerald-500/30"
              icon={CalendarCheck}
              onClick={() => setActiveModule('attendance')}
            >
              Mark / Review Attendance
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              icon={BookMarked}
              onClick={() => setActiveModule('homework')}
            >
              Assign Homework
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => setActiveModule('attendance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class 8A Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">92% Present</div>
            <div className="text-xs text-slate-500 mt-1">34 Present • 1 Late • 1 Absent</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('timetable')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Periods</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">3 Lectures</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">Next: Period 3 (10:15 AM)</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('homework')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Homework Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">2 Active Tasks</div>
            <div className="text-xs text-slate-500 mt-1">28/36 Submissions received</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('marks')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Marks Entry</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">Completed</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Approved by Principal</div>
          </div>
        </Card>
      </div>

      {/* Schedule & Student Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Monday Class Schedule"
            subtitle="Your assigned periods and classrooms today"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('timetable')}>
                Full Timetable <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {todayClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center font-bold text-xs">
                    <span>P{item.periodNumber}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.subject}</h4>
                    <p className="text-[11px] text-slate-500">
                      {item.classSection} • {item.room} • {item.teacherName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.startTime}
                  </span>
                  <span className="text-[10px] text-slate-400 block">to {item.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Student Attention Alerts */}
        <Card>
          <CardHeader
            title="Student Alerts (Class 8A)"
            subtitle="Needs follow-up or parent notification"
          />
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4" /> Medical Absence Today
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Ananya Gupta</strong> reported sick leave by parent Sunil Gupta.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-xs mb-1">
                <Users className="w-4 h-4" /> Parent Meeting Request
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Vikram Mehta (father of <strong>Ravi Kumar</strong>) requested brief discussion regarding Science lab.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4" /> Olympiad Qualifiers
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Ravi Kumar & Priya Sharma cleared Math Olympiad Zone 1 test.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
