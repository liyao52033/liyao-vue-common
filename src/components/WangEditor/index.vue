<template>
  <div class="editor-container">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; width: 100%; overflow-y: auto; text-align: left"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, defineProps, defineEmits, watch, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'default',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  toolbarConfig: {
    type: Object,
    default: () => ({
      excludeKeys: ['fullScreen'],
    }),
  },
  uploadFileApi: Function,
  uploadVideoApi: Function,
})

// 定义 emits
const emit = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emit)

// 增加编辑器状态管理
const isMounted = ref(false)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 富文本内容
const valueHtml = ref(props.modelValue)

// 监听 `modelValue` 变化，更新 `valueHtml`
// 增加挂载状态判断
watch(
  () => props.modelValue, (newVal) => {
  if (isMounted.value && newVal !== valueHtml.value) {
    nextTick(() => {
      valueHtml.value = newVal
    })
  }
})

// 监听 `readOnly` 变化，更新编辑器配置
const editorConfig = computed(() => ({
  placeholder: '请输入内容...',
  autoFocus: false,
  readOnly: props.readOnly,
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        if (props.uploadFileApi) {
          const response = await props.uploadFileApi(file)
          insertFn(response.data)
        }
      },
    },
    uploadVideo: {
      async customUpload(file, insertFn) {
        if (props.uploadVideoApi) {
          const response = await props.uploadVideoApi(file)
          insertFn(response.data)
        }
      },
    },
  },
}))

// 组件销毁时，销毁编辑器实例
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})

// 记录编辑器实例
const handleCreated = (editor) => {
  editorRef.value = editor
  isMounted.value = true
}

// 处理内容变化，更新 `modelValue`
const handleChange = (editor) => {
  modelValue.value = editor.getHtml()
}
</script>

<style scoped>
.editor-container {
  position: relative;
  width: 100%;
  min-width: 30rem;
  overflow: hidden;
}
</style>