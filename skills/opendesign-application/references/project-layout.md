> ← 返回 [SKILL.md](../SKILL.md)

# 项目布局：Nuxt vs Vite SPA

本页对照两套脚手架的目录结构与集成差异，帮助选型与迁移。所有结构来自 `templates/` 下可运行项目。

---

## 1. Vite SPA 目录结构

```
vue-spa/
├── index.html                  ← 入口 HTML
├── vite.config.ts              ← Vite 配置（别名 `@` + `#icons` + SCSS 全局注入）
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── env.d.ts
├── .vscode/
│   ├── extensions.json
│   └── settings.json           ← 文件嵌套（fileNesting）配置
├── public/
│   └── favicon.ico
├── icons/
│   ├── icon.config.ts          ← gen:icon 配置
│   └── svgs/                   ← SVG 源文件（提交到 git）
│       ├── fill/               ← 单色填充图标
│       ├── stroke/             ← 单色描边图标
│       └── color/              ← 多色图标
└── src/
    ├── App.vue                 ← 应用入口（useThemeStore 初始化 + DefaultLayout 包裹页面）
    ├── main.ts                 ← 入口（createApp + Pinia + 样式引入 + initRound 注释提示）
    ├── layouts/
    │   └── DefaultLayout.vue   ← 默认布局（AppHeader + slot + AppFooter）
    ├── pages/
    │   └── HomePage.vue        ← 首页楼层内容编排
    ├── assets/
    │   └── styles/
    │       ├── global.scss
    │       └── mixin/
    │           ├── common.scss
    │           ├── font.scss
    │           └── screen.scss
    ├── components/             ← 业务组件（显式 import）
    │   ├── AppHeader.vue        ← 导航栏（含 brand / actions slot）
    │   ├── AppFooter.vue        ← 页脚（含 default slot）
    │   ├── AppSection.vue       ← 楼层容器（消费设计令牌）
    │   ├── ThemeToggle.vue
    │   ├── ScreenDetector.vue   ← useScreen() composable + in-dark + hover mixin 示范
    │   ├── TokenPalette.vue
    │   └── ...
    ├── icon-components/        ← gen:icon 输出（git 忽略，勿提交）
    └── stores/
        └── theme.ts            ← 主题 store（默认 light + watchEffect）
```

---

## 2. Nuxt 目录结构

```
nuxt/
├── nuxt.config.ts              ← Nuxt 配置（css 数组 + vite.scss 注入 + `#icons` 别名 + modules）
├── package.json
├── tsconfig.json               ← 引用 .nuxt/ 生成的 tsconfig
├── icons/
│   ├── icon.config.ts          ← gen:icon 配置
│   └── svgs/                   ← SVG 源文件（提交到 git）
│       ├── fill/               ← 单色填充图标
│       ├── stroke/             ← 单色描边图标
│       └── color/              ← 多色图标
└── app/
    ├── app.vue                 ← 应用入口编排（NuxtLayout + NuxtPage）
    ├── layouts/
    │   └── default.vue         ← 默认布局（AppHeader + slot + AppFooter）
    ├── pages/
    │   └── index.vue           ← 首页楼层内容编排
    ├── assets/
    │   └── styles/
    │       ├── global.scss
    │       └── mixin/
    │           ├── common.scss
    │           ├── font.scss
    │           └── screen.scss
    ├── components/             ← 业务组件（Nuxt 自动导入，无需 import）
    │   ├── AppHeader.vue        ← 导航栏（含 brand / actions slot）
    │   ├── AppFooter.vue        ← 页脚（含 default slot）
    │   ├── AppSection.vue       ← 楼层容器（消费设计令牌）
    │   ├── ThemeToggle.vue
    │   ├── ScreenDetector.vue   ← useScreen() + in-dark + hover + ClientOnly 示范
    │   └── ...
    ├── icon-components/        ← gen:icon 输出（git 忽略，勿提交）
    └── stores/
        └── theme.ts            ← 主题 store（默认 light + useHead）
