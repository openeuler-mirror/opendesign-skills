# Changelog

本文件记录 `opendesign-design` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-07-21

### 新增
- **opendesign-design**：新增多个交互示例 demo——card-demo、checkbox-demo、dropdown-demo、input-demo、interactive-card-demo、radio-demo、search-demo、select-demo、switch-debug、toggle 等 HTML 示例文件，用于展示各组件的实际使用效果。

---

## 2026-06-30

### ⚠️ 破坏性
- 颜色变量命名统一加 `--o-color-` 前缀（如 `color-primary1` → `--o-color-primary1`、`color-white` → `--o-color-white`），影响 26 个组件设计规范文档。按旧变量名在 Pixso 中建立的变量需同步更新。

### 更新
- 调整 ONavigation 登录与未登录的交互规则，以及 anchor / breadcrumb / button / link / menu / step / tab 等组件的交互规则。

---

## 2026-06-29

### 更新
- 按"融合而非补丁"原则清理对不存在组件的误引用，重写相关章节。

---

> 本 CHANGELOG 自 2026-07-25 起从仓库根目录迁移至各 skill 目录。更早的变更详见 `git log`。
