<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import IntroLaptop from './components/IntroLaptop.vue'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import CareerSection from './components/CareerSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import HomeScene from './components/HomeScene.vue'
import SketchbookSection from './components/SketchbookSection.vue'
import TravelSection from './components/TravelSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
import LegalDialog from './components/LegalDialog.vue'

// Kein Intro bei reduzierter Bewegung, wenn direkt ein Abschnitt verlinkt wurde (#kontakt …)
// oder wenn es in dieser Sitzung schon gelaufen ist.
function introSeen() {
  try {
    return sessionStorage.getItem('intro-seen') === '1'
  } catch {
    return false
  }
}

const skipIntro = prefersReducedMotion() || (location.hash.length > 1 && location.hash !== '#top') || introSeen()
const showIntro = ref(!skipIntro)
const ready = ref(skipIntro)
const legal = ref<InstanceType<typeof LegalDialog> | null>(null)

function onReveal() {
  ready.value = true
}

function onIntroDone() {
  showIntro.value = false
  ready.value = true
  document.body.classList.remove('is-locked')
  try {
    sessionStorage.setItem('intro-seen', '1')
  } catch {
    /* privates Fenster – dann eben beim nächsten Mal wieder */
  }
}

onMounted(() => {
  if (showIntro.value) {
    window.scrollTo(0, 0)
    document.body.classList.add('is-locked')
  } else if (location.hash.length > 1) {
    document.querySelector(location.hash)?.scrollIntoView()
  }
})
</script>

<template>
  <IntroLaptop v-if="showIntro" @reveal="onReveal" @done="onIntroDone" />
  <AppHeader />
  <main>
    <HeroSection :ready="ready" />
    <SkillsSection />
    <CareerSection />
    <ProjectsSection />
    <HomeScene />
    <SketchbookSection />
    <TravelSection />
    <ContactSection />
  </main>
  <AppFooter @legal="(p) => legal?.open(p)" />
  <LegalDialog ref="legal" />
</template>
