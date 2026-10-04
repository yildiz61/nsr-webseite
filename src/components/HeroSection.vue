<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowDown, Mail } from '@lucide/vue'
import LinkedinIcon from './ui/LinkedinIcon.vue'
import { site } from '@/config/site'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import portrait640 from '@/assets/img/nossair-640.webp'
import portrait1088 from '@/assets/img/nossair-1088.webp'

const props = defineProps<{ ready: boolean }>()

/* --- Rotierende Rollen im Terminal --- */
const roles = ['Software Engineer', 'Architekt', 'Smart-Home-Tüftler', 'Heimwerker', 'Japan-Fan', 'Familienmensch']
const typed = ref(roles[0] ?? '')
let roleTimer = 0

function cycleRoles() {
  let r = 0
  let i = typed.value.length
  let deleting = true
  const tick = () => {
    const word = roles[r] ?? ''
    let delay: number
    if (deleting) {
      i--
      delay = 40
      if (i <= 0) {
        deleting = false
        r = (r + 1) % roles.length
        delay = 350
      }
    } else {
      i++
      delay = 80
      if (i >= word.length) {
        deleting = true
        delay = 2000
      }
    }
    typed.value = (roles[r] ?? '').slice(0, Math.max(0, i))
    roleTimer = window.setTimeout(tick, delay)
  }
  roleTimer = window.setTimeout(tick, 2400)
}

/* --- Stirnlampe folgt der Maus --- */
const hero = ref<HTMLElement | null>(null)
const lamp = ref({ x: 70, y: 30 })

function onMove(e: PointerEvent) {
  if (!hero.value || e.pointerType !== 'mouse') return
  const r = hero.value.getBoundingClientRect()
  lamp.value = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
}

onMounted(() => {
  if (!prefersReducedMotion()) cycleRoles()
})
onBeforeUnmount(() => clearTimeout(roleTimer))

const spot = computed(() => ({ '--lx': `${lamp.value.x}%`, '--ly': `${lamp.value.y}%` }))
const years = new Date().getFullYear() - site.codingSince

const specs = [
  { k: 'Modell', v: site.name },
  { k: 'Typ', v: 'Senior Engineer & Architekt' },
  { k: 'Standort', v: site.location },
  { k: 'Im Code seit', v: String(site.codingSince) },
  { k: 'Schnittstellen', v: 'DE · EN · ES' },
  { k: 'Firmware', v: 'Python · Java · Shell' },
  { k: 'Zubehör', v: 'Mech. Tastatur, Stirnlampe, Akku-Laubbläser' },
]
</script>

