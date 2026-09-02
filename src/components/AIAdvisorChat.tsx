import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Briefcase, 
  FileText, 
  Layers, 
  CheckSquare, 
  Compass, 
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { 
  AdvisorChatMessage, 
  TranslationResult, 
  FullApplicationPackage, 
  TrackerItem, 
  DecisionHistoryEntry 
} from '../types';
import { PromptTextarea } from './common/PromptTextarea';

interface AIAdvisorChatProps {
  currentTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
  onNavigateMode?: (mode: any) => void;
  isOffline?: boolean;
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What does my first resume bullet mean in simple commercial terms?",
  "Why did the engine suggest this specific commercial job title?",
  "How should I explain my institutional duties in an interview without over-sharing?",
  "What questions might Georgia employers like Grady or Local 613 ask me?",
  "How can I use the HOPE Career Grant for free trade certifications in Georgia?",
];

export const AIAdvisorChat: React.FC<AIAdvisorChatProps> = ({
  currentTranslation,
  applicationPackages,
  trackerItems,
  decisionHistory,
  onNavigateMode,
  isOffline = false,
}) => {
  const [messages, setMessages] = useState<AdvisorChatMessage[]>([
    {
      id: 'welcome-advisor',
      sender: 'assistant',
      content: `Hello! I am your **Reentry Career Advisor & Output Explainer**. 

I have full visibility into your current active session assets (your translated commercial title, resume bullets, job application tracker, and decision milestones). 

Ask me any questions about what your generated bullets mean, how to frame your trade skills for hiring managers, or how to navigate Georgia Fair-Chance policies!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: DEFAULT_SUGGESTED_QUESTIONS,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const buildSessionContextSummary = () => {
    let summary = 'CURRENT CANDIDATE SESSION CONTEXT:\n';
    if (currentTranslation) {
      summary += `- Translated Commercial Title: ${currentTranslation.commercialTitle}\n`;
      summary += `- Technical Hard Skills: ${currentTranslation.competencies?.hardSkills?.join(', ') || 'N/A'}\n`;
      summary += `- High-Agency Soft Skills: ${currentTranslation.competencies?.softSkills?.join(', ') || 'N/A'}\n`;
      summary += `- Resume Bullets:\n${currentTranslation.resumeBullets?.map((b) => `  * ${b}`).join('\n') || 'N/A'}\n`;
      summary += `- Georgia Corridor Pathway: ${currentTranslation.gaPathway || 'N/A'}\n`;
    } else {
      summary += '- No capability translation completed yet.\n';
    }

    if (applicationPackages.length > 0) {
      summary += `- Active Application Package Target: ${applicationPackages[0].targetJobTitle} (${applicationPackages[0].industryOrSector})\n`;
    }

    if (trackerItems.length > 0) {
      summary += `- Target Employers in Tracker: ${trackerItems.map((t) => `${t.company} (${t.role} - ${t.stage})`).join('; ')}\n`;
    }

    if (decisionHistory.length > 0) {
      const lastStep = decisionHistory[decisionHistory.length - 1];
      summary += `- Reentry Decision Milestone: ${lastStep.domain} (Phase: ${lastStep.phase}, Choice: ${lastStep.selectedOptionLabel})\n`;
    }

    return summary;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    const userMessage: AdvisorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsLoading(true);

    const sessionContext = buildSessionContextSummary();

    try {
      if (isOffline) {
        throw new Error('Offline mode active');
      }

      const response = await fetch('/api/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          sessionContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Advisor API request failed');
      }

      const data = await response.json();
      const assistantMessage: AdvisorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || data.reply || 'Here is what you need to know...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: data.suggestedFollowups || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Live AI Advisor unreachable, using intelligent offline career guidance:', err);

      // Intelligent Offline Fallback Generator
      let fallbackAnswer = '';
      const lower = query.toLowerCase();

      if (lower.includes('bullet') || lower.includes('mean')) {
        if (currentTranslation?.resumeBullets?.[0]) {
          fallbackAnswer = `**Understanding Your Resume Bullets:**\n\nYour bullets are written using the **Action + Context + Quantified Metric** formula required by corporate Applicant Tracking Systems (ATS).\n\nFor example:\n> "${currentTranslation.resumeBullets[0]}"\n\n* **Action Verb:** Opens with high-agency execution.\n* **Operational Scale:** Highlights volume and precision without institutional stigma.\n* **Bottom-Line Value:** Demonstrates to hiring managers that you operate autonomously with zero supervision required.`;
        } else {
          fallbackAnswer = `Resume bullets in RRR use the **Action Verb + Operational Context + Quantified Metric** framework. Translate an experience in Mode 1 first to view your customized bullets!`;
        }
      } else if (lower.includes('title') || lower.includes('why')) {
        fallbackAnswer = `**Why This Commercial Title was Chosen:**\n\nCorporate recruiters search for standardized titles like "${currentTranslation?.commercialTitle || 'Facilities & Logistics Operations'}" rather than institutional duty labels. This bridges your real hands-on experience directly to Georgia labor market wage standards ($20–$32+/hr).`;
      } else if (lower.includes('interview') || lower.includes('explain') || lower.includes('gap')) {
        fallbackAnswer = `**Interview Advocacy Strategy:**\n\n1. **Lead with Autonomy:** Focus 90% of your answer on the rigorous daily routines, equipment, and zero-defect safety records you maintained.\n2. **The 30-Second Bridge:** If asked about background or gaps, use the high-agency bridge: *"During that time, I maintained full-time commercial responsibilities in high-volume operations, logged over [X] hours in equipment safety, and earned certifications. I'm ready to bring that exact consistency to your team from Day 1."*\n3. **Pivot to Their Bottom Line:** Always finish by asking about their operational bottlenecks and safety standards.`;
      } else if (lower.includes('hope') || lower.includes('grant') || lower.includes('tcsg')) {
        fallbackAnswer = `**Georgia HOPE Career Grant Information:**\n\n* The **HOPE Career Grant** covers 100% of tuition for high-demand certificates at all 22 Technical College System of Georgia (TCSG) campuses (like Atlanta Tech, Chattahoochee Tech, Central Georgia Tech).\n* **Eligible fields include:** CDL Commercial Truck Driving, Industrial Systems Maintenance, Electrical Technology, Welding, Precision Machining, and HVAC.\n* **Eligibility:** Georgia residents enrolled in approved diploma/certificate programs with zero credit checks required.`;
      } else {
        fallbackAnswer = `**Career Advisor Guidance:**\n\nRegarding your question: "${query}"\n\nIn the Georgia corridor (Atlanta Metro, Macon, and Savannah), employers value hands-on operational reliability, equipment logs, and verified safety certifications above all else.\n\nKeep your documentation organized in your **Application Tracker (Mode 3)** and follow up within 48 hours of every application submission.`;
      }

      const assistantMessage: AdvisorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 w-full">
      {/* Header Banner */}
      <div className="bg-[#0B0F0E] border border-sky-800/40 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>STANDALONE ADVISOR</span>
              </span>
              <h2 className="text-lg font-bold text-[#F4EDE1] font-serif tracking-wide">
                Reentry Career Advisor & Output Explainer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#F4EDE1]/70 max-w-3xl leading-relaxed">
              Have questions about your generated resume, job titles, interview strategy, or Georgia Fair-Chance policies? This dedicated advisor has read access to your active session and provides direct, jargon-free explanations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-sky-300 bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">
              Read-Only Context Linked
            </span>
          </div>
        </div>
      </div>

      {/* Active Session Context Pill Bar */}
      <div className="bg-black/60 border border-[#2B2B2B] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#F4EDE1]/70">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C99A44]" />
          <span>Active Context:</span>
          {currentTranslation ? (
            <span className="text-[#C99A44] font-semibold truncate max-w-[200px] sm:max-w-xs">
              {currentTranslation.commercialTitle}
            </span>
          ) : (
            <span className="text-[#F4EDE1]/40">No translation active</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#F4EDE1]/50">
          <span>{trackerItems.length} Apps in Tracker</span>
          <span>•</span>
          <span>{applicationPackages.length} Resumes Built</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#0B0F0E] border border-[#2B2B2B] rounded-xl p-4 sm:p-6 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-1.5`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#F4EDE1]/50 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-sky-400 font-semibold">Career Advisor</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`p-4 rounded-xl text-xs sm:text-sm max-w-3xl leading-relaxed font-sans relative group ${
                msg.sender === 'user'
                  ? 'bg-[#2F4A3E] text-[#F4EDE1] border border-[#C99A44]/30 rounded-tr-none'
                  : 'bg-black/70 text-[#F4EDE1] border border-[#2B2B2B] rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Copy button for assistant responses */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-end pt-1 border-t border-white/5 mt-2">
                  <button
                    onClick={() => handleCopyMessage(msg.content, msg.id)}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#F4EDE1]/40 hover:text-[#F4EDE1] transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Follow-up Questions (if provided) */}
            {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 max-w-2xl">
                {msg.suggestedQuestions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-800/50 transition-colors text-left"
                  >
                    <Lightbulb className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-200 text-xs font-mono animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
            <span>Analyzing session context and preparing advisor response...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Questions Bar (Initial Prompts) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-[#F4EDE1]/50 flex items-center gap-1 px-1">
          <HelpCircle className="w-3 h-3 text-[#C99A44]" />
          <span>Suggested Questions about your output:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DEFAULT_SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-sans bg-black/40 hover:bg-black/70 text-[#F4EDE1]/80 hover:text-[#F4EDE1] border border-[#2B2B2B] hover:border-sky-500/50 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea with Voice Dictation (Change 1 & Change 4) */}
      <PromptTextarea
        id="advisor-chat-input"
        value={inputVal}
        onChange={setInputVal}
        onSubmit={() => handleSendMessage()}
        placeholder="Ask a question about your resume bullets, interview prep, or Fair-Chance policies (Type or click mic to speak)..."
        isLoading={isLoading}
        submitButtonText="Ask Advisor"
      />
    </div>
  );
};
