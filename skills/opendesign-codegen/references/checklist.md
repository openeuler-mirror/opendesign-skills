# 直出代码自检清单（前置 + 四维度门禁）

AI 生成 Vue + OpenDesign 代码后**逐项核对**，全部通过方可交付。任一 ❌ 必须修正后重检。

## ⓪ 适用前提与目标仓适配（前置门禁）
- [ ] 已确认目标仓 UI 库为 `@opensig/opendesign`（读其根 `AGENTS.md` §1 技术栈表）；非 opendesign 仓（shadcn-vue / Element Plus 等）不适用本 skill
- [ ] 已读目标仓根 `AGENTS.md` + 相关 `rules/*.md`，并据此适配：框架族（VitePress/Nuxt 的 import 与 SSR 写法）、路径别名、i18n、SEO/GEO（组件内未重复注入 TDK）、样式 rules、命名

## ① 视觉 Token
- [ ] 颜色全部 `var(--o-color-*)` 语义 token，无 `#xxxxxx`/`rgb()` 硬编码
- [ ] **无直接使用色板变量**（blue1/gray1 类：`--o-kleinblue-*`/`--o-blue-*`/`--o-grey-*`/`--o-green-*`/`--o-brand-*` 等）
- [ ] 背景用 `--o-color-fill1/2/3`，**没有** `--o-color-bg1/2/3`
- [ ] 页面级字号用 `--o-r-font_size-*` + 配套 `--o-r-line_height-*`
- [ ] 页面级间距用 `--o-r-gap-*`；圆角 `--o-radius-*`、阴影 `--o-shadow-*`

## ② 组件用法
- [ ] 凡 OpenDesign 有的控件均用真实组件（`OButton`/`OTable`/`OSelect`…），无原生 `<button>`/`<select>`/`<table>` 或手写 div 替代
- [ ] 组件从 `@opensig/opendesign` 导入
- [ ] 未用 `:deep()` 穿透改组件内部结构

## ③ 布局与响应式
- [ ] 页面级布局用 24 栅格（`--o-r-grid-N` + 水槽 `--o-r-grid-column-gutter`），并排块列数之和 = 断点总列数
- [ ] 优先响应式 token；确需断点时用 `@media`/`respond-to`，无硬编码断点数值
- [ ] 多端表现正常

## ④ 工程落地
- [ ] `<script setup lang="ts">`，props 用泛型 `defineProps<T>()`
- [ ] `<style lang="scss" scoped>`，BEM 命名、嵌套 ≤ 3 层
- [ ] 无内联 `style="..."`、无 `!important`、无 camelCase 类名
- [ ] `v-for` 有语义 `:key`；未在 setup 顶层访问 `window`/`document`
- [ ] 面向用户文案走 i18n，zh/en 同步

---

## 常见违规 → 修正速查

| ❌ 违规 | ✅ 修正 |
|--------|--------|
| `<button class="btn">提交</button>` | `<OButton color="primary">{{ t('x.submit') }}</OButton>` |
| `<select>...</select>` | `<OSelect v-model><OOption :value :label/></OSelect>` |
| `background: #fff` | `background-color: var(--o-color-fill2)` |
| `color: var(--o-grey-14)`（色板变量） | `color: var(--o-color-info1)`（语义） |
| `background: var(--o-kleinblue-6)`（色板） | `background-color: var(--o-color-primary1)`（语义） |
| `color: rgba(0,0,0,.6)` | `color: var(--o-color-info3)` |
| `font-size: 22px` | `font-size: var(--o-r-font_size-h3)` + `line-height: var(--o-r-line_height-h3)` |
| `gap: 32px` | `var(--o-r-gap-6)`（块间距用 `--o-r-grid-column-gutter`） |
| `border-radius: 12px` | `var(--o-radius-m)` |
| `:deep(.o-btn__text){...}` | 用组件 props + 主题 token，别穿透改 |
| `defineProps(['title'])` | `defineProps<{ title: string }>()` |
| 写死 "提交" | `t('module.submit')`（zh/en 同步） |

---

## 快速自检命令（对生成的 .vue 跑）
```bash
grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(' your.vue      # 硬编码色值
grep -nE 'var\(--o-(kleinblue|blue|grey|green|red|orange|yellow|brand|amber|lime|teal|cyan|violet|purple|pink)-' your.vue  # 色板变量（应改语义 token）
grep -nE '<(button|select|table)[ >]' your.vue        # 原生控件替代
grep -n 'style="' your.vue                             # 内联样式
grep -n '!important' your.vue                          # !important
grep -n -- '--o-color-bg' your.vue                     # 不存在的 bg 命名
```
