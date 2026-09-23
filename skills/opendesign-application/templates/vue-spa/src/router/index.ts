import {createRouter, createWebHistory} from 'vue-router'

/**
 * @description SPA 路由配置。路由采用懒加载（动态 import），
 *   按访问页面分割代码块，首屏不加载非首屏页面代码。
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
    },
  ],
})

export default router
