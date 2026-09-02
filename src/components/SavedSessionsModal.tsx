import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  FolderOpen, 
  Trash2, 
  Copy, 
  Edit2, 
  Check, 
  Download, 
  Clock, 
  FileText, 
  Layers, 
  CheckSquare, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  SavedSession, 
  TranslationResult, 
  FullApplicationPackage, 
  TrackerItem, 
  DecisionHistoryEntry 
} from '../types';

interface SavedSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSessions: SavedSession[];
  activeSessionId: string | null;
  onSaveCurrentSession: (sessionName: string) => void;
  onLoadSession: (session: SavedSession) => void;
  onNewBlankSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDuplicateSession: (session: SavedSession) => void;
  currentTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
}

export const SavedSessionsModal: React.FC<SavedSessionsModalProps> = ({
  isOpen,
  onClose,
  savedSessions,
  activeSessionId,
  onSaveCurrentSession,
  onLoadSession,
  onNewBlankSession,
  onDeleteSession,
  onRenameSession,
  onDuplicateSession,
  currentTranslation,
  applicationPackages,
  trackerItems,
  decisionHistory,
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultSuggestedName = currentTranslation?.commercialTitle
    ? `${currentTranslation.commercialTitle} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
    : `Career Session ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSessionName.trim() || defaultSuggestedName;
    onSaveCurrentSession(name);
    setNewSessionName('');
    setIsCreatingNew(false);
  };

  const handleRenameSubmit = (sessionId: string) => {
    if (editingName.trim()) {
      onRenameSession(sessionId, editingName.trim());
    }
    setEditingSessionId(null);
  };

  const handleExportAllSessions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedSessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RRR_Sessions_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0F0E] border border-[#2B2B2B] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#2B2B2B]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C99A44]/15 text-[#C99A44] border border-[#C99A44]/30">
                LOCAL SESSION VAULT
              </span>
              <h3 className="text-lg font-bold text-[#F4EDE1] font-serif">
                My Saved Career Sessions
              </h3>
            </div>
            <p className="text-xs text-[#F4EDE1]/70 leading-relaxed font-sans">
              Maintain separate working drafts (e.g., Logistics application vs. Healthcare application) with complete auto-save and instant switching. Stored locally on your device.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F4EDE1]/60 hover:text-[#F4EDE1] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Save Current Session / Start New */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-black/50 p-3 rounded-xl border border-[#2B2B2B]">
          <div className="flex items-center gap-2">
            <button
              id="save-current-session-as-btn"
              type="button"
              onClick={() => {
                setNewSessionName(defaultSuggestedName);
                setIsCreatingNew(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Current Session As...</span>
            </button>

            <button
              id="start-new-blank-session-btn"
              type="button"
              onClick={() => {
                onNewBlankSession();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#F4EDE1] text-xs font-medium border border-[#2B2B2B] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C99A44]" />
              <span>New Blank Session</span>
            </button>
          </div>

          {savedSessions.length > 0 && (
            <button
              type="button"
              onClick={handleExportAllSessions}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-[#F4EDE1]/60 hover:text-[#F4EDE1] hover:bg-stone-800 transition-colors"
              title="Download backup of all saved sessions as JSON"
            >
              <Download className="w-3 h-3 text-[#C99A44]" />
              <span>Backup All (JSON)</span>
            </button>
          )}
        </div>

        {/* In-Line Save Form */}
        {isCreatingNew && (
          <form onSubmit={handleSaveSubmit} className="p-3.5 rounded-xl bg-[#2F4A3E]/30 border border-[#2F4A3E] space-y-2 animate-in fade-in duration-150">
            <div className="text-xs font-mono font-bold text-[#C99A44] uppercase tracking-wider">
              Name this Session:
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder={defaultSuggestedName}
                autoFocus
                className="flex-1 bg-black/80 border border-[#2B2B2B] rounded-lg px-3 py-1.5 text-xs text-[#F4EDE1] focus:outline-none focus:ring-1 focus:ring-[#C99A44]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 text-[#F4EDE1]/80 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[350px]">
          {savedSessions.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-[#2B2B2B] space-y-2 text-[#F4EDE1]/50 text-xs">
              <FolderOpen className="w-8 h-8 text-[#C99A44]/50 mx-auto" />
              <p className="font-semibold text-[#F4EDE1]/80">No saved sessions yet</p>
              <p>Click "Save Current Session As..." above to bookmark your current resume drafts, translations, and application logs.</p>
            </div>
          ) : (
            savedSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#2F4A3E]/40 border-[#C99A44] shadow-md ring-1 ring-[#C99A44]/40'
                      : 'bg-black/60 border-[#2B2B2B] hover:border-[#F4EDE1]/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Title & Metadata */}
                    <div className="space-y-1 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                            className="bg-black/90 border border-[#C99A44] rounded px-2 py-1 text-xs text-[#F4EDE1] focus:outline-none flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameSubmit(session.id)}
                            className="p-1 rounded bg-[#C99A44] text-[#0B0F0E]"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#F4EDE1] font-sans">
                            {session.name}
                          </h4>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#C99A44] text-[#0B0F0E]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#F4EDE1]/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C99A44]" />
                          <span>{new Date(session.updatedAt || session.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </span>
                        <span>•</span>
                        {/* Asset Badges */}
                        <span className="flex items-center gap-1 text-[#F4EDE1]/80">
                          <FileText className="w-3 h-3 text-[#C99A44]" />
                          <span>{session.currentTranslation ? '1 Translation' : '0 Translations'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#F4EDE1]/80">
                          <Layers className="w-3 h-3 text-sky-400" />
                          <span>{session.applicationPackages?.length || 0} Resumes</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#F4EDE1]/80">
                          <CheckSquare className="w-3 h-3 text-emerald-400" />
                          <span>{session.trackerItems?.length || 0} Apps</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            onLoadSession(session);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs shadow-sm transition-colors"
                        >
                          Load Session
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingSessionId(session.id);
                          setEditingName(session.name);
                        }}
                        className="p-1.5 rounded-lg text-[#F4EDE1]/60 hover:text-[#F4EDE1] hover:bg-stone-800 transition-colors"
                        title="Rename session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateSession(session)}
                        className="p-1.5 rounded-lg text-[#F4EDE1]/60 hover:text-[#F4EDE1] hover:bg-stone-800 transition-colors"
                        title="Duplicate session"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {confirmDeleteId === session.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteSession(session.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-1 rounded bg-stone-800 text-[#F4EDE1] text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(session.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2B2B2B] flex items-center justify-between text-xs text-[#F4EDE1]/60">
          <span>{savedSessions.length} total saved sessions</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#F4EDE1] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
