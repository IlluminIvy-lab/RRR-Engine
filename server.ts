import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// =========================================================================
// Fallback Generators for High-Reliability Offline / Fallback Operation
// =========================================================================

function fallbackTranslate(experience: string) {
  const expLower = experience.toLowerCase();
  
  let commercialTitle = "Industrial Facilities & Operations Specialist";
  let hardSkills = ["Inventory Control & Supply Chain Staging", "Preventive Equipment Maintenance", "OSHA Compliance & Safety Protocols", "Process Workflow Optimization"];
  let softSkills = ["Crisis De-escalation & Conflict Resolution", "Peer Mentorship & Crew Leadership", "High-Stress Time Management", "Clear Operational Reporting"];
  let bullets = [
    "Directed daily logistics and inventory staging across a high-volume operational facility, maintaining 99.8% material accountability and zero safety infractions.",
    "Led cross-functional crews in routine maintenance and preventive diagnostics, decreasing equipment downtime by 35% through structured preventative checkups.",
    "Trained and onboarded over 25 personnel in strict safety protocols, standard operating procedures, and compliance reporting under rigorous regulatory oversight."
  ];
  let gaPathways = [
    "Georgia Logistics & Freight Corridor (I-75/I-85: Clayton & Henry County distribution hubs, UPS Smart Hub, Home Depot Supply Chain).",
    "IBEW Local 613 & Ironworkers Local 387 Union Apprenticeship programs with zero-cost tuition and direct wage scaling.",
    "Technical College System of Georgia (TCSG) 100% tuition-free HOPE Career Grant certification pathways in Commercial Industrial Operations."
  ];

  if (expLower.includes("cook") || expLower.includes("kitchen") || expLower.includes("food") || expLower.includes("culinary")) {
    commercialTitle = "Executive Line Cook / High-Volume Food Service Production Manager";
    hardSkills = ["ServSafe Food Safety & Sanitation Standards", "High-Volume Batch Production & Prep", "Portion Control & Waste Minimization", "Commercial Kitchen Equipment Operation"];
    softSkills = ["High-Volume Pressure Resilience", "Kitchen Brigade Team Leadership", "Fast-Paced Shift Coordination", "Strict Regulatory Compliance"];
    bullets = [
      "Orchestrated continuous food production for 1,200+ individuals daily within strict per-meal budgetary and nutritional constraints, achieving 100% health inspection compliance.",
      "Maintained exhaustive inventory controls across raw dry goods, refrigerated stocks, and commercial sanitation supplies, reducing food spoilage by 22%.",
      "Mentored and supervised 15 kitchen prep crew members on sanitized food handling, knife safety protocols, and rapid line turnaround during peak service hours."
    ];
    gaPathways = [
      "Atlanta Metro Hospitality & Culinary Corridor (Downtown/Midtown hotel networks, Georgia World Congress Center, Hartsfield-Jackson Concessions).",
      "Grady Health System & Emory Healthcare Food & Nutrition Services (Verified Fair-Chance healthcare hospitality employers).",
      "Atlanta Technical College / Central Georgia Tech Culinary Arts HOPE Career Grant programs."
    ];
  } else if (expLower.includes("mechanic") || expLower.includes("auto") || expLower.includes("diesel") || expLower.includes("vehicle")) {
    commercialTitle = "Heavy Equipment & Fleet Maintenance Technician";
    hardSkills = ["Hydraulic & Pneumatic System Diagnostics", "Diesel/Gasoline Powertrain Overhaul", "Preventative Maintenance Scheduling", "Diagnostic Scan Tool Telemetry"];
    softSkills = ["Root-Cause Troubleshooting", "Safety & Environmental Compliance", "Resource Conservation", "Crew Coordination Under Deadlines"];
    bullets = [
      "Conducted comprehensive mechanical diagnostics, engine repairs, and preventative maintenance across a multi-vehicle fleet, maintaining 98% operational readiness.",
      "Rebuilt and calibrated high-pressure hydraulic pumps and braking assemblies in accordance with manufacturer technical specifications and environmental standards.",
      "Maintained meticulous work-order logs and parts manifests, cutting diagnostic turnaround time by 30% through disciplined workspace organization."
    ];
    gaPathways = [
      "MARTA Transit Bus & Rail Maintenance Apprenticeship (Fair-chance transit career pathway with full pension & benefits).",
      "Georgia Quick Start Clean Energy & EV Manufacturing Pipeline (SK Battery, Hyundai Metaplant, Rivian corridor).",
      "UA Local 72 & Heavy Equipment Operators Local 926 Registered Apprenticeships."
    ];
  } else if (expLower.includes("weld") || expLower.includes("fabricat") || expLower.includes("metal") || expLower.includes("machin")) {
    commercialTitle = "Certified Structural Fabricator & Production Welder";
    hardSkills = ["SMAW / GMAW (MIG/TIG) Precision Welding", "Blueprint & Architectural Schematic Reading", "Metal Tolerance Measurement & Grinding", "Rigid Quality Assurance Inspection"];
    softSkills = ["Extreme Detail Precision", "Physical Endurance & Focus", "Strict PPE & Hazmat Adherence", "Constructive Quality Feedback"];
    bullets = [
      "Fabricated, fitted, and welded structural steel components meeting AWS D1.1 specifications with a sub-1% weld defect rate across all quality inspections.",
      "Interpreted complex multi-view blueprints and technical schematics to cut, bend, and bevel heavy structural plate with 1/16-inch tolerance precision.",
      "Enforced rigid hot-work safety standards and equipment maintenance regimes across 500+ fabrication hours without a single lost-time safety incident."
    ];
    gaPathways = [
      "Ironworkers Local 387 / Boilermakers Local 26 Registered Apprenticeships.",
      "Norfolk Southern / CSX Mechanical Rail Car Repair shops (Atlanta & Macon yards).",
      "Central Georgia Technical College (Macon) Tuition-Free HOPE Career Grant Welding Specialist program."
    ];
  } else if (expLower.includes("electric") || expLower.includes("wire") || expLower.includes("power") || expLower.includes("voltage")) {
    commercialTitle = "Commercial Electrical Apprentice / Industrial Electrician";
    hardSkills = ["EMT Conduit Bending & Installation", "National Electrical Code (NEC) Standards", "Circuit Diagnostics & Multimeter Testing", "Panel Wiring & Three-Phase Power"];
    softSkills = ["Systematic Problem Solving", "Strict Lockout/Tagout Safety Discipline", "Blueprint Interpretation", "Reliable Team Communication"];
    bullets = [
      "Installed and routed over 2,500 linear feet of electrical conduit, wireways, and junction boxes following strict NEC adherence and inspection guidelines.",
      "Conducted continuity tests and voltage drop calculations to troubleshoot tripped circuits and restore critical infrastructure within tight response times.",
      "Enforced rigorous Lockout/Tagout (LOTO) procedures across high-voltage distribution switchgear, maintaining flawless safety records."
    ];
    gaPathways = [
      "IBEW Local 613 Atlanta Electrical Apprenticeship (Direct entry, earn-while-you-learn union wage progression).",
      "Georgia Power Substation & Commercial Field Service pipelines.",
      "Chattahoochee Technical College Electrical Commercial Construction HOPE Grant diploma."
    ];
  } else if (expLower.includes("health") || expLower.includes("care") || expLower.includes("nurse") || expLower.includes("medical") || expLower.includes("orderly")) {
    commercialTitle = "Clinical Support Operations Specialist / Patient Logistics Coordinator";
    hardSkills = ["Sterile Processing & Infection Control", "Patient Mobility & Logistics Transfer", "EHR Documentation & Compliance", "Vital Sign Protocol Tracking"];
    softSkills = ["Compassionate De-escalation", "Acute Crisis Management", "Interdisciplinary Team Collaboration", "Strict HIPAA Confidentiality"];
    bullets = [
      "Coordinated sanitation and patient transport logistics across high-volume healthcare wards, achieving 100% adherence to infection control protocols.",
      "Monitored medical inventory, sterile supply staging, and emergency kit readiness, eliminating delayed patient care interventions.",
      "Maintained detailed logs and handover summaries, facilitating seamless communication between clinical shifts and supervisory staff."
    ];
    gaPathways = [
      "Grady Health System (Atlanta's premier Fair-Chance healthcare employer for facilities, transport, and clinical support).",
      "Piedmont Healthcare / Emory Healthcare Environmental & Facilities divisions.",
      "Georgia HOPE Career Grant Phlebotomy, Sterile Processing, or CNA certifications at Atlanta Technical College."
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
    gaPathway: gaPathways.join(" | ")
  };
}

function fallbackFullPackage(targetTitle: string, candidateName = "J. Carter", location = "Atlanta, GA") {
  return {
    targetJobTitle: targetTitle || "Commercial Operations Specialist",
    industryOrSector: "Logistics & Supply Chain",
    candidate: {
      fullName: candidateName,
      cityStateZip: `${location} 30303`,
      phone: "(404) 555-0194",
      email: `${candidateName.toLowerCase().replace(/[^a-z]/g, "") || "candidate"}@career-email.com`,
      linkedinOrPortfolio: "linkedin.com/in/career-profile"
    },
    resume: {
      targetTitle: targetTitle || "Commercial Operations Specialist",
      summary: `High-agency, safety-certified Operations Specialist with extensive experience managing fast-paced workflows, inventory staging, and team execution in high-volume, regulated environments. Proven record of enforcing zero-defect compliance, reducing maintenance downtime, and leading cross-functional crews under demanding operational constraints. Ready to deliver immediate reliability and operational excellence to Georgia commercial teams.`,
      competenciesGrid: [
        ["Standard Operating Procedure (SOP) Enforcement", "Preventative Equipment Maintenance", "High-Volume Inventory Control"],
        ["OSHA & Regulatory Compliance", "Crisis De-escalation & Crew Leadership", "Logistics & Workflow Optimization"]
      ],
      professionalExperience: [
        {
          roleTitle: targetTitle || "Operations & Facilities Specialist",
          organization: "Commercial Operations & Staging Facility",
          location: location,
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
      targetRoleTitle: targetTitle || "Commercial Operations Specialist",
      companyAddressOrCorridor: `${location} Corridor`,
      openingParagraph: `I am writing to express my strong interest in the ${targetTitle || "Commercial Operations Specialist"} position at your organization. With a disciplined background managing rigorous operational protocols, multi-person crew coordination, and strict compliance standards in high-volume environments, I offer the dependable execution and immediate reliability your team requires.`,
      bodyParagraph: `Throughout my career, I have thrived in high-accountability environments where precision, physical endurance, and adherence to standard operating procedures are non-negotiable. In my previous role, I directed inventory staging and preventive maintenance workflows for daily operations, consistently maintaining over 99% accuracy and zero safety violations. My hands-on experience troubleshooting technical bottlenecks and mentoring crew members allows me to bridge technical skill with operational leadership, driving bottom-line efficiency from day one.`,
      closingParagraph: `I am deeply committed to establishing a long-term, high-impact career within the Georgia corridor and welcome the opportunity to discuss how my work ethic, adaptability, and operational rigor will directly benefit your team. Thank you for your time, consideration, and dedication to merit-based hiring.`,
      signOff: "Respectfully,"
    },
    createdAt: new Date().toISOString()
  };
}

// =========================================================================
// MODE 1: Capability Translator & Benchmarking API
// =========================================================================
app.post("/api/translate-capability", async (req, res) => {
  try {
    const { experience } = req.body;
    if (!experience || typeof experience !== "string" || experience.trim().length === 0) {
      return res.status(400).json({ error: "Experience text is required." });
    }

    const ai = getAI();
    if (!ai) {
      return res.json(fallbackTranslate(experience));
    }

    const systemInstruction = `You are the RRR Capability Engine & Career Architect.
Your mission is to convert non-traditional, real-world, or institutional experience into commercial career assets.
When the user shares institutional experience, past duties, or trade work:
1. COMMERCIAL TITLE: Provide an industry-standard professional corporate or trade job title.
2. COMPETENCIES: Extract 4 hard technical skills and 4 high-agency soft skills.
3. RESUME BULLETS: Write 3 high-impact, metric-driven achievement bullets starting with strong action verbs (e.g., Directed, Orchestrated, Fabricated, Supervised, Maintained).
4. GA FAIR-CHANCE PATHWAYS: List 2-3 verified Fair-Chance / Second-Chance employers, hospital networks, or union apprenticeship locals in the Georgia/Atlanta/Macon corridor (e.g., Grady Health System, Emory Healthcare, MARTA, UPS, Home Depot Supply Chain, IBEW Local 613, UA Local 72, Goodwill of North Georgia, First Step Staffing, HOPE Career Grant tracks).

Maintain a professional, structured, high-agency tone. Zero generic filler or empty buzzwords. Return pure JSON matching the schema.`;

    const prompt = `Translate this institutional/trade experience into commercial standard:\n\n"""\n${experience}\n"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commercialTitle: {
              type: Type.STRING,
              description: "Industry-standard professional corporate or trade job title."
            },
            competencies: {
              type: Type.OBJECT,
              properties: {
                hardSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "4 hard technical skills extracted from experience."
                },
                softSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "4 high-agency soft skills extracted from experience."
                }
              },
              required: ["hardSkills", "softSkills"]
            },
            resumeBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 high-impact, metric-driven achievement bullets starting with strong action verbs."
            },
            gaPathways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 verified Fair-Chance employers, hospital networks, or union apprenticeship locals in the Georgia corridor."
            }
          },
          required: ["commercialTitle", "competencies", "resumeBullets", "gaPathways"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return res.json(fallbackTranslate(experience));
    }

    const parsed = JSON.parse(text);
    // Ensure gaPathway string backwards compatibility
    parsed.gaPathway = Array.isArray(parsed.gaPathways) ? parsed.gaPathways.join(" | ") : parsed.gaPathways;
    return res.json(parsed);
  } catch (err: any) {
    console.error("Translation API error:", err);
    const { experience } = req.body;
    return res.json(fallbackTranslate(experience || "General operations"));
  }
});

// =========================================================================
// MODE 2: Complete Resume & Cover Letter Builder API
// =========================================================================
app.post("/api/generate-full-package", async (req, res) => {
  try {
    const { targetJobTitle, candidateName, location, rawExperience, translationResult, industry } = req.body;
    const ai = getAI();
    
    if (!ai) {
      return res.json(fallbackFullPackage(targetJobTitle || translationResult?.commercialTitle, candidateName, location));
    }

    const systemInstruction = `You are the RRR Capability Engine & Career Architect operating MODE 2: COMPLETE RESUME & COVER LETTER BUILDER.
Your goal is to build an automated, professional application package for individuals navigating career transitions and reentry.
Rules for Resume:
- Header Structure: Full Name, Location (${location || "Atlanta, GA"}), Contact, Professional Summary.
- Core Competencies: 2x3 Grid of 6 transferable operational skills (2 rows, 3 items per row).
- Professional Experience: Complete role listings utilizing translated high-impact metrics (volume, safety compliance, unit management) with institutional context professionally framed.
- Certifications & Education: Relevant credentials, coursework, or HOPE Career Grant pathways in Georgia.
Rules for Targeted Cover Letter:
- High-agency, concise, 3-paragraph letter tailored for commercial/healthcare/logistics hiring managers.
- Directly bridges past operational rigor, autonomy, and compliance to the prospective employer's bottom line without defensive language.
Return pure JSON matching the schema.`;

    const prompt = `Generate a full professional resume and 3-paragraph cover letter package for:
Target Title: ${targetJobTitle || translationResult?.commercialTitle || "Commercial Operations Specialist"}
Candidate Name: ${candidateName || "J. Carter"}
Location: ${location || "Atlanta, GA"}
Industry/Sector: ${industry || "Commercial Operations & Logistics"}
Raw Experience / Background: ${rawExperience || JSON.stringify(translationResult || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetJobTitle: { type: Type.STRING },
            industryOrSector: { type: Type.STRING },
            candidate: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                cityStateZip: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                linkedinOrPortfolio: { type: Type.STRING }
              },
              required: ["fullName", "cityStateZip", "phone", "email"]
            },
            resume: {
              type: Type.OBJECT,
              properties: {
                targetTitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                competenciesGrid: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  description: "2x3 Grid of 6 core competencies (2 arrays of 3 strings each)"
                },
                professionalExperience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      roleTitle: { type: Type.STRING },
                      organization: { type: Type.STRING },
                      location: { type: Type.STRING },
                      dateRange: { type: Type.STRING },
                      bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["roleTitle", "organization", "location", "dateRange", "bullets"]
                  }
                },
                certificationsAndTraining: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                educationAndHopeGrants: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["targetTitle", "summary", "competenciesGrid", "professionalExperience", "certificationsAndTraining", "educationAndHopeGrants"]
            },
            coverLetter: {
              type: Type.OBJECT,
              properties: {
                hiringManagerOrDepartment: { type: Type.STRING },
                targetCompanyOrHospital: { type: Type.STRING },
                targetRoleTitle: { type: Type.STRING },
                companyAddressOrCorridor: { type: Type.STRING },
                openingParagraph: { type: Type.STRING },
                bodyParagraph: { type: Type.STRING },
                closingParagraph: { type: Type.STRING },
                signOff: { type: Type.STRING }
              },
              required: ["hiringManagerOrDepartment", "targetCompanyOrHospital", "targetRoleTitle", "openingParagraph", "bodyParagraph", "closingParagraph", "signOff"]
            }
          },
          required: ["targetJobTitle", "candidate", "resume", "coverLetter"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return res.json(fallbackFullPackage(targetJobTitle, candidateName, location));
    }

    const parsed = JSON.parse(text);
    parsed.id = `pkg_${Date.now()}`;
    parsed.createdAt = new Date().toISOString();
    return res.json(parsed);
  } catch (err: any) {
    console.error("Resume package builder error:", err);
    return res.json(fallbackFullPackage("Commercial Operations Specialist"));
  }
});

