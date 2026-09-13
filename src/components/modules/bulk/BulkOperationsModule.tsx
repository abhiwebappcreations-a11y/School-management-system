import React, { useState } from 'react';
import {
  Layers,
  UploadCloud,
  FileSpreadsheet,
  CreditCard,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  Sparkles,
  Smartphone,
  Check,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Student } from '../../../types/student';
import { StudentFeeInvoice } from '../../../types/finance';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

type BulkTab = 'importer' | 'invoicing' | 'broadcast';

interface ParsedCsvStudent {
  name: string;
  rollNumber: string;
  classSection: string;
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  isValid: boolean;
  validationError?: string;
}

const SAMPLE_CSV = `Name,RollNumber,ClassSection,Gender,ParentName,ParentPhone,ParentEmail
Aditya Sharma,805,Class 8A,Male,Ramesh Sharma,+91 98111 22334,ramesh@example.com
Riya Patel,806,Class 8A,Female,Kavita Patel,+91 98222 33445,kavita@example.com
Mohd Farooq,807,Class 8A,Male,Zubair Farooq,+91 98333 44556,zubair@example.com
Meera Nambiar,808,Class 8A,Female,Gopal Nambiar,+91 98444 55667,gopal@example.com`;

export const BulkOperationsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<BulkTab>('importer');

  // CSV Importer State
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsedRows, setParsedRows] = useState<ParsedCsvStudent[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  // Batch Invoicing State
  const [targetClass, setTargetClass] = useState('Class 8A');
  const [feeTitle, setFeeTitle] = useState('Term 2 Tuition & Science Lab Fee');
  const [feeCategory, setFeeCategory] = useState<'Tuition' | 'Transport' | 'Exam' | 'Annual'>('Tuition');
  const [feeAmount, setFeeAmount] = useState<number>(14500);
  const [feeDueDate, setFeeDueDate] = useState('2026-11-15');

  // Broadcast Dispatcher State
  const [broadcastAudience, setBroadcastAudience] = useState<'all_parents' | 'fee_defaulters' | 'transport_riders'>('all_parents');
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    'Dear Parent, this is an official update from Delhi Smart International Academy for {{student_name}} ({{class}}). School will conduct Term-1 parent-teacher meetings this Saturday. Attendance is mandatory.'
  );

  // Parse CSV
  const handleParseCsv = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) {
        showToast('Error', 'CSV text must contain a header and at least one data row.', 'error');
        return;
      }

      const rows: ParsedCsvStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 7) {
          rows.push({
            name: parts[0] || 'Unknown',
            rollNumber: parts[1] || 'N/A',
            classSection: parts[2] || 'N/A',
            gender: 'Male',
            parentName: parts[4] || 'N/A',
            parentPhone: parts[5] || 'N/A',
            parentEmail: parts[6] || 'N/A',
            isValid: false,
            validationError: 'Missing mandatory CSV columns',
          });
        } else {
          rows.push({
            name: parts[0],
            rollNumber: parts[1],
            classSection: parts[2],
            gender: parts[3] as any,
            parentName: parts[4],
            parentPhone: parts[5],
            parentEmail: parts[6],
            isValid: true,
          });
        }
      }

      setParsedRows(rows);
      setIsParsed(true);
      showToast('CSV Parsed', `Extracted ${rows.length} student records for review.`, 'info');
    } catch (err) {
      showToast('Parse Failed', 'Could not parse CSV content.', 'error');
    }
  };

  // Commit CSV Importer
  const handleCommitImport = () => {
    if (!canAccess('students', 'create')) {
      showToast('Security Denial', 'Your role lacks permission to create student records.', 'error');
      return;
    }

    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      showToast('No Valid Rows', 'There are no valid student records to import.', 'warning');
      return;
    }

    mutateDb((draft) => {
      validRows.forEach((row, idx) => {
        const newStudent: Student = {
          id: `std-${Date.now()}-${idx}`,
          admissionNumber: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          rollNumber: row.rollNumber,
          name: row.name,
          photoUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80`,
          dateOfBirth: '2013-05-15',
          gender: row.gender,
          bloodGroup: 'B+',
          classSection: row.classSection,
          academicYear: '2025–26',
          branchId: 'branch-1',
          branchName: 'Main Vasant Kunj Campus',
          email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@student.smartschool.edu.in`,
          phone: row.parentPhone,
          address: 'Plot 12, Sector B, Vasant Kunj',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110070',
          emergencyContactName: row.parentName,
          emergencyContactPhone: row.parentPhone,
          emergencyContactRelation: 'Parent',
          medicalConditions: [],
          allergies: [],
          previousSchool: 'National Public School',
          admissionDate: new Date().toISOString().split('T')[0],
          house: 'Red Phoenix',
          parentIds: [],
          parentName: row.parentName,
          parentPhone: row.parentPhone,
          parentEmail: row.parentEmail,
          activeBooksCount: 0,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        draft.students.push(newStudent);
      });
    });

    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    showToast('Import Successful!', `Added ${validRows.length} new students to institutional database.`, 'success');
    setIsParsed(false);
    setParsedRows([]);
  };

  // Execute Batch Invoicing
  const handleGenerateBatchInvoices = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAccess('fees', 'create')) {
      showToast('Security Denial', 'Your role lacks permission to generate fee invoices.', 'error');
      return;
    }

    const eligibleStudents = db.students.filter(
      (s) => targetClass === 'all' || s.classSection === targetClass || s.classSection.startsWith(targetClass)
    );

    if (eligibleStudents.length === 0) {
      showToast('No Students', `No students found for class ${targetClass}.`, 'warning');
      return;
    }

    const newInvoices: StudentFeeInvoice[] = eligibleStudents.map((s, idx) => ({
      id: `inv-${Date.now()}-${idx}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.rollNumber,
      classSection: s.classSection,
      feeStructureId: 'fs-1',
      title: feeTitle,
      term: 'Term 2',
      academicYear: '2025–26',
      dueDate: feeDueDate,
      totalAmount: feeAmount,
      paidAmount: 0,
      balanceAmount: feeAmount,
      discountAmount: 0,
      items: [{ category: 'Tuition Fee', amount: feeAmount }],
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }));

    mutateDb((draft) => {
      draft.feeInvoices.unshift(...newInvoices);
    });

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(
      'Batch Invoices Created!',
      `Generated ${newInvoices.length} invoices totaling ₹${(newInvoices.length * feeAmount).toLocaleString('en-IN')}.`,
      'success'
    );
  };

  // Dispatch Broadcast
  const handleDispatchBroadcast = () => {
    if (!canAccess('communication', 'create')) {
      showToast('Security Denial', 'Your role lacks broadcast permissions.', 'error');
      return;
    }

    showToast('Dispatching...', 'Transmitting mass communication via WhatsApp & SMS gateways...', 'info');
    setTimeout(() => {
      showToast('Broadcast Dispatched!', `Successfully delivered message to ${db.parents.length} recipients.`, 'success');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.5 } });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Bulk Operations, CSV Importer & Mass Dispatcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated batch pipelines: student roster CSV ingestion, class-wide fee invoicing, and omni-channel notifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('importer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'importer'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Student CSV Importer
          </button>

          <button
            onClick={() => setActiveTab('invoicing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'invoicing'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Batch Fee Invoicing
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'broadcast'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Omni Broadcast
          </button>
        </div>
      </div>

      {/* TAB 1: CSV IMPORTER */}
      {activeTab === 'importer' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Batch Ingest Student Roster (CSV)
                </h3>
                <p className="text-xs text-slate-500">
                  Paste or upload comma-separated values matching the institutional CBSE enrollment format.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={() => {
                    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'smartschool_students_template.csv';
                    link.click();
                    URL.revokeObjectURL(url);
                    showToast('Template Saved', 'Sample CSV template downloaded.', 'info');
                  }}
                >
                  Download Sample CSV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCsvText(SAMPLE_CSV)}
                >
                  Load Sample Data
                </Button>
              </div>
            </div>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste raw CSV content here..."
              className="w-full font-mono text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end">
              <Button variant="primary" size="md" icon={UploadCloud} onClick={handleParseCsv}>
                Parse & Validate CSV
              </Button>
            </div>
          </Card>

          {/* Parsed Results Preview Table */}
          {isParsed && (
            <Card className="overflow-hidden">
              <CardHeader
                title={`CSV Ingestion Preview (${parsedRows.length} Records)`}
                subtitle="Review parsed rows before committing into institutional database."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={handleCommitImport}
                  >
                    Commit {parsedRows.filter((r) => r.isValid).length} Valid Students
                  </Button>
                }
              />

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Candidate Name</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Guardian Name</th>
                      <th className="p-3">Contact Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="p-3">
                          {row.isValid ? (
                            <Badge variant="success">Valid</Badge>
                          ) : (
                            <Badge variant="danger">{row.validationError || 'Invalid'}</Badge>
                          )}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                        <td className="p-3 font-mono text-slate-500">{row.rollNumber}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{row.classSection}</td>
                        <td className="p-3 text-slate-500">{row.gender}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{row.parentName}</td>
                        <td className="p-3 font-mono text-slate-500">{row.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: BATCH FEE INVOICING */}
      {activeTab === 'invoicing' && (
        <Card className="p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Batch Fee Invoice Generator
            </h3>
            <p className="text-xs text-slate-500">
              Simultaneously generate standardized CBSE fee invoices across an entire classroom or school cohort.
            </p>
          </div>

          <form onSubmit={handleGenerateBatchInvoices} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Classroom Cohort
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="all">All Enrolled Classes & Grades ({db.students.length} Students)</option>
                  {db.sections.map((sec) => (
                    <option key={sec.id} value={sec.fullName}>
                      {sec.fullName} ({sec.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fee Category
                </label>
                <select
                  value={feeCategory}
                  onChange={(e) => setFeeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Tuition">Tuition Fee</option>
                  <option value="Transport">Transport / Bus Fee</option>
                  <option value="Exam">Examination & Board Registration</option>
                  <option value="Annual">Annual Charges & Laboratory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Invoice Title / Description
              </label>
              <input
                type="text"
                required
                value={feeTitle}
                onChange={(e) => setFeeTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount Per Student (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  required
                  value={feeDueDate}
                  onChange={(e) => setFeeDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Invoicing Summary Box */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[10px]">
                Batch Impact Assessment
              </span>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Total Candidate Invoices:</span>
                <span className="font-bold">
                  {targetClass === 'all'
                    ? db.students.length
                    : db.students.filter((s) => s.classSection === targetClass || s.classSection.startsWith(targetClass)).length}{' '}
                  Students
                </span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Aggregate Receivable:</span>
                <span className="font-bold text-emerald-600">
                  ₹
                  {(
                    (targetClass === 'all'
                      ? db.students.length
                      : db.students.filter((s) => s.classSection === targetClass || s.classSection.startsWith(targetClass)).length) *
                    feeAmount
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={CreditCard}
              className="w-full justify-center"
            >
              Generate & Dispatch Invoices
            </Button>
          </form>
        </Card>
      )}

      {/* TAB 3: OMNI BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Composer Form */}
          <Card className="lg:col-span-7 p-6 space-y-5">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Multi-Channel Mass Broadcast Composer
              </h3>
              <p className="text-xs text-slate-500">
                Dispatch verified notices instantly across WhatsApp Business API, SMS, and in-app feeds.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Audience
                </label>
                <select
                  value={broadcastAudience}
                  onChange={(e) => setBroadcastAudience(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="all_parents">All Verified Parents ({db.parents.length})</option>
                  <option value="fee_defaulters">Fee Defaulters & Overdue Invoices</option>
                  <option value="transport_riders">Transport Fleet Commuters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Delivery Gateways
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendWhatsapp}
                      onChange={(e) => setSendWhatsapp(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">WhatsApp API</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">TRAI DLT SMS</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Message Body & Dynamic Merge Tags
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {messageTemplate.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Insert Tags:</span>
                  {['{{student_name}}', '{{class}}', '{{due_amount}}', '{{school_name}}'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setMessageTemplate((prev) => `${prev} ${tag}`)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-mono hover:bg-slate-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Send}
              onClick={handleDispatchBroadcast}
              className="w-full justify-center"
            >
              Dispatch Broadcast to {db.parents.length} Guardians
            </Button>
          </Card>

          {/* Live Phone Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-72 bg-slate-900 border-4 border-slate-800 rounded-[36px] p-3 shadow-2xl relative">
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
              {/* WhatsApp Mock Screen */}
              <div className="bg-[#0b141a] rounded-[24px] overflow-hidden p-3 min-h-[380px] flex flex-col justify-between text-white">
                <div className="border-b border-slate-800 pb-2 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-black text-xs text-white">
                    DS
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      Delhi Smart Academy <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-[9px] text-slate-400">Official Institutional Account</div>
                  </div>
                </div>

                <div className="p-3 bg-[#1f2c34] rounded-xl text-[11px] leading-relaxed text-slate-200 shadow-sm">
                  {messageTemplate
                    .replace(/\{\{student_name\}\}/g, 'Ravi Kumar')
                    .replace(/\{\{class\}\}/g, 'Class 8A')
                    .replace(/\{\{due_amount\}\}/g, '₹41,300')
                    .replace(/\{\{school_name\}\}/g, 'Delhi Smart Academy')}
                  <div className="text-[9px] text-right text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <span>11:32 AM</span>
                    <Check className="w-2.5 h-2.5 text-sky-400" />
                  </div>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-500">End-to-end encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
