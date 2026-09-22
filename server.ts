import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { translateCapabilityOffline, generateFullPackageOffline } from './src/utils/offlineEngine';
import { normalizePackage } from './src/utils/provenance';

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
Your task is MODE 1: CAPABILITY TRANSLATOR.
Convert the provided raw duties, institutional jobs, or life skills into commercial career assets.

ANTI-FABRICATION CONTRACT (hard rules — violating any of them fails the task):
1. Use ONLY facts stated in the input experience text. Never invent employers, job titles the user did not hold, dates, locations, metrics, volumes, percentages, headcounts, certifications, or credentials.
2. RESUME BULLETS: Draft exactly 3 achievement bullets grounded strictly in the input. Where a hiring manager would expect a number (volume, team size, timeframe), write a bracketed placeholder the user fills in, e.g. "[add team size]" or "[add timeframe]". Never write a specific number the user did not provide.
3. COMPETENCIES: List only skills evidenced by or directly implied by the input. Return exactly 4 hard skills and 4 soft skills; if the input supports fewer, use "[add skill]" placeholders for the rest rather than inventing skills.
4. GA PATHWAYS: 2-3 Georgia / Atlanta / Macon corridor training resources, apprenticeship programs, or employer types the user can research. Frame them as leads to verify — never call any employer "verified", and never make claims about an organization's hiring practices.
5. Plain, direct language. Zero buzzwords, zero patronizing language.

