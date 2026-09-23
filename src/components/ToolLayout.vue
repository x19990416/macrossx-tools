<script setup lang="ts">
import { ArrowLeft, GitFork, ShieldCheck, Wrench } from '@lucide/vue'
import { RouterLink } from 'vue-router'

import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="min-h-screen">
    <header class="site-header no-print">
      <div class="page-shell flex h-16 items-center justify-between">
        <RouterLink class="flex items-center gap-2.5 font-semibold tracking-tight" to="/">
          <span class="brand-mark"><Wrench class="size-4" aria-hidden="true" /></span>
          <span>MacrossX Tools</span>
        </RouterLink>
        <nav class="flex items-center gap-2" aria-label="主要导航">
          <a
            class="icon-button"
            href="https://github.com/x19990416/macrossx-tools"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 GitHub 仓库"
          >
            <GitFork class="size-4" aria-hidden="true" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>

    <main>
      <section class="page-shell no-print py-8 sm:py-12">
        <RouterLink class="back-link" to="/">
          <ArrowLeft class="size-4" aria-hidden="true" /> 返回工具首页
        </RouterLink>
        <div class="mt-6 flex flex-col gap-3 sm:mt-8">
          <h1 class="tool-page-title">{{ title }}</h1>
          <p class="max-w-2xl text-muted leading-7">{{ description }}</p>
          <p class="privacy-note">
            <ShieldCheck class="size-4" aria-hidden="true" /> 输入内容和字帖生成均在当前浏览器中完成
          </p>
        </div>
      </section>
      <slot />
    </main>
  </div>
</template>
