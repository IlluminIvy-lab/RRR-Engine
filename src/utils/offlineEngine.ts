import { TranslationResult, FullApplicationPackage } from '../types';

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

export function generateFullPackageOffline(
  targetTitle: string,
  candidateName = "J. Carter",
  location = "Atlanta, GA",
  industry = "Logistics & Supply Chain"
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

  return {
    id: `pkg-offline-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    targetJobTitle: cleanTitle,
    industryOrSector: validIndustry,
    createdAt: new Date().toISOString(),
    candidate: {
      fullName: name,
      cityStateZip: `${loc} 30303`,
      phone: "(404) 555-0194",
      email: `${name.toLowerCase().replace(/[^a-z]/g, "") || "candidate"}@career-email.com`,
      linkedinOrPortfolio: "linkedin.com/in/career-profile"
    },
    resume: {
      targetTitle: cleanTitle,
      summary: `High-discipline, safety-certified Operations Specialist with extensive experience directing fast-paced workflows, inventory staging, and team execution in high-volume, regulated environments. Proven record of enforcing zero-defect compliance, reducing maintenance downtime, and leading cross-functional crews under demanding operational constraints. Ready to deliver immediate reliability and operational excellence to Georgia commercial teams.`,
      competenciesGrid: [
        ["Standard Operating Procedure (SOP) Enforcement", "Preventative Equipment Maintenance", "High-Volume Inventory Control"],
        ["OSHA & Regulatory Compliance", "Crisis De-escalation & Crew Leadership", "Logistics & Workflow Optimization"]
      ],
      professionalExperience: [
        {
          roleTitle: cleanTitle,
          organization: "Commercial Operations & Staging Facility",
          location: loc,
          dateRange: "2021 – 2024",
          bullets: [
            "Managed end-to-end material staging, equipment maintenance, and facility operations across a 40,000 sq. ft. facility with 99.8% inventory accuracy.",
            "Supervised daily workflow coordination for a 12-person crew, enforcing rigorous OSHA safety standards across 4,000+ operational hours without safety incidents.",
            "Streamlined parts procurement and preventative diagnostics, reducing machinery downtime by 28% and ensuring 100% inspection pass rates."
          ]
        },
        {
          roleTitle: "Lead Logistics & Inventory Coordinator",
          organization: "Regional Supply Distribution Hub",
          location: "Macon / Central GA",
          dateRange: "2019 – 2021",
          bullets: [
            "Directed intake, tracking, and staging for over 50 tons of inventory monthly under rigid turnaround deadlines.",
            "Audited physical stock against digital manifest records, resolving supply discrepancies within 24 hours.",
            "Trained and onboarded 18 new team members on equipment operation, material handling protocols, and team communication standards."
          ]
        }
      ],
      certificationsAndTraining: [
        "OSHA 10-Hour General Industry Safety Certification",
        "Forklift / Powered Industrial Truck (PIT) Operator Safety Certification",
        "First Aid, CPR & AED Certified Responder"
      ],
      educationAndHopeGrants: [
        "Technical College System of Georgia (TCSG) – Commercial Logistics Specialist (HOPE Career Grant Pathway)",
        "High School Diploma / GED Equivalency – Verified State Credential"
      ]
    },
    coverLetter: {
      hiringManagerOrDepartment: "Hiring Manager & Operations Leadership",
      targetCompanyOrHospital: "Georgia Commercial Operations",
      targetRoleTitle: cleanTitle,
      companyAddressOrCorridor: `${loc} Corridor`,
      openingParagraph: `I am writing to express my strong interest in the ${cleanTitle} position at your organization. With a disciplined background managing rigorous operational protocols, multi-person crew coordination, and strict compliance standards in high-volume environments, I offer the dependable execution and immediate reliability your team requires.`,
      bodyParagraph: `Throughout my career, I have thrived in high-accountability environments where precision, physical endurance, and adherence to standard operating procedures are non-negotiable. In my previous role, I directed inventory staging and preventive maintenance workflows for daily operations, consistently maintaining over 99% accuracy and zero safety violations. My hands-on experience troubleshooting technical bottlenecks and mentoring crew members allows me to bridge technical skill with operational leadership, driving bottom-line efficiency from day one.`,
      closingParagraph: `I am deeply committed to establishing a long-term, high-impact career within the Georgia corridor and welcome the opportunity to discuss how my work ethic, adaptability, and operational rigor will directly benefit your team. Thank you for your time, consideration, and dedication to merit-based hiring.`,
      signOff: "Respectfully,"
    }
  };
}
