<template>
  <div ref="tableSelectRef" :style="'width:' + width">
    <el-popover
        v-if="isPopover"
        :visible="popoverVisible"
        :width="popoverWidth"
        placement="bottom-end"
        v-bind="selectConfig.popover"
        @show="handleShow"
    >
      <template #reference>
        <div @click="popoverVisible = !popoverVisible">
          <el-input
              class="reference"
              :readonly="true"
              :model-value="text"
              :placeholder="placeholder"
              @blur="handleClose"
          >
            <template #suffix>
              <el-icon
                  :style="{
                  transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform .5s',
                }"
              >
                <ArrowDown />
              </el-icon>
            </template>
          </el-input>
        </div>
      </template>
      <div ref="popoverContentRef">
        <!-- 表单内容 -->
        <el-form ref="formRef" :model="queryParams" :inline="true">
          <template v-for="item in selectConfig.formItems" :key="item.prop">
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- Input 输入框 -->
              <template v-if="item.type === 'input'">
                <el-input
                    v-model="queryParams[item.prop]"
                    v-bind="item.attrs"
                    @keyup.enter="handleQuery"
                />
              </template>
              <!-- Select 选择器 -->
              <template v-else-if="item.type === 'select'">
                <el-select v-model="queryParams[item.prop]" v-bind="item.attrs">
                  <template v-for="option in item.options" :key="option.value">
                    <el-option :label="option.label" :value="option.value" />
                  </template>
                </el-select>
              </template>
              <!-- TreeSelect 树形选择 -->
              <template v-else-if="item.type === 'tree-select'">
                <el-tree-select v-model="queryParams[item.prop]" v-bind="item.attrs" />
              </template>
              <!-- DatePicker 日期选择器 -->
              <template v-else-if="item.type === 'date-picker'">
                <el-date-picker v-model="queryParams[item.prop]" v-bind="item.attrs" />
              </template>
              <!-- 默认输入框 -->
              <template v-else>
                <el-input
                    v-model="queryParams[item.prop]"
                    v-bind="item.attrs"
                    @keyup.enter="handleQuery"
                />
              </template>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
            <el-button icon="refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
            ref="tableRef"
            v-loading="loading"
            :data="pageData"
            :border="true"
            :max-height="250"
            :row-key="pk"
            :highlight-current-row="true"
            :class="{ radio: !isMultiple }"
            @select="handleSelect"
            @select-all="handleSelectAll"
        >
          <template v-for="col in selectConfig.tableColumns" :key="col.prop">
            <!-- 自定义列 -->
            <template v-if="col.templet === 'custom'">
              <el-table-column v-bind="col">
                <template #default="scope">
                  <slot :name="col.slotName ?? col.prop" :prop="col.prop" v-bind="scope" />
                </template>
              </el-table-column>
            </template>
            <!-- 默认列 -->
            <template v-else>
              <el-table-column v-bind="col" />
            </template>
          </template>
        </el-table>

        <!-- 分页 -->
        <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handlePagination"
        />

        <!-- 底部操作 -->
        <div class="feedback">
          <el-button type="primary" size="small" @click="handleConfirm">
            {{ confirmText }}
          </el-button>
          <el-button size="small" @click="handleClear">清 空</el-button>
          <el-button size="small" @click="handleClose">关 闭</el-button>
        </div>
      </div>
    </el-popover>

    <!-- 如果不需要popover，直接展示表单和列表 -->
    <div v-else>
      <el-form ref="formRef" :model="queryParams" :inline="true">
        <template v-for="item in selectConfig.formItems" :key="item.prop">
          <el-form-item :label="item.label" :prop="item.prop">
            <template v-if="item.type === 'input'">
              <el-input
                  v-model="queryParams[item.prop]"
                  v-bind="item.attrs"
                  @keyup.enter="handleQuery"
              />
            </template>
            <template v-else-if="item.type === 'select'">
              <el-select v-model="queryParams[item.prop]" v-bind="item.attrs">
                <template v-for="option in item.options" :key="option.value">
                  <el-option :label="option.label" :value="option.value" />
                </template>
              </el-select>
            </template>
            <template v-else-if="item.type === 'tree-select'">
              <el-tree-select v-model="queryParams[item.prop]" v-bind="item.attrs" />
            </template>
            <template v-else-if="item.type === 'date-picker'">
              <el-date-picker v-model="queryParams[item.prop]" v-bind="item.attrs" />
            </template>
            <template v-else>
              <el-input
                  v-model="queryParams[item.prop]"
                  v-bind="item.attrs"
                  @keyup.enter="handleQuery"
              />
            </template>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
          ref="tableRef"
          v-loading="loading"
          :data="pageData"
          :border="true"
          :max-height="250"
          :row-key="pk"
          :highlight-current-row="true"
          :class="{ radio: !isMultiple }"
          @select="handleSelect"
          @select-all="handleSelectAll"
      >
        <template v-for="col in selectConfig.tableColumns" :key="col.prop">
          <template v-if="col.templet === 'custom'">
            <el-table-column v-bind="col">
              <template #default="scope">
                <slot :name="col.slotName ?? col.prop" :prop="col.prop" v-bind="scope" />
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-bind="col" />
          </template>
        </template>
      </el-table>

      <!-- 分页 -->
      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

