import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { translateCapabilityOffline, generateFullPackageOffline } from './src/utils/offlineEngine';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Google GenAI client lazily with process.env.GEMINI_API_KEY
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', engine: 'RRR Capability Engine' });
  });

  // -------------------------------------------------------------
  // MODE 1: CAPABILITY TRANSLATOR & BENCHMARKING
  // -------------------------------------------------------------
  app.post('/api/translate-capability', async (req, res) => {
    const { experience } = req.body;
    if (!experience || typeof experience !== 'string') {
      return res.status(400).json({ error: 'Experience description is required' });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the RRR Capability Engine & Career Architect.
Your task is MODE 1: CAPABILITY TRANSLATOR & BENCHMARKING.
Convert the provided raw duties, institutional jobs, or life skills into high-agency, commercial career assets.

INPUT EXPERIENCE:
"${experience}"

Strict Output Requirements:
1. COMMERCIAL TITLE: Industry-standard professional job title.
2. COMPETENCIES: Exactly 4 core technical/hard skills and 4 high-agency execution/soft skills.
3. RESUME BULLETS: Exactly 3 high-impact, metric-driven achievement bullets starting with strong action verbs (quantify volume, percentages, headcounts, or compliance).
4. GA FAIR-CHANCE PATHWAYS: 2-3 verified Fair-Chance / Second-Chance employers, hospital networks, or union apprenticeship locals in the Georgia/Atlanta/Macon corridor.

Zero generic filler, zero buzzwords, zero patronizing language.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                commercialTitle: {
                  type: Type.STRING,
                  description: 'Industry-standard professional job title',
                },
                competencies: {
                  type: Type.OBJECT,
                  properties: {
                    hardSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '4 core transferable technical or operational hard skills',
                    },
                    softSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '4 core high-agency execution or leadership soft skills',
                    },
                  },
                  required: ['hardSkills', 'softSkills'],
                },
                resumeBullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 high-impact, metric-driven achievement bullets starting with strong action verbs',
                },
                gaPathway: {
                  type: Type.STRING,
                  description: '2-3 verified Fair-Chance employers, hospital networks, or union apprenticeship locals in the Georgia/Atlanta/Macon corridor',
                },
              },
              required: ['commercialTitle', 'competencies', 'resumeBullets', 'gaPathway'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (error) {
        console.error('Gemini API translation error, using offline engine fallback:', error);
        const fallback = translateCapabilityOffline(experience);
        return res.json(fallback);
      }
    }

    // Fallback when API key is missing
    const fallback = translateCapabilityOffline(experience);
    return res.json(fallback);
  });

  // -------------------------------------------------------------
  // MODE 2: COMPLETE RESUME & COVER LETTER BUILDER
  // -------------------------------------------------------------
  app.post('/api/generate-full-package', async (req, res) => {
    const {
      targetJobTitle = 'Commercial Operations Specialist',
      candidateName = 'J. Carter',
      cityStateZip = 'Atlanta, GA',
      industrySector = 'Logistics & Supply Chain',
      translatedData,
    } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the RRR Capability Engine & Career Architect.
Your task is MODE 2: COMPLETE RESUME & COVER LETTER BUILDER.

CANDIDATE INFO:
- Name: ${candidateName}
- Target Job Title: ${targetJobTitle}
- Location: ${cityStateZip}
- Industry / Sector: ${industrySector}
- Prior Capabilities Context: ${JSON.stringify(translatedData || {})}

Generate a complete ATS-ready Application Package:
1. PROFESSIONAL RESUME:
   - Professional summary (2-3 sentences, high-agency, zero fluff).
   - Core Competencies grid (2 rows of 3 skill pillars each).
   - Professional Experience: 2 structured roles with dates, locations, organizations, and 3 high-impact metric-driven operational bullets each.
   - Certifications & Safety Training: 3 relevant certifications (e.g. OSHA-10/30, Forklift, ServSafe, CPR/First Aid).
   - Education & Georgia Career Pathways: HOPE Career Grant pathway, TCSG college, or union apprentice local (e.g., IBEW Local 613, Central Georgia Tech).
2. TARGETED COVER LETTER:
   - 3-paragraph high-agency cover letter addressed to hiring manager, connecting operational autonomy, safety compliance, and discipline directly to bottom-line results.
   - Opening paragraph: Specific role target and value proposition.
   - Body paragraph: Concrete operational accomplishments, high volume handled, and compliance rigor.
   - Closing paragraph: Professional invitation for interview and direct contact.`,
          config: {
            responseMimeType: 'application/json',
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
                  },
                  required: ['fullName', 'cityStateZip', 'phone', 'email'],
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
                        items: { type: Type.STRING },
                      },
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
                            items: { type: Type.STRING },
                          },
                        },
                        required: ['roleTitle', 'organization', 'location', 'dateRange', 'bullets'],
                      },
                    },
                    certificationsAndTraining: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    educationAndHopeGrants: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    'targetTitle',
                    'summary',
                    'competenciesGrid',
                    'professionalExperience',
                    'certificationsAndTraining',
                    'educationAndHopeGrants',
                  ],
                },
                coverLetter: {
                  type: Type.OBJECT,
                  properties: {
                    hiringManagerOrDepartment: { type: Type.STRING },
                    targetCompanyOrHospital: { type: Type.STRING },
                    companyAddressOrCorridor: { type: Type.STRING },
                    openingParagraph: { type: Type.STRING },
                    bodyParagraph: { type: Type.STRING },
                    closingParagraph: { type: Type.STRING },
                    signOff: { type: Type.STRING },
                  },
                  required: [
                    'hiringManagerOrDepartment',
                    'targetCompanyOrHospital',
                    'companyAddressOrCorridor',
                    'openingParagraph',
                    'bodyParagraph',
                    'closingParagraph',
                    'signOff',
                  ],
                },
              },
              required: ['targetJobTitle', 'industryOrSector', 'candidate', 'resume', 'coverLetter'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (error) {
        console.error('Gemini API package generation error, using offline engine fallback:', error);
        const fallback = generateFullPackageOffline(targetJobTitle, candidateName, cityStateZip, industrySector);
        return res.json(fallback);
      }
    }

    const fallback = generateFullPackageOffline(targetJobTitle, candidateName, cityStateZip, industrySector);
    return res.json(fallback);
  });

  // -------------------------------------------------------------
  // UNIFIED TERMINAL ROUTING ENDPOINT
  // -------------------------------------------------------------
  app.post('/api/unified-chat', async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lower = message.toLowerCase();

    if (lower.includes('decision tree') || lower.includes('start tree') || lower.includes('day 1-3')) {
      return res.json({ mode: 'MODE 4' });
    }

    if (lower.includes('generate full package') || lower.includes('build resume') || lower.startsWith('resume for')) {
      const roleTarget = message.replace(/(generate full package|build resume|create cover letter|resume for)/gi, '').trim() || 'Logistics Operations Supervisor';
      const pkg = generateFullPackageOffline(roleTarget, 'J. Carter', 'Atlanta, GA', 'Logistics & Supply Chain');
      return res.json({ mode: 'MODE 2', payload: pkg });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the RRR Capability Engine.
Translate the following duties or experience into MODE 1 Output format:
"${message}"`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                commercialTitle: { type: Type.STRING },
                competencies: {
                  type: Type.OBJECT,
                  properties: {
                    hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['hardSkills', 'softSkills'],
                },
                resumeBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                gaPathway: { type: Type.STRING },
              },
              required: ['commercialTitle', 'competencies', 'resumeBullets', 'gaPathway'],
            },
          },
        });
        const parsed = JSON.parse(response.text || '{}');
        return res.json({ mode: 'MODE 1', payload: parsed });
      } catch (e) {
        console.error('Unified chat translation fallback:', e);
      }
    }

    const fallback = translateCapabilityOffline(message);
    return res.json({ mode: 'MODE 1', payload: fallback });
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE OR STATIC ASSET SERVING & SPA FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RRR Server running on port ${PORT}`);
  });
}

startServer();
