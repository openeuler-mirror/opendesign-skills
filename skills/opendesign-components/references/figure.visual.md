> ← [组件索引](../SKILL.md#组件索引) · [代码使用](figure.usage.md) · [样式定制](figure.style.md)

# OFigure 图片 — 视觉识别

OFigure 是图片展示组件，支持宽高比控制、加载状态、悬停放大、点击预览、视频海报等丰富功能。可以作为图片容器使用，也可以渲染为链接。

📱 **响应式行为**：
- 播放图标随屏幕缩小：笔记本 56px → 平板 48px → 手机 40px
- 标题文字缩小：平板 text1 → 手机 tip1
- 底部描述区域内边距缩小
- 预览图片在平板及以下最大宽度为 100vw
- 预览遮罩在平板及以下变为纯黑色
- 预览关闭按钮在平板及以下移到左侧

🧩 **布局结构**：外层 `.o-figure` 为 inline-flex 容器，支持圆角裁剪和溢出隐藏。有 ratio 时内部通过 `.o-figure-wrap` 的 padding-top 百分比撑开固定宽高比空间，img 绝对定位填充；无 ratio 时 img 直接流式布局。覆盖层 `.o-figure-main` 绝对定位覆盖全区域，内含默认插槽、视频海报遮罩和底部描述内容区。预览通过 OLayer 弹层实现。
```yaml
# 简化结构摘要（完整版见 Part B）
display: inline-flex
regions: [wrap(ratio占位+img/error), main(default+mask+content), preview-layer]
```

### 设计稿识别指南

**视觉特征指纹**

1. 单张图片展示容器，无标题/正文等语义分区，图片本身是主体内容
2. 可带固定宽高比（通过 padding-top 百分比实现），图片裁剪填充（object-fit: cover）
3. 视频海报模式：图片上叠加半透明黑色遮罩 + 居中圆形播放按钮（白色描边+模糊背景）
4. 底部描述区：沿底部的渐变黑色遮罩条上显示白色文字（标题 h3 + 正文 tip1）
5. 悬停态图片放大 scale(1.05)，按下态缩回 scale(1.02) 并叠加浅黑遮罩
6. 预览态：全屏遮罩层内居中展示原始大图，可带关闭按钮

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop | Prop 值 |
|---------|---------------|------|--------|
| 图片有固定比例 | padding-top 百分比 | `ratio` | 宽/高数值（如 16/9=1.78） |
| 图片裁剪方式 cover | object-fit: cover | `fit` | `"cover"` |
| 图片完整显示 | object-fit: contain | `fit` | `"contain"` |
| CSS 背景图渲染 | background-image | `background` | `true` |
| 悬停放大效果 | transform: scale(1.05) | `hoverable` | `true` |
| 点击全屏预览 | OLayer 遮罩弹层 | `preview` | `true` |
| 居中播放按钮 | 圆形按钮 64px | `videoPoster` | `true` |
| 底部渐变文字条 | linear-gradient 遮罩 | — | content/title 插槽 |
| 加载前彩色背景 | 随机色 background-color | `colorful` | `true` |
| 整图可点击跳转 | `<a>` 标签 | `href` | 链接 URL |
| 播放按钮 56px | laptop 断点 | — | 自动响应式 |
| 播放按钮 48px | pad 断点 | — | 自动响应式 |
| 播放按钮 40px | phone 断点 | — | 自动响应式 |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| OCard (cover) | 都可展示图片 | Figure 是纯图片容器，无标题/正文/底部等语义分区和插槽；Card 有封面+标题+正文+底部的完整卡片结构 |
| img 标签 | 都渲染图片 | Figure 提供宽高比控制、懒加载、彩色占位、悬停放大、全屏预览、视频海报等增强功能 |
| OCarousel | 都展示图片内容 | Figure 是单张图片容器；Carousel 是多张图片的轮播切换组件 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 修复暗色模式下文字溢出问题；修复移动端 previewClose body 值；修复百度浏览器预览问题 |
| v1.0.2 | 修复 `lazyPreiew` 拼写为 `lazyPreview`；修复 background 模式 DOM 位置 |
| v0.0.70 | 新增 `previewClose` prop 和 `lazy` 懒加载功能 |
