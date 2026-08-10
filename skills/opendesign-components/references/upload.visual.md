> ← [组件索引](../SKILL.md#组件索引) · [代码使用](upload.usage.md) · [样式定制](upload.style.md)

# OUpload 上传 — 视觉识别

OUpload 是文件上传组件，支持点击选择和拖拽上传。包含三种文件列表展示模式（文字、图片列表、图片卡片）。支持自定义上传请求、上传前/选择前拦截、手动/自动上传、缩略图生成、上传进度展示等。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），拖拽区域内边距缩至 16px 8px，卡片宽度缩至 96px，拖拽区最大宽度缩至 400px；在平板及以下（≤1080px），文件列表项图标操作始终可见；在平板竖屏及以下（≤840px），拖拽区最大宽度缩至 240px。

🧩 **布局结构**：上传组件由选择区域和文件列表区域垂直排列组成。选择区域分为按钮模式（text/picture 列表类型）和拖拽模式两种。文件列表区域根据 listType 分为三种布局：text 模式为行列表（图标+文件名+操作按钮）、picture 模式为带缩略图的行列表、picture-card 模式为网格卡片布局（卡片内含缩略图和操作遮罩层）。picture-card 模式下末尾有一个"点击上传"的添加卡片。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [select-wrap(选择区域+拖拽区域), file-list(文件列表)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 带"+ 点击上传"蓝色胶囊按钮 + 下方文件名列表 → 匹配 OUpload（text 模式）
2. 虚线边框矩形区域 + "点击或拖拽文件到此处"提示文字 + 加号图标 → 匹配 OUpload（draggable 模式）
3. 方形缩略图卡片网格 + 末尾有加号添加卡片 → 匹配 OUpload（picture-card 模式）
4. 文件名列表 + 带小缩略图 + 操作图标（删除/重试/预览） → 匹配 OUpload（picture 模式）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 布局 | 网格卡片 + 缩略图 | listType | `'picture-card'` | — |
| 布局 | 行列表 + 小缩略图 | listType | `'picture'` | — |
| 布局 | 纯文件名行列表 | listType | `'text'` | 默认 |
| 选择方式 | 虚线边框拖拽区域 | draggable | `true` | — |
| 选择方式 | 按钮点击 | draggable | `false` | 默认 |
| 卡片尺寸 | 120×120px | — | — | picture-card 默认 |
| 拖拽区域 | 最大宽度 480px | — | — | 默认 |
| 进度条 | 文件上传中有进度条 | showProgress | `true` | — |
| 按钮文字 | 自定义文字 | btnLabel | 字符串值 | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OUpload | OButton | 上传按钮只是 OUpload 的子元素，完整组件还包含文件列表和拖拽区域 |
| OUpload（picture-card） | OFigure | OUpload 的卡片包含上传管理功能（删除/重试/进度），OFigure 是纯图片展示 |
| OUpload（draggable） | 自定义拖拽区域 | OUpload 拖拽区域有完整的文件选择、上传、列表管理功能 |
| OUpload（text） | 普通文件列表 | OUpload 文件列表项有上传状态、进度条和操作按钮（删除/重试） -->

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.1 | 新增 `downloadFile` 函数 |
| v1.2.0 | 新增 `showProgress` prop |
| v1.1.0 | 新增 item 系列事件（itemRemove/itemRetry/itemReplace/itemPreview/itemClick）；新增暴露方法（replaceById/replaceByIndex/removeById/removeByIndex/removeAll/previewItemById/previewItemByIndex） |
