> ← [Template Guide](../SKILL.md) · [README](../../../README.md)

# 脚手架模板代码维护规范

本文件指导如何维护 `skills/opendesign-application/templates/{nuxt,vue-spa}/` 下的模板代码——脚手架的工程基线文件。与 [`template-agents.md`](template-agents.md)（AGENTS.md 编写规范）互补——那边管文档怎么写，这边管代码怎么改。

> 改动代码前先判断类型——通用改动必须两套模板同步（各自适配特异机制），特异改动只改对应模板。判定规则见 [`template-sync.md`](template-sync.md)。

---

## 文件分类

脚手架模板中的文件按修改权限分为两类：

### 基础设施文件（不建议修改）

除非切换社区或有明确需求，以下文件不应修改——它们承载 OpenDesign 集成的核心机制，改动一处需联动多处：

| 文件 | Nuxt 路径 | SPA 路径 | 通用/特异 | 作用 | 联动范围 |
|------|----------|----------|----------|------|---------|
| 配置文件 | `nuxt.config.ts` | `vite.config.ts` | **特异**（结构不同） | 模块注册 + 样式引入顺序 + SCSS 全局注入 | 改样式顺序影响全站视觉；改 SCSS 注入影响所有组件 |
| theme store | `app/stores/theme.ts` | `src/stores/theme.ts` | **通用**（逻辑相同，DOM 同步特异） | DOM 同步 + 社区常量 | 改社区常量需联动配置文件 |
| 主题切换 | `app/components/ThemeToggle.vue` | `src/components/ThemeToggle.vue` | **通用** | 主题切换按钮 | 改切换逻辑需联动 store |
| 楼层容器 | `app/components/AppSection.vue` | `src/components/AppSection.vue` | **通用** | 宽度/间距/标题排版规范 | 改排版规则影响全站楼层 |
| 断点检测 | `app/components/ScreenDetector.vue` | `src/components/ScreenDetector.vue` | **通用** | 响应式断点检测（初始化 `useScreen()`） | 改检测逻辑影响全站响应式 |
| 三套 mixin | `app/assets/styles/mixin/*.scss` | `src/assets/styles/mixin/*.scss` | **通用** | common / font / screen | 改 mixin 影响所有使用该 mixin 的组件 |
| 全局样式 | `app/assets/styles/global.scss` | `src/assets/styles/global.scss` | **通用** | body 基线 + 表单宽度 | 改表单宽度影响所有表单控件 |
| CSS Reset | `app/assets/styles/reset.scss` | `src/assets/styles/reset.scss` | **通用** | 归零 UA 默认样式 + 防御溢出与基线偏移 | 必须在 Token 之前；改 reset 规则影响全站基线 |

> **通用基础设施文件改动时，两套模板必须同步**。例如修改 AppSection.vue 的 props，两套模板的 AppSection.vue 都要更新。

### 业务文件（可自由修改）

| Nuxt | SPA | 说明 |
|------|-----|------|
| `app/app.vue` | `src/App.vue` | 应用入口编排（Nuxt：NuxtLayout + NuxtPage；SPA：useThemeStore + DefaultLayout 包裹页面） |
| `components/*.vue`（除基础设施） | `src/components/*.vue`（除基础设施） | 业务组件 |
| `composables/*.ts` | `src/composables/*.ts` | 业务 composable |
| `stores/*.ts`（除 theme） | `src/stores/*.ts`（除 theme） | 业务 store |

---

## 社区切换同步点

切换社区主题时，必须**同时修改**以下位置，缺一即视觉错乱——这是最典型的**通用意图 + 特异实现**案例：

### Nuxt（2 处）

1. **`nuxt.config.ts`** 的 `css` 数组中 token CSS 引入路径（如 `e.light.token.css` → `a.light.token.css`）
2. **`stores/theme.ts`** 的 `OPENDESIGN_COMMUNITY` 常量（如 `'e'` → `'a'`）

### SPA（2 处）

1. **`main.ts`** 的 token CSS 引入路径
2. **`stores/theme.ts`** 的 `OPENDESIGN_COMMUNITY` 常量

---

## 样式引入顺序（红线）

两套脚手架的样式引入顺序必须严格保持，违反即视觉错乱——**通用意图，特异实现**：

**CSS Reset → Token CSS → 鸿蒙字体 → 组件库样式 → 项目全局样式**