INPUT EXPERIENCE:
"${experience}"`,
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
                  description: '3 AI-drafted bullets grounded only in the input; bracketed placeholders where the user must add their own numbers — never invented metrics',
                },
                gaPathway: {
                  type: Type.STRING,
                  description: '2-3 Georgia corridor training/apprenticeship resources or employer types framed as research leads; no verified-employer claims',
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
  //
  // ANTI-FABRICATION CONTRACT (release-blocker fix):
  // The prompt below hard-grounds the model: it may ONLY use facts present
  // in the candidate info / translator context. Anything unknown comes back
  // as "" with provenance "missing" — never invented. Every resume line
  // carries user_provided | ai_inferred | missing provenance so the review
  // checkpoint and exporters can flag it.
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
        const provenanceEnum = {
          type: Type.STRING,
          enum: ['user_provided', 'ai_inferred', 'missing'],
          description:
            'user_provided = fact stated by the user; ai_inferred = rephrasing/generalization with no new facts; missing = unknown, text MUST be ""',
        };
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the RRR Capability Engine & Career Architect.
Your task is MODE 2: COMPLETE RESUME & COVER LETTER BUILDER.

CANDIDATE INFO (provided by the user — treat as ground truth):
- Name: ${candidateName}
- Target Job Title: ${targetJobTitle}
- Location: ${cityStateZip}
- Industry / Sector: ${industrySector}
- Prior Capabilities Context (the user's own Capability Translator output — the ONLY source of work-history facts you may use):
${JSON.stringify(translatedData || {})}

ANTI-FABRICATION RULES — violating any of these is a critical failure:
1. You may ONLY state facts that appear in CANDIDATE INFO or Prior Capabilities Context above. If a fact is not there, you do not know it.
2. NEVER invent: employer or organization names, employment dates or date ranges, work locations beyond the given Location, metrics (volumes, percentages, headcounts, dollar amounts, square footage), certifications or licenses, education credentials, phone numbers, or email addresses.
3. Any field you cannot fill from the sources above MUST be returned as an empty string "" with provenance "missing". Do NOT substitute plausible-sounding filler text.
4. Every resume line and role field carries a provenance label:
   - "user_provided": the fact was stated directly in the candidate info or translator context.
   - "ai_inferred": a reasonable rephrasing or generalization of user-stated experience. Adds NO new facts.
   - "missing": unknown — the text field MUST be "".
5. Professional Experience: include 1-2 roles ONLY if the translator context supports them. Never invent a second employer to fill space — one honest role beats two invented ones. Write 2-4 bullets per role grounded in the translator context; if the context is thin, write fewer clearly-marked bullets rather than inventing detail. No invented metrics — if the user gave no numbers, the bullet has no numbers.
6. Certifications & Training: list ONLY credentials the user has actually mentioned. If none were mentioned, return an empty array [].
7. Education: list ONLY credentials the user has mentioned. Do not present grant pathways or programs as earned credentials.
8. Cover letter: every accomplishment claim must trace to the provided context. No invented numbers, employers, or results.
9. Phone / email: if not provided above, return "" with provenance "missing" — never generate a phone number or email address.

Generate a complete ATS-ready Application Package:
1. PROFESSIONAL RESUME:
   - Professional summary (2-3 sentences, high-agency, zero fluff, grounded in the context above).
   - Core Competencies grid (2 rows of 3 skill pillars each, drawn from the translator context when available).
   - Professional Experience: roles with dates, locations, organizations, and grounded bullets — with per-field provenance.
   - Certifications & Safety Training: ONLY user-mentioned credentials, each labeled.
   - Education & Georgia Career Pathways: ONLY user-mentioned credentials, each labeled.
2. TARGETED COVER LETTER:
   - 3-paragraph high-agency cover letter, every claim grounded in the provided context.
   - Opening paragraph: specific role target and value proposition.
   - Body paragraph: accomplishments stated in the translator context — no invented metrics.
   - Closing paragraph: professional invitation for interview and direct contact.`,
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
                    phone: {
                      type: Type.STRING,
                      description: 'Phone number if provided by the user, else "" — never invent one',
                    },
                    email: {
                      type: Type.STRING,
                      description: 'Email if provided by the user, else "" — never invent one',
                    },
                    phoneProvenance: provenanceEnum,
                    emailProvenance: provenanceEnum,
                  },
                  required: ['fullName', 'cityStateZip', 'phone', 'email', 'phoneProvenance', 'emailProvenance'],
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
                          roleTitleProvenance: provenanceEnum,
                          organization: {
                            type: Type.STRING,
                            description: 'Employer name if stated by the user, else "" — never invent',
                          },
                          organizationProvenance: provenanceEnum,
                          location: { type: Type.STRING },
                          locationProvenance: provenanceEnum,
                          dateRange: {
                            type: Type.STRING,
                            description: 'Dates if stated by the user, else "" — never invent',
                          },
                          dateRangeProvenance: provenanceEnum,
                          bullets: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                text: { type: Type.STRING },
                                provenance: provenanceEnum,
                              },
                              required: ['text', 'provenance'],
                            },
                          },
                        },
                        required: [
                          'roleTitle',
                          'roleTitleProvenance',
                          'organization',
                          'organizationProvenance',
                          'location',
                          'locationProvenance',
                          'dateRange',
                          'dateRangeProvenance',
                          'bullets',
                        ],
                      },
                    },
                    certificationsAndTraining: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: {
                            type: Type.STRING,
                            description: 'ONLY a credential the user mentioned; empty array if none were mentioned',
                          },
                          provenance: provenanceEnum,
                        },
                        required: ['text', 'provenance'],
                      },
                    },
                    educationAndHopeGrants: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: {
                            type: Type.STRING,
                            description: 'ONLY a credential the user mentioned; empty array if none were mentioned',
                          },
                          provenance: provenanceEnum,
                        },
                        required: ['text', 'provenance'],
                      },
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
        // Normalize: guarantees id/createdAt and provenance fields even if the
        // model omits them; blanks become "missing", unlabeled lines default
        // to "ai_inferred" so nothing silently ships as user-verified.
        return res.json(
          normalizePackage({
            id: `pkg-live-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            createdAt: new Date().toISOString(),
            ...parsed,
          })
        );
      } catch (error) {
        console.error('Gemini API package generation error, using offline engine fallback:', error);
        const fallback = generateFullPackageOffline(targetJobTitle, candidateName, cityStateZip, industrySector, translatedData);
        return res.json(fallback);
      }
    }

    const fallback = generateFullPackageOffline(targetJobTitle, candidateName, cityStateZip, industrySector, translatedData);
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
