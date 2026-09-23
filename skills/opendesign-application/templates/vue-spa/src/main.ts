import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createTheme} from '@opendesign-plus/composables'
import App from './App.vue'
import router from './router'

// —— CSS Reset（归零 UA 默认样式，必须在 Token 之前确保归零最早生效）——
import './assets/styles/reset.scss'
// —— OpenDesign 样式（顺序不可调换：Token 必须先于组件样式）——
// 1. 主题 Token：提供 --o-color-* / --o-r-* 等 CSS 变量，并自动 @import 响应式 token
import '@opensig/opendesign-token/themes/e.light.token.css'
import '@opensig/opendesign-token/themes/e.dark.token.css'
// 2. 鸿蒙字体（分片加载，按 unicode-range 切片懒加载）
import '@opensig/opendesign-token/fonts/font-harmony.css'
// 3. OpenDesign 组件库 OpenEuler 主题样式（使用上述 Token 变量，含 OButton/OInput/ODivider 等基础组件）
import '@opensig/opendesign/es/theme/openeuler/index.css'
// 4. @opendesign-plus 组件样式（OHeader/OFooter/OHeaderTheme 等布局组件）
import '@opendesign-plus/components/styles'
// 5. 项目全局样式（可在上述基础上覆盖）
import './assets/styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// —— 主题初始化（createTheme 管理 data-o-theme 属性 + cookie 持久化）——
// attributeLightValue / attributeDarkValue 与 Token CSS 的 data-o-theme 值对齐
app.use(createTheme({
  cookieKey: 'opendesign-theme',
  cookieDomain: '',
  attribute: 'data-o-theme',
  attributeLightValue: 'e.light',
  attributeDarkValue: 'e.dark',
}))

// —— v-analytics 埋点指令（no-op 实现，实际项目可替换为真实埋点逻辑）——
// @opendesign-plus/components 的 OHeader 内部 resolveDirective('analytics') 需要此指令已注册
app.directive('analytics', {
  mounted() {
    // no-op: 实际项目可在此处初始化埋点监听
  },
})

// —— 可选：全局圆角风格（Ascend 社区用 'pill' 全圆角）——
// import { initRound } from '@opensig/opendesign'
// initRound('pill')

app.mount('#app')
