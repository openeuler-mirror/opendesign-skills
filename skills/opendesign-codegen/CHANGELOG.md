# Changelog

本文件记录 `opendesign-codegen` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

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
