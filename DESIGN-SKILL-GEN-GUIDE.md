# DESIGN-SKILL-GEN-GUIDE.md

设计 Skill 生成的详细操作指南。适用场景：为新组件生成 Pixso 设计规范，或扩展设计模式 Skill 时按需查阅。

> 本指南只覆盖**如何生成 spec 文件**。**如何在 Pixso 中执行设计任务**（图标处理规范、两阶段生成策略、Token 对照表、componentKey 速查等运行时规则）见 [`skills/opendesign-design/SKILL.md`](skills/opendesign-design/SKILL.md)，本文件不重复。

---

## 核心工作流

设计 Skill 与代码 Skill 的本质差异：

| 项目 | 代码 Skill（SKILL-GEN-GUIDE） | 设计 Skill（本指南） |
|---|---|---|
| 信息来源 | `@opensig/opendesign` 源码 + Playwright 快照 | **Pixso MCP 工具** + atomgit token JSON |
| 输出物 | Vue 代码调用参考（Props/Events/Slots） | Pixso 设计规范（变体 / Token 映射 / 视觉规格） |
| 写入路径 | `skills/opendesign-{components,scripts}/references/{name}.md` | `skills/opendesign-design/references/components/{name}.md` |
| 数据真源 | 本地源码 | **远端 atomgit + Pixso 实时画布** |

### 1. 生成组件设计 Skill

当需要生成或更新某个组件的设计规范文件时：

**关键点**：
- Skill 文件写入 `skills/opendesign-design/references/components/{name}.md`
- 自评结论写入同目录的 `{name}.review.md`（被 `.gitignore` 排除）
- 进度文件 `skills/opendesign-design/references/components/_skill-gen-status.md`（被 `.gitignore` 排除）
- **不读取任何源码文件**；所有信息通过 Pixso MCP + WebFetch 远端 JSON 获取

#### Pixso MCP 工具调用顺序（9 步）

针对组件 `{Name}`，按以下顺序调用：

| 步骤 | 工具 | 目的 |
|------|------|------|
| 1 | `get_all_components` | 获取组件库完整列表，定位目标组件的 `componentKey` |
| 2 | `get_variants(itemId)` | 获取该组件的所有变体（如 size/type/state 维度） |
| 3 | `get_node_dsl(itemId)` | 获取组件的结构描述（布局方向、子层级、Auto Layout 参数） |
| 4 | `get_image(itemId)` | 获取组件的视觉预览图，用于多模态分析布局和间距 |
| 5 | `get_variable_sets` | 获取设计变量集列表 |
| 6 | `get_variables(variableSetId)` | 获取具体变量值（颜色、尺寸、间距等 Token） |
| 7 | `get_local_styles` | 获取文本样式、颜色样式、效果样式 |
| 8 | **WebFetch** openeuler-token.json | 核对全局 Token 定义（颜色/尺寸/间距/字体的变量名和实际值）。URL 见下文「数据资源」 |
| 9 | **WebFetch** grid-token.json | 核对栅格系统配置（列数、间距、边距），用于描述组件响应式行为。URL 见下文「数据资源」 |

**异常处理**：
- 组件不在 `get_all_components` 返回列表中 → 停止生成，向用户报告并确认组件名
- `get_variants` 返回为空 → 标注「单一形态，无变体维度」
- `get_image` 无法获取预览 → 仅基于 DSL 分析，在 review 文件中注明
- WebFetch 远端 token JSON 失败 → 仅使用 MCP 返回的变量数据，在 review 中注明「上游 Token 未覆盖」并附上失败的 URL

#### 解析流程（7 步）

**第一步：定位组件**
- 记录 `componentKey`（用于 `create_instance`）
- 记录组件所在的分组/页面层级
- 识别该组件下是否有子组件（如 Card/CardHeader）

**第二步：提取变体维度**
- 列出所有变体属性（如 `Size`、`Type`、`State`、`Theme`）
- 每个属性的可选值（如 `Size: S / M / L`）
- 默认变体组合
- 识别各变体的视觉差异（尺寸/颜色/结构）

