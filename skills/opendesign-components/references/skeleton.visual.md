> ← [组件索引](../SKILL.md#组件索引) · [代码使用](skeleton.usage.md) · [样式定制](skeleton.style.md)

# OSkeleton 骨架屏 — 视觉识别

OSkeleton 是骨架屏组件，在内容加载完成前展示占位图形，提升用户等待体验。包含 OSkeleton（容器）、OSkeletonText（文本占位）、OSkeletonAvatar（头像占位）、OSkeletonFigure（图片占位）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），头像尺寸（large/medium/small）缩小；在平板横屏及以下（≤1200px），medium 头像进一步缩小。

🧩 **布局结构**：骨架屏为垂直堆叠容器，loading=true 时显示 template 插槽区域（内部自由组合 OSkeletonText、OSkeletonAvatar、OSkeletonFigure），loading=false 时显示 default 插槽的真实内容。OSkeletonText 为多行水平条形占位，最后一行宽度 50%；OSkeletonAvatar 为圆形/方形占位块；OSkeletonFigure 为矩形图片占位块。动画模式下显示水平渐变闪烁效果。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [template(骨架占位: figure+avatar+text), default(真实内容)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 多行灰色水平条形（最后一行较短约 50%）→ 匹配 OSkeletonText
2. 圆形或方形灰色色块 + 附近有灰色文本行 → 匹配 OSkeleton（头像+文本组合）
3. 大面积矩形灰色色块（约 320x180）→ 匹配 OSkeletonFigure
4. 上述元素组合排列 + 可能有渐变闪烁动画 → 匹配 OSkeleton 整体

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 背景色 | 静态灰色 `--o-color-control4-light` | animation | `false` | 默认 |
| 背景色 | 渐变闪烁动画 | animation | `true` | — |
| 圆形色块 80px | — | OSkeletonAvatar size | `'large'` | — |
| 圆形色块 64px | — | OSkeletonAvatar size | `'medium'` | 默认 |
| 圆形色块 40px | — | OSkeletonAvatar size | `'small'` | — |
| 圆形色块 24px | — | OSkeletonAvatar size | `'mini'` | — |
| 色块全圆角 | 圆形 | OSkeletonAvatar round | `'pill'` | 默认 |
| 色块方角 | 小圆角 | OSkeletonAvatar round | CSS 值如 `'8px'` | — |
| 文本行数 | 可数条数 | rows | 数字 | 默认 3 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OSkeleton | OLoading | OLoading 是旋转/转圈动画指示器，OSkeleton 是模拟内容形状的灰色占位块 |
| OSkeleton | 空状态（Empty） | 空状态有明确的图标+文字提示"暂无数据"，骨架屏是灰色条/块模拟内容轮廓 |
| OSkeletonAvatar | OAvatar | OAvatar 显示真实图片/文字，OSkeletonAvatar 是纯灰色圆形/方形占位 |
