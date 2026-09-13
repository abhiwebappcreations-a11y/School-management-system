import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  UserCheck,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  PhoneCall,
  Mail,
  Clock,
  ArrowUpRight,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { StudentRiskProfile, RiskLevel } from '../../../types/enterprise';
import { Modal } from '../../common/Modal';

export const StudentRiskModule: React.FC = () => {
  const { state, scheduleRiskCounseling, resolveRisk } = useEnterprise();
  const { showToast } = useSchool();
  const { currentUser } = useAuth();

  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRiskProfile | null>(null);

  // Intervention modal state
  const [counselorName, setCounselorName] = useState('Dr. Meenakshi Sundaram');
  const [meetingDate, setMeetingDate] = useState('2026-03-15');
  const [interventionNote, setInterventionNote] = useState('');

  const filteredProfiles = state.riskProfiles.filter((p) => {
    const matchesLevel = filterLevel === 'all' || p.riskLevel === filterLevel;
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.classSection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryRiskFactor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const criticalCount = state.riskProfiles.filter((p) => p.riskLevel === 'critical').length;
  const highCount = state.riskProfiles.filter((p) => p.riskLevel === 'high').length;
  const mediumCount = state.riskProfiles.filter((p) => p.riskLevel === 'medium').length;
  const lowCount = state.riskProfiles.filter((p) => p.riskLevel === 'low').length;

  const handleOpenScheduleModal = (profile: StudentRiskProfile) => {
    setSelectedStudent(profile);
    setInterventionNote(
      `Scheduled one-on-one diagnostic session to address ${profile.primaryRiskFactor.toLowerCase()}.`
    );
  };

  const handleSaveIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    scheduleRiskCounseling(selectedStudent.studentId, counselorName, interventionNote);
    showToast(
      'Counselor Intervention Scheduled',
      `Intervention booked with ${counselorName} for ${selectedStudent.studentName} on ${meetingDate}.`,
      'success'
    );
    setSelectedStudent(null);
  };

  const handleResolve = (profile: StudentRiskProfile) => {
    resolveRisk(profile.studentId);
    showToast(
      'Risk Mitigated',
      `${profile.studentName} flagged as stabilized. Risk score reduced.`,
      'success'
    );
  };

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Critical ({score}/100)
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            High Risk ({score}/100)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300">
            Moderate ({score}/100)
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Low Risk ({score}/100)
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Student Risk Prediction Engine
              <span className="text-xs px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold rounded-full border border-rose-200 dark:border-rose-900">
                AI Early Warning
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Predictive multi-factor dropout, failure and disengagement detection with automated counselor interventions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              showToast(
                'Full Risk Audit Exported',
                'Comprehensive CSV report of all at-risk students downloaded for Executive Review.',
                'info'
              )
            }
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-4 h-4" />
            Export Risk Dossier
          </button>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div
          onClick={() => setFilterLevel('critical')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterLevel === 'critical'
              ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Critical Priority</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{criticalCount} Students</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Immediate intervention required</div>
        </div>

        <div
          onClick={() => setFilterLevel('high')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterLevel === 'high'
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{highCount} Students</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Monitoring active</div>
        </div>

        <div
          onClick={() => setFilterLevel('medium')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterLevel === 'medium'
              ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950/40 dark:border-yellow-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-yellow-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Moderate Risk</span>
            <Sparkles className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{mediumCount} Students</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Requires academic support</div>
        </div>

        <div
          onClick={() => setFilterLevel('low')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterLevel === 'low'
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Stable / Low Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lowCount} Students</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Standard progress</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, class or risk factor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Level:
          </span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Moderate Only</option>
            <option value="low">Low Only</option>
          </select>
        </div>
      </div>

      {/* Risk Profiles List */}
      <div className="space-y-4">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.studentId}
            className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-sm ${
              profile.riskLevel === 'critical'
                ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Student Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-base">
                  {profile.studentName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {profile.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {profile.rollNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {profile.classSection}
                    </span>
                    {getRiskBadge(profile.riskLevel, profile.riskScore)}
                  </div>
                  <div className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{profile.primaryRiskFactor}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {profile.status !== 'resolved' ? (
                  <>
                    <button
                      onClick={() => handleOpenScheduleModal(profile)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      {profile.counselorAssigned ? 'Update Intervention' : 'Assign Counselor'}
                    </button>

                    <button
                      onClick={() => handleResolve(profile)}
                      className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Stabilized
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Intervention Resolved
                  </span>
                )}
              </div>
            </div>

            {/* Indicator Metric Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400">Attendance Rate</span>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    profile.indicators.attendanceRate < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {profile.indicators.attendanceRate}%
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400">Academic GPA %</span>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    profile.indicators.academicGpaPercent < 50 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {profile.indicators.academicGpaPercent}%
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400">Pending Fee Arrears</span>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    profile.indicators.pendingFeeBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'
                  }`}
                >
                  ₹{profile.indicators.pendingFeeBalance.toLocaleString()}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400">Missed Homework</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {profile.indicators.missedAssignmentsCount} Tasks
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400">Counselor Assigned</span>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                  {profile.counselorAssigned || 'None'}
                </div>
              </div>
            </div>

            {/* Recommended Interventions */}
            <div className="mt-3 text-xs bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Action Plan:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                {profile.recommendedInterventions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Intervention Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Schedule Counseling Intervention: ${selectedStudent.studentName}`}
          size="md"
        >
          <form onSubmit={handleSaveIntervention} className="space-y-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
              <div className="font-bold">Student: {selectedStudent.studentName} ({selectedStudent.rollNumber})</div>
              <div>Trigger Factor: {selectedStudent.primaryRiskFactor}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assign Counselor / Faculty Mentor
              </label>
              <select
                value={counselorName}
                onChange={(e) => setCounselorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              >
                <option value="Dr. Meenakshi Sundaram">Dr. Meenakshi Sundaram (Senior Student Psychologist)</option>
                <option value="Prof. S. Ranganathan">Prof. S. Ranganathan (Academic Remedial Lead)</option>
                <option value="Rahul Kumar">Rahul Kumar (Class Teacher)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Session Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Intervention Strategy / Note
              </label>
              <textarea
                rows={3}
                value={interventionNote}
                onChange={(e) => setInterventionNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                placeholder="Specific guidance goals and parental coordination protocol..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Confirm & Dispatch Alert
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default StudentRiskModule;
