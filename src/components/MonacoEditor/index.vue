<script setup lang="ts">

import Editor from "@/components/MonacoEditor/Editor.vue";
import { editorProps } from './monacoEditorType'

const props = defineProps(editorProps)

defineOptions({
  name: 'MonacoEditor',
})

const content = ref('')
const language = ref('')

const options = [
  {
    value: 'html',
    label: 'html',
  },
  {
    value: 'javascript',
    label: 'javascript',
  },
  {
    value: 'typescript',
    label: 'typescript',
  },
  {
    value: 'vue',
    label: 'vue',
  },
  {
    value: 'java',
    label: 'java',
  },
  {
    value: 'python',
    label: 'python',
  },
  {
    value: 'go',
    label: 'go',
  },
  {
    value: 'php',
    label: 'php',
  },
  {
    value: 'sql',
    label: 'sql',
  },
  {
    value: 'xml',
    label: 'xml',
  },
  {
    value: 'css',
    label: 'css',
  },
  {
    value: 'json',
    label: 'json',
  },
  {
    value: 'markdown',
    label: 'markdown',
  },
  {
    value: 'yaml',
    label: 'yaml',
  },
  {
    value: 'c',
    label: 'c',
  },
  {
    value: 'cpp',
    label: 'c++',
  },
  {
    value: 'dockerfile',
    label: 'dockerfile',
  },


]
</script>

<!-- 在Vue的模板中，动态绑定的值如果是字符串，必须用单引号包裹-->
<template>
 <div>
   <el-select
       v-model="language"
       clearable
       filterable
       allow-create
       default-first-option
       :reserve-keyword="false"
       placeholder="请选择语言"
       size="large"
       style="width: 90%"
   >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
   <Editor
       v-model="content"
       :language="language"
       :width= props.width
       :height= props.height
       :theme="props.theme"
       :options="props.options"
       style="margin-top: 10px;text-align: left"
   ></Editor>

 </div>
</template>

