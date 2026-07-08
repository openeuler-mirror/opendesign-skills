> ← [Template Guide](../SKILL.md) · [README](../../../README.md)

# 跨模板同步原则与判定规则

本文件是 template-guide 的**总纲**——每次修改 `skills/opendesign-application/templates/` 下的任何文件时，必须先按本文件判断改动类型，再决定操作范围。分域细则见 [`template-agents.md`](template-agents.md)（AGENTS.md）与 [`template-code.md`](template-code.md)（代码）。

---

## 核心原则

> **修改 templates 时，必须先判断该改动是跨模板通用还是平台特异。通用改动必须同步到所有模板，各自适配特异机制。**

两套模板（Nuxt / SPA）共享同一套设计系统与工程规范，它们的**功能意图一致**，但**实现方式因平台而异**。维护时绝不能只改一套而遗漏另一套。

---

## 判定流程

每次改动前，按以下流程判断：

```
1. 这个改动是否两套模板都需要？
   ├─ 是 → 通用改动 → 同步到所有模板，各自适配
   └─ 否 → 只某一模板需要？
       ├─ 是 → 特异改动 → 只改对应模板
       └─ 否 → 重新审视：是否遗漏了另一模板的等价需求？
```

### 通用改动判定标准

以下特征说明改动是**跨模板通用**的：

- 改动来自 **opendesign-application skill references 的规范变化**（如 mixin 新增、token 重命名、样式引入顺序调整）
- 改动是 **OpenDesign 集成机制的更新**（如主题 store API 变化）
- 改动是 **基础设施组件的更新**（如 AppSection 新增 prop、ScreenDetector 检测逻辑优化）
- 改动是 **通用 bug 修正**（如 mixin 中的 CSS 错误、global.scss 遗漏）
- 改动是 **依赖版本升级**（如 `@opensig/opendesign` 版本更新）

### 特异改动判定标准

以下特征说明改动是**平台特异**的：

- 改动只涉及 **Nuxt SSR 专属机制**（如 hydration 修复、`<ClientOnly>` 使用方式、`useHead` DOM 同步逻辑）
- 改动只涉及 **SPA 专属机制**（如 `main.ts` 入口逻辑、`watchEffect` DOM 同步）
- 改动是 **某模板特有的配置文件结构变化**（如 Nuxt 的 `nuxt.config.ts` 模块注册方式、SPA 的 `vite.config.ts` 别名配置）
- 改动是 **某模板特有的目录约定变化**（如 Nuxt 自动导入规则、SPA 显式 import 规范）

### 疑似通用但实为特异的常见误判

| 误判 | 实际 | 正确做法 |
|------|------|---------|
| "组件代码一样，所以直接复制" | 组件内 `import` / `composable` / `store` 调用方式不同（Nuxt 自动导入 vs SPA 显式 import） | 代码意图相同，但 import 语句按各模板特异机制分别写 |
| "主题 store 加了新方法" | 两套模板的 theme.ts 接口一致，但 DOM 同步方式不同（`useHead` vs `watchEffect`） | store 逻辑同步，DOM 同步各自适配 |
| "AppSection 新增了 prop" | 两套模板的 AppSection.vue 代码可完全相同 | ✅ 确实通用，直接同步 |

---

## 通用改动的同步操作

确认改动为**跨模板通用**后，按以下步骤操作：

### 1. 确认改动意图

明确"改什么、为什么改"——同一意图在不同模板中可能有不同实现。

### 2. 逐模板适配实现

| 意图 | Nuxt 适配 | SPA 适配 |
|------|----------|----------|
| 新增 mixin 并全局注入 | `nuxt.config.ts` → `additionalData` 追加 | `vite.config.ts` → `additionalData` 追加 |
| token CSS 引入路径变化 | `nuxt.config.ts` → `css` 数组修改 | `main.ts` → `import` 语句修改 |
| 主题 store 新增方法 | `stores/theme.ts` 同步（DOM 同步走 `useHead`） | `stores/theme.ts` 同步（DOM 同步走 `watchEffect`） |
| 基础设施组件新增 prop | 组件 `.vue` 文件直接同步（两套通常代码相同） | 同左 |
| `global.scss` 新增规则 | `assets/styles/global.scss` 直接同步 | 同左 |
| `reset.scss` 规则变化 | `assets/styles/reset.scss` 直接同步 | 同左 |
| mixin 文件内容修正 | `assets/styles/mixin/*.scss` 直接同步 | 同左 |
| 组件内 import 变化 | **无 import 语句**（Nuxt 自动导入） | 需显式 `import { xxx } from 'vue'` 等 |
| 依赖版本升级 | `package.json` 修改 + `pnpm install` | 同左 |

