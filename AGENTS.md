# AGENTS.md

本文件提供对 AI Agents 在此仓库中工作的指导。

---

## 仓库用途

**OpenDesign Skills** 是为 AI 编码助手（opencode 等）生成和维护的知识库。它包含 OpenDesign 生态（Vue 3 组件库、CLI 构建工具、设计令牌、Pixso 设计协作）的完整参考文档，用于：

1. 帮助开发者使用 OpenDesign 组件库搭建 Vue 页面
2. 帮助开发者配置和使用构建工具
3. 支持通过 **Pixso MCP** 从设计稿自动识别组件并生成代码
4. 支持在 Pixso 中按 OpenDesign 规范生产设计稿（Symbol 实例化、Token 应用、栅格规范）

## 仓库结构

```
.
├── README.md                      ← 总入口，包含所有 Skill 的索引和概览
├── LICENSE
├── AGENT.md                       ← 本文件，AI 编码助手工作指导（第一层：生产指导）
├── SKILL-GEN-GUIDE.md             ← 代码 Skill 生成详细流程（第一层：生产指导）
├── DESIGN-SKILL-GEN-GUIDE.md      ← 设计 Skill 生成详细流程（第一层：生产指导）
├── SKILL-REVIEW-GUIDE.md          ← 自评与进度管理（含代码 + 设计两类维度，第一层）
├── .gitignore                     ← 排除生成过程文件（*.review.md, *-status.md）
├── design-specs/
│   └── form-grid-spec.md          ← 设计规范文档（面向设计师）
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
    └── opendesign-design/         ← Pixso 设计稿生产 Skill（设计侧，21 组件）
        ├── SKILL.md               ← 工作流 + 图标处理规范 + componentKey 速查（第二层）
        └── references/
            ├── components/        ← 21 个组件设计规范（第三层）
            │   └── {name}.md
            ├── component-keys.md  ← 536 个 UI 组件变体 componentKey 索引
            └── icon-keys.md       ← 187 个图标 componentKey 索引
```

> `skills/` 下采用**平铺结构**（每个组件/命令一个 `.md` 文件），适合直接链接和 RAG 按文件检索。若未来需要为单个组件添加多个文件（如 `.detail.md`），再按需引入文件夹结构。

## 内容分层原则

仓库中的内容按受众和用途分为三层，写入任何内容前应先判断它属于哪一层：

| 层级 | 名称 | 受众 | 典型文件 |
|------|------|------|---------|
| **第一层** | 生产指导 | AI 编码助手（写作者） | `AGENT.md`、`SKILL-GEN-GUIDE.md`、`SKILL-REVIEW-GUIDE.md`、`*.review.md`、`_skill-gen-status.md` |
| **第二层** | 共享约定 | Skill 调用者（跨 Skill 公共上下文） | `skills/*/SKILL.md` |
| **第三层** | Skill 本体 | Skill 调用者（AI 助手 / 开发者） | `skills/*/references/{name}.md` |

**判断标准：这段内容是否需要随 Skill 一起分发给使用者？**

- **是** → 放入 Skill 本体（第三层）或跨 Skill 共享约定（第二层）
- **否，只在生成时有用** → 放入第一层文件


## 操作指南索引

| 任务 | 参考文件 |
|------|---------|
| 生成/更新组件或脚本 Skill（代码侧） | [`SKILL-GEN-GUIDE.md`](SKILL-GEN-GUIDE.md) |
| 生成/更新组件设计规范 Skill（设计侧） | [`DESIGN-SKILL-GEN-GUIDE.md`](DESIGN-SKILL-GEN-GUIDE.md) |
| 完成 Skill 后的自评与进度更新（代码 + 设计） | [`SKILL-REVIEW-GUIDE.md`](SKILL-REVIEW-GUIDE.md) |
| 断点定义、Slot 约定、CSS 变量规则 | [`SKILL-GEN-GUIDE.md`](SKILL-GEN-GUIDE.md) |
| Pixso MCP 调用顺序、图标处理规范、两阶段生成 | [`skills/opendesign-design/SKILL.md`](skills/opendesign-design/SKILL.md) |

## 全局约定（详见 SKILL-GEN-GUIDE.md）

生成 Skill 时必须遵守以下规则。完整定义见 [`SKILL-GEN-GUIDE.md`](SKILL-GEN-GUIDE.md) 末尾「全局约定」章节：

- **组件命名**：所有组件以 `O` 前缀命名（OButton、OInput 等）
- **响应式断点**：两套体系（opendesign isPhonePad / openEuler Portal screen.scss）
- **Slot 约定**：未传入时不渲染；外层 slot 使用时内部子 slot 全失效
- **触控 vs 指针**：通过 `isTouchDevice` 区分，影响 hover 交互
- **CSS 变量覆盖**：无需 `:deep`，直接在样式中覆盖
- **文件组织**：平铺结构（每组件/命令一个 `.md`），reference 文件头部包含返回链接（格式见 SKILL-GEN-GUIDE.md）

## 常见场景

### 场景 1：需要生成某个新组件的 Skill

1. 指定组件名（如 "Dialog"）
2. 读取 `SKILL-GEN-GUIDE.md`，按 7 步流程执行
3. 生成 Skill 文件到 `skills/opendesign-components/references/dialog.md`
4. 按 `SKILL-REVIEW-GUIDE.md` 完成自评，生成 `dialog.review.md`
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

详细写作规范见 `SKILL-GEN-GUIDE.md` 的「Pixso MCP 协同指南」章节。

### 场景 4：生成或更新组件设计 Spec（设计侧 Skill）

1. 指定组件名（如 "Button"）
2. 读取 [`DESIGN-SKILL-GEN-GUIDE.md`](DESIGN-SKILL-GEN-GUIDE.md)，按其中的 Pixso MCP 调用顺序提取设计稿信息
3. 通过 WebFetch 拉取最新的栅格 / token 上游 JSON（不要 bundle 到本地）
4. 生成 Skill 文件到 `skills/opendesign-design/references/components/{name}.md`
5. 按 [`SKILL-REVIEW-GUIDE.md`](SKILL-REVIEW-GUIDE.md) 的设计侧维度自评，写入 `{name}.review.md`
6. 更新 `skills/opendesign-design/references/components/_skill-gen-status.md`

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

## 项目上下文

- **OpenDesign 组件库**：`@opensig/opendesign`，46 个 Vue 3 UI 组件
- **OpenDesign 脚本工具**：`@opensig/open-scripts`，5 个 CLI 命令
- **设计令牌**：`@opensig/opendesign-token`，6 套主题的 CSS 变量体系
- **Pixso 设计协作**：21 个组件的 Pixso 设计规范、536 个 componentKey 变体、187 个图标
- **前端工具库**：openEuler Portal 项目的通用 composables / mixins / utils
- **发布平台**：skills.sh，供其他开发者安装这些 Skill

## 与其他仓库的关联

当修改或补充组件 Skill 时，通常需要跨仓库操作：

1. **组件源码**：@opensig/opendesign 的 `packages/components/{name}/`
2. **docs 子包**（Playwright 快照）：`packages/docs/__snapshots__/{name}/`
3. **令牌相关**：如有涉及样式变量，参考 @opensig/opendesign-token
4. **脚本工具**：@opensig/open-scripts，用于 `gen:icon` 等命令

---

**最后更新**：2026-05-27
