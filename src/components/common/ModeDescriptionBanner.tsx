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
    title: 'Translator: Your Experience, in Employer Language',
    tagline: 'Takes the work you did inside and restates it the way employers write it.',
    detailedMission:
      'Mode 1 takes the jobs you held inside — kitchen work, maintenance, laundry, clerk duties, shop repairs — and restates them the way employers describe the same work: a standard job title, your skills, and short bullet points with numbers. It leaves out prison labels and uses the words hiring managers and resume software actually search for.',
    inputsAccepted: [
      'The jobs and duties you had inside, in your own words',
      'Equipment you used (forklifts, kitchen equipment, HVAC, registers)',
      'Numbers that show scale (meals served, people you supervised, rooms or units handled)',
      'Talking instead of typing — use the microphone, or answer the intake coach one question at a time',
    ],
    outputsProduced: [
      'A job title employers actually use, matched to Georgia job openings.',
      'Your skills: 4 hands-on skills and 4 workplace strengths.',
      '3 resume bullet points with numbers, each starting with a strong action word.',
      'Links to Georgia fair-chance hiring resources that fit your experience.',
    ],
    georgiaCorridorAdvantage:
      'Points to Georgia programs that can pay for training, including the HOPE Career Grant at Georgia technical colleges, and to fair-chance employers across metro Atlanta and central Georgia.',
  },
  resume_builder: {
    modeNumber: 'MODE 2',
    title: 'Complete Resume & Cover Letter Builder',
    tagline: 'Builds a finished resume and cover letter you can send to employers.',
    detailedMission:
      'Mode 2 turns your translated experience into a complete application package: a resume and a cover letter, ready to send. Pick the kind of work you\'re applying for — logistics and supply chain, health care and hospital systems, commercial trades and electrical, culinary and facilities, or general operations — and the resume is built for that field, formatted so employer screening software can read it, with your strongest experience first.',
    inputsAccepted: [
      'The job title or kind of work you are applying for',
      'Your contact details (name, city and state, phone, email)',
      'Your Mode 1 Translator results — pulled in automatically',
      'The kind of work you want: logistics, health care, trades, kitchen, facilities, general operations',
    ],
    outputsProduced: [
      'A finished resume you can download as a PDF or an editable Word document.',
      'A 3-paragraph cover letter written for the job you picked.',
      'A skills grid showing your hands-on skills and workplace strengths side by side.',
      'Your Georgia training and certificates, including HOPE Career Grant programs.',
    ],
    georgiaCorridorAdvantage:
      'Formatted for the places Georgia employers actually hire: company hiring portals, union halls (IBEW, UA, SMART), and hospital systems (Grady, Emory, Piedmont).',
  },
  tracker: {
    modeNumber: 'MODE 3',
    title: 'Job Application Tracker',
    tagline: 'Keeps every job you are pursuing in one list, so you always know your next step.',
    detailedMission:
      'Mode 3 keeps your whole job search in one list, in four stages: finding jobs, applying, interviewing, and starting work. Every job on the list gets one clear next step, so nothing is forgotten and no follow-up is missed.',
    inputsAccepted: [
      'Employer names, job titles, and locations',
      'The pay you are hoping for (for example, $18–$35+ an hour)',
      'Notes on who you talked to — hiring managers and recruiters',
      'Notes on each employer\'s fair-chance policy and what they said about background checks',
    ],
    outputsProduced: [
      'Stage 1 — Finding jobs: employers worth targeting, and checking their fair-chance policies.',
      'Stage 2 — Applying: what you sent, and when you sent it.',
      'Stage 3 — Interviewing: prep notes, how to talk about your background, and callback dates.',
      'Stage 4 — Starting work: first-day paperwork, direct deposit setup, and goals for your first 30, 60, and 90 days.',
    ],
    georgiaCorridorAdvantage:
      'Pre-loaded with Georgia fair-chance employers, Georgia DDS state ID steps, and union apprenticeship start dates.',
  },
  decision_tree: {
    modeNumber: 'MODE 4',
    title: 'Interactive Reentry Decision Tree',
    tagline: 'Answers one question at a time and walks you through your first days home, through Day 90 and Month 6.',
    detailedMission:
      'Mode 4 walks you through coming home one question at a time — Day 1–3, Day 3–10, Day 10–30, Day 90, and Month 6 — covering state ID, vital records, rides, housing, banking, and any supervision requirements, without dumping everything on you at once.',
    inputsAccepted: [
      'One tap per question — pick the option that fits',
      'Which stage you are in: Day 1–3, Day 3–10, Day 10–30, Day 90, or Month 6',
      'Where you stand right now on ID, housing, and rides',
    ],
    outputsProduced: [
      'A step-by-step plan for each answer you pick.',
      'Direct referrals to Georgia help: DDS offices for ID, MARTA for rides, second-chance banks and credit unions.',
      'A record of your answers you can export — useful for supervision check-ins.',
      'A link back to the Mode 1 Translator once your ID and records are in hand.',
    ],
    georgiaCorridorAdvantage:
      'Built on Georgia rules and offices: Georgia DDS processes for state ID and licenses, MARTA reduced-fare programs, and HOPE Career Grant trade programs.',
  },
};

interface ModeDescriptionBannerProps {
  // Callers pass canonical AppMode values, which are the MODE_DESCRIPTIONS keys:
  // 'translator' (Mode 1), 'resume_builder' (Mode 2), 'tracker' (Mode 3),
  // 'decision_tree' (Mode 4). Fixed 2026-11-12: ResumeBuilderView and
  // DecisionTreeEngine previously passed 'resume' / 'tree', which have no
  // description entry, so their banners rendered nothing.
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C99A44]/15 text-[#C99A44] border border-[#C99A44]/30 whitespace-nowrap shrink-0">
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
            <span>{isExpanded ? 'Hide details' : 'See what this tool does'}</span>
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
              <span>What this tool does</span>
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
                <span>What you give it:</span>
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
                <span>What you get:</span>
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
                Georgia help built in:
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
