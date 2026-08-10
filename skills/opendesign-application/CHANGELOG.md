# Changelog

本文件记录 `opendesign-application` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-08-10

### 新增
- 两套脚手架均集成 `@opendesign-plus/components` 和 `@opendesign-plus/composables`，Header 和 Footer 一比一还原 openEuler 官网设计。
- Header：使用 `OHeader` / `OHeaderMobile` 组件（固定定位 + Mega Menu 下拉面板 + 响应式切换），`OHeaderTheme` 提供主题开关 UI，导航数据在 `data/nav.ts` 中配置。
- Footer：使用 `OFooter` 组件（深色背景 + 快速导航列 + 友情链接 + Logo/邮箱 + 法律链接/版权），数据在 `data/footer.ts` 中配置。
- 主题管理从 Pinia store 迁移至 `@opendesign-plus/composables` 的 `createTheme` 插件——SPA 在 `main.ts` 注册、Nuxt 通过 `plugins/theme.ts` 全栈插件注册（`createTheme` 内部已做 SSR 守卫，SSR 时仅提供 inject 符号，客户端接管 DOM）。Nuxt SSR 由 `app.vue` 的 `useHead` 设置默认 `data-o-theme="e.light"`。
- SPA 模板新增 Vue Router 多页面路由：`src/router/index.ts`（`createWebHistory` + 懒加载），`App.vue` 改用 `<RouterView />`，`main.ts` 注册 router 插件。新增 `pages/AboutPage.vue`。
- Nuxt 模板新增 `app/pages/about.vue`，利用已有文件路由机制自动生成 `/about` 路由。
- 两套模板新增 `data/nav.ts`（OHeader 导航数据）和 `data/footer.ts`（OFooter 页脚数据）。
- 两套模板将 Logo 资源由 SVG 替换为 PNG（`assets/logo.png` + `assets/logo-dark.png`），Header Logo 跟随主题切换。

### 移除
- 移除 `stores/theme.ts`（Pinia 主题 store）和 `components/ThemeToggle.vue`（OSwitch 主题开关），由 `createTheme` + `OHeaderTheme` 替代。

### ⚠️ 破坏性
- 主题管理 API 变更：`useThemeStore()` → `useTheme()`（来自 `@opendesign-plus/composables`）；store 暴露的 `theme` / `mode` / `isDark` / `setMode` 被移除，替换为 composable 暴露的 `theme`（ref）/ `isLight`（computed）/ `isDark`（computed）/ `setTheme(theme)` / `toggleTheme()`。已使用旧 API 的业务代码需迁移。
- 新增依赖：`@opendesign-plus/components`、`@opendesign-plus/composables`、`js-cookie`、`vue-router`（两套模板均新增）。

### 修正
- Nuxt 主题插件从 `plugins/theme.client.ts`（仅客户端）改为 `plugins/theme.ts`（SSR + 客户端），修复 SSR 渲染时 `useTheme()` 的 inject 符号（`isLight`、`isDark`、`setTheme`、`toggleTheme`）未找到的警告。`createTheme` 内部已做 `typeof window !== 'undefined'` 守卫，SSR 时仅 `provide` 符号、不执行 DOM 操作。
- 两套模板注册 `v-analytics` 埋点指令（no-op 实现）——Nuxt 在 `app/plugins/opendesign-plus.ts` 注册、SPA 在 `src/main.ts` 通过 `app.directive` 注册，修复 `OHeader` 内部 `resolveDirective("analytics")` 报「Failed to resolve directive: analytics」警告。实际项目可在该指令的 `mounted` 钩子中接入真实埋点逻辑。
- Nuxt 模板的 `app/app.vue` 与 SPA 模板的 `src/App.vue` 均使用 `OPlusConfigProvider` 包裹根组件，并向其 `:theme` 传入 `useTheme()` 的当前主题，修复 `OHeader` 内部 `HeaderContent` 报「injection "Symbol(provide-config-provider)" not found」警告。

---

## 2026-07-31

### 更新
- Token 优先规则（conventions.md §1.2）补充写完样式后用 Token CLI `scan --strict` 验证 token 存在性的要求。
- Code Review 检查清单（§3.3）新增「Token 存在性」检视项——所有 `var(--o-*)` 须通过 CLI `scan --strict`，零 invalid。
- 自动化检视提示（§5）新增 Token CLI `scan`/`check` 命令段，与正则初筛互补——正则抓模式违规，CLI 抓拼写错误和捏造 token。

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
