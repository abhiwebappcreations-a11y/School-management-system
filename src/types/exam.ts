export type ExamType =
  | 'Unit Test 1'
  | 'Unit Test 2'
  | 'Periodic Assessment'
  | 'Mid-Term Examination'
  | 'Final Examination'
  | 'Practical Lab Assessment';

export type ExamWorkflowStatus =
  | 'draft'
  | 'teacher_entry'
  | 'coordinator_review'
  | 'principal_approved'
  | 'published';

export interface GradingRule {
  grade: string; // 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description: string;
}

export interface Examination {
  id: string;
  name: string; // e.g., "Term 1 Mid-Term 2025–26"
  examType: ExamType;
  academicYear: string;
  startDate: string;
  endDate: string;
  classes: string[];
  workflowStatus: ExamWorkflowStatus;
  isPublished: boolean;
}

export interface ExamSubject {
  id: string;
  examId: string;
  subjectName: string;
  classSection: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  maxMarks: number;
  passingMarks: number;
}

export interface StudentMark {
  id: string;
  examId: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classSection: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  isAbsent: boolean;
  remarks?: string;
  enteredByTeacherName: string;
  status: ExamWorkflowStatus;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  rollNumber: string;
  classSection: string;
  academicYear: string;
  examName: string;
  issueDate: string;
  subjects: {
    subjectName: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
    remarks: string;
  }[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  attendancePercentage: number;
  rankInClass: number;
  teacherRemarks: string;
  principalRemarks: string;
  status: ExamWorkflowStatus;
}
