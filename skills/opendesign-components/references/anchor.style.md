> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](anchor.visual.md) · [代码使用](anchor.usage.md)

# OAnchor 锚点 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**通用变量**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--anchor-item-min-width` | `144px` | 锚点项最小宽度（水平模式下为 `unset`） |
| `--anchor-item-link-padding-h` | `8px` | 锚点项水平内边距（水平模式为 `0`） |
| `--anchor-item-link-padding-v` | `8px` | 锚点项垂直内边距 |
| `--anchor-item-link-text-size` | `var(--o-font_size-text1)` | 锚点项文字字号 |
| `--anchor-line-width` | `1px` | 左侧竖线宽度 |
| `--anchor-indicator-width` | `2px` | 选中指示器宽度 |

**水平模式（layout="h"）特有变量**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--anchor-item-gap` | `32px` | 锚点项之间的间距 |

**使用示例**：
```vue
<!-- 减小水平模式的锚点间距 -->
<OAnchor layout="h" style="--anchor-item-gap: 16px">
  <OAnchorItem href="#a" title="章节1" />
  <OAnchorItem href="#b" title="章节2" />
</OAnchor>
```

---

### CSS 变量定制

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `--anchor-content-max-width` | 水平模式内容区最大宽度 | `unset` |
| `--anchor-z-index` | 水平模式 z-index | `initial` |
| `--anchor-offset-top` | 水平模式吸顶偏移 | `0` |
| `--anchor-item-max-row` | 标题最大行数（超出省略） | `2`（水平模式为 `1`） |

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | 1201–1680px | >1680px |
|------|--------|-----------|-------------|---------|
| 垂直模式字号 | 不变 | 缩小（tip1/tip2） | 标准（text1/tip1） | 标准 |
| 水平模式项间距 | 16px | 24px | 32px | 32px |
| 水平模式项内边距 | — | 9px | 12px | 12px |

---

### 组件布局结构

**垂直模式（layout="v"）— 桌面端 >1200px**
```yaml
layout:
  direction: horizontal
  regions:
    - name: anchor-line
      direction: vertical
      children:
        - { type: component, name: anchor-indicator }  # 滑动高亮条，绝对定位
      width: 1px  # --anchor-line-width
    - name: anchor-items
      direction: vertical
      gap: 0
      children:
        - type: group  # 每个 OAnchorItem
          direction: horizontal
          children:
            - type: group  # anchor-item-lines
              direction: vertical
              children:
                - { type: component, name: anchor-item-top-line }
                - { type: component, name: anchor-item-circle }  # 8px 圆点
                - { type: component, name: anchor-item-bottom-line }
            - { type: slot, name: title }  # 标题文字，padding 8px，font-size text1
          children_nested:  # 子级 OAnchorItem（缩进 12px）
            - { type: slot, name: default }
```

**垂直模式 — ≤1200px**
```yaml
# 与桌面端结构一致，字号和间距变化：
# --anchor-item-link-text-size: tip1 (原 text1)
# --anchor-item-sub-link-text-size: tip2 (原 tip1)
# --anchor-item-link-padding-v: 5px (原 8px)
```

**水平模式（layout="h"）— 桌面端 >1200px**
```yaml
layout:
  direction: horizontal
  padding: [0, 0]
  background: var(--o-color-fill2)
  regions:
    - name: anchor-items
      direction: horizontal
      gap: 32px  # --anchor-item-gap
      overflow-x: auto  # 溢出时可横向滚动
      children:
        - type: group  # 每个 OAnchorItem（无圆点装饰）
          children:
            - { type: slot, name: title }  # padding-v 12px，单行，font-size text1
  overlays:
    - name: overflow-mask-left
      trigger: 内容左溢出时显示
      position: left
    - name: overflow-mask-right
      trigger: 内容右溢出时显示
      position: right
```

**水平模式 — ≤1200px**
```yaml
# gap: 24px (原 32px)
# --anchor-item-link-padding-v: 9px (原 12px)
```

**水平模式 — ≤840px**
```yaml
# gap: 16px (原 24px)
```
