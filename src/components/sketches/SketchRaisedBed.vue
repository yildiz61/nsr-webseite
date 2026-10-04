<script setup lang="ts">
/* Hochbeet: isometrische Explosionszeichnung aus drei Bohlen-Lagen */
const C = { x: 196, y: 150 }
const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)
const S = 1.05
const iso = (x: number, y: number, z: number) => ({ x: C.x + (x - y) * COS * S, y: C.y + (x + y) * SIN * S - z * S })
const pt = (x: number, y: number, z: number) => {
  const p = iso(x, y, z)
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`
}

const LEN = 120
const WID = 70
const H = 18
const T = 6

/* Eine Lage = Rahmen; sichtbare Kanten als Pfade */
function layer(z: number) {
  const outerTop = `M${pt(0, 0, z + H)} L${pt(LEN, 0, z + H)} L${pt(LEN, WID, z + H)} L${pt(0, WID, z + H)} Z`
  const innerTop = `M${pt(T, T, z + H)} L${pt(LEN - T, T, z + H)} L${pt(LEN - T, WID - T, z + H)} L${pt(T, WID - T, z + H)} Z`
  const front = `M${pt(0, WID, z + H)} L${pt(0, WID, z)} L${pt(LEN, WID, z)} L${pt(LEN, WID, z + H)}`
  const side = `M${pt(LEN, 0, z + H)} L${pt(LEN, 0, z)} L${pt(LEN, WID, z)}`
  const grain = [0.3, 0.55, 0.8]
    .map((f) => `M${pt(LEN * 0.08, WID, z + H * f)} L${pt(LEN * 0.92, WID, z + H * (f - 0.08))}`)
    .join(' ')
  return { outerTop, innerTop, front, side, grain }
}

const layers = [0, 34, 68].map((z) => ({ z, ...layer(z) }))
const posts = [
  [T / 2, WID - T / 2],
  [LEN - T / 2, WID - T / 2],
  [LEN - T / 2, T / 2],
].map(([x, y]) => `M${pt(x!, y!, -10)} L${pt(x!, y!, 68 + H)}`)

/* Schrauben in Explosionsrichtung */
const screws = [
  [20, WID],
  [LEN - 20, WID],
].map(([x, y]) => {
  const a = iso(x!, y! + 26, 44)
  const b = iso(x!, y!, 44)
  return `M${a.x} ${a.y} L${b.x} ${b.y}`
})

const dimA = iso(0, WID + 22, 0)
const dimB = iso(LEN, WID + 22, 0)
const dimC = iso(LEN + 22, 0, 0)
const dimD = iso(LEN + 22, WID, 0)
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <!-- Erde-Andeutung -->
    <path class="ht" :d="`M${pt(0, 0, -10)} L${pt(LEN, 0, -10)} L${pt(LEN, WID, -10)} L${pt(0, WID, -10)} Z`" stroke-dasharray="3 3" />

    <path v-for="(p, i) in posts" :key="`p${i}`" class="cl" :d="p" stroke-dasharray="5 3" />

    <g v-for="(l, i) in layers" :key="l.z">
      <path :class="i === 2 ? 'ac' : 'ln'" :d="l.outerTop" />
      <path class="th" :d="l.innerTop" />
      <path :class="i === 2 ? 'ac' : 'ln'" :d="l.front" />
      <path :class="i === 2 ? 'ac' : 'ln'" :d="l.side" />
      <path class="ht" :d="l.grain" />
    </g>

    <path v-for="(s, i) in screws" :key="`s${i}`" class="dim" :d="s" />

    <!-- Bemaßung -->
    <path class="dim" :d="`M${dimA.x} ${dimA.y} L${dimB.x} ${dimB.y}`" />
    <text class="lbl-dim" :x="(dimA.x + dimB.x) / 2 - 18" :y="(dimA.y + dimB.y) / 2 + 14">Länge</text>
    <path class="dim" :d="`M${dimC.x} ${dimC.y} L${dimD.x} ${dimD.y}`" />
    <text class="lbl-dim" :x="(dimC.x + dimD.x) / 2 + 6" :y="(dimC.y + dimD.y) / 2 + 10">Breite</text>

    <!-- Pflanzen auf der oberen Lage -->
    <path class="ac" :d="`M${pt(30, 35, 86)} q-4 -14 0 -22 q4 8 0 22 M${pt(60, 35, 86)} q-6 -18 0 -28 q6 10 0 28 M${pt(90, 35, 86)} q-4 -12 0 -20 q4 8 0 20`" />

    <path class="th" d="M288 92 L316 70 H372" />
    <text x="312" y="64">Lage 3</text>
    <text class="lbl-big" x="16" y="30">Hochbeet</text>
    <text x="16" y="46">Explosionszeichnung · 3 Lagen</text>
    <text x="16" y="276">Erst planen, dann sägen.</text>
  </svg>
</template>
