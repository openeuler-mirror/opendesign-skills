> ← [组件索引](../SKILL.md#组件索引) · [代码使用](layer.usage.md) · [样式定制](layer.style.md)

# OLayer 浮层 — 视觉识别

OLayer 是基础浮层组件，为 ODialog 等上层组件提供底层能力。通过 Teleport 将内容渲染到指定容器（默认 body），支持遮罩层、关闭按钮、动画控制等功能。一般不直接使用，而是通过 ODialog 等封装组件使用。

🧩 **布局结构**：外层 `.o-layer` 通过 Teleport 挂载到目标容器，采用 fixed/absolute 定位铺满全屏。内部分为遮罩层 `.o-layer-mask`（铺满全屏、半透明背景）、内容主体 `.o-layer-main`（居中显示，使用 flex 布局 align+justify=center）和可选关闭按钮 `.o-layer-close`。遮罩层和内容主体各有独立的过渡动画。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: stacked(层叠定位)
regions: [mask(遮罩层), main(内容主体), close-button(关闭按钮,可选)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 半透明深色遮罩覆盖整个视口/容器 + 居中浮动内容区域（无预设结构）→ 匹配 OLayer
2. 纯白/无结构的浮动面板 + 可选右上角关闭图标 → 匹配 OLayer
3. 内容从鼠标点击位置缩放展开的动画效果 → transitionOrigin="mouse"

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 遮罩 | 有半透明背景遮罩 | mask | `true` | 默认 |
| 遮罩 | 无遮罩层 | mask | `false` | — |
| 关闭按钮 | 有 × 图标 | buttonClose | `true` | — |
| 定位 | 全屏固定定位 | wrapper | `'body'` | 默认 |
| 定位 | 局部绝对定位 | wrapper | `null` | 父容器需 position:relative |
| 动画 | 缩放+渐变 | mainTransition | `'o-zoom-fade2'` | 默认 |
| 动画原点 | 从点击位置展开 | transitionOrigin | `'mouse'` | 默认，桌面端 |
| 动画原点 | 从中心展开 | transitionOrigin | `'css'` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OLayer | ODialog | ODialog 有预设的标题栏+内容区+操作栏结构，OLayer 是纯容器无预设布局 |
| OLayer | OLoading | OLoading 继承 OLayer 但固定显示加载图标+文字，OLayer 内容完全自定义 |
| OLayer | OPopup/OPopover | Popup/Popover 定位在触发元素附近（跟随定位），OLayer 居中覆盖整个视口 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.7 | `transitionOrign` 拼写修正为 `transitionOrigin`（旧名废弃兼容）；关闭按钮响应式样式适配 |
| v1.1.0 | 新增 `toggle` 方法注入 |
| v0.0.73 | 导出 form provide key；`buttonClose` prop 默认值从 `true` 改为 `false` |
| v0.0.72 | 新增 `buttonClose` prop |
