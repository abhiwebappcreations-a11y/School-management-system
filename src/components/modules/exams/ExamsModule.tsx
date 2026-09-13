import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Plus,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { ExamWorkflowStatus } from '../../../types/exam';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const ExamsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, canAccess } = useAuth();

  const [activeTab, setActiveTab] = useState<'schedule' | 'marks' | 'grading'>('marks');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [workflowState, setWorkflowState] = useState<ExamWorkflowStatus>('principal_approved');

  const exam = db.exams[0];
  const examSubjects = db.examSubjects;

  const advanceWorkflow = (nextStage: ExamWorkflowStatus) => {
    setWorkflowState(nextStage);
    mutateDb((draft) => {
      draft.exams[0].workflowStatus = nextStage;
      if (nextStage === 'published') {
        draft.exams[0].isPublished = true;
      }
    });

    if (nextStage === 'published') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast('Results Published!', 'Term 1 Mid-Term Report Cards are now available to all students & parents.', 'success');
    } else {
      showToast('Workflow Updated', `Examination status transitioned to ${nextStage.replace('_', ' ').toUpperCase()}`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Examinations, Marks Entry & Approval Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-stage moderation pipeline: Teacher Entry → Subject Coord Review → Principal Approval → Published
          </p>
        </div>

        <div className="flex items-center gap-2">
          {workflowState === 'teacher_entry' && (
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => advanceWorkflow('coordinator_review')}
            >
              Submit for Coord Review
            </Button>
          )}

          {workflowState === 'coordinator_review' && canAccess('examinations', 'approve') && (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => advanceWorkflow('principal_approved')}
            >
              Coordinator Endorsement
            </Button>
          )}

          {workflowState === 'principal_approved' && (currentUser.role === 'principal' || currentUser.role === 'super_admin') && (
            <Button
              variant="success"
              size="sm"
              icon={Sparkles}
              onClick={() => advanceWorkflow('published')}
            >
              Publish Official Results
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Progression Stepper */}
      <Card className="p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Exam Moderation & Approval Pipeline
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {[
            { id: 'teacher_entry', label: '1. Teacher Marks Entry', desc: 'Rahul Kumar (Math 8A)' },
            { id: 'coordinator_review', label: '2. Coord Moderation', desc: 'Science & Math Dept' },
            { id: 'principal_approved', label: '3. Principal Approval', desc: 'Dr. Rajesh Sharma' },
            { id: 'published', label: '4. Results Published', desc: 'Live on Student Portal' },
          ].map((step, idx) => {
            const isCompleted =
              step.id === workflowState ||
              (workflowState === 'published') ||
              (workflowState === 'principal_approved' && idx < 3) ||
              (workflowState === 'coordinator_review' && idx < 2);

            const isCurrent = step.id === workflowState;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}>
                    {step.label}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <span className="text-[11px] text-slate-400 block">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'marks', label: 'Student Marks Roster', icon: Award },
            { id: 'schedule', label: 'Examination Timetable', icon: Calendar },
            { id: 'grading', label: 'Grading Scale Rules', icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Marks Tab */}
      {activeTab === 'marks' && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Class 8A — Mid-Term Evaluation Records
              </h3>
              <p className="text-xs text-slate-500">Max Marks: 80 • Passing Marks: 27</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English Literature">English Literature</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Marks (Out of 80)</th>
                  <th className="py-3 px-4">Calculated Grade</th>
                  <th className="py-3 px-4">Evaluator Remarks</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {db.students.map((std, idx) => {
                  const score = idx === 0 ? 74 : idx === 1 ? 68 : idx === 2 ? 61 : 71;
                  const grade = score >= 72 ? 'A+' : score >= 64 ? 'A' : 'B+';

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold">{std.rollNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {std.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                          {score}
                        </span>
                        <span className="text-slate-400 text-[10px]"> / 80</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="primary">{grade}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {idx === 0 ? 'Outstanding algebraic clarity' : 'Good conceptual grasp'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success">APPROVED</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Timetable Tab */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {examSubjects.map((es) => (
            <Card key={es.id} className="p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{es.classSection}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {es.subjectName}
              </h3>
              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Date: {es.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{es.startTime} to {es.endTime}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Venue: {es.room}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{es.maxMarks} Marks</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Grading Scale Rules */}
      {activeTab === 'grading' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Score Range (%)</th>
                <th className="py-3 px-4">Grade Point</th>
                <th className="py-3 px-4">Performance Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.gradingRules.map((rule) => (
                <tr key={rule.grade}>
                  <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400 text-sm">
                    {rule.grade}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {rule.minScore}% – {rule.maxScore}%
                  </td>
                  <td className="py-3 px-4 font-bold">{rule.gradePoint} / 10</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
