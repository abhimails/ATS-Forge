# ATSForge Product & Engineering Roadmap

This document outlines planned feature additions, technical architecture enhancements, and version releases for **ATSForge**.

---

## 📅 Release Milestones

### 🟢 Version 1.0 (Current Version)
- [x] Full-stack architecture with Express & Google Gemini 3.6 Flash
- [x] Candidate profile ingestion (manual form + resume file uploader)
- [x] Multi-JD keyword pooling engine & weighted matrix extraction
- [x] STAR bullet point AI refactor (`[Action Verb] + [Task] + [Impact]`)
- [x] Single-JD ATS match scoring (0–100%) and gap analysis
- [x] Single-column recruiter-standard ATS resume preview canvas
- [x] Export options: PDF download, Word (.doc) download, Plain Text copy

---

### 🔵 Version 1.1 — Enhanced Content & Cover Letters (Q3 2026)
- [ ] **AI Cover Letter Generator**: Automatically write tailored 1-page cover letters matched to the target JD using the candidate profile.
- [ ] **Custom Bullet Variants**: Offer 3 AI-suggested bullet options per work experience item so users can pick the strongest phrasing.
- [ ] **LinkedIn Profile Importer**: 1-click import candidate profile directly from LinkedIn URL or exported ZIP/JSON data.
- [ ] **Grammar & Impact Tone Selector**: Toggle tone between *Executive Leadership*, *Technical Specialist*, and *Creative Strategist*.

---

### 🟣 Version 1.2 — Recruiter Analytics & Application Tracker (Q4 2026)
- [ ] **Job Application Tracker Kanban Board**: Track applications by status (*Wishlist*, *Applied*, *Interviewing*, *Offer*, *Rejected*).
- [ ] **JD Scraping via URL**: Paste a Job Post URL (LinkedIn, Indeed, Greenhouse, Lever) to automatically extract text for keyword pooling.
- [ ] **Resume Version History & Diff Viewer**: Compare master resume vs. tailored versions side-by-side with color-coded diff highlights.

---

### 🟡 Version 2.0 — Enterprise & Browser Integration (2027)
- [ ] **Chrome Extension**: Analyze job descriptions right inside LinkedIn/Greenhouse/Lever pages and autofill tailored bullet points directly into application forms.
- [ ] **Multi-User Collaboration & Persistent Storage**: Integrated user accounts with Firebase/Cloud SQL storage for saving multiple candidate profiles and application histories.
- [ ] **Mock Interview Generator**: Generate target-role interview questions based on missing keywords and candidate STAR bullet points.
