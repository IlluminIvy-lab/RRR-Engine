import { TranslationResult, FullApplicationPackage, ResumeLine } from '../types';
import { makeLine } from './provenance';

/**
 * Client-Side Offline Capability Engine
 * Generates verified, ATS-compliant commercial translations, competencies,
 * metric-driven resume bullets, and Georgia corridor pathways 100% offline.
 */

/**
 * Client-Side Offline Capability Engine (anti-fabrication build)
 *
 * Maps the user's own words to a commercial title and skill labels via
 * input-keyword matching — that mapping is the legitimate translation
 * function. It NEVER invents metrics, volumes, percentages, headcounts,
 * employer names, dates, certifications, or "verified employer" claims.
 * Resume bullets are AI drafts with [bracketed placeholders] where the
 * user's real numbers go; the Capability Translator view requires the
 * user to verify and edit them before they flow into any resume or export.
 * Georgia pathways are research leads, not verified placements.
 */
const TRADE_CERT_NAMES: Record<string, string> = {
  plumbing: "Plumbing Certificate",
  electrical: "Electrical Certificate",
  welding: "Welding Certificate",
  hvac: "HVAC Certificate",
};

/**
 * Stated-certification detection (2026-11-02 Wave 1 fix).
 *
 * Returns the credentials the user EXPLICITLY states they hold, in the
 * order stated. Deliberately high-precision: a credential is named only
 * when the user's own words claim it — earning/possession language plus
 * the credential ("got my plumbing certificate", "hold a welding
 * certificate", "my HVAC certification"), or a ServSafe mention.
 * Mere program enrollment ("enrolled in a plumbing certificate
 * program") does NOT count, and nothing is ever inferred from duties:
 * an uncertified duty ("I helped in the motor pool but never got
 * certified") yields nothing. Naming a stated credential — instead of
 * dissolving it into a generic skill line — keeps the one verifiable
 * fact the user offered visible on the translation and the resume.
 */
export function detectStatedCertifications(experience: string): string[] {
  const found: { name: string; index: number }[] = [];
  const servsafe = /\bservsafe\b/i.exec(experience);
  if (servsafe) {
    found.push({ name: "ServSafe Food Protection Manager Certification", index: servsafe.index });
  }
  const tradeCert =
    /\b(?:got|earned|earn|earning|hold|holds|holding|have|has|received|obtained)\s+(?:my\s+|a\s+|an\s+|the\s+)?(plumbing|electrical|welding|hvac)\s+certificat(?:e|ion)\b|\bmy\s+(plumbing|electrical|welding|hvac)\s+certificat(?:e|ion)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = tradeCert.exec(experience)) !== null) {
    const trade = (m[1] || m[2]).toLowerCase();
    found.push({ name: TRADE_CERT_NAMES[trade], index: m.index });
  }
  found.sort((a, b) => a.index - b.index);
  return [...new Set(found.map((f) => f.name))];
}

interface DomainProfile {
  commercialTitle: string;
  hardSkills: string[];
  softSkills: string[];
  bullets: string[];
  gaPathways: string[];
}

