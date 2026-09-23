> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](loading.visual.md) · [样式定制](loading.style.md)

# OLoading 加载 — 代码使用

### 导入方式

```vue
<script setup>
import { OLoading } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean` | — | `false` | 是否显示加载层（v-model 双向绑定）。 | — |
| size | `SizeT \| 'mini'` | `'mini'` / `'small'` / `'medium'` / `'large'` | 加载图标尺寸。"mini" 超小号、"small" 小号、"medium" 中号、"large" 大号。默认 small。 | 尺寸 | @since 1.1.0（新增 mini/medium/large 尺寸） |
| label | `string` | — | — | 加载文字 | — |
| icon | `Component` | — | — | 自定义加载图标组件。不传时使用默认旋转加载图标。 | — |
| iconRotating | `boolean` | — | — | 自定义图标是否旋转。默认关闭（默认图标始终旋转）。 | — |
| wrapper | `string \| HTMLElement \| null` | 加载层挂载位置。"body" 挂载到 body、CSS 选择器字符串挂载到指定元素、不传则在组件位置渲染。 | `'body'` | 挂载位置 | — |
| mask | `boolean` | — | `true` | 是否显示遮罩 | — |
| unmountOnHide | `boolean` | — | `true` | 隐藏时销毁 DOM | — |
| mainClass | `string \| object \| array` | 主内容区域自定义类名。 | — | 主内容类名 | — |
| mainTransition | `string` | — | `'o-zoom-fade2'` | 主内容过渡动画 | — |
| maskTransition | `string` | — | `'o-fade-in'` | 遮罩过渡动画 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean, evt?: MouseEvent)` | 显示状态变化时 |
| change | `(val: boolean)` | 加载层显示/隐藏状态变化时触发。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 替换整个加载内容区域（图标 + 文字）。使用后内部 icon 和 label 插槽全部失效。 | 图标 + label 文字 |
| icon | — | 未使用 default 插槽时 | 替换加载图标区域。使用后 icon 属性和 iconRotating 属性失效。 | `<IconLoading />` 旋转图标 |
| label | — | 未使用 default 插槽时，且有 label prop 或 label 插槽 | 替换加载文字区域。使用后 label 属性失效。 | `{{ label }}` |

---

### 插槽层级关系

```
default（使用后内部全部失效）
├── icon
└── label
```

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| toggle(show?) | `show?: boolean` | 切换显示状态 |

---

### 典型使用场景与调用模板

**场景 1：基础加载**
适用于：页面数据加载
```vue
<script setup>
import { ref } from 'vue';
const loading = ref(true);
</script>
<template>
  <OLoading v-model:visible="loading" label="加载中..." />
</template>
```

**场景 2：覆盖指定容器**
适用于：局部加载遮罩
```vue
<div id="container" style="position: relative;">
  <OLoading v-model:visible="loading" wrapper="#container" mask label="请稍候" />
  <!-- 容器内容 -->
</div>
```

**场景 3：全屏加载**
适用于：整页加载
```vue
<OLoading v-model:visible="loading" wrapper="body" mask size="large" label="页面加载中" />
```

**场景 4：自定义图标**
适用于：品牌定制加载效果
```vue
<OLoading v-model:visible="loading" :icon="MyCustomIcon" icon-rotating label="处理中" />
```

**场景 5：完全自定义内容**
适用于：复杂加载展示
```vue
<OLoading v-model:visible="loading">
  <div class="custom-loading">
    <MyAnimation />
    <p>正在为您准备数据...</p>
  </div>
</OLoading>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础加载 | `v-model:visible` + `label` | 最常见用法 |
| 全屏遮罩 | `wrapper="body"` + `mask` + `size="large"` | 整页加载 |
| 局部遮罩 | `wrapper="#id"` + `mask` | 区域加载 |
| 自定义图标 | `:icon` + `icon-rotating` | 品牌图标 |
| 无文字 | 仅 `v-model:visible` | 纯图标加载 |

---

### v-loading 指令

除组件写法外，可用 `v-loading` 指令将加载层叠加到现有容器元素上，无需在模板中插入 `<OLoading />`。

#### 导入与注册

```vue
<script setup>
import { vLoading } from '@opensig/opendesign';
// 在 <script setup> 中 import 后，v-loading 自动可用于模板
</script>
```

#### ⚠️ 关键约束：容器必须有 `position: relative`

`v-loading` 指令的加载覆盖层使用 `position: absolute` 定位，相对于**最近的非 static 定位祖先**。
若容器缺少 `position: relative`，覆盖层会逃出容器范围，覆盖错误区域。

