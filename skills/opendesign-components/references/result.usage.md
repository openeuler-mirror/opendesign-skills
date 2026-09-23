> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](result.visual.md) · [样式定制](result.style.md)

# OResult 结果页 — 代码使用

### 导入方式

```vue
<script setup>
import { OResult } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type ResultStatusT = 'info' | 'success' | 'warning' | 'danger';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| status | `ResultStatusT` | `'info'` / `'success'` / `'warning'` / `'danger'` | — | 结果状态。"info" 信息、"success" 成功、"warning" 警告、"danger" 危险/错误。每种状态对应不同颜色和图标。不传则不显示状态图标。 | — |
| title | `string` | — | — | 标题 | — |
| description | `string` | — | — | 结果描述文字，对标题的补充说明。 | — |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| image | — | 有 image 插槽时 | 图片区域，显示在顶部。适合放异常态插画（如空数据图标）。使用后不影响其他区域。 | 无 |
| icon | — | 有 status 或 icon 插槽时 | 替换状态图标。使用后 status 对应的默认图标失效。 | 对应 status 的默认图标 |
| title | — | 有 title prop 或 title 插槽时 | 替换标题区域。使用后 title 属性失效。 | `{{ title }}` |
| description | — | 有 description prop 或 description 插槽时 | 替换描述区域。使用后 description 属性失效。 | `{{ description }}` |
| extra | — | 有 extra 插槽时 | 操作按钮区域，位于描述下方。适合放 "返回首页"、"重试" 等按钮。 | 无 |
| default | — | 有 default 插槽时 | 详细内容区域，位于底部。适合放详细错误信息或操作指引。 | 无 |

---

### 典型使用场景与调用模板

**场景 1：成功结果**
适用于：操作成功反馈
```vue
<OResult status="success" title="提交成功" description="您的申请正在审核中">
  <template #extra>
    <OButton variant="outline" color="primary" round="pill">返回首页</OButton>
  </template>
</OResult>
```

**场景 2：异常态（带插画）**
适用于：空数据、网络错误等异常页面
```vue
<OResult title="暂无工单" description="您目前没有待处理的工单">
  <template #image>
    <OIconNoData />
  </template>
  <template #extra>
    <OButton color="primary" variant="solid" round="pill">在线提单</OButton>
  </template>
</OResult>
```

**场景 3：警告/错误结果**
适用于：操作失败反馈
```vue
<OResult status="danger" title="提交失败" description="请检查网络连接后重试" />
```

**场景 4：带详细内容**
适用于：展示错误详情
```vue
<OResult status="warning" title="部分导入失败">
  <template #extra>
    <OButton>重试</OButton>
  </template>
  <p>以下 3 条数据导入失败：</p>
  <ul>
    <li>第 5 行：格式错误</li>
    <li>第 12 行：数据重复</li>
  </ul>
</OResult>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 成功反馈 | `status="success"` + `title` + `#extra` | 带操作按钮 |
| 失败反馈 | `status="danger"` + `title` + `description` | 错误提示 |
| 空数据 | `title` + `#image` + `#extra` | 无 status |
| 自定义图标 | `#icon` + `title` | 替换默认图标 |
