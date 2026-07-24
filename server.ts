import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI server-side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Parse CV File or Raw Text into structured CandidateProfile
app.post("/api/parse-cv", async (req, res) => {
  try {
    const { rawText, fileBase64, mimeType } = req.body;
    if (!rawText && !fileBase64) {
      return res.status(400).json({ error: "No CV text or file provided" });
    }

    const ai = getGeminiClient();
    let contents: any;

    const systemInstruction = `You are an expert ATS Resume Extraction Engine.
Extract the user's resume/CV details into a clean, normalized JSON matching the requested structure.
For work experience bullet points:
- Separate bullet points clearly.
- If dates are partial, standardize them (e.g. "Jan 2021", "Present").
- If contact fields are missing, set reasonable placeholders or empty strings.
Do not hallucinate facts not present in the CV, but extract everything thoroughly.`;

    if (fileBase64 && mimeType) {
      contents = {
        parts: [
          {
            inlineData: {
              data: fileBase64.split(",")[1] || fileBase64,
              mimeType: mimeType || "application/pdf",
            },
          },
          {
            text: "Extract candidate profile details from this uploaded CV file.",
          },
        ],
      };
    } else {
      contents = `Extract candidate profile details from this raw text:\n\n${rawText}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contact: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                portfolio: { type: Type.STRING },
              },
              required: ["fullName", "email", "phone", "location"],
            },
            professionalSummary: { type: Type.STRING },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["company", "role", "startDate", "endDate", "bullets"],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "skills"],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  graduationYear: { type: Type.STRING },
                  location: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  honors: { type: Type.STRING },
                },
                required: ["institution", "degree", "graduationYear"],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  link: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["name", "description", "bullets"],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                },
                required: ["name"],
              },
            },
          },
          required: [
            "contact",
            "professionalSummary",
            "workExperience",
            "skills",
            "education",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Add unique IDs
    if (parsedData.workExperience) {
      parsedData.workExperience = parsedData.workExperience.map(
        (item: any, idx: number) => ({
          ...item,
          id: `work-${idx}-${Date.now()}`,
        })
      );
    }
    if (parsedData.education) {
      parsedData.education = parsedData.education.map(
        (item: any, idx: number) => ({
          ...item,
          id: `edu-${idx}-${Date.now()}`,
        })
      );
    }
    if (parsedData.projects) {
      parsedData.projects = parsedData.projects.map(
        (item: any, idx: number) => ({
          ...item,
          id: `proj-${idx}-${Date.now()}`,
        })
      );
    }
    if (parsedData.certifications) {
      parsedData.certifications = parsedData.certifications.map(
        (item: any, idx: number) => ({
          ...item,
          id: `cert-${idx}-${Date.now()}`,
        })
      );
    }

    return res.json({ profile: parsedData });
  } catch (err: any) {
    console.error("Error in /api/parse-cv:", err);
    return res.status(500).json({ error: err.message || "Failed to parse CV" });
  }
});

// 2. Multi-JD Keyword Pooling Engine (5+ JDs)
app.post("/api/pool-keywords", async (req, res) => {
  try {
    const { jobDescriptions, candidateSkills = [] } = req.body;
    if (!jobDescriptions || !Array.isArray(jobDescriptions) || jobDescriptions.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide array of target Job Descriptions" });
    }

    const ai = getGeminiClient();

    const jdTexts = jobDescriptions
      .map((jd: any, index: number) => `--- JOB DESCRIPTION ${index + 1}: ${jd.title || 'Target Role'} (${jd.company || 'Company'}) ---\n${jd.content}`)
      .join("\n\n");

    const prompt = `You are an ATS Keyword Extraction & Intelligence Engine.
Analyze the following set of ${jobDescriptions.length} target Job Descriptions.
Extract and rank the top keywords across categories: Hard Skill, Tool/Software, Soft Skill, Action Verb, and Certification/Degree.

Calculate frequency (how many times mentioned across all JDs) and jdCount (how many distinct JDs out of ${jobDescriptions.length} explicitly require or mention it).
Also output an overall summary of the domain requirements across these JDs.

Job Descriptions:
${jdTexts}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topHardSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  jdCount: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER },
                },
                required: ["keyword", "frequency", "jdCount", "relevanceScore"],
              },
            },
            topTools: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  jdCount: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER },
                },
                required: ["keyword", "frequency", "jdCount", "relevanceScore"],
              },
            },
            topSoftSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  jdCount: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER },
                },
                required: ["keyword", "frequency", "jdCount", "relevanceScore"],
              },
            },
            topActionVerbs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  jdCount: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER },
                },
                required: ["keyword", "frequency", "jdCount", "relevanceScore"],
              },
            },
            topCertifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  jdCount: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER },
                },
                required: ["keyword", "frequency", "jdCount", "relevanceScore"],
              },
            },
            overallSummary: { type: Type.STRING },
          },
          required: [
            "topHardSkills",
            "topTools",
            "topSoftSkills",
            "topActionVerbs",
            "topCertifications",
            "overallSummary",
          ],
        },
      },
    });

    const matrix = JSON.parse(response.text || "{}");

    // Flatten all candidate skills for cross matching
    const candidateSkillsList: string[] = candidateSkills.flatMap((cat: any) =>
      cat.skills ? cat.skills.map((s: string) => String(s).toLowerCase().trim()) : []
    );

    const markMatches = (arr: any[]) => {
      if (!arr) return [];
      return arr.map((item) => {
        const lower = String(item.keyword || "").toLowerCase().trim();
        const matchedInProfile = candidateSkillsList.some(
          (cs: string) => cs.includes(lower) || lower.includes(cs)
        );
        return {
          ...item,
          matchedInProfile,
        };
      });
    };

    matrix.topHardSkills = markMatches(matrix.topHardSkills);
    matrix.topTools = markMatches(matrix.topTools);
    matrix.topSoftSkills = markMatches(matrix.topSoftSkills);
    matrix.topActionVerbs = markMatches(matrix.topActionVerbs);
    matrix.topCertifications = markMatches(matrix.topCertifications);

    return res.json({ matrix });
  } catch (err: any) {
    console.error("Error in /api/pool-keywords:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to pool keywords" });
  }
});

