<script setup lang="ts">
import Header from "./components/Header.vue";
import ProjectGroup from "./components/ProjectGroup.vue";
import LinksSection from "./components/LinksSection.vue";
import { useProjects } from "./composables/useProjects";

const { data, loading } = useProjects();
</script>

<template>
  <div class="container">
    <Header />

    <template v-if="data">
      <ProjectGroup
        v-for="group in data.groups"
        :key="group.id"
        :group="group"
      />
      <LinksSection :links="data.links" />
    </template>

    <div v-else-if="loading" class="loading">Loading…</div>

    <div class="footer">
      © 2026 Jack Horton · Built with sharp corners and no gradients
    </div>
  </div>
</template>

<style scoped>
.loading {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 32px 0;
}

.footer {
  margin-top: 64px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-ghost);
  letter-spacing: 0.5px;
}
</style>
