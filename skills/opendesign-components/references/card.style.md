> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](card.visual.md) · [代码使用](card.usage.md)

# OCard 卡片 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--card-radius` | `var(--o-radius_control-l)` | 卡片整体圆角 |
| `--card-cover-radius` | `var(--o-radius_control-s)` | 封面图圆角 |
| `--card-main-padding-v` | `24px` | 内容区上下内边距 |
| `--card-main-padding-h` | `32px`（无封面）/ `24px`（有封面） | 内容区左右内边距 |
| `--card-content-gap` | `12px` | 标题与描述之间的间距 |
| `--card-header-text-size` | `var(--o-font_size-h3)` | 标题字号 |
| `--card-header-text-weight` | `600` | 标题字重（v1.2.4 从硬编码 500 提升为 CSS 变量） |
| `--card-content-text-size` | `var(--o-font_size-text1)` | 描述文字字号 |
| `--card-footer-gap` | `24px` | footer 内元素间距 |
| `--card-icon-gap` | `16px` | 图标与内容的间距 |
| `--card-h-cover-width` | `45%` | 横向布局时封面宽度占比 |
| `--card-h-cover-max-width` | `320px` | 横向布局时封面最大宽度 |

**使用示例**：
```vue
<!-- 紧凑模式：减小内边距 -->
<OCard style="--card-main-padding-v: 12px; --card-main-padding-h: 16px" :title="title" :detail="detail" />
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | 1201–1680px | >1680px |
|------|--------|-----------|-------------|---------|
| 卡片圆角 | s | s | m | l |
| 标题字号 | tip1 | text1 | text2 | text3 |
| 内边距（垂直） | 8px | 12px | 16px | 24px |
| 内边距（水平） | 12px | 16px | 24px | 24px |

可通过 `noResponsive` 禁用所有响应式调整。

---

### 组件布局结构

```yaml
# layout="v" 垂直模式（默认）
root: .o-card.o-card-layout-v
  direction: column
  tag: div | a (有 href 时)
  style:
    background: --card-bg-color (--o-color-fill2)
    border-radius: --card-radius (--o-radius_control-l)
    shadow-hover: --card-shadow-hover (--o-shadow-2)
  children:
    - slot-card:  # 使用后替换全部内部结构
        fallback:
          - .o-card-cover.o-card-cover-v:
              condition: cover prop 或 cover slot
              padding: 8px 8px 0
              children:
                - slot-cover:
                    fallback: OFigure(src, ratio, fit)
          - .o-card-main:
              condition: hasMain
              padding: --card-main-padding (24px 24px)
              children:
                - slot-main:
                    fallback:
                      - .o-card-icon:
                          condition: icon prop 或 icon slot
                          size: --card-icon-size (--o-icon_size-2xl)
                          gap: --card-icon-gap (16px)
                      - .o-card-main-wrap:
                          direction: column
                          children:
                            - .o-card-header:
                                color: --card-header-color (--o-color-info1)
                                font-size: --card-header-text-size (--o-font_size-h3)
                                children:
                                  - slot-header:
                                      fallback:
                                        - .o-card-title-icon (可选)
                                        - .o-card-title (slot-title)
                            - .o-card-content:
                                gap: --card-content-gap (12px)
                                color: --card-content-color (--o-color-info2)
                                font-size: --card-content-text-size (--o-font_size-text1)
                                children:
                                  - .o-card-detail (slot-detail)
                                  - slot-default
                            - .o-card-footer:
                                condition: footer slot
                                gap: --card-footer-gap (24px)
                                font-size: --card-footer-text-size (--o-font_size-tip1)

# layout="h" 水平模式
root: .o-card.o-card-layout-h
  direction: row
  children: # 同上，cover-padding 改为 8px 0 8px 8px
    - .o-card-cover.o-card-cover-h (width: 45%, max: 320px)
    - .o-card-main

# layout="hr" 反向水平模式
root: .o-card.o-card-layout-hr
  direction: row-reverse
  children: # 同上，cover-padding 改为 8px 8px 8px 0
    - .o-card-cover.o-card-cover-hr
    - .o-card-main

# 响应式断点
breakpoints:
  "<=1680px (laptop)":
    card-radius: --o-radius_control-m
    card-header-text-size: --o-font_size-text2
    card-main-padding: 16px 24px (cover: 16px)
    card-content-text-size: --o-font_size-tip1
    card-footer-text-size: --o-font_size-tip2
    card-icon-gap: 12px
  "<=1200px (pad_h)":
    card-radius: --o-radius_control-s
    card-cover-radius: --o-radius_control-xs
    card-header-text-size: --o-font_size-text1
    card-main-padding: 12px 16px (cover: 12px)
    card-icon-size: --o-icon_size-xl
    card-cover-padding: 4px
  "<=840px (pad_v)":
    card-header-text-size: --o-font_size-tip1
    card-main-padding: 8px 12px (cover: 8px)
    card-icon-size: --o-icon_size_control-l
    card-content-text-size: --o-font_size-tip2
    card-footer-text-size: 10px
```
