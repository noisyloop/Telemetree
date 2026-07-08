import { hierarchy, tree } from 'd3-hierarchy'
import type { TeleNode } from '../data/types'

export interface PositionedNode {
  data: TeleNode
  /** horizontal centre, px */
  x: number
  /** vertical centre, px */
  y: number
  depth: number
  hasChildren: boolean
  expanded: boolean
}

export interface PositionedLink {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  /** depth of the child node — used to fade deeper links */
  depth: number
}

export interface Layout {
  nodes: PositionedNode[]
  links: PositionedLink[]
  width: number
  height: number
  minX: number
  minY: number
}

// Vertical separation between sibling rows and horizontal step between depths.
const ROW_GAP = 104
const DEPTH_GAP = 300

/**
 * A classic left-to-right collapsible tree. `expanded` decides which subtrees
 * are visible: a node's children are laid out only if its id is in the set.
 * d3's tree() gives x (cross-axis) and y (depth-axis); we swap them so the tree
 * grows rightward, like a mind map branching from its trunk.
 */
export function computeLayout(root: TeleNode, expanded: ReadonlySet<string>): Layout {
  const h = hierarchy<TeleNode>(root, (n) =>
    expanded.has(n.id) ? n.children ?? null : null,
  )

  const layout = tree<TeleNode>()
    .nodeSize([ROW_GAP, DEPTH_GAP])
    // Give a little extra room between subtrees of different parents so branches
    // read as distinct clusters.
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.4))

  layout(h)

  const nodes: PositionedNode[] = h.descendants().map((d) => ({
    data: d.data,
    x: d.y ?? 0, // horizontal = depth
    y: d.x ?? 0, // vertical = cross-axis
    depth: d.depth,
    hasChildren: !!(d.data.children && d.data.children.length),
    expanded: expanded.has(d.data.id),
  }))

  const links: PositionedLink[] = h.links().map((l) => ({
    id: `${l.source.data.id}->${l.target.data.id}`,
    sourceX: l.source.y ?? 0,
    sourceY: l.source.x ?? 0,
    targetX: l.target.y ?? 0,
    targetY: l.target.x ?? 0,
    depth: l.target.depth,
  }))

  const xs = nodes.map((n) => n.x)
  const ys = nodes.map((n) => n.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    nodes,
    links,
    width: maxX - minX,
    height: maxY - minY,
    minX,
    minY,
  }
}

/** A smooth horizontal cubic path between two points. */
export function linkPath(l: PositionedLink): string {
  const midX = (l.sourceX + l.targetX) / 2
  return `M${l.sourceX},${l.sourceY} C${midX},${l.sourceY} ${midX},${l.targetY} ${l.targetX},${l.targetY}`
}
