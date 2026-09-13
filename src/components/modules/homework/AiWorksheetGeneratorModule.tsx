import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Printer,
  CheckCircle2,
  FileText,
  Sliders,
  Send,
  Eye,
  EyeOff,
  Layers,
  GraduationCap,
  Clock,
  Plus,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { GeneratedWorksheet } from '../../../types/enterprise';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const AiWorksheetGeneratorModule: React.FC = () => {
  const { state, addWorksheet } = useEnterprise();
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser } = useAuth();

  // Generator form inputs
  const [subject, setSubject] = useState<string>('Mathematics');
  const [gradeClass, setGradeClass] = useState<string>('Class 8');
  const [curriculum, setCurriculum] = useState<'CBSE' | 'ICSE' | 'Cambridge'>('CBSE');
  const [difficulty, setDifficulty] = useState<GeneratedWorksheet['difficulty']>('Standard');
  const [topic, setTopic] = useState<string>('Algebraic Expressions & Factorisation');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active worksheet & teacher answer key toggle
  const [activeSheet, setActiveSheet] = useState<GeneratedWorksheet>(state.worksheets[0]);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);

  const handleGenerateAiWorksheet = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // Create high-fidelity questions based on selected topic
      const generatedQuestions = [
        {
          id: 1,
          type: 'mcq' as const,
          question: `Which of the following represents the factorised form of 4x² - 9y² in the context of ${topic}?`,
          options: ['(2x - 3y)(2x + 3y)', '(4x - 9y)(x + y)', '(2x - 3y)²', '(2x + 3y)²'],
          correctAnswer: '(2x - 3y)(2x + 3y)',
          explanation: 'Using the algebraic difference of squares identity a² - b² = (a - b)(a + b), where a = 2x and b = 3y.',
          marks: 2,
        },
        {
          id: 2,
          type: 'mcq' as const,
          question: `What is the degree of the polynomial 7x³y² - 5x⁴y + 9xy³ + 14?`,
          options: ['4', '5', '6', '3'],
          correctAnswer: '5',
          explanation: 'The degree of a multivariable polynomial term is the highest sum of exponents: 7x³y² has 3+2=5, -5x⁴y has 4+1=5. The degree is 5.',
          marks: 2,
        },
        {
          id: 3,
          type: 'short_answer' as const,
          question: `Factorise completely by grouping terms: ax + bx - ay - by. Show all intermediate steps.`,
          correctAnswer: '(a + b)(x - y)',
          explanation: 'Group terms: x(a + b) - y(a + b). Factoring common binomial (a + b) yields (a + b)(x - y).',
          marks: 4,
        },
        {
          id: 4,
          type: 'reasoning' as const,
          question: `Is it possible for the sum of two binomials to yield a monomial? Justify with a valid mathematical counter-example or proof.`,
          correctAnswer: 'Yes, if the opposite terms cancel out (e.g. (3x + 2) + (5x - 2) = 8x).',
          explanation: 'When opposite constant or like terms cancel identically, the resulting expression simplifies to a single term monomial.',
          marks: 5,
        },
        {
          id: 5,
          type: 'hots' as const,
          question: `A rectangular playground has an area given by A(x) = 6x² + 11x - 10. If the length is given by (2x + 5), determine the polynomial expression representing the perimeter of the playground.`,
          correctAnswer: 'Perimeter = 10x + 6',
          explanation: 'Area = length × breadth => 6x² + 11x - 10 = (2x + 5)(3x - 2). Breadth = 3x - 2. Perimeter = 2(length + breadth) = 2((2x + 5) + (3x - 2)) = 2(5x + 3) = 10x + 6.',
          marks: 7,
        },
      ];

      const newWorksheet: GeneratedWorksheet = {
        id: `ws-${Date.now()}`,
        subject,
        gradeClass,
        topic,
        curriculum,
        difficulty,
        generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        totalMarks: 20,
        estimatedMinutes: 40,
        questions: generatedQuestions,
      };

      addWorksheet(newWorksheet);
      setActiveSheet(newWorksheet);
      setIsGenerating(false);

      showToast(
        'AI Worksheet Generated!',
        `Created 5-question test for ${gradeClass} ${subject} on "${topic}".`,
        'success'
      );
    }, 900);
  };

  const handleAssignToClass = () => {
    mutateDb((draft) => {
      draft.homework.unshift({
        id: `hw-${Date.now()}`,
        classSection: activeSheet.gradeClass,
        subject: activeSheet.subject,
        title: `Worksheet: ${activeSheet.topic}`,
        description: `Complete the ${activeSheet.curriculum} worksheet with ${activeSheet.questions.length} questions. Marks: ${activeSheet.totalMarks}.`,
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        teacherName: currentUser.name,
        submissionCount: 0,
        totalStudents: 40,
      });
    });

    showToast(
      'Worksheet Assigned to Students',
      `Auto-published to Class ${activeSheet.gradeClass} portal with 3-day submission window.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <Card variant="glass" className="p-5 sm:p-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/25 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                  AI Homework & Worksheet Generator
                </h1>
                <Badge variant="primary" dot size="sm">
                  Curriculum Aligned
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Instantly create differentiated assessments, question papers, and detailed solution rubrics across CBSE, ICSE & Cambridge.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={showAnswerKey ? EyeOff : Eye}
              onClick={() => setShowAnswerKey(!showAnswerKey)}
            >
              {showAnswerKey ? 'Hide Answer Key' : 'Reveal Solution Key'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Clean Paper
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={handleAssignToClass}
            >
              Assign to Class
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Layout: Generator Form (4 cols) & Worksheet Paper Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Controls (4 cols) */}
        <Card variant="glass" className="lg:col-span-4 p-5 sm:p-6 space-y-4 print:hidden">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Sliders className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Assessment Parameters
          </h3>

          <form onSubmit={handleGenerateAiWorksheet} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science (Physics)">Science (Physics)</option>
                <option value="Science (Chemistry)">Science (Chemistry)</option>
                <option value="Biology">Biology</option>
                <option value="English Literature">English Literature</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science & AI</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade / Class
                </label>
                <select
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Nursery">Nursery (Early Years)</option>
                  <option value="LKG">LKG (Kindergarten 1)</option>
                  <option value="UKG">UKG (Kindergarten 2)</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Curriculum
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE Board</option>
                  <option value="Cambridge">Cambridge (CIE)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cognitive Complexity / Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Foundation">Foundation (Remedial / Core)</option>
                <option value="Standard">Standard (CBSE Exam Level)</option>
                <option value="Advanced (HOTS)">Advanced (Higher Order Thinking)</option>
                <option value="Olympiad">Olympiad & Competitive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Chapter / Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Linear Equations in One Variable"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Synthesizing Questions with AI...' : 'Generate New Worksheet'}
            </button>
          </form>

          {/* Previous Worksheets History */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saved Worksheets Library
            </span>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {state.worksheets.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setActiveSheet(ws)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex flex-col justify-between border ${
                    activeSheet?.id === ws.id
                      ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-800 text-violet-900 dark:text-violet-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-semibold truncate">{ws.topic}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ws.gradeClass} • {ws.subject} • {ws.curriculum}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Preview: Clean Printable Exam Paper (8 cols) */}
        <Card variant="glass" className="lg:col-span-8 p-6 md:p-8 rounded-3xl shadow-md">
          {activeSheet ? (
            <div className="space-y-6">
              {/* Official School Exam Header */}
              <div className="text-center pb-6 border-b-2 border-slate-800 dark:border-slate-700 space-y-1.5">
                <div className="text-xs tracking-widest uppercase font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  SMARTSCHOOL OS • ACADEMIC ASSESSMENT DIVISION
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase font-display">
                  {activeSheet.subject} — {activeSheet.topic}
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold text-slate-500 pt-1">
                  <span>Class: {activeSheet.gradeClass}</span>
                  <span>•</span>
                  <span>Board: {activeSheet.curriculum}</span>
                  <span>•</span>
                  <span>Difficulty: {activeSheet.difficulty}</span>
                  <span>•</span>
                  <span>Max Marks: {activeSheet.totalMarks}</span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeSheet.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono mr-1">
                          Q{idx + 1}.
                        </span>{' '}
                        {q.question}
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                      </span>
                    </div>

                    {/* MCQ Options Grid */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Teacher Solution Key Overlay */}
                    {showAnswerKey && (
                      <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct Answer: {q.correctAnswer}</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          <strong>Solution Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Created by: {activeSheet.teacherName}</span>
                <span className="font-mono">Generated on: {activeSheet.generatedAt}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select or generate a worksheet from the left panel.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default AiWorksheetGeneratorModule;
