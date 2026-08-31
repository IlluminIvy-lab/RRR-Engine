import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  FileText, 
  Landmark, 
  Terminal, 
  Zap, 
  Share2, 
  CheckSquare, 
  Layers 
} from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onQuickStartDecisionTree: () => void;
  onOpenShareModal: () => void;
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onQuickStartDecisionTree,
  onOpenShareModal,
  isOffline = false,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & System Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                RRR SYSTEM v2.5
              </span>
              {isOffline ? (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1"></span>
                  Offline Mode Active
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                  GA Corridor Engine
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-stone-100 font-sans leading-tight">
              Capability Engine & Career Architect
            </h1>
          </div>
        </div>

        {/* Navigation Tabs (Zero Horizontal Scrolling) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="nav-unified-console-btn"
            onClick={() => onSelectMode('unified')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'unified'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            id="nav-mode-1-translator-btn"
            onClick={() => onSelectMode('translator')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'translator'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mode 1: Translator</span>
          </button>

          <button
            id="nav-mode-2-resume-builder-btn"
            onClick={() => onSelectMode('resume_builder')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'resume_builder'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mode 2: Resume & Letter</span>
          </button>

          <button
            id="nav-mode-3-tracker-btn"
            onClick={() => onSelectMode('tracker')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'tracker'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mode 3: Tracker</span>
          </button>

          <button
            id="nav-mode-4-decision-tree-btn"
            onClick={() => onSelectMode('decision_tree')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'decision_tree'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mode 4: Decision Tree</span>
          </button>

          <button
            id="nav-ga-vault-btn"
            onClick={() => onSelectMode('georgia_vault')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentMode === 'georgia_vault'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800/80'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>GA Vault</span>
          </button>

          {/* Share & Cloud Sync Trigger */}
          <button
            id="open-share-sync-modal-btn"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 transition-colors"
            title="Share assets, export JSON, or sync to cloud"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share & Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