```

> Nuxt 4 把应用代码放在 `app/` 子目录下（区别于 Nuxt 3 的根目录）。`.nuxt/` 是生成目录，不提交。

---

## 3. 差异对照表

| 维度 | Vite SPA | Nuxt |
|------|----------|------|
| **入口 HTML** | `index.html`（手写） | Nuxt 自动生成（`app.vue` 为根） |
| **入口 JS** | `src/main.ts`（`createApp` + `app.use` + `mount`） | Nuxt 自动（无 main.ts） |
| **样式引入** | `main.ts` 的 `import` 语句 | `nuxt.config.ts` 的 `css` 数组 |
| **SCSS 全局注入** | `vite.config.ts` 的 `css.preprocessorOptions.scss.additionalData` | `nuxt.config.ts` 的 `vite.css.preprocessorOptions.scss.additionalData` |
| **路径别名** | `@` → `./src` + `#icons` → `./src/icon-components/`（在 `vite.config.ts` 的 `resolve.alias` 配置） | `~` → 项目根、`~@` → `app/`（Nuxt 约定） + `#icons` → `./app/icon-components/`（在 `nuxt.config.ts` 的 `alias` 配置） |
| **路由** | `vue-router` 手动配置 | 文件路由自动生成（`pages/` 目录） |
| **Pinia 注册** | `main.ts` 中 `app.use(createPinia())` | `@pinia/nuxt` 模块自动注册 |
| **组件导入** | 显式 `import` | 自动导入（`components/` 下的组件无需 import） |
| **VueUse** | `@vueuse/core`（显式 import） | `@vueuse/nuxt` 模块（自动导入 composables） |
| **DOM 同步** | `watchEffect` + `document.setAttribute` | `useHead` 的 `htmlAttrs`（ref） |
| **系统偏好检测** | 无（默认 light，不跟随系统） | 无（默认 light，不跟随系统） |
| **hydration** | 无（纯客户端） | 有（需处理 SSR/客户端不匹配） |
| **SSR 安全** | 不需要 | `import.meta.client` 守卫、`<ClientOnly>`、避免 `window`/`matchMedia` 在服务端调用 |
| **`useScreen()`** | 直接调用，无 hydration 问题 | 需 `<ClientOnly>` 包裹含 `v-if` 条件渲染的部分 |
| **图标生成** | `gen:icon` 输出到 `src/icon-components/`，通过 `#icons` 别名导入 | `gen:icon` 输出到 `app/icon-components/`，通过 `#icons` 别名导入 |

---

## 4. 选型建议

| 场景 | 推荐 | 原因 |
|------|------|------|
| 官网、内容站、博客 | Nuxt | SEO 需求 + 静态生成（`nuxt generate`） |
| 需要服务端渲染动态内容 | Nuxt | SSR + 数据获取 |
| 后台管理系统 | Vite SPA | 不需 SEO，SPA 体验更流畅 |
| 内部工具站、控制台 | Vite SPA | 部署简单，单静态资源 |
| 已有 vue-router 项目改造 | Vite SPA | 迁移成本低，不引入 Nuxt 路由约定 |
| 需要全静态部署（CDN） | Nuxt（`nuxt generate`）或 Vite SPA | 两者均可，Nuxt 静态化更彻底 |

> 若不需要 SSR/SSG，**优先选 Vite SPA**——集成更简单（无 hydration 问题、无 SSR 安全守卫）。只有明确需要 SEO 或服务端渲染时才上 Nuxt。

---

## 5. 从一个脚手架迁移到另一个

若项目起步选了 Vite SPA，后期发现需要 SEO，迁移到 Nuxt 时注意：

| 需要改的 | 从 | 到 |
|---------|-----|-----|
| DOM 同步 | `watchEffect` + `setAttribute` | `useHead` 的 `htmlAttrs`（ref） |
| 样式引入 | `main.ts` import | `nuxt.config.ts` css 数组 |
| 路径别名 | `@` → `./src` | `~@` → `app/` |
| 组件 import | 显式 | 自动导入（可删除 import 语句） |
| Pinia 注册 | `app.use(createPinia())` | `@pinia/nuxt` 模块 |

> 迁移时先复制 `app/assets/styles/`（mixin + global.scss）与 `components/`，再改 store 与 plugin，最后改入口配置。

---

## 6. `.vscode/settings.json`（Vite SPA 脚手架已配）

```json
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json, env.d.ts, typed-router.d.ts",
    "vite.config.*": "jsconfig*, vitest.config.*, cypress.config.*, playwright.config.*",
    "package.json": "package-lock.json, pnpm*, .yarnrc*, yarn*, .eslint*, .prettier*"
  }
}
```

文件嵌套让资源管理器更整洁——配置文件折叠到主文件下。Nuxt 项目可参照配置。
