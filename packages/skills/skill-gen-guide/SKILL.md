---
name: skill-gen-guide
description: 生成、更新、自评 OpenDesign 生态的 Skill 文件（Vue 组件代码 Skill、CLI 脚本 Skill、设计 Token Skill、Pixso 设计规范 Skill、设计模式 Skill）。当用户要为新组件/脚本/Token/设计规范编写 Skill、更新已有 Skill、做 Skill 自评、追踪生成进度，或询问"如何生成 Skill""Skill 文件格式""自评怎么做""Pixso MCP 调用顺序""Playwright 快照怎么用""componentKey 怎么查""变体维度怎么提取""Token 包升级后 Skill 要改什么"时，使用本 skill。无论用户是否明确提到"Skill"这个词，只要涉及为 OpenDesign 生态产出/更新/评审 Skill 知识文件，都应使用本 skill。
---

# Skill Gen Guide

OpenDesign 生态的 Skill 是写给 AI 编码工具 / 设计师 / Pixso AI 消费的知识库文件。本 skill 把三条并列的生产指导融合为一处，按场景路由到对应 reference：

| 关心什么 | 去读哪份 reference |
|---|---|
| 写 / 更新 **代码侧** Skill（Vue 组件 Props/Events/Slots、CLI 脚本命令、设计 Token） | [`references/code-skill-gen.md`](references/code-skill-gen.md) |
| 写 / 更新 **设计侧** Skill（Pixso 组件设计规范、设计模式） | [`references/design-skill-gen.md`](references/design-skill-gen.md) |
| 完成 Skill 后的 **自评与进度管理** | [`references/skill-review.md`](references/skill-review.md) |

代码侧与设计侧是并列关系：一个写给开发者（产出 Vue 代码），一个写给设计师 / Pixso AI（产出设计稿）。自评是两者的公共下游——任意一类 Skill 完成后都要走自评流程。

## 何时触发

- 用户说"为 X 组件生成 Skill""更新某个 Skill""这个组件的 Skill 怎么写"
- 用户说"更新 Token Skill""token 包升级后 Skill 要改什么"
- 用户要做 Skill 自评、问"自评维度有哪些""进度文件怎么管"
- 用户要批量扫描组件库生成 Skill
- 用户提到 Playwright 快照、Pixso MCP 9 步调用、Token 映射、componentKey、变体维度、反向识别
- 用户问 Skill 文件的格式规范（Part A / Part B、布局结构图、响应式行为表）
- 用户要在 Skill 文件里标注版本、写源码修正清单、维护 `_skill-gen-status.md`

## 核心工作流速览

### 代码侧（component / script / token Skill）

**组件 Skill（7 步）**：确认源码版本 → 提取 Props → 提取 Events → 提取 Slots → 提取 Expose → 分析响应式差异 → 学习真实用法 → 视觉布局分析（Playwright 快照）。
**脚本 Skill（3 步）**：提取命令元信息 → 提取配置字段 → 收集真实示例。
**Token Skill（4 步）**：确认 token 包版本 → 提取 token 变量 → 识别破坏性变更 → 更新 Skill 文件。
输出到 `skills/opendesign-{components,scripts,tokens}/references/{name}.md`。

详见 [`references/code-skill-gen.md`](references/code-skill-gen.md)。

### 设计侧（Pixso spec Skill）

**9 步 Pixso MCP 调用**：`get_all_components` → `get_variants` → `get_node_dsl` → `get_image` → `get_variable_sets` → `get_variables` → `get_local_styles` → WebFetch `openeuler-token.json` → WebFetch `grid-token.json`。
输出到 `skills/opendesign-design/references/components/{name}.md`。

详见 [`references/design-skill-gen.md`](references/design-skill-gen.md)。

### 自评

15 个评价维度按 Skill 类型筛选（代码选 ≥6 项、设计选 ≥6 项），发现问题立即修正，自评结论写到 `{name}.review.md`（不入 skill 本体），最后更新 `_skill-gen-status.md`。

详见 [`references/skill-review.md`](references/skill-review.md)。

## 全局约定（生成时必须遵守）

各 reference 文件只记录**与以下约定不同的例外**，不重复说明：

- **组件命名**：所有组件以 `O` 前缀（OButton、OInput），从 `@opensig/opendesign` 统一导入
- **响应式断点**：opendesign 用 `isPhonePad` 体系（840 / 1200 / 1680px 三个阈值）；openEuler Portal 用 `screen.scss` 体系（phone/pad/laptop 等）
- **Slot 渲染**：未传入不渲染；外层 slot 使用时内部子 slot 全失效
- **触控 vs 指针**：通过 `isTouchDevice` 区分，影响 hover 交互
- **CSS 变量覆盖**：无需 `:deep`，直接在样式里覆盖
- **文件组织**：平铺结构，每组件 / 命令一个 `.md`；reference 头部含返回链接
- **Token 名称权威性**：色值 / 字号 / 间距必须匹配上游 Token 变量名（远端拉取，不 bundle 到本地）
- **不读源码**（仅设计侧）：所有信息来自 Pixso MCP + WebFetch 远端 JSON

完整定义见 [`references/code-skill-gen.md`](references/code-skill-gen.md) 末尾「全局约定」章节，设计侧的额外约束见 [`references/design-skill-gen.md`](references/design-skill-gen.md) 末尾「全局约定」章节。

## 与 AGENTS.md 的关系

本 skill 是仓库根 `AGENTS.md` 的「操作指南索引」中列出的三份生产指导文件的技能化封装：

| AGENTS.md 中的索引项 | 对应的 reference |
|---|---|
| `SKILL-GEN-GUIDE.md` | `references/code-skill-gen.md` |
| `DESIGN-SKILL-GEN-GUIDE.md` | `references/design-skill-gen.md` |
| `SKILL-REVIEW-GUIDE.md` | `references/skill-review.md` |

`AGENTS.md` 仍保留为项目根级指导（第一层：生产指导），本 skill 把三份指南提升为可被 AI 工具按需触发的知识单元（第三层：Skill 本体），方便分发与复用。两份文档语义对齐，修改时同步更新。

## 变更记录

本 skill 属于第一层（生产指导），变更不记入根 `CHANGELOG.md`——其受众是 AI 编码工具（写作者），而非 Skill 使用者，变更不影响已交付产物。
