> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](message.visual.md) · [代码使用](message.usage.md)

# OMessage 消息提示 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--message-color` | `var(--o-color-info2)` | 消息文字颜色 |
| `--message-text-size` | `var(--o-font_size-text1)` | 正文字号 |
| `--message-text-height` | `var(--o-line_height-text1)` | 正文行高 |
| `--message-bg-color` | `var(--o-color-fill2)` | 消息背景色 |
| `--message-shadow` | `var(--o-shadow-2)` | 消息阴影（colorful 模式为 none） |
| `--message-align` | `start` | 内容对齐方式 |
| `--message-radius` | `var(--o-radius_control-s)` | 圆角 |
| `--message-padding` | `8px 16px` | 内边距 |
| `--message-icon-size` | `var(--o-icon_size_control-m)` | 状态图标尺寸 |
| `--message-icon-gap` | `8px` | 图标与内容的间距 |
| `--message-icon-gap-suffix` | `16px` | 内容与关闭按钮的间距 |
| `--message-icon-close-color` | `var(--o-color-info2)` | 关闭按钮图标颜色 |
| `--message-icon-close-color-hover` | `var(--o-color-info1)` | 关闭按钮悬停颜色 |
| `--message-icon-close-color-active` | `var(--o-color-info1)` | 关闭按钮激活颜色 |
| `--message-word-break` | `break-word` | 文字断行方式 |
| `--message-text-align` | `center` | 文字水平对齐（有标题+正文时为 left） |
| `--message-gap` | `16px` | 多条消息之间的间距 |
| `--message-sidebar-width` | `4px`（colorful 模式） | 彩色侧边条宽度 |
| `--message-list-offset` | `32px` | 消息列表距屏幕边缘的偏移 |

**使用示例**:
```vue
<OMessage status="success" style="--message-radius: 8px; --message-padding: 12px 20px">操作成功</OMessage>
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | 1201–1440px | >1440px |
|------|--------|-----------|-------------|---------|
| 内边距 | 4px 12px | — | 7px 12px | 标准 |
| 文字 | — | — | tip1 | 标准 |
| 图标 | 控件 xs | — | 控件 s | 标准 |
| 间距 | — | 8px | 12px | 标准 |
| 彩色侧边条 | 3px | — | — | 标准 |
| 带标题时标题字号 | tip2 | — | — | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  direction: horizontal
  align: center
  border-radius: var(--o-radius_control-s)
  background: var(--o-color-fill2)
  shadow: var(--o-shadow-2)  # colorful 模式无阴影
  padding: 8px 16px
  gap: 8px  # --message-icon-gap
  regions:
    - name: sidebar
      condition: colorful === true
      width: 4px  # --message-sidebar-width
      height: 100%
      background: 跟随 status 颜色
    - name: icon
      children:
        - { type: slot, name: icon }  # 默认根据 status 显示对应图标
      icon-size: var(--o-icon_size_control-m)
    - name: main
      flex: 1
      direction: vertical
      children:
        - name: title
          condition: 有 title prop 或 title 插槽
          children:
            - { type: slot, name: title }
        - name: content
          children:
            - { type: slot, name: default }
    - name: close
      condition: closable === true
      gap: 16px  # --message-icon-gap-suffix
      children:
        - { type: icon, name: IconClose }
  variants:
    colorful:
      shadow: none
      background: 跟随 status（info→蓝, success→绿, warning→橙, danger→红, loading→品牌色浅）
    both(有标题+有正文):
      text-size: tip1
      padding: 5px 12px 8px
      title-gap: 5px
    only-title(colorful+仅标题):
      title-size: tip1
      padding: 4px 12px
    only-content(colorful+仅正文):
      text-size: tip1
      padding: 4px 12px
```

**≤1440px (laptop)**
```yaml
# padding: 7px 12px, gap: 12px
# text-size: tip1, icon-size: s
# both: text-size tip2
# only-content: text-size tip2, padding 6px 12px
```

**≤1200px (pad)**
```yaml
# gap: 8px
```

**≤840px (pad_v)**
```yaml
# both: title-size tip2, icon-size xs, padding 4px 12px, title-gap 4px
# colorful: sidebar-width 3px
# only-title: title-size tip2, icon-size xs, padding 4px 12px
# only-content: icon-size xs, padding 4px 12px
```
