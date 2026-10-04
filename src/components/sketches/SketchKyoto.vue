<script setup lang="ts">
/* Fushimi Inari: Torii-Tunnel in Zentralperspektive */
const VP = { x: 214, y: 150 }
const COUNT = 9

const torii = Array.from({ length: COUNT }, (_, k) => {
  const s = 0.8 ** k
  const half = 118 * s
  const top = VP.y - 90 * s
  const bottom = VP.y + 130 * s
  const pw = 9 * s
  const x0 = VP.x - half
  const x1 = VP.x + half
  const over = 22 * s
  return {
    s,
    // Kasagi (geschwungener Oberbalken)
    kasagi: `M${x0 - over} ${top + 6 * s} Q${VP.x} ${top - 6 * s} ${x1 + over} ${top + 6 * s} L${x1 + over - 4 * s} ${top + 13 * s} Q${VP.x} ${top + 3 * s} ${x0 - over + 4 * s} ${top + 13 * s} Z`,
    // Nuki (unterer Querbalken)
    nuki: `M${x0 - 10 * s} ${top + 30 * s} H${x1 + 10 * s} V${top + 37 * s} H${x0 - 10 * s} Z`,
    // Säulen
    pillars: `M${x0} ${top + 13 * s} V${bottom} M${x0 + pw} ${top + 13 * s} V${bottom} M${x1} ${top + 13 * s} V${bottom} M${x1 - pw} ${top + 13 * s} V${bottom}`,
    feet: `M${x0 - 2 * s} ${bottom} H${x0 + pw + 2 * s} M${x1 + 2 * s} ${bottom} H${x1 - pw - 2 * s}`,
  }
}).reverse()

/* Weg: Fugen laufen zum Fluchtpunkt */
const path = Array.from({ length: 9 }, (_, i) => {
  const x = 40 + i * 44
  return `M${x} 290 L${VP.x + (x - VP.x) * 0.08} ${VP.y + 12}`
}).join(' ')
const steps = Array.from({ length: 7 }, (_, i) => {
  const s = 0.72 ** i
  return `M${VP.x - 170 * s} ${VP.y + 158 * s} H${VP.x + 170 * s}`
}).join(' ')
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <!-- Konstruktion -->
    <path class="cl" stroke-dasharray="4 4" :d="`M0 0 L${VP.x} ${VP.y} M400 0 L${VP.x} ${VP.y} M0 300 L${VP.x} ${VP.y} M400 300 L${VP.x} ${VP.y}`" />
    <path class="dim" :d="`M${VP.x - 6} ${VP.y} h12 M${VP.x} ${VP.y - 6} v12`" />
    <circle class="dim" :cx="VP.x" :cy="VP.y" r="4" />
    <text class="lbl-dim" :x="VP.x + 8" :y="VP.y - 6">FP</text>

    <!-- Weg -->
    <path class="ht" :d="path" />
    <path class="th" :d="steps" />

    <!-- Torii -->
    <g v-for="(t, i) in torii" :key="i">
      <path :class="i > COUNT - 4 ? 'ac' : 'th'" :d="t.kasagi" />
      <path :class="i > COUNT - 4 ? 'ac' : 'th'" :d="t.nuki" />
      <path :class="i > COUNT - 4 ? 'ac' : 'th'" :d="t.pillars" />
      <path class="th" :d="t.feet" />
    </g>
    <path class="fill-ac" :d="torii[COUNT - 1]!.kasagi" />

    <!-- Laternen -->
    <path class="ln" d="M22 236 h18 l-3 8 h-12 Z M25 244 v18 h12 v-18 M29 262 v18 h4 v-18 M20 280 h22" />
    <path class="ht" d="M25 250 h12 M25 256 h12" />

    <!-- Beschriftung -->
    <text class="lbl-big" x="16" y="30">伏見稲荷</text>
    <text x="16" y="46">Fushimi Inari · Kyoto</text>
    <path class="th" d="M344 68 L362 88 H392" />
    <text x="356" y="100">Kasagi</text>
  </svg>
</template>
