> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](data-table.visual.md) · [样式定制](data-table.style.md)

# ODataTable 数据表格 — 代码使用

### 导入方式

```vue
<script setup>
import { ODataTable } from '@opensig/opendesign';
// 按需导入类型
import type {
  DataTableColumnT,
  DataTableSpanMethod,
  DataTableExpandMethod,
  DataTableSortMethod,
  DataTableSortMethodT,
  DataTableConditionUpdatePayload,
  DataTableSortUpdatePayload,
  DataTableSelectionPayload,
  DataTableSelectionChangePayload,
  DataTableLoadChildrenPayload,
  DataTableInstance,
  DataTableRowKeyValue,
} from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type DataTableSizeT = 'medium' | 'small';
type DataTableHeaderStyleT = 'fill' | 'split-line';
type DataTableFixedT = true | 'left' | 'right'; // true 等同 'left'
type TableBorderT = 'all' | 'row' | 'column' | 'frame' | 'row-column' | 'row-frame' | 'column-frame' | 'none';
type DataTableRowKeyValue = string | number;

// 排序方式常量
const DataTableSortMethod = {
  ASC: 1,      // 升序
  DESC: -1,    // 降序
  NA: undefined // 不排序（初始值）
};
type DataTableSortMethodT = 1 | -1 | undefined;

// 单元格渲染方法参数
interface DataTableColumnFormatterOptions {
  row: any;
  column: EffectiveDataTableColumnT;
  cellValue: string | number | unknown;
  rowIndex: number;
  colIndex: number;
}

// 单元格渲染方法
type DataTableColumnFormatter = (options: DataTableColumnFormatterOptions) => Component | VNode | string;

// 合并单元格方法（v1.2.2 新增）
type DataTableSpanMethod = (options: DataTableColumnFormatterOptions) => { colSpan?: number; rowSpan?: number } | void;

// 行展开方法（v1.2.2 新增）
type DataTableExpandMethod = (row: any, rowIndex: number) => Component | VNode | string | false;

// 行数据类型
type TableRowT = {
  key?: string | number;
  hasChildren?: boolean;  // 懒加载标记
  children?: TableRowT[];
} & Record<string, unknown>;
```

---

### Props 表

