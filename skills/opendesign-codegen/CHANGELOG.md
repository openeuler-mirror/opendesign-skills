# Changelog

本文件记录 `opendesign-codegen` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

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