function domainProfile(domainIndex: number): DomainProfile | null {
  switch (domainIndex) {

    case 0: {
      return {
        commercialTitle: "Line Cook / High-Volume Food Service Production",
        hardSkills: [
        "Food Safety & Sanitation Standards",
        "High-Volume Batch Production & Prep",
        "Portion Control & Waste Minimization",
        "Commercial Kitchen Equipment Operation"
      ],
        softSkills: [
        "High-Volume Pressure Resilience",
        "Kitchen Team Coordination",
        "Fast-Paced Shift Execution",
        "Regulatory Compliance"
      ],
        bullets: [
        "Produced food service at volume within per-meal budgetary and nutritional constraints [add daily volume / setting].",
        "Managed inventory across dry goods, refrigerated stocks, and sanitation supplies [add scale].",
        "Supervised and mentored prep crew members on food handling, knife safety, and line turnaround [add team size]."
      ],
        gaPathways: [
        "Atlanta metro hospitality & culinary corridor (Downtown/Midtown hotels, Georgia World Congress Center, Hartsfield-Jackson concessions) — research employers directly.",
        "Hospital food & nutrition services departments (e.g. Grady, Emory) — verify hiring policies with each employer; the app does not verify fair-chance status.",
        "Atlanta Technical College / Central Georgia Tech Culinary Arts HOPE Career Grant programs — confirm eligibility."
      ]
      };
    }
    case 1: {
      return {
        commercialTitle: "Equipment & Fleet Maintenance Technician",
        hardSkills: [
        "Hydraulic & Pneumatic System Diagnostics",
        "Diesel/Gasoline Powertrain Service",
        "Preventive Maintenance Scheduling",
        "Diagnostic Scan Tool Use"
      ],
        softSkills: [
        "Root-Cause Troubleshooting",
        "Safety & Environmental Compliance",
        "Resource Conservation",
        "Crew Coordination Under Deadlines"
      ],
        bullets: [
        "Performed mechanical diagnostics, repairs, and preventive maintenance [add fleet size / vehicle types].",
        "Serviced hydraulic pumps and braking assemblies to manufacturer specifications [add equipment types].",
        "Maintained work-order logs and parts manifests [add tracking system, if any]."
      ],
        gaPathways: [
        "MARTA transit bus & rail maintenance apprenticeships — check current postings and requirements.",
        "Georgia clean-energy & EV manufacturing pipeline (e.g. SK Battery, Hyundai Metaplant) — research roles and hiring policies directly.",
        "Registered apprenticeships (e.g. UA Local 72) — verify intake with the local directly."
      ]
      };
    }
    case 2: {
      return {
        commercialTitle: "Structural Fabricator / Production Welder",
        hardSkills: [
        "SMAW / GMAW Welding Processes",
        "Blueprint & Schematic Reading",
        "Metal Measurement & Grinding",
        "Quality Inspection"
      ],
        softSkills: [
        "Detail Precision",
        "Physical Endurance & Focus",
        "PPE & Hot-Work Safety Discipline",
        "Quality Feedback"
      ],
        bullets: [
        "Fabricated, fitted, and welded structural components to job specifications [add code/spec if applicable — only if true].",
        "Read blueprints and technical schematics to cut, bend, and bevel plate [add material / tolerance context].",
        "Followed hot-work safety standards and equipment maintenance routines [add setting / timeframe]."
      ],
        gaPathways: [
        "Registered apprenticeships (e.g. Ironworkers Local 387, Boilermakers Local 26) — verify intake with the local directly.",
        "Rail mechanical shops (Atlanta & Macon yards) — research openings directly.",
        "Central Georgia Technical College (Macon) HOPE Career Grant welding programs — confirm eligibility."
      ]
      };
    }
    case 3: {
      return {
        commercialTitle: "Commercial Electrical Apprentice / Industrial Electrician",
        hardSkills: [
        "EMT Conduit Bending & Installation",
        "National Electrical Code (NEC) Standards",
        "Circuit Diagnostics & Multimeter Testing",
        "Panel Wiring & Three-Phase Power"
      ],
        softSkills: [
        "Systematic Problem Solving",
        "Lockout/Tagout Safety Discipline",
        "Blueprint Interpretation",
        "Reliable Team Communication"
      ],
        bullets: [
        "Installed and routed conduit, wireways, and junction boxes per NEC and inspection requirements [add project scale].",
        "Troubleshot circuits using continuity tests and voltage-drop calculations [add setting].",
        "Applied lockout/tagout procedures on distribution equipment [add voltage class / setting]."
      ],
        gaPathways: [
        "IBEW Local 613 Atlanta electrical apprenticeship — verify intake and requirements with the local directly.",
        "Georgia Power substation & commercial field service pipelines — research openings directly.",
        "Chattahoochee Technical College electrical construction HOPE Grant diploma — confirm eligibility."
      ]
      };
    }
    case 4: {
      return {
        commercialTitle: "Plumbing Technician / Maintenance Plumber",
        hardSkills: [
        "Plumbing System Installation & Repair",
        "Drain Cleaning & Line Maintenance",
        "Fixture Installation & Replacement",
        "Leak Detection & Pipe Repair"
      ],
        softSkills: [
        "Detail-Oriented Troubleshooting",
        "Independent Work Execution",
        "Safety-Conscious Operations",
        "Deadline-Driven Task Completion"
      ],
        bullets: [
        "Repaired and maintained plumbing systems — clearing drain lines, fixing leaks, and replacing worn fixtures [add facility type / scale].",
        "Installed and replaced plumbing fixtures and piping to work-order specifications [add fixture types / setting].",
        "Responded to maintenance work orders, diagnosing line blockages and fitting failures [add volume / response context]."
      ],
        gaPathways: [
        "Licensed plumbing & mechanical contractors in the Atlanta metro corridor — verify each employer's hiring policies directly; the app does not verify fair-chance status.",
        "UA Plumbers Local 72 (Atlanta) apprenticeship intake — confirm current application windows and requirements with the local directly.",
        "HOPE Career Grant plumbing programs at TCSG colleges (e.g. Atlanta Technical College) — confirm eligibility and program availability."
      ]
      };
    }
    case 5: {
      return {
        commercialTitle: "Clinical Support Operations Specialist",
        hardSkills: [
        "Infection Control Practices",
        "Patient Mobility & Transport Support",
        "Documentation & Compliance",
        "Supply Staging"
      ],
        softSkills: [
        "Compassionate De-escalation",
        "Crisis Management",
        "Interdisciplinary Team Collaboration",
        "Confidentiality (HIPAA Awareness)"
      ],
        bullets: [
        "Coordinated sanitation and patient-transport logistics [add unit / facility type].",
        "Monitored medical inventory and sterile supply staging [add scale].",
        "Maintained logs and handover summaries supporting shift-to-shift communication [add documentation system, if any]."
      ],
        gaPathways: [
        "Hospital facilities, transport, and clinical-support departments (e.g. Grady, Piedmont, Emory) — verify each employer's hiring policies directly; the app does not verify fair-chance status.",
        "Georgia HOPE Career Grant certifications (phlebotomy, sterile processing, CNA) at Atlanta Technical College — confirm eligibility.",
        "Healthcare support staffing agencies — research terms and placement fees before signing anything."
      ]
      };
    }
    case 6: {
      return {
        commercialTitle: "Logistics & Distribution Operations Associate",
        hardSkills: [
        "Forklift & Powered Industrial Truck Operation",
        "Barcode / Manifest Tracking",
        "Cross-Dock Freight Staging",
        "Warehouse Safety Compliance"
      ],
        softSkills: [
        "Fast-Paced Shift Accountability",
        "Freight Coordination",
        "Punctuality & Shift Reliability",
        "Physical Precision"
      ],
        bullets: [
        "Staged, scanned, and dispatched freight across storage bays [add volume / equipment used].",
        "Performed pre-operation inspections on forklifts and material-handling equipment, documenting findings [add inspection checklist / system, if any].",
        "Improved dock staging workflows [add what changed and any measurable result — only if true]."
      ],
        gaPathways: [
        "Metro Atlanta distribution hubs (e.g. Fulton Industrial Blvd corridor, Henry County) — research openings and hiring policies directly.",
        "Georgia Department of Economic Development Certified Logistics Associate (CLA) programs — verify schedule and cost.",
        "Warehouse staffing firms — research terms and placement fees before signing anything."
      ]
      };
    }
    case 7: {
      return {
        commercialTitle: "Administrative Operations & Records Specialist",
        hardSkills: [
        "Records Management & Filing",
        "Data Entry & Spreadsheet Use",
        "Document Quality Review",
        "Confidential Data Handling"
      ],
        softSkills: [
        "Discretion & Integrity",
        "Verification Accuracy",
        "Professional Written Communication",
        "Independent Prioritization"
      ],
        bullets: [
        "Processed and archived operational records [add volume / record type] following privacy requirements.",
        "Reconciled physical logs against internal databases, resolving discrepancies [add system used].",
        "Drafted summaries and shift turnover briefs supporting departmental coordination [add audience / frequency]."
      ],
        gaPathways: [
        "Fulton County / City of Atlanta administrative support postings — check which roles are covered by ban-the-box policies.",
        "Goodwill of North Georgia career centers — verify current training and placement services directly.",
        "Technical College System of Georgia (TCSG) Business Technology HOPE Grant programs — confirm eligibility."
      ]
      };
    }
  }
  return null;
}

