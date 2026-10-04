<script setup lang="ts">
/* Shinkansen: Seitenriss von Nase und erstem Wagen plus Stirnansicht */
const RAIL = 214
const windows = Array.from({ length: 6 }, (_, i) => `M${30 + i * 26} 150 h16 v11 h-16 Z`).join(' ')
const bogies = [46, 150, 260]
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <!-- Gleis & Mittellinie -->
    <path class="ln" :d="`M8 ${RAIL} H392`" />
    <path class="th" :d="`M8 ${RAIL + 4} H392`" />
    <path class="ht" d="M14 222 h10 M40 222 h10 M66 222 h10 M92 222 h10 M118 222 h10 M144 222 h10 M170 222 h10 M196 222 h10 M222 222 h10 M248 222 h10 M274 222 h10" />
    <path class="cl" d="M8 174 H330" stroke-dasharray="10 3 2 3" />

    <!-- Wagenkasten + Nase -->
    <path class="ln" d="M10 140 H200 Q262 140 300 168 Q320 182 326 196 Q328 202 318 202 H10 Z" />
    <path class="ac" d="M10 180 H302 M10 186 H310" />
    <path class="fill-ac" d="M10 180 H302 L310 186 H10 Z" />
    <path class="th" :d="windows" />
    <!-- Cockpitscheibe -->
    <path class="ln" d="M232 146 Q262 150 282 166 H236 Z" />
    <path class="ht" d="M240 150 l6 16 M250 151 l7 15 M260 154 l7 12 M270 158 l5 8" />
    <!-- Tür -->
    <path class="th" d="M196 146 h14 v34 h-14 Z" />
    <!-- Schürze & Drehgestelle -->
    <path class="th" d="M10 202 V208 H312" />
    <g v-for="b in bogies" :key="b">
      <path class="th" :d="`M${b - 26} 204 h52 v6 h-52 Z`" />
      <circle class="ln" :cx="b - 14" :cy="RAIL - 6" r="6" />
      <circle class="ln" :cx="b + 14" :cy="RAIL - 6" r="6" />
      <circle class="dot" :cx="b - 14" :cy="RAIL - 6" r="1.2" />
      <circle class="dot" :cx="b + 14" :cy="RAIL - 6" r="1.2" />
    </g>
    <!-- Stromabnehmer -->
    <path class="th" d="M100 140 l12 -18 l12 18 M106 122 h20 M96 116 H136" />
    <path class="ht" d="M0 116 H400" stroke-dasharray="2 4" />

    <!-- Bemaßung -->
    <path class="dim" d="M200 236 V226 M326 236 V206 M200 232 H326" />
    <path class="dim" d="M200 232 l7 -3 v6 Z M326 232 l-7 -3 v6 Z" />
    <text class="lbl-dim" x="232" y="246">aerodynamische Nase</text>
    <path class="dim" d="M340 140 H352 M340 202 H352 M346 140 V202" />
    <text class="lbl-dim" x="354" y="175">h</text>

    <!-- Stirnansicht -->
    <g transform="translate(332 30)">
      <path class="ln" d="M8 64 Q8 18 30 8 Q52 18 52 64 Z" />
      <path class="ln" d="M16 30 Q30 18 44 30 Q30 36 16 30 Z" />
      <path class="ac" d="M8 52 H52" />
      <circle class="th" cx="16" cy="58" r="2.5" />
      <circle class="th" cx="44" cy="58" r="2.5" />
      <text class="lbl-dim" x="2" y="80">Stirn</text>
    </g>

    <!-- Beschriftung -->
    <text class="lbl-big" x="12" y="34">新幹線</text>
    <text x="12" y="50">Shinkansen · Seitenriss</text>
    <path class="th" d="M150 186 L134 260 H90" />
    <text x="14" y="264">Zierlinie</text>
    <path class="th" d="M258 158 L282 120 H316" />
    <text x="230" y="114">Cockpit</text>
  </svg>
</template>
