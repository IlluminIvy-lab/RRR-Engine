import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
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
import ReactMarkdown from 'react-markdown';

// Tailwind styling for markdown rendered inside advisor (assistant) messages,
// so answers show formatted text instead of raw ** / ## markers.
const advisorMarkdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[#C99A44]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-bold text-base mt-2 mb-1">{children}</h3>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-bold text-base mt-2 mb-1">{children}</h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="font-bold mt-2 mb-1">{children}</h4>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="font-mono bg-white/10 px-1 rounded">{children}</code>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline text-sky-300">
      {children}
    </a>
  ),
};

interface AIAdvisorChatProps {
  currentTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
  onNavigateMode?: (mode: any) => void;
  isOffline?: boolean;
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What does my first resume bullet mean in plain words?",
  "Why did you pick this job title for me?",
  "How should I explain the work I did inside during an interview, without saying too much?",
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
      content: `Hello! I'm your **Reentry Career Advisor**. I explain what this tool produces, in plain words.

I can see what you've done in this session so far — the job title the Translator picked for you, your resume bullet points, the jobs in your tracker, and your decision-tree answers.

Ask me what your bullet points mean, how to talk about your skills with a hiring manager, or how Georgia's fair-chance hiring rules work.`,
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
        fallbackAnswer = `**Interview Advocacy Strategy:**\n\n1. **Lead with Autonomy:** Focus 90% of your answer on the rigorous daily routines, equipment, and zero-defect safety records you maintained.\n2. **The 30-Second Bridge:** If asked about background or gaps, use the high-agency bridge: *"During that time, I maintained full-time commercial responsibilities in high-volume operations, with extensive hands-on hours in equipment safety, and earned certifications. I'm ready to bring that exact consistency to your team from Day 1."*\n3. **Pivot to Their Bottom Line:** Always finish by asking about their operational bottlenecks and safety standards.`;
      } else if (lower.includes('hope') || lower.includes('grant') || lower.includes('tcsg')) {
        fallbackAnswer = `**Georgia HOPE Career Grant Information:**\n\n* The **HOPE Career Grant** covers 100% of tuition for high-demand certificates at all 22 Technical College System of Georgia (TCSG) campuses (like Atlanta Tech, Chattahoochee Tech, Central Georgia Tech).\n* **Eligible fields include:** CDL Commercial Truck Driving, Industrial Systems Maintenance, Electrical Technology, Welding, Precision Machining, and HVAC.\n* **Eligibility:** Georgia residents enrolled in approved diploma/certificate programs with zero credit checks required.`;
      } else if (lower.includes('birth') || lower.includes('certificate') || lower.includes('vital records') || lower.includes('documents') || lower.includes('ssn') || lower.includes('social security')) {
        fallbackAnswer = `**Replacing Documents — Georgia:**\n\n* **Birth certificate:** Order through Georgia DPH (online via ROVER/VitalChek), or walk in at a county health department. The issuing office is the **Georgia State Office of Vital Records**, 1680 Phoenix Blvd, Suite 100, Atlanta, GA 30349 — (404) 679-4702.\n* **Starting work without one:** Employers complete Form I-9 for every hire. A Georgia state ID or driver's license (List B) plus a Social Security card (List C) is the standard combination — a missing birth certificate does not block starting work for most people who hold those two.\n* **Social Security card replacement:** Apply at an SSA office or through ssa.gov, using your state ID.\n* Keep a photo or copy of every document with your **Application Tracker (Mode 3)** notes, so one lost wallet doesn't restart the whole process.`;
      } else if (lower.includes('license') || lower.includes('driving') || lower.includes('drive')) {
        fallbackAnswer = `**Job Searching Without a Driver's License:**\n\n* **Target reachable work first:** MARTA-accessible employers, and helper/apprentice roles where you ride with a crew to the job site instead of driving a company vehicle solo.\n* **Ask about the requirement directly:** Many postings carry "valid driver's license" as standard boilerplate. Ask whether the role itself involves driving, or whether the line is a screening default — some employers waive it for non-driving roles.\n* **The path to licensed:** Georgia DDS issues a learner's permit first, then a provisional license, then a full Class C. Your Georgia state ID is the identity document that process builds on — if you already hold one, you are starting from it, not from zero.\n* Use **Mode 4** to sequence the license steps against your first 90 days, so they don't crowd out the job search itself.`;
      } else if (lower.includes('probation') || lower.includes('parole') || lower.includes('supervision') || lower.includes('reporting') || lower.includes('officer')) {
        fallbackAnswer = `**Working Under Supervision (Probation / Parole):**\n\n* In Georgia, both probation and parole are supervised by the **Department of Community Supervision (DCS)**. Keep your residential address current with your supervising officer and keep your reporting schedule — questions about your job search get answered with records, not memory.\n* **Build the record in this app:** Log every application, interview, and shift in the **Application Tracker (Mode 3)**, and keep your **Mode 4** plan current. Bring that documentation to check-ins.\n* If a job's shifts, location, or travel could conflict with your conditions, clear it with your officer *before* accepting the work, not after.\n* This is general information about how the process works — not legal advice about your case or your conditions.`;
      } else {
        fallbackAnswer = `**Career Advisor Guidance:**\n\nI can go deep on three things: explaining your **Mode 1** Translator output (job titles, resume bullets, skills), interview strategy for talking about your experience, and the **HOPE Career Grant** for free Georgia trade certifications.\n\nFor document questions — birth certificates, Social Security cards, state ID — the **Georgia Vault's** Vital Records & DDS listings carry the office, address, and phone. For sequencing your first days and months, **Mode 4** builds the step-by-step plan.\n\nAsk me about one of those directly and I'll give you the full answer.`;
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
                Reentry Career Advisor
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
              {msg.sender === 'assistant' ? (
                <div>
                  <ReactMarkdown components={advisorMarkdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}

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
