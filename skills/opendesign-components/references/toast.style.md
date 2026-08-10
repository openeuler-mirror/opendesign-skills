> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](toast.visual.md) · [代码使用](toast.usage.md)

# OToast 轻提示 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--toast-padding` | `9px 16px` | 提示条内边距 |
| `--toast-bg-color` | `rgb(var(--o-grey-11))` | 提示条背景色（深色） |
| `--toast-color` | `var(--o-color-info1-inverse)` | 提示条文字颜色 |
| `--toast-radius` | `4px` | 提示条圆角 |
| `--toast-font-size` | `var(--o-font_size-tip1)` | 提示文字字号 |
| `--toast-line-height` | `var(--o-line_height-tip1)` | 提示文字行高 |
| `--toast-shadow` | `var(--o-shadow-3)` | 提示条阴影 |
| `--toast-gap` | `16px` | 多条提示间距 |
| `--toast-align` | `center` | 提示条对齐方式 |
| `--toast-max-width` | `100%` | 提示条最大宽度 |
| `--toast-list-offset` | `80px` | 提示列表距页面顶部/底部的偏移 |

**使用示例**:
```vue
<OToast style="--toast-list-offset: 120px" message="自定义偏移提示" />
```

---

### 响应式行为表

|------|-------------------|---------|--------|
| 最大宽度 | 75% | 100% | 100%（默认） |

---

### 组件布局结构

**桌面端 >840px**
```yaml
layout:
  # OToast 单条提示
  toast:
    element: div.o-toast
    direction: horizontal
    align: center
    padding: 9px 16px
    border-radius: 4px
    background: rgb(var(--o-grey-11))  # 深色背景
    color: var(--o-color-info1-inverse)  # 白色文字
    shadow: var(--o-shadow-3)
    font-size: tip1
    max-width: 100%
    regions:
      - name: content
        children:
          - { type: slot, name: default }  # 或 message 文字

  # OToastList 提示列表容器（命令式调用）
  toast-list:
    element: div.o-toast-list
    position: fixed
    z-index: 1001
    width: 100%
    text-align: center  # --toast-align
    variants:
      top: { top: var(--toast-list-offset, 80px) }
      center: { top: 50%, transform: translateY(-50%) }
      bottom: { bottom: var(--toast-list-offset, 80px) }
    children:
      - TransitionGroup > OToast[]  # 多条提示动画列表
```

**≤840px**
```yaml
# toast: max-width 75%
```

**手机尺寸**
```yaml
# toast: max-width 100%
```
