# AGENTS.md — Nuxt 4 SSR 脚手架

本文件为 AI 编码工具（及不熟悉代码的设计师）在此项目中工作时提供 **Nuxt 专属约束、组件拆分规范、公共抽象模式与项目级操作指导**。样式硬规则、token 用法、mixin 详细说明、主题系统完整集成、反模式清单等通用规范已由 **opendesign-application skill** 覆盖，此处不再重复——遇到具体问题按下方「查阅指引」定位。

---

## 项目定位

这是一个基于 **Nuxt 4 + Vue 3 + Pinia** 的 SSR（服务端渲染）脚手架，集成了 OpenDesign 设计系统。有 SSR/hydration，适合官网、内容站、需要 SEO 的场景。

> ⚠️ **SSR 项目比 SPA 多一层复杂度**：服务端无法访问 `window` / `matchMedia` / `localStorage`，必须遵守 SSR 安全守卫。违反会导致 hydration 不匹配或服务端报错。

---

## 一、架构约束（红线）

### 1.1 技术栈不可替换

| 层面 | 选型 | 不可替换为 |
|------|------|-----------|
| 框架 | Nuxt 4（含 Vue 3） | 纯 Vite SPA / React / Vue 2 |
| 状态管理 | Pinia（@pinia/nuxt 模块） | Vuex / 手写 reactive |
| CSS 预处理 | SCSS（sass-embedded） | Less / Stylus / 纯 CSS |
| 设计系统 | @opensig/opendesign + @opensig/opendesign-token | 自造 UI / 其他组件库 |
| 图标生成 | @opensig/open-scripts gen:icon | 手写 SVG 内联 / 其他图标方案 |
| 工具库 | @vueuse/nuxt（自动导入 composables） | 手写替代 VueUse 已有功能 |

> Nuxt 自动注册 Pinia、自动导入 VueUse composables、自动导入 `components/` 下的组件。**不要手动 `app.use(createPinia())` 或手动 import 组件**。

### 1.2 入口/配置文件职责划分

| 文件 | 职责 | 严禁做的事 |
|------|------|-----------|
| `nuxt.config.ts` | 模块注册 + css 数组（样式引入顺序） + vite 配置 + `#icons` 别名 | 不在此写业务逻辑、不在此注册全局组件 |
| `app/app.vue` | 应用入口编排（NuxtLayout + NuxtPage） | 不在此写骨架、不在此写楼层内容、不在此做数据请求 |
| `app/layouts/default.vue` | 页面骨架（AppHeader + slot + AppFooter） | 不在此写楼层内容、不在此做数据请求 |
| `app/pages/*.vue` | 页面楼层内容编排 | 不在此写骨架结构 |
| `app/plugins/theme.client.ts` | 系统暗色偏好检测（仅客户端，延迟到 `app:mounted`） | 不在此写业务逻辑、不在此访问 localStorage |
| `icons/icon.config.ts` | gen:icon 配置（SVG 源目录 → Vue 图标组件输出） | 不在此写业务逻辑 |

> Nuxt 没有 `main.ts`——所有配置在 `nuxt.config.ts`，应用入口在 `app/app.vue`。

### 1.3 样式引入顺序

**红线，违反即视觉错乱。** 顺序：CSS Reset → Token CSS → 鸚鸿字体 → 组件库样式 → 项目全局样式。原理详见 opendesign-application skill → getting-started。Nuxt 中由 `nuxt.config.ts` 的 `css` 数组保证（**数组顺序即输出顺序**），不可调换、不可跳过。

> CSS Reset（`reset.scss`）必须在 Token 之前——归零规则最早生效，后续 Token / 组件样式 / global.scss 覆盖可正常叠加。reset.scss 详解见 opendesign-application skill → styles-infrastructure。

---

## 二、SSR 安全守卫（Nuxt 专属红线）

> 以下为 Nuxt SSR 专属约束，SPA 项目无此问题。完整主题系统集成（含 hydration 原理、防闪烁、`useCookie` 替代 `localStorage`）详见 opendesign-application skill → theme-system。

### 2.1 服务端不可用的 API

