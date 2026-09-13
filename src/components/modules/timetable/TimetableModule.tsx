import React, { useState } from 'react';
import { Clock, Calendar, UserCheck, Plus, RefreshCw, BookOpen, Sparkles } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import confetti from 'canvas-confetti';
import { TimetablePeriod } from '../../../types/academic';

export const TimetableModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const [selectedClass, setSelectedClass] = useState('Class 8A');

  const periods = db.timetables.filter((t) => t.classSection === selectedClass);

  const handleGenerateClassTimetable = () => {
    const defaultPeriods: TimetablePeriod[] = [
      { id: `tt-${Date.now()}-1`, classSection: selectedClass, dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: 'Core Subject 1', teacherId: 'usr-teacher', teacherName: 'Assigned Faculty', room: 'Room 201' },
      { id: `tt-${Date.now()}-2`, classSection: selectedClass, dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subject: 'Core Subject 2', teacherId: 'usr-teacher-2', teacherName: 'Assigned Faculty', room: 'Room 201' },
      { id: `tt-${Date.now()}-3`, classSection: selectedClass, dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:15 AM', endTime: '11:00 AM', subject: 'Languages & Literacy', teacherId: 'usr-teacher-3', teacherName: 'Assigned Faculty', room: 'Room 201' },
      { id: `tt-${Date.now()}-4`, classSection: selectedClass, dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:00 AM', endTime: '11:45 AM', subject: 'Activity / Practical', teacherId: 'usr-teacher-4', teacherName: 'Assigned Faculty', room: 'Activity Hall' },
      { id: `tt-${Date.now()}-5`, classSection: selectedClass, dayOfWeek: 'Monday', periodNumber: 5, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Co-Curricular / Games', teacherId: 'usr-teacher-5', teacherName: 'Physical Trainer', room: 'Grounds' },
    ];

    mutateDb((draft) => {
      draft.timetables.push(...defaultPeriods);
    });

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    showToast('Timetable Generated', `Standard period schedule applied for ${selectedClass}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Class Timetable & Period Allocation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly periods matrix, classroom allocations, and teacher substitution assignments across Nursery to Class 10
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={() => showToast('Substitution Manager', 'All substituted periods reconciled across active cohorts', 'info')}
        >
          Assign Substitution
        </Button>
      </div>

      {/* Class Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Class Cohort:
          </label>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {db.sections.map((sec) => (
                <option key={sec.id} value={sec.fullName}>
                  {sec.fullName} (Teacher: {sec.classTeacherName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Period Matrix — {selectedClass}
          </h3>
          <Badge variant="primary">{periods.length} Periods Scheduled</Badge>
        </div>

        {periods.length > 0 ? (
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs">
            {periods.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center font-black">
                    <span>P{p.periodNumber}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.subject}</h4>
                    <p className="text-[11px] text-slate-500">
                      Faculty: <strong>{p.teacherName}</strong> • {p.room}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                    {p.startTime} – {p.endTime}
                  </span>
                  <span className="text-[10px] text-slate-400">Regular Lecture</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Period Schedule Set for {selectedClass}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You can instantly apply the institutional standard 5-period daily routine for this cohort.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={handleGenerateClassTimetable}
            >
              Generate Routine for {selectedClass}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
