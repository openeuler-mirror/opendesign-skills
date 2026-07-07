> ← 返回 [SKILL.md](../SKILL.md)

# 编码约定与 Code Review 检查清单

本页是 OpenDesign 工程化落地的**应用层编码约定**，并给出 code review 时检视 OpenDesign 用法的完整清单。与 [`../opendesign-codegen/references/engineering-rules.md`](../opendesign-codegen/references/engineering-rules.md) 互补——那里面向设计师直出 SFC，这里面向工程项目的日常开发与 review。

---

## 1. 硬规则红线（违反即视为集成失败）

### 1.1 组件优先

凡 OpenDesign 组件库已提供的能力，**必须**用组件 props / slots / events 实现，不自造原生替代：

```vue
<!-- ✅ 正确 -->
<OButton color="primary" @click="handleSubmit">提交</OButton>
<OInput v-model="form.name" placeholder="请输入" />

<!-- ❌ 错误：原生替代 -->
<button class="my-btn" @click="handleSubmit">提交</button>
<input v-model="form.name" placeholder="请输入" />
```

组件 API 查 [`../opendesign-components/SKILL.md`](../opendesign-components/SKILL.md)。

### 1.2 Token 优先

颜色 / 间距 / 字号 / 圆角 / 阴影 / 动效一律 `var(--o-*)`，禁止硬编码：

```scss
// ✅ 正确
color: var(--o-color-info1);
padding: var(--o-gap-3);
border-radius: var(--o-radius-l);
@include h2;

// ❌ 错误
color: #1a1a1a;
padding: 16px;
border-radius: 8px;
font-size: 20px;
```

**语义色用 `--o-color-*`，严禁直接用色板变量**（`--o-kleinblue-*` / `--o-grey-*` / `--o-brand-*` 等只能由语义 token 内部引用）：

```scss
// ✅ 正确
color: var(--o-color-info1);
background: var(--o-color-primary1);

// ❌ 错误：直接用色板
color: var(--o-grey-14);
background: var(--o-kleinblue-6);
```

token 变量名查 [`../opendesign-tokens/SKILL.md`](../opendesign-tokens/SKILL.md)。

### 1.3 `:deep` 禁令

在 `<style scoped>` 中**严禁**使用 `:deep()` 修改 OpenDesign 组件内部样式：

```scss
// ❌ 错误
.my-form :deep(.o-form-item) { margin-bottom: 0; }
.my-form :deep(.o-input) { width: 200px; }

// ✅ 正确：全局 CSS 文件中设置渲染类
// global.scss
.o-form .o-input { width: var(--form-item-main-box-width-standard); }

// ✅ 正确：在父元素覆盖组件暴露的 CSS 变量
.my-form { --form-item-gap: 32px; }

// ✅ 正确：通过组件 props 控制
<OInput size="medium" variant="outline" />
```

### 1.4 `<script setup lang="ts">` + BEM + scoped

- props 用 `defineProps<T>()` 泛型，不用字符串数组式
- `<style lang="scss" scoped>` + BEM 命名，嵌套 ≤ 3 层
- 无内联 `style="..."`（动态值等极特殊情况除外并注释）；无 `!important`

### 1.5 主题切换走 store + storeToRefs

业务代码**不直接操作** `document.documentElement.setAttribute`，统一走 Pinia store。**store 中的状态/ref/computed 必须 `storeToRefs` 解构**——直接解构会丢失响应性，v-model 绑定失效：

```typescript
// ✅ 正确：通过 storeToRefs 解构 writable computed（v-model 绑定）
const { isDark } = storeToRefs(useThemeStore())
isDark.value = !isDark.value  // 切换
isDark.value = true            // 设深色
isDark.value = false           // 设浅色

// ✅ 正确：通过 setMode 显式设置（action 不需要 storeToRefs）
const { setMode } = useThemeStore()
setMode('dark')

// ❌ 错误：直接解构丢失响应性
const { isDark } = useThemeStore()  // isDark 变成普通值，不响应切换

// ❌ 错误：直接操作 DOM
document.documentElement.setAttribute('data-o-theme', 'e.dark')
```

### 1.6 样式引入顺序

CSS Reset → Token CSS → 鸿蒙字体 → 组件库样式 → 项目全局样式，**不可调换**。见 [getting-started.md](getting-started.md)。

### 1.7 i18n

不写死面向用户的文字，用目标工程的 i18n 方案（`t('module.key')`）。

### 1.8 图标使用规范

**禁止内联 `<svg>` 标签**。图标来源分两类，按场景选用：

| 图标来源 | 导入方式 | 适用场景 |
|---------|---------|---------|
| **组件库内置图标**（OIconSun、OIconMoon 等） | `import { OIconSun } from '@opensig/opendesign'` | 已有对应组件库图标时优先使用（如主题切换 OSwitch 的 slot） |
| **项目自定义图标**（gen:icon 产物） | `import { AppIconXxx } from '#icons'` | 组件库无对应图标时的业务图标 |

