// SmartSchool OS — Enterprise Store & State Management
import {
  RoomOccupancy,
  StudentRiskProfile,
  ParentEngagementMetric,
  StudentGrowthMilestone,
  CareerPathway,
  StudentGamificationProfile,
  GeneratedWorksheet,
  WorkflowDefinition,
  AutomationRule,
  InstitutionalTenant,
} from '../types/enterprise';
import { dbService } from './database';

export interface FaceAttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  classSection: string;
  rollNumber: string;
  confidencePercent: number;
  timestamp: string;
  matchStatus: 'VERIFIED' | 'LOW_CONFIDENCE' | 'SPOOF_DETECTED';
  deviceInfo: string;
  snapshotUrl: string;
}

export interface EnterpriseState {
  rooms: RoomOccupancy[];
  riskProfiles: StudentRiskProfile[];
  parentMetrics: ParentEngagementMetric[];
  growthMilestones: StudentGrowthMilestone[];
  careerPathways: CareerPathway[];
  gamificationProfiles: StudentGamificationProfile[];
  worksheets: GeneratedWorksheet[];
  workflows: WorkflowDefinition[];
  automationRules: AutomationRule[];
  tenants: InstitutionalTenant[];
  faceLogs: FaceAttendanceEntry[];
}

const STORAGE_KEY = 'smartschool_enterprise_v2';

const INITIAL_ROOMS: RoomOccupancy[] = [
  {
    id: 'room-101',
    roomNumber: 'A-101',
    name: 'Classroom 8-A',
    type: 'classroom',
    building: 'Main Academic Wing',
    floor: '1st Floor',
    capacity: 40,
    currentOccupancy: 38,
    assignedClass: 'Class 8-A',
    currentTeacher: 'Rahul Kumar',
    currentSubject: 'Mathematics (Algebra)',
    status: 'occupied',
    temperatureC: 22.4,
    co2Ppm: 540,
    lightsOn: true,
    projectorOn: true,
  },
  {
    id: 'room-102',
    roomNumber: 'A-102',
    name: 'Classroom 9-B',
    type: 'classroom',
    building: 'Main Academic Wing',
    floor: '1st Floor',
    capacity: 40,
    currentOccupancy: 39,
    assignedClass: 'Class 9-B',
    currentTeacher: 'Priya Sharma',
    currentSubject: 'Science (Physics)',
    status: 'occupied',
    temperatureC: 23.1,
    co2Ppm: 610,
    lightsOn: true,
    projectorOn: true,
  },
  {
    id: 'room-103',
    roomNumber: 'A-103',
    name: 'Classroom 10-A (Board Prep)',
    type: 'classroom',
    building: 'Main Academic Wing',
    floor: '1st Floor',
    capacity: 42,
    currentOccupancy: 41,
    assignedClass: 'Class 10-A',
    currentTeacher: 'Ananya Deshmukh',
    currentSubject: 'Social Studies',
    status: 'occupied',
    temperatureC: 21.8,
    co2Ppm: 580,
    lightsOn: true,
    projectorOn: false,
  },
  {
    id: 'room-stem-1',
    roomNumber: 'S-201',
    name: 'Ada Lovelace Robotics & AI Lab',
    type: 'computer_lab',
    building: 'STEM & Innovation Block',
    floor: '2nd Floor',
    capacity: 35,
    currentOccupancy: 32,
    assignedClass: 'Class 11-Tech Elective',
    currentTeacher: 'Vikram Mehta',
    currentSubject: 'Python & Computer Vision',
    status: 'occupied',
    temperatureC: 20.2,
    co2Ppm: 495,
    lightsOn: true,
    projectorOn: true,
  },
  {
    id: 'room-stem-2',
    roomNumber: 'S-204',
    name: 'C.V. Raman Physics Research Lab',
    type: 'science_lab',
    building: 'STEM & Innovation Block',
    floor: '2nd Floor',
    capacity: 36,
    currentOccupancy: 0,
    assignedClass: 'Class 12-PCM',
    currentTeacher: 'Dr. Alok Verma',
    currentSubject: 'Optics & Laser Experiments',
    status: 'vacant',
    temperatureC: 21.5,
    co2Ppm: 420,
    lightsOn: false,
    projectorOn: false,
  },
  {
    id: 'room-lib',
    roomNumber: 'L-001',
    name: 'Rabindranath Tagore Central Library',
    type: 'library',
    building: 'Main Academic Wing',
    floor: 'Ground',
    capacity: 120,
    currentOccupancy: 84,
    assignedClass: 'Open Study & Research',
    currentTeacher: 'Sunita Menon (Chief Librarian)',
    currentSubject: 'Silent Reading & Digital Archive',
    status: 'occupied',
    temperatureC: 22.0,
    co2Ppm: 510,
    lightsOn: true,
    projectorOn: false,
  },
  {
    id: 'room-audi',
    roomNumber: 'AUD-1',
    name: 'Dr. APJ Abdul Kalam Grand Auditorium',
    type: 'auditorium',
    building: 'Arts & Sports Arena',
    floor: 'Ground',
    capacity: 650,
    currentOccupancy: 420,
    assignedClass: 'All High School (Inter-House Debate)',
    currentTeacher: 'Dean of Student Affairs',
    currentSubject: 'Annual Literary Fest',
    status: 'occupied',
    temperatureC: 22.8,
    co2Ppm: 680,
    lightsOn: true,
    projectorOn: true,
  },
  {
    id: 'room-sports',
    roomNumber: 'SP-1',
    name: 'Dhyan Chand Indoor Sports Complex',
    type: 'sports_hall',
    building: 'Arts & Sports Arena',
    floor: 'Ground',
    capacity: 150,
    currentOccupancy: 45,
    assignedClass: 'Physical Ed Section B',
    currentTeacher: 'Coach Gurpreet Singh',
    currentSubject: 'Badminton & Table Tennis Training',
    status: 'occupied',
    temperatureC: 24.5,
    co2Ppm: 460,
    lightsOn: true,
    projectorOn: false,
  },
  {
    id: 'room-cafe',
    roomNumber: 'CAF-1',
    name: 'Green Leaf Organic Cafeteria',
    type: 'cafeteria',
    building: 'Main Academic Wing',
    floor: 'Ground',
    capacity: 250,
    currentOccupancy: 15,
    assignedClass: 'Kitchen & Staff Prep',
    currentTeacher: 'Chef Operations',
    currentSubject: 'Lunch Hygiene & Quality Audit',
    status: 'cleaning',
    temperatureC: 23.0,
    co2Ppm: 440,
    lightsOn: true,
    projectorOn: false,
  },
];

