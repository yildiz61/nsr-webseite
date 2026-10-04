import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { prefersReducedMotion } from './usePrefersReducedMotion'

interface LoopOptions {
  /** Länge einer Schleife in Sekunden */
  duration: number
  /** Standbild (Sekunde) bei reduzierter Bewegung */
  still: number
}

/**
 * Zeitgeber für die Werkzeug-Animationen: läuft per requestAnimationFrame
 * nur, solange das Element sichtbar ist, und wiederholt sich endlos.
 * Bei prefers-reduced-motion steht die Zeit auf einem aussagekräftigen Standbild.
 */
export function useLoopTime(target: Ref<HTMLElement | SVGElement | null>, opts: LoopOptions) {
  const reduced = prefersReducedMotion()
  const time = ref(reduced ? opts.still : 0)
  let raf = 0
  let last = 0
  let observer: IntersectionObserver | undefined

  function frame(now: number) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
    last = now
    time.value = (time.value + dt) % opts.duration
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (raf || reduced) return
    last = 0
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  onMounted(() => {
    if (reduced || !target.value) return
    if (!('IntersectionObserver' in window)) {
      start()
      return
    }
    observer = new IntersectionObserver((entries) => (entries.some((e) => e.isIntersecting) ? start() : stop()), {
      threshold: 0.2,
    })
    observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
  })

  return time
}