```vue
<!-- ✅ 正确：容器有 position: relative -->
<div style="position: relative; min-height: 100px;" v-loading="isLoading">
  <p>卡片内容</p>
</div>

<!-- ❌ 错误：无定位，覆盖层会定位到错误位置 -->
<div v-loading="isLoading">
  <p>卡片内容</p>
</div>
```

#### Binding 值类型

| 类型 | wrapper 默认 | mask 默认 | 说明 |
|------|------------|----------|------|
| `boolean` | `null`（容器内渲染） | `true` | 快捷写法，`true` 显示 / `false` 隐藏 |
| `Partial<LoadingPropsT>` | `null`（容器内渲染） | `true` | 完整配置对象，支持所有 LoadingProps |

当传入响应式对象（`reactive()`）时，指令会自动 `watch` 变化，无需手动触发更新。

#### 修饰符（仅 boolean binding 时有效）

| 修饰符 | 说明 |
|--------|------|
| `.body` | 将 Loading 挂载到 body（全屏模式），忽略容器定位 |
| `.nomask` | 禁用遮罩层（等价于 `mask: false`） |

#### 典型用法

```vue
<!-- 简洁：boolean binding，默认带遮罩 -->
<div style="position: relative;" v-loading="isLoading">
  <p>内容区域</p>
</div>

<!-- 完整配置：object binding，指定 label 和 size -->
<div style="position: relative;" v-loading="{ visible: isLoading, label: '加载中', size: 'large' }">
  <p>内容区域</p>
</div>

<!-- 无遮罩：object binding + mask: false -->
<div style="position: relative;" v-loading="{ visible: isLoading, mask: false, size: 'medium', label: '处理中' }">
  <p>内容区域</p>
</div>

<!-- 响应式对象：自动监听变化 -->
<script setup>
import { reactive } from 'vue';
const loadingState = reactive({ visible: true, label: '同步中', size: 'small' });
</script>
<div style="position: relative;" v-loading="loadingState">
  <p>内容区域</p>
</div>

<!-- 全屏（.body 修饰符） -->
<div v-loading.body="isLoading"></div>

<!-- boolean + 无遮罩（.nomask 修饰符） -->
<div style="position: relative;" v-loading.nomask="isLoading"></div>
```

---

### useLoading 组合式函数

除组件和指令外，可用 `useLoading` 以**命令式**方式控制加载层，适合在业务逻辑（非模板）中动态创建和控制加载状态。

#### 导入

```vue
<script setup>
import { useLoading } from '@opensig/opendesign';
</script>
```

#### 签名

```typescript
function useLoading(
  opt?: Partial<LoadingPropsT>,
  wrap?: Ref<HTMLElement | undefined> | HTMLElement | string
): { toggle: (show?: boolean) => void }
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| opt | `Partial<LoadingPropsT>` | — | Loading 配置，支持所有 LoadingProps |
| wrap | `Ref<HTMLElement>` / `HTMLElement` / `string` | `'body'` | 挂载目标：Vue ref、DOM 元素、CSS 选择器字符串 |

返回值 `{ toggle(show?: boolean): void }`：
- `toggle(true)` — 显示
- `toggle(false)` — 隐藏
- `toggle()` — 切换

#### ⚠️ 关键约束

- 必须在 `setup()` 或组合式函数中调用（使用了 `watch` / `onMounted`）
- 当 `wrap` 为 CSS 选择器字符串时，查找在 `onMounted` 中执行，确保目标 DOM 已存在
- 当 `wrap` 为 `Ref` 时，会自动 `watch` 其变化，ref 赋值后才挂载

#### 典型用法

```vue
<script setup>
import { ref } from 'vue';
import { useLoading } from '@opensig/opendesign';

// 场景 1：全屏加载（默认挂载到 body）
const globalLoading = useLoading({ label: '加载中', size: 'large' });

async function fetchData() {
  globalLoading.toggle(true);
  await api.loadData();
  globalLoading.toggle(false);
}

// 场景 2：挂载到模板 ref 元素
const containerRef = ref<HTMLElement>();
const localLoading = useLoading({ label: '处理中', mask: true }, containerRef);

// 场景 3：挂载到 CSS 选择器（须在 onMounted 后目标 DOM 存在）
const selectorLoading = useLoading({ size: 'medium' }, '#my-panel');
</script>

<template>
  <div ref="containerRef" style="position: relative; min-height: 100px;">
    <!-- 内容区域 -->
  </div>
  <button @click="fetchData">加载数据</button>
</template>
```
