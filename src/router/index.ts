import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ChineseCopybook from '@/tools/chinese-copybook'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chinese-copybook',
      name: 'chinese-copybook',
      component: ChineseCopybook,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
