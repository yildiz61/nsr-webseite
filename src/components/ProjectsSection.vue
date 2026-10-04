<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bot, Send } from '@lucide/vue'
import { vReveal } from '@/composables/reveal'
import { useLoopTime } from '@/composables/useLoopTime'
import { workPieces } from '@/config/projects'
import { seeded } from '@/utils/anim'

/* --- Candlestick-Chart des Trading-Bots --- */
const COUNT = 28
const rnd = seeded(42)
// Beispielkurs: erst ein Dip, dann ein Anstieg – mit etwas Rauschen
let price = 58
const candles = Array.from({ length: COUNT }, (_, i) => {
  const open = price
  const close = 56 - 16 * Math.sin(((i + 1) / COUNT) * Math.PI * 1.85) + (rnd() - 0.5) * 6
  const high = Math.max(open, close) + rnd() * 4
  const low = Math.min(open, close) - rnd() * 4
  price = close
  return { open, close, high, low }
})
const lo = Math.min(...candles.map((c) => c.low))
const hi = Math.max(...candles.map((c) => c.high))
const Y = (v: number) => 150 - ((v - lo) / (hi - lo)) * 120
const W = 300 / COUNT

/* Einstiegs- und Ausstiegspunkte der Beispielstrategie */
const lowIdx = candles.reduce((m, c, i) => (i < 14 && c.low < (candles[m]?.low ?? Infinity) ? i : m), 0)
const highIdx = candles.reduce((m, c, i) => (i > lowIdx && c.high > (candles[m]?.high ?? -Infinity) ? i : m), lowIdx + 1)

const DURATION = 11
const chart = ref<HTMLElement | null>(null)
const time = useLoopTime(chart, { duration: DURATION, still: 9 })
const visible = computed(() => Math.min(COUNT, Math.floor(time.value * 3.4)))

const messages = computed(() => {
  const v = visible.value
  const out: { me: boolean; text: string }[] = []
  if (v > 4) out.push({ me: true, text: '/status' })
  if (v > 7) out.push({ me: false, text: 'Strategie aktiv · Modus: Simulation' })
  if (v > lowIdx) out.push({ me: false, text: `Signal: BUY bei Kerze #${lowIdx + 1}` })
  if (v > highIdx) out.push({ me: false, text: `Signal: SELL bei Kerze #${highIdx + 1}` })
  if (v >= COUNT) out.push({ me: true, text: '/backtest' })
  return out.slice(-4)
})
</script>

<template>
  <section id="projekte" class="projects section bg-blueprint" aria-labelledby="projects-title">
    <div class="container">
      <header class="projects__head" v-reveal>
        <p class="eyebrow">Projekte</p>
        <h2 id="projects-title" class="section-title">Werkstücke aus <em>Job, Studium &amp; Hobby.</em></h2>
        <p class="section-lead">
          Was ich baue, soll funktionieren – und zwar zuverlässig. Eine Auswahl an Dingen, die durch meine Hände (und
          über meine Tastatur) gegangen sind.
        </p>
      </header>

      <!-- Hobby-Projekt -->
      <article class="feature" v-reveal>
        <div class="feature__copy">
          <p class="feature__label mono">side-project · hobby</p>
          <h3>Der eigene Krypto-Trading-Bot</h3>
          <p>
            Eine Anwendung, die über die Börse Binance handelt: Backend in Python mit FastAPI, Frontend in React. Eigene
            Strategien lassen sich implementieren, per Backtesting prüfen und in einem Simulationslauf mit
            anschließender Visualisierung testen. Kauf- und Verkaufsaktionen steuere ich bequem per Telegram.
          </p>
          <ul class="feature__list">
            <li>Eigene Strategien</li>
            <li>Backtesting</li>
            <li>Simulation &amp; Visualisierung</li>
            <li>Steuerung per Telegram</li>
          </ul>
          <ul class="tags">
            <li class="tag">Python</li>
            <li class="tag">FastAPI</li>
            <li class="tag">React</li>
            <li class="tag">Binance API</li>
            <li class="tag">Telegram Bot</li>
          </ul>
        </div>

        <div ref="chart" class="feature__visual" aria-hidden="true">
          <div class="chart">
            <div class="chart__bar mono">
              <span>BTC/USDT · 1h</span>
              <span class="chart__mode">● simulation</span>
            </div>
            <svg viewBox="0 0 300 178" class="chart__svg">
              <path v-for="k in 4" :key="k" :d="`M0 ${k * 32} H300`" class="chart__grid" />
              <g v-for="(c, i) in candles" :key="i" class="chart__candle" :class="[c.close >= c.open ? 'up' : 'down', { on: i < visible }]">
                <line :x1="i * W + W / 2" :x2="i * W + W / 2" :y1="Y(c.high)" :y2="Y(c.low)" />
                <rect
                  :x="i * W + 2"
                  :y="Math.min(Y(c.open), Y(c.close))"
                  :width="W - 4"
                  :height="Math.max(1.5, Math.abs(Y(c.open) - Y(c.close)))"
                  rx="1"
                />
              </g>
              <g class="chart__signal buy" :class="{ on: visible > lowIdx }" :transform="`translate(${lowIdx * W + W / 2} ${Y(candles[lowIdx]!.low) + 12})`">
                <path d="M0 -6 L6 4 H-6 Z" />
                <text y="16" text-anchor="middle">BUY</text>
              </g>
              <g class="chart__signal sell" :class="{ on: visible > highIdx }" :transform="`translate(${highIdx * W + W / 2} ${Y(candles[highIdx]!.high) - 12})`">
                <path d="M0 6 L6 -4 H-6 Z" />
                <text y="-10" text-anchor="middle">SELL</text>
              </g>
            </svg>
          </div>

          <div class="tg">
            <div class="tg__head"><Bot aria-hidden="true" /> <span class="mono">trading_bot</span></div>
            <TransitionGroup name="msg" tag="ul" class="tg__list">
              <li v-for="m in messages" :key="m.text" class="tg__msg" :class="{ me: m.me }">{{ m.text }}</li>
            </TransitionGroup>
            <div class="tg__input mono"><span>Nachricht …</span><Send aria-hidden="true" /></div>
          </div>
        </div>
      </article>

      <!-- Werkstücke -->
      <ul class="pieces">
        <li v-for="(p, i) in workPieces" :key="p.id" class="piece" v-reveal="(i % 4) * 70">
          <div class="piece__top mono">
            <span>{{ p.id }}</span>
            <span>{{ p.context }}</span>
          </div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
          <ul class="tags">
            <li v-for="t in p.tags" :key="t" class="tag">{{ t }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.projects__head {
  max-width: 760px;
}

/* ---------- Feature ---------- */
.feature {
  display: grid;
  gap: 32px;
  margin-top: clamp(40px, 6vw, 64px);
  padding: clamp(20px, 4vw, 40px);
  border-radius: var(--r-lg);
  background: linear-gradient(160deg, rgba(25, 32, 43, 0.95), rgba(15, 19, 26, 0.95));
  box-shadow:
    inset 0 0 0 1px var(--line-strong),
    var(--shadow-lg);
}

.feature__label {
  font-size: 0.75rem;
  color: var(--cyan);
}

.feature h3 {
  margin-top: 10px;
  font-size: clamp(1.6rem, 3.4vw, 2.3rem);
}

.feature__copy > p:not(.feature__label) {
  margin-top: 14px;
  color: var(--muted);
}

.feature__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  margin: 20px 0;
  padding: 0;
  list-style: none;
  font-size: 0.93rem;
}

