> ← [组件索引](../SKILL.md#组件索引) · [代码使用](dialog.usage.md) · [样式定制](dialog.style.md)

# ODialog 对话框 — 视觉识别

ODialog 是模态对话框组件，在页面上方弹出一个浮层，用于提示、确认、表单填写等需要用户关注的交互场景。基于 OLayer 浮层组件构建，支持多种预设尺寸和丰富的响应式适配。

📱 **响应式行为**：
- **手机尺寸**（≤600px）：对话框从底部滑入、宽度铺满、关闭按钮隐藏、按钮宽度均分；phoneHalfFull 模式下顶部保留圆角
- **平板竖屏及以下**（≤840px）：圆角由主题和断点共同决定（默认 control-xs，此断点下使用 control-s）
- **平板尺寸**（≤1200px）：对话框固定定位、按钮间用竖线分隔、间距和字号缩小
- **大尺寸（exlarge/large）**在平板竖屏及以下全屏铺满、无圆角
- 触控设备上动画改为从中心/底部展开（而非跟随鼠标位置）

🧩 **布局结构**：对话框主面板（.o-dlg-main）纵向 flex 布局，从上到下依次为：header 标题区（居中文字，flex-shrink: 0）、body 内容区（flex: 1，内含滚动条）、footer 底部操作区（flex-shrink: 0）。关闭按钮绝对定位于右上角。整体内边距 32px（笔记本 24px、平板 16px），区域间距 24px（笔记本 16px、平板 12px）。宽度由 size 决定（auto 自适应 / small 25% / medium 40% / large 60% / exlarge 65%）。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
container: OLayer(遮罩浮层) > .o-dlg-main(flex-column)
regions: [header(标题区), body(内容区+滚动条), footer(底部操作区)]
overlay: close-btn(右上角绝对定位关闭按钮)
```

### 设计稿识别指南

**视觉特征指纹**

1. 页面上方覆盖半透明遮罩层 + 居中白色圆角面板 + 面板内三段式结构（标题/内容/按钮） → 匹配 ODialog
2. 面板右上角有 × 关闭图标 → 确认为 ODialog（非 hideClose）
3. 手机端底部滑入的白色面板 + 上方遮罩 → 匹配 ODialog（手机响应式或 phoneHalfFull）
4. 无遮罩的悬浮面板 → 不是 ODialog，考虑 OPopover 或 OPopup

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 面板宽度 | ≥65% 页面宽 | size | `'exlarge'` | — |
| 面板宽度 | ~60% 页面宽 | size | `'large'` | — |
| 面板宽度 | ~40% 页面宽 | size | `'medium'` | — |
| 面板宽度 | ~25% 页面宽 | size | `'small'` | — |
| 面板宽度 | 随内容变化 | size | `'auto'` | 默认 |
| 无关闭按钮 | 右上角无 × | hideClose | `true` | — |
| 无遮罩层 | 无半透明背景 | mask | `false` | — |
| 底部按钮 | 确认/取消按钮组 | actions | `DialogActionT[]` | — |
| 按钮蓝色实心 | `--o-color-primary1` | action.color | `'primary'` | action.variant=`'solid'` |
| 手机底部半屏 | 底部弹出宽度铺满 | phoneHalfFull | `true` | 配合 size 使用 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ODialog | OPopover | ODialog 有全屏遮罩且居中显示，OPopover 无遮罩且跟随触发元素定位 |
| ODialog | OLayer | ODialog 是 OLayer 的上层封装，自带 header/body/footer 三段式结构；OLayer 是纯浮层容器无内部结构 |
| ODialog | OMessage/OToast | OMessage/OToast 是轻量提示自动消失，ODialog 是模态交互需用户主动关闭 |
| ODialog（手机端） | 底部抽屉 | ODialog 手机端从底部滑入但仍是居中模态逻辑，有遮罩和关闭机制 |
