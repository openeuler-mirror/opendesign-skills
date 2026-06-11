---
name: opendesign-design
description: OpenDesign Pixso 设计稿生产指南。当需要在 Pixso 中创建/编辑 UI 组件（按钮、输入框、卡片、导航等）、应用设计规范（栅格/颜色/字号/间距/圆角）、搭建页面框架、调用 Pixso 组件库（Symbol）或读取设计变量（Tokens）时使用此 skill。包含 PC/MB 双断点的变量映射硬约束（字号/行高/间距/栅格/图标尺寸的合法取值白名单），覆盖 23 个组件设计规范、536 个 componentKey 变体与 187 个图标 componentKey。本 skill 仅生产 Pixso 设计稿，不输出代码。
---

# Design Skill · Pixso 组件系统

> 🔴 **生成任何设计稿前，必读以下两份硬约束文档**：
> 1. [references/hard-constraints/skill.md](references/hard-constraints/skill.md) — **变量映射硬约束**：PC / MB 双断点下，字号 / 行高 / 间距 / 栅格 / 图标尺寸的合法取值白名单。所有几何数值必须严格选自该白名单，禁止四舍五入、推断或造数。
> 2. [references/hard-constraints/rules.md](references/hard-constraints/rules.md) — **组件组合规则**：按钮对齐 / 排列 / 间距、组件栅格挂靠、卡片间距、禁止组合黑名单及自动校验清单。
>
> 以上两份约束**最高优先级**，与下文 [#图标处理规范（核心约束）](#图标处理规范核心约束) 并列，缺一不可。

## 概述

基于 Pixso MCP 工具实现的可复用设计系统工作流，支持：
- 读取并应用栅格与设计变量（Tokens）
- 调用现有 Symbol 组件库
- 自动生成符合规范的可编辑设计稿

## 设计能力

- 栅格系统布局规范（数据来源见 [#数据资源](#数据资源)）
- 全局设计变量（Tokens）管理（数据来源见 [#数据资源](#数据资源)）
- Pixso Symbol 组件库维护与调用
- 组件化、规范化界面快速生成
- 统一视觉风格与交互逻辑

## 数据资源

栅格、响应式断点、设计变量等数据来自 atomgit 上游仓库。**使用时通过 WebFetch 实时拉取最新版本**，不要 bundle 到本地：

| 用途 | URL |
|---|---|
| 栅格规范 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/grid-token.json` |
| 响应式断点 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/responsive-token.json` |
| openEuler 主题 Token | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/openeuler-token.json` |

本 skill 内 bundled 的索引文件（设计稿生产专用，无上游真源）：

- [references/component-keys.md](references/component-keys.md) — 536 个 UI 组件变体的 componentKey 索引
- [references/icon-keys.md](references/icon-keys.md) — 187 个图标的 componentKey 索引

## 组件索引

每个组件的详细设计规范见 `references/components/{name}.md`，涵盖适用场景、变体说明、布局规格、颜色/字体 Token 映射、识别特征。

| 组件 | 说明 | 组件 | 说明 |
|------|------|------|------|
| [OAnchor](references/components/anchor.md) | 锚点 | [OMessage](references/components/message.md) | 全局消息 |
| [OBreadcrumb](references/components/breadcrumb.md) | 面包屑 | [ONavigation](references/components/navigation.md) | 导航 |
| [OButton](references/components/button.md) | 按钮 | [OPagination](references/components/pagination.md) | 分页 |
| [OCard](references/components/card.md) | 卡片 | [ORadio](references/components/radio.md) | 单选框 |
| [OCarousel](references/components/carousel.md) | 幻灯片指示器 | [OCheckbox](references/components/checkbox.md) | 复选框 |
| [ODivider](references/components/divider.md) | 分割线 | [OStep](references/components/step.md) | 步骤条 |
| [ODropdown](references/components/dropdown.md) | 下拉菜单 | [OScrollbar](references/components/scrollbar.md) | 滚动条 |
| [OInput](references/components/input.md) | 输入框 | [OTab](references/components/tab.md) | 标签页 |
| [OLink](references/components/link.md) | 链接 | [OTable](references/components/table.md) | 数据表格 |
| [OLoading](references/components/loading.md) | 加载 | [OTag](references/components/tag.md) | 标签 |
| [OMenu](references/components/menu.md) | 菜单 | [OToggle](references/components/toggle.md) | 切换按钮 |
| [OSelect](references/components/select.md) | 选择器 | | |

## 图标处理规范（核心约束）

> ⚠️ 本节规则优先级最高，所有生成步骤必须遵守。

### 图标存储机制

OpenEuler 设计系统中，图标以 `svgSha` 外部引用方式存储在 Pixso 服务器上（非内嵌 SVG 路径）。这意味着：

- 图标 SVG 数据**不存在于 DSL 中**，无法通过工具直接提取路径
- `code_to_design` 内嵌的任何 SVG 均为**通用占位符**，不属于设计系统图标
- `create_instance` 生成的组件实例**自带正确图标**，由 Pixso 在渲染时从服务器解析

### 图标库资源

OpenEuler 拥有独立图标库 Pixso 文件 `kbqInwBrCTGnM0MsPJDgvA`，包含 **187 个线性图标**（24×24px）。完整索引见 [references/icon-keys.md](references/icon-keys.md)。

| 分类 | 路径前缀 | 数量 |
|------|----------|------|
| 公共图标（线性） | `icon/01公共图标/线性/` | 185 |
| 开关 | `icon/开关/` | 2 |

### 图标使用规则

| 场景 | 方式 |
|------|------|
| 组件状态图标（Radio 圆形、Checkbox 方框、Switch 等） | **生成前必须先 `ls references/assets/<组件名>/`**；有 SVG → Read 后内联；无文件 → 才用 CSS，并注释说明 |
| 含图标的 UI 组件（导航、搜索、按钮、分页、下拉等） | **同上，生成前必须先 `ls references/assets/<组件名>/`**；有 SVG → Read 后内联；无文件 → 才用手写 SVG 路径 |
| 独立图标（自定义布局中的功能图标） | **同上，先检查 `references/assets/`**；有文件直接内联；无文件 → 查 [icon-keys.md](references/icon-keys.md) 手写线性 SVG |
| 纯布局结构（背景、容器、栅格、文字区块） | `code_to_design` |
| SVG 来源优先级（所有场景统一） | ① `references/assets/` 已有文件（Read 内联）→ ② 手写符合线性风格的 SVG 路径 → ③ CSS（兜底，需注释） |

**SVG 内嵌方式**：直接将 `<svg>` 标签写入 HTML，不使用 `<img src>`。图标颜色跟随设计系统 Token，默认使用 `currentColor` 继承父元素色值。

> `create_instance` 仍可用于需要 live Symbol 绑定或 Token 联动的特殊场景，但不再作为图标的强制路径。

---

## 执行工作流

### 第零步：读取硬约束文档（强制起手式，两份均须读取）

```
① 读取 references/hard-constraints/skill.md
   — 锁定当前目标设备（MB 或 PC）
   — 明确该设备下字号 / 行高 / 间距 / 栅格 / 图标尺寸的合法取值集合

② 读取 references/hard-constraints/rules.md
   — 明确按钮对齐 / 排列优先级 / 间距规则
   — 明确组件栅格挂靠要求、卡片间距规则
   — 明确禁止组合黑名单（Banner 嵌套、多尺寸 Banner 并排、按钮位置等）
```

后续所有步骤的几何数值必须落在 ① 的白名单内，组件排布必须符合 ② 的组合规则。无法对应到约束的需求 → 停下询问用户，禁止造数或静默放行。

### 第一步：读取设计规范

```
使用 get_variable_sets 获取当前文件所有变量集合
使用 get_variables(variableSetId) 读取具体变量值（颜色/字号/间距等）
使用 get_local_styles 获取本地样式（填充色/描边/文字样式）
```

如需对照上游 Token 真源（语义化变量名、栅格断点），通过 WebFetch 拉取 [#数据资源](#数据资源) 中的三个 atomgit URL。

### 第二步：读取组件库

```
使用 get_all_components 列出所有可用 Symbol 组件
根据需求筛选目标组件名称和 componentKey
```

**所有含图形的组件（Radio / Checkbox / Switch / 导航 / 搜索框 / 按钮 / 下拉等）**：在生成包含任何图形、图标、状态图形的 HTML 前，**必须先执行以下检查**，不可跳过：

```
1. ls references/assets/<组件名>/          ← 确认 assets 下是否有该组件的 SVG
2. 有文件 → Read 每个文件，全部内联到 HTML 对应位置
3. 无文件 → 才允许手写 SVG 路径或 CSS，并在 HTML 注释中注明「assets 中无资源」
```

> ⚠️ 此规则覆盖所有场景：组件状态图标（Radio 圆形、Checkbox 方框）、UI 组件内嵌图标（导航 Logo、搜索图标、按钮 Icon）、独立功能图标，**一律先查 assets，有就用**。

**独立图标查找**：需要独立图标时，查阅 [references/icon-keys.md](references/icon-keys.md) 按中文图标名称匹配，然后从 [references/assets/](references/assets/) 目录取对应 SVG 文件内嵌；若 assets 中无该图标，使用线性风格 SVG 路径手写。

### 第三步：确认本次涉及的组件（强制询问用户）

> 🚨 **禁止自行决定使用哪些组件后直接跳到生成。必须先向用户确认。**

根据设计需求，列出你认为本次将用到的所有组件，以清单形式展示给用户，**等待用户确认或修正后才能继续**：

```
我理解本次设计需要以下组件，请确认或补充：
  - ONavigation（顶部导航）
  - OCard × N（卡片列表）
  - OButton（按钮）
  - OPagination（分页）
  - …（按需列出）

如有遗漏或需要调整，请告知，确认后我将读取对应规范再生成。
```

用户确认后，逐一读取每个组件的 `references/components/{name}.md`，全部读取完毕才能进入下一步。

---

### 第四步：选择生成模式

根据用户需求在两种模式中选择：

| 条件 | 选择 |
|------|------|
| 用户需要 Pixso 可编辑画布、Token 绑定或交互原型 | 模式 A |
| 用户需要可在浏览器直接打开的网站页面 / 未明确说明 | 模式 B（默认） |

> ## 🚨 无论模式 A 还是模式 B——强制读取规范，禁止自定义
>
> **生成任何内容前，必须逐一读取所有涉及组件的规范文档 `references/components/{name}.md`。**
>
> - 禁止！禁止！！根据经验、记忆或推断生成任何视觉属性（色值、字号、行高、间距、圆角、变体参数……）
> - 合法的参数来源只有三个：① 对应组件规范文档 ② 硬约束白名单（第零步） ③ 上游 Token 真源
> - 三者之外的任何取值均属**自定义内容，一律禁止**，包括但不限于：近似色值、估算间距、推断圆角、猜测默认变体
> - 如果规范文档中找不到所需参数 → 停下，询问用户，**禁止自行填充**

---

#### 模式 A：Pixso 可编辑画布模式（单阶段）

无需 `create_instance`，`code_to_design` 一次输出完整设计稿，所有元素位置与样式自动到位，Pixso 中可直接编辑每个图层。

> **【强制前置：读取规范文档】** 执行前必须读取所有涉及组件的 `references/components/{name}.md`，严格按规范文档中的变体参数、颜色 Token、间距规格、字号规格生成。**禁止！禁止！！自定义任何视觉属性。**

**所有场景统一执行**：

```
【前置】Read references/components/{name}.md  ← 涉及哪些组件就读哪些，不可跳过
code_to_design(htmlStr)
  — 完整页面 HTML，包含所有组件的精确位置与像素级样式还原
  — 所有样式值必须来自规范文档或 Token 白名单，禁止自定义
  — 图标：直接内嵌 <svg> 路径（不使用占位符，不使用 <img src>）
  — SVG 颜色使用 currentColor 继承父元素，或按 Token 硬编码对应色值
  — 产出为 Pixso 可直接编辑的设计稿画布
```

---

#### 模式 B：可视化 HTML 网站模式（单阶段，默认）

生成可独立运行于浏览器的完整 HTML 网站页面，像素级还原设计系统视觉风格。

> **【强制前置：读取规范文档】** 执行前必须读取所有涉及组件的 `references/components/{name}.md`，严格按规范文档中的变体参数、颜色 Token、间距规格、字号规格生成。**禁止！禁止！！自定义任何视觉属性。**

**所有场景统一执行**：

```
【前置】Read references/components/{name}.md  ← 涉及哪些组件就读哪些，不可跳过
生成独立 HTML 文件
  — 完整页面 HTML + 内联 CSS，包含所有组件的精确位置与像素级样式
  — 所有样式值必须来自规范文档或 Token 白名单，禁止自定义
  — 图标：直接内嵌 <svg> 路径（不使用占位符，不使用 <img src>）
  — SVG 颜色使用 currentColor 或按 Token 硬编码对应 CSS 变量
  — 产出为可在浏览器直接打开 / 部署的网站页面
```

**SVG 图标规范**：

| 属性 | 规格 |
|------|------|
| 尺寸 | 与设计系统图标一致（通常 24×24px，使用 `icon_size-m` Token） |
| 风格 | 线性（stroke），与 OpenEuler 图标库保持一致 |
| 颜色 | `currentColor`（继承父元素文字色）或对应 Token 色值 |
| 写法 | `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...>` 直接内嵌 |

---

### 第五步：应用设计变量与样式

```
set_fill_style(itemId, styleKey) — 应用填充色样式
set_text_style(itemId, styleKey) — 应用文字样式
set_stroke_style(itemId, styleKey) — 应用描边样式
set_bound_variables(bindings) — 绑定设计变量（Token）
```

### 第六步：验证视觉结果

```
get_node_dsl(itemId) — 读取节点 DSL 结构，验证层级与属性
get_image(itemId) — 生成节点预览图，确认视觉结果
```

## 节点 ID 获取方式

- 从 Pixso 画布 URL 提取：`?item-id=1:2` → itemId 为 `1:2`
- 使用 `mcp__pixso-desktop__get_all_components` 或 `mcp__pixso-desktop__get_local_styles` 返回结果中查找对应 key/id

## 组件文档规范

生成组件设计规范文档（`skills/opendesign-design/references/components/{name}.md`）时，**必须**将设计稿中的色值、字号、间距等匹配上游 Token 的变量名（数据从 [#数据资源](#数据资源) 中的远端 URL 拉取）：

### 必须匹配的属性

| 属性类型 | Token 格式 | 示例 |
|---|---|---|
| 颜色 | `color-*` | `color-info3`、`color-primary1`、`color-link1` |
| 字号 | `font_size-*` | `font_size-tip1` (14px) |
| 行高 | `line_height-*` | `line_height-tip1` (22px) |
| 字重 | `font_weight-*` | `font_weight-regular` (400)、`font_weight-bold` (600) |
| 间距 | `gap-*` | `gap-1` (4px)、`gap-2` (8px) |
| 圆角 | `radius_control-*` | `radius_control-m` (4px) |
| 图标尺寸 | `icon_size-*` / `icon_size_control-*` | `icon_size-m` (24px) |
| 阴影 | `shadow-*` | `shadow-1` |

### 颜色 Token 对照表

| 语义 | Token | 用途 |
|---|---|---|
| 一级文字/标题 | `color-info1` | 强调信息 |
| 二级文字/正文 | `color-info2` | 次强调 |
| 三级文字/辅助 | `color-info3` | 辅助信息、面包屑层级 |
| 禁用文字 | `color-info4` | 禁用状态 |
| 链接文字 | `color-link1` | 链接常规状态 |
| 强调色/主色 | `color-primary1` | 当前页面、激活状态 |
| 成功色 | `color-success1` | 成功提示 |
| 告警色 | `color-warning1` | 告警提示 |
| 危险色 | `color-danger1` | 错误/危险提示 |
| 控件边框 | `color-control1` | 输入框边框等 |

### 文档格式要求

样式规范表格中必须包含 Token 列：

```markdown
### 颜色

| 元素 | Token | Dark=off | Dark=on |
|---|---|---|---|
| 文字 | `color-info3` | `rgba(var(--o-grey-14), 0.6)` | `rgba(var(--o-grey-1), 0.6)` |
```

## 注意事项

- 当你准备使用某一个组件来生成设计稿时，你应该读取 opendesign-components 的 skill，来看他对应的组件开发 skill 中说明的传参是否足以支持你的想法
- 所有 `itemId` 格式为 `"数字:数字"`，例如 `"123:456"`
- 若未指定 itemId，工具默认操作当前 Pixso 画布中已选中的节点
- 导出图片时使用 `get_export_image` 并配置 exportSettings（PNG/SVG/PDF 等）
- **组件文档中所有色值、字号、间距必须匹配上游 Token 的变量名**，禁止使用硬编码值
- **图标规则**：两种模式均直接内嵌 `<svg>` 路径，禁止使用色块占位符或 `<img src>` 引用
- **SVG 颜色**：使用 `currentColor` 继承父元素，或直接填写对应 Token 的 CSS 变量值
- **禁止自定义（最终兜底）**：模式 A / 模式 B 生成时，凡未在组件规范文档、硬约束白名单、上游 Token 真源中找到依据的样式值，**一律禁止输出**。不得以"常见默认值""经验估算""视觉近似"为由跳过读取规范直接生成。

## componentKey 速查

> - 完整 536 个 UI 组件变体：[references/component-keys.md](references/component-keys.md)
> - 完整 187 个图标 componentKey：[references/icon-keys.md](references/icon-keys.md)

常用高频变体（Light 模式默认变体，已验证）：

| 组件 | 变体 | componentKey |
|------|------|-------------|
| ONavigation/顶部导航 | PC, Dark=off | `561d3014fbe6f361abfecc203a06f1ab6cad43af` |
| ONavigation/顶部导航 | PC, Dark=on | `c4522744b94335f4bc8fbc358c2316d3c447b771` |
| ONavigation/顶部导航 | Mb, Dark=off | `7675ede074069cf358a0f164f76e1c6c119a592f` |
| 导航 Navigation/底部导航 | PC | `5d66a734f21bfcce1fbe4fce1d79f832b7f08f02` |
| 导航 Navigation/底部导航 | Mb | `62383dfdd93fd29e6dfcb7def1861d22d005324a` |
| OBreadcrumb 面包屑 | Dark=off | `7838d75ba480e2c51fe0f741109ba6c9745a6f86` |
| 搜索框 Search | large, Enabled, Light | `504d78f315ae03447c67e6019f787e5656b4aa1a` |
| 搜索框 Search | medium, Enabled, Light | `bfb0631d6779aa79179e27e84534dd68acd2fa0e` |
| OButton 按钮 | solid, medium, Light | `eab0e6c545d27376ba67aef7dd233fc58c476234` |
| OButton 按钮 | outline, medium, Light | `3cd0c2f583c60180725e297d3529d67ed62fcad8` |
| OButton 按钮 | text, medium, Light | `2b717cf5c4d422ff4385f6f215d52fa4dcc1c04a` |
| OButton 按钮 | solid, large, Light | `1a36bbfd374263c7b4644d4490e8bb65450c2f57` |
| ODropdown 下拉菜单 | medium, solid, Light | `647e1f27461028010d0828c17a8dfb6f245bd449` |
| ODropdown 下拉菜单 | medium, outline, Light | `6c12a6d3766a2055cd8f300e001c589084b2decd` |
| ODropdown 下拉菜单 | medium, text, Light | `cdf3700ce2d84a8bcf81720f9d64a0c867909268` |
| OPagination 分页 | All, Dark=off | `35bb7a0ef9189834048e73d6832418da0796d993` |
| OPagination 分页 | Simple, Dark=off | `c8d2772ff9159d6bc99498f30ba24bb001039139` |
| OCard 卡片 | cover, vertical, Light | `a22044aaa494bba137bd3ebba74319449b998694` |
| OCard 卡片 | cover, horizontal, Light | `0fceafcdae43547862ffb167bdcce89f510c3c35` |
| OCard 卡片 | icon, vertical, Light | `6103b3265e752087a546bf1b77a0f1b5bfef888b` |
| OCard 卡片 | icon, horizontal, Light | `e2a10a804dc8cb9ab507d237c712f65c7cf12f5e` |