| 参数名 | 类型 | 必填 | 可选值 | 默认值 | 说明 |
|--------|------|------|--------|--------|------|
| data | `TableRowT[]` | 是 | — | — | 表格行数据数组。每个元素是一个对象，对象的键名对应列配置的 key 字段。支持树形数据结构，行对象可包含 children 子节点数组和 hasChildren 懒加载标记。 |
| columns | `DataTableColumnT[]` | 是 | — | — | 列配置数组。每列通过 key 指定关联数据字段，label 指定表头文本。支持通过 children 嵌套形成多级分组表头。iOS 端不支持多列固定。 |
| size | `DataTableSizeT` | 否 | `'medium'` / `'small'` | `'medium'` | 表格整体尺寸，可选中号或小号。默认中号。 |
| height | `number \| string` | 否 | — | 固定表格高度。设置后表头固定、内容区域滚动。 | 表格高度，设置后表头固定、内容滚动 |
| maxHeight | `number \| string` | 否 | — | 表格最大高度。超出后表头固定、内容区域滚动。默认适应内容高度。 | 最大高度，超出时表头固定滚动 |
| minTableWidth | `number \| string` | 否 | — | 内部 table 元素最小宽度。表格容器宽度不足时出现横向滚动条。 | 内部 table 最小宽度，超出时横向滚动 |
| rowKey | `string \| ((row: TableRowT) => string)` | 否 | — | 行数据的唯一标识字段名，支持传入字符串路径或计算函数。在行选择、行展开等场景中用于标识行。默认使用 "id" 字段。 | 行唯一标识字段名或计算函数 |
| border | `TableBorderT` | 否 | `'all'` / `'row'` / `'column'` / `'frame'` / `'row-column'` / `'row-frame'` / `'column-frame'` / `'none'` | `'row'` | 表格边框样式。支持全边框、仅行线、仅列线、外框、组合等多种模式。默认仅行线。 |
| stripe | `boolean` | 否 | — | `false` | 斑马纹。仅在无纵向合并单元格时生效。默认关闭。 | v1.2.0 |
| headerStyle | `DataTableHeaderStyleT` | 否 | `'fill'` / `'split-line'` | `'fill'` | 表头风格。填充背景或分割线样式。默认填充背景。 | v1.2.2 |
| showHeader | `boolean` | 否 | — | `true` | 是否显示表头行。默认显示。 | v1.2.2 |
| highlightCurrentRow | `boolean` | 否 | — | `false` | 鼠标悬停时是否高亮当前行。默认关闭。 |
| columnResizable | `boolean` | 否 | — | `false` | 是否允许拖拽调整列宽。默认关闭。开启后表头单元格右侧出现拖拽手柄。 |
| selection | `boolean` | 否 | — | `false` | 开启行选择。默认关闭。开启后第一列前出现复选框。 | v1.2.2 |
| disabledProp | `string` | 否 | — | `'disabled'` | 指定行数据中控制行是否禁用选择的字段名。默认使用 "disabled" 字段。 | v1.2.2 |
| checkStrictly | `boolean` | 否 | — | `true` | 树形数据中父子节点选择是否不关联。默认不关联（独立选择）。关闭后选中父节点自动全选子节点，子节点全选后自动选中父节点。 | v1.2.2 |
| defaultEmptyCellText | `string` | 否 | — | `'--'` | 单元格值为空时的占位文案。默认显示 "--"。 |
| emptyLabel | `string` | 否 | — | — | 空数据提示文案 |
| loading | `boolean` | 否 | — | `false` | 显示加载中遮罩。加载时筛选排序图标禁用。 |
| loadingLabel | `string` | 否 | — | — | 加载中提示文案 |
| spanMethod | `DataTableSpanMethod` | 否 | — | `() => undefined` | 合并单元格的计算方法。接收行数据、列配置、单元格值、行列索引，返回 colSpan 和 rowSpan。已被合并的单元格不会再次参与合并。 | v1.2.2 |
| expandMethod | `DataTableExpandMethod` | 否 | — | — | 行展开渲染方法。接收行数据和行索引，返回展开内容（字符串、VNode、组件或函数式组件），返回 false 表示该行不可展开。 | v1.2.2 |
| v-model:conditions | `Record<string, unknown>` | 否 | — | `reactive({})` | 筛选排序条件对象 |
| v-model:selected-keys | `DataTableRowKeyValue[]` | 否 | — | `reactive([])` | 已选中行的 rowKey 数组 |
| v-model:expanded-row-keys | `DataTableRowKeyValue[]` | 否 | — | `reactive([])` | 已展开行的 rowKey 数组 |

---

### Events 表

| 事件名 | 参数 | 说明 |
|--------|------|------|
| condition-update | `payload?: DataTableConditionUpdatePayload` | 筛选条件更新时触发（排序更新时 payload 为 undefined） |
| sort-update | `payload: DataTableSortUpdatePayload` | 列排序更新时触发 |
| update:selected-keys | `payload: DataTableRowKeyValue[]` | 选中行变更双向绑定 |
| selection | `payload: DataTableSelectionPayload` | 单行复选框点击时触发 |
| selection-change | `payload: DataTableSelectionChangePayload` | 已选择数据变更时触发（含全选操作） |
| selection-all | `allSelected: boolean` | 全选/取消全选复选框点击时触发 |
| load-children | `payload: DataTableLoadChildrenPayload` | 懒加载子节点时触发 |
| column-resize | `column: EffectiveDataTableColumnT, width: number` | 列宽调整时触发 |
| update:conditions | `value: Record<string, unknown>` | conditions 双向绑定更新 |
| update:expanded-row-keys | `value: DataTableRowKeyValue[]` | expanded-row-keys 双向绑定更新 |

#### 事件载荷类型

