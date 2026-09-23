> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](step.visual.md) · [代码使用](step.usage.md)

# OStep 步骤条 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--step-item-head-size` | `var(--o-font_size-h4)` | 标识区序号字号 |
| `--step-item-head-height` | `var(--o-line_height-h4)` | 标识区序号行高 |
| `--step-item-title-size` | `var(--o-font_size-text1)` | 标题字号 |
| `--step-item-title-height` | `var(--o-line_height-text1)` | 标题行高 |
| `--step-item-title-font-weight` | `normal` | 标题字重（processing 状态下为 600） |
| `--step-item-desc-size` | `var(--o-font_size-tip2)` | 描述字号 |
| `--step-item-desc-height` | `var(--o-line_height-tip2)` | 描述行高 |
| `--step-item-head-width` | `var(--o-icon_size_control-l)` | 标识圆形宽高尺寸 |
| `--step-item-icon-size` | `var(--o-icon_size-m)` | 状态图标尺寸 |
| `--step-item-gap` | `8px` | 步骤间距 |
| `--step-item-main-gap` | `8px` | 主体区域内容间距（垂直模式下为 0） |
| `--step-item-desc-gap` | `4px` | 描述与标题的间距 |
| `--step-item-line-gap` | `8px` | 连接线与标识的间距 |
| `--step-item-line-height` | `1px` | 连接线粗细 |
| `--step-item-align` | `center` | 水平模式对齐方式（垂直模式下为 left） |
| `--step-item-head-bg` | `var(--o-color-success1)` | 标识圆形背景色（跟随状态变化） |
| `--step-item-head-color` | `var(--o-color-white)` | 标识区文字/图标颜色 |
| `--step-item-title-color` | `var(--o-color-info2)` | 标题颜色（跟随状态变化） |
| `--step-item-desc-color` | `var(--o-color-info3)` | 描述文字颜色 |
| `--step-item-line-bg` | `var(--o-color-control4)` | 连接线颜色（跟随状态变化） |
| `--step-item-main-padding` | `0 12px` | 主体区域内边距（垂直模式下为 0） |

**使用示例**:
```vue
<OStep style="--step-item-title-font-weight: 600">
  <OStepItem :step-index="0" title="自定义步骤" status="finished" />
</OStep>
```

---

### 响应式行为表

| 维度 | <=768px (pad_v) | <=1440px (laptop) | >1440px |
|------|-----------------|-------------------|---------|
| 标识圆形大小 | control-m | control-m | control-l |
| 标识字号 | tip1 | text1 | h4 |
| 标题字号 | tip2 | tip1 | text1 |
| 图标尺寸 | — | icon_size-s | icon_size-m |

---

### 组件布局结构

**桌面端 >1440px（水平模式 direction="h"）**
```yaml
layout:
  direction: horizontal
  class: o-step o-step-h
  children:
    - name: OStepItem  # 重复多个
      class: o-step-item o-step-item-h o-step-item-{status}
      direction: vertical
      align: center
      regions:
        - name: head
          class: o-step-item-head
          children:
            - name: line
              class: o-step-item-line
              type: ODivider
              direction: horizontal
              height: 1px
              description: 连接线，位置动态计算，颜色跟随前一步骤状态
            - name: symbol
              class: o-step-item-symbol
              width: var(--o-icon_size_control-l)
              height: var(--o-icon_size_control-l)
              border-radius: 50%
              background: var(--step-item-head-bg)  # 跟随 status
              color: var(--o-color-white)
              font-size: var(--o-font_size-h4)
              children:
                - { type: slot, name: icon }  # 或 stepIndex+1 数字，或状态图标
        - name: main
          class: o-step-item-main
          padding: "0 12px"
          gap: 8px
          align: center
          children:
            - name: title
              class: o-step-item-title
              font-size: var(--o-font_size-text1)
              color: var(--step-item-title-color)  # 跟随 status
              font-weight: normal  # processing 为 600
            - name: description
              class: o-step-item-desc
              font-size: var(--o-font_size-tip2)
              color: var(--o-color-info3)
              gap: 4px
  status-colors:
    finished: { head-bg: success1, line-bg: control4, title-color: info2 }
    processing: { head-bg: primary1, line-bg: primary1, title-color: primary1, title-weight: 600 }
    waiting: { head-bg: primary4, line-bg: control4, title-color: info3 }
    failed: { head-bg: danger1, line-bg: control4, title-color: info2 }
```

**垂直模式 direction="v"**
```yaml
# 每个 OStepItem 水平排列: head(左) + main(右)
# align: left
# main-padding: 0, main-gap: 0
# 连接线为垂直方向
# 需给每个 OStepItem 设置 style="height: Xpx" 控制间距
```

**≤1440px**
```yaml
# 标识圆形: icon_size_control-m
# 标识字号: text1 (从 h4 缩小)
# 标题字号: tip1 (从 text1 缩小)
# 图标尺寸: icon_size-s (从 m 缩小)
```

**≤768px**
```yaml
# 标识字号: tip1 (进一步缩小)
# 标题字号: tip2 (进一步缩小)
```
