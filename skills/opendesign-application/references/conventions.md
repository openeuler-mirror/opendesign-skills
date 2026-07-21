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

颜色 / 间距 / 字号 / 圆角 / 阴影 / 动效一律 `var(--o-*)`，禁止硬编码。其中字号、间距、行高等有响应式变体的 token，**优先使用响应式版本**（`--o-r-font_size-*` / `--o-r-line_height-*` / `--o-r-gap-*`），静态 token（`--o-font_size-*` / `--o-gap-*`）仅用于需要固定不变的布局场景：

```scss
// ✅ 正确：响应式 token 优先（随视口自动缩放）
font-size: var(--o-r-font_size-h3);
line-height: var(--o-r-line_height-h3);
padding: var(--o-r-gap-3);
@include h2;  // mixin 内部已引用响应式 token

// ⚠️ 仅需要固定不变的布局尺寸才用静态 token
.sidebar { width: var(--o-gap-20); }  // 固定侧边栏宽度，不应随视口变化

// ❌ 错误：硬编码
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

### 1.5 样式引入顺序

CSS Reset → Token CSS → 鸿蒙字体 → 组件库样式 → 项目全局样式，**不可调换**。见 [getting-started.md](getting-started.md)。

### 1.6 图标使用规范

**禁止内联 `<svg>` 标签**。图标来源分两类：

1. **组件库内置图标**（OIconSun、OIconMoon 等）——已有对应图标时优先使用
2. **项目自定义图标**——通过 `gen:icon` 命令生成 SVG 组件，并在项目中配置导出别名，业务代码按项目约定的别名路径导入即可

```vue
<!-- ✅ 正确：组件库内置图标 -->
<script setup lang="ts">
import { OIconSun } from '@opensig/opendesign'
</script>
<template>
  <OIconSun />
</template>

<!-- ✅ 正确：项目自定义图标（导入路径取决于项目的 gen:icon 配置） -->
<script setup lang="ts">
import { IconSearch } from '@/icons'  // 项目自行配置别名与导出路径
</script>
<template>
  <IconSearch class="my-icon" />
</template>

<!-- ❌ 错误：内联 SVG -->
<template>
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
  </svg>
</template>
```

`gen:icon` 的使用方式与配置详见 **opendesign-scripts** skill。

---

## 2. 应用层补充约定

### 2.1 表单宽度建议走 `global.scss`

表单控件宽度规则建议放 `global.scss` 的 `.o-form .o-input` 等渲染类，而非在组件 scoped 样式里 `:deep`（`1.3 :deep` 禁令是红线，此条是建议做法）。见 [styles-infrastructure.md](styles-infrastructure.md) 的 `global.scss` 章节。

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

### 2.3 字号成对用 `font.scss` mixin 或直接引用响应式变量

```scss
// ✅ 正确：字号 + 行高成对输出，且引用响应式 token
.title { @include h2; }

// ✅ 正确：单独引用响应式变量（不需要 mixin 输出到当前元素时）
.hero-label {
  font-size: var(--o-r-font_size-h1);
  line-height: var(--o-r-line_height-h1);
}

