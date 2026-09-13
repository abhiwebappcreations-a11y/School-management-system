import React, { useState } from 'react';
import { Layers, BookOpen, Users, Plus, Search, CheckCircle2, GraduationCap } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import confetti from 'canvas-confetti';
import { Section } from '../../../types/academic';

export const ClassesSubjectsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeCategory, setSelectedGradeCategory] = useState<
    'all' | 'pre-primary' | 'primary' | 'middle' | 'secondary'
  >('all');

  // Modal State
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(db.classes[0]?.id || 'cls-nur');
  const [newSectionLetter, setNewSectionLetter] = useState('C');
  const [newRoomNumber, setNewRoomNumber] = useState('Room 210');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newCapacity, setNewCapacity] = useState(40);

  // Helper to categorize sections
  const getGradeCategory = (className: string) => {
    if (['Nursery', 'LKG', 'UKG'].includes(className)) return 'pre-primary';
    if (['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(className)) return 'primary';
    if (['Class 6', 'Class 7', 'Class 8'].includes(className)) return 'middle';
    if (['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(className)) return 'secondary';
    return 'middle';
  };

  const filteredSections = db.sections.filter((sec) => {
    const matchesCategory =
      selectedGradeCategory === 'all' || getGradeCategory(sec.className) === selectedGradeCategory;
    const matchesSearch =
      sec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.classTeacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSection = () => {
    const targetClass = db.classes.find((c) => c.id === selectedClassId);
    if (!targetClass) return;

    const fullSecName = targetClass.name.startsWith('Class')
      ? `${targetClass.name}${newSectionLetter.toUpperCase()}`
      : `${targetClass.name} ${newSectionLetter.toUpperCase()}`;

    const newSec: Section = {
      id: `sec-${Date.now()}`,
      classId: targetClass.id,
      className: targetClass.name,
      sectionName: newSectionLetter.toUpperCase(),
      fullName: fullSecName,
      classTeacherId: `usr-teacher-${Date.now()}`,
      classTeacherName: newTeacherName || 'Appointed Faculty',
      roomNumber: newRoomNumber || 'Room 210',
      capacity: newCapacity,
      studentCount: 0,
    };

    mutateDb((draft) => {
      draft.sections.push(newSec);
      const cls = draft.classes.find((c) => c.id === selectedClassId);
      if (cls && !cls.sections.includes(fullSecName)) {
        cls.sections.push(fullSecName);
      }
    });

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    showToast('Section Created', `Successfully added ${fullSecName} to school registry`, 'success');
    setIsAddSectionModalOpen(false);
    setNewTeacherName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Classes, Sections & Curriculum Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete institutional structure spanning Nursery to Class 10 with capacity, teacher in-charge, and curriculum
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsAddSectionModalOpen(true)}
        >
          Add Section
        </Button>
      </div>

      {/* Cohort Categorization Tabs & Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: `All Grades (${db.sections.length})` },
              { id: 'pre-primary', label: 'Pre-Primary (Nursery, LKG, UKG)' },
              { id: 'primary', label: 'Primary (Class 1 – 5)' },
              { id: 'middle', label: 'Middle School (Class 6 – 8)' },
              { id: 'secondary', label: 'Secondary (Class 9 – 10)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedGradeCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGradeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search class, section, teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Active Class Sections ({filteredSections.length})
          </h2>
          <span className="text-xs text-slate-500">
            Total Enrolled: {filteredSections.reduce((acc, s) => acc + s.studentCount, 0)} Students
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSections.map((sec) => {
            const occupancyPct = Math.round((sec.studentCount / (sec.capacity || 40)) * 100);
            return (
              <Card key={sec.id} className="p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
                <div className="flex items-center justify-between text-xs mb-1">
                  <Badge variant={['Nursery', 'LKG', 'UKG'].includes(sec.className) ? 'warning' : 'primary'}>
                    {sec.className}
                  </Badge>
                  <span className="font-mono text-slate-400 font-semibold">{sec.roomNumber}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {sec.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Teacher: <strong className="text-slate-700 dark:text-slate-300">{sec.classTeacherName}</strong>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {sec.studentCount} / {sec.capacity} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Subjects Table */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Curriculum Subjects & Grade Levels ({db.subjects.length})
        </h2>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Applicable Classes</th>
                  <th className="py-3 px-4">Curriculum Type</th>
                  <th className="py-3 px-4 text-right">Practical Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {db.subjects.map((sub) => {
                  const applicableNames = db.classes
                    .filter((c) => sub.classIds?.includes(c.id))
                    .map((c) => c.name);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{sub.name}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {sub.code}
                      </td>
                      <td className="py-3 px-4">{sub.department}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {applicableNames.length > 0 ? applicableNames.join(', ') : 'All Grades'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={sub.isElective ? 'warning' : 'primary'}>
                          {sub.isElective ? 'Elective' : 'Core Compulsory'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={sub.isPractical ? 'success' : 'neutral'}>
                          {sub.isPractical ? 'Lab Included' : 'Theory Only'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Create New Class Section"
        description="Add a new section cohort to school academic structure"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSection}>
              Add Section
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Grade / Class (Nursery to Class 10)
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
            >
              {db.classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section Letter
              </label>
              <input
                type="text"
                placeholder="e.g. C or D"
                value={newSectionLetter}
                onChange={(e) => setNewSectionLetter(e.target.value)}
                maxLength={2}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Room Number
              </label>
              <input
                type="text"
                placeholder="e.g. Room 210"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Class Teacher Name
              </label>
              <input
                type="text"
                placeholder="e.g. Neha Roy"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Capacity (Students)
              </label>
              <input
                type="number"
                min={10}
                max={60}
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
