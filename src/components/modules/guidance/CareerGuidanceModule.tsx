import React, { useState } from 'react';
import {
  Compass,
  Briefcase,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  DollarSign,
  Search,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { CareerPathway } from '../../../types/enterprise';
import { Modal } from '../../common/Modal';

interface QuizQuestion {
  id: number;
  question: string;
  riasecCode: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  optionYes: string;
  optionNo: string;
}

const RIASEC_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Do you enjoy designing algorithms, writing code, or building automated machines?',
    riasecCode: 'I',
    optionYes: 'Love analytical challenges and system architectures',
    optionNo: 'Prefer non-technical or social activities',
  },
  {
    id: 2,
    question: 'Are you fascinated by biological systems, genetics, or clinical medicine?',
    riasecCode: 'I',
    optionYes: 'Passionate about healthcare and life sciences',
    optionNo: 'Less drawn to biological laboratory research',
  },
  {
    id: 3,
    question: 'Do you follow stock markets, venture capital, and corporate business models?',
    riasecCode: 'E',
    optionYes: 'Strongly intrigued by finance, markets and strategy',
    optionNo: 'Prefer pure research or creative arts',
  },
  {
    id: 4,
    question: 'Do you thrive in debate, constitutional law, geopolitical affairs, and public policy?',
    riasecCode: 'S',
    optionYes: 'Enthusiastic about advocacy, rhetoric and social reform',
    optionNo: 'Prefer working with data or physical objects',
  },
  {
    id: 5,
    question: 'Do you enjoy visual design, spatial computing, typography, and human interaction?',
    riasecCode: 'A',
    optionYes: 'Passionate about creative design and aesthetic experiences',
    optionNo: 'Prefer quantitative calculation or administration',
  },
  {
    id: 6,
    question: 'Do you prefer hands-on building, robotics hardware, drone assembly, or field engineering?',
    riasecCode: 'R',
    optionYes: 'Excited by physical prototypes and hardware engineering',
    optionNo: 'Prefer purely digital or theoretical work',
  },
];

const UPCOMING_EXAMS = [
  { name: 'JEE Main (Session 2)', date: '2026-04-04', stream: 'PCM', target: 'IITs / NITs' },
  { name: 'NEET-UG (Medical)', date: '2026-05-03', stream: 'PCB', target: 'AIIMS / JIPMER' },
  { name: 'CUET-UG (Central Universities)', date: '2026-05-18', stream: 'All', target: 'DU / BHU / JNU' },
  { name: 'IPMAT (IIM Indore/Rohtak)', date: '2026-05-25', stream: 'Commerce/Any', target: '5-Yr Integrated MBA' },
  { name: 'CLAT (Common Law Admission)', date: '2026-12-06', stream: 'Humanities/Any', target: 'National Law Universities' },
];

