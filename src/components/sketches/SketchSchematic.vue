<script setup lang="ts">
/* Smart-Home-Schaltplan: Raspberry Pi mit Sensoren und Aktoren */
const PINS = 20
const pinX = (i: number) => 132 + i * 7
</script>

<template>
  <svg viewBox="0 0 400 300" aria-hidden="true">
    <!-- Raspberry Pi -->
    <rect class="ln" x="120" y="96" width="160" height="104" rx="6" />
    <circle class="th" cx="128" cy="104" r="3" />
    <circle class="th" cx="272" cy="104" r="3" />
    <circle class="th" cx="128" cy="192" r="3" />
    <circle class="th" cx="272" cy="192" r="3" />
    <rect class="th" x="182" y="132" width="34" height="34" />
    <path class="ht" d="M188 132 v-4 M194 132 v-4 M200 132 v-4 M206 132 v-4 M212 132 v-4 M188 166 v4 M194 166 v4 M200 166 v4 M206 166 v4 M212 166 v4" />
    <rect class="th" x="232" y="150" width="40" height="30" />
    <rect class="th" x="232" y="118" width="40" height="24" />
    <text x="186" y="186" class="lbl-dim">SoC</text>
    <!-- GPIO-Leiste -->
    <rect class="th" x="128" y="102" width="144" height="16" />
    <circle v-for="i in PINS" :key="`a${i}`" class="dot" :cx="pinX(i - 1)" cy="106" r="1.5" />
    <circle v-for="i in PINS" :key="`b${i}`" class="dot" :cx="pinX(i - 1)" cy="113" r="1.5" />
    <text class="lbl-ac" x="140" y="214">Raspberry Pi · Zentrale</text>

    <!-- Leitungen -->
    <path class="ac" :d="`M${pinX(5)} 102 V70 H70 V92`" />
    <path class="ac" :d="`M${pinX(8)} 102 V58 H320 V84`" />
    <path class="ac" :d="`M${pinX(14)} 102 V80 H350 V200 H316`" />
    <path class="ln" d="M120 160 H86 V196" />
    <circle class="dot" :cx="pinX(5)" cy="70" r="2.4" />
    <circle class="dot" :cx="pinX(8)" cy="58" r="2.4" />
    <circle class="dot" :cx="pinX(14)" cy="80" r="2.4" />
    <text class="lbl-dim" :x="pinX(5) + 4" y="66">GPIO17</text>
    <text class="lbl-dim" :x="pinX(8) + 4" y="54">GPIO27</text>
    <text class="lbl-dim" :x="pinX(14) + 4" y="76">GPIO4</text>

    <!-- Bewegungsmelder -->
    <path class="ln" d="M48 116 H92 V92 H48 Z" />
    <path class="ln" d="M56 92 Q70 74 84 92" />
    <path class="th" d="M70 84 v-6 M62 86 l-4 -4 M78 86 l4 -4" />
    <text x="40" y="132">Bewegung</text>

    <!-- Relais + Lampe -->
    <rect class="ln" x="296" y="84" width="48" height="30" />
    <path class="th" d="M304 104 h10 l8 -10 M326 104 h10" />
    <text x="296" y="128">Relais</text>
    <path class="ln" d="M344 99 H370 V140" />
    <circle class="ln" cx="370" cy="152" r="12" />
    <path class="ac" d="M361.5 143.5 L378.5 160.5 M378.5 143.5 L361.5 160.5" />
    <text x="352" y="180">Licht</text>

    <!-- Temperatursensor -->
    <path class="ln" d="M296 192 H316 V212 H296 Z" />
    <path class="th" d="M300 212 v12 M306 212 v12 M312 212 v12" />
    <text x="276" y="240">Temperatur</text>

    <!-- WLAN zu Rollläden -->
    <path class="ln" d="M86 196 H60 V236 H112 V196 H86" />
    <path class="th" d="M64 206 H108 M64 214 H108 M64 222 H108 M64 230 H108" />
    <text x="56" y="252">Rollladen</text>
    <path class="dim" d="M146 236 q10 -10 20 0 M142 242 q14 -16 28 0 M138 248 q18 -22 36 0" />
    <circle class="dot" cx="156" cy="244" r="2" />
    <text class="lbl-dim" x="134" y="266">Funk / WLAN</text>

    <!-- Masse & Versorgung -->
    <path class="th" d="M200 200 V236 M188 236 H212 M192 241 H208 M196 246 H204" />
    <text class="lbl-dim" x="216" y="242">GND</text>
    <path class="th" d="M280 130 H296" />
    <text class="lbl-dim" x="284" y="146">5V</text>

    <text class="lbl-big" x="16" y="30">Smart-Home-Schaltplan</text>
    <text x="16" y="46">Sensoren rein, Aktoren raus</text>
  </svg>
</template>
