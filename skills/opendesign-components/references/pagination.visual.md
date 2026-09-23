> ← [组件索引](../SKILL.md#组件索引) · [代码使用](pagination.usage.md) · [样式定制](pagination.style.md)

# OPagination 分页 — 视觉识别

OPagination 是分页组件，用于数据量较大时分页展示。可灵活组合四种控件：总数标签、每页条数选择器、页码按钮、页码跳转输入框。支持简洁模式和更多页码弹出浮层。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），页码按钮尺寸从标准缩至 28px，按钮间距缩小。

🧩 **布局结构**：分页组件水平排列，由最多四个可配置区域从左到右依次组成：总数标签区（显示"共 X 条"）、每页条数选择器（OSelect 下拉选择）、页码按钮区（上一页 + 页码按钮列表 + 下一页）、页码跳转区（"前往"+ 输入框）。简洁模式下仅显示页码区（上/下页 + 当前页/总页数输入框）。页码按钮间距 24px，按钮与选择器间距 12px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [total(总数标签), pagesize(每页条数选择器), pager(页码按钮区), jumper(跳转输入框)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 一排水平页码数字按钮 + 左右翻页箭头 + 当前页高亮 → 匹配 OPagination
2. "共 X 条" 标签 + 每页条数下拉 + 页码按钮 + "前往"输入框的组合 → 匹配 OPagination（完整布局）
3. 仅上下页箭头 + "当前页/总页数" → 匹配 OPagination（simple 模式）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 按钮样式 | 有边框线框 | variant | `'outline'` | 默认 |
| 按钮样式 | 实心填充背景 | variant | `'solid'` | — |
| 按钮圆角 | 全圆角 | round | `'pill'` | — |
| 显示区域 | 有"共 X 条" | layout | 包含 `'total'` | — |
| 显示区域 | 有每页条数下拉 | layout | 包含 `'pagesize'` | — |
| 显示区域 | 有"前往"输入框 | layout | 包含 `'jumper'` | — |
| 整体样式 | 仅上下页+页码数 | simple | `true` | — |
| 当前页高亮 | 蓝色实心背景 | — | — | 当前页自动高亮，DOM class 为 `active`（`.o-pagination-item.active`） |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OPagination | OTab | OTab 是内容面板切换标签，OPagination 是数据分页导航，含页码计算逻辑 |
| OPagination | 手动 OButton 组 | OPagination 内置分页逻辑（页码计算、跳转、每页条数），无需手动实现 |
| OPagination（simple） | 输入框+箭头 | simple 模式是完整分页组件的极简形态，仍含分页逻辑 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | `showTotal` prop 废弃，推荐使用 layout 中配置 'total' |
| v1.1.0 | total 插槽新增 `pageCount` 参数 |
| v0.0.73 | change 事件参数改为对象格式 `{ page, pageSize }` |
| v0.0.72 | 修复首页 change 回调问题 |
