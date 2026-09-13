import { ActionType, DeviceType, ModuleName } from './auth';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  device: DeviceType;
  module: ModuleName;
  action: ActionType;
  targetEntity: string; // e.g., "Student Ravi Kumar", "Attendance Class 8A"
  details: string;
  ipAddress: string;
  status: 'allowed' | 'denied' | 'error';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudiences: ('all' | 'students' | 'parents' | 'teachers' | 'staff')[];
  targetClasses?: string[];
  channels: ('in_app' | 'sms' | 'email' | 'whatsapp')[];
  authorName: string;
  authorRole: string;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  category: 'holiday' | 'exam' | 'meeting' | 'sports' | 'cultural' | 'academic';
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  audience: 'all' | 'teachers' | 'students' | 'parents';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  leaveType: 'Casual' | 'Sick' | 'Earned' | 'Maternity/Paternity';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approverComments?: string;
  approvedBy?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Admission' | 'Identity' | 'Academic' | 'Certificate' | 'Medical' | 'Employment';
  associatedType: 'student' | 'staff' | 'school';
  associatedId: string;
  associatedName: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
  uploadedBy: string;
  downloadUrl: string;
}

export interface SchoolConfig {
  schoolName: string;
  motto: string;
  affiliationNumber: string; // e.g. CBSE/AFF/2026/8941
  board: string; // e.g. "CBSE - Central Board of Secondary Education"
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logoUrl: string;
  currencySymbol: string; // ₹
  academicYear: string;
}
