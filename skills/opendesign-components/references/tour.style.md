> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tour.visual.md) · [代码使用](tour.usage.md)

# OTour 漫游引导 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--tour-width` | `var(--o-r-grid-6)` | 引导卡片宽度 |
| `--tour-radius` | `var(--o-radius_control-s)` | 引导卡片圆角 |
| `--tour-padding` | `24px` | 引导卡片内边距 |
| `--tour-bg-color` | `var(--o-color-control5-light)` | 引导卡片背景色 |
| `--tour-shadow` | `var(--o-shadow-1)` | 引导卡片阴影 |
| `--tour-title-size` | `var(--o-font_size-tip1)` | 标题字号 |
| `--tour-title-height` | `var(--o-line_height-tip1)` | 标题行高 |
| `--tour-title-color` | `var(--o-color-info1)` | 标题颜色 |
| `--tour-title-weight` | `var(--o-font_weight-semibold)` | 标题字重 |
| `--tour-detail-size` | `var(--o-font_size-tip2)` | 详情字号 |
| `--tour-detail-height` | `var(--o-line_height-tip2)` | 详情行高 |
| `--tour-detail-color` | `var(--o-color-info2)` | 详情文字颜色 |
| `--tour-detail-gap` | `8px` | 详情与标题间距 |
| `--tour-footer-gap` | `12px` | 底部区域间距 |
| `--tour-btn-gap` | `16px` | 按钮间距 |
| `--tour-indicators-size` | `var(--o-font_size-tip1)` | 指示器字号 |
| `--tour-indicators-height` | `var(--o-line_height-tip1)` | 指示器行高 |
| `--tour-indicators-color` | `var(--o-color-info3)` | 指示器颜色 |
| `--tour-close-size` | `var(--o-icon_size_control-m)` | 关闭按钮尺寸 |
| `--tour-close-color` | `var(--o-color-info2)` | 关闭按钮颜色 |
| `--tour-close-color-hover` | `var(--o-color-primary2)` | 关闭按钮 hover 颜色 |
| `--tour-close-color-active` | `var(--o-color-primary3)` | 关闭按钮 active 颜色 |
| `--tour-close-img-size` | `32px` | 图片模式关闭按钮尺寸 |
| `--tour-close-img-bg` | `var(--o-color-control1)` | 图片模式关闭按钮背景色 |
| `--tour-mask-fill` | `rgba(0, 0, 0, 0.5)` | 遮罩填充色 |
| `--popup-bd` | `1px solid var(--o-color-control4)` | 弹层边框（Tour 覆盖 OPopup 默认值） |
| `--popup-bg-color` | `var(--o-color-control5-light)` | 弹层背景色（Tour 覆盖 OPopup 默认值） |
| `--_tour-anchor-bg` | `var(--popup-bg-color)` | 箭头背景色（带图步骤自动取图片像素色，此变量为回退值，内部变量） |

**使用示例**：
```vue
<OTour
  v-model:visible="show"
  style="--tour-width: 360px; --tour-mask-fill: rgba(0,0,0,0.65); --tour-radius: 12px"
>
  <OTourStep target="#a" title="A" detail="..." />
</OTour>
```

内置修饰态（按状态自动应用，可覆盖其变量微调）：

| 修饰类 | 触发条件 | 变化 |
|--------|---------|------|
| `.o-tour-center` | 步骤无 target（居中模式） | 卡片加宽（`--o-r-grid-10`）、间距加大 |
| `.o-tour-not-mask` | `mask=false` | 内边距 16px、标题/详情字号降为 text1、间距收紧 |
| `.o-tour-img-close` | 步骤带 img | 关闭按钮变白色调（浮在图片上） |

---

### 响应式行为表

| 维度 | ≤600px (手机) | 601–840px (pad_v) | >840px (笔记本+) |
|------|--------------|-------------------|-------------------|
| 引导组件整体 | 不渲染 | 不渲染 | 渲染 |
| 卡片宽度 | — | — | `var(--o-r-grid-6)`（居中模式 `var(--o-r-grid-10)`），随栅格变量缩放 |

> ≤840px（phone / pad_v）时组件不渲染卡片与遮罩，视口恢复后自动出现；无需调用方配置。

---

### 组件布局结构

```yaml
root: Teleport(wrapper) > .o-tour
  classes:
    - .o-tour-center: 无 target 时（卡片加宽）
    - .o-tour-not-mask: mask=false 时（紧凑样式）
    - .o-tour-img-close: 步骤带图时
  children:
    - .o-tour-mask:
        condition: mask=true
        structure: SVG(evenodd)
          - path.o-tour-mask-hollow:
              fill: --tour-mask-fill
              在目标矩形外扩 12px 处挖出圆角镂空
              圆角: spotlightRadius（'pill'=短边一半 / CSS 长度 / 默认 4px）
    - OPopup.o-tour-popup:  # trigger=none，由 Tour 控制显隐
        target-rect: 目标元素矩形（无 target 时为视口居中矩形）
        offset: 12, edge-offset: 4, adaptive: true
        children:
          - .o-tour-content:  # tabindex=-1 聚焦容器
              style: contentStyle
              children:
                - OTourSteps:  # 过滤 slot，仅渲染 current 对应的 OTourStep
                    children:
                      - .o-tour-step:
                          children:
                            - .o-tour-close: condition: showClose（IconClose）
                            - .o-tour-step-content:
                                children:
                                  - slot-left
                                  - .o-tour-step-content-card:
                                      children:
                                        - slot-img:
                                            fallback: img.o-tour-img（有 img prop 时）
                                        - .o-tour-body:
                                            children:
                                              - .o-tour-title: condition: title 或 title 插槽
                                                  children: slot-title → title prop
                                              - .o-tour-detail: condition: detail 或 detail 插槽
                                                  children: slot-detail → detail prop
                                        - .o-tour-footer:
                                            children:
                                              - .o-tour-skip: slot-skip
                                              - .o-tour-indicators:
                                                  condition: total>1 或 indicators 插槽存在
                                                  children: slot-indicators {current,total} → "n/m"
                                              - .o-tour-buttons:
                                                  children: slot-footer {current,total,onPrev,onNext}
                                                      fallback:
                                                        - OButton(上一步): text 变体，current>0 时
                                                        - OButton(下一步/完成): solid + pill，最后一步文案"完成"
```
