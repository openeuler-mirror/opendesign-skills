> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](form.visual.md) · [代码使用](form.usage.md)

# OForm 表单 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--form-item-display` | `flex` | 表单项的 display 模式 |
| `--form-item-gap` | `24px` | 表单项之间的间距（响应式断点会自动缩小） |
| `--form-label-main-gap` | `32px` | 标签区与控件区之间的间距（水平模式，响应式断点会自动缩小） |
| `--form-label-gap-top` | `4px` | 标签区域的顶部 margin |
| `--form-msg-gap` | `4px 0 0 16px` | 校验消息的 padding |
| `--form-item-main-box-width-standard` | `min(var(--o-r-grid-6), 100%)` | 标准输入框宽度（响应式） |
| `--form-item-main-box-width-wide` | `min(var(--o-r-grid-14), 100%)` | 较宽输入框宽度（响应式） |
| `--form-item-main-box-inline-gap` | `var(--o-r-gap-4)` | 同域多控件输入框间距 |
| `--form-label-width` | `auto`（水平模式；`labelWidth` prop 覆盖） | 标签宽度。v1.2.7 起 `labelWidth` 默认 `'auto'` 自动测量最宽标签 |
| `--form-label-min-width` | `96px`（水平模式） | 标签最小宽度（auto 模式下生效） |
| `--form-label-max-width` | `var(--o-r-grid-4)`（水平布局下为 `var(--o-r-grid-3)`） | 标签最大宽度 |
| `--form-label-justify` | — | 标签水平对齐（由 labelJustify prop 覆盖） |
| `--form-item-align` | `flex-start`（水平模式） | 标签与控件的垂直对齐（由 labelAlign prop 覆盖） |
| `--form-label-main-gap-v` | `8px`（垂直模式） | 垂直模式下标签与控件的间距 |

**使用示例**：
```vue
<!-- 覆盖控件标准宽度（整个表单统一生效） -->
<OForm style="--form-item-main-box-width-standard: 280px;" :model="formData" />
```

---

### 响应式行为表

| 维度 | ≤600px | 601–840px | 841–1200px | 1201–1440px | >1440px |
|------|--------|----------|-----------|-------------|---------|
| 表单项间距 | 12px | 12px | 12px | 16px | 标准 |
| 标签-控件间距 | 8px | 8px | 16px | 24px | 标准 |

---

### 组件布局结构

```yaml
# layout="h" 水平模式（默认）
root: form.o-form.o-form-layout-h
  classes:
    - .o-form-has-required: hasRequired (显示必填星号占位)
  style:
    --form-item-display: flex
    --form-item-gap: 24px
    --form-label-main-gap: 32px
    --form-label-gap-top: 4px
    --form-label-width: 20%
    --form-label-max-width: 240px
    --form-item-align: flex-start
    --form-msg-gap: 4px 0 0 16px
    可覆盖: --form-label-width(labelWidth), --form-label-justify(labelJustify), --form-item-align(labelAlign)
  children:
    - slot-default:  # OFormItem 列表
        children:
          - .o-form-item (每个 OFormItem):
              display: flex (--form-item-display)
              align-items: --form-item-align (flex-start)
              margin-bottom: --form-item-gap (24px)，最后一项为 0
              classes:
                - .o-form-item-required: required
                - .o-form-item-danger: 校验失败 (margin-bottom 变 0，为消息腾空间)
                - .o-form-item-warning: 校验警告
              children:
                - .o-form-item-label:
                    display: inline-flex
                    align-items: center
                    flex: 0 0 --form-label-width (20%)
                    max-width: --form-label-max-width (240px)
                    justify-content: --form-label-justify
                    margin: --form-label-gap-top(4px) 0
                    children:
                      - .o-form-require-symbol:
                          condition: o-form-has-required 时显示(display:block)，required 时可见(opacity:1)
                          color: --o-color-danger1
                          font-size: --o-font_size-tip2
                          margin-right: 4px
                          children: slot-symbol (fallback: "*")
                      - slot-label:
                          fallback: span {{ label }}
                - .o-form-item-main:
                    flex: 1
                    margin-left: --form-label-main-gap (32px)
                    children:
                      - .o-form-item-main-wrap:
                          display: flex
                          align-items: center
                          min-height: 32px
                          children: slot-default (表单控件)
                      - .o-form-item-message:
                          condition: fieldResult?.message
                          padding: --form-msg-gap (4px 0 0 16px)
                          font-size: --o-font_size-tip2
                          color: --o-color-info3
                          min-height: --form-item-gap
                          classes:
                            - .type-danger: color --o-color-danger1
                            - .type-warning: color --o-color-warning1
                          children: slot-message (props: { message, type })
                      - .o-form-item-extra:
                          condition: slots.extra
                          margin-top: 4px
                          font-size: --o-font_size-tip2
                          color: --o-color-info3

# layout="v" 垂直模式
root: form.o-form.o-form-layout-v
  style:
    --form-label-width: 100%
    --form-label-justify: flex-start
    --form-label-main-gap-v: 8px
  .o-form-item:
    display: block (非 flex)
  .o-form-item-label:
    margin-bottom: --form-label-main-gap-v (8px)
    # 无 margin-left 间距，标签和控件上下排列

# layout="inline" 行内模式
root: form.o-form.o-form-layout-inline
  display: flex
  flex-wrap: wrap
  .o-form-item:
    margin: 0 --form-item-gap(24px) --form-item-gap(24px) 0
    # 标签与控件仍为 flex 同行，但多个 item 横向排列

# 响应式断点
breakpoints:
  "<=1440px (laptop)":
    form-item-gap: 16px
    form-label-main-gap: 24px
  "<=1200px (pad_h)":
    form-item-gap: 12px
    form-label-main-gap: 16px
  "<=840px (pad_v)":
    form-item-gap: 12px
    form-label-main-gap: 8px
  "<=600px (phone)":
    form-msg-gap: 4px 0 0 12px
```

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.7 | `--form-label-width` 默认值由 `20%` 改为 `auto`（配合 labelWidth 默认 `'auto'` 自动测量）；新增 `--form-label-min-width: 96px`；`--form-label-max-width` 由 `240px` 改为栅格变量（水平布局下为 `var(--o-r-grid-3)`）；必填星号改为绝对定位（不再占位缩进），字号 8px |