export function translateCapabilityOffline(experience: string): TranslationResult {
  const expLower = experience.toLowerCase();

  let commercialTitle = "Industrial Facilities & Operations Specialist";
  let hardSkills = [
    "Inventory Control & Supply Chain Staging",
    "Preventive Equipment Maintenance",
    "OSHA Compliance & Safety Protocols",
    "Process Workflow Optimization"
  ];
  let softSkills = [
    "Crisis De-escalation & Conflict Resolution",
    "Peer Mentorship & Crew Leadership",
    "High-Stress Time Management",
    "Clear Operational Reporting"
  ];
  let bullets = [
    "Coordinated daily logistics and inventory staging across an operational facility [add facility type / team size].",
    "Performed routine maintenance and preventive diagnostics on equipment [add equipment type], following standard safety procedures.",
    "Trained and supported team members on safety protocols, standard operating procedures, and compliance reporting [add team size, if applicable]."
  ];
  let gaPathways = [
    "Georgia logistics & freight corridor — I-75/I-85 distribution hubs (Clayton & Henry County). Research openings and each employer's hiring policies before applying.",
    "Union apprenticeship programs (e.g. IBEW Local 613, Ironworkers Local 387) — check current intake and requirements with the local directly.",
    "Technical College System of Georgia (TCSG) HOPE Career Grant certification pathways — confirm eligibility and program availability."
  ];

  // Dominant-domain scoring (2026-09-23 fix): every domain is scored by
  // keyword hits and the strongest match wins, so a single passing mention
  // (e.g. "basic electrical repairs" inside a warehouse profile) can no
  // longer hijack the whole classification. Ties keep the original chain
  // priority (earliest wins); with zero hits the defaults above stand.
  //
  // Whole-word matching (2026-11-02 Wave 1 fix): the substring includes()
  // used before let short keywords fire inside unrelated words — the
  // health keyword "care" matched inside "career" and rerouted a
  // certified plumber's profile to the clinical domain. The input is now
  // tokenized on non-alphanumeric boundaries, and a keyword scores only
  // when it equals a whole token or that token's inflection-stripped
  // variant (cooking -> cook, fabricated -> fabricat, electrical ->
  // electric, nurses -> nurse). Standalone "care" still matches;
  // "career" does not.
  const wordForms = new Set<string>();
  for (const token of expLower.split(/[^a-z0-9]+/)) {
    if (!token) continue;
    wordForms.add(token);
    for (const suffix of ["ing", "ed", "es", "ion", "al", "s"]) {
      if (token.length - suffix.length >= 3 && token.endsWith(suffix)) {
        wordForms.add(token.slice(0, -suffix.length));
      }
    }
  }
  const domainKeywords: string[][] = [
    ["cook", "kitchen", "food", "culinary", "baker", "dining"],
    ["mechanic", "auto", "diesel", "vehicle", "engine", "transmission"],
    ["weld", "fabricat", "metal", "machin", "cutting", "iron"],
    ["electric", "wire", "power", "voltage", "conduit", "panel"],
    // Plumbing / trades (2026-11-02 Wave 1): previously absent entirely.
    // Sits ahead of health so a trades profile wins ties over the
    // clinical domain.
    ["plumbing", "plumber", "drain", "drains", "fixture", "fixtures", "piping", "pipe", "pipes", "sewer", "faucet", "faucets", "leak", "leaks"],
    ["health", "care", "nurse", "medical", "orderly", "patient", "hospital"],
    ["warehouse", "forklift", "shipping", "inventory", "stock", "dock"],
    ["clerk", "admin", "office", "records", "computer", "data"]
  ];
  // Secondary-domain tracking (multi-trade fix): a work history often
  // spans two trades (kitchen + maintenance, plumbing + warehouse). The
  // old scoring kept only the single best domain and silently discarded
  // the second trade. Track the runner-up as well; it is carried on the
  // result as secondaryDomain when its score shows a real second history
  // (2+ distinct keyword hits — a lone passing mention does not qualify).
  let bestDomain = -1;
  let bestScore = 0;
  let secondDomain = -1;
  let secondScore = 0;
  domainKeywords.forEach((keywords, domainIndex) => {
    let score = 0;
    for (const kw of keywords) {
      if (wordForms.has(kw)) score += 1;
    }
    if (score > bestScore) {
      secondScore = bestScore;
      secondDomain = bestDomain;
      bestScore = score;
      bestDomain = domainIndex;
    } else if (score > secondScore) {
      secondScore = score;
      secondDomain = domainIndex;
    }
  });

  const primaryProfile = domainProfile(bestDomain);
  if (primaryProfile) {
    commercialTitle = primaryProfile.commercialTitle;
    hardSkills = primaryProfile.hardSkills;
    softSkills = primaryProfile.softSkills;
    bullets = primaryProfile.bullets;
    gaPathways = primaryProfile.gaPathways;
  }
  const secondaryProfile = secondScore >= 2 ? domainProfile(secondDomain) : null;


  // Stated certifications (2026-11-02 Wave 1 fix): a credential the user
  // explicitly says they hold is named FIRST among the hard skills, in
  // any domain — never dissolved into a generic skill line. Only
  // user-stated credentials appear (see detectStatedCertifications);
  // nothing is inferred from duties.
  const statedCerts = detectStatedCertifications(experience);
  if (statedCerts.length > 0) {
    hardSkills = [...statedCerts, ...hardSkills.filter((s) => !statedCerts.includes(s))];
  }

  return {
    commercialTitle,
    competencies: {
      hardSkills,
      softSkills
    },
    resumeBullets: bullets,
    gaPathways,
    gaPathway: gaPathways.join(" | "),
    // Multi-trade histories carry their second domain alongside the
    // primary instead of collapsing to one (see scoring note above).
    ...(secondaryProfile
      ? {
          secondaryDomain: {
            commercialTitle: secondaryProfile.commercialTitle,
            hardSkills: secondaryProfile.hardSkills,
            gaPathways: secondaryProfile.gaPathways
          }
        }
      : {}),
    rawExperience: experience,
    timestamp: new Date().toISOString()
  };
}