.feature__list li::before {
  content: '✓ ';
  font-family: var(--font-mono);
  color: var(--ok);
}

.feature .tags {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature__visual {
  display: grid;
  gap: 14px;
  align-content: center;
}

.chart,
.tg {
  border-radius: var(--r);
  background: #0a0d12;
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}

.chart__bar {
  display: flex;
  justify-content: space-between;
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 0.72rem;
  color: var(--muted);
}

.chart__mode {
  color: var(--amber);
}

.chart__svg {
  width: 100%;
  padding: 8px 6px 4px;
}

.chart__grid {
  stroke: var(--line);
  stroke-width: 1;
}

.chart__candle {
  opacity: 0;
  transform: scaleY(0.4);
  transform-box: fill-box;
  transform-origin: center;
  transition:
    opacity 0.25s,
    transform 0.35s var(--ease-spring);
}

.chart__candle.on {
  opacity: 1;
  transform: none;
}

.chart__candle line {
  stroke-width: 1.2;
}

.chart__candle.up line,
.chart__candle.up rect {
  stroke: var(--ok);
  fill: var(--ok);
}

.chart__candle.down line,
.chart__candle.down rect {
  stroke: var(--red);
  fill: var(--red);
}

.chart__signal {
  opacity: 0;
  transition: opacity 0.3s;
}

.chart__signal.on {
  opacity: 1;
}

.chart__signal text {
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 700;
}

.chart__signal.buy path,
.chart__signal.buy text {
  fill: var(--cyan);
}

.chart__signal.sell path,
.chart__signal.sell text {
  fill: var(--amber);
}

.tg__head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 0.78rem;
  color: var(--steel-light);
}

.tg__head svg {
  width: 16px;
  height: 16px;
  color: var(--cyan);
}

.tg__list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  min-height: 150px;
  margin: 0;
  padding: 12px;
  list-style: none;
}

.tg__msg {
  max-width: 85%;
  padding: 6px 10px;
  border-radius: 10px 10px 10px 3px;
  background: var(--surface-2);
  font-size: 0.8rem;
  color: var(--steel-light);
}

.tg__msg.me {
  align-self: flex-end;
  border-radius: 10px 10px 3px 10px;
  background: rgba(76, 201, 240, 0.18);
  font-family: var(--font-mono);
  color: var(--cyan);
}

.msg-enter-active,
.msg-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s var(--ease-out);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.msg-leave-to {
  opacity: 0;
}

.msg-leave-active {
  position: absolute;
}

.tg__input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 12px;
  border-top: 1px solid var(--line);
  font-size: 0.75rem;
  color: var(--faint);
}

.tg__input svg {
  width: 15px;
  height: 15px;
  color: var(--cyan);
}

/* ---------- Werkstücke ---------- */
.pieces {
  display: grid;
  gap: 16px;
  margin: clamp(32px, 5vw, 48px) 0 0;
  padding: 0;
  list-style: none;
}

.piece {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: var(--r);
  background: rgba(19, 25, 34, 0.9);
  box-shadow: inset 0 0 0 1px var(--line);
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s;
}

.piece::after {
  content: '';
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--amber) 0 8px, transparent 8px 14px);
  opacity: 0.5;
}

.piece:hover {
  transform: translateY(-4px);
  box-shadow: inset 0 0 0 1px rgba(255, 176, 32, 0.35);
}

.piece__top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.7rem;
  color: var(--faint);
}

.piece__top span:first-child {
  color: var(--amber);
}

.piece h3 {
  margin-top: 12px;
  font-size: 1.12rem;
}

.piece p {
  margin: 8px 0 16px;
  font-size: 0.9rem;
  color: var(--muted);
}

.piece .tags {
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .pieces {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature__visual {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
}

@media (min-width: 960px) {
  .feature {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 48px;
    align-items: center;
  }

  .feature__visual {
    grid-template-columns: 1fr;
  }

  .pieces {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  .feature__visual {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
}
</style>
