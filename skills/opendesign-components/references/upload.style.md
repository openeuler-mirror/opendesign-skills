> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](upload.visual.md) · [代码使用](upload.usage.md)

# OUpload 上传 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--upload-icon-size` | `var(--o-icon_size_control-xs)` | 文件列表图标尺寸（小） |
| `--upload-icon-size-l` | `var(--o-icon_size_control-m)` | 文件列表图标尺寸（中） |
| `--upload-icon-size-xl` | `var(--o-icon_size_control-l)` | 文件列表图标尺寸（大） |
| `--upload-color` | `var(--o-color-info1)` | 文件名文字颜色 |
| `--upload-color-error` | `var(--o-color-danger1)` | 上传失败文字颜色 |
| `--upload-color-disabled` | `var(--o-color-info4)` | 禁用状态文字颜色 |
| `--upload-item-bg-hover` | `var(--o-color-control2-light)` | 列表项 hover 背景色 |
| `--upload-item-radius` | `var(--o-radius_control-s)` | 列表项圆角 |
| `--upload-item-picture-size` | `var(--o-icon_size-2xl)` | picture 模式缩略图尺寸 |
| `--upload-progress-height` | `1px` | 进度条高度 |
| `--upload-progress-bg-color` | `var(--o-color-control3-light)` | 进度条轨道背景色 |
| `--upload-progress-value-bg-color` | `var(--o-color-primary1)` | 进度条填充色 |
| `--upload-drag-padding` | `32px 24px` | 拖拽区域内边距 |
| `--upload-drag-width` | `100%` | 拖拽区域宽度 |
| `--upload-drag-max-width` | `480px` | 拖拽区域最大宽度 |
| `--upload-drag-radius` | `var(--o-radius_control-s)` | 拖拽区域圆角 |
| `--upload-drag-color` | `var(--o-color-info2)` | 拖拽区域文字颜色 |
| `--upload-drag-bg-color` | `var(--o-color-control2-light)` | 拖拽区域背景色 |
| `--upload-drag-bd` | `1px solid var(--o-color-control1)` | 拖拽区域边框 |
| `--upload-card-radius` | `var(--o-radius_control-s)` | 图片卡片圆角 |
| `--upload-card-width` | `120px` | 图片卡片宽度 |
| `--upload-card-height` | `var(--upload-card-width)` | 图片卡片高度（正方形） |
| `--upload-card-gap` | `8px` | 图片卡片间距 |
| `--upload-card-bd` | `1px solid var(--o-color-control1)` | 图片卡片边框 |
| `--upload-card-bg-color` | `var(--o-color-control2-light)` | 图片卡片背景色 |
| `--upload-card-img-fit` | `cover` | 图片填充方式 |
| `--upload-card-mask` | `var(--o-color-mask1)` | 图片卡片操作遮罩色 |

**使用示例**:
```vue
<OUpload style="--upload-card-width: 96px; --upload-drag-max-width: 360px" list-type="picture-card" v-model="fileList" />
```

---

### 响应式行为表

|------|--------|-----------|------------|---------|
| 拖拽区内边距 | 16px 8px | 16px 8px | 16px 8px | 32px 24px |
| 拖拽区最大宽度 | 240px | 400px | 400px | 480px |
| 卡片宽度 | 96px | 96px | 96px | 120px |
| 文件行操作图标 | 始终可见 | 始终可见 | hover 时显示 | hover 时显示 |
| 添加卡片字号 | tip2 | tip2 | tip2 | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  element: div.o-upload
  direction: vertical
  regions:
    # 选择区域（text/picture 模式）
    - name: select-wrap
      element: div.o-upload-select-wrap
      condition: listType 为 text 或 picture
      direction: horizontal
      children:
        - name: select-button
          element: div.o-upload-select
          children:
            - { type: slot, name: default }  # 或默认 OButton "点击上传"
        - name: select-extra
          element: div.o-upload-select-extra
          condition: 有 select-extra 插槽时
          children:
            - { type: slot, name: select-extra }

    # 拖拽区域（draggable 模式）
    - name: drag-area
      element: div.o-upload-drag
      condition: draggable=true
      direction: vertical
      align: center
      padding: 32px 24px
      max-width: 480px
      border: 1px solid var(--o-color-control1)
      border-radius: var(--o-radius_control-s)
      bg: var(--o-color-control2-light)
      children:
        - { type: slot, name: select-drag }  # 或默认: IconAdd + 拖拽提示文字
        - { type: slot, name: select-drag-extra }

    # 文件列表区域
    - name: file-list
      element: div.o-upload-list
      children:
        # text/picture 模式: 垂直行列表
        - name: row-item  # 每个文件
          element: div.o-upload-row-item
          direction: horizontal
          align: center
          children:
            - thumbnail  # picture 模式有缩略图
            - icon  # text 模式有文件图标
            - label  # 文件名
            - action-icons  # 删除/重试/预览/下载按钮
            - progress-bar  # 上传进度条（showProgress 时）

        # picture-card 模式: 网格卡片列表
        - name: card-item  # 每个文件卡片
          element: div.o-upload-card-item
          width: 120px
          height: 120px
          gap: 8px
          border-radius: var(--o-radius_control-s)
          children:
            - thumbnail/file-icon  # 缩略图或文件图标
            - overlay-icons  # 悬浮操作层（预览/删除/重试）
            - progress-bar  # 上传进度条

        - name: add-card  # 添加按钮卡片（picture-card 模式末尾）
          element: div.o-upload-card-add
          condition: listType=picture-card
          children:
            - { type: slot, name: select-add }  # 或默认: IconAdd + btnLabel
```

**≤1440px**
```yaml
# drag: padding 16px 8px, max-width 400px
# card: width 96px, font-size tip2
```

**≤1080px**
```yaml
# row-item: 操作图标始终可见（无需 hover）
# card-item: 遮罩层始终可见
```

**≤840px**
```yaml
# drag: max-width 240px
```
