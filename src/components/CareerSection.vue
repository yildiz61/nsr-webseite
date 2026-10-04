<script setup lang="ts">
import { ref } from 'vue'
import { vReveal } from '@/composables/reveal'
import { commits } from '@/config/career'

const open = ref<Set<string>>(new Set([commits[0]?.hash ?? '']))

function toggle(hash: string) {
  const next = new Set(open.value)
  if (next.has(hash)) next.delete(hash)
  else next.add(hash)
  open.value = next
}

const hasDetails = (i: number) => Boolean(commits[i]?.bullets?.length || commits[i]?.tech?.length)
</script>

<template>
  <section id="werdegang" class="career section" aria-labelledby="career-title">
    <div class="container">
      <header class="career__head" v-reveal>
        <p class="eyebrow">Werdegang</p>
        <h2 id="career-title" class="section-title">Mein Lebenslauf als <em>git log.</em></h2>
        <p class="section-lead">
          Zwei Branches, ein Ziel: Studium der Wirtschaftsinformatik an der TU Darmstadt und Praxis von Anfang an –
          zusammengeführt in den <code>main</code>-Branch, auf dem ich heute als Senior Engineer und Architekt arbeite.
        </p>
      </header>

      <div class="term" v-reveal>
        <div class="term__bar">
          <span class="term__dots"><i></i><i></i><i></i></span>
          <span class="mono">nossair@werkbank: ~/karriere</span>
        </div>
        <p class="term__cmd mono"><span>~/karriere $</span> git log --graph --decorate --all</p>

        <ol class="log">
          <li
            v-for="(c, i) in commits"
            :key="c.hash"
            class="commit"
            :class="[`main-${c.main}`, `edu-${c.edu}`, { 'is-open': open.has(c.hash), 'is-edu': c.edu === 'dot' || c.edu === 'fork' }]"
          >
            <!-- Graph -->
            <div class="graph" aria-hidden="true">
              <span class="graph__main"></span>
              <span class="graph__edu"></span>
              <svg v-if="c.edu === 'merge'" class="graph__curve graph__curve--merge" viewBox="0 0 28 40">
                <path d="M28 40 C28 18 4 26 4 4" />
              </svg>
              <svg v-if="c.edu === 'fork'" class="graph__curve graph__curve--fork" viewBox="0 0 28 40">
                <path d="M28 0 C28 22 4 14 4 40" />
              </svg>
              <span class="graph__dot"></span>
            </div>

            <!-- Inhalt -->
            <div class="commit__body">
              <button
                v-if="hasDetails(i)"
                type="button"
                class="commit__line"
                :aria-expanded="open.has(c.hash)"
                @click="toggle(c.hash)"
              >
                <span class="commit__hash mono">{{ c.hash }}</span>
                <span v-for="r in c.refs" :key="r" class="commit__ref mono" :class="{ head: r.startsWith('HEAD') }">{{ r }}</span>
                <span class="commit__date mono">{{ c.date }}</span>
                <span class="commit__toggle mono">{{ open.has(c.hash) ? '−' : '+' }} git show</span>
              </button>
              <div v-else class="commit__line">
                <span class="commit__hash mono">{{ c.hash }}</span>
                <span v-for="r in c.refs" :key="r" class="commit__ref mono">{{ r }}</span>
                <span class="commit__date mono">{{ c.date }}</span>
              </div>
              <h3 class="commit__title">{{ c.title }}</h3>
              <p class="commit__org">{{ c.org }}</p>

              <div v-if="hasDetails(i)" class="commit__details" :hidden="!open.has(c.hash)">
                <ul v-if="c.bullets" class="commit__bullets">
                  <li v-for="b in c.bullets" :key="b">{{ b }}</li>
                </ul>
                <ul v-if="c.tech" class="tags commit__tags">
                  <li v-for="t in c.tech" :key="t" class="tag">{{ t }}</li>
                </ul>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.career {
  --main: var(--amber);
  --edu: var(--cyan);
  --lane-main: 14px;
  --lane-edu: 38px;
  --dot-y: 21px;
}

.career__head {
  max-width: 760px;
}

.career__head code {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--surface-2);
  font-size: 0.9em;
  color: var(--amber);
}

