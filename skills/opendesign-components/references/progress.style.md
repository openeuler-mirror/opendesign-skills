> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](progress.visual.md) · [代码使用](progress.usage.md)

# OProgress 进度条 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--progress-track-bg-color` | `var(--o-color-control4)` | 轨道背景色 |
| `--progress-color` | `var(--o-color-info1)` | 文字颜色 |
| `--progress-label-gap` | `8px` | 标签与轨道间距 |
| `--progress-inner-label-color` | `var(--o-color-white)` | 内部文字颜色（labelInside 时） |
| `--progress-inner-label-gap` | `8px` | 内部文字间距 |
| `--progress-bar-bg-color` | 跟随 `color` prop | 进度条填充色（primary/success 时为 main2，warning/danger 时为对应色） |
| `--progress-circle-bar-bg-color` | 跟随 `color` prop | 环形进度条填充色 |
| `--progress-icon-color` | 跟随 `color` prop | 图标颜色 |
| `--progress-text-size` | `var(--o-font_size-text1)`（medium） | 文字字号 |
| `--progress-text-height` | `var(--o-line_height-text1)`（medium） | 文字行高 |
| `--progress-icon-size` | `var(--o-icon_size_control-m)`（medium） | 图标尺寸 |

**使用示例**：
```vue
<OProgress :percentage="60" style="--progress-track-bg-color: #eee; --progress-bar-bg-color: #7c3aed" />
```

---

### 响应式行为表

| 维度 | ≤1440px | >1440px |
|------|---------|---------|
| medium 文字 | tip1 | 标准 |

---

### 组件布局结构

**线形 variant="line" >1440px**
```yaml
layout:
  direction: horizontal
  align: center
  class: o-progress o-progress-line o-progress-{size} o-progress-{color}
  regions:
    - name: line-wrap
      direction: horizontal
      align: center
      children:
        - name: track
          height: "{strokeWidth}px"  # medium:8px, small:4px
          border-radius: "{strokeWidth}px"
          background: var(--o-color-control4)  # 轨道背景
          width: trackWidth 或 auto
          children:
            - name: bar
              width: "{percentage}%"
              border-radius: "{strokeWidth}px"
              background: var(--progress-bar-bg-color)  # 跟随 color
              children:
                - name: inner-label
                  condition: showLabel && labelInside
                  children:
                    - { type: slot, name: default }  # 默认 "{percentage}%"
        - name: label
          condition: showLabel && !labelInside
          gap: 8px  # --progress-label-gap
          children:
            - { type: slot, name: icon }  # icon 插槽优先
            - { type: slot, name: default }  # 默认 format(percentage)
  variants:
    medium: { text-size: text1, icon-size: m }
    small: { text-size: tip2, icon-size: xs }
    primary: { bar-color: var(--o-color-main2) }
    success: { bar-color: var(--o-color-main2) }
    warning: { bar-color: var(--o-color-warning1) }
    danger: { bar-color: var(--o-color-danger1) }
```

**环形 variant="circle"**
```yaml
layout:
  position: relative
  class: o-progress o-progress-circle o-progress-{size} o-progress-{color}
  regions:
    - name: circle-wrap
      children:
        - name: svg
          width/height: circleDiameter  # medium:120px, small:60px（或 trackWidth）
          children:
            - name: track-circle
              stroke: var(--o-color-control4)
              stroke-width: "{strokeWidth}"
              fill: none
            - name: bar-circle
              stroke: var(--progress-circle-bar-bg-color)  # 跟随 color
              stroke-width: "{strokeWidth}"
              stroke-dasharray: 根据 percentage 计算
              stroke-linecap: round
              transform: 旋转-90度（从顶部开始）
        - name: label
          condition: showLabel
          position: absolute center
          children:
            - { type: slot, name: icon }
            - { type: slot, name: default }  # 默认 format(percentage)
```

**≤1440px (laptop)**
```yaml
# medium: text-size tip1
```
