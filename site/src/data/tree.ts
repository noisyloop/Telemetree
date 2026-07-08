import type { TeleNode } from './types'

// The TELEMETREE. Structure follows the README's table of contents; leaf content
// is condensed from the research notes. Every claim keeps its section reference
// (§) and, where the README credits primary research, its source.
//
// A play on words: telemetry + tree. The map expands and connects — branches are
// device categories and ecosystems, and the roots (Shared Infrastructure) are
// where four different vendors quietly resolve to one household.

export const TREE: TeleNode = {
  id: 'root',
  label: 'TELEMETREE',
  kind: 'root',
  tagline: 'A field map of telemetry — what gets collected, why, and how it all connects.',
  summary:
    '"Telemetry" means remote measurement: a device reporting data about itself back to whoever built it. This map organizes that ecosystem across operating systems, phones, browsers, dev tools, IoT, TVs, cameras, and cars. Click any branch to expand it; click any node for the details, its data classes, and how much control you actually have.',
  details: [
    'The interesting structure is not "device → vendor". It is class of data → identifier → aggregation point.',
    'Two totally different devices — a TV and a phone — become one node in an ad-tech graph the moment they share an IP address and an identity vendor.',
    'Everything here is sourced from vendor documentation, peer-reviewed measurement studies, regulatory actions, and reputable reporting.',
  ],
  section: '§1',
  children: [
    // ─────────────────────────────────────────────────────────────────────────
    // 1. What telemetry actually is — the five classes
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'taxonomy',
      label: 'What Telemetry Is',
      kind: 'concept',
      tagline: 'Five distinct classes — each with different data, justifications, and risk.',
      summary:
        'Most arguments about telemetry go sideways because people are talking about different points on a spectrum. The map defines five classes; each node is colored by which ones it uses.',
      section: '§1',
      children: [
        {
          id: 'class-1',
          label: 'Crash & Error Reporting',
          kind: 'concept',
          tagline: 'Stack traces and crash dumps — the most defensible class.',
          summary:
            'The state of a program at the moment it died. Developers genuinely cannot fix bugs they cannot see; a crash reporter turns "it broke for someone, somewhere" into an actionable stack trace with frequency counts.',
          details: [
            'Sometimes includes chunks of memory — Microsoft’s own docs note enhanced crash dumps "may contain portions of memory".',
            'Risk: memory contents, file paths (often containing usernames), and URLs leak into dumps.',
          ],
          dataClasses: [1],
          section: '§1.1',
        },
        {
          id: 'class-2',
          label: 'Usage / Product Analytics',
          kind: 'concept',
          tagline: 'Which features get used — the "improving the product" class.',
          summary:
            'Feature clicks, session length, settings changes, funnels. Product teams use it to decide what to build, kill, or redesign. Without it they guess from the loudest forum posters.',
          details: [
            'Risk: individually mundane events aggregate into behavioral profiles.',
            'This is where "improving the product" starts blurring into "understanding the user".',
          ],
          dataClasses: [2],
          section: '§1.2',
        },
        {
          id: 'class-3',
          label: 'Security & Health',
          kind: 'concept',
          tagline: 'Fleet-wide signal that catches mass-exploitation in hours.',
          summary:
            'Malware detections, update success/failure, certificate validation, driver compatibility, exploit signals. How vendors detect new malware families, validate patch rollout, and avoid bricking hardware. Microsoft Defender, Google Safe Browsing, and Apple XProtect all depend on it.',
          details: [
            'Risk: legitimately hard to remove without losing real security value — but the same channels normalize always-on reporting.',
          ],
          dataClasses: [3],
          section: '§1.3',
        },
        {
          id: 'class-4',
          label: 'Engagement & Advertising',
          kind: 'concept',
          tagline: 'Surveillance economics, not diagnostics.',
          summary:
            'Advertising identifiers, content viewed, ads seen, conversion tracking, cross-device linking. This class exists to build audience profiles and prove ad spend worked. It funds "free" services and subsidizes cheap hardware — smart TVs are the canonical example.',
          details: [
            'Vizio has made more from its data/ads platform than from TV hardware margins.',
            'Risk: this is the class most people mean when they say telemetry is creepy.',
          ],
          dataClasses: [4],
          section: '§1.4',
        },
        {
          id: 'class-5',
          label: 'Fingerprinting & Identity',
          kind: 'concept',
          tagline: 'The connective tissue that links every other stream.',
          summary:
            'Hardware serials, IMEIs, MAC addresses, device fingerprints, OS-stored identifiers, IP-derived location. Used for fraud prevention and attestation — and, in practice, for joining all the other classes into one profile per human.',
          details: [
            'Any single telemetry stream is much less dangerous than the identifiers that let streams be linked.',
            'Trinity College Dublin found Google Play Services stores advertising/analytics cookies and device identifiers even when no Google app has ever been opened, with no way to block them.',
          ],
          dataClasses: [5],
          section: '§1.5',
          sources: ['Leith et al., Trinity College Dublin (2025/26)'],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Desktop operating systems
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'desktop',
      label: 'Desktop OS',
      kind: 'category',
      tagline: 'The most heavily instrumented — and most heavily documented — platforms.',
      section: '§3',
      children: [
        {
          id: 'windows',
          label: 'Windows 10/11',
          kind: 'os',
          tagline: 'The most instrumented consumer desktop OS — and the best documented.',
          summary:
            'Microsoft publishes field-level docs for its diagnostic events. Telemetry flows through the Connected User Experiences and Telemetry service (DiagTrack) to Microsoft endpoints over TLS with certificate pinning.',
          details: [
            'Two tiers: Required diagnostic data (device IDs, hardware/OS config, reliability signals — cannot be fully disabled on Home/Pro) and Optional (app usage, inking/typing, enhanced crash dumps that may include memory).',
            'A common header on most events includes OS build/locale and a user ID tied to the Microsoft Account when present.',
            'Related streams: Windows Error Reporting, Edge diagnostics, Defender cloud protection, SmartScreen URL checks, advertising ID, and "Tailored experiences" (diagnostic data reused for tips/ads).',
            'AllowTelemetry=0 is honored fully only on Enterprise/Education. The Home/Pro floor is "Required."',
            'Microsoft estimates ~6 MB/day per device; the Diagnostic Data Viewer lets you inspect it locally.',
            'Mind-map edge: Windows → Microsoft Account → Edge/Bing/Office → LinkedIn/ads ecosystem.',
          ],
          dataClasses: [1, 2, 3, 4, 5],
          optionality: 'always-on',
          section: '§3.1',
          sources: ['Microsoft Learn — Windows Privacy documentation'],
        },
        {
          id: 'macos',
          label: 'macOS',
          kind: 'os',
          tagline: 'Less volume than Windows, but far from silent.',
          summary:
            'Analytics & Improvements is an opt-in prompt at setup (crash logs, usage, Siri improvement). But a layer of infrastructure runs regardless of that toggle.',
          details: [
            'Always-on regardless of the toggle: OCSP/certificate revocation checks, notarization/Gatekeeper checks, XProtect/MRT malware definition updates, Spotlight suggestions, Siri, iCloud sync.',
            'The Nov 2020 OCSP outage revealed macOS was effectively reporting a hash of each developer’s certificate — correlatable with app launches — in cleartext. Apple then encrypted the checks and published a no-IP-logging policy.',
            'Device identifiers and the Apple ID join everything together, same as the Microsoft Account on Windows.',
            'Apple’s business is less ad-dependent than Google’s, but it runs a growing App Store ads business. Leith (2021) found iOS transmits telemetry even when users opt out; Apple disputed the methodology.',
          ],
          dataClasses: [1, 2, 3, 5],
          optionality: 'mixed',
          section: '§3.2',
          sources: ['Leith et al., Trinity College Dublin (2021)'],
        },
        {
          id: 'chromeos',
          label: 'ChromeOS',
          kind: 'os',
          tagline: 'Chrome’s telemetry plus Android-style device management.',
          summary:
            'Usage statistics and crash reports (opt-out), device state reporting for managed devices, sync tied to the Google Account, and Play Services telemetry when Android apps are enabled.',
          details: [
            'The identity join to the Google Account is total by design — a ChromeOS device without one barely functions (Guest mode aside).',
          ],
          dataClasses: [1, 2, 3, 5],
          optionality: 'opt-out',
          section: '§3.3',
        },
        {
          id: 'linux',
          label: 'Linux Distributions',
          kind: 'category',
          tagline: 'Where telemetry is rarest, most transparent, and most fiercely debated.',
          summary:
            'The general rule: community distros collect nothing or opt-in only; corporate-backed distros collect small, documented, mostly-anonymous signals — and get shouted at whenever they try to expand. The interesting nodes are the governance mechanisms that function as an immune system other ecosystems lack.',
          section: '§4',
          children: [
            {
              id: 'ubuntu',
              label: 'Ubuntu',
              kind: 'os',
              tagline: 'The most instrumented mainstream distro — and honest about it.',
              summary:
                'Canonical asks a visible one-time install question and reports crashes, but everything is documented and mostly opt-in.',
              details: [
                'ubuntu-report: the installer question ("send info about this system?") — hardware specs, install options, coarse location, desktop choice. Canonical says ~66% say yes.',
                'apport + whoopsie: crash detection and upload to errors.ubuntu.com. Can be disabled/purged.',
                'popularity-contest (from Debian, opt-in): which packages are installed/used.',
                'snapd necessarily talks to Canonical’s store; the store sees install counts per snap.',
                'Historical scar tissue: the 2012–2016 "Amazon lens" sent local search queries to Canonical/Amazon by default. Removed, but it anchors every Linux telemetry debate since.',
              ],
              dataClasses: [1, 2],
              optionality: 'opt-in',
              section: '§4.1',
              sources: ['Canonical ubuntu-report / apport docs'],
            },
            {
              id: 'debian',
              label: 'Debian',
              kind: 'os',
              tagline: 'No telemetry by default; popcon is strictly opt-in.',
              summary:
                'The only mechanism is popularity-contest (popcon), asked during install and off by default. The Social Contract prioritizes user control — anything phoning home by default would violate community expectations.',
              details: [
                'Baseline that applies to every distro: package updates, NTP, and connectivity checks reveal your IP + distro + rough package set to mirror operators. Not analytics — "infrastructure exhaust".',
              ],
              dataClasses: [2],
              optionality: 'opt-in',
              section: '§4.2',
            },
            {
              id: 'mint',
              label: 'Linux Mint',
              kind: 'os',
              tagline: '"Ubuntu without the corporate bits."',
              summary:
                'No usage telemetry. Mint explicitly markets the absence of it and strips Ubuntu’s reporting components. No Snap by default either.',
              dataClasses: [],
              optionality: 'none',
              section: '§4.3',
            },
            {
              id: 'fedora',
              label: 'Fedora',
              kind: 'os',
              tagline: 'The most instructive case study in community telemetry policing.',
              summary:
                'DNF "countme" is widely considered the good model: a bucketed value (system age, in 4 coarse buckets) on one mirror request per week. No unique IDs. Estimates install counts without tracking anyone.',
              details: [
                'The 2023 telemetry proposal (opt-out, anonymous, aggregate desktop metrics) drew ferocious reaction; FESCo review forced revisions and it was ultimately withdrawn/obsoleted.',
                'Fedora Workstation today ships ABRT crash reporting (user-confirmed) and countme — not behavioral telemetry.',
              ],
              dataClasses: [2],
              optionality: 'removed-after-backlash',
              section: '§4.4',
              sources: ['Fedora Project Wiki — Changes/Telemetry (withdrawn)'],
            },
            {
              id: 'arch',
              label: 'Arch Linux',
              kind: 'os',
              tagline: 'Nothing. The user is the telemetry.',
              summary:
                'No installer survey, no crash reporter, no counters. pkgstats is an explicitly opt-in package you install yourself. Arch’s DIY philosophy means you configure everything, so the project need not guess.',
              dataClasses: [],
              optionality: 'none',
              section: '§4.5',
            },
            {
              id: 'opensuse',
              label: 'openSUSE',
              kind: 'os',
              tagline: 'No behavioral telemetry by default.',
              summary:
                'Crash reporting is manual/user-driven. openSUSE has periodically discussed opt-in metrics; those discussions meet the same resistance as Fedora’s. Package/update traffic to mirrors is the main exhaust.',
              dataClasses: [],
              optionality: 'none',
              section: '§4.6',
            },
            {
              id: 'manjaro',
              label: 'Manjaro',
              kind: 'os',
              tagline: 'A community distro flirting with opt-out telemetry.',
              summary:
                'Historically nothing; more recently added MDD (Manjaro Data Donor) — system metrics with a generated ID — which shipped enabled-by-default in testing and drew pushback over consent. A live, in-flux example.',
              details: ['Verify current default state before publishing — this has been a moving target.'],
              dataClasses: [2, 5],
              optionality: 'mixed',
              section: '§4.7',
            },
            {
              id: 'popos',
              label: 'Pop!_OS',
              kind: 'os',
              tagline: 'No behavioral telemetry; hardware-vendor support tooling instead.',
              summary:
                'System76 collects opt-in data through its hardware support tooling; the distro itself runs no behavioral telemetry. Being a hardware vendor, its story is closer to "device support diagnostics".',
              dataClasses: [1],
              optionality: 'opt-in',
              section: '§4.8',
            },
            {
              id: 'zorin',
              label: 'Zorin OS',
              kind: 'os',
              tagline: 'A tiny anonymous census beacon.',
              summary:
                'Ships a counting ping (no unique ID, per Zorin’s docs) to count active installs, plus standard update traffic. More than Mint, far less than Windows; disclosed in the privacy policy.',
              dataClasses: [2],
              optionality: 'opt-out',
              section: '§4.9',
            },
            {
              id: 'elementary',
              label: 'elementary / Kali / EndeavourOS',
              kind: 'os',
              tagline: 'No OS telemetry.',
              summary:
                'elementary: no OS telemetry (AppCenter sees purchase/install events by necessity). EndeavourOS: nothing (Arch philosophy). Kali: nothing by default — its users would notice immediately, and loudly.',
              dataClasses: [],
              optionality: 'none',
              section: '§4.10',
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Mobile
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'mobile',
      label: 'Mobile',
      kind: 'category',
      tagline: 'The densest telemetry objects most people own.',
      summary:
        'Always on, always networked, saturated with sensors, and carrying an identity.',
      section: '§5',
      children: [
        {
          id: 'android',
          label: 'Android',
          kind: 'os',
          tagline: 'Most telemetry lives in Play Services, not in AOSP.',
          summary:
            'AOSP is open source and relatively quiet. The telemetry lives in Google Play Services — a closed-source, auto-updating privileged layer on nearly every non-Chinese Android phone. Its Clearcut logger and Firebase/Google Analytics are the two main pipes.',
          details: [
            'Telemetry flows even when the user opts out of "Usage & diagnostics," and even with no Google account logged in.',
            'Handset identifiers (IMEI, hardware serial, SIM serial), phone number, and persistent device IDs are transmitted and linkable.',
            'Google Messages sent a hash of SMS text; Google Dialer sent call times/durations — enough to link both ends of a conversation. No opt-out existed until Google changed the apps after the research.',
            'Pre-installed apps (YouTube, Chrome, Clock, Search bar) connect to Google before ever being opened.',
            'OEM double-dip: Samsung, Xiaomi, Huawei run their own parallel telemetry — one phone, two-plus surveillance stacks.',
            'The Advertising ID (AAID) is the cross-app identifier that joins app telemetry into one profile.',
          ],
          dataClasses: [1, 2, 3, 4, 5],
          optionality: 'always-on',
          section: '§5.1',
          sources: ['Leith et al., Trinity College Dublin (2021–2025)'],
        },
        {
          id: 'ios',
          label: 'iOS',
          kind: 'os',
          tagline: 'Comparable variety of data to Android, ~20× less volume.',
          summary:
            'Analytics & Improvements is opt-in at setup. But baseline flows run regardless: Apple ID/iCloud sync, push via APNs (every notification transits Apple), App Store checks, Siri/Spotlight, Safe Browsing lookups, Find My, OCSP-style checks.',
          details: [
            'Leith’s 2021 study found iOS sent Apple IMEI, serial, phone number, and location-adjacent signals — roughly 20× less volume than Android sent Google. Both companies disputed the volume methodology.',
            'App Tracking Transparency (ATT) limits third-party cross-app tracking — a real improvement that simultaneously strengthened Apple’s own first-party ad position. Both are true.',
          ],
          dataClasses: [1, 2, 3, 5],
          optionality: 'mixed',
          section: '§5.2',
          sources: ['Leith et al., Trinity College Dublin (2021)'],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Privacy phones — the control group
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'privacy-phones',
      label: 'Privacy & Linux Phones',
      kind: 'category',
      tagline: 'The control group — what a phone looks like when telemetry is a design constraint.',
      summary:
        'The delta between a Pixel running stock Android and the same Pixel running GrapheneOS is the telemetry economy, made visible. These demonstrate that nearly all mobile telemetry is a business-model choice, not a technical necessity.',
      section: '§6',
      children: [
        {
          id: 'grapheneos',
          label: 'GrapheneOS',
          kind: 'os',
          tagline: 'Zero OS telemetry. Funded by donations, not data.',
          summary:
            'No analytics, no phone-home beyond what is needed to function: anonymous update checks, proxied connectivity checks (configurable/disableable), optional attestation.',
          details: [
            'Sandboxed Google Play is the signature move: Play Services runs as an ordinary unprivileged app, losing privileged access to identifiers and other apps. Per-app network permission can cut any app off entirely.',
            'Pixel-only because it requires hardware security (Titan M2, verified boot with user-enrolled keys).',
          ],
          dataClasses: [3],
          optionality: 'opt-in',
          section: '§6.1',
          sources: ['GrapheneOS project documentation'],
        },
        {
          id: 'calyxos',
          label: 'CalyxOS',
          kind: 'os',
          tagline: 'Zero-telemetry posture aimed at usability.',
          summary:
            'Uses microG (open-source reimplementation of Play APIs) instead of sandboxed Play, plus a built-in firewall and Datura network controls. microG still talks to Google for push (FCM) if enabled — an honest, visible tradeoff.',
          dataClasses: [3],
          optionality: 'opt-in',
          section: '§6.2',
        },
        {
          id: 'eos',
          label: '/e/OS (Murena)',
          kind: 'os',
          tagline: 'De-Googled LineageOS for mainstream users.',
          summary:
            'Replaces Google services with Murena cloud. Leith’s six-variant study measured /e/OS as the quietest Android variant tested — essentially no Google flows. Tradeoff: you trust Murena’s cloud instead.',
          dataClasses: [],
          optionality: 'opt-out',
          section: '§6.3',
          sources: ['Leith et al. six-variant study'],
        },
        {
          id: 'lineageos',
          label: 'LineageOS',
          kind: 'os',
          tagline: 'No analytics by default; built for device longevity.',
          summary:
            'A basic opt-out stats ping for device counts has existed. Not hardened — its purpose is longevity, not anti-telemetry — but it strips Play Services unless you flash them.',
          dataClasses: [2],
          optionality: 'opt-out',
          section: '§6.4',
        },
        {
          id: 'linux-phones',
          label: 'PinePhone / Librem 5',
          kind: 'device',
          tagline: 'Effectively zero telemetry — and the carrier layer still sees you.',
          summary:
            'They run standard desktop-Linux stacks, so no vendor analytics layer exists to phone home. Exhaust is limited to package mirrors, NTP, and apps you install.',
          details: [
            'Librem 5 adds hardware kill switches (modem, Wi-Fi/BT, mic/camera) — telemetry control at the physics layer.',
            'The cellular modem is the unavoidable leak on any phone: baseband + carrier network see your location and identifiers regardless of the OS. The carrier/baseband layer sits below every mobile OS, including the privacy ones.',
          ],
          dataClasses: [5],
          optionality: 'none',
          section: '§6.5',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Browsers
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'browsers',
      label: 'Browsers',
      kind: 'category',
      tagline: 'Both telemetry sources and telemetry enablers — keep those separate.',
      summary:
        'Browsers have their own analytics, and they are also the runtime where web tracking happens.',
      section: '§7',
      children: [
        {
          id: 'chrome',
          label: 'Chrome',
          kind: 'component',
          tagline: 'The delivery vehicle for Google’s ad platform.',
          summary:
            'Usage statistics + crash reports (opt-out), a field-trials framework contacted at startup, Safe Browsing, omnibox suggestions to Google, sync tied to the Google Account.',
          details: [
            'The elephant: the Topics API (replacing third-party cookies) has the browser itself compute ad-targeting signals from your history.',
            'Historically included install/brand identifiers (RLZ on some platforms).',
          ],
          dataClasses: [1, 2, 3, 4],
          optionality: 'opt-out',
          section: '§7',
        },
        {
          id: 'edge',
          label: 'Edge',
          kind: 'component',
          tagline: 'Chromium base plus Microsoft diagnostics.',
          summary:
            'Required/optional tiers mirroring Windows, SmartScreen, and shopping/Bing integrations. In the EEA it is now a separate consent surface from Windows diagnostics (DMA compliance, since March 2024).',
          dataClasses: [1, 2, 3],
          optionality: 'opt-out',
          section: '§7',
        },
        {
          id: 'firefox',
          label: 'Firefox',
          kind: 'component',
          tagline: 'The transparency benchmark for browser telemetry.',
          summary:
            'The Glean pipeline with a publicly documented probe dictionary — you can look up every metric. Opt-out in settings, plus crash reporter, experiments (Nimbus), and daily-use pings.',
          details: [
            'Defaults are on, and sponsored suggestions/new-tab tiles have their own measurement.',
            'Mozilla argues it cannot maintain a competitive browser while blind; the docs-first approach is the model other vendors should be held to.',
          ],
          dataClasses: [1, 2],
          optionality: 'opt-out',
          section: '§7',
          sources: ['Mozilla Glean / Firefox telemetry docs & probe dictionary'],
        },
        {
          id: 'safari',
          label: 'Safari',
          kind: 'component',
          tagline: 'Differential privacy and on-device ad attribution.',
          summary:
            'Differential-privacy-based analytics (opt-in with device analytics), Safe Browsing via proxied Google/Tencent lookups, iCloud sync. Ad attribution via Private Click Measurement — privacy-preserving by design.',
          dataClasses: [1, 2],
          optionality: 'opt-in',
          section: '§7',
        },
        {
          id: 'brave',
          label: 'Brave',
          kind: 'component',
          tagline: '"Collect answers, not users."',
          summary:
            'Blocks third-party trackers by default. Its own telemetry is P3A — privacy-preserving analytics with randomized responses — plus update pings, opt-out and documented.',
          dataClasses: [2],
          optionality: 'opt-out',
          section: '§7',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Apps & third-party SDKs
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'sdks',
      label: 'Apps & Third-Party SDKs',
      kind: 'category',
      tagline: 'The invisible layer: most app telemetry is imported, not written.',
      summary:
        'A developer adds "free analytics" in ten minutes; the SDK vendor gets a panopticon assembled from thousands of apps. A small handful of companies (Google, Meta) sit embedded in the majority of popular apps. The edge type: app → embeds → SDK → reports-to → platform.',
      section: '§8',
      children: [
        {
          id: 'crash-sdks',
          label: 'Crash / Performance SDKs',
          kind: 'component',
          tagline: 'Crashlytics, Sentry, Bugsnag, Datadog RUM.',
          summary:
            'Legitimate class-1 telemetry — but Crashlytics reports to Google’s infrastructure, so thousands of unrelated apps feed one aggregation point.',
          dataClasses: [1],
          section: '§8',
        },
        {
          id: 'analytics-sdks',
          label: 'Analytics SDKs',
          kind: 'component',
          tagline: 'Firebase/GA, Amplitude, Mixpanel, Segment.',
          summary:
            'Segment is a router that fans your events out to dozens of destinations. Class-2 telemetry embedded across the app ecosystem.',
          dataClasses: [2],
          section: '§8',
        },
        {
          id: 'ads-sdks',
          label: 'Ads / Attribution SDKs',
          kind: 'component',
          tagline: 'AppsFlyer, Adjust, Meta SDK, Google Ads SDK.',
          summary:
            'These exist specifically to join app activity to ad identity across apps — class 4/5.',
          dataClasses: [4, 5],
          section: '§8',
        },
        {
          id: 'push',
          label: 'Push Notifications',
          kind: 'component',
          tagline: 'Every push transits the duopoly.',
          summary:
            'Essentially all Android push transits Google (FCM) and all iOS push transits Apple (APNs). Even "private" apps leak notification metadata — and 2023–24 legal disclosures confirmed governments have requested push-notification records from both.',
          dataClasses: [5],
          optionality: 'always-on',
          section: '§8',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Developer tools
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'devtools',
      label: 'Developer Tools',
      kind: 'category',
      tagline: 'Telemetry came for the toolchain too — with instructive fights.',
      section: '§9',
      children: [
        {
          id: 'vscode',
          label: 'VS Code',
          kind: 'component',
          tagline: 'Usage + crash telemetry on by default.',
          summary:
            'Documented events via telemetry.telemetryLevel. VSCodium exists specifically as the telemetry-stripped build.',
          dataClasses: [1, 2],
          optionality: 'opt-out',
          section: '§9',
        },
        {
          id: 'dotnet',
          label: '.NET SDK',
          kind: 'component',
          tagline: 'CLI telemetry on by default — but published back.',
          summary:
            'Disclosed on first run, opt-out via DOTNET_CLI_TELEMETRY_OPTOUT=1. Microsoft publishes the aggregate data — a transparency practice worth crediting.',
          dataClasses: [2],
          optionality: 'opt-out',
          section: '§9',
        },
        {
          id: 'homebrew',
          label: 'Homebrew',
          kind: 'component',
          tagline: 'Community pressure forced a better design, not removal.',
          summary:
            'Switched from Google Analytics to self-hosted, privacy-trimmed analytics (30-day retention, no IPs stored) after pushback. Opt-out via HOMEBREW_NO_ANALYTICS=1.',
          dataClasses: [2],
          optionality: 'opt-out',
          section: '§9',
        },
        {
          id: 'go',
          label: 'Go Toolchain',
          kind: 'component',
          tagline: 'Community flipped opt-out to opt-in.',
          summary:
            'Google proposed opt-out telemetry in 2023; pushback flipped it to opt-in local counters with optional upload. A governance win worth mapping.',
          dataClasses: [2],
          optionality: 'removed-after-backlash',
          section: '§9',
        },
        {
          id: 'registries',
          label: 'npm / pip / cargo',
          kind: 'component',
          tagline: 'Infrastructure exhaust that doubles as ecosystem analytics.',
          summary:
            'Registries see download counts, IPs, and user agents — which also serves as a supply-chain security signal.',
          dataClasses: [2, 3],
          section: '§9',
        },
        {
          id: 'audacity',
          label: 'Audacity (2021)',
          kind: 'governance',
          tagline: 'The canonical "read the room" incident.',
          summary:
            'Muse Group added Google Analytics/Yandex telemetry to a beloved offline audio editor; the backlash and forks forced a retreat to opt-in, self-hosted error reporting.',
          dataClasses: [2],
          optionality: 'removed-after-backlash',
          section: '§9',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Smart TVs
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'tvs',
      label: 'Smart TVs & Streaming',
      kind: 'category',
      tagline: 'The most aggressive consumer telemetry per dollar of hardware.',
      summary:
        'The clearest case of hardware-subsidized-by-surveillance. The core technology is ACR — Automatic Content Recognition — where the TV fingerprints whatever is on screen and reports what you watched, regardless of source.',
      section: '§10',
      children: [
        {
          id: 'acr',
          label: 'ACR Engine',
          kind: 'component',
          tagline: 'Fingerprints whatever is on screen — even a plugged-in console.',
          summary:
            'The TV captures periodic frames and/or audio samples, matches them against a server-side content database, and reports what you watched. Frame sampling has been reported as often as every ~500ms.',
          details: [
            'The 2024 ACM IMC study measured Samsung uploading roughly every minute and LG roughly every 15 seconds.',
            'ACR runs even when the TV is used as a dumb HDMI monitor — it fingerprinted content from consoles/laptops plugged into HDMI.',
            'Opt-outs exist but are scattered across menus with no universal switch; settings have been observed reverting after firmware updates.',
          ],
          dataClasses: [4, 5],
          optionality: 'opt-out',
          section: '§10',
          sources: ['Anselmi et al. (UCL/UC Davis/UC3M), ACM IMC 2024'],
        },
        {
          id: 'vizio',
          label: 'Vizio / Inscape',
          kind: 'vendor',
          tagline: 'The TV is a loss-leader for the data business.',
          summary:
            'Vizio’s platform/data revenue has exceeded its hardware profit. FTC v. Vizio (2017): tracked second-by-second viewing on 11M TVs without consent and sold it linked to demographics — $2.2M settlement and consent requirements.',
          dataClasses: [4, 5],
          optionality: 'opt-out',
          section: '§10',
          sources: ['FTC v. Vizio (2017)'],
        },
        {
          id: 'samsung-lg',
          label: 'Samsung / LG',
          kind: 'vendor',
          tagline: 'Viewing data feeds Samsung Ads and LG Ad Solutions.',
          summary:
            'In February 2026 Samsung settled with the Texas AG over ACR consent (explicit consent and clearer controls for Texas residents), with cases against other manufacturers ongoing.',
          dataClasses: [4, 5],
          optionality: 'opt-out',
          section: '§10',
          sources: ['Texas AG v. Samsung (Feb 2026)'],
        },
        {
          id: 'streaming-os',
          label: 'Roku / Fire TV / Google TV',
          kind: 'vendor',
          tagline: 'Streaming OS layers with their own ACR and ad IDs.',
          summary:
            'Roku OS (also powering TCL/Hisense/Sharp) has its own ACR, advertising identifier, and mic settings. Fire TV and Google TV report app usage and serve ads as core business.',
          dataClasses: [2, 4, 5],
          optionality: 'opt-out',
          section: '§10',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // IoT / smart home
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'iot',
      label: 'IoT & Smart Home',
      kind: 'category',
      tagline: 'Architected cloud-first — telemetry is the plumbing, not an add-on.',
      summary:
        'Most IoT devices talk to the vendor’s cloud even for local actions — flipping a switch in the same room round-trips through AWS. The Mon(IoT)r lab (Northeastern/Imperial, 81 devices, 2019) found the most-contacted infrastructure was AWS, then Google and Microsoft clouds.',
      section: '§11',
      children: [
        {
          id: 'iot-general',
          label: 'The Structural Problem',
          kind: 'concept',
          tagline: 'Three cloud providers can observe most of the world’s smart homes.',
          summary:
            'The majority of tested devices contacted third parties beyond their vendor. Devices exposed activity patterns even when traffic was encrypted — traffic analysis reveals when you are home, when motion happens, when you talk.',
          details: [
            'Surprise behaviors: a smart doorbell that uploaded a snapshot on every motion event without disclosing it; another that recorded video with no way to disable it, viewable only behind a subscription.',
          ],
          dataClasses: [2, 5],
          optionality: 'always-on',
          section: '§11',
          sources: ['Ren, Dubois, Choffnes et al., Mon(IoT)r Lab (IMC 2019)'],
        },
        {
          id: 'ring',
          label: 'Cameras & Doorbells (Ring)',
          kind: 'device',
          tagline: 'The raw telemetry is banal; the derived profile is intimate.',
          summary:
            'Collects video/audio, motion events and patterns, pre-roll footage before triggers, ambient light telemetry, plus app-side location and device identifiers.',
          details: [
            'End-to-end encryption exists but is off by default and disables flagship features (Alexa, rich notifications) when enabled — privacy priced in lost functionality.',
            'Ring’s police partnership program (2,000+ departments) was scaled back after criticism; the FTC settled with Ring (2023) over employee/contractor access to customer video.',
            'Inference chain: motion sensor → occupancy schedule; lock logs → visitor patterns.',
          ],
          dataClasses: [2, 4, 5],
          optionality: 'opt-out',
          section: '§11',
          sources: ['FTC v. Ring (2023)'],
        },
        {
          id: 'voice',
          label: 'Voice Assistants',
          kind: 'device',
          tagline: 'Echo/Alexa, Google Home, Siri/HomePod.',
          summary:
            'Always-listening for a wake word locally; audio after the wake word goes to the cloud, with documented false-trigger leakage. All three vendors faced 2019 scandals over contractors reviewing voice clips.',
          details: [
            'Amazon settled with the FTC (2023) over retaining children’s voice recordings.',
            'In 2025 Amazon removed the "process locally" option on Echo, routing all voice to cloud to power Alexa+ — a live example of telemetry surface expanding by update.',
            'Amazon Sidewalk quietly opted Echo/Ring devices into sharing home bandwidth as a neighborhood mesh.',
          ],
          dataClasses: [2, 4, 5],
          optionality: 'opt-out',
          section: '§11',
          sources: ['FTC v. Amazon/Alexa (2023)'],
        },
        {
          id: 'smart-home-misc',
          label: 'Plugs, Thermostats, Vacuums',
          kind: 'device',
          tagline: 'Nest knows your schedule; robot vacuums map your house.',
          summary:
            'Smart plugs/bulbs report state changes (pattern-revealing); Nest thermostats know occupancy; robot vacuums map your home (iRobot images leaked via contractors in 2022); smart scales/beds/toothbrushes report health-adjacent behavior to consumer clouds.',
          dataClasses: [1, 2, 5],
          optionality: 'mixed',
          section: '§11',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Cars
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'cars',
      label: 'Cars',
      kind: 'device',
      tagline: 'The newest, least-regulated platform — and it fuses all five classes.',
      summary:
        'Per Mozilla’s Privacy Not Included (2023), all 25 brands reviewed failed — the worst product category Mozilla has ever tested. Cars uniquely capture non-consenting passengers and pedestrians.',
      details: [
        'Collection surfaces: in-cabin microphones and cameras, seat/weight sensors, driving behavior, precise location history, the infotainment copy of your paired phone (contacts, messages, call logs), the companion app, connected services, and dealer/third-party feeds.',
        '84% of reviewed brands say they can share personal data; 76% say they can sell it. Several policies list categories like "sexual activity," genetic information, and immigration status.',
        'Documented harm: GM/OnStar "Smart Driver" driving data reached LexisNexis and insurers, ending in lawsuits and GM stopping the program in 2024.',
        'No practical opt-out: declining connected services often disables Bluetooth, navigation, or warranty features; the modem is soldered in.',
      ],
      dataClasses: [1, 2, 3, 4, 5],
      optionality: 'always-on',
      section: '§12',
      sources: ['Mozilla — *Privacy Not Included*, cars (2023)'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Wearables, routers, printers
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'edge-devices',
      label: 'Wearables, Routers & Printers',
      kind: 'category',
      tagline: 'The devices people forget are networked.',
      section: '§13',
      children: [
        {
          id: 'wearables',
          label: 'Wearables',
          kind: 'device',
          tagline: 'Class-2 telemetry with class-4 stakes.',
          summary:
            'Fitbit, Apple Watch, Garmin, Oura, Whoop stream continuous biometrics — heart rate, sleep, location, cycle tracking — mostly outside HIPAA (which covers providers/insurers, not gadget makers).',
          details: [
            'Google’s Fitbit acquisition came with EU commitments not to use Fitbit data for ads (for a period, in the EEA).',
            'The structural concern is the identity join, not any single metric.',
          ],
          dataClasses: [2, 4, 5],
          optionality: 'opt-out',
          section: '§13',
        },
        {
          id: 'routers',
          label: 'Routers & ISP Gear',
          kind: 'device',
          tagline: 'Your router vendor can know every device you own.',
          summary:
            'ISP-supplied routers report line diagnostics via TR-069/TR-369 (legit ops telemetry with total visibility as a side effect). Mesh brands (eero/Amazon, Nest Wifi/Google, TP-Link) report client-device inventories and DNS-adjacent metadata to vendor clouds.',
          details: ['The ISP itself sees flow metadata regardless — the layer under the layer.'],
          dataClasses: [2, 3, 5],
          optionality: 'always-on',
          section: '§13',
        },
        {
          id: 'printers',
          label: 'Printers',
          kind: 'device',
          tagline: 'Telemetry-enforced DRM — and forensic tracking dots.',
          summary:
            'HP+ / Instant Ink printers require accounts and connectivity, report ink levels and page counts, and have shipped firmware that rejects third-party cartridges (Dynamic Security).',
          details: [
            'Nearly all color laser printers embed forensic tracking dots (Machine Identification Codes) on every page — analog telemetry, famously used to identify the Reality Winner leak source in 2017.',
          ],
          dataClasses: [2, 5],
          optionality: 'always-on',
          section: '§13',
          sources: ['EFF — Machine Identification Code research'],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Shared infrastructure — the roots of the tree
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'infrastructure',
      label: 'Shared Infrastructure',
      kind: 'concept',
      tagline: 'The payoff: individual streams are trees; the forest comes from five joins.',
      summary:
        'The single most important visual: a phone, a TV, a car, and a doorbell — four different vendors — all resolving to one household node through IP + email-hash + ad-ID joins, with class-1 "innocent" crash telemetry and class-4 ad telemetry flowing through the same pipes.',
      section: '§14',
      children: [
        {
          id: 'identity-joins',
          label: 'Identity Joins',
          kind: 'concept',
          tagline: 'Accounts are the super-nodes.',
          summary:
            'The same account spans devices: a Google Account links Android + Chrome + ChromeOS + Nest + Google TV + Fitbit; an Apple ID links iPhone + Mac + Watch + HomePod; a Microsoft Account links Windows + Edge + Office + Xbox + LinkedIn; an Amazon account links Echo + Ring + Fire TV + eero + Sidewalk + purchase history.',
          details: ['Any per-device stream that touches an account inherits the whole identity.'],
          dataClasses: [5],
          section: '§14.1',
        },
        {
          id: 'shared-ids',
          label: 'Shared Identifiers',
          kind: 'concept',
          tagline: 'A TV and a phone on one IP become "one household".',
          summary:
            'Advertising IDs (AAID/IDFA), device serials, IMEIs, MAC addresses, email hashes (the ad industry’s favorite join key), and household IP addresses. This is how ACR viewing data gets matched to your phone for "did the ad drive a store visit" attribution.',
          dataClasses: [5],
          section: '§14.2',
        },
        {
          id: 'cloud-concentration',
          label: 'Cloud Concentration',
          kind: 'concept',
          tagline: 'Most smart-home traffic terminates in three companies’ networks.',
          summary:
            'AWS, Google Cloud, or Azure. Even when a vendor does not share your data, the metadata of your device fleet concentrates there. Similarly, FCM/APNs concentrate all push, and Safe Browsing concentrates URL-check metadata.',
          dataClasses: [3, 5],
          section: '§14.3',
        },
        {
          id: 'sdk-monoculture',
          label: 'SDK Monoculture',
          kind: 'concept',
          tagline: '"10,000 different apps" collapses into a few aggregation points.',
          summary:
            'The same handful of SDKs (Firebase, Meta, Segment, AppsFlyer) sit inside most popular apps. Same pattern in cars (CarPlay/Android Auto), TVs (Inscape, Samba TV, Roku), and websites (Google Analytics, Meta Pixel).',
          dataClasses: [2, 4],
          section: '§14.4',
        },
        {
          id: 'data-brokers',
          label: 'Data Brokers',
          kind: 'concept',
          tagline: 'The offline join — where telemetry meets your real-world identity.',
          summary:
            'LexisNexis, Experian, Oracle-era ad data, location-data brokers. This layer buys telemetry-derived data (car driving scores, app location pings, TV viewing) and links it to identity, credit, insurance — and, increasingly documented, law-enforcement purchase of data that would otherwise require a warrant.',
          dataClasses: [4, 5],
          section: '§14.5',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Measure it yourself
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'measure',
      label: 'Measure It Yourself',
      kind: 'concept',
      tagline: 'How we know — and how you can extend the research.',
      summary:
        'Telemetry mapping is passive recon pointed inward. The methods below are how the findings on this map were produced and reproduced.',
      section: '§16',
      children: [
        {
          id: 'network-capture',
          label: 'Network Capture',
          kind: 'concept',
          tagline: 'mitmproxy, tcpdump, Wireshark.',
          summary:
            'TLS interception with a trusted CA on devices you control (the Trinity College method). Modern apps increasingly use certificate pinning — Frida/objection for unpinning on Android. Plain tcpdump/Wireshark for flow metadata when interception is not possible.',
          section: '§16',
        },
        {
          id: 'dns-observation',
          label: 'DNS-Level Observation',
          kind: 'concept',
          tagline: 'Pi-hole, AdGuard Home, NextDNS.',
          summary:
            'Logs reveal which endpoints every device calls and how often — no interception needed, and it works on TVs/IoT you cannot instrument. Several of the TV findings were reproduced by hobbyists this way.',
          section: '§16',
        },
        {
          id: 'on-device',
          label: 'On-Device Tools',
          kind: 'concept',
          tagline: 'The vendors will show you, if you ask.',
          summary:
            'Windows Diagnostic Data Viewer shows the actual events; Firefox about:telemetry is a full local ledger; Android TrackerControl/PCAPdroid capture without root; adb logcat surfaces Firebase events in debug mode.',
          section: '§16',
        },
        {
          id: 'static-analysis',
          label: 'Static Analysis & Datasets',
          kind: 'concept',
          tagline: 'Exodus Privacy, Mon(IoT)r corpus, IoT Inspector.',
          summary:
            'Exodus Privacy reports embedded trackers per Android APK — an existing dataset to build on. Prior-art corpora: the Mon(IoT)r lab traffic set (Northeastern/Imperial) and the IoT Inspector project (NYU/Princeton).',
          section: '§16',
          sources: ['Exodus Privacy tracker DB', 'Mon(IoT)r Lab traffic corpus'],
        },
      ],
    },
  ],
}
