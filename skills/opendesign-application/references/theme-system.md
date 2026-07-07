> ← 返回 [SKILL.md](../SKILL.md)

# 主题系统集成

本页讲清 OpenDesign 主题系统在工程中的完整集成：Pinia store 设计、防闪烁（FOUC）、SSR hydration 处理、VueUse 工具选型、社区切换、ThemeToggle 开关组件（基于 OSwitch）。所有代码来自 `templates/` 脚手架，可直接复用。

---

## 1. 主题机制回顾

OpenDesign 有六套独立主题（对应六个开源社区），每套分 light / dark 两模式：

- **社区标识**：`e` / `a` / `k` / `m` / `g` / `u`（项目初始化时选定一套）
- **模式**：`light` / `dark`（运行时切换）
- **完整主题标识**：`社区.模式`，如 `e.light`、`e.dark`
- **驱动方式**：`<html data-o-theme="e.light">`，组件库所有 CSS 变量按此属性切换

**项目初始化选社区，运行时只切 light/dark，不在六社区间切换。** 切换社区需同时更换 token CSS 引入与 store 的 `OPENDESIGN_COMMUNITY` 常量。

业务代码**不直接操作** `document.documentElement.setAttribute`，统一走 Pinia store 的 `isDark`（writable computed）或 `setMode`。**`isDark` 等状态/ref/computed 必须 `storeToRefs` 解构**——直接 `const { isDark } = useThemeStore()` 会丢失响应性。

---

## 2. Pinia 主题 store 设计

### 职责

| 职责 | 说明 |
|------|------|
| 持久化用户选择 | SPA 用 `localStorage`，SSR 用 `cookie`（服务端可读） |
| 跟随系统偏好 | `usePreferredDark` 监听 `prefers-color-scheme`，用户未显式选择时跟随 |
| DOM 同步 | 把 `data-o-theme` 属性写入 `<html>` |
| 防闪烁 | 在 JS 加载前注入内联脚本，提前设置 `data-o-theme` |
| 对外 API | `theme` / `mode` / `isDark` / `hasUserChoice` / `setMode` / `setSystemMode` |

### Store API 速查

| 成员 | 类型 | 说明 |
|------|------|------|
| `theme` | `Ref<string>` | 完整主题标识，如 `e.light` |
| `mode` | `ComputedRef<'light'\|'dark'>` | 当前明暗模式 |
| `isDark` | `WritableComputedRef<boolean>` | 是否深色；setter 调 `setMode`，可直接用于 v-model |
| `hasUserChoice` | `ComputedRef<boolean>` | 用户是否显式选择过（有持久化值 = 选过） |
| `setMode(m)` | `(m) => void` | 用户显式设置模式，写持久化 |
| `setSystemMode(m)` | `(m) => void` | 系统检测到的模式，不写持久化 |

> **`setMode` vs `setSystemMode`**：用户手动点击切换用 `setMode`（写 localStorage/cookie）；系统偏好变化用 `setSystemMode`（不写，避免覆盖用户选择）。`hasUserChoice` 为 true 时不再跟随系统。
>
> **`storeToRefs` 必须用**：`isDark` 等状态/ref/computed 必须 `storeToRefs` 解构才保留响应性。action（`setMode` / `setSystemMode`）不需要 `storeToRefs`，直接解构即可。
>
> ```typescript
> // ✅ 正确：状态走 storeToRefs
> const { isDark, hasUserChoice } = storeToRefs(useThemeStore())
> // ✅ 正确：action 直接解构
> const { setMode } = useThemeStore()
> // ❌ 错误：状态直接解构丢失响应性
> const { isDark } = useThemeStore()
> ```

### 共享常量

两个版本都导出同名常量，便于 theme toggle 组件与 plugin 引用：

```typescript
export const OPENDESIGN_COMMUNITY = 'e' as const   // 社区标识
export type OpendesignMode = 'light' | 'dark'
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`
export const MODE_LIGHT = 'light' as const
export const MODE_DARK = 'dark' as const
export const DATA_THEME_ATTR = 'data-o-theme' as const
```

---

## 3. SPA 版 store（`templates/vue-spa/src/stores/theme.ts`）

SPA 无 SSR/hydration 问题，持久化用 `localStorage`（`useStorage`），DOM 同步用 `watchEffect`，防闪烁脚本内联在 `index.html`。

```typescript
import { defineStore } from 'pinia'
import { ref, computed, watch, watchEffect } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'

