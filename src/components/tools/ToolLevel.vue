<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'
import { easeInOutCubic, segment } from '@/utils/anim'

/** Wasserwaage: pendelt sich gedämpft ein, bis das ganze Team im Lot ist. */
const DURATION = 7.5
const root = ref<SVGSVGElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: 5 })

const START_TILT = -9

const tilt = computed(() => {
  const t = time.value
  if (t < 0.6) return START_TILT
  if (t > 6.4) return START_TILT * easeInOutCubic(segment(t, 6.4, 7.3))
  const s = t - 0.6
  return START_TILT * Math.exp(-1.15 * s) * Math.cos(3.6 * s)
})

const level = computed(() => Math.abs(tilt.value) < 0.35)
/** Blase wandert zur höheren Seite */
const bubbleX = computed(() => Math.max(-22, Math.min(22, -tilt.value * 3.2)))

const team = [
  { x: -96, c: '#4cc9f0', label: 'dual' },
  { x: -36, c: '#ffb020', label: 'werki' },
  { x: 28, c: '#3ddc84', label: 'trainee' },
  { x: 90, c: '#c792ea', label: 'extern' },
]
</script>

<template>
  <svg ref="root" class="lv" viewBox="0 0 340 200" aria-hidden="true">
    <defs>
      <linearGradient id="lvAlu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d7dce4" />
        <stop offset="0.5" stop-color="#9aa3b2" />
        <stop offset="1" stop-color="#6b7383" />
      </linearGradient>
      <linearGradient id="lvVial" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d9f99d" />
        <stop offset="1" stop-color="#84cc16" />
      </linearGradient>
    </defs>

    <!-- Unterlage -->
    <path d="M24 170 H316" class="lv__ground" />
    <path d="M170 164 L164 176 H176 Z" class="lv__pivot" />

    <g :transform="`translate(170 146) rotate(${tilt})`">
      <!-- Team steht auf der Waage -->
      <g v-for="m in team" :key="m.label" :transform="`translate(${m.x} -18)`" class="lv__member">
        <circle cy="-30" r="8" :fill="m.c" />
        <path d="M-10 0 Q-10 -18 0 -18 Q10 -18 10 0 Z" :fill="m.c" opacity="0.85" />
        <text y="-44" text-anchor="middle">{{ m.label }}</text>
      </g>

      <!-- Wasserwaage -->
      <rect x="-140" y="-18" width="280" height="36" rx="4" fill="url(#lvAlu)" />
      <rect x="-140" y="-18" width="22" height="36" rx="4" class="lv__cap" />
      <rect x="118" y="-18" width="22" height="36" rx="4" class="lv__cap" />
      <path d="M-100 -18 V-10 M-80 -18 V-12 M-60 -18 V-10 M60 -18 V-10 M80 -18 V-12 M100 -18 V-10" class="lv__scale" />

      <!-- Libelle -->
      <rect x="-36" y="-10" width="72" height="20" rx="10" class="lv__frame" />
      <rect x="-32" y="-7" width="64" height="14" rx="7" fill="url(#lvVial)" />
      <path d="M-9 -7 V7 M9 -7 V7" class="lv__mark" :class="{ ok: level }" />
      <ellipse :cx="bubbleX" cy="-1" rx="7.5" ry="4.5" class="lv__bubble" />
    </g>

    <g class="lv__badge" :class="{ on: level && time > 2 }">
      <rect x="112" y="180" width="116" height="18" rx="4" />
      <text x="170" y="192.5" text-anchor="middle">✓ team im lot</text>
    </g>
  </svg>
</template>

<style scoped>
.lv {
  width: 100%;
  height: 100%;
}

.lv__ground {
  stroke: var(--line-strong);
  stroke-width: 1.5;
}

.lv__pivot {
  fill: var(--surface-3);
}

.lv__member text {
  font-family: var(--font-mono);
  font-size: 8px;
  fill: var(--muted);
}

.lv__cap {
  fill: #ffb020;
}

.lv__scale {
  stroke: #3d4553;
  stroke-width: 1;
}

.lv__frame {
  fill: #1a1f28;
}

.lv__mark {
  stroke: #1a1f28;
  stroke-width: 1.4;
  transition: stroke 0.3s;
}

.lv__mark.ok {
  stroke: #15803d;
}

.lv__bubble {
  fill: rgba(255, 255, 255, 0.85);
  stroke: rgba(255, 255, 255, 0.95);
  stroke-width: 0.6;
}

.lv__badge {
  opacity: 0;
  transition: opacity 0.35s;
}

.lv__badge.on {
  opacity: 1;
}

.lv__badge rect {
  fill: rgba(61, 220, 132, 0.12);
  stroke: var(--ok);
  stroke-width: 1;
}

.lv__badge text {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  fill: var(--ok);
}
</style>
