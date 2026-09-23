> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](popup.visual.md) · [代码使用](popup.usage.md)

# OPopup 弹出层 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--popup-bg-color` | — | 弹出层背景色 |
| `--popup-shadow` | — | 弹出层阴影 |
| `--popup-radius` | — | 弹出层圆角 |
| `--popup-bd` | — | 弹出层边框 |
| `--popup-padding` | — | 弹出层内边距 |
| `--popup-min-width` | — | 弹出层最小宽度 |
| `--popup-z-index` | — | 弹出层层级 |
| `--popup-edge-offset` | — | 边缘偏移量 |

> 注：OPopup 本身不预设这些变量的默认值，默认外观由上层封装组件（如 OPopover）通过其自身 var.scss 设置。直接使用 OPopup 时，可通过 `wrap-class` 传入自定义类名，在该类名上覆盖 CSS 变量。

**使用示例**:
```vue
<OPopup wrap-class="my-popup">
  <div>自定义内容</div>
  <template #target><OButton>触发</OButton></template>
</OPopup>

<style>
.my-popup {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-padding: 12px 16px;
}
</style>
```

---

### CSS 变量

| 变量名 | 说明 |
|--------|------|
| `--popup-padding` | 内边距 |
| `--popup-bg-color` | 背景色 |
| `--popup-shadow` | 阴影 |
| `--popup-radius` | 圆角 |
| `--popup-bd` | 边框 |
| `--popup-min-width` | 最小宽度 |
| `--popup-z-index` | 层级 |
| `--popup-edge-offset` | 边缘偏移 |

---

### 响应式行为表

本组件无响应式差异。

---

### 组件布局结构

**通用结构**
```yaml
layout:
  parts:
    - name: target
      wrapper: OChildOnly  # 确保单个根元素
      children:
        - { type: slot, name: target }  # 触发元素
    - name: popup-layer  # 通过 Teleport 挂载到 wrapper（默认 body）
      tag: div.o-popup
      position: absolute  # JS 动态计算 top/left
      z-index: 动态递增（createTopZIndex）
      style: "{ top, left, minWidth/width }"
      class: "o-popup-pos-{position}"
      regions:
        - name: transition
          type: Transition
          name: o-zoom-fade  # --transition prop
          children:
            - name: wrap
              class: o-popup-wrap  # + wrapClass
              style: "transformOrigin 动态计算"
              children:
                - name: body
                  class: o-popup-body  # + bodyClass
                  children:
                    - { type: slot, name: default }  # 弹出内容
                - name: anchor
                  condition: anchor === true  # 默认 false
                  class: o-popup-anchor  # + anchorClass
                  style: "{ top/left/right/bottom } 动态计算"
                  children:
                    - { type: slot, name: anchor }
  behaviors:
    trigger: click  # 默认
    offset: 0       # 默认
    anchor: false   # 默认
    adaptive: true  # 空间不足自动翻转
    unmountOnHide: true  # 隐藏时卸载 DOM
    autoHide: true  # 点击外部自动隐藏
    hideWhenTargetInvisible: true  # 目标滚出视口时隐藏
    adjustMinWidth: true  # 最小宽度匹配触发元素
    adjustWidth: true     # 宽度匹配触发元素
  position-options: [top, tl, tr, bottom, bl, br, left, lt, lb, right, rt, rb]
```
