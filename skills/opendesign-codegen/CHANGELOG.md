# Changelog

本文件记录 `opendesign-codegen` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-10-15

### 新增
- `references/page-structure.md` 新增「页面结构推导（需求 → 楼层 → 组件）」：双入口分流（上游已给楼层规划 / 组件清单时校验承接不重推，未给时四步自推：提取设计输入 → 判定页面类型 → 楼层规划（两条取舍纪律）→ 楼层内组件选型）、典型页面范式表五类、楼层级（中观层）选型表与控件级速查的分界、信息密度与占位纪律；范式表交叉链接现有两个示例（feature-section / list-filter-page）。

### 更新
- 适用前提改为双入口口径（三处同口径：`SKILL.md` 适用前提、`engineering-rules.md` 开篇、`checklist.md` 前置门禁）：工程内代码按「目标仓 UI 库是否 `@opensig/opendesign`」原判据；单文件 DEMO 按「已确认使用 OpenDesign 设计系统」进入，需求方确认不从措辞推断——未使用 OpenDesign 的自由视觉单文件生成明确不进本 skill。
- `standalone-rendering.md` 定位从「SFC 主流程之外的辅助场景」升为「单文件 DEMO 主路径」（UMD + CDN 单文件 HTML 渲染真实 OD 组件），与 SFC 工程主流程并存、各自表述清楚。
- `checklist.md` 新增「⑤ 设计基本盘」节：字号阶梯 ≤4 级 / 层级清晰 / 真实占位文案 / 语义地标完整 / 空态与异常路径有交代，5 项设计 checkbox 进逐项核对门禁；标题由「四维度门禁」改「五维度门禁」。
- `SKILL.md` 工作流插入「定页面结构」步骤（承接或自推页面结构）、起手步骤分工程内 / 单文件 DEMO 两路；描述与参考文件索引补页面结构推导与单文件 DEMO 路由词。

### 修正
- 清理三处对外部仓库 / 外部工具链的指代（社区差异说明、SEO/GEO 机制 × 2），改写为技能自含表述：TDK / meta 注入方式以目标仓 `rules/` 声明为准，仓内约定以目标仓 `AGENTS.md` + `rules/` 为唯一事实来源。

## 2026-10-08

### 新增
- `references/standalone-rendering.md` 新增「standalone HTML 渲染 OpenDesign（无 bundler 场景）」：依赖加载顺序（vue → vueuse → dayjs → process 垫片 → opendesign）、`process.env` 垫片、CDN 资源清单（含 `@vueuse/core` iife 在包根、theme token CSS 内部 `@import` 链等真实路径形态）、peer 依赖锁版与 UMD 导出核对方法。
- `engineering-rules.md` 新增 §7「组件库版本核对」：目标仓 `@opensig/opendesign` 版本低于 skill 基线时，以运行时事实为准核对导出/props（查已装包类型声明或 grep UMD 导出名），不维护跨版本差异表。

### 更新
- 表格示例改为 schema 风格：`component-cheatsheet.md` 选用表与表格示例、`examples/list-filter-page.vue` 从 `#td_<key>` 插槽改为 `columns` + `column.formatter`（返回函数式组件）做单元格渲染，操作列用 OLink；`starter-page.vue` 注释同步。
- `checklist.md` ④ 工程落地新增「i18n 键交叉核对」条目：模板用到的所有 `t('...')` 键须在 zh/en dict 均有定义。

### 修正
- 清理对已弃用 `OTable` 的引用，表格组件统一为 `ODataTable`：`SKILL.md` 硬规则示例与组件选用表、`checklist.md` 组件清单均由 `OTable` 改为 `ODataTable`。

## 2026-09-08

### 新增
- 组件速查表新增两行：图片放大查看 → `OFigure` `preview`（内置 OImageViewer 预览层，支持对象配置）；新手引导/功能漫游 → `OTour` + `OTourStep`。

### 更新
- 下拉选择一行更新为 `OSelect` 数据驱动写法（`:options` 数组、`filterable`、`virtual`）。

## 2026-07-31

### 更新
- 自检清单（checklist.md）① 视觉 Token 新增「所有 `var(--o-*)` 已用 Token CLI 验证存在性」检查项；「快速自检命令」重构为两步——第一步 Token CLI `scan`/`check`/`convert` 精确校验存在性与反查，第二步 grep 辅助扫描硬编码与模式违规。
- 工作流步骤 5 增加生成后跑 Token CLI `scan --strict` 的强制动作。

---

## 2026-06-29

### 更新
- 按"融合而非补丁"原则清理对不存在组件的误引用，重写相关章节。

---

## 2026-06-27

### 更新
- 补充目标仓发现 / 适用门禁工作流与按需读取最新同级 skill 的说明。

---

> 本 CHANGELOG 自 2026-07-25 起从仓库根目录迁移至各 skill 目录。更早的变更详见 `git log`。
