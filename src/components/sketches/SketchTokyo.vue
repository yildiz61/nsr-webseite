<script setup lang="ts">
import { seeded } from '@/utils/anim'

/* Tokyo Tower: Beine als quadratische Bézierkurven, Fachwerk wird daraus berechnet */
type P = { x: number; y: number }
const bez = (a: P, c: P, b: P, t: number): P => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
})
const L = { a: { x: 146, y: 262 }, c: { x: 182, y: 170 }, b: { x: 194, y: 92 } }
const R = { a: { x: 254, y: 262 }, c: { x: 218, y: 170 }, b: { x: 206, y: 92 } }
const legL = `M${L.a.x} ${L.a.y} Q${L.c.x} ${L.c.y} ${L.b.x} ${L.b.y}`
const legR = `M${R.a.x} ${R.a.y} Q${R.c.x} ${R.c.y} ${R.b.x} ${R.b.y}`
const innerL = 'M160 262 Q188 176 196 92'
const innerR = 'M240 262 Q212 176 204 92'

const STEPS = 14
const lattice: string[] = []
for (let i = 0; i < STEPS; i++) {
  const t0 = i / STEPS
  const t1 = (i + 1) / STEPS
  const l0 = bez(L.a, L.c, L.b, t0)
  const l1 = bez(L.a, L.c, L.b, t1)
  const r0 = bez(R.a, R.c, R.b, t0)
  const r1 = bez(R.a, R.c, R.b, t1)
  if (l0.y > 236) continue // Bogen unten frei lassen
  lattice.push(`M${l0.x} ${l0.y} L${r1.x} ${r1.y} M${r0.x} ${r0.y} L${l1.x} ${l1.y} M${l0.x} ${l0.y} H${r0.x}`)
}

/* Skyline */
const rnd = seeded(11)
const buildings = [
  { x: 22, w: 34, h: 70 },
  { x: 58, w: 26, h: 104 },
  { x: 86, w: 40, h: 58 },
  { x: 268, w: 30, h: 86 },
  { x: 300, w: 44, h: 120 },
  { x: 346, w: 30, h: 66 },
]
const windows = buildings.flatMap((b) => {
  const out: string[] = []
  for (let y = 262 - b.h + 8; y < 254; y += 9) {
    for (let x = b.x + 5; x < b.x + b.w - 5; x += 7) if (rnd() > 0.35) out.push(`M${x} ${y} h3`)
  }
  return out
})
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <!-- Hilfslinien -->
    <path class="cl" d="M200 18 V280" stroke-dasharray="6 3 1 3" />
    <path class="th" d="M10 262 H390" />

    <!-- Skyline -->
    <rect v-for="(b, i) in buildings" :key="i" class="th" :x="b.x" :y="262 - b.h" :width="b.w" :height="b.h" />
    <path class="ht" :d="windows.join(' ')" />

    <!-- Turm -->
    <path class="ac" :d="legL" />
    <path class="ac" :d="legR" />
    <path class="th" :d="innerL" />
    <path class="th" :d="innerR" />
    <path class="th" :d="lattice.join(' ')" />
    <path class="ac" d="M158 262 Q200 206 242 262" />
    <!-- Hauptdeck -->
    <path class="ln" d="M164 150 H236 V164 H164 Z M168 157 H232" />
    <path class="ht" d="M172 150 v14 M180 150 v14 M188 150 v14 M196 150 v14 M204 150 v14 M212 150 v14 M220 150 v14 M228 150 v14" />
    <!-- Oberes Deck -->
    <path class="ln" d="M186 86 H214 V96 H186 Z" />
    <!-- Antenne -->
    <path class="ac" d="M195 86 L198 34 H202 L205 86" />
    <path class="th" d="M196 72 H204 M197 58 H203 M198 46 H202" />
    <path class="ln" d="M200 34 V20" />

    <!-- Bemaßung -->
    <path class="dim" d="M290 20 H304 M290 262 H304 M298 20 V262" />
    <path class="dim" d="M298 20 l-3 7 h6 Z M298 262 l-3 -7 h6 Z" />
    <rect x="302" y="134" width="34" height="13" fill="#0e2440" />
    <text class="lbl-dim" x="306" y="144">333 m</text>

    <!-- Beschriftung -->
    <path class="th" d="M236 157 L262 132 H300" />
    <text x="262" y="128">Hauptdeck</text>
    <text class="lbl-big" x="22" y="40">東京タワー</text>
    <text x="22" y="56">Tokyo Tower · Minato</text>

    <!-- Vögel -->
    <path class="th" d="M70 90 q5 -5 10 0 q5 -5 10 0 M100 76 q4 -4 8 0 q4 -4 8 0" />
  </svg>
</template>
