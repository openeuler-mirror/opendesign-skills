> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](figure.visual.md) · [代码使用](figure.usage.md)

# OFigure 图片 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--figure-padding-top` | `0px` | ratio 模式下 wrap 的 padding-top（由 ratio 计算自动覆盖，一般不手动设） |
| `--figure-fit` | `cover` | 图片填充方式（等同 object-fit / background-size） |
| `--figure-position` | `center` | 图片定位（等同 object-position / background-position） |
| `--figure-radius` | `0` | 图片容器圆角 |
| `--figure-error-bk` | `var(--o-color-control4)` | 加载失败时的背景色 |
| `--figure-error-color` | `var(--o-color-control4)` | 加载失败时错误图标的颜色 |
| `--figure-error-size` | `var(--o-icon_size_control-l)` | 加载失败时错误图标的大小 |
| `--figure-play-icon-size` | `64px` | 视频海报播放图标的尺寸（响应式下自动缩小） |

**使用示例**：
```vue
<OFigure src="/photo.jpg" :ratio="16/9" style="--figure-radius: 8px; --figure-fit: contain" />
```

---

### 响应式行为表

| 维度 | ≤600px (手机) | 601–1200px (平板) | >1200px (笔记本+) |
|------|--------------|------------------|--------------------|
| 播放图标大小 | 40px | 48px | 56px |
| 标题字号 | tip1 | text1 | 标准 |
| 描述区域内边距 | 4px 8px | 12px 16px | 标准 |
| 预览层行为 | 预览层为 OImageViewer 全屏查看器（自动适屏、缩放/旋转/切图），响应式规则详见 [image-viewer.style.md](image-viewer.style.md) | 同左 | 同左 |

---

### 组件布局结构

```yaml
# 基础模式（无 ratio）
root: .o-figure
  display: inline-flex
  align-items: center
  overflow: hidden
  tag: div | a (有 href 时)
  style:
    border-radius: --figure-radius (0)
    transition: background-color --o-duration-m2
  classes:
    - .o-figure-hoverable: hoverable/href/preview/videoPoster
    - .o-figure-previewable: preview (cursor: pointer)
    - .o-figure-video-poster: videoPoster
    - .o-figure-bg: background 模式
    - .is-loading.is-colorful: 加载中彩色背景 (--figure-prest-color)
    - .is-error: 加载失败 (background-color: --figure-error-bk = --o-color-control4)
  children:
    # 无 ratio 时直接渲染 img
    - img.o-figure-img:
        condition: imgSrc && !background && !ratio
        width: 100%
        height: 100%
        object-fit: --figure-fit (cover)
        object-position: --figure-position (center)
        max-width: 100%
        transition: opacity --o-duration-m2, transform --o-easing-standard 600ms
    # 有 ratio 时通过 wrap 撑开高度
    - .o-figure-wrap:
        condition: ratio 或 isError
        position: relative
        width: 100%
        padding-top: (1/ratio)*100% (--figure-padding-top)
        children:
          - .o-figure-error-wrap:
              condition: isError
              position: absolute, inset: 0
              display: flex, align/justify: center
              font-size: --figure-error-size (--o-icon_size_control-l)
              color: --figure-error-color (--o-color-control4)
              children:
                - slot-error:
                    fallback: IconImageError
          - img.o-figure-img-ratio:
              condition: !background && imgSrc && !isError
              position: absolute, left/top: 0, width/height: 100%
              object-fit: --figure-fit (cover)
    # 覆盖层（视频海报/插槽内容/描述区）
    - .o-figure-main:
        condition: videoPoster || slots.content || slots.title || slots.default
        position: absolute, inset: 0
        transition: background-color --o-easing-standard-in --o-duration-m1
        children:
          - slot-default  # 自由覆盖内容
          - .o-figure-mask:
              condition: videoPoster
              background: rgba(black, 0.2)
              display: flex, align/justify: center
              position: absolute, inset: 0
              children:
                - slot-play-icon:
                    fallback:
                      - .o-figure-play-icon:
                          width/height: --figure-play-icon-size (64px)
                          font-size: calc(size/64*24)
                          border-radius: 50%
                          color: --o-color-white
                          background: rgba(white, 0.2)
                          border: 1px solid rgba(white, 0.6)
                          backdrop-filter: blur(1px)
          - .o-figure-content:
              condition: slots.content || slots.title
              position: absolute, bottom: 0, left: 0, width: 100%
              padding: 16px 24px
              color: --o-color-white
              background: linear-gradient(180deg, rgba(black,0) 0%, rgba(black,0.6) 100%)
              font-size: --o-font_size-tip1
              children:
                - slot-content:
                    fallback:
                      - .o-figure-title:
                          font-size: --o-font_size-h3
                          children: slot-title
    # 预览弹层（v1.2.7 起为 OImageViewer 全屏查看器）
    - OImageViewer:
        condition: preview || lazyPreview
        v-model:visible: previewVisible
        wrapperClass: o-figure-preview-wrapper
        containerClass: o-figure-preview-img
        children:
          - slot-preview:
              props: { src }
              fallback: OImageViewer 默认查看器 UI（自动适屏 + 缩放/旋转/切图）
          - slot-preview-extra  # 叠加在预览图上的附加内容

# background 模式
root: .o-figure.o-figure-bg
  background-size: --figure-fit (cover)
  background-position: --figure-position (center)
  background-repeat: no-repeat
  # 无 ratio 时 .o-figure-main 变为 position: relative（由内容撑高）

# hoverable 交互
.o-figure-hoverable:
  cursor: pointer
  hover: img transform: scale(1.05)
  active: img transform: scale(1.02), .o-figure-main background: rgba(black, 0.1)

# 响应式断点
breakpoints:
  "<=1440px (laptop)":
    figure-play-icon-size: 56px
  "<=1200px (pad)":
    figure-play-icon-size: 48px
    .o-figure-title: font-size --o-font_size-text1
    .o-figure-content: padding 12px 16px
  "<=600px (phone)":
    figure-play-icon-size: 40px
    .o-figure-title: font-size --o-font_size-tip1
    .o-figure-content: padding 4px 8px
```

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.7 | 预览层切换为 OImageViewer：预览图的响应式规则（max-width 100vw、遮罩纯黑、关闭按钮左移）随之移除，改由 OImageViewer 的自动适屏与查看器样式接管（详见 image-viewer.style.md） |
