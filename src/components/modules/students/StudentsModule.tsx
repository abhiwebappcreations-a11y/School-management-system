import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  CalendarCheck,
  CreditCard,
  Bus,
  Library,
  Award,
  FileText,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Student } from '../../../types/student';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { PermissionGate } from '../../common/PermissionGate';

export const StudentsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'parents' | 'attendance' | 'academics' | 'exams' | 'fees' | 'transport' | 'library' | 'documents'
  >('overview');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 8A');
  const [newStudentGender, setNewStudentGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');

  // Filter students
  const filteredStudents = db.students.filter((std) => {
    // If user is a Parent, ONLY show their linked students!
    if (currentUser.role === 'parent') {
      if (!currentUser.linkedStudentIds?.includes(std.id)) return false;
    }

    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.rollNumber.includes(searchQuery);

    const matchesClass = selectedClass === 'all' || std.classSection === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = () => {
    if (!newStudentName.trim() || !newStudentRoll.trim()) {
      showToast('Validation Error', 'Please fill in student name and roll number', 'warning');
      return;
    }

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      admissionNumber: `SMS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNumber: newStudentRoll,
      name: newStudentName,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dateOfBirth: '2012-06-15',
      gender: newStudentGender,
      bloodGroup: 'B+',
      classSection: newStudentClass,
      academicYear: '2025–26',
      branchId: 'branch-1',
      branchName: 'Main Campus',
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@smartschool.edu`,
      phone: newParentPhone || '+91 98000 11223',
      address: 'Vasant Vihar Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110057',
      emergencyContactName: newParentName || 'Guardian',
      emergencyContactPhone: newParentPhone || '+91 98000 11223',
      emergencyContactRelation: 'Parent',
      medicalConditions: [],
      allergies: [],
      previousSchool: 'City Model Academy',
      admissionDate: new Date().toISOString().substring(0, 10),
      house: 'Red Phoenix',
      parentIds: [],
      parentName: newParentName || 'Guardian Name',
      parentPhone: newParentPhone || '+91 98000 11223',
      parentEmail: 'parent@example.com',
      activeBooksCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    mutateDb((draft) => {
      draft.students.unshift(newStudent);
    });

    setIsAddModalOpen(false);
    setNewStudentName('');
    setNewStudentRoll('');
    setNewParentName('');
    setNewParentPhone('');
    showToast('Student Enrolled', `${newStudent.name} admitted to ${newStudent.classSection}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Students Directory & Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Central student repository with 9-tab profile view, medical data, academics, fees & transport
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => showToast('Export Complete', 'Student list exported to CSV successfully', 'info')}
          >
            Export
          </Button>

          {canAccess('students', 'create') && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll, admission #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Grades ({db.students.length} Students)</option>
              {db.sections.map((sec) => (
                <option key={sec.id} value={sec.fullName}>
                  {sec.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Admission #</th>
                <th className="py-3.5 px-4">Class & Roll</th>
                <th className="py-3.5 px-4">Guardian / Contact</th>
                <th className="py-3.5 px-4">House</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No students match the criteria in your authorized scope.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.photoUrl}
                          alt={std.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                          <div className="text-[10px] text-slate-400">{std.gender} • {std.bloodGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {std.admissionNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {std.classSection}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Roll #{std.rollNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{std.parentName}</div>
                      <div className="text-[10px] text-slate-400">{std.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="purple" size="sm">
                        {std.house}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">
                        {std.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedStudent(std);
                            setActiveTab('overview');
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 9-TAB RICH STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile — ${selectedStudent.name}`}
          description={`${selectedStudent.classSection} • Admission ${selectedStudent.admissionNumber}`}
          maxWidth="4xl"
        >
          {/* Header Banner inside modal */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <img
              src={selectedStudent.photoUrl}
              alt={selectedStudent.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
              <p className="text-xs text-slate-500">
                {selectedStudent.classSection} • Roll #{selectedStudent.rollNumber} • House:{' '}
                <strong>{selectedStudent.house}</strong>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="success">Active Student</Badge>
                <Badge variant="info">Blood Group: {selectedStudent.bloodGroup}</Badge>
                <Badge variant="primary">{selectedStudent.academicYear}</Badge>
              </div>
            </div>
          </div>

          {/* 9 Tabs Navigation */}
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'overview', label: 'Overview', icon: GraduationCap },
              { id: 'parents', label: 'Parents / Guardian', icon: UserCheck },
              { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
              { id: 'academics', label: 'Academics', icon: Award },
              { id: 'exams', label: 'Exams & Marks', icon: Award },
              { id: 'fees', label: 'Fee History', icon: CreditCard },
              { id: 'transport', label: 'Transport', icon: Bus },
              { id: 'library', label: 'Library History', icon: Library },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-2 min-h-[300px]">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Personal Details
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Gender:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.gender}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Residential Address:</span>
                    <span className="font-semibold text-right text-slate-800 dark:text-slate-200 max-w-[200px]">
                      {selectedStudent.address}, {selectedStudent.city}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Medical & Background
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Allergies:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedStudent.allergies.length > 0 ? selectedStudent.allergies.join(', ') : 'None reported'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Medical Conditions:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedStudent.medicalConditions.length > 0
                        ? selectedStudent.medicalConditions.join(', ')
                        : 'Fit & Healthy'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500">Previous School:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.previousSchool}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {selectedStudent.emergencyContactName} ({selectedStudent.emergencyContactPhone})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Parents */}
            {activeTab === 'parents' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Registered Primary Guardian
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">GUARDIAN NAME</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {selectedStudent.parentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">RELATIONSHIP</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Father</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PHONE</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedStudent.parentPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EMAIL</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedStudent.parentEmail}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Attendance */}
            {activeTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Term 1 Attendance Rate</h4>
                    <p className="text-emerald-700 dark:text-emerald-400">Total days recorded: 88 • Present: 85</p>
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">96.4%</div>
                </div>

                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Recorded At</th>
                      <th className="p-2.5">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-mono">2026-09-13</td>
                      <td className="p-2.5"><Badge variant="success">PRESENT</Badge></td>
                      <td className="p-2.5">08:45 AM (Mobile)</td>
                      <td className="p-2.5">Rahul Kumar</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono">2026-09-12</td>
                      <td className="p-2.5"><Badge variant="success">PRESENT</Badge></td>
                      <td className="p-2.5">08:42 AM (Desktop)</td>
                      <td className="p-2.5">Rahul Kumar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. Academics / Timetable */}
            {activeTab === 'academics' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Enrolled Subjects & Faculty
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {db.subjects.map((s) => (
                    <div key={s.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.code} • {s.department}</span>
                      </div>
                      <Badge variant="primary" size="sm">{s.isPractical ? 'Theory + Lab' : 'Theory'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Exams & Marks */}
            {activeTab === 'exams' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Term 1 Mid-Term Examination 2025–26
                  </h4>
                  <Badge variant="success">Grade A (88.8%)</Badge>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Max Marks</th>
                      <th className="p-2.5">Obtained</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-bold">Mathematics</td>
                      <td className="p-2.5">80</td>
                      <td className="p-2.5 font-black text-indigo-600">74</td>
                      <td className="p-2.5"><Badge variant="primary">A+</Badge></td>
                      <td className="p-2.5 text-slate-500">Top scorer in algebra</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Science</td>
                      <td className="p-2.5">80</td>
                      <td className="p-2.5 font-black text-indigo-600">68</td>
                      <td className="p-2.5"><Badge variant="primary">A</Badge></td>
                      <td className="p-2.5 text-slate-500">Excellent lab skills</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">English Literature</td>
                      <td className="p-2.5">80</td>
                      <td className="p-2.5 font-black text-indigo-600">71</td>
                      <td className="p-2.5"><Badge variant="primary">A</Badge></td>
                      <td className="p-2.5 text-slate-500">Strong creative writing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. Fees */}
            {activeTab === 'fees' && (
              <div className="space-y-3 text-xs">
                {/* Security Gate for Fees */}
                <PermissionGate
                  module="fees"
                  action="view"
                  fallback={
                    <div className="p-6 text-center text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900">
                      🔒 Your role does not hold clearance to inspect student financial records.
                    </div>
                  }
                >
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Term 1 Fee Status</h4>
                      <p className="text-emerald-700 dark:text-emerald-400">Paid in full via UPI on 14 Jul 2026</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹41,300</span>
                      <span className="text-[10px] text-slate-400 block font-mono">RCP-2026-9041</span>
                    </div>
                  </div>
                </PermissionGate>
              </div>
            )}

            {/* 7. Transport */}
            {activeTab === 'transport' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-amber-500" /> Bus Allotment & Stops
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ROUTE</span>
                    <span className="font-bold text-slate-900 dark:text-white">Route 04 (North-West Express)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">BUS NUMBER</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedStudent.busNumber || 'DL-01-AB-1234'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PICKUP & DROP STOP</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.transportStopName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SCHEDULED PICKUP</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">07:15 AM</span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Library */}
            {activeTab === 'library' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Card: {selectedStudent.libraryCardNumber || 'LIB-2025-0812'}
                  </h4>
                  <Badge variant="primary">2 Active Loans</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">The Discovery of India</span>
                      <span className="text-[10px] text-slate-400">Issued on 2026-09-01</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Due 2026-09-15</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Harry Potter & Sorcerer’s Stone</span>
                      <span className="text-[10px] text-slate-400">Issued on 2026-09-03</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Due 2026-09-17</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Verified Digital Records
                </h4>
                {db.documents
                  .filter((d) => d.associatedId === selectedStudent.id)
                  .map((doc) => (
                    <div key={doc.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{doc.title}</span>
                          <span className="text-[10px] text-slate-400">{doc.category} • {doc.fileSize}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" icon={Download}>
                        Download
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ADD STUDENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Admit New Student"
        description="Enroll student with academic, contact, and parent details"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateStudent}>
              Admit Student
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Class & Section</label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              >
                {db.sections.map((sec) => (
                  <option key={sec.id} value={sec.fullName}>
                    {sec.fullName} ({sec.className})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
              <input
                type="text"
                placeholder="e.g. 32"
                value={newStudentRoll}
                onChange={(e) => setNewStudentRoll(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Sharma"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 12345"
                value={newParentPhone}
                onChange={(e) => setNewParentPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
