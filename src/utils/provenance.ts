import {
  FullApplicationPackage,
  LineProvenance,
  ResumeLine,
  ResumeRole,
} from '../types';

/**
 * Provenance helpers for the resume-fabrication fix.
 *
 * Centralizes: blank placeholders, normalization of packages saved under the
 * old shape (bullets: string[], no provenance fields), review-flag extraction,
 * and immutable updaters used by the review checkpoint in ResumeBuilderView.
 */

export const AI_DRAFT_TAG = 'AI draft';
export const MISSING_PLACEHOLDER_ORG = '[Add employer name]';
export const MISSING_PLACEHOLDER_DATES = '[Add dates]';
export const MISSING_PLACEHOLDER_PHONE = '[Add phone]';
export const MISSING_PLACEHOLDER_EMAIL = '[Add email]';

export function makeLine(text: string, provenance: LineProvenance): ResumeLine {
  return { text, provenance };
}

/** True when a line was not supplied/confirmed by the user. */
export function needsReview(line: ResumeLine): boolean {
  return line.provenance !== 'user_provided';
}

/** Normalize a value from an old-shape package (string bullets, missing provenance). */
export function normalizeLine(raw: unknown): ResumeLine {
  if (typeof raw === 'string') {
    // Old shape: strings were generated content, never user-typed facts.
    return { text: raw, provenance: 'ai_inferred' };
  }
  if (raw && typeof raw === 'object') {
    const r = raw as { text?: unknown; provenance?: unknown };
    const provenance: LineProvenance =
      r.provenance === 'user_provided' || r.provenance === 'missing'
        ? r.provenance
        : 'ai_inferred';
    return {
      text: typeof r.text === 'string' ? r.text : '',
      provenance,
    };
  }
  return { text: '', provenance: 'missing' };
}

function prov(raw: unknown): LineProvenance {
  return raw === 'user_provided' || raw === 'missing' ? raw : 'ai_inferred';
}

export function normalizeRole(raw: any): ResumeRole {
  const r = raw && typeof raw === 'object' ? raw : {};
  return {
    roleTitle: typeof r.roleTitle === 'string' ? r.roleTitle : '',
    roleTitleProvenance: prov(r.roleTitleProvenance),
    organization: typeof r.organization === 'string' ? r.organization : '',
    organizationProvenance: r.organization ? prov(r.organizationProvenance) : 'missing',
    location: typeof r.location === 'string' ? r.location : '',
    locationProvenance: r.location ? prov(r.locationProvenance) : 'missing',
    dateRange: typeof r.dateRange === 'string' ? r.dateRange : '',
    dateRangeProvenance: r.dateRange ? prov(r.dateRangeProvenance) : 'missing',
    bullets: Array.isArray(r.bullets) ? r.bullets.map(normalizeLine) : [],
  };
}

