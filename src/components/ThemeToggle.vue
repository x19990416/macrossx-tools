<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

import { useTheme } from '@/composables/useTheme'

const { toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    aria-label="切换明暗主题"
    title="切换明暗主题"
    @click="toggleTheme"
  >
    <Sun class="size-4 dark:hidden" aria-hidden="true" />
    <Moon class="hidden size-4 dark:block" aria-hidden="true" />
  </button>
</template>
