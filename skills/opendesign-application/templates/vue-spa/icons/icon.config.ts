/**
 * @description gen:icon 配置文件——驱动 @opensig/open-scripts 将 svgs/ 下的 SVG 源文件
 *   按 fill/stroke/color 三类生成 Vue 图标组件，产物输出到 src/icon-components/。
 *   input/output 路径均相对本配置文件所在目录解析。
 */
export default {
  // SVG 源目录，须含 fill/ stroke/ color/ 三个子目录（设计师交付的原始切图）
  input: './svgs',
  // 生成产物目录：每次执行 gen:icon 会先清空重建，已纳入 .gitignore
  output: '../src/icon-components/',
  // SVG 根元素类名：o-svg-icon 对齐全局图标样式约定，app-svg-icon 用于项目级样式覆盖
  componentClass: 'o-svg-icon app-svg-icon',
  // 组件名前缀：生成 AppIconXxx，刻意区别于组件库内置的 OIconXxx，避免命名冲突
  prefix: 'app-',
};
