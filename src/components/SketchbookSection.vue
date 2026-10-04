<script setup lang="ts">
import { vReveal } from '@/composables/reveal'
import SketchCard from './ui/SketchCard.vue'
import SketchPegboard from './sketches/SketchPegboard.vue'
import SketchSchematic from './sketches/SketchSchematic.vue'
import SketchRaisedBed from './sketches/SketchRaisedBed.vue'
</script>

<template>
  <section class="sketchbook section" aria-labelledby="sketchbook-title">
    <div class="container">
      <header class="sketchbook__head" v-reveal>
        <p class="eyebrow">Skizzenbuch</p>
        <h2 id="sketchbook-title" class="section-title">Erst die Zeichnung, <em>dann die Werkbank.</em></h2>
        <p class="section-lead">
          Ob Regal, Hochbeet oder Smart-Home-Verkabelung: Vor dem ersten Schnitt steht bei mir die Skizze. Ein paar
          Blätter vom Schreibtisch.
        </p>
      </header>

      <div class="sketchbook__grid">
        <SketchCard
          v-reveal
          sheet="H-01"
          title="Werkzeugwand"
          caption="Jedes Werkzeug hat seinen festen Platz – vom Schraubendreher-Satz bis zur Stirnlampe."
        >
          <SketchPegboard />
        </SketchCard>
        <SketchCard
          v-reveal="90"
          sheet="H-02"
          title="Smart Home"
          scale="Schaltplan"
          caption="Der Raspberry Pi als Zentrale: Bewegung und Temperatur rein, Licht und Rollläden raus."
        >
          <SketchSchematic />
        </SketchCard>
        <SketchCard
          v-reveal="180"
          sheet="H-03"
          title="Hochbeet"
          scale="Isometrie"
          caption="Zweimal messen, einmal sägen – auch im Garten gilt die Explosionszeichnung."
        >
          <SketchRaisedBed />
        </SketchCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sketchbook__head {
  max-width: 760px;
}

.sketchbook__grid {
  display: grid;
  gap: 20px;
  margin-top: clamp(36px, 5vw, 56px);
}

@media (min-width: 720px) {
  .sketchbook__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .sketchbook__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
