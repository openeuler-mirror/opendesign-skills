<!--
  示例 · 带筛选的列表页（合规直出代码）
  演示：OInput/OSelect/OOption 筛选 + OTable(columns{label,key}+#td_ 插槽) + OPagination + 前端筛选分页。
  落地时按目标工程接入真实 i18n 与数据 API。
-->
<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

import { OInput, OSelect, OOption, OButton, OTag, OLink, OTable, OPagination } from '@opensig/opendesign';

// i18n —— 落地时替换为目标工程方案
const t = (key: string) => key;

interface RowT {
  id: string;
  name: string;
  domain: 'kernel' | 'virt' | 'compiler';
  status: 'active' | 'incubating';
  maintainers: number;
}

// 模拟数据（落地时从 API 拉取）
const RAW_ROWS: RowT[] = [
  { id: 'kernel', name: 'Kernel', domain: 'kernel', status: 'active', maintainers: 21 },
  { id: 'virt', name: 'Virt', domain: 'virt', status: 'active', maintainers: 12 },
  { id: 'compiler', name: 'Compiler', domain: 'compiler', status: 'active', maintainers: 9 },
  { id: 'a-tune', name: 'A-Tune', domain: 'kernel', status: 'incubating', maintainers: 5 },
  { id: 'stratovirt', name: 'StratoVirt', domain: 'virt', status: 'active', maintainers: 8 },
  { id: 'bishengjdk', name: 'BiSheng JDK', domain: 'compiler', status: 'active', maintainers: 7 },
];

const columns = computed(() => [
  { label: t('demo.colName'), key: 'name' },
  { label: t('demo.colDomain'), key: 'domain' },
  { label: t('demo.colStatus'), key: 'status' },
  { label: t('demo.colMaintainers'), key: 'maintainers' },
  { label: t('demo.colAction'), key: 'action' },
]);

const domainOptions = computed(() => [
  { label: t('demo.optionAll'), value: '' },
  { label: t('demo.domainKernel'), value: 'kernel' },
  { label: t('demo.domainVirt'), value: 'virt' },
  { label: t('demo.domainCompiler'), value: 'compiler' },
]);

const statusOptions = computed(() => [
  { label: t('demo.optionAll'), value: '' },
  { label: t('demo.statusActive'), value: 'active' },
  { label: t('demo.statusIncubating'), value: 'incubating' },
]);

const domainLabel = (d: string) => t(`demo.domain${d.charAt(0).toUpperCase()}${d.slice(1)}`);
const statusLabel = (s: string) => t(`demo.status${s.charAt(0).toUpperCase()}${s.slice(1)}`);

const filters = reactive({ keyword: '', domain: '', status: '' });
const applied = reactive({ keyword: '', domain: '', status: '' });

const page = ref(1);
const pageSize = ref(5);
const PAGE_SIZES = [5, 10, 20];

const filteredRows = computed(() =>
  RAW_ROWS.filter((row) => {
    const matchKeyword = row.name.toLowerCase().includes(applied.keyword.trim().toLowerCase());
    const matchDomain = !applied.domain || row.domain === applied.domain;
    const matchStatus = !applied.status || row.status === applied.status;
    return matchKeyword && matchDomain && matchStatus;
  })
);

const total = computed(() => filteredRows.value.length);

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const handleQuery = () => {
  applied.keyword = filters.keyword;
  applied.domain = filters.domain;
  applied.status = filters.status;
  page.value = 1;
};

const handleReset = () => {
  filters.keyword = '';
  filters.domain = '';
  filters.status = '';
  handleQuery();
};

const onPageChange = (val: { page: number; pageSize: number }) => {
  if (val.pageSize !== pageSize.value) {
    page.value = 1;
  } else {
    page.value = val.page;
  }
  pageSize.value = val.pageSize;
};
</script>

<template>
  <section class="list-page">
    <h1 class="list-page__title">{{ t('demo.listTitle') }}</h1>

    <form class="list-page__filter" @submit.prevent="handleQuery">
      <OInput
        v-model="filters.keyword"
        class="list-page__field"
        size="large"
        clearable
        :placeholder="t('demo.searchPlaceholder')"
      />
      <OSelect v-model="filters.domain" class="list-page__field" :placeholder="t('demo.filterDomain')">
        <OOption v-for="opt in domainOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </OSelect>
      <OSelect v-model="filters.status" class="list-page__field" :placeholder="t('demo.filterStatus')">
        <OOption v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </OSelect>
      <div class="list-page__actions">
        <OButton variant="solid" color="primary" @click="handleQuery">{{ t('demo.query') }}</OButton>
        <OButton variant="outline" @click="handleReset">{{ t('demo.reset') }}</OButton>
      </div>
    </form>

    <OTable :columns="columns" :data="pagedRows">
      <template #td_domain="{ row }">{{ domainLabel(row.domain) }}</template>
      <template #td_status="{ row }">
        <OTag :color="row.status === 'active' ? 'success' : 'warning'">{{ statusLabel(row.status) }}</OTag>
      </template>
      <template #td_action="{ row }">
        <OLink color="primary" href="javascript:void(0)" :data-id="row.id">{{ t('demo.detail') }}</OLink>
      </template>
    </OTable>

    <p v-if="!total" class="list-page__empty">{{ t('demo.empty') }}</p>

    <div v-if="total > PAGE_SIZES[0]" class="list-page__pagination">
      <OPagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-sizes="PAGE_SIZES"
        :show-more="false"
        @change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.list-page {
  &__title {
    margin: 0 0 var(--o-r-gap-6);
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-h1);
    line-height: var(--o-r-line_height-h1);
    font-weight: 600;
  }

  &__filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--o-r-gap-4);
    margin-bottom: var(--o-r-gap-6);
    padding: var(--o-r-gap-5);
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-m);
    box-shadow: var(--o-shadow-1);
  }

  &__field {
    width: 240px;

    @media (max-width: 600px) {
      width: 100%;
    }
  }

  &__actions {
    display: flex;
    gap: var(--o-gap-3);
  }

  &__empty {
    padding: var(--o-r-gap-7) 0;
    color: var(--o-color-info3);
    text-align: center;
    font-size: var(--o-r-font_size-text1);
    line-height: var(--o-r-line_height-text1);
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--o-r-gap-5);
  }
}
</style>
