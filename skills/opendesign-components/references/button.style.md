> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](button.visual.md) · [代码使用](button.usage.md)

# OButton 按钮 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值（medium size） | 说明 |
|--------|----------------------|------|
| `--btn-height` | `var(--o-control_size-m)`（32px） | 按钮高度 |
| `--btn-padding` | `0 15px` | 水平内边距（s: `0 15px`，l: `0 23px`） |
| `--btn-radius` | `var(--o-radius_control-s)` | 圆角（pill 时为 `var(--o-control_size-l)`） |
| `--btn-gap` | `8px` | 图标与文字间距（s: `4px`） |
| `--btn-min-width` | `80px` | 最小宽度（m），l 为 `96px` |
| `--btn-icon-size` | `var(--o-icon_size-xs)` | 图标尺寸 |

**使用示例**：
```vue
<!-- 自定义最小宽度 -->
<OButton style="--btn-min-width: 120px" color="primary" variant="solid">提交</OButton>
```

---

### 响应式行为表

| 维度 | ≤600px | **601–840px** ★ | **841–1200px** ★ | 1201–1680px ★ | >1680px |
|------|--------|----------------|-----------------|--------------|--------|
| large 高度 | 32px | 32px | 36px | 40px | 40px |
| medium 高度 | 28px | 28px | 28px | 32px | 32px |
| small 高度 | 24px | 24px | 24px | 24px | 24px |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  direction: horizontal
  align: center
  justify: center
  border-radius: var(--o-radius_control-s)  # medium/large; xs for small
  regions:
    - name: icon-prefix
      children:
        - { type: slot, name: icon }  # 或 loading 动画替换
      gap: 8px  # --btn-gap, small 为 4px
    - name: content
      flex: 1
      children:
        - { type: slot, name: default }  # 按钮文字
    - name: icon-suffix
      children:
        - { type: slot, name: suffix }
      gap: 8px  # --btn-gap
  variants:
    small: { height: 28px, padding: "0 15px", icon-size: xs, border-radius: xs }
    medium: { height: 32px, padding: "0 15px", icon-size: xs, min-width: 80px }
    large: { height: 40px, padding: "0 23px", icon-size: m, min-width: 96px }
    icon-only: { padding: 0, width: 等于高度, min-width: none }
    pill: { border-radius: "var(--o-control_size-l)" }
```

**≤1200px**
```yaml
# large: height 36px, padding "0 15px", font-size tip1
# medium: height 28px, gap 4px
```

**≤840px**
```yaml
# large: height 32px, icon-size s
# small: padding "0 11px"
```
