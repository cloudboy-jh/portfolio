<script setup lang="ts">
import type { LinkEntry } from "../types";

defineProps<{ links: Record<string, LinkEntry> }>();
</script>

<template>
  <div class="section">
    <div class="section-label">Links</div>
    <a
      v-for="(link, key) in links"
      :key="key"
      class="link-row"
      :href="link.href"
      target="_blank"
      rel="noopener"
    >
      <span class="link-label">{{ link.label }}</span>
      <span class="link-value">{{ link.value }}</span>
      <span class="link-arrow">→</span>
    </a>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 48px;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.link-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 100ms ease;
}

.link-row:hover {
  color: var(--text-primary);
}

.link-label {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 100px;
  color: var(--text-tertiary);
  transition: color 100ms ease;
}

.link-row:hover .link-label {
  color: var(--text-secondary);
}

.link-value {
  font-family: var(--font-body);
  font-size: 14px;
}

.link-arrow {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-ghost);
  transition: color 100ms ease;
}

.link-row:hover .link-arrow {
  color: var(--text-tertiary);
}
</style>
