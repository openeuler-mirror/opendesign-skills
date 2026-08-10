> ← [组件索引](../SKILL.md#组件索引) · [代码使用](toggle.usage.md) · [样式定制](toggle.style.md)

# OToggle 选择块 — 视觉识别

OToggle 是选择块组件（按钮式切换），用于表示选中/未选中状态。可独立使用，也可作为 OCheckbox 或 ORadio 的自定义渲染载体。支持圆角、前缀图标、禁用。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），按钮高度缩至 28px，文字和图标缩小；在平板竖屏及以下（≤840px），内边距进一步减小。

🧩 **布局结构**：选择块内部水平排列，从左到右依次为：前缀图标区（可选）、文字内容区。有 checked/unchecked 两种视觉状态，选中时显示品牌色边框，未选中时为灰色填充背景。按钮高度 36px（桌面端），水平内边距 15px，图标与文字间距 4px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [prefix(前缀图标), default(文字内容)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 矩形按钮式选项块 + 有选中（蓝色边框+蓝色文字）和未选中（灰色填充背景）两种状态 → 匹配 OToggle
2. 一组按钮式选项排列，可多选或单选 → 匹配 OToggle（配合 OCheckboxGroup 或 ORadioGroup）
3. 胶囊形选择标签 + 有选中态切换 → 匹配 OToggle（round="pill"）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选中态边框 | `--o-color-primary1` 蓝色 | checked | `true` | v-model:checked |
| 选中态文字 | `--o-color-primary1` 蓝色 | checked | `true` | — |
| 未选中态背景 | `--o-color-fill1` 灰色 | checked | `false` | — |
| 前缀图标 | 有 | icon | 组件引用 | 或 #icon 插槽 |
| border-radius | 全圆角 | round | `'pill'` | — |
| 灰色不可点击 | 有 | disabled | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OToggle | OButton | OButton 触发操作无选中/未选中状态切换，OToggle 用于状态选择 |
| OToggle | OSwitch | OSwitch 是滑动开关形态（椭圆轨道+圆形滑块），OToggle 是矩形按钮形态 |
| OToggle | OTag | OTag 是静态标签无选中状态交互，OToggle 可切换选中状态 |
| OToggle | OCheckbox | OCheckbox 是勾选框形态（方框+勾号），OToggle 是按钮块形态；OToggle 可作为 OCheckbox 的子组件渲染 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 刷新笔记本/平板竖屏尺寸；round prop 支持非 pill 值 |
