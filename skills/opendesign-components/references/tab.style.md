> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tab.visual.md) · [代码使用](tab.usage.md)

# OTab 标签页 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名                            | 默认值                                   | 说明                    |
| --------------------------------- | ---------------------------------------- | ----------------------- |
| `--tab-nav-btn-icon-size`         | `var(--o-icon_size_control-xs)`          | 导航按钮图标尺寸        |
| `--tab-nav-btn-size`              | `24px`                                   | 导航按钮尺寸            |
| `--tab-nav-color`                 | `var(--o-color-info2)`                   | 页签文字颜色            |
| `--tab-nav-color-disabled`        | `var(--o-color-info4)`                   | 禁用页签文字颜色        |
| `--tab-nav-radius`                | `2px`                                    | 页签圆角                |
| `--tab-icon-color`                | `var(--o-color-info2)`                   | 页签图标颜色            |
| `--tab-icon-color-hover`          | `var(--o-color-primary1)`                | 页签图标 hover 颜色     |
| `--tab-icon-color-disabled`       | `var(--o-color-info4)`                   | 页签图标禁用颜色        |
| `--tab-nav-divider`               | `1px solid var(--o-color-control1)`      | 导航栏底部分隔线        |
| `--tab-nav-anchor-color`          | `var(--o-color-primary1)`                | text 模式底部指示线颜色 |
| `--tab-nav-anchor-height`         | `2px`                                    | text 模式底部指示线高度 |
| `--tab-nav-close-size`            | `var(--o-icon_size_control-xs)`          | 关闭按钮图标尺寸        |
| `--tab-nav-icon-size`             | `var(--o-icon_size_control-m)`（medium） | 页签图标尺寸            |
| `--tab-nav-icon-gap`              | `8px`                                    | 图标与文字间距          |
| `--tab-nav-ellipsis-padding-x`    | `16px`                                   | 更多按钮水平内边距      |
| `--tab-nav-ellipsis-shadow-width` | `8px`                                    | 更多按钮遮罩宽度        |
| `--tab-nav-ellipsis-shadow-color`  | `var(--o-grey-14)`                       | 更多按钮遮罩颜色（v1.2.5-sp1 新增，≤840px 下遮罩宽度扩大为 48px） |
| `--tab-nav-ellipsis-shadow-gradient` | 渐变值                               | 更多按钮遮罩渐变（v1.2.5-sp1 新增） |
| `--tab-nav-text-size`             | `var(--o-font_size-text2)`（medium）     | 页签文字字号            |
| `--tab-nav-text-height`           | `var(--o-line_height-text2)`（medium）   | 页签文字行高            |
| `--tab-nav-gap`                   | `32px`（medium）                         | 页签间距                |
| `--tab-nav-padding`               | `0 0 16px`（medium）                     | 页签内边距              |
| `--tab-nav-justify`               | `center`                                 | 导航栏水平对齐方式      |

**使用示例**:

```vue
<OTab style="--tab-nav-anchor-color: var(--o-color-success1)" v-model="active">
  <OTabPane value="tab1" label="标签一">内容</OTabPane>
</OTab>
```

---

### 响应式行为表

| 维度         | ≤840px          | 841–1440px | >1440px    |
| ------------ | --------------- | ---------- | ---------- |
| large 文字   | tip1            | text2      | 标准       |
| medium 文字  | tip1            | text1      | 标准       |
| small 文字   | tip1            | tip1       | 标准       |
| large 图标   | 控件 s          | 控件 m     | 标准       |
| large 间距   | 16px            | 32px       | 标准       |
| small 间距   | 12px            | 24px       | 标准       |
| 溢出更多菜单 | 横向滚动模式 | Popup 弹出 | Popup 弹出 |

触控 vs 指针差异：

| 场景     | 触控设备             | 指针设备          |
| -------- | ------------------ | ----------------- |
| 溢出菜单 | 横向滚动模式（≤840px） | OPopup hover 触发 |

---

### 组件布局结构

**桌面端 >1440px（text 模式，medium 尺寸）**

```yaml
layout:
  direction: vertical
  class: o-tab o-tab-text o-tab-medium
  regions:
    - name: head
      class: o-tab-head
      direction: horizontal
      align: center
      border-bottom: "1px solid var(--o-color-control1)" # line=true 时
      children:
        - name: prefix
          type: slot
          class: o-tab-head-prefix
          condition: "有 prefix 插槽时"
        - name: navs
          class: o-tab-navs
          flex: 1
          justify-content: var(--tab-nav-justify, center)
          children:
            - name: navs-container
              class: o-tab-navs-container
              children:
                - name: nav-list
                  class: o-tab-nav-list
                  direction: horizontal
                  justify-content: var(--tab-nav-justify, center)
                  gap: 32px # --tab-nav-gap, large 40px, small 24px
                  children:
                    - name: nav-item
                      class: o-tab-nav
                      padding: "0 0 16px" # --tab-nav-padding
                      font-size: var(--o-font_size-text2) # --tab-nav-text-size
                      color: var(--o-color-info2)
                      color-active: var(--o-color-primary1)
                      description: 重复多个，对应每个 OTabPane
                    - name: more-button
                      class: o-tab-nav o-tab-nav-ellipsis
                      condition: "有溢出页签时"
                      description: "显示 '...' 或 moreLabel+'箭头'"
                - name: anchor
                  class: o-tab-nav-anchor
                  children:
                    - name: anchor-line
                      class: o-tab-nav-anchor-line
                      height: 2px # --tab-nav-anchor-height
                      background: var(--o-color-primary1)
                      transition: "transform 宽度和位置跟随选中项"
            - name: add-button
              class: o-tab-nav-add
              condition: addable=true
              icon: IconAdd
        - name: suffix
          type: slot
          class: o-tab-head-suffix
          condition: "有 suffix 插槽时"
    - name: body
      class: o-tab-body
      children:
        - name: tab-pane
          type: OTabPane
          description: "多个面板，仅当前选中的显示"
          transition: "o-fade-in"
  variants:
    text:
      nav-hover-color: var(--o-color-primary1)
      anchor: 底部滑动指示线
    solid:
      nav-bg: var(--o-color-control1-light)
      nav-bg-active: var(--o-color-control5-light)
      nav-padding: "4px 16px"
      nav-gap: 8px
    button:
      nav-bg: var(--o-color-fill3)
      nav-bg-active: var(--o-color-fill2)
      nav-border-active: "1px solid var(--o-color-control4-light)"
      border-radius: var(--o-radius_control-s)
      nav-gap: 4px
      nav-padding: "6px 16px" # large
      no-anchor: true
      no-line: true
```

**≤1440px**

```yaml
# large: text-size text2, icon-size control-m, gap 32px
# medium: text-size text1
# small: text-size tip1, icon-size control-s, gap 24px
# button.large: text-size text1, icon-size icon-s, padding "4px 16px"
```

**≤840px**

```yaml
# large: text-size tip1, icon-size control-s, gap 16px, anchor-height 1px
# medium: text-size tip1, gap 16px
# small: text-size tip1, gap 12px
# 溢出菜单由 OPopup 切换为 ODialog 底部弹出
```
