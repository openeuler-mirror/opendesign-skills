> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](ip-input.visual.md) · [代码使用](ip-input.usage.md)

# OIpInput IP地址输入框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ip-separator-size` | `4px` | 分段间圆点分隔符的尺寸 |
| `--ip-separator-gap` | `8px` | 分段间圆点分隔符与分段输入框的间距 |
| `--ip-separator-bg-color` | `var(--o-color-info1)` | 分段间圆点分隔符的背景色 |

**使用示例**：
```vue
<OIpInput v-model="ip" style="--ip-separator-size: 6px; --ip-separator-bg-color: var(--o-color-brand1)" />
```

---

### 响应式行为表

| 维度 | <=840px | 841-1200px | >1200px |
|------|---------|-----------|---------|
| 大尺寸高度 | 标准控件尺寸 | 36px | 标准 |
| 中尺寸高度 | 28px | 28px | 标准 |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  component: InBox.o-ip-input
  direction: horizontal
  align: center
  border-radius: var(--o-radius_control-s)
  regions:
    - name: ip-segment
      repeat: segmentsLen  # 默认 4
      children:
        - type: component
          name: OInput.o-ip-segment
          text-align: center
          max-length: 3
          border: none  # 独立段无边框，由外层 InBox 统一
          padding: 0
    - name: separator
      repeat: segmentsLen - 1  # 分隔符在段之间
      children:
        - type: element
          tag: div.o-ip-separator
          size: 4px  # --ip-separator-size
          shape: circle
          bg-color: var(--o-color-info1)
          gap: 8px  # --ip-separator-gap
  variants:
    small: { height: var(--o-control_size-s), padding: "0 7px" }
    medium: { height: var(--o-control_size-m), padding: "0 15px" }
    large: { height: var(--o-control_size-l), padding: "0 15px" }
```

**≤1200px (laptop)**
```yaml
# large: height 36px
# medium: height 28px
```

**≤840px (pad_v)**
```yaml
# large: height 恢复 var(--o-control_size-l)
```
