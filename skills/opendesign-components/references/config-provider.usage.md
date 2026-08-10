> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](config-provider.visual.md) · [样式定制](config-provider.style.md)

# OConfigProvider 配置提供者 — 代码使用

### 导入方式

```vue
<script setup>
import { OConfigProvider } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 必填 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|------|--------|--------|------|--------|
| locale | `i18nLanguagesT` | 否 | `{ locale: string; [k: string]: string }` | `undefined` | 设置语言词条，覆盖子组件中使用 useI18n 获取的翻译文本。词条对象中必须包含 locale 字段标识语言标识符（如 "zh-CN"、"en-US"、"ja-JP"），其余字段为具体的翻译键值对（如 "pagination.goto"、"select.cancel" 等）。当配置了 locale 后，其后代组件通过 useI18n 获取的翻译结果将优先使用此处的词条，未被 OConfigProvider 包裹的组件则使用全局默认语言包。 | — |
| link | `LinkConfigT` | 否 | `{ click: (e: MouseEvent, params: LinkPropsT, attrs: Record<string, any>) => void }` | `undefined` | 为所有后代 OLink 组件统一注册点击回调。配置对象包含一个 click 方法，当任意后代 OLink 被点击时（前提是该 OLink 的 global 属性为 true，默认即为 true），除触发自身 click 事件外，还会额外调用此全局 click 回调，并传入原生事件对象、Link 的 props 和额外的 attrs。典型用途包括全局链接点击埋点、路由拦截等。 | 0.0.68 |

---

### Events 表

无。

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 放置需要接收全局配置的所有子组件。 | 无 |

---

### 插槽层级关系

```
OConfigProvider（无可见渲染，纯配置注入）
└── default（所有子组件内容）
```

---

### 典型使用场景与调用模板

**场景 1：国际化语言切换**
适用于：需要为局部区域或整个应用设置特定语言词条

```vue
<script setup>
import { ref } from 'vue';
import { OConfigProvider } from '@opensig/opendesign';

const locale = ref({
  locale: 'en-US',
  'pagination.goto': 'go to',
  'pagination.page': 'Page',
  'pagination.countPerPage': ' / Page',
  'pagination.total': 'Total: {0}',
  'select.cancel': 'Cancel',
});
</script>

<template>
  <OConfigProvider :locale="locale">
    <!-- 内部组件将使用上述英文词条 -->
    <YourPageContent />
  </OConfigProvider>
</template>
```

**场景 2：动态语言切换**
适用于：用户可选择切换语言

```vue
<script setup>
import { ref } from 'vue';
import { OConfigProvider, OButton } from '@opensig/opendesign';
import { useLocale } from '@opensig/opendesign';

const languages = {
  'zh-CN': { locale: 'zh-CN', 'pagination.goto': '跳转' },
  'en-US': { locale: 'en-US', 'pagination.goto': 'go to' },
  'ja-JP': { locale: 'ja-JP', 'pagination.goto': '移動' },
};

const currentLocale = ref(languages['zh-CN']);

const switchLang = (lang: string) => {
  currentLocale.value = languages[lang];
  useLocale(lang);
};
</script>

<template>
  <OButton @click="switchLang('zh-CN')">中文</OButton>
  <OButton @click="switchLang('en-US')">English</OButton>
  <OButton @click="switchLang('ja-JP')">日本語</OButton>

  <OConfigProvider :locale="currentLocale">
    <YourPageContent />
  </OConfigProvider>
</template>
```

**场景 3：全局 Link 点击拦截**
适用于：统一处理所有链接的点击行为（埋点、路由拦截等）

```vue
<script setup>
import { OConfigProvider, OLink } from '@opensig/opendesign';
import type { LinkConfigT } from '@opensig/opendesign';

const linkConfig: LinkConfigT = {
  click: (e, params, attrs) => {
    // 全局链接点击埋点
    console.log('Link clicked:', params.href, attrs);
    // 也可在此处进行路由拦截或其他全局处理
  },
};
</script>

<template>
  <OConfigProvider :link="linkConfig">
    <OLink href="/page1">页面一</OLink>
    <OLink href="/page2">页面二</OLink>
  </OConfigProvider>
</template>
```

**场景 4：同时配置语言和 Link 行为**
适用于：应用顶层统一配置

```vue
<script setup>
import { ref } from 'vue';
import { OConfigProvider } from '@opensig/opendesign';
import type { LinkConfigT } from '@opensig/opendesign';

const locale = ref({
  locale: 'en-US',
  'pagination.goto': 'go to',
  'pagination.page': 'Page',
});

const linkConfig: LinkConfigT = {
  click: (e, params, attrs) => {
    console.log('Global link click:', params, attrs);
  },
};
</script>

<template>
  <OConfigProvider :locale="locale" :link="linkConfig">
    <RouterView />
  </OConfigProvider>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 纯国际化 | `:locale="localeObj"` | 仅配置语言词条 |
| 纯链接拦截 | `:link="linkConfig"` | 仅配置全局链接行为 |
| 完整配置 | `:locale="localeObj"` + `:link="linkConfig"` | 同时配置语言和链接行为 |

---

### Expose 方法表

无。该组件未使用 defineExpose。

---

### 补充说明

#### locale 词条优先级

OConfigProvider 提供的 locale 词条优先级高于通过 `useLocale()` 全局设置的语言包。具体来说：
- 被 OConfigProvider 包裹的组件：优先使用 OConfigProvider 的 locale 词条
- 未被 OConfigProvider 包裹的组件：使用全局 `useLocale()` 设置的语言包

#### 词条变量替换

locale 词条中支持 `{0}`、`{1}`、`{2}` 等占位符用于变量替换。例如 `'pagination.total': 'Total: {0}'`，在组件内部调用 `t('pagination.total', 100)` 时会替换为 `'Total: 100'`。

#### 内置词条键名

组件库内置支持以下词条键名：
- `common.empty` - 空状态文案
- `common.loading` - 加载中文案
- `pagination.goto` - 分页跳转
- `pagination.page` - 分页页码
- `pagination.countPerPage` - 每页条数
- `pagination.total` - 总数（支持 `{0}` 占位符）
- `upload.buttonLabel` - 上传按钮文案
- `upload.drag` - 拖拽上传文案
- `upload.dragHover` - 拖拽悬停文案
- `upload.retry` - 重试
- `upload.delete` - 删除
- `upload.preview` - 预览
- `upload.edit` - 编辑
- `select.cancel` - 取消
- `select.confirm` - 确认
- `input.limit` - 输入限制

#### link.click 回调触发条件

link.click 全局回调仅在 OLink 组件的 `global` 属性为 `true`（默认值即为 true）时触发。若某个 OLink 设置了 `:global="false"`，则该链接的点击不会触发全局回调。
