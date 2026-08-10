> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](config-provider.visual.md) · [代码使用](config-provider.usage.md)

# OConfigProvider 配置提供者 — 样式定制

### 响应式行为表

无。OConfigProvider 是纯逻辑组件，不涉及尺寸与布局变化。

---

### 组件布局结构

```yaml
component: OConfigProvider
root: 无DOM元素  # 模板仅为 <slot></slot>，不生成包裹元素
  direction: none
  visual-rendering: false
  mechanism: provide/inject
  provided-keys:
    - key: configProviderInjectKey
      value:
        locale: Ref<i18nLanguagesT | undefined>  # 语言词条配置
        link: Ref<LinkConfigT | undefined>        # Link组件全局点击回调
  children:
    - slot: default  # 所有子组件内容，直接渲染无包裹
```
