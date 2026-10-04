<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check } from '@lucide/vue'
import { stickyProgress, useScrollTicker } from '@/composables/useScrollTicker'
import { clamp01, easeInOutCubic, lerp, mixColor, segment } from '@/utils/anim'

const section = ref<HTMLElement | null>(null)
const progress = ref(0)

useScrollTicker(() => {
  if (section.value) progress.value = stickyProgress(section.value)
})

const steps = [
  {
    id: 'werkbank',
    title: 'Werkbank',
    text: 'Regale, Möbel, Reparaturen: Was sich selbst bauen lässt, wird selbst gebaut. Der Akkuschrauber ist immer geladen.',
    from: 0.02,
  },
  {
    id: 'garten',
    title: 'Garten',
    text: 'Rasen, Hochbeet, Bäume: Gartenarbeit ist der perfekte Ausgleich zum Bildschirm. Und wo es geht, packt ein Roboter mit an.',
    from: 0.2,
  },
  {
    id: 'zentrale',
    title: 'Smart-Home-Zentrale',
    text: 'Ein Raspberry Pi als Gehirn des Hauses: Sensoren, Lampen und Aktoren laufen lokal zusammen – ohne Cloud-Zwang.',
    from: 0.4,
  },
  {
    id: 'automation',
    title: 'Automationen',
    text: 'Die Sonne geht unter, die Rollläden fahren runter, das Licht geht Raum für Raum an. Das Haus kennt seine Routinen.',
    from: 0.6,
  },
  {
    id: 'feierabend',
    title: 'Feierabend',
    text: 'Wenn alles läuft, ist Zeit für die Familie. Zumindest bis zur nächsten Idee.',
    from: 0.82,
  },
] as const

const p = computed(() => progress.value)
const active = computed(() => {
  let a = -1
  steps.forEach((s, i) => {
    if (p.value >= s.from) a = i
  })
  return a
})
const finished = computed(() => p.value > 0.97)
const activeStep = computed(() => (active.value >= 0 ? steps[active.value] : undefined))

function state(i: number) {
  if (finished.value || i < active.value) return 'done'
  if (i === active.value) return 'active'
  return 'todo'
}

