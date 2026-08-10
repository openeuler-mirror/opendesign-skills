> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](dialog.visual.md) · [代码使用](dialog.usage.md)

# ODialog 对话框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dlg-close-size` | `var(--o-icon_size_control-m)` | 关闭按钮图标大小 |
| `--dlg-close-color` | `var(--o-color-info2)` | 关闭按钮默认颜色 |
| `--dlg-close-color-hover` | `var(--o-color-primary2)` | 关闭按钮悬停颜色 |
| `--dlg-close-color-active` | `var(--o-color-primary3)` | 关闭按钮激活颜色 |
| `--dlg-color` | `var(--o-color-info1)` | 内容文字颜色 |
| `--dlg-header-color` | `var(--o-color-info1)` | 标题文字颜色 |
| `--dlg-bg-color` | `var(--o-color-control5-light)` | 对话框背景色 |
| `--dlg-radius` | `var(--o-radius_control-xs)` | 对话框圆角。由断点和主题共同决定：默认 control-xs，≤840px 断点下使用 control-s，手机端半屏贴边时为 0 |
| `--dlg-shadow` | `var(--o-shadow-1)` | 对话框阴影 |
| `--dlg-max-height` | `100%` | 对话框最大高度（auto 模式为 80%） |
| `--dlg-min-width` | `272px` | 对话框最小宽度 |
| `--dlg-margin` | `24px` | 对话框外边距 |
| `--dlg-edge-gap` | `32px` | 对话框内边距（四周） |
| `--dlg-inner-gap` | `24px` | header/body/footer 区域间距 |
| `--dlg-actions-justify` | `center` | 底部按钮对齐方式（可设为 `flex-end` 等） |
| `--dlg-btn-gap` | `16px` | 底部按钮之间的间距 |

**使用示例**：
```vue
<ODialog v-model:visible="visible" style="--dlg-actions-justify: flex-end; --dlg-btn-gap: 8px">
  <template #header>标题</template>
  <p>内容</p>
</ODialog>
```

---

### 响应式行为表

| 维度 | ≤600px (手机) | 601–840px (平板竖) | 841–1200px (平板横) | >1200px (笔记本+) |
|------|---------------|-------------------|--------------------|--------------------|
| 对话框位置 | 底部弹出 | 居中 | 居中固定 | 居中 |
| 关闭按钮 | 隐藏 | 显示 | 显示 | 显示 |
| 按钮样式 | 均分宽度 | 竖线分隔 | 竖线分隔 | 标准 |
| 圆角 | control-s（由主题决定） | control-s | 标准 | control-xs（由主题决定） |
| 边距 | 16px | 16px | 16px | 24px |
| 标题字号 | text2 | text2 | text2 | h4 |
| exlarge 宽度 | 100% | 100%全屏 | 80% | 75% |
| large 宽度 | 100% | 100%全屏 | 65% | 60% |
| medium 宽度 | 100vw | 75% | 65% | 40% |
| small 宽度 | 100vw | 75% | 32% | 25% |

触控 vs 指针差异：

| 场景 | 触控设备 | 指针设备 |
|------|---------|---------|
| 动画起点 | 从中心/底部展开（CSS origin） | 从鼠标点击位置展开 |
| 按钮样式 | 未指定 variant 时自动改为 text | 保持原样 |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  direction: vertical
  container: OLayer > .o-dlg-main
  background: var(--o-color-control5-light)
  border-radius: var(--o-radius_control-l)
  box-shadow: var(--o-shadow-1)
  padding: 32px  # --dlg-edge-gap
  regions:
    - name: header
      element: .o-dlg-header
      text-align: center
      font-size: var(--o-font_size-h2)
      font-weight: 500
      flex-shrink: 0
      margin-bottom: 24px  # --dlg-inner-gap
    - name: body
      element: .o-dlg-body
      flex: 1
      min-height: 0
      children:
        - name: body-content
          element: .o-dlg-body-content
          directive: v-scrollbar  # 默认启用滚动条
          children:
            - { type: slot, name: default }
    - name: footer
      element: .o-dlg-footer
      flex-shrink: 0
      margin-top: 24px  # --dlg-inner-gap
      children:
        - name: actions
          element: .o-dlg-actions
          display: flex
          justify-content: center  # --actions-justify
          children:
            - { type: slot, name: footer }  # 优先级最高
            - { type: slot, name: actions }  # 或 OButton × N
          btn-gap: 16px  # --dlg-btn-gap
  overlay:
    - name: close-btn
      element: .o-dlg-btn-close
      position: absolute
      top: 8px
      right: 8px
      icon: IconClose
  variants:
    auto: { max-height: "80%" }
    exlarge: { width: "65%", max-height: 780px, min-height: 520px }
    large: { width: "60%", max-height: 780px, min-height: 424px }
    medium: { width: "40%", max-height: 480px, min-height: 328px }
    small: { width: "25%", max-height: 272px, min-height: 224px }
```

**笔记本 ≤1200px**
```yaml
# padding: 24px, inner-gap: 16px, btn-gap: 12px
# header font-size: h4
# exlarge: width 75%, large: width 60%, medium: width 40%, small: width 25%
```

**平板 ≤840px**
```yaml
# padding: 16px, inner-gap: 12px, btn-gap: 8px
# header font-size: text2
# exlarge/large: width 100%, radius 0 (全屏)
# medium: width 75%, small: width 75%
# 固定定位, 按钮间竖线分隔
```

**手机 ≤600px**
```yaml
# 底部对齐 (flex-end), 关闭按钮隐藏
# 按钮 flex:1 均分宽度
# phoneHalfFull: width 100%, 顶部保留圆角
# medium/small: width 100vw, margin 24px
```
