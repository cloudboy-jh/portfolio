<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";
</script>

<template>
  <div class="header">
    <div class="header-top">
      <div>
        <div class="header-name">Jack Horton</div>
        <div class="header-role">Product Engineer · Developer Tools</div>
      </div>
      <ThemeToggle />
    </div>
    <p class="header-bio">
      Building terminal-native dev tools and data infrastructure at Zyris.
      Self-taught. Shipping software that just works.
    </p>
    <div class="location">Santa Monica, CA</div>
  </div>
</template>

<style scoped>
.header {
  margin-bottom: 48px;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.header-name {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.header-role {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.header-bio {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
  max-width: 520px;
}

.location {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
  margin-top: 12px;
}
</style>