export const OPENDESIGN_COMMUNITY = 'e' as const
export type OpendesignMode = 'light' | 'dark'
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`
export const THEME_STORAGE_KEY = 'opendesign-mode'
export const DATA_THEME_ATTR = 'data-o-theme' as const
export const MODE_LIGHT = 'light' as const
export const MODE_DARK = 'dark' as const

// 自定义序列化器：存 raw string，供 index.html 内联脚本直接读取
const storageSerializer = {
  read: (raw: string | null) =>
    !raw || raw === 'null' ? null : (raw as OpendesignMode),
  write: (value: OpendesignMode | null) => String(value),
}

export const useThemeStore = defineStore('opendesign-theme', () => {
  const storedMode = useStorage<OpendesignMode | null>(
    THEME_STORAGE_KEY, null, localStorage, { serializer: storageSerializer },
  )
  const prefersDark = usePreferredDark()

  const theme = ref<OpendesignTheme>(
    `${OPENDESIGN_COMMUNITY}.${storedMode.value ?? (prefersDark.value ? MODE_DARK : MODE_LIGHT)}`,
  )

  const mode = computed<OpendesignMode>(
    () => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT,
  )
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val) => setMode(val ? MODE_DARK : MODE_LIGHT),
  })
  const hasUserChoice = computed(() => storedMode.value !== null)

  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
    storedMode.value = m
  }
  function setSystemMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
  }

  // DOM 同步
  watchEffect(() => {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme.value)
  })

  // 跟随系统（仅当用户未显式选择时）
  watch(prefersDark, (isDark) => {
    if (!hasUserChoice.value) setSystemMode(isDark ? MODE_DARK : MODE_LIGHT)
  })

  return { theme, mode, isDark, hasUserChoice, setMode, setSystemMode }
})
```

### SPA 防闪烁（`index.html` 内联脚本）

CSS 变量切换依赖 `data-o-theme`，若 JS bundle 加载前属性未设置，首帧会用默认主题渲染、JS 加载后跳变一次——即 FOUC（Flash of Unstyled Content）。**必须在 Vue mount 前同步设置属性**：

```html
<!-- index.html <head> -->
<script>
  ;(function () {
    try {
      var m = localStorage.getItem('opendesign-mode')
      var v =
        m && m !== 'null'
          ? m
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
      document.documentElement.setAttribute('data-o-theme', 'e.' + v)
    } catch (e) {}
  })()
</script>
```

> ⚠️ 脚本里的 key 名（`opendesign-mode`）、值（`light`/`dark`）、社区前缀（`e`）、属性名（`data-o-theme`）必须与 store 常量一致。改社区时四处同步修改。序列化器存 raw string 就是为了让内联脚本能直接 `localStorage.getItem` 读取。

---

## 4. Nuxt 版 store（`templates/nuxt/app/stores/theme.ts`）

Nuxt 有 SSR，持久化用 `cookie`（服务端可读，SSR 时就能确定主题，不依赖客户端 localStorage）；DOM 同步用 `useHead`（Nuxt 官方 HTML 注入通道）；防闪烁脚本也通过 `useHead` 注入。

> Nuxt 自动导入 `defineStore` / `usePreferredDark` / `useCookie` / `ref` / `computed` / `useHead`，下方代码为自包含写法（显式 import 也合法，template 中省略 import 依赖自动导入）。

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePreferredDark, useCookie } from '#imports'

