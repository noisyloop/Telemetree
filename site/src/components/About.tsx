interface Props {
  open: boolean
  onClose: () => void
}

// A short "what is this" overlay — keeps the map itself uncluttered while giving
// first-time visitors the framing and the method note from the README.
export function About({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="about-backdrop" onClick={onClose}>
      <div
        className="about-modal"
        role="dialog"
        aria-modal="true"
        aria-label="About TELEMETREE"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="about-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>About TELEMETREE</h2>
        <p className="about-lead">
          A play on words — <strong>telemetry</strong> plus <strong>tree</strong>. The map
          expands and connects: branches are device categories and ecosystems, and the roots
          (Shared Infrastructure) are where four different vendors quietly resolve to one
          household.
        </p>
        <p>
          Telemetry means <em>remote measurement</em>: a device reporting data about itself back
          to whoever built it. The interesting structure isn&apos;t &ldquo;device → vendor&rdquo;
          — it&apos;s <em>class of data → identifier → aggregation point</em>. Each node is
          colored by which of five data classes it uses, and tagged with how much control you
          actually have.
        </p>
        <div className="about-how">
          <h3>How to read it</h3>
          <ul>
            <li>
              <strong>Click a node</strong> to open its details, data classes, and sources.
            </li>
            <li>
              <strong>Use the +/− toggle</strong> on a branch to expand or collapse it.
            </li>
            <li>
              <strong>Filter by user control</strong> and watch the map transform: dim everything
              that isn&apos;t opt-in and only Linux and the privacy phones stay lit.
            </li>
            <li>
              <strong>Drag to pan, scroll to zoom.</strong>
            </li>
          </ul>
        </div>
        <p className="about-note">
          A research project for learning about telemetry. Everything is sourced from vendor
          documentation, peer-reviewed measurement studies, regulatory actions, and reputable
          reporting. A map, not a manifesto.
        </p>
      </div>
    </div>
  )
}
