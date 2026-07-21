> ← 返回 [SKILL.md](../SKILL.md)

# 主题系统集成

本页讲清 OpenDesign 主题系统在工程中的完整集成：Pinia store 设计、SSR hydration 处理、社区切换、ThemeToggle 开关组件（基于 OSwitch）。所有代码来自 `templates/` 下的可运行脚手架，可直接复用。

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
| 默认浅色模式 | 默认 light，每次刷新回到 light |
| DOM 同步 | 把 `data-o-theme` 属性写入 `<html>` |
| 对外 API | `theme` / `mode` / `isDark` / `setMode` |

若业务需要持久化主题偏好，可自行接入 localStorage（SPA）或 cookie（Nuxt）。

### Store API 速查

| 成员 | 类型 | 说明 |
|------|------|------|
| `theme` | `Ref<string>` | 完整主题标识，如 `e.light` |
| `mode` | `ComputedRef<'light'\|'dark'>` | 当前明暗模式 |
| `isDark` | `WritableComputedRef<boolean>` | 是否深色；setter 调 `setMode`，可直接用于 v-model |
| `setMode(m)` | `(m) => void` | 设置模式 |

> **`storeToRefs` 必须用**：`isDark` 等状态/ref/computed 必须 `storeToRefs` 解构才保留响应性。action（`setMode`）不需要 `storeToRefs`，直接解构即可。
>
> ```typescript
> // ✅ 正确：状态走 storeToRefs
> const { isDark } = storeToRefs(useThemeStore())
> // ✅ 正确：action 直接解构
> const { setMode } = useThemeStore()
> // ❌ 错误：状态直接解构丢失响应性
> const { isDark } = useThemeStore()
> ```

### 共享常量

两个版本都导出同名常量，便于 theme toggle 组件引用：

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

SPA 无 SSR/hydration 问题，DOM 同步用 `watchEffect`。

```typescript
import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

export const OPENDESIGN_COMMUNITY = 'e' as const
export type OpendesignMode = 'light' | 'dark'
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`
export const DATA_THEME_ATTR = 'data-o-theme' as const
export const MODE_LIGHT = 'light' as const
export const MODE_DARK = 'dark' as const

export const useThemeStore = defineStore('opendesign-theme', () => {
  const theme = ref<OpendesignTheme>(
    `${OPENDESIGN_COMMUNITY}.${MODE_LIGHT}`,
  )

  const mode = computed<OpendesignMode>(
    () => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT,
  )
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val) => setMode(val ? MODE_DARK : MODE_LIGHT),
  })

  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
  }

  // DOM 同步
  watchEffect(() => {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme.value)
  })

  return { theme, mode, isDark, setMode }
})
```

---

## 4. Nuxt 版 store（`templates/nuxt/app/stores/theme.ts`）

Nuxt 有 SSR；DOM 同步用 `useHead`（Nuxt 官方 HTML 注入通道）。

> Nuxt 自动导入 `defineStore` / `ref` / `computed` / `useHead`，下方代码为自包含写法（显式 import 也合法，template 中省略 import 依赖自动导入）。

```typescript
// Nuxt 自动导入 defineStore / ref / computed / useHead，无需显式 import
// 下方为自包含写法（显式 import 也合法），实际脚手架代码省略了这些 import

export const OPENDESIGN_COMMUNITY = 'e' as const
export type OpendesignMode = 'light' | 'dark'
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`
export const DATA_THEME_ATTR = 'data-o-theme' as const
export const MODE_LIGHT = 'light' as const
export const MODE_DARK = 'dark' as const

export const useThemeStore = defineStore('opendesign-theme', () => {
  const theme = ref<OpendesignTheme>(
    `${OPENDESIGN_COMMUNITY}.${MODE_LIGHT}`,
  )

  const mode = computed<OpendesignMode>(
    () => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT,
  )
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val) => setMode(val ? MODE_DARK : MODE_LIGHT),
  })

  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`
  }

  // DOM 同步：useHead 设置 htmlAttrs（ref 本身就是响应式的，直接传入即可）
  useHead({
    htmlAttrs: {
      [DATA_THEME_ATTR]: theme,
    },
  })

  return { theme, mode, isDark, setMode }
})
```

### Nuxt hydration 处理



---

## 5. 社区切换

切换社区（如从 openEuler `e` 换到 Ascend `a`）需要同步修改**两处**：

1. **token CSS 引入**（`main.ts` / `nuxt.config.ts`）：`e.light.token.css` → `a.light.token.css`，dark 同理
2. **store 常量**：`OPENDESIGN_COMMUNITY = 'e'` → `'a'`

> 不在六社区间运行时切换——每套主题的色板、圆角、字体都不同，运行时切换会导致整站视觉跳变。

---

## 6. ThemeToggle 组件

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
> `isDark` 是 store 的 writable computed，getter 读取当前模式，setter 调用 `setMode`。**必须通过 `storeToRefs` 解构**——直接 `const { isDark } = useThemeStore()` 会丢失响应性，v-model 绑定失效。
>
> **`checked-value="false"` `unchecked-value="true"`**：`isDark=true` 表示深色，但 OSwitch 默认 checked=true 表示"ON/开启"。主题切换的语义是"ON=开灯=浅色，OFF=关灯=深色"，所以需要反转——checked 对应 `isDark=false`（浅色），unchecked 对应 `isDark=true`（深色）。

---

## 7. 常见坑

| 坑 | 现象 | 修正 |
|----|------|------|
| Nuxt `useHead` 的 `htmlAttrs` 用静态值 | 客户端切换主题后不更新 | 传入 `ref`（响应式引用自动追踪，无需手动 `computed`） |
| 改社区只改了 store 常量 | token CSS 还是旧社区，视觉错乱 | 两处同步：token CSS + store 常量 |
