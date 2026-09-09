> ← [组件索引](../SKILL.md#组件索引) · [代码使用](image-viewer.usage.md) · [样式定制](image-viewer.style.md)

# OImageViewer 图片预览 — 视觉识别

OImageViewer 是全屏图片查看器组件，支持拖拽平移、滚轮/双指缩放、旋转、多图切换、缩放比例提示与工具栏操作。组件内部持有 OLayer 全屏遮罩，可独立使用、函数式调用（useImageViewer），也作为 OFigure 点击预览的内置预览层。@since v1.2.7

📱 **响应式行为**：
- 触摸设备（无 hover、粗指针）紧凑屏下以手势替代 UI：≤840px 隐藏左右切换按钮（swipe 滑动切图），≤1200px 隐藏工具栏（双指缩放 + OLayer 关闭按钮替代）
- 非触摸设备任意宽度均显示导航按钮和工具栏
- 缩放比例提示框手机端缩小：82×24px → 64×20px

🧩 **布局结构**：全屏 OLayer 遮罩层（`.o-image-viewer`）内，图片按自然尺寸居中渲染、由 transform 控制缩放/旋转/平移；左右两侧有上一张/下一张导航按钮，底部偏上是白色圆角工具栏（缩放/重置/旋转/关闭按钮），工具栏上方浮现黑色半透明圆角缩放百分比提示框；多图时可显示进度指示器。
```yaml
# 简化结构摘要（完整版见 Part B）
layer(全屏遮罩):
  - img(居中，transform 缩放/旋转/拖拽)
  - nav-prev / nav-next(左右居中)
  - action-toolbar(底部白色圆角条)
  - zoom-ratio(工具栏上方黑色提示框)
  - progress(进度指示器，可选)
```

### 设计稿识别指南

**视觉特征指纹**

1. 全屏黑色半透明遮罩（`.o-layer` 遮罩），图片居中占主体
2. 底部一条白色圆角横向工具栏，内含放大/缩小/重置/旋转/关闭图标按钮
3. 工具栏上方浮着黑色半透明小胶囊（缩放百分比，如 "120%"）
4. 图片左右两侧的白色圆形上一张/下一张按钮（hover 才明显）
5. 可选的进度指示器（"2 / 5" 样式文本）
6. 顶部右上角 OLayer 关闭按钮

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop | Prop 值 |
|---------|---------------|------|--------|
| 全屏遮罩预览 | OLayer mask | `visible`（v-model） | `true` |
| 多图切换 | 左右导航按钮 | `previewList` | 图片 URL 数组 |
| 循环切换 | 最后一张继续下一张 | `infinite` | `true`（默认） |
| 显示进度 | "n / m" 文本 | `showProgress` | `true` |
| 自定义工具栏按钮集 | zoomIn/zoomOut/reset/rotateLeft/rotateRight/close | `toolbar` | 按顺序的按钮名数组 |
| 隐藏缩放功能 | 工具栏无缩放按钮、锁定适屏比例 | `scalable` | `false` |
| 点击图片即关闭 | 无按钮直接关 | `bodyClose` | `true` |
| 点击遮罩关闭 | 遮罩可关 | `layerOptions.maskClose` | `true` |
| 初始放大倍数 | 非适屏固定倍率 | `scale` | 数值（如 2） |
| ESC 关闭 | 键盘 Esc | `closeOnPressEscape` | `true`（默认） |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| OFigure（预览态） | 都是全屏看大图 | Figure 是页面内的图片容器，预览能力内置由 OImageViewer 提供；独立定制预览 UI 或无容器纯预览用 OImageViewer |
| ODialog | 都是全屏浮层 | Dialog 是内容弹窗（标题/正文/按钮）；ImageViewer 是图片专用查看器（缩放/旋转/切图/工具栏），且图片是唯一主体 |
| OCarousel | 都可多图切换 | Carousel 是页面内嵌轮播（占位布局内）；ImageViewer 是全屏遮罩预览 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.7 | 组件新增：图片查看器，支持缩放与自动适屏、无限循环切图、旋转、移动端手势、无障碍增强 |