```vue
<!-- ✅ 正确：组件库内置图标（已有 OIconSun 时优先用组件库） -->
<script setup lang="ts">
import { OIconSun } from '@opensig/opendesign'
</script>
<template>
  <OIconSun />
</template>

<!-- ✅ 正确：项目自定义图标（组件库无对应图标时用 gen:icon 产物） -->
<script setup lang="ts">
import { AppIconSearch } from '#icons'
</script>
<template>
  <AppIconSearch class="my-icon" />
</template>

<!-- ❌ 错误：内联 SVG -->
<template>
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
  </svg>
</template>
```

图标分类规则、命名规范、生成流程详见 **opendesign-scripts** skill → gen:icon。

---

## 2. 应用层补充约定

### 2.1 表单宽度走 `global.scss`

表单控件宽度规则放 `global.scss` 的 `.o-form .o-input` 等渲染类，**不在组件 scoped 样式里 `:deep`**。见 [styles-infrastructure.md](styles-infrastructure.md) 的 `global.scss` 章节。

### 2.2 hover 交互走 mixin

```scss
// ✅ 正确：安全 hover（触控设备不粘连残留）
.my-btn {
  opacity: 0.8;
  @include hover { opacity: 1; }
}

// ❌ 错误：裸 :hover（触控设备点击后会粘连）
.my-btn:hover { opacity: 1; }

// ❌ 错误：裸 @media
@media (hover: hover) {
  .my-btn:hover { opacity: 1; }
}
```

### 2.3 字号成对用 `font.scss` mixin

```scss
// ✅ 正确：字号 + 行高成对输出，且引用响应式 token
.title { @include h2; }

// ❌ 错误：只写字号，漏行高，且硬编码
.title { font-size: 20px; }
```

### 2.4 响应式断点用 `respond`

```scss
// ✅ 正确
@include respond('<=pad_v') { grid-template-columns: 1fr; }

// ❌ 错误：裸 @media
@media (max-width: 840px) { grid-template-columns: 1fr; }
```

---

## 3. Code Review 检查清单（OpenDesign 相关）

code review 时遇到 OpenDesign 相关调用，按下表逐项检视：

### 3.1 样式引入

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 引入顺序 | Reset → Token → 字体 → 组件样式 → 全局样式 | 组件样式在 Token 之前；Reset 缺失或在 Token 之后 |
| 社区 token 文件 | 与 `OPENDESIGN_COMMUNITY` 常量一致 | 引入 `e.*.token.css` 但常量是 `'a'` |
| 字体引入 | 在组件样式之前 | 字体在组件样式之后 |

### 3.2 组件用法

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 组件优先 | `<OButton>` / `<OInput>` 等真实组件 | 原生 `<button>` / `<select>` / `<input>` 替代 |
| 从 `@opensig/opendesign` 导入 | `import { OButton } from '@opensig/opendesign'` | 从其他路径导入 |
| props 取值 | 枚举值在合法集合内 | 传了组件不支持的 prop 值 |
| v-model | 支持 v-model 的组件用 `v-model` 绑定 writable computed / ref | `:modelValue` + `@update:modelValue` 拆写 |

### 3.3 样式与 token

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| `:deep` | scoped 样式中无 `:deep(.o-*)` | 出现 `:deep(.o-input)` / `:deep(.o-form-item)` |
| 颜色 | `var(--o-color-*)` 语义 token | 硬编码 `#fff` / `rgb()` / 色板 `var(--o-grey-14)` |
| 间距 | `var(--o-gap-*)` / `var(--o-r-gap-*)` | 硬编码 `16px` / `32px` |
| 字号 | `@include h*` / `var(--o-r-font_size-*)` | 硬编码 `font-size: 20px` |
| 圆角 | `var(--o-radius-*)` | 硬编码 `border-radius: 8px` |
| 阴影 | `var(--o-shadow-*)` | 硬编码 `box-shadow: 0 2px 8px rgba(...)` |
| 内联样式 | 无 `style="..."` | 大量内联 style（动态值除外） |
| `!important` | 无 | 出现 `!important` |

### 3.4 主题系统

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 主题切换 | 走 store 的 `isDark`（`storeToRefs` 解构）或 `setMode` | 直接 `document.setAttribute` 操作；直接解构 `const { isDark } = useThemeStore()` 丢失响应性 |
| 持久化 | SPA 用 `useStorage`、SSR 用 `useCookie` | SPA 用 cookie（无需服务端可读，且受 4KB 限制）；SSR 用 localStorage（服务端不可读） |
| 防闪烁 | `index.html` 内联脚本 / `useHead` 注入 | 无 FOUC 脚本，首屏闪烁 |
| Nuxt hydration | `plugins/theme.client.ts` 延迟到 `app:mounted` | 在 store 顶层直接读 `prefersDark` 改值 |
| 社区切换 | 三处同步（token CSS + 常量 + FOUC 脚本） | 只改了 store 常量 |

