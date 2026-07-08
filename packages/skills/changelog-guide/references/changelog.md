> ← [Changelog Guide](../SKILL.md) · [README](../../../README.md)

# 变更记录维护规范

本仓库通过 **CHANGELOG** 向 skill 使用者传达"最近变了什么、是否需要更新已安装的 skill"。变更记录属于**第二层（共享约定）**，必须随 skill 一起提交、分发。

---

## 记录范围

CHANGELOG 只记录 `skills/` 目录下**对外分发的 Skill**（第二层共享约定 + 第三层 Skill 本体）的变更。`packages/skills/` 下的内部 Skill（第一层：生产指导）变更**不记入 CHANGELOG**。

**原因**：第一层 Skill 的受众是 AI 编码工具（写作者），而非 Skill 使用者；它们的变更不会让已交付的产物失效或违规，使用者无需据此判断是否需要重新安装——这正是 CHANGELOG 的核心目的。

**判断方法**：该 Skill 的变更是否会让已安装它的使用者需要重新安装或复核产物？只有**已提交过、成为过已交付产物**的文件变化才记入——从未进入仓库历史的文件（如 git 状态 `AD`：Added then Deleted）不存在"旧版产物"，使用者无从据此判断。

| 判断 | 例子 | 记入 CHANGELOG？ |
|------|------|------|
| 是 | `skills/opendesign-components/references/button.md` 新增了 prop 说明 | ✅ 记入 |
| 是 | `skills/opendesign-tokens/references/tokens-light.md` 变量名改动 | ✅ 记入 |
| 否 | `packages/skills/skill-gen-guide/` 优化了生成流程指导 | ❌ 不记入 |
| 否 | `packages/skills/changelog-guide/` 调整了条目写法原则 | ❌ 不记入 |
| 否 | 根 `AGENTS.md` 补充了常见问答 | ❌ 不记入 |
| 否 | git 状态为 `AD`（Added then Deleted）的文件——从未提交过，不属于已交付产物 | ❌ 不记入 |

---

## 文件结构

| 文件 | 位置 | 作用 |
|------|------|------|
| `CHANGELOG.md` | 仓库根目录 | **总览**：所有 skill 的变更按日期汇总，使用者一眼判断是否需要重新安装 |
| `last_update` 字段 | 每个 `skills/*/SKILL.md` 的 frontmatter | **快速锚点**：该 skill 最近一次更新日期，与根 CHANGELOG 中对应条目日期一致 |

---

## `last_update` 字段

每个 `skills/` 目录下对外分发的 `SKILL.md` 的 YAML frontmatter 必须包含 `last_update` 字段（`packages/skills/` 下的内部 Skill 不需要此字段）：

```yaml
---
name: opendesign-components
description: ...
last_update: 2026-06-29
---
```

- 取值：ISO 日期 `YYYY-MM-DD`
- 语义：该 skill 内容的**最近一次实质性变更**日期（不是字段本身的修改日期）
- 与 CHANGELOG 对应：每次更新该 skill 后，同步修改此字段，并在根 `CHANGELOG.md` 顶部新增条目

---

## CHANGELOG 条目格式

采用 [Keep a Changelog](https://keepachangelog.com/) 风格，**以日期而非版本号作为锚点**（本仓库通过 git 分发，不打 tag）。**条目按日期倒序排列，最新变更置顶。** 分类按 skill 场景适配：

| 分类 | 含义 |
|------|------|
| 新增 | 新增的组件 / 命令 / 变体 / token / 规范 |
| 更新 | 已有内容的语义变化（最需让使用者感知）|
| 修正 | 错误引用、过时描述、与源码不符的修正 |
| 移除 | 删除的组件 / 选项 / 约束 |
| ⚠️ 破坏性 | 会让按旧版 skill 已生成的产物（代码 / 设计稿）失效或违规，需使用者复核（最高优先级，单列）|

> **⚠️ 破坏性的判定**
>
> skill 是知识库而非可运行代码，"破坏性"不看 skill 文件改了多少，而看**按旧版 skill 已交付的产物是否还站得住**。典型破坏性变更：
> - **标识符改名**：变量名（`color-x` → `--o-color-x`）、componentKey、断点名等变化，旧产物引用失效
> - **硬约束变化**：字号 / 间距 / 圆角白名单、栅格规则、`:deep` 禁令等"必须遵守"的规则变化，旧产物违规
> - **组件 API 变化**：prop 可选值 / 必填性 / 默认值改变，或 prop / slot 被移除，旧产物生成的组件用法失效
> - **组件选用规则变化**：某场景从"用 A 组件"改为"用 B 组件"，旧产物的选型不再合规
>
> 反之，新增组件、补充示例、修正错误引用、文档结构调整等只影响未来生成、不让已交付产物失效的变更，不属于破坏性。

条目写法面向"使用者语义"，**不照搬 commit message**——项目参与人员的 commit message 质量参差不齐，生成条目时必须**查看实际 diff、基于真实变更重新提炼**，commit message 仅作参考线索：

```markdown
## 2026-06-29

### 更新
- **OMenu**：补充 OSubMenu 的 `disabled` 处理策略——子项 disabled 时父项不可选，之前文档未说明。

### 修正
- 清理对不存在组件的误引用，按"融合而非补丁"原则重写相关章节。

### ⚠️ 砯坏性
- （示例）`hard-constraints/skill.md` 字号白名单更新：14px 行高从 22px 改为 20px。按旧规则生成的设计稿需复核。
```

> 短 commit hash 可选——条目语义已基于 diff 重新提炼，不必照搬 commit message 原文。

---

## 维护流程

变更记录的维护**挂接到现有自评流程**，不另起一项：

1. 完成 Skill 修改后，按 `skill-gen-guide → skill-review` 做自评
2. 把自评中的"变更要点"摘抄到根 `CHANGELOG.md` 顶部对应日期下
3. 同步更新该 skill `SKILL.md` 的 `last_update` 字段为同一天

---

## 回答后的强制提醒

**每次完成对 Skill 内容的修改后，AI 必须在回答末尾主动提醒用户：**

> ✅ 本次修改已完成。是否需要我同步更新 `CHANGELOG.md` 与相关 `SKILL.md` 的 `last_update` 字段？

即便本次修改属于纯重构、格式调整、typo 修复，也应在末尾提醒——由用户决定是否记入变更记录。
