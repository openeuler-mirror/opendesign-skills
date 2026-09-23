> ← [组件索引](../SKILL.md#组件索引) · [代码使用](tag.usage.md) · [样式定制](tag.style.md)

# OTag 标签 — 视觉识别

OTag 是标签组件，用于标记和分类信息。支持九种颜色、两种样式、三种尺寸、可交互态、可关闭、关闭前拦截、自定义图标。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），large 标签高度缩至 20px、内边距减小；在平板竖屏及以下（≤840px），medium 标签高度缩至 xs、内容缩放 0.83。

🧩 **布局结构**：标签内部水平排列，从左到右依次为：图标区（可选）、文字标签区、关闭按钮区（closable 时显示）。图标与文字间距 2–4px（随尺寸变化）。标签高度由 size 决定（large 28px / medium 20px / small 16px），水平内边距 5–11px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [icon(前缀图标), label(文字内容), close(关闭按钮)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 小尺寸圆角矩形色块 + 内含短文本（1–4 个字） → 匹配 OTag
2. 标签内有 × 关闭图标 → 匹配 OTag（closable 模式）
3. 半圆角胶囊形小色块 + 文字 → 匹配 OTag（round="pill"）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 背景色 | 实心填充 | variant | `'solid'` | 默认 |
| 背景色 | 透明，仅边框 | variant | `'outline'` | — |
| fill 颜色 | `--o-color-primary1` 蓝色系 | color | `'primary'` | — |
| fill 颜色 | `--o-color-success1` 绿色系 | color | `'success'` | — |
| fill 颜色 | `--o-color-warning1` 橙色系 | color | `'warning'` | — |
| fill 颜色 | `--o-color-danger1` 红色系 | color | `'danger'` | — |
| fill 颜色 | `--o-color-info1` 灰色系 | color | `'normal'` | 默认 |
| fill 颜色 | `--o-color-info1`（info 蓝色） | color | `'info'` | — |
| height | 28px | size | `'large'` | 默认 |
| height | 20px | size | `'medium'` | — |
| height | 16px | size | `'small'` | — |
| border-radius | 全圆角（≥高度值） | round | `'pill'` | — |
| 关闭图标 | 有 × 按钮 | closable | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OTag | OButton | OTag 是静态标签展示用于分类，OButton 是可点击的操作触发器 |
| OTag | OBadge | OBadge 附着在其他元素右上角作为角标，OTag 是独立的标签元素 |
| OTag | OToggle | OToggle 有选中/未选中交互状态切换，OTag 无选中状态（仅展示或可关闭） |
| OTag（closable） | OTag（非 closable） | 有 × 图标表示可移除，需设置 closable |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | 重构颜色与交互态体系：color 新增 `pending`/`disabled`/`main2` 三种颜色；新增 `interactive` 属性控制 hover 交互态；CSS 变量新增 `--tag-bd`/`--tag-bg-image`/`--tag-bg-color-hover`/`--tag-bd-color-hover`/`--tag-color-hover`；关闭按钮颜色默认改为 inherit（继承文字色）；outline 模式 normal 边框色从 control1 改为 control4；Ascend/Kunpeng 主题下 primary solid 标签文字色使用 `--o-color-info1-inverse` |
| v1.1.0 | 修复受控模式下的问题 |
