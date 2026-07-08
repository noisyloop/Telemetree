import { useCallback, useEffect, useMemo, useState } from 'react'
import { TREE } from './data/tree'
import type { DataClass, Optionality, TeleNode } from './data/types'
import { MindMap } from './components/MindMap'
import { DetailPanel } from './components/DetailPanel'
import { Legend } from './components/Legend'
import { About } from './components/About'

interface Indexed {
  map: Map<string, TeleNode>
  parents: Map<string, string | undefined>
  expandable: string[]
}

function indexTree(root: TeleNode): Indexed {
  const map = new Map<string, TeleNode>()
  const parents = new Map<string, string | undefined>()
  const expandable: string[] = []
  const walk = (n: TeleNode, parent?: string) => {
    map.set(n.id, n)
    parents.set(n.id, parent)
    if (n.children && n.children.length) {
      expandable.push(n.id)
      n.children.forEach((c) => walk(c, n.id))
    }
  }
  walk(root)
  return { map, parents, expandable }
}

export default function App() {
  const { map, parents, expandable } = useMemo(() => indexTree(TREE), [])

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['root']))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeClass, setActiveClass] = useState<DataClass | null>(null)
  const [activeOpt, setActiveOpt] = useState<Optionality | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [legendCollapsed, setLegendCollapsed] = useState(false)
  const [recenterNonce, setRecenterNonce] = useState(0)

  const filterActive = activeClass !== null || activeOpt !== null

  // Ancestors of a node, nearest-first — used to keep the path to a match lit.
  const ancestorsOf = useCallback(
    (id: string): string[] => {
      const out: string[] = []
      let cur = parents.get(id)
      while (cur) {
        out.push(cur)
        cur = parents.get(cur)
      }
      return out
    },
    [parents],
  )

  const matchingIds = useMemo(() => {
    if (!filterActive) return new Set<string>()
    const set = new Set<string>()
    for (const node of map.values()) {
      // A node matches only if it actually carries every active attribute.
      const classOk = activeClass === null || !!node.dataClasses?.includes(activeClass)
      const optOk = activeOpt === null || node.optionality === activeOpt
      if (classOk && optOk) {
        set.add(node.id)
        // Keep the path to a match lit so it reads in context.
        for (const a of ancestorsOf(node.id)) set.add(a)
      }
    }
    return set
  }, [filterActive, activeClass, activeOpt, map, ancestorsOf])

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const select = useCallback(
    (id: string) => {
      setSelectedId(id)
      // Selecting a branch opens it (never collapses from a body click).
      const node = map.get(id)
      if (node?.children?.length) {
        setExpanded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
      }
    },
    [map],
  )

  const expandAll = useCallback(() => setExpanded(new Set(expandable)), [expandable])
  const collapseAll = useCallback(() => setExpanded(new Set(['root'])), [])

  // Applying a filter reveals the whole tree so the lit/dark effect is visible.
  const applyClassFilter = useCallback(
    (c: DataClass | null) => {
      setActiveClass(c)
      if (c !== null || activeOpt !== null) setExpanded(new Set(expandable))
    },
    [activeOpt, expandable],
  )
  const applyOptFilter = useCallback(
    (o: Optionality | null) => {
      setActiveOpt(o)
      if (o !== null || activeClass !== null) setExpanded(new Set(expandable))
    },
    [activeClass, expandable],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (aboutOpen) setAboutOpen(false)
      else if (selectedId) setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen, selectedId])

  const selectedNode = selectedId ? map.get(selectedId) ?? null : null

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div className="brand-text">
            <h1>TELEMETREE</h1>
            <p>A field map of telemetry — what gets collected, why, and how it all connects.</p>
          </div>
        </div>
        <nav className="topbar-actions">
          <button type="button" onClick={expandAll}>Expand all</button>
          <button type="button" onClick={collapseAll}>Collapse</button>
          <button type="button" onClick={() => setRecenterNonce((n) => n + 1)}>Recenter</button>
          <button type="button" className="primary" onClick={() => setAboutOpen(true)}>
            About
          </button>
        </nav>
      </header>

      <main className="stage">
        <MindMap
          expanded={expanded}
          selectedId={selectedId}
          filterActive={filterActive}
          matchingIds={matchingIds}
          onSelect={select}
          onToggle={toggle}
          recenterNonce={recenterNonce}
        />

        <Legend
          activeClass={activeClass}
          activeOpt={activeOpt}
          onClassFilter={applyClassFilter}
          onOptFilter={applyOptFilter}
          collapsed={legendCollapsed}
          onToggleCollapsed={() => setLegendCollapsed((c) => !c)}
        />

        <DetailPanel
          node={selectedNode}
          hasChildren={!!selectedNode?.children?.length}
          expanded={selectedId ? expanded.has(selectedId) : false}
          onClose={() => setSelectedId(null)}
          onToggle={toggle}
        />
      </main>

      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
