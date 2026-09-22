import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Send,
  ArrowRight,
  Award,
  GraduationCap,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { FullApplicationPackage, LineProvenance, ResumeLine, TranslationResult } from '../types';
import { generateFullPackageDocx } from '../utils/generateFullPackageDocx';
import { generateFullPackagePdf } from '../utils/generateFullPackagePdf';
import {
  AI_DRAFT_TAG,
  MISSING_PLACEHOLDER_ORG,
  MISSING_PLACEHOLDER_DATES,
  MISSING_PLACEHOLDER_PHONE,
  MISSING_PLACEHOLDER_EMAIL,
  countUnresolved,
  getReviewFlags,
  needsReview,
  displayOrPlaceholder,
  setRoleField,
  setContactField,
  setCoverField,
  updateLineText,
  confirmLine,
  removeLine,
  addLine,
} from '../utils/provenance';
import { ModeDescriptionBanner } from './common/ModeDescriptionBanner';

interface ResumeBuilderViewProps {
  currentPackage: FullApplicationPackage | null;
  currentTranslation: TranslationResult | null;
  onGeneratePackage: (targetTitle: string, candidateName?: string, location?: string, industry?: string) => Promise<FullApplicationPackage | null>;
  onSavePackage: (pkg: FullApplicationPackage) => void;
  onSendToTracker: (company: string, role: string) => void;
  isLoading: boolean;
}

// One-tap certification adds. Tapping = the user explicitly claims it, so it
// is stored as user_provided. Microcopy below warns to add only earned certs.
const CERT_SUGGESTIONS = [
  'OSHA 10-Hour General Industry Safety',
  'Forklift / Powered Industrial Truck (PIT) Operator Safety',
  'First Aid, CPR & AED Responder',
  'ServSafe Food Handler',
];

const provBadgeClass = (p: LineProvenance) =>
  p === 'missing'
    ? 'bg-red-500/15 text-red-300 border-red-500/40'
    : 'bg-amber-500/15 text-amber-300 border-amber-500/40';

