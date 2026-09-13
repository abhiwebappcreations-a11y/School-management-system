import { DeviceType } from './auth';

export type StudentAttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'half_day';
export type StaffAttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  studentId: string;
  studentName: string;
  rollNumber: string;
  classSection: string;
  status: StudentAttendanceStatus;
  remarks?: string;
  markedByTeacherId: string;
  markedByTeacherName: string;
  device: DeviceType;
  academicYear: string;
}

export interface StaffAttendanceRecord {
  id: string;
  date: string;
  time: string;
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  status: StaffAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  device: DeviceType;
  remarks?: string;
}

export interface AttendanceSummary {
  totalCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  halfDayCount: number;
  percentage: number;
}
