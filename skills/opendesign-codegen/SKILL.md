---
name: opendesign-codegen
description: OpenDesign 代码直出指南。当设计师（尤其各社区体验/设计团队）让 AI 工具把需求/设计意图直接做成页面、组件或单文件 DEMO 时使用此 skill——AI 应**直接生成符合工程规范的 Vue 3 + OpenDesign 代码**（真实 O 组件 + --o- 设计 token + scoped SCSS + BEM + i18n），渲染出来即设计稿，无需"先出 HTML 再转代码"的中间步骤。提供页面结构推导（双入口分流：承接上游楼层规划/组件清单，或四步自推）、四大约束（视觉 Token / 组件用法 / 布局响应式 / 工程落地）、合规 SFC 起手模板、单文件 DEMO 的 UMD+CDN standalone HTML 渲染、组件选用速查、生成后自检清单（工程四维度 + 设计基本盘）。两个入口都以使用 OpenDesign 为前提：工程内代码要求目标仓 UI 库为 @opensig/opendesign（生成前先读目标仓根 AGENTS.md + rules/ 按其框架族/i18n/别名/SEO 约定适配）；单文件 DEMO 要求已确认使用 OpenDesign 设计系统——未使用 OpenDesign 的自由视觉单文件生成不适用本 skill。复用 opendesign-tokens 与 opendesign-components，不重复其内容。
last_update: 2026-10-15
---

# OpenDesign 代码直出指南

设计师用 AI 工具干活时，**AI 直接产出的就是符合工程规范的 Vue 3 + OpenDesign 代码**——渲染出来即设计稿，可直接进生产工程。无工程环境或需要独立演示文件时，同样直出渲染**真实 OpenDesign 组件**的单文件 DEMO HTML（见 [standalone-rendering.md](references/standalone-rendering.md)），不是脱离组件库的手写 HTML。

> ❌ 不要"先生成 HTML 再转成代码"的中间步骤。
> ✅ 一步到位：直接输出真实 `@opensig/opendesign` 组件 + `--o-` token 的 Vue SFC；需要独立演示文件时，直出的单文件 DEMO 本身就是交付物，不是待转换的中间稿。

> 本 skill **不重复** Token 表与组件 API，按需链接：
> - 从需求推导页面楼层结构 → [references/page-structure.md](references/page-structure.md)
> - 全量 Token（六主题 / 响应式 / 24 栅格 / 色值反查）→ [`../opendesign-tokens/SKILL.md`](../opendesign-tokens/SKILL.md)
> - 46 个组件的 Props/Events/Slots → [`../opendesign-components/SKILL.md`](../opendesign-components/SKILL.md)
> - 想产 HTML 设计原型而非生产代码 → [`../opendesign-design/SKILL.md`](../opendesign-design/SKILL.md)

---

## 适用前提：两个入口，都以「用 OpenDesign」为前提

本 skill 有两个使用入口，判据不同，进任一入口前先确认：

**入口一：工程内代码**（代码要落进某个仓库工程）——判据是**目标仓 UI 库是否为 `@opensig/opendesign`**：

