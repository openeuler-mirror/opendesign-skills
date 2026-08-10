> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](message.visual.md) · [样式定制](message.style.md)

# OMessage 消息提示 — 代码使用

### 导入方式

```vue
<script setup>
import { OMessage, useMessage } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type MessageStatusT = 'info' | 'success' | 'warning' | 'danger' | 'loading';
type MessagePositionT = 'top' | 'bottom';

type MessageParamsT = Partial<MessagePropsT & {
  content: string | VNode | Component;
  position: MessagePositionT;
  targetAlign?: 'center' | 'left' | 'right';
  icon: VNode | Component;
  onDurationEnd: () => void;
  onClose: (ev?: MouseEvent) => void;
}>;
```

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean)` | 显示状态变化时 |
| duration-end | — | 自动关闭计时结束 |
| close | `(ev?: MouseEvent)` | 消息关闭时 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 消息正文 | 无 |
| icon | — | 始终 | 状态图标 | 对应 status 的默认图标 |
| title | — | 有 title prop 或 title 插槽时 | 替换标题区域。使用后 title 属性失效。 | `{{ title }}` |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| close(ev?) | `ev?: MouseEvent` | 关闭消息 |

---

### 典型使用场景与调用模板

**场景 1：页面公告（组件式，固定位置）**
适用于：页面始终显示的公告/提示（不推荐用于操作反馈）
```vue
<OMessage status="info" colorful>重要公告：系统升级中</OMessage>
<OMessage status="warning" closable :duration="5000">警告：敏感操作需确认</OMessage>
```

**场景 2：带标题详情（组件式，内联）**
适用于：需要标题+详情的静态提示区域（仍是组件式，非命令式）
```vue
<OMessage status="danger" colorful title="操作失败">
  您的账户存在异常，请联系客服处理。
</OMessage>
```

**场景 3：操作反馈（命令式，全局）** ⭐ **推荐**
适用于：表单提交、删除、保存等操作后的动态反馈
```vue
<script setup>
import { useMessage, OButton } from '@opensig/opendesign';
const message = useMessage(); // 无参数，消息显示在页面顶部

const handleSave = async () => {
  try {
    await api.save(data);
    message.success('保存成功');
  } catch (err) {
    message.danger('保存失败，请稍后重试');
  }
};
</script>
<template>
  <OButton @click="handleSave">保存</OButton>
</template>
```

**场景 4：定位提示（命令式，元素附近）** ⭐ **推荐**
适用于：表单验证错误、输入框反馈等需要定位在特定元素附近的提示
```vue
<script setup>
import { useTemplateRef } from 'vue';
import { useMessage } from '@opensig/opendesign';

const passwordInput = useTemplateRef('password');
const message = useMessage(passwordInput); // 指定目标元素

const validatePassword = (pwd: string) => {
  if (pwd.length < 8) {
    message.warning({
      content: '密码长度不能少于 8 位',
      position: 'bottom',
      targetAlign: 'left',
    });
    return false;
  }
  return true;
};
</script>
<template>
  <input ref="password" type="password" placeholder="请输入密码" />
</template>
```

**场景 5：加载状态（命令式，手动关闭）**
适用于：长时间操作（如文件上传、大数据处理），需要显示加载中并由程序控制关闭时机
```vue
<script setup>
import { useMessage } from '@opensig/opendesign';

const message = useMessage();
let closeLoading: (() => void) | null = null;

const handleUpload = async (file: File) => {
  // 显示加载消息，duration: 0 表示不自动关闭
  closeLoading = message.loading({
    content: '上传中，请稍候...',
    duration: 0,
  });

  try {
    await api.upload(file);
    closeLoading?.(); // 手动关闭加载提示
    message.success('上传成功');
  } catch (err) {
    closeLoading?.();
    message.danger('上传失败');
  }
};
</script>
```

---

### OMessage Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean` | — | `undefined` | 消息是否可见（v-model 双向绑定）。 | — |
| defaultVisible | `boolean` | — | `true` | 非受控模式下消息是否默认可见。默认可见。 | — |
| status | `MessageStatusT` | `'info'` / `'success'` / `'warning'` / `'danger'` / `'loading'` | `'info'` | 消息状态类型。"info" 信息提示、"success" 成功、"warning" 警告、"danger" 危险/错误、"loading" 加载中。不同状态对应不同颜色和图标。默认 info。 | — |
| colorful | `boolean` | — | `false` | 是否使用彩色背景。开启后消息背景色跟随状态颜色变化，并在左侧显示彩色侧边条。默认关闭。 | — |
| duration | `number` | — | — | 消息自动关闭的持续时间（毫秒）。未设置或小于等于 0 时不自动关闭。鼠标悬停在消息上时暂停计时。 | — |
| closable | `boolean` | — | `false` | 是否显示关闭按钮，允许手动关闭。默认关闭。 | — |
| beforeClose | `() => Promise<boolean> \| boolean` | — | 关闭前的钩子函数。返回 true 允许关闭，返回 false 阻止关闭。支持异步。 | 关闭前钩子 | — |
| title | `string` | — | — | 标题 | — |

