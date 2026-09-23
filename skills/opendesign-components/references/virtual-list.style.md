> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](virtual-list.visual.md) · [代码使用](virtual-list.usage.md)

# OVirtualList 虚拟滚动列表 — 样式定制

### 可覆盖的 CSS 变量

OVirtualList 本身无可覆盖的 CSS 变量（`var.scss` 为空）。组件内部使用 `--content-height`、`--offsetY` 等变量由 JavaScript 动态计算并注入，不应手动覆盖。

列表项的样式应直接在 `default` 插槽的内容元素上设置，容器高度通过外部 `style` 传入：

```vue
<OVirtualList :list="list" :item-size="48" style="height: 400px;">
  <template #default="{ item }">
    <div style="height: 48px; padding: 12px;">{{ item.name }}</div>
  </template>
</OVirtualList>
```

---

### 响应式行为表

本组件无响应式差异。

---

### 组件布局结构

**通用布局（无响应式差异）**
```yaml
layout:
  element: div.o-virtual-list
  direction: vertical
  regions:
    - name: wrapper
      element: div.o-virtual-list-wrapper
      overflow: auto  # 带滚动条（v-scrollbar 指令）
      height: 继承父容器  # 需要外部设置固定高度
      children:
        - name: body
          element: div.o-virtual-body
          height: var(--content-height)  # 所有列表项总高度（虚拟撑高）
          children:
            - name: render-list
              element: div.o-virtual-render-list
              transform: translateY(var(--offsetY))  # 偏移到可视区域位置
              children:
                - name: render-item  # 仅渲染可视区域 + buffer 的项
                  element: div.o-virtual-render-item
                  repeat: startIndex..endIndex
                  height: itemSize (固定高度模式) 或 auto (不定高模式)
                  children:
                    - { type: slot, name: default, props: "{ item, index }" }
  scrollbar:
    directive: v-scrollbar
    default: { showType: "always", size: "medium" }
    configurable: true  # 通过 scrollbar prop 自定义
  modes:
    fixed-height:
      description: 传入 itemSize，所有项等高，性能最优
      item-height: itemSize  # 固定像素值
    variable-height:
      description: 不传 itemSize，使用 defaultItemSize 预估
      item-height: auto  # 渲染后动态测量（ResizeObserver）
      default-estimate: 80px  # defaultItemSize 默认值
```