```typescript
// condition-update 载荷
interface DataTableConditionUpdatePayload {
  key: string;           // 对应 column 的 key
  newVal: (string | number | boolean)[];  // 选中的值数组
}

// sort-update 载荷
interface DataTableSortUpdatePayload {
  key: string;           // 对应 column 的 sortKey
  newVal?: DataTableSortMethodT;  // 1(升序) / -1(降序) / undefined(不排序)
}

// selection 载荷
interface DataTableSelectionPayload {
  key: DataTableRowKeyValue;  // 行的 rowKey 值
  selected: boolean;          // 是否选中
}

// selection-change 载荷
interface DataTableSelectionChangePayload {
  prev: DataTableRowKeyValue[];  // 变更前选中的 rowKey 数组
  cur: DataTableRowKeyValue[];   // 变更后选中的 rowKey 数组
}

// load-children 载荷
interface DataTableLoadChildrenPayload {
  row: TableRowT;
  rowIndex: number;
  rowKey: DataTableRowKeyValue;
  resolve: () => void;   // 加载成功时调用
  reject: (reason?: any) => void;  // 加载失败时调用，展开自动回退
}
```

---

### Slots 表

| 插槽名 | Slot Props | 说明 |
|--------|-----------|------|
| header | `{ columns: EffectiveDataTableColumnT[], groupColumns: EffectiveDataTableColumnT[][] }` | 替换整个 thead 内容 |
| loading | — | 自定义加载中显示 |
| empty | — | 自定义空状态显示 |
| expand | `{ row: TableRowT, rowIndex: number }` | 行展开内容，使用后所有行均可展开 |
| `th_{columnKey}` | `{ column: EffectiveDataTableColumnT }` | 自定义指定列的表头单元格内容（动态插槽） |
| `td_{columnKey}` | `{ column: EffectiveDataTableColumnT, row: TableRowT, cellValue: any, index: number }` | 自定义指定列的数据单元格内容（动态插槽）。⚠️ **不推荐**，优先使用 `column.formatter`；仅当模板 `v-model` 语法必须使用时才选此方式 |

---

### 插槽层级关系

```
header（替换整个 thead）
  └── th_{columnKey}（替换单个表头单元格内容）

expand（替换行展开内容）
  └── 与 expandMethod 二选一；slot 优先级更高且所有行可展开

loading（替换加载中遮罩内容）
empty（替换空状态内容）

td_{columnKey}（替换单个数据单元格内容）
  ⚠️ 优先使用 column.formatter（推荐），td_ 插槽与 formatter 二选一
  └── 以 formatter 为主；仅需模板 v-model 语法时才用 td_ 插槽
```

---

### 典型使用场景与调用模板

**场景 1：基础数据表格（推荐起点）**
适用于：纯数据展示，无筛选排序需求
```vue
<script setup>
import { ref } from 'vue';
import { ODataTable } from '@opensig/opendesign';
import type { DataTableColumnT } from '@opensig/opendesign';

const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name' },
  { label: '年龄', key: 'age' },
  { label: '地址', key: 'address' },
];
const data = ref([
  { id: 1, name: '张三', age: 28, address: '北京' },
  { id: 2, name: '李四', age: 32, address: '上海' },
]);
</script>
<template>
  <!-- 无需任何额外配置，直接传入 columns 和 data -->
  <ODataTable :columns="columns" :data="data" />
</template>
```

> ✅ 这是最常见的用法。如无特殊需求（如筛选、排序、行选择等），保持简洁即可。

**场景 2：固定高度 + 固定列 + 列宽拖拽**
适用于：大量数据、宽表格
```vue
<script setup>
import type { DataTableColumnT } from '@opensig/opendesign';

const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name', fixed: 'left', minWidth: '15%' },
  { label: '薪资', key: 'salary' },
  { label: '地址', key: 'address' },
  { label: '邮箱', key: 'email', minWidth: 200 },
  { label: '操作', key: 'action', fixed: 'right' },
];
</script>
<template>
  <ODataTable :columns="columns" :data="data" :height="400" border="all" column-resizable />
</template>
```