| 脚手架 | 机制 | 位置 |
|--------|------|------|
| Nuxt | `nuxt.config.ts` 的 `css` 数组（**数组顺序即输出顺序**） | `nuxt.config.ts` |
| SPA | `main.ts` 的 `import` 语句顺序 | `main.ts` |

不可调换、不可跳过任何一项。修改时必须保持顺序不变。

---

## SCSS 全局注入

三套 mixin（common / font / screen）必须全局注入，组件内不再手动 `@use`——**通用意图，特异实现**：

| 脚手架 | 配置位置 | 关键字段 |
|--------|---------|---------|
| Nuxt | `nuxt.config.ts` → `vite.css.preprocessorOptions.scss.additionalData` | `@use` + `@forward` 所有 mixin |
| SPA | `vite.config.ts` → `css.preprocessorOptions.scss.additionalData` | `@use` + `@forward` 所有 mixin |

新增全局 mixin 时，**两套模板都要同步**——各自完成两步：
1. 创建 `assets/styles/mixin/xxx.scss` 文件（两套共享文件，内容相同）
2. 在各自配置文件的 `additionalData` 中追加 `@use` + `@forward`（位置和格式不同）

> 不建议频繁新增 mixin——现有三套已覆盖绝大多数场景。新增前先确认是否已有等价能力。

---

## 模板代码与 skill references 的对齐原则

模板代码是 opendesign-application skill references 中描述的**工程基线的可运行实现**。两者必须保持对齐——**对齐动作是通用改动，两套模板都要同步**：

| skill references 变化 | 模板代码同步动作 |
|----------------------|-----------------|
| 新增 mixin | **两套**创建 `mixin/xxx.scss` + 各自在配置中追加 `additionalData` |
| token 变量重命名 | **两套**更新 `global.scss` / 组件样式中的 `var(--o-*)` 引用 |
| 样式引入顺序规则变化 | **两套**各自更新配置中的 css 数组 / import 顺序 |
| 主题 store API 变化（新增方法 / 改参数） | **两套**更新 `stores/theme.ts` + `ThemeToggle.vue` |
| 新增基础设施组件（如 AppSection） | **两套**创建组件文件 + 各自 AGENTS.md 加入基础设施文件清单 |
| 新增全局样式规则 | **两套**更新 `global.scss` |

**反向**：模板代码中的实现细节变化（如 bug 修正、性能优化、代码重构），不影响 skill references——references 描述的是**规范**而非具体实现。只要规范不变，代码可以自由优化。但优化仍需两套同步（除非是平台特异的优化）。

---

## 模板 package.json 维护

两套脚手架的 `package.json` **依赖列表不同**（Nuxt 有 nuxt 模块，SPA 有 vite），但关键 OpenDesign 依赖版本应保持对齐：

| 包 | 最低版本来源 | 对齐方式 |
|----|-----------|---------|
| `@opensig/opendesign` | opendesign-components SKILL.md 版本标注行 | 两套 ≥ 标注的最低依赖版本 |
| `@opensig/opendesign-token` | opendesign-tokens SKILL.md 版本标注行 | 两套 ≥ 标注的最低依赖版本 |
| `@opensig/open-scripts` | opendesign-scripts SKILL.md 版本标注行 | 两套 ≥ 标注的最低依赖版本 |

新增业务依赖（如 `axios`、`dayjs`）不受此约束，按项目需求添加——但如果两套模板都需要同一业务依赖，应保持版本一致。

---

## 新增模板文件的规范

新增文件时，先判断是**通用**（两套都要加）还是**特异**（只某一模板需要）：

### 通用文件（两套都新增）

| 文件类型 | Nuxt 放哪里 | SPA 放哪里 | 各自适配 |
|---------|------------|-----------|---------|
| 基础设施组件 | `app/components/Xxx.vue` | `src/components/Xxx.vue` | 代码通常相同；组件内 import Nuxt 自动 / SPA 显式 |
| composable | `app/composables/useXxx.ts` | `src/composables/useXxx.ts` | Nuxt 自动导入无需 import / SPA 需显式 import |
| store | `app/stores/useXxxStore.ts` | `src/stores/useXxxStore.ts` | Nuxt 自动导入 / SPA 需显式 import；DOM 同步 `useHead` vs `watchEffect` |
| mixin 文件 | `app/assets/styles/mixin/xxx.scss` | `src/assets/styles/mixin/xxx.scss` | 内容相同；各自配置追加 `additionalData` |
| 全局样式 | `app/assets/styles/xxx.scss` | `src/assets/styles/xxx.scss` | 内容相同；各自在入口中引入 |

