import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  ArrowRight, 
  Copy, 
  Check, 
  Building2, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Trash2, 
  FileText, 
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { TrackerItem, TrackerStage } from '../types';

interface ApplicationTrackerViewProps {
  items: TrackerItem[];
  onAddItem: (item: Omit<TrackerItem, 'id' | 'dateAdded' | 'dateUpdated'>) => void;
  onUpdateStage: (id: string, newStage: TrackerStage) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: TrackerItem) => void;
}

const STAGES: TrackerStage[] = [
  'STAGE 1: RESEARCH & TARGETING',
  'STAGE 2: APPLICATION & OUTREACH',
  'STAGE 3: INTERVIEW & ADVOCACY',
  'STAGE 4: ONBOARDING & MILESTONES',
];

const PRESET_GA_EMPLOYERS = [
  {
    company: 'Grady Health System',
    role: 'Patient Logistics & Facilities Specialist',
    corridor: 'Atlanta Metro' as const,
    fairChancePolicyNotes: 'Verified Fair-Chance healthcare employer. Evaluates individual qualifications without blanket disqualification.',
    wageTarget: '$19 – $24/hr + Full Benefits',
    nextImmediateAction: 'Submit application via Grady Careers portal and contact Department Talent Recruiter.',
  },
  {
    company: 'MARTA (Metropolitan Atlanta Rapid Transit Authority)',
    role: 'Transit Maintenance & Facility Operations',
    corridor: 'Atlanta Metro' as const,
    fairChancePolicyNotes: 'Union-backed public authority with second-chance apprenticeship tracks and pension.',
    wageTarget: '$22 – $28/hr Union Wage Scale',
    nextImmediateAction: 'Check next MARTA Civil Service testing date and submit online application.',
  },
  {
    company: 'IBEW Local 613',
    role: 'Electrical Apprentice (Inside Wireman Track)',
    corridor: 'Atlanta Metro' as const,
    fairChancePolicyNotes: 'Zero-tuition earn-while-you-learn union apprenticeship. Accepts individuals with strong work ethic.',
    wageTarget: '$18/hr start to $36+/hr Journeyman scale',
    nextImmediateAction: 'Obtain high school algebra transcript and submit apprentice intake packet.',
  },
  {
    company: 'UPS Smart Hub (Atlanta / Forest Park)',
    role: 'Package Operations & Equipment Handling',
    corridor: 'Atlanta Metro' as const,
    fairChancePolicyNotes: 'Major logistics employer with fast promotion pipelines and Teamsters health benefits.',
    wageTarget: '$21/hr + Earn-and-Learn Tuition Assistance',
    nextImmediateAction: 'Complete online application for twilight or day shift staging operations.',
  },
  {
    company: 'Central Georgia Health System (Macon)',
    role: 'Environmental Services & Supply Staging',
    corridor: 'Macon / Central GA' as const,
    fairChancePolicyNotes: 'Central GA regional medical center with fair-chance intake policies for facilities.',
    wageTarget: '$17 – $21/hr',
    nextImmediateAction: 'Tailor resume for healthcare sanitation protocols and apply online.',
  },
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  items,
  onAddItem,
  onUpdateStage,
  onDeleteItem,
  onUpdateItem,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState<TrackerStage>('STAGE 1: RESEARCH & TARGETING');
  const [corridor, setCorridor] = useState<'Atlanta Metro' | 'Macon / Central GA' | 'Savannah / Coastal' | 'Statewide GA'>('Atlanta Metro');
  const [notes, setNotes] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [nextImmediateAction, setNextImmediateAction] = useState('');
  const [fairChancePolicyNotes, setFairChancePolicyNotes] = useState('');
  const [wageTarget, setWageTarget] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'standard'>('high');
  const [isGeneratingAction, setIsGeneratingAction] = useState(false);
  const [copiedLedger, setCopiedLedger] = useState(false);

  const handleQuickAddPreset = (preset: typeof PRESET_GA_EMPLOYERS[0]) => {
    onAddItem({
      company: preset.company,
      role: preset.role,
      stage: 'STAGE 1: RESEARCH & TARGETING',
      corridor: preset.corridor,
      notes: 'Added from Georgia Verified Fair-Chance Directory.',
      nextImmediateAction: preset.nextImmediateAction,
      fairChancePolicyNotes: preset.fairChancePolicyNotes,
      wageTarget: preset.wageTarget,
      priority: 'high',
      status: 'active',
    });
  };

  const handleAIAssist = async () => {
    if (!company) return;
    setIsGeneratingAction(true);
    try {
      const res = await fetch('/api/tracker-ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: company, roleTitle: role, notes, currentStage: stage }),
      });
      const data = await res.json();
      if (data.nextImmediateAction) setNextImmediateAction(data.nextImmediateAction);
      if (data.fairChanceNotes) setFairChancePolicyNotes(data.fairChanceNotes);
      if (data.stage && STAGES.includes(data.stage)) setStage(data.stage);
    } catch (err) {
      setNextImmediateAction(`Submit tailored application and follow up with hiring manager within 3 days.`);
    } finally {
      setIsGeneratingAction(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAddItem({
      company: company.trim(),
      role: role.trim(),
      stage,
      corridor,
      notes: notes.trim() || 'Active career pipeline opportunity.',
      contactPerson: contactPerson.trim() || undefined,
      nextImmediateAction: nextImmediateAction.trim() || 'Submit tailored resume and log reference verification.',
      fairChancePolicyNotes: fairChancePolicyNotes.trim() || 'Fair-Chance evaluation pending.',
      wageTarget: wageTarget.trim() || undefined,
      priority,
      status: 'active',
    });

    // Reset
    setCompany('');
    setRole('');
    setNotes('');
    setContactPerson('');
    setNextImmediateAction('');
    setFairChancePolicyNotes('');
    setWageTarget('');
    setIsAdding(false);
  };

  const generateMarkdownLedger = () => {
    let md = `# RRR CAREER & APPLICATION PROGRESS TRACKER
*Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}*

---

`;

    STAGES.forEach((stg) => {
      const stageItems = items.filter((item) => item.stage === stg);
      md += `## [${stg}]\n`;
      if (stageItems.length === 0) {
        md += `*No active targets in this stage.*\n\n`;
      } else {
        stageItems.forEach((item) => {
          md += `### ${item.company} — ${item.role} (${item.corridor})
- **Priority:** ${item.priority.toUpperCase()} | **Wage Target:** ${item.wageTarget || 'Standard'}
- **Fair-Chance Policy Notes:** ${item.fairChancePolicyNotes || 'Standard evaluation'}
- **Contact:** ${item.contactPerson || 'Direct Portal / Recruiter'}
- **Notes:** ${item.notes}
- **⚡ NEXT IMMEDIATE ACTION:** **${item.nextImmediateAction}**

`;
        });
      }
    });

    return md;
  };

  const handleCopyLedger = () => {
    navigator.clipboard.writeText(generateMarkdownLedger());
    setCopiedLedger(true);
    setTimeout(() => setCopiedLedger(false), 2000);
  };

  const handleDownloadLedger = () => {
    const md = generateMarkdownLedger();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RRR_Application_Tracker_Ledger_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              MODE 3: RESEARCH & APPLICATION PROGRESS TRACKER
            </span>
            <span className="text-xs text-stone-400 font-mono">Active Lifecycle Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-100 font-sans mt-1">
            Career Search & Reentry Progress Tracker
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Maintains an active Markdown ledger tracking career progression across 4 stages with mandatory high-agency immediate actions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Close Form' : 'Add Employer Target'}</span>
          </button>

          <button
            onClick={handleCopyLedger}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
          >
            {copiedLedger ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLedger ? 'Ledger Copied' : 'Copy Markdown Ledger'}</span>
          </button>

          <button
            onClick={handleDownloadLedger}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Quick Add Preset GA Employers */}
      <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Georgia Fair-Chance Pathway Presets:</span>
          </span>
          <span className="text-[11px] text-stone-400">1-click add to Stage 1 Research</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_GA_EMPLOYERS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAddPreset(preset)}
              className="px-2.5 py-1.5 rounded bg-stone-950 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>{preset.company}</span>
              <span className="text-[10px] text-stone-500">[{preset.corridor}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add New Target Form */}
      {isAdding && (
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 rounded-xl bg-stone-900 border border-stone-700 space-y-3 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Add Employer or Career Target</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Company / Organization *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Grady Health System"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Role / Job Title *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Facilities Logistics Specialist"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Lifecycle Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as TrackerStage)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Georgia Corridor</label>
              <select
                value={corridor}
                onChange={(e) => setCorridor(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Atlanta Metro">Atlanta Metro</option>
                <option value="Macon / Central GA">Macon / Central GA</option>
                <option value="Savannah / Coastal">Savannah / Coastal</option>
                <option value="Statewide GA">Statewide GA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Target Wage / Salary</label>
              <input
                type="text"
                value={wageTarget}
                onChange={(e) => setWageTarget(e.target.value)}
                placeholder="e.g. $22.50/hr + Benefits"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Contact Person / Recruiter</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Marcus Vance, Ops Recruiter"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="standard">Standard Pipeline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-stone-300 font-semibold">⚡ NEXT IMMEDIATE ACTION *</label>
                <button
                  type="button"
                  onClick={handleAIAssist}
                  disabled={isGeneratingAction || !company}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingAction ? 'Auto-suggesting...' : 'AI Auto-Suggest'}</span>
                </button>
              </div>
              <input
                type="text"
                value={nextImmediateAction}
                onChange={(e) => setNextImmediateAction(e.target.value)}
                placeholder="e.g. Submit tailored resume via Fair-Chance portal and connect with hiring manager on LinkedIn"
                className="w-full bg-stone-950 border border-amber-500/50 rounded px-3 py-2 text-xs text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Fair-Chance Policy Notes</label>
              <input
                type="text"
                value={fairChancePolicyNotes}
                onChange={(e) => setFairChancePolicyNotes(e.target.value)}
                placeholder="e.g. Fair-chance employer, Ban-the-Box compliant, tax credit eligible"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Research Notes & Context</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Attended virtual information session; operations team is expanding second shift logistics operations."
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
            >
              Save to Tracker
            </button>
          </div>
        </form>
      )}

      {/* 4-STAGE LIFECYCLE KANBAN LEDGER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stg, stageIdx) => {
          const stageItems = items.filter((item) => item.stage === stg);
          return (
            <div
              key={stg}
              className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 flex flex-col min-h-[420px]"
            >
              {/* Stage Header */}
              <div className="border-b border-stone-800 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    STAGE {stageIdx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-stone-200 uppercase tracking-tight">
                    {stg.replace(/STAGE \d+: /, '')}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] font-mono font-bold text-stone-300">
                  {stageItems.length}
                </span>
              </div>

              {/* Stage Items List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageItems.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-stone-800 text-center text-stone-500 text-xs my-4">
                    No active targets in this stage.
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-stone-950 border border-stone-800/90 hover:border-stone-700 transition-all space-y-2 shadow-sm text-xs"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <h4 className="font-bold text-stone-100 text-sm">{item.company}</h4>
                          <p className="text-stone-300 font-medium text-xs">{item.role}</p>
                        </div>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[10px] text-stone-400">
                        <span className="flex items-center gap-1 font-mono text-amber-400">
                          <MapPin className="w-3 h-3" />
                          {item.corridor}
                        </span>
                        {item.wageTarget && (
                          <span className="flex items-center gap-0.5 text-emerald-400 font-mono">
                            <DollarSign className="w-3 h-3" />
                            {item.wageTarget}
                          </span>
                        )}
                      </div>

                      {item.fairChancePolicyNotes && (
                        <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-stone-300">
                          <span className="text-amber-400 font-semibold">Fair-Chance: </span>
                          {item.fairChancePolicyNotes}
                        </div>
                      )}

                      {/* MANDATORY NEXT IMMEDIATE ACTION */}
                      <div className="p-2 rounded bg-amber-950/30 border border-amber-600/40 text-[11px] text-amber-200">
                        <span className="font-bold text-amber-400 block mb-0.5">⚡ NEXT IMMEDIATE ACTION:</span>
                        {item.nextImmediateAction}
                      </div>

                      {/* Stage Transfer Controls */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-1 text-[10px]">
                        <span className="text-stone-500 font-mono">Move:</span>
                        <select
                          value={item.stage}
                          onChange={(e) => onUpdateStage(item.id, e.target.value as TrackerStage)}
                          className="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-[10px] text-stone-200 focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s.replace(/STAGE \d+: /, '')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
