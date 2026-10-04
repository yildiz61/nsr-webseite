<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'
import { clamp01, segment } from '@/utils/anim'

/** Akku-Laubbläser: pustet Bugs und Code Smells vom Code – bis das Quality Gate grün ist. */
const DURATION = 8
const root = ref<SVGSVGElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: 5 })

const lines = [
  { y: 46, w: 120, indent: 0 },
  { y: 64, w: 150, indent: 14 },
  { y: 82, w: 96, indent: 14 },
  { y: 100, w: 132, indent: 28 },
  { y: 118, w: 84, indent: 28 },
  { y: 136, w: 110, indent: 14 },
]

const leaves = [
  { x: 190, y: 42, r: -20, c: '#e2731a', bug: true },
  { x: 248, y: 60, r: 30, c: '#c2410c', bug: false },
  { x: 214, y: 78, r: 70, c: '#f59e0b', bug: true },
  { x: 286, y: 96, r: -40, c: '#b45309', bug: false },
  { x: 238, y: 114, r: 15, c: '#ea580c', bug: true },
  { x: 268, y: 132, r: -65, c: '#d97706', bug: false },
  { x: 302, y: 58, r: 50, c: '#f97316', bug: false },
]

const BLOW_START = 0.8
const BLOW_END = 3.9

const blowing = computed(() => time.value > BLOW_START && time.value < BLOW_END)

function leafStyle(i: number) {
  const l = leaves[i]!
  const t = time.value
  // Wiederkehr am Ende der Schleife: Blätter fallen von oben zurück
  if (t > 6.6) {
    const f = segment(t, 6.6 + i * 0.12, 7.4 + i * 0.12)
    return { transform: `translate(${l.x}px, ${l.y - 60 * (1 - f)}px) rotate(${l.r + (1 - f) * 90}deg)`, opacity: f }
  }
  const s = t - (BLOW_START + 0.25 + (l.x - 180) * 0.006 + i * 0.12)
  if (s <= 0) return { transform: `translate(${l.x}px, ${l.y}px) rotate(${l.r}deg)`, opacity: 1 }
  const x = l.x + 110 * s + 140 * s * s
  const y = l.y - 26 * Math.sin(s * 4 + i) - 30 * s
  return { transform: `translate(${x}px, ${y}px) rotate(${l.r + s * 520}deg)`, opacity: clamp01(1 - (x - 300) / 50) }
}

const remaining = computed(() => leaves.filter((_, i) => leafStyle(i).opacity > 0.5).length)
const passed = computed(() => remaining.value === 0)
</script>

