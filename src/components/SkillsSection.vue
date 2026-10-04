<script setup lang="ts">
import type { Component } from 'vue'
import { vReveal } from '@/composables/reveal'
import { techBits } from '@/config/projects'
import ToolKeyboard from './tools/ToolKeyboard.vue'
import ToolRuler from './tools/ToolRuler.vue'
import ToolScrewdriver from './tools/ToolScrewdriver.vue'
import ToolLeafBlower from './tools/ToolLeafBlower.vue'
import ToolHeadlamp from './tools/ToolHeadlamp.vue'
import ToolLevel from './tools/ToolLevel.vue'

interface Skill {
  id: string
  title: string
  tool: string
  motto: string
  text: string
  tags: string[]
  scene: Component
}

const skills: Skill[] = [
  {
    id: 'engineering',
    title: 'Software Engineering',
    tool: 'Mechanische Tastatur',
    motto: 'Jeder Anschlag zählt.',
    text: 'Objektorientierte Entwicklung in Python und Java – von der Optionspreis-Applikation bis zum Pricing-Service für intern gehandelte Kryptowährungen. Sauberer Code, klare Schnittstellen, REST.',
    tags: ['Python', 'Java', 'REST', 'OOP', 'Spring Boot', 'FastAPI'],
    scene: ToolKeyboard,
  },
  {
    id: 'architektur',
    title: 'Software-Architektur',
    tool: 'Zollstock',
    motto: 'Zweimal messen, einmal sägen.',
    text: 'Als Senior Anwendungsentwickler und -architekt plane ich Systeme so, dass sie fachlich passen, sauber skalieren und sich auch in Jahren noch gut warten lassen.',
    tags: ['Architektur', 'Schnittstellen', 'Cloud-Design', 'Docker'],
    scene: ToolRuler,
  },
  {
    id: 'cicd',
    title: 'CI/CD & Cloud',
    tool: 'Schraubendreher',
    motto: 'Schraube für Schraube, bis alles sitzt.',
    text: 'Pionierarbeit beim Umzug der CI/CD-Prozesse von On-Premise in die Google Cloud. Fachlich verantwortlich für die Pipelines mit Build, Test und statischer Codeanalyse.',
    tags: ['GitLab', 'Jenkins', 'Google Cloud', 'Docker', 'Shell', 'Automic'],
    scene: ToolScrewdriver,
  },
  {
    id: 'qualitaet',
    title: 'Code-Qualität & Testing',
    tool: 'Akku-Laubbläser',
    motto: 'Weg damit, bevor es liegen bleibt.',
    text: 'Ein selbst gebautes Testframework für Unittests, statische Analyse mit SonarQube und Test Driven Development – Bugs und Code Smells werden weggepustet, bevor sie sich festsetzen.',
    tags: ['SonarQube', 'Unittests', 'TDD', 'Testframework'],
    scene: ToolLeafBlower,
  },
  {
    id: 'data',
    title: 'Data & Machine Learning',
    tool: 'Stirnlampe',
    motto: 'Licht ins Dunkel der Daten.',
    text: 'Enterprise Data Warehouse, ETL-Strecken, Zeitreihen-Prognosen und eine ML-Masterarbeit mit Note 1,0. Und wo Daten geschützt gehören: datenschutzkonforme Anonymisierung.',
    tags: ['Machine Learning', 'Zeitreihen', 'ETL', 'Pentaho', 'Tableau', 'SQL'],
    scene: ToolHeadlamp,
  },
  {
    id: 'team',
    title: 'Teams & Mentoring',
    tool: 'Wasserwaage',
    motto: 'Erst im Lot, dann im Flow.',
    text: 'Agil nach Scrum, Mentor für Duale Studenten, Werkstudenten und Trainees – und interkulturelle Zusammenarbeit mit internationalen Dienstleistern auf Deutsch, Englisch und Spanisch.',
    tags: ['Scrum', 'Mentoring', 'Jira', 'Confluence', 'Englisch C1'],
    scene: ToolLevel,
  },
]
</script>

