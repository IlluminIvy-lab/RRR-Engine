import { TranslationResult } from '../types';

export interface PrintCapabilityOptions {
  candidateName?: string;
  location?: string;
  phone?: string;
  email?: string;
}

/**
 * Helper function that triggers the browser's native print dialog specifically
 * styled for the Capability Translator output, ensuring a clean, black-and-white
 * professional layout without any app chrome.
 */
export function printCapabilityTranslator(
  result: TranslationResult,
  options: PrintCapabilityOptions = {}
): void {
  if (!result) return;

  const candidateName = options.candidateName?.trim() || 'Professional Candidate';
  const rawTitle = result.commercialTitle.trim();
  const originalTitle = document.title;

  // Set browser title temporarily so default "Save to PDF" filename is clean and professional
  const safeFilename = `RRR_Capability_Dossier_${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}_${rawTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;
  document.title = safeFilename;

  // Add print indicator class to root for any specialized print styling
  document.body.classList.add('printing-capability-dossier');

  // Trigger browser's native print dialog
  window.print();

  // Reset title and print state after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
    document.body.classList.remove('printing-capability-dossier');
  }, 1000);
}