const INITIAL_RISK_PROFILES: StudentRiskProfile[] = [
  {
    studentId: 'std-3',
    studentName: 'Rohan Verma',
    rollNumber: '8A-03',
    classSection: 'Class 8-A',
    riskScore: 88,
    riskLevel: 'critical',
    indicators: {
      attendanceRate: 64,
      academicGpaPercent: 41,
      pendingFeeBalance: 24000,
      missedAssignmentsCount: 6,
      behavioralIncidentsCount: 2,
    },
    primaryRiskFactor: 'Severe attendance drop (64%) combined with failing Math & Science',
    recommendedInterventions: [
      'Urgent Parent-Counselor intervention meeting within 48h',
      'Remedial doubt-clearing sessions in Mathematics',
      'Finance office flexible installment plan for pending term fees',
    ],
    counselorAssigned: 'Dr. Meenakshi Sundaram',
    lastInterventionDate: '2026-03-08',
    status: 'open',
  },
  {
    studentId: 'std-7',
    studentName: 'Kabir Patel',
    rollNumber: '9B-12',
    classSection: 'Class 9-B',
    riskScore: 74,
    riskLevel: 'high',
    indicators: {
      attendanceRate: 72,
      academicGpaPercent: 51,
      pendingFeeBalance: 12000,
      missedAssignmentsCount: 4,
      behavioralIncidentsCount: 1,
    },
    primaryRiskFactor: 'Missed 4 consecutive homework submissions and unexcused absences',
    recommendedInterventions: [
      'Weekly peer tutoring pairing with Class Academic Ambassador',
      'Daily attendance SMS alert enabled for father',
    ],
    counselorAssigned: 'Dr. Meenakshi Sundaram',
    lastInterventionDate: '2026-03-10',
    status: 'monitoring',
  },
  {
    studentId: 'std-11',
    studentName: 'Zoya Khan',
    rollNumber: '10A-18',
    classSection: 'Class 10-A',
    riskScore: 61,
    riskLevel: 'medium',
    indicators: {
      attendanceRate: 81,
      academicGpaPercent: 54,
      pendingFeeBalance: 0,
      missedAssignmentsCount: 3,
      behavioralIncidentsCount: 0,
    },
    primaryRiskFactor: 'Sudden drop in Pre-Board Mock scores in Chemistry and Physics',
    recommendedInterventions: [
      'Science lab practical revision slot on Saturdays',
      'Career anxiety counseling for upcoming Board Examinations',
    ],
    counselorAssigned: 'Prof. S. Ranganathan',
    lastInterventionDate: '2026-03-05',
    status: 'monitoring',
  },
  {
    studentId: 'std-2',
    studentName: 'Aditya Gupta',
    rollNumber: '8A-02',
    classSection: 'Class 8-A',
    riskScore: 28,
    riskLevel: 'low',
    indicators: {
      attendanceRate: 91,
      academicGpaPercent: 78,
      pendingFeeBalance: 0,
      missedAssignmentsCount: 1,
      behavioralIncidentsCount: 0,
    },
    primaryRiskFactor: 'Occasional assignment delay due to district badminton tournaments',
    recommendedInterventions: [
      'Flexible homework submission buffer for official sports representations',
    ],
    status: 'monitoring',
  },
  {
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    rollNumber: '8A-01',
    classSection: 'Class 8-A',
    riskScore: 12,
    riskLevel: 'low',
    indicators: {
      attendanceRate: 97,
      academicGpaPercent: 94,
      pendingFeeBalance: 0,
      missedAssignmentsCount: 0,
      behavioralIncidentsCount: 0,
    },
    primaryRiskFactor: 'None — High performer in Academics & Innovation',
    recommendedInterventions: [
      'Nominated for National Science Olympiad training track',
    ],
    status: 'resolved',
  },
];