// 3. Generate Master ATS Resume (STAR format + Action Verbs + Metrics + Keywords)
app.post("/api/generate-master-resume", async (req, res) => {
  try {
    const { profile, keywordMatrix } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Missing candidate profile" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a Master ATS Resume Writer and Senior Talent Recruiter.
Your objective is to generate an ATS-Optimized Master Resume.
STRICT RULES:
1. Bullet Format: EVERY experience bullet point MUST follow the STAR pattern:
   [Strong Action Verb] + [Specific Task / Context] + [Quantifiable Impact / Metric].
   Example: "Architected microservices infrastructure using Go and Docker, reducing API latency by 35% across 2M daily active users."
2. Natural Keyword Integration: Seamlessly embed high-value keywords from the target matrix into work experience bullets and core skills sections.
3. Summary: Craft a compelling 3-4 sentence Professional Summary emphasizing core achievements, primary domain skills, and value proposition.
4. ATS Compliance: Maintain standard ATS section headers (Professional Summary, Core Skills, Professional Experience, Education, Projects, Certifications).
5. DO NOT hallucinate fake companies or fake degrees, but refine vague statements with realistic professional metrics if the user provided context.`;

    const prompt = `Candidate Profile:
${JSON.stringify(profile, null, 2)}

Pooled Keywords Matrix:
${JSON.stringify(keywordMatrix || {}, null, 2)}

Produce a refined, ATS-master version of the profile with enhanced STAR bullets, metrics, and structured skills.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            professionalSummary: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "skills"],
              },
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["company", "role", "bullets"],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  link: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["name", "bullets"],
              },
            },
            masterBulletImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  actionVerbUsed: { type: Type.STRING },
                  metricAdded: { type: Type.STRING },
                },
              },
            },
          },
          required: [
            "professionalSummary",
            "skills",
            "workExperience",
            "projects",
          ],
        },
      },
    });

    const masterResult = JSON.parse(response.text || "{}");

    // Preserve candidate contact, education, certifications
    const fullMasterProfile = {
      ...profile,
      professionalSummary: masterResult.professionalSummary,
      skills: masterResult.skills,
      workExperience: masterResult.workExperience.map((exp: any, i: number) => ({
        ...exp,
        id: profile.workExperience?.[i]?.id || `work-${i}`,
      })),
      projects: (masterResult.projects || []).map((proj: any, i: number) => ({
        ...proj,
        id: profile.projects?.[i]?.id || `proj-${i}`,
      })),
    };

    return res.json({
      masterProfile: fullMasterProfile,
      masterBulletImprovements: masterResult.masterBulletImprovements || [],
    });
  } catch (err: any) {
    console.error("Error in /api/generate-master-resume:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to generate master resume" });
  }
});

