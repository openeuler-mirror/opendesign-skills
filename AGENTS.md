# AGENTS.md

本文件提供对 AI Agents 在此仓库中工作的指导。

---

## 仓库用途

**OpenDesign Skills** 是为 AI 编码工具（opencode 等）生成和维护的知识库。它包含 OpenDesign 生态（Vue 3 组件库、CLI 构建工具、设计令牌、Pixso 设计协作）的完整参考文档，用于：

1. 帮助开发者使用 OpenDesign 组件库搭建 Vue 页面
2. 帮助开发者配置和使用构建工具
3. 支持通过 **Pixso MCP** 从设计稿自动识别组件并生成代码
4. 支持在 Pixso 中按 OpenDesign 规范生产设计稿（Symbol 实例化、Token 应用、栅格规范）

## 仓库结构

```
.
├── README.md                      ← 总入口，包含所有 Skill 的索引和概览
├── CHANGELOG.md                   ← 变更记录总览（第二层：共享约定）
├── LICENSE
├── AGENTS.md                      ← 本文件，AI 编码工具工作指导（第一层：生产指导）
├── package.json                   ← pnpm 工作流：skills:install / update / sync-agents + git hooks
├── skills-lock.json               ← 外部 skill（vue / nuxt / pinia 等 15 个）来源与哈希锁定
├── .gitignore                     ← 排除生成过程文件 + .agents/skills、.claude/skills、node_modules
├── .agents/                       ← agent 源目录（由 sync-agents 生成；存放外部下载 + 项目注入的 skill）
│   └── skills/                    ← 各子目录符号链接到 packages/skills/* 与 skills/*
├── .claude/                       ← Claude Code 读取的目录（.claude/skills → .agents/skills）
│   └── skills/                    ← 符号链接，指向 .agents/skills
├── packages/
│   ├── scripts/
│   │   └── sync-agents.js         ← 同步 .agents / .claude 的脚本（符号链接管理）
│   └── skills/
│       └── skill-gen-guide/       ← Skill 生成与自评指南（内部 skill）
│           ├── SKILL.md           ← 索引 + 场景路由
│           └── references/
│               ├── code-skill-gen.md    ← 代码 Skill 生成详细流程
│               ├── design-skill-gen.md  ← 设计 Skill 生成详细流程
│               └── skill-review.md      ← 自评与进度管理
└── skills/
    ├── opendesign-components/     ← 46 个 Vue 3 UI 组件的 Skill（代码侧）
    │   ├── SKILL.md               ← 组件 Skill 索引与使用指南（第二层）
    │   └── references/
    │       ├── {component}.md     ← 各组件详细文档（第三层：Skill 本体）
    │       ├── {component}.review.md  ← 自评报告（仅开发期间，gitignore）
    │       └── _skill-gen-status.md   ← 进度追踪（仅开发期间，gitignore）
    ├── opendesign-scripts/        ← 5 个 CLI 命令的 Skill
    │   ├── SKILL.md
    │   └── references/
    │       ├── {command}.md
    │       └── {command}.review.md
    ├── opendesign-tokens/         ← 设计令牌参考
    │   ├── SKILL.md
    │   └── references/
    │       ├── tokens.md
    │       └── tokens-{theme}.md
    ├── opendesign-design/         ← Pixso 设计稿生产 Skill（设计侧，21 组件）
    │   ├── SKILL.md               ← 工作流 + 图标处理规范 + componentKey 速查（第二层）
    │   └── references/
    │       ├── components/        ← 21 个组件设计规范（第三层）
    │       │   └── {name}.md
    │       ├── component-keys.md  ← 536 个 UI 组件变体 componentKey 索引
    │       └── icon-keys.md       ← 187 个图标 componentKey 索引
    └── opendesign-codegen/        ← 代码直出 Skill（设计师侧，从设计意图直出合规 Vue+OpenDesign 代码）
        ├── SKILL.md               ← 四大约束 + 硬规则 + 工作流（第二层）
        └── references/
            ├── starter-page.vue        ← 合规 SFC 起手模板（真实 O 组件 + token + 响应式）
            ├── component-cheatsheet.md ← 设计意图 → OpenDesign 组件选用速查
            ├── engineering-rules.md    ← 工程落地约束
            ├── checklist.md            ← 生成后四维度自检清单
            └── examples/               ← feature-section.vue / list-filter-page.vue 示例
```

