<script setup lang="ts">
import { computed } from 'vue'

import type { GridType, StrokeData } from '../copybook-data'

const props = withDefaults(
  defineProps<{
    character: string
    data?: StrokeData
    practicePath?: string
    visibleStrokes?: number
    gridType: GridType
    gridColor: string
    inkColor: string
    opacity?: number
  }>(),
  {
    data: undefined,
    practicePath: undefined,
    visibleStrokes: undefined,
    opacity: 1,
  },
)

const visibleCount = computed(() => props.visibleStrokes ?? props.data?.strokes.length ?? 0)
</script>

<template>
  <div
    class="character-grid"
    :class="{ 'character-grid--rice': gridType === 'rice' }"
    :style="{ '--grid-color': gridColor }"
  >
    <svg v-if="practicePath" viewBox="0 0 1000 1000" role="img" :aria-label="`${character}笔画`">
      <path
        :d="practicePath"
        fill="none"
        :stroke="inkColor"
        stroke-width="72"
        stroke-linecap="round"
        stroke-linejoin="round"
        :opacity="opacity"
      />
    </svg>
    <svg v-else-if="data" viewBox="0 0 1024 1024" role="img" :aria-label="`${character}字笔画`">
      <g transform="translate(0, 900) scale(1, -1)">
        <path
          v-for="(path, index) in data.strokes"
          :key="index"
          :d="path"
          :fill="inkColor"
          :opacity="index < visibleCount ? opacity : 0"
        />
      </g>
    </svg>
    <span v-else :style="{ color: inkColor, opacity }">{{ character }}</span>
  </div>
</template>
