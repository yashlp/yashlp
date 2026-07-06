# CivIQ — Master Product Requirements Document

> **Working file name:** `CivIQ_Master_PRD.md`
> **Status:** Living specification — feed directly into Cursor AI / engineering for build-out.
> **Formerly known as:** CivicLens (see rebrand rationale below).

---

## 0. Rebrand Note — From CivicLens to CivIQ

### Why the name changed

"CivicLens" framed the product as something you look *through* — a lens pointed at problems. That framing quietly pulled the product back toward "complaint app" territory, which is the exact positioning this spec explicitly rejects. A lens is passive; it observes. This product is not passive — it **scores, reasons, predicts, and explains**.

**New name: `CivIQ`** — pronounced *"civ-eye-cue"*.

- **Civ** — civic, community, citizens, cities.
- **IQ** — intelligence. Not just data collection, but reasoning: scoring, verification, prediction, comparison.
- Short, ownable, easy to say, works as an app name, a company name, and a product suite name (`CivIQ Score`, `CivIQ Ask`, `CivIQ Pro`, `CivIQ for Government`).
- Positions the product next to category leaders that use "IQ" as a shorthand for applied intelligence, signaling *analytical authority* rather than *complaint intake*.

All references to "CivicLens" in the original concept are replaced with **CivIQ** throughout this document. Any legacy code, package names, bundle IDs, or database identifiers created before this rebrand should be migrated (see §9.9 Migration Notes).

### What "refurbishing the idea" means in this document

Renaming alone is cosmetic. This document also **hardens the original concept** into something buildable by closing gaps that a developer would otherwise have to guess at. Concretely, versus the original CivicLens concept, this spec adds or tightens:

1. A **precise, numeric Confidence Score formula** (not just "community confirms it") — see §3.6.
2. **Tiered verification speed by severity** — a gas leak or downed power line cannot wait for 3 confirmations the way a pothole can. See §3.3.
3. A **concrete duplicate-detection algorithm** (radius + time window + category match + AI similarity), not just "checks nearby" — see §3.5.
4. A **explicit state machine** for incident status (`Reported → Community-Reported → Verified → Highly Verified / Disputed → Resolved-Pending → Resolved-Verified → Archived`) instead of an implied "Active/Resolved" binary.
5. A **reputation model with numeric levels and decay**, not just an abstract notion of "trust."
6. A **defined data retention & appeals process** (original concept mentioned "audit trails" as a heading only).
7. **Offline-first sync rules** for the report-in-the-field use case, since civic issues are frequently reported in low-connectivity areas (basements, rural roads, parking garages).
8. A concrete **39-category taxonomy** with symbols, required evidence, and verification thresholds per category (the original only referenced "39 categories" as a placeholder).
9. A **repositioning statement**: CivIQ is documented internally, in code comments, ticket templates, and onboarding docs, as a **Community Intelligence Platform**, never as a "reporting app" or "complaint app." This is enforced as a literal writing-style rule for the team (see §1.5).

Everything below is written as the authoritative spec. Where the original conversation left a section as a heading only, this document fills it in completely so it can be hand a developer with no further clarification needed.

---

## 1. Product Vision & Core Concept

### 1.1 Overview

**CivIQ** is an AI-assisted **Community Intelligence Platform** that turns everyday observations from ordinary people into a living, continuously updated, verifiable profile of every street, neighborhood, city, state, and country.

CivIQ is not a complaint box. It is a **place intelligence system**. Citizens report civic issues (potholes, broken streetlights, flooding, crime concerns, illegal dumping, etc.) *and* positive developments (a repaired road, a new park, a cleanup event, a new bike lane). Every report is anchored to a single, deduplicated map pin that accumulates evidence, confirmations, disputes, comments, and — eventually — a resolution, without ever being deleted. The result is a permanent, queryable timeline of how a place has actually changed.

AI sits underneath almost every workflow — not as a gimmick, but as infrastructure: it deduplicates reports before a human ever has to sort through clutter, flags suspicious or reused photos, checks that a photo actually matches its claimed category, summarizes hundreds of comments into one paragraph, and answers plain-language questions like *"Is this neighborhood safe to walk at night?"* or *"Has flooding gotten worse here in the last two years?"*

The **CivIQ Score** (formerly "Community Health Score") is the platform's signature output: a 0–100 number, per category and overall, computed at every zoom level from a single street up to an entire country, always backed by transparent, inspectable evidence rather than a black box.

> **One-line positioning:** *CivIQ turns what a community already knows into a number, a map, and an answer.*

### 1.2 Problem Statement

- Civic issue reporting today (311 apps, municipal portals, social media complaints) is **one-directional and disposable**: a citizen submits, and the report frequently disappears into a queue with no visible outcome, no history, and no way for anyone else to see whether the same issue was already reported.
- There is no consumer-facing way to answer, with evidence, questions like *"How does this neighborhood compare to the one I'm considering renting in?"*, *"Is this area getting better or worse?"*, or *"What is this specific street actually like to live on?"*
- Positive change (a repaired road, a new park, a successful cleanup) is invisible. Civic platforms almost universally track only negative signals, which skews public perception of a place toward decline even when things are improving.
- Real estate platforms, insurers, relocation services, and local governments each independently and expensively try to answer "what is this place really like," typically using stale, low-resolution, or purely government-sourced data that lags real conditions by months or years.
- Existing reporting tools have weak-to-no verification, so duplicate reports, spam, and unreliable data erode trust in the aggregate numbers they produce.

### 1.3 Target Users

| Segment | Need | How CivIQ Serves Them |
|---|---|---|
| **Residents** | Report issues, track resolution, understand their neighborhood | Reporting, confirmations, notifications, CivIQ Score for their street |
| **Prospective movers / renters / buyers** | Evaluate a place before committing | Compare Places, historical trends, AI summaries, safety & infrastructure scores |
| **Local businesses** | Understand foot traffic context, safety, infrastructure near a site | Business Location Intelligence reports |
| **Real estate professionals** | Back up listings with objective, sourced data | Real Estate Intelligence Reports, embeddable score badges |
| **Journalists / researchers** | Analyze civic trends at scale | Historical datasets, API access, trend exports |
| **Local government / public works** | Prioritize repairs, measure outcomes, respond to constituents | Enterprise dashboards, category-level analytics, resolution SLAs |
| **Insurers / investors** | Risk-score locations | Historical incident data, predictive risk indicators |

### 1.4 Value Proposition

- **For citizens:** a single tap turns an observation into a permanent, visible record that others can confirm — and you can actually see it resolved, not vanish into a void.
- **For decision-makers (movers, buyers, businesses):** a trustworthy, AI-explained answer to "what is this place like," backed by verifiable community evidence instead of anecdote.
- **For governments and enterprises:** a real-time, independently-verified signal layer that complements (and can be cross-checked against) internal 311/works-order systems.

### 1.5 Why CivIQ Is Different

| Typical Civic App | CivIQ |
|---|---|
| One pin per report → duplicate clutter | One pin per *incident*, unlimited confirmations |
| Reports vanish after submission | Full permanent timeline, never deleted |
| Only negative issues tracked | Negative issues **and** Positive Signals tracked equally |
| No verification — anyone can post anything | Multi-layer community + AI verification with numeric confidence |
| No way to compare places | Compare Places, Rankings, Trends built-in |
| Static complaint form | Conversational **Ask AI** interface for any location |
| No historical record | Every place has a permanent, queryable history |
| Binary "open/closed" status | Full state machine with disputes, re-open, and appeals |

### 1.6 Product Philosophy

1. **Communities are the primary sensor.** People who live somewhere are the highest-resolution, lowest-latency data source about that place. CivIQ's job is to structure, verify, and amplify that signal — not replace it.
2. **Nothing is deleted; everything is dated.** History is a feature. A resolved pothole from two years ago is evidence of a functioning system, not clutter to be removed.
3. **AI assists, it does not adjudicate.** AI flags, scores, and suggests. Humans (the community, moderators, and — for disputes — an appeals process) make final calls on ambiguous cases.
4. **Positive signals are first-class, not an afterthought.** A platform that only records decline will only ever describe decline. Positive Signals are equally structured, equally verifiable, and equally weighted into the CivIQ Score.
5. **Every number is explainable.** No score, ranking, or badge is shown without a way to drill into the underlying reports, confirmations, and evidence that produced it.
6. **Internal language discipline:** engineers, designers, and support staff refer to CivIQ internally as a **"community intelligence platform,"** never a "reporting app" or "complaint app." This single wording rule is deliberately enforced because it changes what gets prioritized — intelligence, comparison, and understanding, not just intake and ticketing.