| API / 对象 | 服务端状态 | 替代方案 |
|-----------|-----------|---------|
| `window` | ❌ undefined | `import.meta.client` 守卫 或 `onMounted` 后访问 |
| `document` | ❌ undefined | `import.meta.client` 守卫 或 `onMounted` 后访问 |
| `localStorage` | ❌ undefined | `useCookie()`（服务端可读） |
| `matchMedia` | ❌ undefined | `usePreferredDark()`（VueUse 处理了 SSR 安全） |
| `innerWidth` | ❌ undefined | `useScreen()`（仅在客户端可用） |

### 2.2 Hydration 不匹配防范

> 详细原理与代码示例见 opendesign-application skill → theme-system 的「Nuxt hydration 处理」章节，以及 conventions 的 Code Review 检查清单「主题系统 / Nuxt `<ClientOnly>`」条目。

核心规则：
- **不在 `app:mounted` 前改 store 状态**——SSR HTML 与客户端不一致时触发 hydration 警告。系统暗色检测必须在 `plugins/theme.client.ts` 的 `app:mounted` 钩子后更新。
- **含 `useScreen()` 条件渲染必须 `<ClientOnly>` 包裹**——服务端无 `matchMedia`，默认值与客户端不同。
- **持久化统一用 `useCookie()`**——服务端可读 cookie，不可读 `localStorage`。

### 2.3 `<ClientOnly>` 使用规范

凡含 `useScreen()` 条件渲染（`v-if="isPhonePadSize"` 等）的组件，**必须**用 `<ClientOnly>` 包裹。完整示例见 opendesign-application skill → styles-infrastructure 的「Nuxt 中使用 `<ClientOnly>`」章节。

> `#fallback` 是 SSR 渲染的内容——应与服务端默认值一致（通常是桌面端布局），不是空白。

---

## 三、目录结构与自动导入

> 完整目录结构对照与 Nuxt vs SPA 差异见 opendesign-application skill → project-layout。Nuxt 4 把应用代码放在 `app/` 子目录下（区别于 Nuxt 3 的根目录）。

### 3.1 Nuxt 自动导入规则

| 目录 | 自动导入 | 说明 |
|------|---------|------|
| `components/` | ✅ 组件 | 无需 `import`，直接在 template 中使用大驼峰名 |
| `composables/` | ✅ composable | `use` 前缀的函数自动可用 |
| `stores/` | ✅ store | `use` + `Store` 后缀的函数自动可用 |
| `plugins/` | ✅ 插件 | 文件名 `.client.ts` = 仅客户端，`.server.ts` = 仅服务端 |

> **不要**手动 `import` 这些目录下的导出——Nuxt 自动处理。手动 import 反而可能导致重复注册。

### 3.2 新增内容的命名规范

| 要新增的内容 | 放在哪里 | 命名规范 |
|-------------|---------|---------|
| 可复用的响应式逻辑 | `composables/useXxx.ts` | `use` 前缀 + 骆峰，自动导入 |
| 全局状态 | `stores/useXxxStore.ts` | `use` + `Store` 后缀，自动导入 |
| 纯函数（无 Vue 依赖） | `utils/xxx.ts` | 骆峰，**不自动导入**，需手动 import |
| TypeScript 类型 / 接口 | `types/xxx.ts` | 骆峰或大驼峰，**不自动导入** |
| 页面级组件 | `components/XxxPage.vue` | 大驼峰 + `Page` 后缀，自动导入 |
| 通用 UI 片段 | `components/XxxSection.vue` | 大驼峰 + 语义后缀，自动导入 |
| 子组件（被父组件引用） | `components/父名/XxxItem.vue` | 父名子目录 + 大驼峰，自动导入 |
| 多页面路由 | `pages/xxx.vue` | 文件名即路由路径 |

---

## 四、业务组件

### 4.1 AppSection 楼层组件

`AppSection` 是全宽页面楼层的**通用容器组件**，消费 OpenDesign 设计令牌承担楼层级结构（header / body / footer）与排版规范（宽度、内外间距、标题/副标题层级、底部链接），避免各页面重复实现等价楼层骨架。

