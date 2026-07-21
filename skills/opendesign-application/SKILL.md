---
name: opendesign-application
description: OpenDesign 工程化落地指南。当开发者要新建或改造项目采用 @opensig/opendesign 设计系统、集成主题系统（Pinia store + SSR/SPA 差异 + 社区切换）、搭建全局样式基础设施（SCSS mixin 全局注入 + 栅格容器 + 楼层结构）、对比 Nuxt vs Vite SPA 工程形态、或在 code review 时检视 OpenDesign 是否被正确使用（:deep 禁令、token 优先、组件优先）时使用此 skill。提供两套可运行脚手架（templates/nuxt、templates/vue-spa）与工程化专题参考。不重复组件 API（→ opendesign-components）、token 表（→ opendesign-tokens）、设计稿生产（→ opendesign-design）、设计师侧代码直出（→ opendesign-codegen）、CLI 命令（→ opendesign-scripts）。
last_update: 2026-07-08
---

# OpenDesign 工程化落地指南

本 skill 解决"如何把 OpenDesign 设计系统正确集成进一个工程项目"的问题——面向**新建项目或改造现有项目采用 OpenDesign** 的开发者，覆盖脚手架、主题系统集成、全局样式基础设施、目录组织、编码约定与 code review 检视。

提供两套**可直接 clone 运行**的脚手架（`templates/`）：

| 脚手架 | 路径 | 形态 | 适用场景 |
|--------|------|------|---------|
| Nuxt 4 SSR | [`templates/nuxt`](templates/nuxt) | 服务端渲染 + 静态生成 | 官网、内容站、需要 SEO 的场景 |
| Vite + Vue 3 SPA | [`templates/vue-spa`](templates/vue-spa) | 单页应用 | 后台管理、工具站、不需 SSR 的应用 |

两套脚手架均已完成：OpenDesign 主题初始化、Pinia 主题 store、SCSS mixin 全局注入、响应式栅格容器、**AppSection 楼层组件**（统一消费设计令牌承担楼层级宽度/间距/标题排版规范）、全 token 驱动样式。每套脚手架根目录包含 **`AGENTS.md`**——为 AI 编码工具（及不熟悉代码的设计师）提供架构约束、组件拆分规范、公共抽象模式与最佳实践指导，确保即使不具备前端工程背景也能按规范产出合规代码。

---

## 脚手架内 AGENTS.md

两套脚手架各自根目录下的 `AGENTS.md` 是面向**在脚手架项目中工作的 AI 工具与设计师**的操作指导（第一层），与本 `SKILL.md`（第二层：工程化集成参考）互补：

| 文件 | 面向 | 核心内容 |
|------|------|---------|
| [`templates/vue-spa/AGENTS.md`](templates/vue-spa/AGENTS.md) | Vite SPA 项目中的 AI 工具 / 设计师 | 架构红线、目录约定、组件拆分时机与原则、公共抽象模板（composable / store / mixin）、楼层式组装模式、样式硬规则速查、常见反模式、基础设施文件清单 |
| [`templates/nuxt/AGENTS.md`](templates/nuxt/AGENTS.md) | Nuxt SSR 项目中的 AI 工具 / 设计师 | 同上 + **SSR 安全守卫**（hydration 不匹配防范、`<ClientOnly>` 使用规范、`import.meta.client` 守卫）、Nuxt 自动导入规则、Plugin 分类规范、数据获取 composables |

---

## 与同级 skill 的边界

本 skill 只讲**工程化集成**，不重复具体的设计系统内容：

| 你要查什么 | 去哪个 skill |
|-----------|-------------|
| 组件 Props / Events / Slots / Expose | [`../opendesign-components/SKILL.md`](../opendesign-components/SKILL.md) |
| 颜色 / 间距 / 字号 / 圆角等 token 变量名 | [`../opendesign-tokens/SKILL.md`](../opendesign-tokens/SKILL.md) |
| Pixso 设计稿生产规范 | [`../opendesign-design/SKILL.md`](../opendesign-design/SKILL.md) |
| 设计师侧从设计意图直出 Vue SFC | [`../opendesign-codegen/SKILL.md`](../opendesign-codegen/SKILL.md) |
| `gen:icon` / `build:style` 等 CLI 命令 | [`../opendesign-scripts/SKILL.md`](../opendesign-scripts/SKILL.md) |
| **工程化集成、主题系统、样式基础设施、code review** | **本 skill** |

---

## 触发场景

- 新建项目要采用 OpenDesign，不知如何起手
- 现有项目要接入 OpenDesign 主题系统（Pinia + 社区切换）
- SCSS mixin 怎么全局注入、栅格容器怎么用
- Nuxt SSR 与 Vite SPA 在 OpenDesign 集成上有什么差异
- **code review 时检视 OpenDesign 是否被正确使用**（:deep 禁令、token 优先、组件优先、样式引入顺序）

---

## 工程化总纲

### 红线（违反即视为集成失败）

