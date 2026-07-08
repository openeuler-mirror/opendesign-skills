> ← 返回 [SKILL.md](../SKILL.md)

# 全局样式基础设施

本页讲清 OpenDesign 工程的全局样式架构：CSS Reset（`reset.scss`）、SCSS mixin 三套（common / font / screen）、Vite/Nuxt 全局注入配置、`global.scss` 职责、栅格容器与楼层式页面结构。所有内容来自 `templates/` 脚手架。

---

## 1. SCSS mixin 三套职责

```
src/assets/styles/        # Vite SPA
app/assets/styles/        # Nuxt（Nuxt 4 的 app/ 目录）
├── reset.scss            # CSS Reset（归零 UA 默认样式，必须在 Token 之前）
├── global.scss           # 全局样式（body 基线 + 表单宽度全局规则）
└── mixin/
    ├── common.scss       # 暗色模式包装器
    ├── font.scss         # 响应式字号 + 行高 mixin
    └── screen.scss       # 响应式断点 + hover 设备能力 mixin
```

| 文件 | 职责 | 典型用法 |
|------|------|---------|
| `reset.scss` | CSS Reset（归零 UA 默认样式，必须在 Token 之前） | 全局归零基线，业务组件无需重复声明 reset 已覆盖的规则 |
| `common.scss` | 暗色模式样式包装器 `@include in-dark { ... }` | 仅 dark 模式生效的样式覆盖 |
| `font.scss` | 字号 + 行高成对输出（`display1-3` / `h1-4` / `text1-2` / `tip1-2`） | `@include h1;` 替代手写 `font-size` + `line-height` |
| `screen.scss` | 响应式断点 `respond` + hover 系列（`hoverable` / `hover` / `x-hover` / `x-svg-hover`） | `@include respond('<=pad_v') { ... }` |

---

## 2. `reset.scss` CSS Reset

reset.scss 仅做"归零"与"防御"，**不包含任何设计系统的"正值"声明**（字号/色/字重/间距等正值由 global.scss 或各组件 scoped 样式提供）。必须在 Token CSS 之前加载，确保归零规则最早生效。

### 归零规则

| 规则 | 目的 |
|------|------|
| `*, :after, :before { box-sizing: inherit; margin: 0; padding: 0; }` | 全局归零 margin/padding，统一 box-sizing |
| `button, input, select, textarea { font: inherit; color: inherit; }` | 表单控件强制继承 body 字体/字号/色 |
| `ol, ul { list-style: none; }` | 列表样式归零 |
| `h1-h6 { font-size: inherit; font-weight: inherit; }` | 标题字号/字重归零为 body 默认 |
| `a { color: inherit; text-decoration: none; }` | 链接色/装饰归零（OLink 自管） |

### 防御规则

| 规则 | 目的 |
|------|------|
| `img, video { max-width: 100%; height: auto; }` | 替换元素溢出防御 |
| `p, h1-h6 { overflow-wrap: break-word; }` | 长文本溢出防御 |
| `::selection` | 选区色消费 primary token，暗色模式用更亮的 primary 色 |

### 业务组件无需重复声明

reset.scss 已覆盖的基线规则，业务组件不再重复声明：

- `button, input, select, textarea` — 已强制 `font: inherit; color: inherit;`，仅保留意图性差异（如 `@include tip2` 更小字号）需显式声明
- `h1-h6` — 字号/字重已归零，具体权重由 `global.scss` 或组件 scoped 样式设定
- `a` — 已归零色/装饰，OLink 自管颜色与下划线动画
- `p` — 已设 `overflow-wrap: break-word`，无需在各组件手动补偿

> **为何不采纳 `img/svg { display: block }`**：脚手架大量使用行内 SVG 图标（gen:icon 产物 + OIcon 组件经 OSwitch 等行内渲染），`display: block` 会破坏行内对齐，需大量局部 override，收益低于成本。

---

## 3. 全局注入配置（必须）

三套 mixin 必须**全局注入**，否则每个 `<style lang="scss">` 都要手动 `@use`，繁琐且易错。

