<script setup lang="ts">
import type { Project, Status } from "../types";

const props = defineProps<{ project: Project }>();

const statusLabel: Record<Status, string> = {
  active: "Active",
  building: "Building",
  shipped: "Shipped",
  paused: "Paused",
};

const dotClass: Record<Status, string> = {
  active: "dot-active",
  building: "dot-building",
  shipped: "dot-shipped",
  paused: "dot-paused",
};
</script>

<template>
  <div class="project">
    <div class="project-mark">{{ project.mark }}</div>
    <div class="project-content">
      <div class="project-top">
        <span class="project-name">{{ project.name }}</span>
        <span class="project-tag">
          <span class="status">
            <span class="dot" :class="dotClass[project.status]"></span>
            {{ statusLabel[project.status] }}
          </span>
        </span>
        <span v-if="project.stars > 0" class="project-stars"
          >★ {{ project.stars }}</span
        >
      </div>
      <div class="project-desc">{{ project.description }}</div>
      <div v-if="project.tech" class="project-tech">{{ project.tech }}</div>
      <div class="project-links">
        <a
          v-if="project.homepage"
          class="project-link project-link-primary"
          :href="project.homepage"
          target="_blank"
          rel="noopener"
          >Live site →</a
        >
        <a
          class="project-link project-link-src"
          :href="project.url"
          target="_blank"
          rel="noopener"
          >↗ src</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.project {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: inherit;
  transition: all 100ms ease;
}

.project:hover {
  background: var(--bg-surface);
  margin: 0 -12px;
  padding: 16px 12px;
  border-color: transparent;
}

.project-mark {
  width: 36px;
  height: 36px;
  background: var(--text-primary);
  color: var(--bg-primary);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.project-content {
  flex: 1;
  min-width: 0;
}

.project-top {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
}

.project-name {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
}

.project-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot-active {
  background: var(--color-success);
}
.dot-building {
  background: var(--color-warning);
}
.dot-shipped {
  background: var(--text-tertiary);
}
.dot-paused {
  background: var(--color-error);
}

.project-stars {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  margin-left: auto;
  white-space: nowrap;
}

.project-desc {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.project-tech {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  margin-top: 6px;
  letter-spacing: 0.3px;
}

.project-links {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.project-link {
  font-size: 12px;
  text-decoration: none;
  transition: color 100ms ease;
}

.project-link-primary {
  color: var(--text-secondary);
}

.project-link-primary:hover {
  color: var(--text-primary);
}

.project-link-src {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.project-link-src:hover {
  color: var(--text-secondary);
}
</style>
