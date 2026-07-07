# Changelog

本文件记录 `skills/` 目录下对外分发的 Skill 的变更，供使用者判断是否需要重新安装已安装的 skill。`packages/skills/` 下的内部 Skill（第一层：生产指导）不记入本文件——它们的受众是 AI 编码工具（写作者），而非 Skill 使用者，变更不影响已交付的产物。各 `skills/*/SKILL.md` frontmatter 的 `last_update` 字段与本文件中的日期一一对应。

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

## 2026-07-07

### 新增
- **opendesign-application**：工程化落地指南（`skills/opendesign-application/`），含 5 份 reference——`getting-started.md`（依赖安装、入口文件、样式引入顺序、`useScreen()`）、`theme-system.md`（Pinia store writable computed `isDark` + `storeToRefs` 解构、防闪烁、SSR hydration、社区切换、ThemeToggle 基于 OSwitch + OIconSun/OIconMoon + `:checked-value="false" :unchecked-value="true"`）、`styles-infrastructure.md`（SCSS mixin 三套含 hover/hoverable、全局注入、栅格容器、AppSection 楼层组件）、`project-layout.md`（目录结构、Nuxt vs SPA 差异对照、选型建议）、`conventions.md`（硬规则、应用层约定、Code Review 检查清单）。另含两套可运行脚手架（`templates/nuxt` Nuxt 4 SSR + `templates/vue-spa` Vite SPA），每套附带项目级 `AGENTS.md`。

### 更新
- **opendesign-components**：移除 `me-hover` mixin（语义含糊且与 hover/hoverable 功能重叠），补充 `hover()` 与 `hoverable()` 的区别说明（hover 自动包裹 `:hover` 仅瞬态生效，hoverable 只做设备筛选 `@content` 原样输出常驻样式）。hoverable 用法示例从 `visibility: visible` 改为更直观的 `background-color` 覆盖，新增 `hoverable(none)` 触控设备示例。SCSS mixin 速查表移除 `me-hover` 行，`hoverable` 行标注「常驻，非瞬态」。

---

## 2026-07-06

### 更新
- **skill-gen-guide**：版本标注规范扩展覆盖 Token Skill——新增「生成/更新 Token Skill」4 步流程（确认包版本 → 提取 token 变量 → 识别破坏性变更 → 更新 Skill 文件），前置步骤增加 token 包版本查询方式，更新文档增加 Token Skill 专属版本比对流程。版本标注行统一加入最低依赖版本 + ReleaseNote 链接（三个包各一份），消费者视角约束指引 AI 比对用户项目 `package.json` 版本与 Skill 标注的最低依赖版本，版本偏低时查 ReleaseNote 确认具体 API 的引入/变更版本。
- **opendesign-tokens**：所有 7 个 reference 文件和 SKILL.md 索引层新增版本标注行 `@opensig/opendesign-token **v0.1.1**（2026-06 生成），最低依赖版本 ≥0.1.1`；SKILL.md 版本标注从正文描述中独立为标题下方标准格式行，同时明确消费者版本门槛含义。
- **opendesign-tokens**：新增五档字重变量 `--o-font_weight-thin`（250）/`light`（300）/`medium`（500）/`semibold`（600）/`black`（900），并补充字重选用建议（日常以 regular + semibold 两档为主）。`--o-font_weight-bold` 值更新为 `700`；新增 `--o-font_weight-semibold`（`600`）承接日常加粗场景，使用 `var(--o-font_weight-bold)` 的产物代码仍生效，仅视觉加粗程度略有变化。
- **opendesign-tokens**：`--o-font_family` 值更新为 `'HarmonyOS Sans', 'HarmonyOS Sans SC', Inter, ...`（栈首新增拉丁族 `'HarmonyOS Sans'`），实现拉丁/中文自动分流——拉丁文命中拉丁族（含真斜体），中文穿透到 SC 族。字体族名更新为 `'HarmonyOS Sans SC'`（中文）与 `'HarmonyOS Sans'`（拉丁），建议使用 `var(--o-font_family)` 确保自动跟随变更，避免硬编码族名。
- **opendesign-tokens**：补充按字重按需引入字体 CSS 的用法（如 `fonts/sc-regular/font.min.css`），以及字体文件按 `unicode-range` 分片、仅加载实际用到的字符的说明。0.1.1 起引入字体 CSS 仅注册 `@font-face`，需在根容器显式设置 `:root { font-family: var(--o-font_family); }` 以应用字体。
- **opendesign-components**：SKILL.md 索引层新增版本标注行 `@opensig/opendesign **v1.2.5**（2026-07 生成），最低依赖版本 ≥1.2.5` 及组件库 ReleaseNote 链接；安装章节补充最低版本指引。
- **opendesign-scripts**：SKILL.md 索引层新增版本标注行 `@opensig/open-scripts **v1.0.6**（2026-07 生成），最低依赖版本 ≥1.0.6` 及脚本 ReleaseNote 链接。

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
