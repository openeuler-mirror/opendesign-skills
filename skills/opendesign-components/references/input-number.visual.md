> ← [组件索引](../SKILL.md#组件索引) · [代码使用](input-number.usage.md) · [样式定制](input-number.style.md)

# OInputNumber 数字输入框 — 视觉识别

OInputNumber 是数字输入框组件，在普通输入框基础上增加了加减控制按钮，支持步进操作、最大最小值限制、自定义格式化显示。可与 OForm 配合实现自动校验。

🧩 **布局结构**：数字输入框基于 OInput 封装，整体水平排列。根据 controls 属性，加减按钮分布在输入框的 prepend（左侧）和/或 append（右侧）区域。controls="both"（默认）时左侧为减号按钮区域、右侧为加号按钮区域，按钮区域内上下各半排列（上箭头/下箭头）。controls="left"/"right" 时两个按钮集中在一侧上下排列。按钮区域最小宽度等于输入框高度。不同 size 有固定默认宽度（small 90px / medium 120px / large 160px），autoWidth 模式下宽度随内容变化。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [prepend(减号按钮区), input(数字输入区), append(加号按钮区)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 输入框 + 两侧有上下箭头按钮（左侧下箭头、右侧上箭头） → 匹配 OInputNumber controls="both"
2. 输入框 + 一侧有上下箭头按钮 → 匹配 OInputNumber controls="right" 或 "left"
3. 输入框 + 一侧有加号减号图标按钮（非箭头） → 匹配 OInputNumber controls="right"/"left"（单侧模式使用 ±图标）
4. 纯数字输入框无任何按钮 → 匹配 OInputNumber controls="none"

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 加减按钮位置 | 分列两侧 | controls | `'both'` | 默认 |
| 加减按钮位置 | 集中在右侧 | controls | `'right'` | — |
| 加减按钮位置 | 集中在左侧 | controls | `'left'` | — |
| 无加减按钮 | 不可见 | controls | `'none'` | — |
| 按钮颜色 | `--o-color-info3` | — | — | 默认态 |
| 按钮 hover 色 | `--o-color-info1` | — | — | 悬停态 |
| 按钮背景 hover | `--o-color-control1-light` | — | — | 悬停态 |
| 按钮灰色不可点击 | `--o-color-info4` + `--o-color-control4-light` | — | — | 达到 min/max 时 |
| 整体宽度 | 90px | size | `'small'` | autoWidth=false |
| 整体宽度 | 120px | size | `'medium'` | autoWidth=false |
| 整体宽度 | 160px | size | `'large'` | autoWidth=false |
| 边框/背景/圆角 | 同 OInput | variant/color/round | 同 OInput | 继承 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OInputNumber | OInput | OInputNumber 有加减控制按钮且仅接受数字，OInput 接受任意文本 |
| OInputNumber | OSlider | OSlider 有滑轨和拖拽手柄，OInputNumber 是输入框 + 按钮形式 |
| OInputNumber（controls="none"） | OInput | 外观近似，但 OInputNumber 仅接受数字输入（only-numeric-input），且值类型为 number |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 新增 `clearValue` prop，用于指定清空输入时的默认回退值 |
| v0.0.79 | 修复加减按钮宽度问题 |
