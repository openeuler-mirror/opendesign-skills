> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](popover.visual.md) · [代码使用](popover.usage.md)

# OPopover 气泡卡片 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--popup-bg-color` | `var(--o-color-fill2)` | 气泡背景色 |
| `--popup-shadow` | `var(--o-shadow-1)` | 气泡阴影 |
| `--popup-radius` | `var(--o-radius_control-s)` | 气泡圆角 |
| `--popup-bd` | `1px solid var(--o-color-control4)` | 气泡边框 |
| `--popup-padding` | `9px 16px` | 气泡内边距 |
| `--popover-text-color` | `var(--o-color-info1)` | 气泡文字颜色 |
| `--popover-text-size` | `var(--o-font_size-tip1)` | 气泡文字字号 |
| `--popover-text-height` | `var(--o-line_height-tip1)` | 气泡文字行高 |

**使用示例**:
```vue
<OPopover wrap-class="my-popover">
  提示内容
  <template #target><OButton>悬停</OButton></template>
</OPopover>

<style>
.my-popover { --popup-padding: 12px 20px; --popup-radius: 8px; }
</style>
```

---

### CSS 变量

| 变量名 | 说明 |
|--------|------|
| `--popup-padding` | 内边距 |
| `--popup-bg-color` | 背景色 |
| `--popup-shadow` | 阴影 |
| `--popup-radius` | 圆角 |
| `--popup-bd` | 边框 |

---

### 响应式行为表

| 维度 | ≤1440px | >1440px |
|------|---------|---------|
| 文字 | tip2 | 标准 |
| 内边距 | 7px 12px | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  parts:
    - name: target
      children:
        - { type: slot, name: target }  # 触发元素
    - name: popup-layer  # 通过 Teleport 挂载到 wrapper（默认 body）
      position: absolute  # 根据 position prop 计算定位
      z-index: 动态递增
      transition: o-zoom-fade
      regions:
        - name: wrap
          class: o-popover-wrap
          background: var(--o-color-fill2)
          shadow: var(--o-shadow-1)
          border: 1px solid var(--o-color-control4)
          border-radius: var(--o-radius_control-s)
          padding: 9px 16px  # --popup-padding
          children:
            - name: body
              children:
                - { type: div, wraps: slot.default }  # 内容被 div 包裹（$attrs 绑定）
            - name: anchor
              condition: anchor === true  # 默认开启
              class: o-popover-anchor
              type: 三角箭头指向目标
  defaults:
    trigger: hover  # 与 OPopup 的 click 不同
    anchor: true    # 与 OPopup 的 false 不同
    offset: 8px     # 与 OPopup 的 0 不同
  text:
    color: var(--o-color-info1)
    font-size: var(--o-font_size-tip1)
    line-height: var(--o-line_height-tip1)
```

**≤1440px (laptop)**
```yaml
# text-size: tip2
# padding: 7px 12px
```
