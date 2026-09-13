import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { aiAssistant, AiChatMessage } from '../../services/aiAssistantService';
import { Badge } from '../common/Badge';
import { ModuleName } from '../../types/auth';

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, language, setActiveModule } = useSchool();
  const { currentUser, effectiveDevice } = useAuth();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message builder
  const getInitialGreeting = (): string => {
    if (language === 'hi') {
      return `नमस्ते **${currentUser.name}**! मैं आपका **SmartSchool AI Copilot** हूँ।\n\nमैं आपकी साख (**${currentUser.roleTitle}** on **${effectiveDevice}**) से सुरक्षित रूप से जुड़ा हुआ हूँ। आप मुझसे उपस्थिति, डिजिटल ट्विन, परीक्षा परिणाम, फीस या परिवहन के बारे में कुछ भी पूछ सकते हैं।`;
    }
    if (language === 'hinglish') {
      return `Hello **${currentUser.name}**! Main aapka **SmartSchool AI Copilot** hoon.\n\nAapki role (**${currentUser.roleTitle}** on **${effectiveDevice}**) ke authorized scope ke sath ready hoon. Attendance, Digital Twin, Exam results, ya Fees ke baare me poochiye!`;
    }
    if (language === 'es') {
      return `¡Hola **${currentUser.name}**! Soy su **Copiloto de IA de SmartSchool**.\n\nEstoy vinculado de forma segura a sus credenciales (**${currentUser.roleTitle}** en **${effectiveDevice}**). ¡Pregúnteme sobre asistencia, campus digital, notas o finanzas!`;
    }
    if (language === 'fr') {
      return `Bonjour **${currentUser.name}** ! Je suis votre **Copilote IA SmartSchool**.\n\nJe suis synchronisé avec vos autorisations (**${currentUser.roleTitle}** sur **${effectiveDevice}**). N'hésitez pas à me poser vos questions sur l'établissement !`;
    }
    if (language === 'ar') {
      return `مرحباً **${currentUser.name}**! أنا **مساعد الذكاء الاصطناعي لنظام SmartSchool**.\n\nأنا مرتبط بصلاحياتك المعتمدة (**${currentUser.roleTitle}**). اسألني عن الحضور، التوأم الرقمي، النتائج والرسوم!`;
    }
    if (language === 'ta') {
      return `வணக்கம் **${currentUser.name}**! நான் உங்கள் **SmartSchool AI Copilot**.\n\nமாணவர்கள் வருகை, தேர்வுகள், டிஜிட்டல் வளாகம் மற்றும் கட்டணங்கள் குறித்து நீங்கள் கேட்கலாம்!`;
    }

    return `Hello **${currentUser.name}**! I am your **SmartSchool AI Copilot** (Multi-Language AI Engine Active).\n\nI am securely bound to your credentials (**${currentUser.roleTitle}** on **${effectiveDevice}**). Ask me anything about attendance, campus Digital Twin, student risk, academic performance, or operations.`;
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: getInitialGreeting(),
      timestamp: 'Now',
    },
  ]);

  // Update greeting on language change if only initial message is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init-1') {
        return [
          {
            id: 'init-1',
            sender: 'assistant',
            content: getInitialGreeting(),
            timestamp: 'Now',
          },
        ];
      }
      return prev;
    });
  }, [language, currentUser.name, currentUser.roleTitle, effectiveDevice]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isAiDrawerOpen]);

  // Quick Prompts localized by language
  const getQuickPrompts = (): string[] => {
    if (language === 'hi') {
      return [
        'आज कितने छात्र अनुपस्थित हैं?',
        'डिजिटल ट्विन में रूम की स्थिति दिखाएं।',
        'Class 8A का परीक्षा परिणाम क्या है?',
        'कुल फीस कलेक्शन और बकाया राशि बताएं।',
      ];
    }
    if (language === 'hinglish') {
      return [
        'How many students were absent today?',
        'Show campus telemetry in Digital Twin.',
        'Summarize Class 8A academic performance.',
        'Show fee collections and pending dues.',
      ];
    }
    return [
      'How many students were absent today?',
      'Show campus telemetry in Digital Twin.',
      'Which students are flagged by AI Risk Engine?',
      'Summarize Class 8A academic performance.',
      'What are total fee collections and pending dues?',
      'What is the live status of School Bus Route 4?',
    ];
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAssistant.query(query, currentUser, effectiveDevice, language);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'An unexpected error occurred while processing your request. Please try again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        content: getInitialGreeting(),
        timestamp: 'Now',
      },
    ]);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleActionClick = (moduleName: string) => {
    setActiveModule(moduleName as ModuleName);
    setIsAiDrawerOpen(false);
  };

  // Helper to format markdown text
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bullets
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return (
        <p
          key={idx}
          className={`${isBullet ? 'pl-2 text-slate-700 dark:text-slate-200' : ''} ${
            line.trim() === '' ? 'h-2' : 'my-0.5'
          }`}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      {/* Slide-Over Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  SmartSchool AI Copilot
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scope: {currentUser.roleTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="px-5 py-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Trust Enforcement Active
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">
            {effectiveDevice} Evaluation Mode
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : msg.isPermissionDenied
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                    : 'bg-slate-100/90 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="space-y-1">{renderFormattedContent(msg.content)}</div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400 flex flex-wrap gap-1 items-center">
                    <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400">
                      Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <span
                        key={i}
                        className="font-mono bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Navigation Action */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction!.module)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Timestamp & Copy */}
              <div className="flex items-center gap-2 px-1 mt-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.content)}
                    className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-0.5"
                    title="Copy response"
                  >
                    {copiedMsgId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-[75%] border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>Analyzing authorized institutional records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Recommended Queries
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {getQuickPrompts().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 transition-colors text-left truncate max-w-full font-medium shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI anything about your authorized school data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