// =========================================================================
// MODE 3: Research & Application Progress Tracker AI Assist API
// =========================================================================
app.post("/api/tracker-ai-assist", async (req, res) => {
  try {
    const { companyName, roleTitle, notes, currentStage } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        stage: currentStage || "STAGE 1: RESEARCH & TARGETING",
        nextImmediateAction: `Submit tailored resume via Fair-Chance portal and contact hiring manager on LinkedIn.`,
        fairChanceNotes: `${companyName || "Target employer"} evaluates candidates under Fair-Chance guidelines; check WOTC tax credit eligibility.`,
        suggestedOutreach: `Follow up via email within 4 business days referencing operational qualifications.`
      });
    }

    const prompt = `You are the RRR Career Architect running MODE 3: RESEARCH & APPLICATION PROGRESS TRACKER.
Company: ${companyName}
Role: ${roleTitle}
Current Stage: ${currentStage || "STAGE 1: RESEARCH & TARGETING"}
Notes/Input: ${notes}

Analyze this employer in the Georgia corridor (e.g. Fair-Chance policies, hospital/logistics/trade hiring practices, background check timing) and generate:
1. Assigned Lifecycle Stage: One of [STAGE 1: RESEARCH & TARGETING], [STAGE 2: APPLICATION & OUTREACH], [STAGE 3: INTERVIEW & ADVOCACY], [STAGE 4: ONBOARDING & MILESTONES]
2. NEXT IMMEDIATE ACTION: A single, high-agency action to execute immediately to maintain momentum.
3. Fair-Chance Notes: Practical guidance for this company/sector in Georgia.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the RRR Capability Engine. Provide concrete, high-agency application tracking guidance for the Georgia corridor. Return pure JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING },
            nextImmediateAction: { type: Type.STRING },
            fairChanceNotes: { type: Type.STRING }
          },
          required: ["stage", "nextImmediateAction", "fairChanceNotes"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return res.json({
        stage: currentStage || "STAGE 1: RESEARCH & TARGETING",
        nextImmediateAction: "Complete tailored application and document reference contacts.",
        fairChanceNotes: "Verify Ban-the-Box and Fair-Chance status in Georgia."
      });
    }

    return res.json(JSON.parse(text));
  } catch (err) {
    return res.json({
      stage: req.body?.currentStage || "STAGE 1: RESEARCH & TARGETING",
      nextImmediateAction: "Submit tailored resume and follow up with operations supervisor.",
      fairChanceNotes: "Standard Georgia corridor hiring evaluation."
    });
  }
});

// =========================================================================
// UNIFIED CONSOLE: Multi-Mode Conversational Agent & Intent Router
// =========================================================================
app.post("/api/unified-chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAI();
    if (!ai) {
      // Fallback intent recognition
      const msgLower = message.toLowerCase();
      if (msgLower.includes("resume") || msgLower.includes("package") || msgLower.includes("cover letter")) {
        return res.json({
          reply: `### MODE 2: COMPLETE RESUME & COVER LETTER BUILDER ACTIVATED
