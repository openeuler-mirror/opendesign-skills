import type { Directive } from 'vue'

/**
 * @description @opendesign-plus 组件库基础设施插件。
 *   注册 v-analytics 埋点指令（no-op 实现，实际项目可替换为真实埋点逻辑）。
 *   OPlusConfigProvider 组件在 app.vue 中直接使用，无需在此全局注册。
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('analytics', {
    mounted() {
      // no-op: 实际项目可在此处初始化埋点监听（如 binding.value 事件名 → 点击上报）
    },
  } satisfies Directive)
})
