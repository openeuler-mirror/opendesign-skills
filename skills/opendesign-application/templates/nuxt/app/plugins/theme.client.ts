/**
 * @description 主题系统偏好检测插件（仅客户端）。
 *
 * 使用 VueUse usePreferredDark 检测系统暗色模式偏好：
 * - 首次访问（无 cookie）时跟随系统（延迟到 app:mounted 后，避免 hydration 不匹配）
 * - 持续监听系统主题变化（仅当用户未显式选择时跟随）
 *
 * 防止 hydration 不匹配：SSR 时 isDark=false（服务端无法读 matchMedia），
 * 若在 Vue mount 前将 store 改为 dark，ThemeToggle 的 OSwitch 会因 v-model 绑定值
 * 与 SSR 渲染状态不匹配，触发 Vue hydration 警告。因此初始检测延迟到
 * app:mounted 之后执行。视觉主题（CSS 变量）由 store 中的内联脚本在
 * Nuxt hydration 前阻止闪烁，仅 ThemeToggle 的 OSwitch 会在 mount 后切换一次。
 */

import {MODE_DARK, MODE_LIGHT} from '../stores/theme'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useThemeStore()
  const prefersDark = usePreferredDark()

  // 延迟到 app:mounted 之后更新 store，避免 SSR/客户端 hydration 不匹配
  nuxtApp.hook('app:mounted', () => {
    if (!store.hasUserChoice) {
      store.setSystemMode(prefersDark.value ? MODE_DARK : MODE_LIGHT)
    }
  })

  // 持续监听系统主题变化（仅当用户未显式选择时跟随）
  watch(prefersDark, (isDark) => {
    if (!store.hasUserChoice) {
      store.setSystemMode(isDark ? MODE_DARK : MODE_LIGHT)
    }
  })
})
