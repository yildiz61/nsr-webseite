<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Intro: Der Laptop wird aufgeklappt, bootet die Werkbank
 * und die Kamera fährt in den Bildschirm – dahinter liegt die Seite.
 */
const emit = defineEmits<{ reveal: []; done: [] }>()

type Phase = 'closed' | 'open' | 'boot' | 'zoom' | 'gone'
const phase = ref<Phase>('closed')
const lines = [
  { cmd: 'ssh nossair@werkbank', out: 'verbunden' },
  { cmd: 'toolbox --load', out: 'tastatur · zollstock · schraubendreher' },
  { cmd: 'stirnlampe --on', out: 'ok' },
  { cmd: './portfolio.sh', out: 'starte …' },
]
const shown = ref(0)
const timers: number[] = []

function at(ms: number, fn: () => void) {
  timers.push(window.setTimeout(fn, ms))
}

function finish() {
  timers.forEach(clearTimeout)
  timers.length = 0
  phase.value = 'gone'
  emit('reveal')
  emit('done')
}

function skip() {
  finish()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  at(250, () => (phase.value = 'open'))
  at(1250, () => (phase.value = 'boot'))
  lines.forEach((_, i) => at(1450 + i * 330, () => (shown.value = i + 1)))
  at(1450 + lines.length * 330 + 250, () => {
    phase.value = 'zoom'
    emit('reveal')
  })
  at(1450 + lines.length * 330 + 1150, finish)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  timers.forEach(clearTimeout)
})
</script>

<template>
  <div class="intro" :class="`is-${phase}`" role="presentation" @click="skip">
    <div class="intro__scene">
      <div class="laptop">
        <div class="laptop__lid">
          <div class="laptop__screen">
            <div class="laptop__term">
              <p v-for="(l, i) in lines.slice(0, shown)" :key="i">
                <span class="p">~$</span> {{ l.cmd }}<br />
                <span class="o">→ {{ l.out }}</span>
              </p>
              <span v-if="phase === 'boot'" class="laptop__caret"></span>
            </div>
          </div>
          <span class="laptop__cam"></span>
        </div>
        <div class="laptop__base">
          <span class="laptop__notch"></span>
        </div>
      </div>
      <p class="intro__hint mono">nossair@werkbank</p>
    </div>

    <button type="button" class="intro__skip" @click.stop="skip">Intro überspringen ↵</button>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background:
    radial-gradient(60% 50% at 50% 55%, rgba(76, 201, 240, 0.08), transparent 70%),
    var(--bg);
  transition:
    opacity 0.7s ease 0.3s,
    visibility 0s linear 1s;
  cursor: pointer;
}

.intro.is-zoom,
.intro.is-gone {
  opacity: 0;
  visibility: hidden;
}

.intro__scene {
  display: grid;
  justify-items: center;
  gap: 28px;
  perspective: 1400px;
  transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1);
}

.is-zoom .intro__scene {
  transform: scale(9) translateY(8%);
}

.laptop {
  width: min(560px, 84vw);
  transform-style: preserve-3d;
}

.laptop__lid {
  position: relative;
  aspect-ratio: 16 / 10.4;
  padding: 3.2%;
  border-radius: 14px 14px 4px 4px;
  background: linear-gradient(180deg, #2b313c, #1a1f28);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 -10px 60px -20px rgba(76, 201, 240, 0.25);
  transform-origin: 50% 100%;
  transform: rotateX(-88deg);
  transition: transform 1s cubic-bezier(0.3, 1.25, 0.5, 1);
}

.is-open .laptop__lid,
.is-boot .laptop__lid,
.is-zoom .laptop__lid {
  transform: rotateX(-4deg);
}

.laptop__screen {
  height: 100%;
  border-radius: 6px;
  background: #05070a;
  overflow: hidden;
  transition:
    background 0.6s,
    box-shadow 0.6s;
}

.is-boot .laptop__screen,
.is-zoom .laptop__screen {
  background: radial-gradient(120% 120% at 50% 0%, #0f1a24, #06090d);
  box-shadow: inset 0 0 40px rgba(76, 201, 240, 0.15);
}

.laptop__term {
  padding: 5% 6%;
  font-family: var(--font-mono);
  font-size: clamp(0.62rem, 2.2vw, 0.9rem);
  line-height: 1.55;
  color: var(--steel-light);
}

.laptop__term p {
  margin-bottom: 0.5em;
  animation: line-in 0.25s ease-out both;
}

.laptop__term .p {
  color: var(--ok);
}

.laptop__term .o {
  color: var(--faint);
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}

.laptop__caret {
  display: inline-block;
  width: 0.6em;
  height: 1.1em;
  background: var(--amber);
  animation: blink 0.8s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.laptop__cam {
  position: absolute;
  top: 1.2%;
  left: 50%;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: #0a0d12;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.laptop__base {
  position: relative;
  height: 16px;
  margin-inline: -7%;
  border-radius: 2px 2px 14px 14px;
  background: linear-gradient(180deg, #c3cad6, #6b7383 60%, #3d4553);
  box-shadow: 0 24px 40px -12px rgba(0, 0, 0, 0.9);
}

.laptop__notch {
  position: absolute;
  top: 0;
  left: 50%;
  width: 18%;
  height: 6px;
  margin-left: -9%;
  border-radius: 0 0 8px 8px;
  background: #8a94a6;
}

.intro__hint {
  font-size: 0.8rem;
  color: var(--faint);
  letter-spacing: 0.08em;
}

.intro__skip {
  position: absolute;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: var(--surface-2);
  box-shadow: inset 0 0 0 1px var(--line);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--muted);
  cursor: pointer;
}

.intro__skip:hover {
  color: var(--text);
}
</style>
