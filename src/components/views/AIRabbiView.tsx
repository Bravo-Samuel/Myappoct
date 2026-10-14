import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  Globe,
  BookOpen,
  Copy,
  Share2,
  Trash2,
  Plus,
  MessageSquare,
  Check,
  AlertTriangle,
  Calendar as CalendarIcon,
  MapPin,
  ChevronLeft,
  Menu,
  X,
  Info,
  HelpCircle
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import {
  AIRabbiService,
  ChatSessionState,
  ConversationThread
} from '../../services/airabbi';

interface AIRabbiViewProps {
  language: SupportedLanguage;
  location?: string;
}

export const AIRabbiView: React.FC<AIRabbiViewProps> = ({
  language,
  location = 'Churachandpur, Manipur'
}) => {
  const [sessionState, setSessionState] = useState<ChatSessionState | null>(null);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'qa' | 'translate' | 'parashah' | 'halacha'>('qa');
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionManager = useRef(AIRabbiService.getSessionManager('current-user')).current;

  // Real-time calendar integration context
  const platformContext = AIRabbiService.getLivePlatformContext(location);

  const suggestedQuestions = [
    "What is the weekly Torah reading (Parashat HaShavua) for today?",
    "When is Sabbath candle lighting (Hadlakat Nerot) today?",
    "Explain today's Hebrew date (Luach HaShana) and month.",
    "What is the meaning of the Sabbath day of rest (Shabbat)?",
    "Why do we count the days between Passover and Shavuot (Sefirat HaOmer)?",
    "Explain the fast day mourning the Temple destruction (Tisha B'Av).",
    "How does our household prepare for the New Month (Rosh Chodesh) blessing?"
  ];

  useEffect(() => {
    const unsubscribe = sessionManager.subscribe((state) => {
      setSessionState(state);
    });
    sessionManager.initialize();
    return () => unsubscribe();
  }, [sessionManager]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionState?.threads, sessionState?.streamingText, sessionState?.isTyping]);

  const activeThread: ConversationThread | null = sessionState
    ? sessionState.threads.find(t => t.id === sessionState.activeThreadId) || sessionState.threads[0] || null
    : null;

  const handleSend = async (customText?: string) => {
    const query = customText || prompt;
    if (!query.trim() || sessionState?.isTyping) return;

    if (!customText) setPrompt('');
    await sessionManager.sendMessage(query, {
      language,
      mode,
      location,
      userName: 'Community Member'
    });
  };

  const handleCopy = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(AIRabbiService.formatResponseForCopy(text));
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleShare = async (msgId: string, text: string) => {
    const success = await AIRabbiService.shareResponse('Torah Guidance', text);
    if (success) {
      setShareStatus('Shared!');
    } else {
      await navigator.clipboard.writeText(AIRabbiService.formatResponseForCopy(text));
      setShareStatus('Link copied to clipboard');
    }
    setTimeout(() => setShareStatus(null), 3000);
  };

  const simulateVoiceAudio = (msgId: string) => {
    setActiveVoiceId(msgId);
    setTimeout(() => {
      setActiveVoiceId(null);
    }, 4500);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] max-w-7xl mx-auto rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar: Conversation List */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              sessionManager.createNewThread('New Torah Inquiry', mode, language);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Conversation</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Past Conversations ({sessionState?.threads.length || 0})
          </div>

          {sessionState?.threads.map((thread) => {
            const isSelected = activeThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => {
                  sessionManager.selectThread(thread.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`group flex items-center justify-between gap-2 p-3 rounded-xl text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/40 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                    : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{thread.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(thread.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {thread.messages.length} msgs
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this conversation thread?')) {
                      sessionManager.deleteThread(thread.id);
                    }
                  }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Clear History */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              if (confirm('Clear all conversation history? This cannot be undone.')) {
                sessionManager.clearAllConversations();
              }
            }}
            className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-red-500/10 hover:border-red-500/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF8F5] dark:bg-[#0A0F1D] relative overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden"
              title="Open conversations"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 dark:text-white">
                  AI Rabbi & Torah Advisor
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wide">
                  Phase 1 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>Integrated with Calendar Engine</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{language} Mode</span>
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            {[
              { id: 'qa', label: 'Halacha Q&A', icon: <Bot className="w-3.5 h-3.5" /> },
              { id: 'translate', label: 'Translator', icon: <Globe className="w-3.5 h-3.5" /> },
              { id: 'parashah', label: 'Parashah', icon: <BookOpen className="w-3.5 h-3.5" /> }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mode === m.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Real-time Platform Integration Bar */}
        <div className="px-4 py-2 bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-500/20 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-3 flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span><strong>Hebrew Date (Luach HaShana):</strong> {platformContext.hebrewDateEn} ({platformContext.hebrewDateHe})</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span><strong>Parashat HaShavua (Weekly Torah Reading):</strong> {platformContext.parashahEn}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate max-w-[180px]">{location}</span>
          </div>
        </div>

        {/* Phase 8: Help Everywhere ("What is this?") */}
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-2xl bg-amber-500/10 dark:bg-slate-800/80 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>What is the AI Rabbi &amp; Halachic Assistant?</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            The AI Rabbi is a digital Torah scholar and guide designed specifically for the Bnei Menashe community. It can explain daily Jewish laws (Halacha), Sabbath candle lighting times, weekly Torah readings, and translate Hebrew or Jewish concepts into English, Thadou, Kuki, and Mizo.
          </p>
        </div>

        {/* Messages Stream Container (Apple Comfortable Reading Width max-w-3xl) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Safety & Halachic Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 text-blue-900 dark:text-blue-300 text-xs flex items-start gap-3 shadow-xs">
              <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Halachic Safety Mandate:</strong> AI Rabbi distinguishes clearly between verified <strong>[Calendar Facts]</strong>, structured <strong>[Educational Explanations]</strong>, and general <strong>[Rabbinic Guidance]</strong>. For personal Halachic decisions or complex communal disputes, always consult your local synagogue Rabbi.
              </div>
            </div>

            {/* Conversation Messages */}
            {activeThread && activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-[11px]'
                    : 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-bold'
                }`}>
                  {msg.sender === 'user' ? 'YOU' : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble Content */}
                <div className={`flex-1 max-w-[85%] rounded-3xl p-5 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#0F172A] text-white rounded-tr-none border border-slate-800'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-400 font-medium">
                    <span className="font-semibold text-slate-500 dark:text-slate-300">
                      {msg.sender === 'user' ? 'Community Inquiry' : 'AI Rabbi Responsum'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => simulateVoiceAudio(msg.id)}
                            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                            title="Listen phonetic audio pronunciation"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${activeVoiceId === msg.id ? 'animate-bounce text-emerald-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="p-1 rounded-lg hover:bg-amber-500/20 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleShare(msg.id, msg.text)}
                            className="p-1 rounded-lg hover:bg-amber-500/20 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Share response"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Formatted Text Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-amber-500/30">
                    {msg.text}
                  </div>

                  {activeVoiceId === msg.id && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2 animate-pulse font-medium">
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>Audio Pronunciation active: Chanting Hebrew and {language} translation smoothly...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Streaming Response Bubble */}
            {sessionState?.isTyping && (
              <div className="flex gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-md animate-pulse">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <div className="flex-1 max-w-[85%] rounded-3xl p-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-amber-500/40 shadow-md">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>Consulting Halachic sources & Bnei Menashe customs...</span>
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {sessionState.streamingText || 'Synthesizing responsum from Torah repositories...'}
                    <span className="inline-block w-1.5 h-4 ml-1 bg-amber-500 animate-pulse align-middle" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Questions Grid (Always accessible above composer) */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested Halachic & Calendar Inquiries:</span>
              </span>
              {shareStatus && <span className="text-emerald-600 dark:text-emerald-400">{shareStatus}</span>}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={sessionState?.isTyping}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/15 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 transition-all shadow-2xs hover:shadow-xs disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Composer Footer */}
        <div className="p-4 sm:px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/40 dark:border-amber-500/30 shadow-lg flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask a Halachic question, parashah insight, or translate in ${language}...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={sessionState?.isTyping}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!prompt.trim() || sessionState?.isTyping}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
              <span>Bnei Menashe AI Rabbi • Calibrated for {location}</span>
              <span>Halachic Engine v2.4 • Gemini 3.5 Powered</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
