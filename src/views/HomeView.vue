<script setup lang="ts">
import { GitFork, Search, ShieldCheck, Sparkles, Wrench } from '@lucide/vue'
import { computed, ref } from 'vue'

import ThemeToggle from '@/components/ThemeToggle.vue'
import ToolCard from '@/components/ToolCard.vue'
import { toolCategories, tools } from '@/lib/tools'

const query = ref('')
const activeCategory = ref<(typeof toolCategories)[number]>('全部')

const filteredTools = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()
  return tools.filter((tool) => {
    const categoryMatches =
      activeCategory.value === '全部' || tool.category === activeCategory.value
    const queryMatches =
      !normalizedQuery ||
      [tool.name, tool.description, tool.category, ...tool.keywords]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    return categoryMatches && queryMatches
  })
})
</script>

<template>
  <div class="min-h-screen">
    <header class="site-header">
      <div class="page-shell flex h-16 items-center justify-between">
        <a class="flex items-center gap-2.5 font-semibold tracking-tight" href="#/">
          <span class="brand-mark"><Wrench class="size-4" aria-hidden="true" /></span>
          <span>MacrossX Tools</span>
        </a>
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
      <section class="page-shell py-16 text-center sm:py-24">
        <div class="hero-badge">
          <Sparkles class="size-3.5" aria-hidden="true" /> 简单、实用、打开即用
        </div>
        <h1 class="hero-title">把常用的小工具，<span>装进一个网站</span></h1>
        <p class="hero-copy">
          无需安装，无需登录。所有数据优先在你的浏览器本地处理，随时打开即可使用。
        </p>

        <div class="search-box" role="search">
          <Search class="size-5 text-muted" aria-hidden="true" />
          <label class="sr-only" for="tool-search">搜索工具</label>
          <input
            id="tool-search"
            v-model="query"
            type="search"
            placeholder="搜索工具，例如字帖、图片、时间……"
          />
          <kbd>{{ filteredTools.length }} 个结果</kbd>
        </div>
      </section>

      <section class="page-shell pb-20" aria-labelledby="tools-heading">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="section-kicker">工具集合</p>
            <h2 id="tools-heading" class="section-title">现在就能使用</h2>
          </div>
          <div class="category-tabs" aria-label="工具分类">
            <button
              v-for="category in toolCategories"
              :key="category"
              type="button"
              :class="{ active: activeCategory === category }"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div v-if="filteredTools.length" class="tool-grid">
          <ToolCard v-for="tool in filteredTools" :key="tool.route" v-bind="tool" />
        </div>
        <div v-else class="empty-card">
          <div class="empty-icon"><Search class="size-6" aria-hidden="true" /></div>
          <h3>没有找到相关工具</h3>
          <p>换一个关键词试试，或者清空搜索内容。</p>
        </div>
      </section>
    </main>

    <footer class="border-t border-border/80">
      <div
        class="page-shell flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ new Date().getFullYear() }} MacrossX Tools</p>
        <p class="flex items-center gap-1.5">
          <ShieldCheck class="size-4" aria-hidden="true" /> 数据优先在本地处理
        </p>
      </div>
    </footer>
  </div>
</template>
