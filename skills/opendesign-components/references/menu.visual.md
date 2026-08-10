> ← [组件索引](../SKILL.md#组件索引) · [代码使用](menu.usage.md) · [样式定制](menu.style.md)

# OMenu 菜单 — 视觉识别

OMenu 是导航菜单组件，用于侧边栏或页面内的层级导航。包含 OMenu（菜单容器）、OSubMenu（可展开的子菜单）和 OMenuItem（菜单项）。支持手风琴模式、多级嵌套、图标、选中状态高亮等功能。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），medium 尺寸的一级菜单项上下间距和文字缩小、图标缩小；在平板竖屏及以下（≤840px），small 尺寸的文字进一步缩小，一级项保持较大字号。

🧩 **布局结构**：外层 `<ul>.o-menu` 为垂直列表容器，内含 OSubMenu（可展开子菜单）和 OMenuItem（叶子菜单项）。OSubMenu 内部分为标题行 `.o-sub-menu-title`（水平排列：可选箭头(left)+可选图标+标题文字+可选箭头(right)）和子菜单列表 `.o-sub-menu-children`（展开/折叠动画）。OMenuItem 水平排列：可选图标+文字内容。缩进通过 CSS 变量 `--menu-level` 控制层级深度。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [ul.o-menu > [OSubMenu(标题行+子列表) | OMenuItem(图标+文字)] × N]
```

### 设计稿识别指南

**视觉特征指纹**

1. 垂直列表 + 层级缩进 + 子菜单标题行有展开/折叠箭头 + 选中项有蓝色高亮 → 匹配 OMenu
2. 侧边栏固定宽度（约 240px）的导航列表 + 可展开折叠的分组 → 匹配 OMenu
3. 菜单项前有图标 + 文字超出时截断省略 → 匹配 OMenu（带 icon 的 OMenuItem/OSubMenu）
4. 同级只展开一个子菜单组 → 匹配 OMenu（accordion=true）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 一级项文字 | text1 大字号 | size (OMenu) | `'medium'` | 默认 |
| 一级项文字 | tip1 小字号 | size (OMenu) | `'small'` | — |
| 一级项间距 | 11px | size (OMenu) | `'medium'` | — |
| 一级项间距 | 4px | size (OMenu) | `'small'` | — |
| 箭头位置 | 标题右侧 | arrowPosition | `'right'` | 默认 |
| 箭头位置 | 标题左侧 | arrowPosition | `'left'` | — |
| 展开模式 | 同级只展开一个 | accordion | `true` | — |
| 选中色 | 蓝色文字+浅蓝背景 | modelValue | 对应 value | — |
| 菜单项禁用 | 灰色文字 | disabled (OMenuItem) | `true` | OSubMenu 无 disabled，需用 MenuItem 替代 |
| 父子关联 | 父级也高亮 | selectStrictly | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OMenu | OCollapse | OMenu 有选中高亮状态和导航语义(ul/li)，OCollapse 是纯内容展开收起无选中态 |
| OMenu | OTab | OTab 是水平排列的选项卡切换面板，OMenu 是垂直排列的层级导航列表 |
| OMenu | ODropdown | ODropdown 是弹出式浮层菜单，OMenu 是页面内嵌的固定侧边栏导航 |

**DSL 识别规则（避免遗漏）**

- **图标判断**：M size 变体（属性3=ic_Enabled/ic_Actived）中的图标是 OpenDesign 内置图标（如 OIconFilter）。**不要**用项目自定义图标替代，应从 `@opensig/opendesign` 导入
- **S size 无图标**：S size 所有变体均无图标，不要添加 icon 插槽
- **多 OMenu 识别**：DSL 同一列中出现**多个独立的 assembled Group**（各自有完整菜单结构，且 top 坐标相差 > 100px），应渲染为多个独立 `<OMenu>` 实例，而不是一个带 Group 标签的 OMenu
- **渐变选中背景**：DSL 的 `fill` 中若有 `GRADIENT_LINEAR`（非纯色），选中态背景需用 `:deep()` 覆盖 `background`（见上方"可覆盖的 CSS 变量"一节）

**Playwright 测试注意事项**

- 点击嵌套子菜单项（三层以上）时，`.o-sub-menu-children-wrap` 可能拦截点击事件，需加 `{ force: true }`：
  ```typescript
  await item.click({ force: true })
  ```
- 嵌套菜单中 `.o-sub-menu-children` 可能有多个匹配元素（strict mode 违规），等待可见时需用 `.first()`：
  ```typescript
  // ❌ 报 strict mode violation
  await expect(menu.locator('.o-sub-menu-children')).toBeVisible()
  // ✅ 正确
  await expect(menu.locator('.o-sub-menu-children').first()).toBeVisible()
  ```
