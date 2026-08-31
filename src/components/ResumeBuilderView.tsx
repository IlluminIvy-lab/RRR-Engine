import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Briefcase, 
  Send, 
  Edit3, 
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap,
  Award,
  Layers
} from 'lucide-react';
import { FullApplicationPackage, TranslationResult } from '../types';
import { generateFullPackageDocx } from '../utils/generateFullPackageDocx';
import { generateFullPackagePdf } from '../utils/generateFullPackagePdf';

interface ResumeBuilderViewProps {
  currentPackage: FullApplicationPackage | null;
  currentTranslation: TranslationResult | null;
  onGeneratePackage: (targetTitle: string, candidateName: string, location: string, industry: string) => Promise<void>;
  onSavePackage: (pkg: FullApplicationPackage) => void;
  onSendToTracker: (company: string, role: string) => void;
  isLoading: boolean;
}

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState<FullApplicationPackage | null>(currentPackage);

  // Sync edited package when currentPackage changes
  React.useEffect(() => {
    if (currentPackage) {
      setEditedPackage(currentPackage);
    }
  }, [currentPackage]);

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

  const handleDownloadDocx = async () => {
    if (!editedPackage) return;
    await generateFullPackageDocx(editedPackage);
  };

  const handleDownloadPdf = () => {
    if (!editedPackage) return;
    generateFullPackagePdf(editedPackage);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateResumeMarkdown = (pkg: FullApplicationPackage) => {
    const { candidate, resume } = pkg;
    return `# ${candidate.fullName.toUpperCase()}
**${resume.targetTitle.toUpperCase()}**
${candidate.cityStateZip} | ${candidate.phone} | ${candidate.email}

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
    (exp) => `### ${exp.roleTitle} — ${exp.organization} (${exp.location})
*${exp.dateRange}*
${exp.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## CERTIFICATIONS & SAFETY TRAINING
${resume.certificationsAndTraining.map((c) => `- ${c}`).join('\n')}

## EDUCATION & GEORGIA CAREER PATHWAYS
${resume.educationAndHopeGrants.map((e) => `- ${e}`).join('\n')}
`;
  };

  const generateCoverLetterMarkdown = (pkg: FullApplicationPackage) => {
    const { candidate, coverLetter } = pkg;
    return `# ${candidate.fullName.toUpperCase()}
${candidate.cityStateZip} | ${candidate.phone} | ${candidate.email}

${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

**${coverLetter.hiringManagerOrDepartment}**
${coverLetter.targetCompanyOrHospital}
${coverLetter.companyAddressOrCorridor}

Dear ${coverLetter.hiringManagerOrDepartment},

${coverLetter.openingParagraph}

${coverLetter.bodyParagraph}

${coverLetter.closingParagraph}

${coverLetter.signOff}
${candidate.fullName}
`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
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
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950 shadow-sm transition-colors"
              title="Download ATS-compliant PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-xs font-bold text-stone-950 shadow-sm transition-colors"
              title="Download editable Microsoft Word .docx"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Word (.docx)</span>
            </button>

            <button
              id="resume-print-save-pdf-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
              title="Print / Save PDF via native browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        )}
      </div>

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
                    {editedPackage.candidate.cityStateZip} • {editedPackage.candidate.phone} • {editedPackage.candidate.email}
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
                        <span className="text-[11px] font-mono text-amber-800 font-semibold">
                          {exp.dateRange}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 font-medium">
                        {exp.organization} — {exp.location}
                      </div>
                      <ul className="space-y-1 mt-1 pl-2">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-stone-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-amber-600 font-bold text-sm leading-none">•</span>
                            <span>{b}</span>
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
                    <ul className="space-y-1 text-xs text-stone-700">
                      {editedPackage.resume.certificationsAndTraining.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <Award className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-amber-600 pb-1 mb-2">
                      Education & Georgia HOPE Grants
                    </h4>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {editedPackage.resume.educationAndHopeGrants.map((e, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <GraduationCap className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
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
                      {editedPackage.candidate.cityStateZip} • {editedPackage.candidate.phone} • {editedPackage.candidate.email}
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
                      {editedPackage.coverLetter.targetCompanyOrHospital}
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
