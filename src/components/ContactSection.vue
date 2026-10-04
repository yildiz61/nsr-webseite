<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy, Mail } from '@lucide/vue'
import { site } from '@/config/site'
import { vReveal } from '@/composables/reveal'
import LinkedinIcon from './ui/LinkedinIcon.vue'

const pressed = ref(false)
const copied = ref(false)

/* Die große Enter-Taste: drücken, kurz einrasten lassen, dann E-Mail öffnen */
function press() {
  pressed.value = true
  window.setTimeout(() => {
    pressed.value = false
    window.location.href = `mailto:${site.email}`
  }, 180)
}

async function copy() {
  try {
    await navigator.clipboard.writeText(site.email)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* Zwischenablage nicht verfügbar – der mailto-Link bleibt */
  }
}
</script>

<template>
  <section id="kontakt" class="contact section bg-blueprint" aria-labelledby="contact-title">
    <div class="container contact__grid">
      <div class="contact__copy" v-reveal>
        <p class="eyebrow">Kontakt</p>
        <h2 id="contact-title" class="section-title">Lust auf <em>Fachsimpeln?</em></h2>
        <p class="section-lead">
          Über Architektur, Pipelines, Smart-Home-Setups, das beste Werkzeug für den Job – oder die nächste Japanreise.
          Schreib mir einfach, ich freue mich auf den Austausch.
        </p>

        <div class="contact__term mono">
          <p><span class="p">~$</span> cat kontakt.txt</p>
          <p>
            <span class="k">mail&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
            <button type="button" class="contact__copy-btn" :aria-label="copied ? 'Kopiert' : 'E-Mail-Adresse kopieren'" @click="copy">
              <Check v-if="copied" aria-hidden="true" />
              <Copy v-else aria-hidden="true" />
            </button>
          </p>
          <p>
            <span class="k">linkedin</span>
            <a :href="site.linkedin" target="_blank" rel="noopener">/in/nossair-ouladali</a>
          </p>
          <p><span class="k">ort&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> {{ site.location }}</p>
        </div>

        <div class="contact__actions">
          <a class="btn btn--primary" :href="`mailto:${site.email}`"><Mail aria-hidden="true" /> E-Mail schreiben</a>
          <a class="btn btn--ghost" :href="site.linkedin" target="_blank" rel="noopener"><LinkedinIcon /> LinkedIn</a>
        </div>
      </div>

      <div class="contact__key-wrap" v-reveal="120">
        <button type="button" class="key" :class="{ 'is-down': pressed }" aria-label="E-Mail schreiben" @click="press">
          <span class="key__cap">
            <span class="key__legend">↵</span>
            <span class="key__label mono">Enter</span>
          </span>
        </button>
        <p class="contact__hint mono">drück mich – öffnet dein Mailprogramm</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  gap: 56px;
  align-items: center;
}

.contact__term {
  display: grid;
  gap: 6px;
  margin-top: 28px;
  padding: 18px 20px;
  border-radius: var(--r);
  background: #0a0d12;
  box-shadow: inset 0 0 0 1px var(--line-strong);
  font-size: clamp(0.8rem, 2.2vw, 0.92rem);
  overflow-wrap: anywhere;
}

.contact__term p {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
}

.contact__term .p {
  color: var(--ok);
}

.contact__term .k {
  color: var(--faint);
}

.contact__term a {
  color: var(--cyan);
  text-decoration: none;
}

.contact__term a:hover {
  text-decoration: underline;
}

.contact__copy-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--muted);
  cursor: pointer;
}

.contact__copy-btn svg {
  width: 14px;
  height: 14px;
}

.contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

/* ---------- Enter-Taste ---------- */
.contact__key-wrap {
  display: grid;
  justify-items: center;
  gap: 22px;
}

.key {
  --depth: 16px;
  position: relative;
  width: min(280px, 70vw);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 28px;
  background: linear-gradient(180deg, #b36a00, #7a4800);
  box-shadow:
    0 var(--depth) 0 #5a3500,
    0 calc(var(--depth) + 22px) 40px -10px rgba(0, 0, 0, 0.8),
    0 0 80px -20px var(--amber-glow);
  cursor: pointer;
  transition:
    transform 0.08s,
    box-shadow 0.08s;
}

.key__cap {
  position: absolute;
  inset: 6% 8% 12%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  border-radius: 20px;
  background: linear-gradient(160deg, #ffd27a, var(--amber) 55%, #e08600);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.5),
    inset 0 -6px 14px rgba(120, 60, 0, 0.35);
}

.key__legend {
  font-size: clamp(3.5rem, 12vw, 5.5rem);
  line-height: 1;
  color: #3a2300;
}

.key__label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #5a3500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.key:hover {
  transform: translateY(2px);
  box-shadow:
    0 calc(var(--depth) - 2px) 0 #5a3500,
    0 calc(var(--depth) + 18px) 40px -10px rgba(0, 0, 0, 0.8),
    0 0 100px -16px var(--amber-glow);
}

.key.is-down,
.key:active {
  transform: translateY(var(--depth));
  box-shadow:
    0 0 0 #5a3500,
    0 8px 20px -10px rgba(0, 0, 0, 0.8),
    0 0 120px -10px var(--amber-glow);
}

.contact__hint {
  font-size: 0.78rem;
  color: var(--faint);
}

@media (min-width: 960px) {
  .contact__grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: 80px;
  }
}
</style>
