# Changelog

本文件记录 `opendesign-tokens` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update`
字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-07-08

### 更新

- SKILL.md 新增字号/行高引用方式指引——mixin（`@include h*`）用于成对输出到当前元素，`var(--o-r-font_size-*)` +
  `var(--o-r-line_height-*)` 用于单独引用某一项；新增 mixin 用法示例；链接指向 opendesign-application skill →
  styles-infrastructure §4。

---

## 2026-07-06

### 更新

- 所有 7 个 reference 文件和 SKILL.md 索引层新增版本标注行
  `@opensig/opendesign-token **v0.1.1**（2026-06 生成），最低依赖版本 ≥0.1.1`；SKILL.md
  版本标注从正文描述中独立为标题下方标准格式行，同时明确消费者版本门槛含义。
- 新增五档字重变量 `--o-font_weight-thin`（250）/`light`（300）/`medium`（500）/`semibold`（600）/`black`（900），并补充字重选用建议（日常以
  regular + semibold 两档为主）。`--o-font_weight-bold` 值更新为 `700`；新增 `--o-font_weight-semibold`（`600`）承接日常加粗场景，使用
  `var(--o-font_weight-bold)` 的产物代码仍生效，仅视觉加粗程度略有变化。
- `--o-font_family` 值更新为 `'HarmonyOS Sans', 'HarmonyOS Sans SC', Inter, ...`（栈首新增拉丁族 `'HarmonyOS Sans'`
  ），实现拉丁/中文自动分流——拉丁文命中拉丁族（含真斜体），中文穿透到 SC 族。字体族名更新为 `'HarmonyOS Sans SC'`（中文）与
  `'HarmonyOS Sans'`（拉丁），建议使用 `var(--o-font_family)` 确保自动跟随变更，避免硬编码族名。
- 补充按字重按需引入字体 CSS 的用法（如 `fonts/sc-regular/font.min.css`），以及字体文件按 `unicode-range`
  分片、仅加载实际用到的字符的说明。0.1.1 起引入字体 CSS 仅注册 `@font-face`，需在根容器显式设置
  `:root { font-family: var(--o-font_family); }` 以应用字体。

---

## 2026-06-29

### 更新

- 补充引入鸿蒙字体文件的描述，并修复字体引入路径。

---

> 本 CHANGELOG 自 2026-07-25 起从仓库根目录迁移至各 skill 目录。更早的变更详见 `git log`。