> **适用场景**：页面非左右布局场景下的全宽楼层。当页面采用左右布局时不应使用本组件，应由具体布局组件自行承载楼层结构。

**Props**：

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string \| string[]` | — | 区块标题。字符串数组时逐行渲染 h2 |
| `subtitle` | `string` | — | 区块副标题，居中展示于标题下方 |
| `full` | `boolean` | `false` | 全宽展示主体内容（取消 section-body 的宽度限制与内边距） |
| `headerJustifyCenter` | `boolean` | `true` | 头部是否居中对齐，`false` 时左对齐 |
| `footer` | `string` | — | 底部链接文案，配合 `footerHref` 组成 OLink 外链 |
| `footerHref` | `string` | — | 底部链接跳转地址 |

**Slots**：

| Slot | 说明 |
|------|------|
| `main` | 整体内容兜底，传入时完全覆盖 header / body / footer 默认结构 |
| `header` | 区块头部，不传时回退到 title / subtitle 默认渲染 |
| `title` | 标题插槽，配合 title prop 使用 |
| `subtitle` | 副标题插槽，配合 subtitle prop 使用 |
| `default` | 区块主体内容 |
| `footer` | 底部插槽，不传时回退到 footer + footerHref 组合的 OLink 渲染 |

**典型用法**：

```vue
<!-- 最常用：标题 + 主体内容 -->
<AppSection title="用户列表"><UserList /></AppSection>

<!-- 标题 + 副标题 -->
<AppSection title="响应式栅格" subtitle="当前断点列数随窗口缩放变化">
  <TokenGridShowcase />
</AppSection>

<!-- 左对齐标题 -->
<AppSection title="Token 库使用示例" :header-justify-center="false">
  <template #subtitle>
    <p>自定义副标题内容</p>
  </template>
</AppSection>

<!-- 全宽内容（如横幅图片、全宽数据展示） -->
<AppSection title="数据概览" :full="true">
  <FullWidthChart />
</AppSection>

<!-- 带底部链接 -->
<AppSection title="最新动态" footer="查看全部" footer-href="/news">
  <NewsList />
