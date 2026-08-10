> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](slider.visual.md) · [代码使用](slider.usage.md)

# OSlider 滑动条 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--slider-height` | `32px` | 滑动条整体高度 |
| `--slider-runway-wrap-padding` | `0 4px` | 轨道容器内边距 |
| `--slider-runway-wrap-bg` | `var(--o-color-control4)` | 轨道容器背景色 |
| `--slider-runway-height` | `4px` | 轨道高度（间隔模式 8px） |
| `--slider-bar-height` | `4px` | 进度条高度（间隔模式 10px） |
| `--slider-bar-bg` | `var(--o-color-control2)` | 进度条颜色 |
| `--slider-btn-width` | `16px` | 滑块按钮宽度（间隔模式 20px，悬停时 24px） |
| `--slider-btn-bg` | `var(--o-color-info1-inverse)` | 滑块按钮背景色 |
| `--slider-btn-border` | `4px solid var(--o-color-control4)` | 滑块按钮边框 |
| `--slider-btn-shadow` | `var(--o-shadow-1)` | 滑块按钮阴影 |
| `--slider-circle-width` | `6px` | 滑块内圆宽度（showStops 时显示） |
| `--slider-circle-bg` | `var(--o-color-main1)` | 滑块内圆颜色 |
| `--slider-stop-width` | `2px` | 刻度点宽度 |
| `--slider-stop-bg` | `var(--o-color-info4)` | 刻度点颜色（已到达时为白色） |
| `--slider-marks-font-size` | `var(--o-font_size-tip1)` | 标记文字字号 |
| `--slider-marks-line-height` | `var(--o-line_height-tip1)` | 标记文字行高 |
| `--slider-marks-gap` | `8px` | 标记文字与轨道间距 |
| `--slider-input-width` | `60px` | 输入框宽度 |
| `--slider-input-unit-gap` | `8px` | 输入框与单位文字间距 |
| `--slider-popover-font-size` | `var(--o-font_size-text1)` | 气泡文字字号 |
| `--slider-popover-line-height` | `var(--o-line_height-text1)` | 气泡文字行高 |
| `--slider-unit-font-size` | `var(--o-font_size-tip2)` | 单位文字字号 |
| `--slider-unit-line-height` | `var(--o-line_height-tip2)` | 单位文字行高 |
| `--sldier-unit-color` | `var(--o-color-info3)` | 单位文字颜色（⚠️ 源码拼写错误，实为 `sldier` 非 `slider`，覆盖时必须使用此错误拼写） |

**使用示例**：
```vue
<OSlider v-model="value" style="--slider-bar-bg: var(--o-color-success1); --slider-btn-width: 20px" />
```

---

### 响应式行为表

|------|---------|-----------|---------|
| 气泡文字 | 标准 | tip1 | 标准 |
| 滑块按钮宽度 | 24px | 16px | 16px |
| 刻度点宽度 | 3px | 2px | 2px |
| 间隔模式轨道高度 | 12px | 8px | 8px |
| 间隔模式进度条高度 | 16px | 10px | 10px |

---

### 组件布局结构

**桌面端 >1440px（水平模式 direction="h"）**
```yaml
layout:
  direction: horizontal
  class: o-slider
  height: 32px
  regions:
    - name: runway-wrap
      flex: 1
      padding: "0 4px"
      background: var(--o-color-control4)
      children:
        - name: runway
          class: o-slider-runway
          height: 4px  # 间隔模式 8px
          position: relative
          children:
            - name: bar
              class: o-slider-bar
              height: 4px  # 间隔模式 10px
              background: var(--o-color-control2)  # 间隔模式使用 main2 渐变
              description: 已选进度条，宽度和位置动态计算
            - name: first-button
              type: OSliderButton
              width: 16px  # 间隔模式 20px
              border: "4px solid var(--o-color-control4)"
              shadow: var(--o-shadow-1)
              description: 第一个滑块按钮，始终存在
            - name: second-button
              type: OSliderButton
              condition: range=true
              description: 第二个滑块按钮，范围模式时存在
            - name: stops
              condition: showStops=true
              children: "等距圆点，宽 2px，颜色 info4（已达到的为白色）"
            - name: marks
              condition: marks 属性存在
              children: "OSliderMarker 列表，轨道下方的文字标记"
              font-size: var(--o-font_size-tip1)
              gap: 8px
    - name: input-wrap
      condition: showInput=true && range=false
      gap: 12px
      children:
        - name: input
          type: OInputNumber
          width: 60px
          round: pill
        - name: unit
          type: slot/text
          font-size: var(--o-font_size-tip2)
          color: var(--o-color-info3)
  popover:
    font-size: var(--o-font_size-text1)
    padding: "2px 6px"
    position: bottom  # 默认
```

**垂直模式 direction="v"**
```yaml
# 轨道纵向排列，高度由 height 属性控制
# 滑块按钮沿垂直方向拖拽
# 输入框不可用（showInput 无效）
```

**≤1440px**
```yaml
# 气泡文字: font_size-tip1
```

**≤840px**
```yaml
# 滑块按钮: 24px
# 刻度点: 3px
# 间隔模式轨道高度: 12px, 进度条高度: 16px
```
