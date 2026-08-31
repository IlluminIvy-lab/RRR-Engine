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

// Fallback Capability Translator in case API key is absent or offline
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
  let gaPathway = "Georgia Logistics & Industrial Operations Track (I-75/I-85 Freight Corridor: Clayton County, Henry County, Macon Distribution Hubs) with eligibility for Georgia HOPE Career Grant tuition-free commercial certifications.";

  if (expLower.includes("cook") || expLower.includes("kitchen") || expLower.includes("food") || expLower.includes("culinary")) {
    commercialTitle = "Executive Line Cook / High-Volume Food Service Production Manager";
    hardSkills = ["ServSafe Food Safety & Sanitation Standards", "High-Volume Batch Production & Prep", "Portion Control & Waste Minimization", "Commercial Kitchen Equipment Operation"];
    softSkills = ["High-Volume Pressure Resilience", "Kitchen Brigade Team Leadership", "Fast-Paced Shift Coordination", "Strict Regulatory Compliance"];
    bullets = [
      "Orchestrated continuous food production for 1,200+ individuals daily within strict per-meal budgetary and nutritional constraints, achieving 100% health inspection compliance.",
      "Maintained exhaustive inventory controls across raw dry goods, refrigerated stocks, and commercial sanitation supplies, reducing food spoilage by 22%.",
      "Mentored and supervised 15 kitchen prep crew members on sanitized food handling, knife safety protocols, and rapid line turnaround during peak service hours."
    ];
    gaPathway = "Fast-track Culinary & Commercial Food Management in the Atlanta Metro Hospitality Corridor (Downtown / Midtown Atlanta hotel chains, Hartsfield-Jackson concessionaires, and TCSG Atlanta Technical College Culinary Arts programs).";
  } else if (expLower.includes("mechanic") || expLower.includes("auto") || expLower.includes("diesel") || expLower.includes("vehicle")) {
    commercialTitle = "Heavy Equipment & Fleet Maintenance Technician";
    hardSkills = ["Hydraulic & Pneumatic System Diagnostics", "Diesel/Gasoline Powertrain Overhaul", "Preventative Maintenance Scheduling", "Diagnostic Scan Tool Telemetry"];
    softSkills = ["Root-Cause Troubleshooting", "Safety & Environmental Compliance", "Resource Conservation", "Crew Coordination Under Deadlines"];
    bullets = [
      "Conducted comprehensive mechanical diagnostics, engine repairs, and preventative maintenance across a multi-vehicle fleet, maintaining 98% operational readiness.",
      "Rebuilt and calibrated high-pressure hydraulic pumps and braking assemblies in accordance with manufacturer technical specifications and environmental standards.",
      "Maintained meticulous work-order logs and parts manifests, cutting diagnostic turnaround time by 30% through disciplined workspace organization."
    ];
    gaPathway = "MARTA Heavy Vehicle / Transit Bus Maintenance Apprenticeship & Georgia Quick Start Electric Vehicle (EV) battery manufacturing technician pipeline in Covington/Savannah/Macon.";
  } else if (expLower.includes("weld") || expLower.includes("fabricat") || expLower.includes("metal") || expLower.includes("machin")) {
    commercialTitle = "Certified Structural Fabricator & Production Welder";
    hardSkills = ["SMAW / GMAW (MIG/TIG) Precision Welding", "Blueprint & Architectural Schematic Reading", "Metal Tolerance Measurement & Grinding", "Rigid Quality Assurance Inspection"];
    softSkills = ["Extreme Detail Precision", "Physical Endurance & Focus", "Strict PPE & Hazmat Adherence", "Constructive Quality Feedback"];
    bullets = [
      "Fabricated, fitted, and welded structural steel components meeting AWS D1.1 specifications with a sub-1% weld defect rate across all quality inspections.",
      "Interpreted complex multi-view blueprints and technical schematics to cut, bend, and bevel heavy structural plate with 1/16-inch tolerance precision.",
      "Enforced rigid hot-work safety standards and equipment maintenance regimes across 500+ fabrication hours without a single lost-time safety incident."
    ];
    gaPathway = "IBEW Local 613 / Ironworkers Local 387 Apprenticeship or Technical College System of Georgia (Central Georgia Tech in Macon or Chattahoochee Tech) tuition-free Welding Specialist certificate.";
  } else if (expLower.includes("electric") || expLower.includes("wire") || expLower.includes("power") || expLower.includes("voltage")) {
    commercialTitle = "Commercial Electrical Apprentice / Industrial Electrician";
    hardSkills = ["EMT Conduit Bending & Installation", "National Electrical Code (NEC) Standards", "Circuit Diagnostics & Multimeter Testing", "Panel Wiring & Three-Phase Power"];
    softSkills = ["Systematic Problem Solving", "Strict Lockout/Tagout Safety Discipline", "Blueprint Interpretation", "Reliable Team Communication"];
    bullets = [
      "Installed and routed over 2,500 linear feet of electrical conduit, wireways, and junction boxes following strict NEC adherence and inspection guidelines.",
      "Conducted continuity tests and voltage drop calculations to troubleshoot tripped circuits and restore critical infrastructure within tight response times.",
      "Enforced rigorous Lockout/Tagout (LOTO) procedures across high-voltage distribution switchgear, maintaining flawless safety records."
    ];
    gaPathway = "IBEW Local 613 Electrical Apprenticeship (Atlanta/North GA) and Georgia Power apprentice programs with direct entry and union wage progression.";
  } else if (expLower.includes("law") || expLower.includes("clerk") || expLower.includes("admin") || expLower.includes("librar") || expLower.includes("record")) {
    commercialTitle = "Legal Operations Coordinator / Records & Compliance Analyst";
    hardSkills = ["Document Classification & Retention", "Legal Research (LexisNexis/Westlaw)", "Case Management & Docketing", "Database Entry & Quality Audit"];
    softSkills = ["Confidentiality & Discretion", "Complex Information Synthesis", "High-Agency Case Organization", "Clear Professional Correspondence"];
    bullets = [
      "Cataloged, indexed, and audited over 10,000 legal documents, filings, and reference materials with zero filing errors, ensuring compliance with state and federal standards.",
      "Conducted in-depth statutory and case-law research for over 200 inquiries, delivering clear synthesis memoranda and relevant precedent cross-references.",
      "Managed administrative intake workflows and digitized physical archives, reducing record retrieval latency from hours to under 3 minutes."
    ];
    gaPathway = "Paralegal / Compliance Specialist track through Atlanta Bar Association Reentry Initiatives, State of Georgia government administration, or Georgia Tech / GSU continuing education programs.";
  }

  return {
    commercialTitle,
    competencies: {
      hardSkills,
      softSkills
    },
    resumeBullets: bullets,
    gaPathway
  };
}

