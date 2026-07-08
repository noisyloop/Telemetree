import { useCallback, useEffect, useRef, useState } from 'react'

export interface Transform {
  x: number
  y: number
  k: number
}

const MIN_SCALE = 0.25
const MAX_SCALE = 2.5
const clampScale = (k: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, k))

/**
 * Minimal pan/zoom over a container element: drag to pan, wheel to zoom toward
 * the cursor. No external dependency — keeps the bundle lean and the behavior
 * predictable. Returns a transform plus helpers to animate to a target.
 */
export function usePanZoom(ref: React.RefObject<HTMLElement>) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 })
  const transformRef = useRef(transform)
  transformRef.current = transform

  const animRef = useRef<number | null>(null)

  const cancelAnim = () => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }

  /** Ease to a target transform over ~350ms. */
  const animateTo = useCallback((target: Transform) => {
    cancelAnim()
    const start = { ...transformRef.current }
    const startTime = performance.now()
    const duration = 380
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const e = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setTransform({
        x: start.x + (target.x - start.x) * e,
        y: start.y + (target.y - start.y) * e,
        k: start.k + (target.k - start.k) * e,
      })
      if (t < 1) animRef.current = requestAnimationFrame(step)
      else animRef.current = null
    }
    animRef.current = requestAnimationFrame(step)
  }, [])

  const setImmediate = useCallback((target: Transform) => {
    cancelAnim()
    setTransform(target)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let dragging = false
    let lastX = 0
    let lastY = 0
    let moved = false

    const onPointerDown = (e: PointerEvent) => {
      // Ignore drags that start on interactive node cards; those handle clicks.
      if ((e.target as HTMLElement).closest('[data-node-card]')) return
      cancelAnim()
      dragging = true
      moved = false
      lastX = e.clientX
      lastY = e.clientY
      el.setPointerCapture(e.pointerId)
      el.classList.add('is-panning')
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true
      lastX = e.clientX
      lastY = e.clientY
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }))
    }
    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      el.releasePointerCapture?.(e.pointerId)
      el.classList.remove('is-panning')
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnim()
      const rect = el.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      setTransform((t) => {
        const factor = Math.exp(-e.deltaY * 0.0015)
        const k = clampScale(t.k * factor)
        const scaleChange = k / t.k
        // Zoom toward the cursor: keep the point under the pointer fixed.
        return {
          k,
          x: px - (px - t.x) * scaleChange,
          y: py - (py - t.y) * scaleChange,
        }
      })
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('wheel', onWheel, { passive: false })

    // Expose "was it a real drag" so callers can suppress click-through.
    ;(el as unknown as { __didPan?: () => boolean }).__didPan = () => moved

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [ref])

  useEffect(() => cancelAnim, [])

  const zoomBy = useCallback((factor: number) => {
    const el = ref.current
    const t = transformRef.current
    const cx = el ? el.clientWidth / 2 : 0
    const cy = el ? el.clientHeight / 2 : 0
    const k = clampScale(t.k * factor)
    const scaleChange = k / t.k
    animateTo({ k, x: cx - (cx - t.x) * scaleChange, y: cy - (cy - t.y) * scaleChange })
  }, [ref, animateTo])

  return { transform, setImmediate, animateTo, zoomBy }
}
