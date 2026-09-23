> ← [组件索引](../SKILL.md#组件索引) · [代码使用](scrollbar.usage.md) · [样式定制](scrollbar.style.md)

# OScrollbar 滚动条 — 视觉识别

OScrollbar 是自定义滚动条组件，用于替换浏览器原生滚动条。需要关联一个滚动容器（通过 target 属性），在该容器上显示美化的滚动条。支持水平和垂直方向、两种尺寸、四种显示模式。

📱 **响应式行为**：本组件无响应式差异。触控设备上 hover 模式自动降级（isPhonePad 时不监听 hover 事件）。

🧩 **布局结构**：OScrollbar 是绝对定位的滚动条覆盖层，包含垂直和水平两根轨道（ScrollbarRail），每根轨道内有可拖拽的滑块（thumb）。OScroller 是一体化组件，外层容器包含滚动内容区 + OScrollbar。滚动条不占据布局空间，叠加在滚动容器上方。
```yaml
# 简化结构摘要（完整版见 Part B）
# OScrollbar
position: absolute (覆盖在滚动容器上)
regions: [scrollbar-rail-y(垂直轨道+滑块), scrollbar-rail-x(水平轨道+滑块)]
# OScroller
direction: column
regions: [scroller-container(滚动内容区), OScrollbar(滚动条)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 内容区右侧/底部有半透明圆角细条滑块 → 匹配 OScrollbar/OScroller
2. 滑块细（约 3px）且仅悬停时出现 → 匹配 size="small" + showType="hover"
3. 滑块粗（约 6px）且始终可见 → 匹配 size="medium" + showType="always"
4. 内容区同时有右侧和底部两根滚动条 → 匹配 OScrollbar（双向滚动）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 滑块宽度 | 6px（悬停 10px） | size | `'medium'` | 默认值 |
| 滑块宽度 | 3px（悬停 6px） | size | `'small'` | — |
| 可见性 | 始终可见 | showType | `'always'` | — |
| 可见性 | 滚动时出现，停后隐藏 | showType | `'auto'` | 默认值 |
| 可见性 | 仅悬停容器时出现 | showType | `'hover'` | — |
| 可见性 | 不显示 | showType | `'never'` | — |
| 方向 | 仅垂直滚动条 | disabledX | `true` | — |
| 方向 | 仅水平滚动条 | disabledY | `true` | — |
| 滑块颜色 | `--o-color-control1` 灰色 | — | — | 默认值 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OScrollbar | 浏览器原生滚动条 | OScrollbar 为自定义圆角细条，支持显隐控制；原生为系统默认粗条不可定制 |
| OScrollbar | OSlider | OScrollbar 跟随容器滚动位置联动，OSlider 是独立的值选择控件有刻度 |
| OScroller | 带 overflow:auto 的 div | OScroller 自带美化滚动条组件，普通 div 使用原生滚动条 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.4 | OScroller 新增 `scrollBy` 暴露方法，支持按偏移量滚动 |
| v1.2.0 | OScrollbar 新增 `barClass` prop；OScroller 新增 `scroll` 事件 |
| v1.0.0 | OScrollbar 暴露 `update()` 方法；OScroller 暴露 `scrollTo()` 和 `getContainerEl()` 方法 |