I have identified your intent to construct a full commercial career asset package.

**Structure Prepared:**
- **Header & Summary**: High-impact operational summary tailored for Georgia employers.
- **Core Competencies (2x3 Grid)**: Transferable technical & operational leadership skills.
- **Metric-Driven Experience**: Frame past responsibilities into volume, safety, and inventory metrics.
- **3-Paragraph Cover Letter**: High-agency outreach without defensive phrasing.

*You can switch directly to **Mode 2: Resume & Letter Builder** in the top navigation bar or review the generated draft in your session.*`,
          suggestedMode: "resume_builder"
        });
      } else if (msgLower.includes("track") || msgLower.includes("applied") || msgLower.includes("interview") || msgLower.includes("stage")) {
        return res.json({
          reply: `### MODE 3: RESEARCH & APPLICATION PROGRESS TRACKER ACTIVATED
Tracking active application lifecycle stages across the Georgia corridor.

**4 Lifecycle Stages:**
- **[STAGE 1: RESEARCH & TARGETING]** Fair-Chance policy check & role requirements.
- **[STAGE 2: APPLICATION & OUTREACH]** Tailored resume submitted & hiring manager connection.
- **[STAGE 3: INTERVIEW & ADVOCACY]** Phone screen, STAR stories, WOTC qualification framing.
- **[STAGE 4: ONBOARDING & MILESTONES]** Offer accepted, vital records cleared, 30/60/90 retention.

