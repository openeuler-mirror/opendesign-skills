> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tag.visual.md) · [代码使用](tag.usage.md)

# OTag 标签 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--tag-radius` | `var(--o-radius_control-xs)`（4px） | 标签圆角。**⚠️ pill 模式下组件通过内联样式注入 `--tag-radius: 100vh`（完全圆形），覆盖此变量无效** |
| `--tag-color` | `var(--o-color-info1)`（normal） | 标签文字颜色（随 color 变化） |
| `--tag-bg-color` | `var(--o-color-control2-light)`（normal） | 标签背景色（随 color/variant 变化）。**⚠️ 仅支持纯色**，渐变色无效（见下方「渐变背景」说明） |
| `--tag-bd-color` | `var(--o-color-control2-light)`（normal） | 标签边框颜色（随 color/variant 变化） |
| `--tag-icon-close-color` | `inherit`（默认） | 关闭按钮图标颜色。v1.2.6 起默认改为 inherit（继承文字色） |
| `--tag-icon-close-color-hover` | `inherit`（默认） | 关闭按钮 hover 颜色 |
| `--tag-bd` | `1px solid var(--tag-bd-color)` | 边框完整样式（v1.2.6 新增，main2 模式下为 none） |
| `--tag-bg-image` | `none` | 背景图片（v1.2.6 新增，main2 模式下使用 `--o-color-main2` 渐变） |
| `--tag-bg-color-hover` | 随 color 变化 | hover 背景色（v1.2.6 新增，interactive/closable 时生效） |
| `--tag-bd-color-hover` | 随 color 变化 | hover 边框色（v1.2.6 新增） |
| `--tag-color-hover` | 随 color 变化 | hover 文字色（v1.2.6 新增，仅 outline 模式生效） |
| `--tag-padding` | `0 11px`（large） | 标签水平内边距（随 size 变化） |
| `--tag-text-size` | `var(--o-font_size-tip2)` | 标签文字字号 |
| `--tag-text-height` | `var(--o-line_height-tip2)` | 标签文字行高 |
| `--tag-height` | `var(--o-control_size-s)`（large，约 28px） | 标签高度（随 size 变化） |
| `--tag-icon-size` | `var(--o-icon_size_control-xs)` | 前缀图标尺寸 |
| `--tag-icon-gap` | `4px`（large/medium）/ `2px`（small） | 图标与文字间距 |

**使用示例（纯色）**:
```vue
<OTag style="--tag-bg-color: var(--o-color-primary4); --tag-color: var(--o-color-primary1)">自定义标签</OTag>
```

**渐变背景**

OTag 内部使用 `background-color: var(--tag-bg-color)` 渲染背景，CSS 变量只支持纯色值。若需要**渐变背景**，必须通过自定义 class 直接覆盖 `background` 属性（利用 Vue scoped 样式带来的 `[data-v-xxx]` 属性选择器优先级高于组件库单类选择器的特性）：

```vue
<!-- template -->
<OTag round="pill" class="tag-gradient">标签</OTag>

<!-- scoped style -->
<style lang="scss" scoped>
.tag-gradient {
  /* background 简写会同时重置 background-color（覆盖组件内 --tag-bg-color）和设置 background-image */
  background: linear-gradient(to right, rgba(46, 83, 250, 0.15), rgba(123, 37, 244, 0.15));
  --tag-bd-color: transparent;
  --tag-color: var(--o-color-info1); /* 浅色底 → 深色字；深色底 → 浅色字 */
}
</style>
```

> **原理**：`.tag-gradient[data-v-xxx]`（specificity 0,2,0）高于组件库的 `.o-tag`（0,1,0），因此 scoped 的 `background` 规则优先生效，同时因为 `background` 简写会隐式将 `background-color` 重置为 transparent，所以不需要额外清除 `--tag-bg-color`。

**渐变色设计值参考**（运营标签 DSL 16:4646）：

| 模式 | 渐变起点 | 渐变终点 | 方向 |
|------|---------|---------|------|
| light | `rgba(46, 83, 250, 0.15)` | `rgba(123, 37, 244, 0.15)` | → 水平 |
| dark  | `rgba(84, 120, 251, 0.25)` | `rgba(152, 74, 246, 0.25)` | → 水平 |

---

### 响应式行为表

| large 内边距 | — | 0 7px | 0 11px |
| medium 高度 | xs(16px) | — | 20px |
| medium 缩放 | 0.833 | — | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  tag: span.o-tag
  direction: horizontal
  align: center
  border-radius: var(--o-radius_control-xs)
  regions:
    - name: icon
      element: span.o-tag-icon
      condition: 有 icon 插槽时
      children:
        - { type: slot, name: icon }
      gap: 2–4px  # --tag-icon-gap, 随 size 变化
    - name: label
      element: span.o-tag-label
      children:
        - { type: slot, name: default }  # 标签文字
    - name: close
      element: span.o-tag-close
      condition: closable=true
      children:
        - IconClose  # 关闭图标
  variants:
    large: { height: "24px(>1680px) / 20px(≤1680px)", padding: "0 11px / 0 7px", font-size: tip2, icon-size: xs, icon-gap: 4px }
    medium: { height: 20px, padding: "0 7px", font-size: tip2, icon-size: xs, icon-gap: 4px }
    small: { height: 16px, padding: "0 5px", font-size: tip2, icon-size: xs, icon-gap: 2px }
    pill: { border-radius: "100vh (组件JS内联注入，非CSS变量，不可被外部覆盖)" }
  color-schemes:
    normal-solid: { color: info1, bg: control2-light, border: control2-light }
    normal-outline: { color: info1, bg: transparent, border: control1 }
    primary-solid: { color: white, bg: primary1, border: primary1 }
    primary-outline: { color: primary1, bg: transparent, border: primary1 }
    # success/warning/danger 同理，solid 白字彩色底，outline 彩色字透明底
```

**≤1440px**
```yaml
# large: height 20px, padding "0 7px"
```

**≤840px**
```yaml
# medium: height xs(16px), 内容缩放 scale(0.833)
```
