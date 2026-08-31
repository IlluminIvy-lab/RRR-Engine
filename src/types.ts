export type AppMode = 'unified' | 'translator' | 'decision_tree' | 'georgia_vault';

export type ReentryPhase = 'Day 1-3' | 'Day 3-10' | 'Day 10-30';

export interface TranslationCompetencies {
  hardSkills: string[];
  softSkills: string[];
}

export interface TranslationResult {
  commercialTitle: string;
  competencies: TranslationCompetencies;
  resumeBullets: string[];
  gaPathway: string;
  rawExperience?: string;
  timestamp?: string;
}

export interface DecisionOption {
  key: 'A' | 'B' | 'C';
  label: string;
  actionGuidance: string;
  gaSpecificResource: string;
  nextNodeId: string | null; // null if terminal/milestone achieved
  targetPhase?: ReentryPhase;
}

export interface DecisionNode {
  id: string;
  phase: ReentryPhase;
  domain: 'IDs & Vital Records' | 'Transit & Mobility' | 'Transitional Housing' | 'Banking & Financial Setup' | 'GA Trade Pathways';
  question: string;
  contextBanner?: string;
  options: [DecisionOption, DecisionOption, DecisionOption];
}

export interface DecisionHistoryEntry {
  id: string;
  stepNumber: number;
  nodeId: string;
  phase: ReentryPhase;
  domain: string;
  question: string;
  selectedKey: 'A' | 'B' | 'C';
  selectedOptionLabel: string;
  actionGuidance: string;
  gaSpecificResource: string;
  timestamp: string;
}

export interface GeorgiaResourceItem {
  name: string;
  category: 'Vital Records & DDS' | 'Transit & Mobility' | 'Housing & Support' | 'Second Chance Banking' | 'Apprenticeships & Trades';
  corridor: 'Atlanta Metro' | 'Macon / Central GA' | 'Statewide GA';
  address?: string;
  contact?: string;
  notes: string;
  badge?: string;
}
