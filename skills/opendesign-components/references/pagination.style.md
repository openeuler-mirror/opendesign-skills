> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](pagination.visual.md) · [代码使用](pagination.usage.md)

# OPagination 分页 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--pagination-item-size` | `var(--o-control_size-m)` | 页码按钮尺寸（高度和宽度） |
| `--pagination-arrow-size` | `var(--o-control_size-s)` | 上/下一页箭头按钮尺寸 |
| `--pagination-item-gap` | `24px` | 各区块（总数、pagesize、pager、jumper）之间的间距 |
| `--pagination-item-sm-gap` | `8px` | pagesize 与 jumper 内部控件的间距 |
| `--pagination-item-size-gap` | `12px` | 页码数字按钮之间的间距 |
| `--pagination-radius` | `var(--o-radius_control-s)` | 页码按钮圆角（pill 时为 `var(--pagination-item-size)`） |

**使用示例**：
```vue
<!-- 紧凑分页：减小区块间距 -->
<OPagination style="--pagination-item-gap: 12px" v-model:page="page" :total="100" />
```

---

### 响应式行为表

| 维度 | ≤1440px | >1440px |
|------|---------|---------|
| 页码按钮尺寸 | 28px | 标准 |
| 按钮间距 | 16px | 标准 |
| 按钮与选择器间距 | 8px | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  direction: horizontal
  align: center
  regions:
    - name: total
      condition: layout 包含 'total'
      children:
        - { type: slot, name: total }  # 默认 "共 {total} 条"
    - name: pagesize
      condition: layout 包含 'pagesize'
      children:
        - { type: component, name: OSelect }  # 每页条数选择器
      gap: 12px  # --pagination-item-size-gap
    - name: pager
      direction: horizontal
      align: center
      gap: 24px  # --pagination-item-gap
      children:
        - name: prev
          children:
            - { type: icon, name: IconChevronLeft }
          disabled: page === 1
        - name: pages
          direction: horizontal
          children:
            - type: page-buttons  # 页码按钮列表，含省略号弹出
        - name: next
          children:
            - { type: icon, name: IconChevronRight }
          disabled: page === totalPage
    - name: jumper
      condition: layout 包含 'jumper'
      children:
        - { type: text, content: "前往" }
        - { type: component, name: OInputNumber }
  variants:
    outline: { border: var(--o-color-control1) }
    solid: { background: transparent → hover 变色 }
    simple:
      pager 仅含: prev + "当前页/总页数" 输入框 + next
      layout/showPageCount 失效
    pill: { border-radius: "var(--pagination-item-size)" }
  item-size: var(--o-control_size-m)
  arrow-size: var(--o-control_size-s)
```

**≤1440px (laptop)**
```yaml
# item-size: 28px
# item-gap: 16px
# item-size-gap: 8px
```
