> ← [Template Guide](../SKILL.md) · [README](../../../README.md)

# 脚手架 AGENTS.md 编写与更新规范

本文件指导如何编写和更新 `skills/opendesign-application/templates/{nuxt,vue-spa}/AGENTS.md`——脚手架项目的项目级指导文件（第一层：生产指导）。

> 改动 AGENTS.md 前先判断类型——通用改动必须两套 AGENTS.md 同步，特异改动只改对应模板。判定规则见 [`template-sync.md`](template-sync.md)。

---

## 核心定位

脚手架 AGENTS.md 是**独立项目的项目级指导文件**，不是本仓库的子目录文档。编写时必须始终站在独立项目语境思考：脚手架 clone 下来后，开发者只看到项目文件（`nuxt.config.ts` / `app.vue` / `main.ts` 等）和这个 `AGENTS.md`——周边不存在 `references/` 目录、不存在本仓库的任何 skill 文件。

---

## 独立项目语境

### 禁止相对路径引用

脚手架脱离本仓库后，相对路径不再可达：

- ❌ `../../references/getting-started.md`
- ❌ `../SKILL.md`
- ❌ `./references/conventions.md`

✅ **使用 skill 名称 + 参考文件名**：`opendesign-application skill → getting-started`——AI 工具通过 skill 系统按名称解析，开发者查阅 `@opensig/opendesign` 包文档或 OpenDesign 官网。

### 不使用本仓库语境的表达

| 规则 | ✅ 正确 | ❌ 错误 |
|------|---------|---------|
| 表头 | "查阅指引" | "与 Skill 文档的对照" |
| 列名 | "去哪查" | "查哪里" + markdown 链接 |
| 引用格式 | `opendesign-application skill → getting-started` | `../../references/getting-started.md` |
| 补充说明 | "AI 工具通过 skill 名称解析，开发者查阅包文档或官网" | 留空或暗示本仓库路径 |

---

## 内容分层原则

脚手架 AGENTS.md 是**第一层（生产指导）**文件，面向在脚手架项目中工作的 AI 工具与设计师。Skill 的 references（getting-started / theme-system / styles-infrastructure / conventions 等）是**第三层（Skill 本体）**，面向 skill 用用者。两者受众不同，但**内容不应重复**。

### 保留：项目专属内容

以下内容属于脚手架项目语境，AGENTS.md **必须保留**：

- 技术栈红线（不可替换表）
- 入口文件职责划分
- SSR 安全守卫（Nuxt 专属）
- 自动导入规则（Nuxt 专属）
- 组件拆分规范（时机、原则、命名）
- Composable / Store / Plugin / Mixin 文件模板与规范
- 组件内部结构规范
- 数据获取 composables（Nuxt 专属）
- 新增业务组件完整流程
- 基础设施文件清单
- 楼层式组装（AppSection 使用规范 + 标准页面结构代码）
- 业务组件详解（如 AppSection Props/Slots/用法）

### 删除：skill references 已覆盖的完整内容

以下内容已由 opendesign-application skill 的 references 完整覆盖，AGENTS.md **不应重复**：

- 样式引入顺序详解（完整步骤、原因、代码）
- 样式硬规则表（`:deep` 禁令、token 优先、组件优先、hover 走 mixin）
- 反模式表（常见违规示例与修正）
- 响应式策略优先级表
- 表单宽度管理详解
- SCSS mixin 三套表格与用法详解
- 楼层式组装完整代码示例（已在 AppSection 组件详解中覆盖）
- `<ClientOnly>` 完整示例（Nuxt）
- hydration 详细代码
- 目录结构树
- 主题切换详细机制（防闪烁原理、DOM 同步、社区切换全流程）

### 用一句话 + skill 引用替代

对上述"删除"类内容，用一句话引用替代——既不丢失信息可达性，又不重复 skill 本体：

> 样式硬规则详见 opendesign-application skill → conventions 的「硬规则红线」章节

> 完整主题系统集成见 opendesign-application skill → theme-system

