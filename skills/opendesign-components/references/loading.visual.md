> ← [组件索引](../SKILL.md#组件索引) · [代码使用](loading.usage.md) · [样式定制](loading.style.md)

# OLoading 加载 — 视觉识别

OLoading 是加载状态组件，基于 OLayer 浮层实现。可覆盖在页面或容器上，显示加载图标和文字提示。支持四种尺寸、自定义图标、遮罩层等功能。

📱 **响应式行为**：在平板竖屏到笔记本尺寸（841–1440px），large 和 medium 尺寸的图标、文字、间距均缩小；在平板竖屏及以下（≤840px），进一步缩小至更小尺寸。

🧩 **布局结构**：基于 OLayer 浮层实现，外层 `.o-loading` 继承 Layer 的遮罩+内容区结构。内容区 `.o-loading-main` 内部垂直排列（large/medium）或水平排列（small/mini）两个区域：加载图标 `.o-loading-icon`（旋转动画）和加载文字 `.o-loading-label`（可选）。整体通过 `--loading-content-direction` 控制排列方向。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column(large/medium) | row(small/mini)
regions: [OLayer(遮罩+容器) > [icon(加载图标), label(加载文字,可选)]]
```

### 设计稿识别指南

**视觉特征指纹**

1. 半透明遮罩 + 居中旋转圆形加载图标 + 可选下方文字 → 匹配 OLoading（large/medium）
2. 小型旋转加载图标 + 右侧文字（水平排列）→ 匹配 OLoading（small/mini）
3. 覆盖特定区域的遮罩 + 加载动画（非全屏）→ 匹配 OLoading（wrapper 指定容器）
4. 全屏遮罩 + 大号加载图标居中 → 匹配 OLoading（wrapper="body", size="large"）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 图标尺寸 | 96px 超大 | size | `'large'` | — |
| 图标尺寸 | 4xl 大 | size | `'medium'` | — |
| 图标尺寸 | xs 小 | size | `'small'` | 默认 |
| 图标尺寸 | control-xs 超小 | size | `'mini'` | — |
| 排列方向 | 图标上文字下 | size | `'large'` 或 `'medium'` | direction: column |
| 排列方向 | 图标左文字右 | size | `'small'` 或 `'mini'` | direction: row |
| 遮罩 | 有半透明遮罩 | mask | `true` | 默认 |
| 遮罩 | 无遮罩 | mask | `false` | — |
| 文字 | 有加载提示文字 | label | 对应文字内容 | — |
| 定位 | 覆盖全屏 | wrapper | `'body'` | 默认 |
| 定位 | 覆盖指定区域 | wrapper | `'#id'` | — |
| 图标 | 非默认加载图标 | icon | 自定义组件 | — |
| 图标旋转 | 自定义图标有旋转 | iconRotating | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OLoading | OLayer | OLoading 有固定的加载图标+文字结构，OLayer 是纯空容器 |
| OLoading | ODialog | ODialog 有标题栏/内容区/操作栏，OLoading 仅有居中的图标+文字 |
| OLoading | OButton loading | OButton loading 是按钮内的小图标状态，OLoading 是覆盖区域的遮罩加载 |
| OLoading | OSkeleton | OSkeleton 是占位骨架屏（灰色块状），OLoading 是旋转图标+遮罩层 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 新增 `size` prop 支持 large/medium/small/mini 四种尺寸；响应式优化；新增 CSS 变量（`--loading-label-*`）；vLoading 指令支持属性对象 |
