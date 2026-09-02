import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Compass, 
  FileText, 
  CheckSquare,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { AppMode } from '../../types';

interface ModeInfoData {
  modeNumber: string;
  title: string;
  tagline: string;
  detailedMission: string;
  inputsAccepted: string[];
  outputsProduced: string[];
  georgiaCorridorAdvantage: string;
}

const MODE_DESCRIPTIONS: Record<string, ModeInfoData> = {
  translator: {
    modeNumber: 'MODE 1',
    title: 'Institutional Capability Translator & Benchmarking',
    tagline: 'Transform non-traditional, facility, and institutional experience into commercial career assets.',
    detailedMission:
      'Mode 1 decodes institutional jobs, facility maintenance, culinary production, shop repairs, and administrative clerk duties into high-agency corporate and trade language. It eliminates stigmatizing jargon and replaces it with quantifiable operational metrics, industry-standard titles, and ATS-friendly skill competencies.',
    inputsAccepted: [
      'Raw institutional job descriptions & facility crew duties',
      'Physical equipment handled (forklifts, boilers, HVAC, POS systems)',
      'Quantifiable scale (headcounts managed, units packed, square footage)',
      'Spoken dictation via Web Speech API or multi-turn conversational intake',
    ],
    outputsProduced: [
      'Commercial Alignment Title: Industry-standard job title benchmarked against Georgia labor market data.',
      'Core Competencies: Exactly 4 technical hard skills and 4 high-agency execution soft skills.',
      'Outcome-Driven Resume Bullets: 3 quantified, high-impact achievements starting with strong action verbs.',
      'Georgia Corridor Placement: 2–3 verified Fair-Chance employers, hospital networks, or union apprenticeship locals in the Atlanta–Macon corridor.',
    ],
    georgiaCorridorAdvantage:
      'Directly mapped to Georgia HOPE Career Grant tuition-free programs and W-2 second-chance hiring corridors across Metro Atlanta, Central Georgia, and Savannah.',
  },
  resume_builder: {
    modeNumber: 'MODE 2',
    title: 'Complete Resume & Targeted Cover Letter Builder',
    tagline: 'Generate complete, employer-ready application packages in seconds.',
    detailedMission:
      'Mode 2 synthesizes translated capabilities into full application packages ready for submission to hiring managers and Applicant Tracking Systems (ATS). Choose between 4 specialized layouts (Functional Capability-First, Trade & Logistics, Healthcare & Dietary, and Classic Chronological) to present your strongest strengths upfront.',
    inputsAccepted: [
      'Target commercial job title or sector selection',
      'Candidate contact information (Name, City/State, Phone, Email)',
      'Automated pull from Mode 1 Capability Translator results',
      'Industry focus (Logistics, Healthcare, Electrical Trades, Culinary, Facilities)',
    ],
    outputsProduced: [
      'Employer-Ready Professional Resume: Structured markdown, PDF export, and editable Word (.docx) document.',
      'Targeted 3-Paragraph Cover Letter: Executive communication connecting operational autonomy and compliance to the hiring manager’s bottom line.',
      'Competencies Matrix: 2x3 high-density technical and operational skills grid.',
      'Georgia Education & Certifications: HOPE Grant eligibility and trade pathways pre-populated.',
    ],
    georgiaCorridorAdvantage:
      'Generates compliant documents formatted specifically for Georgia corporate portals, union halls (IBEW, UA, SMART), and hospital HR systems (Grady, Emory, Piedmont).',
  },
  tracker: {
    modeNumber: 'MODE 3',
    title: 'Research & Application Progress Tracker',
    tagline: 'Organize applications, follow-ups, interview advocacy, and onboarding milestones.',
    detailedMission:
      'Mode 3 provides an operational pipeline to manage your commercial job search. It prevents missed follow-ups, logs Fair-Chance policy responses, and enforces a high-agency rule: every single opportunity always maintains a clear NEXT IMMEDIATE ACTION.',
    inputsAccepted: [
      'Employer names, target positions, and corridor locations',
      'Target hourly wage or salary expectations ($18–$35+/hr)',
      'Hiring manager & recruiter contact notes',
      'Fair-Chance hiring policy verifications and background check notes',
    ],
    outputsProduced: [
      'Stage 1 (Research & Targeting): Market intelligence and second-chance policy verification.',
      'Stage 2 (Application & Outreach): Application submission timestamps and direct outreach tracking.',
      'Stage 3 (Interview & Advocacy): Interview prep, background disclosure talking points, and callback schedules.',
      'Stage 4 (Onboarding & Milestones): W-4 paperwork, direct deposit setup, and 30/60/90-day retention goals.',
    ],
    georgiaCorridorAdvantage:
      'Pre-populated with verified Georgia Fair-Chance employers, Georgia DDS clearance milestones, and union apprenticeship intake dates.',
  },
  decision_tree: {
    modeNumber: 'MODE 4',
    title: 'Interactive Reentry Decision Tree & Milestones',
    tagline: 'Step-by-step navigation through critical post-release milestones.',
    detailedMission:
      'Mode 4 breaks down the reentry timeline into structured, non-overwhelming decision nodes. It presents exactly ONE focused multiple-choice question at a time to resolve IDs, vital records, transit passes, transitional housing, second-chance banking, and community supervision requirements without administrative gridlock.',
    inputsAccepted: [
      'Single-click answers to Options A, B, or C at each milestone stage',
      'Current timeline phase selection (Day 1–3, Day 3–10, Day 10–30)',
      'Real-world status regarding state IDs, housing stability, and transit access',
    ],
    outputsProduced: [
      'Actionable step-by-step execution plans for every selection',
      'Direct Georgia resource referrals (DDS locations, MARTA programs, Second-Chance Credit Unions)',
      'Exportable decision history and compliance checklist for parole/probation reporting',
      'Seamless link directly back to Mode 1 Capability Translator once vital records are secured',
    ],
    georgiaCorridorAdvantage:
      'Hardcoded with Georgia-specific statutes, Georgia Department of Driver Services (DDS) processes, MARTA transit reduced fare programs, and HOPE Career Grant trade colleges.',
  },
};

