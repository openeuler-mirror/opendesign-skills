import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

// —— CSS Reset（归零 UA 默认样式，必须在 Token 之前确保归零最早生效）——
import './assets/styles/reset.scss'
// —— OpenDesign 样式（顺序不可调换：Token 必须先于组件样式）——
// 1. 主题 Token：提供 --o-color-* / --o-r-* 等 CSS 变量，并自动 @import 响应式 token
import '@opensig/opendesign-token/themes/e.light.token.css'
import '@opensig/opendesign-token/themes/e.dark.token.css'
// 2. 鸿蒙字体（分片加载，按 unicode-range 切片懒加载）
import '@opensig/opendesign-token/fonts/font-harmony.css'
// 3. OpenDesign 组件库样式（使用上述 Token 变量）
import '@opensig/opendesign/es/index.css'
// 4. 项目全局样式（可在上述基础上覆盖）
import './assets/styles/global.scss'

const app = createApp(App)

app.use(createPinia())

// —— 可选：全局圆角风格（Ascend 社区用 'pill' 全圆角）——
// import { initRound } from '@opensig/opendesign'
// initRound('pill')

app.mount('#app')
