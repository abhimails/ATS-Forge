# AGENTS.md — Persistent Project Instructions & AI Agent Guidelines

This file defines persistent rules, documentation standards, and architectural constraints for AI agents working on this project.

---

## 📌 Mandated Documentation Rule

**CRITICAL REQUIREMENT**:
For every project edit, major capability update, or feature addition, you MUST maintain and update the following three core documentation files at the project root:

1. **`README.md`**: Project overview, key features, tech stack, quickstart guide, and file index.
2. **`ARCHITECTURE.md`**: Technical architecture diagram, security guidelines, Express server endpoints (`server.ts`), component breakdown, data flows, and AI integration patterns.
3. **`ROADMAP.md`**: Version releases, current feature checklist, upcoming milestones, and long-term planned capabilities.

---

## 🛠 Core Development Guidelines

1. **Full-Stack Express + React Architecture**:
   - Always route Gemini API calls and sensitive server operations through `/api/*` endpoints in `server.ts`.
   - Never expose `GEMINI_API_KEY` or secrets to client-side code.

2. **Styling & UI**:
   - Use Tailwind CSS with dark neutral canvas `#0f1115` and panel backgrounds `#151921`.
   - Maintain clean, single-column ATS resume layouts that adhere to recruiter parsing standards.

3. **Build & Type Safety**:
   - Ensure `npm run build` succeeds without TypeScript or Vite errors.
   - Run `compile_applet` to verify compilation before completing turns.
