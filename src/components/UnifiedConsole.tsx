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
  ShieldAlert, 
  HelpCircle,
  Briefcase,
  MapPin,
  FileCheck,
  Award,
  FileDown
} from 'lucide-react';
import { TranslationResult, DecisionNode, DecisionOption, ReentryPhase } from '../types';
import { DECISION_TREE_NODES } from '../data/decisionTreeData';
import { SAMPLE_INSTITUTIONAL_EXPERIENCES } from '../data/georgiaResources';
import { generateResumePdf } from '../utils/generateResumePdf';

interface ConsoleMessage {
  id: string;
  sender: 'system' | 'user';
  type: 'text' | 'translation' | 'decision_prompt' | 'decision_resolution';
  content?: string;
  translationData?: TranslationResult;
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
  isLoading: boolean;
  onNavigateMode: (mode: 'translator' | 'decision_tree' | 'georgia_vault') => void;
}

export const UnifiedConsole: React.FC<UnifiedConsoleProps> = ({
  onTranslate,
  isLoading,
  onNavigateMode
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: 'welcome-1',
      sender: 'system',
      type: 'text',
      content: `RRR Capability Engine & Reentry Decision System Initialized.

I operate across two core operational modes:

• MODE 1: CAPABILITY TRANSLATOR
Share any institutional work experience, facility duties, or trade work to receive:
  1. Commercial Alignment (Industry-standard job title)
  2. Competencies (4 hard & 4 soft skills)
  3. Resume Bullets (3 high-impact quantified outcome bullets)
  4. GA Career Pathway (Fastest-hiring Georgia/Atlanta/Macon trade track)

• MODE 2: INTERACTIVE DECISION TREE
Type "Start Decision Tree" or click the quick action to initiate phased reentry guidance (Day 1-3, Day 3-10, Day 10-30).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    const lower = textToSend.toLowerCase();

    // Check if user is responding to an active decision node with A, B, or C
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

    // Check if user asked to start decision tree
    if (
      lower.includes('start decision tree') || 
      lower.includes('decision tree') || 
      lower.includes('timeline guidance') ||
      lower === 'start'
    ) {
      startDecisionTreeFlow();
      return;
    }

    // Otherwise, treat as Mode 1 Capability Translation
    const result = await onTranslate(textToSend);
    if (result) {
      const translationMsg: ConsoleMessage = {
        id: `sys-trans-${Date.now()}`,
        sender: 'system',
        type: 'translation',
        translationData: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, translationMsg]);
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [
      ...prev,
      {
        id: `sys-tree-init-${Date.now()}`,
        sender: 'system',
        type: 'text',
        content: `Initiating MODE 2: Reentry Decision Tree (Phase: Day 1-3). Please respond with letter A, B, or C.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      promptMsg
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
        nextPhase: option.targetPhase || currentNode.phase
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, resolutionMsg, nextPrompt]);
    } else {
      setActiveDecisionNodeId(null);
      const finishMsg: ConsoleMessage = {
        id: `sys-finish-${Date.now()}`,
        sender: 'system',
        type: 'text',
        content: `Decision Tree Pathway Complete. You can run Mode 1 to translate your past work experience or restart the tree.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        content: `Console cleared. Enter institutional duties for Mode 1 Translation, or type "Start Decision Tree" for Mode 2 guidance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveDecisionNodeId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Console Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-sm font-bold text-stone-100 font-sans">
              Dual-Mode Execution Console
            </div>
            <div className="text-xs text-stone-400 font-mono">
              Auto-routes between Mode 1 (Translation) & Mode 2 (Decision Tree)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSendMessage('Start Decision Tree')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-400 border border-amber-500/30 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>"Start Decision Tree"</span>
          </button>
          <button
            onClick={handleResetConsole}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
            title="Reset Console"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap pl-1">
          Quick Samples:
        </span>
        {SAMPLE_INSTITUTIONAL_EXPERIENCES.slice(0, 4).map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sample.text)}
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-xs whitespace-nowrap transition-colors"
          >
            {sample.title}
          </button>
        ))}
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

            {/* Mode 1 Translation Card */}
            {msg.type === 'translation' && msg.translationData && (
              <div className="w-full max-w-3xl bg-stone-900 border border-amber-500/40 rounded-xl p-5 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-stone-950">
                      MODE 1 RESULT
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-300 uppercase tracking-wider">
                      Commercial Translation Complete
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateResumePdf(msg.translationData!)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-[11px] font-bold text-stone-950 transition-colors shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Resume (PDF)</span>
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
                  </div>
                </div>

                {/* 1. Commercial Alignment */}
                <div className="space-y-1 bg-stone-950/80 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                    1. Commercial Alignment
                  </div>
                  <div className="text-lg font-bold text-stone-100">
                    {msg.translationData.commercialTitle}
                  </div>
                </div>

                {/* 2. Competencies */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                    2. Competencies (4 Hard & 4 Soft Skills)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1.5 p-3 rounded-lg bg-stone-950 border border-stone-800">
                      <span className="text-[10px] font-mono uppercase text-amber-400/80 font-bold">
                        Hard Skills
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
                        Soft Skills
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
                    3. Action-Driven Achievement Bullets (Outcome Focused)
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

                {/* 4. GA Career Pathway */}
                <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 space-y-1 text-xs">
                  <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>4. Fastest-Hiring GA Career Pathway</span>
                  </div>
                  <p className="text-stone-200 font-sans leading-relaxed">
                    {msg.translationData.gaPathway}
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2 Decision Question Prompt */}
            {msg.type === 'decision_prompt' && msg.decisionNode && (
              <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-mono font-bold text-xs">
                      {msg.decisionNode.phase}
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

            {/* Mode 2 Decision Resolution Feedback */}
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
            placeholder="Type institutional experience OR type 'Start Decision Tree' (or letter A/B/C)..."
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
