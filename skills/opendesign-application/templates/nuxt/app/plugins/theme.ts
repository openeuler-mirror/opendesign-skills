/**
 * @description 主题插件（SSR + 客户端）。使用 @opendesign-plus/composables 的 createTheme
 *   管理 data-o-theme 属性（light/dark 切换），与 OHeader/OHeaderTheme 组件配合使用。
 *   createTheme 内部已做 SSR 守卫（typeof window !== 'undefined'），SSR 时仅提供 inject 符号，
 *   客户端 hydrate 后接管 DOM 属性与 cookie 读写。app.vue 的 useHead 设置 SSR 默认值 'e.light'。
 */
import { createTheme } from '@opendesign-plus/composables'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createTheme({
    cookieKey: 'opendesign-theme',
    cookieDomain: '',
    attribute: 'data-o-theme',
    attributeLightValue: 'e.light',
    attributeDarkValue: 'e.dark',
  }))
})
