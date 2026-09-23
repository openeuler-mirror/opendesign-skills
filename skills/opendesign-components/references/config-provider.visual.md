> ← [组件索引](../SKILL.md#组件索引) · [代码使用](config-provider.usage.md) · [样式定制](config-provider.style.md)

# OConfigProvider 配置提供者 — 视觉识别

OConfigProvider 是全局配置组件，用于向其所有后代组件注入统一的配置信息。它本身不渲染任何可见内容，仅作为配置的传递容器。

🧩 **布局结构**：本组件为配置提供者，无视觉渲染。模板仅包含一个 `<slot></slot>`，不产生任何 DOM 元素。通过 Vue 的 provide/inject 机制向下传递 locale 和 link 配置。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: none  # 无视觉渲染，纯逻辑组件
regions: [slot:default]  # 透传子组件，无包裹元素
```

### 设计稿识别指南

**视觉特征指纹**

1. 本组件无视觉表现，在设计稿中不可见。它是代码层面的配置容器
2. 当设计稿展示了多语言界面（如中英文切换后的不同文案）时，暗示需要在应用顶层使用 OConfigProvider 配置 locale
3. 当设计稿标注了"全局链接跳转行为"或"链接埋点"需求时，暗示需要配置 link 属性

**设计 Token → Prop 值映射表**

| 设计稿 Token / 视觉特征 | 对应 Prop / 配置 | 说明 |
|---|---|---|
| 界面语言为英文/日文等非默认语言 | `locale` | 传入对应语言词条对象 |
| 组件内文案（分页、上传等）需自定义 | `locale` 中对应键 | 如 `pagination.goto`、`select.cancel` 等 |
| 所有链接需统一埋点/拦截 | `link.click` | 全局链接点击回调 |

**易混淆组件区分表**

| 组件 A | 组件 B | 区分标准 |
|--------|--------|---------|
| OConfigProvider | ORow / OCol | ConfigProvider 不产生 DOM，纯逻辑注入；ORow/OCol 布局组件会产生实际 DOM 容器 |
| OConfigProvider (locale) | useLocale() | ConfigProvider 是局部范围注入，可嵌套覆盖；useLocale 是全局设置 |
| OConfigProvider (link) | OLink @click | ConfigProvider 的 link.click 是全局统一回调；OLink 的 @click 是单个链接的事件 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v0.0.68 | 新增 `link` 属性，支持全局 Link 点击回调配置；新增 `tag` 属性（已移除） |