</AppSection>
```

> **页脚 `<AppFooter>` 不套 AppSection**——页脚是页面结构元素而非楼层内容，直接使用 `<AppFooter />` 组件：
> ```vue
> <AppFooter />
> ```

### 4.2 AppHeader 导航栏组件

`AppHeader` 是页面顶部导航栏组件，内含品牌 Logo 与主题切换按钮，使用 `o-r-grid-container` 做水平居中，消费设计令牌承担导航栏高度、间距与排版规范。

**Slots**：

| Slot | 说明 |
|------|------|
| `brand` | 品牌区域，不传时回退到默认 Logo + 标题组合 |
| `actions` | 右侧操作区，不传时回退到默认 ThemeToggle |

### 4.3 AppFooter 页脚组件

`AppFooter` 是页面底部页脚组件，内含版权信息，使用 `o-r-grid-container` 做水平居中，消费设计令牌承担页脚间距与排版规范。

**Slots**：

| Slot | 说明 |
|------|------|
| `default` | 页脚内容区，不传时回退到默认 Powered by 文本 |

### 4.4 布局与页面分层

Nuxt 采用三层分离：`app.vue` → `layouts/default.vue` → `pages/*.vue`。

| 层级 | 文件 | 职责 |
|------|------|------|
| 入口 | `app/app.vue` | NuxtLayout + NuxtRouteAnnouncer + NuxtPage |
| 骨架 | `app/layouts/default.vue` | AppHeader + `<slot />`（楼层内容）+ AppFooter |
| 页面 | `app/pages/*.vue` | 楼层编排（AppSection 包裹业务组件） |

> **`app.vue` 不承载骨架或楼层内容**——骨架由 layout 承担，楼层内容由 page 承担。新增页面只需在 `pages/` 下新建 `.vue` 文件，骨架自动复用。

**关键约束**：

- **全宽页面楼层必须使用 `<AppSection>`**，不得手写 `<section class="o-r-grid-container floor">` + `.floor` / `.floor-first` / `.floor-last` CSS 组合
- 楼层标题由 `title` prop 传入，业务组件内部不再自含 `<h2 class="section-title">` 样式
- AppSection 使用 `--o-r-grid-section-width` 和 `--o-r-gap-*` 等响应式令牌，标题用 `display3` / `text1` mixin——楼层排版完全由设计令牌驱动，页面不再维护 `.floor` 等楼层 CSS 类
- **页脚 `<AppFooter>` 不套 AppSection**——页脚是页面结构元素而非楼层内容，直接使用 `<AppFooter />` 组件
- 非全宽布局（左右布局侧边栏等）不应使用 AppSection

---

## 五、组件拆分规范

### 5.1 拆分时机（什么时候该拆）

| 信号 | 应该拆分 |
|------|---------|
| 单个 `.vue` 文件 `<template>` 超过 80 行 | 拆出子组件 |
| `<style>` 超过 60 行 | 检查是否有可提取的通用样式模式 |
| 同一页面出现 3+ 个语义独立的区块 | 每个区块拆为独立组件 |
| 多个页面/楼层复用相同 UI 片段 | 提取为公共组件 |
| `v-if` + `v-else` 切换的是整块 DOM 结构 | 各分支拆为子组件 |

### 5.2 拆分原则（怎么拆）

#### 单一职责原则

每个组件只做一件事：

```vue
<!-- ✅ 正确：页面标题由 AppSection 渲染，业务组件只管内容 -->
<AppSection title="用户管理" subtitle="管理系统用户与权限">
  <UserList />
</AppSection>

<!-- ❌ 错误：把标题、列表、操作全部写在一个巨型组件里 -->
<AppSection>
  <UserManagement /> <!-- 500 行，什么都干 -->
</AppSection>
```

#### 楼层式组装

页面内容按三层分离：**app.vue** 只做入口编排，**layouts/default.vue** 承载骨架（AppHeader + AppFooter），**pages/*.vue** 负责楼层编排。全宽页面的楼层统一使用 `<AppSection>` 组件包裹业务内容。`<AppSection>` 消费设计令牌（`--o-r-grid-section-width` / `--o-r-gap-*`），承担楼层级宽度、间距与标题排版规范，页面不再手写 `.o-r-grid-container` + `.floor` CSS 组合。

> AppSection 组件详解见本章「业务组件 / AppSection 楼层组件」章节，AppSection 的设计令牌与楼层结构原理见 opendesign-application skill → styles-infrastructure 的「栅格容器」与「楼层式页面结构」章节。

```vue
<!-- app.vue：应用入口，只做编排 -->
<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
```

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
  <AppSection title="用户管理" subtitle="管理系统用户与权限" :header-justify-center="false">
    <PageHero />
  </AppSection>
  <AppSection title="用户列表"><UserList /></AppSection>
  <AppSection title="权限矩阵"><PermissionMatrix /></AppSection>
</template>
```

#### 父子组件数据流

| 方式 | 用途 | 规范 |
|------|------|------|
| `props` | 父 → 子 数据传递 | 必须用 `defineProps<T>()` 泛型，禁用字符串数组式 |
| `emit` | 子 → 父 事件通知 | 必须用 `defineEmits<T>()` 泛型 |
| `v-model` | 双向绑定 | 组件支持 `modelValue` + `update:modelValue` |
| Pinia store | 跨组件共享状态 | 仅当确实需要跨楼层/跨页面共享时使用 |
| provide/inject | 深层传递 | 仅用于主题 / 配置等基础设施，业务数据走 props |

**严禁**子组件直接修改父组件传入的 props（Vue 单向数据流）。需要通知父组件时用 `emit`。

### 5.3 组件命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 页面级 | `XxxPage.vue` | `UserManagementPage.vue` |
| 楼层级 / 区块级 | `XxxSection.vue` / `XxxPanel.vue` | `UserListSection.vue` |
| 通用 UI 片段 | `XxxCard.vue` / `XxxBar.vue` | `StatCard.vue` |
| 子组件（属于父组件） | `父名/XxxItem.vue` | `UserList/UserItem.vue` |
| 基础设施 | 按功能命名 | `ThemeToggle.vue` / `AppLogo.vue` / `AppSection.vue` |

> **不使用** `Index.vue` / `Main.vue` / `Wrapper.vue` 这类无语义命名。

---

## 六、公共抽象模式

### 6.1 Composable（`composables/useXxx.ts`）

Nuxt 自动导入 `composables/` 下 `use` 前缀的导出函数。

提取为 composable 的信号：

| 信号 | 示例 |
|------|------|
| 多个组件需要相同响应式逻辑 | `useScreen()` 已由 OpenDesign + VueUse 提供，不自造 |
| 需要生命周期钩子 + 响应式状态 | `useAsyncData(fetchFn)`（注意：Nuxt 有内置 `useAsyncData`） |
| DOM 操作需要封装 | `useScrollLock()`（需 `import.meta.client` 守卫） |
| 逻辑与 UI 无关、可独立测试 | `useDebounce(fn, delay)` |

**composable 文件模板**：

```typescript
// composables/useXxx.ts
/**
 * @description XXX 功能的 composable
 * @param options 配置选项
 * @returns 响应式状态与方法
 */
