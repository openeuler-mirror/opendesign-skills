> ← [组件索引](../SKILL.md#组件索引) · [代码使用](virtual-list.usage.md) · [样式定制](virtual-list.style.md)

# OVirtualList 虚拟滚动列表 — 视觉识别

OVirtualList 是虚拟滚动列表组件，用于高性能渲染大量数据（万级别）。通过只渲染可视区域内的列表项，避免 DOM 数量过多导致的性能问题。支持垂直/水平布局、固定高度（数字或按项函数）和不定高度三种模式、数据量阈值控制、对齐策略滚动、内置滚动条。

📱 **响应式行为**：本组件无响应式差异。

🧩 **布局结构**：虚拟列表由三层嵌套结构组成。最外层是固定高度的容器（o-virtual-list），中间是带有滚动条的滚动容器（o-virtual-list-wrapper），内部是按总列表高度撑开的虚拟占位体（o-virtual-body），其中仅渲染可视区域的列表项（o-virtual-render-list），通过 translateY 偏移定位到正确的滚动位置。每个列表项由 default 插槽渲染。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [wrapper(滚动容器) > body(虚拟高度占位) > render-list(可视区域列表项)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 固定高度的滚动区域 + 内含大量重复结构的列表项 + 右侧滚动条 → 候选 OVirtualList（数据量大时）
2. 从设计稿视觉上无法区分普通列表与虚拟列表，应根据预期数据量（百条以上）决定使用
3. 列表项高度一致 → 推荐使用 itemSize 固定高度模式

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 列表项高度 | 所有项等高 N px | itemSize | `N` | 性能最优 |
| 列表项高度 | 不等高 | defaultItemSize | 预估值（默认 80） | 动态测量 |
| 滚动条 | 有 | scrollbar | `true` | 默认 |
| 滚动条 | 无 | scrollbar | `false` | — |
| 滚动条外观 | 小号/悬浮时显示 | scrollbar | `{ size: 'small', showType: 'hover' }` | — |
| 初始位置 | 从第 N 项开始 | defaultStartIndex | `N` | — |
| 容器高度 | 固定高度（如 400px） | — | CSS style | 必须外部设置 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OVirtualList | 普通 v-for 列表 | 数据量大（百条以上）时用 OVirtualList 优化性能，少量数据用普通列表 |
| OVirtualList | OScrollbar | OVirtualList 包含虚拟滚动逻辑 + 内置滚动条，OScrollbar 仅提供自定义滚动条样式 |
| OVirtualList | OTable（虚拟滚动） | OTable 是表格组件有列定义和表头，OVirtualList 是通用列表无表格结构 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | 重构虚拟滚动核心：`itemSize` 支持函数（按项定高模式）；新增 `layout` 属性支持水平滚动；新增 `threshold` 属性控制虚拟化阈值；`scrollToView` 的 `align` 参数支持数字偏移量；新增 `scrollToOffset` 方法 |
| v0.0.70 | 新增 OVirtualList 组件；支持动态追加数据、renderChange 事件、defaultItemSize；scrollToIndex 更名为 scrollToView |