interface ModeDescriptionBannerProps {
  mode: AppMode;
  className?: string;
}

export const ModeDescriptionBanner: React.FC<ModeDescriptionBannerProps> = ({
  mode,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = MODE_DESCRIPTIONS[mode];

  if (!data) return null;

  return (
    <div
      className={`bg-[#0B0F0E] border border-[#2B2B2B] rounded-xl overflow-hidden shadow-sm transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-[#0B0F0E] via-[#1C2621]/40 to-[#0B0F0E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C99A44]/15 text-[#C99A44] border border-[#C99A44]/30">
              {data.modeNumber}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#F4EDE1] font-serif tracking-wide">
              {data.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F4EDE1]/80 leading-relaxed font-sans max-w-3xl">
            {data.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#C99A44] bg-black/50 hover:bg-black/80 border border-[#2B2B2B] hover:border-[#C99A44]/50 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#C99A44]" />
            <span>{isExpanded ? 'Hide Mode Details' : 'View Mode Blueprint & Scope'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#C99A44]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#C99A44]" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details Drawer (CHANGE 3) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-[#2B2B2B] bg-black/40 space-y-4 animate-in fade-in duration-200">
          {/* Mission */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#C99A44] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C99A44]" />
              <span>Operational Purpose & Mission</span>
            </div>
            <p className="text-xs sm:text-sm text-[#F4EDE1]/90 leading-relaxed font-sans">
              {data.detailedMission}
            </p>
          </div>

          {/* 2-Column Grid: Inputs Accepted & Outputs Produced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Column 1: Inputs Accepted */}
            <div className="p-3.5 rounded-lg bg-[#0B0F0E] border border-[#2B2B2B] space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Inputs Accepted:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#F4EDE1]/80 font-sans">
                {data.inputsAccepted.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5"></span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Outputs Produced */}
            <div className="p-3.5 rounded-lg bg-[#0B0F0E] border border-[#2B2B2B] space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Outputs Produced:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#F4EDE1]/80 font-sans">
                {data.outputsProduced.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Georgia Corridor Advantage Callout */}
          <div className="p-3.5 rounded-lg bg-[#2F4A3E]/30 border border-[#2F4A3E] flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#C99A44] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C99A44]">
                Georgia Corridor & Fair-Chance Advantage:
              </span>
              <p className="text-xs text-[#F4EDE1]/90 leading-relaxed font-sans">
                {data.georgiaCorridorAdvantage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