export const OPENDESIGN_COMMUNITY = 'e' as const
export type OpendesignMode = 'light' | 'dark'
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`
export const THEME_COOKIE_KEY = 'opendesign-mode'
export const THEME_COOKIE_OPTS = {
  default: () => null as OpendesignMode | null,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 365,
}
export const DATA_THEME_ATTR = 'data-o-theme' as const
export const MODE_LIGHT = 'light' as const
export const MODE_DARK = 'dark' as const

// 防闪烁内联脚本：优先 cookie，无则读 prefers-color-scheme
const FOUC_SCRIPT = `(function(){try{var m=document.cookie.match(/${THEME_COOKIE_KEY}=(${MODE_LIGHT}|${MODE_DARK})/);var v=m?m[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'${MODE_DARK}':'${MODE_LIGHT}');document.documentElement.setAttribute('${DATA_THEME_ATTR}','${OPENDESIGN_COMMUNITY}.'+v);}catch(e){}})()`

export const useThemeStore = defineStore('opendesign-theme', () => {
  const modeCookie = useCookie<OpendesignMode | null>(THEME_COOKIE_KEY, THEME_COOKIE_OPTS)
  const prefersDark = usePreferredDark()

  // SSR 从 cookie 读取，无则默认 light（客户端由 plugin 在 app:mounted 后更正为系统偏好）
  const theme = ref<OpendesignTheme>(
    `${OPENDESIGN_COMMUNITY}.${modeCookie.value ?? MODE_LIGHT}`,
  )

  const mode = computed<OpendesignMode>(
    () => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT,
  )
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val) => setMode(val ? MODE_DARK : MODE_LIGHT),
  })
  const hasUserChoice = computed(() => modeCookie.value !== null)

  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
    modeCookie.value = m
  }
  function setSystemMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
  }

  // DOM 同步 + 防闪烁：useHead 注入脚本与 htmlAttrs
  useHead({
    script: [{ innerHTML: FOUC_SCRIPT, tagPosition: 'head' }],
    htmlAttrs: {
      [DATA_THEME_ATTR]: computed(() => {
        // 客户端无 cookie 时直接跟随 prefersDark，与内联脚本逻辑一致
        if (import.meta.client && modeCookie.value === null) {
          return `${OPENDESIGN_COMMUNITY}.${prefersDark.value ? MODE_DARK : MODE_LIGHT}`
        }
        return theme.value
      }),
    },
  })

  return { theme, mode, isDark, hasUserChoice, setMode, setSystemMode }
})
```

### Nuxt hydration 处理（`plugins/theme.client.ts`）

Nuxt SSR 时服务端无法读 `matchMedia`，`prefersDark` 返回 `false`。若在 Vue mount 前把 store 改为 dark，ThemeToggle 的 OSwitch 会因 `v-model="isDark"` 与 SSR 渲染状态不匹配，触发 hydration 警告。**初始系统检测必须延迟到 `app:mounted` 之后**：

```typescript
// app/plugins/theme.client.ts
import { MODE_DARK, MODE_LIGHT } from '../stores/theme'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useThemeStore()
  const prefersDark = usePreferredDark()

  // 延迟到 app:mounted 之后更新 store，避免 hydration 不匹配
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
```

> 视觉主题（CSS 变量）由 store 中的 FOUC 内联脚本在 Nuxt hydration 前阻止闪烁，仅 ThemeToggle 的 OSwitch 会在 mount 后切换一次——这是可接受的。

---

## 5. 防闪烁（FOUC）原理与对比

| 维度 | SPA（vue-spa） | SSR（nuxt） |
|------|---------------|-------------|
| 持久化载体 | `localStorage` | `cookie`（服务端可读） |
| FOUC 脚本位置 | `index.html` 内联 `<script>` | `useHead` 注入 `script.innerHTML` |
| 脚本读取顺序 | 先读 localStorage，无则读 `prefers-color-scheme` | 先读 cookie，无则读 `prefers-color-scheme` |
| Vue mount 前是否已设属性 | ✅（HTML 解析阶段同步执行） | ✅（Nuxt 在 hydration 前注入到 `<head>`） |
| 序列化要求 | 存 raw string（`'light'`/`'dark'`），内联脚本直接读 | 存 raw string，内联脚本正则匹配 cookie |

**核心逻辑一致**：在 Vue 任意代码执行前，同步把 `data-o-theme` 设到 `<html>`，让首帧 CSS 就能拿到正确变量。

---

## 6. VueUse 工具选型

| 工具 | 用途 | SPA | SSR |
|------|------|-----|-----|
| `usePreferredDark()` | 监听 `prefers-color-scheme: dark` 媒体查询 | ✅ | ✅（SSR 返回 `false`，客户端更正） |
| `useStorage(key, default, storage, opts)` | `localStorage` 响应式读写 | ✅ | ❌（服务端无 localStorage） |
| `useCookie(key, opts)` | cookie 响应式读写，服务端可读 | — | ✅ |

