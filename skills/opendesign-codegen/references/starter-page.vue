<!--
  ============================================================================
  OpenDesign 代码直出 · 合规 Vue SFC 起手模板
  ============================================================================
  复制本文件作为新页面/组件的起点。AI 直接在此基础上填充真实业务结构，
  产出的就是符合工程规范、可进生产的 Vue 3 + OpenDesign 代码。

  ✅ 必须保持：
     - 用真实 @opensig/opendesign 组件（OButton/OCard/OTable…），不用原生替代
     - 样式只用 var(--o-*) / var(--o-r-*) token，零硬编码颜色/字号/间距
     - <script setup lang="ts">，props 用泛型 defineProps<T>()
     - BEM 类名，<style scoped>，嵌套 ≤ 3 层
     - 文案走 i18n（下方用 t('demo.x') 占位，按目标工程的 i18n 方案接入）

  ⚠️ 社区差异（按目标工程的 rules/ 调整）：
     - 路径别名（如 ~@/）、i18n 具体写法、是否有排版 mixin（@include h3）
     - 不确定时用通用写法：响应式字号用 var(--o-r-font_size-*) + var(--o-r-line_height-*)
  ============================================================================
-->
<script setup lang="ts">
import { computed } from 'vue';

// OpenDesign 组件（按需增减）
import { OButton, OCard, OTag, OLink } from '@opensig/opendesign';

// i18n —— 按目标工程的方案替换（这里给通用占位）
// import { useLocale } from '~@/composables/useLocale';
// const { t } = useLocale();
const t = (key: string) => key; // ← 占位，落地时删除并接入真实 i18n

interface CardItemT {
  id: string;
  title: string;
  desc: string;
}

const cards = computed<CardItemT[]>(() => [
  { id: 'a', title: t('demo.cardATitle'), desc: t('demo.cardADesc') },
  { id: 'b', title: t('demo.cardBTitle'), desc: t('demo.cardBDesc') },
  { id: 'c', title: t('demo.cardCTitle'), desc: t('demo.cardCDesc') },
]);
</script>

<template>
  <section class="starter">
    <header class="starter__hero">
      <h1 class="starter__title">{{ t('demo.title') }}</h1>
      <p class="starter__subtitle">{{ t('demo.subtitle') }}</p>
      <div class="starter__actions">
        <OButton variant="solid" color="primary">{{ t('demo.primary') }}</OButton>
        <OButton variant="outline">{{ t('demo.secondary') }}</OButton>
      </div>
    </header>

    <div class="starter__cards">
      <OCard v-for="item in cards" :key="item.id" class="starter__card">
        <h3 class="starter__card-title">{{ item.title }}</h3>
        <p class="starter__card-text">{{ item.desc }}</p>
        <OTag color="primary">{{ t('demo.tag') }}</OTag>
        <OLink href="javascript:void(0)" color="primary">{{ t('demo.more') }}</OLink>
      </OCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.starter {
  &__hero {
    margin-bottom: var(--o-r-gap-9);
    text-align: center;
  }

  &__title {
    margin: 0 0 var(--o-r-gap-4);
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-h1);
    line-height: var(--o-r-line_height-h1);
    font-weight: 600;
  }

  &__subtitle {
    max-width: 640px;
    margin: 0 auto;
    color: var(--o-color-info2);
    font-size: var(--o-r-font_size-text1);
    line-height: var(--o-r-line_height-text1);
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: var(--o-r-gap-4);
    margin-top: var(--o-r-gap-6);
  }

  &__cards {
    display: flex;
    gap: var(--o-r-grid-column-gutter);

    // 平板及以下竖排（确需断点时；目标工程若有 respond-to mixin 可替换）
    @media (max-width: 840px) {
      flex-direction: column;
    }
  }

  &__card {
    flex: 1;
  }

  &__card-title {
    margin: 0 0 var(--o-r-gap-3);
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-h3);
    line-height: var(--o-r-line_height-h3);
  }

  &__card-text {
    margin: 0 0 var(--o-r-gap-4);
    color: var(--o-color-info2);
    font-size: var(--o-r-font_size-text1);
    line-height: var(--o-r-line_height-text1);
  }
}
</style>