export function useXxx(options?: { /* ... */ }) {
  const state = ref(/* ... */)

  // SSR 安全守卫（如需要）
  if (import.meta.client) {
    // 客户端专属逻辑...
  }

  return { state, /* ... */ }
}
```

**规范**：
- 文件名 = 函数名：`useXxx.ts` 导出 `useXxx`
- 一个文件只导出一个 composable
- 不在 composable 中直接操作 DOM（除非是 DOM 相关 composable）
- composable 内部可调用其他 composable（如 `useScreen()`、`useThemeStore()`）
- 涉及 `window` / `matchMedia` 等客户端 API 时，必须加 `import.meta.client` 守卫

### 6.2 Store（`stores/useXxxStore.ts`）

Nuxt 自动导入 `stores/` 下 `use` + `Store` 后缀的导出函数。

> 主题 store 的完整设计（含防闪烁、DOM 同步、hydration 处理）见 opendesign-application skill → theme-system。以下为**新增业务 store** 的通用模板。

提取为 store 的信号：

| 信号 | 示例 |
|------|------|
| 状态需要跨页面 / 跨楼层共享 | 用户信息、全局配置 |
| 状态需要持久化 | 用户偏好设置 |
| 多个组件需要读写同一份数据 | 当前选中项、筛选条件 |

**store 文件模板**：

```typescript
// stores/useXxxStore.ts
export const useXxxStore = defineStore('xxx', () => {
  // —— State ——
  const items = ref<Item[]>([])

  // —— SSR 持久化 ——
  // 用 useCookie（服务端可读），不用 localStorage
  const pref = useCookie<XxxPref>('xxx-pref', { maxAge: 60 * 60 * 24 * 365 })

  // —— Getters ——
  const activeItems = computed(() => items.value.filter(i => i.active))

  // —— Actions ——
  function fetchItems() { /* ... */ }

  return { items, activeItems, fetchItems }
})
```

**规范**：
- 仅用 Composition API 风格（setup store），不用 Options API 风格
- 命名 = `use` + 语义 + `Store`
- **持久化用 `useCookie`**（服务端可读），**不用 `localStorage` / `useStorage`**（服务端不可读）
- store 之间可互相调用：`const userStore = useUserStore()`
- 涉及客户端专属逻辑（如 `matchMedia`）的更新，必须在 `app:mounted` 之后执行

### 6.3 Plugin（`plugins/xxx.client.ts`）

Nuxt 插件文件名决定运行时机：

| 后缀 | 运行时机 | 适用场景 |
|------|---------|---------|
| `.client.ts` | 仅客户端（SSR 不执行） | `matchMedia` / `localStorage` / DOM 操作 |
| `.server.ts` | 仅服务端 | 数据预处理 / API 代理 |
| `.ts`（无后缀） | 两端都执行 | 全局注册 / 配置 |

**现有基础设施插件**：
- `plugins/theme.client.ts`：系统暗色偏好检测，延迟到 `app:mounted` 后更新 store

**新增插件规范**：
- 涉及 `window` / `matchMedia` / `localStorage` 的插件 → `.client.ts`
- 全局注册或配置 → `.ts`
- 不要把业务逻辑放进 plugin——plugin 只做基础设施初始化

### 6.4 SCSS Mixin

> 三套 mixin（common / font / screen）的完整说明与用法见 opendesign-application skill → styles-infrastructure。此处仅说明 Nuxt 中的注入方式与新增规则。

三套 mixin 已全局注入（通过 `nuxt.config.ts` 的 `additionalData`），**组件内不再手动 `@use`**。

**新增 mixin 的规范**：

| 要新增的 mixin | 放在哪里 | 规则 |
|---------------|---------|------|
| 全局通用 | 新文件 `mixin/xxx.scss` + 在 `nuxt.config.ts` 的 `additionalData` 中追加 | 必须全局注入才有效 |
| 仅某几个组件用到 | 在组件 `<style>` 内局部定义，或创建 `mixin/xxx.scss` 但不全局注入 | 不全局注入的 mixin 需手动 `@use` |

---

## 七、SVG 图标工作流

### 7.1 gen:icon 工作流

项目使用 `@opensig/open-scripts` 的 `gen:icon` 命令管理自定义 SVG 图标。**禁止内联 SVG**——所有图标必须通过 gen:icon 生成 Vue 组件后使用，确保图标统一管理、可复用、支持主题变色。

**工作流**：

1. 设计师交付 SVG 切图 → 按类型放入 `icons/svgs/` 对应子目录（`fill/` / `stroke/` / `color/`）
2. 执行 `pnpm gen:icon` → 清空 `app/icon-components/` 并重新生成所有 Vue 图标组件
3. 组件中通过 `#icons` 别名导入使用

