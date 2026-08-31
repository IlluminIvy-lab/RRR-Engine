import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Building2, 
  FileText, 
  Copy, 
  Check, 
  Clock, 
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { DecisionNode, DecisionHistoryEntry, ReentryPhase, DecisionOption } from '../types';
import { DECISION_TREE_NODES } from '../data/decisionTreeData';

interface DecisionTreeEngineProps {
  onSwitchToTranslator?: () => void;
}

export const DecisionTreeEngine: React.FC<DecisionTreeEngineProps> = ({
  onSwitchToTranslator
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('node-1-id');
  const [history, setHistory] = useState<DecisionHistoryEntry[]>([]);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const currentNode: DecisionNode = DECISION_TREE_NODES[currentNodeId] || DECISION_TREE_NODES['node-1-id'];

  // Listen for keyboard input (A, B, C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'B' || key === 'C') {
        const matched = currentNode.options.find(opt => opt.key === key);
        if (matched) {
          handleSelectOption(matched);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNode]);

  const handleSelectOption = (option: DecisionOption) => {
    setSelectedOption(option);
  };

  const handleConfirmAndAdvance = () => {
    if (!selectedOption) return;

    // Record to history
    const entry: DecisionHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stepNumber: history.length + 1,
      nodeId: currentNode.id,
      phase: currentNode.phase,
      domain: currentNode.domain,
      question: currentNode.question,
      selectedKey: selectedOption.key,
      selectedOptionLabel: selectedOption.label,
      actionGuidance: selectedOption.actionGuidance,
      gaSpecificResource: selectedOption.gaSpecificResource,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextNodeId = selectedOption.nextNodeId;
    setHistory([...history, entry]);
    setSelectedOption(null);
    setManualInput('');

    if (nextNodeId && DECISION_TREE_NODES[nextNodeId]) {
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim().toUpperCase();
    if (clean === 'A' || clean === 'B' || clean === 'C') {
      const matched = currentNode.options.find(opt => opt.key === clean);
      if (matched) {
        setSelectedOption(matched);
      }
    }
  };

  const handleReset = () => {
    setCurrentNodeId('node-1-id');
    setHistory([]);
    setSelectedOption(null);
    setManualInput('');
  };

  const phases: { id: ReentryPhase; label: string; desc: string }[] = [
    { id: 'Day 1-3', label: 'Phase 1: Day 1-3', desc: 'Vital Records, IDs & Immediate Shelter' },
    { id: 'Day 3-10', label: 'Phase 2: Day 3-10', desc: 'Banking Setup & Mobile Dispatch' },
    { id: 'Day 10-30', label: 'Phase 3: Day 10-30', desc: 'Trade Apprenticeships & W-2 Hiring' }
  ];

  const exportDossier = () => {
    const text = `# 30-DAY REENTRY ACTION BLUEPRINT & GEORGIA RESOURCE AUDIT
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
System: RRR Capability Engine & Reentry Decision System

${history.map((h) => `
### Step ${h.stepNumber}: [${h.phase}] ${h.domain}
- Question: ${h.question}
- Decision [${h.selectedKey}]: ${h.selectedOptionLabel}
- Action Directive: ${h.actionGuidance}
- Georgia Corridor Resource: ${h.gaSpecificResource}
`).join('\n----------------------------------------\n')}

---
*Maintained under high-agency Georgia Reentry Protocol (Atlanta / Macon Corridor)*`;

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RRR_Reentry_30Day_Plan_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHistory = () => {
    const summary = history.map((h) => `[${h.phase}] ${h.domain}: Option ${h.selectedKey} - ${h.actionGuidance} (${h.gaSpecificResource})`).join('\n\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Mode 2 Header */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                MODE 2
              </span>
              <h2 className="text-lg font-bold text-stone-100">
                Interactive Reentry Decision Tree
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
              Sequential phase guidance spanning Day 1-3, Day 3-10, and Day 10-30. Single-question branching protocol across IDs, transit, housing, and second-chance banking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-mono text-stone-300 border border-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tree</span>
            </button>
          </div>
        </div>

        {/* Phase Progress Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 mt-4 border-t border-stone-800">
          {phases.map((p) => {
            const isCurrent = currentNode.phase === p.id;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-inner'
                    : 'bg-stone-950/40 border-stone-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-amber-400' : 'text-stone-400'}`}>
                    {p.id}
                  </span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                      Active Phase
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-1">
                  {p.label}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 truncate">
                  {p.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Question & Multiple Choice Panel */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md space-y-6 relative overflow-hidden">
        {/* Phase Badge & Category Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-mono font-bold text-xs">
              {currentNode.phase}
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-200 font-mono text-xs border border-stone-700">
              Domain: {currentNode.domain}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span>Step {history.length + 1}</span>
            <span className="text-stone-600">•</span>
            <span className="text-amber-400/90 font-semibold">Press A, B, or C to select</span>
          </div>
        </div>

        {/* The Single Specific Question */}
        <div className="space-y-2">
          {currentNode.contextBanner && (
            <div className="text-xs font-mono text-amber-400/90 uppercase tracking-wider">
              {currentNode.contextBanner}
            </div>
          )}
          <h3 className="text-lg sm:text-xl font-bold text-stone-100 font-sans leading-snug">
            {currentNode.question}
          </h3>
        </div>

        {/* Multiple Choice Options (A, B, C) */}
        <div className="space-y-3">
          {currentNode.options.map((option) => {
            const isSelected = selectedOption?.key === option.key;
            return (
              <button
                key={option.key}
                id={`decision-option-${option.key}`}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Option Key Badge */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-stone-300 group-hover:bg-amber-500/20 group-hover:text-amber-300'
                  }`}
                >
                  {option.key}
                </div>

                <div className="flex-1 space-y-1">
                  <div className={`text-sm font-semibold leading-relaxed ${
                    isSelected ? 'text-amber-200' : 'text-stone-200 group-hover:text-stone-100'
                  }`}>
                    {option.label}
                  </div>
                  
                  {isSelected && (
                    <div className="pt-2 text-xs font-sans space-y-1.5 border-t border-amber-500/20 mt-2">
                      <div className="text-stone-300">
                        <span className="font-semibold text-amber-400">Directive: </span>
                        {option.actionGuidance}
                      </div>
                      <div className="text-stone-400 font-mono text-[11px] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{option.gaSpecificResource}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 pt-1">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-700 group-hover:border-stone-500"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard Input Fallback Form & Advance Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-stone-400">Type Letter:</span>
            <input
              type="text"
              maxLength={1}
              value={manualInput}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setManualInput(val);
                if (val === 'A' || val === 'B' || val === 'C') {
                  const opt = currentNode.options.find(o => o.key === val);
                  if (opt) setSelectedOption(opt);
                }
              }}
              placeholder="A, B, or C"
              className="w-20 bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-center font-mono font-bold text-amber-400 uppercase text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              id="confirm-decision-step-btn"
              disabled={!selectedOption}
              onClick={handleConfirmAndAdvance}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Confirm Selection & Advance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Decision History Log / Blueprint */}
      {history.length > 0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-200">
                Active Decision Blueprint Log ({history.length} Steps Completed)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHistory}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Log'}</span>
              </button>
              <button
                onClick={exportDossier}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 border border-amber-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-stone-950/80 border border-stone-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                      Step {index + 1}
                    </span>
                    <span className="text-stone-300 font-semibold">{item.phase}</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400">{item.domain}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">{item.timestamp}</span>
                </div>

                <div className="text-xs text-stone-300 font-medium">
                  {item.question}
                </div>

                <div className="p-2 rounded bg-stone-900 border border-stone-800 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-amber-500 text-stone-950 font-mono font-bold text-[10px] flex items-center justify-center">
                      {item.selectedKey}
                    </span>
                    <span className="font-semibold text-stone-100">{item.selectedOptionLabel}</span>
                  </div>
                  <div className="text-stone-300 pl-7 text-[11px] leading-relaxed">
                    <strong className="text-amber-400">Action:</strong> {item.actionGuidance}
                  </div>
                  <div className="text-stone-400 pl-7 font-mono text-[10px] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item.gaSpecificResource}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
