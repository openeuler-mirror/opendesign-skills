# Changelog

本文件记录 `opendesign-components` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-07-31

### 更新

- SKILL.md 版本标注更新为 v1.2.6，最低依赖版本 ≥1.2.6。
- **OTag**：color 新增 `pending`/`disabled`/`main2` 三种颜色（v1.2.6）；新增 `interactive` 属性控制 hover 交互态（v1.2.6）；CSS 变量新增 `--tag-bd`/`--tag-bg-image`/`--tag-bg-color-hover`/`--tag-bd-color-hover`/`--tag-color-hover`；关闭按钮颜色默认改为 inherit。
- **OVirtualList**：`itemSize` 支持函数（按项定高模式）（v1.2.6）；新增 `layout` 属性支持水平滚动（v1.2.6）；新增 `threshold` 属性控制虚拟化阈值（v1.2.6）；`scrollToView` 的 `align` 参数支持数字偏移量；新增 `scrollToOffset` 方法（v1.2.6）。
- **ODialog**：圆角默认值从 control-l 改为 control-xs，由断点和主题共同决定（v1.2.6）；`--dlg-margin` 默认值从 0 改为 24px（v1.2.6）。
- **OSelect**：背景色 CSS 变量从 control5-light/control4-light 改为 fill2（v1.2.6）；关闭按钮尺寸跟随 `--select-icon-size`（v1.2.6）；响应式判定从 isPhonePad 改为 isPhonePadSize（v1.2.6）。
- **OTab**：移动端溢出改为横向滚动模式，移除 ODialog 依赖（v1.2.5-sp1）；新增 `--tab-nav-ellipsis-shadow-color` 和 `--tab-nav-ellipsis-shadow-gradient` CSS 变量（v1.2.5-sp1）；修复触摸屏溢出气泡显示（v1.2.6）。
- **OPopup**：`beforeShow`/`beforeHide` 文档完善，明确为纯函数不应包含副作用（v1.2.6）；触摸设备 trigger 兜底策略改为追加 click（v1.2.6）。
- **OInput**：`extra` 插槽添加到 defineSlots 声明（v1.2.6）；修复背景色（v1.2.6）。
- **OAnchor**：修复横向 sticky 检测在无滚动祖先时不生效（v1.2.5-sp1）；示例改用 OScroller 滚动（v1.2.5-sp1）。
- **OCarousel**：使用 normalizeClass 重构 activeClass 处理逻辑（v1.2.6）。
- **OOption**：修复多选激活时字重为 regular（v1.2.6）。

---

## 2026-07-07

### 更新
- 移除 `me-hover` mixin（语义含糊且与 hover/hoverable 功能重叠），补充 `hover()` 与 `hoverable()` 的区别说明（hover 自动包裹 `:hover` 仅瞬态生效，hoverable 只做设备筛选 `@content` 原样输出常驻样式）。hoverable 用法示例从 `visibility: visible` 改为更直观的 `background-color` 覆盖，新增 `hoverable(none)` 触控设备示例。SCSS mixin 速查表移除 `me-hover` 行，`hoverable` 行标注「常驻，非瞬态」。

---

## 2026-07-06

### 更新
- SKILL.md 索引层新增版本标注行 `@opensig/opendesign **v1.2.5**（2026-07 生成），最低依赖版本 ≥1.2.5` 及组件库 ReleaseNote 链接；安装章节补充最低版本指引。

---

## 2026-06-29

### 更新
- OMenu 补充 OSubMenu 的 `disabled` 处理策略——子项 disabled 时父项不可选，文档此前未说明，影响 AI 生成带禁用菜单的代码。

### 修正
- 按"融合而非补丁"原则清理对不存在组件的误引用，重写相关章节。

---

> 本 CHANGELOG 自 2026-07-25 起从仓库根目录迁移至各 skill 目录。更早的变更详见 `git log`。
