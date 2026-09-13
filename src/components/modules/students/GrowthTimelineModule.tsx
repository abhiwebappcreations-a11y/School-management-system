import React, { useState } from 'react';
import {
  Clock,
  Award,
  BookOpen,
  Trophy,
  CheckCircle2,
  Plus,
  Filter,
  User,
  Printer,
  Sparkles,
  Calendar,
  ShieldCheck,
  Medal,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { StudentGrowthMilestone } from '../../../types/enterprise';
import { Modal } from '../../common/Modal';

export const GrowthTimelineModule: React.FC = () => {
  const { state, addMilestone } = useEnterprise();
  const { db, showToast } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form state for new milestone
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudentGrowthMilestone['category']>('award');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [badgeEarned, setBadgeEarned] = useState('');
  const [verifierName, setVerifierName] = useState('Principal Dr. Rajesh Sharma');

  const selectedStudent = db.students.find((s) => s.id === selectedStudentId) || db.students[0];

  const milestones = state.growthMilestones
    .filter((m) => m.studentId === selectedStudentId)
    .filter((m) => (selectedCategory === 'all' ? true : m.category === selectedCategory))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMilestone({
      studentId: selectedStudentId,
      academicYear,
      date,
      category,
      title,
      description,
      gradeScore: gradeScore || undefined,
      badgeEarned: badgeEarned || undefined,
      verifierName,
    });

    showToast(
      'Growth Milestone Recorded',
      `"${title}" officially logged to ${selectedStudent?.name}'s permanent school dossier.`,
      'success'
    );

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setGradeScore('');
    setBadgeEarned('');
  };

  const handlePrintDossier = () => {
    showToast(
      'Generating Student Dossier',
      `Assembling ${selectedStudent?.name}'s verified multi-year portfolio and transcript.`,
      'info'
    );
    window.print();
  };

  const getCategoryIcon = (cat: StudentGrowthMilestone['category']) => {
    switch (cat) {
      case 'award':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'sports':
        return <Medal className="w-4 h-4 text-emerald-500" />;
      case 'admission':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'promotion':
        return <CheckCircle2 className="w-4 h-4 text-teal-500" />;
      case 'certification':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Student Growth Timeline
              <span className="text-xs px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold rounded-full border border-emerald-200 dark:border-emerald-900">
                Multi-Year Portfolio
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Verified chronological life-cycle records from enrollment through scholastic distinctions, sports, and certifications.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>

          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Official Dossier
          </button>
        </div>
      </div>

      {/* Student Selector & Category Filter Ribbon */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Select Student:
          </span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {db.students.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name} ({std.rollNumber} - {std.classSection})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Milestones</option>
            <option value="academic">Academic Exellence</option>
            <option value="award">Awards & Olympiads</option>
            <option value="sports">Athletics & Sports</option>
            <option value="certification">Tech & Certifications</option>
            <option value="promotion">Grade Promotions</option>
            <option value="admission">Admissions</option>
          </select>
        </div>
      </div>

      {/* Student Profile Card in Dossier */}
      {selectedStudent && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {selectedStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedStudent.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {selectedStudent.classSection}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Roll: <strong>{selectedStudent.rollNumber}</strong></span>
                <span>Admission No: <strong>{selectedStudent.admissionNumber}</strong></span>
                <span>Gender: <strong>{selectedStudent.gender}</strong></span>
                <span>Blood Group: <strong>{selectedStudent.bloodGroup || 'O+'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-xs text-slate-400">Total Milestones</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {milestones.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chronological Timeline */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {milestones.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No Milestones Logged</h4>
            <p className="text-xs text-slate-500 mt-1">Click "Add Milestone" above to record this student's achievements.</p>
          </div>
        ) : (
          milestones.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Icon */}
              <div className="absolute -left-6 md:-left-10 top-1 w-6 md:w-8 h-6 md:h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-sm flex items-center justify-center">
                {getCategoryIcon(item.category)}
              </div>

              {/* Milestone Card */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      [{item.academicYear}]
                    </span>
                  </div>

                  {item.gradeScore && (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      Score: {item.gradeScore}
                    </span>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                {item.badgeEarned && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Badge Earned: {item.badgeEarned}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified by: <strong className="text-slate-700 dark:text-slate-300">{item.verifierName}</strong>
                  </span>
                  <span className="font-mono text-[11px]">ID: {item.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={`Log Growth Milestone: ${selectedStudent?.name}`}
          size="md"
        >
          <form onSubmit={handleSaveMilestone} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CBSE Regional Science Fair 1st Prize"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  <option value="academic">Academic</option>
                  <option value="award">Award / Medal</option>
                  <option value="sports">Sports</option>
                  <option value="certification">Certification</option>
                  <option value="promotion">Promotion</option>
                  <option value="admission">Admission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Achievement
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade / Score (Optional)
                </label>
                <input
                  type="text"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  placeholder="e.g. 98.4% or Gold Medal"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge Earned (Optional)
                </label>
                <input
                  type="text"
                  value={badgeEarned}
                  onChange={(e) => setBadgeEarned(e.target.value)}
                  placeholder="e.g. Code Ninja"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description & Official Citation
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the competition, certificate credentials, or examination..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Verifying Faculty / Authority
              </label>
              <input
                type="text"
                value={verifierName}
                onChange={(e) => setVerifierName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Save to Permanent Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default GrowthTimelineModule;
