import { User, DeviceSession } from '../types/auth';
import { AcademicYear, Branch, SchoolClass, Section, Subject, TimetablePeriod, HomeworkItem, Assignment, AssignmentSubmission } from '../types/academic';
import { Student, Parent, AdmissionApplication } from '../types/student';
import { AttendanceRecord, StaffAttendanceRecord } from '../types/attendance';
import { Examination, ExamSubject, StudentMark, ReportCard, GradingRule } from '../types/exam';
import { FeeStructure, StudentFeeInvoice, FeePayment, PayrollRecord } from '../types/finance';
import { Book, BookTransaction, InventoryItem, TransportRoute, StudentTransportAllocation } from '../types/operations';
import { AuditLog, Announcement, NotificationItem, CalendarEvent, LeaveRequest, DocumentItem, SchoolConfig } from '../types/system';

export interface SmartSchoolDatabase {
  users: User[];
  sessions: DeviceSession[];
  academicYears: AcademicYear[];
  branches: Branch[];
  classes: SchoolClass[];
  sections: Section[];
  subjects: Subject[];
  timetables: TimetablePeriod[];
  homework: HomeworkItem[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  students: Student[];
  parents: Parent[];
  admissions: AdmissionApplication[];
  attendance: AttendanceRecord[];
  staffAttendance: StaffAttendanceRecord[];
  exams: Examination[];
  examSubjects: ExamSubject[];
  marks: StudentMark[];
  reportCards: ReportCard[];
  gradingRules: GradingRule[];
  feeStructures: FeeStructure[];
  feeInvoices: StudentFeeInvoice[];
  feePayments: FeePayment[];
  payroll: PayrollRecord[];
  books: Book[];
  bookTransactions: BookTransaction[];
  inventory: InventoryItem[];
  routes: TransportRoute[];
  studentTransport: StudentTransportAllocation[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  calendarEvents: CalendarEvent[];
  leaveRequests: LeaveRequest[];
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  schoolConfig: SchoolConfig;
}

// Initial Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 'usr-principal',
    name: 'Dr. Rajesh Sharma',
    email: 'principal@demo.com',
    role: 'principal',
    roleTitle: 'Principal & Head of School',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
  },
  {
    id: 'usr-teacher',
    name: 'Rahul Kumar',
    email: 'teacher@demo.com',
    role: 'teacher',
    roleTitle: 'Senior Mathematics Teacher (Class 8A Teacher)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22334',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
    assignedClassId: 'cls-8',
    assignedSectionId: 'sec-8a',
  },
  {
    id: 'usr-accountant',
    name: 'Priya Sharma',
    email: 'accountant@demo.com',
    role: 'accountant',
    roleTitle: 'Chief Accounts Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98222 33445',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
  },
  {
    id: 'usr-librarian',
    name: 'Sunita Patel',
    email: 'librarian@demo.com',
    role: 'librarian',
    roleTitle: 'Chief Librarian & Resource Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98333 44556',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
  },
  {
    id: 'usr-driver',
    name: 'Manoj Singh',
    email: 'driver@demo.com',
    role: 'driver',
    roleTitle: 'Senior Transport Executive (Route 04)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98444 55667',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
    assignedRouteId: 'route-4',
  },
  {
    id: 'usr-parent',
    name: 'Vikram Mehta',
    email: 'parent@demo.com',
    role: 'parent',
    roleTitle: 'Guardian of Ravi Kumar (8A)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98555 66778',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
    linkedStudentIds: ['std-1'],
  },
  {
    id: 'usr-student',
    name: 'Ravi Kumar',
    email: 'student@demo.com',
    role: 'student',
    roleTitle: 'Student (Class 8A, Roll 12)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98666 77889',
    branchId: 'branch-1',
    branchName: 'Main Campus (New Delhi)',
    isAllowedDesktop: true,
    isAllowedMobile: true,
    linkedStudentIds: ['std-1'],
  },
];

const INITIAL_SESSIONS: DeviceSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-principal',
    deviceName: 'MacBook Pro 16 (Admin Office)',
    deviceType: 'desktop',
    browser: 'Chrome 128 on macOS',
    ipAddress: '192.168.1.10',
    lastActive: 'Just now',
    createdAt: '2026-09-01 08:30',
    isRevoked: false,
  },
  {
    id: 'sess-2',
    userId: 'usr-teacher',
    deviceName: 'iPhone 15 Pro (Campus Wi-Fi)',
    deviceType: 'mobile',
    browser: 'Mobile Safari on iOS',
    ipAddress: '192.168.1.45',
    lastActive: '5 mins ago',
    createdAt: '2026-09-10 09:12',
    isRevoked: false,
  },
  {
    id: 'sess-3',
    userId: 'usr-driver',
    deviceName: 'Samsung Galaxy A54 (Bus #04 Dashboard)',
    deviceType: 'mobile',
    browser: 'Chrome Mobile on Android',
    ipAddress: '103.21.144.12',
    lastActive: 'Active - En Route',
    createdAt: '2026-09-13 06:45',
    isRevoked: false,
  },
];

const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2025-26', name: '2025–26', startDate: '2025-04-01', endDate: '2026-03-31', isCurrent: true, status: 'active' },
  { id: 'ay-2026-27', name: '2026–27', startDate: '2026-04-01', endDate: '2027-03-31', isCurrent: false, status: 'upcoming' },
];

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'Main Campus',
    code: 'DEL-MAIN',
    city: 'New Delhi',
    address: 'Plot 14, Institutional Area, Vasant Kunj, New Delhi',
    phone: '+91 11 2612 3456',
    principalName: 'Dr. Rajesh Sharma',
  },
  {
    id: 'branch-2',
    name: 'Junior Campus',
    code: 'BLR-JNR',
    city: 'Bengaluru',
    address: '88 Green Glen Layout, Bellandur, Bengaluru',
    phone: '+91 80 4112 7890',
    principalName: 'Mrs. Shweta Rao',
  },
];

const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'cls-nur', name: 'Nursery', numericGrade: 0, sections: ['Nursery A', 'Nursery B'] },
  { id: 'cls-lkg', name: 'LKG', numericGrade: 1, sections: ['LKG A', 'LKG B'] },
  { id: 'cls-ukg', name: 'UKG', numericGrade: 2, sections: ['UKG A', 'UKG B'] },
  { id: 'cls-1', name: 'Class 1', numericGrade: 3, sections: ['Class 1A', 'Class 1B'] },
  { id: 'cls-2', name: 'Class 2', numericGrade: 4, sections: ['Class 2A', 'Class 2B'] },
  { id: 'cls-3', name: 'Class 3', numericGrade: 5, sections: ['Class 3A', 'Class 3B'] },
  { id: 'cls-4', name: 'Class 4', numericGrade: 6, sections: ['Class 4A', 'Class 4B'] },
  { id: 'cls-5', name: 'Class 5', numericGrade: 7, sections: ['Class 5A', 'Class 5B'] },
  { id: 'cls-6', name: 'Class 6', numericGrade: 8, sections: ['Class 6A', 'Class 6B'] },
  { id: 'cls-7', name: 'Class 7', numericGrade: 9, sections: ['Class 7A', 'Class 7B'] },
  { id: 'cls-8', name: 'Class 8', numericGrade: 10, sections: ['Class 8A', 'Class 8B'] },
  { id: 'cls-9', name: 'Class 9', numericGrade: 11, sections: ['Class 9A', 'Class 9B'] },
  { id: 'cls-10', name: 'Class 10', numericGrade: 12, sections: ['Class 10A', 'Class 10B'] },
];