**场景 3：筛选 + 排序（仅当需要时添加）**
适用于：设计/需求明确要求筛选和排序的表格。⚠️ **该功能不会默认启用，需在列配置中显式添加 `filter` / `sortKey` 属性**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ODataTable, DataTableSortMethod } from '@opensig/opendesign';
import type { DataTableColumnT, DataTableSortMethodT, DataTableColumnFilterOption } from '@opensig/opendesign';

// 示例：薪资范围筛选选项
const salaryOptions: (DataTableColumnFilterOption & { filter: (row: any) => boolean })[] = [
  { label: '< 6000', value: '<6000', filter: (row) => row.salary < 6000 },
  { label: '6000-8000', value: '6000-8000', filter: (row) => row.salary >= 6000 && row.salary <= 8000 },
  { label: '> 8000', value: '>8000', filter: (row) => row.salary > 8000 },
];

const columns = computed<DataTableColumnT[]>(() => [
  {
    label: '姓名', key: 'name',
    // 🔑 关键：添加 filter 对象来启用该列的筛选功能
    filter: {
      multiple: true,
      showInput: true,
      optionTitle: '选择姓名',
      optionsFn: ({ emptyOption }) => [
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        emptyOption,
      ],
    },
  },
  {
    label: '年龄', key: 'age',
    // 🔑 关键：添加 sortKey 来启用该列的排序功能
    sortKey: 'ageSort',
  },
  {
    label: '薪资', key: 'salary',
    filter: {
      optionTitle: '选择薪资范围',
      optionsFn: () => salaryOptions,
    },
  },
]);

// conditions 结构：key 对应列 key（筛选）或 sortKey（排序）
const conditions = ref<{
  name: string[];           // 筛选值数组
  salary: string[];
  ageSort?: DataTableSortMethodT;  // 排序方向：1(升) / -1(降) / undefined(无)
}>({
  name: [],
  salary: [],
  ageSort: DataTableSortMethod.NA,
});

const allData = [
  { id: 1, name: '张三', age: 28, salary: 5500 },
  { id: 2, name: '李四', age: 35, salary: 7000 },
  { id: 3, name: '王五', age: 42, salary: 9500 },
];

const data = ref([...allData]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // 后端场景：data.value = await api.list({ ...conditions.value, page, size })
    // 前端场景模拟：
    let res = [...allData];

    // 按筛选条件过滤
    if (conditions.value.name?.length) {
      res = res.filter((row) => conditions.value.name.includes(row.name));
    }
    if (conditions.value.salary?.length) {
      res = res.filter((row) =>
        conditions.value.salary.some((val) => {
          const opt = salaryOptions.find((o) => o.value === val);
          return opt?.filter(row);
        })
      );
    }

    // 按排序条件排序
    if (conditions.value.ageSort === DataTableSortMethod.ASC) {
      res.sort((a, b) => a.age - b.age);
    } else if (conditions.value.ageSort === DataTableSortMethod.DESC) {
      res.sort((a, b) => b.age - a.age);
    }

    data.value = res;
  } finally {
    loading.value = false;
  }
};

fetchData();
</script>
<template>
  <ODataTable
    :columns="columns"
    :data="data"
    v-model:conditions="conditions"
    :loading="loading"
    @condition-update="fetchData"
  />
</template>
```

> ⚠️ **重点**：
> - 默认情况下表格没有筛选和排序
> - 仅当**需求明确要求**筛选或排序时，才在列配置中添加 `filter` / `sortKey` 属性
> - 必须处理 `@condition-update` 事件，否则筛选排序无效

**场景 4：行选择**
适用于：批量操作
```vue
<script setup>
import { ref } from 'vue';
import type { DataTableColumnT, DataTableInstance } from '@opensig/opendesign';

const dataTableRef = ref<DataTableInstance>();
const selectedKeys = ref<(string | number)[]>([]);
const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name' },
  { label: '年龄', key: 'age' },
];
const data = ref([
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32, disabled: true },
]);