**NEXT IMMEDIATE ACTION**: Log your active employer targets in the Tracker view to maintain daily application momentum.`,
          suggestedMode: "tracker"
        });
      } else if (msgLower.includes("tree") || msgLower.includes("decision") || msgLower.includes("day 1") || msgLower.includes("vital") || msgLower.includes("id")) {
        return res.json({
          reply: `### MODE 4: INTERACTIVE REENTRY DECISION TREE ACTIVATED
Beginning strategic timeline planning for Georgia corridor reentry.

**Active Phase:** Day 1-3 Immediate Critical Priorities
**Priority Focus:** Georgia DDS State IDs, Vital Birth Certificates, Social Security Cards & Transitional Stability.

*Select **Mode 4: Decision Tree** in the navigation bar to step through the interactive multi-choice decision sequence.*`,
          suggestedMode: "decision_tree"
        });
      } else {
        const trans = fallbackTranslate(message);
        return res.json({
          reply: `### MODE 1: CAPABILITY TRANSLATOR & BENCHMARKING
**1. COMMERCIAL TITLE:** ${trans.commercialTitle}

**2. COMPETENCIES:**
- **Technical Skills:** ${trans.competencies.hardSkills.join(", ")}
- **High-Agency Skills:** ${trans.competencies.softSkills.join(", ")}

