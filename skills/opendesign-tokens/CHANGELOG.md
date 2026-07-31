# Changelog

本文件记录 `opendesign-tokens` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update`
字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-07-31

### 新增

- **值→token 反查命令（`convert`）**：新增 `convert <value>` 子命令，从设计稿的 hex/rgb/rgba 色值、px/ms 尺寸、
  cubic-bezier 缓动、shadow 定义等反向匹配对应 token。反向映射表从 `@opensig/opendesign-token` 的 CSS 产物**动态构建**
  （直接 RGB 元组 + `var()` 引用链追踪 + `rgba(var(--o-x), alpha)` 解析），始终与实际包版本同步，替代旧版
  `convert_to_token.py` 的硬编码映射表。支持 `--color`/`--value` 强制模式、`--tolerance` 颜色容差、`--all` 显示全部匹配、
  `--json` 结构化输出。匹配结果按语义优先级排序：语义颜色（fill/primary/success/...）> 响应式 > 语义尺寸 > 调色板 > 基础色
  （white/black）。
- Token 真实性校验 CLI（`scripts/check-tokens.mjs`）——零依赖 Node.js ≥ 18 脚本，支持 `check`（单 token 校验）/ `scan`
  （文件/目录批量扫描）/ `list`（按 glob 列举）/
  `info`（跨主题 light/dark 值 + 响应式各断点值）/ `versions` / `clear-cache` 六个子命令；支持 `--version` / `-t` / `-m` /
  `--json` / `--offline` / `--strict` 等选项；扫描出的无效 token 会附带 Levenshtein 距离 + 数值后缀匹配的最近 3 个真实
  token 建议（如 `--o-color-bg2` → `--o-color-fill2`）。
- **CSS 产物为唯一真值源**：变量存在性、值、响应式各断点值全部从 `themes/*.css` 解析（`@media` 块追踪 + JSDoc 注释 `@group`/
  `@description`/`@type` 提取），JSON 降级为可选富化——schema 变更或 JSON 缺失不影响核心功能（已用 v0.0.3 验证：无
  `responsive-token.json` 时 `--o-r-*` 正确判为不存在，`--o-color-*` 的分类/描述从 CSS 注释正确提取）。
- **本地包优先，下载兜底**：包解析按优先级 `--version` > 就近 `node_modules`（从被扫描文件目录逐层向上查找，
  monorepo-aware，支持 pnpm symlink / npm hoisting）> `--offline` 缓存 > 下载 `latest`。本地有安装时无需联网、无需缓存，
  直接用项目实际依赖的版本。SKILL.md 同步新增「Token 真实性校验 CLI」章节，列出常见捏造模式（`bg*` / `border*` / `text*` /
  越界档位）与工作流建议。

### 更新

- **CLI 架构重构为多模块项目**：将原 1806 行的 `check-tokens.mjs` 拆分为 `lib/` 下 6 个共享模块
  （`package-resolver.mjs` 包解析/下载/缓存、`registry.mjs` CSS 解析/注册表、`lookup.mjs` 查找/建议、`convert.mjs` 反向映射、
  `file-scan.mjs` 文件扫描、`shared.mjs` 单例/格式化），统一入口为 `bin.mjs`。`check-tokens.mjs` 保留为向后兼容入口
  （等价于 `bin.mjs`，旧调用方式不受影响）。
- **CSS 解析器升级为字符级状态机**：原行级解析器替换为五状态字符级状态机（CODE / STRING_DQ / STRING_SQ / COMMENT /
  JSDOC），正确处理字符串内的花括号和注释定界符不被误判为代码结构、跨行值（如 `calc()` 跨行表达式）自然累积、注释内的
  `@media` 不被误判为媒体查询、缺失末尾分号的最后一个声明也能被捕获。移除了不再使用的 `CSS_VAR_REGEX` 常量和多行值
  死代码分支。
- **嵌套 `var()` 扫描修复**：扫描正则从 `var\(\s*(--o-[a-z0-9_-]+)\s*(?:,[^)]*)?\)` 简化为 `var\(\s*(--o-[a-z0-9_-]+)`，
  不再要求闭合 `)`。`lastIndex` 停在 token 名之后，使 `var(--o-x, var(--o-y))` 能同时捕获 `--o-x` 和 `--o-y`（旧正则
  因 `[^)]*` 在第一个 `)` 处停止，会漏检 fallback 中的内层 `--o-*`）。
- **`normalizeTokenName` 逻辑简化**：移除冗余的双重条件判断 `!s.startsWith('o-') && !s.startsWith('o')`，简化为
  `if (!s.startsWith('o-')) s = 'o-' + s`，行为一致且更易读。

### 移除

- `scripts/convert_to_token.py`——Python 版设计稿值→token 转换脚本。功能已完全由 `bin.mjs convert` 命令替代
  （动态构建反向映射表、支持主题/模式切换、校验 token 真实性、语义优先级排序），硬编码映射表不再需要维护。

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