.term {
  margin-top: clamp(40px, 6vw, 64px);
  border-radius: var(--r-lg);
  background: #0a0d12;
  box-shadow:
    inset 0 0 0 1px var(--line-strong),
    var(--shadow-lg);
  overflow: hidden;
}

.term__bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  font-size: 0.76rem;
  color: var(--faint);
}

.term__dots {
  display: flex;
  gap: 6px;
}

.term__dots i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ff5f57;
}

.term__dots i:nth-child(2) {
  background: #febc2e;
}

.term__dots i:nth-child(3) {
  background: #28c840;
}

.term__cmd {
  padding: 18px clamp(16px, 3vw, 28px) 6px;
  font-size: 0.85rem;
  color: var(--steel-light);
}

.term__cmd span {
  color: var(--ok);
}

.log {
  margin: 0;
  padding: 8px clamp(10px, 3vw, 28px) 28px;
  list-style: none;
}

.commit {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
}

/* ---------- Graph ---------- */
.graph {
  position: relative;
}

.graph__main,
.graph__edu {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
}

.graph__main {
  left: calc(var(--lane-main) - 1px);
  background: var(--main);
}

.graph__edu {
  left: calc(var(--lane-edu) - 1px);
  background: var(--edu);
  display: none;
}

.main-head .graph__main {
  top: var(--dot-y);
}

.main-root .graph__main {
  bottom: auto;
  height: var(--dot-y);
}

.edu-line .graph__edu,
.edu-dot .graph__edu {
  display: block;
}

.edu-fork .graph__edu {
  display: block;
  bottom: auto;
  height: var(--dot-y);
}

.edu-merge .graph__edu {
  display: block;
  top: calc(var(--dot-y) + 36px);
}

.graph__curve {
  position: absolute;
  left: calc(var(--lane-main) - 4px);
  width: 28px;
  height: 40px;
  overflow: visible;
}

.graph__curve path {
  fill: none;
  stroke: var(--edu);
  stroke-width: 2;
}

.graph__curve--merge {
  top: calc(var(--dot-y) - 4px);
}

.graph__curve--fork {
  top: var(--dot-y);
}

.graph__dot {
  position: absolute;
  top: calc(var(--dot-y) - 6px);
  left: calc(var(--lane-main) - 6px);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0a0d12;
  border: 2.5px solid var(--main);
}

.main-line .graph__dot {
  display: none;
}

.edu-dot .graph__dot,
.edu-fork .graph__dot {
  display: block;
  left: calc(var(--lane-edu) - 6px);
  border-color: var(--edu);
}

.main-head .graph__dot {
  background: var(--main);
  box-shadow: 0 0 0 4px rgba(255, 176, 32, 0.2);
}

/* ---------- Inhalt ---------- */
.commit__body {
  padding: 10px 0 22px;
  min-width: 0;
}

.commit__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  font-size: 0.78rem;
}

button.commit__line {
  cursor: pointer;
}

.commit__hash {
  color: var(--amber);
}

.is-edu .commit__hash {
  color: var(--cyan);
}

.commit__ref {
  padding: 1px 7px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(76, 201, 240, 0.4);
  color: var(--cyan);
  font-size: 0.7rem;
}

.commit__ref.head {
  box-shadow: none;
  background: var(--amber);
  color: #1a1205;
  font-weight: 700;
}

.commit__date {
  color: var(--faint);
}

.commit__toggle {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.7rem;
  transition:
    color 0.2s,
    background 0.2s;
}

button.commit__line:hover .commit__toggle {
  color: var(--amber);
  background: rgba(255, 176, 32, 0.12);
}

.commit__title {
  margin-top: 8px;
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
}

.is-edu .commit__title,
.edu-merge .commit__title {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  letter-spacing: 0;
}

.commit__org {
  margin-top: 3px;
  font-size: 0.92rem;
  color: var(--muted);
}

.commit__details {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--line);
  animation: open 0.35s var(--ease-out);
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

.commit__bullets {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.93rem;
  color: var(--steel-light);
}

.commit__bullets li {
  position: relative;
  padding-left: 20px;
}

.commit__bullets li::before {
  content: '+';
  position: absolute;
  left: 0;
  font-family: var(--font-mono);
  color: var(--ok);
}

.commit__tags {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 720px) {
  .commit {
    grid-template-columns: 64px minmax(0, 1fr);
  }
}
</style>