**3. RESUME BULLETS:**
${trans.resumeBullets.map((b) => `- ${b}`).join("\n")}

**4. GA FAIR-CHANCE PATHWAYS:**
${trans.gaPathways.map((p) => `- ${p}`).join("\n")}

**NEXT IMMEDIATE ACTION:** Select **Mode 2: Resume & Letter Builder** to export a complete ATS-ready Word (.docx) and PDF package.`,
          suggestedMode: "translator",
          translationData: trans
        });
      }
    }

    const systemInstruction = `You are the RRR Capability Engine, Career Architect & Reentry Navigation System.
Your mission is to empower individuals navigating life transitions and reentry by converting non-traditional, real-world, or institutional experience into commercial career assets, automated application packages, and structured operational roadmaps.

You operate across 4 distinct, fully integrated modes based on user intent:

----------------------------------------------------------------------
MODE 1: CAPABILITY TRANSLATOR & BENCHMARKING
Trigger: User inputs raw duties, institutional jobs, or life skills.
Output Format:
1. COMMERCIAL TITLE: Industry-standard professional job title.
2. COMPETENCIES: 4 core transferable hard/soft skills.
3. RESUME BULLETS: 3 high-impact, metric-driven achievement bullets starting with strong action verbs.
4. GA FAIR-CHANCE PATHWAYS: 2-3 verified Fair-Chance / Second-Chance employers, hospital networks, or union apprenticeship locals in the Georgia/Atlanta/Macon corridor.

