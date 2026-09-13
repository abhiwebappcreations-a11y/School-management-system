import { ActionType, DataScope, DeviceType, ModuleName, PermissionRule, User, UserPermissionOverride } from '../types/auth';

// Default system permission matrix per role
export const DEFAULT_ROLE_PERMISSIONS: PermissionRule[] = [
  // SUPER ADMIN & PRINCIPAL: Full access across all devices
  {
    id: 'perm-principal-desktop',
    role: 'principal',
    device: 'all',
    module: 'dashboard',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'global',
    isAllowed: true,
  },
  {
    id: 'perm-principal-all-modules',
    role: 'principal',
    device: 'all',
    module: 'students',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'global',
    isAllowed: true,
  },

  // TEACHER (Rahul Kumar)
  // Teacher Desktop & Mobile: Attendance, Students, Homework, Timetable, Exams, Marks, Leaves, AI Assistant
  {
    id: 'perm-teacher-attendance-desktop',
    role: 'teacher',
    device: 'desktop',
    module: 'attendance',
    allowedActions: ['view', 'create', 'edit', 'export'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-attendance-mobile',
    role: 'teacher',
    device: 'mobile',
    module: 'attendance',
    allowedActions: ['view', 'create', 'edit'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-students-desktop',
    role: 'teacher',
    device: 'desktop',
    module: 'students',
    allowedActions: ['view', 'export'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-students-mobile',
    role: 'teacher',
    device: 'mobile',
    module: 'students',
    allowedActions: ['view'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-homework',
    role: 'teacher',
    device: 'all',
    module: 'homework',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-exams',
    role: 'teacher',
    device: 'all',
    module: 'examinations',
    allowedActions: ['view'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-marks',
    role: 'teacher',
    device: 'all',
    module: 'marks',
    allowedActions: ['view', 'create', 'edit'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-report-cards',
    role: 'teacher',
    device: 'desktop',
    module: 'report_cards',
    allowedActions: ['view', 'print'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-timetable',
    role: 'teacher',
    device: 'all',
    module: 'timetable',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-leave',
    role: 'teacher',
    device: 'all',
    module: 'leave_management',
    allowedActions: ['view', 'create'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-communication',
    role: 'teacher',
    device: 'all',
    module: 'communication',
    allowedActions: ['view', 'create'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-ai-assistant',
    role: 'teacher',
    device: 'all',
    module: 'ai_assistant',
    allowedActions: ['view', 'create'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  // Explicitly Deny Teacher access to Fees, Payroll, Administration on both Desktop and Mobile
  {
    id: 'perm-teacher-deny-fees-all',
    role: 'teacher',
    device: 'all',
    module: 'fees',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'global',
    isAllowed: false,
  },
  {
    id: 'perm-teacher-deny-payroll-all',
    role: 'teacher',
    device: 'all',
    module: 'payroll',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'global',
    isAllowed: false,
  },

  // ACCOUNTANT (Priya Sharma)
  {
    id: 'perm-accountant-fees-desktop',
    role: 'accountant',
    device: 'desktop',
    module: 'fees',
    allowedActions: ['view', 'create', 'edit', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'all_students',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-fees-mobile',
    role: 'accountant',
    device: 'mobile',
    module: 'fees',
    allowedActions: ['view', 'print'],
    dataScope: 'all_students',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-payroll',
    role: 'accountant',
    device: 'desktop',
    module: 'payroll',
    allowedActions: ['view', 'create', 'edit', 'export', 'print'],
    dataScope: 'all_staff',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-reports',
    role: 'accountant',
    device: 'desktop',
    module: 'reports',
    allowedActions: ['view', 'export'],
    dataScope: 'branch',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-students',
    role: 'accountant',
    device: 'all',
    module: 'students',
    allowedActions: ['view'],
    dataScope: 'all_students',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-attendance',
    role: 'accountant',
    device: 'desktop',
    module: 'attendance',
    allowedActions: ['view'],
    dataScope: 'branch',
    isAllowed: true,
  },

  // LIBRARIAN (Sunita Patel)
  {
    id: 'perm-librarian-library',
    role: 'librarian',
    device: 'all',
    module: 'library',
    allowedActions: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print', 'full_access'],
    dataScope: 'global',
    isAllowed: true,
  },
  {
    id: 'perm-librarian-students',
    role: 'librarian',
    device: 'desktop',
    module: 'students',
    allowedActions: ['view'],
    dataScope: 'all_students',
    isAllowed: true,
  },

  // DRIVER (Manoj Singh)
  {
    id: 'perm-driver-transport-mobile',
    role: 'driver',
    device: 'mobile',
    module: 'transport',
    allowedActions: ['view', 'edit'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-driver-transport-desktop',
    role: 'driver',
    device: 'desktop',
    module: 'transport',
    allowedActions: ['view', 'edit'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-driver-notifications',
    role: 'driver',
    device: 'all',
    module: 'notifications',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },

  // PARENT (Vikram Mehta)
  {
    id: 'perm-parent-dashboard',
    role: 'parent',
    device: 'all',
    module: 'dashboard',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-students',
    role: 'parent',
    device: 'all',
    module: 'students',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-attendance',
    role: 'parent',
    device: 'all',
    module: 'attendance',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-homework',
    role: 'parent',
    device: 'all',
    module: 'homework',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-report-cards',
    role: 'parent',
    device: 'all',
    module: 'report_cards',
    allowedActions: ['view', 'print'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-fees',
    role: 'parent',
    device: 'all',
    module: 'fees',
    allowedActions: ['view', 'print'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-transport',
    role: 'parent',
    device: 'all',
    module: 'transport',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-communication',
    role: 'parent',
    device: 'all',
    module: 'communication',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },

  // STUDENT (Ravi Kumar)
  {
    id: 'perm-student-dashboard',
    role: 'student',
    device: 'all',
    module: 'dashboard',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-timetable',
    role: 'student',
    device: 'all',
    module: 'timetable',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-homework',
    role: 'student',
    device: 'all',
    module: 'homework',
    allowedActions: ['view', 'create'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-report-cards',
    role: 'student',
    device: 'all',
    module: 'report_cards',
    allowedActions: ['view', 'print'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-attendance',
    role: 'student',
    device: 'all',
    module: 'attendance',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-library',
    role: 'student',
    device: 'all',
    module: 'library',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-documents',
    role: 'student',
    device: 'all',
    module: 'documents',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-parent-documents',
    role: 'parent',
    device: 'all',
    module: 'documents',
    allowedActions: ['view', 'create'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-documents',
    role: 'teacher',
    device: 'all',
    module: 'documents',
    allowedActions: ['view', 'create'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-documents',
    role: 'accountant',
    device: 'all',
    module: 'documents',
    allowedActions: ['view', 'create'],
    dataScope: 'branch',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-bulk',
    role: 'accountant',
    device: 'desktop',
    module: 'bulk_operations',
    allowedActions: ['view', 'create'],
    dataScope: 'branch',
    isAllowed: true,
  },
  {
    id: 'perm-accountant-academic-year',
    role: 'accountant',
    device: 'desktop',
    module: 'academic_year',
    allowedActions: ['view'],
    dataScope: 'branch',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-ai-worksheet',
    role: 'teacher',
    device: 'all',
    module: 'ai_worksheet_generator',
    allowedActions: ['view', 'create', 'export', 'print'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-face-attendance',
    role: 'teacher',
    device: 'all',
    module: 'face_attendance',
    allowedActions: ['view', 'create', 'edit'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-gamification',
    role: 'teacher',
    device: 'all',
    module: 'gamification',
    allowedActions: ['view', 'create'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-growth-timeline',
    role: 'teacher',
    device: 'all',
    module: 'growth_timeline',
    allowedActions: ['view', 'create'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-teacher-career-guidance',
    role: 'teacher',
    device: 'all',
    module: 'career_guidance',
    allowedActions: ['view'],
    dataScope: 'class_assigned',
    isAllowed: true,
  },
  {
    id: 'perm-student-gamification',
    role: 'student',
    device: 'all',
    module: 'gamification',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-growth-timeline',
    role: 'student',
    device: 'all',
    module: 'growth_timeline',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-student-career-guidance',
    role: 'student',
    device: 'all',
    module: 'career_guidance',
    allowedActions: ['view'],
    dataScope: 'own',
    isAllowed: true,
  },
  {
    id: 'perm-parent-growth-timeline',
    role: 'parent',
    device: 'all',
    module: 'growth_timeline',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-gamification',
    role: 'parent',
    device: 'all',
    module: 'gamification',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
  {
    id: 'perm-parent-career-guidance',
    role: 'parent',
    device: 'all',
    module: 'career_guidance',
    allowedActions: ['view'],
    dataScope: 'linked_children',
    isAllowed: true,
  },
];

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  scope?: DataScope;
}

export class PermissionEngine {
  private roleRules: PermissionRule[];
  private userOverrides: UserPermissionOverride[];

  constructor(rules: PermissionRule[] = DEFAULT_ROLE_PERMISSIONS, overrides: UserPermissionOverride[] = []) {
    this.roleRules = [...rules];
    this.userOverrides = [...overrides];
  }

  public setRules(rules: PermissionRule[]) {
    this.roleRules = rules;
  }

  public setOverrides(overrides: UserPermissionOverride[]) {
    this.userOverrides = overrides;
  }

  public getRules(): PermissionRule[] {
    return this.roleRules;
  }

  public getOverrides(): UserPermissionOverride[] {
    return this.userOverrides;
  }

  /**
   * Evaluates the pipeline:
   * USER → DEVICE → MODULE → ACTION → DATA SCOPE → ALLOW / DENY
   */
  public evaluate(
    user: User | null,
    device: DeviceType,
    module: ModuleName,
    action: ActionType,
    targetDataScope?: DataScope
  ): PermissionCheckResult {
    if (!user) {
      return { allowed: false, reason: 'Authentication required. No active session.' };
    }

    // Check device hardware eligibility for this user
    if (device === 'desktop' && !user.isAllowedDesktop) {
      return { allowed: false, reason: `User ${user.name} is restricted from Desktop access by administrator policy.` };
    }
    if ((device === 'mobile' || device === 'tablet') && !user.isAllowedMobile) {
      return { allowed: false, reason: `User ${user.name} is restricted from Mobile access by administrator policy.` };
    }

    // Super Admin & Principal have comprehensive access
    if (user.role === 'super_admin' || user.role === 'principal') {
      return { allowed: true, scope: 'global' };
    }

    // 1. Check user-specific overrides first (highest priority)
    const override = this.userOverrides.find(
      (o) =>
        o.userId === user.id &&
        o.module === module &&
        (o.device === 'all' || o.device === device) &&
        (o.action === action || o.action === 'full_access')
    );

    if (override) {
      if (!override.isAllowed) {
        return {
          allowed: false,
          reason: `Access Denied: Explicit administrator override blocks '${action}' on '${module}' from ${device} for ${user.name}.`,
        };
      }
      return { allowed: true, scope: override.dataScope };
    }

    // 2. Check role-level permission rules
    // First, look for device-specific rule
    let rule = this.roleRules.find(
      (r) =>
        r.role === user.role &&
        r.module === module &&
        r.device === device &&
        (r.allowedActions.includes(action) || r.allowedActions.includes('full_access'))
    );

    // Fallback to 'all' devices rule for this role & module
    if (!rule) {
      rule = this.roleRules.find(
        (r) =>
          r.role === user.role &&
          r.module === module &&
          r.device === 'all' &&
          (r.allowedActions.includes(action) || r.allowedActions.includes('full_access'))
      );
    }

    // Check if there is an explicit DENY rule for this module/device
    const denyRule = this.roleRules.find(
      (r) =>
        r.role === user.role &&
        r.module === module &&
        (r.device === 'all' || r.device === device) &&
        !r.isAllowed
    );

    if (denyRule) {
      return {
        allowed: false,
        reason: `Access Denied: Role '${user.roleTitle}' is prohibited from '${module}' on ${device}.`,
      };
    }

    if (!rule || !rule.isAllowed) {
      return {
        allowed: false,
        reason: `Access Denied: Role '${user.roleTitle}' does not possess '${action}' permissions on '${module}' for ${device}.`,
      };
    }

    // 3. Evaluate Extended Time-Restriction Window
    if (rule.timeRestriction && rule.timeRestriction.enabled) {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDay();
      if (rule.timeRestriction.daysOfWeek && !rule.timeRestriction.daysOfWeek.includes(currentDay)) {
        return {
          allowed: false,
          reason: `Time Policy Denial: Action '${action}' on '${module}' is restricted on this day by institutional policy.`,
        };
      }
      if (currentHour < rule.timeRestriction.allowedStartHour || currentHour >= rule.timeRestriction.allowedEndHour) {
        return {
          allowed: false,
          reason: `Time Window Restriction: '${action}' on '${module}' is strictly authorized between ${rule.timeRestriction.allowedStartHour.toString().padStart(2, '0')}:00 and ${rule.timeRestriction.allowedEndHour.toString().padStart(2, '0')}:00 IST.`,
        };
      }
    }

    // 4. Evaluate Campus Branch Isolation
    if (rule.branchRestriction && rule.branchRestriction.length > 0 && !rule.branchRestriction.includes(user.branchId)) {
      return {
        allowed: false,
        reason: `Branch Isolation Denial: Role '${user.roleTitle}' is prohibited from '${action}' on '${module}' outside designated campus.`,
      };
    }

    // Validate data scope if specified
    if (targetDataScope && rule.dataScope !== 'global' && rule.dataScope !== targetDataScope) {
      // E.g. trying to access 'all_students' when scope is 'class_assigned'
      if (rule.dataScope === 'class_assigned' && targetDataScope === 'all_students') {
        return {
          allowed: false,
          reason: `Scope Violation: Action requires '${targetDataScope}' scope, but your permission is restricted to '${rule.dataScope}'.`,
        };
      }
    }

    return { allowed: true, scope: rule.dataScope };
  }

  /**
   * Check if a module should be visible in navigation for this user & device
   */
  public canViewModule(user: User | null, device: DeviceType, module: ModuleName): boolean {
    const res = this.evaluate(user, device, module, 'view');
    return res.allowed;
  }
}

export const globalPermissionEngine = new PermissionEngine();