> SPA 用 `useStorage` 是因为 localStorage 容量大、无请求开销；SSR 必须用 cookie 是因为服务端渲染时需要读到主题，否则 SSR HTML 用默认 light、客户端再跳变一次。

---

## 7. 社区切换

切换社区（如从 openEuler `e` 换到 Ascend `a`）需要同步修改**三处**：

1. **token CSS 引入**（`main.ts` / `nuxt.config.ts`）：`e.light.token.css` → `a.light.token.css`，dark 同理
2. **store 常量**：`OPENDESIGN_COMMUNITY = 'e'` → `'a'`
3. **防闪烁脚本**（`index.html` / `FOUC_SCRIPT` 字符串）：`'e.' + v` → `'a.' + v`

> 不在六社区间运行时切换——每套主题的色板、圆角、字体都不同，运行时切换会导致整站视觉跳变。

---

## 8. ThemeToggle 组件

使用 OSwitch 组件实现主题切换，滑块内嵌太阳/月亮图标，右侧标签也用图标表示目标模式。样式仅覆盖 `--switch-color`，其余由 OSwitch 自带 token 处理：

```vue
<script setup lang="ts">
import { OSwitch, OIconSun, OIconMoon } from '@opensig/opendesign'
import { storeToRefs } from 'pinia'  // Nuxt 通过 @pinia/nuxt 自动导入，可省略此行
import { useThemeStore } from '@/stores/theme'  // Nuxt 自动导入，可省略此行
const { isDark } = storeToRefs(useThemeStore())
</script>

<template>
  <!-- checked=false → light, unchecked=true → dark：checked=ON=开灯=浅色 -->
  <OSwitch
    class="theme-toggle"
    v-model="isDark"
    :checked-value="false"
    :unchecked-value="true"
  >
    <template #inactive><OIconMoon /></template>
    <template #active><OIconSun /></template>
    <template #off><OIconSun /></template>
    <template #on><OIconMoon /></template>
  </OSwitch>
</template>

<style lang="scss" scoped>
.theme-toggle {
  --switch-color: var(--o-color-info4);
}
</style>
```

> `OSwitch` 的 `--switch-color` 覆盖无需 `:deep`，直接在样式块中设置即可。详见 [switch.md](../opendesign-components/references/switch.md) 的「可覆盖的 CSS 变量」章节。
>
> `isDark` 是 store 的 writable computed，getter 读取当前模式，setter 调用 `setMode` 写持久化。**必须通过 `storeToRefs` 解构**——直接 `const { isDark } = useThemeStore()` 会丢失响应性，v-model 绑定失效。
>
> **`checked-value="false"` `unchecked-value="true"`**：`isDark=true` 表示深色，但 OSwitch 默认 checked=true 表示"ON/开启"。主题切换的语义是"ON=开灯=浅色，OFF=关灯=深色"，所以需要反转——checked 对应 `isDark=false`（浅色），unchecked 对应 `isDark=true`（深色）。

---

## 9. 常见坑

| 坑 | 现象 | 修正 |
|----|------|------|
| SPA 忘记加 `index.html` FOUC 脚本 | 首屏闪一下默认主题再切到用户主题 | 加内联脚本，读 localStorage + prefers-color-scheme |
| Nuxt `useHead` 的 `htmlAttrs` 用静态值 | 客户端无 cookie 时不会跟随系统 | 用 `computed(() => ...)`，逻辑与 FOUC 脚本一致 |
| Nuxt 在 `app:mounted` 前改 store | hydration 警告（v-if 与 SSR HTML 不匹配） | 用 `plugins/theme.client.ts` 的 `app:mounted` 钩子延迟 |
| 序列化器存 JSON | 内联脚本 `localStorage.getItem` 拿到 `"\"dark\""` 而非 `dark` | 自定义 `storageSerializer` 存 raw string |
| SSR 时读 `matchMedia` | 服务端报错 `matchMedia is not a function` | 用 `usePreferredDark`（VueUse 处理了 SSR 安全），不要直接调 `window.matchMedia` |
| 改社区只改了 store 常量 | token CSS 还是旧社区，视觉错乱 | 三处同步：token CSS + store 常量 + FOUC 脚本 |
