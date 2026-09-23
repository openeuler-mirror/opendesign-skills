> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](grid.visual.md) · [代码使用](grid.usage.md)

# ORow/OCol 栅格布局 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--flex-gap-x` | `0px` | ORow 的横向间距基础值（`.o-flex` 根级变量） |
| `--flex-gap-y` | `0px` | ORow 的纵向间距基础值（`.o-flex` 根级变量） |

> 通常通过 `gap`/`gapX`/`gapY` prop 直接设置间距，CSS 变量仅在需要直接控制底层布局时使用。

---

### 响应式行为表

通过属性直接控制，无内置媒体查询样式。断点对应关系：

| 属性 | 断点 | 说明 |
|------|------|------|
| pcS | ≤1680px | 大屏 |
| laptop | ≤1440px | 笔记本 |
| pad | ≤1200px | 平板横屏 |
| padV | ≤840px | 平板竖屏 |
| phone | ≤600px | 手机 |

---

### 组件布局结构

```yaml
# ORow 行容器
root: div.o-row
  display: flex
  flex-wrap: props.wrap ("wrap" 默认)
  flex-direction: props.direction
  justify-content: props.justify
  align-items: props.align
  style:
    # 间距通过负 margin + 子元素 padding 实现（非 CSS gap）
    --row-gap-x: gap 横向值 (props.gapX 优先)
    --row-gap-y: gap 纵向值 (props.gapY 优先)
    --col-gap-x: calc(--row-gap-x / 2)  # 每侧一半
    --col-gap-y: --row-gap-y
    --row-shift-x: calc(-1 * --col-gap-x)
    --row-shift-y: calc(-1 * --col-gap-y)
    margin-left: --row-shift-x  # 负 margin 抵消首尾列的 padding
    margin-right: --row-shift-x
    margin-bottom: --row-shift-y  # 负 margin 抵消最后一行的 margin-bottom
  child-style: # 所有直接子元素
    padding-left: --col-gap-x
    padding-right: --col-gap-x
    margin-bottom: --col-gap-y
    flex: 1 0 auto (默认撑满)
  classes:  # 按断点属性动态添加
    - .o-row-pc-s: !!props.pcS
    - .o-row-laptop: !!props.laptop
    - .o-row-pad: !!props.pad
    - .o-row-pad-v: !!props.padV
    - .o-row-phone: !!props.phone
  children:
    - slot-default (OCol 列表)

# OCol 列容器
root: div.o-col
  flex: --col-flex (props.flex, 默认 "1 0 auto")
  align-self: props.align
  style:
    --col-flex: props.flex
    --col-pc-s-flex: props.pcS?.flex
    --col-laptop-flex: props.laptop?.flex
    --col-pad-flex: props.pad?.flex
    --col-pad-v-flex: props.padV?.flex
    --col-phone-flex: props.phone?.flex
  classes:
    - .o-col-pc-s: !!props.pcS
    - .o-col-laptop: !!props.laptop
    - .o-col-pad: !!props.pad
    - .o-col-pad-v: !!props.padV
    - .o-col-phone: !!props.phone
  children:
    - slot-default

# 默认 CSS 变量
.o-flex:
  --flex-gap-x: 0px
  --flex-gap-y: 0px

# 媒体查询断点（按断点 class 条件生效）
media-queries:
  "@media (max-width: 1680px)":
    .o-row-pc-s:
      --col-gap-x: calc(--row-pc-s-gap-x / 2)
      --col-gap-y: --row-pc-s-gap-y
    .o-col-pc-s:
      flex: --col-pc-s-flex
  "@media (max-width: 1440px)":
    .o-row-laptop:
      --col-gap-x: calc(--row-laptop-gap-x / 2)
      --col-gap-y: --row-laptop-gap-y
    .o-col-laptop:
      flex: --col-laptop-flex
  "@media (max-width: 1200px)":
    .o-row-pad:
      --col-gap-x: calc(--row-pad-gap-x / 2)
      --col-gap-y: --row-pad-gap-y
    .o-col-pad:
      flex: --col-pad-flex
  "@media (max-width: 840px)":
    .o-row-pad-v:
      --col-gap-x: calc(--row-pad-v-gap-x / 2)
      --col-gap-y: --row-pad-v-gap-y
    .o-col-pad-v:
      flex: --col-pad-v-flex
  "@media (max-width: 600px)":
    .o-row-phone:
      --col-gap-x: calc(--row-phone-gap-x / 2)
      --col-gap-y: --row-phone-gap-y
    .o-col-phone:
      flex: --col-phone-flex

# 间距实现原理
# gap prop 解析："24px" → gapX=24px, gapY=24px
#                "24px 16px" → gapX=24px, gapY=16px
# gapX/gapY prop 优先于 gap 中解析的值
# 每个断点 prop (pcS/laptop/pad/padV/phone) 同理
```
