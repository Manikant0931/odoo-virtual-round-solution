# EcoSphere — ESG Management Platform

**Team Error404 · Odoo Hackathon, Virtual Round**

An interactive, click-through prototype of the EcoSphere ESG Management Platform: Environmental, Social, Governance and Gamification modules unified in one dashboard, built for the virtual-round demo.

This is a **frontend-only prototype** — all data lives in memory (seeded with realistic sample data) so every workflow in the brief is fully clickable without a backend. It's built to be swapped for real API calls later without touching the UI layer (see `src/context/EsgContext.jsx`).

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What's implemented

- **Dashboard** — weighted Overall ESG Score (signature ring visual), emissions trend, compliance watch, department score comparison.
- **Environmental** — emission factors, carbon-by-department breakdown, sustainability goals with progress bars, carbon transaction ledger with a **working "Log Transaction" form** (auto-calculates emissions = quantity × factor).
- **Social** — CSR activity cards with live registration, an approvals table that **enforces the evidence-required business rule**, diversity composition and training-completion charts.
- **Governance** — policy library with acknowledgement %, a working acknowledgement workflow, audit program cards, and a compliance-issue tracker with a **"Raise Issue" form** (owner + due date required) and automatic overdue flagging.
- **Gamification** — full challenge lifecycle (Draft → Active → Under Review → Completed, or Archived), join/approve flows that award XP, **auto-awarded badges** (rule-evaluated live as data changes), a rewards catalog with real point-deduction redemption, and an XP leaderboard.
- **Reports** — quick module reports plus a **Custom Report Builder** (module, department, date-range filters) with a real CSV export (client-side, via Blob download).
- **Settings** — toggles for Auto Emission Calculation, Evidence Requirement, and Badge Auto-Award (these actually change app behavior live), ESG score weight sliders, and master data (departments/categories) views.

All the business rules called out as "in scope, not optional" in the problem statement — reward redemption, notifications, auto emission calculation, evidence requirement, badge auto-award, and compliance issue ownership — are wired up as real interactions, not just static UI.

## Tech stack

- React 19 + Vite
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- React Router
- Recharts (charts)
- lucide-react (icons)
- In-memory state via React Context + `useReducer` (`src/context/EsgContext.jsx`) standing in for the eventual API/DB layer

## Project structure

```
src/
  components/     Layout, ScoreRing (signature visual), shared UI primitives
  context/        EsgContext — the in-memory "backend" and business rules
  data/           mockData.js — seed data for every module
  pages/          Dashboard, Environmental, Social, Governance, Gamification, Reports, Settings
  utils/          scoring.js — ESG weighting + overdue helpers
```

## Note on scope

This prototype intentionally covers all four modules end-to-end for a same-night, judge-facing demo. The root-level `odoo-virtual-round-solution` README describes the full target architecture (MERN + MongoDB + Python scoring service) for the build-out beyond the virtual round.