### 3. 同步 AGENTS.md

代码改动后，检查两套模板的 AGENTS.md 是否需要同步更新（详见 [`template-agents.md`](template-agents.md) 的「与 template-code.md 的联动」章节）。

### 4. 双模板验证

两套模板都跑 `pnpm dev` 确认改动生效且无副作用。

---

## 特异改动的操作

确认改动为**平台特异**后，只改对应模板。但仍需检查：

| 检查项 | 说明 |
|--------|------|
| 另一模板是否有等价需求 | 即使实现不同，功能意图可能相同——此时其实是通用改动 |
| AGENTS.md 是否需要更新特异章节 | Nuxt AGENTS.md 有 SSR 守卫章节，SPA 没有；改动涉及特异内容时只改对应 AGENTS.md |
| 是否影响共享文件 | 两套模板共享的文件（如 AppSection.vue、mixin/*.scss）不应被特异改动污染 |

---

## 两套模板的文件对照

以下是两套模板的文件结构对照，标注了哪些是**共享**（通用改动需同步）、哪些是**特异**（只影响对应模板）：

### 共享文件（通用改动时两套都要同步）

| 文件 | Nuxt 路径 | SPA 路径 | 说明 |
|------|----------|----------|------|
| AppSection.vue | `app/components/AppSection.vue` | `src/components/AppSection.vue` | 代码通常完全相同 |
| ThemeToggle.vue | `app/components/ThemeToggle.vue` | `src/components/ThemeToggle.vue` | 代码通常完全相同 |
| ScreenDetector.vue | `app/components/ScreenDetector.vue` | `src/components/ScreenDetector.vue` | 代码通常完全相同 |
| Token* 演示组件 | `app/components/Token*.vue` | `src/components/Token*.vue` | 代码通常完全相同 |
| theme.ts | `app/stores/theme.ts` | `src/stores/theme.ts` | **逻辑相同，DOM 同步特异**（`useHead` vs `watchEffect`） |
| mixin/*.scss | `app/assets/styles/mixin/*.scss` | `src/assets/styles/mixin/*.scss` | 完全相同 |
| reset.scss | `app/assets/styles/reset.scss` | `src/assets/styles/reset.scss` | 完全相同 |
| global.scss | `app/assets/styles/global.scss` | `src/assets/styles/global.scss` | 完全相同 |
| AGENTS.md | `AGENTS.md` | `AGENTS.md` | **结构相似，内容特异** |
| package.json | `package.json` | `package.json` | **依赖列表不同**（Nuxt 有 nuxt 模块，SPA 有 vite） |

### Nuxt 特异文件

| 文件 | 路径 | 说明 |
|------|------|------|
| nuxt.config.ts | `nuxt.config.ts` | 模块注册 + css 数组 + SCSS 注入 |
| app.vue | `app/app.vue` | 应用入口编排（NuxtLayout + NuxtPage） |

### SPA 特异文件

| 文件 | 路径 | 说明 |
|------|------|------|
| vite.config.ts | `vite.config.ts` | SCSS 注入 + 别名 |
| main.ts | `src/main.ts` | createApp + 样式引入顺序 |
| App.vue | `src/App.vue` | 主题初始化 + DefaultLayout 包裹页面 |
| index.html | `index.html` | `<html lang="zh-CN" data-o-theme="e.light">` |

---

## 自检清单（每次改动 templates 后必过）

| 检查项 | 合规 | 违规信号 |
|--------|------|---------|
| 改动类型判断 | 已明确是通用还是特异 | 未判断，直接只改了一套 |
| 通用改动同步 | 两套模板都已适配 | 只改了 Nuxt 或只改了 SPA |
| 特异机制适配 | 通用意图在两套模板中分别正确实现 | Nuxt 用了 SPA 方式或反之 |
| 共享文件一致性 | AppSection / mixin / reset.scss / global.scss 两套一致 | 两套版本不同步 |
| AGENTS.md 同步 | 两套 AGENTS.md 反映了最新改动 | 某套 AGENTS.md 过时 |
| `pnpm dev` 验证 | 两套模板均正常运行 | 某套报错或样式错乱 |
| pnpm-lock.yaml | 两套都已 `pnpm install` | lock 文件过期 |
| CHANGELOG | 变更已记入根 CHANGELOG.md | 未记录 |
