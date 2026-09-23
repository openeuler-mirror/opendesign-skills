> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](menu.visual.md) · [代码使用](menu.usage.md)

# OMenu 菜单 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--menu-width` | `240px` | 菜单整体宽度 |
| `--menu-bg-color` | `transparent` | 菜单背景色 |
| `--menu-indicator-width` | `1px` | 指示线宽度 |
| `--menu-indicator-bg-color` | `var(--o-color-control4)` | 指示线颜色 |
| `--menu-color` | `var(--o-color-info2)` | 菜单项默认文字颜色 |
| `--menu-color-disabled` | `var(--o-color-info4)` | 禁用项文字颜色 |
| `--menu-color-selected` | `var(--o-color-primary1)` | 选中项文字颜色 |
| `--menu-bg-color-hover` | `var(--o-color-control2-light)` | 悬停时背景色 |
| `--menu-bg-color-selected` | `var(--o-color-control3-light)` | 选中时背景色（**仅支持纯色**，见下方注意） |

> ⚠️ **`--menu-bg-color-selected` 只接受纯色值**：组件内部将该变量用于 `background-color` 属性，而 `background-color` 不支持渐变函数（`linear-gradient` 等）。如需**渐变选中背景**，必须使用 `:deep()` 直接覆盖 `background` 属性：
>
> ```scss
> /* ❌ 无效：background-color 不接受渐变 */
> .my-menu { --menu-bg-color-selected: linear-gradient(...); }
>
> /* ✅ 正确：用 :deep() 仅覆盖叶节点 OMenuItem 的 background */
> /* ⚠️ 不要对 .o-sub-menu-selected/.o-sub-menu-associated-selected 加渐变 */
> /* 渐变高亮只应作用于叶节点菜单项，父级 OSubMenu 标题不高亮 */
> .my-menu {
>   :deep(.o-menu-item-selected) {
>     background: linear-gradient(to right, rgba(46,83,250,0.15), rgba(123,37,244,0.15));
>   }
> }
> ```
| `--menu-icon-color` | `currentColor` | 图标颜色 |
| `--menu-icon-color-selected` | `currentColor` | 选中图标颜色 |
| `--menu-item-padding-v` | `8px`（medium） | 菜单项垂直内边距 |
| `--menu-padding-h` | `8px`（medium） | 菜单项水平内边距 |
| `--menu-radius` | `var(--o-radius_control-xs)` | 菜单项圆角 |
| `--menu-text-size` | `var(--o-font_size-tip1)` | 菜单项文字大小 |
| `--menu-text-height` | `var(--o-line_height-tip1)` | 菜单项文字行高 |
| `--menu-icon-size` | `var(--o-icon_size_control-m)` | 图标尺寸（small 为 `control-xs`） |
| `--menu-icon-gap` | `8px`（medium） | 图标与文字间距（small 为 `4px`） |
| `--menu-arrow-size` | `var(--o-icon_size_control-m)` | 折叠箭头尺寸 |
| `--menu-popover-width` | `240px` | 弹出式子菜单宽度 |

**使用示例**:
```vue
<OMenu v-model="selected" style="--menu-width: 280px; --menu-color-selected: var(--o-color-success1)">
  ...
</OMenu>
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1440px | >1440px |
|------|--------|-----------|---------|
| medium 一级项间距 | 标准 | 8px | 标准 |
| medium 一级项文字 | 标准 | tip1 | 标准 |
| medium 图标 | 标准 | 控件 s | 标准 |
| small 文字 | tip2（一级 tip1） | 标准 | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  component: ul.o-menu
  direction: vertical
  width: 240px  # --menu-width
  bg-color: transparent  # --menu-bg-color
  regions:
    - name: OSubMenu
      element: li.o-sub-menu
      indent: calc(--menu-padding-h + --menu-base-indent * --menu-level)
      children:
        - name: title
          element: div.o-sub-menu-title
          direction: horizontal
          align: center
          children:
            - name: arrow-left
              element: div.o-sub-menu-arrow
              condition: arrowPosition="left"
              children: [IconChevronDownBold]
              size: var(--menu-arrow-size)
            - name: icon
              element: div.o-sub-menu-title-icon
              condition: icon prop 或 icon 插槽
              children:
                - { type: slot, name: icon }
              size: var(--menu-icon-size)
              gap: var(--menu-icon-gap)  # 8px(medium) / 4px(small)
            - name: content
              element: div.o-sub-menu-title-content
              flex: 1
              children:
                - { type: slot, name: title }
            - name: arrow-right
              element: div.o-sub-menu-arrow
              condition: arrowPosition="right"(默认)
              children: [IconChevronDownBold]
        - name: children
          element: ul.o-sub-menu-children
          class-toggle: expanded
          children:
            - { type: slot, name: default }  # OMenuItem / 嵌套 OSubMenu
    - name: OMenuItem
      element: li.o-menu-item
      direction: horizontal
      align: center
      indent: calc(--menu-padding-h + --menu-base-indent * --menu-level)
      padding-v: var(--menu-item-padding-v)
      border-radius: var(--menu-radius)
      children:
        - name: icon
          element: div.o-menu-item-icon
          condition: icon prop 或 icon 插槽
          size: var(--menu-icon-size)
        - name: content
          element: div.o-menu-item-content
          flex: 1
          overflow: hidden(ellipsis + popover on hover)
      states:
        selected: { color: var(--menu-color-selected), bg: var(--menu-bg-color-selected) }
        hover: { bg: var(--menu-bg-color-hover) }
        disabled: { color: var(--menu-color-disabled) }
  variants:
    medium:
      level-0: { padding-v: 11px, text: text1 }
      level-n: { padding-v: 8px, text: tip1 }
      icon: control-m
      padding-h: 8px
    small:
      padding-v: 4px
      text: tip1
      icon: control-xs
      padding-h: 4px
```

**≤1440px (laptop)**
```yaml
# medium: padding-v 4px, icon control-s, arrow control-s
# medium level-0: padding-v 8px, text tip1
```

**≤840px (pad_v)**
```yaml
# small: text tip2
# small level-0: text tip1（保持较大）
```