// 4. Single-JD Dynamic Tailoring Engine & Match Scoring
app.post("/api/tailor-resume", async (req, res) => {
  try {
    const { masterProfile, targetJd } = req.body;
    if (!masterProfile || !targetJd || !targetJd.content) {
      return res
        .status(400)
        .json({ error: "Master resume profile and target JD are required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert ATS Optimization Specialist and Senior Recruiter.
Compare the Candidate's Master Resume against the provided single target Job Description.

Tasks:
1. ATS MATCH SCORING (0-100%):
   - Calculate an accurate overall match score based on Hard Skills, Software/Tools, Action Verbs, and Metric Density.
   - List missing keywords categorized by importance (High, Medium, Low).
   - Evaluate standard ATS format rules (standard headers, single column text hierarchy, contact info clarity).
2. RESUME TAILORING:
   - Rewrite the Professional Summary specifically targeting this company and role.
   - Re-order and tweak experience bullets so that bullets most relevant to the JD's requirements appear FIRST and incorporate the job description's specific vocabulary where applicable.
   - Re-organize Core Skills so the skills explicitly demanded by the target JD are prominently placed at the top of skill categories.
   - Add specific added keywords list for transparency.`;

    const prompt = `TARGET JOB DESCRIPTION:
Title: ${targetJd.title || "Target Position"}
Company: ${targetJd.company || "Target Company"}
Job Description Text:
${targetJd.content}

CANDIDATE MASTER RESUME:
${JSON.stringify(masterProfile, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING },
            targetCompany: { type: Type.STRING },
            tailoredSummary: { type: Type.STRING },
            tailoredSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "skills"],
              },
            },
            tailoredWorkExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["company", "role", "bullets"],
              },
            },
            matchScore: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    hardSkillsScore: { type: Type.NUMBER },
                    toolsScore: { type: Type.NUMBER },
                    actionVerbsScore: { type: Type.NUMBER },
                    metricDensityScore: { type: Type.NUMBER },
                  },
                  required: [
                    "hardSkillsScore",
                    "toolsScore",
                    "actionVerbsScore",
                    "metricDensityScore",
                  ],
                },
                matchedKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingKeywords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      keyword: { type: Type.STRING },
                      importance: { type: Type.STRING },
                      category: { type: Type.STRING },
                    },
                    required: ["keyword", "importance", "category"],
                  },
                },
                formatComplianceScore: { type: Type.NUMBER },
                formatChecklist: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      rule: { type: Type.STRING },
                      passed: { type: Type.BOOLEAN },
                      feedback: { type: Type.STRING },
                    },
                    required: ["rule", "passed", "feedback"],
                  },
                },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "overallScore",
                "breakdown",
                "matchedKeywords",
                "missingKeywords",
                "formatComplianceScore",
                "formatChecklist",
                "suggestions",
              ],
            },
            highlightedKeywordsAdded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "jobTitle",
            "targetCompany",
            "tailoredSummary",
            "tailoredSkills",
            "tailoredWorkExperience",
            "matchScore",
            "highlightedKeywordsAdded",
          ],
        },
      },
    });

    const tailoredResult = JSON.parse(response.text || "{}");
    return res.json({ tailoredResume: tailoredResult });
  } catch (err: any) {
    console.error("Error in /api/tailor-resume:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to tailor resume" });
  }
});

// 5. Enhance Single Bullet Point with STAR + Quantifiable Metric
app.post("/api/enhance-bullet", async (req, res) => {
  try {
    const { bullet, role, context, userMetricHint } = req.body;
    if (!bullet) {
      return res.status(400).json({ error: "Bullet text required" });
    }

    const ai = getGeminiClient();

    const prompt = `Rewrite this resume bullet point into 3 high-impact variants following the STAR format: [Action Verb] + [Specific Task] + [Quantifiable Impact].
Original Bullet: "${bullet}"
Role Context: "${role || "Professional"}"
User-provided metric hint: "${userMetricHint || "None provided, estimate plausible metrics if applicable"}"

Return 3 variations:
1. High Impact Metrics focus (e.g. % growth, hours saved, $ revenue)
2. Technical / Systems Leadership focus
3. Concise & Direct ATS focus`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  actionVerb: { type: Type.STRING },
                  metricFocus: { type: Type.STRING },
                  styleTag: { type: Type.STRING },
                },
                required: ["text", "actionVerb", "metricFocus", "styleTag"],
              },
            },
          },
          required: ["variations"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json({ variations: result.variations || [] });
  } catch (err: any) {
    console.error("Error in /api/enhance-bullet:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to enhance bullet" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ATS Resume Engine API" });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVING
// -------------------------------------------------------------
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATS Resume Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