<template>
  <section id="skills" class="skills section bg-pegboard" aria-labelledby="skills-title">
    <div class="container">
      <header class="skills__head" v-reveal>
        <p class="eyebrow">Skills · Werkzeugwand</p>
        <h2 id="skills-title" class="section-title">Für jede Aufgabe <em>das richtige Werkzeug.</em></h2>
        <p class="section-lead">
          Ob Code oder Carport: Ich mag Werkzeug, das gut in der Hand liegt und genau das tut, was es soll. An dieser
          Wand hängt für jede meiner Kernkompetenzen das passende – und jedes zeigt kurz, was es kann.
        </p>
      </header>

      <div class="skills__grid">
        <article v-for="(s, i) in skills" :key="s.id" class="skill" v-reveal="(i % 3) * 90">
          <span class="skill__hook" aria-hidden="true"></span>
          <div class="skill__stage">
            <component :is="s.scene" />
          </div>
          <div class="skill__body">
            <p class="skill__tool">
              <span class="skill__idx">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ s.tool }}
            </p>
            <h3>{{ s.title }}</h3>
            <p class="skill__motto">„{{ s.motto }}“</p>
            <p class="skill__text">{{ s.text }}</p>
            <ul class="tags" aria-label="Technologien">
              <li v-for="t in s.tags" :key="t" class="tag">{{ t }}</li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Bit-Satz -->
      <div class="bits" v-reveal>
        <div class="bits__head">
          <p class="bits__title"><span class="mono">tech-stack</span> · Bit-Satz</p>
          <p class="bits__count mono">{{ techBits.length }} Bits</p>
        </div>
        <ul class="bits__case">
          <li v-for="b in techBits" :key="b" class="bit">
            <span class="bit__tip" aria-hidden="true"></span>
            <span class="bit__shaft">{{ b }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  border-block: 1px solid var(--line);
}

.skills__head {
  max-width: 760px;
}

.skills__grid {
  display: grid;
  gap: 22px;
  margin-top: clamp(40px, 6vw, 64px);
}

.skill {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  background: linear-gradient(180deg, var(--surface-2), var(--surface));
  box-shadow:
    inset 0 0 0 1px var(--line),
    var(--shadow);
  transition: box-shadow 0.3s;
}

.skill:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 176, 32, 0.35),
    var(--shadow);
}

/* Haken der Lochwand */
.skill__hook {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 34px;
  height: 18px;
  margin-left: -17px;
  border: 3px solid var(--steel);
  border-bottom: 0;
  border-radius: 14px 14px 0 0;
}

.skill__stage {
  height: 240px;
  margin: 12px 12px 0;
  border-radius: calc(var(--r-lg) - 8px);
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(76, 201, 240, 0.06), transparent 60%),
    #0d1117;
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}

.skill__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 22px 24px;
}

.skill__tool {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--amber);
}

.skill__idx {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 176, 32, 0.12);
}

.skill h3 {
  margin-top: 10px;
  font-size: 1.45rem;
}

.skill__motto {
  margin-top: 4px;
  font-family: var(--font-display);
  color: var(--steel-light);
}

.skill__text {
  margin: 12px 0 18px;
  color: var(--muted);
  font-size: 0.97rem;
}

.skill .tags {
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

/* ---------- Bits ---------- */
.bits {
  margin-top: clamp(48px, 7vw, 80px);
  padding: 22px;
  border-radius: var(--r-lg);
  background: linear-gradient(180deg, #1d232e, #12161d);
  box-shadow:
    inset 0 0 0 1px var(--line),
    inset 0 2px 0 rgba(255, 255, 255, 0.04),
    var(--shadow);
}

.bits__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.bits__title {
  font-family: var(--font-display);
  font-weight: 600;
}

.bits__title .mono {
  color: var(--amber);
}

.bits__count {
  font-size: 0.8rem;
  color: var(--faint);
}

.bits__case {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
  margin: 18px 0 0;
  padding: 16px;
  list-style: none;
  border-radius: var(--r);
  background: #0a0d12;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
}

.bit {
  display: flex;
  align-items: center;
  transition: transform 0.3s var(--ease-spring);
}

.bit:hover {
  transform: translateY(-4px) rotate(-2deg);
}

.bit__tip {
  width: 12px;
  height: 22px;
  background: linear-gradient(180deg, #e3e7ee, #8d95a3);
  clip-path: polygon(0 50%, 100% 20%, 100% 80%);
}

.bit__shaft {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px 0 8px;
  background: linear-gradient(180deg, #c9ced8, #7b8291 55%, #5a6272);
  clip-path: polygon(0 20%, 8px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 8px 100%, 0 80%);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #14181f;
}

.bit:nth-child(4n + 1) .bit__shaft {
  background: linear-gradient(180deg, #ffd27a, #ffb020 55%, #c47800);
}

@media (min-width: 720px) {
  .skills__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .skills__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }
}
</style>