// 编程式全选/清空
const handleSelectAll = () => dataTableRef.value?.selectAll();
const handleClearAll = () => dataTableRef.value?.clearAll();
</script>
<template>
  <ODataTable ref="dataTableRef" v-model:selected-keys="selectedKeys" :columns="columns" :data="data" selection />
</template>
```

**场景 5：行展开（插槽方式）**
适用于：展示行详情
```vue
<template>
  <ODataTable :columns="columns" :data="data" v-model:expanded-row-keys="expandedRowKeys" row-key="key">
    <template #expand="{ row }">
      <p>详细地址：{{ row.address }}</p>
      <p>邮箱：{{ row.email }}</p>
    </template>
  </ODataTable>
</template>
```

**场景 6：行展开（expandMethod 方式，按行控制）**
适用于：部分行可展开，支持 JSX/TSX
```vue
<script setup lang="tsx">
import type { DataTableExpandMethod } from '@opensig/opendesign';

const expandMethod: DataTableExpandMethod = (row, rowIndex) => {
  if (rowIndex < 2) return false; // 前两行不可展开
  return () => <div>展开内容：{row.name}</div>;
};
</script>
<template>
  <ODataTable :columns="columns" :data="data" :expand-method="expandMethod" row-key="key" />
</template>
```

**场景 7：树形数据 + 懒加载**
适用于：组织架构、文件树
```vue
<script setup>
import { ref } from 'vue';
import type { DataTableLoadChildrenPayload } from '@opensig/opendesign';

const data = ref([
  { key: '1', name: '部门A', children: [
    { key: '1-1', name: '小组1' },
  ]},
  { key: '2', name: '部门B', hasChildren: true }, // 懒加载
]);

const handleLoadChildren = ({ row, rowKey, resolve, reject }: DataTableLoadChildrenPayload) => {
  fetchChildren(rowKey).then((children) => {
    row.children = children;
    resolve();
  }).catch(() => reject());
};
</script>
<template>
  <ODataTable :columns="columns" :data="data" row-key="key" @load-children="handleLoadChildren" />
</template>
```

**场景 8：嵌套分组表头**
适用于：复杂表头分组
```vue
<script setup>
import type { DataTableColumnT } from '@opensig/opendesign';

const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name' },
  {
    label: '详细信息', key: 'detail',
    children: [
      { label: '薪资', key: 'salary' },
      { label: '地址', key: 'address' },
      { label: '邮箱', key: 'email', minWidth: 200 },
    ],
  },
];
</script>
<template>
  <ODataTable :columns="columns" :data="data" />
</template>
```

**场景 9：单元格合并**
适用于：报表、统计表格
```vue
<script setup>
import type { DataTableSpanMethod } from '@opensig/opendesign';

const spanMethod: DataTableSpanMethod = ({ colIndex, rowIndex }) => {
  if (colIndex === 0 && rowIndex === 0) {
    return { colSpan: 1, rowSpan: 2 }; // 第一列前两行合并
  }
};
</script>
<template>
  <ODataTable :columns="columns" :data="data" :span-method="spanMethod" />
</template>
```

**场景 10：竖向表头列（垂直表头）**
适用于：属性-值对照表
```vue
<script setup>
import type { DataTableColumnT } from '@opensig/opendesign';

const columns: DataTableColumnT[] = [
  { label: '属性', key: 'name', width: 200, asHeader: true, fixed: true },
  { label: '值1', key: 'val1' },
  { label: '值2', key: 'val2' },
];
</script>
<template>
  <ODataTable :columns="columns" :data="data" :show-header="false" />
</template>
```

**场景 11：分页 + 筛选排序联动**
适用于：后端分页与筛选排序联合使用
```vue
<script setup>
import { ref, watch } from 'vue';
import { DataTableSortMethod } from '@opensig/opendesign';

