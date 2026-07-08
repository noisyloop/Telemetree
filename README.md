# TELEMETREE — Research Notes

**A field map of telemetry across operating systems, phones, browsers, dev tools, IoT, TVs, cameras, and cars — what gets collected, why it exists, and how it all connects.**

> Status: Research document. No site built yet. This README is the raw material for a future mind-map site (TELEMETREE) that visualizes the telemetry ecosystem as a connected graph.
>
> Method note: Everything here is sourced from vendor documentation, peer-reviewed measurement studies, regulatory actions, and reputable reporting. Sources are credited inline and in the References section at the bottom. Where something is contested (e.g., Google disputing a study's methodology), that's noted rather than hidden.

---

## Table of Contents

1. [What Telemetry Actually Is (A Taxonomy)](#1-what-telemetry-actually-is-a-taxonomy)
2. [Why Telemetry Exists — The Honest Version](#2-why-telemetry-exists--the-honest-version)
3. [Desktop Operating Systems](#3-desktop-operating-systems)
4. [Linux Distributions (Top 10)](#4-linux-distributions-top-10)
5. [Mobile: Android and iOS](#5-mobile-android-and-ios)
6. [Privacy Phones and Linux Phones](#6-privacy-phones-and-linux-phones)
7. [Browsers](#7-browsers)
8. [Apps and Third-Party SDKs (The Invisible Layer)](#8-apps-and-third-party-sdks-the-invisible-layer)
9. [Developer Tools](#9-developer-tools)
10. [Smart TVs and Streaming Devices (ACR)](#10-smart-tvs-and-streaming-devices-acr)
11. [IoT, Smart Home, Cameras, and Voice Assistants](#11-iot-smart-home-cameras-and-voice-assistants)
12. [Cars](#12-cars)
13. [Wearables, Routers, and Printers](#13-wearables-routers-and-printers)
14. [Shared Infrastructure: How It All Connects](#14-shared-infrastructure-how-it-all-connects)
15. [Graph Model for the TELEMETREE Mind Map](#15-graph-model-for-the-telemetree-mind-map)
16. [How to Measure Telemetry Yourself](#16-how-to-measure-telemetry-yourself)
17. [References and Credits](#17-references-and-credits)

---

## 1. What Telemetry Actually Is (A Taxonomy)

"Telemetry" literally means *remote measurement* — a device reporting data about itself back to whoever built it. The word covers a huge spectrum, and most arguments about telemetry go sideways because people are talking about different points on that spectrum. For the mind map, it helps to define **five distinct classes**, because each class has different data, different justifications, and different risk profiles:

### 1.1 Crash and error reporting
- **What:** Stack traces, crash dumps, the state of the program at the moment it died. Sometimes includes chunks of memory (which can accidentally contain personal data — Microsoft's own docs note that enhanced crash dumps "may contain portions of memory").
- **Why:** Developers genuinely cannot fix bugs they can't see. A crash reporter turns "it broke for someone, somewhere" into an actionable stack trace with frequency counts.
- **Risk:** Memory contents, file paths (often containing usernames), and URLs leak into dumps. Generally the *most defensible* class of telemetry.

### 1.2 Usage / product analytics
- **What:** Which features get clicked, session length, which settings people change, funnels ("how many users who opened X completed Y").
- **Why:** Product teams use it to decide what to build, kill, or redesign. Without it they're guessing based on the loudest forum posters.
- **Risk:** Individually mundane events aggregate into behavioral profiles. This is where "improving the product" starts blurring into "understanding the user."

### 1.3 Security and health telemetry
- **What:** Malware detections, update success/failure, certificate validation events, driver compatibility data, exploit signals.
- **Why:** This is how vendors detect mass-exploitation campaigns, validate that a patch actually rolled out, and avoid shipping updates that brick specific hardware. Microsoft Defender, Google Safe Browsing, and Apple's XProtect all depend on fleet-wide signal.
- **Risk:** Legitimately hard to remove without losing real security value — but the same channels normalize always-on reporting.

### 1.4 Engagement and advertising telemetry
- **What:** Advertising identifiers (AAID on Android, IDFA on iOS), content viewed, ads seen, conversion tracking, cross-device linking.
- **Why:** Money. This class exists to build audience profiles and prove to advertisers that their spend worked. It funds "free" services and subsidizes cheap hardware (smart TVs are the canonical example — Vizio has made more from its data/ads platform than from TV hardware margins).
- **Risk:** This is surveillance economics, not diagnostics. It's the class most people mean when they say telemetry is creepy.

### 1.5 Fingerprinting and identity infrastructure
- **What:** Hardware serials, IMEIs, MAC addresses, device fingerprints, cookies and identifiers stored by the OS itself, IP-derived location.
- **Why:** Fraud prevention, license enforcement, device attestation — and, in practice, joining all the other classes together into one profile per human.
- **Risk:** This is the connective tissue. Any single telemetry stream is much less dangerous than the identifiers that let streams be *linked*. (Trinity College Dublin's research found Google Play Services stores advertising/analytics cookies and device identifiers on Android handsets even when no Google app has ever been opened, with no way to block them.)

**Key insight for the mind map:** The interesting structure isn't "device → vendor." It's *class of data → identifier → aggregation point*. Two totally different devices (a TV and a phone) become one node in an ad-tech graph the moment they share an IP address and an identity vendor.

---

## 2. Why Telemetry Exists — The Honest Version

It's tempting to frame all telemetry as spying, but that flattens the picture and makes the map less useful. The honest breakdown:

**Legitimate engineering reasons:**
- **Update safety.** OS vendors stage rollouts and halt them when telemetry shows a spike in crashes on specific hardware. Without diagnostic data, a bad driver update ships to everyone.
- **Bug triage at scale.** With a billion devices, forum reports are noise. Crash telemetry gives frequency-ranked, reproducible failure data.
- **Security response.** Fleet telemetry is how the industry detects new malware families and mass exploitation within hours instead of months.
- **Prioritization.** Knowing that 0.3% of users touch a feature justifies deleting it; knowing 40% do justifies investment. Canonical reports ~66% of Ubuntu installers opt in to sharing install metrics, which genuinely shapes desktop decisions.

**Economic reasons:**
- **Ad-funded business models.** Google, Meta, and smart TV makers monetize attention; telemetry is the measurement layer of that business.
- **Hardware subsidy.** Cheap smart TVs are cheap *because* the post-sale data and ad platform ("Platform+" style revenue) makes up the margin.
- **Data as a product.** Automakers, data brokers, and TV vendors resell or license behavioral data outright.

**Institutional reasons:**
- **Compliance and support.** Enterprises want device health dashboards; vendors build the plumbing once and it ships to consumers too.
- **Mission creep.** A crash reporter becomes an analytics pipeline becomes an ad measurement platform. Very few systems were *designed* to be creepy; they accreted.

The tension: every class-1/class-3 justification is real, and every class-4/class-5 abuse is also real — often flowing through the *same* pipes, endpoints, and identifiers. That's exactly the thing TELEMETREE should visualize.

---

## 3. Desktop Operating Systems

### 3.1 Windows 10/11 (Microsoft)

The most heavily instrumented consumer desktop OS, and also the most heavily *documented* one (Microsoft publishes field-level docs for its diagnostic events).

**Architecture:**
- Central pipeline: the **Connected User Experiences and Telemetry** service (`DiagTrack`) plus `dmwappushservice`, feeding Microsoft's diagnostic endpoints over TLS with certificate pinning.
- Two tiers: **Required diagnostic data** (device identifiers, hardware/OS configuration, reliability and update health signals — cannot be fully disabled on Home/Pro) and **Optional diagnostic data** (app usage, browsing/site interaction for some Microsoft components, inking/typing data, enhanced crash dumps that may include memory contents).
- A **common header** attached to most events includes OS version/build/locale, diagnostic level, and a user ID tied to the Microsoft Account when present.
- Related-but-separate streams: Windows Error Reporting (crash dumps), Microsoft Edge diagnostics (split from Windows diagnostics in the EEA since March 2024 for DMA compliance), Defender cloud protection, SmartScreen URL checks, activity history, advertising ID, and "Tailored experiences" (diagnostic data reused for tips/ads/recommendations).

**Why:** Update reliability and staged rollouts, security signal for Defender, product analytics, and — with Tailored experiences — personalization/advertising.

**Controls:** Settings toggle only turns off the *optional* tier. `AllowTelemetry=0` (Security level) via Group Policy/registry is honored fully only on Enterprise/Education editions; Home/Pro floor is "Required." Microsoft estimates an average device sends ~6 MB/day of diagnostic data; the Diagnostic Data Viewer lets you inspect it locally.

**Mind-map edges:** Windows → Microsoft Account (identity join) → Edge/Bing/Office telemetry → LinkedIn/ads ecosystem. Enterprise devices → the customer's own tenant (Microsoft offers a "data processor" configuration where the org, not Microsoft, is the GDPR controller).

### 3.2 macOS (Apple)

Less volume than Windows per Trinity College Dublin's mobile findings (Apple's ecosystem generally sends less than Google's), but far from silent.

**What phones home:**
- **Analytics & Improvements** (opt-in prompt at setup): crash logs, usage analytics, Siri/dictation improvement.
- **Always-on infrastructure regardless of that toggle:** OCSP/certificate revocation checks, notarization/Gatekeeper checks (`api.apple-cloudkit.com`, `ocsp.apple.com` — the November 2020 OCSP outage famously made apps slow to launch worldwide and revealed that macOS was effectively reporting a hash of each developer's certificate, correlatable with app launches, in cleartext at the time; Apple subsequently encrypted the checks and published a policy that it doesn't log IPs from them), XProtect/MRT malware definition updates, Spotlight suggestions (queries leave the device unless disabled), Siri, iCloud sync.
- Device identifiers and Apple ID join everything together, same as Microsoft Account on Windows.

**Why:** Crash/usage analytics for engineering; notarization/OCSP for malware and revocation defense; Siri/Spotlight for features that are cloud-backed by design.

**Honest framing:** Apple's business model is less ad-dependent than Google's, and its telemetry defaults reflect that — but Apple also runs a growing ads business (App Store search ads), and research (Leith 2021) found iOS transmits telemetry to Apple even when users opt out, including from pre-installed apps like Siri, Safari, and iCloud before they're ever opened. Apple disputed aspects of the methodology.

### 3.3 ChromeOS (Google)

Effectively the Chrome browser's telemetry plus Android-style device management. Usage statistics and crash reports (opt-out), device state reporting for managed/enterprise devices, sync tied to Google Account, and Play Services telemetry when Android apps are enabled. The identity join to the Google Account is total by design — a ChromeOS device without a Google Account barely functions (Guest mode aside).

---
## 4. Linux Distributions (Top 10)

Linux is where telemetry is rarest, most transparent, and most fiercely debated. The general rule: **community distros collect nothing or opt-in only; corporate-backed distros collect small, documented, mostly-anonymous signals — and get shouted at whenever they try to expand.** Ordered roughly by desktop popularity/mindshare:

### 4.1 Ubuntu (Canonical)
The most instrumented mainstream distro, and honest about it:
- **`ubuntu-report`**: the one-time installer question ("send info about this system?"). Sends hardware specs, install options, location (coarse, from install settings), desktop choice. Opt-in via a visible dialog; Canonical says ~66% say yes. Purpose: know what hardware/desktop configs to prioritize.
- **`apport` + `whoopsie`**: crash detection and upload to errors.ubuntu.com. Purpose: crash triage. Can be disabled/purged.
- **`popularity-contest`** (inherited from Debian, opt-in): reports which packages are installed/used, feeding popularity stats that influence what goes on install media.
- **Snap store**: `snapd` necessarily talks to Canonical's store for refreshes; the store sees install counts and update checks per snap (this is closer to "app store analytics" than device telemetry, but it's a real signal channel and a common community complaint).
- **Historical scar tissue**: the 2012–2016 "Amazon lens" era, when Unity's dash sent local search queries to Canonical/Amazon by default. It was removed, but it's the reason every Linux telemetry conversation since gets compared to it.

### 4.2 Debian
- **No telemetry by default.** The only mechanism is **popcon (popularity-contest)**, strictly opt-in, asked during install, off by default. It submits the package list + usage atimes to help maintainers know what's actually used.
- Philosophy: Debian's Social Contract prioritizes user control; anything phoning home by default would violate community expectations.
- Note the baseline that applies to *every* distro: package updates, NTP, and captive-portal/connectivity checks reveal your IP + distro + rough package set to mirror operators. That's not telemetry in the analytics sense, but it's metadata leaving the machine and belongs on the map as "infrastructure exhaust."

### 4.3 Linux Mint
- **No usage telemetry.** Mint explicitly markets the absence of it and strips Ubuntu's reporting components. Update Manager checks mirrors (infrastructure exhaust only). This is a big part of Mint's identity as "Ubuntu without the corporate bits" — no Snap by default, either.

### 4.4 Fedora (Red Hat–sponsored)
The most instructive case study in how Linux communities police telemetry:
- **DNF "countme"**: a privacy-preserving counter in repo metadata requests — a bucketed value (how long the system has existed, in 4 coarse buckets) attached to one mirror request per week. No unique IDs. Purpose: estimate active install counts without tracking anyone. Widely considered the *good* model.
- **The 2023 telemetry proposal**: Red Hat's Display Systems Team proposed opt-out, anonymous, aggregate desktop metrics (based on Endless OS's metrics system, minus its phone-home component) to learn things like popular IDEs and GNOME Software banner clickthroughs. Community reaction was ferocious ("the only privacy-preserving way is no telemetry"), FESCo review forced revisions, and the proposal was ultimately **withdrawn/obsoleted**. Fedora Workstation today ships with ABRT crash reporting (user-confirmed) and countme, not behavioral telemetry.

### 4.5 Arch Linux
- **Nothing.** No installer survey, no crash reporter, no counters. **`pkgstats`** exists as an explicitly opt-in package you must install yourself (submits package list + mirror + architecture to help rank packages). Arch's DIY philosophy means the user *is* the telemetry: you configure everything, so the project doesn't need to guess.

### 4.6 openSUSE (SUSE-sponsored)
- No behavioral telemetry by default. Crash reporting is manual/user-driven. openSUSE has periodically *discussed* adding opt-in metrics to understand its user base, and those discussions meet the same community resistance as Fedora's. Package/update traffic to openSUSE mirrors is the main exhaust.

### 4.7 Manjaro
- Historically nothing; more recently the project added **MDD (Manjaro Data Donor)** — a system metrics submission (device/OS info with a generated ID) that shipped enabled-by-default in testing and drew community pushback over consent, prompting changes. Worth tracking as a live example of a community distro flirting with opt-out telemetry. (Verify current default state before publishing TELEMETREE — this has been in flux.)

### 4.8 Pop!_OS (System76)
- **`hp-vendor`-style / installer analytics: none by default for general users.** System76 collects opt-in data through its own hardware support tooling; the distro itself doesn't run behavioral telemetry. Refresh/update checks to System76 infra are the main exhaust. (System76 being a hardware vendor means its telemetry story is closer to "device support diagnostics" than OS analytics.)

### 4.9 Zorin OS
- Ships a **census/counting beacon**: a tiny anonymous ping (no unique ID, per Zorin's docs) used to count active installs, plus standard update traffic. More than Mint, far less than Windows; disclosed in their privacy policy.

### 4.10 elementary OS / others (Kali, EndeavourOS, etc.)
- **elementary**: no OS telemetry; AppCenter sees purchase/install events by necessity.
- **EndeavourOS**: nothing (Arch philosophy).
- **Kali**: nothing by default (its users would notice immediately — and loudly).

**Linux summary for the map:** The Linux cluster's edges are thin and mostly labeled *opt-in*, *anonymous counter*, or *infrastructure exhaust*. The interesting nodes are the **governance mechanisms** (Debian Social Contract, Fedora FESCo, community backlash) that function as an immune system other ecosystems lack. That's a story worth telling visually: telemetry pressure exists everywhere; Linux is where it's successfully resisted.

---

## 5. Mobile: Android and iOS

Phones are the densest telemetry objects most people own: always on, always networked, saturated with sensors, and carrying an identity.

### 5.1 Android (Google)

**The key architectural fact:** most Android telemetry doesn't live in "Android" (AOSP, which is open source and relatively quiet) — it lives in **Google Play Services**, a closed-source, auto-updating privileged layer installed on nearly every non-Chinese Android phone.

- **Channels:** Play Services' **Clearcut logger** and **Firebase/Google Analytics** are the two main pipes (documented by Trinity College Dublin's measurement work — the first research to crack open Play Services telemetry, which is binary-encoded and publicly undocumented).
- **What's been measured going to Google** (Leith et al., Trinity College Dublin, 2021–2025):
  - Telemetry flows even when the user opts out of "Usage & diagnostics," and even with no Google account logged in.
  - Handset identifiers (IMEI, hardware serial, SIM serial), phone number, and persistent device IDs are transmitted and linkable.
  - **Google Messages** sent a hash of SMS text; **Google Dialer** sent call times/durations — enough to link both ends of a conversation. No opt-out existed. Google said it would change the apps after the research.
  - Pre-installed apps (YouTube, Chrome, Clock, Search bar) connect to Google before ever being opened.
  - 2025 follow-up: Play Services silently stores advertising/analytics cookies and identifiers on the handset with no consent flow and no way to block them. Google disputes the legal analysis; the technical findings stand.
- **Advertising ID (AAID):** the cross-app identifier that joins app telemetry into one profile. Resettable, and Android now allows deleting it, but historically the spine of mobile ad tech.
- **OEM double-dip:** Samsung, Xiaomi, Huawei, etc. run their *own* parallel telemetry (Leith's six-variant study found the OEM skins add substantial data flows — Xiaomi/Huawei/Samsung handsets sent data to both the OEM and Google, sometimes with "usage & diagnostics" disabled). One phone, two-plus surveillance stacks.
- **Carrier layer:** carrier apps and network-level metadata sit underneath all of it.

**Why:** update/security plumbing (Play Protect, push notifications via FCM genuinely need infrastructure), product analytics, and — centrally — Google's advertising business. Android is the measurement substrate of the world's largest ad company; that's not an accident of engineering.

### 5.2 iOS (Apple)

- **Analytics & Improvements** (opt-in at setup): device analytics, app crash data, Siri/dictation improvement, iCloud analytics.
- **Baseline flows regardless:** Apple ID/iCloud sync, push (APNs — every notification transits Apple), App Store checks, Siri/Spotlight suggestions, Safe Browsing lookups in Safari (via Google or Tencent depending on region, proxied), Find My mesh, and OCSP-style checks.
- Leith's 2021 study found iOS sent Apple a comparable *variety* of data (IMEI, serial, phone number, location-adjacent signals) though roughly ~20x less *volume* than Android sent Google (Google disputed the volume methodology; Apple disputed characterizations too).
- **App Tracking Transparency (ATT)** limits *third-party* cross-app tracking (IDFA access now requires a prompt) — a real improvement that simultaneously strengthened Apple's own first-party ad position. Both things are true.

**Why:** ecosystem services, security, product analytics, plus Apple's growing ads business (App Store/News ads use Apple's first-party data under its own privacy framework).

---

## 6. Privacy Phones and Linux Phones

This is the "control group" of the map — what a phone looks like when telemetry is a design constraint instead of a revenue line.

### 6.1 GrapheneOS (Pixel-only, Android-based)
- **Zero OS telemetry.** No analytics, no phone-home beyond what's needed to function: update checks (anonymous, to GrapheneOS servers), connectivity checks (proxied through GrapheneOS servers by default instead of Google's, and configurable/disableable), attestation (optional Auditor app).
- **Sandboxed Google Play**: the signature move — Play Services can be installed as an ordinary unprivileged sandboxed app instead of a system-level god process. Google telemetry still happens *inside the sandbox* if you install it, but it loses privileged access to identifiers and other apps. Per-app network permission lets you cut any app off entirely.
- **Why it works:** funded by donations, not data. Pixel-only because it requires hardware security (Titan M2, verified boot with user-enrolled keys).

### 6.2 CalyxOS
- Similar zero-telemetry posture, aimed at usability: **microG** (open-source reimplementation of Play APIs) instead of sandboxed Play, built-in firewall, Datura network controls. microG still talks to Google for push notifications (FCM) if enabled — an honest, visible tradeoff.

### 6.3 /e/OS (Murena)
- De-Googled LineageOS derivative for mainstream users; replaces Google services with Murena cloud. Ships its own opt-out-able telemetry-adjacent bits historically (and Leith's six-variant study measured /e/OS as the quietest of the Android variants tested — essentially no Google flows). Tradeoff: you trust Murena's cloud instead.

### 6.4 LineageOS
- No analytics by default (it removed the old CMStats-style reporting era practices; a basic opt-out stats ping for device counts has existed). Not hardened; its purpose is device longevity, not anti-telemetry — but it strips Play Services unless you flash them.

### 6.5 Linux phones: PinePhone (postmarketOS/Mobian) and Librem 5 (PureOS)
- **Effectively zero telemetry**, because they run standard desktop-Linux stacks: no vendor analytics layer exists to phone home. Exhaust is limited to package mirrors, NTP, and whatever apps you install.
- **Librem 5** adds hardware kill switches (modem, Wi-Fi/BT, mic/camera) — telemetry control at the physics layer. The cellular modem remains the unavoidable leak on *any* phone: baseband + carrier network see your location and identifiers regardless of the OS. That's a crucial node for the map: **the carrier/baseband layer sits below every mobile OS, including the privacy ones.**

**Why these exist:** they demonstrate that nearly all mobile telemetry is a business-model choice, not a technical necessity. The delta between a Pixel running stock Android and the same Pixel running GrapheneOS *is* the telemetry economy, made visible.

---

## 7. Browsers

Browsers are both telemetry sources (their own analytics) and telemetry *enablers* (the runtime where web tracking happens). Keep those separate on the map.

- **Chrome (Google):** usage statistics + crash reports (opt-out), field trials/experiments framework (variations seed contacted at startup), Safe Browsing lookups, URL suggestions to Google when omnibox suggest is on, sync tied to Google Account, and — the elephant — Chrome is the delivery vehicle for Google's ad platform (Topics API replacing third-party cookies: the browser itself computes ad-targeting signals from your history). Also periodic pings that have historically included install/brand identifiers (RLZ on some platforms).
- **Edge (Microsoft):** Chromium base plus Microsoft diagnostics (required/optional tiers mirroring Windows), SmartScreen, shopping/Bing integrations. In the EEA it's now a separate consent surface from Windows diagnostics.
- **Firefox (Mozilla):** the most *transparent* mainstream telemetry: the **Glean** pipeline, publicly documented probe dictionary (you can look up every metric), opt-out in settings, plus crash reporter, experiments (Normandy/Nimbus), and daily-use pings. Mozilla publishes its data practices and lean data policies; still, defaults are on, and sponsored suggestions/new-tab tiles have their own measurement. Why: Mozilla argues it can't maintain a browser competitively while blind; the docs-first approach is the model other vendors should be held to.
- **Safari (Apple):** differential-privacy-based analytics (opt-in with device analytics), Safe Browsing via proxied Google/Tencent lookups, iCloud sync. Advertising attribution done via Private Click Measurement (on-device, privacy-preserving-by-design attribution).
- **Brave:** blocks third-party trackers by default; its own telemetry is **P3A** (privacy-preserving analytics with randomized responses) plus update pings — opt-out, documented. Demonstrates the "collect answers, not users" pattern.

---

## 8. Apps and Third-Party SDKs (The Invisible Layer)

The single most under-appreciated fact for TELEMETREE: **most app telemetry isn't written by the app's developer.** It's imported.

- **Crash/performance SDKs:** Firebase Crashlytics, Sentry, Bugsnag, Datadog RUM. Legitimate class-1 telemetry — but Crashlytics reports to *Google's* infrastructure, meaning thousands of unrelated apps all feed one aggregation point.
- **Analytics SDKs:** Firebase/Google Analytics, Amplitude, Mixpanel, Segment (a router that fans your events out to dozens of destinations). Class-2.
- **Ads/attribution SDKs:** AppsFlyer, Adjust, Meta SDK, Google Ads SDK. Class-4/5: these exist specifically to join app activity to ad identity across apps.
- **The pattern:** a developer adds "free analytics" in ten minutes; the SDK vendor gets a panopticon assembled from thousands of apps. Studies of app ecosystems consistently find a small handful of companies (Google, Meta) embedded in the large majority of popular apps.
- **Push notifications** deserve their own node: essentially all Android push transits Google (FCM) and all iOS push transits Apple (APNs). Even "private" apps leak notification metadata to the duopoly — and legal disclosures in 2023–24 confirmed governments have requested push-notification records from both.

**Mind-map edge type to define:** `app --embeds--> SDK --reports-to--> platform`, because that's the mechanism by which one company appears in ten thousand nodes.

---

## 9. Developer Tools

Telemetry came for the toolchain too — with some instructive fights:

- **VS Code (Microsoft):** usage + crash telemetry on by default (`telemetry.telemetryLevel`), documented events; VSCodium exists specifically as the telemetry-stripped build.
- **.NET SDK:** CLI usage telemetry on by default, disclosed on first run, opt-out via `DOTNET_CLI_TELEMETRY_OPTOUT=1`. Microsoft publishes the aggregate data — a transparency practice worth crediting.
- **Homebrew:** switched from Google Analytics to self-hosted, privacy-trimmed analytics (30-day retention, no IPs stored) after community pressure; opt-out via `HOMEBREW_NO_ANALYTICS=1`. A good case study in a community forcing a better design rather than removal.
- **Go toolchain:** Google proposed opt-out telemetry in 2023; community pushback flipped it to **opt-in** ("telemetry by default was a mistake" era of discussion) — shipped as opt-in local counters with optional upload. Another governance win worth mapping.
- **npm/pip/cargo:** registries see download counts, IPs, user agents (infrastructure exhaust that doubles as ecosystem analytics — and as supply-chain security signal, which you know well from the recon side).
- **Audacity (2021):** Muse Group added Google Analytics/Yandex telemetry to a beloved offline audio editor; the backlash (and forks) forced a retreat to opt-in, self-hosted error reporting. The canonical "read the room" incident.
- **Terminal/CLI creep:** many modern CLIs (cloud SDKs, Next.js, Nuxt, Angular, Netlify, Homebrew casks…) ship usage telemetry; the `DO_NOT_TRACK=1` convention (consoledonottrack.com) emerged as a cross-tool opt-out that some honor.

---

## 10. Smart TVs and Streaming Devices (ACR)

The most aggressive consumer telemetry per dollar of hardware, and the clearest case of hardware-subsidized-by-surveillance.

**The core technology — ACR (Automatic Content Recognition):** the TV fingerprints whatever is on screen (periodic frame captures and/or audio samples), matches the fingerprints against a server-side content database, and reports what you watched — regardless of source. Research and reporting on capture rates: fingerprint-relevant frame sampling has been reported as often as every ~500ms, with **Samsung uploading roughly every minute and LG roughly every 15 seconds** in the 2024 ACM IMC study ("Watching TV with the Second-Party," Anselmi et al., UCL/UC Davis/UC3M).

**Key findings from that study and related work:**
- ACR runs **even when the TV is used as a dumb HDMI monitor** — it fingerprinted content from consoles/laptops plugged into HDMI (behavior differed by region/config, but it happens).
- Opt-outs exist but are scattered across multiple settings menus with no universal switch; settings have been observed reverting after firmware updates.
- **The business:** viewing data feeds the manufacturers' own ad platforms (Samsung Ads, LG Ad Solutions, Vizio/Inscape, Roku). Vizio's platform/data revenue has exceeded its hardware profit — the TV is a loss-leader for the data business.
- **Regulatory history:** FTC v. Vizio (2017) — Vizio/Inscape tracked second-by-second viewing on 11M TVs without consent and sold it linked to demographics; $2.2M settlement and consent requirements. In February 2026 Samsung settled with the Texas AG over ACR consent (agreeing to explicit consent and clearer controls for Texas residents), with cases against other manufacturers ongoing.

**Streaming sticks/OS layers:** Roku OS (also powering TCL/Hisense/Sharp sets) has its own ACR ("Use info from TV inputs"), advertising identifier, and mic access settings; Fire TV and Google TV report app usage and serve ads as core business.

**Why:** advertising measurement and targeting, content recommendations, and audience analytics that compete with Nielsen. Almost none of it benefits the viewer.

---

## 11. IoT, Smart Home, Cameras, and Voice Assistants

**The structural problem:** most IoT devices are architected cloud-first — the device talks to the vendor's cloud even for local actions (flipping a switch in the same room round-trips through AWS). Telemetry isn't an add-on; it's the plumbing.

**Measurement research (credit: Northeastern/Imperial College "Information Exposure from Consumer IoT Devices," the Mon(IoT)r lab, 81 devices, 2019; and successors):**
- The majority of tested devices contacted third parties beyond their vendor; the most-contacted infrastructure was **AWS**, then Google and Microsoft clouds — meaning three cloud providers can observe activity metadata from most of the world's smart homes.
- Devices exposed activity patterns in traffic *even when encrypted* (traffic analysis reveals when you're home, when motion happens, when you talk).
- Surprise behaviors: a smart doorbell that uploaded a snapshot on every motion event without disclosing it; another that recorded video with no way to disable it, viewable only behind a subscription.

**Cameras and doorbells (Ring as the case study):**
- Collects video/audio, motion events and patterns, pre-roll footage before triggers, ambient light telemetry, plus app-side location and device identifiers.
- End-to-end encryption exists but is **off by default** and disables flagship features (Alexa integration, rich notifications) when enabled — a design that prices privacy in lost functionality.
- Ring's police partnership program (2018–2022, 2,000+ departments with a request pipeline for footage) was scaled back after sustained criticism; emergency disclosure policies remain. The FTC also settled with Ring (2023) over employee/contractor access to customer video.
- The map should show the inference chain: motion sensor → occupancy schedule; lock logs → visitor patterns; the raw telemetry is banal, the *derived* profile is intimate.

**Voice assistants (Echo/Alexa, Google Home/Assistant, Siri/HomePod):**
- Always-listening for a wake word locally; audio after the wake word goes to the cloud (with documented false-trigger leakage). All three vendors faced 2019 scandals over human contractors reviewing voice clips; all added opt-outs afterward. Amazon settled with the FTC (2023) over retaining children's voice recordings. In 2025 Amazon removed the "process locally" option on Echo devices, routing all voice to cloud to power Alexa+ — a live example of telemetry surface expanding by update.
- Interaction logs (every command, timestamped) build household behavioral profiles and feed personalization/ads.
- **Sidewalk/Thread/Matter side-channels:** Amazon Sidewalk quietly opted Echo/Ring devices into sharing a slice of home bandwidth as a neighborhood mesh — device connectivity telemetry at neighborhood scale.

**Everything else:** smart plugs and bulbs report state changes and uptime (mostly benign class-1/2, but pattern-revealing); thermostats (Nest) know occupancy and schedule; robot vacuums *map your house* (iRobot images leaked via contractors in 2022; Amazon's acquisition attempt raised exactly this concern); smart scales/beds/toothbrushes report health-adjacent behavior to consumer-grade clouds.

**Why:** some of it is genuine device health and OTA-update logistics (class 1/3); a lot is engagement analytics and data-network-effects for voice/vision AI training; and a chunk is the subscription business (telemetry proves you need the cloud plan).

---

## 12. Cars

The newest and least-regulated major telemetry platform. Credit: **Mozilla's *Privacy Not Included* car study (2023)** — all 25 brands reviewed failed, the worst product category Mozilla has ever tested.

- **Collection surfaces:** in-cabin microphones and cameras, seat/weight sensors, driving behavior (speed, braking, seatbelt), precise location history, the infotainment system's copy of your phone (contacts, messages, call logs sync when you pair), the companion app, connected services (SiriusXM, Google Maps), and dealer/third-party data feeds.
- **Policy findings:** 84% of reviewed brands say they can share personal data; 76% say they can sell it; several policies list categories like "sexual activity," genetic information, and immigration status (Nissan, Kia — both companies disputed actually collecting these, saying policies mirror CCPA category language). Subaru-style terms deem passengers to have consented by sitting in the car. Hyundai's policy said it complies with "lawful requests, whether formal or informal."
- **Telematics economics:** analysts project car-data monetization in the hundreds of billions by 2030. Documented downstream harms already exist: driving-behavior data sold via brokers (e.g., GM/OnStar "Smart Driver" data reaching LexisNexis and insurers, ending in lawsuits and GM stopping the program in 2024), and location data available to law enforcement and data brokers without warrants.
- **No practical opt-out:** declining connected services often disables Bluetooth, navigation, or warranty-adjacent features; the modem is soldered in.

**Why:** UX features and OTA updates (real), insurance partnerships, advertising, and data resale (the growth business). Cars matter for the map because they fuse *all five telemetry classes* in one node and uniquely capture non-consenting passengers and pedestrians.

---

## 13. Wearables, Routers, and Printers

- **Wearables (Fitbit/Google, Apple Watch, Garmin, Oura, Whoop):** continuous biometrics — heart rate, sleep, location, cycle tracking. Class-2 telemetry with class-4 stakes: health-adjacent consumer data mostly *outside* HIPAA (HIPAA covers providers/insurers, not gadget makers). Google's Fitbit acquisition came with EU commitments not to use Fitbit data for ads (for a period, in the EEA); the structural concern is the identity join, not any single metric.
- **Routers and ISP gear:** ISP-supplied routers report line diagnostics via TR-069/TR-369 management protocols (legit ops telemetry with total visibility as a side effect); consumer mesh brands (eero/Amazon, Nest Wifi/Google, TP-Link cloud) report client-device inventories, usage stats, and DNS-adjacent metadata to vendor clouds. Your router vendor can know every device you own. Meanwhile the ISP itself sees flow metadata regardless — the layer under the layer.
- **Printers:** HP's "smart" ecosystem is the case study — HP+ /Instant Ink printers require accounts and connectivity, report ink levels, page counts, and device analytics, and have shipped firmware that rejects third-party cartridges (Dynamic Security — telemetry-enforced DRM). Also: nearly all color laser printers still embed forensic **tracking dots** (Machine Identification Codes) on every page — analog telemetry, famously used to identify the Reality Winner leak source in 2017. Credit: EFF's long-running documentation of MIC.

---

## 14. Shared Infrastructure: How It All Connects

This is the payoff section — the actual graph structure TELEMETREE should reveal. Individual telemetry streams are trees; the *forest* comes from five joining mechanisms:

### 14.1 Identity joins
The same account spans devices: a Google Account links Android + Chrome + ChromeOS + Nest + Google TV + Fitbit; an Apple ID links iPhone + Mac + Watch + HomePod; a Microsoft Account links Windows + Edge + Office + Xbox + LinkedIn; an Amazon account links Echo + Ring + Fire TV + eero + Sidewalk + your purchase history. **Accounts are the super-nodes.** Any per-device telemetry stream that touches an account inherits the whole identity.

### 14.2 Shared identifiers
Advertising IDs (AAID/IDFA), device serials, IMEIs, MAC addresses, email hashes (the ad industry's favorite join key), and household IP addresses. A smart TV and a phone on the same IP become "one household" in every ad platform's graph — this is how ACR viewing data gets matched to your phone for "did the ad drive a store visit" attribution.

### 14.3 Concentrated cloud infrastructure
Per the IoT measurement literature, most smart-home traffic terminates in AWS, Google Cloud, or Azure. Even when Vendor X doesn't share your data, the *metadata* of your device fleet concentrates in three companies' networks. Similarly: FCM/APNs concentrate all push notifications; Safe Browsing concentrates URL-check metadata; CDNs and certificate infrastructure see everything's exhaust.

### 14.4 SDK monoculture
The same handful of SDKs (Firebase, Meta, Segment, AppsFlyer…) sit inside most popular apps, so "10,000 different apps" collapses into "a few aggregation points." Same pattern in cars (CarPlay/Android Auto, SiriusXM), TVs (Inscape, Samba TV, Roku), and websites (Google Analytics, Meta Pixel).

### 14.5 Data brokers — the offline join
LexisNexis, Experian, Oracle-era ad data, location-data brokers. This layer buys telemetry-derived data (car driving scores, app location pings, TV viewing) and links it to real-world identity, credit, insurance, and — increasingly documented — law-enforcement purchase of data that would otherwise require a warrant.

**The single most important visual for TELEMETREE:** a phone, a TV, a car, and a doorbell — four different vendors — all resolving to one household node through IP + email-hash + ad-ID joins, with class-1 "innocent" crash telemetry and class-4 ad telemetry flowing through *the same* pipes and endpoints.

---

## 15. Graph Model for the TELEMETREE Mind Map

Suggested schema (compatible with a force-directed graph, Cytoscape.js, D3, or a custom WebGL renderer — this is squarely in your wheelhouse):

### Node types
| Type | Examples | Suggested visual |
|---|---|---|
| `device` | Pixel 9, LG C3 TV, Ring Doorbell, Toyota RAV4 | shape by category |
| `os` | Windows 11, GrapheneOS, Fedora, tvOS | ring around device |
| `component` | DiagTrack, Play Services, ACR engine, apport | small satellite |
| `endpoint` | telemetry.microsoft.com, app-measurement.com | cloud glyph |
| `vendor` | Microsoft, Google, Vizio/Inscape, Amazon | large hub |
| `identifier` | AAID, IDFA, IMEI, email-hash, household IP | diamond (join keys!) |
| `data_class` | crash, usage, security, ads, fingerprint | color channel (1–5 from §1) |
| `aggregator` | Firebase, Segment, AppsFlyer, LexisNexis | octagon |
| `governance` | FTC v. Vizio, GDPR/DMA, Fedora FESCo, Go opt-in reversal | shield |

### Edge types
- `emits` (device/component → endpoint), weighted by frequency/volume, colored by data class
- `joins` (identifier → identifier) — the scary edges; render them hot
- `embeds` (app → SDK)
- `owns` (vendor → endpoint/component)
- `sells_to` / `shares_with` (vendor → broker/insurer/LE)
- `resists` (governance → edge it blocks) — show the immune system too
- `optionality` attribute on every `emits` edge: `always-on | opt-out | opt-in | removed-after-backlash`

### Design notes
- The **optionality attribute is the story**. Filter by it and the map transforms: "opt-in only" leaves Linux, GrapheneOS, and Linux phones glowing in an otherwise dark graph.
- Data-class color channels (five classes from §1) let users toggle "show me only ad telemetry" vs "only crash reporting" — instantly separating defensible from extractive.
- Every claim node should carry a `source` field → the References below become clickable provenance. Given the audience this will attract, verifiability is the credibility.

---

## 16. How to Measure Telemetry Yourself

For extending the research (and for a killer "how we know" page on the site):

- **Network capture:** mitmproxy with a trusted CA for TLS interception on devices you control (the Trinity College method — note modern apps increasingly use certificate pinning; Frida/objection for unpinning on Android). Plain `tcpdump`/Wireshark for flow metadata when interception isn't possible.
- **DNS-level observation:** Pi-hole/AdGuard Home or NextDNS logs reveal *which* endpoints every device on the network calls and how often — no interception needed, works on TVs/IoT that you can't instrument. (Several of the TV findings above were reproduced by hobbyists this way.)
- **Router-level:** OpenWrt + `nlbwmon`/netify, or a mirror port into Zeek/Suricata for a proper sensor. Your deadfall/loopwatch instincts translate directly — telemetry mapping is passive recon pointed inward.
- **On-device:** Windows Diagnostic Data Viewer (Microsoft shows you the actual events), Firefox `about:telemetry` (full local ledger), Android: TrackerControl/PCAPdroid (no root, VPN-based capture), `adb logcat` for Firebase event logging in debug mode.
- **Static analysis:** Exodus Privacy (reports embedded trackers per Android APK — excellent existing dataset to credit and link), εxodus standalone scanner for local use.
- **Prior-art datasets to build on (and credit):** Mon(IoT)r lab traffic corpus (Northeastern/Imperial), Exodus Privacy tracker DB, the IoT Inspector project (NYU/Princeton crowdsourced smart-home traffic).

---

## 17. References and Credits

Primary research (the heavy lifters — credit prominently on the site):

- **Douglas J. Leith et al., Trinity College Dublin** — the foundational mobile-OS telemetry measurement series: *Mobile Handset Privacy: Measuring the Data iOS and Android Send to Apple and Google* (2021); *What Data Do the Google Dialer and Messages Apps Send to Google?* (2022); the six-Android-variant study (Samsung/Xiaomi/Huawei/Realme/LineageOS//e/OS); and *Cookies, identifiers and other data that Google silently stores on Android handsets* (2025/26, Computers & Security). Google and Apple disputed aspects of methodology/volume; the traffic captures are the primary evidence.
- **Gianluca Anselmi et al. (UCL / UC Davis / UC3M)** — *Watching TV with the Second-Party: A First Look at Automatic Content Recognition Tracking in Smart TVs*, ACM Internet Measurement Conference 2024. Source for Samsung/LG ACR upload cadence and HDMI-input fingerprinting.
- **Ren, Dubois, Choffnes et al. (Northeastern University / Imperial College London, Mon(IoT)r Lab)** — *Information Exposure From Consumer IoT Devices* (IMC 2019, 81 devices) and successor work. Source for cloud-concentration and undisclosed-capture findings.
- **Mozilla Foundation, *Privacy Not Included*** (Jen Caltrider, Misha Rykov, Zoë MacDonald) — *It's Official: Cars Are the Worst Product Category We Have Ever Reviewed for Privacy* (2023). Source for the 25-brand car findings, 84%-share/76%-sell figures.
- **FTC v. Vizio** (2017) — consent decree documenting second-by-second ACR collection on 11M TVs; **FTC v. Ring** and **FTC v. Amazon/Alexa** (2023) settlements; **Texas AG v. Samsung** ACR settlement (Feb 2026), with related suits ongoing against other TV makers.
- **Microsoft Learn, Windows Privacy documentation** — *Configure Windows diagnostic data in your organization*; *Required/Optional diagnostic data* field-level docs. (Credit where due: the most detailed first-party telemetry documentation in the industry.)
- **Fedora Project Wiki** — *Changes/Telemetry* proposal (2023, withdrawn/obsoleted) and DNF countme design docs; **Ubuntu** ubuntu-report/apport/whoopsie docs and Canonical's 2018 install-metrics reporting; **Debian popcon** documentation.
- **GrapheneOS, CalyxOS, /e/OS project documentation** — respective privacy/network-behavior FAQs (GrapheneOS's docs on default connections are unusually rigorous).
- **Mozilla Glean / Firefox telemetry documentation and probe dictionary** — the transparency benchmark for browser telemetry.
- **EFF** — Machine Identification Code (printer tracking dots) research and the broader surveillance-self-defense corpus.
- **Exodus Privacy** — tracker-in-APK dataset.
- Community reporting consulted: Ars Technica, The Register, The Record, SecurityWeek, Digiday (ACR/ad-tech business context), plus vendor privacy policies read directly.

*Corrections welcome — several claims (Manjaro MDD defaults, current Samsung/LG firmware behavior, Amazon Echo local-processing removal scope) describe moving targets and should be re-verified at build time. Flagged inline where volatility is known.*

---

*Compiled July 2026 as the research foundation for TELEMETREE. Not legal advice; a map, not a manifesto.*
