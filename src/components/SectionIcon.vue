<script setup lang="ts">
import type { SectionIcon } from "../types";

const props = defineProps<{ name: SectionIcon }>();

const paths: Record<SectionIcon, string> = {
  star: "M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8L3.6 9.1l5.8-.8L12 3z",
  wrench:
    "M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.3 2.3-2-2 2.3-2.3z",
  terminal: "M5 7l4 4-4 4M13 15h6",
  app: "M4 4h16v16H4zM4 9h16",
};
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[props.name]" />
  </svg>
</template>