**第三步：分析组件结构**
- 布局方向、内边距、子元素间距、子层级划分、Auto Layout 约束、圆角

**第四步：视觉分析**
- 空间关系、视觉层级、间距规律、对齐方式、交互状态呈现
- 多变体时对**每个主要变体**调用一次 `get_image`，对比分析

**第五步：提取 Token 映射**

调用 `get_variable_sets` + `get_variables(variableSetId)`，对照远端 openeuler-token.json，建立映射：

1. **颜色 Token**：以 atomgit 远端 token 为权威，MCP 数据为补充
2. **尺寸 Token**：宽高、padding、gap、border-radius 对应变量名
3. **字体 Token**：文字区域对应字体样式变量名
4. **效果 Token**：阴影、模糊等变量名

结合 `get_local_styles` 提取文本样式和颜色样式，说明哪些视觉属性通过样式库控制（而非变量直接绑定）。

**第六步：识别使用场景**
- 适用场景、不适用场景、常见组合

**第七步：反向识别分析**

回答「AI 在画布上看到什么样的图层结构时，应该认出这是该组件」：
1. **结构指纹**：特有的图层嵌套结构
2. **视觉特征**：尺寸比例、颜色搭配、间距规律
3. **易混淆组件**：视觉相近的其他组件及区分要点

---

### 2. 生成设计模式 Skill

当需要生成多组件组合规范时，写入 `skills/opendesign-design/references/design-patterns.md`。

**从两个方向归纳**：

**方向一：画布证据（自底向上）**
- 读取 Pixso 画布中已有的页面设计稿（`get_node_dsl` 分析页面级节点）
- 识别重复出现的组件组合
- 记录相对位置、间距规律、内容对应关系

**方向二：业务场景推演（自顶向下）**

结合行业常见页面类型 + 已生成的组件 Skill：
- **表单页**：搜索框 + 筛选器 + 表单控件 + 提交按钮
- **列表页**：搜索栏 + 筛选条件 + 数据表格/卡片列表 + 分页
- **详情页**：面包屑 + 标题区 + 信息卡 + 操作按钮组
- **Dashboard**：数据概览卡 + 图表区 + 最近动态列表
- **设置页**：侧边导航 + 内容区 + 分区表单

**推演约束**：每个组件的用法必须在对应 Skill 中有据可查；在「来源」中注明依据。

---

### 3. 更新已有 Spec

当 Pixso 组件库变更时，增量更新对应 `references/components/{name}.md`：
- 使用 Edit 工具增量改而非重写整个文件
- 重新跑一遍 9 步 MCP 调用，对比上次记录的规格差异
- 修改完成后更新 `_skill-gen-status.md` 的「最后更新」时间

---

## Skill 文件格式规范

### 组件设计 Skill（以 button.md 为例）

**导航链接**（所有 reference 文件头部）

```
> ← [组件索引](../../SKILL.md#组件索引) · [README](../../../../README.md)
```

> 注意路径深度：components/ 下的 spec 文件需 `../../` 到 SKILL.md，`../../../../` 到仓库 README（比 dev 侧多一层）。

**Part A：设计使用卡**

用设计师能看懂的语言描述，**不出现代码、组件 key 等技术术语**。包含：

- **组件概览**：一句话核心用途
- **适用场景**：✅ / ❌ 列表
- **变体说明**：按变体属性分组描述
- **布局结构**：自然语言描述空间结构（🧩 标识）
- **组合搭配**：与其他组件的常见搭配（🔗 标识）
- **设计稿识别指南**：结构指纹 / 视觉特征 / 易混淆组件（🔍 标识）
- **响应式行为**（如有）：参照远端 grid-token.json 的断点（📱 标识）

**Part B：规格速查参考**