> `skills/` 下采用**平铺结构**（每个组件/命令一个 `.md` 文件），适合直接链接和 RAG 按文件检索。若未来需要为单个组件添加多个文件（如 `.detail.md`），再按需引入文件夹结构。

## 内容分层原则

仓库中的内容按受众和用途分为三层，写入任何内容前应先判断它属于哪一层：

| 层级 | 名称 | 受众 | 典型文件 |
|------|------|------|---------|
| **第一层** | 生产指导 | AI 编码工具（写作者） | `AGENTS.md`、`packages/skills/skill-gen-guide/`、`*.review.md`、`_skill-gen-status.md` |
| **第二层** | 共享约定 | Skill 调用者（跨 Skill 公共上下文） | `skills/*/SKILL.md`（含 `last_update` 字段）、`CHANGELOG.md` |
| **第三层** | Skill 本体 | Skill 调用者（AI 工具 / 开发者） | `skills/*/references/{name}.md` |

**判断标准：这段内容是否需要随 Skill 一起分发给使用者？**

- **是** → 放入 Skill 本体（第三层）或跨 Skill 共享约定（第二层）
- **否，只在生成时有用** → 放入第一层文件


## Agent 目录同步

本仓库通过 `packages/scripts/sync-agents.js` 把项目自编 skill 与外部下载 skill 统一注入到各 AI coding agent 的读取目录。**`.agents/` 与 `.claude/` 下的 `skills/` 子目录由脚本生成，不要手动编辑、不要手动提交**（已被 `.gitignore` 排除）。

### 同步内容与优先级

`sync-agents` 当前同步一个子目录 `skills`，其来源按**优先级降序**合并：

| 优先级 | 源目录 | 内容 | 同名冲突处理 |
|---|---|---|---|
| 1（高） | `packages/skills/` | 项目自编 skill（如 `skill-gen-guide`） | 以此为准 |
| 2（补充） | `skills/` | 对外分发的 OpenDesign skill（`opendesign-components` 等） | 仅注入上层未出现的子目录 |

外部下载的 skill（由 `pnpm skills:install` 安装，见 `skills-lock.json`）也会落入 `.agents/skills/`，与上述项目源合并。

### 目录与符号链接关系

```
.agents/skills/{name}        ← 真实存放点（外部下载 + 项目注入汇聚于此）
.claude/skills               ← 符号链接，指向 .agents/skills
.claude/CLAUDE.md            ← 符号链接，指向根 AGENTS.md
```

- `.agents/` 是**源目录**：外部 skill 下载到这里，项目自编 skill 通过符号链接注入这里
- `.claude/` 是**消费目录**：Claude Code 只读这里；其下子目录与文件全部是指向 `.agents/` 或根目录的符号链接
- 其他 AI coding agent（opencode 等）按相同模式接入，只需把自己的读取目录链接到 `.agents/`

### 自动触发时机

`package.json` 通过 `simple-git-hooks` 注册了两个钩子，**无需手动执行**：

| 钩子 | 触发命令 | 何时运行 |
|---|---|---|
| `post-merge` | `pnpm sync-agents` | `git pull` / `git merge` 合并完成后 |
| `post-checkout` | `pnpm sync-agents` | `git checkout` / `git switch` 切换分支后 |

因此 clone 仓库并 `pnpm install` 后，首次 `git pull` 或切换分支即会自动重建 `.agents/` 与 `.claude/`。手动执行用 `pnpm sync-agents`。

### 外部 skill 锁定

`skills-lock.json` 锁定从 GitHub 安装的 15 个外部 skill（来源：`antfu/skills`、`anthropics/skills`、`vuejs-ai/skills`），包含 `source` / `sourceType` / `skillPath` / `computedHash` 四个字段。新增或升级外部 skill 用：

```bash
pnpm skills:install    # 按 skills-lock.json 安装到 .agents/skills/
pnpm skills:update     # 拉取最新版并更新 lock 文件
```

> 外部 skill 与项目自编 skill 同名时，**项目自编优先**（见上方优先级表）。

## 操作指南索引

