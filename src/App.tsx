import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CapabilityTranslatorView } from './components/CapabilityTranslatorView';
import { ResumeBuilderView } from './components/ResumeBuilderView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { DecisionTreeEngine } from './components/DecisionTreeEngine';
import { UnifiedConsole } from './components/UnifiedConsole';
import { GeorgiaResourceVault } from './components/GeorgiaResourceVault';
import { ShareModal } from './components/ShareModal';
import { PageNavigationBar } from './components/common/PageNavigationBar';
import { SavedSessionsModal } from './components/SavedSessionsModal';
import { AIAdvisorChat } from './components/AIAdvisorChat';
import { 
  AppMode, 
  TranslationResult, 
  FullApplicationPackage, 
  TrackerItem, 
  TrackerStage, 
  DecisionHistoryEntry,
  AppExportData,
  SavedSession
} from './types';
import { translateCapabilityOffline, generateFullPackageOffline } from './utils/offlineEngine';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('unified');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSavedSessionsOpen, setIsSavedSessionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Network connected: Live AI Cloud Engine online');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Offline Mode Active: Instant local capability engine & storage available');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Translation State (with localStorage persistence)
  const [currentTranslation, setCurrentTranslation] = useState<TranslationResult | null>(() => {
    try {
      const saved = localStorage.getItem('rrr_last_translation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Application Packages (Mode 2)
  const [applicationPackages, setApplicationPackages] = useState<FullApplicationPackage[]>(() => {
    try {
      const saved = localStorage.getItem('rrr_application_packages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Tracker Items (Mode 3)
  const [trackerItems, setTrackerItems] = useState<TrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem('rrr_tracker_items');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default seeded tracker items
    return [
      {
        id: 'track-seed-1',
        company: 'Grady Health System',
        role: 'Facilities Logistics Specialist',
        stage: 'STAGE 1: RESEARCH & TARGETING',
        corridor: 'Atlanta Metro',
        notes: 'Reviewed Fair-Chance hiring policy. Verified Ban-the-Box and institutional background clearance guidelines.',
        nextImmediateAction: 'Submit tailored resume via Grady Health careers portal and connect with facilities recruiter.',
        fairChancePolicyNotes: 'Verified Second-Chance & Fair-Chance health system. Evaluates case-by-case.',
        wageTarget: '$20 – $24/hr + Benefits',
        priority: 'high',
        dateAdded: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        status: 'active',
      },
      {
        id: 'track-seed-2',
        company: 'IBEW Local 613 (Atlanta Electrical JATC)',
        role: 'Inside Wireman Apprentice',
        stage: 'STAGE 2: APPLICATION & OUTREACH',
        corridor: 'Atlanta Metro',
        notes: 'Earn-while-you-learn union apprenticeship. Zero tuition debt track.',
        nextImmediateAction: 'Request high school algebra transcripts and deliver intake packet in person to Local 613 JATC.',
        fairChancePolicyNotes: 'Union apprenticeship with open interview scoring. Values mechanical aptitude.',
        wageTarget: '$18.50/hr start -> $36+/hr Journeyman scale',
        priority: 'high',
        dateAdded: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        status: 'active',
      },
    ];
  });

  // 4. Decision History (Mode 4)
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('rrr_decision_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Saved Sessions Management (Change 6)
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>(() => {
    try {
      const saved = localStorage.getItem('rrr_saved_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      if (currentTranslation) {
        localStorage.setItem('rrr_last_translation', JSON.stringify(currentTranslation));
      } else {
        localStorage.removeItem('rrr_last_translation');
      }
    } catch {}
  }, [currentTranslation]);

  useEffect(() => {
    try {
      localStorage.setItem('rrr_application_packages', JSON.stringify(applicationPackages));
    } catch {}
  }, [applicationPackages]);

  useEffect(() => {
    try {
      localStorage.setItem('rrr_tracker_items', JSON.stringify(trackerItems));
    } catch {}
  }, [trackerItems]);

  useEffect(() => {
    try {
      localStorage.setItem('rrr_decision_history', JSON.stringify(decisionHistory));
    } catch {}
  }, [decisionHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('rrr_saved_sessions', JSON.stringify(savedSessions));
    } catch {}
  }, [savedSessions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mode 1: Translate capability
  const handleTranslate = async (experienceText: string): Promise<TranslationResult | null> => {
    setIsLoading(true);
    // If browser is offline, use offline engine immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineData = translateCapabilityOffline(experienceText);
      setCurrentTranslation(offlineData);
      showToast('Offline Mode: Capability alignment generated locally (Saved)');
      setIsLoading(false);
      return offlineData;
    }

    try {
      const response = await fetch('/api/translate-capability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: experienceText }),
      });

      if (!response.ok) {
        throw new Error('Failed to translate capabilities via API');
      }

      const data: TranslationResult = await response.json();
      data.rawExperience = experienceText;
      data.timestamp = new Date().toISOString();
      setCurrentTranslation(data);
      showToast('Capability Alignment Complete (Saved to local storage)');
      return data;
    } catch (err) {
      console.warn('Live API unreachable, using verified offline engine:', err);
      const fallbackData = translateCapabilityOffline(experienceText);
      setCurrentTranslation(fallbackData);
      showToast('Offline Engine: Capability alignment generated locally');
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  };

  // Mode 2: Generate Full Application Package
  const handleGeneratePackage = async (
    targetTitle: string,
    candidateName: string = 'J. Carter',
    location: string = 'Atlanta, GA',
    industry: string = 'Logistics & Supply Chain'
  ): Promise<FullApplicationPackage | null> => {
    setIsLoading(true);

    // If browser is offline, use offline engine immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlinePkg = generateFullPackageOffline(targetTitle, candidateName, location, industry);
      setApplicationPackages((prev) => [offlinePkg, ...prev.filter((p) => p.targetJobTitle !== offlinePkg.targetJobTitle)]);
      showToast(`Offline Mode: Application Package generated for "${targetTitle}"`);
      setIsLoading(false);
      return offlinePkg;
    }

    try {
      const response = await fetch('/api/generate-full-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJobTitle: targetTitle,
          candidateName,
          cityStateZip: location,
          industrySector: industry,
          translatedData: currentTranslation,
        }),
      });

      if (!response.ok) throw new Error('Package generation failed');
      const data: FullApplicationPackage = await response.json();
      
      setApplicationPackages((prev) => [data, ...prev.filter((p) => p.targetJobTitle !== data.targetJobTitle)]);
      showToast(`Full Application Package generated for "${targetTitle}"`);
      return data;
    } catch (err) {
      console.warn('Live API generation failed, using offline engine templates:', err);
      const fallbackPkg = generateFullPackageOffline(targetTitle, candidateName, location, industry);
      setApplicationPackages((prev) => [fallbackPkg, ...prev.filter((p) => p.targetJobTitle !== fallbackPkg.targetJobTitle)]);
      showToast(`Offline Engine: Application package generated for "${targetTitle}"`);
      return fallbackPkg;
    } finally {
      setIsLoading(false);
    }
  };

  // Mode 3: Add item to tracker
  const handleAddTrackerItem = (item: Omit<TrackerItem, 'id' | 'dateAdded' | 'dateUpdated'>) => {
    const newItem: TrackerItem = {
      ...item,
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };
    setTrackerItems((prev) => [newItem, ...prev]);
    showToast(`Added "${item.company}" to Application Tracker`);
  };

  const handleUpdateTrackerStage = (id: string, newStage: TrackerStage) => {
    setTrackerItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage: newStage, dateUpdated: new Date().toISOString() } : item))
    );
    showToast(`Moved to ${newStage}`);
  };

  const handleDeleteTrackerItem = (id: string) => {
    setTrackerItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from tracker');
  };

  const handleUpdateTrackerItem = (updated: TrackerItem) => {
    setTrackerItems((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...updated, dateUpdated: new Date().toISOString() } : item))
    );
  };

  const handleClearTranslation = () => {
    setCurrentTranslation(null);
    showToast('Saved capability translation cleared');
  };

  const handleWipeSession = () => {
    try {
      localStorage.removeItem('rrr_last_translation');
      localStorage.removeItem('rrr_application_packages');
      localStorage.removeItem('rrr_tracker_items');
      localStorage.removeItem('rrr_decision_history');
    } catch {}
    setCurrentTranslation(null);
    setApplicationPackages([]);
    setTrackerItems([]);
    setDecisionHistory([]);
    setCurrentMode('unified');
    showToast('Privacy Quick-Wipe Complete: All local session data purged');
  };

  const handleImportData = (data: AppExportData) => {
    if (data.lastTranslation) setCurrentTranslation(data.lastTranslation);
    if (data.applicationPackages && Array.isArray(data.applicationPackages)) {
      setApplicationPackages(data.applicationPackages);
    }
    if (data.trackerItems && Array.isArray(data.trackerItems)) {
      setTrackerItems(data.trackerItems);
    }
    if (data.decisionHistory && Array.isArray(data.decisionHistory)) {
      setDecisionHistory(data.decisionHistory);
    }
    showToast('Session restored successfully from JSON backup');
  };

  // Session Management Handlers (Change 6)
  const handleSaveCurrentSession = (sessionName: string) => {
    const timestamp = new Date().toISOString();
    if (activeSessionId) {
      // Update existing session
      setSavedSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                name: sessionName || s.name,
                updatedAt: timestamp,
                currentTranslation,
                applicationPackages,
                trackerItems,
                decisionHistory,
              }
            : s
        )
      );
      showToast(`Session "${sessionName}" updated successfully`);
    } else {
      // Create new session
      const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newSession: SavedSession = {
        id: newId,
        name: sessionName || `Career Session ${new Date().toLocaleDateString()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        currentTranslation,
        applicationPackages,
        trackerItems,
        decisionHistory,
      };
      setSavedSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newId);
      showToast(`Session "${newSession.name}" saved to local storage`);
    }
  };

  const handleLoadSession = (session: SavedSession) => {
    setCurrentTranslation(session.currentTranslation);
    setApplicationPackages(session.applicationPackages || []);
    setTrackerItems(session.trackerItems || []);
    setDecisionHistory(session.decisionHistory || []);
    setActiveSessionId(session.id);
    setIsSavedSessionsOpen(false);
    showToast(`Loaded session: "${session.name}"`);
  };

  const handleNewBlankSession = () => {
    handleWipeSession();
    setActiveSessionId(null);
    setIsSavedSessionsOpen(false);
    showToast('Started new blank career session');
  };

  const handleDeleteSession = (sessionId: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
    showToast('Session snapshot deleted');
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    setSavedSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, name: newName, updatedAt: new Date().toISOString() } : s))
    );
    showToast('Session renamed');
  };

  const handleDuplicateSession = (session: SavedSession) => {
    const timestamp = new Date().toISOString();
    const cloned: SavedSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${session.name} (Copy)`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setSavedSessions((prev) => [cloned, ...prev]);
    showToast(`Created copy: "${cloned.name}"`);
  };

  const activePackage = applicationPackages[0] || null;

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-[#F4EDE1] flex flex-col font-sans selection:bg-[#C99A44] selection:text-[#0B0F0E]">
      {/* Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onQuickStartDecisionTree={() => {
          setCurrentMode('decision_tree');
          showToast('Launched Mode 4: Reentry Decision Tree (Day 1-3)');
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenSavedSessions={() => setIsSavedSessionsOpen(true)}
        onWipeSession={handleWipeSession}
        isOffline={isOffline}
      />

      {/* Mode Navigation Bar (Change 2: Tabbed/Paginated Navigation) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <PageNavigationBar
          currentMode={currentMode}
          onSelectMode={(mode) => setCurrentMode(mode)}
          currentTranslation={currentTranslation}
          applicationPackages={applicationPackages}
          trackerItems={trackerItems}
          decisionHistory={decisionHistory}
          isOffline={isOffline}
          onOpenSavedSessions={() => setIsSavedSessionsOpen(true)}
        />
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {currentMode === 'unified' && (
          <UnifiedConsole
            onTranslate={handleTranslate}
            onGeneratePackage={handleGeneratePackage}
            onAddItemToTracker={handleAddTrackerItem}
            isLoading={isLoading}
            onNavigateMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {currentMode === 'translator' && (
          <CapabilityTranslatorView
            onTranslate={handleTranslate}
            currentResult={currentTranslation}
            isLoading={isLoading}
            onSendToDecisionTree={() => setCurrentMode('decision_tree')}
            onClearTranslation={handleClearTranslation}
          />
        )}

        {currentMode === 'resume_builder' && (
          <ResumeBuilderView
            currentPackage={activePackage}
            currentTranslation={currentTranslation}
            onGeneratePackage={handleGeneratePackage}
            onSavePackage={(pkg) => {
              setApplicationPackages((prev) => [pkg, ...prev.filter((p) => p.targetJobTitle !== pkg.targetJobTitle)]);
              showToast('Package updated');
            }}
            onSendToTracker={(company, role) => {
              handleAddTrackerItem({
                company,
                role,
                stage: 'STAGE 2: APPLICATION & OUTREACH',
                corridor: 'Atlanta Metro',
                notes: 'Generated via Mode 2 Resume & Cover Letter Builder.',
                nextImmediateAction: 'Submit tailored application packet and follow up with hiring team in 48 hours.',
                fairChancePolicyNotes: 'Direct application submitted with full commercial package.',
                priority: 'high',
                status: 'active',
              });
              setCurrentMode('tracker');
            }}
            isLoading={isLoading}
          />
        )}

        {currentMode === 'tracker' && (
          <ApplicationTrackerView
            items={trackerItems}
            onAddItem={handleAddTrackerItem}
            onUpdateStage={handleUpdateTrackerStage}
            onDeleteItem={handleDeleteTrackerItem}
            onUpdateItem={handleUpdateTrackerItem}
          />
        )}

        {currentMode === 'decision_tree' && (
          <DecisionTreeEngine
            history={decisionHistory}
            onLogEntry={(entry) => setDecisionHistory((prev) => [...prev, entry])}
            onResetTree={() => {
              setDecisionHistory([]);
              showToast('Decision Tree reset');
            }}
            onSwitchToTranslator={() => setCurrentMode('translator')}
          />
        )}

        {currentMode === 'advisor' && (
          <AIAdvisorChat
            currentTranslation={currentTranslation}
            applicationPackages={applicationPackages}
            trackerItems={trackerItems}
            decisionHistory={decisionHistory}
            onNavigateMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {currentMode === 'georgia_vault' && (
          <GeorgiaResourceVault />
        )}
      </main>

      {/* Saved Sessions Snapshots Modal (Change 6) */}
      <SavedSessionsModal
        isOpen={isSavedSessionsOpen}
        onClose={() => setIsSavedSessionsOpen(false)}
        savedSessions={savedSessions}
        activeSessionId={activeSessionId}
        onSaveCurrentSession={handleSaveCurrentSession}
        onLoadSession={handleLoadSession}
        onNewBlankSession={handleNewBlankSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onDuplicateSession={handleDuplicateSession}
        currentTranslation={currentTranslation}
        applicationPackages={applicationPackages}
        trackerItems={trackerItems}
        decisionHistory={decisionHistory}
      />

      {/* Share & Cloud Sync Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentTranslation={currentTranslation}
        applicationPackages={applicationPackages}
        trackerItems={trackerItems}
        decisionHistory={decisionHistory}
        onImportData={handleImportData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2F4A3E] border border-[#C99A44]/60 text-[#F4EDE1] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#C99A44]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Print Stylesheet Clean Header for Direct Printing */}
      <footer className="border-t border-[#F4EDE1]/15 bg-[#0B0F0E] py-4 text-center text-xs font-mono text-[#F4EDE1]/60 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RealReentryRegister™ Capability Engine & Reentry Navigation System • Georgia / Atlanta / Macon Corridor</span>
          <span className="text-[#C99A44]">Make the system visible. Make the path clearer.</span>
        </div>
      </footer>
    </div>
  );
}
