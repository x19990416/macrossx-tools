<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

defineProps<{
  name: string
  description: string
  category: string
  icon: Component
  route: string
}>()
</script>

<template>
  <RouterLink class="tool-card group" :to="route">
    <div class="tool-card-icon"><component :is="icon" class="size-5" aria-hidden="true" /></div>
    <span class="tool-card-category">{{ category }}</span>
    <h3>{{ name }}</h3>
    <p>{{ description }}</p>
    <span class="tool-card-link">
      打开工具
      <ArrowUpRight
        class="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </span>
  </RouterLink>
</template>