- **变体索引表**：变体属性 / 可选值 / 默认值 / 视觉差异
- **布局规格**：内边距 / 间距 / 圆角 / 最小宽高 + 来源 Token
- **颜色 Token 映射**：视觉区域 / Token 名称 / 默认色值 / 说明
- **字体样式映射**：文字区域 / 样式名 / 字号 / 字重 / 行高
- **组件层级结构**：缩进树形图，标注约束类型（固定/填充/自适应）
- **Pixso 操作速查**：如何插入、切换变体、修改内容、应用样式、绑定变量
- **注意事项**：使用约束、常见误用、相近组件选择建议

### 设计模式 Skill

每个模式按以下结构追加到 `references/design-patterns.md`：

- **适用场景**：业务场景描述
- **组件组合结构**：缩进/层级关系
- **来源**：画布发现 vs 业务推演
- **布局要点**：间距/对齐规范
- **画布识别特征**：AI 识别图层特征
- **注意事项**：设计约束、常见错误

---

## 数据资源（运行时拉取）

设计变量、栅格、断点来自 atomgit 上游，生成 spec 时通过 WebFetch 实时获取：

| 用途 | URL |
|---|---|
| 栅格规范 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/grid-token.json` |
| 响应式断点 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/responsive-token.json` |
| openEuler 主题 Token | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/openeuler-token.json` |

> ⚠️ **不要 bundle 到本地**，不要假设本地存在 `tokens.json` / `grid.json`。每次生成 spec 都 WebFetch 一次最新版本，以保证与上游不漂移。

设计稿生产专用、无上游真源的数据（仍以 bundle 形式存在 skill 内）：
- [`skills/opendesign-design/references/component-keys.md`](skills/opendesign-design/references/component-keys.md) — 536 个 UI 组件变体 componentKey 索引
- [`skills/opendesign-design/references/icon-keys.md`](skills/opendesign-design/references/icon-keys.md) — 187 个图标 componentKey 索引

---

## 全局约定（生成时遵守）

设计 Skill 生成必须遵守以下规则：

- **组件命名**：所有组件以 `O` 前缀命名（OButton、OInput 等），与代码侧一致
- **itemId 格式**：`"数字:数字"`，如 `"123:456"`（从 Pixso URL `?item-id=1:2` 提取）
- **不读取源码**：所有信息来自 Pixso MCP + WebFetch 远端 JSON，不打开任何 `@opensig/*` 源码
- **图标处理 / 两阶段生成 / 跨文件库链接修复** 等运行时规则见 [`skills/opendesign-design/SKILL.md`](skills/opendesign-design/SKILL.md)（本文件不复述，避免内容漂移）
- **Token 名称权威性**：组件文档中所有色值、字号、间距必须匹配上游 Token 变量名（数据从远端 URL 拉取），禁止使用硬编码值
- **自评维度选用规则**：见 [`SKILL-REVIEW-GUIDE.md`](SKILL-REVIEW-GUIDE.md)（含设计侧专属维度）

---

## 节点 ID 获取方式

- 从 Pixso 画布 URL 提取：`?item-id=1:2` → itemId 为 `1:2`
- 使用 `get_all_components` 或 `get_local_styles` 返回结果中查找对应 key/id
- 若未提供 itemId，MCP 工具默认操作当前画布中已选中的节点

---

## 与代码侧 SKILL-GEN-GUIDE.md 的关系

两份指南互不替代：

| 你要生成什么 | 用哪份指南 |
|---|---|
| Vue 组件的代码调用参考（Props/Events/Slots） | [`SKILL-GEN-GUIDE.md`](SKILL-GEN-GUIDE.md) |
| CLI 命令的脚本 Skill | [`SKILL-GEN-GUIDE.md`](SKILL-GEN-GUIDE.md) |
| Pixso 中的组件设计规范（变体 / Token 映射 / 识别特征） | **本文件** |
| Pixso 中的设计模式（多组件组合规范） | **本文件** |

代码 Skill 写给开发者（产出 Vue 代码），设计 Skill 写给设计师 / Pixso AI（产出设计稿）。