> SCSS mixin 用法详解见 opendesign-application skill → styles-infrastructure

---

## 查阅指引格式规范

末尾的查阅指引表应遵守以下格式：

### 标准结构

```markdown
## 查阅指引

本 AGENTS.md 只保留 Nuxt / SPA 专属约束与项目级操作指导。通用规范按以下指引定位（AI 工具通过 skill 名称解析，开发者查阅 `@opensig/opendesign` 包文档或 OpenDesign 官网）：

| 要查什么 | 去哪查 |
|---------|--------|
| 组件 API（Props / Events / Slots） | **opendesign-components** skill |
| token 变量名完整列表 | **opendesign-tokens** skill |
| 依赖安装、入口文件、样式引入顺序详解 | **opendesign-application** skill → getting-started |
| 主题系统完整集成（Pinia store、防闪烁、SSR hydration、社区切换） | **opendesign-application** skill → theme-system |
| SCSS mixin 用法详解、栅格容器、楼层结构、global.scss | **opendesign-application** skill → styles-infrastructure |
| 目录结构对照与 Nuxt vs SPA 差异 | **opendesign-application** skill → project-layout |
| 样式硬规则、反模式清单、Code Review 检查清单 | **opendesign-application** skill → conventions |
```

### 格式红线

| 检查项 | 合规 | 违规信号 |
|--------|------|---------|
| 表头 | "查阅指引" | "与 Skill 文档的对照" |
| 列名 | "要查什么" + "去哪查" | "查哪里" + markdown 链接 |
| 引用格式 | `opendesign-application skill → getting-started` | `../../references/getting-started.md` |
| 补充说明 | "AI 工具通过 skill 名称解析，开发者查阅包文档或官网" | 留空或暗示本仓库路径 |

---

## Nuxt vs SPA 差异对照

两套脚手架的 AGENTS.md 有显著差异，编写时必须准确区分——**Nuxt AGENTS.md 包含 SPA 不需要的 SSR 专属章节，SPA AGENTS.md 不应出现任何 SSR 相关内容**：

| 维度 | Nuxt AGENTS.md | SPA AGENTS.md |
|------|---------------|---------------|
| SSR 安全守卫 | ✅ 必含（服务端不可用 API 表 + hydration 防范 + ClientOnly 规范） | ❌ 不含（无 SSR） |
| `<ClientOnly>` | ✅ 必含使用规范 | ❌ 不含 |
| 持久化方案 | `useCookie()`（服务端可读） | `useStorage` / `localStorage`（无 SSR） |
| 客户端守卫 | `import.meta.client` | ❌ 不需要 |
| 自动导入 | ✅ Nuxt 自动导入规则 + 禁手动 import | ❌ 需显式 import |
| Plugin 分类 | ✅ `.client.ts` / `.server.ts` / `.ts` | ❌ 无 Plugin 目录 |
| 数据获取 | ✅ `useFetch` / `useAsyncData` / `$fetch` | ❌ 无内置数据获取 |
| 社区切换同步点 | 3 处（nuxt.config.ts + store 常量 + FOUC 脚本） | 4 处（main.ts + store 常量 + index.html 脚本 + `<html>` 默认值） |
| 入口文件 | `nuxt.config.ts` + `app/app.vue` | `main.ts` + `App.vue` + `index.html` |
| 页面路由 | `pages/` 目录自动路由 | 无 `pages/` 目录 |
| 防闪烁注入 | `useHead`（Nuxt 自动注入 `<head>`） | `index.html` 内联 `<script>` |

> **通用改动的同步**：如果 AGENTS.md 的某个通用章节（如组件拆分规范、AppSection 用法、最佳实践）需要更新，两套 AGENTS.md 都要同步改——特异章节只改对应模板。详见 [`template-sync.md`](template-sync.md)。

---

## 写作自检清单

每次编写或更新脚手架 AGENTS.md 后，按以下清单逐项检查：

