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
  const domainKeywords: string[][] = [
    ["cook", "kitchen", "food", "culinary", "baker", "dining"],
    ["mechanic", "auto", "diesel", "vehicle", "engine", "transmission"],
    ["weld", "fabricat", "metal", "machin", "cutting", "iron"],
    ["electric", "wire", "power", "voltage", "conduit", "panel"],
    ["health", "care", "nurse", "medical", "orderly", "patient", "hospital"],
    ["warehouse", "forklift", "shipping", "inventory", "stock", "dock"],
    ["clerk", "admin", "office", "records", "computer", "data"]
  ];
  let bestDomain = -1;
  let bestScore = 0;
  domainKeywords.forEach((keywords, domainIndex) => {
    let score = 0;
    for (const kw of keywords) {
      if (expLower.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domainIndex;
    }
  });

  switch (bestDomain) {
    case 0: {
      commercialTitle = "Line Cook / High-Volume Food Service Production";
      hardSkills = [
        "Food Safety & Sanitation Standards",
        "High-Volume Batch Production & Prep",
        "Portion Control & Waste Minimization",
        "Commercial Kitchen Equipment Operation"
      ];
      softSkills = [
        "High-Volume Pressure Resilience",
        "Kitchen Team Coordination",
        "Fast-Paced Shift Execution",
        "Regulatory Compliance"
      ];
      bullets = [
        "Produced food service at volume within per-meal budgetary and nutritional constraints [add daily volume / setting].",
        "Managed inventory across dry goods, refrigerated stocks, and sanitation supplies [add scale].",
        "Supervised and mentored prep crew members on food handling, knife safety, and line turnaround [add team size]."
      ];
      gaPathways = [
        "Atlanta metro hospitality & culinary corridor (Downtown/Midtown hotels, Georgia World Congress Center, Hartsfield-Jackson concessions) — research employers directly.",
        "Hospital food & nutrition services departments (e.g. Grady, Emory) — verify hiring policies with each employer; the app does not verify fair-chance status.",
        "Atlanta Technical College / Central Georgia Tech Culinary Arts HOPE Career Grant programs — confirm eligibility."
      ];
      break;
    }
    case 1: {
      commercialTitle = "Equipment & Fleet Maintenance Technician";
      hardSkills = [
        "Hydraulic & Pneumatic System Diagnostics",
        "Diesel/Gasoline Powertrain Service",
        "Preventive Maintenance Scheduling",
        "Diagnostic Scan Tool Use"
      ];
      softSkills = [
        "Root-Cause Troubleshooting",
        "Safety & Environmental Compliance",
        "Resource Conservation",
        "Crew Coordination Under Deadlines"
      ];
      bullets = [
        "Performed mechanical diagnostics, repairs, and preventive maintenance [add fleet size / vehicle types].",
        "Serviced hydraulic pumps and braking assemblies to manufacturer specifications [add equipment types].",
        "Maintained work-order logs and parts manifests [add tracking system, if any]."
      ];
      gaPathways = [
        "MARTA transit bus & rail maintenance apprenticeships — check current postings and requirements.",
        "Georgia clean-energy & EV manufacturing pipeline (e.g. SK Battery, Hyundai Metaplant) — research roles and hiring policies directly.",
        "Registered apprenticeships (e.g. UA Local 72) — verify intake with the local directly."
      ];
      break;
    }
    case 2: {
      commercialTitle = "Structural Fabricator / Production Welder";
      hardSkills = [
        "SMAW / GMAW Welding Processes",
        "Blueprint & Schematic Reading",
        "Metal Measurement & Grinding",
        "Quality Inspection"
      ];
      softSkills = [
        "Detail Precision",
        "Physical Endurance & Focus",
        "PPE & Hot-Work Safety Discipline",
        "Quality Feedback"
      ];
      bullets = [
        "Fabricated, fitted, and welded structural components to job specifications [add code/spec if applicable — only if true].",
        "Read blueprints and technical schematics to cut, bend, and bevel plate [add material / tolerance context].",
        "Followed hot-work safety standards and equipment maintenance routines [add setting / timeframe]."
      ];
      gaPathways = [
        "Registered apprenticeships (e.g. Ironworkers Local 387, Boilermakers Local 26) — verify intake with the local directly.",
        "Rail mechanical shops (Atlanta & Macon yards) — research openings directly.",
        "Central Georgia Technical College (Macon) HOPE Career Grant welding programs — confirm eligibility."
      ];
      break;
    }
    case 3: {
      commercialTitle = "Commercial Electrical Apprentice / Industrial Electrician";
      hardSkills = [
        "EMT Conduit Bending & Installation",
        "National Electrical Code (NEC) Standards",
        "Circuit Diagnostics & Multimeter Testing",
        "Panel Wiring & Three-Phase Power"
      ];
      softSkills = [
        "Systematic Problem Solving",
        "Lockout/Tagout Safety Discipline",
        "Blueprint Interpretation",
        "Reliable Team Communication"
      ];
      bullets = [
        "Installed and routed conduit, wireways, and junction boxes per NEC and inspection requirements [add project scale].",
        "Troubleshot circuits using continuity tests and voltage-drop calculations [add setting].",
        "Applied lockout/tagout procedures on distribution equipment [add voltage class / setting]."
      ];
      gaPathways = [
        "IBEW Local 613 Atlanta electrical apprenticeship — verify intake and requirements with the local directly.",
        "Georgia Power substation & commercial field service pipelines — research openings directly.",
        "Chattahoochee Technical College electrical construction HOPE Grant diploma — confirm eligibility."
      ];
      break;
    }
    case 4: {
      commercialTitle = "Clinical Support Operations Specialist";
      hardSkills = [
        "Infection Control Practices",
        "Patient Mobility & Transport Support",
        "Documentation & Compliance",
        "Supply Staging"
      ];
      softSkills = [
        "Compassionate De-escalation",
        "Crisis Management",
        "Interdisciplinary Team Collaboration",
        "Confidentiality (HIPAA Awareness)"
      ];
      bullets = [
        "Coordinated sanitation and patient-transport logistics [add unit / facility type].",
        "Monitored medical inventory and sterile supply staging [add scale].",
        "Maintained logs and handover summaries supporting shift-to-shift communication [add documentation system, if any]."
      ];
      gaPathways = [
        "Hospital facilities, transport, and clinical-support departments (e.g. Grady, Piedmont, Emory) — verify each employer's hiring policies directly; the app does not verify fair-chance status.",
        "Georgia HOPE Career Grant certifications (phlebotomy, sterile processing, CNA) at Atlanta Technical College — confirm eligibility.",
        "Healthcare support staffing agencies — research terms and placement fees before signing anything."
      ];
      break;
    }
    case 5: {
      commercialTitle = "Logistics & Distribution Operations Associate";
      hardSkills = [
        "Forklift & Powered Industrial Truck Operation",
        "Barcode / Manifest Tracking",
        "Cross-Dock Freight Staging",
        "Warehouse Safety Compliance"
      ];
      softSkills = [
        "Fast-Paced Shift Accountability",
        "Freight Coordination",
        "Punctuality & Shift Reliability",
        "Physical Precision"
      ];
      bullets = [
        "Staged, scanned, and dispatched freight across storage bays [add volume / equipment used].",
        "Performed pre-operation inspections on forklifts and material-handling equipment, documenting findings [add inspection checklist / system, if any].",
        "Improved dock staging workflows [add what changed and any measurable result — only if true]."
      ];
      gaPathways = [
        "Metro Atlanta distribution hubs (e.g. Fulton Industrial Blvd corridor, Henry County) — research openings and hiring policies directly.",
        "Georgia Department of Economic Development Certified Logistics Associate (CLA) programs — verify schedule and cost.",
        "Warehouse staffing firms — research terms and placement fees before signing anything."
      ];
      break;
    }
    case 6: {
      commercialTitle = "Administrative Operations & Records Specialist";
      hardSkills = [
        "Records Management & Filing",
        "Data Entry & Spreadsheet Use",
        "Document Quality Review",
        "Confidential Data Handling"
      ];
      softSkills = [
        "Discretion & Integrity",
        "Verification Accuracy",
        "Professional Written Communication",
        "Independent Prioritization"
      ];
      bullets = [
        "Processed and archived operational records [add volume / record type] following privacy requirements.",
        "Reconciled physical logs against internal databases, resolving discrepancies [add system used].",
        "Drafted summaries and shift turnover briefs supporting departmental coordination [add audience / frequency]."
      ];
      gaPathways = [
        "Fulton County / City of Atlanta administrative support postings — check which roles are covered by ban-the-box policies.",
        "Goodwill of North Georgia career centers — verify current training and placement services directly.",
        "Technical College System of Georgia (TCSG) Business Technology HOPE Grant programs — confirm eligibility."
      ];
      break;
    }
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
      // NEVER pre-filled: listing a certification the user hasn't confirmed
      // they hold is fabrication. The review checkpoint offers one-tap adds.
      certificationsAndTraining: [],
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
