import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Smartphone,
  Laptop,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { StudentAttendanceStatus } from '../../../types/attendance';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const AttendanceModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, effectiveDevice, canAccess } = useAuth();

  const [selectedClass, setSelectedClass] = useState('Class 8A');
  const [selectedDate, setSelectedDate] = useState('2026-09-13');
  const [attendanceMode, setAttendanceMode] = useState<'students' | 'staff'>('students');

  // Filter students for the selected class
  const classStudents = db.students.filter((s) => s.classSection === selectedClass);

  // Status getter
  const getStatus = (studentId: string): StudentAttendanceStatus => {
    const rec = db.attendance.find((a) => a.studentId === studentId && a.date === selectedDate);
    return rec ? rec.status : 'present';
  };

  const handleUpdateStatus = (studentId: string, newStatus: StudentAttendanceStatus) => {
    if (!canAccess('attendance', 'create')) {
      showToast('Permission Denied', 'Your role does not possess attendance marking rights', 'error');
      return;
    }

    const std = db.students.find((s) => s.id === studentId);
    if (!std) return;

    mutateDb((draft) => {
      const idx = draft.attendance.findIndex((a) => a.studentId === studentId && a.date === selectedDate);
      if (idx >= 0) {
        draft.attendance[idx].status = newStatus;
        draft.attendance[idx].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        draft.attendance[idx].device = effectiveDevice;
        draft.attendance[idx].markedByTeacherName = currentUser.name;
      } else {
        draft.attendance.push({
          id: `att-${Date.now()}-${studentId}`,
          date: selectedDate,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          studentId: studentId,
          studentName: std.name,
          rollNumber: std.rollNumber,
          classSection: selectedClass,
          status: newStatus,
          markedByTeacherId: currentUser.id,
          markedByTeacherName: currentUser.name,
          device: effectiveDevice,
          academicYear: '2025–26',
        });
      }
    });

    db.schoolConfig.schoolName = db.schoolConfig.schoolName; // trigger update
  };

  const handleMarkAllPresent = () => {
    if (!canAccess('attendance', 'create')) {
      showToast('Permission Denied', 'Unauthorized to mark attendance', 'error');
      return;
    }

    classStudents.forEach((std) => {
      handleUpdateStatus(std.id, 'present');
    });

    showToast('Batch Attendance Saved', `All ${classStudents.length} students in ${selectedClass} marked Present via ${effectiveDevice}`, 'success');
  };

  // Metrics
  const totalInClass = classStudents.length;
  const presentCount = classStudents.filter((s) => getStatus(s.id) === 'present').length;
  const absentCount = classStudents.filter((s) => getStatus(s.id) === 'absent').length;
  const lateCount = classStudents.filter((s) => getStatus(s.id) === 'late').length;
  const presentPercent = Math.round((presentCount / (totalInClass || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Attendance Management Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time biometric & teacher-logged attendance with device tracking ({effectiveDevice.toUpperCase()} Mode)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setAttendanceMode('students')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                attendanceMode === 'students'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setAttendanceMode('staff')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                attendanceMode === 'staff'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Faculty & Staff
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={handleMarkAllPresent}>
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Control Strip & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Class & Date Controls */}
        <Card className="lg:col-span-2 p-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Class & Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              >
                {db.sections.map((sec) => (
                  <option key={sec.id} value={sec.fullName}>
                    {sec.fullName} ({sec.classTeacherName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>
        </Card>

        {/* Live Attendance Metric */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase">Present Rate</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{presentPercent}%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{presentCount} of {totalInClass} present</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        {/* Device & Teacher Meta */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase">Capture Context</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-0.5 capitalize">
              {effectiveDevice === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
              {effectiveDevice} Terminal
            </span>
          </div>
          <Badge variant="primary">LIVE</Badge>
        </Card>
      </div>

      {/* Student List with Status Buttons */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedClass} Student Attendance Sheet ({selectedDate})
            </h3>
            <p className="text-xs text-slate-500">Tap status pills to adjust attendance state</p>
          </div>
        </div>

        <div className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs">
          {classStudents.map((std) => {
            const currentStatus = getStatus(std.id);

            return (
              <div
                key={std.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {std.rollNumber}
                  </span>
                  <img
                    src={std.photoUrl}
                    alt={std.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{std.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Admission #{std.admissionNumber} • Blood {std.bloodGroup}
                    </p>
                  </div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {[
                    { status: 'present' as StudentAttendanceStatus, label: 'Present', color: 'emerald' },
                    { status: 'late' as StudentAttendanceStatus, label: 'Late', color: 'amber' },
                    { status: 'absent' as StudentAttendanceStatus, label: 'Absent', color: 'rose' },
                    { status: 'half_day' as StudentAttendanceStatus, label: 'Half Day', color: 'purple' },
                    { status: 'excused' as StudentAttendanceStatus, label: 'Excused', color: 'sky' },
                  ].map((item) => {
                    const isSelected = currentStatus === item.status;
                    return (
                      <button
                        key={item.status}
                        onClick={() => handleUpdateStatus(std.id, item.status)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                          isSelected
                            ? item.color === 'emerald'
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                              : item.color === 'rose'
                              ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                              : item.color === 'amber'
                              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                              : 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
