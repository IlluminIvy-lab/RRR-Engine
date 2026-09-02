import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  FileText, 
  Layers, 
  CheckSquare, 
  Compass, 
  Bot, 
  Landmark,
  BookmarkCheck,
  FolderOpen
} from 'lucide-react';
import { AppMode, TranslationResult, FullApplicationPackage, TrackerItem, DecisionHistoryEntry } from '../../types';

interface PageNavigationBarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  currentTranslation?: TranslationResult | null;
  applicationPackages?: FullApplicationPackage[];
  trackerItems?: TrackerItem[];
  decisionHistory?: DecisionHistoryEntry[];
  onOpenSavedSessions: () => void;
  isOffline?: boolean;
}

const CORE_PAGE_SEQUENCE: { mode: AppMode; pageNumber: number; label: string; shortTitle: string }[] = [
  { mode: 'translator', pageNumber: 1, label: 'Mode 1: Capability Translator', shortTitle: 'Translator' },
  { mode: 'resume_builder', pageNumber: 2, label: 'Mode 2: Resume & Letter', shortTitle: 'Resume' },
  { mode: 'tracker', pageNumber: 3, label: 'Mode 3: Application Tracker', shortTitle: 'Tracker' },
  { mode: 'decision_tree', pageNumber: 4, label: 'Mode 4: Reentry Decision Tree', shortTitle: 'Decision Tree' },
];

export const PageNavigationBar: React.FC<PageNavigationBarProps> = ({
  currentMode,
  onSelectMode,
  currentTranslation = null,
  applicationPackages = [],
  trackerItems = [],
  decisionHistory = [],
  onOpenSavedSessions,
}) => {
  const currentIndex = CORE_PAGE_SEQUENCE.findIndex((p) => p.mode === currentMode);
  const isCorePage = currentIndex !== -1;
  const currentPageInfo = isCorePage ? CORE_PAGE_SEQUENCE[currentIndex] : null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectMode(CORE_PAGE_SEQUENCE[currentIndex - 1].mode);
    } else if (currentIndex === 0) {
      onSelectMode('unified');
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < CORE_PAGE_SEQUENCE.length - 1) {
      onSelectMode(CORE_PAGE_SEQUENCE[currentIndex + 1].mode);
    } else if (currentIndex === CORE_PAGE_SEQUENCE.length - 1) {
      onSelectMode('advisor');
    }
  };

  return (
    <div className="border-t border-[#2B2B2B] bg-[#0B0F0E]/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl mt-8 space-y-3">
      {/* Top Bar: Progression & Previous/Next Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Progression Status Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C99A44]">
            {isCorePage ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2F4A3E] text-[#F4EDE1] border border-[#C99A44]/40">
                <span>Page {currentPageInfo?.pageNumber} of 4</span>
                <span className="text-[#C99A44]">•</span>
                <span>{currentPageInfo?.shortTitle}</span>
              </span>
            ) : currentMode === 'unified' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-[#F4EDE1] border border-[#2B2B2B]">
                <Terminal className="w-3.5 h-3.5 text-[#C99A44]" />
                <span>Unified Generation Console</span>
              </span>
            ) : currentMode === 'advisor' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-sky-400 border border-sky-800/40">
                <Bot className="w-3.5 h-3.5" />
                <span>Reentry AI Advisor</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-[#F4EDE1] border border-[#2B2B2B]">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Georgia Resource Vault</span>
              </span>
            )}
          </span>

          <span className="text-[11px] text-[#F4EDE1]/50 hidden md:inline">
            Non-gated navigation: jump to any step at any time
          </span>
        </div>

        {/* Action Buttons: Saved Sessions, Prev, Next */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="bottom-saved-sessions-btn"
            type="button"
            onClick={onOpenSavedSessions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#C99A44] bg-black/60 hover:bg-black/90 border border-[#2B2B2B] hover:border-[#C99A44]/50 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#C99A44]" />
            <span>My Saved Sessions</span>
          </button>

          {/* Previous Step */}
          <button
            id="page-nav-prev-btn"
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === -1 && currentMode === 'unified'}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#F4EDE1]/80 hover:text-[#F4EDE1] bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed border border-[#2B2B2B] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Next Step */}
          <button
            id="page-nav-next-btn"
            type="button"
            onClick={handleNext}
            disabled={currentMode === 'advisor'}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B0F0E] bg-[#C99A44] hover:bg-[#b88c3a] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Direct Page Jump Buttons (Non-gated, accessible anytime) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
        {/* Unified Terminal */}
        <button
          type="button"
          onClick={() => onSelectMode('unified')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
            currentMode === 'unified'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Terminal</span>
        </button>

        {/* Page 1: Translator */}
        <button
          type="button"
          onClick={() => onSelectMode('translator')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all relative ${
            currentMode === 'translator'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">1. Translator</span>
          {currentTranslation && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5"></span>
          )}
        </button>

        {/* Page 2: Resume */}
        <button
          type="button"
          onClick={() => onSelectMode('resume_builder')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all relative ${
            currentMode === 'resume_builder'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">2. Resume</span>
          {applicationPackages.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute top-1.5 right-1.5"></span>
          )}
        </button>

        {/* Page 3: Tracker */}
        <button
          type="button"
          onClick={() => onSelectMode('tracker')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all relative ${
            currentMode === 'tracker'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">3. Tracker</span>
          {trackerItems.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 right-1.5"></span>
          )}
        </button>

        {/* Page 4: Decision Tree */}
        <button
          type="button"
          onClick={() => onSelectMode('decision_tree')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all relative ${
            currentMode === 'decision_tree'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">4. Decisions</span>
          {decisionHistory.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 absolute top-1.5 right-1.5"></span>
          )}
        </button>

        {/* Standalone AI Advisor */}
        <button
          type="button"
          onClick={() => onSelectMode('advisor')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
            currentMode === 'advisor'
              ? 'bg-sky-500 text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-sky-400 hover:text-sky-300 border border-[#2B2B2B]'
          }`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">AI Advisor</span>
        </button>

        {/* GA Vault */}
        <button
          type="button"
          onClick={() => onSelectMode('georgia_vault')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
            currentMode === 'georgia_vault'
              ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
              : 'bg-black/40 hover:bg-black/70 text-[#F4EDE1]/70 hover:text-[#F4EDE1] border border-[#2B2B2B]'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">GA Vault</span>
        </button>
      </div>
    </div>
  );
};