const conditions = ref({ name: [], ageSort: DataTableSortMethod.NA });
const currentPage = ref(1);
const pageSize = ref(10);
const data = ref([]);
const total = ref(0);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  const res = await api.list({ ...conditions.value, page: currentPage.value, size: pageSize.value });
  data.value = res.list;
  total.value = res.total;
  loading.value = false;
};

// 筛选/排序变更时回到第一页
const handleConditionUpdate = () => {
  currentPage.value = 1;
  fetchData();
};

watch([currentPage, pageSize], fetchData);
fetchData();
</script>
<template>
  <ODataTable
    :columns="columns"
    :data="data"
    v-model:conditions="conditions"
    :loading="loading"
    @condition-update="handleConditionUpdate"
  />
  <OPagination v-model:page="currentPage" v-model:page-size="pageSize" :total="total" />
</template>
```

**场景 12：可编辑单元格（formatter + JSX，推荐）**
适用于：行内输入框、行内选择器等需要直接编辑单元格数据的场景
```vue
<script setup lang="tsx">
import { ref } from 'vue';
import { ODataTable, OInput, OLink } from '@opensig/opendesign';
import type { DataTableColumnT } from '@opensig/opendesign';

interface EditableRow {
  id: number;
  name: string;
  count: number;
  remark: string;
}

const data = ref<EditableRow[]>([
  { id: 1, name: '张三', count: 100, remark: '备注A' },
  { id: 2, name: '李四', count: 200, remark: '备注B' },
]);

const handleDelete = (row: EditableRow) => {
  data.value = data.value.filter((r) => r.id !== row.id);
};

const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name', width: 160 },
  {
    label: '数量', key: 'count', width: 120,
    // ✅ 推荐：formatter 返回 JSX 函数式组件，每次渲染时重新读取 row.count
    // 不要直接返回 JSX 元素，那会导致 VNode 只在初始化时生成一次，失去响应性
    formatter: ({ row }) => () => (
      <OInput
        v-model={(row as EditableRow).count}
        size="small"
        style={{ width: '90px' }}
      />
    ),
  },
  {
    label: '备注', key: 'remark', width: 160,
    formatter: ({ row }) => () => (
      <OInput
        v-model={(row as EditableRow).remark}
        size="small"
        style={{ width: '120px' }}
      />
    ),
  },
  {
    label: '操作', key: 'action', width: 80,
    formatter: ({ row }) => () => (
      <OLink color="danger" onClick={() => handleDelete(row as EditableRow)}>
        删除
      </OLink>
    ),
  },
];
</script>
<template>
  <ODataTable :columns="columns" :data="data" border="row-frame" />
</template>
```

> **核心要点**：`formatter` 必须返回**JSX 函数式组件**（`() => <Component ...>`）而非直接返回 JSX 元素。函数式组件会在每次父组件重渲染时重新调用，从而读取 `row` 中的最新值，实现响应式更新。

**场景 13：操作列（推荐使用 OLink）**
适用于：表格操作列中的编辑、删除、详情等文字操作。**推荐使用 OLink 组件**而非原生 span 或 OButton，主要操作用 `color="primary"`，危险操作用 `color="danger"`。
```vue
<script setup lang="tsx">
import { ref } from 'vue';
import { ODataTable, OLink } from '@opensig/opendesign';
import type { DataTableColumnT } from '@opensig/opendesign';

interface RowData {
  id: number;
  name: string;
}

const data = ref<RowData[]>([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]);

const handleEdit = (row: RowData) => console.log('编辑', row.id);
const handleDelete = (row: RowData) => {
  data.value = data.value.filter((r) => r.id !== row.id);
};

const columns: DataTableColumnT[] = [
  { label: '姓名', key: 'name' },
  {
    label: '操作', key: 'action', width: 120,
    formatter: ({ row }) => () => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <OLink color="primary" onClick={() => handleEdit(row as RowData)}>编辑</OLink>
        <OLink color="danger" onClick={() => handleDelete(row as RowData)}>删除</OLink>
      </div>
    ),
  },
];
</script>
<template>
  <ODataTable :columns="columns" :data="data" />
