<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLoopTime } from '@/composables/useLoopTime'
import { easeInOutCubic, lerp, segment } from '@/utils/anim'

/**
 * Schraubendreher: verschraubt die Pipeline-Stufen Flansch für Flansch –
 * danach läuft ein Build von On-Premise bis in die Cloud.
 */
const DURATION = 9
const root = ref<SVGSVGElement | null>(null)
const time = useLoopTime(root, { duration: DURATION, still: 7 })

const PIPE_Y = 118
const STAGES = ['build', 'test', 'scan', 'deploy']
const STAGE_W = 54
const GAP = 10
const X0 = 46
const stages = STAGES.map((label, i) => ({ label, x: X0 + i * (STAGE_W + GAP) }))
const joints = stages.slice(1).map((s) => s.x - GAP / 2)
const PIPE_END = X0 + STAGES.length * STAGE_W + (STAGES.length - 1) * GAP

/* Ablauf je Schraube: anfahren 0.45s, absenken 0.25s, drehen 0.7s, anheben 0.25s */
const STEP = 1.65
const FIRST = 0.4
const PARK = { x: 300, y: 4 }
const ENGAGED_Y = 30
const END = FIRST + joints.length * STEP
const LAST_JOINT = joints[joints.length - 1] ?? PARK.x

function jointState(j: number) {
  const s = time.value - (FIRST + j * STEP)
  return { fastened: s > 1.4, slot: segment(s, 0.7, 1.4) * 450 }
}

const driver = computed(() => {
  const t = time.value
  if (t < FIRST) return { x: PARK.x, y: PARK.y, turn: 0 }
  if (t >= END) return { x: lerp(LAST_JOINT, PARK.x, easeInOutCubic(segment(t, END, END + 0.6))), y: PARK.y, turn: 0 }
  const j = Math.min(joints.length - 1, Math.floor((t - FIRST) / STEP))
  const s = t - (FIRST + j * STEP)
  const fromX = j === 0 ? PARK.x : (joints[j - 1] ?? PARK.x)
  const x = lerp(fromX, joints[j] ?? PARK.x, easeInOutCubic(segment(s, 0, 0.45)))
  const down = segment(s, 0.45, 0.7) - segment(s, 1.4, 1.65)
  return { x, y: lerp(PARK.y, ENGAGED_Y, easeInOutCubic(Math.max(0, down))), turn: segment(s, 0.7, 1.4) }
})

const allFastened = computed(() => jointState(joints.length - 1).fastened)

/* Build-Paket */
const PACKET_START = END + 0.3
const packet = computed(() => {
  const p = segment(time.value, PACKET_START, PACKET_START + 1.6)
  return { visible: p > 0 && p < 1, x: lerp(18, PIPE_END + 22, easeInOutCubic(p)) }
})
const deployed = computed(() => time.value > PACKET_START + 1.6)
</script>

