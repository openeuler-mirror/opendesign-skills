> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](layer.visual.md) · [代码使用](layer.usage.md)

# OLayer 浮层 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--layer-position` | `absolute`（body 挂载时为 `fixed`） | 浮层定位方式 |
| `--layer-mask` | `var(--o-color-mask1)` | 遮罩层颜色 |
| `--layer-align` | `center` | 内容垂直对齐（align-items） |
| `--layer-justify` | `center` | 内容水平对齐（justify-content） |
| `--layer-origin` | `center` | 缩放动画变换原点（transitionOrign="css" 时生效） |

**使用示例**:
```vue
<OLayer v-model:visible="visible" transition-orign="css" style="--layer-origin: top center" />
```

---

### CSS 变量定制

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `--layer-position` | 浮层定位方式 | `fixed` |
| `--layer-z-index` | 层级（自动管理） | 自动 |
| `--layer-align` | 内容对齐（align-items） | — |
| `--layer-justify` | 内容对齐（justify-content） | — |
| `--layer-origin` | 动画变换原点（transitionOrign="css" 时） | `center` |
| `--layer-mask` | 遮罩层颜色 | — |

---

### 响应式行为表

本组件无响应式差异。上层组件（如 ODialog）通过 CSS 变量实现响应式。

---

### 组件布局结构

**通用布局（无响应式差异）**
```yaml
layout:
  component: div.o-layer
  positioning: fixed (body) | absolute (wrapper=null)
  z-index: auto-managed  # --layer-z-index，自动递增
  display: flex
  align-items: var(--layer-align)  # 默认 center
  justify-content: var(--layer-justify)  # 默认 center
  inset: 0
  regions:
    - name: mask
      element: div.o-layer-mask
      condition: mask=true
      positioning: absolute, inset: 0
      bg-color: var(--layer-mask)  # 默认 var(--o-color-mask1)
      transition: maskTransition  # 默认 o-fade-in
    - name: main
      element: div.o-layer-main
      children:
        - { type: slot, name: default }  # 浮层主体内容
      transition: mainTransition  # 默认 o-zoom-fade2
      transform-origin: mouse | var(--layer-origin)
    - name: close-button
      element: div.o-layer-close
      condition: buttonClose=true
      children:
        - { type: slot, name: close, fallback: "OIcon(IconClose)" }
  css-variables:
    --layer-position: fixed | absolute
    --layer-z-index: auto
    --layer-align: center
    --layer-justify: center
    --layer-origin: center
    --layer-mask: var(--o-color-mask1)
```
