export type AppMode = 
  | 'unified' 
  | 'translator'       // Mode 1: Capability Translator & Benchmarking
  | 'resume_builder'   // Mode 2: Complete Resume & Cover Letter Builder
  | 'tracker'          // Mode 3: Research & Application Progress Tracker
  | 'decision_tree'    // Mode 4: Interactive Reentry Decision Tree
  | 'advisor'          // Standalone Reentry AI Advisor
  | 'georgia_vault';   // Georgia Resource Vault

export type ReentryPhase = 'Day 1-3' | 'Day 3-10' | 'Day 10-30';

// Multi-Session Management (Change 6)
export interface SavedSession {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
}

// Standalone General AI Advisor (Change 7)
export interface AdvisorChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

// MODE 1: Capability Translator
export interface TranslationCompetencies {
  hardSkills: string[];
  softSkills: string[];
}

export interface TranslationResult {
  commercialTitle: string;
  competencies: TranslationCompetencies;
  resumeBullets: string[];
  gaPathway?: string;
  gaPathways?: string[]; // 2-3 verified Fair-Chance / Second-Chance employers, hospital networks, or union apprenticeship locals
  rawExperience?: string;
  timestamp?: string;
}

// MODE 2: Complete Resume & Cover Letter Builder
export interface CandidateContactInfo {
  fullName: string;
  cityStateZip: string; // e.g. "Atlanta, GA 30303"
  phone: string;
  email: string;
  linkedinOrPortfolio?: string;
}

export interface ResumeRole {
  roleTitle: string;
  organization: string; // e.g. "Commercial Facilities Logistics Hub"
  location: string;     // e.g. "Atlanta, GA"
  dateRange: string;    // e.g. "2021 – 2024"
  bullets: string[];
}

export interface FullResumeData {
  targetTitle: string;
  summary: string;
  competenciesGrid: string[][]; // 2x3 grid (6 competencies)
  professionalExperience: ResumeRole[];
  certificationsAndTraining: string[];
  educationAndHopeGrants: string[];
}

export interface FullCoverLetterData {
  hiringManagerOrDepartment: string;
  targetCompanyOrHospital: string;
  targetRoleTitle: string;
  companyAddressOrCorridor: string;
  openingParagraph: string;
  bodyParagraph: string;
  closingParagraph: string;
  signOff: string;
}

export interface FullApplicationPackage {
  id: string;
  targetJobTitle: string;
  industryOrSector: 'Logistics & Supply Chain' | 'Healthcare & Hospital Systems' | 'Commercial Trades & Electrical' | 'Culinary & Facilities' | 'General Operations';
  candidate: CandidateContactInfo;
  resume: FullResumeData;
  coverLetter: FullCoverLetterData;
  createdAt: string;
}

// MODE 3: Research & Application Progress Tracker
export type TrackerStage = 
  | 'STAGE 1: RESEARCH & TARGETING'
  | 'STAGE 2: APPLICATION & OUTREACH'
  | 'STAGE 3: INTERVIEW & ADVOCACY'
  | 'STAGE 4: ONBOARDING & MILESTONES';

export interface TrackerItem {
  id: string;
  company: string;
  role: string;
  stage: TrackerStage;
  corridor: 'Atlanta Metro' | 'Macon / Central GA' | 'Savannah / Coastal' | 'Statewide GA';
  dateAdded: string;
  dateUpdated: string;
  notes: string;
  contactPerson?: string;
  nextImmediateAction: string;
  fairChancePolicyNotes?: string;
  wageTarget?: string;
  priority: 'high' | 'medium' | 'standard';
  status: 'active' | 'offer_received' | 'archived';
}

// MODE 4: Interactive Decision Tree
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
  domain: 'IDs & Vital Records' | 'Transit & Mobility' | 'Transitional Housing' | 'Banking & Financial Setup' | 'GA Trade Pathways' | 'Community Supervision & Compliance';
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

// Georgia Resource Vault
export interface GeorgiaResourceItem {
  name: string;
  category: 'Vital Records & DDS' | 'Transit & Mobility' | 'Housing & Support' | 'Second Chance Banking' | 'Apprenticeships & Trades' | 'Fair-Chance Employers & Hospitals';
  corridor: 'Atlanta Metro' | 'Macon / Central GA' | 'Statewide GA';
  address?: string;
  contact?: string;
  notes: string;
  badge?: string;
  directUrl?: string;
}

// Global Sync & Share
export interface AppExportData {
  version: string;
  exportedAt: string;
  lastTranslation: TranslationResult | null;
  applicationPackages: FullApplicationPackage[];
  trackerItems: TrackerItem[];
  decisionHistory: DecisionHistoryEntry[];
}

