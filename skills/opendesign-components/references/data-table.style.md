> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](data-table.visual.md) · [代码使用](data-table.usage.md)

# ODataTable 数据表格 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--table-filter-trigger-gap` | `4px` | 筛选触发图标与表头文字的间距 |
| `--table-filter-trigger-size` | `16px` | 筛选触发图标大小 |
| `--table-head-bg` | `var(--o-color-control3-light)` | 表头背景色（fill 模式） |
| `--table-head-border-bottom` | `var(--table-border-width) solid var(--table-head-bg)` | 表头底部边框（fill 模式） |
| `--popup-bg-color` | `var(--o-color-control5-light)` | 列筛选弹出面板背景色 |
| `--popup-radius` | `var(--o-radius-xs)` | 列筛选弹出面板圆角 |
| `--popup-shadow` | `var(--o-shadow-2)` | 列筛选弹出面板阴影 |
| `--table-filter-popup-width` | `192px` | 列筛选弹出面板宽度 |
| `--table-filter-option-list-max-height-default` | `256px` | 列筛选选项列表最大高度 |

**使用示例**：
```vue
<ODataTable
  :columns="columns"
  :data="data"
  style="--table-filter-popup-width: 240px; --table-filter-option-list-max-height-default: 320px"
/>
```

---

### 响应式行为表

| 维度 | 手机/平板竖屏 (<=pad_v) | 桌面端 |
|------|------------------------|--------|
| 列筛选面板 | 底部弹窗 (ODialog) | 弹出层 (OPopup) |
| 多列固定 (iOS) | 仅支持最左 1 列 + 最右 1 列 | 无限制 |

---

### 组件布局结构