### 1.7 Vision & Mission

**Vision:** To become the world's most trusted community intelligence platform — the default place anyone goes to understand, compare, or improve any location on Earth.

**Mission:** To turn everyday local observations into verified, structured intelligence that improves transparency and accountability, and helps citizens, businesses, and governments make better decisions about the places they live in, invest in, and govern.

---

## 2. Complete User Journey

This section documents every major end-to-end user path from install to habitual use.

### 2.1 First-Time Onboarding

**Purpose:** Get a new user to their first meaningful "aha" moment (seeing real, live data about their own street) in under 60 seconds, before asking for any commitment (account creation).

**User Flow:**
1. User installs the app and opens it for the first time.
2. App requests location permission with a contextual pre-prompt screen explaining *why* ("See what's happening on your street") before triggering the native OS permission dialog.
3. If granted, the map immediately centers on the user's current location and loads real nearby incidents and Positive Signals as animated pins — no login wall.
4. A lightweight card surfaces the CivIQ Score for the user's immediate area with a one-line AI summary (e.g., *"This street's CivIQ Score is 82 — mostly driven by 3 recently resolved infrastructure reports and no active safety concerns."*).
5. A dismissible coach-mark sequence highlights: the Report button, the Ask AI icon, and the score badge.
6. If location permission is denied, the app falls back to a searchable location picker ("Search a city or address to explore") so the user can still experience the product without GPS.
7. Account creation is deferred until the user attempts to **write** something (report, confirm, comment) — read-only browsing never requires an account.

**System Flow:**
- Client requests a geo-fenced bundle of incidents/signals from the map API (see §9.4 map clustering) scoped to a ~1–2 km radius of the device location.
- Backend computes and returns a cached CivIQ Score snapshot for the user's street/neighborhood tile if one exists; otherwise computes it synchronously (small area, cheap) and caches it.
- Analytics event `onboarding_map_first_paint` is logged with time-to-first-pin latency for product monitoring.

**Decision Logic:**
- Read-only access is unlimited and never gated behind sign-up.
- The very first write action (tap "Report," "Confirm," or "Comment") triggers a **just-in-time auth prompt**, not a blocking modal at launch.

**Edge Cases:**
- No location permission and no manual location entered → show a default "explore mode" with a curated set of high-activity example cities so the map is never empty.
- No incidents exist within radius (rural/new market) → show an empty-state card: *"No reports here yet. Be the first to put this street on the map."* with a prominent Report CTA.
- Slow/no network on first load → show skeleton pins from any bundled sample dataset or a friendly offline message; retry automatically on reconnect.

### 2.2 Registration & Login

**Purpose:** Make identity durable enough to support reputation and accountability, while keeping friction minimal.

**User Flow:**
1. Triggered contextually (see 2.1) rather than at app launch.
2. User chooses a sign-in method: phone number (OTP), email + password, or a third-party SSO provider (Google/Apple).
3. Phone verification is the default recommended path because it directly supports anti-fraud/anti-bot measures (§10.2).
4. User sets a display name and optional avatar; real name is never required or shown publicly.
5. A short, skippable "home base" step lets the user set a primary neighborhood — used to power push notifications and the personalized home feed, not required to browse.

**System Flow:**
- New account is created with `reputation_score = starting_baseline` (see §2.11) and `trust_tier = "New"`.
- Device fingerprint, IP-block hash, and phone-carrier metadata are captured at registration time and stored (not shown to the user) to support fraud clustering (§10.2).
- A verification record is created; unverified accounts can browse and comment but have reduced write privileges until phone/email verification completes (see Decision Logic).

**Decision Logic:**
- **Unverified accounts** may: browse, save places, comment, add a Positive Signal confirmation.
- **Unverified accounts may NOT**: submit a brand-new incident report, submit a Resolved claim, or confirm a Resolved claim — these actions require at least one verified contact method, since they carry higher fraud/impact risk.
- Multiple accounts detected on the same device+IP+phone-carrier fingerprint within a rolling 24-hour window are automatically placed into a `pending_review` fraud queue rather than blocked outright (see §10.2).

**Edge Cases:**
- OTP not received → offer voice-call OTP fallback after 60 seconds.
- User abandons registration mid-flow after already taking a photo for a report → the draft report and photo are persisted locally and re-offered immediately after successful sign-in ("Finish reporting the pothole you started?").
- Duplicate phone number across accounts → block new account creation, direct user to account recovery instead.

### 2.3 Home Map Experience

**Purpose:** The home map is CivIQ's primary surface — the "living profile" of wherever the user currently is or is looking.

**User Flow:**
1. User lands on a full-screen map centered on their location (or last-viewed location).
2. Pins are clustered by proximity and zoom level; each pin's color/icon reflects category and status (e.g., red outline = unresolved, green fill = resolved, gray = disputed/under review).
3. A persistent bottom sheet shows the CivIQ Score for the currently-visible map area, updating live as the user pans/zooms.
4. Tapping a pin opens an Incident Detail sheet (category, photos, confirmations, timeline, comments).
5. A floating action button opens the Report flow (§2.4).
6. A toggle lets the user switch between "All," "Issues only," and "Positive Signals only" layers.
7. A time-scrubber (collapsed by default) lets the user "rewind" the map to see historical states — powering the Before & After feature (§6.4).

**System Flow:**
- Client requests clustered pin data per viewport bounding box + zoom level (server-side clustering, §9.4).
- CivIQ Score for the visible area is computed from a materialized, pre-aggregated score table keyed by geo-tile + zoom band, refreshed on a rolling basis (not computed live per request) for performance.
- Map tiles and pin clusters are cached client-side with a short TTL and invalidated by a lightweight push signal when a new confirmed incident appears nearby (via the notification/event bus, §9.5).

**Decision Logic:**
- Zoom level determines aggregation granularity: street-level (building/segment), neighborhood, city, state/region, country — this drives both which pins render individually vs. as clusters, and which CivIQ Score tier is shown (§5.3).
- Only incidents at `Community-Reported` confidence or above are counted toward the visible CivIQ Score by default; raw single-report pins are visually deemphasized (lower opacity) so unverified noise doesn't distort the score users see first.

**Edge Cases:**
- Extremely dense urban areas → aggressive clustering with a "zoom to expand" affordance rather than rendering hundreds of overlapping pins.
- User pans far from their current location → CivIQ Score bottom sheet updates to describe the new area explicitly ("Downtown Millbrook — CivIQ Score 74") so it's never ambiguous which place is being scored.

### 2.4 Reporting Flow (Incident Reporting)

See §3.2 for the fully detailed Purpose/User Flow/System Flow/Decision Logic/Edge Cases breakdown — this is the canonical example referenced throughout this document.

### 2.5 Confirming Incidents

**Purpose:** Convert a single unverified report into trusted community intelligence through independent corroboration.

**User Flow:**
1. User taps a nearby pin (or receives a nudge notification: *"Is this pothole still there? Confirm what you see."*).
2. User is shown the existing report's category, photo, and description.
3. User selects one of: **"Yes, I see this too"** (confirm), **"I don't see this / this looks wrong"** (dispute), or **"This has been fixed"** (routes into the Resolution flow, §2.6).
4. User may optionally add their own photo or a short comment.

**System Flow:**
- A `confirmation` record is written, linked to the incident, the confirming user, their location at time of confirmation, and a timestamp.
- The confidence score recalculation job is triggered (§3.6).
- If confirmations cross a status threshold, the incident's `status` field transitions and a fan-out notification is queued to users who are following that pin or area (§2.10).

**Decision Logic:**
- A confirmation only counts toward confidence if the confirming user is physically within a defined proximity radius of the incident at confirmation time (GPS-checked) — remote "confirmations" from someone who was never there are rejected client-side and flagged server-side if attempted repeatedly (possible spoofing, §10.1).
- One confirmation per user per incident; a user can later change their vote (confirm → dispute or vice versa), which recalculates confidence but the change itself is logged in the audit trail (§10.10).

**Edge Cases:**
- Confirmations and disputes arrive in roughly equal numbers → incident enters `Disputed` status, is flagged for a closer look (more evidence requested from the original reporter, and/or lower visual prominence on the map) rather than resolved by a simple majority (§3.3, §3.7 edge case handling).
- A user tries to confirm an incident from across the country → GPS proximity check fails, action is rejected with an in-app explanation, and the attempt is logged.