/* ---------- Kamera: auf schmalen Screens fährt sie zur jeweiligen Szene ---------- */
const narrow = ref(false)
let mq: MediaQueryList | undefined
const onMq = () => (narrow.value = Boolean(mq?.matches))
onMounted(() => {
  mq = window.matchMedia('(max-width: 959px)')
  onMq()
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => mq?.removeEventListener('change', onMq))

const CAM_KEYS = [
  { p: 0, x: 400, w: 390 },
  { p: 0.17, x: 400, w: 390 },
  { p: 0.23, x: 20, w: 390 },
  { p: 0.38, x: 20, w: 390 },
  { p: 0.45, x: 250, w: 530 },
  { p: 1, x: 250, w: 530 },
] as const
const viewBox = computed(() => {
  if (!narrow.value) return '40 140 750 360'
  const t = p.value
  let i = 0
  while (i < CAM_KEYS.length - 2 && t > CAM_KEYS[i + 1]!.p) i++
  const a = CAM_KEYS[i]!
  const b = CAM_KEYS[i + 1]!
  const f = easeInOutCubic(segment(t, a.p, b.p))
  const w = lerp(a.w, b.w, f)
  const h = w * 0.9
  return `${lerp(a.x, b.x, f)} ${505 - h} ${w} ${h}`
})

/* ---------- Himmel & Tageszeit ---------- */
const night = computed(() => segment(p.value, 0.45, 0.9))
const dusk = computed(() => Math.sin(Math.PI * segment(p.value, 0.35, 0.92)))
const skyTop = computed(() => mixColor('#3b6a96', '#070b14', night.value))
const skyBottom = computed(() => mixColor(mixColor('#9cc3df', '#121a29', night.value), '#d9824f', dusk.value * 0.55))
const sun = computed(() => {
  const t = segment(p.value, 0.15, 0.72)
  return { x: lerp(262, 120, t), y: lerp(140, 470, easeInOutCubic(t)) }
})
const moon = computed(() => ({ y: lerp(470, 92, easeInOutCubic(segment(p.value, 0.66, 0.95))) }))
const clock = computed(() => {
  const minutes = Math.round(lerp(15 * 60 + 30, 22 * 60 + 15, p.value))
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
})
const stars = [
  [60, 40], [140, 70], [250, 34], [330, 92], [420, 48], [560, 30], [640, 74], [720, 40], [770, 110], [500, 110], [190, 130],
] as const

/* ---------- Haus ---------- */
const rooms = [
  { x: 308, y: 270, h: 72 },
  { x: 464, y: 270, h: 72 },
  { x: 308, y: 350, h: 90 },
  { x: 464, y: 350, h: 90 },
]
const windows = [
  { x: 328, y: 282, w: 46, h: 32 },
  { x: 552, y: 282, w: 44, h: 32 },
  { x: 332, y: 366, w: 50, h: 36 },
]
const lamps = [
  { x: 420, room: rooms[0]!, at: 0.66 },
  { x: 512, room: rooms[1]!, at: 0.74 },
  { x: 428, room: rooms[2]!, at: 0.7 },
]

/* ---------- 1 · Werkbank ---------- */
const drill = computed(() => {
  const t = p.value
  const toSecond = easeInOutCubic(segment(t, 0.105, 0.125))
  return {
    visible: t > 0.035 && t < 0.2,
    x: lerp(724, 754, toSecond),
    spinning: (t > 0.06 && t < 0.1) || (t > 0.13 && t < 0.17),
  }
})
const shelf = computed(() => segment(p.value, 0.04, 0.07))
const screw1 = computed(() => p.value > 0.1)
const screw2 = computed(() => p.value > 0.17)
const shelfItems = computed(() => p.value > 0.18)
const workshopLight = computed(() => (p.value > 0.02 && p.value < 0.22) || p.value > 0.76)

/* ---------- 2 · Garten ---------- */
const LANES = [458, 476, 494]
const mowT = computed(() => segment(p.value, 0.21, 0.39))
const mower = computed(() => {
  const t = mowT.value * LANES.length
  const lane = Math.min(LANES.length - 1, Math.floor(t))
  const f = t - lane
  const ltr = lane % 2 === 0
  let x = ltr ? lerp(34, 262, f) : lerp(262, 34, f)
  let y = LANES[lane] ?? 458
  if (mowT.value >= 1) {
    // zurück zur Ladestation
    const back = segment(p.value, 0.39, 0.43)
    x = lerp(262, 270, back)
    y = lerp(LANES[2] ?? 494, 452, back)
  }
  return { x, y, flip: !ltr && mowT.value < 1 }
})
function laneMown(i: number) {
  return clamp01(mowT.value * LANES.length - i)
}
const plants = computed(() => easeInOutCubic(segment(p.value, 0.26, 0.38)))

/* ---------- 3 · Zentrale ---------- */
const PI = { x: 506, y: 384 }
const devices = [
  { id: 'buero', x: 420, y: 282, at: 0.45 },
  { id: 'schlafen', x: 512, y: 282, at: 0.47 },
  { id: 'wohnen', x: 428, y: 368, at: 0.49 },
  { id: 'thermo', x: 446, y: 402, at: 0.51 },
  { id: 'werkstatt', x: 694, y: 364, at: 0.53 },
  { id: 'garten', x: 278, y: 400, at: 0.55 },
] as const
const piOn = computed(() => p.value > 0.42)
function link(at: number) {
  return segment(p.value, at, at + 0.04)
}

/* ---------- 4 · Automationen ---------- */
const blinds = computed(() => easeInOutCubic(segment(p.value, 0.62, 0.7)))
const lightOn = (at: number) => p.value > at
const thermo = computed(() => (p.value > 0.66 ? '21°' : '19°'))
const activeAutomations = computed(
  () => [blinds.value > 0.5, lightOn(0.66), lightOn(0.7), lightOn(0.74), lightOn(0.68), p.value > 0.66].filter(Boolean).length,
)
const tvOn = computed(() => p.value > 0.85)
</script>

<template>
  <section id="zuhause" ref="section" class="home" aria-labelledby="home-title">
    <div class="home__sticky">
      <div class="container home__grid">
        <div class="home__copy">
          <p class="eyebrow">Zuhause · Feierabend-Labor</p>
          <h2 id="home-title" class="section-title">Das Haus als <em>Werkstatt.</em></h2>
          <p class="section-lead home__lead">
            Mein liebstes Projekt hat einen Garten und ein Dach: Am eigenen Haus wird gebaut, gepflanzt, verkabelt und
            automatisiert. Scroll weiter und begleite einen Nachmittag bis in den Abend.
          </p>

          <ol class="home__list">
            <li v-for="(s, i) in steps" :key="s.id" :class="`is-${state(i)}`">
              <span class="home__num">
                <Check v-if="state(i) === 'done'" aria-hidden="true" />
                <template v-else>{{ String(i + 1).padStart(2, '0') }}</template>
              </span>
              <div>
                <strong>{{ s.title }}</strong>
                <p>{{ s.text }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="home__stage">
          <svg class="home__svg" :viewBox="viewBox" role="img" aria-label="Animation: Ein Haus im Querschnitt – Werkstatt, Garten, Smart-Home-Zentrale und Automationen vom Nachmittag bis in den Abend">
            <defs>
              <linearGradient id="homeSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" :stop-color="skyTop" />
                <stop offset="0.3" :stop-color="skyTop" />
                <stop offset="1" :stop-color="skyBottom" />
              </linearGradient>
              <radialGradient id="homeLamp" cx="0.5" cy="0.1" r="0.9">
                <stop offset="0" stop-color="#ffd27a" stop-opacity="0.75" />
                <stop offset="0.6" stop-color="#ffb020" stop-opacity="0.22" />
                <stop offset="1" stop-color="#ffb020" stop-opacity="0.06" />
              </radialGradient>
              <pattern id="homeStripes" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#1d3a26" />
                <rect width="9" height="18" fill="#21422b" />
              </pattern>
              <pattern id="homePeg" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#3a3226" />
                <circle cx="4" cy="4" r="1.1" fill="#1d1912" />
              </pattern>
            </defs>

            <!-- Himmel -->
            <rect x="0" y="0" width="800" height="450" fill="url(#homeSky)" />
            <g :opacity="night">
              <circle v-for="(s, i) in stars" :key="i" :cx="s[0]" :cy="s[1] + 120" r="1.4" fill="#fff" class="home__star" :style="{ animationDelay: `${i * 0.37}s` }" />
            </g>
            <circle :cx="sun.x" :cy="sun.y + 60" r="26" fill="#ffd45c" opacity="0.95" />
            <circle :cx="sun.x" :cy="sun.y + 60" r="40" fill="#ffd45c" opacity="0.15" />
            <g :transform="`translate(706 ${moon.y + 40})`">
              <circle r="18" fill="#e8edf5" />
              <circle cx="7" cy="-5" r="16" :fill="skyTop" />
            </g>

            <!-- HUD -->
            <g v-if="!narrow" class="home__hud" transform="translate(54 154)">
              <rect width="178" height="46" rx="8" />
              <text x="12" y="19" class="home__hud-k">home.local</text>
              <text x="166" y="19" text-anchor="end" class="home__hud-v">{{ clock }}</text>
              <text x="12" y="36" class="home__hud-k">automationen</text>
              <text x="166" y="36" text-anchor="end" class="home__hud-v" :class="{ on: activeAutomations > 0 }">
                {{ activeAutomations }} aktiv
              </text>
            </g>

            <!-- Boden -->
            <rect x="0" y="440" width="800" height="80" fill="#152a1c" />
            <rect x="0" y="440" width="800" height="3" fill="#24492f" />
            <g v-for="(ly, i) in LANES" :key="ly">
              <rect x="30" :y="ly - 9" :width="236 * laneMown(i)" height="18" fill="url(#homeStripes)" />
            </g>
            <rect x="290" y="440" width="510" height="80" fill="#1b2029" />
            <rect x="290" y="440" width="510" height="2" fill="#3d4553" />

            <!-- Baum & Hochbeet -->
            <g>
              <rect x="132" y="360" width="12" height="80" rx="3" fill="#4a3424" />
              <circle cx="138" cy="340" r="38" :fill="mixColor('#2f6b3f', '#14301d', night)" />
              <circle cx="112" cy="356" r="24" :fill="mixColor('#3a7d4b', '#183822', night)" />
              <circle cx="164" cy="354" r="26" :fill="mixColor('#357445', '#163420', night)" />
              <rect x="196" y="420" width="76" height="20" rx="2" fill="#5a3f2a" />
              <g v-for="k in 5" :key="k" :transform="`translate(${196 + k * 13} 420) scale(${0.3 + plants * 0.7})`">
                <path d="M0 0 C-5 -8 -3 -14 0 -18 C3 -14 5 -8 0 0 Z" fill="#4caf50" />
              </g>
            </g>

            <!-- Gartenleuchte -->
            <g>
              <rect x="276" y="404" width="4" height="36" fill="#3d4553" />
              <rect x="271" y="396" width="14" height="10" rx="2" :fill="lightOn(0.68) ? '#ffd27a' : '#2b313c'" />
              <circle v-if="lightOn(0.68)" cx="278" cy="420" r="34" fill="#ffd27a" opacity="0.12" />
            </g>

            <!-- Mähroboter -->
            <g :transform="`translate(${mower.x} ${mower.y}) scale(${mower.flip ? -1 : 1} 1)`">
              <path d="M-16 4 Q-14 -10 0 -10 Q14 -10 16 4 Z" fill="#2b313c" stroke="#5a6476" stroke-width="1" />
              <rect x="-14" y="-3" width="28" height="3" fill="#ffb020" />
              <circle cx="-9" cy="5" r="3.5" fill="#0b0e13" />
              <circle cx="9" cy="5" r="3.5" fill="#0b0e13" />
              <circle cx="10" cy="-6" r="1.4" :fill="piOn ? '#4cc9f0' : '#3ddc84'" />
            </g>
            <rect x="262" y="446" width="20" height="10" rx="2" fill="#2b313c" stroke="#5a6476" stroke-width="1" />

            <!-- ===== Haus (Querschnitt) ===== -->
            <g class="home__house">
              <!-- Dach -->
              <path d="M284 264 L460 166 L636 264 Z" fill="#232a36" stroke="#4a5568" stroke-width="2" />
              <path d="M314 256 L460 176 L606 256 Z" fill="#141922" />
              <rect x="540" y="182" width="22" height="44" fill="#2b313c" stroke="#4a5568" stroke-width="1.5" />
              <text x="460" y="242" text-anchor="middle" class="home__room">DACHBODEN</text>

              <!-- Räume -->
              <rect x="300" y="262" width="320" height="178" fill="#2b313c" />
              <rect v-for="r in rooms" :key="`${r.x}-${r.y}`" :x="r.x" :y="r.y" width="148" :height="r.h" fill="#121720" />

              <!-- Fenster mit Himmel & Rollladen -->
              <g v-for="w in windows" :key="w.x">
                <rect :x="w.x" :y="w.y" :width="w.w" :height="w.h" fill="url(#homeSky)" />
                <rect :x="w.x" :y="w.y" :width="w.w" :height="w.h * blinds * 0.85" fill="#3a4252" />
                <template v-for="k in 4" :key="k">
                  <path v-if="(k * w.h) / 5 < w.h * blinds * 0.85" :d="`M${w.x} ${w.y + (k * w.h) / 5} h${w.w}`" stroke="#2b313c" stroke-width="1" />
                </template>
                <rect :x="w.x" :y="w.y" :width="w.w" :height="w.h" fill="none" stroke="#5a6476" stroke-width="2" />
              </g>

              <!-- Büro: Schreibtisch, Monitor, Laptop & mechanische Tastatur -->
              <g>
                <rect x="386" y="318" width="62" height="4" fill="#6b4f36" />
                <rect x="390" y="322" width="3" height="20" fill="#4a3424" />
                <rect x="441" y="322" width="3" height="20" fill="#4a3424" />
                <rect x="410" y="296" width="30" height="19" rx="2" fill="#0b0e13" stroke="#5a6476" stroke-width="1.5" />
                <rect x="423" y="315" width="4" height="3" fill="#5a6476" />
                <rect x="412" y="298" width="26" height="15" :fill="lightOn(0.66) ? '#1a3a4a' : '#0f1622'" />
                <rect x="392" y="314" width="14" height="4" rx="1" fill="#c3cad6" />
                <text x="316" y="336" class="home__room">BÜRO</text>
              </g>

              <!-- Schlafen -->
              <g>
                <rect x="474" y="326" width="70" height="12" rx="2" fill="#3d4a5e" />
                <rect x="474" y="318" width="18" height="8" rx="3" fill="#c3cad6" />
                <rect x="470" y="312" width="4" height="30" fill="#4a3424" />
                <text x="562" y="336" class="home__room">SCHLAFEN</text>
              </g>

              <!-- Wohnen -->
              <g>
                <rect x="318" y="414" width="70" height="18" rx="4" fill="#3d4a5e" />
                <rect x="318" y="404" width="12" height="28" rx="4" fill="#465670" />
                <rect x="410" y="400" width="28" height="18" rx="2" fill="#0b0e13" stroke="#5a6476" stroke-width="1.2" />
                <rect x="412" y="402" width="24" height="14" :class="{ 'home__tv': tvOn }" :fill="tvOn ? '#4cc9f0' : '#0f1622'" />
                <rect x="418" y="418" width="12" height="14" fill="#2b313c" />
                <rect x="440" y="394" width="10" height="14" rx="2" class="home__thermo" :class="{ on: piOn }" />
                <text x="445" y="390" text-anchor="middle" class="home__small">{{ thermo }}</text>
                <text x="316" y="360" class="home__room">WOHNEN</text>
              </g>

              <!-- Technik: Raspberry Pi -->
              <g>
                <rect x="580" y="382" width="28" height="58" fill="#4a3424" />
                <circle cx="602" cy="412" r="1.6" fill="#c3cad6" />
                <text x="472" y="360" class="home__room">TECHNIK</text>
                <circle v-if="piOn" :cx="PI.x" :cy="PI.y" r="14" class="home__ping" />
                <rect :x="PI.x - 16" :y="PI.y - 10" width="32" height="20" rx="2" fill="#1f6f43" stroke="#2f9d5f" stroke-width="1" />
                <rect :x="PI.x - 10" :y="PI.y - 5" width="9" height="9" fill="#111" />
                <rect :x="PI.x + 3" :y="PI.y - 6" width="8" height="5" fill="#c3cad6" />
                <circle :cx="PI.x + 12" :cy="PI.y + 6" r="1.6" :class="piOn ? 'home__led' : ''" :fill="piOn ? '#3ddc84' : '#3a1515'" />
                <text :x="PI.x" :y="PI.y + 24" text-anchor="middle" class="home__small">raspberry pi</text>
              </g>

              <!-- Lampen & Lichtkegel -->
              <g v-for="l in lamps" :key="l.x">
                <rect v-if="lightOn(l.at)" :x="l.room.x" :y="l.room.y" width="148" :height="l.room.h" fill="url(#homeLamp)" class="home__glow" />
                <line :x1="l.x" :y1="l.room.y" :x2="l.x" :y2="l.room.y + 10" stroke="#5a6476" stroke-width="1" />
                <path
                  :d="`M${l.x - 7} ${l.room.y + 16} L${l.x - 4} ${l.room.y + 10} H${l.x + 4} L${l.x + 7} ${l.room.y + 16} Z`"
                  :fill="lightOn(l.at) ? '#ffd27a' : '#5a6476'"
                />
              </g>
            </g>

            <!-- ===== Werkstatt ===== -->
            <g>
              <rect x="624" y="342" width="152" height="98" fill="#2b313c" />
              <rect x="632" y="350" width="136" height="90" fill="#121720" />
              <rect v-if="workshopLight" x="632" y="350" width="136" height="90" fill="url(#homeLamp)" class="home__glow" />
              <line x1="694" y1="350" x2="694" y2="358" stroke="#5a6476" stroke-width="1" />
              <path d="M688 364 L691 358 H697 L700 364 Z" :fill="workshopLight ? '#ffd27a' : '#5a6476'" />
              <text x="722" y="434" class="home__room">WERKSTATT</text>

              <!-- Lochwand mit Werkzeug -->
              <rect x="640" y="368" width="56" height="34" fill="url(#homePeg)" />
              <path d="M648 374 v14 M645 374 h6" stroke="#c3cad6" stroke-width="2" stroke-linecap="round" />
              <path d="M660 373 l8 12" stroke="#ffb020" stroke-width="3" stroke-linecap="round" />
              <circle cx="680" cy="380" r="5" fill="none" stroke="#c3cad6" stroke-width="2" />
              <path d="M680 385 v12" stroke="#c3cad6" stroke-width="2" />

              <!-- Werkbank -->
              <rect x="640" y="410" width="80" height="5" fill="#8a6a46" />
              <rect x="644" y="415" width="4" height="25" fill="#5a4330" />
              <rect x="712" y="415" width="4" height="25" fill="#5a4330" />

              <!-- Regal wird montiert -->
              <g :opacity="shelf" :transform="`translate(0 ${(1 - shelf) * -6})`">
                <rect x="712" y="376" width="52" height="4" fill="#a7835a" />
                <path d="M722 380 v8 h6 M752 380 v8 h6" fill="none" stroke="#8a94a6" stroke-width="1.6" />
                <circle cx="724" cy="384" r="1.6" :fill="screw1 ? '#3ddc84' : '#ff5d5d'" />
                <circle cx="754" cy="384" r="1.6" :fill="screw2 ? '#3ddc84' : '#ff5d5d'" />
                <g v-if="shelfItems" class="home__items">
                  <rect x="716" y="364" width="12" height="12" fill="#4cc9f0" opacity="0.7" />
                  <rect x="730" y="368" width="10" height="8" fill="#ffb020" opacity="0.8" />
                  <path d="M750 376 q2 -12 6 -12 q4 0 6 12 Z" fill="#4caf50" />
                </g>
              </g>

              <!-- Akkuschrauber -->
              <g v-if="drill.visible" :transform="`translate(${drill.x} 392)`" class="home__drill">
                <rect x="-2" y="-8" width="4" height="8" fill="#c3cad6" />
                <g :class="{ 'is-spin': drill.spinning }">
                  <rect x="-4" y="-2" width="8" height="5" rx="1" fill="#5a6476" />
                </g>
                <rect x="-9" y="3" width="18" height="12" rx="3" fill="#ffb020" />
                <rect x="-4" y="15" width="8" height="12" fill="#1a1f28" />
                <rect x="-7" y="27" width="14" height="7" rx="2" fill="#1a1f28" />
                <g v-if="drill.spinning" class="home__dust">
                  <circle cx="-5" cy="-10" r="1" />
                  <circle cx="4" cy="-12" r="0.8" />
                  <circle cx="0" cy="-14" r="1.1" />
                </g>
              </g>
            </g>

            <!-- Funkverbindungen der Zentrale -->
            <g class="home__links">
              <g v-for="d in devices" :key="d.id">
                <path
                  :d="`M${PI.x} ${PI.y} Q${(PI.x + d.x) / 2} ${Math.min(PI.y, d.y) - 30} ${d.x} ${d.y}`"
                  pathLength="1"
                  :style="{ strokeDashoffset: 1 - link(d.at) }"
                />
                <circle v-if="link(d.at) >= 1" :cx="d.x" :cy="d.y" r="4" class="home__node" />
              </g>
            </g>
          </svg>

          <div class="home__badge" :class="{ 'is-shown': finished }" aria-live="polite">
            <span class="home__badge-dot"></span>
            <div>
              <strong>Szene „Feierabend“ aktiv</strong>
              <span>Alle Systeme laufen.</span>
            </div>
          </div>

          <!-- Aktiver Schritt (mobil) -->
          <div class="home__caption" aria-live="polite">
            <template v-if="activeStep">
              <span class="home__num">{{ String(active + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ activeStep.title }}</strong>
                <p>{{ activeStep.text }}</p>
              </div>
            </template>
            <template v-else>
              <span class="home__num home__num--hint">↓</span>
              <div>
                <strong>Weiterscrollen</strong>
                <p>…und der Nachmittag beginnt.</p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="home__progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  height: 420vh;
  background: var(--bg-2);
  border-block: 1px solid var(--line);
}

.home__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: var(--header-h);
}

.home__grid {
  display: grid;
  gap: 10px;
  height: 100%;
  grid-template-rows: auto minmax(0, 1fr);
  padding-block: 12px 20px;
}

.home__copy .section-title {
  font-size: clamp(1.9rem, 5vw, 3.3rem);
}

.home__lead,
.home__list {
  display: none;
}

.home__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  min-height: 0;
}