<template>
  <svg ref="root" class="lb" viewBox="0 0 340 200" aria-hidden="true">
    <defs>
      <linearGradient id="lbBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffc04d" />
        <stop offset="1" stop-color="#e08600" />
      </linearGradient>
    </defs>

    <!-- Code -->
    <g>
      <rect x="128" y="30" width="204" height="122" rx="8" class="lb__editor" />
      <g v-for="(l, i) in lines" :key="i">
        <text x="140" :y="l.y + 3" class="lb__ln">{{ i + 1 }}</text>
        <rect :x="158 + l.indent" :y="l.y - 3" :width="Math.min(l.w, 164 - l.indent)" height="6" rx="3" class="lb__line" :class="`c${i % 3}`" />
      </g>
    </g>

    <!-- Luftstrom -->
    <g class="lb__air" :class="{ on: blowing }">
      <path v-for="k in 5" :key="k" :d="`M104 ${86 + k * 6} q 40 ${-8 + k * 3} 90 ${-12 + k * 4} t 120 ${-6 + k}`" :style="{ animationDelay: `${k * -0.13}s` }" />
    </g>

    <!-- Blätter / Bugs -->
    <g v-for="(l, i) in leaves" :key="i" class="lb__leaf" :style="leafStyle(i)">
      <path d="M0 -9 C7 -6 8 4 0 9 C-8 4 -7 -6 0 -9 Z" :fill="l.c" />
      <path d="M0 -8 V8" class="lb__vein" />
      <g v-if="l.bug" class="lb__bug">
        <circle cx="0" cy="1" r="2.4" />
        <path d="M-2.2 -0.5 L-4.2 -1.8 M2.2 -0.5 L4.2 -1.8 M-2.4 2 L-4.4 2.8 M2.4 2 L4.4 2.8" />
      </g>
    </g>

    <!-- Laubbläser -->
    <g transform="translate(14 74)">
    <g class="lb__tool" :class="{ 'is-on': blowing }">
      <!-- Rohr -->
      <path d="M58 22 L104 28 L104 40 L58 38 Z" fill="#2b313c" />
      <rect x="100" y="26" width="6" height="16" rx="1.5" fill="#ffb020" />
      <!-- Gehäuse -->
      <path d="M8 18 Q10 4 30 4 L58 8 Q66 10 66 22 L66 40 Q66 52 52 52 L22 52 Q8 52 8 40 Z" fill="url(#lbBody)" />
      <path d="M22 4 Q30 -16 48 -6 L52 6" fill="none" stroke="#1a1f28" stroke-width="7" stroke-linecap="round" />
      <!-- Akku -->
      <rect x="14" y="52" width="40" height="18" rx="3" fill="#1a1f28" />
      <rect x="20" y="57" width="6" height="8" rx="1" class="lb__cell" />
      <rect x="29" y="57" width="6" height="8" rx="1" class="lb__cell" />
      <rect x="38" y="57" width="6" height="8" rx="1" class="lb__cell" />
      <circle cx="30" cy="28" r="9" fill="#1a1f28" />
      <g class="lb__fan">
        <path d="M30 28 L30 21 M30 28 L36 31 M30 28 L24 31" stroke="#5a6476" stroke-width="2.4" stroke-linecap="round" />
      </g>
    </g>
    </g>

    <!-- Status -->
    <g class="lb__status" :class="{ ok: passed }">
      <rect x="128" y="162" width="204" height="26" rx="6" />
      <text x="230" y="179" text-anchor="middle">
        {{ passed ? '✓ Quality Gate: passed' : `✗ ${remaining} Issues offen` }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.lb {
  width: 100%;
  height: 100%;
}

.lb__editor {
  fill: #0a0d12;
  stroke: var(--line-strong);
  stroke-width: 1;
}

.lb__ln {
  font-family: var(--font-mono);
  font-size: 7px;
  fill: var(--faint);
}

.lb__line.c0 {
  fill: #3b4a63;
}

.lb__line.c1 {
  fill: #2f5560;
}

.lb__line.c2 {
  fill: #4a3f63;
}

.lb__leaf {
  transform-box: view-box;
  transform-origin: 0 0;
}

.lb__vein {
  stroke: rgba(0, 0, 0, 0.35);
  stroke-width: 0.8;
}

.lb__bug circle {
  fill: #1a1f28;
}

.lb__bug path {
  stroke: #1a1f28;
  stroke-width: 0.8;
}

.lb__air path {
  fill: none;
  stroke: rgba(195, 202, 214, 0.5);
  stroke-width: 1.2;
  stroke-dasharray: 10 18;
  opacity: 0;
  transition: opacity 0.3s;
}

.lb__air.on path {
  opacity: 1;
  animation: air 0.45s linear infinite;
}

@keyframes air {
  to {
    stroke-dashoffset: -28;
  }
}

.lb__cell {
  fill: var(--ok);
}

.lb__fan {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.lb__tool.is-on .lb__fan {
  animation: spin 0.18s linear infinite;
}

.lb__tool.is-on {
  animation: rumble 0.12s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rumble {
  50% {
    transform: translate(0.4px, 0.6px);
  }
}

.lb__status rect {
  fill: rgba(255, 93, 93, 0.1);
  stroke: var(--red);
  stroke-width: 1;
  transition:
    fill 0.3s,
    stroke 0.3s;
}

.lb__status text {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  fill: var(--red);
}

.lb__status.ok rect {
  fill: rgba(61, 220, 132, 0.12);
  stroke: var(--ok);
}

.lb__status.ok text {
  fill: var(--ok);
}
</style>
