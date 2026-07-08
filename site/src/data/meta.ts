import type { DataClass, DataClassMeta, OptionalityMeta } from './types'

// Colours are the "data-class color channel" from README §15 — a five-step
// scale from defensible (crash) to extractive (ads / fingerprinting).
export const DATA_CLASSES: DataClassMeta[] = [
  {
    id: 1,
    name: 'Crash & error reporting',
    what: 'Stack traces, crash dumps, the state of the program at the moment it died — sometimes chunks of memory.',
    why: 'Developers cannot fix bugs they cannot see. A crash reporter turns "it broke for someone, somewhere" into an actionable, frequency-ranked stack trace.',
    risk: 'Memory contents, file paths (often with usernames), and URLs leak into dumps. Generally the most defensible class.',
    color: '#4ade80',
  },
  {
    id: 2,
    name: 'Usage / product analytics',
    what: 'Which features get clicked, session length, which settings people change, funnels.',
    why: 'Product teams decide what to build, kill, or redesign — instead of guessing from the loudest forum posters.',
    risk: 'Individually mundane events aggregate into behavioral profiles. Where "improving the product" blurs into "understanding the user."',
    color: '#38bdf8',
  },
  {
    id: 3,
    name: 'Security & health telemetry',
    what: 'Malware detections, update success/failure, certificate validation, driver compatibility, exploit signals.',
    why: 'How vendors detect mass-exploitation within hours, validate that a patch rolled out, and avoid bricking specific hardware.',
    risk: 'Legitimately hard to remove without losing real security value — but the same channels normalize always-on reporting.',
    color: '#a78bfa',
  },
  {
    id: 4,
    name: 'Engagement & advertising',
    what: 'Ad identifiers (AAID/IDFA), content viewed, ads seen, conversion tracking, cross-device linking.',
    why: 'Money. Builds audience profiles and proves ad spend worked. Funds "free" services and subsidizes cheap hardware.',
    risk: 'This is surveillance economics, not diagnostics — the class most people mean when they say telemetry is creepy.',
    color: '#fb923c',
  },
  {
    id: 5,
    name: 'Fingerprinting & identity',
    what: 'Hardware serials, IMEIs, MAC addresses, device fingerprints, OS-stored identifiers, IP-derived location.',
    why: 'Fraud prevention, license enforcement, attestation — and, in practice, joining every other stream into one profile per human.',
    risk: 'The connective tissue. Any single stream is far less dangerous than the identifiers that let streams be linked.',
    color: '#f87171',
  },
]

export const OPTIONALITY: OptionalityMeta[] = [
  {
    id: 'opt-in',
    label: 'Opt-in',
    description: 'Off by default; the user must actively choose to share. The rarest and most respectful design.',
  },
  {
    id: 'opt-out',
    label: 'Opt-out',
    description: 'On by default; the user can turn it off if they find the setting.',
  },
  {
    id: 'always-on',
    label: 'Always-on',
    description: 'Cannot be fully disabled on consumer editions. A required floor.',
  },
  {
    id: 'removed-after-backlash',
    label: 'Removed after backlash',
    description: 'Shipped, met community resistance, and was withdrawn or flipped to opt-in — the immune system working.',
  },
  {
    id: 'none',
    label: 'None',
    description: 'No behavioral telemetry. Only infrastructure exhaust (mirrors, NTP) leaves the machine.',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    description: 'Multiple streams with different controls — some opt-in, some always-on.',
  },
]

export const dataClassById = (id: DataClass) => DATA_CLASSES.find((c) => c.id === id)!
export const optionalityById = (id: OptionalityMeta['id']) =>
  OPTIONALITY.find((o) => o.id === id)!
