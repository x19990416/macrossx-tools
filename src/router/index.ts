import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ChineseCopybook from '@/tools/chinese-copybook'
import MathWorksheet from '@/tools/math-worksheet'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/math-worksheet', name: 'math-worksheet', component: MathWorksheet },
    {
      path: '/chinese-copybook',
      name: 'chinese-copybook',
      component: ChineseCopybook,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