```yaml
component: ODataTable
root: .o-data-table.o-table
  direction: column (position: relative; overflow: hidden)
  border-radius: var(--table-radius)  # var(--o-radius_control-m)
  background-color: var(--table-bg-color)  # var(--o-color-control5)
  CSS-class-modifiers:
    - .o-table-{size}: medium | small
    - .o-table-header-{headerStyle}: fill | split-line
    - .o-table-stripe: 斑马纹
    - .o-table-border-{border}: all | row | column | frame 等
    - .is-overflow-left / .is-overflow-right / .is-overflow-top: 滚动溢出方向
  style-bindings:
    --table-header-height: headerTableHeight (动态计算)
    --table-height: props.height
    --table-max-height: props.maxHeight  # 默认 fit-content

  children:
    # 1. 分割线表头水平分割线（仅 split-line 模式）
    - region: header-divider-h
      class: .o-data-table-header-divider-h
      condition: showHeader && headerStyle === 'split-line'
      position: sticky; z-index: 3
      top: calc(var(--table-header-height) * 1px)
      height: 1px; background: linear-gradient

    # 2. 左侧阴影指示器（无左固定列时使用）
    - region: left-shadow
      class: .o-data-table-left-shadow
      condition: !hasLeftFixedColumn && !loading && data.length
      z-index: 3; display: none (is-overflow-left时display: block)

    # 3. 滚动容器
    - region: scroller
      component: OScroller
      class: .o-table-scroller
      wrap-class: .o-table-wrap
        height: var(--table-height)
        max-height: var(--table-max-height)
        overflow: auto
      children:
        - region: table
          element: table.o-table-inner-table
          min-width: props.minTableWidth
          children:
            # 3a. 列宽定义
            - region: colgroup
              component: TableColGroup
              element: colgroup
              children:
                - col (v-for column: 每列一个col元素, 设定min/maxWidth)

            # 3b. 表头
            - region: thead
              element: thead.o-table-header
              condition: props.showHeader
              position: sticky; top: 0; z-index: 2
              background-color: var(--table-head-bg)
                # fill模式: var(--o-color-control3-light)
                # split-line模式: var(--o-color-control5)
              children:
                - slot: header (替换整个thead)
                - fallback: tr.o-table-header-row (v-for groupColumns)
                  children:
                    - th.o-table-header-cell (v-for column)
                      padding: unset (通过内部.o-table-cell__inner控制)
                      position: sticky (若column.fixed)
                      children:
                        - span.o-table-cell__inner
                          display: flex; align-items: center
                          padding: var(--table-head-cell-padding)  # 12px 16px
                          首列额外padding-left: var(--table-edge-padding)  # 32px
                          末列额外padding-right: var(--table-edge-padding)  # 32px
                          children:
                            - OCheckbox (条件: isFirstCol && selection, 全选框)
                            - icon-placeholder (条件: isFirstCol && 有展开列)
                            - span.o-table-cell__inner-content
                              overflow: hidden; text-overflow: ellipsis
                              max-lines: showHeaderOverflowToolTip (默认 1 行, 超出显示气泡)
                              children: slot th_{key} 或 column.label
                            - TableColumnFilter (条件: column.filter)
                            - TableColumnSorter (条件: column.sortKey)
                            - OPopover (条件: column.description, 描述气泡)
                        - div.o-table-column-resizer (条件: columnResizable)

            # 3c. 表体
            - region: tbody
              element: tbody.o-table-body
              children:
                - component: TableRow (v-for data, 递归组件)
                  element: tr.o-table-body-row
                  children:
                    - td.o-table-body-cell (v-for dataColumns)
                      position: sticky (若column.fixed)
                      children:
                        - span.o-table-cell__inner
                          display: flex; align-items: center
                          padding: var(--table-cell-padding)  # 12px 16px
                          children:
                            - OCheckbox (条件: isFirstCol && selection, 行选框)
                            - icon-placeholder * level (树形缩进)
                            - IconChevronRightSmall (条件: 可展开, 展开箭头)
                            - TableCellRenderer (formatter 或 slot td_{key})
                  # 展开行（expand模式）
                  - tr.o-table-row-expand (条件: expandBy==='expand' && isRowExpanded)
                    - td[colspan=全列] > span.o-table-expand-cell__inner
                      padding: var(--table-expand-cell-padding)  # 32px
                  # 子行（children树形模式，递归TableRow）
                  - TableRow (v-for row.children, level+1)

                - div.empty-placeholder (条件: loading || data为空)

    # 4. 加载遮罩层
    - region: loading-wrap
      class: .o-table-loading-wrap
      condition: props.loading
      position: absolute; top: calc(var(--table-header-height) * 1px)
      background-color: var(--table-bg-color)
      children: slot loading 或 IconLoading + loadingLabel

    # 5. 空状态层
    - region: tip-wrap
      class: .o-table-tip-wrap
      condition: !loading && !data.length
      position: absolute; top: calc(var(--table-header-height) * 1px)
      children: slot empty 或 emptyLabel

    # 6. 右侧阴影指示器
    - region: right-shadow
      class: .o-data-table-right-shadow
      condition: !hasRightFixedColumn && !loading && data.length

    # 7. 溢出气泡
    - region: popover
      component: OPopover
      condition: popoverVisible
      position: top(表头) / bottom(表体)

# 尺寸变体
size-variants:
  medium:
    --table-text-size: var(--o-font_size-text1)
    --table-text-height: var(--o-line_height-text1)
    --table-head-cell-padding: 12px 16px
    --table-cell-padding: 12px 16px
    --table-edge-padding: 32px
    --table-expand-cell-padding: 32px
    --table-row-icon-size: var(--o-icon_size-m)
    --table-row-icon-gap: 8px
  small:
    --table-text-size: var(--o-font_size-tip1)
    --table-text-height: var(--o-line_height-tip1)
    --table-head-cell-padding: 8px 16px
    --table-cell-padding: 8px 16px
    --table-edge-padding: 16px
    --table-expand-cell-padding: 24px

# 固定列机制
fixed-columns:
  mechanism: position: sticky
  left-fixed: left值由列宽累加计算
  right-fixed: right值由列宽累加计算
  shadow:
    last-left-fixed: 右侧伪元素阴影 linear-gradient(90deg)
    first-right-fixed: 左侧伪元素阴影 linear-gradient(-90deg)
    shadow-size: var(--table-fixed-col-shadow-size)  # 16px
    gradient: var(--table-fixed-col-shadow-gradient)
  overflow-trigger: .is-overflow-left / .is-overflow-right 显示对应阴影

# 筛选面板布局
filter-panel:
  desktop: OPopup弹出层
    width: var(--table-filter-popup-width)  # 192px
    children: [搜索输入框, 选项列表(OOptionList), 分割线, 操作按钮区]
  mobile: ODialog底部弹窗
    children: [同上，样式适配移动端]
```