// ❌ 错误：只写字号，漏行高，且硬编码
.title { font-size: 20px; }
```

**mixin vs 直接引用变量的选择**：
- 需要字号 + 行高成对输出到当前元素 → 使用 `@include h*` mixin（保证配对、调用简洁）
- 只需要单独引用某一项，或不在 SCSS 上下文中 → 直接 `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)`

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
| 间距 | `var(--o-r-gap-*)` 响应式优先；固定布局用 `var(--o-gap-*)` | 硬编码 `16px` / `32px`；非固定场景用静态 `--o-gap-*` |
| 字号 | `@include h*` / `var(--o-r-font_size-*)` 响应式优先 | 硬编码 `font-size: 20px`；页面级用静态 `--o-font_size-*` |
| 圆角 | `var(--o-radius-*)` | 硬编码 `border-radius: 8px` |
| 阴影 | `var(--o-shadow-*)` | 硬编码 `box-shadow: 0 2px 8px rgba(...)` |
| 内联样式 | 无 `style="..."` | 大量内联 style（动态值除外） |
| `!important` | 无 | 出现 `!important` |
| 行高 | 字号与行高成对出现（`@include h*` 或 `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)`）；刻意只用一项时须注释说明意图 | 只写字号漏行高且无注释说明；只写行高漏字号且无注释说明 |
| 字重 | `var(--o-font_weight-*)` | 硬编码 `font-weight: 600` / `700` / `bold` |
| 动画时间 / 缓动 | `var(--o-duration-*)` + `var(--o-easing-*)` | 硬编码 `transition: all 300ms` / `cubic-bezier(...)` |
| 字号引用方式 | `@include h*`（字号行高成对输出）或 `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)`（单独引用）；刻意只用一项须注释 | 硬编码字号行高；只写字号漏行高且无注释说明 |
| 组件样式定制途径 | CSS 变量覆盖（如 `--switch-color`）、slot 内容替换、props 传参 | 用 `:deep` 穿透组件内部 class；全局 CSS 覆盖非渲染类组件内部 class（`.o-btn__text`） |
| 表单控件宽度 | `global.scss` 中通过渲染类（`.o-form .o-input`）引用 OForm 导出的宽度变量（`--form-item-main-box-width-*`）统一约束；参考脚手架模板 `global.scss` | 组件 scoped 内 `:deep` 修改控件宽度；硬编码 `width: 200px` |

### 3.4 响应式与 hover

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 断点查询 | `@include respond('断点')` | 裸 `@media (max-width: ...)` |
| hover | `@include hover`（安全 hover）/ `@include hoverable` | 裸 `:hover` / 裸 `@media (hover: hover)` |
| 响应式字号 | `@include h*`（引用 `--o-r-font_size-*`） | 硬编码字号 + 手写 media query |
| 运行时响应式 | `useScreen()` composable | 裸 `window.matchMedia` / 裸 `window.innerWidth` |
| Nuxt `<ClientOnly>` | 含 `useScreen()` 条件渲染的部分用 `<ClientOnly>` 包裹 | Nuxt 中含 `v-if="isPhonePadSize"` 无 `<ClientOnly>` 导致 hydration 不匹配 |
| mixin vs useScreen 分工 | CSS 层面样式变化用 SCSS mixin（`respond` / `hover`）；仅 DOM 结构确实不同时用 `useScreen()` + `v-if` | 纯样式变化（字号/间距/布局列数）却用 `useScreen()` + `:style` / `:class` 代替 mixin |

### 3.5 工程化

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| SCSS 全局注入 | `additionalData` 配置了三套 mixin | 组件内手动 `@use` mixin |
| 栅格容器 | `.o-r-grid-container` | 手写 `max-width` + `padding` 模拟 |
| `<script setup lang="ts">` | 是 | Options API 或非 TS |
| BEM 命名 | `.block__element--modifier` | 非规范命名 |
| 嵌套深度 | ≤ 3 层 | 过深嵌套 |
| gen:icon 产物目录 | `icon-components/` 纳入 `.gitignore`，不手动编辑或提交 | 手动编辑 `icon-components/` 下文件；目录未纳入 `.gitignore` |

---

## 4. 常见违规示例与修正

### 4.1 表单宽度走 `global.scss`

```scss
// ❌ 违规：组件内 :deep 修改宽度
.demo-form {
  :deep(.o-input) { width: var(--form-item-main-box-width-standard); }
}

// ✅ 修正：宽度由 global.scss 的渲染类统一管理
// global.scss 中已有 .o-form .o-input { width: var(--form-item-main-box-width-standard); }
// 组件内只管自身 layout——参考脚手架模板（templates/nuxt 或 templates/vue-spa）的 global.scss
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

### 4.5 裸 `window.matchMedia` 或裸 `window.innerWidth`

```typescript
// ❌ 违规：裸 matchMedia / innerWidth 判断断点
const isMobile = window.matchMedia('(max-width: 840px)').matches
const isMobile2 = window.innerWidth <= 840

// ✅ 修正：使用 useScreen() composable
const { isPhonePadSize, isPhonePad } = useScreen()
// isPhonePadSize = ≤840px，isPhonePad = ≤1200px + 触控设备
```

### 4.6 Nuxt 中缺少 `<ClientOnly>` 导致 hydration 不匹配

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

### 4.7 字号与行高未成对

```scss
// ❌ 违规：只写字号，漏行高
.title { font-size: var(--o-r-font_size-h3); }

// ✅ 修正：字号 + 行高成对（优先用 mixin）
.title { @include h3; }

// ✅ 也可：手动成对引用响应式 token
.title {
  font-size: var(--o-r-font_size-h3);
  line-height: var(--o-r-line_height-h3);
}

// ⚠️ 刻意只用一项时须注释说明意图
.icon-label {
  font-size: var(--o-font_size-tip2);
  // line-height 不设置：刻意继承父元素行高，避免多行图标标签换行
}
```