<template>
  <svg ref="root" class="sd" viewBox="0 0 340 200" aria-hidden="true">
    <defs>
      <linearGradient id="sdPipe" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5a6476" />
        <stop offset="0.5" stop-color="#323a48" />
        <stop offset="1" stop-color="#1c222c" />
      </linearGradient>
      <linearGradient id="sdHandle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b36a00" />
        <stop offset="0.45" stop-color="#ffb020" />
        <stop offset="1" stop-color="#b36a00" />
      </linearGradient>
    </defs>

    <!-- On-Premise-Server -->
    <g class="sd__server" :class="{ 'is-dim': deployed }">
      <rect x="6" y="94" width="30" height="48" rx="3" />
      <path d="M11 106 H31 M11 118 H31 M11 130 H31" />
      <circle cx="29" cy="100" r="1.6" class="sd__led" />
      <text x="21" y="156" text-anchor="middle">on-prem</text>
    </g>

    <!-- Pipeline -->
    <g v-for="(s, i) in stages" :key="s.label">
      <rect :x="s.x" :y="PIPE_Y - 13" :width="STAGE_W" height="26" rx="3" fill="url(#sdPipe)" />
      <rect
        :x="s.x"
        :y="PIPE_Y - 13"
        :width="STAGE_W"
        height="26"
        rx="3"
        class="sd__glow"
        :class="{ on: packet.visible && packet.x > s.x && packet.x < s.x + STAGE_W + 30 }"
      />
      <text :x="s.x + STAGE_W / 2" :y="PIPE_Y + 3.5" text-anchor="middle" class="sd__label">{{ s.label }}</text>
      <text :x="s.x + STAGE_W / 2" :y="PIPE_Y + 32" text-anchor="middle" class="sd__step">0{{ i + 1 }}</text>
    </g>

    <!-- Flansche mit Schrauben -->
    <g v-for="(jx, j) in joints" :key="jx" class="sd__joint" :class="{ 'is-fast': jointState(j).fastened }">
      <rect :x="jx - 6" :y="PIPE_Y - 17" width="12" height="34" rx="2" class="sd__flange" />
      <circle :cx="jx" :cy="PIPE_Y - 22" r="6" class="sd__screw" />
      <line
        :x1="jx - 4"
        :y1="PIPE_Y - 22"
        :x2="jx + 4"
        :y2="PIPE_Y - 22"
        class="sd__slot"
        :transform="`rotate(${jointState(j).slot} ${jx} ${PIPE_Y - 22})`"
      />
      <circle :cx="jx" :cy="PIPE_Y + 22" r="3.4" class="sd__state" />
    </g>

    <!-- Build-Paket -->
    <g v-if="packet.visible" :transform="`translate(${packet.x} ${PIPE_Y})`">
      <rect x="-8" y="-8" width="16" height="16" rx="3" class="sd__packet" />
      <path d="M-8 -3 H8 M0 -8 V8" class="sd__packet-line" />
    </g>

    <!-- Cloud -->
    <g class="sd__cloud" :class="{ 'is-on': deployed }" transform="translate(318 118)">
      <path d="M-14 8 a8 8 0 0 1 0 -16 a10 10 0 0 1 18 -4 a8 8 0 0 1 10 12 a6 6 0 0 1 -2 8 Z" />
      <text x="0" y="28" text-anchor="middle">gcp</text>
    </g>
    <g class="sd__badge" :class="{ 'is-on': deployed }">
      <rect x="182" y="160" width="146" height="26" rx="6" />
      <text x="255" y="177" text-anchor="middle">✓ pipeline passed</text>
    </g>
    <g class="sd__badge sd__badge--wait" :class="{ 'is-on': !allFastened }">
      <text x="12" y="182">pipeline: verschrauben…</text>
    </g>

    <!-- Schraubendreher -->
    <g :transform="`translate(${driver.x} ${driver.y})`">
      <rect x="-1.8" y="33" width="3.6" height="23" rx="1.2" fill="#c3cad6" />
      <path d="M-1.8 56 L0 60 L1.8 56 Z" fill="#c3cad6" />
      <rect x="-3.5" y="29" width="7" height="5" rx="1.5" fill="#1a1f28" />
      <rect x="-8" y="0" width="16" height="31" rx="6" fill="url(#sdHandle)" />
      <g class="sd__grip">
        <line
          v-for="k in 3"
          :key="k"
          :x1="-8 + ((k * 5 + driver.turn * 40) % 16)"
          :x2="-8 + ((k * 5 + driver.turn * 40) % 16)"
          y1="8"
          y2="27"
        />
      </g>
      <rect x="-8" y="0" width="16" height="7" rx="3.5" fill="#1a1f28" />
    </g>
  </svg>
</template>

<style scoped>
.sd {
  width: 100%;
  height: 100%;
}

.sd__server rect {
  fill: var(--surface-3);
  stroke: var(--steel);
  stroke-width: 1;
}

.sd__server path {
  stroke: var(--faint);
  stroke-width: 1.4;
}

.sd__server text,
.sd__cloud text,
.sd__step {
  font-family: var(--font-mono);
  font-size: 8px;
  fill: var(--faint);
}

.sd__led {
  fill: var(--ok);
}

.sd__server {
  transition: opacity 0.5s;
}

.sd__server.is-dim {
  opacity: 0.45;
}

.sd__label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  fill: var(--steel-light);
}

.sd__glow {
  fill: var(--amber);
  opacity: 0;
  transition: opacity 0.25s;
}

.sd__glow.on {
  opacity: 0.25;
}

.sd__flange {
  fill: #3d4553;
  stroke: var(--red);
  stroke-width: 1;
  transition: stroke 0.3s;
}

.sd__screw {
  fill: #9aa3b2;
  stroke: #4a5262;
  stroke-width: 1;
}

.sd__slot {
  stroke: #2a2f38;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.sd__state {
  fill: var(--red);
  transition: fill 0.3s;
}

.is-fast .sd__flange {
  stroke: var(--ok);
}

.is-fast .sd__state {
  fill: var(--ok);
}

.sd__packet {
  fill: var(--amber);
  filter: drop-shadow(0 0 6px var(--amber));
}

.sd__packet-line {
  stroke: #6b3f00;
  stroke-width: 1;
}

.sd__cloud path {
  fill: var(--surface-3);
  stroke: var(--steel);
  stroke-width: 1.2;
  transition:
    fill 0.4s,
    stroke 0.4s;
}

.sd__cloud.is-on path {
  fill: var(--cyan-soft);
  stroke: var(--cyan);
  filter: drop-shadow(0 0 6px rgba(76, 201, 240, 0.6));
}

.sd__grip line {
  stroke: rgba(80, 45, 0, 0.55);
  stroke-width: 1.2;
}

.sd__badge {
  opacity: 0;
  transition: opacity 0.35s;
}

.sd__badge.is-on {
  opacity: 1;
}

.sd__badge rect {
  fill: rgba(61, 220, 132, 0.12);
  stroke: var(--ok);
  stroke-width: 1;
}

.sd__badge text {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  fill: var(--ok);
}

.sd__badge--wait text {
  fill: var(--faint);
  font-weight: 400;
}
</style>
