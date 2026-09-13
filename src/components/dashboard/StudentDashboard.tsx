import React from 'react';
import {
  Clock,
  BookMarked,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const StudentDashboard: React.FC = () => {
  const { db, setActiveModule, showToast } = useSchool();

  const student = db.students.find((s) => s.id === 'std-1') || db.students[0];
  const myPeriods = db.timetables.filter((t) => t.dayOfWeek === 'Monday');
  const myBooks = db.bookTransactions.filter((b) => b.borrowerId === student.id);

  return (
    <div className="space-y-6">
      {/* Student Greeting */}
      <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info" className="bg-sky-500/20 text-sky-200 border-sky-400/30">
                Class 8A • Student Space
              </Badge>
              <span className="text-xs text-sky-200/80">House: {student.house}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {student.name}!
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-xl">
              You are marked Present today. 2 homework assignments are due this week, and you have 2 books issued from the library.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              className="bg-sky-500 hover:bg-sky-600 text-xs shadow-lg shadow-sky-500/30 font-bold"
              icon={Upload}
              onClick={() => setActiveModule('homework')}
            >
              Submit Homework
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              icon={Award}
              onClick={() => setActiveModule('report_cards')}
            >
              View Report Card
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => setActiveModule('attendance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">96.4%</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Eligible for all exams</div>
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
            <div className="text-2xl font-black text-slate-900 dark:text-white">2 Tasks</div>
            <div className="text-xs text-slate-500 mt-1">Math due Sep 15 • Science due Sep 16</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('report_cards')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mid-Term Grade</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">Grade A</div>
            <div className="text-xs text-slate-500 mt-1">88.8% Overall (Rank #3)</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Issued Books</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">2 Books</div>
            <div className="text-xs text-slate-500 mt-1">No overdue fines</div>
          </div>
        </Card>
      </div>

      {/* Schedule & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <Card>
          <CardHeader
            title="Today's Timetable"
            subtitle="Monday classes and room locations"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('timetable')}>
                Weekly View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {myPeriods.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                    {p.periodNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.subject}</h4>
                    <p className="text-[11px] text-slate-500">{p.room} • {p.teacherName}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {p.startTime}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Issued Library Books */}
        <Card>
          <CardHeader
            title="My Library Books"
            subtitle="Issued against your library card"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('library')}>
                Catalogue <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {myBooks.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{b.bookTitle}</h4>
                  <Badge variant="primary" size="sm">Issued</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span>Issued: {b.issueDate}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Due: {b.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
