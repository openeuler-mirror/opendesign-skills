> ← [组件索引](../SKILL.md#组件索引) · [代码使用](avatar.usage.md) · [样式定制](avatar.style.md)

# OAvatar 头像 — 视觉识别

OAvatar 是头像/头像组展示组件，用于显示用户头像图片、名称首字符或默认图标。支持图片/文字/默认图标三种内容模式、可点击交互遮罩、名称自定义渲染，以及 OAvatarGroup 头像组（水平堆叠与对称网格两种布局、溢出省略或计数显示）。

📱 **响应式行为**：Avatar 本身无内置响应式断点逻辑。size 属性可传入 CSS 变量实现响应式尺寸（如 `var(--o-icon_size-4xl)` 受全局 token 响应式规则影响）。OAvatarGroup 的 symmetric 布局在小尺寸下 grid gap 为 3.5px，视觉间距随 avatar-size 缩放。

🧩 **布局结构**：OAvatar 根元素为 `div.o-avatar.o-avatar-circle`（始终圆形），内部按内容类型渲染 `<img>` / `<span>` 文字 / `<IconAvatar>` 默认图标，clickable 时叠加 `.o-avatar-trigger-icon` 遮罩层。OAvatarGroup 根元素为 `div.o-avatar-group`，根据 layout 切换 `.o-avatar-group-horizontal`（flex row-reverse + 负 margin）或 `.o-avatar-group-symmetric`（grid 2x2 / 1x1 / 三角形布局）。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: OAvatar 单个圆形容器; OAvatarGroup horizontal 为水平堆叠，symmetric 为网格
regions(OAvatar): [img/文字/默认图标(主内容), trigger-icon(可点击遮罩,可选)]
regions(OAvatarGroup): [more(溢出提示,可选), avatar*1~4(真实头像)]
note: horizontal 布局溢出提示在头部（DOM 反转排列），symmetric 溢出提示在尾部
```

### 设计稿识别指南

**视觉特征指纹**

1. 单个圆形容器 + 内含图片 → 匹配 OAvatar（url 模式）
2. 单个圆形容器 + 内含单字符文字 + 彩色背景 → 匹配 OAvatar（name 模式）
3. 单个圆形容器 + 内含人头轮廓图标 + 灰色背景 → 匹配 OAvatar（默认模式）
4. hover 时圆形上叠加半透明遮罩 + 编辑/铅笔图标 → 匹配 OAvatar（clickable=true）
5. 多个圆形部分重叠排列（人头像叠在一起） → 匹配 OAvatarGroup（layout=horizontal）
6. 2x2 网格排列的圆形头像 → 匹配 OAvatarGroup（layout=symmetric）
7. 等腰三角形排列（1上2下）的圆形头像 → 匹配 OAvatarGroup（layout=symmetric, 3 项）
8. 溢出位置显示省略号图标 → 匹配 OAvatarGroup（overflowType=ellipsis）
9. 溢出位置显示 +N 数字 → 匹配 OAvatarGroup（overflowType=count）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 圆形尺寸 | 48px / 56px 等 | size | `48` / `56` 等 | 数字自动加 px |
| 圆形尺寸 | CSS 变量 | size | `'var(--o-icon_size-4xl)'` 等 | 默认值 |
| 图片裁剪 | 保持比例裁剪填满 | objectFit | `'cover'` | 最常用 |
| 图片裁剪 | 保持比例完整显示 | objectFit | `'contain'` | — |
| 图片裁剪 | 拉伸填满 | objectFit | `'fill'` | 默认 |
| 文字背景色 | 随机彩色 | background | — | 不指定时随机 |
| 文字背景色 | 指定颜色 | background | `'#e6f7ff'` 等 | — |
| hover 遮罩 | 半透明 + 编辑图标 | clickable | `true` | — |
| 多人重叠排列 | 水平堆叠 | layout | `'horizontal'` | 默认 |
| 多人网格排列 | 2x2/三角/横排 | layout | `'symmetric'` | — |
| 溢出省略号 | ...图标 | overflowType | `'ellipsis'` | 默认 |
| 溢出+N | +2 / 99+ 等 | overflowType | `'count'` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OAvatar | OIcon | Avatar 是圆形容器（固定宽高相等），Icon 是纯图标无固定容器 |
| OAvatar | OBadge | Badge 是附加在元素角标的小标记数字，Avatar 是独立的用户标识圆形展示 |
| OAvatarGroup | 多个 OAvatar | AvatarGroup 有溢出逻辑和堆叠/网格布局，多个独立 Avatar 无溢出处理 |
| OAvatar(文字) | OTag | Tag 是带边框的标签卡片，Avatar 是圆形纯色背景无边框 |
