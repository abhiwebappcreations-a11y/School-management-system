import React, { useState } from 'react';
import { Award, Printer, Download, Search, CheckCircle2, GraduationCap } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const ReportCardsModule: React.FC = () => {
  const { db, showToast } = useSchool();
  const [selectedStudentId, setSelectedStudentId] = useState('std-1');

  const student = db.students.find((s) => s.id === selectedStudentId) || db.students[0];
  const report = db.reportCards.find((r) => r.studentId === student.id) || db.reportCards[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Digital Report Cards & Grade Transcripts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official academic transcripts with subject marks, attendance rate, teacher remarks, and principal seal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => showToast('PDF Export', `Report card for ${student.name} downloaded`, 'success')}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Report Card
          </Button>
        </div>
      </div>

      {/* Student Selector Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Select Student:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
          >
            {db.students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classSection} • Roll #{s.rollNumber})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Official Printable Report Card Document */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border-2 border-slate-900/20 dark:border-slate-700 rounded-3xl p-8 shadow-xl space-y-6 text-xs">
        {/* School Header & Emblems */}
        <div className="text-center border-b pb-6 space-y-1">
          <Badge variant="primary" size="md" className="mb-2">
            CENTRAL BOARD OF SECONDARY EDUCATION (CBSE)
          </Badge>
          <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {db.schoolConfig.schoolName}
          </h2>
          <p className="text-xs text-slate-500">{db.schoolConfig.address}, {db.schoolConfig.city} - {db.schoolConfig.pincode}</p>
          <p className="text-[11px] text-slate-400 font-mono">Affiliation No: {db.schoolConfig.affiliationNumber}</p>
          <div className="pt-2">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest text-sm bg-indigo-50 dark:bg-indigo-950/60 px-4 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              PROGRESS REPORT CARD — ACADEMIC YEAR {student.academicYear}
            </span>
          </div>
        </div>

        {/* Student Profile Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Student Name</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{student.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Class & Section</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{student.classSection}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Admission Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{student.admissionNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Roll Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">#{student.rollNumber}</span>
          </div>
        </div>

        {/* Marks Table */}
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
            <tr>
              <th className="p-3">Subject Name</th>
              <th className="p-3 text-center">Max Marks</th>
              <th className="p-3 text-center">Marks Obtained</th>
              <th className="p-3 text-center">Grade</th>
              <th className="p-3">Performance Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {report.subjects.map((sub, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                <td className="p-3 text-center text-slate-500 font-mono">{sub.maxMarks}</td>
                <td className="p-3 text-center font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  {sub.obtainedMarks}
                </td>
                <td className="p-3 text-center">
                  <Badge variant="primary">{sub.grade}</Badge>
                </td>
                <td className="p-3 text-slate-500 text-[11px]">{sub.remarks}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-bold">
            <tr>
              <td className="p-3 uppercase">Total Marks</td>
              <td className="p-3 text-center font-mono">{report.totalMaxMarks}</td>
              <td className="p-3 text-center font-mono font-black text-base text-indigo-600 dark:text-indigo-400">
                {report.totalObtainedMarks}
              </td>
              <td className="p-3 text-center">
                <Badge variant="success" size="md">
                  {report.overallGrade}
                </Badge>
              </td>
              <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                Overall: {report.percentage}% (Rank #{report.rankInClass})
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Remarks & Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Class Teacher Remarks
            </span>
            <p className="text-slate-700 dark:text-slate-300 italic text-xs leading-relaxed">
              "{report.teacherRemarks}"
            </p>
            <div className="mt-4 pt-2 border-t text-[10px] text-slate-500 flex justify-between">
              <span>Teacher: Rahul Kumar</span>
              <span className="font-script font-bold text-indigo-600">Rahul K.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Principal's Evaluation
            </span>
            <p className="text-slate-700 dark:text-slate-300 italic text-xs leading-relaxed">
              "{report.principalRemarks}"
            </p>
            <div className="mt-4 pt-2 border-t text-[10px] text-slate-500 flex justify-between">
              <span>Principal: Dr. Rajesh Sharma</span>
              <span className="font-script font-bold text-indigo-600">R. Sharma, Ph.D.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