<template>
  <section id="top" ref="hero" class="hero bg-blueprint" :class="{ 'is-ready': props.ready }" :style="spot" @pointermove="onMove">
    <div class="hero__spot" aria-hidden="true"></div>

    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__status mono"><span class="hero__dot"></span> online · {{ site.location }}</p>
        <h1 class="hero__title">
          <span class="hero__name">{{ site.name }}</span>
          <span class="hero__claim">Ich baue Systeme – <em>und alles andere auch.</em></span>
        </h1>

        <p class="hero__term mono" aria-label="Rollen: Software Engineer, Architekt, Smart-Home-Tüftler, Heimwerker, Japan-Fan, Familienmensch">
          <span class="hero__prompt">~$</span> whoami <span class="hero__arrow">→</span>
          <span class="hero__role" aria-hidden="true">{{ typed }}</span><span class="hero__caret" aria-hidden="true"></span>
        </p>

        <p class="hero__lead">
          Tagsüber entwerfe und entwickle ich als {{ site.role }} bei der {{ site.employer }} Anwendungen rund um
          Finanzmodelle, Pipelines und Cloud. Nach Feierabend tüftle ich am eigenen Haus, am Smart Home oder plane mit
          meiner Familie die nächste Reise. Der gemeinsame Nenner: gutes Werkzeug und die Lust, Dinge wirklich zu
          verstehen.
        </p>

        <div class="hero__actions">
          <a class="btn btn--primary" href="#skills">Zur Werkzeugwand <ArrowDown aria-hidden="true" /></a>
          <a class="btn btn--ghost" :href="`mailto:${site.email}`"><Mail aria-hidden="true" /> Schreib mir</a>
          <a class="btn btn--ghost hero__icon-btn" :href="site.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn-Profil">
            <LinkedinIcon />
          </a>
        </div>
      </div>

      <!-- Datenblatt -->
      <figure class="spec">
        <div class="spec__head mono">
          <span>DATENBLATT</span>
          <span>REV. {{ new Date().getFullYear() }}</span>
        </div>
        <div class="spec__photo">
          <img
            :src="portrait640"
            :srcset="`${portrait640} 640w, ${portrait1088} 1088w`"
            sizes="(min-width: 960px) 420px, 90vw"
            width="640"
            height="850"
            alt="Porträt von Nossair Ouladali am See vor Bergkulisse"
            fetchpriority="high"
          />
          <span class="spec__crop spec__crop--tl"></span>
          <span class="spec__crop spec__crop--tr"></span>
          <span class="spec__crop spec__crop--bl"></span>
          <span class="spec__crop spec__crop--br"></span>
          <span class="spec__dim spec__dim--v mono" aria-hidden="true"><i>1 Tüftler</i></span>
        </div>
        <dl class="spec__table">
          <div v-for="s in specs" :key="s.k">
            <dt class="mono">{{ s.k }}</dt>
            <dd>{{ s.v }}</dd>
          </div>
        </dl>
      </figure>
    </div>

    <div class="container">
      <ul class="hero__stats">
        <li><strong>{{ years }}+</strong><span>Jahre Softwareentwicklung</span></li>
        <li><strong>1,0</strong><span>Masterarbeit zu Machine Learning</span></li>
        <li><strong>3</strong><span>Sprachen: Deutsch, Englisch, Spanisch</span></li>
        <li><strong>∞</strong><span>Werkzeuge – und es werden mehr</span></li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-top: calc(var(--header-h) + clamp(32px, 6vw, 72px));
  padding-bottom: clamp(48px, 6vw, 72px);
  overflow: hidden;
  isolation: isolate;
}

.hero__spot {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(520px circle at var(--lx) var(--ly), rgba(255, 176, 32, 0.13), transparent 60%);
  transition: background 0.08s;
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 160px;
  z-index: -1;
  background: linear-gradient(transparent, var(--bg));
}

.hero__grid {
  display: grid;
  gap: 48px;
  align-items: center;
}

.hero__copy > * {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.9s var(--ease-out),
    transform 0.9s var(--ease-out);
}

.is-ready .hero__copy > * {
  opacity: 1;
  transform: none;
}

.is-ready .hero__copy > :nth-child(2) {
  transition-delay: 0.08s;
}

.is-ready .hero__copy > :nth-child(3) {
  transition-delay: 0.16s;
}

.is-ready .hero__copy > :nth-child(4) {
  transition-delay: 0.24s;
}

.is-ready .hero__copy > :nth-child(5) {
  transition-delay: 0.32s;
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(61, 220, 132, 0.08);
  box-shadow: inset 0 0 0 1px rgba(61, 220, 132, 0.25);
  font-size: 0.78rem;
  color: var(--ok);
}

.hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 0 0 rgba(61, 220, 132, 0.6);
  animation: ping 2s infinite;
}

@keyframes ping {
  70% {
    box-shadow: 0 0 0 8px rgba(61, 220, 132, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(61, 220, 132, 0);
  }
}

.hero__title {
  margin-top: 22px;
}

.hero__name {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--steel-light);
}

