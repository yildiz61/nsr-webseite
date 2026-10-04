<script setup lang="ts">
import { site } from '@/config/site'
import type { LegalPage } from './LegalDialog.vue'
import BrandMark from './ui/BrandMark.vue'

defineEmits<{ legal: [page: LegalPage] }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <BrandMark class="footer__mark" />
        <div>
          <strong>{{ site.name }}</strong>
          <p class="mono">gebaut mit Vue 3 · TypeScript · viel Kaffee</p>
        </div>
      </div>

      <nav class="footer__nav" aria-label="Rechtliches">
        <button type="button" @click="$emit('legal', 'impressum')">Impressum</button>
        <button type="button" @click="$emit('legal', 'datenschutz')">Datenschutz</button>
        <a :href="site.linkedin" target="_blank" rel="noopener">LinkedIn</a>
      </nav>

      <p class="footer__copy mono">© {{ year }} {{ site.name }} · exit 0</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: 36px calc(36px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.footer__inner {
  display: grid;
  gap: 22px;
  align-items: center;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer__mark {
  width: 40px;
  height: 40px;
}

.footer__brand strong {
  font-family: var(--font-display);
}

.footer__brand p {
  font-size: 0.75rem;
  color: var(--faint);
}

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
}

.footer__nav button,
.footer__nav a {
  padding: 4px 0;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--muted);
  text-decoration: none;
  cursor: pointer;
}

.footer__nav button:hover,
.footer__nav a:hover {
  color: var(--amber);
}

.footer__copy {
  font-size: 0.75rem;
  color: var(--faint);
}

@media (min-width: 900px) {
  .footer__inner {
    grid-template-columns: 1fr auto auto;
    gap: 40px;
  }
}
</style>
