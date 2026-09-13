export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'vice_principal'
  | 'academic_coordinator'
  | 'teacher'
  | 'class_teacher'
  | 'subject_teacher'
  | 'accountant'
  | 'receptionist'
  | 'librarian'
  | 'transport_manager'
  | 'driver'
  | 'bus_attendant'
  | 'counselor'
  | 'office_staff'
  | 'it_admin'
  | 'parent'
  | 'student'
  | string;

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export type ActionType =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'print'
  | 'full_access';

export type DataScope =
  | 'own'
  | 'class_assigned'
  | 'branch'
  | 'all_students'
  | 'all_staff'
  | 'linked_children'
  | 'global';

export type ModuleName =
  | 'dashboard'
  | 'admissions'
  | 'students'
  | 'parents'
  | 'teachers'
  | 'staff'
  | 'classes_sections'
  | 'subjects'
  | 'attendance'
  | 'timetable'
  | 'homework'
  | 'assignments'
  | 'examinations'
  | 'marks'
  | 'grades'
  | 'report_cards'
  | 'fees'
  | 'payments'
  | 'receipts'
  | 'library'
  | 'inventory'
  | 'transport'
  | 'communication'
  | 'announcements'
  | 'calendar'
  | 'leave_management'
  | 'payroll'
  | 'documents'
  | 'reports'
  | 'analytics'
  | 'ai_assistant'
  | 'notifications'
  | 'user_management'
  | 'role_management'
  | 'device_management'
  | 'permission_management'
  | 'audit_logs'
  | 'school_configuration'
  | 'academic_year'
  | 'backup_recovery'
  | 'bulk_operations'
  | 'digital_twin'
  | 'student_risk'
  | 'parent_engagement'
  | 'growth_timeline'
  | 'career_guidance'
  | 'face_attendance'
  | 'gamification'
  | 'ai_worksheet_generator'
  | 'executive_command'
  | 'workflow_builder'
  | 'automation_engine'
  | 'kpi_analytics'
  | 'saas_tenants';

export interface PermissionRule {
  id: string;
  role: UserRole;
  device: 'all' | DeviceType;
  module: ModuleName;
  allowedActions: ActionType[];
  dataScope: DataScope;
  isAllowed: boolean;
  timeRestriction?: {
    enabled: boolean;
    allowedStartHour: number; // 0–23
    allowedEndHour: number;   // 0–23
    daysOfWeek?: number[];    // 0=Sun, 1=Mon, ..., 6=Sat
  };
  branchRestriction?: string[];
  recordLevelScope?: 'all' | 'assigned_classes_only' | 'own_department_only' | 'own_records_only';
}

export interface UserPermissionOverride {
  id: string;
  userId: string;
  device: 'all' | DeviceType;
  module: ModuleName;
  action: ActionType;
  dataScope: DataScope;
  isAllowed: boolean;
}

export interface DeviceSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: DeviceType;
  browser: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
  isRevoked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  phone: string;
  branchId: string;
  branchName: string;
  isAllowedDesktop: boolean;
  isAllowedMobile: boolean;
  linkedStudentIds?: string[];
  assignedClassId?: string;
  assignedSectionId?: string;
  assignedRouteId?: string;
}
