> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](breadcrumb.visual.md) · [代码使用](breadcrumb.usage.md)

# OBreadcrumb 面包屑 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--breadcrumb-color` | `var(--o-color-info3)` | 普通面包屑项文字颜色 |
| `--breadcrumb-color-hover` | `var(--o-color-primary2)` | 鼠标悬停时文字颜色 |
| `--breadcrumb-color-active` | `var(--o-color-primary3)` | 鼠标按下时文字颜色 |
| `--breadcrumb-color-selected` | `var(--o-color-primary1)` | 当前选中项文字颜色 |
| `--breadcrumb-text-size` | `var(--o-font_size-tip1)` | 面包屑文字大小 |
| `--breadcrumb-text-height` | `var(--o-line_height-tip1)` | 面包屑文字行高 |
| `--breadcrumb-gap` | `4px` | 分隔符与文字之间的间距 |
| `--breadcrumb-separator-size` | `var(--o-icon_size_control-m)` | 分隔符图标大小 |
| `--breadcrumb-label-max-width` | `140px` | 面包屑项最大宽度（超出省略） |

**使用示例**：
```vue
<OBreadcrumb style="--breadcrumb-label-max-width: 200px; --breadcrumb-color: var(--o-color-info2)">
  <OBreadcrumbItem href="/">首页</OBreadcrumbItem>
  <OBreadcrumbItem>当前页面</OBreadcrumbItem>
</OBreadcrumb>
```

---

### 响应式行为表

| 维度 | ≤1200px | >1200px |
|------|---------|---------|
| 文字大小 | 缩小（tip2） | 标准 |
| 分隔符图标大小 | 缩小 | 标准 |

---

### 组件布局结构

```yaml
# OBreadcrumb 容器
root: .o-breadcrumb
  direction: row (flex, 水平排列)
  children:
    - slot-default:
        desc: 放置多个 OBreadcrumbItem

# OBreadcrumbItem 面包屑项
item: .o-breadcrumb-item
  direction: row (inline)
  children:
    - .o-breadcrumb-item-label:
        tag: router-link (to) | a (href) | span (无链接)
        content: slot-default (面包屑文字/图标)
        style:
          color: --breadcrumb-color (--o-color-info3)
          hover-color: --breadcrumb-color-hover (--o-color-primary2)
          active-color: --breadcrumb-color-active (--o-color-primary3)
          font-size: --breadcrumb-text-size (--o-font_size-tip1)
          max-width: --breadcrumb-label-max-width (140px)
    - .o-breadcrumb-item-separator:
        content: slot-separator | separator-prop | IconChevronRight
        style:
          size: --breadcrumb-separator-size (--o-icon_size_control-m)
          gap: --breadcrumb-gap (4px)

# 响应式
breakpoints:
  "<=1200px":
    breadcrumb-text-size: --o-font_size-tip2
    breadcrumb-text-height: --o-line_height-tip2
    breadcrumb-separator-size: --o-icon_size_control-xs
```
