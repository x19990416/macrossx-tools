<script setup lang="ts">
import { ref } from 'vue'

import type { TaskCard } from './task-cards'

defineProps<{ tasks: readonly TaskCard[] }>()

const selected = ref<string | null>(null)

function toggle(id: string) {
  selected.value = selected.value === id ? null : id
}
</script>

<template>
  <div class="grid gap-3">
    <article
      v-for="task in tasks"
      :key="task.id"
      class="rounded-xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <p class="text-sm font-semibold text-primary">{{ task.skill }}</p>
      <h3 class="mt-1 text-lg font-bold">{{ task.title }}</h3>
      <p v-if="task.materials" class="mt-2 text-sm text-muted">准备：{{ task.materials }}</p>
      <p class="mt-2 leading-7">{{ task.prompt }}</p>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="secondary-button min-h-11"
          :aria-expanded="selected === task.id"
          :aria-controls="`hint-${task.id}`"
          @click="toggle(task.id)"
        >
          {{ selected === task.id ? '收起提示' : '给个提示' }}
        </button>
      </div>
      <p v-show="selected === task.id" :id="`hint-${task.id}`" class="mt-2 leading-7 text-muted">
        {{ task.hint }}
      </p>
      <details class="mt-3 border-t pt-3">
        <summary
          class="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-primary"
        >
          参考思路
        </summary>
        <p class="mt-2 leading-7 text-muted">{{ task.explanation }}</p>
      </details>
      <p v-if="task.followUp" class="mt-3 rounded-lg bg-primary-soft p-3 text-sm leading-6">
        <strong>再试试：</strong>{{ task.followUp }}
      </p>
    </article>
  </div>
</template>
