---
name: template-guide
description: OpenDesign 脚手架模板维护指南。当需要修改 `skills/opendesign-application/templates/` 下的任何内容（AGENTS.md、配置文件、组件、store、mixin、样式等）时，使用本 skill。核心原则：修改模板时必须判断改动是跨模板通用还是平台特异——通用改动同步到所有模板（各自适配特异机制），特异改动只影响对应模板。
---

# Template Guide

本 skill 指导如何维护 `skills/opendesign-application/templates/` 下的两套脚手架模板——**任何修改都必须先判断该改动是跨模板通用还是平台特异**。

与 `skill-gen-guide`（Skill 生成）和 `changelog-guide`（变更记录）并列——三者同属第一层（生产指导），面向在本仓库中工作的 AI 编码工具。

## 跨模板同步原则

修改 `templates/` 下的任何文件时，**必须先判断该改动属于哪一类**：

| 改动类型 | 定义 | 操作 |
|---------|------|------|
| **跨模板通用** | 两套模板都需要该功能/修复/调整 | **必须同步到所有模板**，各自适配特异机制 |
| **平台特异** | 只影响某一模板（如 Nuxt SSR 安全守卫） | 只改对应模板，不影响其他 |

> 通用改动的"各自适配"：同一功能在 Nuxt 和 SPA 中的**实现方式不同**（如持久化 Nuxt 用 `useCookie`、SPA 用 `useStorage`），但**功能意图相同**。改动时先确认意图，再按各模板的特异机制分别实现。

| 关心什么 | 去读哪份 reference |
|---|---|
| 跨模板同步的完整判定规则与流程 | [`references/template-sync.md`](references/template-sync.md) |
| 脚手架模板的 **AGENTS.md** 编写与更新 | [`references/template-agents.md`](references/template-agents.md) |
| 脚手架模板的 **代码与基础设施文件** 维护 | [`references/template-code.md`](references/template-code.md) |

三份 reference 的关系：**template-sync 是总纲**（先读），template-agents 和 template-code 是分域细则（按改动对象选读）。

## 何时触发

- **任何对 `templates/` 目录下文件的修改**——无论改 AGENTS.md、配置文件、组件代码、store、mixin 还是样式
- 用户问"这个改动 Nuxt 和 SPA 都要改吗""怎么同步两个模板"
- 用户问"脚手架 AGENTS.md 能不能引用相对路径""和 skill references 重复了怎么办"
- 用户要切换社区主题，需要知道所有同步修改点
- 用户要新增基础设施组件 / mixin / store，需要知道两套模板各自的适配方式
- 用户要新增一套脚手架模板（如 React 版）

## 与 AGENTS.md 的关系

本 skill 是仓库根 `AGENTS.md`「场景 6：编写或更新脚手架」章节的技能化封装。AGENTS.md 仍保留场景索引（指向本 skill），具体规范全部移入本 skill 的 references。

## 与 opendesign-application skill 的关系

本 skill 是**第一层（生产指导）**——告诉 AI 如何维护脚手架。opendesign-application 是**第二层 + 第三层（共享约定 + Skill 本体）**——告诉脚手架使用者如何集成 OpenDesign。两者受众不同：

| 本 skill（template-guide） | opendesign-application |
|---|---|
| 面向：在本仓库中维护脚手架的 AI | 面向：使用脚手架的 AI / 开发者 |
| 关心：模板代码怎么改、AGENTS.md 怎么写、改动是否跨模板同步 | 关心：主题系统怎么集成、样式怎么用 |
| 不重复 skill references 的完整内容 | 不关心模板维护流程 |

## 变更记录

本 skill 属于第一层（生产指导），变更不记入根 `CHANGELOG.md`——其受众是 AI 编码工具（写作者），而非 Skill 使用者，变更不影响已交付产物。