/**
 * ANTI-FABRICATION CONTRACT (release-blocker fix):
 * This engine no longer invents employers, dates, metrics, certifications, or
 * contact info. Anything the user hasn't provided comes back as "" with
 * provenance "missing"; anything the engine drafts comes back marked
 * "ai_inferred" for the review checkpoint. The ONLY user facts available here
 * are the target title, name, location, and (optionally) a Mode 1 translation.
 */
export function generateFullPackageOffline(
  targetTitle: string,
  candidateName = "J. Carter",
  location = "Atlanta, GA",
  industry = "Logistics & Supply Chain",
  translation?: TranslationResult | null
): FullApplicationPackage {
  const cleanTitle = targetTitle?.trim() || "Commercial Operations Specialist";
  const name = candidateName?.trim() || "J. Carter";
  const loc = location?.trim() || "Atlanta, GA";

  // Map industry to allowed union types
  const validIndustry: FullApplicationPackage['industryOrSector'] =
    industry.includes('Healthcare') || industry.includes('Hospital')
      ? 'Healthcare & Hospital Systems'
      : industry.includes('Trade') || industry.includes('Electrical')
      ? 'Commercial Trades & Electrical'
      : industry.includes('Culinary') || industry.includes('Food')
      ? 'Culinary & Facilities'
      : industry.includes('Logistics') || industry.includes('Supply')
      ? 'Logistics & Supply Chain'
      : 'General Operations';

  // Bullets: grounded in the user's own translator output when available,
  // otherwise neutral capability statements with NO invented metrics,
  // employers, or numbers. All marked ai_inferred for checkpoint review.
  const hasTranslation = !!(translation && translation.resumeBullets && translation.resumeBullets.length > 0);
  const bullets: ResumeLine[] = hasTranslation
    ? translation!.resumeBullets.map((b) => makeLine(b, 'ai_inferred'))
    : [
        makeLine(
          "Executes daily operational workflows following standard operating procedures and applicable safety requirements.",
          'ai_inferred'
        ),
        makeLine(
          "Coordinates with team members to maintain workflow continuity and resolve routine operational issues.",
          'ai_inferred'
        ),
        makeLine(
          "Maintains equipment, work areas, and records to required operational standards.",
          'ai_inferred'
        ),
      ];

  // Competencies: derived from the user's translation when available,
  // otherwise a neutral (non-claim) starter set.
  const competenciesGrid: string[][] = hasTranslation
    ? [
        translation!.competencies.hardSkills.slice(0, 3),
        translation!.competencies.softSkills.slice(0, 3),
      ]
    : [
        ["Standard Operating Procedure (SOP) Adherence", "Workflow Coordination", "Safety-Conscious Execution"],
        ["Team Communication", "Task Prioritization", "Documentation & Reporting"],
      ];

  // Certifications (2026-11-02 Wave 1 fix): ONLY credentials the user
  // explicitly stated in their Mode 1 words — detected from the
  // translation's rawExperience and labeled user_provided — are carried
  // into the package. Nothing is inferred from duties; when the user
  // stated none, the list stays empty.
  const statedCertLines: ResumeLine[] = translation?.rawExperience
    ? detectStatedCertifications(translation.rawExperience).map((c) => makeLine(c, 'user_provided'))
    : [];

  const summary = hasTranslation
    ? `Operations professional targeting ${cleanTitle} roles in the ${loc} corridor. Capability Translator assessment highlights ${translation!.commercialTitle} strengths, including ${translation!.competencies.hardSkills.slice(0, 2).join(" and ")}. Focused on procedure-driven execution, workflow coordination, and safety-conscious operations. Complete the review checklist to verify every line before sending.`
    : `Candidate targeting ${cleanTitle} roles in the ${loc} corridor. Run the Capability Translator (Mode 1) on your experience, then work through the review checklist — every line on this resume must be confirmed by you before it goes to an employer.`;

  return {
    id: `pkg-offline-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    targetJobTitle: cleanTitle,
    industryOrSector: validIndustry,
    createdAt: new Date().toISOString(),
    candidate: {
      fullName: name,
      cityStateZip: loc,
      // NEVER invented — the review checkpoint collects these.
      phone: "",
      email: "",
      phoneProvenance: 'missing',
      emailProvenance: 'missing',
      linkedinOrPortfolio: undefined,
    },
    resume: {
      targetTitle: cleanTitle,
      summary,
      competenciesGrid,
      // ONE role. No invented second employer, no invented dates.
      // Organization / dates stay blank until the user fills them in.
      professionalExperience: [
        {
          roleTitle: cleanTitle,
          roleTitleProvenance: 'user_provided',
          organization: "",
          organizationProvenance: 'missing',
          location: loc,
          locationProvenance: 'user_provided',
          dateRange: "",
          dateRangeProvenance: 'missing',
          bullets,
        },
      ],
      // NEVER invented: only user-stated certifications (statedCertLines,
      // from the user's own Mode 1 words) appear here — listing a
      // certification the user hasn't stated they hold is fabrication.
      // The review checkpoint offers one-tap adds.
      certificationsAndTraining: statedCertLines,
      educationAndHopeGrants: [],
    },
    coverLetter: {
      hiringManagerOrDepartment: "Hiring Manager",
      targetCompanyOrHospital: "",
      targetRoleTitle: cleanTitle,
      companyAddressOrCorridor: `${loc} Corridor`,
      openingParagraph: `I am writing to express my interest in the ${cleanTitle} position. ${hasTranslation ? `My background includes operational experience assessed through the RRR Capability Translator as ${translation!.commercialTitle}.` : "I am building a verified record of my capabilities through the RRR platform."} I am pursuing opportunities with Georgia employers committed to merit-based hiring.`,
      bodyParagraph: `I bring a disciplined approach to standard operating procedures, workflow coordination, and safety-conscious execution. ${hasTranslation ? `My assessed strengths include ${translation!.competencies.hardSkills.slice(0, 3).join(", ")}.` : "I am prepared to discuss how my experience aligns with your team\u2019s operational needs."} I welcome the chance to show what consistent, reliable execution looks like on your team.`,
      closingParagraph: `I am committed to building a long-term career in the Georgia corridor and would welcome the opportunity to discuss this role further. Thank you for your time and consideration.`,
      signOff: "Respectfully,",
    }
  };
}
