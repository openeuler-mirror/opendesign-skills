> ← [组件索引](../SKILL.md#组件索引) · [代码使用](data-table.usage.md) · [样式定制](data-table.style.md)

# ODataTable 数据表格 — 视觉识别

ODataTable 是数据驱动的表格组件，通过列配置和行数据自动渲染表格内容。支持列固定、行选择、行展开、树形数据、单元格合并、列宽拖拽调整、嵌套表头、溢出气泡等功能。

**筛选与排序是可选的增强功能**，需显式在列配置中声明 `filter` / `sortKey` 属性并处理 `@condition-update` 事件，才能启用。基础表格无需配置筛选排序，直接传入列和数据即可使用。

🧩 **布局结构**：ODataTable 为纵向布局容器，根元素 `.o-data-table` 内部包含可选的表头分割线、左侧阴影指示器、OScroller 滚动容器（含 table 元素：colgroup + thead + tbody）、加载/空状态遮罩层、右侧阴影指示器和溢出气泡。table 内部 thead 固定在顶部（sticky），tbody 内通过 TableRow 递归渲染数据行和展开行。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column
regions:
  - header-divider-h (条件: split-line模式)
  - left-shadow (条件: 无左固定列时)
  - OScroller (滚动容器)
    - table
      - colgroup (TableColGroup)
      - thead (sticky, 含 tr > th 表头单元格)
      - tbody (含 TableRow 递归)
  - loading-wrap / tip-wrap (条件渲染)
  - right-shadow (条件: 无右固定列时)
  - OPopover (溢出气泡)
```

### 设计稿识别指南

**视觉特征指纹**

1. 矩形表格容器（圆角 `--o-radius_control-m`），包含水平方向的多列数据行；表头行有填充背景色（`--o-color-control3-light` 浅蓝灰）或仅有底部分割线（split-line 模式），表体行之间有行分割线
2. 表头单元格可出现筛选漏斗图标（filter）、排序上下箭头图标（sortKey）、描述气泡图标（description）。行首列可出现复选框（selection 模式）或展开箭头（expand/树形模式）
3. 固定列区域在横向滚动时不随内容移动，固定列与滚动区域交界处出现渐变阴影（16px 宽度）。斑马纹模式下奇偶行交替显示淡色背景

**设计 Token → Prop 值映射表**

⚠️ **border prop 识别规则（重要）**：
- ODataTable 的边框由 `border` prop 控制，**不体现在 DSL 容器节点的 `strokes` 属性中**
- DSL 容器 `strokes:[]` 不代表没有边框，需从**设计图视觉截图**判断边框样式
- 识别方式：截取表格区域图，观察是否有外框线（frame）和竖分隔线（column），再选对应值

| 设计稿 Token / 视觉特征 | 对应 Prop / 配置 | 说明 |
|---|---|---|
| 表头填充背景 `--o-color-control3-light` | `headerStyle="fill"` (默认) | 填充式表头 |
| 表头仅底部线分隔 | `headerStyle="split-line"` | 分割线表头 |
| 行底部细线，无外框，无竖线 | `border="row"` (默认) | 仅行线边框 |
| 行底部细线 + 外框，无竖线 | `border="row-frame"` | 行线+外框 |
| 完整网格线（行+竖+外框） | `border="all"` | 全边框 |
| 仅外框 | `border="frame"` | 仅外框 |
| 仅竖分隔线 | `border="column"` | 仅列线 |
| 无任何边框 | `border="none"` | 无边框 |
| 奇偶行交替背景 | `stripe` | 斑马纹 |
| 鼠标悬停行高亮 | `highlightCurrentRow` | 行悬停高亮 |
| 行首复选框 | `selection` | 行选择模式 |
| 行首展开箭头 + 展开区域 | `expandMethod` 或 `#expand` 插槽 | 行展开 |
| 树形缩进 + 展开箭头 | `data` 含 `children` 字段 | 树形数据 |
| 表头筛选漏斗图标 | 列配置 `filter` | 列筛选 |
| 表头排序上下箭头 | 列配置 `sortKey` | 列排序 |
| 表头描述气泡 `(i)` 图标 | 列配置 `description` | 表头描述 |
| 某列背景色同表头 | 列配置 `asHeader: true` | 竖向表头列 |
| 多级分组表头（上下分层） | 列配置 `children` 嵌套 | 嵌套表头 |
| 拖拽调整列宽手柄 | `columnResizable` | 列宽拖拽 |
| 表头单元格文字省略 + 悬停气泡 | 列配置 `showHeaderOverflowToolTip` | 表头溢出提示（默认启用） |
| 表体单元格文字省略 + 悬停气泡 | 列配置 `showOverflowToolTip` | 表体溢出提示 |
| 紧凑行高 | `size="small"` | 小尺寸模式 |
| **操作列文字链接** | formatter 返回 OLink | 主要操作蓝色（primary），危险操作红色（danger） |

**操作列组件选择规则**：

| 设计稿视觉特征 | 推荐组件 | Prop 配置 | 说明 |
|--------------|---------|---------|------|
| 表格行内的文字操作（编辑、详情、查看） | OLink | `color="primary"` | 主要操作用品牌色 |
| 表格行内的危险操作（删除、移除） | OLink | `color="danger"` | 危险操作用红色 |
| 表格行内的单独图标按钮 | OButton | icon-only 模式 | 纯图标操作 |
| 表格外部的工具栏按钮（新增、导出） | OButton | `color="primary" variant="solid"` | 表格上方工具栏 |

**易混淆组件区分表**

| 组件 A | 组件 B | 区分标准 |
|--------|--------|---------|
| ODataTable | OTable | DataTable 通过 `columns` + `data` 数据驱动自动渲染；OTable 需手写 `<tr><td>` 模板 |
| ODataTable | OTable（单列模式） | DataTable 是多列表格（含表头）；单列 OTable 是单列无表头的列表 |
| ODataTable (树形) | ODataTable (普通) | 树形模式下表格行有层级缩进嵌套，适用于父子级数据；普通模式为平铺列表 |
| ODataTable (headerStyle=fill) | ODataTable (headerStyle=split-line) | fill 模式表头有填充背景色；split-line 模式表头与表体同色，仅有底部分割线 |
| ODataTable (selection) | ODataTable (expand) | selection 在行首显示复选框用于多选；expand 在行首显示箭头用于展开详情 |
