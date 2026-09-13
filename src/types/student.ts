export interface Student {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  name: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  classSection: string; // "Class 8A"
  academicYear: string;
  branchId: string;
  branchName: string;
  
  // Contacts & Address
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Medical & Background
  medicalConditions: string[];
  allergies: string[];
  previousSchool: string;
  admissionDate: string;
  house: 'Red Phoenix' | 'Blue Dragons' | 'Green Falcons' | 'Gold Eagles';

  // Relations & Flags
  parentIds: string[];
  parentName: string;
  parentPhone: string;
  parentEmail: string;

  // Transport & Library
  transportRouteId?: string;
  transportStopName?: string;
  busNumber?: string;
  libraryCardNumber?: string;
  activeBooksCount: number;

  // Status
  status: 'active' | 'promoted' | 'detained' | 'transferred' | 'graduated' | 'withdrawn';
  createdAt: string;
}

export interface Parent {
  id: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  occupation: string;
  organization: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  communicationPreference: 'All' | 'SMS' | 'Email' | 'WhatsApp';
  linkedStudentIds: string[];
  avatarUrl: string;
}

export type AdmissionStatus =
  | 'New'
  | 'Contacted'
  | 'Application Received'
  | 'Under Review'
  | 'Document Verified'
  | 'Assessment Scheduled'
  | 'Interview Completed'
  | 'Accepted'
  | 'Rejected'
  | 'Joined'
  | 'Cancelled';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  studentName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  appliedClass: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool: string;
  status: AdmissionStatus;
  appliedDate: string;
  assessmentScore?: number;
  interviewNotes?: string;
  verifiedDocuments: string[];
  assignedStudentId?: string;
}
