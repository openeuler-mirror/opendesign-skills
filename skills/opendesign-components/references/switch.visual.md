> ← [组件索引](../SKILL.md#组件索引) · [代码使用](switch.usage.md) · [样式定制](switch.style.md)

# OSwitch 开关 — 视觉识别

OSwitch 是开关组件，用于两种状态之间的切换。支持自定义选中/未选中值、加载状态、切换前拦截、自定义滑块图标和状态文字。

📱 **响应式行为**：本组件无响应式差异。

🧩 **布局结构**：开关为水平排列容器，内部包含滑块轨道（wrap）和可选文字标签。轨道内有一个圆形滑块（handler），滑块内可显示图标（active/inactive 插槽）或加载动画。开启时滑块滑向右侧，轨道背景变为品牌色；关闭时滑块在左侧，轨道背景为灰色。文字标签（on/off 插槽）显示在轨道右侧。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [wrap(handler(icon) + label(on/off文字))]
```

### 设计稿识别指南

**视觉特征指纹**

1. 圆角矩形轨道（宽约 40px，高约 32px）+ 内嵌白色圆形滑块 → 匹配 OSwitch
2. 滑块在左侧 + 灰色轨道 → 关闭状态
3. 滑块在右侧 + 蓝色/品牌色轨道 → 开启状态
4. 滑块内有旋转图标 → loading=true
5. 轨道右侧有文字（ON/OFF 等） → 使用 on/off 插槽

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 轨道高度 | 32px（control_size-s） | size | `'medium'` | 默认 |
| 轨道高度 | 24px（control_size-xs） | size | `'small'` | — |
| 轨道宽度 | ≥40px | size | `'medium'` | 默认 |
| 轨道宽度 | ≥28px | size | `'small'` | — |
| 圆角 | 全圆角（半圆） | round | `'pill'` | — |
| 轨道背景色 | `--o-color-primary1` 蓝色 | — | — | checked 状态 |
| 轨道背景色 | `--o-color-control1-light` 灰色 | — | — | unchecked 状态 |
| 滑块内图标 | 旋转加载 | loading | `true` | — |
| 整体灰色半透明 | — | disabled | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OSwitch | OCheckbox | OCheckbox 是方形勾选框+右侧文字标签，OSwitch 是圆角矩形轨道+滑动圆形滑块 |
| OSwitch | ORadio | ORadio 是圆形单选按钮组（多选一），OSwitch 是单个二态切换器 |
| OSwitch | OButton（toggle） | OButton 是矩形按钮点击交互，OSwitch 有滑动轨道和圆形滑块的特征视觉 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | 调整 medium 尺寸 CSS 变量 |
| v1.1.0 | 新增 `active`/`inactive` 插槽用于滑块图标切换；修复非受控模式 modelValue 问题 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | 调整 medium 尺寸 CSS 变量 |
| v1.1.0 | 新增 `active`/`inactive` 插槽用于滑块图标切换；修复非受控模式 modelValue 问题 |