### 2.6 Resolving Incidents

**Purpose:** Close the loop — let the community verify that a previously reported issue has actually been fixed, without deleting the original report's history.

**User Flow:**
1. From an existing incident, user taps **"Mark as Resolved."**
2. User is prompted to add a "resolved" photo (recommended, not always mandatory — see §7 per-category rules) and an optional note.
3. Submission creates a `Resolved-Pending` update attached to the same incident (not a new pin).
4. Nearby users are nudged to confirm or dispute the resolution, mirroring the original verification flow.
5. Once the resolution confirmation threshold is met, the pin visually flips from active-issue styling to resolved styling, but remains tappable to view the full before/after timeline.

**System Flow:**
- A `resolution_claim` record is appended to the incident's timeline; the incident's core `status` does not change to `Resolved-Verified` until the claim itself passes its own confidence threshold (mirrors original incident verification, see §3.4 state machine).
- The Community Health Score for the area is recalculated once the resolution is verified, since a resolved issue reduces the negative weight it previously contributed (with a decay curve, not an instant jump — see §5.5).

**Decision Logic:**
- Category severity affects resolution proof requirements: safety-critical categories (e.g., downed power line, gas leak) require a higher-confidence resolution claim (more confirmations, or an authoritative source such as a matched enterprise/government feed) before flipping to `Resolved-Verified`; low-severity categories (e.g., litter) can resolve on a single credible confirmation plus a photo.
- If no one disputes or confirms a resolution claim within a defined SLA window, it defaults to `Resolved-Verified` at reduced confidence rather than sitting in limbo forever (a "silence implies acceptance, but marked as lower-confidence" rule).

**Edge Cases:**
- Someone disputes a resolution claim (issue is not actually fixed) → incident reopens to its prior `Verified`/`Highly Verified` state, the false resolution claim is logged against the claimant's reputation, and the original evidence remains fully intact.
- Issue recurs later in the same location after being marked resolved → system offers to reopen the existing pin (preserving full history) instead of silently creating a duplicate, using the same duplicate-detection logic as new reports (§3.5), extended to check archived/resolved pins as well as active ones.

### 2.7 Positive Signal Flow

**Purpose:** Give equal structural weight to community improvements, not just problems — core to the "living profile of a place" philosophy (§1.6).

**User Flow:**
1. User taps "Report" and selects the **Positive Signal** tab instead of Issue.
2. User picks a signal type (e.g., 🌳 Tree Planted, 🧹 Community Cleanup, 🏞️ New Park Opened — full list in §7.2).
3. Same location-capture and photo-evidence pattern as an incident report.
4. Nearby users can confirm the Positive Signal exactly as they would confirm an incident.

**System Flow:**
- Positive Signals are stored in the same underlying `place_event` model as incidents, differentiated by a `polarity` field (`negative` / `positive`), so they share the verification, confidence, and timeline machinery rather than being a bolted-on separate system.
- Verified Positive Signals contribute a **positive** weighted term to the CivIQ Score calculation for their category and area (§5.4).

**Decision Logic:**
- Positive Signals use the same confirmation-threshold mechanism as incidents but generally require fewer confirmations to reach `Verified` status, since the downside risk of a false positive "good news" report is lower than a false negative civic hazard — false positives here are cross-checked opportunistically against nearby incident resolutions (e.g., a "road resurfaced" signal near a previously verified pothole cluster gets an automatic confidence boost).

**Edge Cases:**
- Businesses or self-interested parties attempt to post promotional "Positive Signals" about their own property → category list is restricted to civic/public-realm improvements (not "my restaurant is great"), and AI moderation flags promotional language patterns for review (§4.9).

### 2.8 Search

**Purpose:** Let users jump directly to any place, category, or specific report rather than only browsing spatially.

**User Flow:**
1. User taps the search bar from anywhere in the app.
2. User can search by: place name/address, category (e.g., "flooding near me"), or a specific saved incident.
3. Results are grouped into **Places**, **Categories**, and **Incidents**, ranked by relevance and proximity.
4. Selecting a place jumps the map there and surfaces its CivIQ Score card; selecting a category applies it as an active map filter; selecting an incident opens its detail sheet directly.

**System Flow:**
- Place search proxies to a geocoding service, merged with CivIQ's own indexed place metadata (score, top categories, recent activity) so results are richer than a plain geocoder.
- Category and incident search hit a full-text + geo index (see §9.5) scoped by the user's current map viewport by default, with an explicit "search everywhere" toggle.

**Decision Logic:**
- Default search scope is "near me / current map view" to keep results relevant; global search is available but requires one explicit tap to avoid noisy, irrelevant results by default.

**Edge Cases:**
- Ambiguous place names (e.g., "Springfield") → disambiguation list shown with state/region qualifiers.
- Zero results → offer to broaden scope automatically ("No matches nearby — showing results city-wide") rather than a dead end.

### 2.9 Saved Places

**Purpose:** Let users track specific locations over time (their home, a rental they're considering, a family member's neighborhood) without needing to re-search.

**User Flow:**
1. From any place/area score card, user taps "Save."
2. User optionally labels it ("Home," "Mom's House," "123 Elm St. — considering renting").
3. Saved Places appear in a dedicated tab showing current score, trend arrow, and new-activity badge count.

**System Flow:**
- A `saved_place` record links the user to a geo-fence (point + radius, or polygon for a neighborhood) and subscribes them to a lightweight change-detection job that diffs the area's score and new verified incidents on a scheduled cadence.

**Decision Logic:**
- Saved Places drive the personalized notification digest (§2.10) — new verified activity in a saved place is always eligible for notification, subject to the user's notification preferences.

**Edge Cases:**
- User saves an extremely large area (e.g., an entire state) → system caps the polygon size or suggests narrowing to keep change-detection meaningful and computationally bounded.

### 2.10 Notifications

**Purpose:** Bring users back at moments of genuine relevance without becoming spam.

**User Flow / Trigger Types:**
1. **Nearby nudge:** "You're near a reported pothole on Elm St — still there?" (confirmation request, geofenced, rate-limited).
2. **Status change:** "A report you confirmed is now Resolved."
3. **Saved place digest:** periodic (daily/weekly, user-configurable) summary of new activity in saved places.
4. **Reputation event:** "Your report was verified! +10 reputation."
5. **Dispute/appeal update:** "Your resolution claim was disputed — add more evidence."
6. **AI trend alert (premium):** "Flooding reports in your saved area increased 40% this month."

**System Flow:**
- All notification triggers are emitted as events onto an internal event bus; a notification service applies per-user preference filters, quiet hours, and rate limits before dispatch (push, in-app, and optionally email/SMS digest).

**Decision Logic:**
- Nearby nudges are rate-limited per user per day and suppressed if the user has already interacted with that pin.
- Notification priority tiers ensure safety-relevant alerts (e.g., a verified hazard newly appearing in a saved place) bypass batching/digest windows, while routine status updates are batched.

**Edge Cases:**
- User disables location but has saved places → nudge-type notifications requiring live proximity are disabled automatically, digest-type notifications remain available.
- Notification storm risk (major event causing many reports in one area) → server-side de-duplication collapses many related events into a single digest notification ("12 new flooding reports near your saved area") instead of 12 separate pushes.

### 2.11 Profile & Reputation

**Purpose:** Make trustworthiness visible and give contributors a reason to keep being accurate.

**User Flow:**
1. Profile shows: display name/avatar, reputation score, trust tier badge, total contributions (reports, confirmations, resolutions), and an accuracy rate.
2. Users can view their own contribution history as a personal timeline.
3. Trust tier badges (see below) are visible on a user's comments/reports to give other users context.

**System Flow / Decision Logic — Reputation Model:**

| Trust Tier | Reputation Range | Unlocked Privileges |
|---|---|---|
| New | 0–49 | Browse, comment, confirm Positive Signals |
| Verified | 50–199 | Submit incidents, confirm incidents |
| Trusted | 200–499 | Submit resolutions, confirmations weighted higher |
| Community Leader | 500–999 | Reports auto-verify faster (fewer confirmations needed), eligible for local moderation queue |
| Civic Steward | 1000+ | Highest confirmation weight, eligible to review disputed/appealed cases |