> SVG 分类规则与命名规范详见 **opendesign-scripts** skill → gen:icon。核心要点：实心填充放 `fill/`、线条描边放 `stroke/`、多色固定放 `color/`；文件名用 kebab-case 语义命名（如 `arrow-right.svg`），生成后组件名自动转为大驼峰（`AppIconArrowRight`）。

### 7.2 图标组件导入方式

Nuxt 中通过 `#icons` 别名导入（别名注册在 `nuxt.config.ts`）：

```vue
<script setup lang="ts">
// 从 gen:icon 产物目录导入图标组件
import { AppIconSun, AppIconMoon } from '#icons'
</script>

<template>
  <AppIconSun class="my-icon" />
</template>
```

> `#icons` 指向 `app/icon-components/` 目录——每次 `pnpm gen:icon` 会清空重建该目录，已纳入 `.gitignore`。

### 7.3 图标新增与修改原则

| 操作 | 做法 |
|------|------|
| 新增图标 | 将 SVG 文件追加到 `icons/svgs/fill/` / `stroke/` / `color/` 对应子目录，然后执行 `pnpm gen:icon` |
| 修改图标 | 用新版 SVG 替换 `icons/svgs/` 中的同名文件，然后执行 `pnpm gen:icon` |
| 删除图标 | 删除 `icons/svgs/` 中的 SVG 文件，然后执行 `pnpm gen:icon`（会清空重建整个产物目录） |
| 优先复用 | 新增前先检查 `icons/svgs/` 和组件库内置图标，避免重复添加语义相近的图标 |

> **反模式**：不要在组件中内联 `<svg>` 标签——统一走 gen:icon 生成 Vue 组件，通过 `#icons` 导入使用。

### 7.4 图标样式控制

生成的图标组件根元素带 `o-svg-icon app-svg-icon` 类名，支持以下样式控制：

```scss
.my-icon {
  // 尺寸：默认 1em（跟随字号），可按需覆盖
  width: 1.25em;
  height: 1.25em;

  // 颜色：fill/stroke 类图标通过 CSS color 统一变色（生成时已移除 fill/stroke 属性）
  color: var(--o-color-primary1);

  // color 类图标保留原始颜色，不可通过 CSS color 变色
}
```

---

## 八、最佳实践