const INITIAL_PARENT_METRICS: ParentEngagementMetric[] = [
  {
    parentId: 'par-1',
    parentName: 'Vikram Sharma',
    studentName: 'Aarav Sharma',
    classSection: 'Class 8-A',
    phone: '+91 98101 11223',
    email: 'vikram.sharma@example.com',
    ptmAttendanceRate: 100,
    appLoginDaysCount: 28,
    feePaymentOnTimeRate: 100,
    messageResponseRate: 96,
    compositeScore: 98,
    tier: 'Champion',
    lastActive: '10 mins ago',
  },
  {
    parentId: 'par-2',
    parentName: 'Sanjay Gupta',
    studentName: 'Aditya Gupta',
    classSection: 'Class 8-A',
    phone: '+91 98202 33445',
    email: 'sanjay.gupta@example.com',
    ptmAttendanceRate: 85,
    appLoginDaysCount: 22,
    feePaymentOnTimeRate: 100,
    messageResponseRate: 88,
    compositeScore: 89,
    tier: 'Champion',
    lastActive: '2 hours ago',
  },
  {
    parentId: 'par-3',
    parentName: 'Deepak Verma',
    studentName: 'Rohan Verma',
    classSection: 'Class 8-A',
    phone: '+91 98303 55667',
    email: 'deepak.verma@example.com',
    ptmAttendanceRate: 20,
    appLoginDaysCount: 3,
    feePaymentOnTimeRate: 35,
    messageResponseRate: 25,
    compositeScore: 26,
    tier: 'Disengaged',
    lastActive: '19 days ago',
  },
  {
    parentId: 'par-4',
    parentName: 'Manoj Patel',
    studentName: 'Kabir Patel',
    classSection: 'Class 9-B',
    phone: '+91 98404 77889',
    email: 'manoj.patel@example.com',
    ptmAttendanceRate: 60,
    appLoginDaysCount: 12,
    feePaymentOnTimeRate: 70,
    messageResponseRate: 52,
    compositeScore: 59,
    tier: 'Moderate',
    lastActive: '3 days ago',
  },
  {
    parentId: 'par-5',
    parentName: 'Tariq Khan',
    studentName: 'Zoya Khan',
    classSection: 'Class 10-A',
    phone: '+91 98505 99001',
    email: 'tariq.khan@example.com',
    ptmAttendanceRate: 80,
    appLoginDaysCount: 19,
    feePaymentOnTimeRate: 90,
    messageResponseRate: 75,
    compositeScore: 81,
    tier: 'Active',
    lastActive: 'Yesterday',
  },
];

const INITIAL_GROWTH_MILESTONES: StudentGrowthMilestone[] = [
  {
    id: 'ms-1',
    studentId: 'std-1',
    academicYear: '2023-2024',
    date: '2023-04-10',
    category: 'admission',
    title: 'Admitted with Academic Honors',
    description: 'Enrolled in Class 6 with top 1% score in entrance scholarship assessment.',
    verifierName: 'Principal Dr. Rajesh Sharma',
  },
  {
    id: 'ms-2',
    studentId: 'std-1',
    academicYear: '2023-2024',
    date: '2023-11-18',
    category: 'award',
    title: 'National Cyber Olympiad — Gold Medalist',
    description: 'Secured State Rank 1 and All-India Rank 14 in NCO Junior Level.',
    gradeScore: 'Gold Medal',
    badgeEarned: 'Code Ninja Master',
    verifierName: 'Vikram Mehta (HOD Computer Science)',
  },
  {
    id: 'ms-3',
    studentId: 'std-1',
    academicYear: '2024-2025',
    date: '2024-03-22',
    category: 'promotion',
    title: 'Promoted to Class 7-A with 96.4% Distinction',
    description: 'Received Academic Excellence Trophy for highest cumulative GPA.',
    gradeScore: 'A1 (96.4%)',
    verifierName: 'Examination Board',
  },
  {
    id: 'ms-4',
    studentId: 'std-1',
    academicYear: '2024-2025',
    date: '2024-10-15',
    category: 'sports',
    title: 'Inter-School Chess Championship Runner-Up',
    description: 'Represented school in Under-14 Interschool Invitational Chess Cup.',
    badgeEarned: 'Grandmaster Strategist',
    verifierName: 'Coach Gurpreet Singh',
  },
  {
    id: 'ms-5',
    studentId: 'std-1',
    academicYear: '2025-2026',
    date: '2025-08-20',
    category: 'certification',
    title: 'Certified Junior AI & Python Developer',
    description: 'Completed 60-hour Stanford Online Youth Robotics & ML Certification.',
    gradeScore: '98% Grade',
    verifierName: 'STEM Innovation Council',
  },
  {
    id: 'ms-6',
    studentId: 'std-1',
    academicYear: '2025-2026',
    date: '2026-02-14',
    category: 'academic',
    title: 'Term 2 Midterm Top Ranker',
    description: 'Scored 100/100 in Mathematics and 98/100 in Science.',
    gradeScore: '98.5% Aggregate',
    verifierName: 'Rahul Kumar (Class Teacher)',
  },
];