.hero__claim {
  display: block;
  margin-top: 12px;
  font-size: clamp(2.5rem, 7vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
}

.hero__claim em {
  font-style: normal;
  color: var(--amber);
  text-shadow: 0 0 40px rgba(255, 176, 32, 0.25);
}

.hero__term {
  margin-top: 22px;
  font-size: clamp(0.88rem, 2vw, 1rem);
  color: var(--muted);
}

.hero__prompt {
  color: var(--ok);
}

.hero__arrow {
  color: var(--faint);
}

.hero__role {
  margin-left: 0.5em;
  color: var(--cyan);
}

.hero__caret {
  display: inline-block;
  width: 0.6em;
  height: 1.15em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: var(--amber);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.hero__lead {
  margin-top: 20px;
  max-width: 58ch;
  font-size: clamp(1.02rem, 1.6vw, 1.14rem);
  color: var(--muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero__icon-btn {
  width: 50px;
  padding: 0;
}

/* ---------- Datenblatt ---------- */
.spec {
  position: relative;
  margin: 0;
  width: 100%;
  max-width: 440px;
  justify-self: center;
  padding: 14px;
  border-radius: var(--r-lg);
  background: rgba(19, 25, 34, 0.85);
  box-shadow:
    inset 0 0 0 1px var(--line-strong),
    var(--shadow-lg);
  backdrop-filter: blur(6px);
  transform: rotate(1.2deg);
  transition: transform 0.5s var(--ease-out);
}

.spec:hover {
  transform: rotate(0deg) translateY(-4px);
}

.spec__head {
  display: flex;
  justify-content: space-between;
  padding: 2px 4px 12px;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--amber);
}

.spec__photo {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--surface-2);
}

.spec__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 22%;
  filter: saturate(0.92) contrast(1.04);
}

.spec__crop {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--amber);
}

.spec__crop--tl {
  top: 10px;
  left: 10px;
  border-right: 0;
  border-bottom: 0;
}

.spec__crop--tr {
  top: 10px;
  right: 10px;
  border-left: 0;
  border-bottom: 0;
}

.spec__crop--bl {
  bottom: 10px;
  left: 10px;
  border-right: 0;
  border-top: 0;
}

.spec__crop--br {
  bottom: 10px;
  right: 10px;
  border-left: 0;
  border-top: 0;
}

.spec__dim--v {
  position: absolute;
  top: 36px;
  bottom: 36px;
  right: 18px;
  width: 1px;
  background: rgba(255, 255, 255, 0.6);
}

.spec__dim--v::before,
.spec__dim--v::after {
  content: '';
  position: absolute;
  left: -5px;
  width: 11px;
  height: 1px;
  background: rgba(255, 255, 255, 0.8);
}

.spec__dim--v::before {
  top: 0;
}

.spec__dim--v::after {
  bottom: 0;
}

.spec__dim--v i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(11, 14, 19, 0.75);
  font-style: normal;
  font-size: 0.65rem;
  white-space: nowrap;
  color: #fff;
}

.spec__table {
  display: grid;
  margin: 12px 0 0;
  font-size: 0.86rem;
}

.spec__table div {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 10px;
  padding: 6px 4px;
  border-top: 1px dashed var(--line);
}

.spec__table dt {
  font-size: 0.72rem;
  color: var(--faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-top: 2px;
}

.spec__table dd {
  margin: 0;
  color: var(--steel-light);
}

/* ---------- Stats ---------- */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: clamp(48px, 7vw, 80px) 0 0;
  padding: 0;
  list-style: none;
  border-radius: var(--r);
  background: var(--line);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--line);
}

.hero__stats li {
  display: grid;
  gap: 4px;
  padding: 18px 20px;
  background: rgba(15, 19, 26, 0.92);
}

.hero__stats strong {
  font-family: var(--font-mono);
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  font-weight: 700;
  color: var(--amber);
  line-height: 1.1;
}

.hero__stats span {
  font-size: 0.86rem;
  color: var(--muted);
}

@media (min-width: 960px) {
  .hero {
    min-height: 100vh;
    min-height: 100svh;
  }

  .hero__grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr);
    gap: 64px;
  }

  .hero__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
