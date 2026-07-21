<!--
 * @description AppSection 楼层组件 —— 页面非左右布局场景下的通用楼层容器。
 *   统一沉淀楼层级结构（header / body / footer）与排版规范（section 宽度、内外间距、标题/副标题层级、底部链接），
 *   消费 OpenDesign 设计令牌（--o-r-grid-section-width / --o-r-gap-* / --o-color-info*）与 font mixin（display3 / text1），
 *   避免各页面重复实现等价楼层骨架。当页面采用左右布局时不应使用本组件，应由具体布局组件自行承载楼层结构。
 * @see AGENTS.md「业务组件 / AppSection 楼层组件」章节
 -->
<script setup lang="ts">
import { isArray, OIcon, OIconChevronRight, OLink } from '@opensig/opendesign';

const props = withDefaults(
  defineProps<{
    /** 区块标题，支持单行（字符串）或多行（字符串数组，逐行渲染 h2） */
    title?: string | string[];
    /** 区块副标题，单行字符串，居中展示于标题下方 */
    subtitle?: string;
    /** 是否全宽展示主体内容（取消 section-body 的宽度限制与内边距） */
    full?: boolean;
    /** 头部是否居中对齐，false 时切换为左对齐（is-left 修饰类） */
    headerJustifyCenter?: boolean;
    /** 底部链接文案，配合 footerHref 组成 OLink 外链 */
    footer?: string;
    /** 底部链接跳转地址，footer 选项存在时生效 */
    footerHref?: string;
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    full: false,
    headerJustifyCenter: true,
    footer: undefined,
    footerHref: undefined,
  },
);

const slots = defineSlots<{
  /** 整体内容兜底插槽，覆盖 header / body / footer 默认结构 */
  main?: () => any;
  /** 区块头部插槽，不传时回退到 title / subtitle 默认渲染 */
  header?: () => any;
  /** 标题插槽，配合 title prop 使用 */
  title?: () => any;
  /** 副标题插槽，配合 subtitle prop 使用 */
  subtitle?: () => any;
  /** 区块主体内容插槽 */
  default?: () => any;
  /** 区块底部插槽，不传时回退到 footer + footerHref 组合的 OLink 渲染 */
  footer?: () => any;
}>();
</script>

<template>
  <div class="app-section" :class="{ 'is-full': props.full }">
    <div class="section-wrapper">
      <!-- 整体内容兜底插槽：传入 main 时完全覆盖默认的 header / body / footer 结构 -->
      <slot name="main">
        <!-- header：头部区域，当传入 header 插槽或 title / subtitle prop 时渲染 -->
        <div v-if="slots.header || props.title || props.subtitle" :class="{ 'section-header': true, 'is-left': !props.headerJustifyCenter }">
          <slot name="header">
            <!-- 多行标题：title 为数组时逐行渲染 h2 -->
            <template v-if="isArray(props.title)">
              <h2 v-for="item in props.title" :key="item" class="section-title">{{ item }}</h2>
            </template>
            <!-- 单行标题：支持 title 插槽覆盖 prop 文本，仅在传入 title 插槽或 title prop 时渲染 -->
            <h2 v-else-if="slots.title || props.title" class="section-title">
              <slot name="title">{{ props.title }}</slot>
            </h2>
            <!-- 副标题：支持 subtitle 插槽覆盖 prop 文本；用 div 而非 p，避免 slot 传入块级元素（如 p）时产生非法嵌套 -->
            <div v-if="slots.subtitle || props.subtitle" class="section-subtitle">
              <slot name="subtitle">{{ props.subtitle }}</slot>
            </div>
          </slot>
        </div>

        <!-- body：区块主体内容，仅当传入默认插槽时渲染 -->
        <div v-if="slots.default" class="section-body"><slot /></div>

        <!-- footer：底部区域，当传入 footer 插槽或 footer prop 时渲染，默认回退为 OLink 外链 -->
        <div v-if="slots.footer || props.footer" class="section-footer">
          <slot name="footer">
            <OLink :href="props.footerHref" target="_blank">
              {{ props.footer }}
              <template #suffix>
                <OIcon class="footer-icon"><OIconChevronRight /></OIcon>
              </template>
            </OLink>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-section.is-full .section-body {
  width: 100%;
  padding: 0;
}

.section-wrapper {
  margin: var(--o-r-gap-7) auto var(--o-r-gap-10);
  width: var(--o-r-grid-section-width);
  max-width: calc(100vw - var(--o-r-grid-section-padding));
}

.section-header {
  &.is-left {
    .section-title,
    .section-subtitle {
      justify-content: start;
    }
  }
}

.section-title {
  display: flex;
  justify-content: center;
  color: var(--o-color-info1);
  font-weight: var(--o-font_weight-semibold);
  text-align: center;
  @include display3;
}

.section-subtitle {
  display: flex;
  justify-content: center;
  color: var(--o-color-info2);
  margin-top: var(--o-r-gap-4);
  @include text1;
}

.section-body {
  margin-top: var(--o-r-gap-7);
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: var(--o-r-gap-6);
  @include text1;
}
</style>
