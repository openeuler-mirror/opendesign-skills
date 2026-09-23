> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](upload.visual.md) · [样式定制](upload.style.md)

# OUpload 上传 — 代码使用

### 导入方式

```vue
<script setup>
import { OUpload } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type UploadFileStatusT = 'pending' | 'uploading' | 'finished' | 'failed';
type UploadListTypeT = 'text' | 'picture' | 'picture-card';

interface UploadFileT {
  id: string | number;
  name: string;
  file?: File;
  status?: UploadFileStatusT;
  message?: string;
  messageClass?: string;
  retry?: boolean;
  percent?: number;
  request?: UploadRequestT;
  icon?: string | boolean | Component;
  imgUrl?: string;
}

interface UploadRequestOptionT {
  onProgress: (percent: number, event?: ProgressEvent) => void;
  onSuccess: (response?: { messages?: string; [k: string]: unknown }) => void;
  onError: (response?: { messages?: string; [k: string]: unknown }, retry?: boolean) => void;
  file: UploadFileT;
}

interface UploadRequestT {
  abort: () => void;
}
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `UploadFileT[]` | — | — | 文件列表（v-model 双向绑定）。数组中每项包含 id、name、file、status（pending/uploading/finished/failed）、percent 等信息。 | — |
| defaultFileList | `UploadFileT[]` | — | — | 非受控模式下的默认文件列表。 | — |
| accept | `string` | — | — | 可选文件的 MIME 类型限制，如 "image/jpeg;image/png"。 | — |
| disabled | `boolean` | — | 继承表单容器 | 禁用。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | — |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | 继承表单容器 | 尺寸。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | 1.2.7 |
| round | `RoundT` | `'pill'` / CSS 值 | 继承表单容器 | 圆角。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | 1.2.7 |
| multiple | `boolean` | — | `false` | 是否支持多文件上传。 | — |
| beforeSelect | `(value: UploadFileT[]) => Promise<boolean> \| boolean` | — | 选择文件前的拦截回调。返回 false 阻止选择。 | 选择前拦截 | — |
| onAfterSelect | `(fileList: FileList) => Promise<UploadFileT[]>` | — | — | 选择后的处理回调。可自定义文件对象的构造。 | — |
| btnLabel | `string` | — | — | 按钮文字 | — |
| uploadRequest | `(options: UploadRequestOptionT) => UploadRequestT` | — | — | 自定义上传请求函数。接收 onProgress/onSuccess/onError 回调和 file 信息，需返回包含 abort 方法的对象。 | — |
| lazyUpload | `boolean` | — | `false` | 是否手动触发上传。false 时选择后自动上传。默认自动上传。 | — |
| onBeforeUpload | `(file: UploadFileT) => Promise<boolean \| File>` | — | 上传前的拦截回调。返回 false 阻止上传，返回 File 替换上传文件。 | 上传前拦截 | — |
| onBeforeRemove | `(file: UploadFileT) => Promise<boolean>` | — | — | 删除前的拦截回调。返回 false 阻止删除。 | — |
| draggable | `boolean` | — | `false` | 拖拽上传 | — |
| dragLabel | `string` | — | — | 拖拽提示 | — |
| dragHoverLabel | `string` | — | — | 拖拽中提示 | — |
| listType | `UploadListTypeT` | `'text'` / `'picture'` / `'picture-card'` | `'text'` | 文件列表展示模式。"text" 文字列表、"picture" 图片列表、"picture-card" 图片卡片。默认 text。 | — |
| createThumbnail | `(file: File) => Promise<string>` | — | — | 自定义缩略图生成函数。 | — |
| showProgress | `boolean` | — | `false` | 上传中是否显示进度条。默认关闭。 | @since 1.2.0 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(value: UploadFileT[])` | 文件列表变化时 |
| progress | `(value: UploadFileT)` | 上传进度变化 |
| success | `(value: UploadFileT)` | 单文件上传成功时触发。 |
| error | `(value: UploadFileT)` | 单文件上传失败时触发。 |
| change | `(value: UploadFileT[])` | 文件列表变化 |
| select | `(value: UploadFileT[])` | 选择文件后 |
| itemRemove | `(value: UploadFileT, evt: Event)` | 删除文件 |
| itemRetry | `(value: UploadFileT, evt: Event)` | 重新上传 |
| itemReplace | `(value: UploadFileT, evt: Event)` | 替换文件 |
| itemPreview | `(value: UploadFileT, evt: Event)` | 预览文件 |
| itemClick | `(value: UploadFileT, evt: Event)` | 点击文件项 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | text/picture 模式 | 自定义上传触发区域（text/picture 模式下的选择按钮区域）。 | 默认上传按钮 |
| select-drag | — | draggable 时 | 拖拽区域 | 默认拖拽区域 |
| select-drag-extra | — | draggable 时 | 拖拽区域额外内容 | 无 |
| select-extra | — | 有插槽时 | 选择按钮后的额外内容区域。 | 无 |
| select-add | — | picture-card 模式 | picture-card 模式下自定义添加卡片内容。 | 加号图标+标签 |
| select-add-label | — | picture-card 模式 | picture-card 模式下自定义添加卡片标签文字。 | `btnLabel` 文字 |
| item | `{ item: UploadFileT }` | 始终 | 自定义文件列表项渲染。接收 item（当前文件对象 UploadFileT）作为插槽参数。 | 默认列表项渲染 |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| upload() | — | 手动触发所有文件上传 |
| select() | — | 打开文件选择对话框 |
| retry(file, force?) | `UploadFileT, boolean` | 重新上传指定文件 |
| replace(file) | `UploadFileT` | 替换指定文件 |
| replaceById(id, newFile) | `string, UploadFileT` | 按 id 替换文件 |
| replaceByIndex(index, newFile) | `number, UploadFileT` | 按索引替换文件 |
| removeById(id) | `string \| number` | 按 id 删除文件 |
| removeByIndex(index) | `number` | 按索引删除文件 |
| removeAll() | — | 删除所有文件 |
| previewItemById(id) | `number \| string` | 按 id 预览文件 |
| previewItemByIndex(index) | `number` | 按索引预览文件 |

