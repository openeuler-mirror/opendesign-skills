> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](image-viewer.visual.md) · [代码使用](image-viewer.usage.md)

# OImageViewer 图片预览 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--image-viewer-ratio-width` | `82px` | 缩放比例提示框宽度 |
| `--image-viewer-ratio-height` | `24px` | 缩放比例提示框高度 |
| `--image-viewer-ratio-bgc` | `var(--o-color-mask2)` | 缩放比例提示框背景色 |
| `--image-viewer-ratio-color` | `var(--o-color-white)` | 缩放比例提示框文字颜色 |
| `--image-viewer-ratio-radius` | `var(--o-radius-xs)` | 缩放比例提示框圆角 |
| `--image-viewer-ratio-backdrop-filter` | `4px` | 缩放比例提示框背景模糊 |
| `--image-viewer-action-bottom` | `var(--o-r-gap-10)` | 操作区（工具栏）距底部偏移 |
| `--image-viewer-action-padding` | `var(--o-r-gap-4) var(--o-r-gap-5)` | 操作区内边距 |
| `--image-viewer-action-item-gap` | `var(--o-r-gap-7)` | 操作项间距 |
| `--image-viewer-action-bgc` | `var(--o-color-white)` | 操作区背景色 |
| `--image-viewer-action-radius` | `var(--o-radius-m)` | 操作区圆角 |
| `--image-viewer-cursor-type` | `move` | 拖拽时光标类型 |
| `--image-viewer-icon-color` | `var(--o-color-info2)` | 操作图标颜色 |
| `--image-viewer-icon-color-hover` | `var(--o-color-info1)` | 操作图标悬停颜色 |
| `--image-viewer-icon-size` | `var(--o-control_size-s)` | 操作图标尺寸 |
| `--image-viewer-nav-size` | — | 上一张/下一张按钮尺寸（导航按钮为 OButton，默认尺寸跟随按钮组件） |
| `--image-viewer-nav-color` | `var(--o-color-info1-inverse)` | 上一张/下一张按钮颜色（反色，适配深色遮罩） |
| `--image-viewer-nav-color-hover` | `var(--o-color-info2-inverse)` | 上一张/下一张按钮悬停颜色 |
| `--image-viewer-nav-color-disabled` | — | 上一张/下一张按钮禁用颜色（按钮背景固定为 `--o-color-mask1`） |
| `--image-viewer-progress-color` | `var(--o-color-info2-inverse)` | 进度指示器文字颜色 |
| `--image-viewer-error-color` | `var(--o-color-info2-inverse)` | 图片加载错误提示颜色 |

**使用示例**：
```vue
<OImageViewer
  v-model:visible="visible"
  :preview-list="imgList"
  style="--image-viewer-action-bgc: rgba(0,0,0,0.6); --image-viewer-icon-color: #fff"
/>
```

遮罩与关闭按钮等浮层行为通过 `layerOptions`（透传 OLayer）配置；遮罩颜色等 OLayer 样式变量可直接在 `layerOptions.wrapperClass` 指定的类上覆盖。

---

### 响应式行为表

| 维度 | ≤600px (手机) | 601–840px (pad_v) | 841–1200px (pad) | >1200px (笔记本+) |
|------|--------------|-------------------|------------------|--------------------|
| 缩放比例提示框 | 64×20px | 64×20px | 82×24px | 82×24px |
| 导航按钮（触摸设备） | 隐藏（swipe 切图） | 隐藏（swipe 切图） | 显示 | 显示 |
| 工具栏（触摸设备） | 隐藏（双指缩放） | 隐藏 | 隐藏（双指缩放） | 显示 |
| 导航按钮/工具栏（非触摸设备） | 显示 | 显示 | 显示 | 显示 |

> 触摸设备判定：`hover: none` 且 `pointer: coarse`。带触摸屏的笔记本（有 hover）不受隐藏规则影响。

---

### 组件布局结构

```yaml
root: OLayer.o-image-viewer  # role="dialog" aria-modal="true"
  layer-options 默认: { mask: true, maskClose: false, buttonClose: true, wrapper: null }
  children:
    - .o-image-viewer-body:  # main 区域，全屏
        children:
          # 自定义 preview 插槽整体替换以下图片区
          - slot-preview:
              props: { src }
              fallback:
                - .o-image-viewer-container:
                    transition: 图片切换 o-image-in / o-image-out（mode: out-in）
                    children:
                      - slot-error:
                          condition: 加载失败
                          props: { activeIndex, src }
                          fallback: 错误提示（色值 --image-viewer-error-color）
                      - .o-image-viewer-img-wrap:
                          condition: 图片就绪
                          transform: scale(scale) rotate(deg) translate(x, y)
                          cursor: --image-viewer-cursor-type (move) 拖拽时
                          children:
                            - img.o-image-viewer-img:
                                max-width: none  # 按自然尺寸渲染，transform 全权控制缩放
          - slot-default  # 图片容器外的覆盖内容（如播放控制）
          - .o-image-viewer-nav-prev / .o-image-viewer-nav-next:
              position: 左右垂直居中（OButton o-image-viewer-nav）
              disabled: !infinite 且在首/尾时
              触摸紧凑屏: display none（swipe 替代）
          - .o-image-viewer-ratio:  # 缩放百分比提示
              position: 工具栏上方居中浮现
              transition: o-image-zoom-ratio（淡入淡出）
          - .o-image-viewer-progress:
              condition: showProgress
              children: slot-progress { activeIndex, total }
          - .o-image-viewer-action:  # 底部工具栏
              condition: toolbar 非 false/空
              position: 底部居中
              background: --image-viewer-action-bgc
              children: slot-toolbar { actions, prev, next, reset, activeIndex, setActiveItem }
              fallback: 按 toolbar 数组顺序渲染 zoomIn/zoomOut/reset/rotateLeft/rotateRight/close 图标按钮
              scalable=false 时: 过滤 zoomIn/zoomOut/reset（仅剩 close 则整个隐藏）

# 响应式断点
breakpoints:
  "phone (<=600px)":
    --image-viewer-ratio-width: 64px
    --image-viewer-ratio-height: 20px
  "hover:none + pointer:coarse（触摸设备）":
    "<=840px (pad_v)": .o-image-viewer-nav display:none
    "<=1200px (pad)": .o-image-viewer-action display:none
```