const ProvBadge: React.FC<{ provenance: LineProvenance }> = ({ provenance }) => {
  if (provenance === 'user_provided') return null;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${provBadgeClass(provenance)}`}
    >
      {provenance === 'missing' ? 'Needs your info' : AI_DRAFT_TAG}
    </span>
  );
};

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  currentPackage,
  currentTranslation,
  onGeneratePackage,
  onSavePackage,
  onSendToTracker,
  isLoading,
}) => {
  const [targetTitle, setTargetTitle] = useState(
    currentPackage?.targetJobTitle || currentTranslation?.commercialTitle || 'Commercial Operations Specialist'
  );
  const [candidateName, setCandidateName] = useState(
    currentPackage?.candidate.fullName || 'J. Carter'
  );
  const [location, setLocation] = useState(
    currentPackage?.candidate.cityStateZip.split(' ')[0] || 'Atlanta, GA'
  );
  const [industry, setIndustry] = useState(
    currentPackage?.industryOrSector || 'Logistics & Supply Chain'
  );
  const [activeTab, setActiveTab] = useState<'resume' | 'cover_letter' | 'both'>('both');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [editedPackage, setEditedPackage] = useState<FullApplicationPackage | null>(currentPackage);

  // Review checkpoint state (fabrication fix)
  const [reviewOpen, setReviewOpen] = useState(true);
  const [exportGate, setExportGate] = useState<'pdf' | 'docx' | 'print' | null>(null);
  const [exportAcknowledged, setExportAcknowledged] = useState(false);
  const [newCertText, setNewCertText] = useState('');
  const [newEduText, setNewEduText] = useState('');

  // Sync edited package when currentPackage changes
  useEffect(() => {
    if (currentPackage) {
      setEditedPackage(currentPackage);
      setExportAcknowledged(false);
      setExportGate(null);
    }
  }, [currentPackage]);

  /** Apply a review edit: updates local state, persists, and re-arms the export gate. */
  const applyChange = (next: FullApplicationPackage) => {
    setEditedPackage(next);
    onSavePackage(next);
    setExportAcknowledged(false);
  };

  const unresolvedCount = editedPackage ? countUnresolved(editedPackage) : 0;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle.trim()) return;
    await onGeneratePackage(targetTitle, candidateName, location, industry);
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const doExport = async (kind: 'pdf' | 'docx' | 'print') => {
    if (!editedPackage) return;
    if (kind === 'pdf') generateFullPackagePdf(editedPackage);
    else if (kind === 'docx') await generateFullPackageDocx(editedPackage);
    else window.print();
  };

  /** Export gate: nothing ships silently while review flags are unresolved. */
  const requestExport = (kind: 'pdf' | 'docx' | 'print') => {
    if (!editedPackage) return;
    if (unresolvedCount > 0 && !exportAcknowledged) {
      setExportGate(kind);
      setReviewOpen(true);
      return;
    }
    void doExport(kind);
  };

  const confirmExportAnyway = () => {
    setExportAcknowledged(true);
    const kind = exportGate;
    setExportGate(null);
    if (kind) void doExport(kind);
  };

  const lineTag = (line: ResumeLine) =>
    needsReview(line) ? ` [${line.provenance === 'missing' ? 'ADD INFO' : AI_DRAFT_TAG.toUpperCase()}]` : '';

  const generateResumeMarkdown = (pkg: FullApplicationPackage) => {
    const { candidate, resume } = pkg;
    const phone = displayOrPlaceholder(candidate.phone, MISSING_PLACEHOLDER_PHONE);
    const email = displayOrPlaceholder(candidate.email, MISSING_PLACEHOLDER_EMAIL);
    return `# ${candidate.fullName.toUpperCase()}
**${resume.targetTitle.toUpperCase()}**
${candidate.cityStateZip} | ${phone} | ${email}

---

## PROFESSIONAL SUMMARY
${resume.summary}

## CORE COMPETENCIES
| Technical & Operational | Compliance & Leadership | Specialized Systems |
|---|---|---|
| ${resume.competenciesGrid[0]?.join(' | ') || ''} |
| ${resume.competenciesGrid[1]?.join(' | ') || ''} |

## PROFESSIONAL EXPERIENCE
${resume.professionalExperience
  .map(
    (exp) => `### ${exp.roleTitle} — ${displayOrPlaceholder(exp.organization, MISSING_PLACEHOLDER_ORG)} (${exp.location})
*${displayOrPlaceholder(exp.dateRange, MISSING_PLACEHOLDER_DATES)}*
${exp.bullets.map((b) => `- ${b.text}${lineTag(b)}`).join('\n')}`
  )
  .join('\n\n')}

## CERTIFICATIONS & SAFETY TRAINING
${resume.certificationsAndTraining.map((c) => `- ${c.text}${lineTag(c)}`).join('\n') || '_None listed — add certifications you hold._'}

## EDUCATION & GEORGIA CAREER PATHWAYS
${resume.educationAndHopeGrants.map((e) => `- ${e.text}${lineTag(e)}`).join('\n') || '_None listed._'}
`;
  };

  const generateCoverLetterMarkdown = (pkg: FullApplicationPackage) => {
    const { candidate, coverLetter } = pkg;
    const phone = displayOrPlaceholder(candidate.phone, MISSING_PLACEHOLDER_PHONE);
    const email = displayOrPlaceholder(candidate.email, MISSING_PLACEHOLDER_EMAIL);
    return `# ${candidate.fullName.toUpperCase()}
${candidate.cityStateZip} | ${phone} | ${email}

${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

**${coverLetter.hiringManagerOrDepartment}**
${coverLetter.targetCompanyOrHospital || MISSING_PLACEHOLDER_ORG}
${coverLetter.companyAddressOrCorridor}

Dear ${coverLetter.hiringManagerOrDepartment},

${coverLetter.openingParagraph}

${coverLetter.bodyParagraph}

${coverLetter.closingParagraph}

${coverLetter.signOff}
${candidate.fullName}
`;
  };

  const renderLineEditor = (
    section: 'bullets' | 'certifications' | 'education',
    roleIndex: number,
    lineIndex: number,
    line: ResumeLine
  ) => (
    <div key={`${section}-${roleIndex}-${lineIndex}`} className="rounded-lg border border-stone-700 bg-stone-950 p-2.5 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <ProvBadge provenance={line.provenance} />
        <div className="flex items-center gap-1.5">
          {needsReview(line) && line.text.trim() && (
            <button
              onClick={() => editedPackage && applyChange(confirmLine(editedPackage, section, roleIndex, lineIndex))}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold"
              title="This line is accurate — mark as verified"
            >
              <CheckCircle2 className="w-3 h-3" />
              Confirm
            </button>
          )}
          <button
            onClick={() => editedPackage && applyChange(removeLine(editedPackage, section, roleIndex, lineIndex))}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600/15 hover:bg-red-600/25 text-red-300 border border-red-500/40 text-[10px] font-bold"
            title="Remove this line"
          >
            <XCircle className="w-3 h-3" />
            Remove
          </button>
        </div>
      </div>
      <textarea
        value={line.text}
        rows={2}
        onChange={(e) => editedPackage && applyChange(updateLineText(editedPackage, section, roleIndex, lineIndex, e.target.value))}
        className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1.5 text-[11px] text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      {needsReview(line) && (
        <p className="text-[10px] text-stone-500">Editing or confirming marks this as verified by you.</p>
      )}
    </div>
  );

  const renderReviewCheckpoint = () => {
    if (!editedPackage) return null;
    const pkg = editedPackage;
    const flags = getReviewFlags(pkg);

    return (
      <div className="rounded-xl border border-amber-500/50 bg-amber-500/[0.06] overflow-hidden">
        <button
          onClick={() => setReviewOpen(!reviewOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">Review checkpoint — verify before export</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${flags.length === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {flags.length === 0 ? 'All clear' : `${flags.length} to review`}
            </span>
          </span>
          <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform ${reviewOpen ? 'rotate-180' : ''}`} />
        </button>

        {reviewOpen && (
          <div className="px-4 pb-4 space-y-4 border-t border-amber-500/25 pt-3">
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Nothing on this resume ships silently. <strong className="text-red-300">Red blanks</strong> need information only you have.
              {' '}<strong className="text-amber-300">Amber drafts</strong> were written by AI — confirm, edit, or remove each one.
              Anything still flagged is labeled in the exported file.
            </p>

            {/* Contact blanks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-stone-300 mb-1">
                  Phone <ProvBadge provenance={pkg.candidate.phoneProvenance} />
                </label>
                <input
                  type="tel"
                  value={pkg.candidate.phone}
                  placeholder="(555) 123-4567"
                  onChange={(e) => applyChange(setContactField(pkg, 'phone', e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-stone-300 mb-1">
                  Email <ProvBadge provenance={pkg.candidate.emailProvenance} />
                </label>
                <input
                  type="email"
                  value={pkg.candidate.email}
                  placeholder="you@example.com"
                  onChange={(e) => applyChange(setContactField(pkg, 'email', e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Target company (cover letter) */}
            <div>
              <label className="block text-[11px] font-bold text-stone-300 mb-1">Target company <span className="font-normal text-stone-500">(cover letter)</span></label>
              <input
                type="text"
                value={pkg.coverLetter.targetCompanyOrHospital}
                placeholder="e.g. Grady Health System"
                onChange={(e) => applyChange(setCoverField(pkg, 'targetCompanyOrHospital', e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Roles */}
            {pkg.resume.professionalExperience.map((role, roleIndex) => (
              <div key={roleIndex} className="rounded-lg border border-stone-700 bg-stone-900/60 p-3 space-y-3">
                <p className="text-xs font-black text-stone-200 uppercase tracking-wide">{role.roleTitle || `Role ${roleIndex + 1}`}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-stone-300 mb-1">
                      Employer name <ProvBadge provenance={role.organizationProvenance} />
                    </label>
                    <input
                      type="text"
                      value={role.organization}
                      placeholder="e.g. Atlanta Food Bank"
                      onChange={(e) => applyChange(setRoleField(pkg, roleIndex, 'organization', e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-stone-300 mb-1">
                      Dates worked <ProvBadge provenance={role.dateRangeProvenance} />
                    </label>
                    <input
                      type="text"
                      value={role.dateRange}
                      placeholder="e.g. 2021 – 2024"
                      onChange={(e) => applyChange(setRoleField(pkg, roleIndex, 'dateRange', e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-stone-300">Bullets</p>
                  {role.bullets.map((b, lineIndex) => renderLineEditor('bullets', roleIndex, lineIndex, b))}
                </div>
              </div>
            ))}

            {/* Certifications */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-stone-300">Certifications <span className="font-normal text-stone-500">— add ONLY ones you actually hold</span></p>
              {pkg.resume.certificationsAndTraining.map((c, lineIndex) => renderLineEditor('certifications', 0, lineIndex, c))}
              <div className="flex flex-wrap gap-1.5">
                {CERT_SUGGESTIONS.filter((s) => !pkg.resume.certificationsAndTraining.some((c) => c.text === s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => applyChange(addLine(pkg, 'certifications', s))}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[10px] text-stone-300"
                  >
                    <Plus className="w-3 h-3" />{s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertText}
                  placeholder="Type another certification…"
                  onChange={(e) => setNewCertText(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={() => { if (newCertText.trim()) { applyChange(addLine(pkg, 'certifications', newCertText)); setNewCertText(''); } }}
                  className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-stone-300">Education</p>
              {pkg.resume.educationAndHopeGrants.map((e, lineIndex) => renderLineEditor('education', 0, lineIndex, e))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEduText}
                  placeholder="e.g. GED — Georgia, 2019"
                  onChange={(e) => setNewEduText(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={() => { if (newEduText.trim()) { applyChange(addLine(pkg, 'education', newEduText)); setNewEduText(''); } }}
                  className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {flags.length === 0 && (
              <p className="flex items-center gap-2 text-[11px] text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Every line is verified by you. Safe to export.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Mode Description Banner (Change 3) */}
      <ModeDescriptionBanner mode="resume" />

      {/* View Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              MODE 2: COMPLETE RESUME & COVER LETTER BUILDER
            </span>
            <span className="text-xs text-stone-400 font-mono">ATS-Compliant Document Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-100 font-sans mt-1">
            Career Package & Application Architect
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Generates a high-impact metric-driven resume and a concise 3-paragraph commercial cover letter tailored for Georgia employers.
          </p>
        </div>

        {editedPackage && (
          <div className="flex items-center gap-2 flex-wrap">
            {unresolvedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                {unresolvedCount} to review
              </span>
            )}
            <button
              onClick={() => requestExport('pdf')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950 shadow-sm transition-colors"
              title="Download ATS-compliant PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => requestExport('docx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-xs font-bold text-stone-950 shadow-sm transition-colors"
              title="Download editable Microsoft Word .docx"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Word (.docx)</span>
            </button>

            <button
              id="resume-print-save-pdf-btn"
              onClick={() => requestExport('print')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
              title="Print / Save PDF via native browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Export gate: inline confirm when flags are unresolved */}
      {editedPackage && exportGate && (
        <div className="rounded-xl border border-amber-500/60 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200 flex-1">
            <strong>{unresolvedCount} item{unresolvedCount === 1 ? '' : 's'} still need{unresolvedCount === 1 ? 's' : ''} your review.</strong>
            {' '}Exporting now will label the unverified lines in the file. Nothing ships silently.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setExportGate(null); setReviewOpen(true); }}
              className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 border border-stone-600"
            >
              Review first
            </button>
            <button
              onClick={confirmExportAnyway}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950"
            >
              Export anyway
            </button>
          </div>
        </div>
      )}

      {/* Package Generator Configuration Bar */}
      <form onSubmit={handleGenerate} className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Target Professional Role:</label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="e.g. Commercial Electrical Apprentice"
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Candidate Full Name:</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. J. Carter"
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Georgia Location / Corridor:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Atlanta, GA"
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Target Industry / Sector:</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="Healthcare & Hospital Systems">Healthcare & Hospital Systems (Grady/Emory)</option>
              <option value="Commercial Trades & Electrical">Commercial Trades & Union Apprenticeships (IBEW 613)</option>
              <option value="Culinary & Facilities">Culinary Arts & Facilities Management</option>
              <option value="General Operations">General Commercial Operations</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-stone-400 font-mono">
            {currentTranslation ? `Linked to Capability Translation: "${currentTranslation.commercialTitle}"` : 'Generates complete ATS-tailored career assets'}
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating Full Package...' : 'Generate Full Package'}</span>
          </button>
        </div>
      </form>

      {/* Review checkpoint (fabrication fix) */}
      {editedPackage && renderReviewCheckpoint()}

      {/* Package Display or Empty State */}
      {editedPackage ? (
        <div className="space-y-4">
          {/* Sub Navigation for Resume / Cover Letter */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'both' ? 'bg-stone-800 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 inline mr-1" />
                Full Package View
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'resume' ? 'bg-stone-800 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                Professional Resume
              </button>
              <button
                onClick={() => setActiveTab('cover_letter')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'cover_letter' ? 'bg-stone-800 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Send className="w-3.5 h-3.5 inline mr-1" />
                Targeted Cover Letter
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(
                  activeTab === 'cover_letter'
                    ? generateCoverLetterMarkdown(editedPackage)
                    : generateResumeMarkdown(editedPackage),
                  'active_doc'
                )}
                className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 flex items-center gap-1.5"
              >
                {copiedSection === 'active_doc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'active_doc' ? 'Copied' : 'Copy Markdown'}</span>
              </button>

              <button
                onClick={() => onSendToTracker(editedPackage.coverLetter.targetCompanyOrHospital || 'Georgia Employer', editedPackage.targetJobTitle)}
                className="px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Add to Application Tracker (Mode 3)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* DOCUMENT 1: PROFESSIONAL RESUME */}
            {(activeTab === 'both' || activeTab === 'resume') && (
              <div className={`${activeTab === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white text-stone-900 p-6 sm:p-8 rounded-xl shadow-xl border border-stone-200 font-sans print-only-card`}>
                {/* Header Accent */}
                <div className="h-1.5 w-full bg-amber-600 rounded-full mb-4"></div>

                {/* Candidate Name & Title */}
                <div className="text-center pb-4 border-b border-stone-200">
                  <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                    {editedPackage.candidate.fullName.toUpperCase()}
                  </h3>
                  <p className="text-sm font-bold text-amber-700 mt-0.5 tracking-wide">
                    {editedPackage.resume.targetTitle.toUpperCase()}
                  </p>
                  <p className="text-xs text-stone-500 mt-1 font-mono">
                    {editedPackage.candidate.cityStateZip} •{' '}
                    {editedPackage.candidate.phone.trim() ? (
                      editedPackage.candidate.phone
                    ) : (
                      <span className="text-red-500 italic">{MISSING_PLACEHOLDER_PHONE}</span>
                    )}{' '}
                    •{' '}
                    {editedPackage.candidate.email.trim() ? (
                      editedPackage.candidate.email
                    ) : (
                      <span className="text-red-500 italic">{MISSING_PLACEHOLDER_EMAIL}</span>
                    )}
                  </p>
                </div>

                {/* 1. Professional Summary */}
                <div className="mt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed text-justify">
                    {editedPackage.resume.summary}
                  </p>
                </div>

                {/* 2. Core Competencies Grid (2x3) */}
                <div className="mt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                    Core Operational & Technical Competencies
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {editedPackage.resume.competenciesGrid.flatMap((row, rIdx) =>
                      row.map((comp, cIdx) => (
                        <div key={`${rIdx}-${cIdx}`} className="p-2 rounded bg-stone-50 border border-stone-200 text-stone-800 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></span>
                          <span className="text-[11px] leading-tight">{comp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Professional Experience */}
                <div className="mt-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                    Professional Experience & Operational Execution
                  </h4>
                  {editedPackage.resume.professionalExperience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
                        <span className="font-bold text-stone-900 text-sm">
                          {exp.roleTitle}
                        </span>
                        <span className="text-[11px] font-mono font-semibold">
                          {exp.dateRange.trim() ? (
                            <span className="text-amber-800">{exp.dateRange}</span>
                          ) : (
                            <span className="text-red-500 italic border border-dashed border-red-400 rounded px-1">{MISSING_PLACEHOLDER_DATES}</span>
                          )}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 font-medium">
                        {exp.organization.trim() ? (
                          <>{exp.organization} — {exp.location}</>
                        ) : (
                          <><span className="text-red-500 italic border border-dashed border-red-400 rounded px-1">{MISSING_PLACEHOLDER_ORG}</span> — {exp.location}</>
                        )}
                      </div>
                      <ul className="space-y-1 mt-1 pl-2">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-stone-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-amber-600 font-bold text-sm leading-none">•</span>
                            <span>
                              {b.text}
                              {needsReview(b) && (
                                <span className={`ml-1.5 inline-block px-1 rounded text-[9px] font-bold uppercase border ${provBadgeClass(b.provenance)}`}>
                                  {b.provenance === 'missing' ? 'Add info' : AI_DRAFT_TAG}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 4. Certifications & Education */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                      Safety & Trade Certifications
                    </h4>
                    {editedPackage.resume.certificationsAndTraining.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic">None listed — add certifications you hold in the review checkpoint.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-stone-700">
                        {editedPackage.resume.certificationsAndTraining.map((c, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <Award className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{c.text}</span>
                            <ProvBadge provenance={c.provenance} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                      Education & Georgia HOPE Grants
                    </h4>
                    {editedPackage.resume.educationAndHopeGrants.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic">None listed — add education in the review checkpoint.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-stone-700">
                        {editedPackage.resume.educationAndHopeGrants.map((e, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <GraduationCap className="w-3 h-3 text-sky-600 shrink-0" />
                            <span>{e.text}</span>
                            <ProvBadge provenance={e.provenance} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 2: TARGETED COVER LETTER */}
            {(activeTab === 'both' || activeTab === 'cover_letter') && (
              <div className={`${activeTab === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white text-stone-900 p-6 sm:p-8 rounded-xl shadow-xl border border-stone-200 font-sans flex flex-col justify-between print-only-card`}>
                <div className="space-y-4">
                  {/* Top Accent */}
                  <div className="h-1.5 w-full bg-sky-600 rounded-full mb-3"></div>

                  {/* Sender Meta */}
                  <div className="border-b border-stone-200 pb-3">
                    <h3 className="text-lg font-black text-stone-900">
                      {editedPackage.candidate.fullName.toUpperCase()}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                      {editedPackage.candidate.cityStateZip} •{' '}
                      {editedPackage.candidate.phone.trim() ? editedPackage.candidate.phone : MISSING_PLACEHOLDER_PHONE} •{' '}
                      {editedPackage.candidate.email.trim() ? editedPackage.candidate.email : MISSING_PLACEHOLDER_EMAIL}
                    </p>
                  </div>

                  {/* Date & Recipient */}
                  <div className="text-xs text-stone-600 space-y-1">
                    <p className="font-mono text-stone-500">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-stone-900 text-sm mt-2">
                      {editedPackage.coverLetter.hiringManagerOrDepartment}
                    </p>
                    <p className="font-medium text-stone-700">
                      {editedPackage.coverLetter.targetCompanyOrHospital.trim() ? (
                        editedPackage.coverLetter.targetCompanyOrHospital
                      ) : (
                        <span className="text-red-500 italic">{MISSING_PLACEHOLDER_ORG}</span>
                      )}
                    </p>
                    <p className="text-stone-500">
                      {editedPackage.coverLetter.companyAddressOrCorridor}
                    </p>
                  </div>

                  {/* Salutation */}
                  <p className="text-xs font-bold text-stone-900 pt-1">
                    Dear {editedPackage.coverLetter.hiringManagerOrDepartment},
                  </p>

                  {/* Paragraph 1: Opening & Role Bridge */}
                  <p className="text-xs text-stone-700 leading-relaxed text-justify">
                    {editedPackage.coverLetter.openingParagraph}
                  </p>

                  {/* Paragraph 2: Operational Rigor & Value-Add */}
                  <p className="text-xs text-stone-700 leading-relaxed text-justify">
                    {editedPackage.coverLetter.bodyParagraph}
                  </p>

                  {/* Paragraph 3: Georgia Corridor Commitment & High-Agency Close */}
                  <p className="text-xs text-stone-700 leading-relaxed text-justify">
                    {editedPackage.coverLetter.closingParagraph}
                  </p>
                </div>

                {/* Sign-off */}
                <div className="pt-6 border-t border-stone-200 mt-4 text-xs text-stone-900">
                  <p>{editedPackage.coverLetter.signOff}</p>
                  <p className="font-bold text-sm mt-3">{editedPackage.candidate.fullName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-stone-900/50 border border-stone-800 text-center space-y-3">
          <FileText className="w-10 h-10 text-amber-400 mx-auto opacity-75" />
          <h3 className="text-base font-bold text-stone-200">No Career Package Generated Yet</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Click <strong className="text-amber-300">"Generate Full Package"</strong> above or type your target job title to automatically architect your complete ATS resume and 3-paragraph commercial cover letter.
          </p>
        </div>
      )}
    </div>
  );
};
