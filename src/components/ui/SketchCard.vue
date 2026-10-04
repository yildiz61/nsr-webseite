<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

/**
 * Zeichenblatt im Blaupausen-Stil mit Schriftfeld.
 * Beim Hineinscrollen „plottet“ sich die Skizze Strich für Strich.
 */
defineProps<{
  sheet: string
  title: string
  caption: string
  scale?: string
}>()

const root = ref<HTMLElement | null>(null)
const drawn = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const el = root.value
  if (!el) return
  const shapes = el.querySelectorAll<SVGGeometryElement>('.sketch__art :is(path, line, polyline, polygon, circle, ellipse, rect)')
  shapes.forEach((s, i) => {
    s.setAttribute('pathLength', '1')
    s.style.setProperty('--d', `${Math.min(i * 12, 1400)}ms`)
  })
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    drawn.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        drawn.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <figure ref="root" class="sketch" :class="{ 'is-drawn': drawn }">
    <div class="sketch__paper">
      <div class="sketch__art">
        <slot />
      </div>
    </div>
    <figcaption class="sketch__block">
      <div class="sketch__cell sketch__cell--sheet">
        <span>Blatt</span>
        <strong>{{ sheet }}</strong>
      </div>
      <div class="sketch__cell sketch__cell--title">
        <span>Titel</span>
        <strong>{{ title }}</strong>
      </div>
      <div class="sketch__cell sketch__cell--scale">
        <span>Maßstab</span>
        <strong>{{ scale ?? 'o. M.' }}</strong>
      </div>
      <p class="sketch__caption">{{ caption }}</p>
    </figcaption>
  </figure>
</template>

<style scoped>
.sketch {
  margin: 0;
  display: flex;
  flex-direction: column;
  border-radius: var(--r);
  background: #0c1e33;
  box-shadow:
    inset 0 0 0 1px rgba(150, 200, 255, 0.18),
    var(--shadow);
  overflow: hidden;
  transition: transform 0.4s var(--ease-out);
}

.sketch:hover {
  transform: translateY(-4px) rotate(-0.4deg);
}

.sketch__paper {
  position: relative;
  margin: 10px 10px 0;
  border: 1px solid rgba(190, 225, 255, 0.35);
  background-color: #0e2440;
  background-image:
    linear-gradient(rgba(190, 225, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(190, 225, 255, 0.07) 1px, transparent 1px),
    radial-gradient(120% 90% at 30% 20%, rgba(255, 255, 255, 0.05), transparent 60%);
  background-size:
    20px 20px,
    20px 20px,
    100% 100%;
}

.sketch__art :deep(svg) {
  width: 100%;
  height: auto;
}

/* Linienstile der Skizzen */
.sketch__art :deep(.ln),
.sketch__art :deep(.th),
.sketch__art :deep(.ac),
.sketch__art :deep(.dim),
.sketch__art :deep(.cl),
.sketch__art :deep(.ht) {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sketch__art :deep(.ln) {
  stroke: #d8ecff;
  stroke-width: 1.3;
}

.sketch__art :deep(.th) {
  stroke: rgba(216, 236, 255, 0.55);
  stroke-width: 0.7;
}

.sketch__art :deep(.ht) {
  stroke: rgba(216, 236, 255, 0.28);
  stroke-width: 0.6;
}

.sketch__art :deep(.ac) {
  stroke: #ffb020;
  stroke-width: 1.5;
}

.sketch__art :deep(.dim) {
  stroke: #7fd3f5;
  stroke-width: 0.7;
}

.sketch__art :deep(.cl) {
  stroke: rgba(127, 211, 245, 0.6);
  stroke-width: 0.6;
}

.sketch__art :deep(.fill-ac) {
  fill: rgba(255, 176, 32, 0.18);
  stroke: none;
}

.sketch__art :deep(.dot) {
  fill: #d8ecff;
  stroke: none;
}

.sketch__art :deep(text) {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: #b9dcff;
  stroke: none;
}

.sketch__art :deep(text.lbl-ac) {
  fill: #ffb020;
}

.sketch__art :deep(text.lbl-dim) {
  font-size: 8px;
  fill: #7fd3f5;
}

.sketch__art :deep(text.lbl-big) {
  font-size: 13px;
  fill: #e6f3ff;
}

/* Plotter-Effekt */
.sketch__art :deep(:is(path, line, polyline, polygon, circle, ellipse, rect):not(.dot):not(.fill-ac)) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.1s cubic-bezier(0.45, 0, 0.2, 1) var(--d, 0ms);
}

.sketch__art :deep(.dot),
.sketch__art :deep(.fill-ac),
.sketch__art :deep(text) {
  opacity: 0;
  transition: opacity 0.6s ease calc(var(--d, 0ms) + 900ms);
}

.sketch__art :deep(text) {
  transition-delay: 1.5s;
}

.is-drawn .sketch__art :deep(:is(path, line, polyline, polygon, circle, ellipse, rect):not(.dot):not(.fill-ac)) {
  stroke-dashoffset: 0;
}

.is-drawn .sketch__art :deep(.dot),
.is-drawn .sketch__art :deep(.fill-ac),
.is-drawn .sketch__art :deep(text) {
  opacity: 1;
}

/* Schriftfeld */
.sketch__block {
  display: grid;
  grid-template-columns: auto 1fr auto;
  margin: 0 10px 10px;
  border: 1px solid rgba(190, 225, 255, 0.35);
  border-top: 0;
  font-family: var(--font-mono);
}

.sketch__cell {
  display: grid;
  gap: 1px;
  padding: 6px 10px;
  border-right: 1px solid rgba(190, 225, 255, 0.25);
}

.sketch__cell:last-of-type {
  border-right: 0;
}

.sketch__cell span {
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(185, 220, 255, 0.55);
}

.sketch__cell strong {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e6f3ff;
}

.sketch__cell--sheet strong {
  color: var(--amber);
}

.sketch__caption {
  grid-column: 1 / -1;
  padding: 8px 10px 10px;
  border-top: 1px solid rgba(190, 225, 255, 0.25);
  font-family: var(--font-body);
  font-size: 0.86rem;
  line-height: 1.5;
  color: #a9c6e3;
}
</style>