export const CareerGuidanceModule: React.FC = () => {
  const { state } = useEnterprise();
  const { showToast } = useSchool();

  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<CareerPathway | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const filteredPathways = state.careerPathways.filter((cp) => {
    const matchesStream = selectedStream === 'all' || cp.stream === selectedStream;
    const matchesSearch =
      cp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.topCareers.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cp.recommendedExams.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStream && matchesSearch;
  });

  const handleAnswerQuiz = (qId: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleCalculateQuizResult = () => {
    // Basic RIASEC mapping based on answers
    if (quizAnswers[1] && !quizAnswers[2]) {
      setQuizResult('Science (PCM) — Artificial Intelligence & Robotics Engineering');
    } else if (quizAnswers[2]) {
      setQuizResult('Science (PCB) — Biotechnology, Genetics & Medical Sciences');
    } else if (quizAnswers[3]) {
      setQuizResult('Commerce & FinTech — Quantitative Finance & Investment Strategy');
    } else if (quizAnswers[4]) {
      setQuizResult('Humanities & Arts — Corporate Law & Public Policy');
    } else if (quizAnswers[5]) {
      setQuizResult('Vocational — Product Design & Spatial HCI');
    } else {
      setQuizResult('Science (PCM) — Engineering & Applied Research');
    }
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Guidance Consultation Confirmed',
      'Career Counselor Dr. Meenakshi Sundaram assigned. Slot booked for tomorrow 11:00 AM.',
      'success'
    );
    setIsConsultModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Career Guidance & Pathways
              <span className="text-xs px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold rounded-full border border-blue-200 dark:border-blue-900">
                Future Readiness
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Curated stream pathways, entrance exam timelines, university benchmarks, and psychometric assessment.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Take Aptitude & Stream Quiz
          </button>

          <button
            onClick={() => setIsConsultModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <UserCheck className="w-4 h-4" />
            Book Counselor Session
          </button>
        </div>
      </div>

      {/* Upcoming National Entrance Exams Tracker */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            National Entrance Examination Timelines (2026 Season)
          </h3>
          <span className="text-xs text-slate-400">Official NTA / Examination Board Schedules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {UPCOMING_EXAMS.map((exam) => (
            <div
              key={exam.name}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                  {exam.stream}
                </span>
                <div className="font-bold text-slate-900 dark:text-white mt-1 text-xs">{exam.name}</div>
                <div className="text-slate-400 mt-0.5 text-[11px]">{exam.target}</div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-500" /> {exam.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search pathway, career, college or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Academic Streams</option>
            <option value="Science (PCM)">Science (PCM)</option>
            <option value="Science (PCB)">Science (PCB)</option>
            <option value="Commerce">Commerce & FinTech</option>
            <option value="Humanities & Arts">Humanities & Law</option>
            <option value="Vocational">Vocational & Design</option>
          </select>
        </div>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredPathways.map((pathway) => (
          <div
            key={pathway.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {pathway.stream}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {pathway.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Est. Starting Package</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{pathway.medianStartingSalaryLpa} LPA
                  </div>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {pathway.description}
              </p>

              {/* Target Careers Pill List */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Key Career Profiles
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pathway.topCareers.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Exams */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Entrance Exams:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {pathway.recommendedExams.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Market Demand:</span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {pathway.marketDemand}
                  </div>
                </div>
              </div>

              {/* Top Indian & Global Institutes */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Top Institutes (India):</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                    {pathway.topCollegesIndia.slice(0, 3).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Global Benchmarks:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                    {pathway.topCollegesGlobal.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Pathway CTA */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Detailed Roadmap Available</span>
              <button
                onClick={() => {
                  setSelectedPathway(pathway);
                  setIsConsultModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                Plan Roadmap with Mentor <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Psychometric Aptitude Quiz Modal */}
      {isQuizModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsQuizModalOpen(false)}
          title="Holland Code (RIASEC) Career & Stream Assessment"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Answer the 6 aptitude questions below to calculate your dominant psychological orientation and best-fit academic stream.
            </p>

            <div className="space-y-3">
              {RIASEC_QUESTIONS.map((q) => (
                <div key={q.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {q.id}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerQuiz(q.id, true)}
                      className={`p-2.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                        quizAnswers[q.id] === true
                          ? 'bg-blue-600 text-white border-blue-600 shadow'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ✓ Yes: {q.optionYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerQuiz(q.id, false)}
                      className={`p-2.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                        quizAnswers[q.id] === false
                          ? 'bg-slate-700 text-white border-slate-700'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ✗ No: {q.optionNo}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {quizResult && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Recommended Stream Assessment Result:
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {quizResult}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  High alignment with analytical reasoning, quantitative modeling, and innovation benchmarks.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleCalculateQuizResult}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Compute Stream Recommendation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Book Consultation Modal */}
      {isConsultModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsConsultModalOpen(false)}
          title="Schedule 1-on-1 Career Consultation"
          size="md"
        >
          <form onSubmit={handleBookConsultation} className="space-y-4">
            <p className="text-xs text-slate-500">
              Meet with the senior guidance counselor to review mock exam performance, stream prerequisites, and scholarship applications.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Counselor
              </label>
              <input
                type="text"
                readOnly
                value="Dr. Meenakshi Sundaram (Head of Career & Psychometrics)"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Consultation Slot
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white">
                <option>Tomorrow — 11:00 AM to 11:45 AM (Counseling Suite 2)</option>
                <option>Thursday — 02:30 PM to 03:15 PM (Virtual Google Meet)</option>
                <option>Saturday — 10:00 AM to 10:45 AM (Parent & Student Joint)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic of Focus / Questions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. JEE vs SAT foreign admission comparison; Class 11 subject elective choice..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConsultModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default CareerGuidanceModule;
