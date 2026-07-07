/**
 * @description OpenDesign 主题管理 Pinia store。
 * 本项目选定 openEuler 社区主题（标识 `e`），仅在该社区内切换 light/dark 模式。
 * 切换社区需同时更换 `nuxt.config.ts` 中引入的 token CSS 文件与下方 `OPENDESIGN_COMMUNITY` 常量及 `FOUC_SCRIPT` 字符串。
 *
 * 使用 VueUse `usePreferredDark` 检测系统暗色偏好，`useCookie` 持久化用户选择（SSR 可读）。
 * 首次访问（无 cookie）跟随系统；用户手动切换后以用户选择为准。
 *
 * 防闪烁 + 防 hydration 不匹配：
 * - CSS 主题（`data-o-theme` 属性）：`useHead` 的 `htmlAttrs` 使用 computed，在客户端
 *   无 cookie 时直接跟随 `prefersDark`——与内联脚本逻辑一致，`useHead` 永远不会
 *   覆盖内联脚本的值。SSR 时用 cookie/默认值。
 * - Vue 组件状态（`isDark` 等）：`plugins/theme.client.ts` 延迟到 `app:mounted` 后
 *   才更新 store 的 `theme` ref，避免 OSwitch `v-model="isDark"` 与 SSR HTML 不匹配。
 */

/** 当前社区标识 */
export const OPENDESIGN_COMMUNITY = 'e' as const;

/** 明暗模式 */
export type OpendesignMode = 'light' | 'dark';

/** 完整主题标识：社区.模式（对应 `<html data-o-theme="e.light">`） */
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`;

/** cookie 名，供 store 与 plugin 共享 */
export const THEME_COOKIE_KEY = 'opendesign-mode';

/** cookie 配置，确保 store 读写一致 */
export const THEME_COOKIE_OPTS = {
  default: () => null as OpendesignMode | null,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 365,
};

/** `<html>` 上的主题属性名 */
export const DATA_THEME_ATTR = 'data-o-theme' as const;

/** 浅色模式值（与 `OpendesignMode` 类型对应，供运行时引用） */
export const MODE_LIGHT = 'light' as const;

/** 深色模式值 */
export const MODE_DARK = 'dark' as const;

/**
 * 防闪烁内联脚本：优先 cookie，无则读 `prefers-color-scheme`。
 * 所有值均引用上方常量，改一处即生效。
 */
const FOUC_SCRIPT = `(function(){try{var m=document.cookie.match(/${THEME_COOKIE_KEY}=(${MODE_LIGHT}|${MODE_DARK})/);var v=m?m[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'${MODE_DARK}':'${MODE_LIGHT}');document.documentElement.setAttribute('${DATA_THEME_ATTR}','${OPENDESIGN_COMMUNITY}.'+v);}catch(e){}})()`;

/**
 * @description 同步主题到 DOM：注入防闪烁内联脚本 + 响应式设置 `<html data-o-theme>` 属性
 *
 * - 内联脚本：在 SSR HTML 中即生效，优先读 cookie，无则读 `prefers-color-scheme`，避免 FOUC
 * - htmlAttrs computed：客户端无 cookie 时直接跟随 `prefersDark`（与内联脚本逻辑一致，
 *   `useHead` 永不会覆盖内联脚本的值）；SSR 或有 cookie 时取 `theme` ref 值
 *
 * 抽取到模块作用域以避免嵌套闭包累加 `useThemeStore` 的累计圈复杂度。
 *
 * @param modeCookie 持久化 cookie（null = 用户未选择，跟随系统）
 * @param prefersDark 系统暗色偏好（客户端响应式，SSR 返回 false）
 * @param theme 当前已确认主题 ref（供 Vue 组件读取）
 */
function syncThemeToDom(modeCookie: Ref<OpendesignMode | null>, prefersDark: Ref<boolean>, theme: Ref<OpendesignTheme>): void {
  useHead({
    script: [{ innerHTML: FOUC_SCRIPT, tagPosition: 'head' }],
    htmlAttrs: {
      [DATA_THEME_ATTR]: computed(() => {
        // 客户端首次访问（无 cookie）跟随系统偏好，与内联脚本逻辑一致
        if (import.meta.client && modeCookie.value === null) {
          return `${OPENDESIGN_COMMUNITY}.${prefersDark.value ? MODE_DARK : MODE_LIGHT}`;
        }
        return theme.value;
      }),
    },
  });
}

/**
 * @description OpenDesign 主题 store。
 * @returns theme 完整主题标识；mode 当前明暗模式；isDark 是否深色（writable，可直接 v-model）；hasUserChoice 用户是否显式选择过；setMode 用户设置模式（写 cookie）；setSystemMode 系统检测模式（不写 cookie）
 */
export const useThemeStore = defineStore('opendesign-theme', () => {
  // —— 持久化 cookie：null = 用户未选择（首次访问 / 跟随系统）——
  const modeCookie = useCookie<OpendesignMode | null>(THEME_COOKIE_KEY, THEME_COOKIE_OPTS);

  // —— 系统偏好（客户端响应式，SSR 返回 false）——
  const prefersDark = usePreferredDark();

  // —— 共享状态：SSR 从 cookie 读取，无则默认 light ——
  // 注意：theme ref 仅反映"已确认"的主题，供 Vue 组件读取。
  // 客户端首次访问（无 cookie）时，theme 初始为 light，由 plugin 在
  // app:mounted 后更新为系统偏好值，避免 hydration 不匹配。
  const theme = ref<OpendesignTheme>(`${OPENDESIGN_COMMUNITY}.${modeCookie.value ?? MODE_LIGHT}`);

  // —— Getters / writable computed ——
  const mode = computed<OpendesignMode>(() => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT);
  /** 是否深色；setter 调 setMode 写持久化，可直接用于 v-model（如 OSwitch） */
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val: boolean) => setMode(val ? MODE_DARK : MODE_LIGHT),
  });
  /** 用户是否显式选择过主题（有 cookie = 选过） */
  const hasUserChoice = computed(() => modeCookie.value !== null);

  // —— Actions ——
  /**
   * @description 用户显式设置模式，写入 cookie 持久化
   * @param m 目标模式
   */
  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`;
    modeCookie.value = m;
  }

  /**
   * @description 系统检测到的模式（不写 cookie，用户未选择时跟随系统）
   * @param m 系统检测到的模式
   */
  function setSystemMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`;
  }

  // —— DOM 同步 + 防闪烁（抽取到模块作用域，避免嵌套闭包累加复杂度）——
  syncThemeToDom(modeCookie, prefersDark, theme);

  return { theme, mode, isDark, hasUserChoice, setMode, setSystemMode };
});
