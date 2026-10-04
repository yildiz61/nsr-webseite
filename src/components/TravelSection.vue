<script setup lang="ts">
import { computed, ref } from 'vue'
import { Car, Cpu, Dices, Footprints, Hammer, MountainSnow } from '@lucide/vue'
import { vReveal } from '@/composables/reveal'
import { useScrollTicker } from '@/composables/useScrollTicker'
import { easeInOutCubic, lerp, segment } from '@/utils/anim'

const scene = ref<HTMLElement | null>(null)
const progress = ref(0)

/* Fortschritt, während die Szene durch den Viewport läuft */
useScrollTicker(() => {
  if (!scene.value) return
  const r = scene.value.getBoundingClientRect()
  const vh = window.innerHeight
  progress.value = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
})

const trainX = computed(() => lerp(-900, 1300, easeInOutCubic(segment(progress.value, 0.12, 0.88))))
const speed = computed(() => {
  const p = segment(progress.value, 0.12, 0.88)
  return Math.round(Math.sin(Math.PI * p) * 320)
})

const petals = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.83) % 7}s`,
  duration: `${7 + (i % 5)}s`,
  size: `${6 + (i % 3) * 2}px`,
}))

const hobbies = [
  { icon: Cpu, title: 'Smart Home & Raspberry Pi', text: 'Sensoren, Automationen, Dashboards – das Haus als Spielwiese.' },
  { icon: Hammer, title: 'Heimwerken & Garten', text: 'Bauen, reparieren, pflanzen. Hauptsache, am Ende hat man etwas in der Hand.' },
  { icon: Car, title: 'Autos', text: 'Technik zum Anfassen – und manchmal zum Draufschauen.' },
  { icon: MountainSnow, title: 'Skifahren', text: 'Pistenkilometer statt Pipeline-Minuten.' },
  { icon: Footprints, title: 'Wandern', text: 'Raus in die Berge, Kopf frei, Akku voll.' },
  { icon: Dices, title: 'Gesellschaftsspiele', text: 'Strategie am Küchentisch – gerne mit der ganzen Familie.' },
]
</script>

<template>
  <section id="reisen" class="travel section" aria-labelledby="travel-title">
    <div class="container">
      <header class="travel__head" v-reveal>
        <p class="eyebrow">Familie &amp; Reisen</p>
        <h2 id="travel-title" class="section-title">Die Welt entdecken – <em>am liebsten Japan.</em></h2>
        <p class="section-lead">
          Mit meiner Familie zu reisen und neue Orte zu erkunden, ist unsere große gemeinsame Leidenschaft. Ganz oben
          auf der Liste steht Japan: Präzision und Gastfreundschaft, Tradition und Hightech direkt nebeneinander – und
          Züge, die auf die Sekunde pünktlich sind. Für einen Techniker ein Traum.
        </p>
      </header>
    </div>

    <div ref="scene" class="jp" aria-hidden="true">
      <span v-for="(pt, i) in petals" :key="i" class="jp__petal" :style="{ left: pt.left, animationDelay: pt.delay, animationDuration: pt.duration, width: pt.size, height: pt.size }"></span>

      <svg class="jp__svg" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="jpSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#151a2e" />
            <stop offset="0.55" stop-color="#3a2a48" />
            <stop offset="1" stop-color="#b9604a" />
          </linearGradient>
          <linearGradient id="jpTrain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff" />
            <stop offset="1" stop-color="#cfd6e0" />
          </linearGradient>
        </defs>

        <rect width="1200" height="360" fill="url(#jpSky)" />
        <circle cx="860" cy="150" r="74" fill="#e5484d" opacity="0.92" />
        <circle cx="860" cy="150" r="120" fill="#e5484d" opacity="0.08" />

        <!-- Fuji -->
        <path d="M380 300 L612 104 Q640 92 668 104 L900 300 Z" fill="#2a2f4a" />
        <path d="M560 148 L612 104 Q640 92 668 104 L720 148 L700 140 L684 156 L664 138 L640 158 L618 138 L598 154 L582 140 Z" fill="#e8edf5" />

        <!-- Hügel -->
        <path d="M0 300 Q160 230 340 280 T700 270 T1200 260 V360 H0 Z" fill="#1d2034" />

        <!-- Torii -->
        <g transform="translate(170 196)" fill="#d63a2f">
          <rect x="-58" y="0" width="116" height="10" rx="3" />
          <path d="M-70 -6 Q0 -18 70 -6 L66 2 Q0 -8 -66 2 Z" />
          <rect x="-46" y="22" width="92" height="7" />
          <rect x="-40" y="8" width="10" height="96" />
          <rect x="30" y="8" width="10" height="96" />
        </g>

        <!-- Pagode -->
        <g transform="translate(1060 150)" fill="#151829">
          <rect x="-4" y="-34" width="8" height="30" />
          <path d="M-44 0 H44 L30 -12 H-30 Z M-38 34 H38 L26 22 H-26 Z M-32 68 H32 L22 56 H-22 Z M-26 102 H26 L18 90 H-18 Z" />
          <rect x="-16" y="0" width="32" height="150" />
        </g>

        <!-- Viadukt -->
        <rect x="0" y="292" width="1200" height="10" fill="#3d4553" />
        <rect x="0" y="288" width="1200" height="4" fill="#5a6476" />
        <rect v-for="k in 13" :key="k" :x="k * 100 - 60" y="302" width="16" height="58" fill="#2b313c" />

        <!-- Shinkansen -->
        <g :transform="`translate(${trainX} 0)`">
          <g v-for="c in 3" :key="c" :transform="`translate(${(c - 1) * 236} 0)`">
            <rect x="0" y="246" width="230" height="42" rx="6" fill="url(#jpTrain)" />
            <rect x="0" y="270" width="230" height="6" fill="#1d5fd1" />
            <rect v-for="w in 9" :key="w" :x="14 + (w - 1) * 23" y="254" width="15" height="10" rx="2" fill="#1a2030" />
          </g>
          <!-- Nase -->
          <path d="M708 246 H760 Q830 252 872 284 L872 288 H708 Z" fill="url(#jpTrain)" />
          <path d="M708 270 H820 Q840 276 856 284 H708 Z" fill="#1d5fd1" />
          <path d="M762 252 Q792 255 812 266 H762 Z" fill="#1a2030" />
          <circle cx="866" cy="282" r="2.4" fill="#fff6d8" />
          <!-- Fahrtwind -->
          <g class="jp__wind" :opacity="speed / 320">
            <path d="M-20 256 H-140 M-30 270 H-200 M-14 282 H-110" />
          </g>
        </g>
      </svg>

      <div class="jp__hud mono">
        <span>東京 → 京都</span>
        <strong>{{ speed }} <small>km/h</small></strong>
      </div>
    </div>

    <div class="container">
      <div class="travel__notes">
        <div class="note" v-reveal>
          <p class="note__k mono">ziel #1</p>
          <h3>Japan</h3>
          <p>Unsere große Familienleidenschaft – und jedes Mal wieder ein Grund, die nächste Reise zu planen.</p>
        </div>
        <div class="note" v-reveal="80">
          <p class="note__k mono">ausland</p>
          <h3>Madrid</h3>
          <p>Ein Auslandssemester an der Universidad Politécnica de Madrid – Spanisch inklusive.</p>
        </div>
        <div class="note" v-reveal="160">
          <p class="note__k mono">modus</p>
          <h3>Gemeinsam</h3>
          <p>Ob Großstadt, Berge oder Strand: Die schönsten Touren sind die, die wir zusammen machen.</p>
        </div>
      </div>

      <header class="hobbies__head" v-reveal>
        <p class="eyebrow">Hobbys</p>
        <h2 class="section-title hobbies__title">Wenn der Laptop <em>zugeklappt</em> ist.</h2>
      </header>
      <ul class="hobbies">
        <li v-for="(h, i) in hobbies" :key="h.title" class="hobby" v-reveal="(i % 3) * 70">
          <span class="hobby__icon"><component :is="h.icon" aria-hidden="true" /></span>
          <div>
            <h3>{{ h.title }}</h3>
            <p>{{ h.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.travel__head {
  max-width: 780px;
}

/* ---------- Japan-Szene ---------- */
.jp {
  position: relative;
  margin-top: clamp(40px, 6vw, 64px);
  height: clamp(260px, 38vw, 460px);
  overflow: hidden;
  border-block: 1px solid var(--line);
}

.jp__svg {
  width: 100%;
  height: 100%;
}

.jp__wind path {
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 2;
  stroke-linecap: round;
}

.jp__petal {
  position: absolute;
  top: -20px;
  z-index: 2;
  border-radius: 80% 0 80% 0;
  background: #f9c5d1;
  opacity: 0.85;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

@keyframes fall {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-40px, 240px) rotate(200deg);
  }
  100% {
    transform: translate(20px, 520px) rotate(420deg);
  }
}

.jp__hud {
  position: absolute;
  left: var(--gutter);
  top: 16px;
  z-index: 3;
  display: grid;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(11, 14, 19, 0.7);
  box-shadow: inset 0 0 0 1px var(--line-strong);
  backdrop-filter: blur(6px);
  font-size: 0.72rem;
  color: var(--muted);
}

.jp__hud strong {
  font-size: 1.5rem;
  color: var(--text);
  line-height: 1.1;
}

.jp__hud small {
  font-size: 0.75rem;
  color: var(--amber);
}

/* ---------- Notizen ---------- */
.travel__notes {
  display: grid;
  gap: 16px;
  margin-top: clamp(32px, 5vw, 48px);
}

.note {
  padding: 20px 22px;
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--line);
}

.note__k {
  font-size: 0.72rem;
  color: var(--amber);
}

.note h3 {
  margin-top: 6px;
  font-size: 1.3rem;
}

.note p:last-child {
  margin-top: 6px;
  font-size: 0.93rem;
  color: var(--muted);
}

/* ---------- Hobbys ---------- */
.hobbies__head {
  margin-top: clamp(72px, 10vw, 120px);
}

.hobbies__title {
  font-size: clamp(1.8rem, 4.4vw, 2.8rem);
}

.hobbies {
  display: grid;
  gap: 14px;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
}

.hobby {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 18px 20px;
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--line);
  transition: box-shadow 0.3s;
}

.hobby:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 176, 32, 0.35);
}

.hobby__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 10px;
  background: rgba(255, 176, 32, 0.1);
  color: var(--amber);
}

.hobby__icon svg {
  width: 22px;
  height: 22px;
}

.hobby h3 {
  font-size: 1.05rem;
}

.hobby p {
  margin-top: 4px;
  font-size: 0.9rem;
  color: var(--muted);
}

@media (min-width: 720px) {
  .travel__notes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hobbies {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .hobbies {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