export type IObject = Record<string, any>;

export interface ISelectConfig<T = any> {
  width?: string;
  placeholder?: string;
  popover?: Partial<Omit<PopoverProps, "visible" | "v-model:visible">>;
  indexAction: (_queryParams: T) => Promise<any>;
  pk?: string;
  multiple?: boolean;
  formItems: Array<{
    type?: "input" | "select" | "tree-select" | "date-picker";
    label: string;
    prop: string;
    attrs?: IObject;
    initialValue?: any;
    options?: { label: string; value: any }[];
  }>;
  tableColumns: Array<{
    type?: "default" | "selection" | "index" | "expand";
    label?: string;
    prop?: string;
    width?: string | number;
    [key: string]: any;
  }>;
}

const props = withDefaults(
    defineProps<{
      selectConfig: ISelectConfig;
      text?: string;
      isPopover?: boolean; // 新增属性控制弹出框行为
    }>(),
    {
      text: "",
      isPopover: false,
    }
);

const emit = defineEmits<{
  confirmClick: [selection: any[]];
}>();

const pk = props.selectConfig.pk ?? "id";
const isMultiple = props.selectConfig.multiple === true;
const width = props.selectConfig.width ?? "100%";
const placeholder = props.selectConfig.placeholder ?? "请选择";
const isPopover = props.isPopover;

const popoverVisible = ref(false);
const loading = ref(false);
const total = ref(0);
const pageData = ref<IObject[]>([]);
const pageSize = 10;

const queryParams = reactive<{
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}>({
  pageNum: 1,
  pageSize: pageSize,
});

const popoverWidth = ref(width);
const tableSelectRef = ref();
useResizeObserver(tableSelectRef, (entries) => {
  popoverWidth.value = `${entries[0].contentRect.width}px`;
});

const formRef = ref<FormInstance>();
for (const item of props.selectConfig.formItems) {
  queryParams[item.prop] = item.initialValue ?? "";
}

function handleReset() {
  formRef.value?.resetFields();
  fetchPageData(true);
}

function handleQuery() {
  fetchPageData(true);
}

function fetchPageData(isRestart = false) {
  loading.value = true;
  if (isRestart) {
    queryParams.pageNum = 1;
    queryParams.pageSize = pageSize;
  }
  props.selectConfig
  .indexAction(queryParams)
  .then((data) => {
    total.value = data.total;
    pageData.value = data.list;
  })
  .finally(() => {
    loading.value = false;
  });
}

const tableRef = ref<TableInstance>();
for (const item of props.selectConfig.tableColumns) {
  if (item.type === "selection") {
    item.reserveSelection = true;
    break;
  }
}

const selectedItems = ref<IObject[]>([]);
const confirmText = computed(() => {
  return selectedItems.value.length > 0 ? `已选(${selectedItems.value.length})` : "确 定";
});

function handleSelect(selection: any[], _row: any) {
  if (isMultiple || selection.length === 0) {
    selectedItems.value = selection;
  } else {
    selectedItems.value = [selection[selection.length - 1]];
    tableRef.value?.clearSelection();
    tableRef.value?.toggleRowSelection(selectedItems.value[0], true);
    tableRef.value?.setCurrentRow(selectedItems.value[0]);
  }
}

function handleSelectAll(selection: any[]) {
  if (isMultiple) {
    selectedItems.value = selection;
  }
}

function handlePagination() {
  fetchPageData();
}

const isInit = ref(false);
function handleShow() {
  if (isInit.value === false) {
    isInit.value = true;
    fetchPageData();
  }
}

function handleConfirm() {
  if (selectedItems.value.length === 0) {
    ElMessage.error("请选择数据");
    return;
  }
  popoverVisible.value = false;
  emit("confirmClick", selectedItems.value);
}

function handleClear() {
  tableRef.value?.clearSelection();
  selectedItems.value = [];
}

function handleClose() {
  popoverVisible.value = false;
}
</script>

<style scoped lang="scss">
.feedback {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.radio :deep(.el-table__header th.el-table__cell:nth-child(1) .el-checkbox) {
  visibility: hidden;
}
</style>
