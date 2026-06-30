# Changelog

本文件记录所有对外暴露的 Skill 的变更，供使用者判断是否需要重新安装已安装的 skill。各 `skills/*/SKILL.md` frontmatter 的 `last_update` 字段与本文件中的日期一一对应。

> 维护规范见 [`AGENTS.md`](AGENTS.md) 的「[变更记录规范](#变更记录规范changelog)」章节。

### 分类说明

| 分类 | 含义 |
|------|------|
| 新增 | 新增的组件 / 命令 / 变体 / token / 规范 |
| 更新 | 已有内容的语义变化 |
| 修正 | 错误引用、过时描述、与源码不符的修正 |
| 移除 | 删除的组件 / 选项 / 约束 |
| ⚠️ 破坏性 | 硬约束 / 断点 / 规则变化，会让旧产物不再合规 |

---

## 2026-06-30

### ⚠️ 破坏性
- **opendesign-design**：颜色变量命名统一加 `--o-color-` 前缀（如 `color-primary1` → `--o-color-primary1`、`color-white` → `--o-color-white`），影响 26 个组件设计规范文档。按旧变量名在 Pixso 中建立的变量需同步更新。

### 更新
- **opendesign-design**：调整 ONavigation 登录与未登录的交互规则，以及 anchor / breadcrumb / button / link / menu / step / tab 等组件的交互规则。

### 新增
- 建立 CHANGELOG 机制：根目录 `CHANGELOG.md`（总览）+ 各 `skills/*/SKILL.md` frontmatter 的 `last_update` 字段（快速锚点）；规范沉淀进 `AGENTS.md`「变更记录规范」章节，并要求 AI 在完成 Skill 修改后主动提醒用户是否更新变更记录。

---

## 2026-06-29

### 更新
- **opendesign-components / opendesign-design / opendesign-codegen**：按“融合而非补丁”原则清理对不存在组件的误引用，重写相关章节；该原则同步沉淀进 `AGENTS.md`。
- **opendesign-tokens**：补充引入鸿蒙字体文件的描述，并修复字体引入路径。
- **opendesign-components**：OMenu 补充 OSubMenu 的 `disabled` 处理策略——子项 disabled 时父项不可选，文档此前未说明，影响 AI 生成带禁用菜单的代码。

### 修正
- README 安装命令统一为 ssh 格式（`git@atomgit.com:...`）。

---

## 2026-06-27

### 更新
- **opendesign-codegen**：补充目标仓发现 / 适用门禁工作流与按需读取最新同级 skill 的说明。

---

> 本 CHANGELOG 自 2026-06-30 起建立。更早的变更（含 opendesign-codegen 新增、opendesign-design 多次扩充、组件 skill 初始化等）未逐条回填，详见 `git log`。
