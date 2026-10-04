<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from '@lucide/vue'
import { useScrollTicker } from '@/composables/useScrollTicker'
import BrandMark from './ui/BrandMark.vue'

const nav = [
  { href: '#skills', label: 'Skills' },
  { href: '#werdegang', label: 'Werdegang' },
  { href: '#projekte', label: 'Projekte' },
  { href: '#zuhause', label: 'Zuhause' },
  { href: '#reisen', label: 'Reisen' },
]

const scrolled = ref(false)
const progress = ref(0)
const open = ref(false)

useScrollTicker((y) => {
  scrolled.value = y > 12
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, y / max) : 0
})

function close() {
  open.value = false
}
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled || open, 'is-open': open }">
    <div class="container header__inner">
      <a href="#top" class="header__brand" aria-label="Nossair Ouladali – zum Seitenanfang" @click="close">
        <BrandMark class="header__mark" />
        <span class="header__name">
          <strong>Nossair Ouladali</strong>
          <span class="mono">~/portfolio</span>
        </span>
      </a>

      <nav id="main-nav" class="header__nav" aria-label="Hauptnavigation">
        <a v-for="n in nav" :key="n.href" :href="n.href" @click="close">{{ n.label }}</a>
        <a href="#kontakt" class="btn btn--primary header__cta" @click="close">Kontakt</a>
      </nav>

      <button
        type="button"
        class="header__toggle"
        :aria-expanded="open"
        aria-controls="main-nav"
        :aria-label="open ? 'Menü schließen' : 'Menü öffnen'"
        @click="open = !open"
      >
        <X v-if="open" aria-hidden="true" />
        <Menu v-else aria-hidden="true" />
      </button>
    </div>
    <div class="header__progress" aria-hidden="true">
      <span :style="{ transform: `scaleX(${progress})` }"></span>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  transition:
    background-color 0.3s,
    box-shadow 0.3s,
    backdrop-filter 0.3s;
}

.header.is-scrolled {
  background: rgba(11, 14, 19, 0.82);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow: 0 1px 0 var(--line);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.header__mark {
  width: 38px;
  height: 38px;
  transition: transform 0.6s var(--ease-out);
}

.header__brand:hover .header__mark {
  transform: rotate(60deg);
}

.header__name {
  display: grid;
  line-height: 1.15;
}

.header__name strong {
  font-family: var(--font-display);
  font-weight: 600;
}

.header__name .mono {
  font-size: 0.72rem;
  color: var(--faint);
}

.header__nav {
  position: fixed;
  inset: var(--header-h) 0 auto;
  display: grid;
  gap: 4px;
  padding: 16px var(--gutter) 24px;
  background: rgba(11, 14, 19, 0.97);
  box-shadow: 0 1px 0 var(--line);
  transform: translateY(-8px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s,
    transform 0.25s var(--ease-out),
    visibility 0s linear 0.25s;
}

.is-open .header__nav {
  transform: none;
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

.header__nav a:not(.btn) {
  padding: 12px 4px;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid var(--line);
}

.header__nav a:not(.btn)::before {
  content: './';
  color: var(--faint);
}

.header__nav a:not(.btn):hover {
  color: var(--amber);
}

.header__cta {
  margin-top: 12px;
  min-height: 44px;
}

.header__toggle {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: var(--surface-2);
  box-shadow: inset 0 0 0 1px var(--line);
  cursor: pointer;
}

.header__toggle svg {
  width: 22px;
  height: 22px;
}

.header__progress {
  position: absolute;
  inset: auto 0 0;
  height: 2px;
}

.header__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--amber));
  transform-origin: left;
}

@media (min-width: 960px) {
  .header__nav {
    position: static;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    background: none;
    box-shadow: none;
    transform: none;
    opacity: 1;
    visibility: visible;
  }

  .header__nav a:not(.btn) {
    padding: 8px 12px;
    border: 0;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  .header__nav a:not(.btn):hover {
    background: var(--surface-2);
  }

  .header__cta {
    margin: 0 0 0 10px;
  }

  .header__toggle {
    display: none;
  }
}
</style>
