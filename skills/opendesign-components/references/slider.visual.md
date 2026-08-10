> ← [组件索引](../SKILL.md#组件索引) · [代码使用](slider.usage.md) · [样式定制](slider.style.md)

# OSlider 滑动条 — 视觉识别

OSlider 是滑动条组件，用于在一个数值范围内通过拖拽选择数值。支持连续滑动和间隔（分段）滑动两种模式，支持单值选择和范围选择，可选配输入框、气泡提示和自定义标记。

🧩 **布局结构**：滑动条整体水平排列（默认），由轨道区域和可选输入框区域组成。轨道区域包含底部跑道条（runway）、已选进度条（bar）、一个或两个拖拽按钮（range 模式两个）、可选刻度点和标记文字。输入框区域在轨道右侧，包含数值输入框和单位文字。垂直模式时轨道纵向排列。按钮可显示气泡提示。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal  # 默认，可切换 vertical
regions: [runway-wrap(轨道: runway+bar+buttons+stops+marks), input-wrap(输入框+单位)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 水平细长轨道条 + 圆形滑块按钮 + 着色进度条 → 匹配 OSlider（连续模式）
2. 轨道上有等距圆点 + 滑块按钮较大且有内圆 → 匹配 OSlider（showStops 间隔模式）
3. 两个滑块按钮 + 中间区域着色 → 匹配 OSlider（range 范围模式）
4. 轨道右侧有数值输入框+单位 → 匹配 OSlider（showInput 模式）
5. 轨道下方有等距文字标签（如 0kg, 100kg）→ 匹配 OSlider（marks 标记模式）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 轨道方向 | 水平 | direction | `'h'` | 默认 |
| 轨道方向 | 垂直 | direction | `'v'` | — |
| 滑块数量 | 1 个 | range | `false` | 默认 |
| 滑块数量 | 2 个 | range | `true` | — |
| 轨道上有圆点 | 等距刻度圆点 | showStops | `true` | — |
| 轨道下方有文字 | 位置+标签文字 | marks | `Record<number, string>` | — |
| 右侧有输入框 | 数值输入+单位 | showInput | `true` | — |
| 输入框右侧文字 | 如 "kg"、"M" | unit | 字符串 | — |
| 滑块上有气泡 | 显示数值 | showPopover | `true` | 默认 |
| 无气泡 | — | showPopover | `false` | — |
| 灰色不可拖拽 | — | disabled | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OSlider | OProgress | OProgress 是只读进度条无滑块按钮，OSlider 有可拖拽圆形滑块 |
| OSlider | OInputNumber | OInputNumber 是独立数字输入控件，OSlider 以拖拽轨道为核心，输入框为辅助 |
| OSlider（range） | 双 OInputNumber | 范围滑动条有轨道+两个滑块，双输入框无轨道 |
