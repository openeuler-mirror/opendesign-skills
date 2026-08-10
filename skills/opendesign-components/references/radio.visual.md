> ← [组件索引](../SKILL.md#组件索引) · [代码使用](radio.usage.md) · [样式定制](radio.style.md)

# ORadio 单选框 — 视觉识别

ORadio 是单选框组件，让用户从多个选项中选择一个。包含 ORadio（单选框）和 ORadioGroup（单选框组）。支持受控/非受控模式、禁用状态、自定义渲染。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），单选框文字缩小。

🧩 **布局结构**：单个 ORadio 为 label 元素，内部横向排列——左侧圆形选中指示器区 + 右侧文字标签。ORadioGroup 为 div 容器，根据 direction 属性水平（flex-direction: row）或垂直（flex-direction: column）排列内部的 ORadio 子项。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: row (单个 radio 内部)
regions: [radio-input-wrap(圆形指示器), radio-label(文字标签)]
# ORadioGroup
direction: row | column (由 direction prop 决定)
regions: [ORadio, ORadio, ...]
```

### 设计稿识别指南

**视觉特征指纹**

1. 小圆形空心指示器 + 右侧文字标签 → 匹配 ORadio（未选中）
2. 圆形填充主题色 + 中心白色圆点 + 右侧文字标签 → 匹配 ORadio（选中）
3. 多个单选框水平/垂直排列、互斥选择 → 匹配 ORadioGroup

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 指示器状态 | 填充主题色 + 白色圆点 | modelValue | 等于该项 value | 选中态 |
| 指示器状态 | 空心灰色边框 | modelValue | 不等于该项 value | 未选中态 |
| 整体颜色 | 灰色不可交互 | disabled | `true` | — |
| 排列方向 | 水平排列 | direction | `'h'` | 默认值 |
| 排列方向 | 垂直排列 | direction | `'v'` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ORadio | OCheckbox | ORadio 圆形指示器、互斥单选；OCheckbox 方形带勾号、可多选 |
| ORadioGroup | OSelect | ORadioGroup 所有选项同时可见平铺展示；OSelect 选项隐藏在下拉面板中 |
| ORadio（自定义插槽） | OToggle | OToggle 是独立分段切换器；ORadio #radio 插槽自定义后也可呈现卡片式但语义仍为单选 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | 调整图标中心颜色变量 |
