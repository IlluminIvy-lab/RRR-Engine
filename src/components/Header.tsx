import React from 'react';
import { ShieldCheck, Compass, FileText, Landmark, Terminal, Zap } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onQuickStartDecisionTree: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onQuickStartDecisionTree
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & System Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                RRR SYSTEM v2.5
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                GA Corridor Engine Active
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-100 font-sans">
              Capability Engine & Reentry Decision System
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            id="nav-unified-console-btn"
            onClick={() => onSelectMode('unified')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'unified'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Terminal</span>
          </button>

          <button
            id="nav-mode-1-translator-btn"
            onClick={() => onSelectMode('translator')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'translator'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mode 1: Capability Translator</span>
          </button>

          <button
            id="nav-mode-2-decision-tree-btn"
            onClick={() => onSelectMode('decision_tree')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'decision_tree'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mode 2: Decision Tree</span>
          </button>

          <button
            id="nav-ga-vault-btn"
            onClick={() => onSelectMode('georgia_vault')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'georgia_vault'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/60'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>GA Resource Vault</span>
          </button>

          <button
            id="quick-start-decision-tree-btn"
            onClick={onQuickStartDecisionTree}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 transition-colors ml-1"
            title="Type or execute 'Start Decision Tree'"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>"Start Decision Tree"</span>
          </button>
        </div>
      </div>
    </header>
  );
};