### Nuxt 特异文件

| 文件类型 | 放在哪里 | 注意事项 |
|---------|---------|---------|
| Plugin | `plugins/xxx.client.ts` / `.server.ts` / `.ts` | `.client.ts` 仅客户端，`.server.ts` 仅服务端 |
| Page | `app/pages/xxx.vue` | 文件名即路由路径；创建 `pages/` 目录后 `app.vue` 需加 `<NuxtPage />` |

### SPA 特异文件

| 文件类型 | 放在哪里 | 注意事项 |
|---------|---------|---------|
| 入口样式引入 | `src/main.ts` | 新增样式按引入顺序追加 import |
| HTML 入口 | `index.html` | `<html lang="zh-CN" data-o-theme="e.light">` |

---

## 代码修改自检清单

每次修改脚手架模板代码后，按以下清单逐项检查——**通用改动必须两套同步**：

| 检查项 | 合规 | 违规信号 |
|--------|------|---------|
| 改动类型判断 | 已明确通用/特异 | 未判断，直接只改了一套 |
| 通用改动同步 | 两套模板都已适配 | 只改了 Nuxt 或只改了 SPA |
| 样式引入顺序 | Reset → Token → 字体 → 组件 → 全局 | 顺序调换或跳过 |
| SCSS 全局注入 | 两套 `additionalData` 都包含所有 mixin | 某套缺失新增的 mixin |
| 社区切换一致性 | Nuxt 2 处 / SPA 2 处同步修改 | 只改了部分位置 |
| 基础设施文件改动 | 有明确需求 + 两套联动修改完整 | 无理由改动或联动遗漏 |
| 依赖版本 | 两套 ≥ skill 版本标注行中的最低依赖版本 | 某套低于最低版本 |
| SSR 安全 | Nuxt 模板无裸 `window` / `localStorage` | 出现未守卫的客户端 API |
| token 驱动 | 样式值用 `var(--o-*)` 或 `@include` mixin | 硬编码 hex / px |
| 组件优先 | 用 O 组件而非原生替代 | `<button>` / `<input>` 替代 |
| 共享文件一致性 | AppSection / mixin / reset.scss / global.scss 两套代码相同 | 两套版本不同步 |
| pnpm-lock.yaml | 两套都已 `pnpm install` | lock 文件过期 |

---

## pnpm-lock.yaml 维护

两套脚手架的 `pnpm-lock.yaml` 是运行依赖锁定文件，应随 `package.json` 变化同步更新——**两套都要跑**：

```bash
cd skills/opendesign-application/templates/nuxt && pnpm install
cd skills/opendesign-application/templates/vue-spa && pnpm install
```

提交时包含两套 `pnpm-lock.yaml`，确保 clone 后可直接 `pnpm install` 运行。

> `.gitignore` 已排除 `node_modules/` / `.nuxt/` / `.output/` / `dist/` 等运行时产物。不要提交这些目录。

---

## 与 template-agents.md 的联动

代码变更后，需要同步检查两套模板的 AGENTS.md 是否需要更新——**AGENTS.md 更新也属通用改动**（除非内容是平台特异的）：

| 代码变更类型 | AGENTS.md 同步动作 |
|-------------|-------------------|
| 新增基础设施文件 | **两套**都加入「基础设施文件清单」 |
| 新增基础设施组件 | **两套**都加入「业务组件」章节（Props/Slots/用法）+ 基础设施文件清单 |
| 社区切换同步点变化 | Nuxt AGENTS.md 更新 2 处 / SPA AGENTS.md 更新 2 处（**特异内容各自适配**） |
| 入口文件职责变化 | **两套**都更新「入口文件职责划分」表（具体文件名各自适配） |
| 技术栈变化 | **两套**都更新「技术栈红线」表（依赖列表各自适配） |
| 新增 mixin | **两套**都更新 SCSS mixin 章节的注入说明 + 基础设施文件清单 |

> **反向**：AGENTS.md 的纯文档优化（措辞调整、格式修正、引用更新）不需要联动代码变更——但如果优化是通用改动，两套 AGENTS.md 都要同步。
