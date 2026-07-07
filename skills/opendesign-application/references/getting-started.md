> ← 返回 [SKILL.md](../SKILL.md)

# 起手：依赖安装与入口配置

本页指导从零接入 OpenDesign 的第一步：装包、引入样式、初始化主题、跑通最小示例。所有代码片段均来自 `templates/` 下的可运行脚手架。

---

## 1. 安装依赖

```bash
pnpm add @opensig/opendesign @opensig/opendesign-token
pnpm add pinia @vueuse/core        # SPA
# 或 SSR 项目：
pnpm add pinia @vueuse/nuxt        # Nuxt（含模块自动注册）
pnpm add -D sass                    # SCSS 支持（Vite SPA 必装）
```

| 包 | 用途 | 必要性 |
|----|------|--------|
| `@opensig/opendesign` | 组件库本体 | 必需 |
| `@opensig/opendesign-token` | 主题 Token CSS 变量 + 鸿蒙字体 | 必需 |
| `pinia` | 主题状态管理（light/dark 持久化） | 推荐 |
| `@vueuse/core` / `@vueuse/nuxt` | `usePreferredDark` / `useStorage` / `useCookie` | 主题检测依赖 |
| `sass` | 编译 `<style lang="scss">` 与 mixin | 必需 |

> Nuxt 项目通过 `@pinia/nuxt` 模块自动注册 Pinia，无需 `app.use(createPinia())`。

---

## 2. 样式引入顺序（红线）

**顺序不可调换**，原因见注释：

```typescript
// 0. CSS Reset：归零 UA 默认样式，必须在 Token 之前确保归零最早生效
import './assets/styles/reset.scss'
// 1. 主题 Token：提供 --o-color-* / --o-r-* 等 CSS 变量，并自动 @import 响应式 token
import '@opensig/opendesign-token/themes/e.light.token.css'
import '@opensig/opendesign-token/themes/e.dark.token.css'
// 2. 鸿蒙字体（分片加载，按 unicode-range 切片懒加载）
import '@opensig/opendesign-token/fonts/font-harmony.css'
// 3. OpenDesign 组件库样式（使用上述 Token 变量）
import '@opensig/opendesign/es/index.css'
// 4. 项目全局样式（可在上述基础上覆盖）
import './assets/styles/global.scss'
```

| 步骤 | 作用 | 顺序原因 |
|------|------|---------|
| 0. CSS Reset | 归零 UA 默认 margin/padding/list-style，防御溢出与基线偏移 | 必须最早，后续所有样式在归零基线上叠加 |
| 1. Token CSS | 定义 `--o-*` 变量 | Reset 之后、组件之前，后续样式都依赖这些变量 |
| 2. 鸿蒙字体 | `@font-face` 声明 + 字重注册 | 在组件样式前，避免组件文字回退到系统字体 |
| 3. 组件库样式 | 组件视觉规则，引用 Token 变量 | 必须在 Token 之后，否则变量未定义 |
| 4. 全局样式 | body 基线 + 全局渲染类规则（如 `.o-form .o-input` 宽度） | 最后，可覆盖组件库默认 |

> ⚠️ 把组件样式放在 Token 之前，组件会拿到未定义的 CSS 变量，视觉完全错乱。

### 社区主题选择

上方示例是 openEuler 社区（`e`）。六个社区对应的 token 文件名前缀：

| 社区 | 前缀 | token 文件 |
|------|------|-----------|
| openEuler | `e` | `e.light.token.css` / `e.dark.token.css` |
| Ascend | `a` | `a.light.token.css` / `a.dark.token.css` |
| Kunpeng | `k` | `k.light.token.css` / `k.dark.token.css` |
| MindSpore | `m` | `m.light.token.css` / `m.dark.token.css` |
| openGauss | `g` | `g.light.token.css` / `g.dark.token.css` |
| openUBMC | `u` | `u.light.token.css` / `u.dark.token.css` |

**项目初始化时选定一套，运行时只在 light/dark 间切换，不在六社区间切换。** 切换社区需同时更换引入的 token 文件与 store 的 `OPENDESIGN_COMMUNITY` 常量。

---

## 3. Vite SPA 入口（`main.ts`）

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// —— OpenDesign 样式（顺序不可调换：CSS Reset → Token → 字体 → 组件 → 全局）——
import './assets/styles/reset.scss'
import '@opensig/opendesign-token/themes/e.light.token.css'
import '@opensig/opendesign-token/themes/e.dark.token.css'
import '@opensig/opendesign-token/fonts/font-harmony.css'
import '@opensig/opendesign/es/index.css'
import './assets/styles/global.scss'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

> SPA 还需在 `index.html` 内联防闪烁脚本，见 [theme-system.md](theme-system.md) 的「防闪烁」章节。

---

## 4. Nuxt 入口（`nuxt.config.ts`）

