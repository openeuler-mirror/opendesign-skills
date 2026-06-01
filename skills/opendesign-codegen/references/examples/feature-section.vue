<!--
  示例 · 楼层 + 卡片栅格（合规直出代码）
  演示：真实 OpenDesign 组件 + --o-/--o-r- token + 响应式 + i18n 占位。
  落地时按目标工程接入真实 i18n、（可选）用 <OIcon><IconXxx/></OIcon> 替换图标占位块。
-->
<script setup lang="ts">
import { computed } from 'vue';

import { OButton, OCard, OTag, OLink } from '@opensig/opendesign';

// i18n —— 落地时替换为目标工程方案（如 useLocale 的 t）
const t = (key: string) => key;

interface FeatureT {
  id: string;
  title: string;
  desc: string;
  tag: string;
}

const features = computed<FeatureT[]>(() => [
  { id: 'visual', title: t('demo.visualTitle'), desc: t('demo.visualDesc'), tag: t('demo.tagToken') },
  { id: 'responsive', title: t('demo.responsiveTitle'), desc: t('demo.responsiveDesc'), tag: t('demo.tagGrid') },
  { id: 'landable', title: t('demo.landableTitle'), desc: t('demo.landableDesc'), tag: t('demo.tagEng') },
]);
</script>

<template>
  <section class="feature-section">
    <header class="feature-section__hero">
      <span class="feature-section__eyebrow">{{ t('demo.eyebrow') }}</span>
      <h1 class="feature-section__title">{{ t('demo.title') }}</h1>
      <p class="feature-section__subtitle">{{ t('demo.subtitle') }}</p>
      <div class="feature-section__actions">
        <OButton variant="solid" color="primary">{{ t('demo.getStarted') }}</OButton>
        <OButton variant="outline">{{ t('demo.viewDocs') }}</OButton>
      </div>
    </header>

    <div class="feature-section__cards">
      <OCard v-for="item in features" :key="item.id" class="feature-card">
        <span class="feature-card__icon" aria-hidden="true"></span>
        <h3 class="feature-card__title">{{ item.title }}</h3>
        <p class="feature-card__text">{{ item.desc }}</p>
        <div class="feature-card__footer">
          <OTag color="primary">{{ item.tag }}</OTag>
          <OLink href="javascript:void(0)" color="primary">{{ t('demo.more') }}</OLink>
        </div>
      </OCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.feature-section {
  &__hero {
    margin-bottom: var(--o-r-gap-9);
    text-align: center;
  }

  &__eyebrow {
    display: inline-flex;
    margin-bottom: var(--o-r-gap-4);
    padding: var(--o-gap-2) var(--o-gap-3);
    border-radius: var(--o-radius-s);
    background-color: var(--o-color-primary1-light);
    color: var(--o-color-primary1);
    font-size: var(--o-r-font_size-tip1);
    line-height: var(--o-r-line_height-tip1);
  }

  &__title {
    margin: 0 0 var(--o-r-gap-4);
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-display3);
    line-height: var(--o-r-line_height-display3);
    font-weight: 600;
  }

  &__subtitle {
    max-width: 640px;
    margin: 0 auto;
    color: var(--o-color-info2);
    font-size: var(--o-r-font_size-text2);
    line-height: var(--o-r-line_height-text2);
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

    @media (max-width: 840px) {
      flex-direction: column;
    }
  }
}

.feature-card {
  flex: 1;

  &__icon {
    display: block;
    width: var(--o-control_size-l);
    height: var(--o-control_size-l);
    margin-bottom: var(--o-r-gap-4);
    border-radius: var(--o-radius-s);
    background-color: var(--o-color-primary1-light);
    // 实际项目放 <OIcon><IconXxx /></OIcon>，此处用色块占位
  }

  &__title {
    margin: 0 0 var(--o-r-gap-3);
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-h3);
    line-height: var(--o-r-line_height-h3);
  }

  &__text {
    margin: 0 0 var(--o-r-gap-4);
    color: var(--o-color-info2);
    font-size: var(--o-r-font_size-text1);
    line-height: var(--o-r-line_height-text1);
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: var(--o-gap-3);
  }
}
</style>
