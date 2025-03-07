/** * 上传文件到cos, 拖拽上传 */

<template>
  <div>
    <el-upload
        v-model="imgUrl"
        :accept="props.accept"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        :on-progress="handleProgress"
        :show-file-list="false"
        action=""
        class="upload-demo"
        drag
    >
      <el-icon v-if="!flag" class="el-upload-icon" size="100">
        <upload-filled />
      </el-icon>
      <div v-if="!flag" class="el-upload__text">拖拽或 <em>点击上传</em></div>
      <img v-if="flag" :src="imgUrl" alt="img" class="imgUrl" />
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>

    <el-progress
        :percentage="progressPercent"
        :style="{
        display: showProgress ? 'inline-flex' : 'none',
        width: '100%',
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { UploadProgressEvent, UploadRequestOptions } from "element-plus";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
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
  accept: {
    type: String,
    default: "*",
  },

  uploadFileApi: {
    type: Function,
    required: true
  }


});

const emit = defineEmits(["update:modelValue"]);
const imgUrl = useVModel(props, "modelValue", emit);
const files = ref<File | null>(null);
const flag = ref(false);
const showProgress = ref(false);
const progressPercent = ref(0);

function beforeUpload(file: any) {
  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.error("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }
  const timeStamp = new Date().getTime();
  const fileExtension = file.name.split(".").pop().toLowerCase();
  files.value = new File([file], `${timeStamp}` + "." + fileExtension);
}

/**
 * 自定义上传
 *
 * @param options
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  const { data } = await props.uploadFileApi(options.file);

  const allowedImageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
  ];
  const fileExtension = options.file.name.split(".").pop()?.toLowerCase();
  if (allowedImageExtensions.includes(`.${fileExtension}`)) {
    imgUrl.value = data as any;
    flag.value = true;
  }
}

/**
 * 上传进度
 *
 * @param event
 */
const handleProgress = (event: UploadProgressEvent) => {
  progressPercent.value = event.percent;
};
</script>

<style scoped>
/*:deep(.el-upload-dragger) {
  width: 500px;
  height: 400px;
  padding: 0 !important;
}*/

:deep(.imgUrl) {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>