/** Upgrade a package saved under the old (pre-provenance) shape. Safe to run on new packages too. */
export function normalizePackage(raw: any): FullApplicationPackage {
  const p = raw && typeof raw === 'object' ? raw : {};
  const c = p.candidate && typeof p.candidate === 'object' ? p.candidate : {};
  const r = p.resume && typeof p.resume === 'object' ? p.resume : {};
  const cl = p.coverLetter && typeof p.coverLetter === 'object' ? p.coverLetter : {};
  return {
    id: typeof p.id === 'string' ? p.id : `pkg-${Date.now()}`,
    targetJobTitle: typeof p.targetJobTitle === 'string' ? p.targetJobTitle : '',
    industryOrSector: p.industryOrSector || 'General Operations',
    candidate: {
      fullName: typeof c.fullName === 'string' ? c.fullName : '',
      cityStateZip: typeof c.cityStateZip === 'string' ? c.cityStateZip : '',
      phone: typeof c.phone === 'string' ? c.phone : '',
      email: typeof c.email === 'string' ? c.email : '',
      phoneProvenance: c.phone ? prov(c.phoneProvenance) : 'missing',
      emailProvenance: c.email ? prov(c.emailProvenance) : 'missing',
      linkedinOrPortfolio: typeof c.linkedinOrPortfolio === 'string' ? c.linkedinOrPortfolio : undefined,
    },
    resume: {
      targetTitle: typeof r.targetTitle === 'string' ? r.targetTitle : '',
      summary: typeof r.summary === 'string' ? r.summary : '',
      competenciesGrid: Array.isArray(r.competenciesGrid) ? r.competenciesGrid : [],
      professionalExperience: Array.isArray(r.professionalExperience)
        ? r.professionalExperience.map(normalizeRole)
        : [],
      certificationsAndTraining: Array.isArray(r.certificationsAndTraining)
        ? r.certificationsAndTraining.map(normalizeLine)
        : [],
      educationAndHopeGrants: Array.isArray(r.educationAndHopeGrants)
        ? r.educationAndHopeGrants.map(normalizeLine)
        : [],
    },
    coverLetter: {
      hiringManagerOrDepartment: typeof cl.hiringManagerOrDepartment === 'string' ? cl.hiringManagerOrDepartment : '',
      targetCompanyOrHospital: typeof cl.targetCompanyOrHospital === 'string' ? cl.targetCompanyOrHospital : '',
      targetRoleTitle: typeof cl.targetRoleTitle === 'string' ? cl.targetRoleTitle : '',
      companyAddressOrCorridor: typeof cl.companyAddressOrCorridor === 'string' ? cl.companyAddressOrCorridor : '',
      openingParagraph: typeof cl.openingParagraph === 'string' ? cl.openingParagraph : '',
      bodyParagraph: typeof cl.bodyParagraph === 'string' ? cl.bodyParagraph : '',
      closingParagraph: typeof cl.closingParagraph === 'string' ? cl.closingParagraph : '',
      signOff: typeof cl.signOff === 'string' ? cl.signOff : '',
    },
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Review flags — everything the checkpoint must surface before export.
// ---------------------------------------------------------------------------

export interface ReviewFlag {
  id: string;
  /** 'missing' = blank field the user should fill; 'inferred' = AI draft to confirm/edit/remove */
  kind: 'missing' | 'inferred';
  section: string;
  label: string;
  roleIndex?: number;
  lineIndex?: number;
  field?: 'organization' | 'dateRange' | 'phone' | 'email';
  lineSection?: 'bullets' | 'certifications' | 'education';
  currentText: string;
}

/** Every blank or AI-drafted item in the package, in review order. */
export function getReviewFlags(pkg: FullApplicationPackage): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  if (!pkg.candidate.phone.trim()) {
    flags.push({ id: 'phone', kind: 'missing', section: 'Contact', label: 'Phone number', field: 'phone', currentText: '' });
  }
  if (!pkg.candidate.email.trim()) {
    flags.push({ id: 'email', kind: 'missing', section: 'Contact', label: 'Email address', field: 'email', currentText: '' });
  }

  pkg.resume.professionalExperience.forEach((role, roleIndex) => {
    const roleLabel = role.roleTitle || `Role ${roleIndex + 1}`;
    if (!role.organization.trim()) {
      flags.push({
        id: `role-${roleIndex}-org`, kind: 'missing', section: 'Experience',
        label: `Employer name — ${roleLabel}`, field: 'organization', roleIndex, currentText: '',
      });
    }
    if (!role.dateRange.trim()) {
      flags.push({
        id: `role-${roleIndex}-dates`, kind: 'missing', section: 'Experience',
        label: `Dates worked — ${roleLabel}`, field: 'dateRange', roleIndex, currentText: '',
      });
    }
    role.bullets.forEach((b, lineIndex) => {
      if (needsReview(b)) {
        flags.push({
          id: `bullet-${roleIndex}-${lineIndex}`, kind: 'inferred', section: 'Experience',
          label: `Bullet ${lineIndex + 1} — ${roleLabel}`, roleIndex, lineIndex,
          lineSection: 'bullets', currentText: b.text,
        });
      }
    });
  });

  pkg.resume.certificationsAndTraining.forEach((c, lineIndex) => {
    if (needsReview(c)) {
      flags.push({
        id: `cert-${lineIndex}`, kind: 'inferred', section: 'Certifications',
        label: `Certification ${lineIndex + 1}`, lineIndex, lineSection: 'certifications', currentText: c.text,
      });
    }
  });

  pkg.resume.educationAndHopeGrants.forEach((e, lineIndex) => {
    if (needsReview(e)) {
      flags.push({
        id: `edu-${lineIndex}`, kind: 'inferred', section: 'Education',
        label: `Education entry ${lineIndex + 1}`, lineIndex, lineSection: 'education', currentText: e.text,
      });
    }
  });

  return flags;
}

export function countUnresolved(pkg: FullApplicationPackage): number {
  return getReviewFlags(pkg).length;
}

// ---------------------------------------------------------------------------
// Immutable updaters (each returns a new package; filling a blank or editing
// a line marks it user_provided).
// ---------------------------------------------------------------------------

function clone(pkg: FullApplicationPackage): FullApplicationPackage {
  return JSON.parse(JSON.stringify(pkg));
}

export function setRoleField(
  pkg: FullApplicationPackage,
  roleIndex: number,
  field: 'organization' | 'dateRange',
  value: string
): FullApplicationPackage {
  const next = clone(pkg);
  const role = next.resume.professionalExperience[roleIndex];
  if (!role) return next;
  const v = value.trim();
  role[field] = v;
  role[field === 'organization' ? 'organizationProvenance' : 'dateRangeProvenance'] =
    v ? 'user_provided' : 'missing';
  return next;
}

export function setContactField(
  pkg: FullApplicationPackage,
  field: 'phone' | 'email',
  value: string
): FullApplicationPackage {
  const next = clone(pkg);
  const v = value.trim();
  next.candidate[field] = v;
  next.candidate[field === 'phone' ? 'phoneProvenance' : 'emailProvenance'] =
    v ? 'user_provided' : 'missing';
  return next;
}

export function setCoverField(
  pkg: FullApplicationPackage,
  field: 'targetCompanyOrHospital' | 'hiringManagerOrDepartment',
  value: string
): FullApplicationPackage {
  const next = clone(pkg);
  next.coverLetter[field] = value.trim();
  return next;
}

type LineSection = 'bullets' | 'certifications' | 'education';

function getLineList(pkg: FullApplicationPackage, section: LineSection, roleIndex: number): ResumeLine[] {
  if (section === 'bullets') return pkg.resume.professionalExperience[roleIndex]?.bullets ?? [];
  if (section === 'certifications') return pkg.resume.certificationsAndTraining;
  return pkg.resume.educationAndHopeGrants;
}

export function updateLineText(
  pkg: FullApplicationPackage,
  section: LineSection,
  roleIndex: number,
  lineIndex: number,
  value: string
): FullApplicationPackage {
  const next = clone(pkg);
  const list = getLineList(next, section, roleIndex);
  const line = list[lineIndex];
  if (!line) return next;
  line.text = value;
  if (value.trim()) line.provenance = 'user_provided';
  return next;
}

export function confirmLine(
  pkg: FullApplicationPackage,
  section: LineSection,
  roleIndex: number,
  lineIndex: number
): FullApplicationPackage {
  const next = clone(pkg);
  const line = getLineList(next, section, roleIndex)[lineIndex];
  if (line && line.text.trim()) line.provenance = 'user_provided';
  return next;
}

export function removeLine(
  pkg: FullApplicationPackage,
  section: LineSection,
  roleIndex: number,
  lineIndex: number
): FullApplicationPackage {
  const next = clone(pkg);
  if (section === 'bullets') {
    const role = next.resume.professionalExperience[roleIndex];
    if (role) role.bullets = role.bullets.filter((_, i) => i !== lineIndex);
  } else if (section === 'certifications') {
    next.resume.certificationsAndTraining = next.resume.certificationsAndTraining.filter((_, i) => i !== lineIndex);
  } else {
    next.resume.educationAndHopeGrants = next.resume.educationAndHopeGrants.filter((_, i) => i !== lineIndex);
  }
  return next;
}

export function addLine(
  pkg: FullApplicationPackage,
  section: 'certifications' | 'education',
  text: string
): FullApplicationPackage {
  const next = clone(pkg);
  const line = makeLine(text.trim(), 'user_provided');
  if (!line.text) return next;
  if (section === 'certifications') next.resume.certificationsAndTraining.push(line);
  else next.resume.educationAndHopeGrants.push(line);
  return next;
}

/** Export-safe display text for a possibly-blank field. */
export function displayOrPlaceholder(value: string, placeholder: string): string {
  return value.trim() ? value : placeholder;
}