1. **读目标仓根 `AGENTS.md`**（遵循 [agents.md](https://agents.md) 标准，是所有 AI 工具进仓的唯一入口）的 §1 技术栈表，看 `UI 组件库` 行。
2. **是 `@opensig/opendesign`** → 继续用本 skill（工程内的无逻辑静态页 / 设计层代码同样参照本 skill 的工程规则与组件速查）。
3. **不是**（如 hifloat 用 shadcn-vue + Tailwind、有的用 Element Plus）→ **停**，改用该仓 UI 库的写法，本 skill 不适用。

**入口二：单文件 DEMO**（无目标工程，产出一个直接浏览器打开即渲染真实 OD 组件的单文件 HTML）——判据是**已确认本次使用 OpenDesign 设计系统**：

1. 是否使用 OpenDesign 设计系统由需求方确认，AI 可附建议，但**不从需求措辞推断**。
2. **确认使用** → 进本 skill，渲染方式走 [references/standalone-rendering.md](references/standalone-rendering.md)（UMD + CDN 单文件 HTML）。
3. **不使用**（自由视觉原型）→ **不进本 skill**——本 skill 的组件、token 与工程规则对非 OpenDesign 场景全部错位，此类生成由会话按通用 HTML 原型规范直接产出。



---

## 🔴 硬规则红线（生成任何代码前必读，最高优先级）

违反任意一条即视为不合规，必须重写：

1. **组件优先**：凡 OpenDesign 有对应控件（按钮 / 卡片 / 表单 / 表格 / 标签 / 分页等），必须用真实组件 `<OButton>` / `<OCard>` / `<ODataTable>` …，**禁止用原生 `<button>`/`<select>`/手写 div 替代**。
2. **只用 Token 变量**：颜色 / 间距 / 字号 / 行高 / 圆角 / 阴影一律 `var(--o-*)` 或 `var(--o-r-*)`，**禁止硬编码** hex / rgb / px 字号 / px 间距。**颜色必须用语义 token（`--o-color-*`），严禁直接用色板变量**（blue1/gray1 这类，如 `--o-kleinblue-*`/`--o-grey-*`/`--o-brand-*`）。
3. **`<script setup lang="ts">`** + TypeScript：props 用 `defineProps<T>()` 泛型，不用字符串数组式。
4. **无内联 `style="..."`**（动态值等极特殊情况除外并注释）；**无 `!important`**。
5. **BEM 命名 + `<style lang="scss" scoped>`**，嵌套 ≤ 3 层。
6. **不穿透改组件内部**：视觉差异通过组件 `props` 与主题 token 表达，不用 `:deep()` 重写 OpenDesign 组件内部结构。
7. **文案走 i18n**：不写死面向用户的文字，用目标工程的 i18n 方案（如 `t('module.key')`）。

---

## 起手方式

**从合规 SFC 模板开始，不要白手起稿**：复制 [references/starter-page.vue](references/starter-page.vue)，它已示范：`<script setup>` 区块顺序、`@opensig/opendesign` 组件导入、`--o-`/`--o-r-` token、scoped SCSS、响应式、i18n 占位。

### 主题机制（六社区）

主题由**消费工程在初始化时选定**并通过根节点设置，组件与 token 自动适配，生成的页面代码无需关心：

```html
<html data-o-theme="e.light">  <!-- e/a/k/m/g/u . light/dark -->
```

| 社区 | 主题码 | 社区 | 主题码 |
|------|--------|------|--------|
| openEuler | `e` | Mindspore | `m` |
| Ascend | `a` | openGauss | `g` |
| Kunpeng | `k` | openUBMC | `u` |

颜色全用语义 token → 切主题 / 明暗时自动适配，无需为暗色另写样式。

---

## 四大约束总纲

### ① 视觉 Token

- **颜色必须用语义 token**：背景 `--o-color-fill1/2/3`，文字 `--o-color-info1`~`info4`，主色 `--o-color-primary1`，功能色 `--o-color-success/warning/danger1`，边框 `--o-color-control1`，链接 `--o-color-link1`。语义色自带 rgb 包裹，直接 `var(--o-color-fill2)`。
- 🚫 **严禁直接用色板变量**（即 blue1 / gray1 这类原始色阶）：`--o-kleinblue-*`、`--o-blue-*`、`--o-grey-*`、`--o-green-*`、`--o-red-*`、`--o-orange-*`、`--o-brand-*` 等都**只能由语义 token 内部引用，业务代码禁止直接写**。要的是「这个颜色是什么用途」（语义），不是「这是第几号蓝」（色板）。
  - ❌ `color: var(--o-grey-14)` / `background: var(--o-kleinblue-6)`
  - ✅ `color: var(--o-color-info1)` / `background: var(--o-color-primary1)`
- **页面级**字号/行高/间距优先响应式 token：`--o-r-font_size-*` + 配套 `--o-r-line_height-*`、`--o-r-gap-*`（随视口自动缩放，免写 media query）。
- 圆角 `--o-radius-*`、阴影 `--o-shadow-1/2/3`、动效 `--o-duration-*`+`--o-easing-*`。
- ❌ 禁止 `#fff`/`rgb()`、`--o-color-bg1/2/3`（不存在，背景用 `fill*`）、硬编码 `22px`/`32px`。

详表 → [opendesign-tokens](../opendesign-tokens/SKILL.md)。

### ② 组件用法

设计意图直接映射到 OpenDesign 组件（不自造原生替代）：

| 设计意图 | 组件 | 设计意图 | 组件 |
|----------|------|----------|------|
| 按钮 | `OButton` | 表格 | `ODataTable` |
| 链接 | `OLink` | 分页 | `OPagination` |
| 卡片 | `OCard` | 标签页 | `OTab`+`OTabPane` |
| 标签 | `OTag` | 对话框 | `ODialog` |
| 输入/下拉 | `OInput` / `OSelect`+`OOption` | 图标 | `OIcon` |

选用速查与关键 props/slots → [references/component-cheatsheet.md](references/component-cheatsheet.md)；完整 API → [opendesign-components](../opendesign-components/SKILL.md)。

### ③ 布局与响应式

- 页面级布局用 24 栅格（`--o-r-grid-N` + 水槽 `--o-r-grid-column-gutter`），并排块列数之和 = 断点总列数。
- 断点 Phone ≤840 / Pad 841–1200 / Laptop 1201–1680 / Desktop >1680，响应式 token 自动适配；确需断点时用 `@media`（或目标工程的 `respond-to` mixin）。

### ④ 工程落地

保证代码可直接进生产工程，详见 [references/engineering-rules.md](references/engineering-rules.md)，核心即上方「硬规则红线」。

> ⚠️ **社区差异**：路径别名（如 `~@/`）、i18n 写法、排版 mixin（`@include h3`）、Vue API 是否自动导入（VitePress 显式 import vs Nuxt 自动导入）、SSR/SSG 安全写法等**因目标仓而异**。本 skill 给的是 OpenDesign 通用合规骨架；落地前先按「工作流·步骤 1」读目标仓根 `AGENTS.md` + `rules/` 适配——这些仓内约定以目标仓自己的文档为唯一事实来源，本 skill 不另行汇总。

---

## 工作流

1. **确认入口**（见上「适用前提」）：
   - **工程内代码**：进仓核实目标工程（强制，先于写代码）——读目标仓根 `AGENTS.md`（AI 工具唯一入口）→ 按其规范索引 Read 相关 `rules/*.md`；确认 UI 库是 `@opensig/opendesign`，否则停。继续摸清并据此适配：**框架族**（VitePress：Vue API 显式 import；Nuxt：自动导入、`import.meta.client`/`<ClientOnly>`、`useSeoMeta`）、**路径别名**（`~@/`/`@/` 等）、**i18n**（locales 位置与 `t()` 写法，zh/en 同步）、**SEO/GEO 机制**（TDK / meta 的注入方式以目标仓 `rules/` 声明为准，**组件里不要重复注入**）、**样式 rules**（token 用法、`:deep` 策略、SCSS 嵌套上限、是否有 `respond-to` mixin）、**命名约定**。不确定处用通用写法 + 注释，绝不臆造仓内不存在的目录/机制。
   - **单文件 DEMO**：确认本次使用 OpenDesign 设计系统（需求方确认，不从措辞推断）；渲染依赖与写法见 [references/standalone-rendering.md](references/standalone-rendering.md)，无仓内约定需要适配。
2. **定页面结构**：读 [references/page-structure.md](references/page-structure.md)——上游已给楼层规划 / 组件清单时**校验承接**（不重推，只就缺口补齐）；未给时按四步自推（提取设计输入 → 判定页面类型 → 楼层规划 → 楼层内组件选型）。
3. **按需读取最新同级 skill**（这些 skill 不定期更新，勿凭记忆写 token 值/组件 API）——用到的才读，用到的版本才读：
   - 用到颜色/间距/字号/圆角等**具体 token 值** → 读 [`../opendesign-tokens/SKILL.md`](../opendesign-tokens/SKILL.md) + 对应主题 `references/tokens-{theme}.md`。
   - 用到**组件的 Props/Events/Slots** → 读 [`../opendesign-components/SKILL.md`](../opendesign-components/SKILL.md) + 对应 `references/{component}.{visual|usage|style}.md`（识别→visual，API→usage，样式→style）。
   - 需要图标/构建/样式等 **CLI 命令**（`gen:icon`/`build-style` 等）→ 读 [`../opendesign-scripts/SKILL.md`](../opendesign-scripts/SKILL.md)。
   - 需对照**设计稿规范**（栅格/断点/组件视觉规格）→ 读 [`../opendesign-design/SKILL.md`](../opendesign-design/SKILL.md)。
   - 本 skill 顶部链接与 `component-cheatsheet.md` 只是索引，**真值以同级 skill 文件为准**。
4. **起手**：工程内代码复制 `references/starter-page.vue`；单文件 DEMO 按 [references/standalone-rendering.md](references/standalone-rendering.md) 的依赖清单与加载顺序搭骨架。
5. **直接写代码**：用真实 `@opensig/opendesign` 组件搭结构，样式全用 `var(--o-*)`/`var(--o-r-*)`，文案走 i18n，列表用 `v-for`+语义 `:key`。
6. **自检**：逐项核对 [references/checklist.md](references/checklist.md)，修正所有违规；对生成的文件跑 Token CLI 扫描确认无捏造或拼错的 token（`node skills/opendesign-tokens/scripts/bin.mjs scan <file> --theme <主题> --strict`）。
7. 交付即生产代码 —— 渲染出来就是设计稿，无中间转换。

---

## 参考文件

- [references/page-structure.md](references/page-structure.md) — 页面结构推导：楼层规划与中观层组件选型（双入口分流）
- [references/starter-page.vue](references/starter-page.vue) — 合规 SFC 起手模板
- [references/component-cheatsheet.md](references/component-cheatsheet.md) — 设计意图 → OpenDesign 组件速查（控件级）
- [references/engineering-rules.md](references/engineering-rules.md) — 工程落地约束
- [references/standalone-rendering.md](references/standalone-rendering.md) — 单文件 DEMO 主路径：UMD + CDN 单文件 HTML 渲染真实 OpenDesign 组件
- [references/checklist.md](references/checklist.md) — 生成后自检清单（工程四维度 + 设计基本盘）
- [references/examples/feature-section.vue](references/examples/feature-section.vue) — 示例：楼层 + 卡片栅格
- [references/examples/list-filter-page.vue](references/examples/list-filter-page.vue) — 示例：带筛选的列表页