# Changelog

本文件记录 `opendesign-components` skill 的变更，供使用者判断是否需要重新安装。`SKILL.md` frontmatter 的 `last_update` 字段与本文件中最新条目日期对应。

分类：新增 / 更新 / 修正 / 移除 / ⚠️ 破坏性（破坏性表示按旧版 skill 已生成的产物失效或违规，需复核）。

---

## 2026-09-08

组件库基线由 v1.2.6 升级至 **v1.2.7**（同时覆盖 1.2.5-sp3 全部修复），SKILL.md 最低依赖版本提升为 ≥1.2.7，ReleaseNote 链接同步更新。

### 新增
- **OImageViewer 图片预览组件**（三文件）：全屏查看器，支持自动适屏、缩放/旋转/拖拽、多图无限循环切换、工具栏与进度指示器、移动端手势（swipe/pinch）、焦点陷阱等无障碍能力；`useImageViewer` 函数式调用；`layerOptions` 透传 OLayer 配置。
- **OTour 漫游引导组件**（三文件）：遮罩镂空聚光（`spotlightRadius` 支持 `'pill'` 与任意 CSS 长度）、分步引导（`v-model:current`）、非模态模式、步骤级属性覆盖、指示器/按钮区插槽、图片箭头取色；视口 ≤840px 不渲染。
- SKILL.md 组件索引与 mini-section 新增 OImageViewer、OTour；README 组件清单同步至 48 个。

### 更新
- **OSelect 能力增强**：数据驱动（`options`/`fieldNames`，扁平与分组）、搜索过滤（`filterable`/`filterOption`/`filterMethod`/远程搜索）、虚拟滚动（`virtual`）、创建选项（`allowCreate`/`tokenSeparators`）、多选增强（`limit` + `exceed-limit`、`change` 事件新增选中项第二参数、`renderTag`）、自定义渲染（`renderLabel`/`#option-label`/`#group-label`）、`fallbackOption` 异步回显兜底、暴露 `focus`/`blur`/`scrollTo`。
- **OForm 统一管控与校验增强**：表单级 `disabled`/`size`/`round`/`clearable` 经 useFormField 下发全部表单控件（控件自身设置优先）；全局 `rules` 与 `requiredIcon` 仅星号模式；FormItem 新增 `error`/`validateStatus`/`showMessage`；暴露 `scrollToField`/`validateField`/`setInitialValues`；`scrollToError` 自动滚动。
- **OFigure 预览层从 OLayer 切换至 OImageViewer**：`preview` 属性新增对象形式直接透传查看器配置；`#preview` 插槽作用域新增 `src`；预览层响应式规则随切换调整。
- **OPopup** 新增 `targetRect`（`VirtualElement`），支持无实际 DOM 时的定位计算。
- **OLayer** 暴露 `rootEl`/`mainEl` DOM 引用；关闭按钮响应式样式适配。
- **OScrollbar** `thumb`/`track` 插槽透传作用域参数 `{ direction, dragging }`；OVirtualList/OOption 内部改用 OScrollbar 组件渲染。
- **ODialog** 宽度由百分比改为 24 列栅格计算，重构响应式宽度策略。
- **表单继承系统覆盖控件**：OInput/OInputNumber/OTextarea/OSelect/OCheckbox(OGroup)/ORadio(OGroup)/OSwitch/OUpload/ODatePicker 系列/OTimePicker 系列的 `disabled`/`clearable`/`size` 等属性未设置时继承 OForm/OFormItem。各组件文档对继承属性仅做简要标注（默认值标「继承表单容器」），统一链接至 [form.usage.md] 的「OForm 表单级统一管控」说明，不在组件侧展开详细规则。
- OForm mini-section 同步上述属性继承与校验增强；OSelect mini-section 补充数据驱动/搜索/多选增强要点；OFigure mini-section 更新 preview 说明。

### 修正
- OLayer 三文件中 `transitionOrign` 统一修正为 `transitionOrigin`。
- OAvatar 彩色背景说明更新为按 `name` 确定性生成（不再随机），修复 SSR 水合不一致。
- 各组件 usage 版本变更记录补充修复项，并按「首次引入版本」标注：**1.2.5-sp3 即有的修复**（ODataTable SSR hydration 与筛选项响应式、OUpload 回显缩略图、OTab 移动端滚动与阴影移除）标注为「1.2.5-sp3 / 1.2.7」；**OInput onlyNumericInput**（1.2.5-sp2 引入，sp3 包含）标注为「1.2.5-sp2 / 1.2.7」；1.2.7 独有修复（OAnchor 底部选中、OPopover z-index、OLink RouterLink 解析时机、OAvatar 水合等）标注为「1.2.7」。1.2.5-sp3 线用户可按标注判断哪些内容适用。

### ⚠️ 破坏性
- **OForm `labelWidth` 默认值变更为 `'auto'`**（原无默认值，由 `--form-label-width: 20%` 兜底）：按旧版 skill 生成的水平表单在升级 @opensig/opendesign 至 1.2.7 后，未显式设置 `labelWidth` 的表单标签宽度将由 20% 变为自动测量（`--form-label-min-width: 96px` / `--form-label-max-width` 栅格值），需复核表单版式。
- **`OForm @validate` 事件废弃**：改用 `@validate-field({ field, isValid, message })`；旧事件 v1.2.7 起监听会输出废弃警告，当前版本保持兼容、暂无移除计划。按旧版 skill 生成的 `@validate` 监听代码建议复核迁移。
- **OLayer prop `transitionOrign` 拼写修正为 `transitionOrigin`**：旧名保留兼容但输出废弃警告，按旧版 skill 生成的 `transition-orign="css"` 用法建议复核改名。

## 2026-08-10

### ⚠️ 破坏性

- **组件参考文档按用途拆分为三文件**：每个组件原有的单文件 `{name}.md` 拆分为 `{name}.visual.md`（视觉识别：视觉特征指纹、Token→Prop 映射、易混淆组件区分）、`{name}.usage.md`（代码使用：API 表、代码模板、prop 组合速查、变更记录）、`{name}.style.md`（样式定制：CSS 变量、布局结构 YAML、响应式行为表）。SKILL.md 组件索引、Pixso MCP 设计稿识别指南、各组件 mini-section 链接均已同步更新。旧的单文件路径（如 `references/button.md`）不再存在，需改用 `references/{name}.{visual|usage|style}.md`。
- Part A 的自然语言属性/插槽/事件描述已合并进 usage 文件的正式表格，不再独立存在。两段式的设计稿识别指南（Part A 要点版 + Part B 详细版）已合并为 visual 文件中的唯一版本。

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