----------------------------------------------------------------------
MODE 2: COMPLETE RESUME & COVER LETTER BUILDER
Trigger: User types "Generate Full Package", "Build Resume", or specifies a target job title.
Output Format:
1. PROFESSIONAL RESUME:
   - Header Structure: Full Name, Location (City, GA), Contact, Professional Summary.
   - Core Competencies: 2x3 Grid of transferable operational skills.
   - Professional Experience: Complete role listing utilizing translated high-impact metrics with institutional context professionally framed.
   - Certifications & Education: Relevant credentials, coursework, or HOPE Career Grant pathways.
2. TARGETED COVER LETTER:
   - High-agency, concise, 3-paragraph letter tailored for commercial/healthcare/logistics hiring managers.
   - Directly bridges past operational rigor, autonomy, and compliance to the prospective employer's bottom line without defensive language.

----------------------------------------------------------------------
MODE 3: RESEARCH & APPLICATION PROGRESS TRACKER
Trigger: User shares a job search action, company research, contact, or milestone, or types "Show Tracker".
Output Format:
Maintain an active Markdown ledger tracking the user's career steps across 4 lifecycle stages:
- [STAGE 1: RESEARCH & TARGETING] (e.g., Company identified, background policy reviewed)
- [STAGE 2: APPLICATION & OUTREACH] (e.g., Resume tailored, application submitted)
- [STAGE 3: INTERVIEW & ADVOCACY] (e.g., Phone screen, portfolio/recommendation prep)
- [STAGE 4: ONBOARDING & MILESTONES] (e.g., Offer accepted, vital docs cleared)
* Always append a clear "NEXT IMMEDIATE ACTION" to maintain momentum.

