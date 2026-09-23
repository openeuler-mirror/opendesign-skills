> ← [组件索引](../SKILL.md#组件索引) · [代码使用](cascader-v2.usage.md) · [样式定制](cascader-v2.style.md)

# OCascaderV2 级联选择器（V2） — 视觉识别

OCascaderV2 是级联选择器的 PC 重构版本（与原 OCascader 完全独立），支持单选/多选、可搜索、懒加载、选择前拦截、路径值模式、任意层级选中、多级面板横向排列等完整功能。由 OCascaderV2（选择器触发器）+ OCascaderV2Panel（下拉面板）+ OCascaderV2Label（选项行渲染）三组件协作。

📱 **响应式行为**：有 media.scss 断点规则。

- **pad_v ~ laptop 区间**：large 选择框高度缩小为 36px、图标缩小为 control-s、字号 tip1；large 面板选项 padding 缩小为 6px 12px、字号 tip1、图标缩小为 s；medium 选择框高度缩小为 28px、图标 control-xs、字号 tip1；medium 面板选项 padding 缩小为 2px 12px、字号 tip1、图标 xs。
- 触控设备 expandTrigger 强制降级为 click。

🧩 **布局结构**：OCascaderV2 根元素为 InBox（继承 InBox 的边框/圆角/颜色/尺寸系统），内含 OScroller 包裹的值展示区域（单选为 input、多选为 tag 列表 + input）+ 后缀图标区域（clear/loading/arrow）。浮层通过 OPopup 定位，内部 OCascaderV2Panel 为多列水平排列，每列由 OScroller + ul.o-cascader-v2-options 组成，列间有 ODivider(direction=v) 分隔。filterable 模式下面板切换为搜索结果列表。
```yaml
# 简化结构摘要
direction: OCascaderV2 为水平inline-flex(InBox); Panel 为多列横向flex+分隔线
regions(OCascaderV2): [value-list(值展示/input/tags), suffix-icon(clear/loading/arrow)]
regions(Panel): [column*1~N(各级菜单列, OScroller+ul+li+OCascaderV2Label), divider(v分隔线*0~N-1)]
note: 筛选模式下面板变为单列搜索结果列表；OCascaderV2Label 内含 ORadio/OCheckbox(多选/allowSelectAnyNode) + 文本 + 展开箭头
```

### 设计稿识别指南

**视觉特征指纹**

1. 选择框（类似 Select）+ 下拉后多列横向排列菜单（列间竖分隔线） → OCascaderV2
2. 多列菜单中非叶子节点右侧有箭头 → OCascaderV2（expandTrigger:click/hover）
3. 选项左侧有 Checkbox → OCascaderV2（multiple=true）
4. 选项左侧有 Radio → OCascaderV2（!multiple + allowSelectAnyNode=true）
5. 输入框可编辑搜索 + 面板变为单列搜索结果 + 关键词高亮 → OCascaderV2（filterable=true）
6. 非叶子节点半选态（Checkbox indeterminate） → OCascaderV2（multiple + !allowSelectAnyNode）
7. 懒加载节点显示旋转 loading 图标 → OCascaderV2（lazy=true）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选择框边框 | 有边框 | variant | `'outline'` | 默认 |
| 选择框背景 | 实心填充 | variant | `'solid'` | — |
| 选择框无边框 | 纯文字 | variant | `'text'` | — |
| 圆角 | 全圆角 | round | `'pill'` | — |
| 尺寸 | 大号 | size | `'large'` | 默认 |
| 尺寸 | 中号 | size | `'medium'` | — |
| 选项有 Checkbox | 多选 | multiple | `true` | — |
| 选项有 Radio | 单选任意节点 | allowSelectAnyNode | `true` | — |
| hover 展开子级 | 悬停展开 | expandTrigger | `'hover'` | 触控降级为click |
| 输入框显示全路径 | 浙江/杭州/西湖 | showAllLevels | `true` | 默认 |
| 输入框只显示叶子 | 西湖 | showAllLevels | `false` | — |
| 可搜索 | 输入框可编辑 | filterable | `true` | — |
| 清除按钮 | 右侧 × 图标 | clearable | `true` | — |
| 加载状态 | 旋转加载图标 | loading | `true` | — |
| 父节点半选 | Checkbox indeterminate | — | multiple + !allowSelectAnyNode 自动 | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OCascaderV2 | OCascader | V2 面板为多列横向排列（列间竖分隔线），旧版为树形展开 |
| OCascaderV2 | OSelect | Cascader 是级联多级选择，Select 是单级选择 |
