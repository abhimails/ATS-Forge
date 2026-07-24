# ATSForge Architecture & System Specification

This document provides a technical breakdown of the **ATSForge** architecture, data flow, API interface design, component breakdown, and AI prompt engineering pipeline.

---

## 🏗 High-Level System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                 BROWSER CLIENT                                    │
│  React 18 + Tailwind CSS + Lucide Icons                                           │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ CandidateIngestion   │  │ KeywordPooling      │  │ MasterResumeView         │ │
│  └──────────────────────┘  └─────────────────────┘  └──────────────────────────┘ │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ SingleJDTailor       │  │ AtsResumePreview    │  │ Export Engine (PDF/DOC)  │ │
│  └──────────────────────┘  └─────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │ REST API Requests
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                EXPRESS SERVER (`server.ts`)                       │
│  Node.js (Port 3000)                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ POST /api/parse-resume       ──► Direct Text / File Extraction              │  │
│  │ POST /api/pool-keywords      ──► Gemini 3.6 Keyword Matrix Extraction        │  │
│  │ POST /api/generate-master-resume ──► Gemini 3.6 STAR Bullet Refactoring    │  │
│  │ POST /api/tailor-resume      ──► Gemini 3.6 Match Scoring & Keyword Insertion│  │
│  └──────────────────────────────────────┬──────────────────────────────────────┘  │
└─────────────────────────────────────────┼─────────────────────────────────────────┘
                                          │ Server-Side Only API Key
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE GEMINI 3.6 FLASH API                             │
│  `@google/genai` SDK - Server Proxy Route Execution                               │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Architecture

- **API Key Confidentiality**: All calls to Google Gemini use the server-side environment variable `GEMINI_API_KEY`. No API keys are ever transmitted or exposed to the browser client.
- **Client-Side Proxying**: The client UI issues requests strictly to `/api/*` endpoints handled by `server.ts`.

---

## 📡 API Endpoints Specification

### 1. `POST /api/parse-resume`
Extracts raw text content or parses uploaded documents (PDF, DOCX, TXT) into a structured `CandidateProfile` object.

### 2. `POST /api/pool-keywords`
- **Input**: List of target Job Descriptions (`JobDescription[]`).
- **Process**: Gemini analyzes the corpus, counts occurrences across JDs, calculates relative weights, and categorizes keywords into:
  - Hard Skills
  - Software & Tools
  - Action Verbs
  - Soft Skills & Methodologies
  - Certifications & Compliance
- **Output**: Structured `KeywordMatrix`.

### 3. `POST /api/generate-master-resume`
- **Input**: Raw `CandidateProfile` + pooled `KeywordMatrix`.
- **Process**: Enforces strict STAR formatting (`[Action Verb] + [Task Context] + [Quantifiable Impact]`) across every work experience bullet point while integrating top pooled keywords naturally.
- **Output**: `AtsResumeData` (Master Resume) + ATS score assessment and compliance breakdown.

### 4. `POST /api/tailor-resume`
- **Input**: Master `AtsResumeData` + Specific single target `JobDescription`.
- **Process**: Calculates single-job ATS match percentage (0–100%), performs gap analysis, identifies missing critical keywords, and rewrites bullet points specifically tuned for that role.
- **Output**: Tailored `AtsResumeData` + Match Score Breakdown & Improvement checklist.

---

## 💻 Frontend Component Breakdown

- **`App.tsx`**: Main state controller managing top-level workflow steps, demo data injection, notification banners, and active ATS resume state.
- **`Navbar.tsx`**: Header navigation, workflow step progress bar, demo loader, and PDF/DOCX export action bar.
- **`CandidateIngestion.tsx`**: Drag-and-drop file uploader and multi-field structured profile builder.
- **`KeywordPooling.tsx`**: Target JD corpus manager, pooling engine trigger, and interactive weighted keyword tag grid.
- **`MasterResumeView.tsx`**: Master resume viewer, STAR bullet refactor trigger, and real-time compliance checklist.
- **`SingleJDTailor.tsx`**: Single JD analysis panel, match scoring meter, gap visualizer, and 1-click dynamic resume tailoring tool.
- **`AtsResumePreview.tsx`**: Interactive single-column clean ATS resume canvas with inline edit toggle, font switcher, and PDF/DOCX renderer.

---

## 🎨 Design Systems & UI Standards

- **Color Palette**: Dark theme canvas `#0f1115`, panel background `#151921`, primary accent Blue-600 `#2563eb`, border accents `rgba(255, 255, 255, 0.05)`.
- **Typography**: Clean, high-legibility system fonts (Inter/System UI on web, Arial/Times/Georgia selectable in ATS document preview).
- **Layout Rule**: Single-column ATS resume canvas strictly adheres to standard recruiter parser standards (0.5"–0.75" margins, explicit section headers, no text boxes or complex nested tables).