// MODE 1: Capability Translator API
app.post("/api/translate-capability", async (req, res) => {
  try {
    const { experience } = req.body;
    if (!experience || typeof experience !== "string" || experience.trim().length === 0) {
      return res.status(400).json({ error: "Experience text is required." });
    }

    const ai = getAI();
    if (!ai) {
      // Fallback
      return res.json(fallbackTranslate(experience));
    }

    const systemInstruction = `You are the RRR Capability Engine & Reentry Decision System.
Your core job is to run MODE 1: CAPABILITY TRANSLATOR.
When the user shares institutional experience, past duties, or trade work:
1. COMMERCIAL ALIGNMENT: Provide the industry-standard corporate/trade job title.
2. COMPETENCIES: List 4 hard and 4 soft skills extracted from the experience.
3. RESUME BULLETS: Write 3 high-impact, action-driven achievement bullets with clear outcomes and quantified metrics where appropriate.
4. GA CAREER PATHWAY: Identify the fastest-hiring trade, apprenticeship, or commercial track in the Georgia/Atlanta/Macon corridor (e.g. MARTA, IBEW Local 613, TCSG HOPE Career Grant, Quick Start GA, logistics corridor).

Maintain a professional, structured, high-agency tone. Never use generic corporate jargon. Return pure JSON matching the requested schema.`;

    const prompt = `Translate this institutional experience/work into commercial standard:\n\n"""\n${experience}\n"""`;

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
              description: "Industry-standard corporate or trade job title."
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
              description: "3 high-impact, action-driven achievement bullets with clear outcomes."
            },
            gaPathway: {
              type: Type.STRING,
              description: "Fastest-hiring trade, apprenticeship, or commercial track in the Georgia/Atlanta/Macon corridor."
            }
          },
          required: ["commercialTitle", "competencies", "resumeBullets", "gaPathway"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return res.json(fallbackTranslate(experience));
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Translation API error:", err);
    // Graceful fallback
    const { experience } = req.body;
    return res.json(fallbackTranslate(experience || "General operations and maintenance"));
  }
});

// MODE 2: Dynamic Decision Step Generator API (Optional AI-assisted or standard)
app.post("/api/decision-chat", async (req, res) => {
  try {
    const { history, userChoice, currentPhase } = req.body;
    const ai = getAI();
    if (!ai) {
      return res.json({
        feedback: "Acknowledged your selection. Proceeding to immediate Georgia corridor action protocol.",
        nextStep: null
      });
    }

    const prompt = `You are the RRR Reentry Decision System.
Current Phase: ${currentPhase || "Day 1-3"}
User choice: ${userChoice}
Interaction history: ${JSON.stringify(history || [])}

Provide immediate feedback and context for the Georgia/Atlanta/Macon corridor, maintaining a professional, structured, high-agency tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the RRR Capability Engine & Reentry Decision System. High-agency, concise, actionable advice for Georgia reentry without corporate jargon."
      }
    });

    return res.json({
      feedback: response.text?.trim() || "Advancing to next targeted action."
    });
  } catch (err) {
    return res.json({ feedback: "Advancing to next strategic milestone in Georgia corridor." });
  }
});

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", engine: "RRR Capability & Decision System", timestamp: new Date().toISOString() });
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
    console.log(`RRR Capability Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
