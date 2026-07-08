import { DATA_CLASSES, OPTIONALITY } from '../data/meta'
import type { DataClass, Optionality } from '../data/types'

interface Props {
  activeClass: DataClass | null
  activeOpt: Optionality | null
  onClassFilter: (c: DataClass | null) => void
  onOptFilter: (o: Optionality | null) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

// Filter by data class or by optionality. Per README §15, the optionality
// filter "is the story": dim everything that doesn't match and the opt-in-only
// world (Linux, the privacy phones) is what stays lit.
export function Legend({
  activeClass,
  activeOpt,
  onClassFilter,
  onOptFilter,
  collapsed,
  onToggleCollapsed,
}: Props) {
  return (
    <div className={`legend ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="legend-collapse"
        onClick={onToggleCollapsed}
        aria-expanded={!collapsed}
      >
        <span>Legend &amp; filters</span>
        <span className="legend-chevron">{collapsed ? '▸' : '▾'}</span>
      </button>

      {!collapsed && (
        <div className="legend-body">
          <div className="legend-group">
            <h4 className="legend-title">Data class — the kind of data</h4>
            <ul className="legend-list">
              {DATA_CLASSES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`legend-chip ${activeClass === c.id ? 'is-active' : ''}`}
                    onClick={() => onClassFilter(activeClass === c.id ? null : c.id)}
                    title={c.what}
                  >
                    <span className="legend-swatch" style={{ background: c.color }} />
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="legend-group">
            <h4 className="legend-title">User control — the story</h4>
            <ul className="legend-list">
              {OPTIONALITY.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    className={`legend-chip opt ${activeOpt === o.id ? 'is-active' : ''}`}
                    onClick={() => onOptFilter(activeOpt === o.id ? null : o.id)}
                    title={o.description}
                  >
                    <span className={`legend-optdot opt-${o.id}`} />
                    <span>{o.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {(activeClass || activeOpt) && (
            <button
              type="button"
              className="legend-clear"
              onClick={() => {
                onClassFilter(null)
                onOptFilter(null)
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
