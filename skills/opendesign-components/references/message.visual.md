> ← [组件索引](../SKILL.md#组件索引) · [代码使用](message.usage.md) · [样式定制](message.style.md)

# OMessage 消息提示 — 视觉识别

OMessage 是消息提示组件，用于操作反馈信息的展示。支持两种使用方式：
- **组件式调用 (`<OMessage>`)**：仅适用于行内/固定位置的静态提示（如页面顶部公告）
- **命令式调用 (`useMessage()`)**：推荐用于操作后的动态反馈消息（如表单提交反馈）

组件支持五种状态、彩色背景模式、自动关闭、手动关闭等功能。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），消息内边距、文字大小、图标尺寸缩小；在平板横屏及以下（≤1200px），消息间距进一步缩小；在平板竖屏及以下（≤840px），带标题的消息标题文字缩小、图标缩至最小、彩色模式侧边条变窄。

🧩 **布局结构**：消息条水平排列，从左到右依次为：彩色侧边条（仅 colorful 模式，宽 4px）、状态图标区、主内容区（标题 + 正文纵向排列）、关闭按钮区（仅 closable 时显示）。消息整体有圆角和阴影（colorful 模式无阴影），内边距 8px 16px，图标与内容间距 8px，关闭按钮间距 16px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [sidebar(彩色侧边条,仅colorful), icon(状态图标), main(标题+正文), close(关闭按钮,仅closable)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 页面顶部/指定区域浮现的水平条形通知 + 左侧状态图标 + 可选关闭按钮 → 匹配 OMessage
2. 带圆角、阴影的横条 + 五种状态图标之一（信息/成功/警告/错误/加载） → 匹配 OMessage
3. 左侧彩色竖边条 + 彩色背景 + 状态图标 → 匹配 OMessage（colorful 模式）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 状态图标 | 蓝色圆形 i 图标 | status | `'info'` | 默认值 |
| 状态图标 | 绿色勾号 | status | `'success'` | — |
| 状态图标 | 橙色感叹号 | status | `'warning'` | — |
| 状态图标 | 红色叉号/感叹号 | status | `'danger'` | — |
| 状态图标 | 旋转加载圈 | status | `'loading'` | 图标带旋转动画 |
| 背景色 | 彩色（蓝/绿/橙/红）+ 左侧彩色边条 | colorful | `true` | — |
| 背景色 | 白色/浅色 + 阴影 | colorful | `false` | 默认 |
| 右侧 | X 关闭按钮 | closable | `true` | — |
| 标题行 | 有标题文字 | title | 标题文字 | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OMessage | OToast | OMessage 通常位于顶部、带状态颜色语义（success/warning/danger）、可关闭；OToast 是深色背景轻提示、默认底部、无颜色语义 |
| OMessage | ODialog | OMessage 是非模态轻量提示不阻断操作；ODialog 是模态对话框需用户处理后才能继续 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 新增 `--message-list-top-offset` 和 `--message-list-bottom-offset` CSS 变量；`showMessage` 返回关闭函数；OMessageList 新增 `close` 方法 |
| v0.0.70 | 支持指定目标元素附近显示消息 |
