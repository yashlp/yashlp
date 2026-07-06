# CivicLens — Master Product Requirements Document

> **Internal product definition:** CivicLens is a **community intelligence platform**, not a civic reporting app. Every design decision should help people *understand places*—not merely file complaints.

**Document version:** 1.0 (Part 1 of 10)  
**Last updated:** July 6, 2026  
**Status:** Living specification — sections are delivered sequentially and connect into one continuous document.

---

## How to Read This Document

Every major feature in this specification is documented at five levels of detail:

| Layer | What it answers |
|-------|-----------------|
| **Purpose** | Why the feature exists and what problem it solves |
| **User Flow** | Step-by-step interaction from the user's perspective |
| **System Flow** | What the client, backend, AI, and database do after each action |
| **Decision Logic** | Rules that determine outcomes (thresholds, status changes, confidence) |
| **Edge Cases** | Behavior under disagreement, duplicates, poor media, abuse, and failure |

Developers should be able to trace any user action from tap → API → database → map update without leaving this document.

---

## Table of Contents

1. [Product Vision & Core Concept](#1-product-vision--core-concept) ← *this release*
2. Complete User Journey
3. Incident & Verification System
4. AI Features
5. Community Health Score
6. Trends, Rankings & Compare
7. All 39 Categories & Positive Signals
8. Monetization
9. Technical Logic
10. Security & Anti-Fraud

---

# 1. Product Vision & Core Concept

## 1.1 Overview

**CivicLens** is an AI-powered community intelligence platform that transforms how people understand, monitor, and improve the places around them. Rather than functioning as a traditional complaint portal, CivicLens creates a **living digital profile** for every street, neighborhood, city, state, and country—built from community-verified observations, AI-assisted analysis, historical records, and real-time updates.

Citizens contribute both **negative civic issues** and **positive community signals**. Information earns trust through independent community verification before it influences public scores, rankings, or high-confidence map displays. Every location becomes a continuously evolving source of intelligence, helping residents, travelers, businesses, researchers, and governments make better decisions.

### Product tagline

> **Every place has a story. CivicLens helps the community tell it.**

### One-sentence pitch

CivicLens is the world's most trusted community intelligence layer for places—combining verified local knowledge, AI insights, and historical place data so anyone can understand, compare, and improve where they live, work, and travel.

---

## 1.2 Vision

To become the world's most trusted community intelligence platform where every place has a transparent, community-verified history that helps people make better decisions about where they live, work, travel, invest, and build communities.

---

## 1.3 Mission

To empower communities by transforming everyday local observations into trusted, verified intelligence that improves transparency, accountability, and quality of life—while giving governments, businesses, and citizens the evidence they need to act.

---

## 1.4 Problem Statement

### What is broken today

| Problem | How people experience it |
|---------|--------------------------|
| **Fragmented reporting** | Civic issues are scattered across city apps, social media, and phone calls—with no shared history or verification |
| **No place-level memory** | A fixed pothole and a resolved pothole look the same in most systems; improvement is invisible |
| **Low trust in crowdsourced data** | Single-reporter complaints are easy to fake, spam, or misattribute |
| **Decisions without local context** | Renters, buyers, travelers, and businesses lack reliable, recent, neighborhood-specific intelligence |
| **Government blind spots** | Agencies receive duplicate tickets, unverifiable photos, and no community confidence signal |
| **Positive change is invisible** | Cleanups, repairs, and community wins rarely get recorded alongside problems |

### What CivicLens solves

CivicLens unifies place intelligence into one verified, historical, AI-enriched layer. One incident = one map pin. Community confirmation replaces noisy duplicate reports. Resolution is a first-class workflow with evidence and dispute handling. The **Community Health Score** turns raw observations into comparable, zoom-aware metrics at street, area, city, state, and country levels.

---

## 1.5 Target Users

### Primary personas

| Persona | Goals | Key features |
|---------|-------|--------------|
| **Resident** | Understand neighborhood conditions; report and track local issues; celebrate improvements | Map, report/confirm/resolve, notifications, health score |
| **Commuter / Visitor** | Assess unfamiliar areas before travel or daily routes | Search, compare, Ask AI, trends, saved places |
| **Community contributor** | Build reputation through accurate, helpful contributions | Confirmations, photos, comments, positive signals, rankings |
| **Renter / Home buyer** | Evaluate safety, infrastructure, cleanliness, and trajectory of an area | Health score, trends, compare places, premium reports |
| **Small business owner** | Choose locations; monitor foot-traffic-adjacent conditions | Area intelligence, alerts, enterprise reports |
| **Journalist / Researcher** | Access verified, historical place data | Trends, exports, API, enterprise dashboards |
| **Municipal staff** | Prioritize work; reduce duplicates; see community confidence | Enterprise dashboard, moderation, analytics |
| **Platform moderator / Admin** | Enforce policy; handle appeals; audit abuse | Admin moderation, audit trails, fraud signals |

### Secondary personas

- **Real estate professionals** — branded area reports for clients  
- **Insurance & risk analysts** — historical incident density and trend signals  
- **Developers** — API access to place intelligence datasets  

---

## 1.6 Value Proposition

### For citizens (free tier)

- See what is actually happening around you—not just what went viral  
- Confirm or dispute incidents with evidence, not just upvotes  
- Track resolution over time with a permanent incident timeline  
- Discover positive community contributions alongside problems  
- Ask natural-language questions about any place  

### For decision-makers (premium / enterprise)

- Compare neighborhoods with evidence-backed health scores and trends  
- Access historical datasets and predictive AI insights  
- Receive smart alerts when conditions change in monitored areas  
- Integrate place intelligence via API into existing workflows  

### For governments and institutions

- Reduce duplicate tickets through one-pin-per-incident deduplication  
- See community confidence on every report before dispatching resources  
- Measure improvement over time with resolution verification  
- Access aggregated analytics without exposing private user data  

---

## 1.7 Why CivicLens Is Different

| Dimension | Traditional civic apps | CivicLens |
|-----------|------------------------|------------|
| **Mental model** | Complaint inbox | Community intelligence platform |
| **Map representation** | Many pins per same issue | **One pin per incident** with unlimited confirmations |
| **Trust model** | Single reporter or staff-only | **Community verification threshold** + AI checks |
| **Lifecycle** | Open → closed (often deleted) | **Active → Resolved** with full timeline preserved |
| **Positive signal** | Rare or absent | **39 matching positive community signals** |
| **Place understanding** | Point-in-time tickets | **Community Health Score** + trends + compare |
| **AI role** | Optional chatbot | Embedded in verification, dedup, moderation, Ask AI, insights |
| **Monetization** | Ads or government-only contracts | Free participation + premium intelligence products |

### Core innovations

1. **One-pin-per-incident model** — duplicate reports attach to the same incident instead of cluttering the map  
2. **Community Health Score** — zoom-aware, evidence-backed scoring from street to country  
3. **Resolution as a verified workflow** — resolved status requires community confirmation, not reporter assertion  
4. **Dual signal taxonomy** — 39 issue categories plus 39 positive signals for balanced place profiles  
5. **Living place history** — nothing important is deleted; conditions evolve, evidence accumulates  
6. **Ask AI on any place** — natural-language access to verified community intelligence  

---

## 1.8 Product Philosophy

CivicLens is built on five principles that govern every feature decision:

### 1. Communities know their neighborhoods best

Local knowledge is the primary data source. The platform's job is to **capture, verify, organize, and explain** that knowledge—not replace it.

### 2. Trust is earned, not assumed

No single report becomes highly trusted by default. Community confirmations, AI checks, reputation weighting, and transparent confidence scores determine what the map emphasizes.

### 3. Places have memory

Incidents are historical records of how a place changes. Resolution does not erase problems—it documents improvement. Trends, before/after views, and health score history depend on this permanence.

### 4. Intelligence over volume

The goal is not maximum report count. The goal is **maximum understanding per place**—fewer duplicate pins, richer evidence, clearer scores.

### 5. AI assists; community decides

AI detects duplicates, flags suspicious media, summarizes feedback, and answers questions. **Community verification and moderation** determine what becomes publicly authoritative.

---

## 1.9 Platform Scope Summary

The following systems are in scope for the full specification (Sections 2–10):

| System | Section |
|--------|---------|
| Home screen & live map | §2, §9 |
| Incident report / confirm / resolve | §2, §3 |
| Search & filters | §2, §9 |
| Ask AI | §2, §4 |
| Community Health Score | §5 |
| Rankings, trends, compare places | §6 |
| Notifications | §2, §9 |
| User reputation | §2, §10 |
| Enterprise & government reports | §8 |
| Admin moderation | §2, §10 |
| Monetization | §8 |
| Security & fraud prevention | §10 |
| 39 categories & positive signals | §7 |

---

## 1.10 Naming & Brand Conventions (Developer Reference)

Use these names consistently in code, APIs, and documentation:

| Concept | Canonical name | Notes |
|---------|----------------|-------|
| Product | **CivicLens** | User-facing brand |
| Master spec | `CivicLens_Master_PRD.md` | This document |
| Primary map object | **Incident** | One pin per real-world issue or positive signal cluster |
| Verification unit | **Confirmation** | Independent user attestation with optional photo/comment |
| Place metric | **Community Health Score** | Abbreviated **CHS** in internal docs |
| AI chat feature | **Ask AI** | Natural-language queries scoped to a place |
| Positive contribution | **Positive signal** | Mirror taxonomy to issue categories |
| User trust metric | **Reputation** / **Reliability score** | See §10 |
| Resolution state | **Active** → **Resolved** | With dispute path back to Active |

### Former working name

CivicLens is the canonical product name for this community intelligence platform. The repositioning from "civic reporting app" to "community intelligence platform" is intentional and should not be reversed in copy or architecture naming (e.g., prefer `incident` and `place_intelligence` over `complaint` in schema design).

---

## 1.11 Success Metrics (North Star)

| Metric | Definition | Why it matters |
|--------|------------|----------------|
| **Verified incident coverage** | % of map pins that reached community verification threshold | Measures trust density |
| **Resolution verification rate** | % of resolved incidents confirmed by ≥N independent users | Measures resolution integrity |
| **Place profile completeness** | CHS confidence level per active geographic unit | Measures intelligence depth |
| **Contributor reliability** | % of contributions upheld after moderation | Measures community quality |
| **Decision use** | Premium report views, compare sessions, Ask AI queries | Measures platform value beyond reporting |
| **Duplicate merge rate** | % of new reports attached to existing pins vs. new pins | Measures dedup effectiveness |

---

## 1.12 Glossary (Part 1)

| Term | Definition |
|------|------------|
| **Incident** | A single map pin representing one real-world condition (issue or positive signal) at a location |
| **Confirmation** | A community member's attestation that an incident is accurate |
| **Resolution update** | A submission claiming an incident is fixed, with optional photo evidence |
| **Confidence score** | Computed trust level for an incident based on confirmations, AI, and contributor reliability |
| **CHS** | Community Health Score — aggregated place condition metric |
| **Positive signal** | Community-reported improvement or good condition (e.g., clean street, repaired sidewalk) |
| **Place profile** | Combined view of incidents, scores, trends, and AI summary for a geographic unit |
| **Threshold** | Minimum confirmations required before an incident becomes publicly prominent |

---

# Preview: Section 2 — Complete User Journey

*The following section will be delivered next. It documents every major user-facing flow at Purpose / User Flow / System Flow / Decision Logic / Edge Case depth.*

### Flows to be specified

1. First-time onboarding  
2. Registration and login  
3. Home map experience  
4. Reporting flow (see incident system preview below)  
5. Confirming incidents  
6. Resolving incidents  
7. Positive signal flow  
8. Search  
9. Saved places  
10. Notifications  
11. Profile and reputation  

### Incident system preview (Section 3 anchor)

This flow anchors the entire platform and will be fully expanded in Section 3:

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Taps **Report** | Opens category picker |
| 2 | Selects category (e.g., Pothole) | Loads category-specific requirements |
| 3 | — | GPS captures location |
| 4 | — | Backend checks for similar incident within radius |
| 5a | Similar incident exists | Invite to confirm, add photos, or comment on existing pin |
| 5b | No match | Create new incident (draft/pending state) |
| 6 | Submits photo (if required) | AI verifies photo relevance, category, manipulation |
| 7 | — | Incident awaits community confirmation threshold |
| 8 | Threshold met | Pin becomes publicly visible / confidence increases |
| 9 | Another user submits **Resolved** with photos | Resolution pending verification |
| 10 | Nearby users confirm or dispute | Resolution decision logic runs |
| 11 | Resolution verified | Status: **Active** → **Resolved**; timeline preserved |

---

# Document Roadmap

| Part | Section | Status |
|------|---------|--------|
| 1 | Product Vision & Core Concept | ✅ Complete |
| 2 | Complete User Journey | 🔜 Next |
| 3 | Incident & Verification System | Planned |
| 4 | AI Features | Planned |
| 5 | Community Health Score | Planned |
| 6 | Trends, Rankings & Compare | Planned |
| 7 | All 39 Categories & Positive Signals | Planned |
| 8 | Monetization | Planned |
| 9 | Technical Logic | Planned |
| 10 | Security & Anti-Fraud | Planned |

---

*End of Part 1. Continue with Section 2: Complete User Journey.*
