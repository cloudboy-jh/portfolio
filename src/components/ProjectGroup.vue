<script setup lang="ts">
import { ref } from "vue";
import type { Group } from "../types";
import ProjectCard from "./ProjectCard.vue";
import SectionIcon from "./SectionIcon.vue";

const props = defineProps<{ group: Group }>();

// Flagship stays expanded and non-collapsible; the rest collapse by default.
const collapsible = props.group.id !== "flagship";
const open = ref(!collapsible);
</script>

<template>
  <div class="section">
    <div class="section-head" :class="{ 'is-toggle': collapsible }">
      <SectionIcon v-if="group.icon" :name="group.icon" />
      <span class="section-label">{{ group.label }}</span>
      <svg
        v-if="collapsible"
        class="chevron"
        :class="{ 'chevron-open': open }"
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        @click="open = !open"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>
    <div v-show="open" class="section-body">
      <ProjectCard
        v-for="project in group.projects"
        :key="project.name"
        :project="project"
      />
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 48px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-tertiary);
}

.section-head.is-toggle {
  cursor: default;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  flex: 1;
}

.chevron {
  cursor: pointer;
  color: var(--text-tertiary);
  transition:
    transform 150ms ease,
    color 100ms ease;
}

.chevron:hover {
  color: var(--text-secondary);
}

.chevron-open {
  transform: rotate(90deg);
}
</style>
