<script setup lang="ts">
import { useTheme } from "../composables/useTheme";

const { theme, toggle } = useTheme();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :title="
      theme === 'minimal-dark' ? 'Switch to paper' : 'Switch to dark'
    "
    :aria-label="
      theme === 'minimal-dark' ? 'Switch to paper' : 'Switch to dark'
    "
    @click="toggle"
  >
    <!-- On dark → Moon (switch to paper). On light → Sun (switch to dark). -->
    <svg
      v-if="theme === 'minimal-dark'"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color 100ms ease,
    border-color 100ms ease,
    background 100ms ease;
}

.theme-toggle:hover {
  color: var(--text-primary);
  border-color: var(--text-tertiary);
  background: var(--bg-surface);
}
</style>
