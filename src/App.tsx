import React, { useState } from 'react';
import { Header } from './components/Header';
import { CapabilityTranslatorView } from './components/CapabilityTranslatorView';
import { DecisionTreeEngine } from './components/DecisionTreeEngine';
import { UnifiedConsole } from './components/UnifiedConsole';
import { GeorgiaResourceVault } from './components/GeorgiaResourceVault';
import { AppMode, TranslationResult } from './types';
import { ShieldCheck, Compass, FileText, Landmark, Terminal, Zap } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('unified');
  const [currentTranslation, setCurrentTranslation] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTranslate = async (experienceText: string): Promise<TranslationResult | null> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate-capability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: experienceText })
      });

      if (!response.ok) {
        throw new Error('Failed to translate capabilities');
      }

      const data: TranslationResult = await response.json();
      data.rawExperience = experienceText;
      data.timestamp = new Date().toISOString();
      setCurrentTranslation(data);
      showToast('Commercial Capability Alignment Complete');
      return data;
    } catch (err) {
      console.error('Translation error:', err);
      showToast('Error during translation. Using cached corridor intelligence.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStartDecisionTree = () => {
    setCurrentMode('decision_tree');
    showToast('Launched Mode 2: Interactive Decision Tree (Day 1-3)');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onQuickStartDecisionTree={handleQuickStartDecisionTree}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'unified' && (
          <UnifiedConsole
            onTranslate={handleTranslate}
            isLoading={isLoading}
            onNavigateMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {currentMode === 'translator' && (
          <CapabilityTranslatorView
            onTranslate={handleTranslate}
            currentResult={currentTranslation}
            isLoading={isLoading}
            onSendToDecisionTree={handleQuickStartDecisionTree}
          />
        )}

        {currentMode === 'decision_tree' && (
          <DecisionTreeEngine
            onSwitchToTranslator={() => setCurrentMode('translator')}
          />
        )}

        {currentMode === 'georgia_vault' && (
          <GeorgiaResourceVault />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 border border-amber-500/50 text-stone-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-4 text-center text-xs font-mono text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RRR Capability Engine & Reentry Decision System • Georgia / Atlanta / Macon Corridor</span>
          <span className="text-stone-600">High-Agency Operational Protocols • Zero Corporate Jargon</span>
        </div>
      </footer>
    </div>
  );
}
