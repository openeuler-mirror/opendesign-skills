> ← [组件索引](../SKILL.md#组件索引) · [代码使用](select.usage.md) · [样式定制](select.style.md)

# OSelect 选择器 — 视觉识别

OSelect 是下拉选择器组件，从预设选项列表中选择一个或多个值。包含 OSelect（选择器）、OOption（选项）和 OOptionGroup（选项分组）。支持单选、多选、标签折叠、清空、加载态、自定义选项宽度模式等功能。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），large 尺寸高度缩至 36px、文字和图标缩小，medium 高度缩至 28px；在平板竖屏及以下（≤840px），large 恢复标准高度；移动端下选项面板从 Popup 变为 Dialog 底部弹出。

🧩 **布局结构**：OSelect 由触发器（选择框）和选项面板两部分组成。选择框为水平布局——左侧输入显示区（单选为 input 只读，多选为标签列表 OScroller）+ 右侧后缀区（加载/清除/箭头图标 + suffix 插槽）。选项面板在桌面端为 OPopup 下拉弹出，移动端为 ODialog 底部弹出，面板内使用 OOptionList + OScroller 包裹选项列表。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: row
regions: [input/tags(显示区), suffix(图标+后缀)]
popup: OPopup(桌面) | ODialog(移动端)
children: [OOption × N, OOptionGroup(可选)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 矩形输入框 + 右侧下拉箭头 + 点击展开选项列表 → 匹配 OSelect
2. 输入框内有多个圆角标签（tag）+ 右侧箭头 → 匹配 OSelect（multiple 多选模式）
3. 标签后有 "+N..." 折叠提示 → 匹配 OSelect（maxTagCount 限制）
4. 无边框纯文字 + 下拉箭头 → 匹配 OSelect（variant="text"）
5. 选项列表中有分组标题 → 使用 OOptionGroup

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 边框 | 有边框线 | variant | `'outline'` | 默认值 |
| 背景 | 实心填充 | variant | `'solid'` | — |
| 边框/背景 | 无边框无背景 | variant | `'text'` | — |
| 高度 | 40px | size | `'large'` | — |
| 高度 | 32px | size | `'medium'` | — |
| 高度 | 28px | size | `'small'` | — |
| 圆角 | 全圆角 | round | `'pill'` | — |
| 选择模式 | 输入框内有标签 | multiple | `true` | — |
| 标签 | 显示 "+N..." | maxTagCount | 对应数值 | — |
| 右侧 | 有清除按钮 | clearable | `true` | — |
| 面板宽度 | 与选择框等宽 | optionWidthMode | `'width'` | — |
| 面板宽度 | 最小宽度等于选择框 | optionWidthMode | `'min-width'` | 默认值 |
| 面板宽度 | 自适应内容 | optionWidthMode | `'auto'` | — |
| 边框颜色 | 绿色系 | color | `'success'` | — |
| 边框颜色 | 橙色系 | color | `'warning'` | — |
| 边框颜色 | 红色系 | color | `'danger'` | 常用于表单校验错误 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OSelect | OInput | OSelect 右侧有下拉箭头、不可手动输入文字；OInput 可自由输入且无下拉面板 |
| OSelect | ORadioGroup | OSelect 选项收纳在下拉面板中节省空间；ORadioGroup 所有选项同时平铺可见 |
| OSelect | OCascader | OCascader 为多级联动面板（分列滚动）；OSelect 为单层扁平列表 |
| OSelect（multiple） | OCheckboxGroup | OSelect 多选以标签形式收纳在输入框内；OCheckboxGroup 勾选框平铺展示 |
| OSelect（text） | ODropdown | OSelect text 变体有选中值回显；ODropdown 是菜单触发器不回显选中值 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | 背景色 CSS 变量从 control5-light/control4-light 改为 fill2；关闭按钮（clear icon）尺寸跟随 `--select-icon-size`；内部改用 defineSlots 替代 useSlots；响应式判定从 isPhonePad 改为 isPhonePadSize |
| v0.0.69 | scrollbar 参数从 `scroller` 改名为 `scrollbar` |
| v0.0.64 | 修复多选 v-model 绑定问题 |
| v0.0.63 | 新增下拉分组（OOptionGroup） |