1. **样式引入顺序不可调换**：Token CSS → 鸿蒙字体 → 组件库样式 → 项目全局样式。Token 必须先于组件样式，否则组件拿不到 CSS 变量。
2. **禁止 `:deep()` 修改 OpenDesign 组件内部样式**。组件内部宽度等全局规则放 `global.scss` 的渲染类（如 `.o-form .o-input`），scoped 样式只管组件自身的 layout。
3. **颜色 / 间距 / 字号一律 `var(--o-*)`**，禁止硬编码 hex / px。语义色用 `--o-color-*`，严禁直接用色板变量（`--o-kleinblue-*` / `--o-grey-*` 等）。
4. **优先使用 OpenDesign 组件**，凡组件库已提供的能力必须用组件 props / slots / events 实现，不自造原生替代。
5. **主题由 `<html data-o-theme="社区.模式">` 驱动**，业务代码不直接操作 CSS 变量切换主题，走 Pinia store 的 `isDark`（writable computed）或 `setMode`。

### 起手式

1. 选定社区主题（`e` / `a` / `k` / `m` / `g` / `u`）——见 [`../opendesign-tokens/SKILL.md`](../opendesign-tokens/SKILL.md) 的六社区说明
2. clone 对应脚手架（Nuxt 或 Vite SPA）作为起点
3. 把 `OPENDESIGN_COMMUNITY` 常量与 token CSS 引入换成你选的社区
4. 按需读取下方 references 完成定制

---

## 参考文件索引

| 主题 | 文件 | 内容 |
|------|------|------|
| 脚手架指导 | [templates/vue-spa/AGENTS.md](templates/vue-spa/AGENTS.md) | Vite SPA 架构约束、组件拆分、公共抽象、最佳实践、反模式（面向 AI 工具 / 设计师） |
| 脚手架指导 | [templates/nuxt/AGENTS.md](templates/nuxt/AGENTS.md) | Nuxt SSR 同上 + SSR 安全守卫、`<ClientOnly>`、自动导入、Plugin、数据获取 |
| 起手 | [references/getting-started.md](references/getting-started.md) | 依赖安装、入口文件、样式引入顺序、`initRound`、`useScreen()`、最小可运行示例 |
| 主题系统 | [references/theme-system.md](references/theme-system.md) | Pinia store、SSR hydration、VueUse、社区切换、ThemeToggle（OSwitch） |
| 样式基础设施 | [references/styles-infrastructure.md](references/styles-infrastructure.md) | SCSS mixin 三套（含 `hover`）、全局注入、`useScreen()` 运行时检测、global.scss、栅格容器、AppSection 楼层组件 |
| 项目布局 | [references/project-layout.md](references/project-layout.md) | 目录结构、Nuxt vs Vite SPA 差异对照、选型建议 |
| 编码约定 | [references/conventions.md](references/conventions.md) | 硬规则、应用层约定、**Code Review 检查清单**、违规修正 |

---

## Code Review 速查（OpenDesign 相关检视项）

> 完整清单见 [references/conventions.md](references/conventions.md) 的「Code Review 检查清单」章节。

| 检视项 | 合规 | 违规信号 |
|--------|------|---------|
| 样式引入顺序 | Token → 字体 → 组件样式 → 全局样式 | 组件样式在 Token 之前 |
| `:deep` 使用 | scoped 样式中无 `:deep(.o-*)`；组件样式定制走 CSS 变量 / slot / props | 出现 `:deep(.o-input)` 等 |
| 颜色值 | `var(--o-color-*)` 语义 token | 硬编码 `#fff` / `var(--o-grey-14)` 色板 |
| 间距 / 字号 / 行高 | `var(--o-gap-*)` / 字号+行高成对（`@include h*` 或 `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)`）；刻意只用一项须注释 | 硬编码 `16px` / 只写字号漏行高无注释 |
| 字重 / 动画 | `var(--o-font_weight-*)` / `var(--o-duration-*)` + `var(--o-easing-*)` | 硬编码 `600` / `300ms` / `cubic-bezier(...)` |
| 组件优先 | `<OButton>` / `<OInput>` 等真实组件 | 原生 `<button>` / `<select>` 替代 |
| 表单控件宽度 | `global.scss` 渲染类引用 OForm 导出的宽度变量（参考脚手架模板） | 组件 scoped 内 `:deep` 修改控件宽度；硬编码 `width: 200px` |
| 主题切换 | 走 store 的 `isDark`（writable computed）或 `setMode` | 直接 `document.setAttribute` 操作 |
| 内联样式 | 无 `style="..."`（动态值除外） | 大量内联 style |
| hover 交互 | `@include hover`（安全 hover）/ `@include hoverable` | 裸 `:hover` 或裸 `@media (hover: hover)` |
| 响应式检测 | `useScreen()` composable + `<ClientOnly>`（Nuxt） | 裸 `window.matchMedia` 或缺少 `<ClientOnly>` 导致 hydration 不匹配 |
| mixin vs useScreen | CSS 样式变化走 mixin；DOM 结构不同才用 useScreen + v-if | 纯样式变化却用 useScreen + :style/:class |
| 图标使用 | gen:icon 产物组件（`#icons` 别名导入） | 内联 `<svg>` 标签替代 |
