> ← [组件索引](../SKILL.md#组件索引) · [代码使用](collapse.usage.md) · [样式定制](collapse.style.md)

# OCollapse 折叠面板 — 视觉识别

OCollapse 是折叠面板组件，用于将内容分组后折叠/展开显示，节省页面空间。包含 OCollapse（容器）和 OCollapseItem（面板项）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），容器内边距缩小、标题和正文字号缩小、内容区域间距减少。在平板竖屏及以下（≤840px），容器内边距进一步缩小、圆角变小、标题区域内边距减少。

🧩 **布局结构**：OCollapse 为纵向堆叠容器，内部包含多个 OCollapseItem。每个 Item 由标题行（header）和内容区域（body）纵向排列组成；标题行内部使用 flex row-reverse 布局，标题文字在左、展开图标在右（通过 space-between 实现）。各 Item 之间通过底部分割线分隔。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column
regions: [OCollapseItem, OCollapseItem, ...]
item-direction: column
item-regions: [header(row-reverse: title + icon), body]
```

### 设计稿识别指南

**视觉特征指纹**

1. 圆角矩形容器（浅灰背景 `--o-color-fill2`），内部包含多个面板项，项之间有水平分割线（`--o-color-control4`）
2. 每个面板项的标题行由左侧文字和右侧 V 形箭头图标组成（flex row-reverse + space-between 实现）
3. 展开态的面板标题变为主题色（`--o-color-primary1`）、字重加粗（600），箭头图标旋转 180 度（从朝下变为朝上）；内容区域通过高度过渡动画展开

**设计 Token → Prop 值映射表**

| 设计稿 Token / 视觉特征 | 对应 Prop / 配置 | 说明 |
|---|---|---|
| 容器背景 `--o-color-fill2` | 默认样式，无需配置 | 组件默认外观 |
| 展开标题色 `--o-color-primary1` | `modelValue` 包含该项 value | 展开态自动变色 |
| 同时只展开一项 | `accordion` | 手风琴模式 |
| 某些项初始展开 | `defaultValue` 或 `v-model` | 控制初始展开项 |
| 自定义标题区域（含图标等） | `#title` 插槽 | 替换纯文字标题 |

**易混淆组件区分表**

| 组件 A | 组件 B | 区分标准 |
|--------|--------|---------|
| OCollapse | OTab | Collapse 纵向折叠展开，标题在每项顶部；Tabs 横向标签页切换，标签在顶部/底部统一排列 |
| OCollapse (accordion) | OCollapse (默认) | 手风琴模式同时只展开一项；默认模式可同时展开多项 |
| OCollapse | `<details>`（HTML 原生） | OCollapse 提供统一容器管理多面板状态；原生 `<details>` 各自独立、无法联动 |
