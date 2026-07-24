# ATSForge • AI ATS Resume Optimization Engine

**ATSForge** is a full-stack, AI-powered ATS (Applicant Tracking System) resume maker and keyword tailoring engine built with **React**, **TypeScript**, **Express**, **Tailwind CSS**, and **Google Gemini 3.6 Flash**. 

It enables job seekers to analyze multiple target Job Descriptions (JDs), construct a weighted **Keyword Matrix**, refactor resume achievements into high-impact **STAR-formatted** bullet points, and dynamically tailor resumes with 0–100% ATS match scoring.

---

## 🌟 Key Features

- **Candidate Experience Ingestion**: Supports parsing uploaded resumes (PDF, DOCX, TXT) or manual structured input (contact info, work experience, skills, education, certifications, and projects).
- **Multi-JD Keyword Pooling Engine**: Aggregates a corpus of 5+ target Job Descriptions to derive weighted frequencies for Hard Skills, Software Tools, Action Verbs, Soft Skills, and Certifications.
- **Master ATS Resume Generation**: AI-driven refactoring of raw candidate achievements into strict STAR bullets: `[Action Verb] + [Task Context] + [Quantifiable Impact]`.
- **Single-JD Dynamic Tailoring & 0–100% Match Scoring**: Tailors a master resume against any specific job posting, calculates categorical ATS alignment, and highlights missing high-value keywords.
- **Multi-Format Export Engine**: Client-side single-click rendering and downloading for **Clean PDF**, **Editable Word (.doc)**, and **Form-Ready Plain Text**.
- **ATS Compliance Rule Validator**: Real-time auditing for single-column text flow, standardized section headers, clean contact lines, and keyword density.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, html2pdf.js, docx.js
- **Backend / API**: Express.js server (`server.ts`) running on Node.js
- **AI Engine**: `@google/genai` (Gemini 3.6 Flash server-side integration)
- **Design Theme**: Elegant Dark (#0f1115 canvas, glassmorphism panels, high-contrast typography)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ 
- **npm** or **bun**
- **Google Gemini API Key**: Set in environment variable `GEMINI_API_KEY`

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/your-username/ats-forge.git
cd ats-forge

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run the development server (Express + Vite on port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📄 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Detailed system architecture, data flow, component breakdown, and API route specification.
- [ROADMAP.md](./ROADMAP.md) — Future releases, planned features, and enhancement milestones.
- [AGENTS.md](./AGENTS.md) — Persistent project guidelines and AI agent behaviors.