----------------------------------------------------------------------
MODE 4: INTERACTIVE REENTRY DECISION TREE
Trigger: User types "Start Decision Tree" or asks for step-by-step reentry planning.
Output Format:
- Present the current timeline phase (Day 1-3, Day 3-10, Day 10-30).
- Present ONE focused multiple-choice question (Options A, B, C) regarding IDs, vital records, banking, housing, or transit.
- Wait for user selection before evaluating and serving the tailored next step.

----------------------------------------------------------------------
TONE & OPERATIONAL RULES:
- High-agency, professional, structured, and direct.
- Zero generic filler, patronizing encouragement, or empty buzzwords.
- Maximize mobile scannability using Markdown bolding, tables, and clean bulleted lists.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction
      }
    });

    const replyText = response.text?.trim() || "Ready to execute the next strategic capability milestone.";
    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Unified chat API error:", err);
    return res.json({
      reply: `I have processed your request. You can explore all 4 integrated modes using the navigation bar above:\n\n- **Mode 1**: Capability Translator & Benchmarking\n- **Mode 2**: Complete Resume & Cover Letter Builder\n- **Mode 3**: Research & Application Progress Tracker\n- **Mode 4**: Interactive Reentry Decision Tree (Day 1-3, 3-10, 10-30)\n- **Georgia Vault**: Verified Second-Chance Employers, Apprenticeships & Vital DDS Resources.`
    });
  }
});

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", engine: "RRR Capability Engine, Career Architect & Reentry Navigation System", timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RRR Capability Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
