import { ref } from "vue";

export type ThemePreset = "minimal-dark" | "minimal-paper";

const STORAGE_KEY = "portfolio-theme";
const DEFAULT: ThemePreset = "minimal-dark";

function read(): ThemePreset {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "minimal-paper" || stored === "minimal-dark"
    ? stored
    : DEFAULT;
}

const theme = ref<ThemePreset>(read());

function apply(preset: ThemePreset) {
  theme.value = preset;
  document.documentElement.dataset.theme = preset;
  localStorage.setItem(STORAGE_KEY, preset);
}

// Apply on module load so there's no flash before mount.
apply(theme.value);

export function useTheme() {
  function toggle() {
    apply(theme.value === "minimal-dark" ? "minimal-paper" : "minimal-dark");
  }
  return { theme, toggle, apply };
}