</template>
```

> **操作列组件选择规则**：
> - 表格操作列中的**文字操作**（编辑、删除、详情等）→ 使用 **OLink**（主要操作 `color="primary"`，危险操作 `color="danger"`）
> - 表格操作列中的**图标操作**（单独图标按钮）→ 使用 **OButton**（icon-only 模式）
> - 表格工具栏的**批量操作按钮**（新增、导出等）→ 使用 **OButton**（位于表格外部）



| 场景 | 推荐配置 | 说明 | 何时需要 |
|------|---------|------|---------|
| **基础表格** | `:columns` + `:data` | 最简用法，足以应对大多数展示需求 | 总是 ✅ |
| 固定表头滚动 | `:height="400"` | 超出高度表头固定、内容滚动 | 数据较多或容器限高 |
| 列固定 | column `fixed: 'left'/'right'` | 左右固定列，横向滚动时列不动 | 列数多、容器不够宽 |
| 列宽调整 | `column-resizable` | 用户拖拽调整列宽 | 用户需手动调整布局 |
| 全边框 | `border="all"` | 单元格全边框 | 需要清晰的单元格分割 |
| 斑马纹 | `stripe` | 奇偶行背景色交替 | 行数多、易读性要求高 |
| **行选择** | `selection` + `v-model:selected-keys` | 复选框多选（⚠️ 需显式启用） | 需要多选操作 |
| 树形选择关联 | `selection` + `:check-strictly="false"` | 父子节点选择联动 | 树形数据 + 多选 + 需要联动 |
| **筛选排序** | column `filter/sortKey` + `v-model:conditions` + `@condition-update` | ⚠️ **需显式在列配置中添加** | **仅当需求明确要求** |
| **行展开** | `#expand` 或 `:expand-method` + `v-model:expanded-row-keys` | 点击行展开详情（⚠️ 需显式启用） | 需显示行详情 |
| 树形懒加载 | `row.hasChildren` + `@load-children` | 异步加载子节点 | 树形数据 + 数据量大 |
| 分割线表头 | `header-style="split-line"` | 表头仅有分割线、无背景色 | 较少使用，特殊设计需求 |
| 竖向表头 | column `asHeader` + `:show-header="false"` | 第一列作表头、后续列为值 | 属性-值对照表 |
| 加载中 | `loading` + `loading-label` | 加载遮罩 + 提示文案 | 异步加载数据中 |
| 空数据 | `empty-label` 或 `#empty` | 数据为空时的提示 | 需提示空数据状态 |
| 单元格合并 | `:span-method` | 合并单元格 | 报表、统计表格 |
| 表头溢出提示 | 列配置 `showHeaderOverflowToolTip` | 表头文字超长省略 + 悬停气泡（默认 1 行） | 表头文本较长 |
| 表体溢出提示 | 列配置 `showOverflowToolTip` | 表体文字超长省略 + 悬停气泡 | 单元格文本较长 |
| 空值占位 | `default-empty-cell-text="N/A"` | 自定义空值文案（默认 "--"） | 需特殊展示空值 |
| **操作列（文字）** | column `formatter` 返回 **OLink** | 主要操作 `color="primary"`，危险操作 `color="danger"` | 表格行操作（编辑、删除等） |
| **操作列（图标）** | column `formatter` 返回 **OButton**（icon-only） | 纯图标按钮 | 工具栏图标操作 |