| 任务 | 参考文件 |
|------|---------|
| 生成/更新组件或脚本 Skill（代码侧） | [`skill-gen-guide/references/code-skill-gen.md`](packages/skills/skill-gen-guide/references/code-skill-gen.md) |
| 生成/更新组件设计规范 Skill（设计侧） | [`skill-gen-guide/references/design-skill-gen.md`](packages/skills/skill-gen-guide/references/design-skill-gen.md) |
| 完成 Skill 后的自评与进度更新（代码 + 设计） | [`skill-gen-guide/references/skill-review.md`](packages/skills/skill-gen-guide/references/skill-review.md) |
| 断点定义、Slot 约定、CSS 变量规则 | [`skill-gen-guide/references/code-skill-gen.md`](packages/skills/skill-gen-guide/references/code-skill-gen.md) |
| Pixso MCP 调用顺序、图标处理规范、两阶段生成 | [`skills/opendesign-design/SKILL.md`](skills/opendesign-design/SKILL.md) |
| 变更记录维护（CHANGELOG + `last_update`） | 本文件「[变更记录规范](#变更记录规范changelog)」章节 |
| Agent 目录同步、外部 skill 安装 | 本文件「[Agent 目录同步](#agent-目录同步)」章节 |

## 全局约定（详见 skill-gen-guide）

生成 Skill 时必须遵守以下规则。完整定义见 [`skill-gen-guide/references/code-skill-gen.md`](packages/skills/skill-gen-guide/references/code-skill-gen.md) 末尾「全局约定」章节：

- **组件命名**：所有组件以 `O` 前缀命名（OButton、OInput 等）
- **响应式断点**：两套体系（opendesign isPhonePad / openEuler Portal screen.scss）
- **Slot 约定**：未传入时不渲染；外层 slot 使用时内部子 slot 全失效
- **触控 vs 指针**：通过 `isTouchDevice` 区分，影响 hover 交互
- **CSS 变量覆盖**：无需 `:deep`，直接在样式中覆盖
- **文件组织**：平铺结构（每组件/命令一个 `.md`），reference 文件头部包含返回链接（格式见 `skill-gen-guide`）

## 内容更新原则：融合而非补丁

修正或更新 Skill 内容时，必须采用**融合**方式——把正确信息自然地融入现有描述，而不是用**补丁**式说明生硬地标注差异。统一标准是：**更新后的文档应当像从未出过错一样自然，而不是带着“此处曾有过错”的补丁痕迹。**

### 核心规则

- ❌ **禁止补丁式说明**：不要写“OpenDesign 无独立 X 组件，用 Y 实现”这类注脚。这会把一个**不存在的概念**引入文档——使用者本来不知道有 X，你一提反而增加了认知负担和犯错可能。
- ✅ **采用融合方式**：直接删除对不存在/错误对象的引用，让文档只描述**真实存在**的事物。不提，就不会犯错。

### 适用范围

适用于所有内容更新场景：修正错误引用、更新过时内容、补充缺失信息。凡是需要改动已有 Skill 文本时，都应让结果“自然融入”而非“打补丁”。

## 变更记录规范（CHANGELOG）

本仓库通过 **CHANGELOG** 向 skill 使用者传达“最近变了什么、是否需要更新已安装的 skill”。变更记录属于**第二层（共享约定）**，必须随 skill 一起提交、分发。

### 文件结构

| 文件 | 位置 | 作用 |
|------|------|------|
| `CHANGELOG.md` | 仓库根目录 | **总览**：所有 skill 的变更按日期汇总，使用者一眼判断是否需要重新安装 |
| `last_update` 字段 | 每个 `skills/*/SKILL.md` 的 frontmatter | **快速锚点**：该 skill 最近一次更新日期，与根 CHANGELOG 中对应条目日期一致 |

### `last_update` 字段

每个对外暴露的 `skills/*/SKILL.md` 的 YAML frontmatter 必须包含 `last_update` 字段：

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

### CHANGELOG 条目格式

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
> skill 是知识库而非可运行代码，“破坏性”不看 skill 文件改了多少，而看**按旧版 skill 已交付的产物是否还站得住**。典型破坏性变更：
> - **标识符改名**：变量名（`color-x` → `--o-color-x`）、componentKey、断点名等变化，旧产物引用失效
> - **硬约束变化**：字号 / 间距 / 圆角白名单、栅格规则、`:deep` 禁令等“必须遵守”的规则变化，旧产物违规
> - **组件 API 变化**：prop 可选值 / 必填性 / 默认值改变，或 prop / slot 被移除，旧产物生成的组件用法失效
> - **组件选用规则变化**：某场景从“用 A 组件”改为“用 B 组件”，旧产物的选型不再合规
>
> 反之，新增组件、补充示例、修正错误引用、文档结构调整等只影响未来生成、不让已交付产物失效的变更，不属于破坏性。

条目写法面向“使用者语义”，**不照搬 commit message**——项目参与人员的 commit message 质量参差不齐，生成条目时必须**查看实际 diff、基于真实变更重新提炼**，commit message 仅作参考线索：

```markdown
## 2026-06-29

### 更新
- **OMenu**：补充 OSubMenu 的 `disabled` 处理策略——子项 disabled 时父项不可选，之前文档未说明。

### 修正
- 清理对不存在组件的误引用，按“融合而非补丁”原则重写相关章节。

### ⚠️ 破坏性
- （示例）`hard-constraints/skill.md` 字号白名单更新：14px 行高从 22px 改为 20px。按旧规则生成的设计稿需复核。
```

> 短 commit hash 可选——条目语义已基于 diff 重新提炼，不必照搬 commit message 原文。

### 维护流程

变更记录的维护**挂接到现有自评流程**，不另起一项：

1. 完成 Skill 修改后，按 [`skill-gen-guide/references/skill-review.md`](packages/skills/skill-gen-guide/references/skill-review.md) 做自评
2. 把自评中的“变更要点”摘抄到根 `CHANGELOG.md` 顶部对应日期下
3. 同步更新该 skill `SKILL.md` 的 `last_update` 字段为同一天

### 回答后的强制提醒

**每次完成对 Skill 内容的修改后，AI 必须在回答末尾主动提醒用户：**

> ✅ 本次修改已完成。是否需要我同步更新 `CHANGELOG.md` 与相关 `SKILL.md` 的 `last_update` 字段？

即便本次修改属于纯重构、格式调整、typo 修复，也应在末尾提醒——由用户决定是否记入变更记录。

## 常见场景

### 场景 1：需要生成某个新组件的 Skill

1. 指定组件名（如 "Dialog"）
2. 读取 [`skill-gen-guide`](packages/skills/skill-gen-guide/SKILL.md) 的代码侧 reference，按 7 步流程执行
3. 生成 Skill 文件到 `skills/opendesign-components/references/dialog.md`
4. 按 [`skill-gen-guide/references/skill-review.md`](packages/skills/skill-gen-guide/references/skill-review.md) 完成自评，生成 `dialog.review.md`
5. 更新 `_skill-gen-status.md`

### 场景 2：发现组件源码有缺陷

1. 先修正源码（如补充 JSDoc 或新增 case 文件）
2. 提交 commit（记录修正原因）
3. 再生成或更新 Skill
4. 在 `{component}.review.md` 中详细记录修正清单

### 场景 3：支持 Pixso MCP 协同（代码侧 Skill）

1. 确保布局结构图的准确性（与 Playwright 快照对齐）
2. 在设计理解卡中使用设计工具术语（"自动布局""固定宽度"等）
3. 标注各 slot/prop 在视觉上的位置和尺寸规律
4. 响应式行为表清晰地展示多断点变化

详细写作规范见 [`skill-gen-guide/references/code-skill-gen.md`](packages/skills/skill-gen-guide/references/code-skill-gen.md) 的「Pixso MCP 协同指南」章节。

### 场景 4：生成或更新组件设计 Spec（设计侧 Skill）

1. 指定组件名（如 "Button"）
2. 读取 [`skill-gen-guide`](packages/skills/skill-gen-guide/SKILL.md) 的设计侧 reference，按其中的 Pixso MCP 调用顺序提取设计稿信息
3. 通过 WebFetch 拉取最新的栅格 / token 上游 JSON（不要 bundle 到本地）
4. 生成 Skill 文件到 `skills/opendesign-design/references/components/{name}.md`
5. 按 [`skill-gen-guide/references/skill-review.md`](packages/skills/skill-gen-guide/references/skill-review.md) 的设计侧维度自评，写入 `{name}.review.md`
6. 更新 `skills/opendesign-design/references/components/_skill-gen-status.md`

### 场景 5：`.agents/` 或 `.claude/` 缺失 / 未同步

clone 后或切换分支后，agent 读取不到 skill 时：

1. 确认已执行 `pnpm install`（首次必装，会注册 `simple-git-hooks`）
2. 手动跑一次 `pnpm sync-agents`，观察输出是否出现 `✅ 同步完成`
3. 检查 `.agents/skills/` 下是否出现期望的子目录；若缺失，确认 `packages/skills/` 与 `skills/` 下对应目录存在
4. 检查 `.claude/skills` 是否为指向 `.agents/skills` 的符号链接（Windows 下需开发者模式或管理员权限，否则符号链接可能创建失败）
5. 外部 skill 缺失：`pnpm skills:install` 按 `skills-lock.json` 重新安装

> **不要**手动在 `.agents/` 或 `.claude/` 下创建 / 编辑文件——这些目录由脚本生成，下次同步会覆盖。

## 常见问题

**Q: Skill 文件很长，怎么组织代码示例？**

A: 按场景组织，每个场景一段完整的 Vue 片段。示例需要能直接复制使用。

**Q: *.review.md 文件会被提交吗？**

A: 不会。`.gitignore` 中已排除 `*.review.md` 和 `*-status.md`，仅在本地开发期间保留。

**Q: 如何判断某个 prop 是否必填？**

A: 检查 `types.ts` 中的定义：
- 无默认值 + 非可选（非 `?`）= 必填
- 有默认值或可选（`?`） = 可选

**Q: 多个 Skill 在同一个文件中怎么处理？**

A: 如果有多个相关的 sub-component（如 OFormItem 是 OForm 的子组件），在主组件的 Skill 中作为独立小节输出，不单独创建文件。

**Q: `.agents/` 和 `.claude/` 下的文件能手动改吗？**

A: 不能。这两个目录下的 `skills/` 子目录由 `sync-agents` 生成（符号链接 + 外部下载），已被 `.gitignore` 排除、不提交。手动改动会在下次 `pnpm sync-agents` 或 `git pull` 后被覆盖。要改内容，改源目录（`packages/skills/` 或 `skills/`），再跑一次同步。

**Q: 怎么新增一个外部 skill？**

A: 编辑 `skills-lock.json`，新增一条 `skills` 字段，填入 `source`（GitHub 仓库 `owner/repo`）、`sourceType: "github"`、`skillPath`（仓库内 SKILL.md 相对路径）、`computedHash`（可留空，`pnpm skills:update` 会补全）。然后 `pnpm skills:install`。提交 `skills-lock.json` 时记得在 CHANGELOG 记一条「新增」。

**Q: sync-agents 报「符号链接创建失败」（Windows）怎么办？**

A: Windows 创建符号链接需满足以下任一条件：① 启用开发者模式（设置 → 隐私和安全性 → 开发者选项）；② 以管理员身份运行终端；③ 给 `pnpm.exe` 进程 `SeCreateSymbolicLinkPrivilege`。否则脚本会降级为复制目录，但 `.claude/skills` 的链接关系会失效，建议优先开启开发者模式。

## 项目上下文

- **OpenDesign 组件库**：`@opensig/opendesign`，46 个 Vue 3 UI 组件
- **OpenDesign 脚本工具**：`@opensig/open-scripts`，5 个 CLI 命令
- **设计令牌**：`@opensig/opendesign-token`，6 套主题的 CSS 变量体系
- **Pixso 设计协作**：21 个组件的 Pixso 设计规范、536 个 componentKey 变体、187 个图标
- **前端工具库**：openEuler Portal 项目的通用 composables / mixins / utils
- **发布平台**：skills.sh，供其他开发者安装这些 Skill
- **外部 skill 来源**：`antfu/skills`、`anthropics/skills`、`vuejs-ai/skills`（GitHub），由 `skills-lock.json` 锁定，`pnpm skills:install` 安装到 `.agents/skills/`

## 与其他仓库的关联

当修改或补充组件 Skill 时，通常需要跨仓库操作：

1. **组件源码**：@opensig/opendesign 的 `packages/components/{name}/`
2. **docs 子包**（Playwright 快照）：`packages/docs/__snapshots__/{name}/`
3. **令牌相关**：如有涉及样式变量，参考 @opensig/opendesign-token
4. **脚本工具**：@opensig/open-scripts，用于 `gen:icon` 等命令

---

**最后更新**：2026-07-06