const INITIAL_CAREER_PATHWAYS: CareerPathway[] = [
  {
    id: 'cp-ai',
    title: 'Artificial Intelligence & Robotics Engineering',
    stream: 'Science (PCM)',
    description: 'Build the next generation of autonomous agents, neural networks, robotics systems, and foundational computing architectures.',
    topCareers: ['AI Research Scientist', 'Robotics Systems Engineer', 'Machine Learning Architect', 'Autonomous Vehicles Engineer'],
    keySkills: ['Advanced Calculus & Linear Algebra', 'Python & C++', 'Neural Networks & PyTorch', 'Algorithmic Problem Solving'],
    recommendedExams: ['JEE Main & Advanced', 'BITSAT', 'VITEEE', 'SAT & AP Computer Science A'],
    topCollegesIndia: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIIT Hyderabad', 'BITS Pilani'],
    topCollegesGlobal: ['MIT', 'Stanford University', 'Carnegie Mellon University', 'Cambridge University'],
    medianStartingSalaryLpa: 24,
    marketDemand: 'Very High',
  },
  {
    id: 'cp-med',
    title: 'Biotechnology, Genetics & Modern Medicine',
    stream: 'Science (PCB)',
    description: 'Pioneer CRISPR gene therapies, oncology breakthroughs, molecular biology research, and high-precision neurosurgery.',
    topCareers: ['Surgical Specialist', 'Genomics Researcher', 'Bioinformatics Scientist', 'Pharmaceutical Director'],
    keySkills: ['Cellular Biology', 'Organic Chemistry', 'Bioinformatics & DNA Sequencing', 'Clinical Diagnostics'],
    recommendedExams: ['NEET-UG', 'AIIMS Nursing & Paramedical', 'MCAT (Overseas)', 'CUET-PG'],
    topCollegesIndia: ['AIIMS New Delhi', 'Christian Medical College Vellore', 'JIPMER', 'Kasturba Medical College'],
    topCollegesGlobal: ['Harvard Medical School', 'Johns Hopkins University', 'Oxford University'],
    medianStartingSalaryLpa: 18,
    marketDemand: 'Very High',
  },
  {
    id: 'cp-fin',
    title: 'Investment Banking, Quantitative Finance & FinTech',
    stream: 'Commerce',
    description: 'Manage institutional equity portfolios, derivative strategies, quantitative trading, venture capital, and macroeconomic policy.',
    topCareers: ['Quantitative Portfolio Manager', 'Investment Banker', 'Chartered Financial Analyst (CFA)', 'FinTech Founder'],
    keySkills: ['Financial Modeling', 'Statistics & Econometrics', 'Corporate Valuation', 'Algorithmic Trading Systems'],
    recommendedExams: ['IPMAT (IIM Indore/Rohtak)', 'CUET-UG (SRCC, St. Stephen’s)', 'CA Foundation', 'CFA Level 1'],
    topCollegesIndia: ['SRCC Delhi University', 'St. Xavier’s College Mumbai', 'IIM Indore (IPM)', 'Christ University'],
    topCollegesGlobal: ['London School of Economics (LSE)', 'Wharton UPenn', 'NYU Stern', 'INSEAD'],
    medianStartingSalaryLpa: 22,
    marketDemand: 'High',
  },
  {
    id: 'cp-law',
    title: 'Corporate Law, International Relations & Public Policy',
    stream: 'Humanities & Arts',
    description: 'Navigate global geopolitical treaties, corporate antitrust litigation, intellectual property rights, and public administration.',
    topCareers: ['Corporate Litigator', 'Civil Services Diplomat (IFS/IAS)', 'International Human Rights Counsel', 'Supreme Court Advocate'],
    keySkills: ['Constitutional Jurisprudence', 'Analytical Rhetoric & Debate', 'Policy Drafting', 'Geopolitical Strategy'],
    recommendedExams: ['CLAT (Common Law Admission Test)', 'AILET', 'UPSC Civil Services Examination', 'LSAT'],
    topCollegesIndia: ['NLSIU Bengaluru', 'NALSAR Hyderabad', 'NLU Delhi', 'St. Stephen’s College'],
    topCollegesGlobal: ['Oxford Faculty of Law', 'Yale Law School', 'Sciences Po Paris'],
    medianStartingSalaryLpa: 16,
    marketDemand: 'High',
  },
  {
    id: 'cp-design',
    title: 'Product Design, UI/UX Architecture & HCI',
    stream: 'Vocational',
    description: 'Craft cutting-edge spatial computing interfaces, immersive digital products, and human-centered design experiences.',
    topCareers: ['Principal Product Designer', 'Spatial Computing Architect', 'Design Systems Lead', 'HCI Researcher'],
    keySkills: ['Design Systems & Figma', 'Human Factors & Cognitive Psychology', 'Motion Design & 3D Prototyping', 'User Research'],
    recommendedExams: ['UCEED (IIT Bombay)', 'NID DAT', 'NIFT', 'CEED'],
    topCollegesIndia: ['National Institute of Design (NID) Ahmedabad', 'IDC IIT Bombay', 'IIIT Delhi (CSD)', 'Srishti Institute'],
    topCollegesGlobal: ['Royal College of Art (RCA) London', 'Rhode Island School of Design (RISD)', 'Politecnico di Milano'],
    medianStartingSalaryLpa: 15,
    marketDemand: 'High',
  },
];

