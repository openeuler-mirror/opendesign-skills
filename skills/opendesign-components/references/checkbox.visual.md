> ← [组件索引](../SKILL.md#组件索引) · [代码使用](checkbox.usage.md) · [样式定制](checkbox.style.md)

# OCheckbox 多选框 — 视觉识别

OCheckbox 是多选框组件，让用户在一组选项中勾选一个或多个。可单独使用，也可配合 OCheckboxGroup 实现多选框组。支持半选状态（用于"全选"场景）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），多选框文字和行高缩小。

🧩 **布局结构**：单个 OCheckbox 为 label 元素，内部横向排列——左侧方形勾选框图标区 + 右侧文字标签。OCheckboxGroup 为 div 容器，根据 direction 属性水平（flex-direction: row）或垂直（flex-direction: column）排列内部的 OCheckbox 子项。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: row (单个 checkbox 内部)
regions: [checkbox-input-wrap(勾选框图标), checkbox-label(文字标签)]
# OCheckboxGroup
direction: row | column (由 direction prop 决定)
regions: [OCheckbox, OCheckbox, ...]
```

### 设计稿识别指南

**视觉特征指纹**
1. 小方形勾选框（带圆角 `--o-radius_control-xs`），未选中时白色/浅色背景 + 灰色边框；选中时填充主题色（`--o-color-primary1`）并显示白色勾号图标
2. 勾选框右侧紧跟文字标签，间距 8px
3. 半选状态（indeterminate）时，方框填充主题色但内部显示一条白色横线而非勾号

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值/范围 | 对应Prop | Prop值 | 备注 |
|-----------|---------|---------|--------|------|
| 方框填充主题色+勾号 | 选中态 | modelValue | 包含该 value | — |
| 方框白色+灰色边框 | 未选中态 | modelValue | 不含该 value | — |
| 方框主题色+横线 | 半选态 | indeterminate | `true` | 通常用于全选控件 |
| 方框灰色+不可点击 | 禁用态 | disabled | `true` | — |
| 多个勾选框水平排列 | 间距 24px | direction | `'h'` | OCheckboxGroup 默认 |
| 多个勾选框垂直排列 | 间距 16px | direction | `'v'` | OCheckboxGroup |
| 文字标签字号 text1 | 标准字号 | — | — | >1200px 默认 |
| 文字标签字号 tip1 | 缩小字号 | — | — | ≤1200px 响应式 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|------------|
| OCheckbox | ORadio（单选框） | OCheckbox 为方形可多选，ORadio 为圆形只能单选 |
| OCheckbox | OSwitch（开关） | OCheckbox 是方形带勾号，OSwitch 是椭圆形滑块切换 |
| OCheckbox | OTag（标签）可选模式 | OCheckbox 有明显的方形勾选框图标，OTag 为文字标签带背景色 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | 调整勾选框图标中心颜色变量 |