.home__svg {
  width: 100%;
  max-height: 100%;
  min-height: 0;
  flex: 0 1 auto;
  border-radius: var(--r-lg);
  box-shadow:
    inset 0 0 0 1px var(--line),
    var(--shadow-lg);
  background: #0b0e13;
}

.home__room {
  font-family: var(--font-mono);
  font-size: 7px;
  letter-spacing: 0.1em;
  fill: #6b7588;
}

.home__small {
  font-family: var(--font-mono);
  font-size: 6.5px;
  fill: #8a94a6;
}

.home__hud rect {
  fill: rgba(11, 14, 19, 0.75);
  stroke: rgba(232, 237, 245, 0.15);
}

.home__hud-k {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: #8a94a6;
}

.home__hud-v {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  fill: #e8edf5;
}

.home__hud-v.on {
  fill: var(--amber);
}

.home__star {
  animation: twinkle 2.6s ease-in-out infinite;
}

@keyframes twinkle {
  50% {
    opacity: 0.3;
  }
}

.home__glow {
  mix-blend-mode: screen;
  animation: glow-in 0.6s ease-out;
}

@keyframes glow-in {
  from {
    opacity: 0;
  }
}

.home__tv {
  animation: tv 1.4s steps(4) infinite;
}

@keyframes tv {
  25% {
    fill: #3aa3c9;
  }
  50% {
    fill: #5ad0f5;
  }
  75% {
    fill: #2e8fb3;
  }
}

