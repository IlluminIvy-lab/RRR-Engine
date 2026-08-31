import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Compass, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  FileCheck, 
  Award, 
  FileDown, 
  FileText,
  ListTodo,
  CheckSquare,
  Building,
  Layers
} from 'lucide-react';
import { 
  TranslationResult, 
  DecisionNode, 
  DecisionOption, 
  ReentryPhase, 
  FullApplicationPackage, 
  TrackerItem, 
  AppMode 
} from '../types';
import { DECISION_TREE_NODES } from '../data/decisionTreeData';
import { SAMPLE_INSTITUTIONAL_EXPERIENCES } from '../data/georgiaResources';
import { generateResumePdf } from '../utils/generateResumePdf';
import { generateResumeDocx } from '../utils/generateResumeDocx';
import { generateFullPackageDocx } from '../utils/generateFullPackageDocx';
import { generateFullPackagePdf } from '../utils/generateFullPackagePdf';

interface ConsoleMessage {
  id: string;
  sender: 'system' | 'user';
  type: 'text' | 'translation' | 'full_package' | 'tracker' | 'decision_prompt' | 'decision_resolution';
  content?: string;
  translationData?: TranslationResult;
  packageData?: FullApplicationPackage;
  trackerData?: {
    items: TrackerItem[];
    nextAction: string;
  };
  decisionNode?: DecisionNode;
  decisionResolution?: {
    choiceKey: 'A' | 'B' | 'C';
    choiceLabel: string;
    actionGuidance: string;
    gaResource: string;
    nextPhase: ReentryPhase;
  };
  timestamp: string;
}

interface UnifiedConsoleProps {
  onTranslate: (text: string) => Promise<TranslationResult | null>;
  onGeneratePackage: (targetTitle: string, candidateName?: string, location?: string, industry?: string) => Promise<FullApplicationPackage | null>;
  onAddItemToTracker: (item: Omit<TrackerItem, 'id' | 'dateAdded' | 'dateUpdated'>) => void;
  isLoading: boolean;
  onNavigateMode: (mode: AppMode) => void;
}

