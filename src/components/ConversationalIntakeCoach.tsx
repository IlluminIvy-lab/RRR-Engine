import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Lightbulb, 
  RefreshCw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';

interface ConversationalIntakeCoachProps {
  onComplete: (compiledText: string) => void;
  isLoading: boolean;
}

const COACH_STEPS = [
  {
    step: 1,
    title: 'Trade, Role & Assignment',
    coachQuestion: "Let's start with your title: What was your specific trade, work crew, shop, or institutional role called?",
    placeholder: 'e.g. Facilities Maintenance Lead, Commercial Kitchen Line Cook, Warehouse Forklift Operator...',
    samplePills: [
      'Facilities Maintenance Lead',
      'Commercial Kitchen Cook & Prep',
      'Warehouse Forklift & Order Picker',
      'Auto Shop & Small Engine Mechanic',
      'HVAC & Commercial Plumbing Crew',
      'Administrative Records & Logistics Clerk',
    ],
  },
  {
    step: 2,
    title: 'Daily Hands-On Work & Equipment',
    coachQuestion: "What physical work did you do day-to-day, and what tools, equipment, or machinery did you operate?",
    placeholder: 'e.g. Operated commercial boilers, replaced HVAC filters, handled pallet jacks, prepped large batch meals...',
    samplePills: [
      'Operated pallet jacks, forklifts, and staging docks',
      'Maintained boilers, HVAC filters, and plumbing manifolds',
      'Prepped high-volume meals and managed sanitary cooking lines',
      'Conducted mechanical troubleshooting and pneumatic tool repairs',
      'Managed chemical dilution protocols and floor scrubbers',
      'Logged shipping manifests and cross-checked bill of ladings',
    ],
  },
  {
    step: 3,
    title: 'Operational Scale & Numbers',
    coachQuestion: "Let's quantify your impact. What numbers show scale (people supervised, meals served, pallets moved, square footage)?",
    placeholder: 'e.g. Supervised 8-person crew, managed 1,200 meals per day, maintained 60,000 sq ft facility...',
    samplePills: [
      'Supervised 6–10 person work crew daily',
      'Processed 1,200+ meals per shift on tight schedules',
      'Maintained 50,000+ sq ft institutional facility',
      'Staged and loaded 400+ pallets per week',
      'Completed 25+ work orders weekly with zero rework',
      'Maintained 100% zero-defect safety log over 3 years',
    ],
  },
  {
    step: 4,
    title: 'Safety Standards & Certifications',
    coachQuestion: "What safety protocols (OSHA, Lock-out/Tag-out, ServSafe, HACCP) or logging systems did you use?",
    placeholder: 'e.g. Followed strict Lock-out/Tag-out protocols, ServSafe certified, logged OSHA inspection sheets...',
    samplePills: [
      'OSHA 10 / General Industry safety standards',
      'ServSafe Food Protection & HACCP compliance',
      'Lock-out / Tag-out (LOTO) electrical safety protocols',
      'EPA Section 608 Universal refrigerant handling',
      'Forklift / Powered Industrial Truck (PIT) safety logs',
      'Daily preventative maintenance checklists',
    ],
  },
];

