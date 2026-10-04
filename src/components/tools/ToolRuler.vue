<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'
import { easeInOutCubic, segment } from '@/utils/anim'

/** Zollstock: klappt Glied für Glied auf und vermisst dabei eine Systemarchitektur. */
const DURATION = 7.5
const root = ref<SVGSVGElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: 4 })

const SEG = 58
const COUNT = 5
const ORIGIN = { x: 16, y: 168 }

const unfold = computed(() => {
  const t = time.value
  if (t < 3) return segment(t, 0.3, 3)
  if (t < 5.8) return 1
  return 1 - easeInOutCubic(segment(t, 5.8, 7))
})

/** Glieder als Kette: jedes Gelenk klappt nacheinander von ±176° auf 0° */
const segments = computed(() => {
  const u = unfold.value
  const out: { x: number; y: number; a: number }[] = []
  let x = ORIGIN.x
  let y = ORIGIN.y
  let a = 0
  for (let i = 0; i < COUNT; i++) {
    if (i > 0) {
      const local = easeInOutCubic(Math.min(1, Math.max(0, u * (COUNT - 1) - (i - 1))))
      a += (i % 2 ? 1 : -1) * (1 - local) * 176
    }
    out.push({ x, y, a })
    x += Math.cos((a * Math.PI) / 180) * SEG
    y += Math.sin((a * Math.PI) / 180) * SEG
  }
  return { list: out, tipX: x }
})

/** Mess-Striche pro Glied */
const ticks = Array.from({ length: 11 }, (_, i) => i * (SEG / 10))

const boxes = [
  { x: 18, w: 66, label: 'Client' },
  { x: 120, w: 76, label: 'REST-API' },
  { x: 232, w: 74, label: 'Pricing' },
]

const shown = (bx: number, w: number) => segments.value.tipX > bx + w * 0.7
const allShown = computed(() => segments.value.tipX > 300)
</script>

<template>
  <svg ref="root" class="ruler" viewBox="-4 0 328 200" aria-hidden="true">
    <!-- Architekturskizze -->
    <g class="ruler__plan" :class="{ 'is-done': allShown }">
      <rect x="110" y="26" width="206" height="78" rx="8" class="ruler__cloud" />
      <text x="118" y="40" class="ruler__small">cloud</text>
      <path d="M84 72 H120 M196 72 H232" class="ruler__wire" :class="{ on: shown(232, 74) }" />
      <g v-for="b in boxes" :key="b.label" class="ruler__box" :class="{ on: shown(b.x, b.w) }">
        <rect :x="b.x" y="56" :width="b.w" height="32" rx="6" />
        <text :x="b.x + b.w / 2" y="76" text-anchor="middle">{{ b.label }}</text>
      </g>

      <!-- Bemaßung -->
      <g class="ruler__dim" :class="{ on: allShown }">
        <path d="M18 122 V112 M306 122 V112 M18 117 H306" />
        <path d="M18 117 l7 -3.5 v7 Z M306 117 l-7 -3.5 v7 Z" class="ruler__arrow" />
        <rect x="128" y="109" width="68" height="16" rx="3" />
        <text x="162" y="120.5" text-anchor="middle">2× messen</text>
      </g>
    </g>

    <!-- Zollstock -->
    <g>
      <g v-for="(s, i) in segments.list" :key="i" :transform="`translate(${s.x} ${s.y}) rotate(${s.a})`">
        <rect x="0" y="-7" :width="SEG" height="14" rx="2" class="ruler__seg" />
        <path
          v-for="(tx, k) in ticks"
          :key="k"
          :d="`M${tx} -7 V${k % 5 === 0 ? -1 : -3.5}`"
          class="ruler__tick"
        />
        <text :x="SEG / 2" y="5.5" text-anchor="middle" class="ruler__num">{{ (i + 1) * 10 }}</text>
        <circle cx="0" cy="0" r="2.6" class="ruler__joint" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.ruler {
  width: 100%;
  height: 100%;
}

.ruler__seg {
  fill: #f2c230;
  stroke: #b38a10;
  stroke-width: 0.8;
}

.ruler__tick {
  stroke: #2a2410;
  stroke-width: 0.8;
}

.ruler__num {
  font-family: var(--font-mono);
  font-size: 6.5px;
  font-weight: 700;
  fill: #2a2410;
}

.ruler__joint {
  fill: #8d6c08;
  stroke: #f9e08a;
  stroke-width: 0.8;
}

.ruler__cloud {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1;
  stroke-dasharray: 4 4;
  opacity: 0;
  transition: opacity 0.4s;
}

.ruler__small {
  font-family: var(--font-mono);
  font-size: 8px;
  fill: var(--cyan);
  opacity: 0;
  transition: opacity 0.4s;
}

.is-done .ruler__cloud,
.is-done .ruler__small {
  opacity: 0.8;
}

.ruler__box rect {
  fill: var(--cyan-soft);
  stroke: var(--cyan);
  stroke-width: 1.2;
}

.ruler__box text {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 600;
  fill: var(--text);
}

.ruler__box {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.35s,
    transform 0.45s var(--ease-spring);
}

.ruler__box.on {
  opacity: 1;
  transform: none;
}

.ruler__wire {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1.4;
  stroke-dasharray: 3 3;
  opacity: 0;
  transition: opacity 0.4s;
}

.ruler__wire.on {
  opacity: 1;
}

.ruler__dim {
  opacity: 0;
  transition: opacity 0.4s 0.15s;
}

.ruler__dim.on {
  opacity: 1;
}

.ruler__dim path {
  fill: none;
  stroke: var(--amber);
  stroke-width: 1;
}

.ruler__dim .ruler__arrow {
  fill: var(--amber);
  stroke: none;
}

.ruler__dim rect {
  fill: var(--surface);
  stroke: var(--amber);
  stroke-width: 1;
}

.ruler__dim text {
  font-family: var(--font-mono);
  font-size: 8.5px;
  fill: var(--amber);
}
</style>
