> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](avatar.visual.md) · [代码使用](avatar.usage.md)

# OAvatar 头像 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--avatar-size` | prop size 的 normalize 结果 | 头像宽高（始终圆形，width = height） |
| `--avatar-bg` | 文字模式随机 auxiliary 色；图片模式 `--o-color-fill2` | 头像背景色 |
| `--avatar-color` | `var(--o-color-white)` | 头像文字颜色 |
| `--avatar-mask` | `var(--o-color-mask1)` | 可点击遮罩层背景色 |
| `--avatar-border` | `2px solid var(--o-color-fill2)` | 头像组中头像的白色边框 |

**使用示例**:
```vue
<OAvatar name="Alice" style="--avatar-bg: #1a73e8; --avatar-color: #fff" />
<OAvatarGroup style="--avatar-border: 3px solid #fff" :url-list="urlList" size="60px" />
```

---

### 响应式行为表

| 维度 | 行为 | 备注 |
|------|------|------|
| size 传入 CSS 变量 | 受全局 token 响应式规则影响 | 如 `var(--o-icon_size-4xl)` 在不同断点可能不同 |
| OAvatarGroup symmetric | grid gap 固定 3.5px | 小尺寸头像下间距可能偏大，建议手动调整 |
| OAvatarGroup horizontal | 负 margin 按 `--avatar-size * -4/24` 计算 | 随 avatar-size 缩放 |

---

### 组件布局结构

**OAvatar**
```yaml
layout:
  component: div.o-avatar.o-avatar-circle
  direction: centered(flex)
  align: center
  size: var(--avatar-size)  # width = height, 始终圆形
  font-size: calc(var(--avatar-size) * 0.4)  # 文字模式字号
  regions:
    - name: image
      element: img
      condition: url 存在且未加载失败
      style: objectFit 由 prop 控制
    - name: text
      condition: 无 url 有 name 时
      children:
        - { type: slot, name: name, fallback: "nameFormatter渲染 或 name[0]" }
    - name: default-icon
      element: IconAvatar.o-avatar-default-icon
      condition: 无 url 无 name，或图片加载失败时
    - name: trigger-icon
      element: div.o-avatar-trigger-icon
      condition: clickable=true
      opacity: 0 → 1(hover时)
      children:
        - { type: slot, name: triggerIcon, fallback: "IconEdit" }
  variants:
    img-loaded: { class: o-avatar-img, bg: var(--o-color-fill2) }
    default: { class: o-avatar-default, bg: 无/透明 }
    text: { class: o-avatar-text, bg: 随机auxiliary色或background }
    clickable: { class: o-avatar-clickable }
```

**OAvatarGroup - horizontal 布局**
```yaml
layout:
  component: div.o-avatar-group.o-avatar-group-horizontal
  direction: horizontal(flex, row-reverse)
  align: center
  regions:
    - name: more-overflow
      condition: 溢出数量 > 0
      element: OAvatar.o-avatar-group-more  # 位于头部（DOM首位）
      children:
        - { type: slot, name: more, fallback: "IconEllipsis 或 +N文字" }
    - name: avatars
      element: OAvatar(循环, reversed排列)
      count: 最多 2 个真实头像
      style: margin-left: calc(--avatar-size * -4/24), border: 2px solid fill2
  overflow:
    max_visible: 3  # 2 真实 + 1 溢出
    more_position: 首位(DOM反转排列)
```

**OAvatarGroup - symmetric 布局**
```yaml
layout:
  component: div.o-avatar-group.o-avatar-group-symmetric
  direction: grid(2x2 或自适应)
  gap: 3.5px
  variants:
    single(total<2): { grid-template-columns: 1fr }
    triangle(total=3): { grid-template-columns: 1fr 1fr, 首项跨两列居中 }
    square(total=4): { grid-template-columns: 1fr 1fr }
  regions:
    - name: avatars
      element: OAvatar(循环)
      count: 最多 3 个真实头像
    - name: more-overflow
      condition: 溢出数量 > 0
      element: OAvatar.o-avatar-group-more  # 位于尾部
      children:
        - { type: slot, name: more, fallback: "IconEllipsis 或 +N文字" }
  overflow:
    max_visible: 4  # 3 真实 + 1 溢出
    more_position: 末位
```
