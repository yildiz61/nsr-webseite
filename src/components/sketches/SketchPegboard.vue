<script setup lang="ts">
/* Werkzeugwand: Lochwand mit Umrissen der Lieblingswerkzeuge */
const holes: { x: number; y: number }[] = []
for (let y = 36; y < 270; y += 18) for (let x = 30; x < 376; x += 18) holes.push({ x, y })

const drivers = [
  { x: 150, len: 128, w: 14 },
  { x: 172, len: 112, w: 12 },
  { x: 192, len: 96, w: 11 },
  { x: 210, len: 82, w: 10 },
]
const driverPath = (d: (typeof drivers)[number]) => {
  const top = 52
  const hl = d.len * 0.42
  return {
    handle: `M${d.x - d.w / 2} ${top + 4} Q${d.x - d.w / 2} ${top} ${d.x} ${top} Q${d.x + d.w / 2} ${top} ${d.x + d.w / 2} ${top + 4} V${top + hl} L${d.x + 3} ${top + hl + 6} H${d.x - 3} L${d.x - d.w / 2} ${top + hl} Z`,
    grip: `M${d.x - 2} ${top + 8} V${top + hl - 6} M${d.x + 2} ${top + 8} V${top + hl - 6}`,
    shaft: `M${d.x - 1.5} ${top + hl + 6} V${top + d.len} L${d.x} ${top + d.len + 4} L${d.x + 1.5} ${top + d.len} V${top + hl + 6}`,
  }
}
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <rect class="th" x="16" y="22" width="368" height="258" rx="4" />
    <circle v-for="(h, i) in holes" :key="i" class="dot" :cx="h.x" :cy="h.y" r="1.4" opacity="0.35" />

    <!-- Hammer -->
    <path class="ln" d="M40 58 H96 V76 H86 L80 70 H56 L50 76 H40 Z" />
    <path class="ln" d="M64 76 H72 V176 Q68 182 64 176 Z" />
    <path class="ht" d="M64 130 H72 M64 138 H72 M64 146 H72 M64 154 H72 M64 162 H72" />

    <!-- Schraubendreher-Satz -->
    <g v-for="d in drivers" :key="d.x">
      <path class="ac" :d="driverPath(d).handle" />
      <path class="th" :d="driverPath(d).grip" />
      <path class="ln" :d="driverPath(d).shaft" />
    </g>
    <path class="th" d="M140 40 H222" />

    <!-- Stirnlampe -->
    <ellipse class="ln" cx="290" cy="76" rx="40" ry="16" />
    <ellipse class="th" cx="290" cy="76" rx="34" ry="11" />
    <path class="ln" d="M276 86 h28 v18 h-28 Z" />
    <circle class="ac" cx="290" cy="95" r="6" />
    <path class="dim" d="M290 104 L270 150 M290 104 L310 150" stroke-dasharray="3 3" />

    <!-- Zollstock -->
    <path class="ac" d="M244 176 L364 176 L364 186 L244 186 Z" />
    <path class="th" d="M268 176 v10 M292 176 v10 M316 176 v10 M340 176 v10" />
    <path class="ht" d="M250 176 v4 M256 176 v4 M262 176 v4 M274 176 v4 M280 176 v4 M286 176 v4 M298 176 v4 M304 176 v4 M310 176 v4 M322 176 v4 M328 176 v4 M334 176 v4 M346 176 v4 M352 176 v4 M358 176 v4" />

    <!-- Zange -->
    <path class="ln" d="M60 210 L80 236 L88 270 M100 210 L80 236 L72 270" />
    <circle class="ln" cx="80" cy="236" r="4" />
    <path class="th" d="M60 210 Q80 196 100 210" />

    <!-- Akkuschrauber -->
    <path class="ln" d="M130 214 H196 Q206 214 206 224 V232 Q206 240 196 240 H170 L162 266 H140 L148 240 H130 Z" />
    <path class="ln" d="M206 222 H222 V232 H206" />
    <path class="th" d="M222 226 H240" />
    <path class="ln" d="M134 266 H172 V280 H134 Z" />
    <path class="th" d="M138 220 H190 M138 228 H190" />

    <!-- Beschriftungen -->
    <path class="th" d="M306 92 L334 120 H372" />
    <text x="326" y="134">Stirnlampe</text>
    <path class="th" d="M222 226 L262 214 H292" />
    <text x="262" y="208">Akkuschrauber</text>
    <text class="lbl-big" x="250" y="256">Werkzeugwand</text>
    <text x="250" y="271">Alles hat seinen Haken.</text>
  </svg>
</template>
