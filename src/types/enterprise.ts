// SmartSchool OS — Enterprise Domain Types

export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'es' | 'fr' | 'de' | 'ar' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

// 1. Digital Twin
export interface RoomOccupancy {
  id: string;
  roomNumber: string;
  name: string;
  type: 'classroom' | 'science_lab' | 'computer_lab' | 'library' | 'auditorium' | 'sports_hall' | 'cafeteria';
  building: 'Main Academic Wing' | 'STEM & Innovation Block' | 'Arts & Sports Arena';
  floor: 'Ground' | '1st Floor' | '2nd Floor' | '3rd Floor';
  capacity: number;
  currentOccupancy: number;
  assignedClass?: string;
  currentTeacher?: string;
  currentSubject?: string;
  status: 'occupied' | 'vacant' | 'maintenance' | 'cleaning';
  temperatureC: number;
  co2Ppm: number;
  lightsOn: boolean;
  projectorOn: boolean;
}

// 2. Student Risk Engine
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface StudentRiskProfile {
  studentId: string;
  studentName: string;
  rollNumber: string;
  classSection: string;
  riskScore: number; // 0–100 (Higher = greater risk)
  riskLevel: RiskLevel;
  indicators: {
    attendanceRate: number; // e.g. 68%
    academicGpaPercent: number; // e.g. 38%
    pendingFeeBalance: number; // in ₹
    missedAssignmentsCount: number;
    behavioralIncidentsCount: number;
  };
  primaryRiskFactor: string;
  recommendedInterventions: string[];
  counselorAssigned?: string;
  lastInterventionDate?: string;
  status: 'open' | 'monitoring' | 'resolved';
}

// 3. Parent Engagement
export interface ParentEngagementMetric {
  parentId: string;
  parentName: string;
  studentName: string;
  classSection: string;
  phone: string;
  email: string;
  ptmAttendanceRate: number; // %
  appLoginDaysCount: number; // days active in last 30
  feePaymentOnTimeRate: number; // %
  messageResponseRate: number; // %
  compositeScore: number; // 0–100
  tier: 'Champion' | 'Active' | 'Moderate' | 'Disengaged';
  lastActive: string;
}

// 4. Student Growth Timeline
export interface StudentGrowthMilestone {
  id: string;
  studentId: string;
  academicYear: string;
  date: string;
  category: 'admission' | 'academic' | 'attendance' | 'award' | 'sports' | 'behavioral' | 'promotion' | 'certification';
  title: string;
  description: string;
  gradeScore?: string;
  badgeEarned?: string;
  verifierName: string;
}

// 5. Career Guidance
export interface CareerPathway {
  id: string;
  title: string;
  stream: 'Science (PCM)' | 'Science (PCB)' | 'Commerce' | 'Humanities & Arts' | 'Vocational';
  description: string;
  topCareers: string[];
  keySkills: string[];
  recommendedExams: string[];
  topCollegesIndia: string[];
  topCollegesGlobal: string[];
  medianStartingSalaryLpa: number;
  marketDemand: 'High' | 'Very High' | 'Moderate';
}

// 6. Student Gamification
export interface StudentBadge {
  id: string;
  code: string;
  name: string;
  category: 'academic' | 'attendance' | 'discipline' | 'sports' | 'creativity';
  iconName: string;
  description: string;
  pointsValue: number;
  earnedDate?: string;
}

export interface StudentGamificationProfile {
  studentId: string;
  studentName: string;
  classSection: string;
  house: 'Red Phoenix' | 'Blue Dragons' | 'Green Falcons' | 'Gold Eagles';
  totalPoints: number;
  level: number;
  currentStreakDays: number;
  badges: StudentBadge[];
  recentActivities: { title: string; points: number; timestamp: string }[];
}

// 7. AI Homework & Worksheet
export interface GeneratedWorksheet {
  id: string;
  subject: string;
  gradeClass: string;
  topic: string;
  curriculum: 'CBSE' | 'ICSE' | 'Cambridge';
  difficulty: 'Foundation' | 'Standard' | 'Advanced (HOTS)' | 'Olympiad';
  generatedAt: string;
  teacherId: string;
  teacherName: string;
  totalMarks: number;
  estimatedMinutes: number;
  questions: {
    id: number;
    type: 'mcq' | 'short_answer' | 'reasoning' | 'hots';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    marks: number;
  }[];
}

// 8. No-Code Workflows
export interface WorkflowStage {
  id: string;
  stageName: string;
  approverRole: string;
  timeLimitHours: number;
  isMandatory: boolean;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  category: 'leave' | 'admission' | 'fee_concession' | 'grade_change' | 'transfer_certificate';
  description: string;
  isActive: boolean;
  stages: WorkflowStage[];
  escalationRole: string;
  autoApproveHours?: number;
}

// 9. Automation Rules (IF-THEN)
export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: 'attendance_below_threshold' | 'fee_overdue' | 'marks_failing' | 'consecutive_absent' | 'disciplinary_logged';
  conditionField: string;
  operator: 'less_than' | 'greater_than' | 'equals';
  conditionValue: number | string;
  actionType: 'send_parent_sms' | 'send_parent_whatsapp' | 'alert_counselor' | 'flag_principal' | 'schedule_task';
  messageTemplate: string;
  isEnabled: boolean;
  lastExecutedAt?: string;
  executionCount: number;
}

// 10. Multi-Tenant SaaS
export interface InstitutionalTenant {
  id: string;
  name: string;
  subdomain: string;
  brandCode: string;
  motto: string;
  affiliationNumber: string;
  board: string;
  logoUrl: string;
  primaryColorHex: string;
  accentColorHex: string;
  campusesCount: number;
  totalStudentsCount: number;
  isIsolatedData: boolean;
  contactEmail: string;
}
