> ← [组件索引](../SKILL.md#组件索引) · [代码使用](step.usage.md) · [样式定制](step.style.md)

# OStep 步骤条 — 视觉识别

OStep 是步骤条组件，用于展示流程进度或引导用户按步骤操作。由父容器 OStep 与子项 OStepItem 组合使用，支持水平和垂直两种方向布局，每个步骤项拥有独立的状态和图标。

🧩 **布局结构**：步骤条整体为水平（默认）或垂直排列的容器，内部放置多个 OStepItem。每个 OStepItem 由头部区域（圆形标识+连接线）和主体区域（标题+描述）组成。水平模式下，头部在上、主体在下，居中对齐；垂直模式下，头部在左、主体在右，左对齐。相邻步骤之间由连接线连接，连接线位置通过 ResizeObserver 动态计算。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal  # 默认，可切换 vertical
regions: [OStepItem(head(symbol+line) + main(title+desc)), ...]
```

### 设计稿识别指南

**视觉特征指纹**

1. 多个圆形标识水平排列 + 圆内有数字 + 圆之间有连接线 + 圆下方有标题文字 → 匹配 OStep（水平模式）
2. 多个圆形标识垂直排列 + 圆右侧有标题 + 圆之间有垂直连接线 → 匹配 OStep（垂直模式）
3. 圆形内有对勾图标（绿色背景）→ OStepItem status="finished" + icon=true
4. 圆形蓝色背景 + 标题加粗 → OStepItem status="processing"
5. 圆形红色背景 + 感叹号图标 → OStepItem status="failed" + icon=true

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 排列方向 | 水平（从左到右） | direction | `'h'` | 默认 |
| 排列方向 | 垂直（从上到下） | direction | `'v'` | — |
| 圆形背景色 | `--o-color-success1` 绿色 | status | `'finished'` | 默认状态 |
| 圆形背景色 | `--o-color-primary1` 蓝色 | status | `'processing'` | 标题加粗 |
| 圆形背景色 | `--o-color-primary4` 浅灰蓝 | status | `'waiting'` | — |
| 圆形背景色 | `--o-color-danger1` 红色 | status | `'failed'` | — |
| 圆内内容 | 数字 | icon | `false` / 不传 | 显示 stepIndex+1 |
| 圆内内容 | 对勾/感叹号图标 | icon | `true` | 根据状态自动选择 |
| 圆内内容 | 自定义图标 | icon | `Component` | 传入组件 |
| 圆形尺寸 | icon_size_control-l（约 40px） | — | — | 桌面端默认 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OStep | OBreadcrumb | OBreadcrumb 是路径导航面包屑（文字+分隔符），OStep 有圆形标识和连接线 |
| OStep | OMenu / 导航菜单 | OMenu 是页面路由切换，OStep 是流程进度展示，有 finished/processing/waiting 状态 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.0 | 新增 OStep / OStepItem 组件 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.0 | 新增 OStep / OStepItem 组件 |
