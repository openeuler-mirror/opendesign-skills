> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](icon.visual.md) · [代码使用](icon.usage.md)

# OIcon 图标 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--icon-size` | `1em` | 图标容器尺寸（默认继承外层 font-size） |
| `--icon-btn-color` | `var(--o-color-info1)` | 图标按钮默认颜色 |
| `--icon-btn-color-hover` | `var(--o-color-info2)` | 图标按钮悬停颜色 |
| `--icon-btn-color-active` | `var(--o-color-info3)` | 图标按钮激活/聚焦颜色 |
| `--icon-btn-color-disabled` | `var(--o-color-info4)` | 图标按钮禁用颜色 |

**使用示例**：
```vue
<OIcon :icon="OIconAdd" button style="--icon-size: 24px; --icon-btn-color: var(--o-color-brand1)" />
```

---

### 响应式行为表

无。OIcon 组件不包含响应式断点逻辑，图标大小由外层 font-size 决定。

---

### 组件布局结构

**所有尺寸（无断点差异）**
```yaml
layout:
  display: inline-flex
  align: center
  justify: center
  font-size: var(--icon-size)  # 默认 1em，继承外层 font-size
  regions:
    - name: default
      children:
        - { type: slot, name: default }  # 优先插槽
        - { type: component, name: IconLoading, condition: "loading=true 且无插槽" }  # 旋转动画
        - { type: component, name: "icon prop", condition: "loading=false 且无插槽" }  # icon 属性指定的图标
  variants:
    button-mode:
      color: var(--icon-btn-color)  # var(--o-color-info1)
      cursor: pointer
      hover: { color: var(--icon-btn-color-hover) }  # var(--o-color-info2)
      active: { color: var(--icon-btn-color-active) }  # var(--o-color-info3)
    disabled:
      cursor: not-allowed
      color: var(--icon-btn-color-disabled)  # var(--o-color-info4)
```
