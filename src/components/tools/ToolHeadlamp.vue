<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'
import { easeInOutCubic, lerp, seeded, segment } from '@/utils/anim'

/** Stirnlampe: leuchtet in eine dunkle Punktwolke, findet das Muster und zeichnet die Prognose. */
const DURATION = 8.6
const root = ref<SVGSVGElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: 6.5 })

const LAMP = { x: 44, y: 40 }
const HALF = 0.2
const A_START = 1.45
const A_END = 0.06

const rnd = seeded(7)
const points = Array.from({ length: 34 }, (_, i) => {
  const x = 74 + i * 5.4 + rnd() * 3
  const y = 160 - (x - 74) * 0.36 + Math.sin(i * 0.9) * 8 + (rnd() - 0.5) * 18
  return { x, y, a: Math.atan2(y - LAMP.y, x - LAMP.x) }
})

/* Lineare Regression für Trend & Prognose */
const n = points.length
const mx = points.reduce((s, p) => s + p.x, 0) / n
const my = points.reduce((s, p) => s + p.y, 0) / n
const slope = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / points.reduce((s, p) => s + (p.x - mx) ** 2, 0)
const fy = (x: number) => my + slope * (x - mx)
const X_LAST = points[n - 1]!.x
const trend = `M74 ${fy(74)} L${X_LAST} ${fy(X_LAST)}`
const forecast = `M${X_LAST} ${fy(X_LAST)} L314 ${fy(314)}`
const cone = `M${X_LAST} ${fy(X_LAST)} L314 ${fy(314) - 16} L314 ${fy(314) + 16} Z`

const angle = computed(() => {
  const t = time.value
  if (t > 7.6) return lerp(A_END, A_START, easeInOutCubic(segment(t, 7.6, 8.5)))
  return lerp(A_START, A_END, easeInOutCubic(segment(t, 0.4, 3.6)))
})
const resetting = computed(() => time.value > 7.6)

function state(a: number) {
  if (Math.abs(a - angle.value) < HALF * 0.8) return 'lit'
  if (!resetting.value && a > angle.value) return 'found'
  return 'dark'
}

const beam = computed(() => {
  const a = angle.value
  const L = 340
  return `M${LAMP.x} ${LAMP.y} L${LAMP.x + Math.cos(a - HALF) * L} ${LAMP.y + Math.sin(a - HALF) * L} L${LAMP.x + Math.cos(a + HALF) * L} ${LAMP.y + Math.sin(a + HALF) * L} Z`
})

const reveal = computed(() => (resetting.value ? 0 : segment(time.value, 3.7, 5.6)))
const clipW = computed(() => 60 + reveal.value * 260)
</script>

<template>
  <svg ref="root" class="hl" viewBox="0 0 340 200" aria-hidden="true">
    <defs>
      <radialGradient id="hlBeam" gradientUnits="userSpaceOnUse" :cx="LAMP.x" :cy="LAMP.y" r="320">
        <stop offset="0" stop-color="#fff2c4" stop-opacity="0.75" />
        <stop offset="0.5" stop-color="#ffb020" stop-opacity="0.18" />
        <stop offset="1" stop-color="#ffb020" stop-opacity="0" />
      </radialGradient>
      <clipPath id="hlClip">
        <rect x="0" y="0" :width="clipW" height="200" />
      </clipPath>
    </defs>

    <!-- Achsen -->
    <path d="M64 30 V174 H322" class="hl__axis" />
    <text x="322" y="188" text-anchor="end" class="hl__label">zeit →</text>
    <text x="70" y="30" class="hl__label">transaktionen</text>

    <!-- Lichtkegel -->
    <path :d="beam" fill="url(#hlBeam)" class="hl__beam" />

    <!-- Datenpunkte -->
    <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="2.6" class="hl__pt" :class="state(p.a)" />

    <!-- Trend & Prognose -->
    <g clip-path="url(#hlClip)">
      <path :d="cone" class="hl__cone" />
      <path :d="trend" class="hl__trend" />
      <path :d="forecast" class="hl__forecast" />
    </g>
    <g class="hl__tag" :class="{ on: reveal >= 1 }">
      <rect x="244" :y="fy(314) - 42" width="70" height="18" rx="4" />
      <text x="279" :y="fy(314) - 29.5" text-anchor="middle">prognose</text>
    </g>

    <!-- Kopf mit Stirnlampe -->
    <g>
      <circle cx="30" cy="50" r="15" class="hl__head" />
      <path d="M15.5 45 Q30 38 44.5 45" class="hl__strap" />
      <rect x="37" y="34" width="12" height="11" rx="3" class="hl__lamp" transform="rotate(25 43 40)" />
      <circle :cx="LAMP.x + 1" :cy="LAMP.y + 1" r="3.2" class="hl__bulb" />
    </g>
  </svg>
</template>

<style scoped>
.hl {
  width: 100%;
  height: 100%;
}

.hl__axis {
  fill: none;
  stroke: var(--line-strong);
  stroke-width: 1;
}

.hl__label {
  font-family: var(--font-mono);
  font-size: 8px;
  fill: var(--faint);
}

.hl__beam {
  mix-blend-mode: screen;
}

.hl__pt {
  fill: #2a3240;
  transition:
    fill 0.35s,
    r 0.35s;
}

.hl__pt.found {
  fill: var(--cyan);
}

.hl__pt.lit {
  fill: #fff2c4;
  r: 3.4;
}

.hl__trend {
  fill: none;
  stroke: var(--amber);
  stroke-width: 2.2;
  stroke-linecap: round;
}

.hl__forecast {
  fill: none;
  stroke: var(--amber);
  stroke-width: 2.2;
  stroke-dasharray: 5 5;
}

.hl__cone {
  fill: var(--amber);
  opacity: 0.14;
}

.hl__tag {
  opacity: 0;
  transition: opacity 0.4s;
}

.hl__tag.on {
  opacity: 1;
}

.hl__tag rect {
  fill: var(--surface);
  stroke: var(--amber);
  stroke-width: 1;
}

.hl__tag text {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--amber);
}

.hl__head {
  fill: #2b313c;
  stroke: #3d4553;
  stroke-width: 1;
}

.hl__strap {
  fill: none;
  stroke: var(--amber);
  stroke-width: 3.5;
  stroke-linecap: round;
}

.hl__lamp {
  fill: #1a1f28;
  stroke: var(--amber);
  stroke-width: 1.2;
}

.hl__bulb {
  fill: #fff6d8;
  filter: drop-shadow(0 0 4px #ffd45c);
}
</style>