const INITIAL_GAMIFICATION_PROFILES: StudentGamificationProfile[] = [
  {
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    classSection: 'Class 8-A',
    house: 'Red Phoenix',
    totalPoints: 2450,
    level: 7,
    currentStreakDays: 24,
    badges: [
      {
        id: 'bg-1',
        code: 'PERFECT_ATTENDANCE',
        name: 'Iron Presence',
        category: 'attendance',
        iconName: 'ShieldCheck',
        description: 'Maintained 100% attendance for 30 consecutive school days.',
        pointsValue: 200,
        earnedDate: '2026-02-10',
      },
      {
        id: 'bg-2',
        code: 'MATH_WIZARD',
        name: 'Math Alchemist',
        category: 'academic',
        iconName: 'Sparkles',
        description: 'Scored full marks in 3 consecutive mathematics assessments.',
        pointsValue: 350,
        earnedDate: '2026-02-28',
      },
      {
        id: 'bg-3',
        code: 'ROBOTICS_STAR',
        name: 'Innovation Pioneer',
        category: 'creativity',
        iconName: 'Cpu',
        description: 'Successfully deployed computer vision model in STEM Lab.',
        pointsValue: 500,
        earnedDate: '2026-03-02',
      },
    ],
    recentActivities: [
      { title: 'Full Marks in Algebra Midterm Quiz', points: 100, timestamp: '2 hours ago' },
      { title: 'Morning Prompt Attendance Streak (Day 24)', points: 25, timestamp: 'Today, 08:15 AM' },
      { title: 'Submitted Science Practical Experiment early', points: 50, timestamp: 'Yesterday' },
    ],
  },
  {
    studentId: 'std-2',
    studentName: 'Aditya Gupta',
    classSection: 'Class 8-A',
    house: 'Blue Dragons',
    totalPoints: 1890,
    level: 5,
    currentStreakDays: 12,
    badges: [
      {
        id: 'bg-4',
        code: 'SPORTS_CHAMP',
        name: 'Lightning Striker',
        category: 'sports',
        iconName: 'Trophy',
        description: 'Won Inter-House Badminton Singles Trophy.',
        pointsValue: 300,
        earnedDate: '2026-01-20',
      },
    ],
    recentActivities: [
      { title: 'Badminton Morning Drill Session', points: 40, timestamp: 'Today, 07:30 AM' },
      { title: 'Clean Library Return on Time', points: 20, timestamp: '2 days ago' },
    ],
  },
  {
    studentId: 'std-4',
    studentName: 'Sneha Patel',
    classSection: 'Class 9-B',
    house: 'Green Falcons',
    totalPoints: 2150,
    level: 6,
    currentStreakDays: 18,
    badges: [
      {
        id: 'bg-5',
        code: 'ECO_WARRIOR',
        name: 'Campus Green Guardian',
        category: 'discipline',
        iconName: 'Leaf',
        description: 'Led solar audit initiative and zero plastic drive.',
        pointsValue: 400,
        earnedDate: '2026-02-15',
      },
    ],
    recentActivities: [
      { title: 'Zero Waste Cafeteria Audit badge point', points: 75, timestamp: 'Yesterday' },
    ],
  },
  {
    studentId: 'std-5',
    studentName: 'Vikram Choudhury',
    classSection: 'Class 10-A',
    house: 'Gold Eagles',
    totalPoints: 2310,
    level: 6,
    currentStreakDays: 21,
    badges: [
      {
        id: 'bg-6',
        code: 'DEBATE_TITAN',
        name: 'Orator of the Year',
        category: 'creativity',
        iconName: 'Mic',
        description: 'Won Best Speaker in Interschool Model United Nations.',
        pointsValue: 450,
        earnedDate: '2026-02-25',
      },
    ],
    recentActivities: [
      { title: 'MUN Best Delegate Commendation', points: 150, timestamp: '3 days ago' },
    ],
  },
];