Reputation changes:
- `+5` submitting a report that later reaches `Verified`
- `+2` a confirmation that aligns with the eventual consensus outcome
- `-10` a report that is confirmed false/fabricated
- `-15` a resolution claim disputed and overturned
- `-25` and account flagging after repeated fraud-pattern detections (§10.2)
- Reputation **decays slowly toward baseline** over long periods of inactivity, so old good behavior doesn't grant permanent unearned authority (see §10.5 User Reliability for the full decay model).

**Edge Cases:**
- New account with unusually rapid reputation gain (bot farm pattern) → automatically capped and flagged for review rather than allowed to compound (§10.2).
- Users disputing reputation penalties can file an appeal (§10.9).

---

## 3. Incident & Verification System

This is the structural core of CivIQ. Every other feature (Score, Trends, Rankings, Ask AI) is downstream of the data model and lifecycle defined here.

### 3.1 One-Pin-Per-Incident Model

Every real-world civic issue is represented by exactly **one** persistent pin (`incident` record), regardless of how many people report or discuss it. New submissions near an existing, matching incident become **confirmations** or **comments** on that pin rather than new pins. This is the single most important anti-clutter, anti-duplicate mechanism in the product, and it is what makes the CivIQ Score mathematically meaningful (double-counted duplicate reports would silently corrupt every score derived from them).

### 3.2 Reporting Flow — Full Breakdown (Canonical Example)

**Purpose:** Capture a new civic issue with the minimum friction necessary to produce a usable, verifiable record, while catching duplicates before they're created.

**User Flow:**
1. User taps **Report**.
2. User selects a category (e.g., 🕳️ Pothole) from the 39-category grid (§7.1), optionally aided by an AI suggestion if they took a photo first.
3. GPS captures the device's current location (with manual pin-drop adjustment allowed within a small radius, to correct for GPS drift).
4. The app checks whether a similar incident already exists nearby (§3.5).
5. **If a match is found:** the user is shown the existing pin and invited to **confirm it, add photos, or comment** instead of creating a new one.
6. **If no match is found:** the user proceeds to create a new incident — adding a required or optional photo (per category rules, §7.1), an optional text description, and submitting.
7. AI verifies the photo actually depicts something consistent with the selected category, and checks it isn't a duplicate/reused image (§4.3, §4.4).
8. The new incident is created with status `Reported` and becomes visible on the map immediately at low visual prominence (see §3.3), while it accumulates community confirmation.
9. Once it reaches the category's required confirmation threshold, its status is upgraded and it becomes fully/prominently visible, contributing to the area's CivIQ Score.
10. Later, any user can submit a **Resolved** update with photos (§2.6).
11. Nearby users confirm or dispute the resolution.
12. The pin transitions from an active-issue state to a resolved state, while the full timeline (original report → confirmations → comments → resolution claim → resolution confirmations) is permanently preserved and viewable.

**System Flow:**
1. Client sends: category, coordinates, accuracy radius, photo (if provided), optional text, device/session metadata.
2. Backend runs the duplicate-detection query (§3.5) against the geo-index.
3. If no duplicate: a new `incident` row is created (`status = Reported`, `confidence = base value`), photo is queued for AI analysis (async), and the event is published to the map/notification event bus.
4. AI analysis results (category match confidence, tamper/reuse flags) are written back to the incident asynchronously and factored into the confidence score once available — the pin does not block on AI completing before appearing, but its confidence recalculates the moment AI results land.
5. Confirmation events from other users progressively update `confidence` and may trigger a `status` transition (§3.4).

**Decision Logic:**
- Category determines: required confirmation count, whether a photo is mandatory or optional, and severity tier (which affects both notification urgency and resolution-proof requirements) — full table in §7.1.
- New reports are visible immediately (transparency principle: nothing is hidden pending review) but rendered at reduced visual prominence and explicitly labeled "Unverified — 1 report" until they cross the `Community-Reported` threshold.

