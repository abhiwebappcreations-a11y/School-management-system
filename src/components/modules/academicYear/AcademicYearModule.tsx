import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Plus,
  Users,
  ShieldAlert,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { AcademicYear, SchoolClass } from '../../../types/academic';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

type PromotionAction = 'promote' | 'detain' | 'tc' | 'graduate';

interface StudentPromotionDecision {
  studentId: string;
  studentName: string;
  rollNumber: string;
  currentClass: string;
  gpaPercent: number;
  attendancePercent: number;
  action: PromotionAction;
  notes: string;
}

export const AcademicYearModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'sessions' | 'wizard'>('sessions');

  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [sourceClass, setSourceClass] = useState('Class 7');
  const [sourceSection, setSourceSection] = useState('A');
  const [targetSession, setTargetSession] = useState('2026–27');
  const [targetClass, setTargetClass] = useState('Class 8');
  const [targetSection, setTargetSection] = useState('A');

  // Promotion decision roster
  const [decisions, setDecisions] = useState<StudentPromotionDecision[]>([]);

  // New Session Modal
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('2027–28');
  const [newStartDate, setNewStartDate] = useState('2027-04-01');
  const [newEndDate, setNewEndDate] = useState('2028-03-31');

  // Initialize wizard roster when reaching step 2
  const initWizardRoster = () => {
    const classSectionTag = `${sourceClass}${sourceSection}`;
    const matchingStudents = db.students.filter(
      (s) => s.classSection === classSectionTag || s.classSection.startsWith(sourceClass)
    );

    const initialDecisions: StudentPromotionDecision[] = (
      matchingStudents.length > 0 ? matchingStudents : db.students.slice(0, 4)
    ).map((s, idx) => ({
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.rollNumber,
      currentClass: s.classSection,
      gpaPercent: 82 + ((idx * 7) % 15),
      attendancePercent: 88 + ((idx * 4) % 10),
      action: 'promote',
      notes: 'Eligible for standard progression',
    }));

    setDecisions(initialDecisions);
    setWizardStep(2);
  };

  const handleActionChange = (studentId: string, action: PromotionAction) => {
    setDecisions((prev) =>
      prev.map((d) => (d.studentId === studentId ? { ...d, action } : d))
    );
  };

  const handleBulkPromote = () => {
    setDecisions((prev) =>
      prev.map((d) => ({
        ...d,
        action: d.gpaPercent >= 40 ? 'promote' : 'detain',
      }))
    );
    showToast('Batch Evaluated', 'All passing students marked for promotion.', 'info');
  };

  const executePromotion = () => {
    if (!canAccess('academic_year', 'edit')) {
      showToast('Security Denial', 'Your role lacks permission to execute student promotions.', 'error');
      return;
    }

    mutateDb((draft) => {
      decisions.forEach((dec) => {
        const student = draft.students.find((s) => s.id === dec.studentId);
        if (student) {
          if (dec.action === 'promote') {
            student.classSection = `${targetClass}${targetSection}`;
            student.status = 'promoted';
            student.academicYear = targetSession;
          } else if (dec.action === 'detain') {
            student.status = 'detained';
            student.academicYear = targetSession;
          } else if (dec.action === 'tc') {
            student.status = 'transferred';
          } else if (dec.action === 'graduate') {
            student.status = 'graduated';
          }
        }
      });
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(
      'Promotion Completed!',
      `Successfully processed progression for ${decisions.length} students into ${targetClass}${targetSection}.`,
      'success'
    );
    setWizardStep(1);
    setActiveTab('sessions');
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: AcademicYear = {
      id: `ay-${Date.now()}`,
      name: newSessionName.trim(),
      startDate: newStartDate,
      endDate: newEndDate,
      isCurrent: false,
      status: 'upcoming',
    };

    mutateDb((draft) => {
      draft.academicYears.push(newSession);
    });

    setIsNewSessionModalOpen(false);
    showToast('Session Configured', `Academic session "${newSession.name}" added.`, 'success');
  };

  const handleSetCurrentSession = (sessionId: string) => {
    mutateDb((draft) => {
      draft.academicYears.forEach((ay) => {
        ay.isCurrent = ay.id === sessionId;
      });
    });
    showToast('Active Session Updated', 'Default system academic session switched.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Academic Sessions & Student Promotion Wizard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-year institutional sessions, rollover cohorts, and execute batch student progressions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'sessions' ? 'primary' : 'outline'}
            size="sm"
            icon={Layers}
            onClick={() => setActiveTab('sessions')}
          >
            Academic Sessions
          </Button>
          <Button
            variant={activeTab === 'wizard' ? 'primary' : 'outline'}
            size="sm"
            icon={GraduationCap}
            onClick={() => setActiveTab('wizard')}
          >
            Promotion Wizard
          </Button>
        </div>
      </div>

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Top Session Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-indigo-600">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Academic Year</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {db.academicYears.find((ay) => ay.isCurrent)?.name || '2025–26'}
                </span>
                <Badge variant="success">Current Term</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">April 2025 – March 2026</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-emerald-600">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Cohort</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {db.students.length} Students
                </span>
                <Badge variant="info">Active</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 12 classes & 2 campuses</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-600">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Rollover</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">2026–27</span>
                <Badge variant="warning">Planning</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Promotion wizard ready for execution</p>
            </Card>
          </div>

          {/* Sessions List Card */}
          <Card className="overflow-hidden">
            <CardHeader
              title="Registered Institutional Academic Sessions"
              subtitle="Configure CBSE academic calendars, terms, and lock past historical sessions."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => setIsNewSessionModalOpen(true)}
                >
                  Create New Session
                </Button>
              }
            />

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {db.academicYears.map((ay) => (
                <div
                  key={ay.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        ay.isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {ay.name.slice(2, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Session {ay.name}
                        </h4>
                        {ay.isCurrent && <Badge variant="success">Active Session</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Duration: {ay.startDate} to {ay.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {!ay.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetCurrentSession(ay.id)}
                      >
                        Set as Active
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      icon={GraduationCap}
                      onClick={() => {
                        setActiveTab('wizard');
                        setTargetSession(ay.name);
                      }}
                    >
                      Run Promotion
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'wizard' && (
        <Card className="p-4 sm:p-6 space-y-6">
          {/* Wizard Stepper Banner */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                STEP {wizardStep} OF 4
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {wizardStep === 1 && '1. Configure Class Progression Parameters'}
                {wizardStep === 2 && '2. Evaluate Student Progression Roster'}
                {wizardStep === 3 && '3. Fee & Roll Number Assignment'}
                {wizardStep === 4 && '4. Review & Execute Promotion'}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    wizardStep === step
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/40'
                      : wizardStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {wizardStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 */}
          {wizardStep === 1 && (
            <div className="space-y-5 max-w-2xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select the graduating source cohort and designate the target class for the upcoming academic session. Historical academic and fee records will be permanently preserved.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Source Class (Current Year)
                  </label>
                  <select
                    value={sourceClass}
                    onChange={(e) => setSourceClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  >
                    {db.classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Source Section
                  </label>
                  <select
                    value={sourceSection}
                    onChange={(e) => setSourceSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Academic Session
                  </label>
                  <select
                    value={targetSession}
                    onChange={(e) => setTargetSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="2026–27">2026–27 (Upcoming)</option>
                    <option value="2027–28">2027–28</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Class (Next Year)
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  >
                    {db.classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                    <option value="Class 11">Class 11 (Senior Secondary)</option>
                    <option value="Class 12">Class 12 (Board Graduating)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Section
                  </label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" size="md" icon={ChevronRight} onClick={initWizardRoster}>
                  Proceed to Student Evaluation
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review student performance metrics. Configure individual progression decisions or apply batch rules.
                </p>

                <Button variant="outline" size="sm" icon={Sparkles} onClick={handleBulkPromote}>
                  Auto-Promote Passing Students (GPA ≥ 40%)
                </Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Roll & Student</th>
                      <th className="p-3">Current Class</th>
                      <th className="p-3">Exam Score</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Progression Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {decisions.map((dec) => (
                      <tr key={dec.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <span className="font-mono text-slate-400 mr-2">#{dec.rollNumber}</span>
                          {dec.studentName}
                        </td>
                        <td className="p-3 text-slate-500">{dec.currentClass}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold ${
                              dec.gpaPercent >= 75
                                ? 'text-emerald-600'
                                : dec.gpaPercent >= 40
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {dec.gpaPercent}%
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-600 dark:text-slate-400">
                          {dec.attendancePercent}%
                        </td>
                        <td className="p-3">
                          <select
                            value={dec.action}
                            onChange={(e) =>
                              handleActionChange(dec.studentId, e.target.value as PromotionAction)
                            }
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="promote">Promote to {targetClass}</option>
                            <option value="detain">Detain in {sourceClass}</option>
                            <option value="tc">Transfer Certificate (Exit)</option>
                            <option value="graduate">Graduate (Alumni)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setWizardStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={ChevronRight}
                  onClick={() => setWizardStep(3)}
                >
                  Next: Fee & Roster Mapping
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {wizardStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define the rollover parameters for student roll numbers and assign the standard fee schedule for Session {targetSession}.
              </p>

              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Sequential Roll Number Generation
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Re-order roll numbers alphabetically by student first name
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Automatic Fee Invoice Generation
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Generate Term 1 Tuition Invoice (₹16,500) for {targetClass}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Parent Automated Notification
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Send WhatsApp/SMS progression notice to verified parents
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setWizardStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={ChevronRight}
                  onClick={() => setWizardStep(4)}
                >
                  Next: Final Verification
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {wizardStep === 4 && (
            <div className="space-y-5 max-w-xl">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-bold">Permanent Institutional Record Rollover</p>
                  <p className="mt-0.5">
                    Executing this action will update the active enrolled class for {decisions.length} students into {targetClass}{targetSection} for Session {targetSession}.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Session:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{targetSession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cohort Movement:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {sourceClass}{sourceSection} → {targetClass}{targetSection}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Students to Promote:</span>
                  <span className="font-bold text-emerald-600">
                    {decisions.filter((d) => d.action === 'promote').length} Students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Students Detained / Withheld:</span>
                  <span className="font-bold text-rose-600">
                    {decisions.filter((d) => d.action === 'detain').length} Students
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setWizardStep(3)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={Sparkles}
                  onClick={executePromotion}
                >
                  Execute Year-End Promotion & Rollover
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* New Academic Session Modal */}
      {isNewSessionModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewSessionModalOpen(false)}
          title="Create New Academic Session"
          size="md"
        >
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Session Title (e.g. 2027–28)
              </label>
              <input
                type="text"
                required
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewSessionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={Calendar}>
                Save Session
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
