> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](dropdown.visual.md) · [代码使用](dropdown.usage.md)

# ODropdown 下拉菜单 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dropdown-list-bg-color` | `var(--o-color-control5-light)` | 下拉列表背景色 |
| `--dropdown-list-shadow` | `var(--o-shadow-2)` | 下拉列表阴影 |
| `--dropdown-list-bd` | `none` | 下拉列表边框 |
| `--dropdown-list-radius` | `var(--o-radius_control-m)` | 下拉列表圆角 |
| `--dropdown-list-padding` | `4px` | 下拉列表内边距 |
| `--dropdown-item-color` | `var(--o-color-info2)` | 选项文字颜色（默认） |
| `--dropdown-item-color-hover` | `var(--o-color-primary2)` | 选项文字颜色（悬停） |
| `--dropdown-item-color-disabled` | `var(--o-color-info4)` | 选项文字颜色（禁用） |
| `--dropdown-item-bg-color` | `transparent` | 选项背景色（默认） |
| `--dropdown-item-bg-color-hover` | `var(--o-color-control2-light)` | 选项背景色（悬停） |
| `--dropdown-item-bg-color-disabled` | `transparent` | 选项背景色（禁用） |
| `--dropdown-item-text-size` | `var(--o-font_size-text1)` | 选项文字字号（large 尺寸） |
| `--dropdown-item-text-height` | `var(--o-line_height-text1)` | 选项文字行高（large 尺寸） |
| `--dropdown-item-justify` | `left` | 选项文字对齐方式 |
| `--dropdown-item-padding` | `7px 12px` | 选项内边距（large 尺寸） |
| `--dropdown-item-gap` | `2px` | 选项之间的间距 |
| `--dropdown-item-radius` | `var(--o-radius_control-s)` | 选项圆角 |

**使用示例**：
```vue
<ODropdown style="--dropdown-list-radius: var(--o-radius_control-l); --dropdown-item-justify: center">
  <OButton>操作</OButton>
  <template #dropdown>
    <ODropdownItem label="选项一" value="opt1" />
  </template>
</ODropdown>
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | >1200px |
|------|--------|-----------|---------|
| 大尺寸按钮内边距 | 缩小 | 缩小 | 标准 |
| 大尺寸选项文字 | tip1 | tip1 | text1 |
| 大尺寸选项内边距 | 6px 12px | 6px 12px | 7px 12px |
| 小/中尺寸选项内边距 | 标准 | 2px 12px | 4px 12px |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  trigger:
    element: .o-dropdown
    children:
      - { type: slot, name: default }  # 触发元素（通常为 OButton）
  popup:
    element: OPopup  # 通过 Teleport 挂载到 body
    position: bl  # --optionPosition, 底部左对齐
    offset: 4px
    children:
      - name: list
        element: ul.o-dropdown-list
        background: var(--o-color-control5-light)
        box-shadow: var(--o-shadow-2)
        border-radius: var(--o-radius_control-m)
        padding: 4px  # --dropdown-list-padding
        children:
          - name: item × N
            element: li.o-dropdown-item
            display: flex
            align-items: center
            justify-content: left
            border-radius: var(--o-radius_control-s)
            cursor: pointer
            gap-between: 2px  # --dropdown-item-gap (margin-top)
            children:
              - { type: slot, name: default }  # 或 label/value 文字
  variants:
    large:
      btn-padding: "0 15px 0 23px"
      item-font-size: var(--o-font_size-text1)
      item-padding: "7px 12px"
    medium:
      btn-padding: "0 11px 0 15px"
      item-font-size: var(--o-font_size-tip1)
      item-padding: "4px 12px"
    small:
      btn-padding: "0 11px 0 15px"
      item-font-size: var(--o-font_size-tip1)
      item-padding: "4px 12px"
```

**≤1200px**
```yaml
# large 按钮: padding "0 11px 0 15px"
# large 选项: font-size tip1, padding "6px 12px"
# small/medium 选项: padding "2px 12px"
```

**≤840px**
```yaml
# small 按钮: padding "0 7px 0 11px"
```
