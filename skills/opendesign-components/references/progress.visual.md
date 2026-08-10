> ← [组件索引](../SKILL.md#组件索引) · [代码使用](progress.usage.md) · [样式定制](progress.style.md)

# OProgress 进度条 — 视觉识别

OProgress 是进度条组件，用于展示操作进度或数据占比。支持线形和环形两种形态、两种尺寸、四种颜色，可自定义线宽、轨道宽度、格式化文字、内部文字等。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），medium 尺寸的进度文字缩小。

🧩 **布局结构**：线形进度条水平排列，从左到右为：轨道区（含进度条填充）、标签区（百分比文字或图标，在右侧显示）。环形进度条为 SVG 圆环，中心叠加标签文字（始终在内部，无需额外 prop）。轨道圆角等于线宽，标签间距 8px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal  # 线形; 环形为层叠居中
regions: [track(轨道+进度条), label(百分比文字/图标)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 水平细长条 + 左侧有颜色填充表示进度 + 右侧百分比数字 → 匹配 OProgress（line）
2. 圆环 + 部分弧度有颜色填充 + 中心百分比数字 → 匹配 OProgress（circle）
3. 进度条内部嵌入百分比文字 → 匹配 OProgress（circle，label 默认在圆心）
4. 进度文字区域显示图标（如勾号/叉号）而非数字 → 匹配 OProgress（icon 插槽）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 形态 | 水平条形 | variant | `'line'` | 默认 |
| 形态 | 圆环形 | variant | `'circle'` | — |
| 进度色 | 蓝色/品牌色 | color | `'primary'` | 默认 |
| 进度色 | 绿色 | color | `'success'` | — |
| 进度色 | 橙色 | color | `'warning'` | — |
| 进度色 | 红色 | color | `'danger'` | — |
| 线宽 | 8px | size | `'medium'` | 默认；或 strokeWidth=8 |
| 线宽 | 4px | size | `'small'` | 或 strokeWidth=4 |
| 文字位置 | 右侧 | labelInside | `false` | 默认 |
| 文字位置 | 进度条内部 | labelInside | `true` | 仅 circle 模式 |
| 文字 | 无百分比文字 | showLabel | `false` | — |
| 环形直径 | 120px | trackWidth | — | medium 默认 |
| 环形直径 | 60px | trackWidth | — | small 默认 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OProgress（line） | OSlider | OSlider 有可拖拽手柄是输入控件，OProgress 是只读进度展示无交互手柄 |
| OProgress（circle） | 环形 loading | OProgress 显示具体百分比有明确进度值，loading 是不确定进度的持续旋转动画 |
| OProgress | 自定义 SVG 图表 | OProgress 是标准化组件支持 percentage/color/size 等 prop，自定义图表无统一 API |

---

## 版本变更记录

本组件近期无重大版本变更。