### 3.5 响应式与 hover

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 断点查询 | `@include respond('断点')` | 裸 `@media (max-width: ...)` |
| hover | `@include hover`（安全 hover）/ `@include hoverable` | 裸 `:hover` / 裸 `@media (hover: hover)` |
| 响应式字号 | `@include h*`（引用 `--o-r-font_size-*`） | 硬编码字号 + 手写 media query |
| 运行时响应式 | `useScreen()` composable | 裸 `window.matchMedia` / 裸 `window.innerWidth` |
| Nuxt `<ClientOnly>` | 含 `useScreen()` 条件渲染的部分用 `<ClientOnly>` 包裹 | Nuxt 中含 `v-if="isPhonePadSize"` 无 `<ClientOnly>` 导致 hydration 不匹配 |

### 3.6 工程化

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| SCSS 全局注入 | `additionalData` 配置了三套 mixin | 组件内手动 `@use` mixin |
| 栅格容器 | `.o-r-grid-container` | 手写 `max-width` + `padding` 模拟 |
| `<script setup lang="ts">` | 是 | Options API 或非 TS |
| BEM 命名 | `.block__element--modifier` | 非规范命名 |
| 嵌套深度 | ≤ 3 层 | 过深嵌套 |

---

## 4. 常见违规示例与修正

### 4.1 `:deep` 修改组件宽度

```scss
// ❌ 违规
.demo-form {
  :deep(.o-input) { width: var(--form-item-main-box-width-standard); }
}

// ✅ 修正：删掉组件内 :deep，宽度由 global.scss 的 .o-form .o-input 统一管理
// 组件内只管自身 layout
.form-inline {
  display: flex;
  gap: var(--form-item-main-box-inline-gap);
  width: var(--form-item-main-box-width-wide);
}
```

### 4.2 硬编码颜色

```scss
// ❌ 违规
.title { color: #1a1a1a; }
.bg { background-color: #f5f5f5; }

// ✅ 修正
.title { color: var(--o-color-info1); }
.bg { background-color: var(--o-color-fill2); }
```

### 4.3 原生标签替代组件

```vue
<!-- ❌ 违规 -->
<button class="primary-btn" @click="submit">提交</button>

<!-- ✅ 修正 -->
<OButton color="primary" variant="solid" @click="submit">提交</OButton>
```

### 4.4 裸 `:hover`

```scss
// ❌ 违规：触控设备点击后粘连
.card:hover { box-shadow: var(--o-shadow-2); }

// ✅ 修正
.card {
  @include hover { box-shadow: var(--o-shadow-2); }
}
```

### 4.5 直接操作 DOM 切换主题

```typescript
// ❌ 违规
document.documentElement.setAttribute('data-o-theme', 'e.dark')

// ✅ 修正：通过 storeToRefs 解构 writable computed
const { isDark } = storeToRefs(useThemeStore())
isDark.value = true

// ✅ 修正：通过 setMode（action 无需 storeToRefs）
const { setMode } = useThemeStore()
setMode('dark')
```

### 4.6 裸 `window.matchMedia` 或裸 `window.innerWidth`

```typescript
// ❌ 违规：裸 matchMedia / innerWidth 判断断点
const isMobile = window.matchMedia('(max-width: 840px)').matches
const isMobile2 = window.innerWidth <= 840

// ✅ 修正：使用 useScreen() composable
const { isPhonePadSize, isPhonePad } = useScreen()
// isPhonePadSize = ≤840px，isPhonePad = ≤1200px + 触控设备
```

### 4.7 Nuxt 中缺少 `<ClientOnly>` 导致 hydration 不匹配

```vue
<!-- ❌ 违规：Nuxt 中含 useScreen() 条件渲染无 ClientOnly -->
<div v-if="isPhonePadSize">移动端布局</div>

<!-- ✅ 修正：用 ClientOnly 包裹 -->
<ClientOnly>
  <div v-if="isPhonePadSize">移动端布局</div>
  <div v-else>桌面端布局</div>
  <template #fallback>
    <div>加载中...</div>
  </template>
</ClientOnly>
```

---

## 5. 自动化检视提示

code review 时可用正则快速扫描违规信号：

| 违规 | 搜索正则 |
|------|---------|
| `:deep` 误用 | `:deep\(\.o-` （在 `.vue` 文件） |
| 硬编码 hex | `#[0-9a-fA-F]{3,8}\b`（在 `.vue` / `.scss`，排除注释） |
| 硬编码 px 字号 | `font-size:\s*\d+px` |
| 裸 `:hover` | `(?<!@include )&:hover|(?<!@include ):hover`（粗略） |
| 原生 button | `<button` （在 `.vue` template） |
| 直接 setAttribute | `setAttribute\(['"]data-o-theme` |
| Pinia 解构丢响应 | `const \{ isDark \} = useThemeStore` （不含 `storeToRefs`） |
| 裸 matchMedia | `window\.matchMedia` （在 `.vue` script，排除 useScreen 内部） |
| 裸 innerWidth | `window\.innerWidth` （在 `.vue` script） |

> 正则只做初筛，命中后人工判断是否属于动态值等例外情况。
