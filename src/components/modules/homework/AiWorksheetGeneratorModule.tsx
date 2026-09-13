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
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-50 dark:bg-violet-950/60 rounded-xl text-violet-600 dark:text-violet-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Homework & Worksheet Generator
              <span className="text-xs px-2.5 py-0.5 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold rounded-full border border-violet-200 dark:border-violet-900">
                Curriculum Aligned
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Instantly create differentiated assessments, question papers, and detailed solution rubrics across CBSE, ICSE & Cambridge.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswerKey ? 'Hide Teacher Answer Key' : 'Reveal Solution Key'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Clean Exam Paper
          </button>

          <button
            onClick={handleAssignToClass}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Assign Directly to Class
          </button>
        </div>
      </div>

      {/* Main Layout: Generator Form (4 cols) & Worksheet Paper Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Controls (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:hidden">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-600" />
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
        </div>

        {/* Right Preview: Clean Printable Exam Paper (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {activeSheet ? (
            <div className="space-y-6">
              {/* Official School Exam Header */}
              <div className="text-center pb-6 border-b-2 border-slate-800 dark:border-slate-700 space-y-1.5">
                <div className="text-xs tracking-widest uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  SMARTSCHOOL OS • ACADEMIC ASSESSMENT DIVISION
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase">
                  {activeSheet.subject} — {activeSheet.topic}
                </h2>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-4 pt-1">
                  <span>Class: <strong>{activeSheet.gradeClass}</strong></span>
                  <span>Board: <strong>{activeSheet.curriculum}</strong></span>
                  <span>Difficulty: <strong>{activeSheet.difficulty}</strong></span>
                  <span>Total Marks: <strong>{activeSheet.totalMarks}</strong></span>
                  <span>Time: <strong>{activeSheet.estimatedMinutes} Mins</strong></span>
                </div>

                {/* Printable Student Details Line */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-left border-t border-dashed border-slate-300 dark:border-slate-700 mt-4">
                  <div>Student Name: _____________________</div>
                  <div>Roll No: ________________</div>
                  <div>Date: ________________</div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeSheet.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-2 text-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        Q{idx + 1}. {q.question}
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        [{q.marks} Marks]
                      </span>
                    </div>

                    {/* Multiple Choice Options */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1 text-xs">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                          >
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Teacher Solution & Rubric Key (Collapsible) */}
                    {showAnswerKey && (
                      <div className="mt-3 p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-500 rounded-r-xl text-xs space-y-1 print:hidden">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct Answer: {q.correctAnswer}
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
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Created by: {activeSheet.teacherName}</span>
                <span className="font-mono">Generated on: {activeSheet.generatedAt}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select or generate a worksheet from the left panel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AiWorksheetGeneratorModule;
