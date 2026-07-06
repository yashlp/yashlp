# Vicinia — Master Product Requirements Document

**Product name:** Vicinia (formerly CivicLens)
**Category:** AI-Powered Community Intelligence Platform
**Document purpose:** Single, complete, developer-ready specification. Feed this file to an AI coding assistant or hand it to an engineering team as the source of truth.
**Tagline:** *Every place has a story. Vicinia helps the community tell it — and prove it.*

---

## Why the rename?

"CivicLens" framed the product as a civic *complaint* tool. **Vicinia** (Latin: *neighborhood, the surrounding area*) frames it as what it actually is: a living intelligence layer for places. The name is short, globally pronounceable, brandable (Vicinia Score, Vicinia Pulse, Vicinia Pro), and does not box the product into "government reporting."

**Internal product definition (non-negotiable):** Vicinia is **not a reporting app**. It is a **community intelligence platform**. Reporting is one input; the product is *understanding places*. Every design decision in this document follows from that definition.

---

# Table of Contents

1. [Product Vision & Core Concept](#1-product-vision--core-concept)
2. [Complete User Journey](#2-complete-user-journey)
3. [Incident & Verification System](#3-incident--verification-system)
4. [AI Features](#4-ai-features)
5. [Vicinia Score (Community Health Score)](#5-vicinia-score-community-health-score)
6. [Trends, Rankings & Compare](#6-trends-rankings--compare)
7. [All 39 Categories & Positive Signals](#7-all-39-categories--positive-signals)
8. [Monetization](#8-monetization)
9. [Technical Logic](#9-technical-logic)
10. [Security & Anti-Fraud](#10-security--anti-fraud)

Every major feature is documented with five lenses:

* **Purpose** — why the feature exists.
* **User Flow** — step-by-step interaction from the user's perspective.
* **System Flow** — what the backend, AI, and database do after each action.
* **Decision Logic** — the rules that determine outcomes.
* **Edge Cases** — how the system behaves under disagreement, duplication, poor input, or abuse.

---

# 1. Product Vision & Core Concept

## 1.1 Vision

To become the world's most trusted community intelligence platform, where every street, neighborhood, city, state, and country has a transparent, community-verified, historical profile that helps people decide where to live, work, travel, invest, and build.

## 1.2 Mission

To transform everyday local observations into verified, structured intelligence that improves transparency, accountability, and quality of life — and to make that intelligence useful to citizens for free, and to organizations at professional depth.

## 1.3 Problem Statement

1. **Information about places is fragmented and unverifiable.** Reviews cover businesses, not streets. News covers events, not conditions. Government portals are one-way black holes.
2. **Civic reporting tools are write-only.** Citizens submit complaints and never see outcomes, trends, or context. There is no feedback loop, so participation dies.
3. **There is no memory of place.** When a road is fixed, the record of the problem — and the proof of the fix — disappears. Communities cannot demonstrate improvement or decline.
4. **Decisions about places are made blind.** Renters, buyers, businesses, and travelers rely on hearsay because no structured, verified, location-level dataset exists.

## 1.4 Target Users

| Segment | Primary need | Vicinia answer |
|---|---|---|
| Residents | Report problems, know their area, see change | Free reporting, live map, Vicinia Score, timelines |
| Movers & renters | "Is this street/area actually good?" | Score, trends, Compare Places, Ask AI |
| Travelers | Safety and condition awareness in unfamiliar areas | Live map, category filters, AI summaries |
| Small businesses | Location selection, footfall environment | Location intelligence reports |
| Real estate professionals | Verified area quality evidence | Premium real estate reports, historical data |
| Governments & municipalities | Ground truth, prioritization, before/after proof | Enterprise dashboards, analytics, API |
| Researchers & journalists | Structured longitudinal civic data | Historical datasets, API access |

## 1.5 Value Proposition

* **For citizens:** the only platform where your local observation becomes permanent, verified, visible intelligence — and where you can see whether things actually get fixed.
* **For decision-makers:** the only structured, community-verified, historical dataset about the physical condition of places, at street-level resolution.

## 1.6 Why Vicinia Is Different

1. **One pin per real-world incident.** Duplicates merge into confirmations, so the map shows *truth density*, not *complaint volume*.
2. **Both directions.** 39 issue categories **and** matching positive signals. Places get credit for what works, not only blame for what's broken.
3. **Full lifecycle with memory.** Incidents are never deleted; they move from Reported → Verified → Resolved, preserving the entire evidence timeline forever.
4. **AI as an assistant, never a judge.** AI detects duplicates, fakes, and wrong categories, summarizes and predicts — but humans verify. AI output is always overridable by community consensus and moderators.
5. **Vicinia Score.** A transparent, evidence-backed, zoom-adaptive health score for any geographic unit, from a single street to a country.
6. **Free to contribute, paid to analyze.** The community layer is free forever; monetization targets organizations that need depth, not citizens who provide data.

## 1.7 Product Philosophy

* Communities understand their neighborhoods better than any institution.
* Verification beats volume: one confirmed fact outweighs fifty unverified claims.
* Transparency creates trust: every score, status, and AI decision must be explainable on demand.
* Preserve history: places are stories over time, not snapshots.
* Celebrate improvement as loudly as problems: the platform must never feel like a wall of negativity.

---

# 2. Complete User Journey

## 2.1 First-Time Onboarding

**Purpose:** Deliver value in under 30 seconds, before asking for anything.

**User Flow**
1. User opens the app for the first time.
2. A 3-screen intro explains: *See your area's real condition* → *Report & confirm with your community* → *Watch places improve*.
3. App requests location permission with a plain-language rationale ("to show what's happening around you").
4. Regardless of permission choice, user lands on the **live map** immediately — browsing requires no account.
5. A subtle coach-mark tour highlights: the map pins, the Vicinia Score badge, the Report button, and Ask AI.

**System Flow**
* App fetches map tiles + clustered incident data for the visible viewport (anonymous session).
* If location granted: center map on user; fetch the Vicinia Score for the current area.
* If denied: center on IP-derived city; Score shown for that city.
* An anonymous device session is created for analytics and rate limiting (no PII).

**Decision Logic**
* Browsing, searching, viewing incidents, viewing scores: **no account needed**.
* Reporting, confirming, commenting, saving places, notifications: **account required** (prompted contextually at the moment of action, never up-front).

**Edge Cases**
* No connectivity on first launch → cached onboarding runs; map shows an offline placeholder with a retry state.
* Location permission denied twice → app never nags again; a passive "Enable location" chip stays in the search bar.

## 2.2 Registration & Login

**Purpose:** Identity with minimal friction, strong enough to support reputation and anti-fraud.

**User Flow**
1. Triggered contextually (e.g., user taps "Confirm this incident" while anonymous).
2. Options: Sign in with Apple / Google, or email + OTP (no passwords).
3. Optional profile step: display name, home area (approximate, never exact address).
4. User returns to exactly the action they attempted, with state preserved.

**System Flow**
* Account created with a unique `user_id`; device fingerprint and signup metadata stored for fraud scoring (see §10).
* New accounts start at **Reputation Level 0 ("Newcomer")** with restricted daily action limits.
* Phone verification is *not* required at signup but unlocks higher reputation tiers.

**Decision Logic**
* One account per verified identity; multiple accounts on one device are flagged, not blocked (families share devices).
* Email OTP expires in 10 minutes; 5 failed attempts → 30-minute lockout.

**Edge Cases**
* User deletes account → contributions are anonymized ("Former member"), never deleted — the incident record's integrity survives the contributor. This is disclosed at signup.
* Banned user re-registers → device/behavioral fingerprint matching applies newcomer restrictions with elevated fraud scrutiny (§10.2).

## 2.3 Home Map Experience

**Purpose:** The map *is* the home screen. It must answer "what is happening around me?" in one glance.

**User Flow**
1. Map opens centered on the user (or last viewed area).
2. Pins show active incidents; color communicates status (red = active/verified, amber = pending verification, green = resolved recently, blue = positive signal).
3. A floating **Vicinia Score badge** shows the score for the current viewport's dominant geographic unit and updates as the user pans/zooms.
4. Bottom bar: **Map · Search · Report (center, prominent) · Trends · Profile**.
5. Tapping a pin opens the incident sheet: category, photos, status, confirmations, confidence, timeline, comments.
6. Tapping the Score badge opens the score breakdown for that area (§5).

**System Flow**
* Viewport queries hit a geospatially-indexed incident store; server-side clustering above zoom threshold (§9.4).
* Score badge resolves the viewport to a geographic unit (street < neighborhood < city < state < country) based on zoom level and fetches the precomputed score.
* Pins stream via delta updates over a websocket when the viewport is stable (new incidents appear live).

**Decision Logic**
* Zoom ≥ 17 → individual pins. Zoom 13–16 → neighborhood clusters with counts + dominant category icon. Zoom ≤ 12 → heat shading + area scores instead of pins.
* Pending (unverified) incidents render at reduced opacity and are excluded from Score computation until verified (§3.4).
* Resolved pins stay visible in green for 14 days, then collapse into the historical layer (toggleable filter: "Show resolved history").

**Edge Cases**
* Dense urban block with 200+ incidents → cluster caps at visual density; tapping a cluster opens a list sheet instead of exploding pins.
* User in an area with zero data → map shows the score as "Not enough data yet" plus a call-to-action: "Be the first to put this area on the map."

## 2.4 Reporting Flow

**Purpose:** Capture a verifiable observation in under 60 seconds. Full detail in §3; this is the UX contract.

**User Flow**
1. User taps **Report**.
2. Chooses type: 🔴 **Issue** or 🟢 **Positive signal**.
3. Picks a category from a searchable, icon-grid of 39 categories (recent/nearby-common categories float to top).
4. GPS auto-captures location; user may fine-tune the pin within a **75 m radius** of their true GPS position (prevents remote reporting, allows precision).
5. **Nearby-duplicate check runs before anything else is written** (§3.6): if a similar incident exists within the category's dedupe radius, the app shows it: *"Is this the same issue?"* → user can **Confirm it instead** (one tap, done) or insist it's different.
6. Adds photo(s) — required or optional depending on category (§7).
7. Optional short description (280 chars).
8. Submits. Sees immediate feedback: *"Reported. 2 more community confirmations will verify it."*

**System Flow** — see §3.2.

**Decision Logic**
* Photo requirements per category are enforced client-side and server-side (§7.4).
* GPS accuracy worse than 50 m → user is asked to step closer or wait for a better fix; submission allowed but flagged `low_gps_accuracy`.

**Edge Cases**
* Offline submission → queued locally with capture-time GPS + timestamp; uploaded on reconnect; server validates the *capture* timestamp, not upload time.
* User tries to report from 3 km away (map fine-tune abuse) → hard-blocked by the 75 m rule; remote reporting is impossible by design.

## 2.5 Confirming Incidents

**Purpose:** Confirmation is the atomic unit of trust. It converts a claim into verified intelligence.

**User Flow**
1. User near a pending incident opens its pin (or receives a "Can you confirm this?" notification when passing nearby — opt-in).
2. Sheet shows the report, photos, and two buttons: **Confirm — I see this too** / **Dispute — this isn't accurate**.
3. Optionally attaches their own photo (boosts confidence more than a bare confirmation).
4. Submits in one tap.

**System Flow & Decision Logic** — see §3.3, §3.7.

**Edge Cases**
* User attempts to confirm from far away → confirmations require presence within **150 m** of the incident (GPS-checked); remote users see a disabled button: "You need to be nearby to confirm."
* The original reporter cannot confirm their own report. Accounts sharing a device fingerprint with the reporter cannot either (§10).

## 2.6 Resolving Incidents

**Purpose:** Close the loop. Resolution is community-verified, evidence-backed, and preserved — never a silent deletion.

**User Flow**
1. Any user near an active incident can tap **"Mark as resolved"** on the pin.
2. A resolution photo is **required** (the "after" evidence).
3. The incident enters **Resolution Pending**; nearby users are asked to confirm or dispute the resolution.
4. On reaching the resolution threshold (§3.4), the pin turns green, status becomes **Resolved**, and the full before/after timeline is preserved.

**System Flow, Decision Logic, Edge Cases** — see §3.3–§3.5.

## 2.7 Positive Signal Flow

**Purpose:** Make improvement as reportable as decay. Positive signals feed the Vicinia Score upward and keep the map emotionally balanced.

**User Flow**
1. User taps Report → 🟢 Positive signal.
2. Picks from positive categories (§7.5): e.g., *Road repaired*, *New streetlight*, *Community cleanup*, *Park renovated*.
3. Photo required (positive claims need the same evidence bar as negative ones).
4. Same verification pipeline as issues: pending → community confirmations → verified.

**Decision Logic**
* If a positive signal spatially matches an active incident of the inverse category (e.g., *Road repaired* over a verified *Pothole*), the app converts the flow into a **resolution submission** for that incident instead of creating a parallel pin. One story per place.

**Edge Cases**
* Business self-promotion disguised as a positive signal ("Great new café!") → positive categories are strictly civic/infrastructure; commercial content is a rejection category for AI moderation and community flagging.

## 2.8 Search

**Purpose:** Jump to any place and interrogate it.

**User Flow**
1. Search accepts: addresses, neighborhoods, cities, landmarks, and natural-language queries ("potholes near Central Market", "cleanest areas in Austin").
2. Structured results: **Places** (with Vicinia Score chips), **Incidents**, and an **Ask AI** escape hatch for complex queries.
3. Selecting a place flies the map there and loads its score + active incidents.
4. Filters: category (multi-select), status, date range, verified-only, positive-only.

**System Flow**
* Geocoding via the mapping provider; incident search via a full-text + geospatial index; natural-language queries route to the Ask AI pipeline (§4.1) when they contain analytical intent.

**Edge Cases**
* Ambiguous place names ("Springfield") → disambiguation list sorted by distance from user.
* Query with zero results → suggest broadening; never a dead end.

## 2.9 Saved Places

**Purpose:** Users care about a handful of places (home, work, parents' street, prospective apartment). Saved Places is the retention engine.

**User Flow**
1. Any place (street, area, city) can be saved with one tap and a label.
2. Saved Places screen shows each place's current score, score trend arrow (Δ 30 days), and active incident count.
3. Per-place notification preferences: new verified incidents, resolutions, score changes, weekly digest.

**System Flow**
* A saved place is a stored geo-subscription; the notification fan-out service (§9.6) matches new verified events against subscriptions.

**Edge Cases**
* Free tier: up to 5 saved places. Premium: unlimited + instant alerts (§8).

## 2.10 Notifications

**Purpose:** Bring users back with relevance, never noise.

**Notification types**
| Type | Trigger | Default |
|---|---|---|
| Confirmation request | User is near a pending incident (background geofence, opt-in) | Off |
| Your report verified | Report crossed the verification threshold | On |
| Your report resolved | Resolution verified | On |
| Saved place activity | New verified incident / resolution in a saved place | On (daily digest) |
| Score change | Saved place score moved ≥ 5 points in 30 days | On |
| Reputation events | Level up, badge earned | On |
| Moderation outcomes | Your report rejected/appealed (with reason) | On, non-optional |

**Decision Logic**
* Hard cap: max 3 pushes/day per user (moderation outcomes exempt); overflow folds into the digest.
* All geofence-based notifications are strictly opt-in and processed on-device where the platform allows.

**Edge Cases**
* Notification about an incident that gets merged/rejected before the user opens it → deep link resolves to the surviving canonical incident with a "merged" note.

## 2.11 Profile & Reputation

**Purpose:** Reputation converts anonymous strangers into a weighted trust network.

**User Flow**
1. Profile shows: display name, level, badges, contribution stats (reports, confirmations, resolutions, photos), accuracy rate, and a personal impact map.
2. Public profiles show only aggregate stats — never a browsable list of a user's reports with locations (privacy: contribution history reveals movement patterns).

**Reputation model**
| Level | Name | Earned by | Powers |
|---|---|---|---|
| 0 | Newcomer | Signup | Report (3/day), confirm (5/day) |
| 1 | Resident | 5 verified contributions | Normal limits, comments |
| 2 | Trusted | 25 verified, ≥ 85% accuracy | Confirmation weight ×1.5, dispute escalation |
| 3 | Guardian | 100 verified, ≥ 90% accuracy, 90+ days | Weight ×2, flag review queue access |
| 4 | Steward | Top contributors per area, elected/appointed | Weight ×2, merge suggestions, appeal review panel |

**Decision Logic**
* **Accuracy rate** = verified contributions ÷ (verified + rejected). Confirmations of incidents later proven false count against accuracy.
* Reputation decays without activity: −1 level after 12 months idle (floor: level 1). Trust must be current.
* Reputation is **area-agnostic globally but weighted locally**: a user's confirmations in their frequently-visited areas carry a small locality bonus (×1.1) because local familiarity improves judgment.

**Edge Cases**
* Reputation farming (mass-confirming everything) → accuracy tracking plus anomaly detection (§10.5) makes indiscriminate confirming statistically self-defeating.
* High-reputation account compromised → anomaly detection on sudden behavior change triggers step-up re-authentication.

---

# 3. Incident & Verification System

This is the heart of Vicinia. Everything else consumes what this system produces.

## 3.1 One-Pin-Per-Incident Model

**Purpose:** A real-world problem is one fact. Fifty reports of the same pothole must become **one pin with fifty confirmations**, not fifty pins. Pin count must measure *reality*, not *annoyance volume*.

**Model**
* An **Incident** is the canonical entity: `incident_id`, category, geo-point, status, confidence, timeline.
* **Reports, confirmations, disputes, photos, comments, and resolution submissions** are child events attached to the incident, forming an append-only timeline.
* The first report creates the incident; all subsequent matching reports are converted into confirmations (§3.6).

## 3.2 Report Ingestion (System Flow)

When a user submits a report:

1. **Validate**: session, rate limits, GPS plausibility (§10.1), category photo rules (§7.4).
2. **Duplicate check** (§3.6): query active incidents of the same/related category within the category's dedupe radius. If match ≥ high-confidence threshold → return the match to the client as a confirm-instead prompt *before* creating anything.
3. **Create incident** (status `PENDING`) or **attach confirmation** to the matched incident.
4. **Async AI pipeline** (§4): image authenticity check, image-category consistency check, duplicate-image check, text moderation. Results are written to the incident as AI annotations with confidence values.
5. **Confidence engine** recomputes the incident's confidence score (§3.7).
6. **Notification fan-out**: nearby opt-in users may receive a confirmation request; subscribers of the area are queued for digests.
7. **Score pipeline**: the incident is registered as a pending input to the Vicinia Score; it contributes **zero** until verified.

## 3.3 Status Transitions

```
                 ┌──────────┐
   report        │ PENDING  │  confirmations < threshold
  ───────────►   └────┬─────┘
                      │ confirmations ≥ threshold AND AI checks pass
                      ▼
                 ┌──────────┐   resolution submission
                 │ VERIFIED │ ─────────────────────────┐
                 └────┬─────┘                          ▼
                      │                        ┌─────────────────┐
                      │ resolution confirmed   │ RESOLUTION_     │
                      │ ◄───────────────────── │ PENDING         │
                      ▼                        └─────────────────┘
                 ┌──────────┐
                 │ RESOLVED │ ── reopened by new verified report ──► back to VERIFIED (new cycle in same timeline)
                 └──────────┘

  PENDING ──► REJECTED   (AI hard-fail + moderator, or community disputes ≥ threshold)
  any     ──► ARCHIVED   (stale expiry, §3.5; preserved, hidden from live map)
```

## 3.4 Verification & Resolution Thresholds (Decision Logic)

* Base **verification threshold: 3 total trust-weight** (e.g., 3 newcomer confirmations, or 2 Trusted-level, or 1 Guardian + 1 newcomer). The reporter's own submission contributes 1 if their accuracy ≥ 85%.
* Confirmations **with photo** count ×1.5 weight.
* **Safety-critical categories** (open manhole, exposed wires, gas leak suspicion, unsafe structure): render on the map **immediately at reduced opacity** with a "Pending verification" label — hiding a live hazard behind a threshold is unacceptable — but still contribute nothing to scores until verified, and threshold drops to trust-weight 2.
* **Low-density areas** (rural): if fewer than N eligible users pass within the geofence in 72 h, AI photo verification at high confidence (§4.4–4.5) can substitute for **one** community confirmation. Community always outranks AI; AI can never be the *sole* verifier for map-visible verified status except in officially-designated low-density zones.
* **Resolution threshold: trust-weight 2** plus the mandatory resolution photo. The original reporter's resolution confirmation counts ×2 (they know the problem best).
* **Disputes**: each dispute subtracts its trust-weight. If net weight goes ≤ −2, incident → `REJECTED` (pending) or → flagged for moderator review (verified). Verified incidents are never auto-rejected by disputes alone — evidence was already established.

## 3.5 Incident Timeline & Lifecycle Preservation

* The timeline is **append-only**: report → AI annotations → confirmations → photos → comments → status changes → resolution evidence → reopenings. Nothing is ever deleted; corrections are appended.
* Every incident page renders the full history: who (display name/level), what, when, with what evidence.
* **Staleness:** verified incidents with no activity for a category-specific TTL (e.g., pothole 180 days, garbage dumping 30 days) trigger a re-verification prompt to nearby users: *"Is this still an issue?"* Reconfirmed → TTL resets. No response after 2 prompts → `ARCHIVED` (visible in history layer, excluded from live score with decay, §5.6).
* **Reopening:** a new report matching a `RESOLVED` incident's location+category reopens the *same* incident (new cycle appended to the same timeline). Recurrence count is tracked — chronic recurrence is itself a signal surfaced to enterprise dashboards ("this pothole was 'fixed' 4 times").

## 3.6 Duplicate Detection

**Purpose:** Enforce one-pin-per-incident at write time.

**Decision Logic — spatial + semantic match score:**
1. **Spatial:** candidate incidents of the same (or confusable-sibling) category within the category's dedupe radius. Radii are category-specific: pothole 25 m; streetlight 40 m; garbage dumping 50 m; flooding/drainage 150 m; air pollution/noise 300 m (area phenomena).
2. **Visual:** perceptual hash + embedding similarity between the new photo and existing incident photos (§4.3).
3. **Textual:** description embedding similarity.
4. Combined score ≥ 0.8 → **auto-suggest confirm-instead** (user can override). ≥ 0.95 with identical image hash → hard-merge, silently converted to a confirmation.
5. User overrides ("it's different") → new incident created but linked as `possible_duplicate_of`; if both get verified and a Steward/moderator later merges them, all confirmations consolidate onto the survivor.

**Edge Cases**
* Two real potholes 10 m apart → the override path exists precisely for this; photos disambiguate.
* Same photo submitted to two different incidents → exact-hash reuse across incidents is blocked (§4.3).
* A long broken sidewalk spanning 200 m → user prompted to place the pin at the worst point; the description covers extent. (V2: line-geometry incidents.)

## 3.7 Confidence Calculation

**Purpose:** A single 0–100 number answering "how much should you trust that this is real and current?" — always displayed with a tap-to-explain breakdown.

**Formula (weights sum to 100):**

| Component | Max points | Notes |
|---|---|---|
| Community confirmations (trust-weighted, diminishing returns) | 40 | `40 × (1 − e^(−weight/4))` |
| Photo evidence (count, distinct devices, AI authenticity score) | 20 | Multiple independent photographers ≫ many photos from one user |
| Reporter + confirmers' accuracy history | 15 | Average accuracy of contributors |
| AI verification agreement (image-category consistency, authenticity) | 15 | AI can add or subtract; never below-zero the total alone |
| Freshness | 10 | Full at < 7 days, linear decay to 2 at TTL |
| Disputes | −(2 × trust-weight each) | Floor at confidence 5 for verified incidents |

**Decision Logic**
* Confidence < 30 on a verified incident for > 14 days → auto-queued for re-verification.
* Confidence is recomputed on every timeline event and nightly (freshness decay).

## 3.8 Photo Handling

* Client strips EXIF **except** capture timestamp and GPS, which are extracted server-side into structured fields, then the stored file is fully EXIF-clean.
* **Capture-GPS vs. report-GPS cross-check:** discrepancy > 200 m → flag `photo_location_mismatch` (photo may be old/elsewhere).
* Server-side: re-encode (defuses malicious payloads), generate thumbnails, run AI checks (§4.4), compute perceptual hash into the global dedupe index.
* Faces and license plates are **auto-blurred** by default (moderators can view originals under audit log for disputes).
* Photo limits: 5 per report/confirmation; 10 MB each; HEIC/JPEG/PNG.

## 3.9 Comment System

* Comments attach to incidents; threaded one level (comment + replies).
* AI text moderation pre-screens (toxicity, PII, spam, off-topic commerce); flagged comments enter the moderation queue, borderline ones post with a collapsed "possibly unhelpful" state.
* Comments never affect confidence — only structured actions (confirm/dispute/photo) do. This keeps arguments and evidence separate.
* Community flagging: 3 flags from distinct level-≥1 users auto-collapses a comment pending review.

## 3.10 AI Moderation (incident-level summary)

Full detail in §4.9. In one line: AI pre-screens every input (image authenticity, category match, text safety, duplicate), attaches annotations with confidence, auto-rejects only hard-fails (known-fake imagery, NSFW, commercial spam ≥ 0.98 confidence), and routes everything ambiguous to humans. **Every AI rejection is appealable** (§10.9).

---

# 4. AI Features

**Global AI principles:** (1) AI assists, humans decide. (2) Every AI decision is logged, explainable, and appealable. (3) AI confidence values are stored, never just booleans. (4) Models are evaluated per-region before rollout — a pothole in monsoon-season Mumbai looks different from one in Oslo.

## 4.1 Ask AI

**Purpose:** Natural-language interface over the entire intelligence layer: "Is Riverside safe at night?", "What's the biggest problem on Elm Street?", "How has cleanliness changed here since last year?"

**User Flow**
1. User opens Ask AI from the map, a place page, or search.
2. Types/speaks a question; context (current viewport/place) is attached automatically.
3. Answer streams in with: a natural-language summary, **citations to specific incidents/scores** (tappable, fly-to-pin), a confidence note, and data-coverage caveats.

**System Flow**
1. Intent + location extraction (place resolution via the geocoder).
2. Retrieval layer queries structured data only: verified incidents, scores, trends, category aggregates for the resolved geography. **The model answers from retrieved verified data, never from its own world knowledge about the place.**
3. LLM composes the answer with mandatory citation of retrieved records.
4. Answer + retrieval set logged for quality audit.

**Decision Logic**
* Insufficient data → the honest answer: "Vicinia has only 4 verified reports here — not enough for a reliable answer. Here's what exists…" Never fabricate.
* Questions about crime/personal safety → answers restricted to Vicinia's own categories (lighting, vandalism, abandonment) with an explicit scope disclaimer; Vicinia is not a crime database.
* Rate limits: 10 questions/day free, unlimited premium (§8).

**Edge Cases**
* Prompt injection via incident descriptions retrieved into context → retrieved text is sandboxed as data, tool outputs are schema-validated, and answers citing nonexistent records are blocked by a post-generation citation validator.
* Defamatory questions ("is X neighborhood full of criminals?") → reframed to data: the model reports verified civic conditions only.

## 4.2 AI Summaries

**Purpose:** Compress an area's or incident's state into two readable sentences everywhere a full list won't fit.

* **Area summaries**: regenerated when underlying verified data changes materially (≥ 5 new verified events or score Δ ≥ 3), else cached. Example: *"Maple District's score rose 6 points this quarter, driven by 12 resolved road issues. Garbage collection remains the most-reported concern."*
* **Incident summaries**: for incidents with > 10 timeline events, an AI TL;DR sits atop the timeline.
* Every summary carries a "generated from N verified reports" provenance line.

## 4.3 Duplicate Image Detection

* Every ingested photo gets a perceptual hash (near-duplicate) + embedding (semantic similarity), indexed globally.
* Exact/near-exact match to a photo on a *different* incident → `reused_image` flag: submission held, user notified ("this photo appears to be from another report").
* Match to any *internet-known* image (reverse-search index of common stock/viral civic images) → hard-fail.
* Same-incident near-duplicates from different users are fine (same pothole, similar angle) — expected, even confirming.

## 4.4 Fake Image Detection

* Ensemble: AI-generation artifact detector, splice/edit forensics (ELA + noise-print), metadata plausibility, and capture-GPS/report-GPS cross-check (§3.8).
* Score ≥ 0.98 fake → auto-reject with appeal path. 0.7–0.98 → human moderation queue, incident stays `PENDING` and cannot verify until cleared. < 0.7 → pass, score stored into confidence math (§3.7).
* Screenshots-of-photos and photos-of-screens are detected (moiré/bezel heuristics) and treated as 0.8+ suspicion.

## 4.5 Wrong-Category Detection

* A vision classifier checks image ↔ selected category consistency.
* Mismatch with high confidence and a clear alternative → user gets a pre-submission suggestion: *"This looks like a broken sidewalk rather than a pothole — switch?"* One tap to accept, free to refuse.
* Refused suggestions are logged; if the community later recategorizes, the AI suggestion counts for its calibration and the user's accuracy metric doesn't get double-punished.
* Post-verification recategorization requires a Steward/moderator and appends a timeline event.

## 4.6 Trend Analysis

* Nightly jobs compute per-area, per-category time series: report velocity, verification rate, resolution rate, median time-to-resolution.
* Anomaly detection (seasonal-adjusted) flags: sudden spikes (burst of flooding reports → likely real weather event: cluster and surface), sustained drifts (garbage reports doubling over 3 months → structural decline), and correlated categories (broken streetlights preceding vandalism upticks).
* Outputs feed: Trends UI (§6.1), AI insights (§6.6), enterprise dashboards (§8.5), and anti-fraud (a spike from *few unique users* is a manipulation signature, not a trend — §10.5).

## 4.7 Predictive Insights

* Models forecast: likely re-occurrence (recurrence-prone incidents, §3.5), seasonal risk windows (monsoon → drainage), and resolution-time estimates per category/area ("issues like this are typically resolved in ~3 weeks here").
* Predictions are **clearly labeled as predictions**, shown with ranges, and never affect scores or incident status. They inform humans; they don't act.

## 4.8 Recommendations

* For users: areas matching stated priorities ("quiet, walkable, good lighting") in Compare/Search contexts; confirmation requests routed to users whose paths make them likely eyewitnesses.
* For areas: "most impactful fix" suggestions (which unresolved verified incidents most depress the local score) — a to-do list a community or council can act on.

## 4.9 AI Moderation Rules (consolidated)

| Check | Auto-reject | Human queue | Pass-with-annotation |
|---|---|---|---|
| NSFW/violent imagery | ≥ 0.95 | 0.6–0.95 | < 0.6 |
| AI-generated/edited image | ≥ 0.98 | 0.7–0.98 | < 0.7 |
| Reused image (cross-incident) | exact hash | near-match | — |
| Category mismatch | never | ≥ 0.9 post-submit | suggestion pre-submit |
| Text: toxicity/PII/doxxing | ≥ 0.95 | 0.5–0.95 | < 0.5 |
| Commercial spam | ≥ 0.98 | 0.6–0.98 | < 0.6 |

* **Auto-rejects are always appealable** (§10.9). Human moderators see the AI score + evidence, not just a verdict.
* Moderation SLA targets: safety-critical flags < 1 h, standard queue < 24 h.
* All thresholds are config, not code; per-region overrides supported.

---

# 5. Vicinia Score (Community Health Score)

## 5.1 Purpose

One transparent number (0–100) answering "what condition is this place in, according to verified community evidence?" — computable for any geographic unit, decomposable into categories, honest about its own confidence.

## 5.2 Overall Score

* **Inputs:** verified incidents (negative), verified positive signals (positive), resolutions (positive, time-decaying), category weights, severity weights, incident confidence, geographic normalization (per km² and per active-user coverage — so dense cities aren't punished for having more *reporters*).
* **Shape:** every area starts from a neutral prior (65) that data pulls down or up. The prior prevents "no data = perfect score" fallacies.
* Score = prior + positive pressure − negative pressure, clamped 0–100, where each verified event's pressure = `severity_weight × category_weight × confidence × freshness_decay ÷ area_normalizer`.

## 5.3 Category Scores

Six pillars, each 0–100, each rolling up its member categories (§7):

1. **Roads & Mobility** · 2. **Cleanliness & Sanitation** · 3. **Utilities & Services** · 4. **Safety & Lighting** · 5. **Environment & Public Space** · 6. **Community Vitality** (positive-signal density, resolution rate, civic participation).

Overall score = weighted blend (default weights: 20/20/15/20/15/10) — weights are public and shown in the breakdown UI.

## 5.4 Geographic Aggregation

* Units: **street segment → neighborhood → city → state → country**, resolved from the map zoom level (§2.3) or explicit selection.
* Higher units are **not** simple averages of children: they are population/coverage-weighted, and a city score includes city-level normalization so one terrible street doesn't tank a metropolis (but shows up in its distribution view: "5% of streets score below 40").
* Every unit's page shows: score, trend sparkline (12 months), pillar breakdown, top verified issues, recent resolutions, and the **confidence indicator** (§5.7).

## 5.5 Weighting

* **Severity weights** per category (public constants): safety-critical 3.0, major infrastructure 2.0, standard 1.0, minor/aesthetic 0.5.
* **Freshness decay:** an incident's score pressure halves every 90 days of `VERIFIED` life (a 2-year-old unresolved pothole still hurts, but the score reflects *current* conditions most).
* **Resolution bonus:** a verified resolution removes the incident's negative pressure **and** adds a positive pulse worth 30% of it, decaying over 90 days — fixing things visibly pays.

## 5.6 Historical Scoring

* Scores are snapshotted **daily** per unit and never recomputed retroactively (append-only score history) — this makes trends, Before & After, and enterprise time-series trustworthy and auditable.
* Archived/stale incidents stop contributing on archive date; the historical snapshots retain their past effect.

## 5.7 Confidence Indicators

Every displayed score carries a data-confidence tier, computed from verified-event count, contributor diversity, and recency of coverage:

* **High** — rich, recent, multi-contributor coverage.
* **Moderate** — meaningful but partial coverage.
* **Low** — sparse data; score shown grayed with "early signal" label.
* **Insufficient** — no score shown; "Not enough data yet" + contribution CTA.

**Edge cases:** brand-new areas show Insufficient (never a fake neutral number presented as fact); coordinated manipulation attempts are dampened because score inputs require *verified* incidents and contributor-diversity terms (§10.5); disputed borders/units follow the mapping provider's boundaries with a documented override table.

---

# 6. Trends, Rankings & Compare

## 6.1 Historical Trends

**Purpose:** Show how a place changes over time — the feature that makes Vicinia a memory, not a snapshot.

**User Flow:** Place page → Trends tab → score line chart (30 d / 90 d / 1 y / all), per-pillar toggles, event annotations (big resolutions, incident spikes) plotted on the line, AI narrative below (§6.6).

**System Flow:** reads the append-only daily score snapshots (§5.6) + trend aggregates (§4.6). No recomputation at read time.

**Edge cases:** areas with data gaps render gaps honestly (dashed segments), never interpolated as fake continuity.

## 6.2 Rankings

**Purpose:** Comparative motivation — "cleanest neighborhoods in the city," "most improved areas this quarter."

* Rankings exist **within an explicit parent unit** (neighborhoods ranked within their city, cities within a state). No global wall-of-shame of tiny streets.
* Types: Top overall · Top per pillar · **Most improved (Δ 90 days)** · Most active community.
* **Eligibility:** only units with Moderate+ score confidence rank; others are listed as "unranked — insufficient data." This blocks "win by having no reports."
* Most-improved is the headline ranking in UI placement — the product celebrates trajectory over status.

**Edge cases:** manipulation by flooding positive signals → positive signals require the same verification as issues, and ranking inputs use confidence-weighted data; ties broken by confidence tier then contributor diversity.

## 6.3 Compare Places

**Purpose:** Side-by-side decision support: two-to-four places, one table.

**User Flow:** enter 2–4 places (any same-tier units) → comparison of overall score, six pillars, trend arrows, active verified incidents by category, resolution speed, data confidence → optional "what matters to you" weighting sliders re-blend a personalized comparison → Ask AI hook: "Which is better for a family with kids?"

**Decision Logic:** only same-tier units compare (street vs street, city vs city); different tiers prompt "compare their parent/child instead." Personalized re-weighting is client-side presentation only — the canonical score never changes.

## 6.4 Before & After

**Purpose:** Emotional proof of change; the platform's best marketing surface.

* Auto-generated for resolved incidents with good before/after photo pairs: swipeable then/now card with dates, confirmation counts, and contributors credited.
* Area-level version: "Maple District, January vs June" — score movement + gallery of that period's resolutions.
* Shareable as an image card (privacy-clean: blurred faces/plates, no reporter identity without consent).

## 6.5 Heat Maps

* Layer toggle on the main map: density shading by category group or by score, at neighborhood resolution and above.
* Time scrubber (premium, §8): drag through 24 months of monthly snapshots and watch an area evolve.
* Heat maps render only verified data; resolution improves with zoom but never below neighborhood aggregation for privacy of individual reporters.

## 6.6 AI-Generated Insights

* Every Trends/Rankings/Compare surface gets an AI narrative strip translating the charts into language: *"Cleanliness drove most of Riverside's 8-point gain; road issues are unchanged and now its weakest pillar."*
* Generated from the structured aggregates only (same retrieval discipline as §4.1), cached until underlying data changes, always with provenance ("based on 214 verified events").

---

# 7. All 39 Categories & Positive Signals

## 7.1 Category Design Rules

* Every category defines: icon, definition, **photo requirement**, severity weight (§5.5), dedupe radius (§3.6), verification threshold class (§3.4), staleness TTL (§3.5), and pillar membership (§5.3).
* Categories are config-driven (server-delivered), so regional additions don't require app releases.

## 7.2 The 39 Issue Categories

**Pillar: Roads & Mobility**

| # | Category | Icon | Photo | Severity | Dedupe | TTL |
|---|---|---|---|---|---|---|
| 1 | Pothole | 🕳️ | Required | 2.0 | 25 m | 180 d |
| 2 | Damaged road surface / cracks | 🛣️ | Required | 1.0 | 40 m | 180 d |
| 3 | Broken / missing sidewalk | 🚶 | Required | 1.0 | 40 m | 180 d |
| 4 | Faded road markings / crossings | 🦓 | Required | 0.5 | 60 m | 365 d |
| 5 | Broken streetlight | 💡 | Optional* | 1.0 | 40 m | 120 d |
| 6 | Damaged / malfunctioning traffic signal | 🚦 | Optional* | 3.0 | 60 m | 30 d |
| 7 | Missing / damaged road sign | 🪧 | Required | 1.0 | 50 m | 180 d |
| 8 | Blocked drainage / street flooding | 🌊 | Required | 2.0 | 150 m | 60 d |
| 9 | Open / damaged manhole | ⚠️ | Required | 3.0 | 25 m | 30 d |
| 10 | Damaged bridge / overpass / underpass | 🌉 | Required | 3.0 | 100 m | 90 d |

**Pillar: Cleanliness & Sanitation**

| # | Category | Icon | Photo | Severity | Dedupe | TTL |
|---|---|---|---|---|---|---|
| 11 | Illegal garbage dumping | 🗑️ | Required | 2.0 | 50 m | 30 d |
| 12 | Overflowing public bin | 🚮 | Required | 1.0 | 30 m | 14 d |
| 13 | Littered public area | 🧹 | Required | 0.5 | 80 m | 30 d |
| 14 | Sewage leak / overflow | 🦠 | Required | 3.0 | 60 m | 21 d |
| 15 | Stagnant water | 💧 | Required | 1.0 | 50 m | 30 d |
| 16 | Public toilet unusable / unsanitary | 🚻 | Optional* | 1.0 | 25 m | 60 d |
| 17 | Dead animal on public land | 🐾 | Optional* | 1.0 | 40 m | 7 d |

**Pillar: Utilities & Services**

| # | Category | Icon | Photo | Severity | Dedupe | TTL |
|---|---|---|---|---|---|---|
| 18 | Water supply disruption | 🚱 | Optional* | 2.0 | 300 m | 14 d |
| 19 | Power outage (localized, recurring) | 🔌 | Optional* | 2.0 | 300 m | 14 d |
| 20 | Exposed / hanging electrical wires | ⚡ | Required | 3.0 | 30 m | 21 d |
| 21 | Suspected gas leak (odor) | 🛢️ | Optional* | 3.0 | 100 m | 3 d |
| 22 | Broken water pipe / public leak | 🚰 | Required | 2.0 | 40 m | 21 d |

**Pillar: Safety & Lighting**

| # | Category | Icon | Photo | Severity | Dedupe | TTL |
|---|---|---|---|---|---|---|
| 23 | Poorly lit street at night | 🌙 | Optional* | 1.0 | 100 m | 180 d |
| 24 | Unsafe / derelict building or structure | 🏚️ | Required | 3.0 | 50 m | 180 d |
| 25 | Stray animal concern (aggressive/pack) | 🐕 | Optional* | 1.0 | 150 m | 21 d |
| 26 | Vandalism / destructive graffiti | 🎨 | Required | 1.0 | 40 m | 90 d |
| 27 | Abandoned vehicle | 🚗 | Required | 1.0 | 30 m | 60 d |
| 28 | Chronic illegal parking / blocked access | 🅿️ | Required | 1.0 | 60 m | 60 d |
| 29 | Persistent noise pollution source | 🔊 | Optional* | 1.0 | 200 m | 60 d |
| 30 | Air pollution / open burning | 💨 | Required | 2.0 | 300 m | 21 d |

**Pillar: Environment & Public Space**

| # | Category | Icon | Photo | Severity | Dedupe | TTL |
|---|---|---|---|---|---|---|
| 31 | Fallen tree / dangerous branch | 🌳 | Required | 2.0 | 40 m | 14 d |
| 32 | Damaged playground / park equipment | 🛝 | Required | 1.0 | 40 m | 120 d |
| 33 | Encroachment of public space | 🚧 | Required | 1.0 | 50 m | 120 d |
| 34 | Suspected illegal construction | 🏗️ | Required | 1.0 | 60 m | 120 d |
| 35 | Damaged bus stop / transit shelter | 🚏 | Required | 1.0 | 40 m | 120 d |
| 36 | Broken public bench / fixture / fountain | 🪑 | Required | 0.5 | 30 m | 180 d |
| 37 | Polluted water body (lake/river/canal) | 🏞️ | Required | 2.0 | 200 m | 60 d |
| 38 | Mosquito breeding site | 🦟 | Required | 1.0 | 60 m | 21 d |
| 39 | Accessibility barrier (ramps, tactile paving, obstructions) | ♿ | Required | 2.0 | 30 m | 180 d |

\* **Optional photo** categories are conditions that are hard or unsafe to photograph meaningfully (darkness, odor, outage, animals) — see §7.4.

## 7.3 Verification Threshold Classes

| Class | Categories | Threshold |
|---|---|---|
| Safety-critical | 6, 9, 10, 14, 20, 21, 24 | Trust-weight 2 + immediate reduced-opacity visibility (§3.4) |
| Standard | all others | Trust-weight 3 |
| Area-phenomenon | 18, 19, 21, 25, 29, 30 | Trust-weight 3, wide dedupe radius, confirmations valid within radius (not 150 m) |

## 7.4 Photo Rules

* **Required:** submission blocked without ≥ 1 photo; AI category-consistency check runs (§4.5).
* **Optional:** allowed without photo but the incident's confidence photo-component contributes 0 (§3.7), so it needs more community confirmations to reach equivalent confidence — evidence flexibility without evidence discount.
* Night-condition categories (5, 23): AI checks tolerate low light; darkness is *the evidence*.
* No-photo safety categories (21 gas odor): photo field replaced by a structured questionnaire (smell strength, extent, duration).

## 7.5 Positive Community Signals (12)

Same verification pipeline, photo **always required**, severity replaced by **impact weight**:

| # | Signal | Icon | Impact | Notes |
|---|---|---|---|---|
| P1 | Road / sidewalk repaired | ✅ | 2.0 | Auto-converts to resolution if matching an active incident (§2.7) |
| P2 | New / restored street lighting | 🌟 | 2.0 | |
| P3 | Street or public-area cleaned | 🧼 | 1.0 | |
| P4 | New public amenity (bench, fountain, toilet, shelter) | 🏛️ | 1.5 | |
| P5 | Park created / renovated | 🌺 | 2.0 | |
| P6 | Tree planting / green cover added | 🌱 | 1.0 | |
| P7 | Community cleanup event held | 🤝 | 1.5 | Event-type: time-boxed pin |
| P8 | Accessibility improvement | ♿ | 2.0 | |
| P9 | Public art / beautification | 🖼️ | 0.5 | Sanctioned/harmless works, vs. category 26 |
| P10 | Improved waste collection service | ♻️ | 1.5 | |
| P11 | New pedestrian/cycling infrastructure | 🚲 | 2.0 | |
| P12 | Well-maintained exemplary spot | 🏅 | 0.5 | Rate-limited: 1/user/area/month |

Positive signals decay in score contribution over 180 days unless re-confirmed — sustained quality needs sustained evidence.

---

# 8. Monetization

**Principle:** citizens never pay to contribute or to see the truth about their own surroundings. Organizations pay for depth, breadth, history, and machine access. The free tier must remain genuinely excellent — it *is* the data engine.

## 8.1 Free (forever)

Live map, reporting, confirming, resolving, comments, full incident timelines, area scores + breakdowns, basic trends (90 days), rankings, Compare (2 places), Ask AI (10/day), 5 saved places, digest notifications.

## 8.2 Vicinia Plus (consumer subscription)

Unlimited Ask AI · full historical trends + time-scrubber heat maps (§6.5) · Compare up to 4 places with personalized weighting · unlimited saved places with **instant** alerts · 2 personal Area Intelligence Reports/month. Target price ~$4–6/month.

## 8.3 Area Intelligence Reports (one-off purchases)

Generated PDF/web reports for a chosen area: score history, pillar analysis, verified incident inventory, resolution performance, seasonal patterns, AI narrative, comparable-area benchmarks. Tiers: personal (~$9) / professional with white-label + data appendix (~$49).

## 8.4 Real Estate & Business Intelligence

* **Real estate reports:** street-level quality evidence, 24-month trajectory, "what's improving/declining within 800 m," commute-corridor conditions. Sold per-report and via agency subscription (embed API for listing sites).
* **Business location intelligence:** multi-site comparison, footfall-environment quality, cleanliness/safety trend risk, competitor-area benchmarks.

## 8.5 Enterprise Dashboards (governments, utilities, facility operators)

Live operational view of their jurisdiction: verified-incident queues by category/severity/age, resolution SLA tracking, recurrence hot-lists (§3.5), before/after evidence packs, ward-level score reporting, CSV/BI export. Seat + jurisdiction-size pricing. **Governments get read access and a verified "official response" channel on incidents — never edit/delete power over community data.**

## 8.6 Government Analytics

Longitudinal program evaluation: did the road program move Roads & Mobility scores? Budget-to-outcome evidence, cross-ward equity analysis, seasonal planning models (§4.7).

## 8.7 API Access

Metered developer API: scores, aggregates, verified incident feeds (privacy-filtered: no reporter identities, coordinates fuzzed to ~25 m for non-enterprise tiers). Tiers: hobby (free, low volume) / startup / enterprise.

## 8.8 Historical Data & Smart Alerts

* **Historical datasets:** bulk exports of daily score snapshots and anonymized verified-event archives for research/insurance/urban-planning, under license.
* **Smart alerts (B2B):** webhook/API alerts on custom triggers ("any safety-critical verified incident within polygon X", "score of ward Y drops 5 points").

**Monetization red lines:** no ads on incident content · no selling individual-user data, ever · no pay-to-boost or pay-to-hide incidents (an organization can *respond* publicly, never suppress) · free tier score visibility never degrades.

---

# 9. Technical Logic

## 9.1 Core Architecture

* **Clients:** iOS + Android (single cross-platform codebase recommended), web app (browse/search/reports; reporting supported with browser geolocation), enterprise web dashboard.
* **Backend:** API gateway → stateless application services → async workers. Service seams (deploy as modular monolith first, split later): Identity & Reputation · Incidents & Verification · Media · Geo/Score · AI pipeline · Notifications · Billing/Enterprise.
* **Event backbone:** every domain action emits an event (`report.created`, `incident.verified`, `resolution.confirmed`…). Consumers: confidence engine, score pipeline, notifications, trends, fraud detection, audit log. The append-only event stream *is* the audit trail (§10.10).

## 9.2 Database Concepts

* **Primary store:** PostgreSQL + PostGIS. Core entities: `users`, `incidents` (geo-indexed), `timeline_events` (append-only), `photos`, `geo_units` (street/neighborhood/city/state/country hierarchy), `score_snapshots` (append-only daily), `subscriptions`, `moderation_cases`, `fraud_signals`.
* **Search:** OpenSearch/Elasticsearch for full-text + geo incident search.
* **Cache:** Redis for viewport tiles, hot scores, rate-limit counters, session state.
* **Media:** object storage + CDN; originals in restricted-access bucket (moderator/audit only), public serves processed derivatives (§3.8).
* **Analytics:** columnar warehouse (event-stream sink) powering trends, dashboards, and dataset exports.
* Timeline events and score snapshots are **append-only by constraint**, not convention.

## 9.3 APIs

* Public mobile/web API (versioned REST; GraphQL optional for the dashboard): viewport incidents, incident detail/timeline, submit report/confirm/dispute/resolve, scores, trends, compare, Ask AI, profile, saved places.
* Enterprise/partner API (§8.7) is a separate surface with its own auth (API keys + OAuth2 client-credentials), quotas, and privacy filters.
* All write endpoints: idempotency keys (offline retry safety, §2.4), signed media-upload URLs, server-side validation of every client-enforced rule.

## 9.4 Map Clustering

* Server-side clustering per zoom level over the PostGIS index, cached per tile; cluster payload = count + dominant category + status mix, so clusters are informative before expansion.
* Delta updates over websocket for stable viewports (§2.3); full refetch on viewport jump.

## 9.5 Search — see §2.8; geocoding provider abstracted behind an internal interface (swap Mapbox/Google/OSM per region/cost).

## 9.6 Notifications

* Fan-out worker consumes domain events, matches against geo-subscriptions (saved places) and geofence opt-ins, applies per-user caps and digest folding (§2.10), delivers via APNs/FCM/email.
* Geofenced "confirm nearby" prompts evaluate on-device where OS support allows; server fallback uses coarse last-known location only for opted-in users.

## 9.7 Offline Behavior

* Read: last-viewed map tiles + incident data cached; saved places cached fully.
* Write: reports/confirmations queue locally with capture-time GPS + timestamps + photos; background sync with idempotency keys; conflicts (e.g., incident meanwhile resolved) surface as a gentle post-sync notice ("this issue was marked resolved while you were offline — your photo was added to its timeline").

## 9.8 Scalability

* Stateless services scale horizontally; geo-sharding of hot tables by region when needed.
* Score computation is incremental (event-driven recompute per affected unit) + nightly reconciliation; heavy analytics live in the warehouse, never on the OLTP path.
* AI pipeline is fully async with per-stage queues and graceful degradation: if image AI is down, submissions still ingest (`PENDING`, AI-unverified) and verification proceeds on community weight alone with an annotation.
* Cost controls: model cascades (cheap classifiers first, expensive forensics only on suspicion), aggressive caching of AI summaries (§4.2).

---

# 10. Security & Anti-Fraud

**Threat model in one line:** people will try to fake problems, fake fixes, farm reputation, attack rivals' neighborhoods, boost their own, and scrape private data. Every mechanism below assumes motivated, coordinated adversaries.

## 10.1 GPS Spoofing Detection

* Signals: mock-location API flags (Android), jailbreak/root heuristics, impossible-travel checks (report in city A, confirmation in city B 10 minutes later), GPS-vs-IP-geolocation mismatch, GPS-vs-photo-capture-GPS mismatch (§3.8), sensor plausibility (a "walking" device with zero accelerometer variance).
* Action: signals feed the per-user **fraud score** — suspicious contributions get quarantined weight (count 0 toward verification until reviewed), not silent deletion.

## 10.2 Fake Account Detection

* Signup-time: device fingerprinting, disposable-email detection, velocity limits per device/IP/subnet.
* Behavioral: account clusters that only ever interact with each other's content (confirmation rings) detected via graph analysis — a ring of 10 accounts confirming each other's reports forms a dense, isolated subgraph that legitimate neighbors never do.
* Action: ring-flagged confirmations are retro-invalidated; affected incidents recompute confidence; repeat → device-level restriction.

## 10.3 Spam Prevention

* Rate limits by reputation level (§2.11): reports/day, confirmations/day, comments/hour; per-area limits (one user cannot generate 30% of an area's daily reports).
* Content-based: duplicate-text detection, link stripping in descriptions, commercial-content classifier (§4.9).

## 10.4 AI Image Verification — consolidated in §4.3–4.4; anti-fraud consumes those scores.

## 10.5 User Reliability & Manipulation Dampening

* Accuracy tracking (§2.11) makes trust *earned and losable*; confirmation weight scales with proven reliability.
* Score-manipulation dampening (§5.7, §6.2): contributor-diversity terms mean N events from 3 accounts move a score far less than N events from 30 accounts; trend anomalies with low unique-contributor counts are fraud signals, not trends (§4.6).
* **Negative campaigns** (rival neighborhood attack): geographically-implausible contributor influx into one area triggers area-level review mode — new verifications there require elevated thresholds until cleared.

## 10.6 Rate Limiting

* Layered: per-IP (edge), per-device, per-account, per-area, per-endpoint. Progressive backoff, then CAPTCHA, then temporary action locks. Limits are config-driven and reputation-scaled.

## 10.7 Privacy

* Precise home location never required; profile "home area" is neighborhood-granularity.
* Public reporter identity on incidents is display-name + level only; users may contribute **anonymously** (contribution still affects their private reputation; public timeline shows "A verified resident").
* Photos: automatic face/plate blurring (§3.8); originals restricted-access + audit-logged.
* Contribution histories are not publicly browsable (§2.11); API coordinates fuzzed for non-enterprise tiers (§8.7).
* GDPR/DPDP-style rights: export, erasure (identity erased, content anonymized — disclosed at signup, §2.2), consent-based background location, data-processing register per region.

## 10.8 Legal Considerations

* Incidents describe *conditions*, not accusations against persons; descriptions naming individuals are PII-moderated (§4.9).
* Property-related categories (24, 33, 34) carry "suspected/reported by community" framing and a fast-track owner-response + appeal channel.
* Defamation exposure minimized by evidence-first design: every claim public on the platform is photo/consensus-backed or labeled pending.
* Regional compliance layer: category availability, data residency, and moderation thresholds configurable per jurisdiction; government data requests handled under a published transparency policy.

## 10.9 Incident Appeals

* Who can appeal: a reporter whose submission was rejected; a property owner/affected party disputing a verified incident; a user disputing a resolution.
* Flow: appeal form (reason + optional evidence) → triage (AI-summarized case file: timeline, AI scores, moderation history) → decision by human moderator, or by a **Steward panel (3 members, majority)** for community-facing disputes → outcome appended to the incident timeline with a public reason code.
* SLA: 72 h standard, 24 h for safety-critical or legal-flag appeals. Appeal outcomes feed AI-model calibration (§4.5) and moderator QA.

## 10.10 Audit Trails

* The append-only event stream (§9.1) records every state-changing action: who/what/when/prior-state, including moderator and admin actions (viewing unblurred originals, merges, recategorizations, appeals).
* Score snapshots are immutable (§5.6); confidence recomputations log their input vector.
* Admin access is role-scoped, MFA-enforced, session-recorded for sensitive surfaces; quarterly internal audit of moderator decisions against policy.

---

# Appendix A — Glossary

| Term | Meaning |
|---|---|
| **Incident** | Canonical record of one real-world condition at a place (issue or positive signal) |
| **Confirmation** | A trust-weighted, presence-verified attestation that an incident is real |
| **Confidence** | 0–100 trust metric on a single incident (§3.7) |
| **Vicinia Score** | 0–100 condition metric on a geographic unit (§5) |
| **Pillar** | One of six category groups feeding the score (§5.3) |
| **Trust-weight** | Reputation-scaled value of a user's confirm/dispute action (§2.11, §3.4) |
| **Steward** | Highest community-reputation tier with limited moderation powers (§2.11) |
| **Geo unit** | Street segment / neighborhood / city / state / country (§5.4) |

# Appendix B — Build Order (recommendation)

1. **MVP core:** identity + reputation skeleton, incident CRUD with one-pin dedupe, confirmations/thresholds, photo pipeline with basic AI checks, live map with clustering, basic Vicinia Score, search.
2. **Trust layer:** disputes, resolutions, timelines, confidence UI, moderation queue + appeals.
3. **Intelligence layer:** trends, rankings, compare, Ask AI, AI summaries/insights.
4. **Growth & revenue:** saved places + notifications, Vicinia Plus, area reports, then enterprise dashboard + API.

*End of master specification. This document supersedes all prior "CivicLens" material; the product is Vicinia.*
