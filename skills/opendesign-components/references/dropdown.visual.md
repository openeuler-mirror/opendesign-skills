> ← [组件索引](../SKILL.md#组件索引) · [代码使用](dropdown.usage.md) · [样式定制](dropdown.style.md)

# ODropdown 下拉菜单 — 视觉识别

ODropdown 是下拉菜单组件，点击或悬停触发元素后弹出一组操作选项列表。通常与按钮配合使用，构成"下拉按钮"。包含 ODropdown（容器）和 ODropdownItem（选项项）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），大尺寸触发按钮的内边距缩小；大尺寸选项文字和内边距缩小。在平板竖屏及以下（≤840px），小尺寸触发按钮内边距进一步缩小。

🧩 **布局结构**：ODropdown 由触发区域和弹出面板两部分组成。触发区域（.o-dropdown）为普通 div，内部放置触发元素（通常是按钮）。弹出面板通过 OPopup 定位，内含无序列表（.o-dropdown-list），列表项（.o-dropdown-item）纵向排列，项间间距 2px。面板有白色背景、阴影和圆角，内边距 4px。选项项为 flex 布局，内边距 7px 12px（large）或 4px 12px（small/medium）。
```yaml
# 简化结构摘要（完整版见 Part B）
trigger: .o-dropdown > slot:default(触发元素)
popup: OPopup > ul.o-dropdown-list > ODropdownItem × N
item-direction: vertical
```

### 设计稿识别指南

**视觉特征指纹**

1. 按钮（通常带 chevron-down 箭头图标）+ 下方弹出白色阴影浮层 + 浮层内纵向排列可点击文字项 → 匹配 ODropdown
2. 浮层内每一项 hover 时有浅色背景高亮 → 确认为 ODropdown 选项交互
3. 某个选项文字颜色变灰且不可点击 → 匹配 ODropdownItem（disabled）
4. 浮层紧贴触发按钮且有 4px 间距 → ODropdown 的 OPopup offset

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选项文字大小 | text1（14px） | size | `'large'` | 默认 |
| 选项文字大小 | tip1（12px） | size | `'small'` / `'medium'` | — |
| 面板位置 | 按钮正下方左对齐 | optionPosition | `'bl'` | 默认 |
| 面板位置 | 按钮正下方右对齐 | optionPosition | `'br'` | — |
| 面板位置 | 按钮正上方 | optionPosition | `'tl'` / `'tr'` | — |
| 面板宽度 | 与按钮等宽 | optionWidthMode | `'width'` | — |
| 面板宽度 | 不小于按钮宽度 | optionWidthMode | `'min-width'` | 默认 |
| 面板宽度 | 随内容自适应 | optionWidthMode | `'auto'` | — |
| 触发方式 | 点击触发 | trigger | `'click'` | 默认 |
| 触发方式 | 悬停触发 | trigger | `'hover'` | — |
| 选项灰色不可点击 | 文字 `--o-color-info4` | item.disabled | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ODropdown | OSelect | OSelect 有输入框外观且选中值会回显到输入框中，ODropdown 仅弹出操作列表无回显 |
| ODropdown | OPopover | OPopover 展示富文本提示信息（文字、图片等），ODropdown 展示可逐项点击的操作列表 |
| ODropdown | OMenu | OMenu 是导航菜单有层级嵌套和选中高亮，ODropdown 是扁平的操作列表 |
| ODropdown | OPopup | OPopup 是底层弹出定位容器，ODropdown 是基于 OPopup 的上层组件自带列表样式和选项交互 |
