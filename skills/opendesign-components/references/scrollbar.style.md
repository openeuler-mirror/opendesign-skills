> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](scrollbar.visual.md) · [代码使用](scrollbar.usage.md)

# OScrollbar 滚动条 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--scrollbar-bg-color` | `transparent` | 滚动条整体背景色 |
| `--scrollbar-track-bg-color` | `var(--o-color-control4)` | 轨道背景色 |
| `--scrollbar-track-width` | `6px`（medium） | 轨道宽度 |
| `--scrollbar-thumb-bg-color` | `var(--o-color-control1)` | 滑块默认颜色 |
| `--scrollbar-thumb-bg-color-hover` | `var(--o-color-info3)` | 滑块悬停颜色 |
| `--scrollbar-thumb-bg-color-active` | `var(--o-color-info2)` | 滑块拖拽中颜色 |
| `--scrollbar-thumb-width` | `6px`（medium） | 滑块默认宽度 |
| `--scrollbar-thumb-width-hover` | `10px`（medium） | 滑块悬停时宽度 |
| `--scrollbar-thumb-radius` | `10px`（medium） | 滑块圆角 |
| `--scrollbar-width` | `16px`（medium） | 滚动条轨道区域总宽度 |
| `--scrollbar-thumb-min-size` | `10px` | 滑块最小尺寸 |
| `--scrollbar-height` | `90%` | 垂直滑块默认高度比例 |
| `--scrollbar-delay` | `16ms` | 滚动条响应延迟 |

**使用示例**：
```vue
<OScroller style="height: 300px; --scrollbar-thumb-bg-color: var(--o-color-primary1);">
  <div style="height: 1000px;">长内容</div>
</OScroller>
```

---

### CSS 变量

| 变量名 | 说明 |
|--------|------|
| `--scrollbar-thumb-bg-color` | 滑块颜色 |
| `--scrollbar-thumb-bg-color-hover` | 滑块悬停颜色 |
| `--scrollbar-thumb-bg-color-active` | 滑块拖拽颜色 |
| `--scrollbar-track-bg-color` | 轨道颜色 |
| `--scrollbar-thumb-width` | 滑块宽度（medium: 6px, small: 3px） |
| `--scrollbar-thumb-width-hover` | 滑块悬停宽度（medium: 10px, small: 6px） |

---

### 响应式行为表

本组件无响应式差异。

---

### 组件布局结构

**OScrollbar 滚动条**
```yaml
layout:
  tag: div
  position: absolute  # 覆盖在关联的滚动容器上
  class: o-scrollbar o-scrollbar-{size}
  regions:
    - name: scrollbar-rail-y
      condition: hasY && !disabledX
      position: absolute
      placement: right side of container
      top: var(--scrollbar-y-top)  # 0
      bottom: var(--scrollbar-y-bottom)  # 0
      right: var(--scrollbar-y-right)  # 0
      width: var(--scrollbar-width)  # 16px
      children:
        - name: scrollbar-track
          bg-color: var(--scrollbar-track-bg-color)  # control4
          width: var(--scrollbar-track-width)  # medium: 6px, small: 3px
          children:
            - { type: slot, name: track }
        - name: scrollbar-thumb
          bg-color: var(--scrollbar-thumb-bg-color)  # control1
          width: var(--scrollbar-thumb-width)  # medium: 6px, small: 3px
          width-hover: var(--scrollbar-thumb-width-hover)  # medium: 10px, small: 6px
          border-radius: var(--scrollbar-thumb-radius)  # medium: 10px, small: 6px
          min-size: var(--scrollbar-thumb-min-size)  # 10px
          children:
            - { type: slot, name: thumb }
    - name: scrollbar-rail-x
      condition: hasX && !disabledY
      position: absolute
      placement: bottom of container
      left: var(--scrollbar-x-left)  # 0
      right: var(--scrollbar-x-right)  # 0
      bottom: var(--scrollbar-x-bottom)  # 0
      height: var(--scrollbar-width)  # 16px
      children:
        - name: scrollbar-track (horizontal)
        - name: scrollbar-thumb (horizontal)
  show-modes:
    always: 滚动条始终可见
    auto: 滚动时和悬停滚动条时显示，停止后 duration ms 隐藏
    hover: 鼠标悬停滚动容器时显示
    never: 不渲染滚动条
```

**OScroller 一体化滚动组件**
```yaml
layout:
  tag: div
  class: o-scroller o-scrollbar-wrapper
  regions:
    - name: scroller-container
      description: 滚动内容容器
      overflow: auto
      class: o-scroller-container
      children:
        - { type: slot, name: default }  # 滚动内容
    - name: scrollbar
      type: component
      component: OScrollbar
      target: scroller-container
      description: 自动关联内部滚动容器的滚动条
```