### 4.8 硬编码字重

```scss
// ❌ 违规
.title { font-weight: 600; }
.bold-text { font-weight: bold; }

// ✅ 修正
.title { font-weight: var(--o-font_weight-semibold); }   // 600
.bold-text { font-weight: var(--o-font_weight-bold); }    // 700
```

### 4.9 硬编码动画时间与缓动

```scss
// ❌ 违规
.card { transition: all 300ms ease; }
.modal { transition: opacity 250ms cubic-bezier(0.2, 0, 0, 1); }

// ✅ 修正
.card { transition: all var(--o-duration-m2) var(--o-easing-standard); }
.modal { transition: opacity var(--o-duration-m1) var(--o-easing-standard-in); }
```

### 4.10 响应式字号引用方式误用

```scss
// ❌ 违规：硬编码字号而非使用 mixin 或响应式变量
.hero-title { font-size: 32px; line-height: 44px; }

// ✅ 修正一：使用 mixin（字号 + 行高成对输出）
.hero-title { @include h1; }

// ✅ 修正二：直接引用响应式变量（不需要 mixin 成对输出时）
.hero-label {
  font-size: var(--o-r-font_size-h1);
  line-height: var(--o-r-line_height-h1);
}

// ⚠️ 刻意只用一项时须注释说明意图
.icon-label {
  font-size: var(--o-r-font_size-tip1);
  // line-height 不设置：刻意继承父元素行高，避免多行图标标签换行
}
```

### 4.11 组件样式定制途径

```scss
// ❌ 违规：用 :deep 穿透修改组件内部样式
.my-form :deep(.o-form-item) { margin-bottom: 0; }
.my-switch :deep(.o-switch__track) { background-color: red; }

// ✅ 修正方式一：CSS 变量覆盖（无需 :deep，在 scoped 样式中直接设置）
.my-switch { --switch-color: var(--o-color-info4); }

// ✅ 修正方式二：props 传参
<OInput size="medium" variant="outline" />
<OForm :label-position="isPhonePadSize ? 'top' : 'left'" />

// ✅ 修正方式三：slot 内容替换
<OSwitch v-model="isDark">
  <template #inactive><OIconMoon /></template>
  <template #active><OIconSun /></template>
</OSwitch>
```

### 4.12 纯样式变化误用 useScreen()

```vue
<!-- ❌ 违规：纯样式变化却用 JS 响应式 -->
<script setup lang="ts">
const { isPhonePadSize } = useScreen()
</script>
<template>
  <div :class="{ 'compact': isPhonePadSize }">...</div>
</template>
<style lang="scss" scoped>
.compact { grid-template-columns: 1fr; }
</style>

<!-- ✅ 修正：纯样式变化用 SCSS mixin -->
<template>
  <div class="grid-section">...</div>
</template>
<style lang="scss" scoped>
.grid-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @include respond('<=pad_v') { grid-template-columns: 1fr; }
}
</style>

<!-- ✅ useScreen() 的正确场景：DOM 结构确实不同 -->
<ClientOnly>
  <OPopup v-if="isPhonePadSize" title="详情">...</OPopup>
  <ODialog v-else title="详情">...</ODialog>
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
| Pinia 解构丢响应 | `const \{ isDark \} = useThemeStore` （不含 `storeToRefs`）— 需读取主题状态时 |
| 裸 matchMedia | `window\.matchMedia` （在 `.vue` script，排除 useScreen 内部） |
| 裸 innerWidth | `window\.innerWidth` （在 `.vue` script） |
| 硬编码字重 | `font-weight:\s*(600|700|bold)` （在 `.vue` / `.scss`，排除 `var(--o-font_weight-*)`） |
| 硬编码动画时间 | `transition:.*\d+ms\b` （粗略，排除 `var(--o-duration-*)`） |
| 硬编码缓动曲线 | `cubic-bezier\(` （在 `.vue` / `.scss`，排除 `var(--o-easing-*)`） |
| 硬编码字号行高 | `font-size:\s*\d+px` （在 `.vue` / `.scss`，排除注释） |

> 正则只做初筛，命中后人工判断是否属于动态值等例外情况。