### 7.1 页面组装与楼层结构

新页面内容按**楼层**添加到 `pages/*.vue`——全宽页面楼层统一使用 `<AppSection>` 组件，标题通过 `title` / `subtitle` prop 传入，主体内容通过默认插槽传入。`pages/*.vue` 只编排楼层，不写具体业务内容。骨架（AppHeader + AppFooter）由 `layouts/default.vue` 承担，`app.vue` 只做入口编排。

> AppSection 组件详解见本章「业务组件 / AppSection 楼层组件」章节。AppSection 的设计令牌与楼层结构原理见 opendesign-application skill → styles-infrastructure 的「栅格容器」与「楼层式页面结构」章节。

> 新增页面只需在 `pages/` 下新建 `.vue` 文件，Nuxt 自动基于文件名生成路由，骨架自动复用。

### 7.2 组件内部结构规范

每个 `.vue` 文件按固定顺序组织：

```vue
<script setup lang="ts">
// Nuxt 自动导入：无需 import defineProps / ref / computed / useXxx 等
// 1. import：外部库 → OpenDesign 组件（Nuxt 自动导入可省略） → 类型
// 2. props / emits 定义
// 3. composable / store 调用（自动导入，无需 import）
// 4. 响应式状态（ref / reactive / computed）
// 5. 方法 / 事件处理
// 6. 生命周期钩子（watch / onMounted 等）
</script>

<template>
  <!-- 单根元素，class 用 BEM 命名 -->
  <section class="xxx-section">
    ...
  </section>
</template>

<style lang="scss" scoped>
/* BEM 命名 + 全 token 驱动 + 无 :deep */
.xxx-section {
  /* ... */
}
</style>
```

> Nuxt 自动导入意味着：`ref`、`computed`、`watch`、`onMounted`、`defineProps`、`defineEmits`、`useThemeStore`、`useScreen` 等无需 `import` 语句。手动 import 也可以，但不必要。

### 7.3 样式硬规则与反模式

> 样式硬规则（`:deep` 禁令、token 优先、组件优先、hover 走 mixin 等）完整清单见 opendesign-application skill → conventions 的「硬规则红线」与「应用层补充约定」章节。
> 常见反模式与违规修正见同一 skill → conventions 的「常见违规示例与修正」及「Code Review 检查清单」。

Nuxt 专属补充：
- 含 `useScreen()` 条件渲染必须 `<ClientOnly>` 包裹（见本章 2.3）
- 持久化用 `useCookie`，不用 `localStorage`
- 手动 import 组件是反模式——Nuxt 自动导入
- `app.use(createPinia())` 是反模式——`@pinia/nuxt` 模块已自动注册
- 在 `app:mounted` 前改 store 状态是反模式——会导致 hydration 不匹配

### 7.4 响应式策略优先级

> CSS vs JS 层面的响应式分工详见 opendesign-application skill → styles-infrastructure 的「`useScreen()` 运行时响应式检测」章节。

Nuxt 专属补充：JS 层面（`useScreen()` + `v-if`）的条件渲染**必须**加 `<ClientOnly>`。

### 7.5 表单宽度管理

> 表单控件宽度规则详解见 opendesign-application skill → styles-infrastructure 的 `global.scss` 章节，以及 conventions 的「表单宽度走 `global.scss`」条目。

### 7.6 主题切换

> 完整主题系统集成（Pinia store、防闪烁、社区切换、ThemeToggle）见 opendesign-application skill → theme-system。

业务代码统一走 `useThemeStore()` 的 `isDark`（writable computed）或 `setMode`，不直接操作 DOM。

防闪烁脚本通过 `useHead` 注入——改社区时需同步修改三处：
1. `nuxt.config.ts` 的 token CSS 引入
2. `stores/theme.ts` 的 `OPENDESIGN_COMMUNITY` 常量
3. `stores/theme.ts` 的 `FOUC_SCRIPT` 字符串中的社区前缀

> Nuxt 版防闪烁不需要修改 `index.html`——`useHead` 在服务端和客户端都自动注入 `<script>` 到 `<head>`。

### 7.7 数据获取

