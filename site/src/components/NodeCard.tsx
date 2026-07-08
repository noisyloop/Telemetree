import { memo } from 'react'
import type { PositionedNode } from '../lib/layout'
import { dataClassById } from '../data/meta'

interface Props {
  node: PositionedNode
  selected: boolean
  dimmed: boolean
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}

// One card in the tree. Absolutely positioned by its centre point; the parent
// applies the pan/zoom transform. The body selects (opens the detail panel);
// the chevron expands/collapses the subtree.
function NodeCardImpl({ node, selected, dimmed, onSelect, onToggle }: Props) {
  const { data } = node
  const classes = [
    'node-card',
    `kind-${data.kind}`,
    selected ? 'is-selected' : '',
    dimmed ? 'is-dimmed' : '',
    node.hasChildren ? 'has-children' : 'is-leaf',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      data-node-card
      className={classes}
      style={{ left: node.x, top: node.y }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={data.label}
      onClick={() => onSelect(data.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(data.id)
        }
      }}
    >
      <div className="node-card-body">
        <span className="node-label">{data.label}</span>
        {data.tagline && <span className="node-tagline">{data.tagline}</span>}
        {data.dataClasses && data.dataClasses.length > 0 && (
          <span className="node-dots" aria-hidden="true">
            {data.dataClasses.map((c) => (
              <span
                key={c}
                className="node-dot"
                style={{ background: dataClassById(c).color }}
                title={dataClassById(c).name}
              />
            ))}
          </span>
        )}
      </div>

      {node.hasChildren && (
        <button
          type="button"
          className="node-toggle"
          aria-label={node.expanded ? `Collapse ${data.label}` : `Expand ${data.label}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(data.id)
          }}
        >
          {node.expanded ? '−' : '+'}
        </button>
      )}
    </div>
  )
}

export const NodeCard = memo(NodeCardImpl)
