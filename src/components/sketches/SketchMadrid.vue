<script setup lang="ts">
/* Puerta de Alcalá: klassizistisches Tor mit drei Bögen und zwei Rechtecköffnungen */
const BASE = 254
const archOpen = (cx: number, w: number, top: number) =>
  `M${cx - w / 2} ${BASE} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V${BASE}`
const arches = [
  { cx: 200, w: 54, top: 132 },
  { cx: 134, w: 42, top: 156 },
  { cx: 266, w: 42, top: 156 },
]
const columns = [104, 164, 236, 296]
const voussoirs = (cx: number, w: number, top: number) => {
  const r = w / 2
  const cy = top + r
  const out: string[] = []
  for (let i = 1; i < 8; i++) {
    const a = Math.PI - (i * Math.PI) / 8
    out.push(`M${cx + Math.cos(a) * r} ${cy - Math.sin(a) * r} L${cx + Math.cos(a) * (r + 9)} ${cy - Math.sin(a) * (r + 9)}`)
  }
  return out.join(' ')
}
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <path class="th" :d="`M10 ${BASE} H390`" />
    <path class="ht" :d="`M10 ${BASE + 8} H390 M30 ${BASE + 16} H370`" />

    <!-- Baukörper -->
    <path class="ln" :d="`M60 ${BASE} V118 H340 V${BASE}`" />
    <!-- Gebälk -->
    <path class="ln" d="M52 118 H348 V106 H52 Z M56 106 V98 H344 V106" />
    <path class="ht" d="M60 112 H340" />
    <!-- Attika -->
    <path class="ln" d="M150 98 V70 H250 V98" />
    <path class="th" d="M158 76 H242 V94 H158 Z" />
    <text x="200" y="88" text-anchor="middle" class="lbl-dim">REGE CAROLO III</text>
    <!-- Giebelfiguren -->
    <path class="ac" d="M190 70 q0 -16 10 -24 q10 8 10 24 M200 46 v-6 M194 52 h12" />
    <path class="th" d="M158 70 q4 -14 12 -14 q8 0 10 14 M220 70 q2 -14 10 -14 q8 0 12 14" />
    <path class="th" d="M64 98 q3 -12 10 -12 q7 0 10 12 M316 98 q3 -12 10 -12 q7 0 10 12" />

    <!-- Säulen -->
    <g v-for="x in columns" :key="x">
      <path class="th" :d="`M${x - 4} 124 V${BASE - 8} M${x + 4} 124 V${BASE - 8}`" />
      <path class="th" :d="`M${x - 7} 118 h14 v6 h-14 Z M${x - 7} ${BASE - 8} h14 v8 h-14 Z`" />
    </g>

    <!-- Bögen -->
    <g v-for="a in arches" :key="a.cx">
      <path class="ac" :d="archOpen(a.cx, a.w, a.top)" />
      <path class="th" :d="voussoirs(a.cx, a.w, a.top)" />
      <path class="ht" :d="`M${a.cx - a.w / 2 + 6} ${BASE} L${a.cx + a.w / 2} ${a.top + a.w / 2 + 6} M${a.cx - a.w / 2 + 18} ${BASE} L${a.cx + a.w / 2} ${a.top + a.w / 2 + 22} M${a.cx - a.w / 2 + 30} ${BASE} L${a.cx + a.w / 2} ${a.top + a.w / 2 + 40}`" />
    </g>
    <!-- Rechtecktore -->
    <path class="ln" :d="`M70 ${BASE} V176 H96 V${BASE} M304 ${BASE} V176 H330 V${BASE}`" />
    <path class="ht" :d="`M70 196 H96 M70 216 H96 M70 236 H96 M304 196 H330 M304 216 H330 M304 236 H330`" />

    <!-- Bemaßung -->
    <path class="dim" d="M60 276 V266 M340 276 V266 M60 272 H340" />
    <path class="dim" d="M60 272 l7 -3 v6 Z M340 272 l-7 -3 v6 Z" />
    <text class="lbl-dim" x="200" y="288" text-anchor="middle">5 Durchgänge · 3 Bögen</text>

    <text class="lbl-big" x="14" y="30">Puerta de Alcalá</text>
    <text x="14" y="46">Madrid</text>
  </svg>
</template>
