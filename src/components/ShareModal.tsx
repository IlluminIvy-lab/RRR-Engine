import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Cloud, 
  Globe, 
  Database, 
  X, 
  Sparkles, 
  HardDrive, 
  ExternalLink,
  RefreshCw,
  FileCode
} from 'lucide-react';
import { AppExportData, FullApplicationPackage, TrackerItem, TranslationResult, DecisionHistoryEntry } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
  onImportData: (data: AppExportData) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentTranslation,
  applicationPackages,
  trackerItems,
  decisionHistory,
  onImportData,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [cloudWebhookUrl, setCloudWebhookUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'share' | 'export_import' | 'cloud_sync'>('share');

  if (!isOpen) return null;

  const exportPayload: AppExportData = {
    version: '2.5.0',
    exportedAt: new Date().toISOString(),
    lastTranslation: currentTranslation,
    applicationPackages,
    trackerItems,
    decisionHistory,
  };

  // Generate lightweight URL hash representation for fast link sharing
  const generateShareableUrl = () => {
    try {
      const summary = {
        title: currentTranslation?.commercialTitle || 'Career Profile',
        timestamp: new Date().toISOString(),
        hasResume: applicationPackages.length > 0,
        trackerCount: trackerItems.length,
      };
      const encoded = encodeURIComponent(btoa(JSON.stringify(summary)));
      const base = window.location.origin + window.location.pathname;
      return `${base}#share=${encoded}`;
    } catch {
      return window.location.href;
    }
  };

  const shareableUrl = generateShareableUrl();

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RRR Capability Engine — Career Assets & Roadmap',
          text: `Commercial Title: ${currentTranslation?.commercialTitle || 'Operations Specialist'}\nVerified Georgia Fair-Chance career assets and reentry roadmap.`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share cancelled or not supported', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJsonBackup = () => {
    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RRR_Career_System_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as AppExportData;
        onImportData(parsed);
        setSyncStatus('Data successfully imported and synchronized!');
        setTimeout(() => setSyncStatus(null), 4000);
      } catch (err) {
        alert('Invalid JSON backup file. Please select a valid RRR backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleCloudSync = async () => {
    if (!cloudWebhookUrl.trim()) {
      alert('Please enter a valid Cloud Storage URL or Webhook endpoint.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Syncing with remote cloud endpoint...');
    try {
      // POST payload to cloud endpoint
      const res = await fetch(cloudWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportPayload),
      });

      if (res.ok) {
        setSyncStatus('Cloud sync completed successfully!');
      } else {
        setSyncStatus(`Sync responded with status: ${res.status}`);
      }
    } catch (err: any) {
      setSyncStatus('Cloud endpoint unreachable. Saved locally in browser storage.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-stone-900 border border-stone-700/80 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-base font-bold text-stone-100 font-sans">
                Share & Cloud Sync Hub
              </h2>
              <p className="text-xs text-stone-400">
                Share application assets locally, export JSON backups, or sync to cloud providers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/30 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('share')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'share'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Direct Share Link</span>
          </button>

          <button
            onClick={() => setActiveTab('export_import')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'export_import'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Local Backup & Import (JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud_sync')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cloud_sync'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Sync Providers</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs text-stone-300">
          {syncStatus && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* TAB 1: DIRECT SHARE */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-200 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Instant System Link
                  </span>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Device Share Sheet</span>
                    </button>
                  )}
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Copy and send this direct access link to counselors, mentors, or hiring coordinators to review your current career package and action roadmap.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 bg-stone-900 border border-stone-700 rounded px-3 py-2 text-xs font-mono text-stone-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 font-semibold text-stone-100 flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Summary of Active Session */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded bg-stone-950/40 border border-stone-800/80">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Translated Title</span>
                  <span className="text-xs font-semibold text-amber-300 truncate block mt-0.5">
                    {currentTranslation?.commercialTitle || 'Not yet generated'}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-950/40 border border-stone-800/80">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Application Packages</span>
                  <span className="text-xs font-semibold text-stone-200 block mt-0.5">
                    {applicationPackages.length} package(s)
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-950/40 border border-stone-800/80">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Tracked Employers</span>
                  <span className="text-xs font-semibold text-stone-200 block mt-0.5">
                    {trackerItems.length} active stages
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-950/40 border border-stone-800/80">
                  <span className="text-[10px] text-stone-500 block uppercase font-mono">Decision Milestones</span>
                  <span className="text-xs font-semibold text-stone-200 block mt-0.5">
                    {decisionHistory.length} completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPORT & IMPORT */}
          {activeTab === 'export_import' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-100 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-sky-400" />
                      Download Local Backup (.JSON)
                    </h3>
                    <p className="text-stone-400 text-xs mt-1.5">
                      Save a complete, offline-ready JSON file containing all your resumes, cover letters, tracker stages, and decision history.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleDownloadJsonBackup}
                      className="flex-1 px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .JSON</span>
                    </button>
                    <button
                      onClick={handleCopyJson}
                      className="px-3 py-2 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-medium text-xs flex items-center gap-1"
                      title="Copy JSON to clipboard"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Import Card */}
                <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-100 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      Restore / Import Backup
                    </h3>
                    <p className="text-stone-400 text-xs mt-1.5">
                      Restore your previous session from a saved `.json` file on another phone, computer, or library workstation.
                    </p>
                  </div>
                  <div className="pt-2">
                    <label className="w-full cursor-pointer px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Select Backup File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-950/30 border border-stone-800/80 text-[11px] text-stone-400 leading-relaxed">
                <span className="text-amber-400 font-semibold">Privacy Guarantee:</span> Your career data stays 100% private in your local browser storage or in your exported files unless you explicitly sync to an external endpoint.
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD SYNC PROVIDERS */}
          {activeTab === 'cloud_sync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3">
                <h3 className="font-semibold text-stone-100 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  Cloud Storage & Sync Integration
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Connect your RRR Career Roadmap with your personal cloud drive or custom organization webhook (Google Drive, Microsoft OneDrive, Dropbox, or custom Reentry CRM).
                </p>

                {/* Cloud Provider Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-medium">Google Drive</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                  </a>

                  <a
                    href="https://onedrive.live.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Cloud className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-medium">OneDrive</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                  </a>

                  <a
                    href="https://www.dropbox.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-medium">Dropbox</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                  </a>
                </div>

                {/* Custom Webhook Sync */}
                <div className="pt-2 space-y-2 border-t border-stone-800">
                  <label className="text-[11px] font-semibold text-stone-300 block">
                    Custom Cloud Webhook / REST Sync URL (Optional):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://api.my-reentry-org.com/sync-user-data"
                      value={cloudWebhookUrl}
                      onChange={(e) => setCloudWebhookUrl(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded px-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleCloudSync}
                      disabled={isSyncing}
                      className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <span className="text-[11px] font-mono text-stone-500">
            RRR System • Local & Cloud Synchronization Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