.home__thermo {
  fill: #2b313c;
  stroke: #5a6476;
  stroke-width: 1;
  transition: fill 0.4s;
}

.home__thermo.on {
  fill: #1f3d4a;
  stroke: var(--cyan);
}

.home__ping {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: ping 1.8s ease-out infinite;
}

@keyframes ping {
  from {
    transform: scale(0.6);
    opacity: 1;
  }
  to {
    transform: scale(2.6);
    opacity: 0;
  }
}

.home__led {
  animation: led 0.9s steps(2) infinite;
}

@keyframes led {
  50% {
    opacity: 0.3;
  }
}

.home__links path {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1.2;
  stroke-dasharray: 1;
  opacity: 0.7;
}

.home__node {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1.5;
}

.home__drill .is-spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: chuck 0.12s linear infinite;
}

@keyframes chuck {
  50% {
    transform: scaleX(0.6);
  }
}

.home__dust circle {
  fill: #c3cad6;
  animation: dust 0.5s ease-out infinite;
}

.home__dust circle:nth-child(2) {
  animation-delay: 0.15s;
}

.home__dust circle:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dust {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(6px);
    opacity: 0;
  }
}

.home__items {
  animation: glow-in 0.4s ease-out;
}

/* ---------- Liste (Desktop) ---------- */
.home__list {
  list-style: none;
  margin: 26px 0 0;
  padding: 0;
  gap: 4px;
}

