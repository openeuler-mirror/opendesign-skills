> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](loading.visual.md) · [代码使用](loading.usage.md)

# OLoading 加载 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--loading-mask` | `var(--o-color-mask1)` | 遮罩层颜色 |
| `--loading-icon-size` | `var(--o-icon_size_control-m)` | 加载图标尺寸（small 为 xs，medium 为 4xl，large 为 96px） |
| `--loading-icon-color` | `var(--o-color-info2)` | 图标颜色（无遮罩时） |
| `--loading-mask-icon-color` | `var(--o-color-info2-inverse)` | 图标颜色（有遮罩时，通常为白色） |
| `--loading-color` | `var(--o-color-info2)` | 文字颜色（无遮罩时） |
| `--loading-mask-color` | `var(--o-color-info2-inverse)` | 文字颜色（有遮罩时） |
| `--loading-z-index` | `calc(var(--o-z-index-base) + 10)` | 层级 |
| `--loading-label-font-size` | `var(--o-font_size-tip2)` | 加载文字字号 |
| `--loading-label-line-height` | `var(--o-line_height-tip2)` | 加载文字行高 |
| `--loading-label-icon-gap` | `8px` | 图标与文字之间的间距（small 为 4px，medium 为 12px，large 为 16px） |
| `--loading-content-direction` | `column` | 图标与文字排列方向（small/mini 为 `row`） |

**使用示例**:
```vue
<OLoading v-model:visible="loading" style="--loading-icon-color: var(--o-color-primary1)" />
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1440px | >1440px |
|------|--------|-----------|---------|
| large 图标 | 2xl | 4xl | 标准 |
| large 文字 | tip2 | tip1 | 标准 |
| large 间距 | 8px | 12px | 标准 |
| medium 图标 | 2xl | 2xl | 标准 |
| medium 文字 | tip2 | tip2 | 标准 |
| medium 间距 | 4px | 8px | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  component: OLayer.o-loading
  inherits: OLayer  # 遮罩+内容区结构
  transition-origin: css  # 固定使用 css 模式
  mask-close: false  # 不允许点击遮罩关闭
  regions:
    - name: loading-main
      element: div.o-loading-main  # 通过 mainClass 合并
      display: flex
      direction: var(--loading-content-direction)  # column(large/medium) | row(small/mini)
      align: center
      justify: center
      children:
        - name: icon
          element: div.o-loading-icon
          children:
            - { type: slot, name: icon, fallback: "IconLoading(旋转)" }
          icon-size: var(--loading-icon-size)
          color: var(--loading-icon-color)  # 有遮罩时用 --loading-mask-icon-color
        - name: label
          element: div.o-loading-label
          condition: label prop 或 label 插槽
          children:
            - { type: slot, name: label, fallback: "{{ label }}" }
          font-size: var(--loading-label-font-size)
          gap: var(--loading-label-icon-gap)  # 图标与文字间距
  variants:
    large: { icon: 96px, text: text1, gap: 16px, direction: column }
    medium: { icon: 4xl, text: tip1, gap: 12px, direction: column }
    small: { icon: xs, text: tip2, gap: 4px, direction: row }
    mini: { icon: control-xs, direction: row }
```

**841–1440px (pad_v-laptop)**
```yaml
# large: icon 4xl, text tip1, gap 12px
# medium: icon 2xl, text tip2, gap 8px
```

**≤840px (pad_v)**
```yaml
# large: icon 2xl, text tip2, gap 8px
# medium: icon 2xl, text tip2, gap 4px
```
