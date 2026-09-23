> ← [组件索引](../SKILL.md#组件索引) · [代码使用](tab.usage.md) · [样式定制](tab.style.md)

# OTab 标签页 — 视觉识别

OTab 是标签页组件，用于在不同内容区域之间切换。包含 OTab（标签页容器）和 OTabPane（标签面板）。支持三种风格、溢出省略与更多菜单、可添加/可删除页签、懒加载和过渡动画。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），页签文字和图标缩小，间距减小；在平板竖屏及以下（≤840px），文字进一步缩小、间距紧凑、指示线高度减小。button 模式在各断点下内边距随之调整。v1.2.5-sp1 起溢出页签在移动端改为横向滚动模式（移除了 ODialog 依赖）；v1.2.5-sp3 / 1.2.7 起移除了移动端溢出时的边缘阴影遮罩，页面两侧无渐变阴影。v1.2.3-sp1 修复了移动端溢出菜单的 SSR 水合错误。

🧩 **布局结构**：标签页整体为垂直两栏结构，上方为导航栏（head），下方为内容面板区（body）。导航栏水平排列，包含可选前缀区（prefix 插槽）、页签导航列表（navs，内含多个页签项和可选"更多"按钮）、可选添加按钮、可选后缀区（suffix 插槽）。text 模式下导航列表底部有滑动指示线（anchor）；button 模式下页签项有背景填充和边框。内容面板区一次只显示一个 OTabPane 的内容。

```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions:
  [
    head(prefix + navs(nav-items + more + anchor) + add + suffix),
    body(OTabPane...),
  ]
```

### 设计稿识别指南

**视觉特征指纹**

1. 多个水平文字标签 + 选中项下方有蓝色指示线 + 下方有内容区域 → 匹配 OTab（variant="text"）
2. 多个水平标签 + 选中项有浅色背景填充 → 匹配 OTab（variant="solid"）
3. 圆角按钮排列 + 选中项有边框和不同背景 → 匹配 OTab（variant="button"）
4. 标签栏末尾有"+"按钮 → addable=true
5. 标签上有"x"关闭图标 → OTabPane closable=true
6. 标签末尾有"更多"+"箭头" → maxShow 溢出处理

**设计 Token → Prop 值映射表**

| 设计稿属性     | 值 / 范围         | 对应 Prop         | Prop 值    | 备注           |
| -------------- | ----------------- | ----------------- | ---------- | -------------- |
| 页签风格       | 文字+底部指示线   | variant           | `'text'`   | 默认           |
| 页签风格       | 浅色背景填充      | variant           | `'solid'`  | —              |
| 页签风格       | 圆角按钮+边框     | variant           | `'button'` | —              |
| 字号           | h4                | size              | `'large'`  | —              |
| 字号           | text2             | size              | `'medium'` | 默认           |
| 字号           | text1             | size              | `'small'`  | —              |
| 圆角（button） | 半圆角            | round             | `'pill'`   | 仅 button 模式 |
| 底部分隔线     | 有线              | line              | `true`     | 默认           |
| 底部分隔线     | 无线              | line              | `false`    | —              |
| button 反色    | 深色背景+浅色按钮 | buttonInverse     | `true`     | —              |
| 末尾"+"按钮    | —                 | addable           | `true`     | —              |
| 页签"x"图标    | —                 | OTabPane closable | `true`     | —              |
| "更多"按钮     | 有数量限制        | maxShow           | 数字       | —              |
| 页签间距       | 40px              | size              | `'large'`  | text 模式      |
| 页签间距       | 32px              | size              | `'medium'` | text 模式      |
| 页签间距       | 24px              | size              | `'small'`  | text 模式      |

**易混淆组件区分表**

| 本组件         | 易混淆组件            | 关键区分依据                                                                 |
| -------------- | --------------------- | ---------------------------------------------------------------------------- |
| OTab           | OMenu / 导航菜单      | OMenu 用于页面路由全局导航（侧边栏/顶部），OTab 是同页面内局部内容区域切换 |
| OTab（button） | ORadioGroup（button） | ORadioGroup 是表单控件用于选值提交，OTab 是页面内容区域切换器                |
| OTab           | OBreadcrumb           | OBreadcrumb 是路径导航有层级箭头分隔，OTab 无层级关系，各标签平级            |