### Vite（`vite.config.ts`）

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#icons': fileURLToPath(new URL('./src/icon-components', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: [
          `@use "@/assets/styles/mixin/common.scss" as *;`,
          `@use "@/assets/styles/mixin/font.scss" as *;`,
          `@use "@/assets/styles/mixin/screen.scss" as *;`,
        ].join('\n'),
      },
    },
  },
})
```

### Nuxt（`nuxt.config.ts`）

```typescript
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  alias: {
    '#icons': fileURLToPath(new URL('./app/icon-components', import.meta.url)),
  },
  css: [
    '~/assets/styles/reset.scss',
    '@opensig/opendesign-token/themes/e.light.token.css',
    '@opensig/opendesign-token/themes/e.dark.token.css',
    '@opensig/opendesign-token/fonts/font-harmony.css',
    '@opensig/opendesign/es/index.css',
    '~/assets/styles/global.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/mixin/common.scss" as *;
            @use "~/assets/styles/mixin/font.scss" as *;
            @use "~/assets/styles/mixin/screen.scss" as *;
          `,
        },
      },
    },
  },
})
```

> ⚠️ **路径别名一致性**：`additionalData` 中的 `@` / `~` 必须与 `resolve.alias` 或 Nuxt 约定一致。Vite 的 `@` → `./src`、`#icons` → `./src/icon-components/`；Nuxt 的 `~` → 项目根、`#icons` → `./app/icon-components/`（在 `nuxt.config.ts` 的 `alias` 配置，`app/` 在 Nuxt 4 下自动解析）。配置后**所有 `.scss` 文件自动注入**，组件内不再 `@use`。

---

## 4. `font.scss` mixin 用法

字号与行高必须成对出现，mixin 保证配对且引用响应式 token（随视口缩放）：

### 直接应用（输出 `font-size` + `line-height`）

```scss
.hero-title {
  @include display1;   // var(--o-r-font_size-display1) + var(--o-r-line_height-display1)
  color: var(--o-color-info1);
}

.section-title { @include h2; }
.body-text { @include text2; }
.hint { @include tip1; }
```

### 单独引用响应式变量（不使用 mixin）

当需要响应式字号/行高但不使用 mixin（如在非 SCSS 上下文、或在子元素单独引用某一项时），可直接引用 `--o-r-font_size-*` / `--o-r-line_height-*` 变量：

```scss
.hero-label {
  font-size: var(--o-r-font_size-h1);
  line-height: var(--o-r-line_height-h1);
}
```

> **mixin vs 直接引用变量的选择**：
> - **需要字号 + 行高成对输出到当前元素** → 使用 `@include h1;` 等 mixin（保证配对、调用简洁）
> - **只需要单独引用某一项，或不在 SCSS 上下文中** → 直接 `var(--o-r-font_size-h1)` + `var(--o-r-line_height-h1)`

### 可用 mixin 清单

> 以下 ≥1920 列标注了 Desktop 断点（>1680px）时的字号与行高值，方便在设计稿或大屏场景下快速查找。

| mixin | ≥1920 字号 / 行高 | token | 用途 |
|-------|-------------------|-------|------|
| `display1` | 56px / 80px | `--o-r-font_size-display1` | 一级数据展示 |
| `display2` | 48px / 64px | `--o-r-font_size-display2` | 二级数据展示 |
| `display3` | 40px / 56px | `--o-r-font_size-display3` | 三级数据展示 |
| `h1` | 32px / 44px | `--o-r-font_size-h1` | 一级标题 |
| `h2` | 24px / 32px | `--o-r-font_size-h2` | 二级标题 |
| `h3` | 22px / 30px | `--o-r-font_size-h3` | 三级标题 |
| `h4` | 20px / 28px | `--o-r-font_size-h4` | 四级标题 |
| `text1` | 16px / 24px | `--o-r-font_size-text1` | 常规正文 |
| `text2` | 18px / 26px | `--o-r-font_size-text2` | 大号正文 |
| `tip1` | 14px / 22px | `--o-r-font_size-tip1` | 提示文本1 |
| `tip2` | 12px / 18px | `--o-r-font_size-tip2` | 提示文本2 |

> **为何用 mixin 而非直接 `var()`**：① 字号 + 行高成对，避免漏写行高；② 引用响应式 token，免写 media query；③ 全局注入后调用简洁。若只需单独引用某一项或不在 SCSS 上下文中，可直接使用 `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)`。

---

## 5. `screen.scss` mixin 用法

### 响应式断点 `respond`

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @include respond('pad_h') {        // 841–1200px：3列
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('<=pad_v') {      // ≤840px：1列
    grid-template-columns: 1fr;
  }
}
```

**断点速查（最常用）：**

| 断点名 | 范围 | 典型场景 |
|--------|------|---------|
| `'<=pad_v'` | ≤840px | 手机 + 平板竖屏 |
| `'pad_h'` | 841–1200px | 平板横屏 |
| `'<=pad'` | ≤1200px | 所有移动端 |
| `'>pad'` | ≥1201px | 桌面端 |
| `'laptop'` | 1201–1680px | 笔记本 |
| `'>laptop'` | ≥1681px | 大屏 |

### hover 系列

| mixin | 用途 | 用法 |
|-------|------|------|
| `hoverable` | 仅指针设备生效（筛选设备，不附加 `:hover`） | `@include hoverable { ... }` |
| `hoverable(none)` | 仅触控设备生效 | `@include hoverable(none) { ... }` |
| `hover` | 安全 hover（自动 `&:hover`，触控不残留） | `@include hover { color: red; }` |
| `x-hover` | 展开/收起箭头旋转动效 | `.arrow { @include x-hover; }` |
| `x-svg-hover` | 带 overflow 裁切的 SVG 旋转 | `.icon-wrap { @include x-svg-hover; }` |

> **`hoverable` vs `hover` 区别**：`hoverable` 只做设备筛选——`@content` 原样输出到 `(hover: hover)` 媒体查询内，不自动附加 `:hover` 伪类，适用于"指针设备上的**常驻**样式"；`hover` 自动在 `(hover: hover)` 内包裹 `&:hover`，适用于"指针设备上 **hover 瞬态**才出现的样式"，触控设备上该样式完全不存在、不会粘连残留。

```scss
// 安全 hover（触控设备不粘连残留）
.my-btn {
  opacity: 0.8;
  @include hover { opacity: 1; }
}

// 仅 hover 设备生效的样式
.action-area {
  @include hoverable {
    background-color: var(--o-color-fill3);
  }
}
```

> ⚠️ **不要直接写裸 `@media (hover: hover)` 或裸 `@media` 断点查询**，统一通过 mixin，与组件库行为一致。

---

## 6. `common.scss` 的 `in-dark`

```scss
@mixin in-dark {
  [data-o-theme$='.dark'] & {
    @content;
  }
}
```

仅 dark 模式生效的样式覆盖：

```scss
.special-card {
  background-color: var(--o-color-fill2);

  @include in-dark {
    // 仅深色模式下的额外调整
    border-color: var(--o-color-auxiliary1);
  }
}
```

> 优先用语义 token（`--o-color-*` 自带 light/dark 适配），仅在需要 dark 专属微调时用 `in-dark`。

---

## 7. `global.scss` 职责

全局样式文件只做两件事：**body 基线**与**全局渲染类规则**（无法在 scoped 样式里命中的组件内部类）。

### body 基线

```scss
body {
  margin: 0;
  background-color: var(--o-color-fill1);
  font-family: var(--o-font_family);
  font-weight: var(--o-font_weight-regular);
  @include tip1;   // 默认正文字号
}
```

### 表单控件宽度全局规则

OpenDesign 组件的根类（如 `.o-input`、`.o-select`）渲染在 scoped 边界之外，scoped `:deep()` 又被禁用，因此**表单宽度规则放全局**：

```scss
.o-form {
  .o-input,
  .o-select,
  .o-input-number,
  .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }

  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }

  /* 同行双输入（范围输入）：用 div.form-inline 包裹 */
  .form-inline {
    display: flex;
    gap: var(--form-item-main-box-inline-gap);
    width: var(--form-item-main-box-width-wide);

    .o-input,
    .o-select,
    .o-input-number {
      width: var(--form-item-main-box-width-min);
      flex: 1 1 var(--form-item-main-box-width-min);
      min-width: 0;
    }

    @include respond('<=pad_v') {
      flex-wrap: wrap;

      .o-input,
      .o-select,
      .o-input-number {
        width: 100%;
        flex: none;
      }
    }
  }
}
```

> `--form-item-main-box-width-*` 由 OForm 组件提供，绑定到 `--o-r-grid-*`，在各断点自动缩放。详见 [`../opendesign-components/SKILL.md`](../opendesign-components/SKILL.md) 的 OForm 章节。

> **为什么放全局而非 scoped**：scoped 样式无法穿透组件根类（`.o-input` 是 OInput 组件内部的类），而 `:deep(.o-input)` 被红线禁止。全局 CSS 文件中的 `.o-form .o-input` 是渲染类规则，能正常命中。

---

## 8. 栅格容器 `.o-r-grid-container`

由 `@opensig/opendesign-token` 提供，是一个**预置的 flex 容器**，负责水平留白与最大宽度约束：

```vue
<header>
  <div class="o-r-grid-container header-inner">
    <!-- 内容自动获得左右留白与最大宽度 -->
  </div>
