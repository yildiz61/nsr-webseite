import { onBeforeUnmount, onMounted } from 'vue'

type Listener = (scrollY: number) => void

const listeners = new Set<Listener>()
let frame = 0
let attached = false

function flush() {
  frame = 0
  const y = window.scrollY
  listeners.forEach((fn) => fn(y))
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush)
}

function attach() {
  if (attached) return
  attached = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

function detach() {
  if (!attached || listeners.size) return
  attached = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
}

/**
 * Ein gemeinsamer, per requestAnimationFrame gedrosselter Scroll-Takt
 * für alle scrollgetriebenen Animationen (Zahnräder, Hebebühne …).
 */
export function useScrollTicker(fn: Listener) {
  onMounted(() => {
    listeners.add(fn)
    attach()
    fn(window.scrollY)
  })
  onBeforeUnmount(() => {
    listeners.delete(fn)
    detach()
  })
}

/** Anteil (0–1), wie weit ein Element mit Sticky-Bühne durchgescrollt ist. */
export function stickyProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  const travel = rect.height - window.innerHeight
  if (travel <= 0) return rect.top <= 0 ? 1 : 0
  return Math.min(1, Math.max(0, -rect.top / travel))
}