---

### useMessage API

```typescript
const message = useMessage(target);
// target?: string | ComponentPublicInstance | HTMLElement | Ref<...>
//          可选，为指定元素附近显示消息；省略时消息在页面指定位置显示

message.show(params);    // 显示消息，params 由status自定义或传入，返回关闭函数
message.info(params);    // info 状态消息
message.success(params); // success 状态消息
message.warning(params); // warning 状态消息
message.danger(params);  // danger 状态消息
message.loading(params); // loading 状态消息
message.close();         // 关闭本实例所有消息
message.closeAll();      // 关闭所有实例的全部消息
```

#### useMessage params 参数详解

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| content | `string \| VNode \| Component` | 否 | — | 消息内容。可直接传字符串作为 params（如 `message.success('保存成功')`）；或在对象中指定 |
| status | `MessageStatusT` | 否 | `'info'` | 消息状态（仅 `show()` 需传，其他方法自动设定） |
| position | `'top' \| 'bottom'` | 否 | `'top'` | 相对目标元素的位置：'top' 目标上方，'bottom' 目标下方 |
| targetAlign | `'center' \| 'left' \| 'right'` | 否 | `'center'` | 消息相对目标元素的水平对齐方式 |
| duration | `number` | 否 | `3000` | 自动关闭时间（毫秒）。0 或负数时不自动关闭 |
| icon | `VNode \| Component` | 否 | — | 自定义消息图标，不传时根据 status 显示默认图标 |
| onDurationEnd | `() => void` | 否 | — | 自动关闭计时完成时的回调函数 |
| onClose | `(ev?: MouseEvent) => void` | 否 | — | 消息关闭时的回调函数，可获取关闭事件 |

#### params 传参形式

> ⚠️ **版本说明**：字符串简写形式（`message.success('...')`）从 **v1.1.0** 开始支持。v1.0.x 及以前版本只接受对象形式，传字符串会报 TS 类型错误。

```typescript
// 形式 1：字符串（简洁写法，v1.1.0+ 支持）
message.success('保存成功');
message.warning('已发送，请检查邮箱');

// 形式 2：对象（全版本支持，推荐）
message.success({
  content: '保存成功',
  duration: 5000,
  onClose: () => console.log('消息已关闭'),
});

// 形式 3：指定位置和对齐
const submitBtn = ref<HTMLElement>();
const message = useMessage(submitBtn);
message.success({
  content: '提交成功',
  position: 'bottom',
  targetAlign: 'right', // 按钮右下方显示
});
```

> **使用指导**：
> - **页面全局消息**：`useMessage()` 无参调用，消息在页面顶部显示
> - **局部元素反馈**：`useMessage(targetEl)` 指定目标元素，消息紧邻该元素显示
> - **自动消失**：默认 3 秒后自动关闭；手动永驻传 `duration: 0`

---

### 使用方式速查

| 场景 | 使用方式 | 说明 | 何时选择 |
|------|---------|------|---------|
| **全局操作反馈** | `useMessage()` + `.success()` / `.danger()` | 命令式，消息在页面顶部 | ⭐ 最常见：表单提交、保存、删除等操作 |
| **元素附近提示** | `useMessage(target)` + `.warning()` + `position/targetAlign` | 命令式，定位在目标元素 | 表单验证错误、输入框校验提示 |
| **永驻公告** | `<OMessage status="..." colorful>` | 组件式，嵌入模板 | ⚠️ 仅用于始终显示的页面公告 |
| **加载中** | `useMessage().loading({ duration: 0 })` 返回 close 函数 | 命令式，需手动关闭 | 长时间操作（上传、处理）|
| **可关闭弹窗** | `useMessage().success({ ... })` 返回 close 函数 | 命令式，也可点击关闭 | — |
| **带标题消息** | 组件式 `<OMessage title="...">` 或命令式对象含 content | 两种方式都支持 | 组件式用于公告；命令式应使用普通文本 |

> ⚠️ **重要提醒**：
> - **优先使用 `useMessage()`**，它自动管理消息栈和定位
> - **仅当消息需要始终显示在页面某处时才用组件式 `<OMessage>`**（如页面公告）
> - **不要用组件式处理操作反馈**，那样需要手动维护 visible 状态且无法复用消息栈管理
