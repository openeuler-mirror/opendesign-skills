# 工程落地约束（直出 Vue 代码）

AI 直接生成的 Vue + OpenDesign 代码应满足的工程子集，与具体社区无关。落地到某社区工程前，先读目标仓根 `AGENTS.md`（AI 工具唯一入口，遵循 [agents.md](https://agents.md) 标准）+ 其索引的 `rules/*.md`，按其**框架族**（VitePress 显式 import / Nuxt 自动导入 + SSR 安全）、路径别名、i18n 方案、SEO/GEO 机制（TDK 由 portal-workflow geo-fix 链路负责，组件内勿重复注入）、排版 mixin 等适配。注意：**并非所有 portal 仓都用 OpenDesign**（如 hifloat 用 shadcn-vue + Tailwind）——非 opendesign 仓不适用本文件。

---

## 1. 样式取值：只用 Token

| 维度 | 必须用 | 禁止 |
|------|--------|------|
| 颜色 | `var(--o-color-*)` **语义色** | `#fff`、`rgb()`、**色板变量**（blue1/gray1 类：`--o-kleinblue-*`/`--o-blue-*`/`--o-grey-*`/`--o-green-*`/`--o-brand-*` 等） |
| 背景 | `--o-color-fill1/2/3` | `--o-color-bg1/2/3`（**不存在**） |
| 字号/行高 | `var(--o-r-font_size-*)` + `var(--o-r-line_height-*)` | 硬编码 `22px` |
| 间距 | 页面级 `var(--o-r-gap-*)`；组件内固定 `var(--o-gap-*)` | 硬编码 `32px` |
| 圆角 / 阴影 | `--o-radius-*` / `--o-shadow-*` | 手写数值 |
| 动效 | `--o-duration-*` + `--o-easing-*` | 手写 `300ms ease` |

语义色 token 已自带 `rgb()/rgba()`，直接 `var(--o-color-fill2)`，不要再包一层。

> 🚫 **色板变量只服务于语义 token 的内部实现，业务代码一律不准直接用**。要表达「用途」（info1=主文字、primary1=主色、success1=成功），而不是「第几号色」（blue1/gray1）。换主题时语义 token 自动切换，直接写色板会破坏主题适配。

---

## 2. 组件优先

凡 OpenDesign 有的控件，用真实组件，不用原生 `<button>`/`<select>`/`<table>` 或手写 div 替代。视觉差异通过组件 `props` 与主题 token 表达，**不用 `:deep()` 穿透改组件内部**。组件选用见 [component-cheatsheet.md](component-cheatsheet.md)。

---

## 3. SFC 规范

- `<script setup lang="ts">`，区块顺序：Vue 核心 API → 第三方库 → OpenDesign 组件 → composables → 内部组件 → 类型 → props/emits → 状态 → computed → methods → 生命周期。
- props 用泛型：`defineProps<PropsT>()`（接口以 `T` 结尾），需默认值用 `withDefaults`；**禁止**字符串数组式 `defineProps(['x'])`。
- emits 用泛型签名。
- 单文件组件不超过 ~400 行，过大拆子组件（`components/` 子目录）。
- `v-for` 必须有语义化 `:key`（禁用 index）；同一元素不同时用 `v-if`+`v-for`。
- 不在 `setup` 顶层直接访问 `window`/`document`（SSR 安全）；浏览器 API 放 `onMounted` 或客户端判断里。

---

## 4. 样式书写

- `<style lang="scss" scoped>`，BEM 命名（`block__element--modifier`，全小写短横线，禁 camelCase 类名）。
- 嵌套 ≤ 3 层；**无内联 `style`**（动态值等极特殊情况需注释）；**无 `!important`**。
- 响应式优先用响应式 token 免写媒体查询；确需断点时用 `@media` 或目标工程的 `respond-to` mixin（断点：Phone ≤840 / Pad 841–1200 / Laptop 1201–1680 / Desktop >1680）。

---

## 5. 主题与 i18n

- 主题由消费工程通过 `data-o-theme="{e|a|k|m|g|u}.{light|dark}"` 选定，颜色全用语义 token 即自动适配明暗，无需为暗色另写。
- 面向用户的文案走 i18n（如 `t('module.key')`），zh/en 两份同步；不写死中文/英文。

---

## 6. 可访问性（基本项）

- 可点击元素用 `OButton`/`OLink`（或语义 `<button>/<a>`），不用 `<div @click>`。
- 图片有 `alt`；表单控件有可见 label / placeholder；对比度由 token 体系保证。

---

> 取值看 [opendesign-tokens](../../opendesign-tokens/SKILL.md)，组件 API 看 [opendesign-components](../../opendesign-components/SKILL.md)；本文件管"怎么写才工程合规"。