**Edge Cases:**
- **Users disagree** (roughly equal confirm/dispute split) → incident enters `Disputed` state (§3.7); it is not resolved by simple majority alone if the sample size is small — a minimum absolute number of confirmations is required regardless of ratio, to prevent 1-vs-0 "disputes" from being statistically meaningless.
- **Duplicate reports submitted despite the check** (e.g., two users report within seconds of each other, before either's duplicate-check query saw the other) → a background reconciliation job periodically re-scans very recent incidents in the same category/area and auto-merges near-simultaneous duplicates, preserving both original submissions as merged evidence rather than picking one and discarding the other.
- **Poor-quality photo** (blurry, wrong angle, doesn't clearly show the issue) → AI flags low confidence in category-match; the report is still created (never silently rejected) but starts at lower confidence and the reporter is prompted, in-app, to add a clearer photo to speed up verification.
- **Attempted abuse** (fabricated report, joke submissions, spam) → covered fully in §10 Security & Anti-Fraud; the short version is that suspicious patterns reduce a report's starting confidence and can route it to a moderation queue rather than instant public visibility.

### 3.3 Verification Thresholds & Severity Tiers

Not every category can or should wait the same amount of time or the same number of confirmations before being trusted. CivIQ defines **four severity tiers**, each with its own default confirmation threshold (individual categories can override these defaults — see §7.1 for the full per-category table):

| Severity Tier | Example Categories | Confirmations to `Verified` | Visibility Behavior |
|---|---|---|---|
| **Critical (Immediate)** | Gas leak smell, downed power line, active crime/safety concern | 1 (plus AI photo check where applicable) | Shown at full prominence immediately; also eligible for direct routing to emergency/utility partner feeds where integrations exist (does not replace calling emergency services — UI always reminds users to contact emergency services directly for life-threatening situations) |
| **High** | Flooding, blocked storm drain, major road damage, hazardous tree | 2 | Elevated prominence after 1 confirmation, full prominence at 2 |
| **Standard** | Pothole, broken streetlight, illegal dumping, graffiti | 3 | Standard prominence ramp as described in §3.2 step 9 |
| **Low** | Litter, minor signage issues, noise complaints | 4 | Lowest urgency; longer aggregation windows are acceptable |

### 3.4 Status State Machine

```
Reported
   │  (reaches tier confirmation threshold)
   ▼
Community-Reported
   │  (confidence ≥ 60, min. unique confirmers met)
   ▼
Verified ──────────────► Disputed (confirm/dispute ratio triggers review)
   │  (confidence ≥ 85)         │
   ▼                             │ (dispute resolved either direction)
Highly Verified                  ▼
   │                     Verified / Reported (reverts)
   │  (resolution claim submitted)
   ▼
Resolved-Pending
   │  (resolution confirmation threshold met, OR SLA timeout with silence-implies-acceptance rule)
   ▼
Resolved-Verified
   │  (fixed retention window elapses with no dispute/reopen)
   ▼
Archived (fully preserved, contributes to historical trend data, deprioritized from live map default view)
```

A `Resolved-Verified` incident can be **reopened** at any time if a new report/dispute demonstrates recurrence, re-entering the state machine at `Verified` (not restarting from `Reported`) so its accumulated evidence and history is not lost.

### 3.5 Duplicate Detection

**Algorithm (executed synchronously at report-submission time):**
1. Query all incidents of the **same category** within a **configurable radius** (default 75 meters, tighter for point-hazards like a single pothole, wider for area conditions like flooding or air quality) of the new report's coordinates.
2. Restrict to incidents still within an **active time window** (default 90 days for standard/low severity, unbounded for high/critical severity — a downed power line reported last month and "still there" is not a stale duplicate concern in the same way a pothole is) and also check `Resolved-Verified`/`Archived` incidents in that radius as recurrence candidates.
3. Run an AI image-similarity check between the new photo (if provided) and existing incident photos to strengthen or weaken the match (protects against, e.g., two unrelated potholes 20 meters apart on the same street being incorrectly merged).
4. Compute a composite match score from: distance decay, category match (exact match required), time recency, and image similarity.
5. If match score exceeds the merge threshold → present the existing incident to the user as a likely match (user still has final say — see below).
6. If below threshold → create a new incident.

**Decision Logic:**
- The system **suggests**, it does not silently force-merge, when a match is only moderately confident — the user can confirm "yes, same issue" or explicitly state "no, this is different" (e.g., two separate potholes on the same block), which creates a new incident and also logs a training signal to improve future duplicate-detection tuning.
- High-confidence matches (near-identical GPS + same category + very short time gap) are auto-merged without prompting, purely to keep the flow fast for the extremely common "two people report the same obvious thing minutes apart" case.

**Edge Cases:**
- Category mismatch on an otherwise obvious duplicate (e.g., one person tags a hazard as "Road Damage," another as "Unsafe Pedestrian Crossing" for the same spot) → a secondary cross-category proximity check flags likely duplicates even across differing category selections for moderator/AI review, since citizens are not always precise about category naming.

### 3.6 Confidence Calculation

Every incident has a **Confidence Score (0–100)**, recalculated on every new confirmation, dispute, comment-with-evidence, or AI analysis result:

```
Confidence = 
    40%  × VerificationRatio      (confirms / (confirms + disputes), with Bayesian smoothing so a single early confirm doesn't spike to 100%)
  + 25%  × ReporterCredibility    (average reputation tier of reporter + confirmers, normalized 0–100)
  + 20%  × AIPhotoMatchScore      (AI's confidence that photo evidence matches the claimed category, 0–100)
  + 10%  × RecencyFactor          (decays confidence slightly for older unconfirmed reports, resets on new confirming activity)
  +  5%  × EvidenceRichness       (normalized score from photo count, comment count, distinct confirmer count)
```

- Bayesian smoothing prevents a report with exactly "1 confirm, 0 disputes" from registering as 100% verified — a minimum sample size is baked into the ratio calculation.
- `AIPhotoMatchScore` defaults to a neutral midpoint if no photo was provided (for categories where photos are optional), so absence of a photo doesn't unfairly tank confidence for categories that don't require one.
- Status transitions (§3.4) are driven off of confidence thresholds **combined with** minimum absolute confirmer counts, never confidence alone — this prevents a single high-reputation user's confirmation from instantly "verifying" something that no one else has corroborated.

### 3.7 Edge Cases — System-Wide

- **Users disagree:** handled via `Disputed` status (§3.4); disputed incidents are shown on the map with a distinct "under review" visual treatment rather than either fully hidden or presented as fact.
- **Duplicate reports:** handled via §3.5; near-simultaneous duplicates are reconciled by a background merge job.
- **Poor-quality photos:** never cause outright rejection; they reduce starting confidence and prompt the reporter for better evidence (§3.2 edge cases, §4.4).
- **System abuse attempts** (mass-fake-reporting, coordinated brigading of confirms/disputes, GPS spoofing): detected and mitigated per §10; abusive accounts have their votes down-weighted or excluded from confidence calculations pending review, rather than being allowed to silently corrupt the public record.
- **Incident timeline preservation:** regardless of any status transition, dispute, or reopening, the full evidentiary history (every submission, confirmation, dispute, comment, and photo, each with a timestamp and — for moderation purposes only, never shown publicly — the submitting account) is retained permanently and never overwritten, per the audit trail requirements in §10.10.

### 3.8 Comment System

- Comments are threaded per-incident, support photo attachments, and are subject to the same AI moderation pipeline as reports (§4.9) for spam, harassment, and off-topic content.
- Comments can be marked by other users as "Helpful" (lightweight upvote), which feeds into which comments AI prioritizes when generating an incident summary (§4.2).
- Comments cannot be deleted by their author after other users have replied to or marked them helpful (edit-with-history instead), to preserve the audit trail integrity described in §10.10; they can still be reported for moderation.

---

## 4. AI Features

AI is infrastructure throughout CivIQ, not a single standalone "AI tab." This section documents each distinct AI capability.

### 4.1 Ask AI

**Purpose:** Let any user ask a natural-language question about a place and get a grounded, evidence-backed answer instead of having to manually dig through pins.

**User Flow:**
1. User taps the Ask AI icon (available globally, and contextually pre-scoped when opened from a specific place/area).
2. User types or speaks a question, e.g., *"Is it safe to walk here at night?"*, *"Has this street gotten better or worse in the last year?"*, *"What's the biggest issue in this neighborhood right now?"*
3. AI returns a concise natural-language answer, explicitly grounded in and citing specific verified incidents, Positive Signals, and score trends — with tappable references that jump to the underlying evidence.

**System Flow:**
- Query is scoped to a geographic area (explicit or inferred from current map view/selected place).
- A retrieval step pulls the relevant verified incidents, Positive Signals, score history, and category breakdowns for that area from the data layer.
- The retrieved, structured data — not open-ended free-text speculation — is passed to the language model as grounding context, and the model is instructed to answer **only** from that grounding data, explicitly declining or caveating when data is insufficient rather than fabricating an answer.

**Decision Logic:**
- Answers always cite specific incidents/scores that back up the claim being made; a response that cannot be grounded in real data returns an honest "not enough verified data in this area yet" rather than a plausible-sounding guess.
- Unverified (`Reported`-only, single-submission) incidents are still eligible to be referenced but are explicitly labeled as "unverified" if cited, never presented with the same confidence as `Verified`/`Highly Verified` data.

**Edge Cases:**
- Question about an area with very little data → AI explicitly states data sparsity rather than overstating confidence ("Only 2 verified reports exist for this street in the last year — not enough to draw a strong conclusion, but here's what's there.").
- Leading/loaded questions designed to elicit a defamatory-sounding claim about a specific person or business → AI is constrained to only discuss place-level civic conditions, never make claims about identifiable individuals, and refuses personal-target queries.

### 4.2 AI Summaries

- Every incident with more than a handful of comments/confirmations gets an auto-generated, periodically refreshed summary (e.g., *"Confirmed by 6 residents. Most describe this as a deep pothole causing tire damage; one comment notes it has worsened after recent rain."*).
- Area-level summaries roll up into the CivIQ Score card ("This area's score is primarily driven by 3 unresolved infrastructure issues and 2 recent Positive Signals").
- Summaries always disclose their evidence basis (number of reports/confirmations summarized) so they never read as unattributed editorializing.

### 4.3 Duplicate Image Detection

- Perceptual hashing + embedding similarity comparison flags when a submitted photo is identical or near-identical to a photo already in the system (either reused across unrelated incidents by the same user, or lifted from the internet/stock imagery).
- A flagged duplicate photo does not auto-reject the report but strongly reduces `AIPhotoMatchScore` (§3.6) and routes to moderation if the pattern repeats for a given account (§10.4).

### 4.4 Fake / Manipulated Image Detection

- Checks for signs of digital manipulation (splicing artifacts, inconsistent lighting/shadows, known-AI-generation fingerprints), screenshot-of-a-screen patterns, and metadata inconsistencies (e.g., EXIF GPS wildly inconsistent with the claimed report location, or missing entirely when the device is known to normally embed it).
- Flags contribute to confidence scoring and, past a severity threshold, route directly to human moderation rather than only soft-penalizing confidence — image fraud is treated as a stronger signal than a merely low-quality photo.

### 4.5 Wrong-Category Detection

- A lightweight image classifier checks that the photo plausibly matches the selected category (e.g., a photo of an overflowing dumpster shouldn't be filed under "Broken Traffic Signal").
- On likely mismatch, the reporter is prompted in real time, before submission, to confirm or correct the category — reducing bad data at the source rather than only catching it after the fact.

### 4.6 Trend Analysis

- AI-generated narrative trend summaries at the neighborhood/city/state level (e.g., *"Pothole reports in this district are down 22% quarter-over-quarter, while flooding reports have risen 15%, consistent with this spring's rainfall increase."*), always paired with the underlying chart data (§6.1) rather than replacing it.

### 4.7 Predictive Insights

- Pattern-based (not purely generative) forecasting for categories with sufficient historical density — e.g., flagging streets with a seasonal flooding pattern before the rainy season starts, or infrastructure segments with rising deterioration velocity.
- Presented explicitly as **probabilistic forward-looking signals**, always labeled as predictions rather than confirmed facts, and always paired with a confidence indicator.

### 4.8 Recommendations

- "Places like this one" comparisons for users evaluating a move.
- Personalized nudges ("3 incidents you confirmed near your saved home are now Resolved — see the timeline").
- Category-specific recommendations for local officials in enterprise dashboards ("These 5 street segments have the highest confirmed-pothole density and lowest resolution rate — prioritize here").

### 4.9 AI Moderation Rules

AI moderation runs on every report, comment, and photo submission and evaluates for:
- Spam / promotional content
- Harassment, hate speech, or personal targeting of identifiable individuals
- Off-topic content unrelated to the civic/place context
- Category misuse patterns (e.g., using the platform to complain about a specific business or neighbor rather than a genuine public civic condition)
- Coordinated inauthentic behavior signatures (bursts of similar content from clustered accounts)

**Decision Logic:** AI moderation assigns a risk score; low-risk content publishes immediately, medium-risk content publishes but is queued for human moderator spot-review, high-risk content is held pending human review before publication. Every AI moderation action is reversible by a human moderator and is logged in the audit trail (§10.10). Users are always notified when content is held or removed, with a stated reason and an appeal path (§10.9).

---

## 5. Community Health Score → **CivIQ Score**

*(Renamed from "Community Health Score" to **CivIQ Score** for brand consistency — same underlying model.)*

### 5.1 Overall Score

- A single 0–100 number representing the overall condition of a place, computed from the weighted, confidence-adjusted aggregate of all `Verified`-or-higher incidents and Positive Signals in that area over a rolling historical window (with older events decayed, not dropped — see §5.5).
- Displayed with a **letter-style tier band** for quick scanning (e.g., 85–100 Excellent, 70–84 Good, 50–69 Fair, 30–49 Needs Attention, 0–29 Critical), in addition to the raw number, so the score is legible at a glance without requiring numeric literacy about the underlying scale.

### 5.2 Category Scores

- Each of the 39 categories (§7) contributes its own sub-score, letting a place have, e.g., a strong "Infrastructure" score but a weak "Sanitation" score — critical for the Compare Places and Rankings features (§6) to be genuinely useful rather than reducing everything to one flattening number.

### 5.3 Street, Area, City, State & Country Aggregation

- Scores are computed and materialized at five geo-tiers: **Street segment → Neighborhood → City → State/Region → Country**.
- Higher tiers are a confidence-weighted roll-up of their children, **not** a simple average — a state's score reflects population-weighted and report-density-weighted aggregation of its cities, so a single sparsely-reported rural area doesn't distort a state score, and a single very-active city doesn't singularly dominate it either.
- The map's current zoom level determines which tier's score is surfaced by default (§2.3).

### 5.4 Weighting

Each `Verified`-or-higher event contributes to its category and area score weighted by:
- **Severity tier** (§3.3) — critical/high severity issues weigh more heavily on the negative side than low-severity ones.
- **Confidence score** (§3.6) — higher-confidence events count more fully; borderline-confidence events contribute a partial weight.
- **Polarity** — Positive Signals contribute positively, incidents contribute negatively, explicitly by design (§1.6, §2.7) so an area's score reflects both problems and improvements rather than only ever trending down.
- **Recency** — see §5.5.

### 5.5 Historical Scoring & Decay

- Every score computation is stored as a dated snapshot, not just a live current value, enabling full historical trend charts (§6.1) and Before & After comparisons (§6.4).
- Unresolved negative events' weight decays slowly over a long time horizon (very old, still-unresolved reports eventually contribute less per-event than a fresh one of the same severity, reflecting reduced certainty about current on-the-ground conditions) but **never fully drop to zero** while still unresolved and un-archived — a genuinely persistent problem should not disappear from the score just because it's old.
- Resolved events' negative weight is removed on a decay curve (not an instant jump) after verified resolution, reflecting that a freshly-fixed issue takes a little real-world time to be reflected in a place feeling "better," and giving room for a resolution to be disputed/reopened without an already-fully-recovered score having to snap back down jarringly.

### 5.6 Confidence Indicators

- Every score is shown alongside a **data-confidence indicator** (e.g., "based on 47 verified reports over 18 months" vs. "based on 2 verified reports — limited data"), so users never mistake a sparse-data score for a high-certainty one.

---

## 6. Trends, Rankings & Compare

### 6.1 Historical Trends

**Purpose:** Show how a place's condition has changed over time, at the overall and per-category level.

**User Flow:** From any place's score card, user taps "View Trends" → sees a time-series chart (overall + per-category toggle) with the ability to select custom date ranges.

**System Flow:** Reads from the historical score snapshot table (§5.5); chart data is pre-aggregated at daily/weekly/monthly granularity depending on the zoom of the selected date range to keep queries fast at any time horizon.

**Decision Logic:** Trend lines only render segments with sufficient underlying data density; sparse-data periods are visually indicated (e.g., dotted rather than solid line) rather than interpolated as if equally certain.

**Edge Cases:** New areas with less than a minimum history window show a "Not enough historical data yet" state rather than a misleading flat/empty chart.

### 6.2 Rankings

- Leaderboards of places ranked by overall or per-category CivIQ Score, filterable by geography tier (neighborhoods within a city, cities within a state, etc.) and by trend direction (most-improved, most-declined).
- Rankings always display the underlying score and confidence indicator alongside rank position — rank alone, without the score, is explicitly avoided as a UI pattern because it invites over-interpretation of small, statistically insignificant differences.

### 6.3 Compare Places

**Purpose:** Directly answer "which of these places is better for what I care about," the single highest-value decision-support feature for movers, renters, and businesses.

**User Flow:** User selects 2–4 places (via search or "Compare" from any place card) → sees a side-by-side breakdown: overall score, per-category scores, trend direction, and an AI-generated natural-language comparison summary.

**System Flow:** Pulls current and historical score snapshots for each selected place at matching geo-tiers; AI summary generation follows the same grounded-answer pattern as Ask AI (§4.1).

**Decision Logic:** Comparisons are only offered between places at the same geo-tier (street-vs-street, city-vs-city) by default, to avoid a misleading street-vs-country comparison; cross-tier comparison is available but explicitly labeled as such.

### 6.4 Before & After

- Given any place and a resolved incident (or a date range), generates a visual and data comparison of before/after state using the preserved timeline evidence (§3.7) — e.g., original report photo vs. resolution photo, plus the score's trajectory across that window.

### 6.5 Heat Maps

- Category-filterable density heat maps overlaying the map view (e.g., "show me flooding density across this city") — a spatial complement to the point-pin view, most useful at city/state zoom tiers where individual pins would be too dense to parse visually.

### 6.6 AI-Generated Insights

- Surfaced contextually across Trends, Rankings, and Compare (e.g., "This neighborhood's most-improved category this year is Infrastructure, largely driven by a resurfacing project completed in March") — always grounded and citation-backed per the same rule as Ask AI (§4.1).

---

## 7. All 39 Categories & Positive Signals

### 7.1 Complete Category Definitions

Severity tiers reference §3.3. "Photo" column: **R** = Required, **O** = Optional, **R\*** = Required with an exception noted. Confirmations column shows the default count needed to reach `Verified` (severity-tier default unless overridden).

**Infrastructure & Roads**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 1 | 🕳️ | Pothole | Standard | R | 3 |
| 2 | 🚧 | Road Damage / Cracked Pavement | Standard | R | 3 |
| 3 | 🌉 | Bridge / Overpass Damage | High | R | 2 |
| 4 | 🚦 | Broken Traffic Signal | High | O | 2 |
| 5 | 🛑 | Missing / Damaged Road Sign | Standard | O | 3 |
| 6 | 🚸 | Unsafe Pedestrian Crossing | High | O | 2 |
| 7 | 🏗️ | Illegal / Unsafe Construction | High | R | 2 |

**Utilities**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 8 | 💡 | Broken Streetlight | Standard | O | 3 |
| 9 | ⚡ | Downed Power Line | Critical | O | 1 |
| 10 | 💧 | Water Leak / Burst Pipe | High | R | 2 |
| 11 | 🚰 | No Water Supply | High | O | 2 |
| 12 | 🔥 | Gas Leak Smell | Critical | O | 1 |
| 13 | 📡 | Utility Pole / Cable Hazard | High | R | 2 |

**Sanitation & Environment**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 14 | 🗑️ | Overflowing Trash / Missed Collection | Standard | R | 3 |
| 15 | 🚮 | Illegal Dumping | Standard | R | 3 |
| 16 | 🧴 | Litter / Public Space Debris | Low | O | 4 |
| 17 | 🌊 | Flooding / Waterlogging | High | R | 2 |
| 18 | 🕸️ | Blocked Storm Drain | High | R | 2 |
| 19 | 🏭 | Air Quality / Smoke / Odor | High | O | 2 |
| 20 | 🐀 | Pest / Rodent Infestation | Standard | O | 3 |
| 21 | 🌳 | Hazardous / Fallen Tree | High | R | 2 |

**Safety & Security**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 22 | 🚨 | Crime / Safety Concern | Critical | O | 1 |
| 23 | 🔦 | Poor Lighting / Dark Area | Standard | O | 3 |
| 24 | 🎨 | Graffiti / Vandalism | Standard | R | 3 |
| 25 | 🏚️ | Abandoned Building / Property | Standard | R | 3 |
| 26 | 🚗 | Abandoned Vehicle | Standard | R | 3 |
| 27 | ⛺ | Homeless Encampment (Needs Services) | Standard | O | 3 |

**Public Spaces & Amenities**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 28 | 🏞️ | Park / Playground Maintenance | Standard | R | 3 |
| 29 | 🚻 | Public Restroom Issue | Standard | O | 3 |
| 30 | 🪑 | Damaged Public Furniture | Low | O | 4 |
| 31 | 🏊 | Pool / Public Facility Issue | Standard | O | 3 |
| 32 | 🖼️ | Damaged Public Art / Monument | Low | O | 4 |
| 33 | 📶 | Public WiFi / Kiosk Down | Low | O | 4 |

**Transit & Mobility**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 34 | 🚌 | Public Transit Issue | Standard | O | 3 |
| 35 | 🚲 | Bike Lane Obstruction / Damage | Standard | O | 3 |
| 36 | 🅿️ | Illegal Parking | Low | R | 4 |
| 37 | 🛣️ | Blocked Sidewalk | Standard | R | 3 |

**Nuisance & Quality of Life**

| # | Symbol | Category | Severity | Photo | Confirms to Verify |
|---|---|---|---|---|---|
| 38 | 🔊 | Noise Complaint | Low | O | 4 |
| 39 | 📋 | Illegal Signage / Billboard | Low | O | 4 |

*R\* note:* For any "Required" photo category, a user without a usable photo (e.g., low-light or unsafe-to-stop-and-photograph situations) can submit with a mandatory text justification instead; the report is created at reduced starting confidence and flagged for a follow-up photo request rather than blocked outright.

### 7.2 Positive Community Signals

Positive Signals are deliberately a **curated, smaller set** than the 39 issue categories (to keep them meaningfully distinct and to resist becoming a promotional free-for-all — see §2.7 edge cases), and always require civic/public-realm relevance, not private commercial promotion.

| Symbol | Positive Signal | Typically Linked To (for auto confidence-boost) |
|---|---|---|
| ✅ | Pothole Repaired | Pothole incidents nearby |
| 🛣️ | Road Resurfaced | Road Damage incidents nearby |
| 💡 | Streetlight Fixed | Broken Streetlight incidents nearby |
| 🌳 | Tree Planted / Greenery Added | — |
| 🧹 | Community Cleanup Completed | Litter/Illegal Dumping incidents nearby |
| 🎨 | Mural / Public Art Installed | Graffiti incidents nearby |
| 🏞️ | New Park / Playground Opened | — |
| 🚲 | New Bike Lane Added | — |
| 🚦 | New Traffic Signal / Crossing Installed | Unsafe Pedestrian Crossing incidents nearby |
| 🚻 | Public Restroom Renovated | Public Restroom Issue incidents nearby |
| 🏗️ | Infrastructure Project Completed | — |
| 🔦 | Improved Safety / Lighting | Poor Lighting incidents nearby |
| 🗑️ | Sanitation Improved | Overflowing Trash incidents nearby |
| 💧 | Water Supply Restored | No Water Supply incidents nearby |
| 🎉 | Community Event Hosted | — |
| 🌸 | Beautification Project | — |
| ♿ | Accessibility Improvement | — |
| 🚏 | Transit Service Improved | Public Transit Issue incidents nearby |
| 🏅 | Neighborhood Milestone / Award | — |

**Reporting requirements:** All Positive Signals allow (but do not require) a photo; requiring photo evidence is deliberately looser than for issues, since the risk profile of a false positive "good news" claim is materially lower than a false civic hazard claim (§2.7 Decision Logic). Default confirmations-to-verify for Positive Signals is **2** (lower than the Standard-severity issue default of 3), reflecting that same lower risk profile.

---

## 8. Monetization

CivIQ remains **free for all public participation** (reporting, confirming, browsing, commenting, Positive Signals) — this is a non-negotiable product principle, since the entire data asset depends on maximizing community participation. Revenue comes from professional/analytical layers built on top of the free community data.

### 8.1 Free Features
- Unlimited browsing, reporting, confirming, commenting, Positive Signal contributions.
- Ask AI (rate-limited per free-tier user per day).
- Basic Trends (last 12 months) and Compare Places (up to 2 places at a time).
- Standard push notifications and saved places (up to a modest free limit, e.g., 5).

### 8.2 Premium Intelligence Reports (CivIQ Pro — consumer subscription)
- Full historical trends (unlimited time range), unlimited saved places, unlimited Compare Places, higher Ask AI usage limits, predictive insights, and downloadable PDF area reports.

### 8.3 Real Estate Reports
- On-demand, purchasable per-address deep reports for buyers/renters/agents: full incident history, category score breakdown, trend trajectory, comparable-neighborhood benchmarking, and an AI-generated narrative summary suitable for sharing in a listing or decision conversation.
- Embeddable "CivIQ Score" badge/widget for real estate listing platforms (licensed API usage, §8.7).

### 8.4 Business Location Intelligence
- Reports scoped to commercial site-selection use cases: safety trends, infrastructure reliability, foot-traffic-adjacent civic conditions (e.g., sidewalk/lighting quality), and nearby positive/negative trend trajectory — sold to businesses evaluating a new location or benchmarking existing ones.

### 8.5 Enterprise Dashboards (Local Government)
- Category-level operational dashboards for public works/municipal teams: open-incident heat maps, resolution SLA tracking, most-reported unresolved segments, and year-over-year category trend reporting.
- Two-way integration option: government partners can push authoritative "resolved" status updates directly (e.g., from an internal work-order system), which are treated as a high-trust confirmation source (§3.6 ReporterCredibility) rather than requiring the same community-confirmation ramp as a citizen resolution claim.

### 8.6 Government Analytics
- Cross-department, cross-jurisdiction benchmarking (e.g., comparing infrastructure resolution velocity across neighboring municipalities), sold as a higher tier above the base Enterprise Dashboard for regional/state agencies.

### 8.7 API Access
- Tiered, metered API for programmatic access to place scores, category breakdowns, and (for licensed/anonymized use cases) aggregate historical trend data — never raw, individually-identifying user submission data (privacy boundary, §10.7).

### 8.8 Historical Data
- Bulk historical dataset licensing for researchers/academics/journalists, with clear data-use and re-publication terms, always aggregated/anonymized at the individual-contributor level.

### 8.9 Smart Alerts (Premium)
- Configurable, higher-sensitivity alerting beyond the free tier's standard nearby-nudge notifications — e.g., "alert me the moment any new Critical-severity incident appears within this custom polygon," aimed at businesses, property managers, and power users monitoring multiple areas.

---

## 9. Technical Logic

### 9.1 Core Architecture

- **Client apps:** iOS, Android, and a web app, sharing a common design system and talking to a single backend API layer (REST/GraphQL) — no client-specific business logic for verification/scoring, which all lives server-side to guarantee consistency across platforms.
- **Backend services (logically separated, independently scalable):** Identity/Auth, Incident & Verification, Scoring Engine, AI/ML Services (image analysis, NLP/Ask AI, moderation), Notification Service, Search/Geo-Index, Analytics/Enterprise Reporting.
- **Event-driven backbone:** an internal event bus (e.g., a managed pub/sub or streaming platform) connects write-path services (a new confirmation, a new report) to downstream consumers (score recalculation, notification fan-out, search re-indexing) asynchronously, so the write path itself stays fast and the heavier downstream work doesn't block the user-facing request.

### 9.2 Database Concepts

- **`place_event`** — the unified table underlying both incidents and Positive Signals (`polarity` field distinguishes them): id, category, polarity, severity, coordinates (with PostGIS-style geo-indexing), status, confidence, created_at, reporter_id.
- **`event_evidence`** — photos/media linked to a `place_event` or to a specific confirmation/comment, with AI-analysis metadata (match score, tamper flags, duplicate-hash) attached.
- **`confirmation`** — links a user to a `place_event`, vote type (confirm/dispute), location-at-confirmation, timestamp.
- **`resolution_claim`** — child record of a `place_event`, its own mini state machine (`Pending → Verified/Reverted`) as described in §2.6/§3.4.
- **`score_snapshot`** — dated, geo-tiered (street/neighborhood/city/state/country) rows storing overall + per-category scores and confidence indicators, the backbone of §5 and §6.1.
- **`user`** — identity, reputation score, trust tier, verification status, device/fraud metadata (§10.2).
- **`audit_log`** — append-only record of every state-changing action across the system (§10.10), independent of the primary mutable tables so it can never be altered by normal application code paths.
- Geo data is indexed using a spatial index (e.g., PostGIS geography columns or an equivalent geospatial index in the chosen datastore) to make proximity queries (duplicate detection, map viewport queries, geo-fenced notifications) efficient at scale.

### 9.3 APIs

- Public-facing REST/GraphQL API for client apps: place/incident CRUD (write actions require auth), map/viewport queries, search, Ask AI, notifications, profile/reputation.
- Partner/Enterprise API (§8.7): read-only, metered, scoped to aggregate score and category data plus (where licensed) authoritative-status write-back for government partners.
- All write endpoints pass through the AI moderation and duplicate-detection pipeline synchronously where latency allows (moderation risk scoring) and asynchronously where it doesn't (deep image analysis) — see §3.2 and §4.9.

### 9.4 Map Clustering

- Server-side clustering (not naive client-side rendering of every raw pin) computed per zoom level using a standard grid/quad-tree clustering approach, returning pre-aggregated cluster centroids + counts for low zoom levels and individual pins only once zoom crosses a per-density threshold.
- Cluster boundaries are recomputed and cached per zoom-tile with a short TTL, invalidated by the event bus when new confirmed activity changes a tile's pin density meaningfully.

### 9.5 Search

- Hybrid search combining a geocoding service (for place/address lookup) with an internal full-text + geo index (for category and incident search) — see §2.8.
- Ask AI's retrieval step (§4.1) reuses this same indexed data layer rather than a separate bespoke pipeline, to guarantee consistency between what a user finds via manual search and what Ask AI cites.

### 9.6 Notifications

- Built on the event bus (§9.1): triggering events are filtered through per-user preferences, quiet hours, geo-fencing, and rate limits before dispatch via push/in-app/email/SMS, as detailed in §2.10.

### 9.7 Offline Behavior

- The report-creation flow is **offline-capable by design**: category selection, photo capture, and GPS coordinate capture all work with no connectivity; the report is queued locally and submitted (including running duplicate-detection and moderation) once connectivity returns.
- Map browsing falls back to the last-cached viewport data when offline, with a clear "showing cached data from [timestamp]" indicator rather than silently showing stale data as if live.
- Confirmations/comments queue the same way as new reports when offline.

### 9.8 Scalability

- Read-heavy map/browse traffic is served from cached, pre-aggregated data (cluster tiles, score snapshots) rather than computing from raw event tables on every request.
- Write-path (reports, confirmations) stays lightweight by deferring all heavy processing (AI image analysis, score recalculation, search re-indexing, notification fan-out) to asynchronous event-bus consumers.
- Score computation is incremental where possible (recalculating only the affected category/area on a new event) rather than a full recompute, to keep the system responsive as data volume grows into millions of events across many geographies.

### 9.9 Migration Notes (CivicLens → CivIQ)

If any prototype code, database, or infrastructure already exists under the "CivicLens" name:
- Rename application bundle IDs, package namespaces, and repository names to `civiq*` equivalents.
- Add a `brand_migrated_at` marker and one-time data migration script if any user-facing strings, push notification templates, or stored PDF report templates hardcode "CivicLens" — these must be swept and replaced before public launch under the new name.
- Reserve the `CivIQ` trademark/domain/app-store listing name early, given naming collisions are a common launch blocker.

---

## 10. Security & Anti-Fraud

### 10.1 GPS Spoofing Detection

- Cross-checks device-reported GPS against network-based location signals (cell tower / WiFi positioning) and flags large discrepancies.
- Detects known spoofing-app signatures and mock-location developer settings where the platform APIs expose that signal.
- Confirmations from a spoofing-flagged session are excluded from confidence calculations pending review (§3.6) rather than silently accepted.

### 10.2 Fake Account Detection

- Device fingerprint + IP-block + phone-carrier clustering at registration (§2.2) feeds a fraud-scoring model that flags likely bot-farm or sockpuppet clusters for review rather than instant ban, minimizing false-positive harm to real users on shared networks (e.g., university dorms, offices).
- Rapid, unnaturally-patterned reputation gain (§2.11 edge cases) is capped and flagged automatically.

### 10.3 Spam Prevention

- Rate limits on report/comment/confirmation submission per account per time window, tuned per trust tier (§2.11) — new/unverified accounts have tighter limits than established, high-reputation accounts.
- AI moderation spam detection (§4.9) runs on all text/photo submissions.

### 10.4 AI Image Verification

- Combines duplicate-image detection (§4.3), manipulation/fake-image detection (§4.4), and wrong-category detection (§4.5) into a single per-submission risk pipeline feeding both confidence scoring (§3.6) and moderation routing (§4.9).

### 10.5 User Reliability

- Beyond the reputation point system (§2.11), each user has a computed **reliability rate** (share of their submissions that reach `Verified`/`Highly Verified` vs. that are disputed/overturned), displayed on their profile and factored into `ReporterCredibility` (§3.6).
- Reputation and reliability both **decay slowly toward a neutral baseline during long inactivity**, so a dormant account's historical standing doesn't grant disproportionate unearned trust if it resumes activity after a long gap without re-establishing current reliability.

### 10.6 Rate Limiting

- Applied at multiple layers: per-account action rate limits (10.3), per-IP request rate limits (API abuse protection), and per-device/session limits independent of account (to blunt multi-account abuse from a single device, working alongside 10.2's fingerprinting).

### 10.7 Privacy

- Public profiles never display legal name, exact home address, or precise device/location metadata — only display name, avatar, reputation/trust tier, and aggregate contribution stats.
- Exact submission-time GPS coordinates used for proximity/GPS-spoofing checks are retained for fraud/audit purposes but are not exposed via any public-facing API; only the resulting place/pin location is public.
- API and bulk data products (§8.7, §8.8) are aggregate/anonymized at the individual-contributor level by default — no product surfaces "who reported this" publicly.

### 10.8 Legal Considerations

- Category taxonomy is deliberately scoped to **public civic/place conditions**, not claims about identifiable private individuals or businesses (enforced in both category design, §7, and AI moderation/Ask AI guardrails, §4.1/§4.9), to minimize defamation exposure.
- Terms of Service require accurate, good-faith reporting and explicitly prohibit using the platform to target individuals; repeated violations lead to account action per §10.9's appeals-inclusive enforcement process (never silent/unappealable permanent bans without a review step, except in clear legal/safety-emergency escalations).

### 10.9 Incident Appeals

- Any moderation action, reputation penalty, or disputed/overturned resolution can be appealed by the affected user through an in-app appeals flow.
- Appeals are queued to human moderators (with `Community Leader`/`Civic Steward` trust-tier users eligible to participate in a community-review queue for lower-severity appeals, per §2.11) and must be resolved within a defined SLA.
- The outcome of every appeal (upheld or overturned) is itself logged in the audit trail (§10.10), and reputation adjustments from an overturned action are reversed.

### 10.10 Audit Trails

- Every state-changing action in the system (report created, confirmation cast, status transition, resolution claim, moderation action, appeal outcome, reputation change) is written to an **append-only audit log**, independent of the mutable primary data tables, with actor, timestamp, and before/after state.
- Audit logs are retained indefinitely for platform-integrity purposes but are **not publicly exposed**; they are accessible only to the moderation/trust-and-safety team and, in aggregate/anonymized form, referenced by the transparency-oriented "verification history" a normal user sees on an incident's public timeline (§3.7).

---

## Appendix A — Glossary

| Term | Definition |
|---|---|
| **CivIQ Score** | The 0–100 place-health metric (formerly "Community Health Score"). |
| **Incident** | A negative civic issue report (`place_event` with `polarity = negative`). |
| **Positive Signal** | A community improvement report (`place_event` with `polarity = positive`). |
| **Confidence Score** | The 0–100 numeric trust level of a single `place_event`, per §3.6. |
| **Trust Tier** | A user's reputation-based privilege level, per §2.11. |
| **Severity Tier** | Critical / High / Standard / Low classification per category, per §3.3. |

## Appendix B — Naming Rationale Summary

CivicLens → **CivIQ**. The old name suggested passive observation ("a lens"); the new name signals active reasoning ("intelligence"). Every section of this document has been rewritten to consistently describe the product as a **Community Intelligence Platform** rather than a reporting or complaint tool, per the internal wording discipline defined in §1.6.
