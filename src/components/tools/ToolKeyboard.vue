<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'

/** Mechanische Tastatur: tippt einen Pricing-Service – jede Taste wird sichtbar gedrückt. */
const CODE = `def fixing(asset="BTC"):
    quotes = feed.latest(asset)
    return median(quotes)`

const CPS = 15 // Anschläge pro Sekunde
const START = 0.5
const TYPE_END = START + CODE.length / CPS
const DURATION = TYPE_END + 2.4

const root = ref<HTMLElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: TYPE_END + 0.5 })

const strokes = computed(() => (time.value - START) * CPS)
const typed = computed(() => Math.max(0, Math.min(CODE.length, Math.floor(strokes.value) + 1)))
const pressedChar = computed(() => {
  const s = strokes.value
  if (s < 0 || s >= CODE.length) return ''
  return s % 1 < 0.6 ? (CODE[Math.floor(s)] ?? '') : ''
})

/* --- Syntax-Highlighting über Tokens, die bis zur getippten Länge gekürzt werden --- */
interface Token {
  text: string
  cls: string
}
const tokens: Token[] = []
for (const m of CODE.matchAll(/(\bdef\b|\breturn\b)|("[^"]*")|(\w+)(?=\()|(\n)|([\w]+)|([^\w\n])/g)) {
  const [text, kw, str, fn, nl] = m
  tokens.push({ text, cls: kw ? 'kw' : str ? 'str' : fn ? 'fn' : nl ? 'nl' : '' })
}

const visibleTokens = computed(() => {
  let left = typed.value
  const out: Token[] = []
  for (const t of tokens) {
    if (left <= 0) break
    out.push({ text: t.text.slice(0, left), cls: t.cls })
    left -= t.text.length
  }
  return out
})

/* --- Tastatur --- */
const rows = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '⏎'],
  ['y', 'x', 'c', 'v', 'b', 'n', 'm', '(', ')', '='],
]

function isPressed(key: string) {
  const c = pressedChar.value.toLowerCase()
  if (!c) return false
  if (key === '⏎') return c === '\n'
  if (key === 'space') return c === ' '
  if (key === '=') return c === '=' || c === '"' || c === '.' || c === ':' || c === '_'
  return key === c
}
</script>

<template>
  <div ref="root" class="kb" aria-hidden="true">
    <div class="kb__editor">
      <div class="kb__bar"><i></i><i></i><i></i><span>pricing/fixing.py</span></div>
      <pre class="kb__code"><code><template v-for="(t, i) in visibleTokens" :key="i"><span v-if="t.cls !== 'nl'" :class="t.cls">{{ t.text }}</span><template v-else>{{ '\n' }}</template></template><span class="kb__caret"></span></code></pre>
    </div>

    <div class="kb__board">
      <div v-for="(row, r) in rows" :key="r" class="kb__row" :style="{ paddingLeft: `${r * 4}%` }">
        <span v-for="k in row" :key="k" class="kb__key" :class="{ 'is-down': isPressed(k), 'kb__key--accent': k === '⏎' }">
          {{ k }}
        </span>
      </div>
      <div class="kb__row kb__row--space">
        <span class="kb__key kb__key--mod">fn</span>
        <span class="kb__key kb__key--space" :class="{ 'is-down': isPressed('space') }"></span>
        <span class="kb__key kb__key--mod">alt</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 12px 14px 16px;
}

.kb__editor {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  background: #0a0d12;
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}

.kb__bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--faint);
}

.kb__bar i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--surface-3);
}

.kb__bar span {
  margin-left: 6px;
}

.kb__code {
  margin: 0;
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: clamp(0.6rem, 2.6vw, 0.7rem);
  line-height: 1.6;
  color: var(--steel-light);
  white-space: pre;
}

.kw {
  color: #c792ea;
}

.str {
  color: var(--ok);
}

.fn {
  color: var(--cyan);
}

.kb__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--amber);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.kb__board {
  display: grid;
  gap: 4px;
  padding: 8px;
  border-radius: 10px;
  background: linear-gradient(180deg, #2a313d, #1a1f28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 18px -8px rgba(0, 0, 0, 0.8);
}

.kb__row {
  display: flex;
  gap: 4px;
}

.kb__key {
  display: grid;
  place-items: center;
  flex: 1;
  min-width: 0;
  height: 19px;
  border-radius: 4px;
  background: linear-gradient(180deg, #e9ecf1, #c9ced8);
  box-shadow:
    0 3px 0 #7b8291,
    0 4px 3px rgba(0, 0, 0, 0.45);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 600;
  color: #3a404c;
  transition:
    transform 0.05s,
    box-shadow 0.05s,
    background 0.05s;
}

.kb__key--accent,
.kb__key--mod {
  background: linear-gradient(180deg, #ffc04d, var(--amber-strong));
  box-shadow:
    0 3px 0 #9a5a00,
    0 4px 3px rgba(0, 0, 0, 0.45);
  color: #3a2300;
}

.kb__key--mod {
  flex: 0 0 13%;
  background: linear-gradient(180deg, #5a6272, #3d4452);
  box-shadow:
    0 3px 0 #22272f,
    0 4px 3px rgba(0, 0, 0, 0.45);
  color: var(--steel-light);
}

.kb__key--space {
  flex: 1;
}

.kb__row--space {
  padding-inline: 12%;
}

.kb__key.is-down {
  transform: translateY(3px);
  box-shadow:
    0 0 0 #7b8291,
    0 0 0 rgba(0, 0, 0, 0.45),
    0 0 10px var(--amber-glow);
  background: linear-gradient(180deg, #fff6e0, #ffd88a);
}
</style>
