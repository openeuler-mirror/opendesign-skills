> ← [组件索引](../SKILL.md#组件索引) · [代码使用](ip-input.usage.md) · [样式定制](ip-input.style.md)

# OIpInput IP地址输入框 — 视觉识别

OIpInput 是专用于输入 IPv4 地址的组件。它由多个分段输入框组成，每个分段之间用圆点分隔符连接，整体包裹在一个外框（InBox）中。用户逐段输入数字，组件自动校验范围（0-255）并在填满三位数字时自动跳转到下一段。

🧩 **布局结构**：外层 `.o-ip-input` 是一个 InBox 容器（水平排列），内部由多个 OInput 分段输入框和圆点分隔符交替排列组成。每个分段输入框居中对齐、无独立边框（边框由外层 InBox 统一提供），分隔符为 4px 圆点。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [InBox(外框容器) > [OInput(分段输入), separator(圆点分隔符)] × segmentsLen]
```

### 设计稿识别指南

**视觉特征指纹**

1. 单一矩形输入框内含多段（默认 4 段）数字区域 + 段间有小圆点分隔 → 匹配 OIpInput
2. 每段最多 3 位数字，数字居中显示 → 匹配 OIpInput
3. 外框样式（实心/线框/无框）与 OInput 一致但内部结构明显不同 → 匹配 OIpInput

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 外框 | 实心填充 | variant | `'solid'` | — |
| 外框 | 仅描边 | variant | `'outline'` | 默认 |
| 外框 | 无边框 | variant | `'text'` | — |
| 边框颜色 | 绿色系 | color | `'success'` | — |
| 边框颜色 | 橙色系 | color | `'warning'` | — |
| 边框颜色 | 红色系 | color | `'danger'` | 表单校验错误时 |
| height | var(--o-control_size-l) | size | `'large'` | — |
| height | var(--o-control_size-m) | size | `'medium'` | — |
| height | var(--o-control_size-s) | size | `'small'` | — |
| border-radius | 全圆角 | round | `'pill'` | — |
| 分段数 | 非 4 段 | segmentsLen | 对应数字 | 默认 4 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OIpInput | OInput | OIpInput 内部有圆点分隔的多段数字区域，OInput 是单一连续输入区域 |
| OIpInput | 多个 OInput 并排 | OIpInput 共享一个外框，段间有内置圆点分隔符且自动跳转焦点 |
| OIpInput | OInputNumber | OInputNumber 有增减按钮，OIpInput 无增减按钮且为多段结构 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.0 | 新增 OIpInput 组件 |
