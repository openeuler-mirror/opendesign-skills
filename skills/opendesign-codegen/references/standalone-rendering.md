> ← [代码直出指南](../SKILL.md) · [工程落地约束](engineering-rules.md)

# standalone HTML 渲染 OpenDesign（无 bundler 场景）

本 skill 主流程是直接产出 Vue SFC 落进带 bundler 的目标工程。但当场景需要**无 bundler 的单文件 HTML**（原型 / Demo / 设计评审等，直接浏览器打开即渲染真实 `@opensig/opendesign` 组件）时，用 UMD + CDN 方式渲染。此场景不走 Vite/Nuxt，下述坑由 bundler 隐式解决的问题需手动处理。

> ⚠️ 这是 SFC 主流程之外的辅助场景，不要用它替代工程内代码；生产代码仍走 [starter-page.vue](starter-page.vue) + bundler。

---

## 依赖加载顺序（必须）

```
vue  →  @vueuse/core  →  dayjs  →  process 垫片  →  opendesign UMD
```

> 顺序不可乱：opendesign UMD 初始化时会从全局取 `Vue` / `VueUse` / `dayjs`，必须先于 opendesign 脚本加载完成。

## process 垫片（必须）

UMD 内部存在 `process.env.NODE_ENV` 分支（warn / 开发提示路径），裸浏览器无 `process` 全局，会抛 `ReferenceError: process is not defined`，导致组件 setup 中断、渲染为空。在加载 opendesign 脚本**之前**注入：

```html
<script>window.process = window.process || { env: { NODE_ENV: 'production' } };</script>
```

## CDN 资源清单（真实路径形态）

以 jsdelivr 为例（unpkg 同理，按实际包结构拼接）。**先查文件清单再拼 URL**，不要凭记忆写 `dist/`：

```html
<!-- 1. vue 3 全局构建 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.global.prod.js"></script>

<!-- 2. @vueuse/core iife：注意在包根，不在 dist/ -->
<script src="https://cdn.jsdelivr.net/npm/@vueuse/core@10.11.1/index.iife.min.js"></script>

<!-- 3. dayjs -->
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js"></script>

<!-- 4. process 垫片（必须在 opendesign 之前） -->
<script>window.process = window.process || { env: { NODE_ENV: 'production' } };</script>

<!-- 5. opendesign UMD -->
<script src="https://cdn.jsdelivr.net/npm/@opensig/opendesign@1.2.4/dist/opendesign.min.js"></script>

<!-- 6. 主题 token CSS（以 openEuler e.light 为例） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@opensig/opendesign-token@0.0.10/themes/e.light.token.css">
<!-- 组件样式（若 UMD 不含样式） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@opensig/opendesign@1.2.4/dist/index.min.css">
```

## 已知坑与核对方法

- **`@vueuse/core` 的 iife 在包根**：`index.iife.min.js`，**不在** `dist/index.iife.min.js`（后者 404）。不确定路径时先查 jsdelivr 文件清单：
  ```bash
  curl -s 'https://data.jsdelivr.com/v1/packages/npm/@vueuse/core@10.11.1?structure=flat' | jq -r '.files[].name'
  ```
- **theme token CSS 内部 `@import`**：`@opensig/opendesign-token@<ver>/themes/{e.light,e.dark}.token.css` 内部 `@import './responsive.token.css'`，CDN 可递归解析，无需手动引入响应式文件。
- **peer 依赖锁版**：以目标仓 `@opensig/opendesign` 的 `package.json` `peerDependencies` 为准（典型：`vue ^3.3.0`、`@vueuse/core 10.11.1`、`dayjs 1.11.13`），混用其他主版本可能导致运行时崩溃。
- **UMD 导出核对**：组件库版本与 skill 文档基线不一致时，以运行时事实为准，核对 UMD 实际导出的组件名：
  ```bash
  curl -s 'https://cdn.jsdelivr.net/npm/@opensig/opendesign@<ver>/dist/opendesign.min.js' | grep -o 'e\.[A-Z][A-Za-z]*=' | sort -u
  ```

> ⚠️ standalone UMD 融合环境（多份全局 Vue/VueUse 共存）下，个别依赖内部互相调用可能出现库级运行时错误（如 vueuse 内部 `toValue` 调用失败，症状为 OAnchor 滚动高亮失效 / ODataTable 渲染为空）。此类问题**优先在仓库构建环境（Vite/Nuxt）中验证是否复现**；仓库内正常而 UMD 异常时，多为 UMD 融合环境问题，非组件本身缺陷。根因未明前不在此固化结论与规避写法。