Nuxt 提供内置数据获取 composables，**不自造**：

| composable | 用途 | SSR 行为 |
|-----------|------|---------|
| `useFetch(url)` | 获取 API 数据 | SSR 时执行，客户端不再重复请求 |
| `useAsyncData(key, fn)` | 自定义异步逻辑 | SSR 时执行，客户端复用结果 |
| `$fetch(url)` | 一次性请求（不缓存） | 仅在事件处理函数中使用，不在 setup 中直接调用 |

> **在 `setup` 中请用 `useFetch` / `useAsyncData`**，不要用 `$fetch`——后者不会在 SSR 时自动执行。

---

## 九、新增业务组件的完整流程

1. 在 `components/` 下创建 `XxxSection.vue`
2. 按 6.2 规范组织文件结构
3. 所有样式值用 `var(--o-*)` token 或 `@include` mixin（详见 opendesign-application skill → conventions）
4. 如需响应式，优先用 SCSS mixin，次选 `useScreen()` + `<ClientOnly>`
5. 如需跨组件共享状态，创建 `stores/useXxxStore.ts`（持久化用 `useCookie`）
6. 如需复用逻辑，创建 `composables/useXxx.ts`
7. 在 `pages/*.vue` 的楼层结构中引入新组件（Nuxt 自动导入，无需 import）
8. 运行 `pnpm dev` 验证效果

---

## 十、项目基础设施文件（不建议修改）

以下文件是脚手架基础设施，除非切换社区或有明确需求，**不建议修改**：

| 文件 | 作用 |
|------|------|
| `nuxt.config.ts` | 模块注册 + 样式引入顺序 + SCSS 全局注入 + `#icons` 别名 |
| `stores/theme.ts` | 主题 store（含防闪烁脚本 + DOM 同步） |
| `plugins/theme.client.ts` | 系统暗色偏好检测（延迟到 `app:mounted`） |
| `components/ThemeToggle.vue` | 主题切换开关（OSwitch） |
| `components/AppSection.vue` | 楼层通用容器（标题/主体/底部 + 宽度/间距/排版规范） |
| `assets/styles/mixin/*.scss` | 三套 mixin |
| `assets/styles/reset.scss` | CSS Reset（归零 UA 默认样式，必须在 Token 之前） |
| `assets/styles/global.scss` | body 基线 + 表单宽度 |
| `icons/icon.config.ts` | gen:icon 配置（SVG 源 → Vue 图标组件产物） |

如需切换社区主题，见 opendesign-application skill → theme-system 的「社区切换」章节，同步修改三处（nuxt.config.ts + store 常量 + FOUC 脚本）。

---

## 十一、查阅指引

本 AGENTS.md 只保留 Nuxt 专属约束与项目级操作指导。通用规范按以下指引定位（AI 工具通过 skill 名称解析，开发者查阅 `@opensig/opendesign` 包文档或 OpenDesign 官网）：

| 要查什么 | 去哪查 |
|---------|--------|
| 组件 API（Props / Events / Slots） | **opendesign-components** skill |
| token 变量名完整列表 | **opendesign-tokens** skill |
| 依赖安装、入口文件、样式引入顺序详解 | **opendesign-application** skill → getting-started |
| 主题系统完整集成（Pinia store、防闪烁、SSR hydration、社区切换） | **opendesign-application** skill → theme-system |
| SCSS mixin 用法详解、栅格容器、楼层结构、global.scss | **opendesign-application** skill → styles-infrastructure |
| 目录结构对照与 Nuxt vs SPA 差异 | **opendesign-application** skill → project-layout |
| 样式硬规则、反模式清单、Code Review 检查清单 | **opendesign-application** skill → conventions |
| 响应式策略（CSS vs JS 层面分工） | **opendesign-application** skill → styles-infrastructure → `useScreen()` 章节 |
| 表单宽度全局规则 | **opendesign-application** skill → styles-infrastructure → `global.scss` 章节 |
| SVG 图标生成、分类规则、命名规范、导入方式 | **opendesign-scripts** skill → gen:icon |

---

**最后更新**：2026-07-07
