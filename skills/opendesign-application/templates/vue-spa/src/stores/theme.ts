import { defineStore } from 'pinia';
import { computed, ref, watch, watchEffect, type Ref } from 'vue';
import { usePreferredDark, useStorage } from '@vueuse/core';

/**
 * @description OpenDesign 主题管理 store。
 * 本项目选定 openEuler 社区主题（标识 `e`），仅在该社区内切换 light/dark 模式。
 * 切换社区需同时更换 `main.ts` 中引入的 token CSS 文件。
 *
 * 使用 VueUse usePreferredDark 检测系统暗色偏好，useStorage 持久化用户选择。
 * 首次访问（无 localStorage）跟随系统；用户手动切换后以用户选择为准。
 *
 * 与 Nuxt 版差异：SPA 无 SSR/hydration 问题；
 * 防闪烁内联脚本在 index.html 中（非 useHead 注入）；
 * 使用 useStorage（localStorage + 自定义序列化器，存 raw string）替代 useCookie，
 * watchEffect 替代 useHead。
 */

/** 当前社区标识 */
export const OPENDESIGN_COMMUNITY = 'e' as const;

/** 明暗模式 */
export type OpendesignMode = 'light' | 'dark';

/** 完整主题标识：社区.模式（对应 <html data-o-theme="e.light">） */
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`;

/** localStorage key */
export const THEME_STORAGE_KEY = 'opendesign-mode';

/** <html> 上的主题属性名 */
export const DATA_THEME_ATTR = 'data-o-theme' as const;

/** 浅色模式值（与 OpendesignMode 类型对应，供运行时引用） */
export const MODE_LIGHT = 'light' as const;

/** 深色模式值 */
export const MODE_DARK = 'dark' as const;

/**
 * 自定义序列化器：存 raw string（MODE_LIGHT/MODE_DARK/'null'），不存 JSON，
 * 供 index.html 内联脚本直接 localStorage.getItem 读取。
 */
const storageSerializer = {
  read: (raw: string | null) => (!raw || raw === 'null' ? null : (raw as OpendesignMode)),
  write: (value: OpendesignMode | null) => String(value),
};

/**
 * @description 解析初始主题：有用户选择用用户选择，否则跟随系统暗色偏好
 *
 * 抽取到模块作用域以避免嵌套三元/`??` 累加 `useThemeStore` 的累计圈复杂度。
 *
 * @param storedMode 持久化模式（null = 用户未选择）
 * @param prefersDark 系统暗色偏好
 * @returns 完整主题标识（社区.模式）
 */
function resolveInitialTheme(storedMode: OpendesignMode | null, prefersDark: boolean): OpendesignTheme {
  const mode = storedMode ?? (prefersDark ? MODE_DARK : MODE_LIGHT);
  return `${OPENDESIGN_COMMUNITY}.${mode}`;
}

/**
 * @description 同步主题到 DOM：响应式设置 `<html data-o-theme>` 属性
 *
 * `watchEffect`：theme 变化即同步到 `<html data-o-theme>` 属性
 *
 * 抽取到模块作用域以避免嵌套闭包累加 `useThemeStore` 的累计圈复杂度。
 *
 * @param theme 当前已确认主题 ref（供 Vue 组件读取 + 写入 DOM）
 */
function syncThemeToDom(theme: Ref<OpendesignTheme>): void {
  // —— DOM 同步：将 theme 值写入 <html data-o-theme="..."> ——
  watchEffect(() => {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme.value);
  });
}

/**
 * @description OpenDesign 主题 store。
 * @returns theme 完整主题标识；mode 当前明暗模式；isDark 是否深色（writable，可直接 v-model）；hasUserChoice 用户是否显式选择过；setMode 用户设置模式（写 localStorage）；setSystemMode 系统检测模式（不写 localStorage）
 */
export const useThemeStore = defineStore('opendesign-theme', () => {
  // —— 持久化：null = 用户未选择（首次访问 / 跟随系统）——
  const storedMode = useStorage<OpendesignMode | null>(THEME_STORAGE_KEY, null, localStorage, { serializer: storageSerializer });

  // —— 系统偏好 ——
  const prefersDark = usePreferredDark();

  // —— 共享状态：有 localStorage 用 localStorage，否则跟随系统 ——
  const theme = ref<OpendesignTheme>(resolveInitialTheme(storedMode.value, prefersDark.value));

  // —— Getters / writable computed ——
  const mode = computed<OpendesignMode>(() => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT);
  /** 是否深色；setter 调 setMode 写持久化，可直接用于 v-model（如 OSwitch） */
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val: boolean) => setMode(val ? MODE_DARK : MODE_LIGHT),
  });
  /** 用户是否显式选择过主题（有 localStorage = 选过） */
  const hasUserChoice = computed(() => storedMode.value !== null);

  // —— Actions ——
  /**
   * @description 用户显式设置模式，写入 localStorage 持久化
   */
  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`;
    storedMode.value = m;
  }

  /**
   * @description 系统检测到的模式（不写 localStorage，用户未选择时跟随系统）
   */
  function setSystemMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`;
  }

  // —— DOM 同步（抽取到模块作用域，避免嵌套闭包累加复杂度）——
  syncThemeToDom(theme);

  // —— 跟随系统偏好变化（仅当用户未显式选择时）——
  watch(prefersDark, (systemPrefersDark) => {
    if (storedMode.value === null) {
      setSystemMode(systemPrefersDark ? MODE_DARK : MODE_LIGHT);
    }
  });

  return { theme, mode, isDark, hasUserChoice, setMode, setSystemMode };
});
