/**
 * @description OpenDesign 主题管理 Pinia store。
 * 本项目选定 openEuler 社区主题（标识 `e`），仅在该社区内切换 light/dark 模式。
 * 切换社区需同时更换 `nuxt.config.ts` 中引入的 token CSS 文件与下方 `OPENDESIGN_COMMUNITY` 常量。
 *
 * 默认浅色模式（light）
 */

/** 当前社区标识 */
export const OPENDESIGN_COMMUNITY = 'e' as const;

/** 明暗模式 */
export type OpendesignMode = 'light' | 'dark';

/** 完整主题标识：社区.模式（对应 `<html data-o-theme="e.light">`） */
export type OpendesignTheme = `${typeof OPENDESIGN_COMMUNITY}.${OpendesignMode}`;

/** `<html>` 上的主题属性名 */
export const DATA_THEME_ATTR = 'data-o-theme' as const;

/** 浅色模式值（与 `OpendesignMode` 类型对应，供运行时引用） */
export const MODE_LIGHT = 'light' as const;

/** 深色模式值 */
export const MODE_DARK = 'dark' as const;

/**
 * @description OpenDesign 主题 store。
 * @returns theme 完整主题标识；mode 当前明暗模式；isDark 是否深色（writable，可直接 v-model）；setMode 用户设置模式
 */
export const useThemeStore = defineStore('opendesign-theme', () => {
  // —— 默认浅色模式 ——
  const theme = ref<OpendesignTheme>(`${OPENDESIGN_COMMUNITY}.${MODE_LIGHT}`);

  // —— Getters / writable computed ——
  const mode = computed<OpendesignMode>(() => (theme.value.split('.')[1] as OpendesignMode) ?? MODE_LIGHT);
  /** 是否深色；setter 调 setMode，可直接用于 v-model（如 OSwitch） */
  const isDark = computed({
    get: () => mode.value === MODE_DARK,
    set: (val: boolean) => setMode(val ? MODE_DARK : MODE_LIGHT),
  });

  // —— Actions ——
  /**
   * @description 设置明暗模式
   * @param m 目标模式
   */
  function setMode(m: OpendesignMode) {
    theme.value = `${OPENDESIGN_COMMUNITY}.${m}`;
  }

  // —— DOM 同步 ——
  useHead({
    htmlAttrs: {
      [DATA_THEME_ATTR]: theme,
    },
  });

  return { theme, mode, isDark, setMode };
});