| 检查项 | 合规 | 违规信号 |
|--------|------|---------|
| 改动类型判断 | 已明确通用/特异 | 未判断就只改了一套 |
| 通用章节同步 | 通用内容两套 AGENTS.md 一致 | Nuxt 改了但 SPA 没改 |
| 相对路径引用 | 无 `../../references/` 或 `../SKILL.md` | 出现相对路径 |
| 查阅指引表头 | "查阅指引" | "与 Skill 文档的对照" |
| 查阅指引列名 | "去哪查" | "查哪里" + markdown 链接 |
| skill 引用格式 | `opendesign-application skill → getting-started` | `../../references/getting-started.md` |
| 内容重复 | 一句话引用替代 skill 已覆盖的完整内容 | 大段复制 skill references 的原文 |
| Nuxt 专属内容 | SSR 守卫 / ClientOnly / useCookie / 自动导入 / Plugin / 数据获取 | SPA AGENTS.md 中出现这些内容 |
| SPA 专属内容 | 显式 import / useStorage / 无 SSR 守卫 | Nuxt AGENTS.md 中出现 SPA 专属表述 |
| 项目定位 | 首段明确标注 SSR 或 SPA + 适用场景 | 模糊或未区分 |
| 基础设施文件清单 | 列出所有不建议修改的基础文件 | 缺失或遗漏关键文件 |
| 楼层式组装 | AppSection 使用规范 + 标准页面结构代码 | 手写 `.floor` CSS 组合 |
| 最后更新日期 | 末尾标注更新日期 | 缺失 |

---

## 与 opendesign-application skill 的同步

脚手架 AGENTS.md 中的"一句话引用"指向 opendesign-application skill 的 references。当 skill references 更新时：

| 变化类型 | AGENTS.md 同步动作 |
|---------|-------------------|
| 引用章节名称变化 | **两套 AGENTS.md 都更新**引用文本中的章节名 |
| 新增 reference 文件 | **两套查阅指引表都新增**一行 |
| 章节合并或重命名 | **两套引用文本都更新**，合并引用指向 |
| 规范内容变化（不影响项目级约束） | **不动作**——AGENTS.md 不重复 skill 本体内容 |

> **核心原则**：AGENTS.md 只引用，不搬运。skill 变了就更新引用指向，但绝不把 skill 的完整内容搬进 AGENTS.md。引用更新属于通用改动，两套 AGENTS.md 必须同步。

---

## 与 template-code.md 的联动

代码变更后，需要同步检查对应的 AGENTS.md 是否需要更新：

| 代码变更类型 | 两套 AGENTS.md 同步动作 |
|-------------|----------------------|
| 新增基础设施文件 | **两套**都加入「基础设施文件清单」 |
| 新增基础设施组件 | **两套**都加入「业务组件」章节（Props/Slots/用法）+ 基础设施文件清单 |
| 社区切换同步点变化 | Nuxt AGENTS.md 更新 3 处 / SPA AGENTS.md 更新 4 处（**特异内容各自适配**） |
| 入口文件职责变化 | **两套**都更新「入口文件职责划分」表 |
| 技术栈变化 | **两套**都更新「技术栈红线」表 |
| 新增 mixin | **两套**都更新 SCSS mixin 章节的注入说明 + 基础设施文件清单 |

> **反向**：AGENTS.md 的纯文档优化（措辞调整、格式修正、引用更新）不需要联动代码变更——但如果优化是通用改动，两套 AGENTS.md 都要同步。

---

## 参考示例

两套脚手架的 AGENTS.md 是本规范的直接产物，可作为写作参考：

| 脚手架 | 文件 | 特点 |
|--------|------|------|
| Nuxt 4 SSR | `skills/opendesign-application/templates/nuxt/AGENTS.md` | 含 SSR 安全守卫、`<ClientOnly>`、自动导入、Plugin、数据获取 |
| Vite + Vue 3 SPA | `skills/opendesign-application/templates/vue-spa/AGENTS.md` | 无 SSR 守卫，含显式 import、useStorage |
