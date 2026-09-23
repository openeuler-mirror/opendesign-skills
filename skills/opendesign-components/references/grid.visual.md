> ← [组件索引](../SKILL.md#组件索引) · [代码使用](grid.usage.md) · [样式定制](grid.style.md)

# ORow/OCol 栅格布局 — 视觉识别

OpenDesign 栅格系统基于 Flex 布局，用于页面内容的多列排版和响应式布局，由 ORow（行容器）和 OCol（列容器）组成。核心特点是支持按断点设置不同的间距和列宽。

📱 **响应式行为**：本组件本身就是响应式布局工具。通过 pcS（≤1680px）、laptop（≤1440px）、pad（≤1200px）、padV（≤840px）、phone（≤600px）属性，可以在不同断点设置不同的间距和列宽。

🧩 **布局结构**：ORow（`.o-row`）为 flex 容器，通过负 margin 抵消子元素的 padding 实现间距（非 CSS gap）。OCol（`.o-col`）通过 CSS 变量 `--col-flex` 控制弹性布局。间距通过 `--row-gap-x`/`--row-gap-y` 传递给子元素的 padding-left/right 和 margin-bottom。各断点通过媒体查询切换对应的 CSS 变量。
```yaml
# 简化结构摘要（完整版见 Part B）
ORow: display flex, gap via negative-margin + child-padding
OCol: flex: --col-flex, 断点覆盖 --col-{bp}-flex
```

### 设计稿识别指南

**视觉特征指纹**

1. 多列等分或不等分排列的内容区域，列之间有均匀的横向间距，行之间有均匀的纵向间距
2. 间距通过子元素的 padding 实现（非 CSS gap），ORow 使用负 margin 抵消首尾列多余的 padding
3. 不同屏幕宽度下列数和间距可变化（如桌面三列→平板两列→手机单列）
4. ORow 默认 flex-wrap: wrap，子元素超出宽度时自动换行
5. OCol 默认 flex: 1 0 auto，即自动撑满可用空间

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop (ORow) | Prop 值 |
|---------|---------------|-------------|--------|
| 列间距 24px | --row-gap-x | `gap` 或 `gapX` | `"24px"` |
| 行间距 16px | --row-gap-y | `gap` 或 `gapY` | `"16px"` |
| 横纵间距相同 | --row-gap-x/y | `gap` | `"24px"` |
| 横纵间距不同 | 分别设置 | `gap` | `"24px 16px"` (横 纵) |
| 居中对齐 | align-items: center | `align` | `"center"` |
| 两端对齐 | justify-content: space-between | `justify` | `"space-between"` |
| 不换行 | flex-wrap: nowrap | `wrap` | `"nowrap"` |
| 纵向排列 | flex-direction: column | `direction` | `"column"` |
| 小屏间距缩小 | 断点覆盖 | `phone` / `padV` 等 | `{ gap: "16px" }` |

| 设计特征 | Token / 视觉值 | Prop (OCol) | Prop 值 |
|---------|---------------|-------------|--------|
| 等分三列 | flex: 0 0 33.33% | `flex` | `"0 0 33.33%"` |
| 等分两列 | flex: 0 0 50% | `flex` | `"0 0 50%"` |
| 固定宽度列 | flex: 0 0 240px | `flex` | `"0 0 240px"` |
| 自适应撑满 | flex: 1 | `flex` | `"1"` |
| 小屏变单列 | 断点覆盖 | `phone` | `{ flex: "0 0 100%" }` |
| 平板变两列 | 断点覆盖 | `padV` | `{ flex: "0 0 50%" }` |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| OForm (layout=h) | 都可实现左右排列 | Grid 是通用多列栅格系统，无表单语义；Form 专用于标签-控件对齐，有校验系统和 submit 事件 |
| CSS Grid / Flexbox | 都实现多列布局 | ORow/OCol 封装了断点响应式 prop（pcS/laptop/pad/padV/phone），无需手写媒体查询；纯 CSS 需自行处理 |
| ORow + 普通 div | 都可包含子元素 | OCol 提供断点级 flex 覆盖，普通 div 无内置响应式切换能力 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 新增 1680px 断点支持，ORow/OCol 新增 `pcS` prop |