</header>
```

- 自动应用 `--o-r-grid-padding`（外侧留白，随断点缩放）
- 自动约束最大宽度（避免大屏过宽）
- 内部是 flex，子元素默认撑满宽度

> 不要手写 `max-width` + `padding` 模拟栅格，直接用 `.o-r-grid-container`。

---

## 9. 楼层式页面结构

页面内容按三层分离：**入口**（app.vue / App.vue）只做编排，**layout** 承载骨架（AppHeader + AppFooter），**页面**（pages/*.vue）负责楼层编排。全宽页面楼层统一使用 `AppSection` 组件——它消费设计令牌承担楼层级宽度、间距与标题排版规范，页面不再手写 `.o-r-grid-container` + `.floor` CSS 组合。

```vue
<!-- layouts/default.vue：页面骨架 -->
<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

```vue
<!-- pages/index.vue：楼层内容编排 -->
<template>
  <!-- 楼层：标题 + 主体 -->
  <AppSection title="用户列表"><UserList /></AppSection>

  <!-- 楼层：标题 + 副标题 + 主体 -->
  <AppSection title="响应式栅格" subtitle="当前断点列数随窗口缩放变化">
    <TokenGridShowcase />
  </AppSection>
</template>
```

**AppSection 的楼层职责**：

| 职责 | 实现方式 |
|------|---------|
| 水平留白 + 最大宽度 | `.section-wrapper` 使用 `--o-r-grid-section-width` + `max-width: calc(100vw - --o-r-grid-section-padding)` |
| 楼层垂直间距 | `.section-wrapper` 的 `margin: var(--o-r-gap-7) auto var(--o-r-gap-10)` |
| 标题排版 | `.section-title` 使用 `@include display3`、`.section-subtitle` 使用 `@include text1` |
| 标题居中/左对齐 | `headerJustifyCenter` prop 控制 `.is-left` 修饰类 |
| 主体间距 | `.section-body` 的 `margin-top: var(--o-r-gap-7)` |