const INITIAL_WORKSHEETS: GeneratedWorksheet[] = [
  {
    id: 'ws-1',
    subject: 'Mathematics',
    gradeClass: 'Class 8',
    topic: 'Linear Equations in One Variable & Applications',
    curriculum: 'CBSE',
    difficulty: 'Standard',
    generatedAt: '2026-03-12 11:30',
    teacherId: 'usr-teacher',
    teacherName: 'Rahul Kumar',
    totalMarks: 25,
    estimatedMinutes: 45,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Solve for x: 3x - 5 = 2x + 7. What is the value of x?',
        options: ['x = 8', 'x = 12', 'x = 2', 'x = -12'],
        correctAnswer: 'x = 12',
        explanation: 'Subtract 2x from both sides: x - 5 = 7. Add 5 to both sides: x = 12.',
        marks: 2,
      },
      {
        id: 2,
        type: 'mcq',
        question: 'The perimeter of a rectangle is 40 cm. If its length is 4 cm more than its breadth, find its breadth.',
        options: ['8 cm', '10 cm', '12 cm', '16 cm'],
        correctAnswer: '8 cm',
        explanation: 'Let breadth = b. Length = b + 4. Perimeter = 2(b + b + 4) = 40 => 4b + 8 = 40 => 4b = 32 => b = 8 cm.',
        marks: 3,
      },
      {
        id: 3,
        type: 'short_answer',
        question: 'A two-digit number has digits whose sum is 9. If 27 is added to the number, the digits reverse their order. Find the original number.',
        correctAnswer: '36',
        explanation: 'Let tens digit be t, units digit be u. t + u = 9 => u = 9 - t. Original number = 10t + u = 10t + 9 - t = 9t + 9. Reversed number = 10u + t = 10(9 - t) + t = 90 - 9t. Given: 9t + 9 + 27 = 90 - 9t => 18t = 54 => t = 3, u = 6. Original number = 36.',
        marks: 5,
      },
      {
        id: 4,
        type: 'reasoning',
        question: 'Prove whether the equation (x + 2)(x - 2) = x² - 4 is a conditional equation or an algebraic identity. State clear mathematical rationale.',
        correctAnswer: 'It is an algebraic identity that holds true for every real value of x.',
        explanation: 'Expanding LHS gives x² - 2x + 2x - 4 = x² - 4, which is identically equal to RHS for all x ∈ ℝ. Hence it is an identity rather than a conditional equation.',
        marks: 5,
      },
      {
        id: 5,
        type: 'hots',
        question: 'A water tank can be filled by Pipe A in 6 hours and by Pipe B in 8 hours. An outlet Pipe C can empty the full tank in 12 hours. If all three pipes are opened simultaneously when the tank is completely empty, calculate the exact time in hours and minutes required to fill the tank.',
        correctAnswer: '4 hours and 48 minutes (4.8 hours)',
        explanation: 'Net rate per hour = (1/6) + (1/8) - (1/12) = (4 + 3 - 2)/24 = 5/24 tanks per hour. Time needed = 24/5 hours = 4.8 hours = 4 hours and 48 minutes.',
        marks: 10,
      },
    ],
  },
];

const INITIAL_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'wf-leave',
    name: 'Student Medical & Extended Leave Approval',
    category: 'leave',
    description: 'Multi-tier verification for student absences exceeding 2 consecutive days.',
    isActive: true,
    stages: [
      { id: 'stg-1', stageName: 'Class Teacher Medical Slip Review', approverRole: 'class_teacher', timeLimitHours: 24, isMandatory: true },
      { id: 'stg-2', stageName: 'School Infirmary & Medical Officer Clearance', approverRole: 'counselor', timeLimitHours: 12, isMandatory: false },
      { id: 'stg-3', stageName: 'Vice Principal Final Endorsement', approverRole: 'vice_principal', timeLimitHours: 24, isMandatory: true },
    ],
    escalationRole: 'principal',
    autoApproveHours: 48,
  },
  {
    id: 'wf-admission',
    name: 'New Student Admission & KYC Verification',
    category: 'admission',
    description: 'Zero-trust verification pipeline from online application to fee clearance.',
    isActive: true,
    stages: [
      { id: 'stg-adm-1', stageName: 'Admissions Desk Document & Birth Certificate Audit', approverRole: 'receptionist', timeLimitHours: 24, isMandatory: true },
      { id: 'stg-adm-2', stageName: 'Academic Coordinator Entrance Score Review', approverRole: 'academic_coordinator', timeLimitHours: 48, isMandatory: true },
      { id: 'stg-adm-3', stageName: 'Accountant First Term Fee & Caution Deposit Reconciliation', approverRole: 'accountant', timeLimitHours: 24, isMandatory: true },
      { id: 'stg-adm-4', stageName: 'Head of School Final Admission Letter Seal', approverRole: 'principal', timeLimitHours: 24, isMandatory: true },
    ],
    escalationRole: 'super_admin',
  },
  {
    id: 'wf-concession',
    name: 'Merit & Need-Based Fee Concession Request',
    category: 'fee_concession',
    description: 'Transparent appraisal for underprivileged and sports merit fee relief.',
    isActive: true,
    stages: [
      { id: 'stg-f-1', stageName: 'Welfare Committee Income Proof Check', approverRole: 'office_staff', timeLimitHours: 48, isMandatory: true },
      { id: 'stg-f-2', stageName: 'Senior Accountant Financial Audit', approverRole: 'accountant', timeLimitHours: 24, isMandatory: true },
      { id: 'stg-f-3', stageName: 'Chairman & Principal Concession Sanction', approverRole: 'principal', timeLimitHours: 48, isMandatory: true },
    ],
    escalationRole: 'super_admin',
  },
];

