<script setup lang="ts">
/**
 * @description 表单控件宽度 Token 展示。
 * --form-item-main-box-width-* 绑定到 --o-r-grid-*，在各断点自动缩放。
 */
import {ref} from 'vue'
import {OButton, OForm, OFormItem, OInput, OOption, OSelect, OTextarea} from '@opensig/opendesign'

const form = ref({name: '', country: '', bio: '', rangeMin: '', rangeMax: ''})
const countries = [
  {label: '中国', value: 'cn'},
  {label: '美国', value: 'us'},
  {label: '德国', value: 'de'},
]

const vars = [
  {v: '--form-item-main-box-width-standard', d: '标准宽度', f: 'min(var(--o-r-grid-6), 100%)'},
  {v: '--form-item-main-box-width-wide', d: '较宽宽度', f: 'min(var(--o-r-grid-14), 100%)'},
  {v: '--form-item-main-box-width-min', d: '最小宽度', f: 'calc((standard - gap) / 2)'},
]
</script>

<template>
  <p class="section-desc">
      <code>--form-item-main-box-width-*</code> 绑定栅格 Token，缩放窗口观察宽度变化。
    </p>

    <!-- 宽度可视化 -->
    <div class="block">
      <h3 class="block-title">宽度对比</h3>
      <div class="width-visual">
        <div class="width-row">
          <span class="w-label">standard</span>
          <div class="w-bar standard"><span class="w-text">--form-item-main-box-width-standard</span></div>
        </div>
        <div class="width-row">
          <span class="w-label">wide</span>
          <div class="w-bar wide"><span class="w-text">--form-item-main-box-width-wide</span></div>
        </div>
        <div class="width-row">
          <span class="w-label">min</span>
          <div class="w-bar min"><span class="w-text">--form-item-main-box-width-min</span></div>
        </div>
      </div>
    </div>

    <!-- 实际表单 -->
    <div class="block">
      <h3 class="block-title">实际表单</h3>
      <OForm :model="form" layout="h" class="demo-form">
        <OFormItem label="用户名">
          <OInput v-model="form.name" placeholder="标准宽度"/>
        </OFormItem>
        <OFormItem label="国家">
          <OSelect v-model="form.country" placeholder="请选择">
            <OOption v-for="c in countries" :key="c.value" :value="c.value" :label="c.label"/>
          </OSelect>
        </OFormItem>
        <OFormItem label="范围">
          <div class="form-inline">
            <OInput v-model="form.rangeMin" placeholder="最小"/>
            <span class="sep">~</span>
            <OInput v-model="form.rangeMax" placeholder="最大"/>
          </div>
        </OFormItem>
        <OFormItem label="简介">
          <OTextarea v-model="form.bio" placeholder="较宽宽度" :rows="2"/>
        </OFormItem>
        <OFormItem>
          <div class="actions">
            <OButton type="primary">提交</OButton>
            <OButton>重置</OButton>
          </div>
        </OFormItem>
      </OForm>
    </div>
</template>

<style lang="scss" scoped>
.section-desc {
  @include text2;
  color: var(--o-color-info3);
  margin: 0 0 var(--o-gap-5);

  code {
    @include inline-code;
  }
}

.block {
  @include demo-block;
}

.block-title {
  @include demo-block-title;
}

/* 宽度可视化 */
.width-visual {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
}

.width-row {
  display: flex;
  align-items: center;
  gap: var(--o-gap-3);
}

.w-label {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info2);
  width: 70px;
  flex-shrink: 0;
}

.w-bar {
  height: var(--o-control_size-m);
  border-radius: var(--o-radius_control-s);
  display: flex;
  align-items: center;
  justify-content: center;

  &.standard {
    width: var(--form-item-main-box-width-standard);
    background-color: var(--o-color-primary1);
  }

  &.wide {
    width: var(--form-item-main-box-width-wide);
    background-color: var(--o-color-auxiliary5);
  }

  &.min {
    width: var(--form-item-main-box-width-min);
    background-color: var(--o-color-auxiliary6);
  }
}

.w-text {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info1-inverse);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 表单：控件宽度由 global.scss 的 .o-form 全局规则统一管理，组件内不 :deep 覆盖 */
.form-inline {
  display: flex;
  align-items: center;
  gap: var(--form-item-main-box-inline-gap);
  width: var(--form-item-main-box-width-wide);

  @include respond('<=pad_v') {
    flex-wrap: wrap;
  }
}

.sep {
  @include tip1;
  color: var(--o-color-info4);
  flex-shrink: 0;
}

.actions {
  display: flex;
  gap: var(--o-gap-3);
}
</style>
