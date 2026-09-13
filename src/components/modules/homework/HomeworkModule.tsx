import React, { useState } from 'react';
import { BookMarked, Plus, Calendar, CheckCircle2, Upload, FileText } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { HomeworkItem } from '../../../types/academic';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const HomeworkModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, canAccess } = useAuth();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwClass, setHwClass] = useState('Class 8A');
  const [hwDueDate, setHwDueDate] = useState('2026-09-18');
  const [hwDesc, setHwDesc] = useState('');

  const handleCreateHomework = () => {
    if (!hwTitle.trim()) return;

    const newHw: HomeworkItem = {
      id: `hw-${Date.now()}`,
      classSection: hwClass,
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc || 'Complete exercise questions and prepare summary.',
      assignedDate: new Date().toISOString().substring(0, 10),
      dueDate: hwDueDate,
      teacherName: currentUser.name,
      submissionCount: 0,
      totalStudents: 36,
    };

    mutateDb((draft) => {
      draft.homework.unshift(newHw);
    });

    setIsAssignModalOpen(false);
    setHwTitle('');
    setHwDesc('');
    showToast('Homework Assigned', `Task published for ${newHw.classSection}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Homework, Projects & Online Submissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily coursework assignments, submission deadlines, attachments, and student uploads
          </p>
        </div>

        {canAccess('homework', 'create') && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAssignModalOpen(true)}
          >
            Assign New Homework
          </Button>
        )}
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {db.homework.map((hw) => (
          <Card key={hw.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <Badge variant="primary">{hw.subject}</Badge>
                <span className="font-semibold text-slate-500">{hw.classSection}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {hw.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {hw.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-rose-600 dark:text-rose-400 font-bold block">
                  Due: {hw.dueDate}
                </span>
                <span className="text-[10px] text-slate-400">By {hw.teacherName}</span>
              </div>

              {currentUser.role === 'student' ? (
                <Button
                  size="sm"
                  variant="primary"
                  icon={Upload}
                  onClick={() => showToast('Submitted', `Homework "${hw.title}" uploaded!`, 'success')}
                >
                  Submit Work
                </Button>
              ) : (
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {hw.submissionCount} / {hw.totalStudents} Submissions
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Coursework Homework"
        description="Publish task to students and parents"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateHomework}>
              Publish Homework
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Homework Title
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4 Exercise Problems"
              value={hwTitle}
              onChange={(e) => setHwTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Class & Section
              </label>
              <select
                value={hwClass}
                onChange={(e) => setHwClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              >
                {db.sections.map((sec) => (
                  <option key={sec.id} value={sec.fullName}>
                    {sec.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={hwSubject}
                onChange={(e) => setHwSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              >
                {db.subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Submission Due Date
              </label>
              <input
                type="date"
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Instructions & Questions
            </label>
            <textarea
              rows={3}
              placeholder="Detailed instructions..."
              value={hwDesc}
              onChange={(e) => setHwDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
