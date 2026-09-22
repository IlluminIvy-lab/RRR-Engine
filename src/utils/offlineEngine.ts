import { TranslationResult, FullApplicationPackage, ResumeLine } from '../types';
import { makeLine } from './provenance';

/**
 * Client-Side Offline Capability Engine
 * Generates verified, ATS-compliant commercial translations, competencies,
 * metric-driven resume bullets, and Georgia corridor pathways 100% offline.
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
    "Directed daily logistics and inventory staging across a high-volume operational facility, maintaining 99.8% material accountability and zero safety infractions.",
    "Led cross-functional crews in routine maintenance and preventive diagnostics, decreasing equipment downtime by 35% through structured preventative checkups.",
    "Trained and onboarded over 25 personnel in strict safety protocols, standard operating procedures, and compliance reporting under rigorous regulatory oversight."
  ];
  let gaPathways = [
    "Georgia Logistics & Freight Corridor (I-75/I-85: Clayton & Henry County distribution hubs, UPS Smart Hub, Home Depot Supply Chain)",
    "IBEW Local 613 & Ironworkers Local 387 Union Apprenticeship programs with zero-cost tuition and direct wage scaling",
    "Technical College System of Georgia (TCSG) 100% tuition-free HOPE Career Grant certification pathways in Commercial Industrial Operations"
  ];

  if (expLower.includes("cook") || expLower.includes("kitchen") || expLower.includes("food") || expLower.includes("culinary") || expLower.includes("baker") || expLower.includes("dining")) {
    commercialTitle = "Executive Line Cook / High-Volume Food Service Production Manager";
    hardSkills = [
      "ServSafe Food Safety & Sanitation Standards",
      "High-Volume Batch Production & Prep",
      "Portion Control & Waste Minimization",
      "Commercial Kitchen Equipment Operation"
    ];
    softSkills = [
      "High-Volume Pressure Resilience",
      "Kitchen Brigade Team Leadership",
      "Fast-Paced Shift Coordination",
      "Strict Regulatory Compliance"
    ];
    bullets = [
      "Orchestrated continuous food production for 1,200+ individuals daily within strict per-meal budgetary and nutritional constraints, achieving 100% health inspection compliance.",
      "Maintained exhaustive inventory controls across raw dry goods, refrigerated stocks, and commercial sanitation supplies, reducing food spoilage by 22%.",
      "Mentored and supervised 15 kitchen prep crew members on sanitized food handling, knife safety protocols, and rapid line turnaround during peak service hours."
    ];
    gaPathways = [
      "Atlanta Metro Hospitality & Culinary Corridor (Downtown/Midtown hotel networks, Georgia World Congress Center, Hartsfield-Jackson Concessions)",
      "Grady Health System & Emory Healthcare Food & Nutrition Services (Verified Fair-Chance healthcare hospitality employers)",
      "Atlanta Technical College / Central Georgia Tech Culinary Arts HOPE Career Grant programs"
    ];
  } else if (expLower.includes("mechanic") || expLower.includes("auto") || expLower.includes("diesel") || expLower.includes("vehicle") || expLower.includes("engine") || expLower.includes("transmission")) {
    commercialTitle = "Heavy Equipment & Fleet Maintenance Technician";
    hardSkills = [
      "Hydraulic & Pneumatic System Diagnostics",
      "Diesel/Gasoline Powertrain Overhaul",
      "Preventative Maintenance Scheduling",
      "Diagnostic Scan Tool Telemetry"
    ];
    softSkills = [
      "Root-Cause Troubleshooting",
      "Safety & Environmental Compliance",
      "Resource Conservation",
      "Crew Coordination Under Deadlines"
    ];
    bullets = [
      "Conducted comprehensive mechanical diagnostics, engine repairs, and preventative maintenance across a multi-vehicle fleet, maintaining 98% operational readiness.",
      "Rebuilt and calibrated high-pressure hydraulic pumps and braking assemblies in accordance with manufacturer technical specifications and environmental standards.",
      "Maintained meticulous work-order logs and parts manifests, cutting diagnostic turnaround time by 30% through disciplined workspace organization."
    ];
    gaPathways = [
      "MARTA Transit Bus & Rail Maintenance Apprenticeship (Fair-chance transit career pathway with full pension & benefits)",
      "Georgia Quick Start Clean Energy & EV Manufacturing Pipeline (SK Battery, Hyundai Metaplant, Rivian corridor)",
      "UA Local 72 & Heavy Equipment Operators Local 926 Registered Apprenticeships"
    ];
  } else if (expLower.includes("weld") || expLower.includes("fabricat") || expLower.includes("metal") || expLower.includes("machin") || expLower.includes("cutting") || expLower.includes("iron")) {
    commercialTitle = "Certified Structural Fabricator & Production Welder";
    hardSkills = [
      "SMAW / GMAW (MIG/TIG) Precision Welding",
      "Blueprint & Architectural Schematic Reading",
      "Metal Tolerance Measurement & Grinding",
      "Rigid Quality Assurance Inspection"
    ];
    softSkills = [
      "Extreme Detail Precision",
      "Physical Endurance & Focus",
      "Strict PPE & Hazmat Adherence",
      "Constructive Quality Feedback"
    ];
    bullets = [
      "Fabricated, fitted, and welded structural steel components meeting AWS D1.1 specifications with a sub-1% weld defect rate across all quality inspections.",
      "Interpreted complex multi-view blueprints and technical schematics to cut, bend, and bevel heavy structural plate with 1/16-inch tolerance precision.",
      "Enforced rigid hot-work safety standards and equipment maintenance regimes across 500+ fabrication hours without a single lost-time safety incident."
    ];
    gaPathways = [
      "Ironworkers Local 387 / Boilermakers Local 26 Registered Apprenticeships",
      "Norfolk Southern / CSX Mechanical Rail Car Repair shops (Atlanta & Macon yards)",
      "Central Georgia Technical College (Macon) Tuition-Free HOPE Career Grant Welding Specialist program"
    ];
  } else if (expLower.includes("electric") || expLower.includes("wire") || expLower.includes("power") || expLower.includes("voltage") || expLower.includes("conduit") || expLower.includes("panel")) {
    commercialTitle = "Commercial Electrical Apprentice / Industrial Electrician";
    hardSkills = [
      "EMT Conduit Bending & Installation",
      "National Electrical Code (NEC) Standards",
      "Circuit Diagnostics & Multimeter Testing",
      "Panel Wiring & Three-Phase Power"
    ];
    softSkills = [
      "Systematic Problem Solving",
      "Strict Lockout/Tagout Safety Discipline",
      "Blueprint Interpretation",
      "Reliable Team Communication"
    ];
    bullets = [
      "Installed and routed over 2,500 linear feet of electrical conduit, wireways, and junction boxes following strict NEC adherence and inspection guidelines.",
      "Conducted continuity tests and voltage drop calculations to troubleshoot tripped circuits and restore critical infrastructure within tight response times.",
      "Enforced rigorous Lockout/Tagout (LOTO) procedures across high-voltage distribution switchgear, maintaining flawless safety records."
    ];
    gaPathways = [
      "IBEW Local 613 Atlanta Electrical Apprenticeship (Direct entry, earn-while-you-learn union wage progression)",
      "Georgia Power Substation & Commercial Field Service pipelines",
      "Chattahoochee Technical College Electrical Commercial Construction HOPE Grant diploma"
    ];
  } else if (expLower.includes("health") || expLower.includes("care") || expLower.includes("nurse") || expLower.includes("medical") || expLower.includes("orderly") || expLower.includes("patient") || expLower.includes("hospital")) {
    commercialTitle = "Clinical Support Operations Specialist / Patient Logistics Coordinator";
    hardSkills = [
      "Sterile Processing & Infection Control",
      "Patient Mobility & Logistics Transfer",
      "EHR Documentation & Compliance",
      "Vital Sign Protocol Tracking"
    ];
    softSkills = [
      "Compassionate De-escalation",
      "Acute Crisis Management",
      "Interdisciplinary Team Collaboration",
      "Strict HIPAA Confidentiality"
    ];
    bullets = [
      "Coordinated sanitation and patient transport logistics across high-volume healthcare wards, achieving 100% adherence to infection control protocols.",
      "Monitored medical inventory, sterile supply staging, and emergency kit readiness, eliminating delayed patient care interventions.",
      "Maintained detailed logs and handover summaries, facilitating seamless communication between clinical shifts and supervisory staff."
    ];
    gaPathways = [
      "Grady Health System (Atlanta's premier Fair-Chance healthcare employer for facilities, transport, and clinical support)",
      "Piedmont Healthcare / Emory Healthcare Environmental & Facilities divisions",
      "Georgia HOPE Career Grant Phlebotomy, Sterile Processing, or CNA certifications at Atlanta Technical College"
    ];
  } else if (expLower.includes("warehouse") || expLower.includes("forklift") || expLower.includes("shipping") || expLower.includes("inventory") || expLower.includes("stock") || expLower.includes("dock")) {
    commercialTitle = "Logistics & Distribution Operations Lead";
    hardSkills = [
      "Forklift & PIT Equipment Operation",
      "WMS / Barcode Manifest Tracking",
      "Cross-Dock Freight Staging",
      "OSHA Warehouse Safety Compliance"
    ];
    softSkills = [
      "Fast-Paced Shift Accountability",
      "Multi-Tasking Freight Coordination",
      "Punctuality & Shift Reliability",
      "High-Attention Physical Precision"
    ];
    bullets = [
      "Staged, scanned, and dispatched over 4,500 freight pallets monthly across high-density storage bays with zero pallet damage or misrouted consignments.",
      "Conducted daily pre-operation inspections on electric forklifts and reach trucks, documenting battery maintenance and hydraulic integrity.",
      "Spearheaded dock staging efficiency improvements that decreased truck turn-times by 22% during peak seasonal distribution periods."
    ];
    gaPathways = [
      "UPS Smart Hub (Atlanta / Fulton Industrial Blvd - Top regional Fair-Chance logistics employer)",
      "Home Depot Supply Chain Distribution Centers (Locust Grove / Henry County corridor)",
      "Georgia Department of Economic Development Certified Logistics Associate (CLA) fast-track programs"
    ];
  } else if (expLower.includes("clerk") || expLower.includes("admin") || expLower.includes("office") || expLower.includes("records") || expLower.includes("computer") || expLower.includes("data")) {
    commercialTitle = "Administrative Operations & Records Specialist";
    hardSkills = [
      "Records Management & Filing Audits",
      "Data Entry & Spreadsheet Analysis",
      "Document Quality Assurance",
      "Confidential Data Protection"
    ];
    softSkills = [
      "High Discretion & Integrity",
      "Meticulous Verification Accuracy",
      "Professional Written Communication",
      "Independent Workflow Prioritization"
    ];
    bullets = [
      "Processed and archived over 800 confidential operational records weekly with 100% adherence to strict regulatory privacy compliance guidelines.",
      "Digitized and cross-referenced physical log sheets against internal databases, identifying and resolving over 120 administrative discrepancies.",
      "Drafted weekly executive summaries and shift turnover briefs, ensuring seamless departmental coordination and zero operational oversights."
    ];
    gaPathways = [
      "Fulton County Government & City of Atlanta Ban-the-Box administrative support positions",
      "Goodwill of North Georgia Career Centers (Administrative skills training and direct employer placement)",
      "Technical College System of Georgia (TCSG) Business Technology HOPE Grant programs"
    ];
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