> 💡 **速查指引**：
> - ✅ **最常见**：基础表格 = `:columns` + `:data`
> - 🔑 **可选增强**：需要时才添加行选择、行展开、筛选排序等
> - ⚠️ **需显式启用**：行选择、行展开、筛选排序都需通过 prop/列配置明确启用，不会默认出现

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 修复 | `TableRowT` 类型改为交叉类型 `& Record<string, unknown>`，不再强制索引签名 |
| v1.2.2 | 新增 | 行选择(`selection`)、行展开(`expandMethod`)、列筛选(`filter`)、列排序(`sortKey`)、表头合并(`customColSpan`)、树形数据、溢出气泡(`showOverflowToolTip`/`showHeaderOverflowToolTip`)、竖向表头(`asHeader`)、表头描述(`description`)、表头风格(`headerStyle`)、隐藏表头(`showHeader`)、行禁用(`disabledProp`)、父子不关联(`checkStrictly`) |
| v1.2.0 | 新增 | 新增 `stripe` prop，支持斑马纹显示 |
| v1.1.0 | 破坏性变更 | CSS 类名变更：`tr.last` → `tr.o-row-last`，`td.last` → `td.o-cell-last` |

---

### DataTableColumnT 列配置

| 属性 | 类型 | 必填 | 说明 | 版本 |
|------|------|------|------|------|
| key | `string` | 是 | 列数据字段名，对应行数据对象的 key，支持路径如 `'a.b'` | |
| label | `string \| Component \| VNode` | 否 | 表头文本，支持字符串、VNode、组件或函数式组件 | |
| description | `string \| Component \| VNode` | 否 | 表头描述气泡文案 | v1.2.2 |
| formatter | `DataTableColumnFormatter` | 否 | 单元格自定义渲染方法 | |
| fixed | `true \| 'left' \| 'right'` | 否 | 列固定方向，`true` 等同 `'left'`。iOS 不支持多列固定 | |
| asHeader | `boolean` | 否 | 是否作为竖向表头列，默认 false | v1.2.2 |
| width | `number \| string` | 否 | 列宽，支持像素数字或百分比字符串 | |
| minWidth | `number \| string` | 否 | 最小列宽 | |
| maxWidth | `number \| string` | 否 | 最大列宽 | |
| showHeaderOverflowToolTip | `boolean \| number` | 否 | 表头溢出时显示气泡，传数字设定最大行数，默认 1 | v1.2.2 |
| showOverflowToolTip | `boolean \| number` | 否 | 表体溢出时显示气泡，传数字设定最大行数 | v1.2.2 |
| sortKey | `string` | 否 | 排序条件字段 key，仅支持单列排序 | v1.2.2 |
| filter | `DataTableColumnFilterT` | 否 | 筛选配置 | v1.2.2 |
| customColSpan | `number` | 否 | 表头单元格自定义 colspan，仅支持同级合并 | v1.2.2 |
| children | `DataTableColumnT[]` | 否 | 嵌套子列配置，形成分组表头 | |

---

### DataTableColumnFilterT 筛选配置（v1.2.2 新增）

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| optionsFn | `(option: { column, emptyOption }) => Option[] \| Promise<Option[]>` | 是 | 获取筛选选项的方法，支持异步 |
| optionTitle | `string` | 否 | 移动端弹窗标题 |
| multiple | `boolean` | 否 | 是否支持多选，默认 true |
| showInput | `boolean \| ((count: number) => boolean)` | 否 | 是否显示搜索框，默认选项超过 8 个时显示 |

---

### DataTableColumnFilterOption 筛选选项

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| label | `any` | 是 | 选项标签文本 |
| value | `any` | 是 | 选项值 |

---

### Expose 方法表

| 方法名 | 类型 | 说明 | 版本 |
|--------|------|------|------|
| selectAll | `() => void` | 全选（不含禁用行） | v1.2.2 |
| clearAll | `() => void` | 清空全部选择 | v1.2.2 |
| expandAll | `() => void` | 展开所有行 | v1.2.2 |
| foldAll | `() => void` | 收起所有行 | v1.2.2 |
| getRowKey | `(row: TableRowT, rowIndex: number) => DataTableRowKeyValue` | 计算行的 rowKey | |
| dataColumnMap | `Map<string, EffectiveDataTableColumnT>` | 列配置的 key-value 映射 | |
| dataColumns | `Ref<EffectiveDataTableColumnT[]>` | 扁平化的所有叶子列数组 | |
| groupColumns | `Ref<EffectiveDataTableColumnT[][]>` | 按层级分组的列二维数组 | |