---

### 典型使用场景与调用模板

**场景 1：基础上传**
适用于：简单文件上传
```vue
<script setup>
import { ref } from 'vue';
const fileList = ref([]);
const uploadRequest = ({ file, onProgress, onSuccess, onError }) => {
  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (e) => onProgress(Math.round(e.loaded / e.total * 100));
  xhr.onload = () => onSuccess({ messages: '上传成功' });
  xhr.onerror = () => onError({ messages: '上传失败' }, true);
  // xhr.open(...); xhr.send(file.file);
  return { abort: () => xhr.abort() };
};
</script>
<template>
  <OUpload v-model="fileList" :upload-request="uploadRequest" />
</template>
```

**场景 2：拖拽上传**
适用于：大文件或批量上传
```vue
<OUpload
  v-model="fileList"
  draggable
  multiple
  drag-label="点击或拖拽文件到此处"
  drag-hover-label="释放文件"
  :upload-request="uploadRequest"
/>
```

**场景 3：图片卡片模式**
适用于：图片上传预览
```vue
<OUpload
  v-model="fileList"
  list-type="picture-card"
  accept="image/jpeg;image/png"
  :upload-request="uploadRequest"
  @item-preview="handlePreview"
/>
```

**场景 4：手动上传**
适用于：选择完毕后统一上传
```vue
<script setup>
import { ref } from 'vue';
const uploadRef = ref();
const fileList = ref([]);
</script>
<template>
  <OUpload ref="uploadRef" v-model="fileList" lazy-upload :upload-request="uploadRequest" />
  <OButton @click="uploadRef.upload()">开始上传</OButton>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础上传 | `v-model` + `:upload-request` | 最常见 |
| 拖拽 | `draggable` + `drag-label` | 拖拽区域 |
| 图片卡片 | `list-type="picture-card"` + `accept` | 图片上传 |
| 图片列表 | `list-type="picture"` | 缩略图列表 |
| 手动上传 | `lazy-upload` + ref.upload() | 延迟上传 |
| 多文件 | `multiple` | 批量选择 |
| 进度条 | `show-progress` | 显示上传进度 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 新增 | 新增 `size`/`round` 属性；`size`/`round`/`disabled` 接入表单继承系统（详见 [OForm 表单级统一管控](form.usage.md)） |
| 1.2.5-sp3 / 1.2.7 | fix | 修复接口回显文件缩略图不显示的问题 |
