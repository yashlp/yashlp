# Loci — Master Product Requirements Document

> **Loci** (pronounced *LOW-sy*, the Latin plural of *locus*, "places")
> **The Community Intelligence Platform**
>
> _Every place has a story. Loci helps the community tell it._

---

## Document Purpose

This is the single, continuous **master specification** for Loci. It is written to be handed directly to engineers, designers, and AI coding tools (e.g., Cursor). It describes not only **what** Loci does, but **how it works** — from the moment a user opens the app to the way data flows through the backend, AI, and database.

Every major feature in this document is described using a consistent structure:

- **Purpose** — Why the feature exists.
- **User Flow** — Step-by-step interaction from the user's perspective.
- **System Flow** — What the backend, AI, and database do after each action.
- **Decision Logic** — The rules that determine outcomes (when a report becomes visible, when a status changes, how confidence is calculated).
- **Edge Cases** — How the app behaves when users disagree, submit duplicates, upload poor-quality photos, or attempt abuse.

> **Framing note:** Loci is **not** a "reporting app." It is a **community intelligence platform**. This mindset shapes every design decision and keeps the product focused on helping people *understand places*, not merely report problems.

### Table of Contents

1. [Product Vision & Core Concept](#1-product-vision--core-concept)
2. [Complete User Journey](#2-complete-user-journey)
3. [Incident & Verification System](#3-incident--verification-system)
4. [AI Features](#4-ai-features)
5. [Community Health Score](#5-community-health-score)
6. [Trends, Rankings & Compare](#6-trends-rankings--compare)
7. [All 39 Categories & Positive Signals](#7-all-39-categories--positive-signals)
8. [Monetization](#8-monetization)
9. [Technical Logic](#9-technical-logic)
10. [Security & Anti-Fraud](#10-security--anti-fraud)
11. [Glossary](#11-glossary)

---

## 1. Product Vision & Core Concept

### 1.1 Overview

**Loci** is an AI-powered **Community Intelligence Platform** that transforms how people understand, monitor, and improve the places around them. Rather than functioning as a traditional complaint portal, Loci creates a **living digital profile** for every street, neighborhood, city, state, and country through community-verified data, AI-powered insights, historical records, and real-time updates.

The platform allows citizens to report both **negative civic issues** and **positive community contributions**, while ensuring that information is verified by multiple independent community members before becoming highly trusted. Every location becomes a continuously evolving source of information, helping residents, travelers, businesses, researchers, and governments make better decisions.

Loci is designed around one simple philosophy:

> **Every place has a story. Loci helps the community tell it.**

Unlike existing civic reporting platforms that focus only on submitting complaints, Loci creates a complete intelligence layer for places. Users can discover current issues, view historical trends, compare neighborhoods, monitor improvements, ask AI questions about any location, and contribute evidence that helps build a trusted community knowledge base.

The platform supports **39 civic issue categories** and a matching set of **positive community signals**, allowing users to highlight both problems and improvements. Every incident is represented by a **single smart map pin**, preventing duplicate reports while allowing unlimited community confirmations, comments, and photo evidence. As conditions change, the same incident evolves through community verification instead of creating unnecessary duplicate pins.

Artificial intelligence acts as an assistant throughout the platform: detecting duplicate reports, identifying manipulated or irrelevant images, summarizing community feedback, surfacing trends, and answering natural-language questions about any place. Rather than replacing human judgment, AI strengthens the quality, organization, and reliability of community-generated information.

One of Loci's core innovations is its **Community Health Score** — a dynamic scoring system that measures the overall condition of an area using verified community data. Scores automatically adapt based on the map's zoom level, letting users view health scores for individual streets, neighborhoods, cities, states, or entire countries. Every score is supported by transparent evidence, historical trends, and community confidence.

Every reported incident follows a complete lifecycle: community members report new issues, confirm existing incidents, upload supporting photos, add comments, and later verify that an issue has been resolved. Rather than deleting old reports, Loci preserves the full timeline of each incident — a permanent history of how communities improve over time.

Beyond community reporting, Loci is a decision-making platform. Users can compare locations, explore rankings, analyze trends, discover safer neighborhoods, evaluate infrastructure quality, review cleanliness, assess public services, and receive AI-generated summaries before making important decisions such as buying property, renting a home, opening a business, selecting schools, or traveling to unfamiliar areas.

The platform is free for public participation. Revenue is generated through advanced analytics, enterprise dashboards, professional area-intelligence reports, real-estate insights, business location analysis, developer APIs, historical datasets, and specialized intelligence services for organizations that require deeper location-based insight.

Trust is the foundation. Every incident displays its current status, community confirmations, confidence score, evidence, comments, photos, timeline, and verification history. Users build reputation over time through accurate contributions, while AI and community moderation reduce spam, abuse, duplicates, and misinformation.

Ultimately, Loci aims to become the world's most trusted source of community intelligence by combining local knowledge, artificial intelligence, transparent verification, and historical place data into one comprehensive platform.

### 1.2 Vision

To become the world's most trusted **community intelligence platform**, where every place has a transparent, community-verified history that helps people make better decisions about where they live, work, travel, invest, and build communities.

### 1.3 Mission

To empower communities by transforming everyday local observations into trusted, verified intelligence that improves transparency, accountability, and quality of life — while helping governments, businesses, and citizens make informed decisions.

### 1.4 Problem Statement

- Information about the real condition of a place is **fragmented, outdated, or hidden** across government portals, review sites, news, and word of mouth.
- Existing civic apps are **complaint funnels**: they collect reports but rarely verify them, rarely close the loop, and never build a durable, comparable history.
- People making high-stakes decisions (renting, buying, relocating, opening a business, traveling) lack a **trustworthy, place-level intelligence layer**.
- Positive change is invisible: when a community fixes something, there is no shared record that captures the improvement.

### 1.5 Target Users

| Segment | Primary Need |
| --- | --- |
| **Residents** | Understand and improve their own neighborhood. |
| **Movers / Renters / Buyers** | Evaluate an area before committing. |
| **Travelers** | Assess safety and conditions of unfamiliar places. |
| **Businesses** | Location intelligence for site selection and operations. |
| **Real-estate professionals** | Objective, evidence-backed area reports. |
| **Researchers & journalists** | Historical, structured civic datasets. |
| **Governments & agencies** | Ground-truth signals and accountability analytics. |

### 1.6 Value Proposition

- **For citizens:** A free, trusted way to see the truth about any place and to make their voice count through verified contributions.
- **For decision-makers:** A single, evidence-backed intelligence layer that replaces guesswork with community-verified data and AI insight.
- **For organizations:** Deep, structured, historical location intelligence available through dashboards, reports, and APIs.

### 1.7 Why Loci Is Different

1. **Intelligence, not complaints** — a living profile for every place, not a ticket queue.
2. **One-pin-per-incident** — no duplicate clutter; incidents evolve through community verification.
3. **Positive + negative signals** — captures improvements, not just problems.
4. **Community Health Score** — a transparent, zoom-adaptive measure of place condition.
5. **AI as an assistant** — improves quality and organization without replacing human judgment.
6. **Permanent, evidence-backed history** — nothing is deleted; the timeline endures.
7. **Trust by design** — confidence scores, reputation, and audit trails are visible everywhere.

### 1.8 Product Philosophy

Loci is built on the belief that communities understand their neighborhoods better than anyone else. By combining community participation with artificial intelligence and transparent verification, Loci creates a living knowledge base that continuously reflects the real condition of every place.

The goal is not simply to report problems — it is to help communities **understand, compare, celebrate improvements, and drive positive change** through reliable, data-driven community intelligence.

---

## 2. Complete User Journey

This section walks through the entire experience, from the first launch to advanced participation. Each sub-flow uses the standard Purpose / User Flow / System Flow / Decision Logic / Edge Cases structure.

### 2.1 First-Time Onboarding

**Purpose** — Communicate the "community intelligence" concept in seconds, earn location permission, and get the user to a useful map fast.

**User Flow**
1. User installs and opens Loci.
2. A short 3-screen intro frames the product: *See any place clearly → Contribute verified signals → Watch communities improve.*
3. User is invited to allow location access (with a clear reason and a "not now" option).
4. User lands on the **live map**, centered on their location (or a sensible default if permission is denied).
5. A lightweight coach-mark points to "Report," "Ask AI," and the Health Score badge.

**System Flow**
- Client requests OS location permission; result cached in local settings.
- App fetches nearby incidents, positive signals, and the area Health Score for the initial viewport.
- Onboarding completion flag stored locally and (after signup) synced to the user profile.

**Decision Logic**
- Location granted → center on user; **denied** → center on last-known or IP-approximate region with a persistent "Enable location" prompt.
- Onboarding intro shown only once per install (re-shown after major version changes to features).

**Edge Cases**
- No network at first launch → show cached/empty map with a retry banner; onboarding still completes.
- Location permission revoked later → map still works; contribution flows that need GPS prompt for re-enable.

### 2.2 Registration & Login

**Purpose** — Enable trusted contribution and reputation while keeping **read-only browsing anonymous**.

**User Flow**
1. Browsing, searching, and viewing incidents require **no account**.
2. When the user attempts to contribute (report, confirm, comment, upload, resolve), they are prompted to sign in.
3. Sign-in options: email + password, magic link, and OAuth (Apple, Google).
4. New users pick a display name; a starter reputation is assigned.

**System Flow**
- Auth service issues short-lived access token + refresh token.
- On first sign-in, a `User` record and a `ReputationProfile` are created.
- Device is registered for push notifications (opt-in).

**Decision Logic**
- Contribution endpoints require an authenticated, non-banned user above the minimum reputation for that action (see §10).
- Email verification required before a user's contributions count toward verification thresholds.

**Edge Cases**
- Duplicate email → route to login/reset instead of creating a second account.
- OAuth returns no email → request a verified email before enabling contributions.
- Account under moderation → login allowed but contribution disabled with an explanation and appeal link.

### 2.3 Home Map Experience

**Purpose** — Make the map the home base: a clear, real-time picture of any area and its Health Score.

**User Flow**
1. User sees a clustered map of incidents and positive signals around them.
2. A **Health Score badge** reflects the current viewport (street → country as they zoom).
3. Tapping a pin opens the incident detail (status, confidence, photos, timeline, comments).
4. A floating **Report** button and an **Ask AI** entry point are always reachable.
5. Panning/zooming refreshes data for the new viewport.

**System Flow**
- Client sends viewport bounds + zoom; server returns clustered pins, positive signals, and an aggregated Health Score for that geographic level.
- Results are cached client-side keyed by geohash + zoom bucket to minimize refetching.
- Real-time channel pushes updates (new confirmations, status changes) for the visible area.

**Decision Logic**
- **Clustering** activates when pin density exceeds a per-zoom threshold; clusters show dominant category + count.
- Which pins are shown depends on **visibility rules** (see §3.4): unverified low-confidence reports may be hidden or shown faintly depending on the viewer's settings.
- Health Score aggregation level is chosen by zoom bucket (street/area/city/state/country).

**Edge Cases**
- Extremely dense areas → aggressive clustering + server-side cap with "zoom in for detail."
- Sparse/no data area → show "Be the first to add a signal here" empty state and a neutral Health Score with low confidence.
- Rapid panning → debounce requests; cancel stale ones.

### 2.4 Reporting Flow

**Purpose** — Capture a new incident quickly and accurately while preventing duplicates.

**User Flow**
1. User taps **Report**.
2. User selects a **category** (e.g., 🕳️ Pothole) from the 39 categories or positive signals.
3. GPS captures the location (user can fine-tune the pin).
4. The app checks whether a **similar incident already exists nearby**.
5. **If one exists**, the user is invited to **confirm it**, add photos, or comment (see §2.5).
6. **If none exists**, a new incident draft is created.
7. User optionally adds photo(s) and a short description.
8. AI verifies the photo and category (see §4).
9. Incident is submitted and enters the verification lifecycle (see §3).

**System Flow**
- Client sends `{category, lat, lng, photos[], note}`.
- Server runs **duplicate detection** (spatial + category + temporal + optional image similarity).
- If no duplicate, an `Incident` is created in `PENDING` status with an initial `Confirmation` from the reporter.
- AI pipeline runs asynchronously: category-image match, manipulation/fake detection, quality/NSFW checks.
- Media stored in object storage; EXIF captured for anti-fraud (then stripped from public view).

**Decision Logic**
- **Duplicate match** if an existing active incident is within the category's spatial radius **and** same/adjacent category **and** within the time window (see §3.6).
- Some categories **require** at least one photo; others make it optional (see §7).
- AI verdicts adjust confidence and moderation state but do **not** unilaterally delete a report (see §4.9).

**Edge Cases**
- GPS unavailable/inaccurate → require manual pin placement; flag low location confidence.
- Poor-quality/irrelevant photo → AI flags it; user is asked to retake or proceed with reduced confidence.
- Offline submission → queued locally and synced when back online (see §9.7).
- Rapid repeated submissions → rate-limited (see §10.6).

### 2.5 Confirming Incidents

**Purpose** — Let the community independently verify that an incident is real and current — the core of Loci's trust model.

**User Flow**
1. User opens an existing incident (from map, search, or notification).
2. User taps **Confirm** ("I see this too") and may add photos/comment.
3. The incident's confirmation count and confidence increase.
4. When the threshold is met, the incident becomes **Verified/publicly prominent**.

**System Flow**
- Server records a `Confirmation` tied to the user, timestamp, distance-from-pin, and reputation weight.
- Confidence recomputed (see §3.7); status may transition `PENDING → VERIFIED`.
- Real-time update pushed to viewers; contributors gain reputation on later corroboration.

**Decision Logic**
- Only **independent** confirmations count: distinct users, plausibly on-site (location check), within a freshness window.
- Confirmation weight scales with **reputation** and **proximity**; capped to prevent any single user dominating.
- Threshold varies by category severity (see §7).

**Edge Cases**
- User tries to confirm their own report → blocked (reporter's initial submission already counts once).
- Confirmations from implausible locations → down-weighted or rejected (GPS-spoofing checks, §10.1).
- Mass confirmations from linked accounts → collusion detection reduces weight (§10.2).

### 2.6 Resolving Incidents

**Purpose** — Close the loop: record when an issue is fixed while preserving the full history.

**User Flow**
1. On an active incident, a user submits a **Resolved** update, ideally with "after" photos.
2. Nearby users **confirm or dispute** the resolution.
3. Once resolution confirmations pass the threshold, the pin moves **Active → Resolved**.
4. The incident keeps its full timeline and evidence; the map can show resolved pins faintly or on demand.

**System Flow**
- A `ResolutionClaim` is added to the incident timeline with media and author.
- Server tallies resolution confirmations/disputes with the same weighting model.
- On success, status transitions to `RESOLVED`; Health Score for the area is recalculated.

**Decision Logic**
- Resolution requires its **own** confirmation threshold (independent from the original report).
- Disputes above a threshold **revert** the claim and can move the incident back to `ACTIVE` / `DISPUTED`.
- Severe categories may require photo evidence for resolution.

**Edge Cases**
- Premature/false resolution → disputes revert; repeated false claims hurt claimant reputation.
- Issue reoccurs after resolution → users can **reopen** (new lifecycle stage linked to prior history).
- Resolver is the original reporter → allowed but still needs independent confirmations.

### 2.7 Positive Signal Flow

**Purpose** — Capture improvements and community assets (new park, repaired road, added lighting), not just problems.

**User Flow**
1. User taps Report → chooses a **Positive Signal** category.
2. GPS + optional photo + short note.
3. Community confirms; the signal contributes **positively** to the area's Health Score.

**System Flow**
- Stored as an `Incident` of `type = POSITIVE` with its own thresholds and scoring sign.
- Same duplicate detection, AI checks, and verification lifecycle apply.

**Decision Logic**
- Positive signals **raise** the Health Score; negative incidents **lower** it, weighted by category and confidence.
- Positive signals can also expire/decay if not re-confirmed over long periods (configurable per category).

**Edge Cases**
- Fake "positive" reports to inflate an area → same anti-fraud + confirmation requirements apply.
- Duplicate positive signals near an existing one → merged via duplicate detection.

### 2.8 Search

**Purpose** — Let users find places, categories, and incidents instantly.

**User Flow**
1. User searches an address, place name, category, or free-text query.
2. Results include locations, matching incidents, and an option to "Ask AI about this place."
3. Selecting a location recenters the map and shows its Health Score + summary.

**System Flow**
- Geocoding for places/addresses; full-text + category index for incidents.
- Optional semantic search over incident text/comments via embeddings.

**Decision Logic**
- Ranking blends text relevance, proximity, recency, and confidence.
- Category queries filter the map and drive the Health Score breakdown.

**Edge Cases**
- Ambiguous place names → disambiguation list.
- No results → suggest nearby areas or "Ask AI."

### 2.9 Saved Places

**Purpose** — Let users monitor areas they care about (home, work, family, prospective neighborhoods).

**User Flow**
1. User saves a location/area with an optional label.
2. Saved places appear in a dashboard with current Health Score + recent changes.
3. Users can enable **Smart Alerts** for each saved place.

**System Flow**
- `SavedPlace` records (point or polygon) linked to the user.
- Background jobs compute deltas and drive notifications.

**Decision Logic**
- Alert triggers: new high-severity incident, notable score change, resolution of a followed incident.
- Free tier allows a limited number of saved places; more via premium (see §8).

**Edge Cases**
- Overlapping saved areas → de-duplicate alerts.
- Deleted/merged incident within a saved area → notify with context.

### 2.10 Notifications

**Purpose** — Keep users informed about places and incidents they care about — without noise.

**User Flow**
1. User receives push/in-app notifications: confirmations on their reports, status changes, saved-place activity, and reputation milestones.
2. Tapping a notification deep-links to the relevant incident/place.
3. Granular preferences per type and per saved place.

**System Flow**
- Event bus emits domain events (e.g., `IncidentVerified`, `ResolutionConfirmed`).
- Notification service applies user preferences, batching, and quiet hours, then dispatches via push/email/in-app.

**Decision Logic**
- Batch low-priority events; send high-severity events immediately.
- Respect quiet hours and frequency caps.

**Edge Cases**
- Token invalidation → fall back to in-app/email; prune dead tokens.
- Notification storms (viral incident) → aggregate into a single digest.

### 2.11 Profile & Reputation

**Purpose** — Reward accurate contribution and make trust legible.

**User Flow**
1. Profile shows contributions, accuracy, reputation level/badges, and impact (e.g., issues resolved).
2. Reputation unlocks capabilities (higher confirmation weight, faster visibility, moderation privileges).

**System Flow**
- `ReputationProfile` updated by outcomes: corroborated reports/confirmations raise reputation; disproven/abusive actions lower it.
- Level thresholds and badges computed from rolling accuracy + volume.

**Decision Logic**
- Reputation weighting feeds confidence, confirmation weight, and anti-fraud (see §10.5).
- Diminishing returns on volume to reward **quality over quantity**.

**Edge Cases**
- Reputation farming via collusion → detected and reversed (§10.2).
- Long inactivity → weighting gently decays; core reputation preserved.

---

## 3. Incident & Verification System

The verification system is the trust engine of Loci. It guarantees one clean record per real-world issue, evolving through transparent, community-driven verification.

### 3.1 One-Pin-Per-Incident Model

**Purpose** — Prevent duplicate clutter; keep a single canonical record per real-world issue that everyone contributes to.

**System Flow**
- Every real-world issue maps to exactly one `Incident` with a canonical location, category, status, confidence, media, comments, and timeline.
- New reports near an existing incident become **confirmations/contributions**, not new pins.

**Decision Logic**
- Canonical location is the reporter's pin, refined over time by the centroid of confirmations.
- Adjacent-but-distinct issues (same category, but clearly separate locations) remain separate incidents based on the category's spatial radius.

**Edge Cases**
- Two genuinely different issues merged by mistake → moderators/users can **split**.
- Two records for one issue → **merge**, preserving both timelines.

### 3.2 Community Confirmations

See §2.5. Confirmations are independent corroborations that raise confidence and drive verification. Each confirmation stores: user, timestamp, proximity, reputation weight, and optional media/comment.

### 3.3 Resolution Workflow

See §2.6. Resolution is a separate, independently-verified lifecycle stage that transitions an incident to `RESOLVED` while preserving history, with dispute-driven revert/reopen paths.

### 3.4 Status Transitions

**States:** `PENDING` → `VERIFIED` (a.k.a. Active) → `RESOLVED`; with side states `DISPUTED`, `REOPENED`, `EXPIRED`, and `REMOVED`.

```
PENDING ──(confirmations ≥ threshold)──▶ VERIFIED/ACTIVE
PENDING ──(AI+community reject / no support + time)──▶ EXPIRED or REMOVED
VERIFIED ──(resolution confirmations ≥ threshold)──▶ RESOLVED
VERIFIED ──(disputes ≥ threshold)──▶ DISPUTED ──(re-verify)──▶ VERIFIED
RESOLVED ──(new reports of recurrence)──▶ REOPENED ──▶ VERIFIED
any ──(policy violation, appealable)──▶ REMOVED
```

**Decision Logic**
- Transitions are driven by **weighted confirmation/dispute tallies** crossing category-specific thresholds, plus time-based decay for stale, unsupported reports.
- AI verdicts influence confidence and moderation flags but do not solely trigger `REMOVED` (human/appeal path required for contested removals).

**Edge Cases**
- Flapping between states → hysteresis (require a margin beyond the threshold to flip back).
- Long-dormant `PENDING` with no support → `EXPIRED` (kept in history, hidden from default map).

### 3.5 Incident Timeline

**Purpose** — Provide a permanent, auditable history of everything that happened to an incident.

**System Flow**
- Append-only `TimelineEvent` log: created, confirmed, commented, photo added, disputed, resolution claimed, status changed, merged/split, moderated.
- Every event records actor (or "system"/"AI"), timestamp, and payload.

**Decision Logic**
- Nothing is deleted; corrections are new events. Public view may redact personal data while preserving the audit record internally.

**Edge Cases**
- Media removed for policy reasons → replaced with a tombstone entry (kept for audit, hidden from public).

### 3.6 Duplicate Detection

**Purpose** — Route new reports to existing incidents instead of creating duplicates.

**System Flow (at report time)**
1. Spatial query for active incidents within the category's radius.
2. Filter by same/adjacent category and a temporal freshness window.
3. Optional **image similarity** (perceptual hash + embeddings) to strengthen the match.
4. Rank candidates; if the top candidate clears the match threshold, offer "Confirm existing"; else create new.

**Decision Logic**
- Match score = f(distance, category similarity, time proximity, image similarity).
- Category-specific radii (e.g., a pothole radius is small; "poor air quality" is large).

**Edge Cases**
- Borderline match → present the candidate but let the user choose "This is different."
- Moving/again-recurring issues → allow linking to prior resolved incident as a reopen.

### 3.7 Confidence Calculation

**Purpose** — Express, transparently, how trustworthy an incident's current state is.

**Model (conceptual)**

```
confidence = normalize(
    Σ (confirmation_weight_i) 
  − Σ (dispute_weight_j)
  + recency_bonus
  + evidence_bonus(photos, AI_checks_passed)
  − staleness_penalty
)
where weight = base × reputation_factor × proximity_factor × independence_factor
```

**Decision Logic**
- Confidence is bounded [0, 1] (shown as %); it rises with independent, high-reputation, on-site confirmations and fresh evidence, and falls with disputes, staleness, and failed AI checks.
- Verification/visibility thresholds are defined **per category** (see §7).

**Edge Cases**
- Single high-reputation reporter → meaningful but capped confidence until independent corroboration.
- Coordinated confirmations → independence factor collapses their combined weight (§10.2).

### 3.8 Photo Handling

**Purpose** — Use imagery as strong evidence while protecting privacy and preventing abuse.

**System Flow**
- Client uploads to object storage via signed URLs; server records media metadata + EXIF (for anti-fraud), then serves privacy-safe versions (EXIF stripped, faces/plates optionally blurred).
- AI runs quality, relevance, manipulation, and NSFW checks (see §4).

**Decision Logic**
- Some categories require ≥1 photo (see §7); resolution of severe categories may require "after" photos.
- Failed manipulation/NSFW checks quarantine the media pending review; they don't silently delete the incident.

**Edge Cases**
- Low-quality/blurry → prompt retake; reduced evidence bonus if kept.
- Sensitive content (faces, plates, minors) → auto-blur / restrict.
- Reused/old photo (image reuse detection) → flagged, weight reduced.

### 3.9 Comment System

**Purpose** — Let the community add context, corrections, and local knowledge.

**System Flow**
- Threaded `Comment` records tied to incidents; AI moderation screens for abuse/spam; users can react/flag.

**Decision Logic**
- Comments don't change status directly but can be surfaced by AI summaries and influence dispute signals.
- Reputation gates (e.g., minimum level to comment during high-abuse periods).

**Edge Cases**
- Abusive/spam comments → AI hides pending review; repeat offenders rate-limited/suspended.
- Off-topic threads → collapsed, not deleted.

### 3.10 AI Moderation (within incidents)

See §4.9 for full rules. In-incident, AI: matches photo↔category, detects fakes/duplicates/wrong-category, screens comments, and drafts summaries — always as **assistive signals**, with human appeal for contested actions.

---

## 4. AI Features

AI is an assistant that improves quality, organization, and reliability. It augments — never silently overrides — human judgment. Every consequential AI action is logged and appealable.

### 4.1 Ask AI

**Purpose** — Answer natural-language questions about any place using verified Loci data.

**User Flow**
1. User taps **Ask AI** and asks, e.g., "Is this neighborhood safe at night?" or "How's the road quality on Main St over the last year?"
2. Loci returns a grounded, cited answer with links to the underlying incidents, trends, and Health Score.

**System Flow**
- Query + current map context → retrieval over incidents, scores, and trends (RAG) → grounded LLM response with citations to specific records.

**Decision Logic**
- Answers must cite verified data; low-confidence areas produce hedged answers ("limited data").
- No fabrication: if data is missing, say so and suggest contributing.

**Edge Cases**
- Sparse data → transparent "not enough verified data yet."
- Prompt-injection via user content/comments → sanitize retrieved text; never follow embedded instructions.

### 4.2 AI Summaries

**Purpose** — Condense many confirmations, comments, and events into a readable synopsis per incident and per area.

**System/Decision** — Summaries are generated from verified content, labeled "AI summary," refreshed on material change, and always link to sources.

**Edge Cases** — Conflicting reports → present both sides rather than forcing consensus.

### 4.3 Duplicate Image Detection

**Purpose** — Catch reused or duplicated photos across reports.

**System/Decision** — Perceptual hashing + embeddings compare new uploads against existing media; matches reduce evidence weight and flag potential fraud.

**Edge Cases** — Legitimate similar scenes (same pothole re-photographed) → linked to the same incident rather than penalized.

### 4.4 Fake / Manipulated Image Detection

**Purpose** — Detect AI-generated, edited, or out-of-context images.

**System/Decision** — Manipulation classifiers + metadata/EXIF consistency + reverse-image signals produce a manipulation score; high scores quarantine media for review and lower confidence.

**Edge Cases** — False positives → human review path; user can appeal.

### 4.5 Wrong-Category Detection

**Purpose** — Ensure the photo/description matches the chosen category.

**System/Decision** — Vision–text classification compares media/description to the selected category; mismatches suggest a better category to the user and reduce confidence until corrected.

**Edge Cases** — Ambiguous multi-issue photos → suggest primary category + allow secondary tags.

### 4.6 Trend Analysis

**Purpose** — Reveal how an area is changing over time.

**System/Decision** — Time-series over incidents/scores by category and geography surface rising/falling patterns, seasonality, and hotspots, feeding §6.

**Edge Cases** — Sparse history → widen the geographic/temporal window and mark low confidence.

### 4.7 Predictive Insights

**Purpose** — Provide forward-looking, clearly-labeled estimates (e.g., "flooding reports typically rise here in monsoon season").

**System/Decision** — Models trained on historical patterns produce probabilistic forecasts, always labeled as predictions with confidence bands.

**Edge Cases** — Insufficient data → suppress predictions rather than guess.

### 4.8 Recommendations

**Purpose** — Help users act: safer routes, better-scoring nearby areas, or "places like this."

**System/Decision** — Combine Health Scores, categories, and user intent to recommend areas/actions; personalization respects privacy settings.

**Edge Cases** — Avoid harmful/biased recommendations; never present protected-class proxies as quality signals (see §10.8).

### 4.9 AI Moderation Rules

**Purpose** — Keep content trustworthy and safe.

**Rules**
1. AI **flags and scores**; it can auto-hide clearly policy-violating content (NSFW, doxxing) pending review.
2. AI **cannot permanently delete** a contested incident on its own — removals of contested content require human review and are appealable (§10.9).
3. All AI actions are **logged** with model version and rationale for audit.
4. Retrieved/user content is treated as **untrusted** (no instruction-following from within content).
5. AI outputs affecting scores/status are **explainable** and traceable to inputs.

**Edge Cases** — Model disagreement/low certainty → defer to human moderation; conservative default is "flag, don't delete."

---

## 5. Community Health Score

### 5.1 Overall Score

**Purpose** — Give any area a single, transparent 0–100 measure of condition, backed by evidence.

**System Flow**
- Aggregate verified incidents (negative) and positive signals within the area, weighted by category severity, confidence, recency, and density (per capita / per area).
- Compute an overall score plus per-category subscores; attach a **confidence indicator** based on data volume/freshness.

**Decision Logic**

```
category_score = f(
  weighted_negative_load(category),
  weighted_positive_signals(category),
  recency, density
)  → 0..100

overall_score = Σ (category_weight × category_score) / Σ category_weight
```

- Higher = better condition. Negative incidents pull down; positive signals and resolutions pull up.
- Weights are category-driven (safety weighted more than minor aesthetics) and configurable/versioned.

**Edge Cases**
- Sparse data → score shown with **low confidence** (or "insufficient data") rather than a misleadingly precise number.
- Gaming attempts → confidence/independence controls (§10) blunt manipulation.

### 5.2 Category Scores

Each of the 39 categories (and positive signals) contributes a subscore, visible in a breakdown so users see *why* an area scores as it does.

### 5.3 Geographic Aggregation (Street → Area → City → State → Country)

**Purpose** — Match the score to the zoom level the user is viewing.

**System/Decision**
- Precompute rollups at each level using spatial hierarchies (e.g., geohash tiles and admin boundaries).
- Normalize by area/population where relevant so large regions aren't unfairly penalized/rewarded.

**Edge Cases** — Boundary areas → weighted allocation to the correct region(s); disputed boundaries handled by admin datasets.

### 5.4 Weighting

- **Category weight** — severity/impact (safety > cosmetic).
- **Confidence weight** — verified, high-confidence incidents count more.
- **Recency weight** — recent conditions count more; old items decay.
- **Density normalization** — per-area/per-capita to compare fairly.

### 5.5 Historical Scoring

**Purpose** — Track how a place's score changes over time (feeds Trends and Before/After).

**System/Decision** — Persist periodic score snapshots per geography/category to enable time-series and comparisons.

### 5.6 Confidence Indicators

Every score displays a confidence level (data volume, freshness, contributor diversity). Low confidence is always disclosed to prevent over-interpretation.

---

## 6. Trends, Rankings & Compare

### 6.1 Historical Trends

**Purpose** — Show how categories/areas evolve over time.

**User/System** — Users pick an area + category + time range; Loci renders time-series from score snapshots and incident history, with AI-written highlights (see §4.6).

**Edge Cases** — Sparse periods marked; avoid implying precision that data can't support.

### 6.2 Rankings

**Purpose** — Rank areas by Health Score or specific categories (e.g., cleanest neighborhoods, safest districts).

**Decision Logic** — Ranked lists require a minimum data-confidence to be listed; low-data areas are excluded or clearly flagged to avoid unfair rankings.

**Edge Cases** — Ties broken by confidence then recency; anti-gaming controls applied.

### 6.3 Compare Places

**Purpose** — Side-by-side comparison of two or more areas across overall + category scores and trends.

**User/System** — Select areas → Loci renders comparative scorecards, category breakdowns, and AI summary of key differences.

**Edge Cases** — Mismatched data density → surface confidence per area so comparisons are fair.

### 6.4 Before & After

**Purpose** — Visualize improvement/decline, especially around resolutions (photos + score deltas).

**System/Decision** — Pair historical snapshots and resolution evidence to show tangible change.

### 6.5 Heat Maps

**Purpose** — Visualize concentration of incidents/categories and score gradients across a region.

**System/Decision** — Server aggregates into tiles/grids by category and confidence; client renders density/score overlays.

**Edge Cases** — Avoid stigmatizing low-data areas; blend with confidence.

### 6.6 AI-Generated Insights

Across Trends/Rankings/Compare, AI produces plain-language, cited insights ("Road quality improved 18% after Q2 repairs"), always linking to underlying data.

---

## 7. All 39 Categories & Positive Signals

### 7.1 Structure of a Category

Each category defines:

- **Symbol/Icon** and display name.
- **Type** — negative (issue) or positive (signal).
- **Photo requirement** — required or optional.
- **Duplicate radius** — spatial radius for duplicate detection.
- **Verification threshold** — weighted confirmations needed to verify.
- **Resolution rules** — whether "after" photos are required.
- **Severity weight** — impact on the Health Score.
- **Decay/recency** — how quickly it becomes stale.

> **Note:** The exact icon set, thresholds, radii, and severity weights are configurable and **versioned** in a `CategoryConfig` table so product/ops can tune them without code changes. The list below is the canonical taxonomy; numeric parameters are initial defaults to be calibrated with real data.

### 7.2 The 39 Civic Issue Categories

Grouped for clarity (the platform treats each as a first-class category):

**Roads & Transport**
1. 🕳️ Pothole / Road Damage
2. 🚦 Broken Traffic Signal
3. 🛑 Missing / Damaged Road Sign
4. 🚧 Unsafe Construction / Obstruction
5. 🅿️ Illegal / Blocked Parking
6. 🚌 Public Transport Issue

**Lighting & Electrical**
7. 💡 Broken Street Light
8. ⚡ Exposed / Dangerous Wiring
9. 🔌 Power Outage (area)

**Water & Drainage**
10. 🚰 Water Supply Problem
11. 🌊 Flooding / Waterlogging
12. 🕳️ Open Drain / Sewer Issue
13. 💧 Water Leakage / Pipe Burst

**Sanitation & Waste**
14. 🗑️ Garbage / Uncollected Waste
15. ♻️ Overflowing Bin
16. 🐀 Pest / Rodent Infestation
17. 🚽 Public Toilet Issue

**Public Safety**
18. 🚨 Crime / Safety Concern
19. 🔥 Fire Hazard
20. 🧯 Missing Safety Equipment
21. 🌫️ Poor Visibility / Hazard
22. 🐕 Stray / Dangerous Animals

**Environment**
23. 🌫️ Air Pollution
24. 🔊 Noise Pollution
25. 🏭 Industrial / Chemical Hazard
26. 🌳 Tree / Green-Cover Damage
27. 🗑️ Illegal Dumping

**Infrastructure & Public Property**
28. 🧱 Damaged Public Property
29. 🪧 Vandalism / Graffiti
30. 🏚️ Unsafe / Abandoned Structure
31. 🛗 Broken Public Facility (elevator/ramp)
32. ♿ Accessibility Barrier

**Community & Services**
33. 🏥 Health Service Issue
34. 🏫 School / Education Facility Issue
35. 📵 Connectivity / Utility Service Gap
36. 💰 Corruption / Service Denial
37. 🧑‍🤝‍🧑 Encroachment / Public-Space Misuse

**Weather & Environmental Hazards**
38. 🌩️ Weather-Related Hazard (fallen tree, storm damage)
39. 🌡️ Environmental / Heat Hazard

### 7.3 Positive Community Signals

A matching set of positive signals lets communities record improvements and assets. Positive signals **raise** the Health Score and follow the same verification lifecycle. Examples:

- ✅ Issue Fixed / Repaired (road, light, drain, etc.)
- 🌳 New / Maintained Green Space
- 💡 New Street Lighting Installed
- 🧹 Clean & Well-Maintained Area
- 🚸 Improved Safety Measure (crossing, signage, patrol)
- ♿ Accessibility Improvement
- 🚰 Restored / Improved Utility Service
- 🏗️ Beneficial New Infrastructure
- 🤝 Community Initiative / Volunteer Effort
- 🚌 Improved Public Transport
- ♻️ Effective Waste Management
- 🏥 New / Improved Public Service

> Each positive signal maps conceptually to one or more negative categories so "before/after" and resolution flows connect naturally.

### 7.4 Reporting Requirements & Thresholds (defaults)

| Aspect | Default behavior |
| --- | --- |
| Photo required | Yes for evidence-heavy categories (potholes, garbage, damage, hazards); optional for area-wide conditions (noise, air, power outage). |
| Verification threshold | Higher for high-severity/safety categories; lower for low-risk cosmetic categories. |
| Duplicate radius | Small for point issues (pothole ~25–50 m); large for area conditions (air quality ~city-tile). |
| Resolution evidence | "After" photo required for severe/physical categories. |
| Severity weight | Safety/health > infrastructure > cosmetic. |

All values live in versioned `CategoryConfig` and are calibrated against real usage.

---

## 8. Monetization

Loci is **free for public participation** (reporting, confirming, commenting, browsing, Health Scores). Revenue comes from advanced intelligence for organizations and power users.

### 8.1 Free Features

- Full map, search, incident detail, and timelines.
- Community Health Score (all zoom levels) with confidence.
- Reporting, confirming, resolving, comments, positive signals.
- Basic Ask AI and basic trends for the current view.
- A limited number of Saved Places + Smart Alerts.

### 8.2 Premium Intelligence Reports

- On-demand, professionally formatted area reports: overall + category scores, trends, top incidents, resolution history, and AI summary — exportable (PDF).

### 8.3 Real-Estate Reports

- Property/neighborhood intelligence for buyers, renters, and agents: safety, infrastructure, cleanliness, services, trend trajectory, and comparable areas.

### 8.4 Business Location Intelligence

- Site-selection analytics: foot-related civic conditions, safety, infrastructure reliability, and category trends for candidate locations; compare multiple sites.

### 8.5 Enterprise Dashboards

- Multi-area monitoring, alerts, custom regions, team seats, exports, and SLAs for property managers, retailers, logistics, insurers, and NGOs.

### 8.6 Government Analytics

- Ground-truth accountability dashboards: issue backlogs, resolution rates, response trends, hotspots, and before/after impact of interventions.

### 8.7 API Access

- Developer API (tiered/metered) for scores, incidents (privacy-safe), trends, and comparisons; usage-based pricing with rate limits and keys.

### 8.8 Historical Data

- Licensed access to historical datasets/snapshots for research, analytics, and modeling (aggregated/anonymized).

### 8.9 Smart Alerts (Premium tier)

- Advanced, customizable alerts (custom polygons, category filters, thresholds, webhooks/integrations) beyond the free allowance.

> **Monetization principle:** Community-contributed raw participation stays free and open to view; **value-added intelligence, scale, exports, and integrations** are paid. Personal data is never sold; commercial products use aggregated/anonymized data.

---

## 9. Technical Logic

> Architecture is described conceptually and technology-agnostically; specific frameworks/vendors are implementation choices.

### 9.1 Core Architecture

- **Clients:** Mobile (iOS/Android) + responsive web; map-first UI.
- **API layer:** Stateless services behind a gateway (REST/GraphQL) with authN/Z.
- **Domain services:** Incidents, Verification, Health Score, Media, AI, Notifications, Reputation, Search, Billing/Reports.
- **Async pipeline:** Event bus + workers for AI checks, score recomputation, notifications, and rollups.
- **Data stores:** Relational DB (core entities) + spatial indexing, object storage (media), search index, time-series/analytics store, cache.

### 9.2 Database Concepts (core entities)

- `User`, `ReputationProfile`
- `Incident` (type: negative/positive; status; category; canonical location; confidence)
- `Confirmation`, `Dispute`, `ResolutionClaim`
- `Comment`, `Media` (with EXIF/anti-fraud metadata)
- `TimelineEvent` (append-only audit log)
- `CategoryConfig` (versioned thresholds/radii/weights/icons)
- `HealthScoreSnapshot` (per geography/category/time)
- `SavedPlace`, `NotificationPreference`, `Subscription/Entitlement`
- `AuditLog` (moderation & AI actions), `Appeal`

### 9.3 APIs

- Public read APIs (map/query/scores/trends) — cacheable, privacy-safe.
- Authenticated contribution APIs (report/confirm/resolve/comment/media) — rate-limited.
- Commercial APIs (reports/datasets) — keyed, metered, tiered.

### 9.4 Map Clustering

- Server-side clustering by viewport + zoom (geohash/tiles); clusters carry dominant category + count + aggregate confidence.
- Client caches by geohash + zoom bucket; real-time deltas patch the visible set.

### 9.5 Search

- Geocoding for places/addresses; full-text + category index for incidents; optional semantic (embedding) search over text/comments; ranking blends relevance, proximity, recency, confidence.

### 9.6 Notifications

- Event-driven with per-user preferences, batching, quiet hours, and multi-channel delivery (push/email/in-app); dead-token pruning; storm aggregation.

### 9.7 Offline Behavior

- Read: last-viewport cache available offline.
- Write: reports/confirmations/media queued locally with timestamps + captured GPS; synced on reconnect; server re-runs duplicate detection at sync time.
- Conflict handling: if the target incident changed/merged during offline period, reconcile to the canonical incident.

### 9.8 Scalability

- Stateless services + horizontal scaling; spatial + read-replica scaling for hot regions; async recomputation of scores/rollups; CDN for media; tiled/materialized aggregates for heat maps and rankings; multi-region for latency and resilience.

---

## 10. Security & Anti-Fraud

Trust is the product. These controls protect data integrity, user safety, and platform credibility.

### 10.1 GPS Spoofing Detection

**Purpose** — Ensure contributions come from plausibly on-site users.

**System/Decision** — Cross-check device GPS with IP geolocation, motion/sensor signals, mock-location flags, and plausibility (impossible travel). Suspicious locations are down-weighted or rejected for verification purposes.

**Edge Cases** — Legitimate VPN/poor GPS → allow contribution but reduce location-dependent weight; ask for photo evidence.

### 10.2 Fake Account & Collusion Detection

**Purpose** — Prevent sock-puppets and coordinated manipulation.

**System/Decision** — Device/network fingerprints, behavioral graphs, and correlated activity detect account clusters; confirmations from linked accounts share (collapse) weight via the **independence factor** in confidence.

**Edge Cases** — Shared networks (offices, campuses) → use behavioral (not just IP) signals to avoid false positives.

### 10.3 Spam Prevention

**System/Decision** — Rate limits, content classifiers, reputation gates, and duplicate detection suppress spam reports/comments; repeat offenders escalate to suspension.

### 10.4 AI Image Verification

**System/Decision** — Manipulation/fake, duplicate-image, wrong-category, and NSFW checks (see §4) gate evidence weight and quarantine violations pending review.

### 10.5 User Reliability

**System/Decision** — Reputation reflects long-run accuracy; it weights confirmations and confidence and unlocks privileges. Disproven or abusive actions reduce reputation and weighting.

### 10.6 Rate Limiting

**System/Decision** — Per-user/device/IP limits on reports, confirmations, comments, media, and API calls; adaptive tightening during abuse spikes; clear user messaging when limited.

### 10.7 Privacy

**System/Decision** — Minimize PII; strip EXIF and blur faces/plates in public media; anonymize/aggregate for commercial products; user data-export and deletion controls; consent for location and notifications. **Personal data is never sold.**

### 10.8 Legal & Ethical Considerations

**System/Decision** — Content policy prohibits defamation, doxxing, harassment, and illegal content; DMCA/takedown process; avoid protected-class proxies or discriminatory ranking; clear disclaimers that scores are community-generated estimates, not official determinations.

### 10.9 Incident Appeals

**Purpose** — Fairness for contested actions.

**User/System** — Users can appeal removals, moderation, or fraud flags; appeals route to human review; outcomes and rationale are logged; reputation adjustments reversed if the appeal succeeds.

### 10.10 Audit Trails

**System/Decision** — Every moderation and consequential AI action is recorded in an immutable `AuditLog` with actor, model version, rationale, and before/after state — supporting transparency, appeals, and compliance.

---

## 11. Glossary

| Term | Meaning |
| --- | --- |
| **Incident** | The single canonical record for one real-world issue (or positive signal). |
| **Confirmation** | An independent corroboration that an incident is real/current. |
| **Dispute** | A signal that an incident (or resolution) is inaccurate. |
| **Resolution Claim** | A submission asserting an issue is fixed, pending community confirmation. |
| **Confidence** | Transparent 0–100% trust measure for an incident's current state. |
| **Community Health Score** | Zoom-adaptive 0–100 measure of an area's condition from verified data. |
| **Positive Signal** | A community-reported improvement/asset that raises the Health Score. |
| **Reputation** | A user's long-run accuracy/trust level that weights their contributions. |
| **CategoryConfig** | Versioned per-category thresholds, radii, weights, and icons. |
| **Timeline** | The append-only, permanent history of an incident. |

---

### Change Log

- **v1.0 — Rebrand & refurbish.** Renamed the concept from *CivicLens* to **Loci**, restructured the specification into a single continuous master PRD, standardized every major feature around Purpose / User Flow / System Flow / Decision Logic / Edge Cases, and expanded technical, monetization, and security sections for developer-readiness.
