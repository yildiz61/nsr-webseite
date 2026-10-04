<script setup lang="ts">
import { ref } from 'vue'
import { X } from '@lucide/vue'
import { site } from '@/config/site'

export type LegalPage = 'impressum' | 'datenschutz'

const dialog = ref<HTMLDialogElement | null>(null)
const page = ref<LegalPage>('impressum')

function open(p: LegalPage) {
  page.value = p
  dialog.value?.showModal()
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="legal" :aria-label="page === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'" @click.self="dialog?.close()">
    <div class="legal__inner">
      <button type="button" class="legal__close" aria-label="Schließen" @click="dialog?.close()">
        <X aria-hidden="true" />
      </button>

      <template v-if="page === 'impressum'">
        <h2>Impressum</h2>
        <h3>Verantwortlich für den Inhalt</h3>
        <p>
          {{ site.name }}<br />
          <template v-if="site.legalAddress.street">
            {{ site.legalAddress.street }}<br />
            {{ site.legalAddress.zipCity }}<br />
          </template>
          <template v-else>{{ site.location }}<br /></template>
          E-Mail: <a :href="`mailto:${site.email}`">{{ site.email }}</a>
        </p>
        <h3>Hinweis</h3>
        <p>
          Dies ist eine private, nicht kommerzielle Portfolio-Webseite. Sie dient ausschließlich der persönlichen
          Vorstellung und bietet keine Waren oder Dienstleistungen an.
        </p>
        <h3>Haftung für Links</h3>
        <p>
          Diese Website enthält Links zu externen Websites Dritter (z. B. LinkedIn), auf deren Inhalte ich keinen
          Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
        </p>
      </template>

      <template v-else>
        <h2>Datenschutzerklärung</h2>
        <h3>Verantwortlicher</h3>
        <p>
          {{ site.name }}, E-Mail: <a :href="`mailto:${site.email}`">{{ site.email }}</a>
        </p>
        <h3>Hosting & Server-Logfiles</h3>
        <p>
          Diese Website wird über GitHub Pages (GitHub, Inc., USA) bereitgestellt. Beim Aufruf verarbeitet der
          Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite,
          Browser). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO – das berechtigte Interesse an einem sicheren und
          stabilen Betrieb.
        </p>
        <h3>Keine Cookies, kein Tracking</h3>
        <p>
          Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge. Schriftarten werden
          lokal ausgeliefert, es werden dafür keine Verbindungen zu Drittanbietern hergestellt.
        </p>
        <h3>Externe Links</h3>
        <p>
          Beim Klick auf den Link zu LinkedIn (LinkedIn Ireland Unlimited Company) verlassen Sie diese Website. Für die
          dortige Datenverarbeitung gelten die Datenschutzhinweise von LinkedIn.
        </p>
        <h3>Kontaktaufnahme</h3>
        <p>
          Wenn Sie mich per E-Mail kontaktieren, verarbeite ich Ihre Angaben ausschließlich zur Bearbeitung Ihrer
          Anfrage (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <h3>Ihre Rechte</h3>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
          beschweren – in Hessen beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit (HBDI).
        </p>
      </template>
    </div>
  </dialog>
</template>

<style scoped>
.legal {
  width: min(720px, calc(100vw - 24px));
  max-height: min(86dvh, 900px);
  padding: 0;
  border: 0;
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--text);
  box-shadow:
    inset 0 0 0 1px var(--line-strong),
    var(--shadow-lg);
}

.legal::backdrop {
  background: rgba(3, 5, 9, 0.75);
  backdrop-filter: blur(4px);
}

.legal__inner {
  position: relative;
  padding: clamp(24px, 5vw, 48px);
}

.legal h2 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.legal h3 {
  margin-top: 24px;
  font-size: 1.05rem;
  color: var(--amber);
}

.legal p {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.96rem;
}

.legal a {
  color: var(--cyan);
}

.legal__close {
  position: sticky;
  top: 0;
  float: right;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: var(--surface-2);
  cursor: pointer;
}

.legal__close svg {
  width: 20px;
  height: 20px;
}
</style>
