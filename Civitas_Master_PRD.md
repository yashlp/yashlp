# Civitas – Master Product Requirements Document

**Version:** 1.0  
**Status:** Complete Specification  
**Platform:** Mobile-first (iOS & Android) with Web Dashboard  
**Classification:** AI-Powered Community Intelligence Platform

---

> **Every place has a story. Civitas helps communities tell it — and improve it.**

---

## Table of Contents

1. [Product Vision & Core Concept](#1-product-vision--core-concept)
2. [Complete User Journey](#2-complete-user-journey)
3. [Incident & Verification System](#3-incident--verification-system)
4. [AI Features](#4-ai-features)
5. [Community Health Score](#5-community-health-score)
6. [Trends, Rankings & Compare Places](#6-trends-rankings--compare-places)
7. [All 39 Categories & Positive Signals](#7-all-39-categories--positive-signals)
8. [Monetization](#8-monetization)
9. [Technical Architecture & Logic](#9-technical-architecture--logic)
10. [Security & Anti-Fraud](#10-security--anti-fraud)

---

## 1. Product Vision & Core Concept

### 1.1 Name & Identity

**Civitas** (pronounced *SIV-ih-tus*) is derived from the Latin *civitas*, meaning city, citizenry, and the social contract between people and the places they inhabit. It captures the platform's core belief: that informed, engaged communities build better places.

Where the former name "CivicLens" described a tool, **Civitas** describes an identity — a living civic system that communities own, contribute to, and benefit from.

**Tagline:** *Know your place. Shape your community.*

**Brand Pillars:**
- **Transparency** — Every data point is traceable to verified community evidence.
- **Intelligence** — AI surfaces patterns humans would never notice alone.
- **Participation** — Every resident is both a consumer and a contributor.
- **Memory** — No improvement or problem is ever forgotten.

---

### 1.2 Vision

To become the world's most trusted community intelligence platform — a living digital layer over every street, neighborhood, city, and country that helps people make better decisions about where they live, work, travel, invest, and build communities.

### 1.3 Mission

To empower communities by transforming everyday local observations into trusted, verified intelligence that improves transparency, accountability, and quality of life — while giving governments, businesses, researchers, and citizens the data they need to make informed decisions.

### 1.4 Problem Statement

Civic life today suffers from a fundamental information asymmetry:

- **Residents** know their neighborhood's problems, but have no reliable way to document or escalate them.
- **Governments** receive fragmented, duplicate, and unverified reports with no community context.
- **Businesses** make expensive location decisions with incomplete, outdated, or anecdotal place data.
- **Travelers and newcomers** have no trusted source for the real condition of a neighborhood.
- **Researchers and journalists** lack granular, time-stamped, community-verified place intelligence.

Existing solutions (311 apps, Google Maps reviews, Nextdoor, SeeClickFix) solve narrow slices of this problem — but none of them build a **living, verified, historical intelligence layer** over every location.

Civitas solves the whole problem.

### 1.5 Target Users

| Segment | Primary Need |
|---|---|
| **Residents** | Report issues, track improvements, understand their area |
| **Commuters & Travelers** | Know what to expect before arriving |
| **Home Buyers & Renters** | Make data-driven housing decisions |
| **Business Owners** | Evaluate locations, monitor conditions near their business |
| **Real Estate Professionals** | Access hyperlocal trend data |
| **Local Governments** | Receive verified, prioritized community reports |
| **Urban Researchers** | Access historical civic datasets |
| **Journalists** | Identify patterns, compare neighborhoods |
| **Enterprise & Enterprise SaaS customers** | Location intelligence APIs and dashboards |

### 1.6 Value Proposition

**For residents:** A single trusted platform where you can report what's wrong, celebrate what's right, and watch your community improve over time — with proof.

**For decision-makers:** The most accurate, community-verified, AI-enriched intelligence layer available for any place on Earth.

**For governments:** Pre-verified, de-duplicated, community-prioritized reports with evidence packages — replacing fragmented 311 systems.

### 1.7 Why Civitas Is Different

| Capability | Civitas | 311 Apps | Google Maps | Nextdoor |
|---|---|---|---|---|
| AI-verified photo evidence | ✅ | ❌ | ❌ | ❌ |
| Community confirmation threshold | ✅ | ❌ | ❌ | ❌ |
| One pin per incident (no duplicates) | ✅ | ❌ | ❌ | ❌ |
| Incident lifecycle (open → resolved) | ✅ | Partial | ❌ | ❌ |
| Community Health Score | ✅ | ❌ | ❌ | ❌ |
| Historical place intelligence | ✅ | ❌ | ❌ | ❌ |
| Compare Places feature | ✅ | ❌ | ❌ | ❌ |
| Natural-language Ask AI | ✅ | ❌ | ❌ | ❌ |
| Positive community signals | ✅ | ❌ | ❌ | Partial |
| Fraud and spoofing detection | ✅ | ❌ | ❌ | ❌ |

### 1.8 Product Philosophy

Civitas is built on the belief that communities are the world's best sensor network. Every resident carries a smartphone — a GPS device, camera, and communication tool — capable of capturing the real condition of any place at any moment.

Civitas turns that latent capability into structured, verified, actionable intelligence by combining:
- **Community participation** (breadth of observation)
- **Verification mechanics** (quality of data)
- **Artificial intelligence** (pattern recognition and synthesis)
- **Transparent evidence trails** (trust)
- **Historical memory** (context)

The product's internal design principle is: **"This is not a reporting app. It is a community intelligence platform."** That single distinction shapes every design decision — from how pins are displayed to how the AI answers questions.

---

## 2. Complete User Journey

### 2.1 First-Time Onboarding

**Step 1 — App Launch**
The user sees the Civitas splash screen. A brief three-screen carousel explains the platform:
- Screen 1: "See what's really happening around you" (map with pins).
- Screen 2: "Report issues, confirm what others see, celebrate improvements."
- Screen 3: "Your neighborhood's story, verified by your community."

**Step 2 — Location Permission**
The app requests location access. If denied, the user is prompted to manually enter their city or neighborhood.

**Step 3 — Registration Options**
- Sign up with email
- Continue with Google
- Continue with Apple

Minimal required data: display name, email, password. Optional: profile photo, home neighborhood.

**Step 4 — Interest Selection**
Users optionally select which civic categories they care most about (e.g., roads, parks, safety, noise). This personalizes their notification preferences and map default filters.

**Step 5 — Home Screen Introduction**
A brief guided overlay introduces the key UI elements: the map, the report button, the search bar, the AI chat button, and the bottom navigation tabs.

---

### 2.2 Home Map Experience

**Default State**
On first open (and subsequent opens), the map centers on the user's current GPS location and loads all active pins within the viewport. Pins are color-coded by status and sized by confidence level.

**Pin Display Rules**
- **Red pin:** Active, unresolved incident.
- **Green pin:** Resolved incident (faded/smaller, always accessible via tap).
- **Blue pin:** Positive community signal.
- **Amber pin:** Under-confirmed incident (not yet at confidence threshold — visible only to participants and nearby users within 0.5 km).
- **Cluster bubble:** When many pins are close together at the current zoom level, they collapse into a number bubble showing the incident count.

**Zoom Behavior**
- Zoom in → individual pins become visible with category icons.
- Zoom out → pins cluster. The Community Health Score badge for the current viewport updates dynamically.
- At city level → heat map overlay becomes available.

**Controls**
- Filter icon: filter map by category, status (active/resolved), date, confidence level.
- Layers icon: toggle heat map, Health Score overlay, or clean map.
- Search bar: search for streets, neighborhoods, or cities.
- Floating action button (+): open the reporting flow.
- AI chat button (⚡): open Ask AI.

---

### 2.3 Reporting Flow

**Step 1 — Tap + Button**
The report panel slides up from the bottom. GPS automatically locks the user's current location on the map. The user can drag the pin to adjust within a 50-meter radius.

**Step 2 — Select Category**
A scrollable grid displays all 39 categories with icons and labels. Tapping a category selects it and reveals relevant sub-options.

**Step 3 — Duplicate Detection**
*System action (runs immediately after category selection + GPS lock):*
- The system queries all active incidents within a defined proximity radius (varies by category: 20m for potholes, 200m for noise, 500m for air quality).
- If a matching incident exists, the user sees: *"A similar report already exists nearby. Would you like to confirm it instead?"*
  - **Confirm Existing:** User is taken to the existing incident's detail page and can add a confirmation, photo, or comment.
  - **Report New Anyway:** Available only if the user believes it is genuinely a different incident. Triggers an AI review flag for moderation.

**Step 4 — Photo Upload**
- Optional by default; required for certain high-stakes categories (e.g., Structural Hazard, Gas Leak).
- Up to 5 photos per initial report.
- Photos are uploaded and queued for AI verification immediately.
- If camera access is denied, the user can upload from their gallery.

**Step 5 — Description (Optional)**
Free-text field, 500 character limit. AI auto-suggests a title based on category and GPS context (e.g., "Pothole on Oak Street near Main Ave").

**Step 6 — Severity Rating**
User optionally rates severity: Low / Medium / High / Critical. Defaults to Medium.

**Step 7 — Submit**
User reviews the pin location, category, and optional details, then taps Submit.

*Post-submission system flow:*
1. A new incident record is created in the database with status: `pending_confirmation`.
2. The pin appears on the user's own map immediately as amber (awaiting community confirmation).
3. The AI photo verification pipeline is triggered asynchronously.
4. Nearby registered users (within 500m, with relevant interest settings) receive a push notification: *"Something was just reported near you. Tap to confirm or learn more."*
5. The reporter earns a Contribution Point.

---

### 2.4 Confirming an Incident

When a user taps an existing amber or red pin, the incident detail sheet opens.

**Confirmation Options:**
- **Confirm** — "Yes, I've also seen this."
- **Add Photo** — Upload supporting evidence.
- **Comment** — Add a text note.
- **Dispute** — "I don't think this is accurate." (Triggers a lightweight dispute flow.)
- **Share** — Share the incident link externally.

**System logic:**
- Each confirmation from a distinct user within a minimum distance threshold (varies by category) adds +1 to the confirmation count.
- Confirmations from users with higher Reputation Scores carry slightly more weight.
- When the confirmation threshold is reached (see Section 3.2), the pin status transitions to `active` and becomes publicly visible.

---

### 2.5 Resolution Flow

Any authenticated user can submit a resolution update for an active incident.

**Step 1 — Open Incident Detail → Tap "Report Resolved"**

**Step 2 — Resolution Report**
- Upload 1–5 photos showing the resolved state.
- Optional text description ("Pothole was repaired overnight").
- Optional: tag a responsible entity (e.g., City Public Works, Private Contractor).

**Step 3 — Community Resolution Confirmation**
The incident status changes to `pending_resolution`. Nearby community members (within the same radius as confirmation) are notified and invited to confirm or dispute the resolution.

**Step 4 — Resolution Verdict**
- If the resolution confirmation threshold is met: status changes to `resolved`. The pin turns green and shrinks.
- If community members predominantly dispute the resolution: the resolution report is rejected, the incident remains active, and the disputing evidence is logged.

The original report timeline is preserved permanently. The incident never disappears — it becomes part of the location's history.

---

### 2.6 Positive Signal Flow

Positive Signals are not "opposite incidents" — they are structured community acknowledgments of things that are working well.

**Examples:** Clean street, well-maintained park, good lighting, friendly neighborhood, excellent public transport.

The reporting flow mirrors the incident flow, but uses the "Positive Signal" tab (blue pin). Positive Signals:
- Do not require the same confirmation threshold as negative incidents (lower bar: 2 confirmations).
- Are equally important for the Community Health Score calculation.
- Contribute to the Positive Momentum Trend analysis.

---

### 2.7 Search

The search bar supports:
- **Location search:** street name, neighborhood name, city, postal code.
- **Category search:** "potholes near me," "noise complaints downtown."
- **AI-powered natural language:** "What's the road quality like on 5th Avenue?"
- **Place search:** tapping a search result re-centers the map on that location with a Health Score badge.

---

### 2.8 Saved Places

Users can bookmark any location (street, neighborhood, or city) to their "Saved Places" list. Saved places:
- Appear in the bottom navigation for quick access.
- Trigger automatic smart alerts when new incidents are reported or resolved.
- Show health score history over time.

---

### 2.9 Notifications

**Types:**
| Notification | Trigger |
|---|---|
| Nearby new report | Incident reported within user's smart alert radius |
| Confirmation request | User's report receives first confirmation |
| Threshold reached | User's report becomes public (confidence threshold met) |
| Resolution submitted | An incident the user confirmed has a resolution update |
| Resolution confirmed | A resolution on user's report is confirmed |
| Health score change | Saved place's score changes by ≥5 points |
| Trending issue | A category is spiking in user's area |
| Reputation milestone | User reaches a new reputation level |
| AI weekly digest | Summary of community activity in saved places |

All notification types are individually toggleable in settings.

---

### 2.10 Profile & Reputation

**Profile page shows:**
- Display name and photo
- Member since date
- Home neighborhood
- Reputation Level (Bronze, Silver, Gold, Expert, Civic Champion)
- Contribution Stats: reports submitted, confirmations given, resolutions verified, photos uploaded, comments posted
- Accuracy Rate: percentage of reports that were confirmed by community
- Impact Score: weighted score reflecting total community benefit of contributions
- Badge collection (special achievements)

**Reputation Score Calculation:**
- +10 points: New report submitted
- +15 points: Report confirmed by ≥3 others
- +5 points: Confirmation given
- +20 points: Resolution report confirmed by community
- +3 points: Photo upload on existing incident
- +2 points: Comment posted
- -10 points: Report disputed and removed
- -5 points: Confirmed resolution later re-opened (false resolution)

Higher reputation users' confirmations carry a small multiplier (1.0x – 1.5x weight) in threshold calculations.

---

## 3. Incident & Verification System

### 3.1 One-Pin-Per-Incident Model

The foundational rule of Civitas: **every distinct incident at every distinct location is represented by exactly one pin.**

This prevents the noise of traditional civic apps where the same pothole generates 50 separate reports. Instead:
- The first reporter creates the incident.
- All subsequent reporters within the proximity radius are directed to confirm the existing incident.
- One pin accumulates all evidence, confirmations, and comments over its lifetime.

The single pin becomes progressively more authoritative as more community members contribute to it.

### 3.2 Status Lifecycle

```
[SUBMITTED] → [PENDING_CONFIRMATION] → [ACTIVE] → [PENDING_RESOLUTION] → [RESOLVED]
                      ↕                    ↕
               [DISPUTED]           [DISPUTED_RESOLUTION]
                      ↕
               [REMOVED] (if AI or moderator confirms violation)
```

**Status Definitions:**

| Status | Description | Visibility |
|---|---|---|
| `PENDING_CONFIRMATION` | Just submitted; awaiting community confirmations | Only submitter and nearby users (500m) |
| `ACTIVE` | Confirmation threshold reached; publicly verified | All users, full visibility |
| `DISPUTED` | Significant number of dispute reports filed | Visible with dispute banner; under review |
| `PENDING_RESOLUTION` | A resolution has been submitted; awaiting community confirmation | All users see resolution banner |
| `RESOLVED` | Community confirmed the resolution | Green pin, smaller, accessible via "show resolved" toggle |
| `REMOVED` | Admin or AI action removed the report | No longer visible; reporter notified |

### 3.3 Confirmation Thresholds

Thresholds vary by category severity to balance signal quality with report velocity:

| Category Tier | Confirmation Threshold to Go Active | Resolution Confirmation Threshold |
|---|---|---|
| **Critical** (Gas Leak, Structural Hazard, Electrical Hazard) | 1 confirmation (expedited) | 2 confirmations |
| **High** (Flooding, Road Collapse, Major Safety) | 2 confirmations | 3 confirmations |
| **Standard** (Pothole, Graffiti, Streetlight, Noise) | 3 confirmations | 3 confirmations |
| **Low** (Minor aesthetic, park maintenance) | 3 confirmations | 2 confirmations |
| **Positive Signal** | 2 confirmations | N/A |

Confirmations must come from **distinct user accounts** with:
- A verified email address.
- GPS location within the category-defined proximity radius at the time of confirmation.
- Account age ≥ 24 hours (prevents same-day fake accounts).

### 3.4 Duplicate Detection Logic

When a user submits a new report, the system runs:

1. **Geographic query:** Find all active incidents of the same category within the proximity radius.
2. **AI image similarity check:** If the user uploaded a photo, compare against photos on nearby incidents of the same category using image embeddings.
3. **Time filter:** Incidents older than the category's expected resolution time are down-ranked in the duplicate match score.

**Decision output:**
- **High match (>80% confidence):** System shows "This looks like an existing report" prompt.
- **Medium match (40–80%):** System shows "There's a similar report nearby" as a softer suggestion.
- **Low match (<40%):** No prompt; new incident is created.

If the user overrides a High match duplicate prompt and reports anyway, the new report is flagged for AI moderator review and is not published until reviewed.

### 3.5 Incident Timeline

Every incident maintains a permanent, append-only timeline:

```
📍 Incident Created — [timestamp] — [reporter display name]
📸 Photo Added — [timestamp] — [user]
✅ Confirmed — [timestamp] — [user] (3 total)
🌐 Status: ACTIVE — [timestamp]
💬 Comment: "Still there as of Tuesday." — [timestamp] — [user]
📸 Resolution Photo Uploaded — [timestamp] — [user]
✅ Resolution Confirmed — [timestamp] — [user] (3 total)
🟢 Status: RESOLVED — [timestamp]
```

The timeline is visible to all users on the incident detail page and is immutable once written. It serves as the full audit trail.

### 3.6 Confidence Score

Every active incident has a **Confidence Score** from 0–100, calculated as:

```
Confidence = BASE_SCORE
  + (Confirmations × confirmation_weight)
  + (Photos × 5)
  + (Reporter reputation weight)
  + (Confirmation recency bonus)
  - (Disputes × dispute_penalty)
  - (Age decay factor)
```

Where:
- `confirmation_weight` = 10 to 15 depending on confirming user's reputation.
- `dispute_penalty` = 8 per dispute from distinct users.
- `age_decay_factor` = small daily decay starting at 30 days for non-critical categories.

A score of **50+** displays as standard confidence.  
A score of **75+** displays with a "High Confidence" badge.  
A score of **90+** displays with a "Community Verified" badge.

### 3.7 Photo Handling

**Upload constraints:**
- Maximum 5 photos per submission.
- Accepted formats: JPG, PNG, HEIC, WebP.
- Maximum file size: 15MB per photo.
- GPS metadata is extracted and validated against the report location.

**AI photo pipeline (runs asynchronously after upload):**
1. **Content check:** Is the photo relevant to the reported category?
2. **Duplicate check:** Does this photo match existing photos on nearby incidents?
3. **Manipulation check:** Signs of AI-generated images, heavy Photoshop editing, or known stock photo matches.
4. **Metadata validation:** Does photo GPS match the incident GPS (within tolerance)?

**Outcomes:**
- **Pass:** Photo is displayed on the incident.
- **Suspicious:** Photo is held and flagged for moderator review. Submitter is not notified immediately.
- **Fail:** Photo is rejected silently. If multiple photos from one user fail consistently, the account is flagged.

### 3.8 Comment System

Comments on incidents are flat (no threading in v1). Each comment shows:
- Display name, reputation level badge, and timestamp.
- Upvote/downvote (aggregate only — no public per-user vote visibility).
- Report comment option.

Comments with net negative votes below -5 are auto-collapsed (visible via "Show hidden comment" tap). Moderators can permanently remove comments.

### 3.9 Dispute Resolution

A dispute is logged when a user taps "Dispute this report." The user is asked to explain why (wrong location, already resolved, fake, irrelevant photo, wrong category — dropdown options).

**Dispute logic:**
- 1 dispute: flagged for internal tracking.
- 3+ disputes from distinct users within 48 hours: incident is placed in `DISPUTED` status.
- In `DISPUTED` status: AI re-analyzes all photos and metadata. A moderator review is queued.
- Moderator outcome: restore to `ACTIVE`, place in `REMOVED`, or adjust the category.

### 3.10 AI Moderation

AI runs automatically in the background and can:
- Flag incidents for moderator review without user action.
- Auto-approve borderline content when confidence is high enough.
- Detect category mismatches (e.g., a noise complaint submitted under "Road Damage").
- Identify coordinated report spam (multiple reports from same IP or device cluster).

AI moderation actions are logged and always auditable by human moderators.

---

## 4. AI Features

### 4.1 Ask AI

**Entry point:** Persistent AI button (⚡) accessible from any screen.

**Behavior:**
Ask AI is a conversational interface powered by a large language model with access to the Civitas knowledge base for the current location context.

**Example queries it can answer:**
- "What's the current state of roads in my neighborhood?"
- "Has the flooding issue on Elm Street been resolved?"
- "What's the Community Health Score trend for the Mission District over the last 6 months?"
- "Which neighborhood in this city has the best park maintenance score?"
- "Is this street safe to drive on right now?"
- "Show me all unresolved issues within 1 mile of my location."
- "What civic issues are trending in this zip code?"

**System flow for an Ask AI query:**
1. User types question.
2. NLP layer extracts location, category, time range, and intent.
3. System queries the Civitas database for relevant incidents, scores, and trends.
4. LLM constructs a human-readable answer grounded in the retrieved data.
5. Response includes inline links to referenced incidents and map highlights.
6. User can follow up conversationally.

**Limitations displayed to user:**
- AI answers are based on community-verified data. For emergencies, contact local services.
- Data currency is displayed ("Based on data updated X minutes ago").

### 4.2 AI-Generated Summaries

Every location (street, neighborhood, city) has an auto-generated **AI Summary** visible on the location profile page.

**Summary structure:**
- **One-line health verdict** ("This neighborhood currently has active road and lighting issues.")
- **Top active issues** (bullet list of top 3 by confidence)
- **Recent improvements** (resolved incidents in last 30 days)
- **Trend direction** (improving / stable / declining — with sparkline)
- **Data note** (last updated timestamp and number of contributing community members)

Summaries regenerate every 6 hours or when a major status change occurs.

### 4.3 Duplicate Image Detection

Uses image embedding models (e.g., CLIP or equivalent) to compare newly uploaded photos against a vector database of existing incident photos in the same geographic cluster.

**Similarity threshold:** Photos with >85% cosine similarity to an existing incident photo trigger a duplicate flag.

Purpose: Prevents users from submitting old photos from Google Images or from previous reports to falsely inflate confirmation counts.

### 4.4 Fake / Manipulated Image Detection

Pipeline runs every uploaded photo through:
- **AI-generation detection:** Identifies GAN artifacts, diffusion model fingerprints.
- **Metadata analysis:** Checks EXIF data for editing software traces, creation timestamps that predate the report.
- **Content-location mismatch:** Compares photo visual features (e.g., vegetation type, road markings, signage language) against the expected locale of the GPS coordinates.

### 4.5 Wrong-Category Detection

After a report is submitted, the AI analyzes the photo and description against the selected category. If the match confidence is below 60%, the system:
1. Suggests the correct category to the submitter.
2. Flags the report for moderator review if the submitter declines to change it.

### 4.6 Trend Analysis AI

Runs on a scheduled basis (daily for city-level, hourly for high-activity areas) to identify:
- Sudden spikes in a category (e.g., noise complaints up 40% in last 24h in an area).
- Recurring issues (e.g., flooding reported every year in the same block during rainy season).
- Improvement patterns (e.g., a neighborhood's road score has improved 15 points in 90 days).

Trend insights are surfaced on the Trends tab and via smart alerts.

### 4.7 Predictive Insights

Using historical patterns, the AI generates predictive flags:
- "Road damage in this area historically spikes in January–February. Current conditions may worsen."
- "This area has a 70% on-time resolution rate for streetlight issues based on past reports."

Predictive insights are clearly labeled as AI-generated forecasts, not confirmed community reports.

### 4.8 AI Recommendations

Based on the user's saved places, contribution history, and current location:
- "3 new incidents were reported on your saved street, Oak Avenue."
- "Based on your commute, there are active road closures that may affect your route."
- "You confirmed a report 45 days ago. It's been resolved — here's the before & after."

### 4.9 AI Moderation Rules Engine

Configurable rule engine with conditions such as:
- Report cluster: ≥10 reports of the same category within 50m in 1 hour → trigger spam review.
- User pattern: same user submitting ≥5 unconfirmed reports in 24h → soft rate limit applied.
- Photo pattern: photo used in ≥3 different incident submissions → flag all affected incidents.
- Coordinate outlier: report GPS coordinates more than 200m from any of the user's device's recent location history → flag for review.

---

## 5. Community Health Score

### 5.1 Overview

The Community Health Score (CHS) is Civitas' core intelligence product — a single number from **0 to 100** representing the overall civic condition of any location, dynamically calculated from verified community data.

**Score labels:**
| Range | Label | Color |
|---|---|---|
| 85–100 | Excellent | Deep Green |
| 70–84 | Good | Light Green |
| 55–69 | Fair | Yellow |
| 40–54 | Concerning | Orange |
| 25–39 | Poor | Red |
| 0–24 | Critical | Dark Red |

### 5.2 Category Scores

Before the overall CHS is calculated, an individual score is calculated for each of the 39 civic categories. Category scores follow the same 0–100 scale.

**Category score inputs:**
- Number of active incidents in the area (negative impact).
- Average confidence score of active incidents.
- Severity ratings of active incidents.
- Number of active positive signals (positive impact).
- Unresolved incident age (older unresolved issues penalize the score more).
- Historical resolution rate for this category in this area.
- Recent trend direction (improving or declining).

### 5.3 Geographic Aggregation

CHS is calculated at five geographic tiers, each dynamically selected based on the map's current zoom level:

| Zoom Level | CHS Scope | Description |
|---|---|---|
| Street level | Street Score | 200m radius around a specific address |
| Neighborhood level | Neighborhood Score | 1–5km defined boundary |
| City level | City Score | Full municipal boundary |
| State/Region level | State Score | Aggregate of all city scores |
| Country level | Country Score | Aggregate of all state scores |

**Aggregation method:** Weighted average of category scores, with weights applied based on category impact (see Section 5.5).

### 5.4 Score Calculation Formula

```
CHS = Σ (category_score[i] × category_weight[i]) / Σ category_weight[i]
      × confidence_multiplier
      × data_freshness_factor
```

Where:
- `category_weight[i]` = predefined importance weight for category i (see Section 5.5).
- `confidence_multiplier` = 0.7 to 1.0, based on the density of community data available (sparse data → lower confidence → lower multiplier).
- `data_freshness_factor` = 0.85 to 1.0, penalizes areas with no new reports in 90+ days.

### 5.5 Category Weights

Higher-weight categories have a stronger impact on the CHS:

| Weight Tier | Categories |
|---|---|
| **Very High (5x)** | Gas Leak, Structural Hazard, Electrical Hazard, Flooding, Water Quality |
| **High (4x)** | Road Collapse, Major Safety Concern, Sewage Overflow |
| **Medium-High (3x)** | Pothole, Streetlight, Sidewalk Damage, Public Transit, Air Quality |
| **Medium (2x)** | Graffiti, Litter, Noise, Abandoned Vehicle, Drainage, Snow Removal |
| **Standard (1x)** | All remaining categories |
| **Positive (1x)** | All positive signal categories (add to score) |

### 5.6 Historical Scoring

Every CHS calculation is timestamped and stored. This allows:
- 30-day, 90-day, 1-year, and all-time score history charts.
- "How has this area changed?" comparisons.
- Before & After milestone stories (e.g., "After a road resurfacing project, Oak Street's score improved from 42 to 78 in 60 days").

### 5.7 Confidence Indicator

Every score display includes a data confidence indicator:
- **High confidence:** ≥50 community contributors in the area in the last 90 days.
- **Medium confidence:** 10–49 contributors.
- **Low confidence:** <10 contributors. Score displayed with a "Limited Data" label.

Areas with very low data coverage are encouraged to contribute via "Be the first to report in your area" prompts.

---

## 6. Trends, Rankings & Compare Places

### 6.1 Historical Trends

The Trends tab provides a time-series view of civic data for any location.

**Trend views:**
- **Overall CHS over time** (sparkline on location card, full chart on location profile).
- **Category trend:** Filter by any of the 39 categories to see incident frequency over time.
- **Resolution rate trend:** Is this area getting faster or slower at resolving issues?
- **Positive signal trend:** Are community members reporting more positive contributions?
- **Seasonal patterns:** AI-detected recurring seasonal issues (e.g., flooding every March).

### 6.2 Rankings

**"How does my neighborhood compare?"**

Rankings are available at multiple scopes:

| Ranking Type | Description |
|---|---|
| Top Neighborhoods by CHS | Best overall community health scores in a city |
| Most Improved (30/90 days) | Biggest CHS improvement over selected period |
| Fastest Resolution Rate | Which areas resolve issues quickest |
| Most Active Community | Areas with the highest community contribution density |
| Category Leaders | Best-scoring area for a specific category (e.g., "Best Road Maintenance") |
| Worst Performing | Areas needing the most attention — helpful for government prioritization |

Rankings are paginated, filterable, and shareable. A user can share "My neighborhood ranked #3 for park cleanliness in the city."

### 6.3 Compare Places

The Compare Places feature allows users to put 2–4 locations side by side.

**Comparison dimensions:**
- Overall Community Health Score
- Category-by-category breakdown
- Active incident count by category
- Resolution rate
- Average time to resolution
- Community participation density
- Score trend (last 90 days)
- AI-generated comparison summary ("Place A has significantly better road conditions but lower park quality than Place B.")

**Use cases:**
- Deciding between two neighborhoods for a move.
- Comparing two potential business locations.
- Government teams comparing two districts for resource allocation.
- Journalists writing about civic equity across neighborhoods.

### 6.4 Before & After

For incidents that have been resolved with photo evidence, Civitas automatically generates a Before & After card showing the incident photo alongside the resolution photo, with the timeline between them.

Before & After cards can be:
- Shared to social media.
- Featured in the location's Profile Story.
- Compiled into "Community Progress Reports" (a monthly digest feature).

### 6.5 Heat Maps

Available as an overlay on the main map:

- **Incident Density Heat Map:** Shows concentration of active issues. Darker = more active incidents.
- **Category Heat Map:** Focus on one category to see its geographic distribution.
- **Health Score Heat Map:** Color-codes the map by CHS, showing which areas are thriving and which need attention.
- **Positive Signal Heat Map:** Shows density of positive community contributions.

Heat maps are available at neighborhood and city scales. At street scale, individual pins provide better precision.

### 6.6 AI-Generated Insights

The Insights feed surfaces AI-generated observations:

- "Noise complaints in the Riverside District are up 60% compared to last month. 12 new reports this week."
- "Downtown's road quality score has improved 18 points in the past 60 days — the highest improvement in the city."
- "4 of the 5 most-confirmed reports in your area are in the 'Sidewalk Damage' category."
- "The Oak Park neighborhood has had no new incidents in 14 days — the longest quiet period in 2 years."

---

## 7. All 39 Categories & Positive Signals

### 7.1 Negative Incident Categories

Each category entry includes: icon, name, required confirmation threshold tier, photo requirement, proximity radius for duplicate detection.

#### 🔴 Infrastructure & Roads
| # | Icon | Category | Threshold Tier | Photo Required | Proximity |
|---|---|---|---|---|---|
| 1 | 🕳️ | Pothole | Standard | No | 20m |
| 2 | 🛣️ | Road Damage / Cracking | Standard | No | 30m |
| 3 | 🚧 | Road Collapse / Sinkhole | High | Yes | 15m |
| 4 | 🚶 | Sidewalk Damage | Standard | No | 25m |
| 5 | 🌉 | Bridge / Overpass Concern | High | Yes | 50m |
| 6 | 🚏 | Missing / Damaged Road Sign | Standard | No | 20m |
| 7 | 🚦 | Traffic Signal Issue | Standard | No | 20m |
| 8 | 🚲 | Bike Lane Obstruction / Damage | Standard | No | 30m |
| 9 | ♿ | Accessibility Barrier (ADA) | Standard | No | 20m |

#### 🟡 Utilities & Environment
| # | Icon | Category | Threshold Tier | Photo Required | Proximity |
|---|---|---|---|---|---|
| 10 | 💡 | Broken Streetlight | Standard | No | 10m |
| 11 | ⚡ | Electrical Hazard | Critical | Yes | 15m |
| 12 | 🔥 | Fire Hazard | Critical | Yes | 30m |
| 13 | 💧 | Water Main Break / Leak | High | Yes | 20m |
| 14 | 🌊 | Flooding | High | No | 100m |
| 15 | 🚿 | Sewage Overflow | High | Yes | 30m |
| 16 | 🌫️ | Air Quality Concern | Standard | No | 500m |
| 17 | 💧 | Water Quality Concern | High | No | 200m |
| 18 | 🌿 | Drainage Issue | Standard | No | 50m |
| 19 | ⛽ | Gas Leak (Suspected) | Critical | No | 50m |
| 20 | 🏗️ | Structural Hazard / Unsafe Building | Critical | Yes | 30m |

#### 🟠 Environment & Cleanliness
| # | Icon | Category | Threshold Tier | Photo Required | Proximity |
|---|---|---|---|---|---|
| 21 | 🗑️ | Illegal Dumping / Fly-Tipping | Standard | No | 30m |
| 22 | 🦟 | Pest / Rodent Infestation | Standard | No | 50m |
| 23 | 🌳 | Fallen Tree / Overgrown Vegetation | Standard | No | 15m |
| 24 | 🎨 | Graffiti / Vandalism | Standard | No | 20m |
| 25 | ❄️ | Snow / Ice Not Cleared | Low | No | 20m |
| 26 | 🚗 | Abandoned Vehicle | Standard | No | 5m |

#### 🟣 Public Spaces & Services
| # | Icon | Category | Threshold Tier | Photo Required | Proximity |
|---|---|---|---|---|---|
| 27 | 🌳 | Park / Green Space Neglect | Low | No | 50m |
| 28 | 🏋️ | Damaged Playground Equipment | Standard | No | 20m |
| 29 | 🚻 | Public Restroom Issue | Low | No | 20m |
| 30 | 🚌 | Public Transit Issue | Standard | No | 50m |
| 31 | 🚏 | Bus Stop Damage / Missing | Standard | No | 20m |
| 32 | 🔊 | Noise Pollution | Standard | No | 200m |
| 33 | 💨 | Excessive Pollution / Emissions | Standard | No | 300m |
| 34 | 🏚️ | Derelict / Unsafe Property | Standard | Yes | 30m |
| 35 | 🔒 | Public Safety Concern | High | No | 100m |

#### 🔵 Community & Construction
| # | Icon | Category | Threshold Tier | Photo Required | Proximity |
|---|---|---|---|---|---|
| 36 | 🏗️ | Construction Obstruction / Debris | Standard | No | 30m |
| 37 | 🌡️ | Environmental Contamination | High | Yes | 200m |
| 38 | 🏢 | Building Code Violation | Standard | Yes | 20m |
| 39 | 📋 | Other Civic Issue | Standard | No | 30m |

---

### 7.2 Positive Signal Categories

Positive Signals mirror the incident categories and use the same geographic logic but contribute positively to the CHS.

| # | Icon | Signal | Description |
|---|---|---|---|
| 1 | ✨ | Clean Street | Noticeably clean, well-maintained street |
| 2 | 🌸 | Well-Maintained Park | Green space in excellent condition |
| 3 | 💡 | Good Public Lighting | Well-lit streets at night |
| 4 | 🛣️ | Excellent Road Quality | Smooth, well-maintained road surface |
| 5 | 🚌 | Reliable Public Transport | On-time, well-functioning service |
| 6 | 🎨 | Community Art / Beautification | Public murals, sculptures, or beautification projects |
| 7 | 🌳 | Community Garden / Urban Green | Active community green spaces |
| 8 | 🏋️ | Well-Maintained Recreation Area | Playgrounds, courts, fitness equipment in good condition |
| 9 | ♿ | Good Accessibility | Accessible infrastructure, ramps, tactile paving |
| 10 | 🤝 | Active Community Initiative | Visible neighborhood improvement efforts |
| 11 | 🛡️ | Feels Safe | Area feels safe and well-maintained |
| 12 | 🔊 | Peaceful Environment | Quiet, low noise levels |

---

## 8. Monetization

Civitas is free for all community participants. Premium revenue is generated through intelligence layers that provide deeper value to professionals, organizations, and governments.

### 8.1 Free Tier (All Users)

- Report incidents and positive signals.
- Confirm and comment on incidents.
- View all public map pins and incident details.
- Access Community Health Scores for any location.
- Ask AI (limited to 10 queries per day).
- View 30-day trend history.
- 3 Saved Places.
- Standard notifications.

### 8.2 Civitas Premium (Consumer Subscription — $4.99/month or $39.99/year)

- Unlimited Ask AI queries.
- Extended 2-year trend history.
- Unlimited Saved Places with smart alerts.
- Compare Places (up to 4 locations simultaneously).
- Download personal area reports (PDF).
- Before & After photo collections for saved places.
- Advanced notification controls (category-specific, radius-specific).
- Priority support.
- "Civitas Premium" badge on profile.

### 8.3 Area Intelligence Reports (On-Demand Purchase)

One-time purchase for a detailed intelligence report on any neighborhood or property area.

**Report contents:**
- Full CHS breakdown with all 39 category scores.
- 12-month historical score chart.
- Top 10 active issues with confidence scores.
- Resolution rate analysis.
- Comparison to city average.
- AI-generated narrative summary.
- Community activity density.

**Pricing:**
- Street-level report: $4.99
- Neighborhood report: $9.99
- City district report: $24.99

**Target users:** Home buyers, renters, travelers, journalists, property investors.

### 8.4 Real Estate Intelligence Package ($29.99/month)

For real estate professionals and frequent movers:
- Unlimited area intelligence reports.
- Property-level civic history (all incidents ever reported within 100m of an address).
- School zone civic quality scores.
- Neighborhood trajectory score (AI-predicted CHS direction for next 6 months).
- White-label PDF reports for clients.
- API access for CRM integration (limited).

### 8.5 Business Location Intelligence ($49.99/month per location)

For businesses evaluating new locations or monitoring existing ones:
- Footfall area civic quality monitoring.
- Competitor area comparisons.
- Customer experience indicators (cleanliness, accessibility, public transport).
- Alert when conditions near the business change significantly.
- Monthly automated business location report.

### 8.6 Enterprise Dashboard (Custom Pricing — $500–$5,000/month)

For larger organizations: property management companies, retail chains, logistics companies, insurance providers.

- Multi-location portfolio monitoring.
- Custom geofences.
- Data export via API.
- Dedicated account manager.
- Custom report cadence and format.
- Historical data access (full archive).
- White-label reporting.

### 8.7 Government & Municipal Analytics (Custom Pricing — $2,000–$20,000/month)

For city councils, municipal services, urban planning departments.

- Pre-verified, deduplicated incident data stream.
- Priority queue for critical issues.
- Category-level trends for resource planning.
- API integration with existing 311 systems.
- Custom boundary definitions.
- Comparative analytics across districts.
- Resolution time benchmarking.
- Community engagement metrics.
- SLA reporting tools.

### 8.8 Developer API (Usage-Based Pricing)

RESTful and GraphQL APIs for third-party developers:

| Endpoint | Price |
|---|---|
| Current incidents by coordinates | $0.002/request |
| CHS by coordinates + radius | $0.005/request |
| Historical CHS timeseries | $0.01/request |
| Category breakdown | $0.003/request |
| Bulk data export (per 1,000 records) | $0.50 |

Free tier: 500 API calls/month. Ideal for urban analytics researchers, property tech startups, and smart city developers.

### 8.9 Historical Data Archive

One-time or subscription access to anonymized, aggregated historical civic data:
- City-level archives from Civitas launch date.
- CSV or JSON format.
- Use cases: academic research, urban planning, insurance actuarial data.

### 8.10 Smart Alerts (Monetization Layer)

Smart Alerts are a premium feature enabling real-time, highly customizable notifications:
- Custom radius (10m to 10km).
- Category-specific.
- Threshold-triggered (e.g., only notify when CHS drops below 50).
- Digest frequency (immediate, hourly, daily).
- Available as add-on for $1.99/month per custom alert beyond the 3 included in Premium.

---

## 9. Technical Architecture & Logic

### 9.1 Core Architecture

**Platform stack (recommended):**

| Layer | Technology |
|---|---|
| Mobile (iOS) | Swift / SwiftUI |
| Mobile (Android) | Kotlin / Jetpack Compose |
| Web App | React / Next.js |
| Backend API | Node.js (Express) or Go |
| Database (primary) | PostgreSQL with PostGIS extension |
| Search | Elasticsearch or Algolia |
| Cache | Redis |
| Object Storage (photos) | AWS S3 or GCP Cloud Storage |
| AI / ML | Python microservices (FastAPI) |
| LLM (Ask AI) | OpenAI GPT-4o or Anthropic Claude API |
| Image AI | CLIP embeddings + custom fine-tuned classifier |
| Maps | Mapbox or Google Maps SDK |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| CDN | Cloudflare |
| Auth | Auth0 or Supabase Auth |

### 9.2 Database Concepts

**Core entities:**

```
Users
  - id, display_name, email, password_hash, reputation_score, created_at, home_lat, home_lng

Incidents
  - id, category_id, status, lat, lng, title, description, created_by, created_at,
    confirmation_count, confidence_score, severity, geom (PostGIS geometry)

IncidentPhotos
  - id, incident_id, uploader_id, url, ai_status, created_at, exif_lat, exif_lng

IncidentConfirmations
  - id, incident_id, user_id, type (confirm/dispute), created_at, user_lat, user_lng

IncidentTimeline
  - id, incident_id, event_type, user_id, description, created_at

HealthScores
  - id, geohash, scope_level, score, calculated_at, confidence_level, data_points

PositiveSignals
  - id, category_id, lat, lng, created_by, confirmation_count, created_at, geom
```

**Spatial indexing:**
PostGIS is used for all geographic queries. Geospatial indexes (GIST) are applied to all `geom` columns. This enables efficient proximity queries, bounding box searches, and geographic aggregations.

### 9.3 Map Clustering

Client-side clustering uses the **Supercluster** library (or Mapbox's built-in clustering) to group nearby pins when zoomed out. Cluster behavior:
- Pins within 40px of each other at the current zoom level are grouped.
- Cluster bubble shows count and dominant category color.
- Tapping a cluster zooms in to expand it.
- At maximum zoom, individual pins are shown with full labels.

### 9.4 Geohash System

For Health Score calculations, the world is divided using the **geohash** system:
- Precision level 7 (~150m × 150m cells) for street-level scores.
- Precision level 5 (~5km × 5km cells) for neighborhood scores.
- Precision level 3 (~150km × 150km cells) for city/region scores.

Scores are pre-computed and cached per geohash cell on a rolling basis, reducing real-time computation load.

### 9.5 Search Architecture

Search uses a combination of:
- **Geocoding API** (Mapbox Geocoding or Google Maps Places API) for location name → coordinates.
- **Elasticsearch** for full-text search across incident descriptions, location names, and categories.
- **Semantic search** (embedding-based) for natural-language queries routed through the Ask AI pipeline.

### 9.6 Notification System

Push notification flow:
1. Event occurs (new report, confirmation threshold, resolution).
2. Backend publishes event to a message queue (Redis Streams or AWS SQS).
3. Notification service consumes the event and determines eligible recipients based on:
   - Proximity (users within the relevant radius).
   - User notification preferences.
   - Rate limiting (max 5 non-critical notifications per hour per user).
4. FCM delivers push to device.
5. In-app notification badge updates via WebSocket connection (or next app open).

### 9.7 Offline Behavior

**Offline capabilities:**
- The last loaded map state is cached locally.
- Incident reports can be drafted and queued offline; they are submitted automatically when connectivity is restored.
- Offline mode banner is displayed when the device has no internet connection.
- Cached health scores and incident details are viewable offline.

**Limitations displayed to user:** "You're offline. Your report will be submitted when you reconnect."

### 9.8 Photo Upload Pipeline

1. User selects photo.
2. Client compresses photo to max 2MB before upload.
3. Client uploads directly to S3 via pre-signed URL (bypasses main server for performance).
4. Upload confirmation is sent to the backend API.
5. Backend triggers AI analysis job asynchronously.
6. CDN URL is stored in the database once photo is approved.
7. Photo is served via CDN for all subsequent requests.

### 9.9 Scalability Considerations

- **Read-heavy workload:** Cache health scores, category counts, and popular incident details in Redis with TTL.
- **Geographic sharding:** Database can be sharded by geographic region for high-scale deployments.
- **AI microservices:** All AI workloads run in separate Python microservices with horizontal scaling via container orchestration (Kubernetes).
- **Rate limiting:** API gateway enforces per-user and per-IP rate limits.
- **Job queues:** All async tasks (AI analysis, notification dispatch, score recalculation) run through a durable job queue (BullMQ or AWS SQS).

---

## 10. Security & Anti-Fraud

### 10.1 GPS Spoofing Detection

GPS spoofing is the primary attack vector for fake reports. Civitas detects it through:

- **Speed anomaly check:** If a user's last GPS location was 500km away 5 minutes ago, the current location is flagged.
- **Location consistency check:** Device location history (stored temporarily, not shared) must be consistent with the report location.
- **Mock location detection:** Android and iOS APIs expose whether developer mode or mock location apps are active.
- **Cross-device correlation:** Multiple reports from different accounts originating from the exact same GPS coordinate cluster (within 1m) trigger a spoofing alert.
- **Wi-Fi/cell tower triangulation cross-check:** On supported devices, cell tower data provides a secondary location estimate to validate GPS claims.

**Outcome of detection:** Report flagged for manual review. Repeated offenses result in account restriction.

### 10.2 Fake Account Detection

At registration and during activity monitoring:

- **Email verification required** before first report submission.
- **Phone number verification** optionally required for high-activity or high-reputation operations.
- **Device fingerprinting:** Detects multiple accounts from the same physical device.
- **Behavioral analysis:** Accounts that only confirm other accounts' reports without ever being in the area are flagged.
- **Velocity check:** Account age < 24 hours cannot confirm more than 3 reports.
- **IP address monitoring:** Multiple account registrations from the same IP in a short window are flagged.

### 10.3 Spam & Coordinated Abuse Prevention

- **Report velocity limits:** Max 10 new incident reports per user per day in v1. Max 20 confirmations per day.
- **Category flooding detection:** If a single user or IP cluster submits ≥5 reports in the same category within the same 200m radius in 1 hour, all reports are held for manual review.
- **Social graph analysis:** Accounts that predominantly interact with each other (e.g., User A always confirms User B's reports and vice versa) are flagged for review.
- **Bot detection:** CAPTCHA or invisible challenge for accounts exhibiting automated behavior patterns.

### 10.4 AI Image Verification (Security Layer)

Beyond the AI moderation described in Section 4.7, photos are checked for:
- **Copyright / stock image match:** Reverse image search against known stock photo databases.
- **Temporal impossibility:** EXIF metadata timestamp predates the incident submission by more than 24 hours.
- **Geographic impossibility:** Visual features in the photo (e.g., tropical vegetation, foreign language signs) are inconsistent with the GPS coordinates.

### 10.5 User Reliability Score

Separate from the public Reputation Score, an internal **Reliability Score** tracks data quality:
- Starts at 0.5 (neutral) for all new accounts.
- Increases when the user's reports are confirmed by the community.
- Decreases when reports are disputed or removed.
- Reliability Score affects how much weight the user's confirmations carry in the confidence calculation.
- Users with Reliability Score below 0.2 have their reports auto-placed in manual review queue.

### 10.6 Rate Limiting

Applied at multiple levels:

| Action | Limit |
|---|---|
| New report submission | 10/day per user, 3/hour |
| Photo upload | 25/day per user |
| Confirmations | 20/day per user |
| API requests (public key) | 100/hour |
| API requests (authenticated key) | 1,000/hour |
| Ask AI queries (free tier) | 10/day |
| Account registration per IP | 3/day |

### 10.7 Privacy

- User GPS location is only collected during active use (not background tracking).
- Precise GPS coordinates of reports are fuzzy-rounded to 10m for display (preventing exact address exposure).
- User identity is never exposed on public incident pins — only display name and reputation tier.
- Photos are stripped of EXIF metadata before being served publicly.
- Users can request account deletion, which anonymizes their data (replaces user_id references with a generic `[Deleted User]` token).
- Compliance: GDPR (EU), CCPA (California), PDPA (applicable jurisdictions).

### 10.8 Legal Considerations

- **Content moderation:** Civitas is a platform, not a publisher. User-generated content is subject to the community guidelines and content policy.
- **Defamation risk:** Reports that target specific individuals (e.g., naming a neighbor) are prohibited by community guidelines and auto-flagged by the AI content filter.
- **Emergency disclaimer:** Civitas is not an emergency reporting service. Critical category reports display a banner: "If this is an active emergency, contact emergency services immediately."
- **Government data use:** When governments access the API, terms of service restrict use to civic improvement purposes only.
- **Data retention:** Incident data is retained indefinitely to support historical analysis. Anonymized export data is available for research under license.

### 10.9 Incident Appeals

If a user's report is removed:
1. They receive a notification explaining the removal reason.
2. They have 7 days to submit an appeal via in-app form.
3. Appeal is reviewed by a human moderator within 48 hours.
4. Outcome: reinstated or confirmed removed. Decision is final in v1.
5. Repeated removed reports (≥3 in 30 days) result in a temporary posting suspension.

### 10.10 Audit Trails

Every moderation action, AI decision, and status change is logged in an immutable audit table:

```
AuditLog
  - id, entity_type, entity_id, action, actor_type (user/ai/moderator), actor_id,
    reason, previous_state, new_state, timestamp
```

Audit logs are accessible to:
- The user for their own content (via a "Content history" page in settings).
- Internal moderators and admins.
- Authorized government API partners (for incidents relevant to their jurisdiction).

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **CHS** | Community Health Score — Civitas' core metric for civic condition at any location. |
| **Incident** | A reported civic issue, represented by a single pin on the map. |
| **Positive Signal** | A community report highlighting something working well in an area. |
| **Confirmation** | A community member's verification that an incident is real and current. |
| **Confidence Score** | A per-incident score (0–100) reflecting the strength of community evidence. |
| **Duplicate Detection** | Automated process to identify when a new report matches an existing incident. |
| **Resolution** | A community submission indicating that an incident has been fixed or addressed. |
| **Geohash** | A geographic coordinate encoding system used to organize spatial data into grid cells. |
| **Ask AI** | Civitas' conversational AI feature for natural-language queries about any location. |
| **Reliability Score** | Internal user data quality score used in confidence calculations. |
| **Reputation Score** | Public user score reflecting total community contribution quality. |
| **Timeline** | Append-only, immutable event log for each incident. |

---

## Appendix B: MVP Scope Recommendation

For an initial launch, the following features constitute a viable MVP:

**MVP Includes:**
- User registration and authentication.
- Core reporting flow (20 most common categories).
- One-pin-per-incident model with duplicate detection.
- Community confirmations (threshold: 3).
- Basic resolution flow.
- Community Health Score (neighborhood level only).
- Map with clustering and category filters.
- Ask AI (basic, limited to 5 queries/day).
- Push notifications (new nearby reports, threshold reached, resolved).
- User profile and basic reputation scoring.
- Photo upload with basic AI moderation.

**Deferred to v1.1:**
- Compare Places.
- Rankings and Trends tab.
- Before & After cards.
- Heat maps.
- Advanced AI features (predictive insights, full trend analysis).
- Enterprise and government API.
- Monetization layer (Premium subscription).

**Deferred to v2.0:**
- Full 39 categories.
- Area Intelligence Reports (purchasable).
- Developer API marketplace.
- Government analytics dashboard.

---

*Document prepared as the authoritative product specification for Civitas — the community intelligence platform. Intended for use by product, engineering, design, and AI development teams.*

*Last updated: July 2026*