Nuxt 没有 `main.ts`，样式在 `nuxt.config.ts` 的 `css` 数组引入，**数组顺序即输出顺序**：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  css: [
    // —— OpenDesign 样式（顺序不可调换：CSS Reset → Token → 字体 → 组件 → 全局）——
    '~/assets/styles/reset.scss',
    '@opensig/opendesign-token/themes/e.light.token.css',
    '@opensig/opendesign-token/themes/e.dark.token.css',
    // ⚠️ Nuxt dev/SSR 经 Node ESM loader 加载，font-harmony.css 可能在 Node 报错，
    // 若遇启动错误改用 font-harmony.css 的非分片版本，或仅在客户端注入
    '@opensig/opendesign-token/fonts/font-harmony.css',
    '@opensig/opendesign/es/index.css',
    '~/assets/styles/global.scss',
  ],
  vite: {
    optimizeDeps: { include: ['@opensig/opendesign'] },
  },
})
```

> Nuxt 的 Pinia 通过 `@pinia/nuxt` 模块自动注册，无需 `app.use(createPinia())`。`@vueuse/nuxt` 同理自动注册 VueUse composables。

---

## 5. `initRound` 全局圆角

引入组件后，可通过 `initRound` 全局设置大部分组件的圆角风格：

```typescript
import { initRound } from '@opensig/opendesign'

// 'pill' = 全圆角（胶囊形），通常在 Ascend 社区使用
// 不调用则用各组件默认圆角
initRound('pill')
```

| 值 | 表现 | 典型社区 |
|----|------|---------|
| `'pill'` | 全圆角（高度的一半） | Ascend |
| 不调用 | 各组件默认小圆角 | openEuler / 其他 |

> 在 SPA 的 `main.ts`、Nuxt 的 plugin 中调用一次即可。

---

## 6. `useScreen()` 运行时响应式检测

除了 SCSS mixin 的 CSS 层面响应式，OpenDesign 还提供 `useScreen()` composable 用于**运行时条件渲染和样式绑定**：

```typescript
import { useScreen } from '@opensig/opendesign'

const { isPhonePad, isPhonePadSize, isPhoneSize, isPadSize, isTouchDevice, isHoverDevice } = useScreen()
```

| 属性 | 条件 | 用途 |
|------|------|------|
| `isPhonePad` | ≤1200px + 触控设备 | 组件内部响应式判断的核心阈值 |
| `isPhonePadSize` | ≤840px（纯屏幕尺寸） | 小屏布局切换 |
| `isPhoneSize` | ≤600px | 手机专属布局 |
| `isPadSize` | 601–1200px | 平板布局 |
| `isTouchDevice` | 触控能力检测 | hover → click 降级判断 |
| `isHoverDevice` | 悬停能力检测 | 是否可展示 tooltip 等 hover 组件 |

**常见用法**：

```vue
<!-- 条件渲染：移动端简化布局 -->
<div v-if="isPhonePadSize" class="compact-layout">...</div>
<div v-else class="standard-layout">...</div>

<!-- 条件样式绑定 -->
<OButton :variant="isPhonePad ? 'text' : 'solid'" />
```

> ⚠️ **Nuxt SSR 注意**：`useScreen()` 内部调用 `matchMedia`，SSR 时不可用。含 `useScreen()` 条件渲染的组件建议用 `<ClientOnly>` 包裹，或在 `app:mounted` 后访问检测值。

---

## 7. 最小可运行示例

确认集成成功的最小 SFC——一个全 token 驱动的按钮：

```vue
<script setup lang="ts">
import { OButton } from '@opensig/opendesign'
</script>

<template>
  <div class="hello">
    <OButton color="primary" variant="solid" @click="() => {}">
      OpenDesign 已就绪
    </OButton>
  </div>
</template>

<style lang="scss" scoped>
.hello {
  padding: var(--o-gap-5);
  background-color: var(--o-color-fill1);
}
</style>
```

---

## 8. 验证集成成功

1. **启动 dev server**：`pnpm dev`
2. **检查 `<html>` 标签**：浏览器 DevTools 看 `<html data-o-theme="e.light">`（或你选的社区.模式）是否生效
3. **切换主题**：点击 ThemeToggle 开关（见 [theme-system.md](theme-system.md)），观察 OSwitch 滑动、按钮颜色、背景色自动变化
4. **检查 CSS 变量**：DevTools Elements 面板查 `--o-color-primary1` 是否有值
5. **缩放窗口**：响应式 token（`--o-r-*`）应自动适配字号 / 间距

若 `<html>` 上没有 `data-o-theme` 属性，说明主题 store 未初始化——检查 `useThemeStore()` 是否在 `App.vue` setup 中被调用（SPA）或 plugin 是否注册（Nuxt）。

---

## 下一步

- 主题系统怎么集成 → [theme-system.md](theme-system.md)
- SCSS mixin / 栅格容器怎么用 → [styles-infrastructure.md](styles-infrastructure.md)
- 运行时响应式检测 → 本页「`useScreen()` 运行时响应式检测」章节
- 目录结构怎么组织 → [project-layout.md](project-layout.md)
- code review 检视 OpenDesign 用法 → [conventions.md](conventions.md)