export const ConversationalIntakeCoach: React.FC<ConversationalIntakeCoachProps> = ({
  onComplete,
  isLoading,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);

  const currentStep = COACH_STEPS[currentStepIndex];
  const currentAnswer = answers[currentStepIndex];

  // Voice dictation
  const {
    isListening,
    isSupported: isSpeechSupported,
    toggleListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscriptChange: (chunk) => {
      setAnswers((prev) => {
        const next = [...prev];
        const existing = next[currentStepIndex];
        next[currentStepIndex] = existing ? `${existing.trimEnd()} ${chunk}` : chunk;
        return next;
      });
    },
  });

  const handleTextChange = (text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentStepIndex] = text;
      return next;
    });
  };

  const handleSelectPill = (pillText: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      const existing = next[currentStepIndex];
      next[currentStepIndex] = existing ? `${existing.trimEnd()}, ${pillText}` : pillText;
      return next;
    });
  };

  const compileFullStatement = (): string => {
    const parts: string[] = [];
    if (answers[0]?.trim()) {
      parts.push(`Worked as ${answers[0].trim().replace(/\.+$/, '')}.`);
    }
    if (answers[1]?.trim()) {
      parts.push(`Daily tasks and equipment: ${answers[1].trim().replace(/\.+$/, '')}.`);
    }
    if (answers[2]?.trim()) {
      parts.push(`Operational scale: ${answers[2].trim().replace(/\.+$/, '')}.`);
    }
    if (answers[3]?.trim()) {
      parts.push(`Safety protocols and systems: ${answers[3].trim().replace(/\.+$/, '')}.`);
    }
    return parts.join(' ');
  };

  const compiledText = compileFullStatement();
  const hasAnyAnswer = answers.some((a) => a.trim().length > 0);

  const handleNextOrSubmit = () => {
    if (isListening) stopListening();

    if (currentStepIndex < COACH_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final submission
      if (compiledText.trim()) {
        onComplete(compiledText);
      }
    }
  };

  const handlePrev = () => {
    if (isListening) stopListening();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-[#0B0F0E] border border-[#2B2B2B] rounded-xl p-5 sm:p-6 space-y-5 shadow-lg animate-in fade-in duration-200">
      {/* Header & Step Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2B2B2B]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C99A44] font-semibold uppercase tracking-wider">
            <Bot className="w-4 h-4 text-[#C99A44]" />
            <span>Interactive Conversational Coach</span>
          </div>
          <p className="text-xs text-[#F4EDE1]/70">
            Step-by-step guidance to draw out high-value commercial details and metrics.
          </p>
        </div>

        {/* 4-Step Progress Dots */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {COACH_STEPS.map((s, idx) => {
            const isCompleted = answers[idx]?.trim().length > 0;
            const isCurrent = currentStepIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  isCurrent
                    ? 'bg-[#C99A44] text-[#0B0F0E] font-bold shadow-sm ring-1 ring-[#C99A44]'
                    : isCompleted
                    ? 'bg-[#2F4A3E] text-emerald-300 border border-emerald-500/40'
                    : 'bg-black/50 text-[#F4EDE1]/40 border border-[#2B2B2B]'
                }`}
              >
                <span>Step {s.step}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversational Dialogue Area */}
      <div className="space-y-4">
        {/* Coach Bubble */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-black/80 to-[#1C2621]/50 border border-[#2B2B2B]">
          <div className="w-8 h-8 rounded-lg bg-[#C99A44]/15 border border-[#C99A44]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4 text-[#C99A44]" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="text-[11px] font-mono text-[#C99A44] font-semibold">
              COACH PROMPT • {currentStep.title.toUpperCase()}
            </div>
            <p className="text-sm sm:text-base font-medium text-[#F4EDE1] leading-relaxed">
              {currentStep.coachQuestion}
            </p>
          </div>
        </div>

        {/* Input Textarea with Dictation */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              id={`coach-step-input-${currentStepIndex}`}
              rows={3}
              value={currentAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={currentStep.placeholder}
              className="w-full bg-black/80 border border-[#2B2B2B] focus:border-[#C99A44] rounded-xl p-3.5 text-sm text-[#F4EDE1] placeholder-[#F4EDE1]/35 focus:outline-none focus:ring-1 focus:ring-[#C99A44] transition-all leading-relaxed"
            />

            {/* Voice Dictation Button in Input Corner */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                    : 'bg-stone-800 text-[#C99A44] hover:bg-[#C99A44] hover:text-[#0B0F0E] border border-[#2B2B2B]'
                }`}
                title={isListening ? 'Stop voice recording' : 'Voice-to-Text: Speak your answer'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Voice status */}
          {isListening && (
            <div className="text-xs font-mono text-amber-300 flex items-center gap-2 px-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Listening to your voice for Step {currentStep.step}... Speak freely.</span>
            </div>
          )}
        </div>

        {/* Suggested Quick-Reply Pills */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[#F4EDE1]/50 flex items-center gap-1.5 px-1">
            <Lightbulb className="w-3 h-3 text-[#C99A44]" />
            <span>Click any example to insert into your answer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentStep.samplePills.map((pill, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSelectPill(pill)}
                className="px-2.5 py-1 rounded-lg text-xs bg-black/50 hover:bg-[#2F4A3E] text-[#F4EDE1]/80 hover:text-[#F4EDE1] border border-[#2B2B2B] hover:border-[#C99A44]/50 transition-colors text-left"
              >
                + {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Live Compiled Preview (Fuses all steps) */}
        {hasAnyAnswer && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-[#2B2B2B] space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#C99A44] font-bold flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[#C99A44]" />
              <span>Live Compiled Capability Profile:</span>
            </div>
            <p className="text-xs text-[#F4EDE1]/90 italic leading-relaxed font-sans">
              "{compiledText}"
            </p>
          </div>
        )}

        {/* Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div>
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#F4EDE1]/80 bg-stone-800 hover:bg-stone-700 transition-colors border border-[#2B2B2B]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <span className="text-xs text-[#F4EDE1]/40 font-mono">
                Step 1 of 4: Role Setup
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex < COACH_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNextOrSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs shadow-md transition-all"
              >
                <span>Continue to Step {currentStepIndex + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextOrSubmit}
                disabled={!compiledText.trim() || isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs sm:text-sm shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B0F0E]" />
                    <span>Translating Capabilities...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0B0F0E]" />
                    <span>Translate Complete Profile Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