export const UnifiedConsole: React.FC<UnifiedConsoleProps> = ({
  onTranslate,
  onGeneratePackage,
  onAddItemToTracker,
  isLoading,
  onNavigateMode,
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: 'welcome-1',
      sender: 'system',
      type: 'text',
      content: `RRR Capability Engine & Reentry Navigation System Initialized.

You are operating with 4 distinct, fully integrated career modes:

• MODE 1: CAPABILITY TRANSLATOR & BENCHMARKING
  Convert non-traditional duties into commercial titles, 4 hard & soft competencies, 3 achievement bullets, and verified GA Fair-Chance pathways.

• MODE 2: AUTOMATED RESUME & COVER LETTER BUILDER
  Type "Generate Full Package" or enter a target title to architect an ATS-ready resume and 3-paragraph commercial cover letter.

• MODE 3: RESEARCH & APPLICATION PROGRESS TRACKER
  Type "Show Tracker" or share company outreach steps to maintain an active 4-stage lifecycle ledger with next immediate actions.

• MODE 4: INTERACTIVE REENTRY DECISION TREE
  Type "Start Decision Tree" to execute step-by-step navigation across Day 1-3, Day 3-10, and Day 10-30.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeDecisionNodeId, setActiveDecisionNodeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputVal).trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMsg: ConsoleMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    const lower = textToSend.toLowerCase();

    // 1. Check if responding to Decision Tree (A, B, C)
    if (activeDecisionNodeId && (cleanLetter(textToSend) === 'A' || cleanLetter(textToSend) === 'B' || cleanLetter(textToSend) === 'C')) {
      const letter = cleanLetter(textToSend) as 'A' | 'B' | 'C';
      const node = DECISION_TREE_NODES[activeDecisionNodeId];
      if (node) {
        const option = node.options.find((o) => o.key === letter);
        if (option) {
          handleSelectDecisionOption(option, node);
          return;
        }
      }
    }

    // 2. Mode 4: Start Decision Tree
    if (
      lower.includes('start decision tree') || 
      lower.includes('decision tree') || 
      lower.includes('timeline guidance') ||
      lower === 'start tree'
    ) {
      startDecisionTreeFlow();
      return;
    }

    // 3. Mode 2: Generate Full Package / Resume
    if (
      lower.includes('generate full package') ||
      lower.includes('build resume') ||
      lower.includes('create cover letter') ||
      lower.startsWith('resume for')
    ) {
      const roleTarget = textToSend.replace(/(generate full package|build resume|create cover letter|resume for)/gi, '').trim() || 'Commercial Operations Specialist';
      
      const pkg = await onGeneratePackage(roleTarget);
      if (pkg) {
        const pkgMsg: ConsoleMessage = {
          id: `sys-pkg-${Date.now()}`,
          sender: 'system',
          type: 'full_package',
          packageData: pkg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, pkgMsg]);
      }
      return;
    }

    // 4. Mode 3: Show Tracker or Job Outreach
    if (lower.includes('show tracker') || lower.includes('view tracker') || lower.includes('my applications')) {
      onNavigateMode('tracker');
      return;
    }

    // 5. Default: Intelligent API Routing via Unified Endpoint
    try {
      const res = await fetch('/api/unified-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      if (data.mode === 'MODE 1' && data.payload) {
        const trans = data.payload as TranslationResult;
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-trans-${Date.now()}`,
            sender: 'system',
            type: 'translation',
            translationData: trans,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      if (data.mode === 'MODE 2' && data.payload) {
        const pkg = data.payload as FullApplicationPackage;
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-pkg-${Date.now()}`,
            sender: 'system',
            type: 'full_package',
            packageData: pkg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      if (data.mode === 'MODE 4') {
        startDecisionTreeFlow();
        return;
      }

      // Default fallback translation
      const result = await onTranslate(textToSend);
      if (result) {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-trans-${Date.now()}`,
            sender: 'system',
            type: 'translation',
            translationData: result,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      const result = await onTranslate(textToSend);
      if (result) {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-trans-${Date.now()}`,
            sender: 'system',
            type: 'translation',
            translationData: result,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  };

  const cleanLetter = (str: string): string => {
    const s = str.trim().toUpperCase();
    if (s.startsWith('A') && s.length <= 2) return 'A';
    if (s.startsWith('B') && s.length <= 2) return 'B';
    if (s.startsWith('C') && s.length <= 2) return 'C';
    return s;
  };

  const startDecisionTreeFlow = () => {
    const firstNode = DECISION_TREE_NODES['node-1-id'];
    setActiveDecisionNodeId(firstNode.id);

    const promptMsg: ConsoleMessage = {
      id: `sys-dec-${Date.now()}`,
      sender: 'system',
      type: 'decision_prompt',
      decisionNode: firstNode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [
      ...prev,
      {
        id: `sys-tree-init-${Date.now()}`,
        sender: 'system',
        type: 'text',
        content: `Initiating MODE 4: Reentry Decision Tree (Phase: Day 1-3). Select option A, B, or C.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      promptMsg,
    ]);
  };

  const handleSelectDecisionOption = (option: DecisionOption, currentNode: DecisionNode) => {
    const resolutionMsg: ConsoleMessage = {
      id: `sys-res-${Date.now()}`,
      sender: 'system',
      type: 'decision_resolution',
      decisionResolution: {
        choiceKey: option.key,
        choiceLabel: option.label,
        actionGuidance: option.actionGuidance,
        gaResource: option.gaSpecificResource,
        nextPhase: option.targetPhase || currentNode.phase,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextNodeId = option.nextNodeId;
    if (nextNodeId && DECISION_TREE_NODES[nextNodeId]) {
      const nextNode = DECISION_TREE_NODES[nextNodeId];
      setActiveDecisionNodeId(nextNode.id);

      const nextPrompt: ConsoleMessage = {
        id: `sys-dec-${Date.now() + 1}`,
        sender: 'system',
        type: 'decision_prompt',
        decisionNode: nextNode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, resolutionMsg, nextPrompt]);
    } else {
      setActiveDecisionNodeId(null);
      const finishMsg: ConsoleMessage = {
        id: `sys-finish-${Date.now()}`,
        sender: 'system',
        type: 'text',
        content: `Decision Tree Pathway Complete. You can run Mode 1 to translate experience, Mode 2 to build full application packages, or view the Georgia Resource Vault.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, resolutionMsg, finishMsg]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetConsole = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'system',
        type: 'text',
        content: `Console cleared. Enter institutional duties for Mode 1 Translation, type "Generate Full Package" for Mode 2, "Show Tracker" for Mode 3, or "Start Decision Tree" for Mode 4.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveDecisionNodeId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Console Header Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-sm font-bold text-stone-100 font-sans flex items-center gap-2">
              <span>RRR 4-Mode Interactive Terminal</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                v2.5 Full Integration
              </span>
            </div>
            <div className="text-xs text-stone-400 font-mono">
              Mode 1 (Translator) • Mode 2 (Resume & Letter) • Mode 3 (Tracker) • Mode 4 (Decision Tree)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSendMessage('Start Decision Tree')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-400 border border-amber-500/30 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>"Start Decision Tree"</span>
          </button>

          <button
            onClick={() => handleSendMessage('Generate Full Package for Logistics Supervisor')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-xs font-mono text-sky-400 border border-sky-500/30 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>"Generate Full Package"</span>
          </button>

          <button
            onClick={handleResetConsole}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
            title="Reset Terminal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Sample Selector Dropdown (Zero Horizontal Scroll Mandated) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
        <label htmlFor="console-sample-select" className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Sample Profiles:</span>
        </label>
        <select
          id="console-sample-select"
          onChange={(e) => {
            if (e.target.value) {
              handleSendMessage(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          className="flex-1 bg-stone-950 border border-stone-700/80 rounded-md px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans cursor-pointer"
        >
          <option value="" disabled>-- Select an institutional trade profile to auto-translate --</option>
          {SAMPLE_INSTITUTIONAL_EXPERIENCES.map((sample, idx) => (
            <option key={idx} value={sample.text}>
              {sample.title} — [{sample.badge}]
            </option>
          ))}
        </select>
      </div>

      {/* Message Stream */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-xl p-4 sm:p-6 min-h-[480px] max-h-[640px] overflow-y-auto space-y-4 font-sans text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-stone-500">
              <span>{msg.sender === 'user' ? 'OPERATOR' : 'RRR ENGINE'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Plain Text Message */}
            {msg.type === 'text' && (
              <div
                className={`p-3.5 rounded-xl max-w-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium'
                    : 'bg-stone-900 text-stone-200 border border-stone-800 font-mono text-xs'
                }`}
              >
                {msg.content}
              </div>
            )}

            {/* MODE 1: TRANSLATION RESULT CARD */}
            {msg.type === 'translation' && msg.translationData && (
              <div className="w-full max-w-3xl bg-stone-900 border border-amber-500/40 rounded-xl p-5 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-stone-950">
                      MODE 1
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-300 uppercase tracking-wider">
                      Commercial Capability Dossier
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => generateResumePdf(msg.translationData!)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-[11px] font-bold text-stone-950 transition-colors shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => generateResumeDocx(msg.translationData!)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-500 hover:bg-sky-400 text-[11px] font-bold text-stone-950 transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Word</span>
                    </button>

                    <button
                      onClick={() => handleCopy(
                        `${msg.translationData?.commercialTitle}\n\nPathway: ${msg.translationData?.gaPathway}\n\nBullets:\n${msg.translationData?.resumeBullets.map(b => `• ${b}`).join('\n')}`,
                        msg.id
                      )}
                      className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded bg-stone-800 border border-stone-700 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => onNavigateMode('resume_builder')}
                      className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-700/50 transition-colors"
                    >
                      <span>Build Full Package (Mode 2)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 1. Commercial Alignment */}
                <div className="space-y-1 bg-stone-950/80 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                    1. COMMERCIAL TITLE
                  </div>
                  <div className="text-lg font-bold text-stone-100">
                    {msg.translationData.commercialTitle}
                  </div>
                </div>

                {/* 2. Competencies (4 Hard & 4 Soft Skills) */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                    2. COMPETENCIES (4 HARD & 4 SOFT SKILLS)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1.5 p-3 rounded-lg bg-stone-950 border border-stone-800">
                      <span className="text-[10px] font-mono uppercase text-amber-400/80 font-bold">
                        Technical / Hard Skills
                      </span>
                      <ul className="space-y-1 text-stone-300">
                        {msg.translationData.competencies.hardSkills.map((s, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1.5 p-3 rounded-lg bg-stone-950 border border-stone-800">
                      <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">
                        High-Agency Execution Skills
                      </span>
                      <ul className="space-y-1 text-stone-300">
                        {msg.translationData.competencies.softSkills.map((s, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. Resume Bullets */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                    3. RESUME BULLETS (3 ACTION-DRIVEN ACHIEVEMENTS)
                  </div>
                  <div className="space-y-2">
                    {msg.translationData.resumeBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 leading-relaxed"
                      >
                        • {bullet}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. GA Fair-Chance Pathways */}
                <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 space-y-1 text-xs">
                  <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>4. GEORGIA FAIR-CHANCE PATHWAYS</span>
                  </div>
                  <p className="text-stone-200 font-sans leading-relaxed">
                    {msg.translationData.gaPathway}
                  </p>
                </div>
              </div>
            )}

            {/* MODE 2: FULL APPLICATION PACKAGE CARD */}
            {msg.type === 'full_package' && msg.packageData && (
              <div className="w-full max-w-3xl bg-stone-900 border border-sky-500/40 rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500 text-stone-950">
                      MODE 2
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-300 uppercase tracking-wider">
                      Application Package Generated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateFullPackagePdf(msg.packageData!)}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF Package</span>
                    </button>
                    <button
                      onClick={() => generateFullPackageDocx(msg.packageData!)}
                      className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Word (.docx)</span>
                    </button>
                    <button
                      onClick={() => onNavigateMode('resume_builder')}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs flex items-center gap-1 border border-stone-700"
                    >
                      <span>Open Builder</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 bg-stone-950/80 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-[11px] font-mono uppercase text-sky-400 font-bold">
                    Target Commercial Role: {msg.packageData.targetJobTitle}
                  </div>
                  <div className="text-xs text-stone-300 font-sans">
                    Candidate: <strong>{msg.packageData.candidate.fullName}</strong> ({msg.packageData.candidate.cityStateZip})
                  </div>
                  <p className="text-xs text-stone-400 mt-1 italic">
                    "{msg.packageData.resume.summary.slice(0, 140)}..."
                  </p>
                </div>

                {/* Cover letter snippet */}
                <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 text-xs space-y-1.5">
                  <div className="font-bold text-stone-200">
                    Targeted Cover Letter: To {msg.packageData.coverLetter.hiringManagerOrDepartment} ({msg.packageData.coverLetter.targetCompanyOrHospital})
                  </div>
                  <p className="text-stone-400 line-clamp-2">
                    {msg.packageData.coverLetter.openingParagraph}
                  </p>
                </div>
              </div>
            )}

            {/* MODE 4: DECISION TREE QUESTION PROMPT */}
            {msg.type === 'decision_prompt' && msg.decisionNode && (
              <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-mono font-bold text-xs">
                      MODE 4 • {msg.decisionNode.phase}
                    </span>
                    <span className="text-xs font-mono text-stone-300">
                      Domain: {msg.decisionNode.domain}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400">
                    Respond A, B, or C
                  </span>
                </div>

                <div className="text-sm font-bold text-stone-100 font-sans leading-snug">
                  {msg.decisionNode.question}
                </div>

                <div className="space-y-2">
                  {msg.decisionNode.options.map((opt) => (
                    <button
                      key={opt.key}
                      id={`console-opt-${opt.key}`}
                      onClick={() => handleSelectDecisionOption(opt, msg.decisionNode!)}
                      className="w-full text-left p-3 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 transition-all flex items-start gap-3 group"
                    >
                      <span className="w-6 h-6 rounded bg-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {opt.key}
                      </span>
                      <span className="text-xs text-stone-200 group-hover:text-stone-100 leading-relaxed font-sans">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 4: DECISION TREE RESOLUTION */}
            {msg.type === 'decision_resolution' && msg.decisionResolution && (
              <div className="w-full max-w-2xl bg-stone-900/90 border border-emerald-800/60 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selection Logged: Option [{msg.decisionResolution.choiceKey}]</span>
                </div>
                <div className="text-stone-200 font-semibold">
                  {msg.decisionResolution.choiceLabel}
                </div>
                <div className="p-2.5 rounded bg-stone-950 border border-stone-800 space-y-1">
                  <div className="text-stone-300">
                    <strong className="text-amber-400">Action Plan: </strong>
                    {msg.decisionResolution.actionGuidance}
                  </div>
                  <div className="text-stone-400 font-mono text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{msg.decisionResolution.gaResource}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-900 text-stone-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Processing capability alignment and Georgia corridor intelligence...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            id="console-prompt-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type institutional experience, 'Generate Full Package', 'Show Tracker', or 'Start Decision Tree'..."
            className="w-full bg-stone-900 border border-stone-700/80 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-sans"
          />
        </div>
        <button
          id="console-send-btn"
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md"
        >
          <span>Run</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
