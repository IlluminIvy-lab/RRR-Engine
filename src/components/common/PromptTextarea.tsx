import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Send, Sparkles, X, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../../utils/useSpeechRecognition';

interface PromptTextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  minRows?: number; // Default 2 lines
  maxRows?: number; // Default 4 lines (capped with vertical scroll)
  showSubmitButton?: boolean;
  submitButtonText?: string;
  className?: string;
  onClear?: () => void;
}

/**
 * PromptTextarea
 * CHANGE 1 Implementation:
 * - Default rendered height: 2 visible lines on load (not 1 line, not an oversized box).
 * - Guaranteed text wrap with zero horizontal scrolling (whitespace-pre-wrap break-words overflow-x-hidden).
 * - Dynamically grows as user types up to 3-4 visible lines before capping and enabling internal vertical scroll.
 * - REVIEW FLAG (Ivy): Max-height is capped at 112px (approx 4 visible lines at 24px line-height + padding).
 *
 * CHANGE 4 Implementation:
 * - Built-in native Web Speech API microphone dictation toggle.
 * - Live transcript injection directly into textarea.
 * - Offline-compatible, zero-external-API, privacy-first local browser dictation.
 */
export const PromptTextarea: React.FC<PromptTextareaProps> = ({
  id = 'prompt-input-textarea',
  value,
  onChange,
  onSubmit,
  placeholder = 'Type or speak your input...',
  disabled = false,
  isLoading = false,
  minRows = 2,
  maxRows = 4,
  showSubmitButton = true,
  submitButtonText = 'Run',
  className = '',
  onClear,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const baseValueRef = useRef(value);

  // Auto-resize logic on value change
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scrollHeight accurately
    textarea.style.height = 'auto';

    // Min height for 2 lines (~52px)
    // Max height for 4 lines (~112px / 7rem) - REVIEW NOTE FOR IVY:
    // 2 lines = ~52px, 3 lines = ~76px, 4 lines = ~104-112px
    const minHeight = 52;
    const maxHeight = 112; // Capped at ~4 lines of text

    const calculatedHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
    textarea.style.height = `${calculatedHeight}px`;
  }, [value]);

  // Voice-to-Text handling (Web Speech API)
  const {
    isListening,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    toggleListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscriptChange: (spokenChunk) => {
      // Append spoken text cleanly
      const base = baseValueRef.current;
      const combined = base ? `${base.trimEnd()} ${spokenChunk}` : spokenChunk;
      onChange(combined);
    },
  });

  const handleMicClick = () => {
    if (!isListening) {
      baseValueRef.current = value;
    }
    toggleListening();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && onSubmit && !isLoading && !disabled) {
        if (isListening) stopListening();
        onSubmit();
      }
    }
  };

  return (
    <div className={`relative flex flex-col gap-1.5 w-full ${className}`}>
      <div
        className={`relative flex items-start gap-2 bg-[#1C1F1E] border rounded-xl p-2 transition-all ${
          isFocused
            ? 'border-[#C99A44] ring-2 ring-[#C99A44]/30 shadow-md'
            : 'border-[#2B2B2B] hover:border-[#F4EDE1]/30'
        } ${isListening ? 'border-amber-500 ring-2 ring-amber-500/40 bg-[#1C1F1E]/95' : ''}`}
      >
        {/* Main Textarea */}
        <textarea
          id={id}
          ref={textareaRef}
          rows={minRows}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            baseValueRef.current = e.target.value;
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          style={{
            minHeight: '52px',
            maxHeight: '112px', // CHANGE 1: capped at 4 lines before internal vertical scroll
            lineHeight: '1.45rem',
          }}
          className="flex-1 bg-transparent text-[#F4EDE1] placeholder-[#F4EDE1]/40 text-sm font-sans resize-none whitespace-pre-wrap break-words overflow-x-hidden overflow-y-auto px-2 py-1.5 focus:outline-none leading-relaxed transition-all"
        />

        {/* Action controls inside the input container */}
        <div className="flex items-center gap-1.5 shrink-0 self-end pb-1 pr-1">
          {/* Clear button if text exists */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                baseValueRef.current = '';
                if (onClear) onClear();
                textareaRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-[#F4EDE1]/40 hover:text-[#F4EDE1] hover:bg-white/5 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Dictation (Change 4) */}
          {isSpeechSupported ? (
            <button
              type="button"
              id={`${id}-voice-dictation-btn`}
              onClick={handleMicClick}
              disabled={disabled || isLoading}
              className={`p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                  : 'text-[#C99A44] hover:bg-[#C99A44]/15 hover:text-[#C99A44] bg-black/40 border border-[#2B2B2B]'
              }`}
              title={isListening ? 'Stop voice recording' : 'Voice-to-Text: Speak your experience (Native Web Speech)'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-[#C99A44]" />
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="p-2 rounded-lg text-[#F4EDE1]/20 bg-black/20 border border-[#2B2B2B] cursor-not-allowed"
              title="Voice-to-Text not supported in this browser"
            >
              <MicOff className="w-4 h-4" />
            </button>
          )}

          {/* Submit Button */}
          {showSubmitButton && onSubmit && (
            <button
              id={`${id}-submit-btn`}
              type="button"
              onClick={() => {
                if (isListening) stopListening();
                onSubmit();
              }}
              disabled={!value.trim() || isLoading || disabled}
              className="px-4 py-2 rounded-lg bg-[#C99A44] hover:bg-[#b88c3a] text-[#0B0F0E] font-bold text-xs shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              <span>{submitButtonText}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Dictation Status Banner */}
      {isListening && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs font-mono animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-semibold">Listening to your voice... (Speak clearly)</span>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-xs underline text-amber-300 hover:text-white"
          >
            Done Speaking
          </button>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="text-[11px] font-mono text-rose-300 bg-rose-950/40 border border-rose-800/40 px-3 py-1 rounded-lg">
          {speechError}
        </div>
      )}
    </div>
  );
};
