import React, { useState } from 'react';
import {
  FileText,
  Search,
  UploadCloud,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  HardDrive,
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Plus,
  Printer,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { DocumentItem } from '../../../types/system';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

type CategoryFilter = 'All' | 'Admission' | 'Identity' | 'Academic' | 'Certificate' | 'Medical' | 'Employment';
type TargetFilter = 'all' | 'student' | 'staff' | 'school';

export const DocumentsModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedTarget, setSelectedTarget] = useState<TargetFilter>('all');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Document Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('Academic');
  const [newTargetType, setNewTargetType] = useState<DocumentItem['associatedType']>('student');
  const [newTargetId, setNewTargetId] = useState(db.students[0]?.id || '');
  const [newFileSize, setNewFileSize] = useState('1.4 MB');
  const [newFileType, setNewFileType] = useState('PDF');

  const categories: CategoryFilter[] = [
    'All',
    'Admission',
    'Identity',
    'Academic',
    'Certificate',
    'Medical',
    'Employment',
  ];

  const filteredDocs = (db.documents || []).filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.associatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesTarget = selectedTarget === 'all' || doc.associatedType === selectedTarget;
    return matchesSearch && matchesCategory && matchesTarget;
  });

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Validation Error', 'Please specify a document title', 'warning');
      return;
    }

    let associatedName = 'Delhi Smart International Academy';
    if (newTargetType === 'student') {
      const std = db.students.find((s) => s.id === newTargetId);
      if (std) associatedName = `${std.name} (${std.classSection})`;
    } else if (newTargetType === 'staff') {
      const user = db.users.find((u) => u.id === newTargetId);
      if (user) associatedName = `${user.name} (${user.roleTitle})`;
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      associatedType: newTargetType,
      associatedId: newTargetId || 'school-main',
      associatedName,
      fileType: newFileType,
      fileSize: newFileSize,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUser?.name || 'Administrator',
      downloadUrl: '#',
    };

    mutateDb((draft) => {
      if (!draft.documents) draft.documents = [];
      draft.documents.unshift(newDoc);
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    showToast('Document Uploaded', `"${newDoc.title}" securely stored and indexed in vault.`, 'success');
  };

  const handleDeleteDocument = (docId: string, docTitle: string) => {
    if (!canAccess('documents', 'delete')) {
      showToast('Security Denial', 'Your role lacks permission to delete institutional records.', 'error');
      return;
    }

    if (confirm(`Are you sure you want to permanently delete "${docTitle}"?`)) {
      mutateDb((draft) => {
        draft.documents = (draft.documents || []).filter((d) => d.id !== docId);
      });
      if (previewDoc?.id === docId) setPreviewDoc(null);
      showToast('Document Purged', `Record "${docTitle}" has been safely removed.`, 'info');
    }
  };

  const handleSimulatedDownload = (doc: DocumentItem) => {
    showToast('Download Started', `Retrieving encrypted binary for ${doc.title}...`, 'info');
    setTimeout(() => {
      showToast('Download Complete', `${doc.title} (${doc.fileSize}) saved to local machine.`, 'success');
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Digital Document & DigiLocker Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centralized, tamper-evident repository for student KYC, transcripts, affiliation records, and staff agreements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canAccess('documents', 'create') && (
            <Button
              variant="primary"
              size="sm"
              icon={UploadCloud}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          )}
        </div>
      </div>

      {/* Cloud Security & Storage Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {(db.documents || []).length}
            </span>
            <span className="text-xs text-emerald-600 font-bold">100% Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Indexed across 6 categories</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Vault Quota</span>
            <HardDrive className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">18.6 MB</span>
            <span className="text-xs text-slate-400">/ 50 GB</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[4%]" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DigiLocker Integration</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">Active</span>
            <Badge variant="success">Verified</Badge>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Govt. of India e-Locker API synced</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Institutional Records</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {(db.documents || []).filter((d) => d.associatedType === 'school').length}
            </span>
            <span className="text-xs text-amber-600 font-bold">CBSE Compliant</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Affiliations, fire safety & fleet PUC</p>
        </Card>
      </div>

      {/* Search and Category Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, student, or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Audience:</span>
            {(['all', 'student', 'staff', 'school'] as TargetFilter[]).map((tgt) => (
              <button
                key={tgt}
                onClick={() => setSelectedTarget(tgt)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  selectedTarget === tgt
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tgt === 'school' ? 'Institution' : tgt}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const isPdf = doc.fileType.toUpperCase() === 'PDF';

          return (
            <Card
              key={doc.id}
              className="p-4 hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                        isPdf
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/50'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 border border-sky-200 dark:border-sky-900/50'
                      }`}
                    >
                      {doc.fileType}
                    </div>
                    <div>
                      <Badge
                        variant={
                          doc.category === 'Academic'
                            ? 'info'
                            : doc.category === 'Identity'
                            ? 'warning'
                            : doc.category === 'Medical'
                            ? 'danger'
                            : doc.category === 'Admission'
                            ? 'success'
                            : 'neutral'
                        }
                      >
                        {doc.category}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">{doc.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                      title="Preview Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSimulatedDownload(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {canAccess('documents', 'delete') && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-500 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {doc.associatedType === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                  {doc.associatedType === 'staff' && <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  {doc.associatedType === 'school' && <Building className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className="truncate font-medium">{doc.associatedName}</span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {doc.uploadedDate}
                </span>
                <span className="truncate max-w-[120px]">By {doc.uploadedBy}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No Documents Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or category filter.
          </p>
        </Card>
      )}

      {/* Document Interactive Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title="Document Vault Inspection"
          size="lg"
        >
          <div className="space-y-6">
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {previewDoc.category} Record
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Associated With: <span className="font-semibold text-slate-800 dark:text-slate-200">{previewDoc.associatedName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={() => handleSimulatedDownload(previewDoc)}
                >
                  Download
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Printer}
                  onClick={() => {
                    showToast('Printing Record', 'Preparing official print spooler...', 'info');
                    window.print();
                  }}
                >
                  Print
                </Button>
              </div>
            </div>

            {/* Document Digital Paper Preview Frame */}
            <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* School Header Watermark */}
                <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm mb-1.5 shadow-md shadow-indigo-600/30">
                    S
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                    Delhi Smart International Academy
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    CBSE Affiliated No. CBSE/AFF/2026/9824 • Institutional Area, New Delhi
                  </p>
                </div>

                {/* Simulated Certificate Content */}
                <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 py-4">
                  <div className="flex justify-between items-center text-[11px] font-mono border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-slate-400">RECORD REF:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      SEC-REC-{previewDoc.id.replace('doc-', '2026-')}
                    </span>
                  </div>

                  <div className="text-center py-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                      Official Document Subject
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {previewDoc.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Candidate / Subject:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{previewDoc.associatedName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Verification Status:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> DigiLocker Verified
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Filing Timestamp:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{previewDoc.uploadedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vault Cryptographic Hash:</span>
                      <span className="font-mono text-[9px] text-slate-500 truncate block">
                        SHA256: 4f9e8a2b...7c1d
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 text-center italic pt-2">
                    "This institutional record has been digitally authenticated and archived within the SmartSchool OS Zero-Trust Vault."
                  </p>
                </div>

                {/* Digital Stamp / Signature Banner */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                        Dr. Rajesh Sharma
                      </div>
                      <div className="text-[9px] text-slate-400">Head of Institution</div>
                    </div>
                  </div>

                  <div className="border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg text-right">
                    <span className="text-[9px] font-mono text-indigo-700 dark:text-indigo-300 font-bold block">
                      DIGITALLY SIGNED
                    </span>
                    <span className="text-[8px] text-slate-400">Valid CBSE Seal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload to Secure Document Vault"
          size="md"
        >
          <form onSubmit={handleUploadDocument} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 8 Term 1 Marksheet or Passport Scan"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Admission">Admission</option>
                  <option value="Identity">Identity & KYC</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Medical">Medical</option>
                  <option value="Employment">Employment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Associated Target
                </label>
                <select
                  value={newTargetType}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    setNewTargetType(type);
                    if (type === 'student') setNewTargetId(db.students[0]?.id || '');
                    else if (type === 'staff') setNewTargetId(db.users[0]?.id || '');
                    else setNewTargetId('school-main');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff Member</option>
                  <option value="school">Institution / School-Wide</option>
                </select>
              </div>
            </div>

            {newTargetType === 'student' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student
                </label>
                <select
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {db.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classSection}) - Roll {s.rollNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {newTargetType === 'staff' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Staff Member
                </label>
                <select
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {db.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.roleTitle})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Simulated Drag & Drop Zone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-950/40 hover:bg-indigo-50/30 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Drag & Drop files here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports PDF, JPG, PNG up to 25 MB</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={UploadCloud}>
                Store & Index Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