const INITIAL_SECTIONS: Section[] = [
  // Nursery
  { id: 'sec-nur-a', classId: 'cls-nur', className: 'Nursery', sectionName: 'A', fullName: 'Nursery A', classTeacherId: 'usr-teacher-nur-a', classTeacherName: 'Sunita Sharma', roomNumber: 'Room 101', capacity: 30, studentCount: 24 },
  { id: 'sec-nur-b', classId: 'cls-nur', className: 'Nursery', sectionName: 'B', fullName: 'Nursery B', classTeacherId: 'usr-teacher-nur-b', classTeacherName: 'Pooja Bhatia', roomNumber: 'Room 102', capacity: 30, studentCount: 22 },
  // LKG
  { id: 'sec-lkg-a', classId: 'cls-lkg', className: 'LKG', sectionName: 'A', fullName: 'LKG A', classTeacherId: 'usr-teacher-lkg-a', classTeacherName: 'Kavita Joshi', roomNumber: 'Room 103', capacity: 35, studentCount: 28 },
  { id: 'sec-lkg-b', classId: 'cls-lkg', className: 'LKG', sectionName: 'B', fullName: 'LKG B', classTeacherId: 'usr-teacher-lkg-b', classTeacherName: 'Rekha Menon', roomNumber: 'Room 104', capacity: 35, studentCount: 26 },
  // UKG
  { id: 'sec-ukg-a', classId: 'cls-ukg', className: 'UKG', sectionName: 'A', fullName: 'UKG A', classTeacherId: 'usr-teacher-ukg-a', classTeacherName: 'Monika Roy', roomNumber: 'Room 105', capacity: 35, studentCount: 30 },
  { id: 'sec-ukg-b', classId: 'cls-ukg', className: 'UKG', sectionName: 'B', fullName: 'UKG B', classTeacherId: 'usr-teacher-ukg-b', classTeacherName: 'Shalini Saxena', roomNumber: 'Room 106', capacity: 35, studentCount: 29 },
  // Class 1
  { id: 'sec-1a', classId: 'cls-1', className: 'Class 1', sectionName: 'A', fullName: 'Class 1A', classTeacherId: 'usr-teacher-1a', classTeacherName: 'Geeta Nair', roomNumber: 'Room 107', capacity: 40, studentCount: 32 },
  { id: 'sec-1b', classId: 'cls-1', className: 'Class 1', sectionName: 'B', fullName: 'Class 1B', classTeacherId: 'usr-teacher-1b', classTeacherName: 'Smita Patel', roomNumber: 'Room 108', capacity: 40, studentCount: 34 },
  // Class 2
  { id: 'sec-2a', classId: 'cls-2', className: 'Class 2', sectionName: 'A', fullName: 'Class 2A', classTeacherId: 'usr-teacher-2a', classTeacherName: 'Poonam Yadav', roomNumber: 'Room 109', capacity: 40, studentCount: 35 },
  { id: 'sec-2b', classId: 'cls-2', className: 'Class 2', sectionName: 'B', fullName: 'Class 2B', classTeacherId: 'usr-teacher-2b', classTeacherName: 'Archana Singh', roomNumber: 'Room 110', capacity: 40, studentCount: 33 },
  // Class 3
  { id: 'sec-3a', classId: 'cls-3', className: 'Class 3', sectionName: 'A', fullName: 'Class 3A', classTeacherId: 'usr-teacher-3a', classTeacherName: 'Vandana Mishra', roomNumber: 'Room 111', capacity: 40, studentCount: 36 },
  { id: 'sec-3b', classId: 'cls-3', className: 'Class 3', sectionName: 'B', fullName: 'Class 3B', classTeacherId: 'usr-teacher-3b', classTeacherName: 'Nidhi Gupta', roomNumber: 'Room 112', capacity: 40, studentCount: 35 },
  // Class 4
  { id: 'sec-4a', classId: 'cls-4', className: 'Class 4', sectionName: 'A', fullName: 'Class 4A', classTeacherId: 'usr-teacher-4a', classTeacherName: 'Ritu Aggarwal', roomNumber: 'Room 201', capacity: 40, studentCount: 38 },
  { id: 'sec-4b', classId: 'cls-4', className: 'Class 4', sectionName: 'B', fullName: 'Class 4B', classTeacherId: 'usr-teacher-4b', classTeacherName: 'Swati Kulkarni', roomNumber: 'Room 202', capacity: 40, studentCount: 36 },
  // Class 5
  { id: 'sec-5a', classId: 'cls-5', className: 'Class 5', sectionName: 'A', fullName: 'Class 5A', classTeacherId: 'usr-teacher-5a', classTeacherName: 'Preeti Deshmukh', roomNumber: 'Room 203', capacity: 40, studentCount: 38 },
  { id: 'sec-5b', classId: 'cls-5', className: 'Class 5', sectionName: 'B', fullName: 'Class 5B', classTeacherId: 'usr-teacher-5b', classTeacherName: 'Alka Saxena', roomNumber: 'Room 204', capacity: 40, studentCount: 37 },
  // Class 6
  { id: 'sec-6a', classId: 'cls-6', className: 'Class 6', sectionName: 'A', fullName: 'Class 6A', classTeacherId: 'usr-teacher-6a', classTeacherName: 'Manoj Tiwari', roomNumber: 'Room 205', capacity: 40, studentCount: 39 },
  { id: 'sec-6b', classId: 'cls-6', className: 'Class 6', sectionName: 'B', fullName: 'Class 6B', classTeacherId: 'usr-teacher-6b', classTeacherName: 'Harish Chandra', roomNumber: 'Room 206', capacity: 40, studentCount: 38 },
  // Class 7
  { id: 'sec-7a', classId: 'cls-7', className: 'Class 7', sectionName: 'A', fullName: 'Class 7A', classTeacherId: 'usr-teacher-7a', classTeacherName: 'Anupam Bhattacharya', roomNumber: 'Room 207', capacity: 40, studentCount: 37 },
  { id: 'sec-7b', classId: 'cls-7', className: 'Class 7', sectionName: 'B', fullName: 'Class 7B', classTeacherId: 'usr-teacher-7b', classTeacherName: 'Vikram Sethi', roomNumber: 'Room 208', capacity: 40, studentCount: 36 },
  // Class 8
  { id: 'sec-8a', classId: 'cls-8', className: 'Class 8', sectionName: 'A', fullName: 'Class 8A', classTeacherId: 'usr-teacher', classTeacherName: 'Rahul Kumar', roomNumber: 'Room 301', capacity: 40, studentCount: 36 },
  { id: 'sec-8b', classId: 'cls-8', className: 'Class 8', sectionName: 'B', fullName: 'Class 8B', classTeacherId: 'usr-teacher-2', classTeacherName: 'Anjali Rao', roomNumber: 'Room 302', capacity: 40, studentCount: 38 },
  // Class 9
  { id: 'sec-9a', classId: 'cls-9', className: 'Class 9', sectionName: 'A', fullName: 'Class 9A', classTeacherId: 'usr-teacher-3', classTeacherName: 'Deepak Verma', roomNumber: 'Room 303', capacity: 40, studentCount: 35 },
  { id: 'sec-9b', classId: 'cls-9', className: 'Class 9', sectionName: 'B', fullName: 'Class 9B', classTeacherId: 'usr-teacher-9b', classTeacherName: 'Dr. Neha Kapoor', roomNumber: 'Room 304', capacity: 40, studentCount: 37 },
  // Class 10
  { id: 'sec-10a', classId: 'cls-10', className: 'Class 10', sectionName: 'A', fullName: 'Class 10A', classTeacherId: 'usr-teacher-4', classTeacherName: 'Meenakshi Iyer', roomNumber: 'Room 401', capacity: 40, studentCount: 37 },
  { id: 'sec-10b', classId: 'cls-10', className: 'Class 10', sectionName: 'B', fullName: 'Class 10B', classTeacherId: 'usr-teacher-10b', classTeacherName: 'Sanjay Rawat', roomNumber: 'Room 402', capacity: 40, studentCount: 36 },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-found', name: 'Foundational Literacy & Numeracy', code: 'FLN-001', department: 'Early Childhood', isElective: false, isPractical: true, classIds: ['cls-nur', 'cls-lkg', 'cls-ukg'] },
  { id: 'sub-rhymes', name: 'Rhymes, Storytelling & Motor Skills', code: 'RSM-002', department: 'Early Childhood', isElective: false, isPractical: true, classIds: ['cls-nur', 'cls-lkg', 'cls-ukg'] },
  { id: 'sub-evs', name: 'Environmental Studies (EVS)', code: 'EVS-101', department: 'Primary Sciences', isElective: false, isPractical: true, classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'] },
  { id: 'sub-math', name: 'Mathematics', code: 'MATH-101', department: 'Science & Math', isElective: false, isPractical: false, classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5', 'cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
  { id: 'sub-sci', name: 'General Science', code: 'SCI-102', department: 'Science & Math', isElective: false, isPractical: true, classIds: ['cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
  { id: 'sub-eng', name: 'English Literature & Grammar', code: 'ENG-103', department: 'Languages', isElective: false, isPractical: false, classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5', 'cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
  { id: 'sub-sst', name: 'Social Studies & Civics', code: 'SST-104', department: 'Humanities', isElective: false, isPractical: false, classIds: ['cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
  { id: 'sub-cs', name: 'Computer Science & AI Coding', code: 'CS-105', department: 'Technology', isElective: true, isPractical: true, classIds: ['cls-3', 'cls-4', 'cls-5', 'cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
  { id: 'sub-hin', name: 'Hindi Core & Vyakaran', code: 'HIN-106', department: 'Languages', isElective: false, isPractical: false, classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5', 'cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'] },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    admissionNumber: 'SMS-2024-0012',
    rollNumber: '12',
    name: 'Ravi Kumar',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2012-05-14',
    gender: 'Male',
    bloodGroup: 'B+',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'ravi.kumar@smartschool.edu',
    phone: '+91 98666 77889',
    address: 'B-42, Sector 15, Vasant Vihar',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110057',
    emergencyContactName: 'Vikram Mehta (Father)',
    emergencyContactPhone: '+91 98555 66778',
    emergencyContactRelation: 'Father',
    medicalConditions: ['Mild Asthma inhaler kept with medical room'],
    allergies: ['Peanuts'],
    previousSchool: 'Delhi Public Academy',
    admissionDate: '2024-04-05',
    house: 'Blue Dragons',
    parentIds: ['parent-1'],
    parentName: 'Vikram Mehta',
    parentPhone: '+91 98555 66778',
    parentEmail: 'vikram.mehta@example.com',
    transportRouteId: 'route-4',
    transportStopName: 'Vasant Vihar Metro Gate 2',
    busNumber: 'DL-01-AB-1234',
    libraryCardNumber: 'LIB-2025-0812',
    activeBooksCount: 2,
    status: 'active',
    createdAt: '2024-04-05',
  },
  {
    id: 'std-2',
    admissionNumber: 'SMS-2024-0015',
    rollNumber: '15',
    name: 'Priya Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2012-08-22',
    gender: 'Female',
    bloodGroup: 'O+',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'priya.sharma@smartschool.edu',
    phone: '+91 98777 88990',
    address: 'Flat 302, Palm Grove Apts, Munirka',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110067',
    emergencyContactName: 'Rajesh Sharma',
    emergencyContactPhone: '+91 98777 11223',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'St. Mary Convent',
    admissionDate: '2024-04-06',
    house: 'Red Phoenix',
    parentIds: ['parent-2'],
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98777 11223',
    parentEmail: 'rajesh.sharma@example.com',
    transportRouteId: 'route-4',
    transportStopName: 'Munirka Crossing',
    busNumber: 'DL-01-AB-1234',
    libraryCardNumber: 'LIB-2025-0815',
    activeBooksCount: 1,
    status: 'active',
    createdAt: '2024-04-06',
  },
  {
    id: 'std-3',
    admissionNumber: 'SMS-2024-0018',
    rollNumber: '18',
    name: 'Arun Reddy',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2012-03-10',
    gender: 'Male',
    bloodGroup: 'A+',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'arun.reddy@smartschool.edu',
    phone: '+91 98888 99001',
    address: 'House 19, Hauz Khas Enclave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    emergencyContactName: 'Suresh Reddy',
    emergencyContactPhone: '+91 98888 33445',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: ['Dust'],
    previousSchool: 'National Public School',
    admissionDate: '2024-04-07',
    house: 'Green Falcons',
    parentIds: ['parent-3'],
    parentName: 'Suresh Reddy',
    parentPhone: '+91 98888 33445',
    parentEmail: 'suresh.reddy@example.com',
    transportRouteId: 'route-4',
    transportStopName: 'Hauz Khas Market',
    busNumber: 'DL-01-AB-1234',
    libraryCardNumber: 'LIB-2025-0818',
    activeBooksCount: 0,
    status: 'active',
    createdAt: '2024-04-07',
  },
  {
    id: 'std-4',
    admissionNumber: 'SMS-2024-0021',
    rollNumber: '21',
    name: 'Ananya Gupta',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2012-11-04',
    gender: 'Female',
    bloodGroup: 'AB+',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'ananya.gupta@smartschool.edu',
    phone: '+91 98999 11223',
    address: 'C-104, Saket Greens',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    emergencyContactName: 'Sunil Gupta',
    emergencyContactPhone: '+91 98999 44556',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'Lotus Valley International',
    admissionDate: '2024-04-08',
    house: 'Gold Eagles',
    parentIds: ['parent-4'],
    parentName: 'Sunil Gupta',
    parentPhone: '+91 98999 44556',
    parentEmail: 'sunil.gupta@example.com',
    transportRouteId: 'route-2',
    transportStopName: 'Saket City Center',
    busNumber: 'DL-01-AB-5678',
    libraryCardNumber: 'LIB-2025-0821',
    activeBooksCount: 2,
    status: 'active',
    createdAt: '2024-04-08',
  },
  {
    id: 'std-nur-1',
    admissionNumber: 'SMS-2026-0001',
    rollNumber: '01',
    name: 'Aarav Mehta',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2022-08-15',
    gender: 'Male',
    bloodGroup: 'O+',
    classSection: 'Nursery A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'aarav.mehta@smartschool.edu',
    phone: '+91 98111 00111',
    address: 'A-12, Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    emergencyContactName: 'Manish Mehta',
    emergencyContactPhone: '+91 98111 00111',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'Toddlers Bloom Daycare',
    admissionDate: '2025-03-10',
    house: 'Red Phoenix',
    parentIds: ['parent-1'],
    parentName: 'Manish Mehta',
    parentPhone: '+91 98111 00111',
    parentEmail: 'manish.mehta@example.com',
    libraryCardNumber: 'LIB-2026-0001',
    activeBooksCount: 0,
    status: 'active',
    createdAt: '2025-03-10',
  },
  {
    id: 'std-lkg-1',
    admissionNumber: 'SMS-2025-0015',
    rollNumber: '03',
    name: 'Myra Kapoor',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2021-09-20',
    gender: 'Female',
    bloodGroup: 'B+',
    classSection: 'LKG A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'myra.kapoor@smartschool.edu',
    phone: '+91 98222 00222',
    address: 'B-88, Safdarjung Enclave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    emergencyContactName: 'Rohan Kapoor',
    emergencyContactPhone: '+91 98222 00222',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'Little Angels Nursery',
    admissionDate: '2024-03-12',
    house: 'Blue Dragons',
    parentIds: ['parent-2'],
    parentName: 'Rohan Kapoor',
    parentPhone: '+91 98222 00222',
    parentEmail: 'rohan.kapoor@example.com',
    libraryCardNumber: 'LIB-2025-0015',
    activeBooksCount: 1,
    status: 'active',
    createdAt: '2024-03-12',
  },
  {
    id: 'std-ukg-1',
    admissionNumber: 'SMS-2024-0040',
    rollNumber: '05',
    name: 'Vihaan Singhania',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2020-07-11',
    gender: 'Male',
    bloodGroup: 'A+',
    classSection: 'UKG A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'vihaan.singhania@smartschool.edu',
    phone: '+91 98333 00333',
    address: 'C-44, Panchsheel Park',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    emergencyContactName: 'Dev Singhania',
    emergencyContactPhone: '+91 98333 00333',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'SmartSchool Nursery',
    admissionDate: '2023-04-01',
    house: 'Green Falcons',
    parentIds: ['parent-3'],
    parentName: 'Dev Singhania',
    parentPhone: '+91 98333 00333',
    parentEmail: 'dev.singhania@example.com',
    libraryCardNumber: 'LIB-2024-0040',
    activeBooksCount: 1,
    status: 'active',
    createdAt: '2023-04-01',
  },
  {
    id: 'std-1-1',
    admissionNumber: 'SMS-2024-0101',
    rollNumber: '02',
    name: 'Ananya Bose',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2019-06-18',
    gender: 'Female',
    bloodGroup: 'O+',
    classSection: 'Class 1A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'ananya.bose@smartschool.edu',
    phone: '+91 98444 00444',
    address: 'Flat 302, Vasant Kunj Sector B',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110070',
    emergencyContactName: 'Somen Bose',
    emergencyContactPhone: '+91 98444 00444',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'SmartSchool UKG',
    admissionDate: '2024-04-02',
    house: 'Gold Eagles',
    parentIds: ['parent-4'],
    parentName: 'Somen Bose',
    parentPhone: '+91 98444 00444',
    parentEmail: 'somen.bose@example.com',
    libraryCardNumber: 'LIB-2024-0101',
    activeBooksCount: 2,
    status: 'active',
    createdAt: '2024-04-02',
  },
  {
    id: 'std-5-1',
    admissionNumber: 'SMS-2022-0505',
    rollNumber: '14',
    name: 'Aditya Nair',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2015-10-05',
    gender: 'Male',
    bloodGroup: 'AB+',
    classSection: 'Class 5A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'aditya.nair@smartschool.edu',
    phone: '+91 98555 00555',
    address: 'Villa 12, Gulmohar Park',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110049',
    emergencyContactName: 'Girish Nair',
    emergencyContactPhone: '+91 98555 00555',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'City Montessori School',
    admissionDate: '2022-04-05',
    house: 'Red Phoenix',
    parentIds: ['parent-1'],
    parentName: 'Girish Nair',
    parentPhone: '+91 98555 00555',
    parentEmail: 'girish.nair@example.com',
    libraryCardNumber: 'LIB-2022-0505',
    activeBooksCount: 1,
    status: 'active',
    createdAt: '2022-04-05',
  },
  {
    id: 'std-10-1',
    admissionNumber: 'SMS-2020-1010',
    rollNumber: '10',
    name: 'Arjun Reddy',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2010-02-12',
    gender: 'Male',
    bloodGroup: 'B+',
    classSection: 'Class 10A',
    academicYear: '2025–26',
    branchId: 'branch-1',
    branchName: 'Main Campus',
    email: 'arjun.reddy@smartschool.edu',
    phone: '+91 98666 00666',
    address: 'H-90, Greater Kailash Part 1',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110048',
    emergencyContactName: 'Dr. Suresh Reddy',
    emergencyContactPhone: '+91 98666 00666',
    emergencyContactRelation: 'Father',
    medicalConditions: [],
    allergies: [],
    previousSchool: 'SmartSchool Class 9',
    admissionDate: '2020-04-01',
    house: 'Blue Dragons',
    parentIds: ['parent-2'],
    parentName: 'Dr. Suresh Reddy',
    parentPhone: '+91 98666 00666',
    parentEmail: 'suresh.reddy@example.com',
    libraryCardNumber: 'LIB-2020-1010',
    activeBooksCount: 3,
    status: 'active',
    createdAt: '2020-04-01',
  },
];

const INITIAL_PARENTS: Parent[] = [
  {
    id: 'parent-1',
    name: 'Vikram Mehta',
    relationship: 'Father',
    occupation: 'Senior Solutions Architect',
    organization: 'Tata Consultancy Services',
    phone: '+91 98555 66778',
    email: 'vikram.mehta@example.com',
    address: 'B-42, Sector 15, Vasant Vihar, New Delhi',
    emergencyContact: '+91 98555 11223',
    communicationPreference: 'All',
    linkedStudentIds: ['std-1'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'parent-2',
    name: 'Rajesh Sharma',
    relationship: 'Father',
    occupation: 'Director of Operations',
    organization: 'HDFC Bank',
    phone: '+91 98777 11223',
    email: 'rajesh.sharma@example.com',
    address: 'Flat 302, Palm Grove Apts, Munirka, New Delhi',
    emergencyContact: '+91 98777 88990',
    communicationPreference: 'WhatsApp',
    linkedStudentIds: ['std-2'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-2026-101',
    applicationNumber: 'APP-2026-0891',
    studentName: 'Aarav Singhania',
    gender: 'Male',
    dateOfBirth: '2013-02-18',
    appliedClass: 'Class 8',
    parentName: 'Nitin Singhania',
    parentEmail: 'nitin.s@example.com',
    parentPhone: '+91 98123 45678',
    address: 'Tower 4, DLF Cyber City, Gurugram',
    previousSchool: 'The Heritage School',
    status: 'Interview Completed',
    appliedDate: '2026-08-20',
    assessmentScore: 92,
    interviewNotes: 'Strong analytical skills, fluent in English, recommended for Section 8A.',
    verifiedDocuments: ['Birth Certificate', 'Previous Report Card', 'Aadhaar Card', 'Transfer Certificate'],
  },
  {
    id: 'adm-2026-102',
    applicationNumber: 'APP-2026-0892',
    studentName: 'Zoya Khan',
    gender: 'Female',
    dateOfBirth: '2013-06-25',
    appliedClass: 'Class 8',
    parentName: 'Imran Khan',
    parentEmail: 'imran.khan@example.com',
    parentPhone: '+91 98234 56789',
    address: '45 Nizamuddin West, New Delhi',
    previousSchool: 'Modern School Barakhamba',
    status: 'Application Received',
    appliedDate: '2026-09-02',
    verifiedDocuments: ['Birth Certificate', 'Transfer Certificate'],
  },
  {
    id: 'adm-2026-103',
    applicationNumber: 'APP-2026-0893',
    studentName: 'Kabir Mukherjee',
    gender: 'Male',
    dateOfBirth: '2012-09-14',
    appliedClass: 'Class 9',
    parentName: 'Debashish Mukherjee',
    parentEmail: 'debashish.m@example.com',
    parentPhone: '+91 98345 67890',
    address: 'CR Park, Block K, New Delhi',
    previousSchool: 'Don Bosco School',
    status: 'Under Review',
    appliedDate: '2026-09-05',
    verifiedDocuments: ['Birth Certificate', 'Previous Marksheet'],
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-09-13',
    time: '08:45:00',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    rollNumber: '12',
    classSection: 'Class 8A',
    status: 'present',
    markedByTeacherId: 'usr-teacher',
    markedByTeacherName: 'Rahul Kumar',
    device: 'mobile',
    academicYear: '2025–26',
  },
  {
    id: 'att-2',
    date: '2026-09-13',
    time: '08:45:10',
    studentId: 'std-2',
    studentName: 'Priya Sharma',
    rollNumber: '15',
    classSection: 'Class 8A',
    status: 'present',
    markedByTeacherId: 'usr-teacher',
    markedByTeacherName: 'Rahul Kumar',
    device: 'mobile',
    academicYear: '2025–26',
  },
  {
    id: 'att-3',
    date: '2026-09-13',
    time: '08:45:20',
    studentId: 'std-3',
    studentName: 'Arun Reddy',
    rollNumber: '18',
    classSection: 'Class 8A',
    status: 'late',
    remarks: 'Bus delay at Hauz Khas flyover',
    markedByTeacherId: 'usr-teacher',
    markedByTeacherName: 'Rahul Kumar',
    device: 'mobile',
    academicYear: '2025–26',
  },
  {
    id: 'att-4',
    date: '2026-09-13',
    time: '08:45:30',
    studentId: 'std-4',
    studentName: 'Ananya Gupta',
    rollNumber: '21',
    classSection: 'Class 8A',
    status: 'absent',
    remarks: 'Medical leave requested by parent',
    markedByTeacherId: 'usr-teacher',
    markedByTeacherName: 'Rahul Kumar',
    device: 'mobile',
    academicYear: '2025–26',
  },
];

const INITIAL_TIMETABLES: TimetablePeriod[] = [
  { id: 'tt-1', classSection: 'Class 8A', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: 'Mathematics', teacherId: 'usr-teacher', teacherName: 'Rahul Kumar', room: 'Room 204' },
  { id: 'tt-2', classSection: 'Class 8A', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subject: 'Science', teacherId: 'usr-teacher-2', teacherName: 'Dr. Neha Kapoor', room: 'Lab 2' },
  { id: 'tt-3', classSection: 'Class 8A', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:15 AM', endTime: '11:00 AM', subject: 'English Literature', teacherId: 'usr-teacher-3', teacherName: 'Ananya Sen', room: 'Room 204' },
  { id: 'tt-4', classSection: 'Class 8A', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:00 AM', endTime: '11:45 AM', subject: 'Social Studies', teacherId: 'usr-teacher-4', teacherName: 'Deepak Verma', room: 'Room 204' },
  { id: 'tt-5', classSection: 'Class 8A', dayOfWeek: 'Monday', periodNumber: 5, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Computer Science', teacherId: 'usr-teacher-5', teacherName: 'Sanjay Rawat', room: 'IT Lab 1' },
];

const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    classSection: 'Class 8A',
    subject: 'Mathematics',
    title: 'Linear Equations in One Variable (Ex 2.3)',
    description: 'Solve questions 1 through 15 from Chapter 2 NCERT. Show step-by-step transposition.',
    assignedDate: '2026-09-12',
    dueDate: '2026-09-15',
    teacherName: 'Rahul Kumar',
    submissionCount: 28,
    totalStudents: 36,
  },
  {
    id: 'hw-2',
    classSection: 'Class 8A',
    subject: 'Science',
    title: 'Microorganisms: Friend and Foe - Lab Observations',
    description: 'Write a short summary on fermentation and pasteurization with real-world examples.',
    assignedDate: '2026-09-13',
    dueDate: '2026-09-16',
    teacherName: 'Dr. Neha Kapoor',
    submissionCount: 14,
    totalStudents: 36,
  },
];

const INITIAL_EXAMS: Examination[] = [
  {
    id: 'exam-midterm-1',
    name: 'Term 1 Mid-Term Examination 2025–26',
    examType: 'Mid-Term Examination',
    academicYear: '2025–26',
    startDate: '2026-09-20',
    endDate: '2026-09-28',
    classes: ['Class 8', 'Class 9', 'Class 10'],
    workflowStatus: 'principal_approved',
    isPublished: true,
  },
];

const INITIAL_EXAM_SUBJECTS: ExamSubject[] = [
  { id: 'es-1', examId: 'exam-midterm-1', subjectName: 'Mathematics', classSection: 'Class 8A', date: '2026-09-21', startTime: '09:00 AM', endTime: '11:30 AM', room: 'Hall A', maxMarks: 80, passingMarks: 27 },
  { id: 'es-2', examId: 'exam-midterm-1', subjectName: 'Science', classSection: 'Class 8A', date: '2026-09-23', startTime: '09:00 AM', endTime: '11:30 AM', room: 'Hall A', maxMarks: 80, passingMarks: 27 },
  { id: 'es-3', examId: 'exam-midterm-1', subjectName: 'English Literature', classSection: 'Class 8A', date: '2026-09-25', startTime: '09:00 AM', endTime: '11:30 AM', room: 'Hall A', maxMarks: 80, passingMarks: 27 },
];

const INITIAL_MARKS: StudentMark[] = [
  {
    id: 'mark-1',
    examId: 'exam-midterm-1',
    subjectName: 'Mathematics',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    rollNumber: '12',
    classSection: 'Class 8A',
    maxMarks: 80,
    obtainedMarks: 74,
    grade: 'A+',
    isAbsent: false,
    remarks: 'Outstanding logical grasp and algebraic problem solving',
    enteredByTeacherName: 'Rahul Kumar',
    status: 'published',
  },
  {
    id: 'mark-2',
    examId: 'exam-midterm-1',
    subjectName: 'Science',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    rollNumber: '12',
    classSection: 'Class 8A',
    maxMarks: 80,
    obtainedMarks: 68,
    grade: 'A',
    isAbsent: false,
    remarks: 'Good experimental concept clarity',
    enteredByTeacherName: 'Dr. Neha Kapoor',
    status: 'published',
  },
  {
    id: 'mark-3',
    examId: 'exam-midterm-1',
    subjectName: 'English Literature',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    rollNumber: '12',
    classSection: 'Class 8A',
    maxMarks: 80,
    obtainedMarks: 71,
    grade: 'A',
    isAbsent: false,
    remarks: 'Strong vocabulary and creative writing',
    enteredByTeacherName: 'Ananya Sen',
    status: 'published',
  },
];

const INITIAL_GRADING_RULES: GradingRule[] = [
  { grade: 'A+', minScore: 90, maxScore: 100, gradePoint: 10, description: 'Outstanding Performance' },
  { grade: 'A', minScore: 80, maxScore: 89.9, gradePoint: 9, description: 'Excellent Performance' },
  { grade: 'B+', minScore: 70, maxScore: 79.9, gradePoint: 8, description: 'Very Good Performance' },
  { grade: 'B', minScore: 60, maxScore: 69.9, gradePoint: 7, description: 'Good Performance' },
  { grade: 'C+', minScore: 50, maxScore: 59.9, gradePoint: 6, description: 'Above Average' },
  { grade: 'C', minScore: 40, maxScore: 49.9, gradePoint: 5, description: 'Average' },
  { grade: 'D', minScore: 33, maxScore: 39.9, gradePoint: 4, description: 'Marginal Pass' },
  { grade: 'F', minScore: 0, maxScore: 32.9, gradePoint: 0, description: 'Needs Improvement / Retest' },
];

const INITIAL_REPORT_CARDS: ReportCard[] = [
  {
    id: 'rep-std-1',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    admissionNumber: 'SMS-2024-0012',
    rollNumber: '12',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    examName: 'Term 1 Mid-Term Examination',
    issueDate: '2026-09-30',
    subjects: [
      { subjectName: 'Mathematics', maxMarks: 80, obtainedMarks: 74, grade: 'A+', remarks: 'Top scorer in algebra' },
      { subjectName: 'Science', maxMarks: 80, obtainedMarks: 68, grade: 'A', remarks: 'Excellent lab skills' },
      { subjectName: 'English Literature', maxMarks: 80, obtainedMarks: 71, grade: 'A', remarks: 'Good critical reading' },
    ],
    totalMaxMarks: 240,
    totalObtainedMarks: 213,
    percentage: 88.75,
    overallGrade: 'A',
    attendancePercentage: 96.4,
    rankInClass: 3,
    teacherRemarks: 'Ravi demonstrates exceptional discipline, active classroom participation, and strong teamwork.',
    principalRemarks: 'Promising student with excellent all-around progress. Keep aiming higher!',
    status: 'published',
  },
];

const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'fee-struct-nur-t1', className: 'Nursery', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 22000, dueDate: '2026-07-15' },
  { id: 'fee-struct-lkg-t1', className: 'LKG', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 24000, dueDate: '2026-07-15' },
  { id: 'fee-struct-ukg-t1', className: 'UKG', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 25000, dueDate: '2026-07-15' },
  { id: 'fee-struct-1-t1', className: 'Class 1', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 28000, dueDate: '2026-07-15' },
  { id: 'fee-struct-2-t1', className: 'Class 2', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 28000, dueDate: '2026-07-15' },
  { id: 'fee-struct-3-t1', className: 'Class 3', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 30000, dueDate: '2026-07-15' },
  { id: 'fee-struct-4-t1', className: 'Class 4', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 30000, dueDate: '2026-07-15' },
  { id: 'fee-struct-5-t1', className: 'Class 5', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 32000, dueDate: '2026-07-15' },
  { id: 'fee-struct-6-t1', className: 'Class 6', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 34000, dueDate: '2026-07-15' },
  { id: 'fee-struct-7-t1', className: 'Class 7', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 34000, dueDate: '2026-07-15' },
  { id: 'fee-struct-8-t1', className: 'Class 8', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 35000, dueDate: '2026-07-15' },
  { id: 'fee-struct-8-t2', className: 'Class 8', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 2', amount: 35000, dueDate: '2026-10-15' },
  { id: 'fee-struct-8-trans', className: 'Class 8', academicYear: '2025–26', category: 'Transport Fee', term: 'Monthly', amount: 3800, dueDate: '2026-09-10' },
  { id: 'fee-struct-8-exam', className: 'Class 8', academicYear: '2025–26', category: 'Examination Fee', term: 'Annual', amount: 2500, dueDate: '2026-08-01' },
  { id: 'fee-struct-9-t1', className: 'Class 9', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 38000, dueDate: '2026-07-15' },
  { id: 'fee-struct-10-t1', className: 'Class 10', academicYear: '2025–26', category: 'Tuition Fee', term: 'Term 1', amount: 42000, dueDate: '2026-07-15' },
];

const INITIAL_FEE_INVOICES: StudentFeeInvoice[] = [
  {
    id: 'inv-2026-081',
    invoiceNumber: 'INV-202526-081',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    rollNumber: '12',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    term: 'Term 1 + Transport',
    totalAmount: 41300,
    discountAmount: 2000,
    paidAmount: 41300,
    balanceAmount: 0,
    dueDate: '2026-07-15',
    status: 'paid',
    items: [
      { category: 'Tuition Fee', amount: 35000 },
      { category: 'Transport Fee', amount: 3800 },
      { category: 'Examination Fee', amount: 2500 },
    ],
  },
  {
    id: 'inv-2026-082',
    invoiceNumber: 'INV-202526-082',
    studentId: 'std-2',
    studentName: 'Priya Sharma',
    rollNumber: '15',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    term: 'Term 1 + Transport',
    totalAmount: 41300,
    discountAmount: 0,
    paidAmount: 25000,
    balanceAmount: 16300,
    dueDate: '2026-07-15',
    status: 'partial',
    items: [
      { category: 'Tuition Fee', amount: 35000 },
      { category: 'Transport Fee', amount: 3800 },
      { category: 'Examination Fee', amount: 2500 },
    ],
  },
  {
    id: 'inv-2026-083',
    invoiceNumber: 'INV-202526-083',
    studentId: 'std-3',
    studentName: 'Arun Reddy',
    rollNumber: '18',
    classSection: 'Class 8A',
    academicYear: '2025–26',
    term: 'Term 1',
    totalAmount: 37500,
    discountAmount: 0,
    paidAmount: 0,
    balanceAmount: 37500,
    dueDate: '2026-07-15',
    status: 'overdue',
    items: [
      { category: 'Tuition Fee', amount: 35000 },
      { category: 'Examination Fee', amount: 2500 },
    ],
  },
];

const INITIAL_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-001',
    receiptNumber: 'RCP-2026-9041',
    invoiceId: 'inv-2026-081',
    studentId: 'std-1',
    studentName: 'Ravi Kumar',
    classSection: 'Class 8A',
    amountPaid: 41300,
    paymentMethod: 'Online / UPI',
    transactionReference: 'UPI/20260714/891278',
    paidDate: '2026-07-14',
    collectedByUserId: 'usr-accountant',
    collectedByUserName: 'Priya Sharma',
    device: 'desktop',
    notes: 'Paid via Razorpay Netbanking - Verified',
  },
  {
    id: 'pay-002',
    receiptNumber: 'RCP-2026-9042',
    invoiceId: 'inv-2026-082',
    studentId: 'std-2',
    studentName: 'Priya Sharma',
    classSection: 'Class 8A',
    amountPaid: 25000,
    paymentMethod: 'Cash',
    paidDate: '2026-07-18',
    collectedByUserId: 'usr-accountant',
    collectedByUserName: 'Priya Sharma',
    device: 'desktop',
    notes: 'Cash received at School Fee Counter',
  },
];

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pr-1',
    staffId: 'usr-teacher',
    staffName: 'Rahul Kumar',
    role: 'Senior Mathematics Teacher',
    month: 'August 2026',
    baseSalary: 62000,
    hra: 18600,
    transportAllowance: 4500,
    specialAllowance: 5000,
    providentFundDeduction: 7440,
    taxDeduction: 5200,
    netSalary: 77460,
    status: 'disbursed',
    disbursementDate: '2026-09-01',
    paymentMode: 'Direct Bank Transfer',
  },
  {
    id: 'pr-2',
    staffId: 'usr-accountant',
    staffName: 'Priya Sharma',
    role: 'Chief Accounts Officer',
    month: 'August 2026',
    baseSalary: 55000,
    hra: 16500,
    transportAllowance: 4000,
    specialAllowance: 4500,
    providentFundDeduction: 6600,
    taxDeduction: 4200,
    netSalary: 69200,
    status: 'disbursed',
    disbursementDate: '2026-09-01',
    paymentMode: 'Direct Bank Transfer',
  },
];

const INITIAL_BOOKS: Book[] = [
  { id: 'bk-1', isbn: '978-0143428589', title: 'The Discovery of India', author: 'Jawaharlal Nehru', publisher: 'Penguin Classics', category: 'History & Biography', edition: '2016 Illustrated Edition', totalCopies: 12, availableCopies: 8, rackLocation: 'A-12 / Hist' },
  { id: 'bk-2', isbn: '978-0143031031', title: 'Wings of Fire: An Autobiography', author: 'Dr. A.P.J. Abdul Kalam', publisher: 'Universities Press', category: 'Inspirational & Science', edition: '25th Anniversary Edition', totalCopies: 20, availableCopies: 14, rackLocation: 'B-04 / Bio' },
  { id: 'bk-3', isbn: '978-0545162074', title: 'Harry Potter and the Sorcerer’s Stone', author: 'J.K. Rowling', publisher: 'Scholastic', category: 'Fiction & Young Adult', edition: 'Special Edition', totalCopies: 15, availableCopies: 9, rackLocation: 'F-08 / Fiction' },
  { id: 'bk-4', isbn: '978-0195679311', title: 'Oxford Advanced Learner’s Dictionary', author: 'A.S. Hornby', publisher: 'Oxford University Press', category: 'Reference & Dictionaries', edition: '10th Edition', totalCopies: 25, availableCopies: 22, rackLocation: 'R-01 / Ref' },
];

const INITIAL_BOOK_TRANSACTIONS: BookTransaction[] = [
  { id: 'bt-1', bookId: 'bk-1', bookTitle: 'The Discovery of India', borrowerType: 'student', borrowerId: 'std-1', borrowerName: 'Ravi Kumar', classSection: 'Class 8A', issueDate: '2026-09-01', dueDate: '2026-09-15', fineAmount: 0, status: 'issued' },
  { id: 'bt-2', bookId: 'bk-3', bookTitle: 'Harry Potter and the Sorcerer’s Stone', borrowerType: 'student', borrowerId: 'std-1', borrowerName: 'Ravi Kumar', classSection: 'Class 8A', issueDate: '2026-09-03', dueDate: '2026-09-17', fineAmount: 0, status: 'issued' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-item-1', code: 'STA-A4-01', name: 'A4 Printing Paper Reams (75 GSM)', category: 'Stationery', quantityInStock: 85, minThreshold: 30, unit: 'Reams', unitPrice: 280, location: 'Admin Storage B1', supplierName: 'JK Paper Ltd', lastRestockedDate: '2026-08-25' },
  { id: 'inv-item-2', code: 'LAB-MIC-02', name: 'Compound Optical Microscopes (1000x)', category: 'Laboratory', quantityInStock: 24, minThreshold: 15, unit: 'Units', unitPrice: 8500, location: 'Biology Lab Cabinet 4', supplierName: 'LabTech Scientific', lastRestockedDate: '2026-06-12' },
  { id: 'inv-item-3', code: 'SPO-FB-03', name: 'FIFA Approved Footballs (Size 5)', category: 'Sports', quantityInStock: 18, minThreshold: 20, unit: 'Pieces', unitPrice: 1250, location: 'Sports Complex Room 1', supplierName: 'Cosco Sports India', lastRestockedDate: '2026-07-10' },
  { id: 'inv-item-4', code: 'IT-PRJ-04', name: 'Full HD Smart Classroom Projectors', category: 'IT Equipment', quantityInStock: 6, minThreshold: 4, unit: 'Units', unitPrice: 38000, location: 'Server & Tech Depot', supplierName: 'BenQ India Infotech', lastRestockedDate: '2026-05-18' },
];

const INITIAL_ROUTES: TransportRoute[] = [
  {
    id: 'route-4',
    routeNumber: 'Route 04',
    name: 'North-West Express (Vasant Kunj - Hauz Khas)',
    busNumber: 'DL-01-AB-1234',
    driverId: 'usr-driver',
    driverName: 'Manoj Singh',
    driverPhone: '+91 98444 55667',
    attendantName: 'Rameshwar Lal',
    totalCapacity: 45,
    assignedStudentsCount: 38,
    status: 'En Route',
    currentStop: 'Munirka Crossing',
    stops: [
      { order: 1, stopName: 'Vasant Vihar Metro Gate 2', pickupTime: '07:15 AM', dropTime: '02:30 PM', studentCount: 8 },
      { order: 2, stopName: 'Munirka Crossing', pickupTime: '07:30 AM', dropTime: '02:45 PM', studentCount: 12 },
      { order: 3, stopName: 'Hauz Khas Market', pickupTime: '07:45 AM', dropTime: '03:00 PM', studentCount: 10 },
      { order: 4, stopName: 'Green Park Metro', pickupTime: '08:00 AM', dropTime: '03:15 PM', studentCount: 8 },
    ],
  },
  {
    id: 'route-2',
    routeNumber: 'Route 02',
    name: 'South Ring Shuttle (Saket - Mehrauli)',
    busNumber: 'DL-01-AB-5678',
    driverId: 'usr-driver-2',
    driverName: 'Harish Chander',
    driverPhone: '+91 98321 65498',
    attendantName: 'Sita Devi',
    totalCapacity: 45,
    assignedStudentsCount: 34,
    status: 'Completed',
    currentStop: 'School Campus Gate 1',
    stops: [
      { order: 1, stopName: 'Saket City Center', pickupTime: '07:20 AM', dropTime: '02:40 PM', studentCount: 15 },
      { order: 2, stopName: 'Mehrauli Terminal', pickupTime: '07:40 AM', dropTime: '03:00 PM', studentCount: 19 },
    ],
  },
];

const INITIAL_STUDENT_TRANSPORT: StudentTransportAllocation[] = [
  { id: 'st-1', studentId: 'std-1', studentName: 'Ravi Kumar', classSection: 'Class 8A', routeId: 'route-4', stopName: 'Vasant Vihar Metro Gate 2', pickupTime: '07:15 AM', dropTime: '02:30 PM', pickupStatus: 'Picked Up' },
  { id: 'st-2', studentId: 'std-2', studentName: 'Priya Sharma', classSection: 'Class 8A', routeId: 'route-4', stopName: 'Munirka Crossing', pickupTime: '07:30 AM', dropTime: '02:45 PM', pickupStatus: 'Picked Up' },
  { id: 'st-3', studentId: 'std-3', studentName: 'Arun Reddy', classSection: 'Class 8A', routeId: 'route-4', stopName: 'Hauz Khas Market', pickupTime: '07:45 AM', dropTime: '03:00 PM', pickupStatus: 'Waiting' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Examinations Schedule & Hall Tickets Published',
    content: 'The Term 1 Mid-Term Examination starts on 20th September 2026. Hall tickets and seating allotments are available in the Examinations module.',
    priority: 'high',
    targetAudiences: ['all'],
    channels: ['in_app', 'email'],
    authorName: 'Dr. Rajesh Sharma',
    authorRole: 'Principal',
    publishedAt: '2026-09-10 10:00',
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Annual Inter-House Sports Meet & Athletics Registration Open',
    content: 'Registrations for 100m, 400m relay, long jump and football tournaments are now open through your respective House Captains.',
    priority: 'medium',
    targetAudiences: ['students', 'teachers'],
    channels: ['in_app'],
    authorName: 'Coach Balwinder Singh',
    authorRole: 'Head of Physical Education',
    publishedAt: '2026-09-12 14:30',
    isPinned: false,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Attendance Marked', message: 'Today’s attendance for Class 8A marked by Rahul Kumar.', type: 'info', timestamp: '08:46 AM', isRead: false },
  { id: 'notif-2', title: 'Pending Fee Reminder', message: 'Term 1 fee balance overdue for 14 students.', type: 'warning', timestamp: '09:15 AM', isRead: false },
  { id: 'notif-3', title: 'Route 04 En Route', message: 'Bus DL-01-AB-1234 reached Munirka Crossing on time.', type: 'success', timestamp: '07:32 AM', isRead: true },
];

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', title: 'Gandhi Jayanti Holiday', description: 'National Holiday - School closed', category: 'holiday', startDate: '2026-10-02', endDate: '2026-10-02', isAllDay: true, audience: 'all' },
  { id: 'cal-2', title: 'Term 1 Mid-Term Examinations', description: 'Theory exams for Classes 8 to 12', category: 'exam', startDate: '2026-09-20', endDate: '2026-09-28', isAllDay: true, audience: 'all' },
  { id: 'cal-3', title: 'Parent-Teacher Meeting (PTM)', description: 'One-on-one progress review meeting with parents', category: 'meeting', startDate: '2026-10-10', endDate: '2026-10-10', isAllDay: false, audience: 'parents' },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'leave-1', staffId: 'usr-teacher', staffName: 'Rahul Kumar', role: 'Teacher', leaveType: 'Casual', startDate: '2026-09-29', endDate: '2026-09-30', daysCount: 2, reason: 'Family celebration and personal commitment', appliedDate: '2026-09-10', status: 'approved', approvedBy: 'Dr. Rajesh Sharma' },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'doc-1', title: 'CBSE Affiliation Certificate 2026–31', category: 'Academic', associatedType: 'school', associatedId: 'school-main', associatedName: 'Delhi Smart International Academy', fileType: 'PDF', fileSize: '2.4 MB', uploadedDate: '2026-04-10', uploadedBy: 'Dr. Rajesh Sharma', downloadUrl: '#' },
  { id: 'doc-2', title: 'Transfer Certificate - Ravi Kumar', category: 'Admission', associatedType: 'student', associatedId: 'std-1', associatedName: 'Ravi Kumar', fileType: 'PDF', fileSize: '850 KB', uploadedDate: '2024-04-05', uploadedBy: 'Reception Office', downloadUrl: '#' },
  { id: 'doc-3', title: 'Aadhaar Card Verification - Ravi Kumar', category: 'Identity', associatedType: 'student', associatedId: 'std-1', associatedName: 'Ravi Kumar', fileType: 'PDF', fileSize: '1.1 MB', uploadedDate: '2024-04-06', uploadedBy: 'Suresh Kumar (Parent)', downloadUrl: '#' },
  { id: 'doc-4', title: 'Medical Fitness & Immunization Chart', category: 'Medical', associatedType: 'student', associatedId: 'std-1', associatedName: 'Ravi Kumar', fileType: 'PDF', fileSize: '420 KB', uploadedDate: '2025-07-12', uploadedBy: 'Dr. Neha Kapoor (School Clinic)', downloadUrl: '#' },
  { id: 'doc-5', title: 'Class 7 Annual CBSE Marksheet & Transcript', category: 'Academic', associatedType: 'student', associatedId: 'std-2', associatedName: 'Ananya Sen', fileType: 'PDF', fileSize: '1.8 MB', uploadedDate: '2025-03-30', uploadedBy: 'Exam Controller Office', downloadUrl: '#' },
  { id: 'doc-6', title: 'Municipal Birth Certificate - Kabir Verma', category: 'Identity', associatedType: 'student', associatedId: 'std-3', associatedName: 'Kabir Verma', fileType: 'JPG', fileSize: '980 KB', uploadedDate: '2024-04-02', uploadedBy: 'Admissions Desk', downloadUrl: '#' },
  { id: 'doc-7', title: 'Senior PGT Faculty Appointment Agreement', category: 'Employment', associatedType: 'staff', associatedId: 'usr-teacher', associatedName: 'Rahul Kumar', fileType: 'PDF', fileSize: '3.2 MB', uploadedDate: '2023-06-01', uploadedBy: 'HR Administration', downloadUrl: '#' },
  { id: 'doc-8', title: 'Delhi Fire Safety Clearance Certificate 2026', category: 'Certificate', associatedType: 'school', associatedId: 'school-main', associatedName: 'Delhi Smart International Academy', fileType: 'PDF', fileSize: '4.5 MB', uploadedDate: '2026-01-15', uploadedBy: 'Estate & Operations', downloadUrl: '#' },
  { id: 'doc-9', title: 'School Bus DL-1PB-4409 Fitness & PUC Certificate', category: 'Certificate', associatedType: 'school', associatedId: 'route-1', associatedName: 'Route 12 - North Campus Fleet', fileType: 'PDF', fileSize: '1.2 MB', uploadedDate: '2026-05-20', uploadedBy: 'Manoj Singh (Fleet Supervisor)', downloadUrl: '#' },
  { id: 'doc-10', title: 'National Science Olympiad Gold Certificate', category: 'Certificate', associatedType: 'student', associatedId: 'std-1', associatedName: 'Ravi Kumar', fileType: 'PNG', fileSize: '2.1 MB', uploadedDate: '2026-02-14', uploadedBy: 'Rahul Kumar (Science Faculty)', downloadUrl: '#' },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '2026-09-13 08:45:30',
    userId: 'usr-teacher',
    userName: 'Rahul Kumar',
    userRole: 'Teacher',
    device: 'mobile',
    module: 'attendance',
    action: 'create',
    targetEntity: 'Class 8A Daily Attendance',
    details: 'Marked attendance for 4 students (2 Present, 1 Late, 1 Absent)',
    ipAddress: '192.168.1.45',
    status: 'allowed',
  },
  {
    id: 'aud-102',
    timestamp: '2026-09-13 08:47:12',
    userId: 'usr-teacher',
    userName: 'Rahul Kumar',
    userRole: 'Teacher',
    device: 'mobile',
    module: 'fees',
    action: 'edit',
    targetEntity: 'All Students Fees',
    details: 'Security block: Role "Teacher" is prohibited from modifying fees on mobile.',
    ipAddress: '192.168.1.45',
    status: 'denied',
  },
  {
    id: 'aud-103',
    timestamp: '2026-09-12 11:20:15',
    userId: 'usr-accountant',
    userName: 'Priya Sharma',
    userRole: 'Accountant',
    device: 'desktop',
    module: 'fees',
    action: 'create',
    targetEntity: 'Receipt RCP-2026-9041',
    details: 'Recorded fee payment of ₹41,300 for Ravi Kumar (Class 8A) via UPI',
    ipAddress: '192.168.1.22',
    status: 'allowed',
  },
];

const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'Delhi Smart International Academy',
  motto: 'Knowledge, Excellence & Integrity',
  affiliationNumber: 'CBSE/AFF/2026/9824',
  board: 'CBSE - Central Board of Secondary Education',
  email: 'info@smartschool.edu.in',
  phone: '+91 11 2612 3456',
  address: 'Plot 14, Institutional Area, Vasant Kunj',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110070',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
  currencySymbol: '₹',
  academicYear: '2025–26',
};

const STORAGE_KEY = 'smartschool_os_database_v1';

class DatabaseService {
  private db: SmartSchoolDatabase;

  constructor() {
    this.db = this.loadFromStorage();
  }

  private loadFromStorage(): SmartSchoolDatabase {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all Nursery through Class 10 classes and sections are loaded
        if (!parsed.classes || parsed.classes.length < INITIAL_CLASSES.length) {
          parsed.classes = INITIAL_CLASSES;
          parsed.sections = INITIAL_SECTIONS;
          parsed.subjects = INITIAL_SUBJECTS;
          // Merge newly added students if missing
          const existingIds = new Set((parsed.students || []).map((s: any) => s.id));
          for (const st of INITIAL_STUDENTS) {
            if (!existingIds.has(st.id)) {
              parsed.students.push(st);
            }
          }
          // Merge fee structures if missing
          const existingFs = new Set((parsed.feeStructures || []).map((f: any) => f.id));
          for (const fs of INITIAL_FEE_STRUCTURES) {
            if (!existingFs.has(fs.id)) {
              parsed.feeStructures.push(fs);
            }
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read from local storage, using initial state:', e);
    }
    return this.getInitialState();
  }

  public getInitialState(): SmartSchoolDatabase {
    return {
      users: INITIAL_USERS,
      sessions: INITIAL_SESSIONS,
      academicYears: INITIAL_ACADEMIC_YEARS,
      branches: INITIAL_BRANCHES,
      classes: INITIAL_CLASSES,
      sections: INITIAL_SECTIONS,
      subjects: INITIAL_SUBJECTS,
      timetables: INITIAL_TIMETABLES,
      homework: INITIAL_HOMEWORK,
      assignments: [],
      assignmentSubmissions: [],
      students: INITIAL_STUDENTS,
      parents: INITIAL_PARENTS,
      admissions: INITIAL_ADMISSIONS,
      attendance: INITIAL_ATTENDANCE,
      staffAttendance: [],
      exams: INITIAL_EXAMS,
      examSubjects: INITIAL_EXAM_SUBJECTS,
      marks: INITIAL_MARKS,
      reportCards: INITIAL_REPORT_CARDS,
      gradingRules: INITIAL_GRADING_RULES,
      feeStructures: INITIAL_FEE_STRUCTURES,
      feeInvoices: INITIAL_FEE_INVOICES,
      feePayments: INITIAL_FEE_PAYMENTS,
      payroll: INITIAL_PAYROLL,
      books: INITIAL_BOOKS,
      bookTransactions: INITIAL_BOOK_TRANSACTIONS,
      inventory: INITIAL_INVENTORY,
      routes: INITIAL_ROUTES,
      studentTransport: INITIAL_STUDENT_TRANSPORT,
      announcements: INITIAL_ANNOUNCEMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      calendarEvents: INITIAL_CALENDAR_EVENTS,
      leaveRequests: INITIAL_LEAVES,
      documents: INITIAL_DOCUMENTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      schoolConfig: INITIAL_SCHOOL_CONFIG,
    };
  }

  public save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  public resetToDemo() {
    this.db = this.getInitialState();
    this.save();
    return this.db;
  }

  public getState(): SmartSchoolDatabase {
    return this.db;
  }

  public updateState(updater: (db: SmartSchoolDatabase) => void) {
    updater(this.db);
    this.save();
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.db.auditLogs.unshift(newLog);
    this.save();
    return newLog;
  }
}

export const dbService = new DatabaseService();
