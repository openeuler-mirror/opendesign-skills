# Changelog

本文件记录 `opendesign-application` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-07-08

### 更新
- 主题系统集成简化为默认 light 模式——移除防闪烁（FOUC）机制（SPA `index.html` 内联脚本 + Nuxt `useHead` script 注入）、移除持久化（SPA `useStorage`/localStorage + Nuxt `useCookie`）、移除系统暗色偏好检测（`usePreferredDark` + Nuxt `plugins/theme.client.ts`），store API 精简为 `theme` / `mode` / `isDark` / `setMode`（移除 `hasUserChoice` / `setSystemMode`），DOM 同步改为 Nuxt `useHead` htmlAttrs 直传 ref / SPA `watchEffect` + `setAttribute`，社区切换同步点从 Nuxt 3 处 / SPA 4 处减至各 2 处（token CSS + store 常量）。若业务需要持久化主题偏好，可自行接入 localStorage（SPA）或 cookie（Nuxt）。
- font.scss 字体 mixin 移除 `$only-var-prefix` 前缀参数模式，改为固定 `--font-size` / `--line-height` + `@include text` 成对输出；单独引用字号/行高改用 `var(--o-r-font_size-*)` / `var(--o-r-line_height-*)` 响应式变量。
- SCSS 编译依赖从 `sass` 改为 `sass-embedded`；Nuxt 入口补充 `#icons` 别名、SCSS `additionalData` 全局注入、`@vueuse/core` optimizeDeps；SPA 入口增加逐行注释与 `initRound` 圆角风格示例。
- 约定强化——Code Review 检查清单新增行高配对、字重 token、动画时间/缓动 token、组件样式定制途径、表单宽度、mixin vs useScreen 分工、gen:icon 产物目录检视项，违规示例新增 4.7–4.12 共 6 条，自动化扫描正则新增 4 条。
- Token 优先规则细化——响应式 token（`--o-r-*`）优先，静态 token 仅用于固定布局；图标导入路径改为「按项目约定路径」；表单宽度规则从硬性约束调整为建议做法。

---

## 2026-07-07

### 新增
- 工程化落地指南（`skills/opendesign-application/`），含 5 份 reference——`getting-started.md`（依赖安装、入口文件、样式引入顺序、`useScreen()`）、`theme-system.md`（Pinia store writable computed `isDark` + `storeToRefs` 解构、防闪烁、SSR hydration、社区切换、ThemeToggle 基于 OSwitch + OIconSun/OIconMoon + `:checked-value="false" :unchecked-value="true"`）、`styles-infrastructure.md`（SCSS mixin 三套含 hover/hoverable、全局注入、栅格容器、AppSection 楼层组件）、`project-layout.md`（目录结构、Nuxt vs SPA 差异对照、选型建议）、`conventions.md`（硬规则、应用层约定、Code Review 检查清单）。另含两套可运行脚手架（`templates/nuxt` Nuxt 4 SSR + `templates/vue-spa` Vite SPA），每套附带项目级 `AGENTS.md`。

---

> 本 CHANGELOG 自 2026-07-25 起从仓库根目录迁移至各 skill 目录。更早的变更详见 `git log`。