const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-att-dip',
    name: 'Low Attendance WhatsApp Alert to Guardians',
    triggerEvent: 'attendance_below_threshold',
    conditionField: 'attendanceRate',
    operator: 'less_than',
    conditionValue: 75,
    actionType: 'send_parent_whatsapp',
    messageTemplate: 'Dear Parent, Your child {student_name} has attendance at {attendance_rate}%, which is below CBSE 75% norm. Please contact the class teacher immediately.',
    isEnabled: true,
    lastExecutedAt: '2026-03-12 09:15',
    executionCount: 14,
  },
  {
    id: 'rule-fee-overdue',
    name: 'Term Fee Overdue Grace Period Reminder',
    triggerEvent: 'fee_overdue',
    conditionField: 'pendingFeeBalance',
    operator: 'greater_than',
    conditionValue: 5000,
    actionType: 'send_parent_sms',
    messageTemplate: 'Reminder: Term fee balance of ₹{pending_amount} is overdue for {student_name}. Pay online via SmartSchool portal to avoid late surcharge.',
    isEnabled: true,
    lastExecutedAt: '2026-03-11 16:30',
    executionCount: 29,
  },
  {
    id: 'rule-failing-counselor',
    name: 'Failing Exam Score Counselor Intervention',
    triggerEvent: 'marks_failing',
    conditionField: 'academicGpaPercent',
    operator: 'less_than',
    conditionValue: 45,
    actionType: 'alert_counselor',
    messageTemplate: 'Academic Warning: {student_name} has scored below 45% in midterms. Auto-scheduled for guidance diagnostic assessment.',
    isEnabled: true,
    lastExecutedAt: '2026-03-10 14:00',
    executionCount: 8,
  },
  {
    id: 'rule-consecutive-absent',
    name: '3-Day Consecutive Absence Principal Notification',
    triggerEvent: 'consecutive_absent',
    conditionField: 'absentDaysStreak',
    operator: 'greater_than',
    conditionValue: 3,
    actionType: 'flag_principal',
    messageTemplate: 'High Alert: Student {student_name} is absent for 3 consecutive days without prior medical notice.',
    isEnabled: true,
    lastExecutedAt: '2026-03-09 10:45',
    executionCount: 5,
  },
];

const INITIAL_TENANTS: InstitutionalTenant[] = [
  {
    id: 'tenant-main',
    name: 'Delhi Public World School',
    subdomain: 'dpws-delhi',
    brandCode: 'DPWS-01',
    motto: 'Service Before Self — Empowering Leaders',
    affiliationNumber: 'CBSE/AFF/2130892',
    board: 'CBSE (Central Board of Secondary Education)',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    primaryColorHex: '#4f46e5',
    accentColorHex: '#06b6d4',
    campusesCount: 3,
    totalStudentsCount: 2450,
    isIsolatedData: true,
    contactEmail: 'admissions@dpwsdelhi.edu.in',
  },
  {
    id: 'tenant-cambridge',
    name: 'Cambridge International Academy',
    subdomain: 'cia-global',
    brandCode: 'CIA-02',
    motto: 'Inquire, Innovate, Inspire',
    affiliationNumber: 'CIE/UK/IN-492',
    board: 'Cambridge Assessment International Education (IGCSE/A-Levels)',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    primaryColorHex: '#0284c7',
    accentColorHex: '#10b981',
    campusesCount: 2,
    totalStudentsCount: 1680,
    isIsolatedData: true,
    contactEmail: 'registrar@cambridgeacademy.org',
  },
  {
    id: 'tenant-xavier',
    name: 'St. Xavier’s Model School',
    subdomain: 'sxms-central',
    brandCode: 'SXMS-03',
    motto: 'Excellence in Truth and Character',
    affiliationNumber: 'CISCE/ICSE/KA-102',
    board: 'CISCE (ICSE / ISC Board)',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
    primaryColorHex: '#9333ea',
    accentColorHex: '#f59e0b',
    campusesCount: 1,
    totalStudentsCount: 1200,
    isIsolatedData: true,
    contactEmail: 'admin@stxavierschool.edu',
  },
];

