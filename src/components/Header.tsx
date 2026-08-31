import React, { useState } from 'react';
import { 
  Compass, 
  FileText, 
  Landmark, 
  Terminal, 
  Share2, 
  CheckSquare, 
  Layers,
  ShieldAlert,
  Trash2,
  X
} from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onQuickStartDecisionTree: () => void;
  onOpenShareModal: () => void;
  onWipeSession?: () => void;
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onQuickStartDecisionTree,
  onOpenShareModal,
  onWipeSession,
  isOffline = false,
}) => {
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const handleConfirmWipe = () => {
    if (onWipeSession) {
      onWipeSession();
    }
    setShowWipeConfirm(false);
  };

  return (
    <header className="border-b border-[#F4EDE1]/15 bg-[#0B0F0E]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & System Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#2F4A3E] border border-[#C99A44]/40 flex items-center justify-center shrink-0 shadow-md overflow-hidden p-1.5">
            <img 
              src="/icon.svg" 
              alt="RealReentryRegister Logo" 
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C99A44] font-semibold">
                RealReentryRegister™
              </span>
              {isOffline ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2F4A3E]/80 text-[#C99A44] border border-[#C99A44]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99A44] animate-pulse mr-1"></span>
                  Offline Mode
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2F4A3E]/80 text-[#F4EDE1] border border-[#F4EDE1]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99A44] animate-pulse mr-1"></span>
                  GA Corridor
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F4EDE1] font-serif leading-tight">
              RealReentryRegister (RRR)
            </h1>
            <p className="text-[11px] sm:text-xs text-[#F4EDE1]/70 font-sans tracking-wide italic">
              "Make the system visible. Make the path clearer."
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="nav-unified-console-btn"
            onClick={() => onSelectMode('unified')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'unified'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            id="nav-mode-1-translator-btn"
            onClick={() => onSelectMode('translator')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'translator'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mode 1: Translator</span>
          </button>

          <button
            id="nav-mode-2-resume-builder-btn"
            onClick={() => onSelectMode('resume_builder')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'resume_builder'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mode 2: Resume & Letter</span>
          </button>

          <button
            id="nav-mode-3-tracker-btn"
            onClick={() => onSelectMode('tracker')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'tracker'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mode 3: Tracker</span>
          </button>

          <button
            id="nav-mode-4-decision-tree-btn"
            onClick={() => onSelectMode('decision_tree')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'decision_tree'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mode 4: Decision Tree</span>
          </button>

          <button
            id="nav-ga-vault-btn"
            onClick={() => onSelectMode('georgia_vault')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'georgia_vault'
                ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm'
                : 'text-[#F4EDE1]/80 hover:text-[#F4EDE1] hover:bg-[#2F4A3E]/70 border border-[#F4EDE1]/15 bg-[#2F4A3E]/30'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>GA Vault</span>
          </button>

          {/* Share & Cloud Sync Trigger */}
          <button
            id="open-share-sync-modal-btn"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#C99A44] bg-[#2F4A3E] hover:bg-[#2F4A3E]/90 border border-[#C99A44]/40 transition-colors shadow-sm"
            title="Share assets, export JSON, or sync to cloud"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C99A44]" />
            <span>Share</span>
          </button>

          {/* Privacy Quick-Wipe */}
          {onWipeSession && (
            <button
              id="privacy-quick-wipe-btn"
              onClick={() => setShowWipeConfirm(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 transition-colors shadow-sm"
              title="Privacy Quick-Wipe: Clear all local history, resumes, and cache"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wipe Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Quick-Wipe */}
      {showWipeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F0E]/80 backdrop-blur-sm">
          <div className="bg-[#2F4A3E] border-2 border-rose-500/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>PRIVACY QUICK-WIPE</span>
              </div>
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="text-[#F4EDE1]/60 hover:text-[#F4EDE1] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#F4EDE1] leading-relaxed font-sans">
              This will immediately purge all stored translations, generated resumes, active job applications, and decision histories from your browser's local storage for total privacy.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4EDE1]/15">
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="px-3.5 py-2 rounded-xl text-xs text-[#F4EDE1]/80 hover:bg-[#0B0F0E]/40 border border-[#F4EDE1]/20 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-wipe-session-btn"
                onClick={handleConfirmWipe}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Full Wipe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
