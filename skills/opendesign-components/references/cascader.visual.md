> ← [组件索引](../SKILL.md#组件索引) · [代码使用](cascader.usage.md) · [样式定制](cascader.style.md)

# OCascader 级联选择 — 视觉识别

OCascader 是级联选择器组件，让用户从一组树形结构的选项中逐层选择。选项以多列面板形式展开，每选择一级后自动展开下一级。包含 OCascader（完整选择器）和 OCascaderPanel（纯面板，可嵌入自定义容器）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），选项文字和图标缩小、内边距减少。

🧩 **布局结构**：由触发按钮（OSelect 选择器）和弹出面板（OCascaderPanel）两部分组成。触发按钮为行内块元素；弹出面板内部横向排列多列选项列表（ul），每选一级向右展开新列。每列内部纵向排列选项（li），非叶子选项右侧带展开箭头图标。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column (触发器 + 弹出层)
regions: [OSelect(触发按钮), cascader-panel(弹出面板 → 横向多列)]
```

### 设计稿识别指南

**视觉特征指纹**
1. 触发器为标准下拉选择器按钮（带右侧下拉箭头），点击后弹出面板
2. 弹出面板内横向并排多列选项列表，列之间有竖线分隔（`--o-color-control1-light`），选中一级后右侧展开下一级列
3. 非叶子选项右侧有 `>` 展开箭头图标（IconChevronRight），叶子选项无箭头

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值/范围 | 对应Prop | Prop值 | 备注 |
|-----------|---------|---------|--------|------|
| 按钮线框样式 | 有边框无填充 | variant | `'outline'` | 默认值 |
| 按钮实心填充 | 有背景色 | variant | `'solid'` | — |
| 按钮纯文字 | 无边框无背景 | variant | `'text'` | — |
| 按钮半圆圆角 | 两端为半圆弧 | round | `'pill'` | — |
| 按钮高度较大 | 大尺寸 | size | `'large'` | 默认值 |
| 按钮高度中等 | 中尺寸 | size | `'medium'` | — |
| 按钮高度较小 | 小尺寸 | size | `'small'` | — |
| 面板在按钮下方左对齐 | 默认弹出位置 | optionPosition | `'bl'` | 默认值 |
| 悬停即展开子级 | hover 展开 | expandTrigger | `'hover'` | — |
| 选项字号 text1 | 标准字号 | — | — | >1200px 默认 |
| 选项字号 tip1 | 缩小字号 | — | — | ≤1200px 响应式 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|------------|
| OCascader | OSelect（选择器） | OCascader 弹出面板是横向多列逐级展开，OSelect 只有单列下拉列表 |
| OCascader | ODropdown（下拉菜单） | OCascader 面板多列带级联选择逻辑，ODropdown 为单列操作菜单 |
