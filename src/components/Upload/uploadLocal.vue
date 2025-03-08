/** * 上传文件到本地, 按钮上传(适用于上传授权文件, excel表格解析) */
<template>
  <div>
    <el-upload
        :accept="props.acceptType"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        :limit="1"
        :show-file-list="false"
        action="#"
        class="ml-3"
        drag
    >
      <template #trigger>
        <slot name="trigger">
          <el-button type="primary">
            <slot>导入</slot>
          </el-button>
        </slot>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'UploadLocal',
});

import { UploadRawFile, UploadRequestOptions } from "element-plus";

const props = defineProps({
  /**
   * 导入文件接口
   */
  importFile: {
    type: Function,
    required: true,
  },

  /**
   * 允许的文件类型
   */
  allowedExtensions: {
    type: Array,
    default: () => [],
  },

  /**
   * 单个文件上传大小限制(单位MB)
   */
  maxFileSize: {
    type: Number,
    default: 10,
  },
  /**
   * 上传文件类型
   */
  acceptType: {
    type: String,
    default: "*",
  },
});

function beforeUpload(file: UploadRawFile) {
  const allowed = props.allowedExtensions; // 允许的文件类型
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !allowed.includes(`.${ fileExtension }`)) {
    ElMessage.error("只能上传xlsx, xls ,csv格式的excel文件");
    return false;
  }

  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }

  return true;
}

async function handleUpload(options: UploadRequestOptions): Promise<any> {
  const files = options.file;
  props.importFile(files);
}
</script>

<style lang="scss"></style>