.home__list li {
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  opacity: 0.45;
  transition:
    background-color 0.35s,
    opacity 0.35s,
    box-shadow 0.35s;
}

.home__list li p {
  display: none;
  font-size: 0.92rem;
  color: var(--muted);
}

.home__list li.is-done {
  opacity: 0.8;
}

.home__list li.is-active {
  opacity: 1;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--line-strong);
}

.home__list li.is-active p {
  display: block;
  margin-top: 2px;
}

.home__list strong,
.home__caption strong {
  font-family: var(--font-display);
  font-weight: 600;
}

.home__num {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 8px;
  background: var(--surface-2);
  box-shadow: inset 0 0 0 1px var(--line);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
}

.home__num svg {
  width: 16px;
  height: 16px;
}

.is-active > .home__num {
  background: var(--amber);
  color: #1a1205;
  box-shadow: none;
}

.is-done > .home__num {
  background: var(--ok);
  color: #04140b;
  box-shadow: none;
}

.home__num--hint {
  animation: bob 1.4s ease-in-out infinite;
}

@keyframes bob {
  50% {
    transform: translateY(3px);
  }
}

.home__caption {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-height: 96px;
  padding: 14px 16px;
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--line);
}

.home__caption p {
  font-size: 0.9rem;
  color: var(--muted);
}

