import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { AdmissionApplication, AdmissionStatus, Student } from '../../../types/student';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const AdmissionsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, currentUser } = useAuth();

  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New enquiry form
  const [candidateName, setCandidateName] = useState('');
  const [candidateClass, setCandidateClass] = useState('Class 8');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const statuses: AdmissionStatus[] = [
    'Application Received',
    'Under Review',
    'Interview Completed',
    'Accepted',
    'Joined',
  ];

  const handleConvertApplication = (app: AdmissionApplication) => {
    if (!canAccess('admissions', 'approve')) {
      showToast('Permission Denied', 'Unauthorized to approve admissions', 'error');
      return;
    }

    const newStudentId = `std-${Date.now()}`;
    const newAdmissionNumber = `SMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      id: newStudentId,
      admissionNumber: newAdmissionNumber,
      rollNumber: (db.students.length + 1).toString(),
      name: app.studentName,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      dateOfBirth: app.dateOfBirth,
      gender: app.gender,
      bloodGroup: 'O+',
      classSection: `${app.appliedClass}A`,
      academicYear: '2025–26',
      branchId: 'branch-1',
      branchName: 'Main Campus',
      email: `${app.studentName.toLowerCase().replace(/\s+/g, '.')}@smartschool.edu`,
      phone: app.parentPhone,
      address: app.address,
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      emergencyContactName: app.parentName,
      emergencyContactPhone: app.parentPhone,
      emergencyContactRelation: 'Parent',
      medicalConditions: [],
      allergies: [],
      previousSchool: app.previousSchool,
      admissionDate: new Date().toISOString().substring(0, 10),
      house: 'Gold Eagles',
      parentIds: [],
      parentName: app.parentName,
      parentPhone: app.parentPhone,
      parentEmail: app.parentEmail,
      activeBooksCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    mutateDb((draft) => {
      const idx = draft.admissions.findIndex((a) => a.id === app.id);
      if (idx >= 0) {
        draft.admissions[idx].status = 'Joined';
        draft.admissions[idx].assignedStudentId = newStudentId;
      }
      draft.students.unshift(newStudent);
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    setSelectedApp(null);
    showToast('Student Converted!', `${app.studentName} is now officially enrolled with ID ${newAdmissionNumber}`, 'success');
  };

  const handleCreateEnquiry = () => {
    if (!candidateName.trim()) return;

    const newApp: AdmissionApplication = {
      id: `adm-${Date.now()}`,
      applicationNumber: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: candidateName,
      gender: 'Male',
      dateOfBirth: '2013-04-10',
      appliedClass: candidateClass,
      parentName: parentName || 'Guardian',
      parentEmail: 'guardian@example.com',
      parentPhone: parentPhone || '+91 98111 44556',
      address: 'Institutional Area, New Delhi',
      previousSchool: 'Modern Convent Academy',
      status: 'Application Received',
      appliedDate: new Date().toISOString().substring(0, 10),
      verifiedDocuments: ['Birth Certificate', 'Previous Marksheet'],
    };

    mutateDb((draft) => {
      draft.admissions.unshift(newApp);
    });

    setIsCreateModalOpen(false);
    setCandidateName('');
    setParentName('');
    setParentPhone('');
    showToast('Application Logged', `Application ${newApp.applicationNumber} recorded in pipeline`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Admissions Pipeline & Student Conversion
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enquiry → Application → Document Verification → Assessment → Interview → Approval → Student ID
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Application
        </Button>
      </div>

      {/* Applications Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Current Admission Cycle Candidates (AY 2026–27)
          </h3>
          <Badge variant="primary">{db.admissions.length} Applicants</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Application #</th>
                <th className="py-3.5 px-4">Candidate Name</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Parent / Contact</th>
                <th className="py-3.5 px-4">Assessment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.admissions.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {app.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">{app.appliedClass}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">{app.parentName}</span>
                    <span className="text-[10px] text-slate-400">{app.parentPhone}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    {app.assessmentScore ? `${app.assessmentScore} / 100` : 'Pending'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        app.status === 'Joined'
                          ? 'success'
                          : app.status === 'Interview Completed'
                          ? 'primary'
                          : 'warning'
                      }
                    >
                      {app.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedApp(app)}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review & Student Conversion Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Review — ${selectedApp.studentName}`}
          description={`Application ${selectedApp.applicationNumber} • Applied for ${selectedApp.appliedClass}`}
          maxWidth="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              {selectedApp.status !== 'Joined' && canAccess('admissions', 'approve') && (
                <Button
                  variant="success"
                  icon={Sparkles}
                  onClick={() => handleConvertApplication(selectedApp)}
                >
                  Approve & Create Student ID
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Applicant Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedApp.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold">{selectedApp.dateOfBirth} ({selectedApp.gender})</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Parent / Guardian:</span>
                <span className="font-semibold">{selectedApp.parentName} ({selectedApp.parentPhone})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Previous School:</span>
                <span className="font-semibold">{selectedApp.previousSchool}</span>
              </div>
            </div>

            {selectedApp.interviewNotes && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">
                  Interview Assessment & Notes
                </span>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{selectedApp.interviewNotes}"
                </p>
                <div className="mt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  Entrance Score: {selectedApp.assessmentScore}%
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Verified Documents
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.verifiedDocuments.map((doc, i) => (
                  <Badge key={i} variant="success">
                    <CheckCircle2 className="w-3 h-3" /> {doc}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Application Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Admission Enquiry"
        description="Enter prospective student information"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateEnquiry}>
              Register Application
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Candidate Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Diya Sen"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Applying for Class
              </label>
              <select
                value={candidateClass}
                onChange={(e) => setCandidateClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold"
              >
                {db.classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98111 22334"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
