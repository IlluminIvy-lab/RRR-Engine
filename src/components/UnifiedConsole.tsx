import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Compass,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  MapPin,
  FileDown,
  FileText,
  ListTodo,
  Layers,
  Landmark,
  Printer
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
import { generateResumePdf } from '../utils/generateResumePdf';
import { generateResumeDocx } from '../utils/generateResumeDocx';
import { generateFullPackageDocx } from '../utils/generateFullPackageDocx';
import { generateFullPackagePdf } from '../utils/generateFullPackagePdf';
import { printCapabilityTranslator } from '../utils/printCapabilityTranslator';
import { PromptTextarea } from './common/PromptTextarea';

interface ConsoleMessage {
  id: string;
  sender: 'system' | 'user';
  type: 'text' | 'initial_modes' | 'translation' | 'full_package' | 'tracker' | 'decision_prompt' | 'decision_resolution';
  content?: string;
  translationData?: TranslationResult;
  packageData?: FullApplicationPackage;
  trackerData?: {
    items: TrackerItem[];
    nextAction: string;
  };
  decisionNode?: DecisionNode;
  decisionResolution?: {
    choiceKey: 'A' | 'B' | 'C' | 'D';
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

const ROLE_PRESETS = [
  {
    label: "Dietary & Food Service Operations",
    prompt: "Managed high-volume kitchen prep, commercial equipment operation, and dietary meal staging for 1,200 individuals daily under strict ServSafe/HACCP sanitation and inventory guidelines."
  },
  {
    label: "Heavy Equipment & Forklift Logistics",
    prompt: "Operated sit-down and reach forklifts in high-capacity warehouse distribution staging, managing palletized manifests, OSHA safety compliance, and zero-defect loading workflows."
  },
  {
    label: "Facilities, Electrical & HVAC Maintenance",
    prompt: "Performed preventative maintenance, electrical circuit diagnostics, commercial boiler checks, and HVAC filter replacements across a 250,000 sq. ft. multi-building facility."
  },
  {
    label: "Administrative Roster & Compliance Clerk",
    prompt: "Audited daily departmental rosters, tracked logistical intake manifests, maintained strict confidential records, and authored operational variance reports for facility leadership."
  },
  {
    label: "Industrial Laundry & Sanitation Logistics",
    prompt: "Supervised high-capacity commercial laundering machinery, chemical sanitation dilution ratios, linen inventory staging, and strict biohazard pathogen prevention protocols."
  }
];

export const UnifiedConsole: React.FC<UnifiedConsoleProps> = ({
  onTranslate,
  onGeneratePackage,
  isLoading,
  onNavigateMode,
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: 'welcome-1',
      sender: 'system',
      type: 'initial_modes',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [activeDecisionNodeId, setActiveDecisionNodeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip the auto-scroll while only the initial welcome message exists
    // (2026-11-12): on first load it scrolled the message box to the bottom,
    // hiding the first task cards — the opposite of what a first screen is for.
    // Once a conversation starts (2+ messages), scrolling works as before.
    if (messages.length <= 1) return;
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
    setActiveChip(null);

    const lower = textToSend.toLowerCase();

    // 1. Check if responding to Decision Tree (A, B, C, or D on Step 1)
    if (activeDecisionNodeId && (cleanLetter(textToSend) === 'A' || cleanLetter(textToSend) === 'B' || cleanLetter(textToSend) === 'C' || cleanLetter(textToSend) === 'D')) {
      const letter = cleanLetter(textToSend) as 'A' | 'B' | 'C' | 'D';
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

  const handleChipClick = (preset: { label: string; prompt: string }) => {
    setInputVal(preset.prompt);
    setActiveChip(preset.label);
    const inputEl = document.getElementById('console-prompt-input');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const cleanLetter = (str: string): string => {
    const s = str.trim().toUpperCase();
    if (s.startsWith('A') && s.length <= 2) return 'A';
    if (s.startsWith('B') && s.length <= 2) return 'B';
    if (s.startsWith('C') && s.length <= 2) return 'C';
    if (s.startsWith('D') && s.length <= 2) return 'D';
    return s;
  };

  const startDecisionTreeFlow = () => {
    const firstNode = DECISION_TREE_NODES['node-1-id'];
    setActiveDecisionNodeId(firstNode.id);

    const questionMsg: ConsoleMessage = {
      id: `sys-dec-${Date.now()}`,
      sender: 'system',
      type: 'decision_prompt',
      decisionNode: firstNode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, questionMsg]);
  };

  const handleSelectDecisionOption = (option: DecisionOption, currentNode: DecisionNode) => {
    const resMsg: ConsoleMessage = {
      id: `res-${Date.now()}`,
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

    setMessages((prev) => [...prev, resMsg]);

    if (option.nextNodeId && DECISION_TREE_NODES[option.nextNodeId]) {
      const nextNode = DECISION_TREE_NODES[option.nextNodeId];
      setActiveDecisionNodeId(nextNode.id);

      setTimeout(() => {
        const nextQMsg: ConsoleMessage = {
          id: `dec-${Date.now()}`,
          sender: 'system',
          type: 'decision_prompt',
          decisionNode: nextNode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, nextQMsg]);
      }, 500);
    } else {
      setActiveDecisionNodeId(null);
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
        id: `welcome-${Date.now()}`,
        sender: 'system',
        type: 'initial_modes',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputVal('');
    setActiveChip(null);
    setActiveDecisionNodeId(null);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* First-screen start block (2026-11-12 spec): one plain prompt, with the
          console's existing free-text routing box and role presets moved to the TOP
          of the first screen instead of sitting under the message list. Same
          PromptTextarea, same handleSendMessage routing — presentation only. */}
      <div className="space-y-3">
        <div className="px-1 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#F4EDE1] tracking-tight">
            What do you need help with?
          </h2>
          <p className="text-xs sm:text-sm text-[#F4EDE1]/75 font-sans leading-relaxed">
            Type the work you did — kitchen, maintenance, warehouse, any job — plus the kind of work you want next, and the console will take you to the right tool. Or pick a tool below.
          </p>
        </div>

      {/* ONE-TAP CAPABILITY & ROLE PRESETS (Quick-Fill Chips) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C99A44] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C99A44]" />
            <span>Quick-Fill Role Presets</span>
          </span>
          <span className="text-[10px] font-mono text-[#F4EDE1]/50">
            Tap to load verified operational duties
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {ROLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-chip-${idx}`}
              type="button"
              onClick={() => handleChipClick(preset)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer whitespace-nowrap ${
                activeChip === preset.label
                  ? 'bg-[#2F4A3E] text-[#C99A44] border-2 border-[#C99A44] shadow-md font-semibold'
                  : 'bg-[#2F4A3E]/60 hover:bg-[#2F4A3E] text-[#F4EDE1]/90 hover:text-[#F4EDE1] border border-[#F4EDE1]/15 hover:border-[#C99A44]/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field with 2-4 lines auto-expand & Voice Dictation (Change 1 & Change 4) */}
      <div className="w-full">
        <PromptTextarea
          id="console-prompt-input"
          value={inputVal}
          onChange={setInputVal}
          onSubmit={handleSendMessage}
          placeholder="Type the work you did — or say 'build resume', 'show tracker', or 'start decision tree'. Tap the mic to speak instead..."
          isLoading={isLoading}
          submitButtonText="Run"
        />
      </div>
      </div>
      {/* Console Subheader Bar — the visitor-facing "Terminal" label was removed
          in the 2026-11-12 first-screen simplification (the console is the terminal;
          the word was system jargon for a new user). */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-[#F4EDE1]/70">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F4EDE1]">RealReentryRegister — Reentry Tools, All in One Place</span>
        </div>

        <button
          onClick={handleResetConsole}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2F4A3E] hover:bg-[#2F4A3E]/80 text-[#F4EDE1] text-xs transition-colors border border-[#F4EDE1]/15"
          title="Start over"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Message Output Container */}
      <div className="min-h-[440px] max-h-[600px] overflow-y-auto bg-[#0B0F0E] border border-[#F4EDE1]/15 rounded-2xl p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="text-[10px] text-[#F4EDE1]/50 px-1 font-mono">
              {msg.sender === 'user' ? 'Candidate Query' : 'RRR System Engine'} • {msg.timestamp}
            </div>

            {/* INITIAL 4 MODES CARDS GRID */}
            {msg.type === 'initial_modes' && (
              <div className="w-full space-y-4 pt-1 pb-2">
                <p className="text-xs text-[#F4EDE1]/70 font-sans px-1">
                  Or pick a tool below:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CARD 1 — Mode 1 Translator */}
                  <div
                    id="tool-card-translator"
                    onClick={() => onNavigateMode('translator')}
                    className="group relative rounded-2xl bg-[#2F4A3E] hover:bg-[#2F4A3E]/95 border border-[#F4EDE1]/15 hover:border-[#C99A44]/80 p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B0F0E]/40 border border-[#C99A44]/30 flex items-center justify-center text-[#C99A44] group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F4EDE1] font-serif tracking-tight group-hover:text-[#C99A44] transition-colors">
                          Turn my work into words employers use
                        </h3>
                        <p className="text-xs text-[#F4EDE1]/80 mt-1.5 leading-relaxed font-sans">
                          Jobs you did inside, translated for a job application.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4EDE1]/15 flex items-center justify-between text-[11px] font-mono text-[#C99A44] group-hover:underline">
                      <span>Tap to open the Translator</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* CARD 2 — Mode 2 Resume & Letter */}
                  <div
                    id="tool-card-resume"
                    onClick={() => onNavigateMode('resume_builder')}
                    className="group relative rounded-2xl bg-[#2F4A3E] hover:bg-[#2F4A3E]/95 border border-[#F4EDE1]/15 hover:border-[#C99A44]/80 p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B0F0E]/40 border border-[#C99A44]/30 flex items-center justify-center text-[#C99A44] group-hover:scale-110 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F4EDE1] font-serif tracking-tight group-hover:text-[#C99A44] transition-colors">
                          Build a resume or cover letter
                        </h3>
                        <p className="text-xs text-[#F4EDE1]/80 mt-1.5 leading-relaxed font-sans">
                          Start from your experience, step by step.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4EDE1]/15 flex items-center justify-between text-[11px] font-mono text-[#C99A44] group-hover:underline">
                      <span>Tap to open the Resume Builder</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* CARD 3 — GA Vault */}
                  <div
                    id="tool-card-vault"
                    onClick={() => onNavigateMode('georgia_vault')}
                    className="group relative rounded-2xl bg-[#2F4A3E] hover:bg-[#2F4A3E]/95 border border-[#F4EDE1]/15 hover:border-[#C99A44]/80 p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B0F0E]/40 border border-[#C99A44]/30 flex items-center justify-center text-[#C99A44] group-hover:scale-110 transition-transform">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F4EDE1] font-serif tracking-tight group-hover:text-[#C99A44] transition-colors">
                          Find Georgia help
                        </h3>
                        <p className="text-xs text-[#F4EDE1]/80 mt-1.5 leading-relaxed font-sans">
                          Housing, ID, transportation, and more, with phone numbers.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4EDE1]/15 flex items-center justify-between text-[11px] font-mono text-[#C99A44] group-hover:underline">
                      <span>Tap to browse Georgia resources</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* CARD 4 — Mode 3 Tracker */}
                  <div
                    id="tool-card-tracker"
                    onClick={() => onNavigateMode('tracker')}
                    className="group relative rounded-2xl bg-[#2F4A3E] hover:bg-[#2F4A3E]/95 border border-[#F4EDE1]/15 hover:border-[#C99A44]/80 p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B0F0E]/40 border border-[#C99A44]/30 flex items-center justify-center text-[#C99A44] group-hover:scale-110 transition-transform">
                        <ListTodo className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F4EDE1] font-serif tracking-tight group-hover:text-[#C99A44] transition-colors">
                          Track what I still need
                        </h3>
                        <p className="text-xs text-[#F4EDE1]/80 mt-1.5 leading-relaxed font-sans">
                          Employment, housing, ID, support — in one list.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4EDE1]/15 flex items-center justify-between text-[11px] font-mono text-[#C99A44] group-hover:underline">
                      <span>Tap to open the Tracker</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* CARD 5 — Mode 4 Decision Tree */}
                  <div
                    id="tool-card-decision-tree"
                    onClick={() => onNavigateMode('decision_tree')}
                    className="group relative rounded-2xl bg-[#2F4A3E] hover:bg-[#2F4A3E]/95 border border-[#F4EDE1]/15 hover:border-[#C99A44]/80 p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B0F0E]/40 border border-[#C99A44]/30 flex items-center justify-center text-[#C99A44] group-hover:scale-110 transition-transform">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F4EDE1] font-serif tracking-tight group-hover:text-[#C99A44] transition-colors">
                          Figure out my next step
                        </h3>
                        <p className="text-xs text-[#F4EDE1]/80 mt-1.5 leading-relaxed font-sans">
                          Not sure where to start? Answer a few questions.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4EDE1]/15 flex items-center justify-between text-[11px] font-mono text-[#C99A44] group-hover:underline">
                      <span>Tap to start the Decision Tree</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plain Text Message */}
            {msg.type === 'text' && (
              <div
                className={`p-3.5 rounded-xl max-w-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#C99A44] text-[#0B0F0E] font-semibold'
                    : 'bg-[#2F4A3E] text-[#F4EDE1] border border-[#F4EDE1]/15 font-mono text-xs'
                }`}
              >
                {msg.content}
              </div>
            )}

            {/* MODE 1: TRANSLATION RESULT CARD (Parchment Document Output Card) */}
            {msg.type === 'translation' && msg.translationData && (
              <div className="w-full max-w-3xl bg-[#F4EDE1] text-[#2B2B2B] border-2 border-[#C99A44] rounded-2xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#2B2B2B]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2F4A3E] text-[#F4EDE1]">
                      MODE 1
                    </span>
                    <span className="text-xs font-serif font-bold text-[#2B2B2B] uppercase tracking-wider">
                      Commercial Capability Dossier
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => printCapabilityTranslator(msg.translationData!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B0F0E] hover:bg-[#2B2B2B] text-[11px] font-bold text-[#F4EDE1] transition-colors shadow-sm"
                      title="Print or Save as PDF via native dialog"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>

                    <button
                      onClick={() => generateResumePdf(msg.translationData!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2F4A3E] hover:bg-[#2F4A3E]/90 text-[11px] font-bold text-[#F4EDE1] transition-colors shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF File</span>
                    </button>

                    <button
                      onClick={() => generateResumeDocx(msg.translationData!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#C99A44] hover:bg-[#C99A44]/90 text-[11px] font-bold text-[#0B0F0E] transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Word (.docx)</span>
                    </button>

                    <button
                      onClick={() => handleCopy(
                        `${msg.translationData?.commercialTitle}\n\nPathway: ${msg.translationData?.gaPathway}\n\nBullets:\n${msg.translationData?.resumeBullets.map(b => `• ${b}`).join('\n')}`,
                        msg.id
                      )}
                      className="inline-flex items-center gap-1 text-xs text-[#2B2B2B] hover:text-[#0B0F0E] px-2 py-1 rounded bg-[#F4EDE1] border border-[#2B2B2B]/30 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => onNavigateMode('resume_builder')}
                      className="inline-flex items-center gap-1 text-xs text-[#0B0F0E] font-bold px-2.5 py-1 rounded bg-[#C99A44]/30 border border-[#C99A44] transition-colors"
                    >
                      <span>Build Full Package (Mode 2)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 1. Commercial Alignment */}
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-[#2F4A3E] uppercase tracking-wider">
                    1. Commercial Alignment
                  </div>
                  <div className="text-xl font-bold font-serif text-[#0B0F0E]">
                    {msg.translationData.commercialTitle}
                  </div>
                </div>

                {/* 2. Core Competencies Grid */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-[#2F4A3E] uppercase tracking-wider">
                    2. Core Competencies (4 Hard & 4 Soft Skills)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/80 border border-[#2B2B2B]/10">
                      <span className="font-bold text-[#2F4A3E] text-[10px] uppercase font-mono block">Technical Hard Skills</span>
                      {msg.translationData.competencies.hardSkills.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[#2B2B2B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C99A44]"></span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/80 border border-[#2B2B2B]/10">
                      <span className="font-bold text-[#2F4A3E] text-[10px] uppercase font-mono block">Execution & Soft Skills</span>
                      {msg.translationData.competencies.softSkills.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[#2B2B2B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F4A3E]"></span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Resume Bullets */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-[#2F4A3E] uppercase tracking-wider">
                    3. High-Impact Quantified Resume Bullets
                  </div>
                  <div className="space-y-2 bg-white/90 p-4 rounded-xl border border-[#2B2B2B]/15">
                    {msg.translationData.resumeBullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#2B2B2B] leading-relaxed">
                        <span className="font-mono text-[#C99A44] font-bold shrink-0">{i + 1}.</span>
                        <span className="font-sans">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. GA Fair-Chance Pathways */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#2F4A3E]/10 border border-[#2F4A3E]/30 text-xs">
                  <div className="text-[11px] font-mono font-bold text-[#2F4A3E] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C99A44]" />
                    <span>4. GA Fair-Chance Corridor Pathways</span>
                  </div>
                  <p className="text-[#2B2B2B] font-sans font-medium leading-relaxed">
                    {msg.translationData.gaPathway}
                  </p>
                </div>
              </div>
            )}

            {/* MODE 2: FULL PACKAGE RESULT CARD (Parchment Document Output Card) */}
            {msg.type === 'full_package' && msg.packageData && (
              <div className="w-full max-w-3xl bg-[#F4EDE1] text-[#2B2B2B] border-2 border-[#C99A44] rounded-2xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#2B2B2B]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C99A44] text-[#0B0F0E]">
                      MODE 2
                    </span>
                    <span className="text-xs font-serif font-bold text-[#2B2B2B] uppercase tracking-wider">
                      Complete Career Package Generated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B0F0E] hover:bg-[#2B2B2B] text-[11px] font-bold text-[#F4EDE1] transition-colors shadow-sm"
                      title="Print or Save as PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={() => generateFullPackagePdf(msg.packageData!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2F4A3E] hover:bg-[#2F4A3E]/90 text-[11px] font-bold text-[#F4EDE1] transition-colors shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => generateFullPackageDocx(msg.packageData!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#C99A44] hover:bg-[#C99A44]/90 text-[11px] font-bold text-[#0B0F0E] transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Word</span>
                    </button>
                    <button
                      onClick={() => onNavigateMode('resume_builder')}
                      className="inline-flex items-center gap-1 text-xs text-[#0B0F0E] font-bold px-2.5 py-1 rounded bg-[#C99A44]/40 border border-[#C99A44] transition-colors"
                    >
                      <span>Open Builder</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 bg-white/70 p-4 rounded-xl border border-[#2B2B2B]/10">
                  <div className="text-[11px] font-mono uppercase text-[#2F4A3E] font-bold">
                    Target Commercial Role: {msg.packageData.targetJobTitle}
                  </div>
                  <div className="text-xs text-[#2B2B2B] font-sans">
                    Candidate: <strong>{msg.packageData.candidate.fullName}</strong> ({msg.packageData.candidate.cityStateZip})
                  </div>
                  <p className="text-xs text-[#2B2B2B]/80 mt-1 italic">
                    "{msg.packageData.resume.summary.slice(0, 140)}..."
                  </p>
                </div>

                {/* Cover letter snippet */}
                <div className="p-4 rounded-xl bg-white/80 border border-[#2B2B2B]/15 text-xs space-y-1.5">
                  <div className="font-bold text-[#0B0F0E] font-serif">
                    Targeted Cover Letter: To {msg.packageData.coverLetter.hiringManagerOrDepartment} ({msg.packageData.coverLetter.targetCompanyOrHospital})
                  </div>
                  <p className="text-[#2B2B2B] line-clamp-2">
                    {msg.packageData.coverLetter.openingParagraph}
                  </p>
                </div>
              </div>
            )}

            {/* MODE 4: DECISION TREE QUESTION PROMPT */}
            {msg.type === 'decision_prompt' && msg.decisionNode && (
              <div className="w-full max-w-2xl bg-[#2F4A3E] border border-[#C99A44]/60 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#F4EDE1]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C99A44] text-[#0B0F0E] font-mono font-bold text-xs">
                      MODE 4 • {msg.decisionNode.phase}
                    </span>
                    <span className="text-xs font-mono text-[#F4EDE1]">
                      Domain: {msg.decisionNode.domain}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#C99A44]">
                    Respond A, B, or C
                  </span>
                </div>

                <div className="text-base font-bold text-[#F4EDE1] font-serif leading-snug">
                  {msg.decisionNode.question}
                </div>

                <div className="space-y-2.5">
                  {msg.decisionNode.options.map((opt) => (
                    <button
                      key={opt.key}
                      id={`console-opt-${opt.key}`}
                      onClick={() => handleSelectDecisionOption(opt, msg.decisionNode!)}
                      className="w-full text-left p-3.5 rounded-xl bg-[#0B0F0E]/70 hover:bg-[#0B0F0E] border border-[#F4EDE1]/15 hover:border-[#C99A44] transition-all flex items-start gap-3.5 group"
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#2B2B2B] group-hover:bg-[#C99A44] group-hover:text-[#0B0F0E] text-[#C99A44] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {opt.key}
                      </span>
                      <span className="text-xs text-[#F4EDE1] group-hover:text-white leading-relaxed font-sans">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 4: DECISION TREE RESOLUTION */}
            {msg.type === 'decision_resolution' && msg.decisionResolution && (
              <div className="w-full max-w-2xl bg-[#2F4A3E]/90 border border-[#C99A44]/40 rounded-2xl p-4 sm:p-5 space-y-2 text-xs shadow-lg">
                <div className="flex items-center gap-2 text-[#C99A44] font-mono font-bold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selection Logged: Option [{msg.decisionResolution.choiceKey}]</span>
                </div>
                <div className="text-[#F4EDE1] font-semibold font-serif text-sm">
                  {msg.decisionResolution.choiceLabel}
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F0E]/60 border border-[#F4EDE1]/15 space-y-1.5">
                  <div className="text-[#F4EDE1]">
                    <strong className="text-[#C99A44]">Action Plan: </strong>
                    {msg.decisionResolution.actionGuidance}
                  </div>
                  <div className="text-[#F4EDE1]/80 font-mono text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C99A44] shrink-0" />
                    <span>{msg.decisionResolution.gaResource}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2F4A3E] text-[#F4EDE1] text-xs font-mono border border-[#C99A44]/40 animate-pulse shadow-md">
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#C99A44] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#C99A44] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#C99A44] animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>Translating capabilities via Georgia Corridor Intelligence Engine...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>
    </div>
  );
};
