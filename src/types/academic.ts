export interface AcademicYear {
  id: string;
  name: string; // e.g., "2025–26"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'archived' | 'upcoming';
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  principalName: string;
}

export interface SchoolClass {
  id: string;
  name: string; // "Class 8", "Class 9", "Class 10"
  numericGrade: number;
  sections: string[]; // ["8A", "8B"]
  stream?: string; // "Science", "Commerce", "General"
}

export interface Section {
  id: string;
  classId: string;
  className: string;
  sectionName: string; // "A", "B"
  fullName: string; // "Class 8A"
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  capacity: number;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string; // "Mathematics", "Science", "Computer Science"
  code: string; // "MATH-101"
  department: string;
  isElective: boolean;
  isPractical: boolean;
  classIds: string[];
}

export interface TimetablePeriod {
  id: string;
  classSection: string; // "Class 8A"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  isSubstituted?: boolean;
  substitutedTeacherName?: string;
}

export interface HomeworkItem {
  id: string;
  classSection: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  teacherName: string;
  submissionCount: number;
  totalStudents: number;
}

export interface Assignment {
  id: string;
  title: string;
  classSection: string;
  subject: string;
  teacherName: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  status: 'active' | 'closed' | 'graded';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  attachmentUrl?: string;
  notes?: string;
  obtainedMarks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}
