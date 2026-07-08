import type { TeleNode } from '../data/types'
import { dataClassById, optionalityById } from '../data/meta'

interface Props {
  node: TeleNode | null
  hasChildren: boolean
  expanded: boolean
  onClose: () => void
  onToggle: (id: string) => void
}

const KIND_LABEL: Record<TeleNode['kind'], string> = {
  root: 'Map',
  concept: 'Concept',
  category: 'Category',
  vendor: 'Vendor',
  device: 'Device',
  os: 'Operating system',
  component: 'Component',
  governance: 'Governance',
}

export function DetailPanel({ node, hasChildren, expanded, onClose, onToggle }: Props) {
  return (
    <aside className={`detail-panel ${node ? 'is-open' : ''}`} aria-hidden={!node}>
      {node && (
        <div className="detail-inner" key={node.id}>
          <header className="detail-head">
            <div className="detail-kicker">
              <span className={`detail-kind kind-${node.kind}`}>{KIND_LABEL[node.kind]}</span>
              {node.section && <span className="detail-section">{node.section}</span>}
            </div>
            <button type="button" className="detail-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </header>

          <h2 className="detail-title">{node.label}</h2>
          {node.tagline && <p className="detail-tagline">{node.tagline}</p>}

          {node.summary && <p className="detail-summary">{node.summary}</p>}

          {node.details && node.details.length > 0 && (
            <ul className="detail-list">
              {node.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}

          {node.dataClasses && node.dataClasses.length > 0 && (
            <section className="detail-block">
              <h3 className="detail-block-title">Data classes</h3>
              <ul className="detail-classes">
                {node.dataClasses.map((c) => {
                  const meta = dataClassById(c)
                  return (
                    <li key={c}>
                      <span className="class-swatch" style={{ background: meta.color }}>
                        {c}
                      </span>
                      <span className="class-name">{meta.name}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {node.optionality && (
            <section className="detail-block">
              <h3 className="detail-block-title">User control</h3>
              <p className={`opt-badge opt-${node.optionality}`}>
                {optionalityById(node.optionality).label}
              </p>
              <p className="opt-desc">{optionalityById(node.optionality).description}</p>
            </section>
          )}

          {node.sources && node.sources.length > 0 && (
            <section className="detail-block">
              <h3 className="detail-block-title">Sources</h3>
              <ul className="detail-sources">
                {node.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {hasChildren && (
            <button type="button" className="detail-expand" onClick={() => onToggle(node.id)}>
              {expanded ? 'Collapse branch' : 'Expand branch'}
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