const INITIAL_FACE_LOGS: FaceAttendanceEntry[] = [
  {
    id: 'fl-1',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    classSection: 'Class 8-A',
    rollNumber: '8A-01',
    confidencePercent: 99.4,
    timestamp: '2026-03-13 08:14:22',
    matchStatus: 'VERIFIED',
    deviceInfo: 'Gate Terminal Alpha (iPad Kiosk LiDAR)',
    snapshotUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'fl-2',
    studentId: 'std-2',
    studentName: 'Aditya Gupta',
    classSection: 'Class 8-A',
    rollNumber: '8A-02',
    confidencePercent: 98.7,
    timestamp: '2026-03-13 08:18:05',
    matchStatus: 'VERIFIED',
    deviceInfo: 'Gate Terminal Alpha (iPad Kiosk LiDAR)',
    snapshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'fl-3',
    studentId: 'std-4',
    studentName: 'Sneha Patel',
    classSection: 'Class 9-B',
    rollNumber: '9B-05',
    confidencePercent: 97.9,
    timestamp: '2026-03-13 08:21:40',
    matchStatus: 'VERIFIED',
    deviceInfo: 'Gate Terminal Beta (Android Face Tablet)',
    snapshotUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
];

class EnterpriseStoreService {
  private state: EnterpriseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): EnterpriseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      rooms: INITIAL_ROOMS,
      riskProfiles: INITIAL_RISK_PROFILES,
      parentMetrics: INITIAL_PARENT_METRICS,
      growthMilestones: INITIAL_GROWTH_MILESTONES,
      careerPathways: INITIAL_CAREER_PATHWAYS,
      gamificationProfiles: INITIAL_GAMIFICATION_PROFILES,
      worksheets: INITIAL_WORKSHEETS,
      workflows: INITIAL_WORKFLOWS,
      automationRules: INITIAL_AUTOMATION_RULES,
      tenants: INITIAL_TENANTS,
      faceLogs: INITIAL_FACE_LOGS,
    };
  }

  public getState(): EnterpriseState {
    return this.state;
  }

  public save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public mutate(updater: (state: EnterpriseState) => void) {
    updater(this.state);
    this.save();
  }

  // Room methods
  public toggleRoomLight(roomId: string) {
    this.mutate((s) => {
      const room = s.rooms.find((r) => r.id === roomId);
      if (room) {
        room.lightsOn = !room.lightsOn;
      }
    });
  }

  public toggleRoomProjector(roomId: string) {
    this.mutate((s) => {
      const room = s.rooms.find((r) => r.id === roomId);
      if (room) {
        room.projectorOn = !room.projectorOn;
      }
    });
  }

  public updateRoomStatus(roomId: string, status: RoomOccupancy['status']) {
    this.mutate((s) => {
      const room = s.rooms.find((r) => r.id === roomId);
      if (room) {
        room.status = status;
        if (status === 'vacant') {
          room.currentOccupancy = 0;
          room.lightsOn = false;
          room.projectorOn = false;
        }
      }
    });
  }

  // Risk methods
  public scheduleRiskCounseling(studentId: string, counselor: string, note: string) {
    this.mutate((s) => {
      const profile = s.riskProfiles.find((r) => r.studentId === studentId);
      if (profile) {
        profile.counselorAssigned = counselor;
        profile.lastInterventionDate = new Date().toISOString().split('T')[0];
        profile.recommendedInterventions.unshift(note);
        profile.status = 'monitoring';
      }
    });
  }

  public resolveRisk(studentId: string) {
    this.mutate((s) => {
      const profile = s.riskProfiles.find((r) => r.studentId === studentId);
      if (profile) {
        profile.status = 'resolved';
        profile.riskScore = Math.max(10, profile.riskScore - 30);
      }
    });
  }

  // Milestone methods
  public addMilestone(milestone: Omit<StudentGrowthMilestone, 'id'>) {
    const newM: StudentGrowthMilestone = {
      ...milestone,
      id: `ms-${Date.now()}`,
    };
    this.mutate((s) => {
      s.growthMilestones.unshift(newM);
    });
    return newM;
  }

  // Gamification methods
  public awardPoints(studentId: string, points: number, activityTitle: string) {
    this.mutate((s) => {
      let prof = s.gamificationProfiles.find((p) => p.studentId === studentId);
      if (!prof) {
        prof = {
          studentId,
          studentName: 'Student',
          classSection: 'Class 8-A',
          house: 'Red Phoenix',
          totalPoints: 0,
          level: 1,
          currentStreakDays: 1,
          badges: [],
          recentActivities: [],
        };
        s.gamificationProfiles.push(prof);
      }
      prof.totalPoints += points;
      prof.level = Math.floor(prof.totalPoints / 350) + 1;
      prof.recentActivities.unshift({
        title: activityTitle,
        points,
        timestamp: 'Just now',
      });
    });
  }

  // Face attendance
  public addFaceLog(entry: Omit<FaceAttendanceEntry, 'id' | 'timestamp'>) {
    const newLog: FaceAttendanceEntry = {
      ...entry,
      id: `fl-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.mutate((s) => {
      s.faceLogs.unshift(newLog);
    });
    return newLog;
  }

  // Worksheet
  public addWorksheet(sheet: GeneratedWorksheet) {
    this.mutate((s) => {
      s.worksheets.unshift(sheet);
    });
  }

  // Automation
  public toggleAutomationRule(ruleId: string) {
    this.mutate((s) => {
      const rule = s.automationRules.find((r) => r.id === ruleId);
      if (rule) {
        rule.isEnabled = !rule.isEnabled;
      }
    });
  }

  public executeAutomationRule(ruleId: string) {
    this.mutate((s) => {
      const rule = s.automationRules.find((r) => r.id === ruleId);
      if (rule) {
        rule.executionCount += 1;
        rule.lastExecutedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
    });
  }

  // Workflows
  public addWorkflowStage(workflowId: string, stageName: string, role: string) {
    this.mutate((s) => {
      const wf = s.workflows.find((w) => w.id === workflowId);
      if (wf) {
        wf.stages.push({
          id: `stg-${Date.now()}`,
          stageName,
          approverRole: role,
          timeLimitHours: 24,
          isMandatory: true,
        });
      }
    });
  }
}

export const enterpriseStore = new EnterpriseStoreService();