/* ---------- Badge ---------- */
.home__badge {
  position: absolute;
  bottom: 4%;
  right: 3%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 12px;
  border-radius: 12px;
  background: rgba(19, 25, 34, 0.92);
  box-shadow:
    inset 0 0 0 1px rgba(61, 220, 132, 0.4),
    var(--shadow);
  opacity: 0;
  transform: scale(0.7) translateY(-8px);
  transition:
    opacity 0.3s,
    transform 0.5s var(--ease-spring);
}

.home__badge.is-shown {
  opacity: 1;
  transform: none;
}

.home__badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 10px var(--ok);
}

.home__badge strong {
  display: block;
  font-family: var(--font-display);
  font-size: 0.98rem;
  color: var(--ok);
}

.home__badge span {
  font-size: 0.8rem;
  color: var(--muted);
}

.home__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--line);
}

.home__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--amber));
  transform-origin: left;
}

@media (min-width: 960px) {
  .home__grid {
    grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.45fr);
    grid-template-rows: 1fr;
    align-items: center;
    gap: 48px;
  }

  .home__lead {
    display: block;
  }

  .home__list {
    display: grid;
  }

  .home__caption {
    display: none;
  }
}

@media (min-width: 960px) and (max-height: 780px) {
  .home__lead {
    display: none;
  }
}
</style>
