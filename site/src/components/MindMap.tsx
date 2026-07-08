import { useEffect, useMemo, useRef } from 'react'
import { computeLayout, linkPath, type PositionedLink } from '../lib/layout'
import { usePanZoom } from '../lib/usePanZoom'
import { TREE } from '../data/tree'
import { NodeCard } from './NodeCard'

const PAD = 140

interface Props {
  expanded: ReadonlySet<string>
  selectedId: string | null
  filterActive: boolean
  matchingIds: ReadonlySet<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  /** bumped by the parent to request a recenter on the root */
  recenterNonce: number
}

export function MindMap({
  expanded,
  selectedId,
  filterActive,
  matchingIds,
  onSelect,
  onToggle,
  recenterNonce,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { transform, animateTo, setImmediate, zoomBy } = usePanZoom(containerRef)
  const didInit = useRef(false)

  const layout = useMemo(() => computeLayout(TREE, expanded), [expanded])

  // Shift everything into positive space with a margin so the SVG canvas and the
  // absolutely-positioned cards share one coordinate system.
  const offX = -layout.minX + PAD
  const offY = -layout.minY + PAD
  const canvasW = layout.width + PAD * 2
  const canvasH = layout.height + PAD * 2

  const nodeById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    for (const n of layout.nodes) m.set(n.data.id, { x: n.x + offX, y: n.y + offY })
    return m
  }, [layout, offX, offY])

  // Scale + translate so the whole current layout fits the viewport, biased a
  // little left so the tree has room to grow rightward.
  const fitView = () => {
    const el = containerRef.current
    if (!el) return null
    const vw = el.clientWidth
    const vh = el.clientHeight
    const k = Math.min(1.05, Math.max(0.3, Math.min(vw / canvasW, vh / canvasH) * 0.94))
    const contentW = canvasW * k
    // Keep the trunk clear of the legend panel (bottom-left) when the tree is
    // narrow; center it once it grows wide enough that clearance is moot.
    const leftClear = vw > 720 ? 300 : 12
    const x =
      contentW < vw - leftClear ? leftClear : Math.min((vw - contentW) / 2, vw * 0.05)
    return { k, x, y: (vh - canvasH * k) / 2 }
  }

  // Fit the first time we have a real viewport size.
  useEffect(() => {
    if (didInit.current) return
    const t = fitView()
    if (!t) return
    setImmediate(t)
    didInit.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  // Recenter button: refit the current layout.
  useEffect(() => {
    if (recenterNonce === 0) return
    const t = fitView()
    if (t) animateTo(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterNonce])

  // Ease the selected node into the left third of the viewport so its subtree
  // has room to open to the right and the detail panel doesn't cover it.
  useEffect(() => {
    if (!selectedId) return
    const el = containerRef.current
    const p = nodeById.get(selectedId)
    if (!el || !p) return
    const k = transform.k
    const targetX = el.clientWidth * 0.3
    const targetY = el.clientHeight * 0.45
    animateTo({ k, x: targetX - p.x * k, y: targetY - p.y * k })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  return (
    <div className="mindmap" ref={containerRef}>
      <div
        className="mindmap-canvas"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
        }}
      >
        <svg
          className="mindmap-links"
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
        >
          {layout.links.map((l) => {
            const shifted: PositionedLink = {
              ...l,
              sourceX: l.sourceX + offX,
              sourceY: l.sourceY + offY,
              targetX: l.targetX + offX,
              targetY: l.targetY + offY,
            }
            return (
              <path
                key={l.id}
                className={`mindmap-link depth-${Math.min(l.depth, 4)}`}
                d={linkPath(shifted)}
              />
            )
          })}
        </svg>

        {layout.nodes.map((n) => (
          <NodeCard
            key={n.data.id}
            node={{ ...n, x: n.x + offX, y: n.y + offY }}
            selected={selectedId === n.data.id}
            dimmed={filterActive && !matchingIds.has(n.data.id)}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="zoom-controls" role="group" aria-label="Zoom">
        <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => zoomBy(0.8)} aria-label="Zoom out">
          −
        </button>
      </div>

      <p className="mindmap-hint" aria-hidden="true">
        drag to pan · scroll to zoom · click a node
      </p>
    </div>
  )
}
