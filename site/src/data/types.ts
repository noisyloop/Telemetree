// The five telemetry classes defined in README §1. The whole map is colored by
// these, because "class of data" — not "device → vendor" — is the real structure.
export type DataClass = 1 | 2 | 3 | 4 | 5

// How much say the user gets. README §15 calls this "the story": filter by it and
// the map transforms — "opt-in only" leaves Linux and the privacy phones glowing
// in an otherwise dark graph.
export type Optionality =
  | 'always-on'
  | 'opt-out'
  | 'opt-in'
  | 'removed-after-backlash'
  | 'none'
  | 'mixed'

// Node roles roughly follow the graph schema in README §15.
export type NodeKind =
  | 'root'
  | 'concept'
  | 'category'
  | 'vendor'
  | 'device'
  | 'os'
  | 'component'
  | 'governance'

export interface TeleNode {
  id: string
  label: string
  kind: NodeKind
  /** One-line hook shown on the node and at the top of the detail panel. */
  tagline?: string
  /** A short explanatory paragraph. */
  summary?: string
  /** Punchy supporting facts, rendered as a list in the detail panel. */
  details?: string[]
  /** Which of the five classes (README §1) this node's telemetry falls into. */
  dataClasses?: DataClass[]
  /** User control level. */
  optionality?: Optionality
  /** README section this maps back to, e.g. "§5.1". */
  section?: string
  /** Credited sources / primary research, from README §17. */
  sources?: string[]
  children?: TeleNode[]
}

export interface DataClassMeta {
  id: DataClass
  name: string
  what: string
  why: string
  risk: string
  color: string
}

export interface OptionalityMeta {
  id: Optionality
  label: string
  description: string
}
