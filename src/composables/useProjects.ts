import { ref, onMounted } from "vue";
import type { ProjectsPayload } from "../types";
import fallback from "../fallback.json";

export function useProjects() {
  const data = ref<ProjectsPayload | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data.value = (await res.json()) as ProjectsPayload;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "failed to load";
      data.value = fallback as ProjectsPayload;
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { data, loading, error, reload: load };
}
