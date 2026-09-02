import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: WebSpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: WebSpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: WebSpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: WebSpeechRecognition, ev: Event) => any) | null;
}

export function useSpeechRecognition({
  onTranscriptChange,
  lang = 'en-US',
}: {
  onTranscriptChange?: (text: string) => void;
  lang?: string;
} = {}) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognition() as WebSpeechRecognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            currentTranscript += transcript;
          }

          if (currentTranscript.trim() && onTranscriptChange) {
            onTranscriptChange(currentTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition event error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser.');
          } else if (event.error === 'no-speech') {
            // benign
          } else {
            setErrorMessage(`Speech recognition notice: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition init error:', e);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [lang, onTranscriptChange]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }
    setErrorMessage(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: any) {
      // If already started, ignore or restart
      if (err.name !== 'InvalidStateError') {
        setErrorMessage('Could not start voice recognition. Please try again.');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
  };
}