> **分工原则**：AppSection 管楼层宽度 + 间距 + 标题排版，业务组件管自身内容。两者解耦，便于增删楼层。
> 
> **非全宽布局**（左右布局侧边栏等）不应使用 AppSection，应由具体布局组件自行承载楼层结构。
> **页脚 `<footer>` 不套 AppSection**——页脚是页面结构元素而非楼层内容，只需 `o-r-grid-container` 做水平居中。

**AppSection Props 速查**：

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string \| string[]` | — | 区块标题 |
| `subtitle` | `string` | — | 副标题 |
| `full` | `boolean` | `false` | 全宽主体内容（取消宽度限制与内边距） |
| `headerJustifyCenter` | `boolean` | `true` | 头部居中/左对齐 |
| `footer` | `string` | — | 底部链接文案 |
| `footerHref` | `string` | — | 底部链接地址 |

> **不再使用的 CSS 类**：`.floor` / `.floor-first` / `.floor-last` 由 AppSection 的设计令牌间距替代，页面不再维护这些楼层 CSS 类。

---

## 10. `useScreen()` 运行时响应式检测

SCSS mixin（`respond` / `hover` / `hoverable`）处理 CSS 层面的响应式，而 `useScreen()` composable 处理**运行时 JS 层面**的条件判断——适用于 `v-if` 条件渲染或 `:class` / `:style` 条件绑定。

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

**与 SCSS mixin 的分工**：

| 层面 | 工具 | 场景 |
|------|------|------|
| CSS 样式变化 | `@include respond` / `@include hover` | 字号、间距、布局列数、hover 效果 |
| DOM 结构变化 | `useScreen()` + `v-if` | 整块区域不同渲染（如 Popup → Dialog） |
| 属性值变化 | `useScreen()` + `:prop` | 同一组件在不同断点用不同 prop 值 |

> **优先用 SCSS mixin**——CSS 层面的响应式更轻量、无 hydration 问题。只有 DOM 结构确实不同时才用 `useScreen()` + `v-if`。

### Nuxt 中使用 `<ClientOnly>`

`useScreen()` 内部调用 `matchMedia`，Nuxt SSR 时不可用。含 `useScreen()` 条件渲染的组件建议用 `<ClientOnly>` 包裹：

```vue
<ClientOnly>
  <div v-if="isPhonePadSize">移动端布局</div>
  <div v-else>桌面端布局</div>
  <template #fallback>
    <div>加载中...</div>
  </template>
</ClientOnly>
```

---

## 11. 组件内样式约定

```vue
<style lang="scss" scoped>
.section-title {
  @include h2;
  color: var(--o-color-info1);
  margin: 0 0 var(--o-gap-5);
}

.block {
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius-l);
  padding: var(--o-gap-4);
  box-shadow: var(--o-shadow-1);
}
</style>
```

- **`<style lang="scss" scoped>`**：组件样式 scoped 化，不泄漏
- **BEM 命名**：`.block__title--active` 风格，嵌套 ≤ 3 层
- **全 token 驱动**：颜色 `var(--o-color-*)`、间距 `var(--o-gap-*)`、圆角 `var(--o-radius-*)`、字号 `@include h*`
- **无 `:deep`**：组件内部样式走全局规则或组件 props
- **响应式用 mixin**：`@include respond('断点')`、`@include hover`

更多编码约定与 code review 检查清单见 [conventions.md](conventions.md)。
