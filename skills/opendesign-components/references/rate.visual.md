> ← [组件索引](../SKILL.md#组件索引) · [代码使用](rate.usage.md) · [样式定制](rate.style.md)

# ORate 评分 — 视觉识别

ORate 是评分组件，用于展示或收集用户评分。默认以星星图标展示，支持半星选择、可清空、只读、自定义图标、文字提示等功能。

📱 **响应式行为**：本组件无响应式差异。

🧩 **布局结构**：ORate 为水平排列的评分图标行。根容器是 div，内部水平排列 count 个评分图标项（ORateItem），图标间有固定间距。每个图标项支持整星或半星交互。带 labels 时每个图标外包一层 OPopover 气泡提示。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: row
regions: [rate-item(星星图标) × count]
variants: { large: icon-size l + gap 12px, medium: icon-size xs + gap 8px }
```

### 设计稿识别指南

**视觉特征指纹**

1. 一排等间距星星图标，部分填充彩色、部分灰色 → 匹配 ORate
2. 星星图标左半彩色右半灰色 → 匹配 ORate（allowHalf 半星模式）
3. 星星图标上方有文字气泡提示 → 匹配 ORate（带 labels）
4. 非星星的自定义图标一排排列有填充/空状态 → 匹配 ORate（自定义 icon 插槽）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选中颜色 | 黄色（`--o-yellow-6`） | color | `'normal'` | 默认值 |
| 选中颜色 | 品牌蓝（`--o-color-main1`） | color | `'primary'` | — |
| 选中颜色 | 绿色（`--o-color-success1`） | color | `'success'` | — |
| 选中颜色 | 橙色（`--o-color-warning1`） | color | `'warning'` | — |
| 选中颜色 | 红色（`--o-color-danger1`） | color | `'danger'` | — |
| 图标尺寸 | 大（控件 l） | size | `'large'` | — |
| 图标尺寸 | 小（控件 xs） | size | `'medium'` | — |
| 图标间距 | 12px | size | `'large'` | — |
| 图标间距 | 8px | size | `'medium'` | — |
| 半星填充 | 左半彩色右半灰色 | allowHalf | `true` | — |
| 星星数量 | 非 5 个 | count | 对应数值 | 默认 5 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ORate | OSlider | ORate 是离散图标点选（星星），OSlider 是连续轨道拖拽 |
| ORate | 图标列表 | ORate 图标有填充/未填充关联状态且可交互，纯图标列表无此联动 |
| ORate（readonly） | 静态图标展示 | ORate readonly 仍是组件渲染有语义结构，纯展示通常为静态 SVG/img -->

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 优化星级图标，主色使用 `--o-color-main1` |
| v1.0.1-sp1 | 空星样式改为空心星 |
