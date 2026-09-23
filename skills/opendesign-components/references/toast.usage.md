> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](toast.visual.md) · [样式定制](toast.style.md)

# OToast 轻提示 — 代码使用

### 导入方式

```vue
<script setup>
// 内联使用
import { OToast } from '@opensig/opendesign';
// 命令式调用
import { useToast } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type ToastPositionT = 'top' | 'bottom' | 'center';

type ToastParamsT = Partial<
  ToastPropsT & {
    content: string | VNode | Component;
    position: ToastPositionT;
    targetOffset: number;
    targetAlign: 'center' | 'left' | 'right';
    onDurationEnd: () => void;
    onClose: (ev?: MouseEvent) => void;
  }
>;

// Duration 枚举
enum Duration {
  NORMAL = 2000,  // 默认持续时间
  LONG = 3500,    // long 模式持续时间
}
```

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean)` | 显示状态变化时 |
| duration-end | — | 自动关闭计时结束 |
| close | `(ev?: MouseEvent)` | 提示关闭时触发，携带鼠标事件参数。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 替换提示内容区域。使用后 message 属性失效。 | `{{ message }}` |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| close(ev) | `ev: MouseEvent` | 手动关闭提示 |

---

### 典型使用场景与调用模板

**场景 1：内联提示（静态展示）**
适用于：页面中固定位置的提示信息
```vue
<OToast message="toast 提示" />
```

**场景 2：内联提示使用插槽（自定义内容）**
适用于：需要在提示中放入链接、图标等复杂内容
```vue
<OToast>
  <span style="margin-right: 6px">toast提示</span>
  <OLink color="normal" style="--o-color-link1: var(--o-color-info1-inverse)">
    文字按钮
    <template #suffix><OIconChevronRight /></template>
  </OLink>
</OToast>
```

**场景 3：命令式全局提示**
适用于：按钮点击后的操作反馈
```vue
<script setup>
import { useToast, OButton } from '@opensig/opendesign';
const { show: showToast } = useToast();
const handleClick = () => {
  showToast('操作成功');
};
</script>
<template>
  <OButton @click="handleClick">操作</OButton>
</template>
```

**场景 4：长提示与自定义 TSX 内容**
适用于：需要较长展示时间和复杂内容的提示
```tsx
import { useToast, OLink, OIconChevronRight } from '@opensig/opendesign';

const { show: showToast } = useToast();

const handleClick = () => {
  showToast({
    long: true,
    content: () => (
      <>
        <span style={{ marginRight: '6px' }}>toast提示</span>
        <OLink color="normal">
          {{
            default: () => '文字按钮',
            suffix: () => <OIconChevronRight />,
          }}
        </OLink>
      </>
    ),
  });
};
```

**场景 5：指定目标元素附近显示**
适用于：在特定容器内展示提示
```vue
<script setup>
import { ref } from 'vue';
import { useToast, OButton } from '@opensig/opendesign';
const wrapRef = ref();
const { show: showToast, close } = useToast(wrapRef);
const handleClick = () => {
  showToast({
    duration: 5000,
    position: 'center',
    targetAlign: 'left',
    targetOffset: 16,
    content: '在自定义目标元素内居中对齐',
  });
};
</script>
<template>
  <div ref="wrapRef" style="width: 400px; height: 300px; padding: 16px;">
    <OButton @click="handleClick">显示提示</OButton>
    <OButton @click="close">关闭提示</OButton>
  </div>
</template>
```

**场景 6：手动关闭提示**
适用于：需要程序控制关闭时机
```vue
<script setup>
import { useToast } from '@opensig/opendesign';
const { show: showToast, close, closeAll } = useToast();
let closeFn: (() => void) | null = null;
const startTask = () => {
  closeFn = showToast({ content: '处理中...', duration: 0 });
};
const finishTask = () => {
  closeFn?.();        // 关闭单条提示
  // 或 close();      // 关闭本实例所有提示
  // 或 closeAll();   // 关闭所有实例的所有提示
};
</script>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 全局弹出提示 | `useToast()` + `.show('文字')` | 命令式最常见用法 |
| 内联提示 | `message` | 页面固定提示 |
| 内联自定义内容 | default 插槽 | 放入链接等复杂内容 |
| 长提示 | `long: true` | 默认 3500ms |
| 自定义时长 | `duration: 5000` | 指定毫秒数 |
| 不自动关闭 | `duration: 0` | 需手动关闭 |
| 定位到目标元素 | `useToast(target)` + `position` + `targetAlign` + `targetOffset` | 目标元素附近 |
| 顶部显示 | `position: 'top'` | 改为顶部定位 |
| 居中显示 | `position: 'center'` | 屏幕或目标元素居中 |

---

### OToast Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean` | — | `undefined` | 提示是否可见（v-model 双向绑定）。 | — |
| defaultVisible | `boolean` | — | `true` | 非受控模式下提示是否默认可见。默认可见（true）。 | — |
| message | `string` | — | — | 提示信息文字 | — |
| duration | `number` | — | — | 提示自动消失的持续时间（毫秒）。内联使用时，未设置或值不为正数时不会自动消失；命令式调用时，默认 2000ms，设置 long 时默认 3500ms。 | — |
| long | `boolean` | — | — | 是否为长提示模式。开启后命令式调用的默认持续时间从 2000ms 延长至 3500ms。 | — |
| position | `ToastPositionT` | `'top'` / `'center'` / `'bottom'` | `'bottom'` | 提示出现的方向。可选 "top"（顶部）、"center"（居中）、"bottom"（底部）。默认 bottom。 | — |
| beforeClose | `() => Promise<boolean> \| boolean` | — | 关闭前的钩子函数。返回 true 或 false 控制是否允许关闭。支持异步（返回 Promise）。 | 关闭前钩子 | — |

---

### useToast API

```typescript
const toast = useToast(target?);
// target: string | ComponentPublicInstance | HTMLElement | Ref<...> | null | undefined

toast.show(params);    // 显示提示，返回 close 函数
toast.close();         // 关闭本实例所有提示
toast.closeAll();      // 关闭所有提示
```

- `params` 可以是字符串（直接作为 content）或 `ToastParamsT` 对象
- 命令式调用默认 `duration: 2000`（long 模式 3500），`position: 'bottom'`
