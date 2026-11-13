<script setup lang="ts">
defineProps<{
  shape: 'circle' | 'triangle' | 'square'
  striped?: boolean
  tone?: 'blue' | 'amber'
}>()
</script>

<template>
  <svg viewBox="0 0 48 48" aria-hidden="true" class="shrink-0" fill="none">
    <g
      :class="tone === 'amber' ? 'text-amber-700 dark:text-amber-300' : 'text-primary'"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linejoin="round"
    >
      <circle
        v-if="shape === 'circle'"
        cx="24"
        cy="24"
        r="16"
        fill="currentColor"
        fill-opacity=".18"
      />
      <path
        v-else-if="shape === 'triangle'"
        d="M24 6 43 40H5Z"
        fill="currentColor"
        fill-opacity=".18"
      />
      <rect
        v-else
        x="9"
        y="9"
        width="30"
        height="30"
        rx="2"
        fill="currentColor"
        fill-opacity=".18"
      />
      <path v-if="striped" d="M21 20h6m-9 6h12m-15 6h18" stroke-linecap="round" />
    </g>
  </svg>
</template>
