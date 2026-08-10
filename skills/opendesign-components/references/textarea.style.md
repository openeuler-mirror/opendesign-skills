> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](textarea.visual.md) · [代码使用](textarea.usage.md)

# OTextarea 多行文本输入框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--textarea-min-height` | `126px` | 文本域最小高度 |
| `--textarea-min-width` | `var(--o-control_size-xl)` | 文本域最小宽度 |
| `--textarea-padding-v` | `8px`（medium） | 垂直内边距（small 为 4px） |
| `--textarea-padding-h` | `16px`（medium） | 水平内边距（small 为 8px） |
| `--textarea-color` | — | 文字颜色（text variant 下由 color prop 控制） |

**使用示例**:
```vue
<OTextarea style="--textarea-min-height: 200px" v-model="content" />
```

---

### 响应式行为表

| 字号 | — | tip1 | 标准 |
| large 水平内边距 | 12px | — | 16px |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  container: div.o-textarea (InBox 外壳)
  direction: vertical
  border-radius: var(--o-radius_control-s)  # 可通过 round 自定义
  min-height: 126px
  min-width: var(--o-control_size-xl)
  regions:
    - name: prepend
      condition: 有 prepend 插槽时
      children:
        - { type: slot, name: prepend }
    - name: textarea-body
      element: div.o-textarea-textarea (InTextarea)
      flex: 1
      children:
        - textarea  # 原生 textarea 元素
        - length-display  # 字符计数（showLength 控制）
    - name: append
      condition: 有 append 插槽时
      children:
        - { type: slot, name: append }
    - name: suffix
      condition: 有 suffix 插槽时
      children:
        - { type: slot, name: suffix }
  variants:
    small: { padding-v: 4px, padding-h: 8px }
    medium: { padding-v: 8px, padding-h: 16px }
    large: { padding-v: 8px, padding-h: 16px }
  color-schemes:
    outline: { border: control1, bg: transparent }
    solid: { border: none, bg: control2-light }
    text: { border: none, bg: transparent }
```

**≤1440px**
```yaml
# min-height: 116px, font-size: tip1
```

**≤840px**
```yaml
# large: padding-h 12px
```
