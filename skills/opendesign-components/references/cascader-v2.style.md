> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](cascader-v2.visual.md) · [代码使用](cascader-v2.usage.md)

# OCascaderV2 级联选择器（V2） — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**选择器触发器变量**：

| 变量名 | 默认值(large) | 默认值(medium) | 说明 |
|--------|-------------|-------------|------|
| `--cascader-v2-text-size` | `var(--o-font_size-text1)` | `var(--o-font_size-tip1)` | 文字字号 |
| `--cascader-v2-text-height` | `var(--o-line_height-text1)` | `var(--o-line_height-tip1)` | 文字行高 |
| `--cascader-v2-placeholder` | `var(--o-color-info4)` | 同 | 占位文字颜色 |
| `--cascader-v2-icon-color` | `var(--o-color-info3)` | 同 | 图标颜色 |
| `--cascader-v2-icon-size` | `var(--o-icon_size_control-m)` | `var(--o-icon_size_control-xs)` | 图标尺寸 |
| `--cascader-v2-icon-gap` | `8px` | 同 | 图标间距 |
| `--cascader-v2-height` | `var(--o-control_size-l)` | `var(--o-control_size-m)` | 选择框高度 |
| `--cascader-v2-multiple-max-height` | `64px` | `64px` | 多选最大高度 |
| `--cascader-v2-tag-bg-color` | `var(--o-color-control2-light)` | 同 | 标签背景色 |
| `--cascader-v2-tag-radius` | `4px` | 同 | 标签圆角 |
| `--cascader-v2-tag-text-size` | `var(--o-font_size-tip2)` | 同 | 标签字号 |

**面板变量**：

| 变量名 | 默认值(large) | 默认值(medium) | 说明 |
|--------|-------------|-------------|------|
| `--cascader-v2-panel-container-max-height` | `388px` | `293px` | 面板最大高度 |
| `--cascader-v2-panel-container-max-width` | `320px` | 同 | 面板最大宽度 |
| `--cascader-v2-option-padding` | `7px 12px` | `3px 12px` | 选项内边距 |
| `--cascader-v2-option-text-size` | `var(--o-font_size-text1)` | `var(--o-font_size-tip1)` | 选项字号 |
| `--cascader-v2-option-icon-size` | `var(--o-icon_size-m)` | `var(--o-icon_size-xs)` | 选项图标尺寸 |
| `--cascader-v2-option-color` | `var(--o-color-info2)` | 同 | 选项文字颜色 |
| `--cascader-v2-option-color-selected` | `var(--o-color-primary1)` | 同 | 选中文字颜色 |
| `--cascader-v2-option-bg-color-hover` | `var(--o-color-control2-light)` | 同 | 选项悬停背景 |
| `--cascader-v2-option-bg-color-selected` | `var(--o-color-control3-light)` | 同 | 选项选中背景 |

**使用示例**:
```vue
<OCascaderV2 v-model="val" :options="options" style="--cascader-v2-height: 40px; --cascader-v2-icon-gap: 12px" />
```

---

### 响应式行为表

| 维度 | pad_v ~ laptop | > laptop |
|------|---------------|---------|
| large 选择框高度 | 36px | `--o-control_size-l` |
| large 选择框字号 | tip1 | text1 |
| large 选择框图标 | control-s | control-m |
| large 面板选项 padding | 6px 12px | 7px 12px |
| large 面板选项字号 | tip1 | text1 |
| large 面板选项图标 | s | m |
| medium 选择框高度 | 28px | `--o-control_size-m` |
| medium 选择框图标 | control-xs | control-xs |
| 触控设备 expandTrigger | 强制 click | 保留原设置 |

---

### 组件布局结构

**OCascaderV2 触发器**
```yaml
layout:
  component: InBox.o-cascader-v2
  direction: horizontal
  size: 由 size/variant/color/round 决定
  regions:
    - name: value-list
      element: OScroller.o-cascader-v2-tags-scroller
      wrap-class: o-cascader-v2-value-list
      children:
        - name: single-input
          condition: 非多选 或 多选无选中值
          element: input.o-cascader-v2-input
          style: readonly=!filterable
        - name: multiple-tags
          condition: 多选 + 有选中值
          element: div.o-cascader-v2-tags-wrap
          children:
            - div.o-cascader-v2-tag(循环valueListDisplay)
              - span.o-cascader-v2-tag-text
              - div.o-cascader-v2-tag-remove(IconClose)
            - OPopover(折叠tag, condition: maxTagCount 有值且超限)
              - div.o-cascader-v2-tag(foldLabel / #tagFold)
              - 浮层: div.o-cascader-v2-tags(折叠tag列表)
            - input.o-cascader-v2-input(filterable模式下)
              - span.o-cascader-v2-input-mirror(宽度测量)
    - name: suffix
      element: div.o-cascader-v2-suffix
      children:
        - div.o-cascader-v2-suffix-icon
          - IconLoading(loading=true, 旋转)
          - IconClose(clearable + hover, 替换箭头)
          - IconChevronDown(下拉箭头, #arrow插槽)
        - slot: suffix(active:isSelecting)
```

**OCascaderV2Panel 正常模式**
```yaml
layout:
  component: div.o-cascader-v2-panel
  direction: horizontal(flex)
  regions:
    - column*1~N(循环panelInfo)
      - ODivider(direction=v, 列间分隔, index>0时)
      - OScroller.o-cascader-v2-panel-scroller
        - ul.o-cascader-v2-options
          - li.o-cascader-v2-option(循环columnInfo)
            - OCascaderV2Label:
              - ORadio(单选+allowSelectAnyNode)
              - OCheckbox(多选)
              - span.o-cascader-v2-option-label(文本)
              - span.o-cascader-v2-option-arrow(IconChevronRight/IconLoading)
              - OPopover(文本溢出提示)
```

**OCascaderV2Panel 筛选模式**
```yaml
layout:
  component: div.o-cascader-v2-panel
  direction: single-column
  regions:
    - OScroller(搜索结果列表)
      - ul.o-cascader-v2-options.o-cascader-v2-options-filterable
        - li.o-cascader-v2-option(循环filteredOptions)
          - OCascaderV2Label(labelParts高亮)
    - div.o-cascader-v2-panel-empty(无结果时)
```
