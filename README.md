# OpenDesign Skills

OpenDesign 生态的 AI Skill 集合，为 AI 编码助手提供 OpenDesign 组件库、构建工具、设计令牌和前端开发规范的完整知识。

---

## 安装

使用 [`skills` CLI](https://skills.sh/) 一键安装到你的 AI 编码助手：

```bash
# 安装全部 skill（推荐）
pnpx skills add finch-poi/opendesign-skills --all

# 安装单个 skill
pnpx skills add finch-poi/opendesign-skills --skill opendesign-components
pnpx skills add finch-poi/opendesign-skills --skill opendesign-scripts
pnpx skills add finch-poi/opendesign-skills --skill opendesign-tokens
pnpx skills add finch-poi/opendesign-skills --skill opendesign-design
```

> opendesign-components / scripts / tokens 生产 Vue 代码；opendesign-design 生产 Pixso 设计稿。两类 skill 互补，可按需安装。

安装后，skill 会自动注入到支持的 AI 编码助手。

### 团队成员拉取后恢复安装

pnpx skills experimental_install

---

## Skill 总览

| Skill | 包名 | 覆盖范围 | 入口文件 |
|-------|------|---------|---------|
| [opendesign-components](#opendesign-components) | `@opensig/opendesign` | 46 个 Vue 3 UI 组件 | [SKILL.md](skills/opendesign-components/SKILL.md) |
| [opendesign-scripts](#opendesign-scripts) | `@opensig/open-scripts` | 5 个 CLI 构建命令 | [SKILL.md](skills/opendesign-scripts/SKILL.md) |
| [opendesign-tokens](#opendesign-tokens) | `@opensig/opendesign-token` | 3 套主题的设计令牌体系 | [SKILL.md](skills/opendesign-tokens/SKILL.md) |
| [opendesign-design](#opendesign-design) | Pixso MCP（无 npm 包） | 21 个组件设计规范 + 536 变体 + 187 图标 | [SKILL.md](skills/opendesign-design/SKILL.md) |

---

## opendesign-components

**用途**：使用 OpenDesign Vue 3 组件库构建页面，或从 Pixso 设计稿识别并匹配组件时加载此 skill。

**适用场景**：
- 使用 OpenDesign 组件搭建 Vue 页面
- 查找组件 API（props / events / slots / expose）
- 获取组件代码示例和最佳实践
- **通过 Pixso MCP 读取设计稿，将图层信息映射到对应组件并生成代码**

**覆盖 46 个组件**（按字母序）：

| 组件 | 说明 | 组件 | 说明 |
|------|------|------|------|
| [Anchor](skills/opendesign-components/references/anchor.md) | 锚点导航 | [Link](skills/opendesign-components/references/link.md) | 链接 |
| [Badge](skills/opendesign-components/references/badge.md) | 徽标 | [Loading](skills/opendesign-components/references/loading.md) | 加载遮罩 |
| [Breadcrumb](skills/opendesign-components/references/breadcrumb.md) | 面包屑 | [Menu](skills/opendesign-components/references/menu.md) | 导航菜单 |
| [Button](skills/opendesign-components/references/button.md) | 按钮 | [Message](skills/opendesign-components/references/message.md) | 全局消息 |
| [Card](skills/opendesign-components/references/card.md) | 卡片 | [Pagination](skills/opendesign-components/references/pagination.md) | 分页 |
| [Carousel](skills/opendesign-components/references/carousel.md) | 轮播 | [Popover](skills/opendesign-components/references/popover.md) | 气泡卡片 |
| [Cascader](skills/opendesign-components/references/cascader.md) | 级联选择 | [Popup](skills/opendesign-components/references/popup.md) | 弹出层 |
| [Checkbox](skills/opendesign-components/references/checkbox.md) | 复选框（含 Group） | [Progress](skills/opendesign-components/references/progress.md) | 进度条 |
| [Collapse](skills/opendesign-components/references/collapse.md) | 折叠面板 | [Radio](skills/opendesign-components/references/radio.md) | 单选框（含 Group） |
| [ConfigProvider](skills/opendesign-components/references/config-provider.md) | 全局配置 | [Rate](skills/opendesign-components/references/rate.md) | 评分 |
| [DataTable](skills/opendesign-components/references/data-table.md) | 数据表格 | [Result](skills/opendesign-components/references/result.md) | 结果页 |
| [Dialog](skills/opendesign-components/references/dialog.md) | 对话框 | [Scrollbar](skills/opendesign-components/references/scrollbar.md) | 滚动条 |
| [Divider](skills/opendesign-components/references/divider.md) | 分割线 | [Select](skills/opendesign-components/references/select.md) | 下拉选择（含 OptionGroup） |
| [Dropdown](skills/opendesign-components/references/dropdown.md) | 下拉菜单 | [Skeleton](skills/opendesign-components/references/skeleton.md) | 骨架屏 |
| [Figure](skills/opendesign-components/references/figure.md) | 图片 | [Slider](skills/opendesign-components/references/slider.md) | 滑块 |
| [Form](skills/opendesign-components/references/form.md) | 表单（含 FormItem） | [Step](skills/opendesign-components/references/step.md) | 步骤条 |
| [Grid](skills/opendesign-components/references/grid.md) | 栅格布局 | [Switch](skills/opendesign-components/references/switch.md) | 开关 |
| [Icon](skills/opendesign-components/references/icon.md) | 图标 | [Tab](skills/opendesign-components/references/tab.md) | 标签页 |
| [Input](skills/opendesign-components/references/input.md) | 输入框 | [Tag](skills/opendesign-components/references/tag.md) | 标签 |
| [InputNumber](skills/opendesign-components/references/input-number.md) | 数字输入框 | [Textarea](skills/opendesign-components/references/textarea.md) | 文本域 |
| [IpInput](skills/opendesign-components/references/ip-input.md) | IP 地址输入框 | [Toast](skills/opendesign-components/references/toast.md) | 轻提示 |
| [Layer](skills/opendesign-components/references/layer.md) | 浮层基础组件 | [Toggle](skills/opendesign-components/references/toggle.md) | 切换按钮 |
| — | — | [Upload](skills/opendesign-components/references/upload.md) | 上传 |
| — | — | [VirtualList](skills/opendesign-components/references/virtual-list.md) | 虚拟列表 |

> 跳过：OTable（按规则不生成 skill）

**目录结构**：
```
skills/opendesign-components/
├── SKILL.md                          # 主 skill 文件（含安装指南和组件索引）
└── references/
    └── {component}.md                # 各组件的 skill 文件（×46）
```

---

## opendesign-scripts

**用途**：使用 `@opensig/open-scripts` CLI 工具进行构建、图标生成、样式编译时加载此 skill。

**适用场景**：
- 配置和执行构建脚本
- 编写图标 / 令牌配置文件
- 了解构建流程和命令依赖关系

**覆盖 5 个命令**：

| 命令 | 说明 | 适用项目 | 参考文档 |
|------|------|---------|---------|
| `gen:icon` | 从 SVG 文件生成 Vue 图标组件 | 组件库 + 业务项目 | [gen-icon.md](skills/opendesign-scripts/references/gen-icon.md) |
| `clean:svg` | 清理和优化 SVG 文件 | 组件库 + 业务项目 | [clean-svg.md](skills/opendesign-scripts/references/clean-svg.md) |
| `build:component` | 构建 Vue 组件库（ESM/CJS/UMD） | 仅组件库开发 | [build-component.md](skills/opendesign-scripts/references/build-component.md) |
| `build:style` | 编译 SCSS 样式为 CSS | 仅组件库开发 | [build-style.md](skills/opendesign-scripts/references/build-style.md) |
| `gen:token` | 从 JSON 生成设计令牌 CSS 变量 | 仅令牌包构建 | [gen-token.md](skills/opendesign-scripts/references/gen-token.md) |

**标准构建流程**：`clean:svg → gen:icon → build:component → build:style`

**目录结构**：
```
skills/opendesign-scripts/
├── SKILL.md                          # 主 skill 文件（含安装指南和命令详解）
└── references/
    └── {command}.md                  # 各命令的 skill 文件（×5）
```

---

## opendesign-tokens

**用途**：在代码中使用 `@opensig/opendesign-token` 的 CSS 变量，或通过 Pixso MCP 将设计稿属性值反查为 token 时加载此 skill。

**适用场景**：
- 查找颜色值对应的语义 token 名称
- 获取间距 / 圆角 / 字体的 token
- 了解六套主题（openEuler / Ascend / Kunpeng / Mindspore / openGauss / openUBMC）的差异
- 用 CSS 变量替代硬编码值
- **通过 Pixso MCP 读取设计稿属性（颜色/字号/间距/圆角/布局宽度），映射为对应 CSS Token**

**Token 体系**：
```
基础 Token（调色板）  →  语义 Token（颜色意义）  →  组件级 Token
--o-kleinblue-6      →  --o-color-primary1      →  --btn-color
```

**六套主题**：

| 主题 | 社区 | 品牌色 | 参考文档 |
|------|------|--------|---------|
| `e` | openEuler | Klein Blue | [tokens-openeuler.md](skills/opendesign-tokens/references/tokens-openeuler.md) |
| `a` | Ascend | Ascend 品牌色 | [tokens-ascend.md](skills/opendesign-tokens/references/tokens-ascend.md) |
| `k` | Kunpeng | Kunpeng 品牌色 | [tokens-kunpeng.md](skills/opendesign-tokens/references/tokens-kunpeng.md) |
| `m` | MindSpore | MindSpore 品牌色 | [tokens-mindspore.md](skills/opendesign-tokens/references/tokens-mindspore.md) |
| `g` | openGauss | openGauss 品牌色 | [tokens-opengauss.md](skills/opendesign-tokens/references/tokens-opengauss.md) |
| `u` | openUBMC | openUBMC 品牌色 | [tokens-openubmc.md](skills/opendesign-tokens/references/tokens-openubmc.md) |

通用 token 参考（颜色、间距、圆角等）：[tokens.md](skills/opendesign-tokens/references/tokens.md)

**目录结构**：
```
skills/opendesign-tokens/
├── SKILL.md                          # 主 skill 文件（含 token 体系说明）
├── scripts/
│   └── convert_to_token.py           # Token 转换脚本
└── references/
    ├── tokens.md                     # 通用 token 参考
    ├── tokens-openeuler.md           # openEuler 主题 token
    ├── tokens-ascend.md              # Ascend 主题 token
    ├── tokens-kunpeng.md             # Kunpeng 主题 token
    ├── tokens-mindspore.md           # MindSpore 主题 token
    ├── tokens-opengauss.md           # openGauss 主题 token
    └── tokens-openubmc.md            # openUBMC 主题 token
```

---

## opendesign-design

**用途**：在 Pixso 中通过 MCP 工具生产符合 OpenDesign 规范的设计稿。当 AI 需要在 Pixso 画布上创建/编辑 UI 组件、搭建页面框架、调用 Symbol 组件库或读取设计变量时加载此 skill。**本 skill 仅生产 Pixso 设计稿，不输出代码**。

**适用场景**：
- 在 Pixso 中创建按钮、输入框、卡片、导航等 UI 组件
- 应用栅格 / 颜色 / 字号 / 间距 / 圆角等设计规范
- 调用 OpenDesign 的 Pixso Symbol 组件库（按 componentKey 实例化）
- 读取并应用设计变量（Tokens）到画布元素
- 含图标场景下采用两阶段生成（`code_to_design` + `create_instance`）

**覆盖范围**：
- **21 个组件设计规范**：OAnchor / OBreadcrumb / OButton / OCard / OCheckbox / ODivider / ODropdown / OInput / OLink / OLoading / OMessage / ONavigation / OPagination / ORadio / OScrollbar / OSearch / OStep / OSwitch / OTab / OTag / OToggle
- **536 个 UI 组件变体**的 `componentKey` 索引
- **187 个图标**的 `componentKey` 索引（独立图标库 `kbqInwBrCTGnM0MsPJDgvA`）

**数据资源（运行时拉取，不本地化）**：

栅格 / 响应式断点 / openEuler 主题 token 等上游数据通过 WebFetch 实时从 atomgit 拉取，**不下载到本地副本**：

| 用途 | URL |
|---|---|
| 栅格规范 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/grid-token.json` |
| 响应式断点 | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/responsive-token.json` |
| openEuler 主题 Token | `https://raw.atomgit.com/openeuler/opendesign-token/raw/master/packages/opendesign-token/tokens/openeuler-token.json` |

**与其他 skill 的关系**：
- 与 `opendesign-components` 互补：本 skill 在 Pixso 中产出设计稿，components skill 把设计稿转为 Vue 代码
- 与 `opendesign-tokens` 共享 Token 真源（同一 atomgit 上游），但本 skill 侧重在 Pixso 画布上落地 Token

**目录结构**：
```
skills/opendesign-design/
├── SKILL.md                          # 主 skill 文件（含工作流、图标处理规范、componentKey 速查）
└── references/
    ├── components/
    │   └── {component}.md            # 21 个组件设计规范
    ├── component-keys.md             # 536 个 UI 组件变体 componentKey 索引
    └── icon-keys.md                  # 187 个图标 componentKey 索引
```

> 不包含本地 `scripts/` 目录 — token / 栅格数据由 SKILL.md 在执行时通过远端 URL 获取。

---

## Skill 之间的关系

```
   ┌── 设计阶段（Pixso 画布） ──┐         ┌────── 开发阶段（Vue 代码） ──────┐
   │                          │         │                                │
   │   opendesign-design      │         │   opendesign-tokens   opendesign-scripts
   │   (Pixso 设计稿生产)      │ ──映射──▶│   (CSS 变量)          (CLI 构建工具)
   │                          │         │       │                    │
   └──────────────────────────┘         │       │ 提供主题变量         │ gen:icon / build
                                        │       ▼                    ▼
                                        │   opendesign-components ◄──┘
                                        │   (46 个 Vue 3 UI 组件)
                                        │       │
                                        │       │ 被业务项目使用
                                        │       ▼
                                        │    业务项目
                                        └────────────────────────────────┘
```

**两类典型使用路径**：

**A. 业务项目（开发侧）**：
1. 安装 `@opensig/opendesign` + `@opensig/opendesign-token`
2. 选择主题，引入 token CSS（参考 **opendesign-tokens**）
3. 使用组件搭建页面（参考 **opendesign-components**）
4. 如有自定义图标，使用 `gen:icon`（参考 **opendesign-scripts**）

**B. 设计稿生产（设计侧）**：
1. 在 Pixso 中打开工作文件，启用 Pixso MCP
2. 按 **opendesign-design** 中的两阶段策略生成页面（`code_to_design` 结构 + `create_instance` 组件）
3. 通过 WebFetch 拉取最新 token / 栅格数据并应用到画布

---

## 统计

| 指标 | 数量 |
|------|------|
| Skill 大类 | 4 |
| 组件 Skill（代码侧） | 46 |
| 脚本 Skill | 5 |
| Token 参考 | 7 |
| 组件设计规范（设计侧） | 21 |
| componentKey 变体索引 | 536 |
| 图标 componentKey 索引 | 187 |
| 参考文件总计 | 81 |
